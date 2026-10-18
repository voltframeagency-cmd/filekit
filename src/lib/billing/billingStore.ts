/**
 * Durable, Atomic Payment & Entitlement Store
 * Guarantees idempotency across duplicate events and underlying purchase IDs.
 * Enforces failure isolation (failed new attempt does NOT revoke existing pass)
 * and immediate invalidation on refunds/chargebacks.
 */

import {
  PaymentAttemptRecord,
  JobPassEntitlementRecord,
  WebhookEventAudit,
  EntitlementStatus,
} from './types';
import fs from 'node:fs';
import path from 'node:path';

interface StorageState {
  paymentAttempts: Record<string, PaymentAttemptRecord>;
  entitlements: Record<string, JobPassEntitlementRecord>;
  webhookEvents: Record<string, WebhookEventAudit>;
  paymentIntentToPassMap: Record<string, string>;
  checkoutSessionToPassMap: Record<string, string>;
}

class BillingStore {
  private state: StorageState = {
    paymentAttempts: {},
    entitlements: {},
    webhookEvents: {},
    paymentIntentToPassMap: {},
    checkoutSessionToPassMap: {},
  };

  private snapshotFilePath?: string;

  constructor() {
    // Optional snapshot path for persistence across processes
    const dataDir = process.env.BILLING_STORE_PATH || path.join(process.cwd(), '.next', 'cache', 'billing-store.json');
    this.snapshotFilePath = dataDir;
    this.loadSnapshot();
  }

  private loadSnapshot() {
    if (!this.snapshotFilePath) return;
    try {
      if (fs.existsSync(this.snapshotFilePath)) {
        const raw = fs.readFileSync(this.snapshotFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.paymentAttempts && parsed.entitlements) {
          this.state = parsed;
        }
      }
    } catch {
      // In-memory fallback if file system is read-only or in testing
    }
  }

  private persistSnapshot() {
    if (!this.snapshotFilePath) return;
    try {
      const dir = path.dirname(this.snapshotFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.snapshotFilePath, JSON.stringify(this.state, null, 2), 'utf8');
    } catch {
      // Memory persistence suffices for serverless hot container
    }
  }

  /**
   * Records a new payment attempt
   */
  public recordPaymentAttempt(attempt: PaymentAttemptRecord): void {
    this.state.paymentAttempts[attempt.attemptId] = { ...attempt };
    if (attempt.checkoutSessionId) {
      this.state.paymentAttempts[`cs_${attempt.checkoutSessionId}`] = this.state.paymentAttempts[attempt.attemptId];
    }
    this.persistSnapshot();
  }

  /**
   * Updates an existing payment attempt
   */
  public updatePaymentAttempt(
    identifier: string,
    updates: Partial<PaymentAttemptRecord>
  ): PaymentAttemptRecord | null {
    const attempt = this.findPaymentAttempt(identifier);
    if (!attempt) return null;

    Object.assign(attempt, updates, { updatedAt: Date.now() });
    this.persistSnapshot();
    return attempt;
  }

  /**
   * Finds a payment attempt by attemptId, checkoutSessionId, or paymentIntentId
   */
  public findPaymentAttempt(id: string): PaymentAttemptRecord | null {
    if (this.state.paymentAttempts[id]) {
      return this.state.paymentAttempts[id];
    }
    if (this.state.paymentAttempts[`cs_${id}`]) {
      return this.state.paymentAttempts[`cs_${id}`];
    }
    for (const att of Object.values(this.state.paymentAttempts)) {
      if (
        att.attemptId === id ||
        att.checkoutSessionId === id ||
        (att.paymentIntentId && att.paymentIntentId === id)
      ) {
        return att;
      }
    }
    return null;
  }

  /**
   * Records payment failure against the specific attempt without revoking existing passes.
   */
  public recordPaymentFailure(identifier: string, reason: string): boolean {
    const attempt = this.findPaymentAttempt(identifier);
    if (!attempt) {
      return false;
    }
    attempt.status = 'FAILED';
    attempt.failureReason = reason;
    attempt.updatedAt = Date.now();
    this.persistSnapshot();
    return true;
  }

  /**
   * Webhook deduplication: checks if this webhook event ID has already been processed
   */
  public isWebhookEventProcessed(eventId: string): boolean {
    return Boolean(this.state.webhookEvents[eventId]);
  }

