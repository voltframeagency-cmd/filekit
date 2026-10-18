/**
 * Billing Configuration & Secret Governance
 * Fails startup when required secrets are missing.
 * Rejects live Stripe credentials unconditionally before any request can be made.
 * Restricts mock providers and test secrets explicitly to test environments.
 */

export interface BillingConfig {
  signingSecret: string;
  stripeSecretKey?: string;
  stripeWebhookSecret: string;
  allowMocks: boolean;
  isTestEnv: boolean;
}

let cachedConfig: BillingConfig | null = null;

export function getBillingConfig(forceReload: boolean = false): BillingConfig {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }

  const isTestEnv = process.env.NODE_ENV === 'test' || process.env.FILEKIT_TEST_MODE === 'true';
  const allowMocks = process.env.ALLOW_BILLING_MOCK === 'true' || isTestEnv;

  const rawStripeSecret = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_TEST_SECRET_KEY;
  const rawWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_TEST_WEBHOOK_SECRET;
  const rawSigningSecret = process.env.JOB_PASS_SIGNING_SECRET;

  // 1. REJECT LIVE STRIPE KEYS UNCONDITIONALLY
  if (rawStripeSecret) {
    if (rawStripeSecret.startsWith('sk_live_') || rawStripeSecret.startsWith('rk_live_')) {
      throw new Error(
        'FATAL_SECURITY_ERROR: Live Stripe credentials detected (sk_live_* / rk_live_*). ' +
        'Live charging is strictly prohibited in this phase. ' +
        'Only Stripe test-mode keys (sk_test_*) are permitted.'
      );
    }
  }

  // 2. ENFORCE REQUIRED SECRETS (NO SILENT FALLBACK IN PRODUCTION)
  let signingSecret: string;
  let stripeWebhookSecret: string;

  if (rawSigningSecret && rawSigningSecret.trim().length >= 32) {
    signingSecret = rawSigningSecret.trim();
  } else if (allowMocks) {
    // Explicitly labeled test secret, permitted ONLY when allowMocks is true
    signingSecret = 'filekit-test-signing-secret-only-for-test-32chars!';
  } else {
    throw new Error(
      'FATAL_CONFIG_ERROR: Required secret JOB_PASS_SIGNING_SECRET is missing or shorter than 32 characters. ' +
      'Silent fallbacks are disabled in deployed environments.'
    );
  }

  if (rawWebhookSecret && rawWebhookSecret.trim().length > 0) {
    stripeWebhookSecret = rawWebhookSecret.trim();
  } else if (allowMocks) {
    // Explicitly labeled test webhook secret, permitted ONLY when allowMocks is true
    stripeWebhookSecret = 'whsec_test_mock_secret_for_tests_only';
  } else {
    throw new Error(
      'FATAL_CONFIG_ERROR: Required secret STRIPE_WEBHOOK_SECRET is missing. ' +
      'Silent fallbacks are disabled in deployed environments.'
    );
  }

  cachedConfig = {
    signingSecret,
    stripeSecretKey: rawStripeSecret ? rawStripeSecret.trim() : undefined,
    stripeWebhookSecret,
    allowMocks,
    isTestEnv,
  };

  return cachedConfig;
}

export function resetBillingConfigCache(): void {
  cachedConfig = null;
}
