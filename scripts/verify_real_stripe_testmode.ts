/**
 * Real Stripe Test-Mode Verification Runner
 * Explicitly separates:
 * 1. Provider Checkout Session Creation (verified against api.stripe.com)
 * 2. Real Payment Completion (requires customer card entry or PaymentIntent confirmation)
 * 3. Provider Webhook Ingress (requires Stripe CLI forwarder or public webhook URL)
 * 4. Self-signed synthetic events (explicitly labeled as local mocks)
 *
 * Live charging is unconditionally blocked.
 */

import { jobPassService } from '../src/lib/billing/jobPassService';
import { stripeProvider } from '../src/lib/billing/stripeProvider';
import assert from 'node:assert';

async function runRealStripeTestModeCheck() {
  console.log('================================================================');
  console.log('       FILEKIT REAL STRIPE TEST-MODE VERIFICATION               ');
  console.log('================================================================\n');

  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_TEST_SECRET_KEY;

  if (!stripeKey || !stripeKey.startsWith('sk_test_')) {
    console.log('STATUS: [PROVIDER_BACKED_TEST]: CREDENTIAL_BLOCKED');
    console.log('Details: No valid Stripe test key (sk_test_*) was found in the environment.');
    console.log('To execute real round-trips against Stripe\'s test servers, set:');
    console.log('  $env:STRIPE_TEST_SECRET_KEY="sk_test_..."');
    console.log('  $env:STRIPE_TEST_WEBHOOK_SECRET="whsec_..."\n');
    console.log('Note: Live charging is strictly prohibited and live keys (sk_live_*) will be rejected immediately.\n');
    console.log('================================================================');
    return;
  }

  console.log('Stripe test key detected. Initiating checkout creation against api.stripe.com...');

  const purchaserSessionId = `sess_live_test_${Date.now()}`;
  const checkout = await jobPassService.createCheckout({
    purchaserSessionId,
    customerEmail: 'test_buyer@example.com',
    successUrl: 'https://staging.filekit-staging.pages.dev/billing/success',
    cancelUrl: 'https://staging.filekit-staging.pages.dev/billing/cancel',
  });

  assert.ok(checkout.sessionId.startsWith('cs_test_'), 'Must return real Stripe test session ID');
  assert.strictEqual(checkout.amountCents, 490, 'Amount must be strictly €4.90');
  console.log(`[PROVIDER_SESSION_CREATION]: SUCCESS`);
  console.log(`  Checkout Session ID: ${checkout.sessionId}`);
  console.log(`  Checkout URL: ${checkout.checkoutUrl}`);
  console.log(`  Mode: One-time payment (never renews)`);

  console.log('\n[PROVIDER_COMPLETION_STATUS]: PARTIAL PROVIDER VERIFICATION');
  console.log('  1. Session Creation: VERIFIED against live Stripe API (api.stripe.com).');
  console.log('  2. Payment Execution: PENDING customer action at checkout URL above.');
  console.log('  3. Stripe-Delivered Ingress: PENDING public webhook forwarder (e.g. stripe listen --forward-to).');

  console.log('\n[SELF_SIGNED_SYNTHETIC_MOCK]: Delivering simulated webhook for reconciliation audit...');
  const webhookEvent = {
    id: `evt_synthetic_${Date.now()}`,
    type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: checkout.sessionId,
        payment_status: 'paid',
        payment_intent: `pi_simulated_${Date.now()}`,
        customer_email: 'test_buyer@example.com',
        amount_total: 490,
        currency: 'eur',
        metadata: {
          product: 'filekit_job_pass',
          purchaserSessionId,
        },
      },
    },
  };

  const raw = JSON.stringify(webhookEvent);
  const signature = stripeProvider.constructSignatureHeader(raw);
  const webhookRes = await jobPassService.processWebhook(raw, signature);

  assert.strictEqual(webhookRes.success, true);
  console.log(`  Mock Webhook Result: Pass ${webhookRes.passId} processed (Labeled: SELF_SIGNED_MOCK).`);

  const access = await jobPassService.verifyAccess({ purchaserSessionId });
  assert.strictEqual(access.hasActivePass, true);
  console.log(`  Access Verified: Active until ${new Date(access.expiresAt!).toISOString()}`);

  console.log('\n================================================================');
  console.log('SUMMARY: Checkout session creation verified with Stripe test servers.');
  console.log('Full purchase verification remains credential/tunnel blocked until');
  console.log('Stripe CLI or a public webhook ingress receives live payment confirmation.');
  console.log('================================================================\n');
}

runRealStripeTestModeCheck().catch((err) => {
  console.error('Real Stripe test-mode error:', err);
  process.exit(1);
});
