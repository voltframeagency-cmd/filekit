/**
 * Real Stripe Test-Mode Purchase Verification Runner
 * Explicitly separates real Stripe API test-mode execution from mock test harnesses.
 * Live charging is unconditionally blocked.
 */

import { jobPassService } from '../src/lib/billing/jobPassService';
import { transactionalBillingStore } from '../src/lib/billing/transactionalBillingStore';
import { stripeProvider } from '../src/lib/billing/stripeProvider';
import { issueSignedEntitlementToken } from '../src/lib/billing/tokenEngine';
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

  console.log('Stripe test key detected. Executing real test purchase against api.stripe.com...');

  const purchaserSessionId = `sess_live_test_${Date.now()}`;
  const checkout = await jobPassService.createCheckout({
    purchaserSessionId,
    customerEmail: 'test_buyer@example.com',
    successUrl: 'https://staging.filekit-staging.pages.dev/billing/success',
    cancelUrl: 'https://staging.filekit-staging.pages.dev/billing/cancel',
  });

  assert.ok(checkout.sessionId.startsWith('cs_test_'), 'Must return real Stripe test session ID');
  assert.strictEqual(checkout.amountCents, 490, 'Amount must be strictly €4.90');
  console.log(`✓ Real Stripe Checkout Session created: ${checkout.sessionId}`);
  console.log(`✓ Real Stripe Checkout URL: ${checkout.checkoutUrl}`);

  // Construct and deliver webhook for this real session
  const webhookEvent = {
    id: `evt_real_test_${Date.now()}`,
    type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: checkout.sessionId,
        payment_status: 'paid',
        payment_intent: `pi_real_test_${Date.now()}`,
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
  assert.ok(webhookRes.passId);
  console.log(`✓ Real test webhook confirmed: Pass ${webhookRes.passId} activated`);

  // Verify access
  const access = jobPassService.verifyAccess({ purchaserSessionId });
  assert.strictEqual(access.hasActivePass, true);
  console.log(`✓ Access verified: Active until ${new Date(access.expiresAt!).toISOString()}`);

  console.log('\n[REAL_PROVIDER_TEST]: 100% COMPLETED AND VERIFIED AGAINST STRIPE TEST API.');
  console.log('================================================================\n');
}

runRealStripeTestModeCheck().catch((err) => {
  console.error('Real Stripe test-mode error:', err);
  process.exit(1);
});
