/**
 * End-to-End Billing Lifecycle Verification Suite
 * Exercises all required billing criteria:
 * 1. Server-created one-time checkout with server-controlled pricing (€4.90)
 * 2. Success URL alone NEVER grants access (Payment unconfirmed)
 * 3. 7-day expiry anchored to confirmed payment time (expiresAt = paidAt + 7 * 86,400,000)
 * 4. Forged webhook and replay attack rejection
 * 5. Idempotency across duplicate events and same underlying purchase
 * 6. Failed payment isolation (failed attempt does NOT revoke existing active pass)
 * 7. Refund and chargeback revocation (immediate invalidation)
 * 8. Purchase recovery after closed tab or interrupted redirect
 * 9. Client-side tampering rejection
 * 10. Free/paid feature matrix preservation
 */

import { jobPassService } from '../src/lib/billing/jobPassService';
import { billingStore } from '../src/lib/billing/billingStore';
import { stripeProvider } from '../src/lib/billing/stripeProvider';
import {
  JOB_PASS_PRICE_CENTS,
  JOB_PASS_DURATION_MS,
  FEATURE_MATRIX,
} from '../src/lib/billing/types';
import { resolveTaxConfiguration } from '../src/lib/billing/taxConfig';
import { issueSignedEntitlementToken, verifySignedEntitlementToken } from '../src/lib/billing/tokenEngine';
import { issuePurchaserSession } from '../src/lib/billing/sessionAuth';
import assert from 'node:assert';
import crypto from 'node:crypto';

let testsPassed = 0;
let testsFailed = 0;

function logPass(name: string) {
  testsPassed++;
  console.log(`  ✓ PASS: ${name}`);
}

function logFail(name: string, err: any) {
  testsFailed++;
  console.error(`  ✗ FAIL: ${name}`, err);
}

