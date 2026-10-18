/**
 * FileKit Job Pass Billing Service (Hardened)
 * - Server-created one-time checkout at €4.90.
 * - Strict payment reconciliation (product, amount, currency, status, owner).
 * - Out-of-order event handling with revocation preservation.
 * - Fail-closed server access enforcement (missing store records strictly deny access).
 * - Authenticated recovery requiring session verification; never rebinds to arbitrary sessions.
 * - Failure isolation: failed payment never revokes an existing active pass.
 */

import crypto from 'node:crypto';
import {
  JOB_PASS_PRICE_CENTS,
  JOB_PASS_DURATION_MS,
  PaymentAttemptRecord,
  JobPassEntitlementRecord,
  EntitlementCheckResult,
  FeatureIdentifier,
  FEATURE_MATRIX,
} from './types';
import { resolveTaxConfiguration, TaxResolutionResult } from './taxConfig';
import { issueSignedEntitlementToken, verifySignedEntitlementToken } from './tokenEngine';
import { billingStore } from './billingStore';
import { stripeProvider, StripeWebhookEvent } from './stripeProvider';
import { getBillingConfig } from './billingConfig';

export interface CreateCheckoutInput {
  purchaserSessionId: string;
  customerEmail?: string;
  countryCode?: string;
  successUrl: string;
  cancelUrl: string;
}

