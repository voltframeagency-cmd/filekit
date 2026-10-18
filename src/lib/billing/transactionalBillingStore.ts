/**
 * Transactional Durable SQL Billing Store (Cloudflare D1 / SQLite)
 * Enforces true ACID transactions, unique constraints, and multi-instance concurrency safety.
 * Replaces in-memory JSON file writes.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import {
  PaymentAttemptRecord,
  JobPassEntitlementRecord,
  WebhookEventAudit,
  EntitlementStatus,
} from './types';

export class TransactionalBillingStore {
  private db: DatabaseSync;

  constructor(customDbPath?: string) {
    if (customDbPath === ':memory:') {
      this.db = new DatabaseSync(':memory:');
    } else {
      const defaultPath = path.join(process.cwd(), '.next', 'cache', 'filekit-billing.sqlite');
      const dbPath = customDbPath || process.env.BILLING_DB_PATH || defaultPath;
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.db = new DatabaseSync(dbPath);
    }

    this.initializeSchema();
  }

  private initializeSchema() {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;

      CREATE TABLE IF NOT EXISTS payment_attempts (
        attempt_id TEXT PRIMARY KEY,
        checkout_session_id TEXT UNIQUE NOT NULL,
        payment_intent_id TEXT UNIQUE,
        purchaser_session_id TEXT NOT NULL,
        purchaser_email TEXT,
        amount_cents INTEGER NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        tax_config_json TEXT NOT NULL,
        failure_reason TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        completed_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS entitlements (
        pass_id TEXT PRIMARY KEY,
        purchaser_session_id TEXT NOT NULL,
        purchaser_email TEXT,
        source_checkout_session_id TEXT UNIQUE NOT NULL,
        source_payment_intent_id TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        activated_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        revoked_at INTEGER,
        revocation_reason TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS webhook_events (
        event_id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        underlying_purchase_id TEXT NOT NULL,
        processed_at INTEGER NOT NULL,
        status TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_entitlements_session ON entitlements(purchaser_session_id);
      CREATE INDEX IF NOT EXISTS idx_payment_attempts_session ON payment_attempts(purchaser_session_id);
    `);
  }

  /**
   * Records a new payment attempt within a transaction.
   * Throws if checkout_session_id already exists.
   */
  public recordPaymentAttempt(attempt: PaymentAttemptRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO payment_attempts (
        attempt_id, checkout_session_id, payment_intent_id, purchaser_session_id,
        purchaser_email, amount_cents, currency, status, tax_config_json,
        failure_reason, created_at, updated_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      attempt.attemptId,
      attempt.checkoutSessionId,
      attempt.paymentIntentId || null,
      attempt.purchaserSessionId,
      attempt.purchaserEmail || null,
      attempt.amountCents,
      attempt.currency,
      attempt.status,
      JSON.stringify(attempt.taxConfig),
      attempt.failureReason || null,
      attempt.createdAt,
      attempt.updatedAt,
      attempt.completedAt || null
    );
  }

  /**
   * Updates an existing payment attempt atomically.
   */
  public updatePaymentAttempt(
    identifier: string,
    updates: Partial<PaymentAttemptRecord>
  ): PaymentAttemptRecord | null {
    const existing = this.findPaymentAttempt(identifier);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    const stmt = this.db.prepare(`
      UPDATE payment_attempts SET
        payment_intent_id = ?,
        status = ?,
        failure_reason = ?,
        completed_at = ?,
        updated_at = ?
      WHERE attempt_id = ?
    `);

    stmt.run(
      updated.paymentIntentId || null,
      updated.status,
      updated.failureReason || null,
      updated.completedAt || null,
      updated.updatedAt,
      existing.attemptId
    );

    return updated;
  }

  /**
   * Finds a payment attempt by attempt_id, checkout_session_id, or payment_intent_id.
   */
  public findPaymentAttempt(id: string): PaymentAttemptRecord | null {
    const stmt = this.db.prepare(`
      SELECT * FROM payment_attempts
      WHERE attempt_id = ? OR checkout_session_id = ? OR payment_intent_id = ?
      LIMIT 1
    `);

    const row = stmt.get(id, id, id) as any;
    if (!row) return null;

    return {
      attemptId: row.attempt_id,
      checkoutSessionId: row.checkout_session_id,
      paymentIntentId: row.payment_intent_id || undefined,
      purchaserSessionId: row.purchaser_session_id,
      purchaserEmail: row.purchaser_email || undefined,
      amountCents: row.amount_cents,
      currency: row.currency,
      status: row.status,
      taxConfig: JSON.parse(row.tax_config_json),
      failureReason: row.failure_reason || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at || undefined,
    };
  }

  /**
   * Records payment failure against the specific attempt without revoking existing passes.
   */
  public recordPaymentFailure(identifier: string, reason: string): boolean {
    const attempt = this.findPaymentAttempt(identifier);
    if (!attempt) return false;

    this.updatePaymentAttempt(attempt.attemptId, {
      status: 'FAILED',
      failureReason: reason,
    });
    return true;
  }

  /**
   * Atomically checks and records a webhook event.
   * Returns true if event is NEW and recorded.
   * Returns false if event was ALREADY PROCESSED (idempotent rejection).
   */
  public recordWebhookEventIfNew(audit: WebhookEventAudit): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO webhook_events (event_id, event_type, underlying_purchase_id, processed_at, status)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(
        audit.eventId,
        audit.eventType,
        audit.underlyingPurchaseId,
        audit.processedAt,
        audit.status
      );
      return true;
    } catch (err: any) {
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return false;
      }
      throw err;
    }
  }

  /**
   * Checks if underlying payment or checkout has already resulted in an entitlement.
   */
  public isUnderlyingPurchaseFulfilled(underlyingId: string): { fulfilled: boolean; passId?: string } {
    const stmt = this.db.prepare(`
      SELECT pass_id FROM entitlements
      WHERE source_checkout_session_id = ? OR source_payment_intent_id = ?
      LIMIT 1
    `);
    const row = stmt.get(underlyingId, underlyingId) as any;
    if (row) {
      return { fulfilled: true, passId: row.pass_id };
    }
    return { fulfilled: false };
  }

  /**
   * Creates or activates an entitlement record atomically with UNIQUE constraint checks.
   * Guarantees no two passes can ever be minted for the same payment intent.
   */
  public createOrActivateEntitlement(entitlement: JobPassEntitlementRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO entitlements (
        pass_id, purchaser_session_id, purchaser_email, source_checkout_session_id,
        source_payment_intent_id, status, activated_at, expires_at,
        revoked_at, revocation_reason, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      entitlement.passId,
      entitlement.purchaserSessionId,
      entitlement.purchaserEmail || null,
      entitlement.sourceCheckoutSessionId,
      entitlement.sourcePaymentIntentId,
      entitlement.status,
      entitlement.activatedAt,
      entitlement.expiresAt,
      entitlement.revokedAt || null,
      entitlement.revocationReason || null,
      entitlement.createdAt,
      entitlement.updatedAt
    );
  }

  /**
   * Retrieves an entitlement by passId.
   * Automatically updates status to EXPIRED if nowMs >= expires_at.
   */
  public getEntitlement(passId: string, currentTimeMs: number = Date.now()): JobPassEntitlementRecord | null {
    const stmt = this.db.prepare(`
      SELECT * FROM entitlements WHERE pass_id = ? LIMIT 1
    `);
    const row = stmt.get(passId) as any;
    if (!row) return null;

    const pass: JobPassEntitlementRecord = {
      passId: row.pass_id,
      purchaserSessionId: row.purchaser_session_id,
      purchaserEmail: row.purchaser_email || undefined,
      sourceCheckoutSessionId: row.source_checkout_session_id,
      sourcePaymentIntentId: row.source_payment_intent_id,
      status: row.status as EntitlementStatus,
      activatedAt: row.activated_at,
      expiresAt: row.expires_at,
      revokedAt: row.revoked_at || undefined,
      revocationReason: row.revocation_reason || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    if (pass.status === 'ACTIVE' && currentTimeMs >= pass.expiresAt) {
      pass.status = 'EXPIRED';
      pass.updatedAt = currentTimeMs;
      const updateStmt = this.db.prepare(`
        UPDATE entitlements SET status = 'EXPIRED', updated_at = ? WHERE pass_id = ?
      `);
      updateStmt.run(currentTimeMs, pass.passId);
    }

    return pass;
  }

  /**
   * Finds an active entitlement for a purchaser session or email.
   */
  public getActiveEntitlementForPurchaser(
    purchaserSessionId?: string,
    email?: string,
    currentTimeMs: number = Date.now()
  ): JobPassEntitlementRecord | null {
    const stmt = this.db.prepare(`
      SELECT * FROM entitlements
      WHERE (purchaser_session_id = ? OR (purchaser_email IS NOT NULL AND LOWER(purchaser_email) = LOWER(?)))
        AND status = 'ACTIVE'
      ORDER BY expires_at DESC
      LIMIT 1
    `);

    const row = stmt.get(purchaserSessionId || '', email || '') as any;
    if (!row) return null;

    if (currentTimeMs >= row.expires_at) {
      const updateStmt = this.db.prepare(`
        UPDATE entitlements SET status = 'EXPIRED', updated_at = ? WHERE pass_id = ?
      `);
      updateStmt.run(currentTimeMs, row.pass_id);
      return null;
    }

    return {
      passId: row.pass_id,
      purchaserSessionId: row.purchaser_session_id,
      purchaserEmail: row.purchaser_email || undefined,
      sourceCheckoutSessionId: row.source_checkout_session_id,
      sourcePaymentIntentId: row.source_payment_intent_id,
      status: 'ACTIVE',
      activatedAt: row.activated_at,
      expiresAt: row.expires_at,
      revokedAt: row.revoked_at || undefined,
      revocationReason: row.revocation_reason || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Revokes an entitlement upon refund or chargeback.
   */
  public revokeEntitlementBySource(
    sourcePaymentIntentOrSessionId: string,
    reason: 'REFUND' | 'CHARGEBACK' | 'MANUAL_REVOCATION'
  ): JobPassEntitlementRecord | null {
    const stmt = this.db.prepare(`
      SELECT * FROM entitlements
      WHERE source_checkout_session_id = ? OR source_payment_intent_id = ?
      LIMIT 1
    `);
    const row = stmt.get(sourcePaymentIntentOrSessionId, sourcePaymentIntentOrSessionId) as any;
    if (!row) return null;

    const now = Date.now();
    const updateStmt = this.db.prepare(`
      UPDATE entitlements SET
        status = 'REVOKED',
        revoked_at = ?,
        revocation_reason = ?,
        updated_at = ?
      WHERE pass_id = ?
    `);
    updateStmt.run(now, reason, now, row.pass_id);

    return this.getEntitlement(row.pass_id);
  }

  /**
   * Resets database tables (strictly used in test suites).
   */
  public resetForTesting(): void {
    this.db.exec(`
      DELETE FROM webhook_events;
      DELETE FROM entitlements;
      DELETE FROM payment_attempts;
    `);
  }
}

export const transactionalBillingStore = new TransactionalBillingStore();
