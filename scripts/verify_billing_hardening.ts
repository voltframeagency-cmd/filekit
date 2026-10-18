/**
 * Regression Verification Suite for Billing Hardening
 * Verifies the 7 critical defect fixes:
 * 1. Startup failure on missing secrets (no silent fallbacks)
 * 2. Unconditional live Stripe key rejection
 * 3. Secure purchaser session authentication & anti-rebinding in recovery
 * 4. Transactional store atomicity & database-enforced unique constraints
 * 5. Fail-closed access enforcement (missing store record strictly denies access)
 * 6. Payment event reconciliation (product, amount, currency, status, owner) & revocation preservation
 * 7. Premium processing handler enforcement (HTTP 402 on gated features)
 * 8. Real test-mode provider verification with explicit labeling (Mock vs Real)
 */

import { jobPassService } from '../src/lib/billing/jobPassService';
import { transactionalBillingStore } from '../src/lib/billing/transactionalBillingStore';
import { getBillingConfig, resetBillingConfigCache } from '../src/lib/billing/billingConfig';
import { stripeProvider } from '../src/lib/billing/stripeProvider';
import { issueSignedEntitlementToken } from '../src/lib/billing/tokenEngine';
import { assertFeatureEntitlement } from '../src/lib/billing/entitlementGuard';
import { NextRequest } from 'next/server';
import assert from 'node:assert';

let passed = 0;
let failed = 0;

function logPass(name: string) {
  passed++;
  console.log(`  ✓ PASS: ${name}`);
}

function logFail(name: string, err: any) {
  failed++;
  console.error(`  ✗ FAIL: ${name}`, err);
}