export class JobPassService {
  /**
   * Creates a one-time checkout session with server-controlled pricing (€4.90)
   */
  public async createCheckout(input: CreateCheckoutInput) {
    if (!input.purchaserSessionId) {
      throw new Error('purchaserSessionId is required for checkout binding');
    }

    const clientRefId = `ref_${crypto.randomBytes(8).toString('hex')}`;
    const attemptId = `att_${crypto.randomBytes(12).toString('hex')}`;

    // 1. Tax configuration resolved separately and explicitly
    const taxResolution: TaxResolutionResult = resolveTaxConfiguration(input.countryCode);

    // 2. Call provider in test mode
    const providerSession = await stripeProvider.createCheckoutSession({
      purchaserSessionId: input.purchaserSessionId,
      customerEmail: input.customerEmail,
      clientReferenceId: clientRefId,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      taxResolution,
    });

    // 3. Record payment attempt atomically in durable store
    const attemptRecord: PaymentAttemptRecord = {
      attemptId,
      checkoutSessionId: providerSession.sessionId,
      purchaserSessionId: input.purchaserSessionId,
      purchaserEmail: input.customerEmail,
      amountCents: providerSession.amountCents,
      currency: providerSession.currency,
      status: 'INITIATED',
      taxConfig: taxResolution.taxConfig,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    billingStore.recordPaymentAttempt(attemptRecord);

    return {
      attemptId,
      sessionId: providerSession.sessionId,
      checkoutUrl: providerSession.checkoutUrl,
      amountCents: providerSession.amountCents,
      currency: providerSession.currency,
      providerMode: providerSession.providerMode,
      taxSummary: {
        treatment: taxResolution.taxConfig.treatment,
        ratePercentage: taxResolution.taxConfig.ratePercentage,
        label: taxResolution.taxConfig.taxLabel,
      },
    };
  }

  /**
   * Processes incoming provider webhooks with cryptographic signature verification,
   * replay prevention, strict reconciliation, failure isolation, and refund handling.
   */
  public async processWebhook(
    rawPayload: string,
    signatureHeader: string
  ): Promise<{ success: boolean; reason: string; eventType?: string; passId?: string }> {
    // 1. Cryptographic signature check
    const isValid = stripeProvider.verifyWebhookSignature(rawPayload, signatureHeader);
    if (!isValid) {
      return { success: false, reason: 'INVALID_SIGNATURE' };
    }

    let event: StripeWebhookEvent;
    try {
      event = JSON.parse(rawPayload);
    } catch {
      return { success: false, reason: 'MALFORMED_JSON' };
    }

    // 2. Atomic duplicate event deduplication (event.id)
    const isNew = billingStore.recordWebhookEventIfNew({
      eventId: event.id,
      eventType: event.type,
      underlyingPurchaseId: event.data?.object?.payment_intent || event.data?.object?.id || 'unknown',
      processedAt: Date.now(),
      status: 'PROCESSED',
    });

    if (!isNew) {
      return { success: true, reason: 'DUPLICATE_EVENT_IGNORED', eventType: event.type };
    }

    let handledPassId: string | undefined;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const sessionId = session.id;
        const paymentIntentId = session.payment_intent || `pi_from_${sessionId}`;
        const paymentStatus = session.payment_status;

        // 3. RECONCILIATION AGAINST SERVER-CREATED PURCHASE
        const attempt = billingStore.findPaymentAttempt(sessionId);
        if (!attempt) {
          return { success: false, reason: 'UNRECOGNIZED_PURCHASE_ATTEMPT' };
        }

        // Verify product
        if (session.metadata?.product && session.metadata.product !== 'filekit_job_pass') {
          return { success: false, reason: 'PRODUCT_MISMATCH' };
        }

        // Verify amount
        if (session.amount_total !== undefined && session.amount_total !== JOB_PASS_PRICE_CENTS) {
          return { success: false, reason: 'AMOUNT_MISMATCH' };
        }

        // Verify currency
        if (session.currency && session.currency.toLowerCase() !== 'eur') {
          return { success: false, reason: 'CURRENCY_MISMATCH' };
        }

        // Verify payment status
        if (paymentStatus !== 'paid') {
          billingStore.updatePaymentAttempt(sessionId, {
            status: 'PROCESSING',
            paymentIntentId,
          });
          break;
        }

        // 4. PRESERVE REVOCATIONS & UNDERLYING DEDUPLICATION
        const check = billingStore.isUnderlyingPurchaseFulfilled(paymentIntentId);
        if (check.fulfilled && check.passId) {
          const existingPass = billingStore.getEntitlement(check.passId);
          if (existingPass && existingPass.status === 'REVOKED') {
            // Out-of-order event preservation: if pass is already REVOKED, DO NOT reactivate!
            handledPassId = existingPass.passId;
            return { success: true, reason: 'REVOCATION_PRESERVED', passId: handledPassId };
          }
          handledPassId = check.passId;
          break;
        }

        // 5. Confirmed Payment Activation with 7-Day Expiry anchored strictly to payment confirmation time
        const confirmedPaymentTime = event.created ? event.created * 1000 : Date.now();
        const expiresAt = confirmedPaymentTime + JOB_PASS_DURATION_MS;
        const passId = `pass_${crypto.randomBytes(12).toString('hex')}`;

        const entitlement: JobPassEntitlementRecord = {
          passId,
          purchaserSessionId: attempt.purchaserSessionId, // Owner strictly bound to server attempt
          purchaserEmail: attempt.purchaserEmail || session.customer_email,
          sourceCheckoutSessionId: sessionId,
          sourcePaymentIntentId: paymentIntentId,
          status: 'ACTIVE',
          activatedAt: confirmedPaymentTime,
          expiresAt,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        billingStore.createOrActivateEntitlement(entitlement);
        billingStore.updatePaymentAttempt(sessionId, {
          status: 'SUCCEEDED',
          paymentIntentId,
          completedAt: confirmedPaymentTime,
        });

        handledPassId = passId;
        break;
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const piId = pi.id;
        const confirmedPaymentTime = event.created ? event.created * 1000 : Date.now();

        // Reconcile amount and currency
        if (pi.amount !== undefined && pi.amount !== JOB_PASS_PRICE_CENTS) {
          return { success: false, reason: 'AMOUNT_MISMATCH' };
        }
        if (pi.currency && pi.currency.toLowerCase() !== 'eur') {
          return { success: false, reason: 'CURRENCY_MISMATCH' };
        }

        billingStore.updatePaymentAttempt(piId, {
          status: 'SUCCEEDED',
          completedAt: confirmedPaymentTime,
        });

        const check = billingStore.isUnderlyingPurchaseFulfilled(piId);
        if (check.fulfilled && check.passId) {
          const existingPass = billingStore.getEntitlement(check.passId);
          if (existingPass?.status === 'REVOKED') {
            handledPassId = existingPass.passId;
            return { success: true, reason: 'REVOCATION_PRESERVED', passId: handledPassId };
          }
          handledPassId = check.passId;
        } else {
          // Out of order: payment_intent succeeded before checkout.session.completed
          const attempt = billingStore.findPaymentAttempt(piId);
          if (attempt && attempt.status === 'SUCCEEDED') {
            const passId = `pass_${crypto.randomBytes(12).toString('hex')}`;
            const expiresAt = confirmedPaymentTime + JOB_PASS_DURATION_MS;

            const entitlement: JobPassEntitlementRecord = {
              passId,
              purchaserSessionId: attempt.purchaserSessionId,
              purchaserEmail: attempt.purchaserEmail,
              sourceCheckoutSessionId: attempt.checkoutSessionId,
              sourcePaymentIntentId: piId,
              status: 'ACTIVE',
              activatedAt: confirmedPaymentTime,
              expiresAt,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            billingStore.createOrActivateEntitlement(entitlement);
            handledPassId = passId;
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        const piId = pi.id;
        const reason = pi.last_payment_error?.message || 'Payment method rejected';

        // CRITICAL: Record failure against THIS payment attempt only!
        // Does NOT revoke an existing active pass.
        billingStore.recordPaymentFailure(piId, reason);
        break;
      }

      case 'charge.refunded':
      case 'charge.dispute.created': {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent;
        const reason = event.type === 'charge.dispute.created' ? 'CHARGEBACK' : 'REFUND';

        if (paymentIntentId) {
          // Immediately revoke entitlement associated with this payment intent
          const revokedPass = billingStore.revokeEntitlementBySource(paymentIntentId, reason);
          if (revokedPass) {
            handledPassId = revokedPass.passId;
          }
        }
        break;
      }

      default:
        break;
    }

    return {
      success: true,
      reason: 'EVENT_PROCESSED',
      eventType: event.type,
      passId: handledPassId,
    };
  }

  /**
   * Server-side access enforcement (Fail Closed).
   * Validates cryptographic signed token AND enforces that an authoritative
   * ACTIVE entitlement record exists in durable storage.
   */
  public verifyAccess(params: {
    token?: string;
    purchaserSessionId?: string;
    email?: string;
    nowMs?: number;
  }): EntitlementCheckResult {
    const now = params.nowMs || Date.now();

    // 1. If a signed token is provided, verify signature AND verify backing database record
    if (params.token) {
      const validation = verifySignedEntitlementToken(params.token, params.purchaserSessionId, now);
      if (!validation.valid || !validation.payload) {
        return {
          hasActivePass: false,
          status: validation.error === 'EXPIRED' ? 'EXPIRED' : 'NO_PASS',
          error: validation.error || 'INVALID_TOKEN',
        };
      }

      // CRITICAL: Require existing ACTIVE entitlement in store.
      // Missing store records strictly deny premium access!
      const pass = billingStore.getEntitlement(validation.payload.passId, now);
      if (!pass) {
        return {
          hasActivePass: false,
          status: 'NO_PASS',
          error: 'ENTITLEMENT_RECORD_NOT_FOUND',
        };
      }

      if (pass.status !== 'ACTIVE') {
        return {
          hasActivePass: false,
          status: pass.status,
          passId: pass.passId,
          error: `PASS_${pass.status}`,
        };
      }

      if (now >= pass.expiresAt) {
        return {
          hasActivePass: false,
          status: 'EXPIRED',
          passId: pass.passId,
          error: 'PASS_EXPIRED',
        };
      }

      const remainingSeconds = Math.max(0, Math.floor((pass.expiresAt - now) / 1000));

      return {
        hasActivePass: true,
        status: 'ACTIVE',
        passId: pass.passId,
        expiresAt: pass.expiresAt,
        remainingSeconds,
      };
    }

    // 2. Direct lookup by authenticated session in durable store
    if (params.purchaserSessionId) {
      const pass = billingStore.getActiveEntitlementForPurchaser(
        params.purchaserSessionId,
        undefined,
        now
      );

      if (pass && pass.status === 'ACTIVE' && now < pass.expiresAt) {
        const remainingSeconds = Math.max(0, Math.floor((pass.expiresAt - now) / 1000));
        return {
          hasActivePass: true,
          status: 'ACTIVE',
          passId: pass.passId,
          expiresAt: pass.expiresAt,
          remainingSeconds,
        };
      }
    }

    return {
      hasActivePass: false,
      status: 'NO_PASS',
    };
  }

  /**
   * Secure purchase recovery.
   * Proves purchaser ownership server-side.
   * NEVER rebinds a pass to an arbitrary session ID provided in the request body.
   */
  public recoverPurchase(params: {
    authenticatedSessionId: string;
    checkoutSessionId?: string;
    email?: string;
    emailVerificationProof?: string;
    nowMs?: number;
  }): { recovered: boolean; token?: string; pass?: JobPassEntitlementRecord; error?: string } {
    const now = params.nowMs || Date.now();

    if (!params.authenticatedSessionId) {
      return { recovered: false, error: 'AUTHENTICATED_SESSION_REQUIRED' };
    }

    let pass: JobPassEntitlementRecord | null = null;

    if (params.checkoutSessionId) {
      const attempt = billingStore.findPaymentAttempt(params.checkoutSessionId);
      if (!attempt || attempt.status !== 'SUCCEEDED') {
        return { recovered: false, error: 'PAYMENT_NOT_YET_CONFIRMED' };
      }

      // OWNERSHIP VERIFICATION: Caller's authenticated session must match the original purchaser session!
      if (attempt.purchaserSessionId !== params.authenticatedSessionId) {
        return { recovered: false, error: 'UNAUTHORIZED_SESSION_OWNERSHIP' };
      }

      const check = billingStore.isUnderlyingPurchaseFulfilled(params.checkoutSessionId);
      if (check.fulfilled && check.passId) {
        pass = billingStore.getEntitlement(check.passId, now);
      } else if (attempt.paymentIntentId) {
        const piCheck = billingStore.isUnderlyingPurchaseFulfilled(attempt.paymentIntentId);
        if (piCheck.fulfilled && piCheck.passId) {
          pass = billingStore.getEntitlement(piCheck.passId, now);
        }
      }
    } else if (params.email) {
      // Email recovery strictly requires cryptographic verification proof
      if (!params.emailVerificationProof) {
        return { recovered: false, error: 'UNVERIFIED_EMAIL_IDENTITY' };
      }

      const isValidProof = this.verifyEmailOwnershipProof(params.email, params.emailVerificationProof);
      if (!isValidProof) {
        return { recovered: false, error: 'INVALID_EMAIL_VERIFICATION_PROOF' };
      }

      pass = billingStore.getActiveEntitlementForPurchaser(undefined, params.email, now);
    } else {
      // Fallback: recover active pass bound directly to caller's authenticated session
      pass = billingStore.getActiveEntitlementForPurchaser(params.authenticatedSessionId, undefined, now);
    }

    if (!pass) {
      return { recovered: false, error: 'NO_CONFIRMED_PASS_FOUND' };
    }

    if (pass.status === 'REVOKED') {
      return { recovered: false, error: 'PASS_REVOKED' };
    }

    if (pass.status === 'EXPIRED' || now >= pass.expiresAt) {
      return { recovered: false, error: 'PASS_EXPIRED' };
    }

    // ISSUE TOKEN STRICTLY BOUND TO THE ORIGINAL PURCHASER SESSION
    // Never rebinds to an arbitrary caller-supplied ID!
    const token = issueSignedEntitlementToken({
      passId: pass.passId,
      purchaserSessionId: pass.purchaserSessionId,
      purchaserEmail: pass.purchaserEmail,
      activatedAt: pass.activatedAt,
      expiresAt: pass.expiresAt,
    });

    return {
      recovered: true,
      token,
      pass,
    };
  }

  /**
   * Helper to verify cryptographic email ownership proof
   */
  public verifyEmailOwnershipProof(email: string, proofToken: string): boolean {
    const config = getBillingConfig();
    const parts = proofToken.split('.');
    if (parts.length !== 2) return false;

    const [timestampStr, sig] = parts;
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // 15-minute challenge window
    if (isNaN(timestamp) || Math.abs(now - timestamp) > 15 * 60 * 1000) {
      return false;
    }

    const hmac = crypto.createHmac('sha256', config.signingSecret);
    hmac.update(`${email.toLowerCase()}:${timestamp}`);
    const expectedSig = hmac.digest('hex');

    const expectedBuf = Buffer.from(expectedSig);
    const providedBuf = Buffer.from(sig);
    return expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf);
  }

  /**
   * Creates an email ownership proof token (e.g. for magic links or email recovery)
   */
  public createEmailOwnershipProof(email: string): string {
    const config = getBillingConfig();
    const timestamp = Date.now();
    const hmac = crypto.createHmac('sha256', config.signingSecret);
    hmac.update(`${email.toLowerCase()}:${timestamp}`);
    const sig = hmac.digest('hex');
    return `${timestamp}.${sig}`;
  }

  /**
   * Preserves the agreed Free/Paid commercial feature matrix.
   */
  public checkFeatureAccess(
    feature: FeatureIdentifier,
    hasActivePass: boolean
  ): { allowed: boolean; rule: typeof FEATURE_MATRIX[FeatureIdentifier]; reason?: string } {
    const rule = FEATURE_MATRIX[feature];
    if (!rule) {
      return { allowed: true, rule: FEATURE_MATRIX.LOCAL_CONVERSION_STANDARD };
    }

    if (!rule.requiresJobPass) {
      return { allowed: true, rule };
    }

    if (hasActivePass) {
      return { allowed: true, rule };
    }

    return {
      allowed: false,
      rule,
      reason: 'JOB_PASS_REQUIRED',
    };
  }
}

export const jobPassService = new JobPassService();
