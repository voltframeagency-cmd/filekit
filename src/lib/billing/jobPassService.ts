/**
 * FileKit Job Pass Billing Service
 * Core business logic enforcing:
 * - Server-created one-time checkout at €4.90.
 * - Verified payment before access granting (success URL alone never grants access).
 * - Seven-day expiry strictly anchored to confirmed payment time.
 * - Idempotency across duplicate events and identical underlying purchases.
 * - Failure isolation: failed payment never revokes an existing active pass.
 * - Real-time revocation on refunds/chargebacks.
 * - Tab-closed / interrupted redirect purchase recovery.
 * - Preservation of the agreed free/paid feature matrix.
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
      taxSummary: {
        treatment: taxResolution.taxConfig.treatment,
        ratePercentage: taxResolution.taxConfig.ratePercentage,
        label: taxResolution.taxConfig.taxLabel,
      },
    };
  }

  /**
   * Processes incoming provider webhooks with cryptographic signature verification,
   * replay prevention, underlying purchase deduplication, failure isolation, and refund handling.
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

    // 2. Duplicate Event Deduplication (event.id)
    if (billingStore.isWebhookEventProcessed(event.id)) {
      return { success: true, reason: 'DUPLICATE_EVENT_IGNORED', eventType: event.type };
    }

    let handledPassId: string | undefined;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const sessionId = session.id;
        const paymentIntentId = session.payment_intent || `pi_from_${sessionId}`;
        const paymentStatus = session.payment_status;
        const purchaserSessionId = session.metadata?.purchaserSessionId || session.client_reference_id;
        const purchaserEmail = session.customer_email || session.customer_details?.email;

        // Ensure payment status is confirmed 'paid'
        if (paymentStatus !== 'paid') {
          billingStore.updatePaymentAttempt(sessionId, {
            status: 'PROCESSING',
            paymentIntentId,
          });
          break;
        }

        // 3. Underlying Purchase Deduplication (paymentIntentId / sessionId)
        const check = billingStore.isUnderlyingPurchaseFulfilled(paymentIntentId);
        if (check.fulfilled && check.passId) {
          handledPassId = check.passId;
          break;
        }

        // 4. Confirmed Payment Activation with 7-Day Expiry strictly anchored to payment confirmation time
        const confirmedPaymentTime = event.created ? event.created * 1000 : Date.now();
        const expiresAt = confirmedPaymentTime + JOB_PASS_DURATION_MS;
        const passId = `pass_${crypto.randomBytes(12).toString('hex')}`;

        const entitlement: JobPassEntitlementRecord = {
          passId,
          purchaserSessionId: purchaserSessionId || `session_bound_${sessionId}`,
          purchaserEmail,
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

        // Update payment attempt if exists
        billingStore.updatePaymentAttempt(piId, {
          status: 'SUCCEEDED',
          completedAt: confirmedPaymentTime,
        });

        // If checkout.session.completed did not arrive first (out-of-order handling), grant pass if metadata exists
        const check = billingStore.isUnderlyingPurchaseFulfilled(piId);
        if (!check.fulfilled && pi.metadata?.purchaserSessionId) {
          const passId = `pass_${crypto.randomBytes(12).toString('hex')}`;
          const expiresAt = confirmedPaymentTime + JOB_PASS_DURATION_MS;

          const entitlement: JobPassEntitlementRecord = {
            passId,
            purchaserSessionId: pi.metadata.purchaserSessionId,
            purchaserEmail: pi.metadata.customerEmail,
            sourceCheckoutSessionId: pi.metadata.checkoutSessionId || `cs_for_${piId}`,
            sourcePaymentIntentId: piId,
            status: 'ACTIVE',
            activatedAt: confirmedPaymentTime,
            expiresAt,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          billingStore.createOrActivateEntitlement(entitlement);
          handledPassId = passId;
        } else if (check.passId) {
          handledPassId = check.passId;
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        const piId = pi.id;
        const reason = pi.last_payment_error?.message || 'Payment method rejected';

        // CRITICAL: Record failure against THIS payment attempt only!
        // Does NOT revoke or invalidate an existing active pass.
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
        // Other non-critical events are safely acknowledged
        break;
    }

    // Record webhook audit for idempotency
    billingStore.recordWebhookAudit({
      eventId: event.id,
      eventType: event.type,
      underlyingPurchaseId: event.data?.object?.payment_intent || event.data?.object?.id || 'unknown',
      processedAt: Date.now(),
      status: 'PROCESSED',
    });

    return {
      success: true,
      reason: 'EVENT_PROCESSED',
      eventType: event.type,
      passId: handledPassId,
    };
  }

  /**
   * Server-side access enforcement.
   * Validates cryptographic signed token and/or durable store lookup.
   */
  public verifyAccess(params: {
    token?: string;
    purchaserSessionId?: string;
    email?: string;
    nowMs?: number;
  }): EntitlementCheckResult {
    const now = params.nowMs || Date.now();

    // 1. If a signed token is provided, verify cryptographic signature & claims
    if (params.token) {
      const validation = verifySignedEntitlementToken(params.token, params.purchaserSessionId, now);
      if (!validation.valid || !validation.payload) {
        return {
          hasActivePass: false,
          status: validation.error === 'EXPIRED' ? 'EXPIRED' : 'NO_PASS',
          error: validation.error || 'INVALID_TOKEN',
        };
      }

      // Check whether this pass has been revoked in store (e.g. via refund/chargeback)
      const pass = billingStore.getEntitlement(validation.payload.passId);
      if (pass && pass.status === 'REVOKED') {
        return {
          hasActivePass: false,
          status: 'REVOKED',
          passId: pass.passId,
          error: 'PASS_REVOKED_REFUND',
        };
      }

      const remainingSeconds = Math.max(0, Math.floor((validation.payload.expiresAt - now) / 1000));

      return {
        hasActivePass: true,
        status: 'ACTIVE',
        passId: validation.payload.passId,
        expiresAt: validation.payload.expiresAt,
        remainingSeconds,
      };
    }

    // 2. Lookup by session or email in durable store
    if (params.purchaserSessionId || params.email) {
      const pass = billingStore.getActiveEntitlementForPurchaser(
        params.purchaserSessionId,
        params.email,
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
   * Recovers a purchase after an interrupted redirect or closed tab.
   * A checkout success URL query parameter ALONE never grants access;
   * recovery checks the verified payment record in the durable store.
   */
  public recoverPurchase(params: {
    checkoutSessionId?: string;
    purchaserSessionId?: string;
    email?: string;
    nowMs?: number;
  }): { recovered: boolean; token?: string; pass?: JobPassEntitlementRecord; error?: string } {
    const now = params.nowMs || Date.now();

    if (!params.checkoutSessionId && !params.purchaserSessionId && !params.email) {
      return { recovered: false, error: 'MISSING_RECOVERY_IDENTIFIER' };
    }

    // Look up via checkout session ID if available
    let pass: JobPassEntitlementRecord | null = null;

    if (params.checkoutSessionId) {
      const check = billingStore.isUnderlyingPurchaseFulfilled(params.checkoutSessionId);
      if (check.fulfilled && check.passId) {
        pass = billingStore.getEntitlement(check.passId, now);
      } else {
        // Check if payment attempt was recorded as SUCCEEDED
        const attempt = billingStore.findPaymentAttempt(params.checkoutSessionId);
        if (!attempt || attempt.status !== 'SUCCEEDED') {
          return {
            recovered: false,
            error: 'PAYMENT_NOT_YET_CONFIRMED',
          };
        }
        if (attempt.paymentIntentId) {
          const piCheck = billingStore.isUnderlyingPurchaseFulfilled(attempt.paymentIntentId);
          if (piCheck.fulfilled && piCheck.passId) {
            pass = billingStore.getEntitlement(piCheck.passId, now);
          }
        }
      }
    }

    // Fall back to purchaserSessionId or email
    if (!pass && (params.purchaserSessionId || params.email)) {
      pass = billingStore.getActiveEntitlementForPurchaser(
        params.purchaserSessionId,
        params.email,
        now
      );
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

    // Generate fresh signed entitlement token
    const token = issueSignedEntitlementToken({
      passId: pass.passId,
      purchaserSessionId: params.purchaserSessionId || pass.purchaserSessionId,
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
   * Preserves the agreed Free/Paid commercial feature matrix.
   * Processing location alone must NOT determine pricing!
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
