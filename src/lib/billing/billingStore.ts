/**
 * Durable, Atomic Payment & Entitlement Store
 * Backed by TransactionalBillingStore (Cloudflare D1 / SQLite).
 * Enforces true ACID transactions, unique constraints, failure isolation, and refund revocations.
 */

import { transactionalBillingStore, TransactionalBillingStore } from './transactionalBillingStore';
import {
  PaymentAttemptRecord,
  JobPassEntitlementRecord,
  WebhookEventAudit,
} from './types';

export class BillingStore {
  private store: TransactionalBillingStore;

  constructor(customStore?: TransactionalBillingStore) {
    this.store = customStore || transactionalBillingStore;
  }

  public recordPaymentAttempt(attempt: PaymentAttemptRecord): void {
    this.store.recordPaymentAttempt(attempt);
  }

  public updatePaymentAttempt(
    identifier: string,
    updates: Partial<PaymentAttemptRecord>
  ): PaymentAttemptRecord | null {
    return this.store.updatePaymentAttempt(identifier, updates);
  }

  public findPaymentAttempt(id: string): PaymentAttemptRecord | null {
    return this.store.findPaymentAttempt(id);
  }

  public recordPaymentFailure(identifier: string, reason: string): boolean {
    return this.store.recordPaymentFailure(identifier, reason);
  }

  public isWebhookEventProcessed(eventId: string): boolean {
    const existing = this.findWebhookEvent(eventId);
    return Boolean(existing);
  }

  public recordWebhookEventIfNew(audit: WebhookEventAudit): boolean {
    return this.store.recordWebhookEventIfNew(audit);
  }

  public isUnderlyingPurchaseFulfilled(underlyingId: string): { fulfilled: boolean; passId?: string } {
    return this.store.isUnderlyingPurchaseFulfilled(underlyingId);
  }

  public recordWebhookAudit(audit: WebhookEventAudit): void {
    this.store.recordWebhookEventIfNew(audit);
  }

  public createOrActivateEntitlement(entitlement: JobPassEntitlementRecord): void {
    this.store.createOrActivateEntitlement(entitlement);
  }

  public getEntitlement(passId: string, currentTimeMs: number = Date.now()): JobPassEntitlementRecord | null {
    return this.store.getEntitlement(passId, currentTimeMs);
  }

  public getActiveEntitlementForPurchaser(
    purchaserSessionId?: string,
    email?: string,
    currentTimeMs: number = Date.now()
  ): JobPassEntitlementRecord | null {
    return this.store.getActiveEntitlementForPurchaser(purchaserSessionId, email, currentTimeMs);
  }

  public revokeEntitlementBySource(
    sourcePaymentIntentOrSessionId: string,
    reason: 'REFUND' | 'CHARGEBACK' | 'MANUAL_REVOCATION'
  ): JobPassEntitlementRecord | null {
    return this.store.revokeEntitlementBySource(sourcePaymentIntentOrSessionId, reason);
  }

  public resetForTesting(): void {
    this.store.resetForTesting();
  }

  private findWebhookEvent(eventId: string): boolean {
    // Check by attempting to see if it's already recorded
    return !this.store.recordWebhookEventIfNew({
      eventId,
      eventType: 'PROBE',
      underlyingPurchaseId: 'PROBE',
      processedAt: Date.now(),
      status: 'PROCESSED',
    });
  }
}

export const billingStore = new BillingStore();
