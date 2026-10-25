/**
 * Billing Configuration & Secret Governance (Hardened)
 * - Fails startup when required secrets are missing.
 * - Rejects live Stripe credentials unconditionally before any request can be made.
 * - Rejects mock mode in deployed environments, regardless of flags.
 * - Never permits fallback secrets outside explicit local test execution.
 */

export interface BillingConfig {
  signingSecret: string;
  stripeSecretKey?: string;
  stripeWebhookSecret: string;
  allowMocks: boolean;
  isTestEnv: boolean;
  isDeployed: boolean;
}

let cachedConfig: BillingConfig | null = null;

export function getBillingConfig(forceReload: boolean = false): BillingConfig {
  if (cachedConfig && !forceReload) {
    return cachedConfig;
  }

  // Deployed environment detection (Cloudflare Pages, Vercel, or production NODE_ENV)
  const isDeployed =
    process.env.NODE_ENV === 'production' ||
    process.env.CF_PAGES === '1' ||
    process.env.VERCEL === '1' ||
    process.env.ENVIRONMENT === 'production';

  const isTestEnv =
    !isDeployed &&
    (process.env.NODE_ENV === 'test' || process.env.FILEKIT_TEST_MODE === 'true');

  // CRITICAL: Reject mock mode in deployed environments regardless of flags!
  const allowMocks = !isDeployed && (process.env.ALLOW_BILLING_MOCK === 'true' || isTestEnv);

  if (isDeployed && process.env.ALLOW_BILLING_MOCK === 'true') {
    console.warn(
      '[SECURITY_WARNING] ALLOW_BILLING_MOCK=true was specified, but is strictly ignored in deployed environment.'
    );
  }

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

  // 2. ENFORCE REQUIRED SECRETS (NO SILENT FALLBACK IN DEPLOYED ENVIRONMENTS)
  let signingSecret: string;
  let stripeWebhookSecret: string;

  if (rawSigningSecret && rawSigningSecret.trim().length >= 32) {
    signingSecret = rawSigningSecret.trim();
  } else if (allowMocks) {
    // Permitted ONLY in local test harness where allowMocks is strictly true and not deployed
    signingSecret = 'filekit-test-signing-secret-only-for-test-32chars!';
  } else {
    throw new Error(
      'FATAL_CONFIG_ERROR: Required secret JOB_PASS_SIGNING_SECRET is missing or shorter than 32 characters. ' +
      'Mock mode and fallback secrets are strictly prohibited in deployed environments.'
    );
  }

  if (rawWebhookSecret && rawWebhookSecret.trim().length > 0) {
    stripeWebhookSecret = rawWebhookSecret.trim();
  } else if (allowMocks) {
    stripeWebhookSecret = 'whsec_test_mock_secret_for_tests_only';
  } else {
    throw new Error(
      'FATAL_CONFIG_ERROR: Required secret STRIPE_WEBHOOK_SECRET is missing. ' +
      'Mock mode and fallback secrets are strictly prohibited in deployed environments.'
    );
  }

  cachedConfig = {
    signingSecret,
    stripeSecretKey: rawStripeSecret ? rawStripeSecret.trim() : undefined,
    stripeWebhookSecret,
    allowMocks,
    isTestEnv,
    isDeployed,
  };

  return cachedConfig;
}

export function resetBillingConfigCache(): void {
  cachedConfig = null;
}
