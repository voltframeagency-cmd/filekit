/**
 * Durable, Atomic Payment & Entitlement Store
 * Backed by TransactionalBillingStore (Cloudflare D1 & SQLite).
 * Enforces true ACID transactions, unique constraints, early refund persistence, and failure isolation.
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

  public bindD1(d1Db: any): void {
    if (d1Db) {
      this.store = this.store.withD1(d1Db);
    }
  }

  public async recordPaymentAttempt(attempt: PaymentAttemptRecord): Promise<void> {
    await this.store.recordPaymentAttempt(attempt);
  }

  public async updatePaymentAttempt(
    identifier: string,
    updates: Partial<PaymentAttemptRecord>
  ): Promise<PaymentAttemptRecord | null> {
    return await this.store.updatePaymentAttempt(identifier, updates);
  }

  public async findPaymentAttempt(id: string): Promise<PaymentAttemptRecord | null> {
    return await this.store.findPaymentAttempt(id);
  }

  public async recordPaymentFailure(identifier: string, reason: string): Promise<boolean> {
    return await this.store.recordPaymentFailure(identifier, reason);
  }

  public async isEventAlreadyProcessed(eventId: string): Promise<boolean> {
    return await this.store.isEventAlreadyProcessed(eventId);
  }

  public async recordRevocation(identifier: string, reason: string): Promise<void> {
    await this.store.recordRevocation(identifier, reason);
  }

  public async isPurchaseRevoked(identifier: string): Promise<{ revoked: boolean; reason?: string }> {
    return await this.store.isPurchaseRevoked(identifier);
  }

  public async isUnderlyingPurchaseFulfilled(underlyingId: string): Promise<{ fulfilled: boolean; passId?: string }> {
    return await this.store.isUnderlyingPurchaseFulfilled(underlyingId);
  }

  public async commitWebhookSuccess(params: {
    eventAudit: WebhookEventAudit;
    entitlement: JobPassEntitlementRecord;
    attemptUpdates: {
      attemptId: string;
      paymentIntentId: string;
      completedAt: number;
    };
  }): Promise<void> {
    await this.store.commitWebhookSuccess(params);
  }

  public async getEntitlement(passId: string, currentTimeMs: number = Date.now()): Promise<JobPassEntitlementRecord | null> {
    return await this.store.getEntitlement(passId, currentTimeMs);
  }

  public async getActiveEntitlementForPurchaser(
    purchaserSessionId?: string,
    email?: string,
    currentTimeMs: number = Date.now()
  ): Promise<JobPassEntitlementRecord | null> {
    return await this.store.getActiveEntitlementForPurchaser(purchaserSessionId, email, currentTimeMs);
  }

  public async revokeEntitlementBySource(
    sourcePaymentIntentOrSessionId: string,
    reason: 'REFUND' | 'CHARGEBACK' | 'MANUAL_REVOCATION'
  ): Promise<JobPassEntitlementRecord | null> {
    return await this.store.revokeEntitlementBySource(sourcePaymentIntentOrSessionId, reason);
  }

  public async resetForTesting(): Promise<void> {
    await this.store.resetForTesting();
  }
}

export const billingStore = new BillingStore();
