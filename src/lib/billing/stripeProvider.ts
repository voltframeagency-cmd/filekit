/**
 * Stripe Payment Provider Adapter (Provider Test Mode)
 * Server-controlled pricing, server-side secret management.
 * Strictly rejects live keys before any request is made.
 * Cryptographic webhook signature verification matching Stripe's exact specification.
 */

import crypto from 'node:crypto';
import { JOB_PASS_PRICE_CENTS, JOB_PASS_CURRENCY, JOB_PASS_DURATION_DAYS } from './types';
import { TaxResolutionResult } from './taxConfig';
import { getBillingConfig } from './billingConfig';

export interface CreateCheckoutParams {
  purchaserSessionId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  clientReferenceId: string;
  taxResolution: TaxResolutionResult;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  amountCents: number;
  currency: string;
  providerMode: 'STRIPE_TEST_MODE' | 'MOCK_PROVIDER_TEST_ONLY';
}

export interface StripeWebhookEvent<T = any> {
  id: string;
  type: string;
  created: number;
  data: {
    object: T;
  };
}

export class StripeProvider {
  /**
   * Asserts that live credentials are never used in this integration.
   * Throws immediately if live keys are present.
   */
  private assertTestModeOnly(secretKey?: string): void {
    if (secretKey && (secretKey.startsWith('sk_live_') || secretKey.startsWith('rk_live_'))) {
      throw new Error(
        'FATAL_SECURITY_ERROR: Live Stripe credentials rejected. Live mode is strictly disabled. ' +
        'Only Stripe test-mode keys (sk_test_*) are permitted.'
      );
    }
  }

  public getWebhookSecret(): string {
    return getBillingConfig().stripeWebhookSecret;
  }

  /**
   * Creates a one-time Stripe Checkout Session strictly enforcing €4.90 pricing server-side.
   */
  public async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const config = getBillingConfig();
    this.assertTestModeOnly(config.stripeSecretKey);

    const hasRealTestKey = config.stripeSecretKey && config.stripeSecretKey.startsWith('sk_test_');

    if (!hasRealTestKey) {
      if (!config.allowMocks) {
        throw new Error(
          'CREDENTIAL_BLOCKED: Real Stripe test credentials (sk_test_*) are required in deployed environment. ' +
          'Mock provider is disabled.'
        );
      }

      // Explicitly labeled mock test mode (allowed strictly in unit/e2e test harness)
      const mockSessionId = `cs_test_${crypto.randomBytes(16).toString('hex')}`;
      const mockUrl = `https://checkout.stripe.com/c/pay/${mockSessionId}?session_id=${mockSessionId}`;

      return {
        sessionId: mockSessionId,
        checkoutUrl: mockUrl,
        amountCents: params.taxResolution.totalGrossCents,
        currency: JOB_PASS_CURRENCY,
        providerMode: 'MOCK_PROVIDER_TEST_ONLY',
      };
    }

    // Call official Stripe REST API in genuine test mode
    const body = new URLSearchParams();
    body.append('mode', 'payment'); // strictly one-time payment; NEVER a subscription
    body.append('success_url', `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`);
    body.append('cancel_url', params.cancelUrl);
    body.append('client_reference_id', params.clientReferenceId);

    if (params.customerEmail) {
      body.append('customer_email', params.customerEmail);
    }

    // Server-controlled line item
    body.append('line_items[0][price_data][currency]', JOB_PASS_CURRENCY);
    body.append('line_items[0][price_data][unit_amount]', params.taxResolution.totalGrossCents.toString());
    body.append('line_items[0][price_data][product_data][name]', 'FileKit 7-Day Job Pass');
    body.append(
      'line_items[0][price_data][product_data][description]',
      `7 days of premium file processing. One-time payment, never auto-renews. (${params.taxResolution.taxConfig.taxLabel || 'VAT included'})`
    );
    body.append('line_items[0][quantity]', '1');

    // Server metadata for attribution & session binding
    body.append('metadata[product]', 'filekit_job_pass');
    body.append('metadata[purchaserSessionId]', params.purchaserSessionId);
    body.append('metadata[durationDays]', JOB_PASS_DURATION_DAYS.toString());
    body.append('metadata[taxTreatment]', params.taxResolution.taxConfig.treatment);
    body.append('metadata[jurisdiction]', params.taxResolution.taxConfig.jurisdictionCode || 'GLOBAL');

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Stripe API error creating checkout session: ${err}`);
    }

    const data = await res.json();
    return {
      sessionId: data.id,
      checkoutUrl: data.url,
      amountCents: data.amount_total || params.taxResolution.totalGrossCents,
      currency: data.currency || JOB_PASS_CURRENCY,
      providerMode: 'STRIPE_TEST_MODE',
    };
  }

  /**
   * Cryptographic verification of Stripe Webhook Signature (`stripe-signature` header).
   * Prevents forged webhooks and replay attacks outside standard tolerance window (300s).
   */
  public verifyWebhookSignature(
    rawPayload: string | Buffer,
    signatureHeader: string,
    secret: string = this.getWebhookSecret(),
    toleranceSeconds: number = 300
  ): boolean {
    if (!signatureHeader || !rawPayload) {
      return false;
    }

    const parts = signatureHeader.split(',');
    let timestamp = -1;
    const signatures: string[] = [];

    for (const part of parts) {
      const [key, val] = part.split('=');
      if (key === 't') {
        timestamp = parseInt(val, 10);
      } else if (key === 'v1') {
        signatures.push(val);
      }
    }

    if (timestamp === -1 || signatures.length === 0) {
      return false;
    }

    // Check tolerance window to prevent replay of stale payloads
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
      return false;
    }

    // Compute expected HMAC SHA256 over `${timestamp}.${rawPayload}`
    const payloadStr = typeof rawPayload === 'string' ? rawPayload : rawPayload.toString('utf8');
    const signedPayload = `${timestamp}.${payloadStr}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signedPayload, 'utf8');
    const expectedSignature = hmac.digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');

    for (const sig of signatures) {
      const sigBuf = Buffer.from(sig, 'utf8');
      if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Helper to construct a valid `stripe-signature` header for testing.
   */
  public constructSignatureHeader(
    rawPayload: string,
    secret: string = this.getWebhookSecret(),
    timestamp: number = Math.floor(Date.now() / 1000)
  ): string {
    const signedPayload = `${timestamp}.${rawPayload}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signedPayload, 'utf8');
    const signature = hmac.digest('hex');
    return `t=${timestamp},v1=${signature}`;
  }
}

export const stripeProvider = new StripeProvider();