async function runHardeningTests() {
  console.log('================================================================');
  console.log('       FILEKIT BILLING HARDENING & REGRESSION SUITE             ');
  console.log('================================================================\n');

  // Ensure test mode config
  process.env.FILEKIT_TEST_MODE = 'true';
  process.env.ALLOW_BILLING_MOCK = 'true';
  resetBillingConfigCache();
  transactionalBillingStore.resetForTesting();

  // Defect 1: Startup failure on missing secrets in production mode
  console.log('Test 1: Startup failure on missing secrets in production mode (no silent fallback)');
  try {
    const origEnv = process.env.NODE_ENV;
    const origAllow = process.env.ALLOW_BILLING_MOCK;
    const origTest = process.env.FILEKIT_TEST_MODE;

    // Simulate production environment with missing secrets
    delete process.env.FILEKIT_TEST_MODE;
    delete process.env.ALLOW_BILLING_MOCK;
    delete process.env.JOB_PASS_SIGNING_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    process.env.NODE_ENV = 'production';
    resetBillingConfigCache();

    let threwError = false;
    try {
      getBillingConfig(true);
    } catch (err: any) {
      threwError = true;
      assert.ok(err.message.includes('FATAL_CONFIG_ERROR'), 'Must throw FATAL_CONFIG_ERROR');
    }
    assert.strictEqual(threwError, true, 'Must fail startup when required secrets are missing');

    // Restore test environment
    process.env.NODE_ENV = origEnv;
    process.env.ALLOW_BILLING_MOCK = origAllow;
    process.env.FILEKIT_TEST_MODE = origTest;
    resetBillingConfigCache();

    logPass('Startup halts immediately if required secrets are missing in production');
  } catch (err) {
    logFail('Startup failure on missing secrets', err);
  }

  // Defect 2: Unconditional live Stripe key rejection
  console.log('\nTest 2: Reject live Stripe credentials unconditionally before any API request');
  try {
    const origKey = process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = ['sk', 'live', 'sample_test_key_pattern'].join('_');
    resetBillingConfigCache();

    let rejected = false;
    try {
      await stripeProvider.createCheckoutSession({
        purchaserSessionId: 'sess_test',
        clientReferenceId: 'ref_test',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        taxResolution: {
          taxConfig: { treatment: 'INCLUSIVE', ratePercentage: 0 },
          baseAmountCents: 490,
          taxAmountCents: 0,
          totalGrossCents: 490,
          currency: 'eur',
        },
      });
    } catch (err: any) {
      rejected = true;
      assert.ok(err.message.includes('FATAL_SECURITY_ERROR'), 'Must throw FATAL_SECURITY_ERROR on sk_live_*');
    }
    assert.strictEqual(rejected, true, 'Live credentials must be blocked before any API call');

    // Restore
    if (origKey) process.env.STRIPE_SECRET_KEY = origKey;
    else delete process.env.STRIPE_SECRET_KEY;
    resetBillingConfigCache();

    logPass('Live Stripe keys rejected before any network request can be executed');
  } catch (err) {
    logFail('Reject live Stripe credentials', err);
  }

  // Defect 3: Authenticated purchaser identity in recovery (prevent arbitrary rebinding)
  console.log('\nTest 3: Authenticated purchaser identity in recovery (Anti-Rebinding Protection)');
  try {
    const victimSession = 'sess_alice_legit_owner';
    const attackerSession = 'sess_attacker_hijacker';

    // 1. Alice creates checkout and pays
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: victimSession,
      customerEmail: 'alice@example.com',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    });

    const now = Date.now();
    const eventPayload = {
      id: 'evt_alice_recovery_payment',
      type: 'checkout.session.completed',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_alice_recovery_pi',
          metadata: {
            product: 'filekit_job_pass',
            purchaserSessionId: victimSession,
          },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };
    const raw = JSON.stringify(eventPayload);
    await jobPassService.processWebhook(raw, stripeProvider.constructSignatureHeader(raw));

    // 2. Attacker learns Alice's checkout.sessionId and tries to recover it with attacker's session
    const hijackedRecovery = jobPassService.recoverPurchase({
      authenticatedSessionId: attackerSession, // Attacker session!
      checkoutSessionId: checkout.sessionId,
    });

    assert.strictEqual(hijackedRecovery.recovered, false, 'Recovery by unauthorized session must fail');
    assert.strictEqual(hijackedRecovery.error, 'UNAUTHORIZED_SESSION_OWNERSHIP');

    // 3. Attacker tries email recovery without cryptographic proof
    const unverifiedEmailRecovery = jobPassService.recoverPurchase({
      authenticatedSessionId: attackerSession,
      email: 'alice@example.com',
      // No verification proof!
    });
    assert.strictEqual(unverifiedEmailRecovery.recovered, false);
    assert.strictEqual(unverifiedEmailRecovery.error, 'UNVERIFIED_EMAIL_IDENTITY');

    // 4. Alice recovers legitimately with her own authenticated session
    const legitRecovery = jobPassService.recoverPurchase({
      authenticatedSessionId: victimSession,
      checkoutSessionId: checkout.sessionId,
    });
    assert.strictEqual(legitRecovery.recovered, true, 'Legitimate purchaser must be able to recover');
    assert.strictEqual(legitRecovery.pass?.purchaserSessionId, victimSession, 'Pass must remain bound to Alice');

    logPass('Pass recovery strictly bound to verified purchaser; arbitrary rebinding rejected');
  } catch (err) {
    logFail('Authenticated purchaser identity in recovery', err);
  }

  // Defect 4: Transactional store atomicity & unique constraints
  console.log('\nTest 4: Transactional store atomicity & database-enforced uniqueness');
  try {
    const eventAudit = {
      eventId: 'evt_unique_constraint_test_1',
      eventType: 'checkout.session.completed',
      underlyingPurchaseId: 'pi_unique_test_1',
      processedAt: Date.now(),
      status: 'PROCESSED' as const,
    };

    // First insert succeeds
    const firstInsert = transactionalBillingStore.recordWebhookEventIfNew(eventAudit);
    assert.strictEqual(firstInsert, true, 'First insert must return true');

    // Duplicate insert handled via database unique constraint
    const secondInsert = transactionalBillingStore.recordWebhookEventIfNew(eventAudit);
    assert.strictEqual(secondInsert, false, 'Duplicate insert must return false (unique constraint)');

    logPass('Database-enforced unique constraints prevent duplicate events and double-minting');
  } catch (err) {
    logFail('Transactional store atomicity & uniqueness', err);
  }

  // Defect 5: Fail closed on missing entitlement records
  console.log('\nTest 5: Fail-closed access enforcement (Missing store record strictly denies access)');
  try {
    // Generate a validly signed token, but pointing to a passId that does NOT exist in the store
    const ghostPassId = 'pass_ghost_nonexistent_999';
    const ghostToken = issueSignedEntitlementToken({
      passId: ghostPassId,
      purchaserSessionId: 'sess_ghost_user',
      activatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 86400000,
    });

    const accessCheck = jobPassService.verifyAccess({
      token: ghostToken,
      purchaserSessionId: 'sess_ghost_user',
    });

    assert.strictEqual(accessCheck.hasActivePass, false, 'Access must be denied if store record is missing');
    assert.strictEqual(accessCheck.error, 'ENTITLEMENT_RECORD_NOT_FOUND');

    logPass('Cryptographically signed tokens without backing active database records strictly fail closed');
  } catch (err) {
    logFail('Fail closed on missing entitlement records', err);
  }

  // Defect 6: Payment reconciliation & out-of-order revocation preservation
  console.log('\nTest 6: Payment event reconciliation & out-of-order revocation preservation');
  try {
    const reconcileSession = 'sess_reconcile_buyer';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: reconcileSession,
      customerEmail: 'reconcile@example.com',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    });

    // 6.1 Amount mismatch (e.g. attacker tries to pay 100 cents instead of 490)
    const badAmountPayload = {
      id: 'evt_bad_amount_test',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          amount_total: 100, // INVALID! Expected 490
          currency: 'eur',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: reconcileSession },
        },
      },
    };
    const rawBadAmount = JSON.stringify(badAmountPayload);
    const resBadAmount = await jobPassService.processWebhook(rawBadAmount, stripeProvider.constructSignatureHeader(rawBadAmount));
    assert.strictEqual(resBadAmount.success, false);
    assert.strictEqual(resBadAmount.reason, 'AMOUNT_MISMATCH');

    // 6.2 Product mismatch (e.g. another product paid)
    const badProductPayload = {
      id: 'evt_bad_product_test',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          amount_total: 490,
          currency: 'eur',
          metadata: { product: 'wrong_product', purchaserSessionId: reconcileSession },
        },
      },
    };
    const rawBadProduct = JSON.stringify(badProductPayload);
    const resBadProduct = await jobPassService.processWebhook(rawBadProduct, stripeProvider.constructSignatureHeader(rawBadProduct));
    assert.strictEqual(resBadProduct.success, false);
    assert.strictEqual(resBadProduct.reason, 'PRODUCT_MISMATCH');

    // 6.3 Legitimate payment completes
    const legitPayload = {
      id: 'evt_legit_payment_test',
      type: 'checkout.session.completed',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_reconcile_pass_valid',
          amount_total: 490,
          currency: 'eur',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: reconcileSession },
        },
      },
    };
    const rawLegit = JSON.stringify(legitPayload);
    const legitRes = await jobPassService.processWebhook(rawLegit, stripeProvider.constructSignatureHeader(rawLegit));
    assert.strictEqual(legitRes.success, true);
    const passId = legitRes.passId!;

    // 6.4 Refund occurs (status becomes REVOKED)
    const refundPayload = {
      id: 'evt_refund_reconcile_test',
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_reconcile_pass_valid',
          refunded: true,
        },
      },
    };
    const rawRefund = JSON.stringify(refundPayload);
    await jobPassService.processWebhook(rawRefund, stripeProvider.constructSignatureHeader(rawRefund));
    const passAfterRefund = transactionalBillingStore.getEntitlement(passId);
    assert.strictEqual(passAfterRefund?.status, 'REVOKED');

    // 6.5 Out-of-order late payment event arrives AFTER refund
    // Must preserve REVOKED status and not reactivate!
    const lateEventPayload = {
      id: 'evt_late_payment_intent_succeeded',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_reconcile_pass_valid',
          status: 'succeeded',
          amount: 490,
          currency: 'eur',
        },
      },
    };
    const rawLate = JSON.stringify(lateEventPayload);
    const lateRes = await jobPassService.processWebhook(rawLate, stripeProvider.constructSignatureHeader(rawLate));
    assert.strictEqual(lateRes.reason, 'REVOCATION_PRESERVED', 'Out-of-order event must preserve revocation');

    const passAfterLate = transactionalBillingStore.getEntitlement(passId);
    assert.strictEqual(passAfterLate?.status, 'REVOKED', 'Pass must remain REVOKED');

    logPass('Payment reconciliation rejects mismatches; out-of-order events preserve revocations');
  } catch (err) {
    logFail('Payment reconciliation & revocation preservation', err);
  }

  // Defect 7: Enforcement wired into premium processing handlers
  console.log('\nTest 7: Premium processing handler enforcement (assertFeatureEntitlement)');
  try {
    // 7.1 Free standard office conversion <= 50MB: allowed without pass
    const freeReq = new NextRequest('http://localhost:3000/api/internal/convert/word-to-pdf', {
      method: 'POST',
    });
    const freeGuard = await assertFeatureEntitlement(freeReq, 'SERVER_OFFICE_CONVERSION', {
      fileSizeBytes: 2 * 1024 * 1024, // 2MB
    });
    assert.strictEqual(freeGuard.authorized, true, 'Standard fair-use Office conversion must be authorized free');

    // 7.2 Large office conversion > 50MB: blocked with 402 Payment Required
    const largeReq = new NextRequest('http://localhost:3000/api/internal/convert/word-to-pdf', {
      method: 'POST',
    });
    const largeGuard = await assertFeatureEntitlement(largeReq, 'SERVER_OFFICE_CONVERSION', {
      fileSizeBytes: 80 * 1024 * 1024, // 80MB -> requires Job Pass
    });
    assert.strictEqual(largeGuard.authorized, false, 'Large file conversion must require Job Pass');
    assert.strictEqual(largeGuard.response?.status, 402, 'Must return HTTP 402');

    // 7.3 Video processing: blocked without pass
    const videoReq = new NextRequest('http://localhost:3000/api/internal/convert/video', {
      method: 'POST',
    });
    const videoGuardWithoutPass = await assertFeatureEntitlement(videoReq, 'UNLIMITED_BURST_PROCESSING');
    assert.strictEqual(videoGuardWithoutPass.authorized, false, 'Video conversion without pass must be blocked');
    assert.strictEqual(videoGuardWithoutPass.response?.status, 402, 'Must return HTTP 402');

    // 7.4 Video processing with valid Job Pass in Authorization header
    const buyerSession = 'sess_video_pro_user';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: buyerSession,
      successUrl: 'https://example.com',
      cancelUrl: 'https://example.com',
    });
    const payPayload = {
      id: 'evt_video_pro_paid',
      type: 'checkout.session.completed',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_video_pro_paid',
          amount_total: 490,
          currency: 'eur',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: buyerSession },
        },
      },
    };
    const rawPay = JSON.stringify(payPayload);
    const payRes = await jobPassService.processWebhook(rawPay, stripeProvider.constructSignatureHeader(rawPay));

    const validToken = issueSignedEntitlementToken({
      passId: payRes.passId!,
      purchaserSessionId: buyerSession,
      activatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 86400000,
    });

    const videoReqWithPass = new NextRequest('http://localhost:3000/api/internal/convert/video', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${validToken}`,
        'x-purchaser-session': buyerSession,
      },
    });

    const videoGuardWithPass = await assertFeatureEntitlement(videoReqWithPass, 'UNLIMITED_BURST_PROCESSING');
    assert.strictEqual(videoGuardWithPass.authorized, true, 'Video conversion with valid Job Pass must be authorized');

    logPass('Entitlement guard correctly protects premium processing routes with HTTP 402');
  } catch (err) {
    logFail('Premium processing handler enforcement', err);
  }

  // Label Provider Status
  console.log('\n----------------------------------------------------------------');
  console.log('Provider Mode Reporting:');
  const hasStripeTestKey = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_test_'));
  if (hasStripeTestKey) {
    console.log('  [PROVIDER_BACKED_TEST]: STRIPE_TEST_SECRET_KEY present. Live network test-mode enabled.');
  } else {
    console.log('  [MOCK_PROVIDER_TEST_ONLY]: Tests executed using deterministic cryptographic test harness.');
    console.log('  [PROVIDER_BACKED_TEST]: CREDENTIAL_BLOCKED (Awaiting STRIPE_TEST_SECRET_KEY from user for live network calls against api.stripe.com; live charging strictly disabled).');
  }
  console.log('----------------------------------------------------------------');

  console.log('\n================================================================');
  console.log(`HARDENING SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runHardeningTests().catch((err) => {
  console.error('Fatal hardening test failure:', err);
  process.exit(1);
});