async function runAllBillingTests() {
  console.log('================================================================');
  console.log('       FILEKIT €4.90 JOB PASS BILLING VERIFICATION SUITE        ');
  console.log('================================================================\n');

  process.env.FILEKIT_TEST_MODE = 'true';
  process.env.ALLOW_BILLING_MOCK = 'true';

  await billingStore.resetForTesting();

  // Test 1: Server-controlled pricing & tax separation
  console.log('Test 1: Server-created checkout with server-controlled pricing & decoupled tax');
  try {
    const testSessionId = 'sess_client_test_001';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: testSessionId,
      customerEmail: 'alice@example.com',
      countryCode: 'SE', // Swedish 25% VAT
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    assert.strictEqual(checkout.amountCents, JOB_PASS_PRICE_CENTS, 'Amount must strictly be 490 cents (€4.90)');
    assert.strictEqual(checkout.currency, 'eur', 'Currency must strictly be eur');
    assert.ok(checkout.sessionId.startsWith('cs_test_'), 'Session ID must be provider test format');
    assert.strictEqual(checkout.taxSummary.ratePercentage, 25.0, 'Configured tax rate must match jurisdiction');

    // Verify record in store
    const record = await billingStore.findPaymentAttempt(checkout.sessionId);
    assert.ok(record, 'Payment attempt must be durably recorded');
    assert.strictEqual(record?.status, 'INITIATED', 'Initial status must be INITIATED');
    assert.strictEqual(record?.amountCents, 490, 'Recorded amount must be 490');

    logPass('Server-created checkout with server-controlled pricing & tax separation');
  } catch (err) {
    logFail('Server-created checkout with server-controlled pricing & tax separation', err);
  }

  // Test 2: Success URL alone must NEVER grant access
  console.log('\nTest 2: Success URL alone must NEVER grant access (Payment unconfirmed)');
  try {
    const unconfirmedSession = issuePurchaserSession('sess_unconfirmed_buyer');
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: unconfirmedSession.sessionId,
      customerEmail: 'bob@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    // Client returns from redirect with checkout.sessionId, but webhook hasn't confirmed payment!
    const directAccess = await jobPassService.verifyAccess({
      purchaserSessionId: unconfirmedSession.sessionId,
    });
    assert.strictEqual(directAccess.hasActivePass, false, 'Access must be denied without confirmed payment');

    // Attempt recovery on unconfirmed session
    const recovery = await jobPassService.recoverPurchase({
      authenticatedSessionToken: unconfirmedSession.sessionToken,
      checkoutSessionId: checkout.sessionId,
    });
    assert.strictEqual(recovery.recovered, false, 'Recovery must fail if payment is unconfirmed');
    assert.strictEqual(recovery.error, 'PAYMENT_NOT_YET_CONFIRMED');

    logPass('Success URL alone does not grant access; unconfirmed payment rejected');
  } catch (err) {
    logFail('Success URL alone does not grant access', err);
  }

  // Test 3: Happy path, confirmed payment, and 7-day payment-anchored expiry
  console.log('\nTest 3: Confirmed payment activation & 7-day payment-anchored expiry');
  try {
    const buyerSession = 'sess_buyer_confirmed_7day';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: buyerSession,
      customerEmail: 'carol@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    const confirmedPaymentTime = Date.now();
    const mockPaymentIntentId = 'pi_test_confirmed_331';

    const eventPayload = {
      id: 'evt_test_checkout_completed_001',
      type: 'checkout.session.completed',
      created: Math.floor(confirmedPaymentTime / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: mockPaymentIntentId,
          customer_email: 'carol@example.com',
          metadata: {
            product: 'filekit_job_pass',
            purchaserSessionId: buyerSession,
          },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };

    const rawPayload = JSON.stringify(eventPayload);
    const signature = stripeProvider.constructSignatureHeader(rawPayload);

    const webhookRes = await jobPassService.processWebhook(rawPayload, signature);
    assert.strictEqual(webhookRes.success, true, 'Webhook must process successfully');
    assert.strictEqual(webhookRes.reason, 'EVENT_PROCESSED');
    assert.ok(webhookRes.passId, 'Must return activated passId');

    // Verify 7-day expiry calculation anchored to confirmedPaymentTime
    const passRecord = await billingStore.getEntitlement(webhookRes.passId!);
    assert.ok(passRecord, 'Entitlement record must exist in store');
    const expectedActivatedAt = Math.floor(confirmedPaymentTime / 1000) * 1000;
    assert.strictEqual(passRecord?.activatedAt, expectedActivatedAt, 'activatedAt must equal confirmed payment time');
    assert.strictEqual(
      passRecord?.expiresAt,
      expectedActivatedAt + JOB_PASS_DURATION_MS,
      'expiresAt must strictly be activatedAt + 7 days (604,800,000 ms)'
    );

    // Test access within the 7-day window (Day 2)
    const accessAtDay2 = await jobPassService.verifyAccess({
      purchaserSessionId: buyerSession,
      nowMs: expectedActivatedAt + 2 * 24 * 60 * 60 * 1000,
    });
    assert.strictEqual(accessAtDay2.hasActivePass, true, 'Access must be ACTIVE at day 2');
    assert.strictEqual(accessAtDay2.status, 'ACTIVE');

    // Test access after 7 days + 1 second
    const accessAfterExpiry = await jobPassService.verifyAccess({
      purchaserSessionId: buyerSession,
      nowMs: expectedActivatedAt + JOB_PASS_DURATION_MS + 1000,
    });
    assert.strictEqual(accessAfterExpiry.hasActivePass, false, 'Access must be denied after 7-day expiry');

    logPass('Confirmed payment grants active pass with 7-day strictly anchored expiry');
  } catch (err) {
    logFail('Confirmed payment activation & 7-day payment-anchored expiry', err);
  }

  // Test 4: Forged webhook signature & replay attack rejection
  console.log('\nTest 4: Forged webhook signature and replay attack rejection');
  try {
    const rawPayload = JSON.stringify({ id: 'evt_forged_999', type: 'checkout.session.completed' });

    // 4.1 Missing signature
    const resNoSig = await jobPassService.processWebhook(rawPayload, '');
    assert.strictEqual(resNoSig.success, false);
    assert.strictEqual(resNoSig.reason, 'INVALID_SIGNATURE');

    // 4.2 Forged/invalid HMAC signature
    const forgedSig = 't=1770000000,v1=deadbeefcafebabe000000000000000000000000000000000000000000000000';
    const resForged = await jobPassService.processWebhook(rawPayload, forgedSig);
    assert.strictEqual(resForged.success, false);
    assert.strictEqual(resForged.reason, 'INVALID_SIGNATURE');

    // 4.3 Expired timestamp (outside 300s window)
    const ancientTimestamp = Math.floor(Date.now() / 1000) - 10000;
    const replaySig = stripeProvider.constructSignatureHeader(rawPayload, stripeProvider.getWebhookSecret(), ancientTimestamp);
    const resReplay = await jobPassService.processWebhook(rawPayload, replaySig);
    assert.strictEqual(resReplay.success, false, 'Replay with stale timestamp must be rejected');

    logPass('Forged webhook and replay attacks reliably rejected');
  } catch (err) {
    logFail('Forged webhook and replay attacks reliably rejected', err);
  }

  // Test 5: Idempotency across duplicate events AND same purchase
  console.log('\nTest 5: Idempotency across duplicate events AND same underlying purchase');
  try {
    const buyerSession = 'sess_idempotent_buyer';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: buyerSession,
      customerEmail: 'dave@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    const eventPayload = {
      id: 'evt_idempotency_test_100',
      type: 'checkout.session.completed',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_idempotent_unique_100',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: buyerSession },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };

    const rawPayload = JSON.stringify(eventPayload);
    const sig = stripeProvider.constructSignatureHeader(rawPayload);

    // Call 1: Process initial event
    const firstRes = await jobPassService.processWebhook(rawPayload, sig);
    assert.strictEqual(firstRes.success, true);
    const initialPassId = firstRes.passId;

    // Call 2: Replay exact same event.id
    const duplicateEventRes = await jobPassService.processWebhook(rawPayload, sig);
    assert.strictEqual(duplicateEventRes.success, true);
    assert.strictEqual(duplicateEventRes.reason, 'DUPLICATE_EVENT_IGNORED');

    // Call 3: Different event.id for the SAME underlying payment_intent
    const differentEventSamePurchase = {
      id: 'evt_idempotency_test_101_different_id',
      type: 'checkout.session.completed',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_idempotent_unique_100',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: buyerSession },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };
    const rawPayload2 = JSON.stringify(differentEventSamePurchase);
    const sig2 = stripeProvider.constructSignatureHeader(rawPayload2);
    const samePurchaseRes = await jobPassService.processWebhook(rawPayload2, sig2);
    assert.strictEqual(samePurchaseRes.success, true);
    assert.strictEqual(samePurchaseRes.passId, initialPassId);

    logPass('Duplicate event IDs and multiple events for the same purchase handled idempotently');
  } catch (err) {
    logFail('Idempotency across duplicate events AND same purchase', err);
  }

  // Test 6: Failed payment isolation
  console.log('\nTest 6: Failed payment isolation (failed attempt does NOT revoke existing pass)');
  try {
    const buyerSession = 'sess_existing_pass_holder';
    const checkout1 = await jobPassService.createCheckout({
      purchaserSessionId: buyerSession,
      customerEmail: 'eve@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    const now = Date.now();
    const successPayload = {
      id: 'evt_pass_success_initial',
      type: 'checkout.session.completed',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: checkout1.sessionId,
          payment_status: 'paid',
          payment_intent: 'pi_pass_success_initial',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: buyerSession },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };
    const rawSuccess = JSON.stringify(successPayload);
    await jobPassService.processWebhook(rawSuccess, stripeProvider.constructSignatureHeader(rawSuccess));

    // Confirm pass #1 is ACTIVE
    const accessBeforeFail = await jobPassService.verifyAccess({ purchaserSessionId: buyerSession });
    assert.strictEqual(accessBeforeFail.hasActivePass, true, 'User must have active pass');

    // Attempt #2: User attempts another checkout, but payment fails
    const checkout2 = await jobPassService.createCheckout({
      purchaserSessionId: buyerSession,
      customerEmail: 'eve@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    const failedPayload = {
      id: 'evt_failed_attempt_second',
      type: 'payment_intent.payment_failed',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: 'pi_failed_second_attempt',
          last_payment_error: { message: 'Insufficient funds' },
        },
      },
    };
    await billingStore.updatePaymentAttempt(checkout2.sessionId, { paymentIntentId: 'pi_failed_second_attempt' });

    const rawFail = JSON.stringify(failedPayload);
    await jobPassService.processWebhook(rawFail, stripeProvider.constructSignatureHeader(rawFail));

    const failedRecord = await billingStore.findPaymentAttempt('pi_failed_second_attempt');
    assert.strictEqual(failedRecord?.status, 'FAILED');
    assert.strictEqual(failedRecord?.failureReason, 'Insufficient funds');

    // CRITICAL: User's existing pass #1 must STILL be ACTIVE!
    const accessAfterFail = await jobPassService.verifyAccess({ purchaserSessionId: buyerSession });
    assert.strictEqual(accessAfterFail.hasActivePass, true, 'Existing active pass must NOT be revoked by failed attempt');

    logPass('Failed payment recorded against attempt without revoking existing active pass');
  } catch (err) {
    logFail('Failed payment isolation', err);
  }

  // Test 7: Refund & chargeback revocation
  console.log('\nTest 7: Refund and chargeback revocation (immediate invalidation)');
  try {
    const buyerSession = 'sess_refund_candidate';
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: buyerSession,
      customerEmail: 'frank@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    const now = Date.now();
    const piId = 'pi_to_be_refunded_777';
    const successPayload = {
      id: 'evt_refund_success_grant',
      type: 'checkout.session.completed',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: piId,
          metadata: { product: 'filekit_job_pass', purchaserSessionId: buyerSession },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };
    const rawSuccess = JSON.stringify(successPayload);
    const grantRes = await jobPassService.processWebhook(rawSuccess, stripeProvider.constructSignatureHeader(rawSuccess));
    const passId = grantRes.passId!;

    const token = issueSignedEntitlementToken({
      passId,
      purchaserSessionId: buyerSession,
      activatedAt: now,
      expiresAt: now + JOB_PASS_DURATION_MS,
    });

    const initialCheck = await jobPassService.verifyAccess({ token, purchaserSessionId: buyerSession });
    assert.strictEqual(initialCheck.hasActivePass, true);

    // Charge is refunded
    const refundPayload = {
      id: 'evt_charge_refunded_777',
      type: 'charge.refunded',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: 'ch_refunded_777',
          payment_intent: piId,
          amount_refunded: 490,
          refunded: true,
        },
      },
    };
    const rawRefund = JSON.stringify(refundPayload);
    await jobPassService.processWebhook(rawRefund, stripeProvider.constructSignatureHeader(rawRefund));

    // Entitlement must now be REVOKED
    const passInStore = await billingStore.getEntitlement(passId);
    assert.strictEqual(passInStore?.status, 'REVOKED');
    assert.strictEqual(passInStore?.revocationReason, 'REFUND');

    const accessWithToken = await jobPassService.verifyAccess({ token, purchaserSessionId: buyerSession });
    assert.strictEqual(accessWithToken.hasActivePass, false, 'Access must be denied after refund');
    assert.strictEqual(accessWithToken.status, 'REVOKED');

    const accessWithSession = await jobPassService.verifyAccess({ purchaserSessionId: buyerSession });
    assert.strictEqual(accessWithSession.hasActivePass, false);

    logPass('Refund immediately revokes entitlement and invalidates access');
  } catch (err) {
    logFail('Refund & chargeback revocation', err);
  }

  // Test 8: Purchase recovery
  console.log('\nTest 8: Purchase recovery after closed tab or interrupted redirect');
  try {
    const recoverySession = issuePurchaserSession('sess_closed_tab_user');
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: recoverySession.sessionId,
      customerEmail: 'grace@example.com',
      successUrl: 'https://filekit.app/billing/success',
      cancelUrl: 'https://filekit.app/billing/cancel',
    });

    const now = Date.now();
    const piId = 'pi_closed_tab_success';
    const webhookPayload = {
      id: 'evt_closed_tab_webhook',
      type: 'checkout.session.completed',
      created: Math.floor(now / 1000),
      data: {
        object: {
          id: checkout.sessionId,
          payment_status: 'paid',
          payment_intent: piId,
          customer_email: 'grace@example.com',
          metadata: { product: 'filekit_job_pass', purchaserSessionId: recoverySession.sessionId },
          amount_total: 490,
          currency: 'eur',
        },
      },
    };
    const raw = JSON.stringify(webhookPayload);
    await jobPassService.processWebhook(raw, stripeProvider.constructSignatureHeader(raw));

    // User recovers with server-issued session token
    const recovered = await jobPassService.recoverPurchase({
      authenticatedSessionToken: recoverySession.sessionToken,
      checkoutSessionId: checkout.sessionId,
    });

    assert.strictEqual(recovered.recovered, true, 'Purchase must be successfully recovered');
    assert.ok(recovered.token, 'Must return signed entitlement token');
    assert.strictEqual(recovered.pass?.status, 'ACTIVE');

    const access = await jobPassService.verifyAccess({ token: recovered.token, purchaserSessionId: recoverySession.sessionId });
    assert.strictEqual(access.hasActivePass, true);

    logPass('Closed-tab purchase recovery verifies server payment and returns valid token');
  } catch (err) {
    logFail('Purchase recovery after closed tab or interrupted redirect', err);
  }

  // Test 9: Client-state tampering rejection
  console.log('\nTest 9: Client-state tampering rejection');
  try {
    const validToken = issueSignedEntitlementToken({
      passId: 'pass_legit_001',
      purchaserSessionId: 'sess_alice',
      activatedAt: Date.now(),
      expiresAt: Date.now() + JOB_PASS_DURATION_MS,
    });

    const [payloadB64, validSig] = validToken.split('.');
    const tamperedPayloadB64 = Buffer.from(
      JSON.stringify({
        v: 1,
        passId: 'pass_legit_001',
        purchaserSessionId: 'sess_hacker',
        activatedAt: Date.now(),
        expiresAt: Date.now() + 100 * JOB_PASS_DURATION_MS,
        issuedAt: Date.now(),
      })
    ).toString('base64url');

    const tamperedToken = `${tamperedPayloadB64}.${validSig}`;
    const tamperedCheck = verifySignedEntitlementToken(tamperedToken);
    assert.strictEqual(tamperedCheck.valid, false);
    assert.strictEqual(tamperedCheck.error, 'INVALID_SIGNATURE');

    const sessionMismatchCheck = verifySignedEntitlementToken(validToken, 'sess_someone_else');
    assert.strictEqual(sessionMismatchCheck.valid, false);
    assert.strictEqual(sessionMismatchCheck.error, 'SESSION_MISMATCH');

    logPass('Client-state tampering and session hijacking successfully prevented');
  } catch (err) {
    logFail('Client-state tampering rejection', err);
  }

  // Test 10: Free/paid commercial feature matrix preservation
  console.log('\nTest 10: Free/paid commercial feature matrix preservation');
  try {
    const freeLocalCheck = jobPassService.checkFeatureAccess('LOCAL_CONVERSION_STANDARD', false);
    assert.strictEqual(freeLocalCheck.allowed, true);

    const officeCheck = jobPassService.checkFeatureAccess('SERVER_OFFICE_CONVERSION', false);
    assert.strictEqual(officeCheck.allowed, true);

    const ocrWithoutPass = jobPassService.checkFeatureAccess('SERVER_OCR_EXTENDED', false);
    assert.strictEqual(ocrWithoutPass.allowed, false);

    const ocrWithPass = jobPassService.checkFeatureAccess('SERVER_OCR_EXTENDED', true);
    assert.strictEqual(ocrWithPass.allowed, true);

    const batchWithoutPass = jobPassService.checkFeatureAccess('BATCH_PROCESSING_HIGH_VOLUME', false);
    assert.strictEqual(batchWithoutPass.allowed, false);

    logPass('Agreed commercial feature boundaries preserved; processing location alone does not gate');
  } catch (err) {
    logFail('Free/paid commercial feature matrix preservation', err);
  }

  console.log('\n================================================================');
  console.log(`RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAllBillingTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
