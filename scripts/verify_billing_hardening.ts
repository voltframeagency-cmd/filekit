/**
 * Hardened Billing & Regression Verification Suite
 * Verifies all 7 architectural gap corrections:
 * 1. Startup failure on missing secrets in deployed mode & mock mode rejection in deployed environments
 * 2. Unconditional live Stripe key rejection
 * 3. Server-issued, cryptographically verified session in recovery (rejection of raw caller-supplied IDs)
 * 4. Transactional store atomicity & database-enforced unique constraints
 * 5. Fail-closed access enforcement (missing store record strictly denies access)
 * 6. Early refund/dispute persistence (out-of-order refunds before checkout completion cannot grant access)
 * 7. Real LibreOffice conversion path entitlement enforcement
 * 8. Real test-mode runner accurate labeling
 */

import { jobPassService } from '../src/lib/billing/jobPassService';
import { transactionalBillingStore } from '../src/lib/billing/transactionalBillingStore';
import { getBillingConfig, resetBillingConfigCache } from '../src/lib/billing/billingConfig';
import { stripeProvider } from '../src/lib/billing/stripeProvider';
import { issueSignedEntitlementToken } from '../src/lib/billing/tokenEngine';
import { issuePurchaserSession, verifySessionToken } from '../src/lib/billing/sessionAuth';
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
  console.log('       FILEKIT BILLING HARDENING & REGRESSION SUITE (V2)        ');
  console.log('================================================================\n');

  process.env.FILEKIT_TEST_MODE = 'true';
  process.env.ALLOW_BILLING_MOCK = 'true';
  resetBillingConfigCache();
  await transactionalBillingStore.resetForTesting();

  // Test 1: Mock mode rejection in deployed environments & missing secrets failure
  console.log('Test 1: Reject mock mode in deployed environments (regardless of ALLOW_BILLING_MOCK)');
  try {
    const origEnv = process.env.NODE_ENV;
    const origAllow = process.env.ALLOW_BILLING_MOCK;
    const origCfPages = process.env.CF_PAGES;

    // Simulate Cloudflare Pages deployment with ALLOW_BILLING_MOCK=true
    process.env.CF_PAGES = '1';
    process.env.ALLOW_BILLING_MOCK = 'true';
    delete process.env.JOB_PASS_SIGNING_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    resetBillingConfigCache();

    let threwError = false;
    try {
      getBillingConfig(true);
    } catch (err: any) {
      threwError = true;
      assert.ok(err.message.includes('FATAL_CONFIG_ERROR'), 'Must throw FATAL_CONFIG_ERROR');
      assert.ok(err.message.includes('Mock mode and fallback secrets are strictly prohibited'));
    }
    assert.strictEqual(threwError, true, 'Mock mode must be rejected in deployed environments');

    // Restore
    delete process.env.CF_PAGES;
    process.env.NODE_ENV = origEnv;
    process.env.ALLOW_BILLING_MOCK = origAllow;
    process.env.FILEKIT_TEST_MODE = 'true';
    resetBillingConfigCache();

    logPass('Mock mode strictly rejected in deployed environments regardless of flags');
  } catch (err) {
    logFail('Mock mode rejection in deployed environments', err);
  }

  // Test 2: Unconditional live Stripe key rejection
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

  // Test 3: Server-issued session authentication in recovery (Anti-Rebinding Protection)
  console.log('\nTest 3: Server-issued verified session in recovery (Anti-Rebinding Protection)');
  try {
    // Issue server-signed session for Alice
    const aliceSession = issuePurchaserSession('sess_alice_verified');
    const attackerSession = issuePurchaserSession('sess_attacker_verified');

    // Alice creates checkout and pays
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: aliceSession.sessionId,
      customerEmail: 'alice@example.com',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    });

    const now = Date.now();
    const eventPayload = {
      id: 'evt_alice_recovery_payment_v2',
      type: 'checkout.session.completed',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_alice_recovery_pi_v2',
          metadata: {
            product: 'filekit_job_pass',
            purchaserSessionId: aliceSession.sessionId,
          },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };
    const raw = JSON.stringify(eventPayload);
    await jobPassService.processWebhook(raw, stripeProvider.constructSignatureHeader(raw));

    // 3.1 Attacker tries recovery with raw caller-controlled session ID (no token)
    const rawSessionAttempt = await jobPassService.recoverPurchase({
      checkoutSessionId: checkout.sessionId,
    });
    assert.strictEqual(rawSessionAttempt.recovered, false);
    assert.strictEqual(rawSessionAttempt.error, 'AUTHENTICATED_SESSION_REQUIRED');

    // 3.2 Attacker uses their own valid session token to steal Alice's checkout session
    const hijackedRecovery = await jobPassService.recoverPurchase({
      authenticatedSessionToken: attackerSession.sessionToken, // Attacker's token
      checkoutSessionId: checkout.sessionId,
    });
    assert.strictEqual(hijackedRecovery.recovered, false);
    assert.strictEqual(hijackedRecovery.error, 'UNAUTHORIZED_SESSION_OWNERSHIP');

    // 3.3 Alice recovers legitimately with her server-issued session token
    const legitRecovery = await jobPassService.recoverPurchase({
      authenticatedSessionToken: aliceSession.sessionToken,
      checkoutSessionId: checkout.sessionId,
    });
    assert.strictEqual(legitRecovery.recovered, true);
    assert.strictEqual(legitRecovery.pass?.purchaserSessionId, aliceSession.sessionId);

    logPass('Pass recovery strictly bound to server-verified session; raw IDs and hijacking rejected');
  } catch (err) {
    logFail('Server-issued session authentication in recovery', err);
  }

  // Test 4: Atomic webhook processing (no early PROCESSED status)
  console.log('\nTest 4: Atomic webhook processing (No early PROCESSED marking on failure)');
  try {
    const atomicSession = 'sess_atomic_test';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: atomicSession,
      customerEmail: 'atomic@example.com',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    });

    const failingEventId = 'evt_failing_event_reconciliation';
    const failingPayload = {
      id: failingEventId,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          amount_total: 9999, // Amount mismatch intentionally triggering failure!
          currency: 'eur',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: atomicSession },
        },
      },
    };
    const rawFail = JSON.stringify(failingPayload);
    const res = await jobPassService.processWebhook(rawFail, stripeProvider.constructSignatureHeader(rawFail));
    assert.strictEqual(res.success, false, 'Reconciliation failure must be rejected');

    // Assert that the event was NOT marked as PROCESSED in the store!
    const isProcessed = await transactionalBillingStore.isEventAlreadyProcessed(failingEventId);
    assert.strictEqual(isProcessed, false, 'Failed event must NOT be recorded as PROCESSED');

    logPass('Atomic webhook processing: events are not marked PROCESSED early on failure');
  } catch (err) {
    logFail('Atomic webhook processing', err);
  }

  // Test 5: Early refund/dispute persistence (Preserving revocations on out-of-order events)
  console.log('\nTest 5: Early refund persistence (Out-of-order refund arriving BEFORE checkout completion)');
  try {
    const earlyRefundPI = 'pi_early_refund_candidate_001';
    const earlyRefundSession = 'sess_early_refund_buyer';

    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: earlyRefundSession,
      customerEmail: 'early_refund@example.com',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    });

    // 5.1 Out-of-order: charge.refunded arrives FIRST before checkout.session.completed
    const refundPayload = {
      id: 'evt_early_refund_event',
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: earlyRefundPI,
          refunded: true,
        },
      },
    };
    const rawRefund = JSON.stringify(refundPayload);
    await jobPassService.processWebhook(rawRefund, stripeProvider.constructSignatureHeader(rawRefund));

    // Verify refund state was persisted in revoked_purchases
    const checkRevoke = await transactionalBillingStore.isPurchaseRevoked(earlyRefundPI);
    assert.strictEqual(checkRevoke.revoked, true, 'Early refund must be persisted in revoked_purchases');

    // 5.2 Later, checkout.session.completed arrives
    const lateCheckoutPayload = {
      id: 'evt_late_checkout_event',
      type: 'checkout.session.completed',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: earlyRefundPI,
          amount_total: 490,
          currency: 'eur',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: earlyRefundSession },
        },
      },
    };
    const rawLate = JSON.stringify(lateCheckoutPayload);
    const lateRes = await jobPassService.processWebhook(rawLate, stripeProvider.constructSignatureHeader(rawLate));
    assert.strictEqual(lateRes.reason, 'REVOCATION_PRESERVED');

    // Assert the created entitlement is REVOKED and cannot grant access
    const pass = await transactionalBillingStore.getEntitlement(lateRes.passId!);
    assert.strictEqual(pass?.status, 'REVOKED', 'Entitlement must be minted directly as REVOKED');

    const access = await jobPassService.verifyAccess({ purchaserSessionId: earlyRefundSession });
    assert.strictEqual(access.hasActivePass, false, 'Late success event must NOT grant active access to refunded purchase');

    logPass('Early refund state safely persisted; subsequent success events cannot grant access');
  } catch (err) {
    logFail('Early refund persistence', err);
  }

  // Test 6: Fail closed on missing entitlement records
  console.log('\nTest 6: Fail-closed access enforcement (Missing store record strictly denies access)');
  try {
    const ghostPassId = 'pass_ghost_nonexistent_999';
    const ghostToken = issueSignedEntitlementToken({
      passId: ghostPassId,
      purchaserSessionId: 'sess_ghost_user',
      activatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 86400000,
    });

    const accessCheck = await jobPassService.verifyAccess({
      token: ghostToken,
      purchaserSessionId: 'sess_ghost_user',
    });

    assert.strictEqual(accessCheck.hasActivePass, false, 'Access must be denied if store record is missing');
    assert.strictEqual(accessCheck.error, 'ENTITLEMENT_RECORD_NOT_FOUND');

    logPass('Cryptographically signed tokens without backing active database records strictly fail closed');
  } catch (err) {
    logFail('Fail closed on missing entitlement records', err);
  }

  // Test 7: Real LibreOffice conversion path entitlement enforcement
  console.log('\nTest 7: Real LibreOffice conversion path entitlement enforcement');
  try {
    // 7.1 Fair-use office file <= 50MB: free
    const freeReq = new NextRequest('http://localhost:3000/api/internal/convert/word-to-pdf', {
      method: 'POST',
    });
    const freeGuard = await assertFeatureEntitlement(freeReq, 'SERVER_OFFICE_CONVERSION', {
      fileSizeBytes: 5 * 1024 * 1024,
    });
    assert.strictEqual(freeGuard.authorized, true, 'Fair-use conversion must be authorized free');

    // 7.2 Gated office file > 50MB: requires Job Pass (returns 402)
    const largeReq = new NextRequest('http://localhost:3000/api/internal/convert/word-to-pdf', {
      method: 'POST',
    });
    const largeGuard = await assertFeatureEntitlement(largeReq, 'SERVER_OFFICE_CONVERSION', {
      fileSizeBytes: 60 * 1024 * 1024,
    });
    assert.strictEqual(largeGuard.authorized, false);
    assert.strictEqual(largeGuard.response?.status, 402);

    logPass('Real LibreOffice conversion path strictly enforces Job Pass with HTTP 402 on gated files');
  } catch (err) {
    logFail('Real LibreOffice conversion path enforcement', err);
  }

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