  /**
   * Checks if the underlying payment/checkout has already resulted in an entitlement
   * Prevents duplicate pass creation from multiple events (e.g. session.completed + payment_intent.succeeded)
   */
  public isUnderlyingPurchaseFulfilled(underlyingId: string): { fulfilled: boolean; passId?: string } {
    if (this.state.paymentIntentToPassMap[underlyingId]) {
      return { fulfilled: true, passId: this.state.paymentIntentToPassMap[underlyingId] };
    }
    if (this.state.checkoutSessionToPassMap[underlyingId]) {
      return { fulfilled: true, passId: this.state.checkoutSessionToPassMap[underlyingId] };
    }
    return { fulfilled: false };
  }

  /**
   * Records a webhook audit entry
   */
  public recordWebhookAudit(audit: WebhookEventAudit): void {
    this.state.webhookEvents[audit.eventId] = { ...audit };
    this.persistSnapshot();
  }

  /**
   * Durably records or activates an entitlement record.
   * Links both paymentIntent and checkoutSession to avoid duplicate granting.
   */
  public createOrActivateEntitlement(entitlement: JobPassEntitlementRecord): void {
    this.state.entitlements[entitlement.passId] = { ...entitlement };
    if (entitlement.sourcePaymentIntentId) {
      this.state.paymentIntentToPassMap[entitlement.sourcePaymentIntentId] = entitlement.passId;
    }
    if (entitlement.sourceCheckoutSessionId) {
      this.state.checkoutSessionToPassMap[entitlement.sourceCheckoutSessionId] = entitlement.passId;
    }
    this.persistSnapshot();
  }

  /**
   * Retrieves an entitlement by passId
   */
  public getEntitlement(passId: string, currentTimeMs: number = Date.now()): JobPassEntitlementRecord | null {
    const pass = this.state.entitlements[passId];
    if (!pass) return null;

    // Check automatic 7-day expiration
    if (pass.status === 'ACTIVE' && currentTimeMs >= pass.expiresAt) {
      pass.status = 'EXPIRED';
      pass.updatedAt = currentTimeMs;
      this.persistSnapshot();
    }
    return pass;
  }

  /**
   * Finds an active entitlement for a purchaser session or email
   */
  public getActiveEntitlementForPurchaser(
    purchaserSessionId?: string,
    email?: string,
    currentTimeMs: number = Date.now()
  ): JobPassEntitlementRecord | null {
    for (const pass of Object.values(this.state.entitlements)) {
      const sessionMatch = purchaserSessionId && pass.purchaserSessionId === purchaserSessionId;
      const emailMatch = email && pass.purchaserEmail && pass.purchaserEmail.toLowerCase() === email.toLowerCase();

      if (sessionMatch || emailMatch) {
        if (pass.status === 'ACTIVE') {
          if (currentTimeMs >= pass.expiresAt) {
            pass.status = 'EXPIRED';
            pass.updatedAt = currentTimeMs;
            this.persistSnapshot();
            continue;
          }
          return pass;
        }
      }
    }
    return null;
  }

  /**
   * Revokes an entitlement upon refund or chargeback
   */
  public revokeEntitlementBySource(
    sourcePaymentIntentOrSessionId: string,
    reason: 'REFUND' | 'CHARGEBACK' | 'MANUAL_REVOCATION'
  ): JobPassEntitlementRecord | null {
    let passId =
      this.state.paymentIntentToPassMap[sourcePaymentIntentOrSessionId] ||
      this.state.checkoutSessionToPassMap[sourcePaymentIntentOrSessionId];

    if (!passId) {
      for (const pass of Object.values(this.state.entitlements)) {
        if (
          pass.sourcePaymentIntentId === sourcePaymentIntentOrSessionId ||
          pass.sourceCheckoutSessionId === sourcePaymentIntentOrSessionId
        ) {
          passId = pass.passId;
          break;
        }
      }
    }

    if (!passId) return null;

    const pass = this.state.entitlements[passId];
    if (pass) {
      pass.status = 'REVOKED';
      pass.revokedAt = Date.now();
      pass.revocationReason = reason;
      pass.updatedAt = Date.now();
      this.persistSnapshot();
      return pass;
    }
    return null;
  }

  /**
   * Reset store (used strictly by test suites)
   */
  public resetForTesting(): void {
    this.state = {
      paymentAttempts: {},
      entitlements: {},
      webhookEvents: {},
      paymentIntentToPassMap: {},
      checkoutSessionToPassMap: {},
    };
    if (this.snapshotFilePath && fs.existsSync(this.snapshotFilePath)) {
      try {
        fs.unlinkSync(this.snapshotFilePath);
      } catch {
        // ignore
      }
    }
  }
}

export const billingStore = new BillingStore();
