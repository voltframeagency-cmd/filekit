/**
 * Transactional Durable Billing Store (Cloudflare D1 & SQLite)
 * Provides ACID transactional guarantees, Cloudflare D1 binding support,
 * and early revocation persistence.
 */

import {
  PaymentAttemptRecord,
  JobPassEntitlementRecord,
  WebhookEventAudit,
  EntitlementStatus,
} from './types';

// D1 Interface for Cloudflare Workers / Pages
export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  run(): Promise<{ success: boolean; meta: any }>;
  all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }>;
  first<T = any>(colName?: string): Promise<T | null>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = any>(statements: D1PreparedStatement[]): Promise<any[]>;
  exec(query: string): Promise<any>;
}

export class TransactionalBillingStore {
  private d1Db?: D1Database;
  private sqliteDb?: any; // node:sqlite DatabaseSync

  constructor(d1Binding?: D1Database, customSqlitePath?: string) {
    if (d1Binding) {
      this.d1Db = d1Binding;
    } else {
      // Lazy load node:sqlite in Node.js environments
      try {
        const { DatabaseSync } = require('node:sqlite');
        const path = require('node:path');
        const fs = require('node:fs');

        if (customSqlitePath === ':memory:') {
          this.sqliteDb = new DatabaseSync(':memory:');
        } else {
          const defaultPath = path.join(process.cwd(), '.next', 'cache', 'filekit-billing.sqlite');
          const dbPath = customSqlitePath || process.env.BILLING_DB_PATH || defaultPath;
          const dir = path.dirname(dbPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          this.sqliteDb = new DatabaseSync(dbPath);
        }
        this.initializeSqliteSchema();
      } catch (err: any) {
        // In Cloudflare edge environment without sqlite, D1 binding must be passed via withD1()
      }
    }
  }

  /**
   * Clones store with Cloudflare D1 database binding
   */
  public withD1(db: D1Database): TransactionalBillingStore {
    return new TransactionalBillingStore(db);
  }

  private initializeSqliteSchema() {
    if (!this.sqliteDb) return;
    this.sqliteDb.exec(`
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

      CREATE TABLE IF NOT EXISTS revoked_purchases (
        identifier TEXT PRIMARY KEY,
        reason TEXT NOT NULL,
        revoked_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_entitlements_session ON entitlements(purchaser_session_id);
      CREATE INDEX IF NOT EXISTS idx_payment_attempts_session ON payment_attempts(purchaser_session_id);
      CREATE INDEX IF NOT EXISTS idx_revoked_purchases ON revoked_purchases(identifier);
    `);
  }

  /**
   * Records a new payment attempt.
   */
  public async recordPaymentAttempt(attempt: PaymentAttemptRecord): Promise<void> {
    const sql = `
      INSERT INTO payment_attempts (
        attempt_id, checkout_session_id, payment_intent_id, purchaser_session_id,
        purchaser_email, amount_cents, currency, status, tax_config_json,
        failure_reason, created_at, updated_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
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
      attempt.completedAt || null,
    ];

    if (this.d1Db) {
      await this.d1Db.prepare(sql).bind(...params).run();
    } else if (this.sqliteDb) {
      this.sqliteDb.prepare(sql).run(...params);
    }
  }

  /**
   * Updates an existing payment attempt.
   */
  public async updatePaymentAttempt(
    identifier: string,
    updates: Partial<PaymentAttemptRecord>
  ): Promise<PaymentAttemptRecord | null> {
    const existing = await this.findPaymentAttempt(identifier);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    const sql = `
      UPDATE payment_attempts SET
        payment_intent_id = ?,
        status = ?,
        failure_reason = ?,
        completed_at = ?,
        updated_at = ?
      WHERE attempt_id = ?
    `;
    const params = [
      updated.paymentIntentId || null,
      updated.status,
      updated.failureReason || null,
      updated.completedAt || null,
      updated.updatedAt,
      existing.attemptId,
    ];

    if (this.d1Db) {
      await this.d1Db.prepare(sql).bind(...params).run();
    } else if (this.sqliteDb) {
      this.sqliteDb.prepare(sql).run(...params);
    }

    return updated;
  }

  /**
   * Finds a payment attempt by attemptId, checkoutSessionId, or paymentIntentId.
   */
  public async findPaymentAttempt(id: string): Promise<PaymentAttemptRecord | null> {
    const sql = `
      SELECT * FROM payment_attempts
      WHERE attempt_id = ? OR checkout_session_id = ? OR payment_intent_id = ?
      LIMIT 1
    `;
    let row: any = null;

    if (this.d1Db) {
      row = await this.d1Db.prepare(sql).bind(id, id, id).first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sql).get(id, id, id);
    }

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
  public async recordPaymentFailure(identifier: string, reason: string): Promise<boolean> {
    const attempt = await this.findPaymentAttempt(identifier);
    if (!attempt) return false;

    await this.updatePaymentAttempt(attempt.attemptId, {
      status: 'FAILED',
      failureReason: reason,
    });
    return true;
  }

  /**
   * Checks if an event has already been successfully processed.
   * Does NOT mark it processed prematurely.
   */
  public async isEventAlreadyProcessed(eventId: string): Promise<boolean> {
    const sql = `SELECT event_id FROM webhook_events WHERE event_id = ? AND status = 'PROCESSED' LIMIT 1`;
    let row: any = null;
    if (this.d1Db) {
      row = await this.d1Db.prepare(sql).bind(eventId).first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sql).get(eventId);
    }
    return Boolean(row);
  }

  /**
   * Persists an early refund/dispute revocation even before entitlement creation.
   * Ensures that out-of-order success events can never grant active access.
   */
  public async recordRevocation(identifier: string, reason: string): Promise<void> {
    const now = Date.now();
    const sqlRevoke = `
      INSERT OR REPLACE INTO revoked_purchases (identifier, reason, revoked_at)
      VALUES (?, ?, ?)
    `;

    if (this.d1Db) {
      await this.d1Db.prepare(sqlRevoke).bind(identifier, reason, now).run();
    } else if (this.sqliteDb) {
      this.sqliteDb.prepare(sqlRevoke).run(identifier, reason, now);
    }

    // Also revoke in entitlements if already exists
    await this.revokeEntitlementBySource(identifier, reason as any);
  }

  /**
   * Checks if a purchase has already been revoked.
   */
  public async isPurchaseRevoked(identifier: string): Promise<{ revoked: boolean; reason?: string }> {
    const sql = `SELECT reason FROM revoked_purchases WHERE identifier = ? LIMIT 1`;
    let row: any = null;
    if (this.d1Db) {
      row = await this.d1Db.prepare(sql).bind(identifier).first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sql).get(identifier);
    }
    if (row) {
      return { revoked: true, reason: row.reason };
    }
    return { revoked: false };
  }

  /**
   * ATOMIC WEBHOOK COMMIT
   * Commits entitlement creation, attempt update, and webhook audit in ONE single atomic transaction.
   * If any step fails, the entire transaction rolls back and the event is NOT marked PROCESSED.
   */
  public async commitWebhookSuccess(params: {
    eventAudit: WebhookEventAudit;
    entitlement: JobPassEntitlementRecord;
    attemptUpdates: {
      attemptId: string;
      paymentIntentId: string;
      completedAt: number;
    };
  }): Promise<void> {
    const { eventAudit, entitlement, attemptUpdates } = params;

    const sqlEntitlement = `
      INSERT INTO entitlements (
        pass_id, purchaser_session_id, purchaser_email, source_checkout_session_id,
        source_payment_intent_id, status, activated_at, expires_at,
        revoked_at, revocation_reason, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const paramsEntitlement = [
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
      entitlement.updatedAt,
    ];

    const sqlAttempt = `
      UPDATE payment_attempts SET
        status = 'SUCCEEDED',
        payment_intent_id = ?,
        completed_at = ?,
        updated_at = ?
      WHERE attempt_id = ?
    `;
    const paramsAttempt = [
      attemptUpdates.paymentIntentId,
      attemptUpdates.completedAt,
      Date.now(),
      attemptUpdates.attemptId,
    ];

    const sqlWebhook = `
      INSERT INTO webhook_events (event_id, event_type, underlying_purchase_id, processed_at, status)
      VALUES (?, ?, ?, ?, 'PROCESSED')
    `;
    const paramsWebhook = [
      eventAudit.eventId,
      eventAudit.eventType,
      eventAudit.underlyingPurchaseId,
      eventAudit.processedAt,
    ];

    if (this.d1Db) {
      // Cloudflare D1 Atomic Batch Transaction
      await this.d1Db.batch([
        this.d1Db.prepare(sqlEntitlement).bind(...paramsEntitlement),
        this.d1Db.prepare(sqlAttempt).bind(...paramsAttempt),
        this.d1Db.prepare(sqlWebhook).bind(...paramsWebhook),
      ]);
    } else if (this.sqliteDb) {
      // SQLite Transaction with Rollback on error
      this.sqliteDb.exec('BEGIN TRANSACTION;');
      try {
        this.sqliteDb.prepare(sqlEntitlement).run(...paramsEntitlement);
        this.sqliteDb.prepare(sqlAttempt).run(...paramsAttempt);
        this.sqliteDb.prepare(sqlWebhook).run(...paramsWebhook);
        this.sqliteDb.exec('COMMIT;');
      } catch (err) {
        this.sqliteDb.exec('ROLLBACK;');
        throw err;
      }
    }
  }

  /**
   * Checks if underlying payment has resulted in an entitlement.
   */
  public async isUnderlyingPurchaseFulfilled(underlyingId: string): Promise<{ fulfilled: boolean; passId?: string }> {
    const sql = `
      SELECT pass_id FROM entitlements
      WHERE source_checkout_session_id = ? OR source_payment_intent_id = ?
      LIMIT 1
    `;
    let row: any = null;
    if (this.d1Db) {
      row = await this.d1Db.prepare(sql).bind(underlyingId, underlyingId).first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sql).get(underlyingId, underlyingId);
    }
    if (row) {
      return { fulfilled: true, passId: row.pass_id };
    }
    return { fulfilled: false };
  }

  /**
   * Retrieves an entitlement by passId.
   */
  public async getEntitlement(passId: string, currentTimeMs: number = Date.now()): Promise<JobPassEntitlementRecord | null> {
    const sql = `SELECT * FROM entitlements WHERE pass_id = ? LIMIT 1`;
    let row: any = null;
    if (this.d1Db) {
      row = await this.d1Db.prepare(sql).bind(passId).first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sql).get(passId);
    }
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
      const updateSql = `UPDATE entitlements SET status = 'EXPIRED', updated_at = ? WHERE pass_id = ?`;
      if (this.d1Db) {
        await this.d1Db.prepare(updateSql).bind(currentTimeMs, pass.passId).run();
      } else if (this.sqliteDb) {
        this.sqliteDb.prepare(updateSql).run(currentTimeMs, pass.passId);
      }
    }

    return pass;
  }

  /**
   * Finds an active entitlement for a purchaser session or email.
   */
  public async getActiveEntitlementForPurchaser(
    purchaserSessionId?: string,
    email?: string,
    currentTimeMs: number = Date.now()
  ): Promise<JobPassEntitlementRecord | null> {
    const sql = `
      SELECT * FROM entitlements
      WHERE (purchaser_session_id = ? OR (purchaser_email IS NOT NULL AND LOWER(purchaser_email) = LOWER(?)))
        AND status = 'ACTIVE'
      ORDER BY expires_at DESC
      LIMIT 1
    `;
    let row: any = null;
    if (this.d1Db) {
      row = await this.d1Db.prepare(sql).bind(purchaserSessionId || '', email || '').first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sql).get(purchaserSessionId || '', email || '');
    }
    if (!row) return null;

    if (currentTimeMs >= row.expires_at) {
      const updateSql = `UPDATE entitlements SET status = 'EXPIRED', updated_at = ? WHERE pass_id = ?`;
      if (this.d1Db) {
        await this.d1Db.prepare(updateSql).bind(currentTimeMs, row.pass_id).run();
      } else if (this.sqliteDb) {
        this.sqliteDb.prepare(updateSql).run(currentTimeMs, row.pass_id);
      }
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
  public async revokeEntitlementBySource(
    sourcePaymentIntentOrSessionId: string,
    reason: 'REFUND' | 'CHARGEBACK' | 'MANUAL_REVOCATION'
  ): Promise<JobPassEntitlementRecord | null> {
    const sqlFind = `
      SELECT pass_id FROM entitlements
      WHERE source_checkout_session_id = ? OR source_payment_intent_id = ?
      LIMIT 1
    `;
    let row: any = null;
    if (this.d1Db) {
      row = await this.d1Db.prepare(sqlFind).bind(sourcePaymentIntentOrSessionId, sourcePaymentIntentOrSessionId).first();
    } else if (this.sqliteDb) {
      row = this.sqliteDb.prepare(sqlFind).get(sourcePaymentIntentOrSessionId, sourcePaymentIntentOrSessionId);
    }
    if (!row) return null;

    const now = Date.now();
    const sqlRevoke = `
      UPDATE entitlements SET
        status = 'REVOKED',
        revoked_at = ?,
        revocation_reason = ?,
        updated_at = ?
      WHERE pass_id = ?
    `;
    if (this.d1Db) {
      await this.d1Db.prepare(sqlRevoke).bind(now, reason, now, row.pass_id).run();
    } else if (this.sqliteDb) {
      this.sqliteDb.prepare(sqlRevoke).run(now, reason, now, row.pass_id);
    }

    return this.getEntitlement(row.pass_id);
  }

  /**
   * Resets database tables (strictly used in test suites).
   */
  public async resetForTesting(): Promise<void> {
    const sql = `
      DELETE FROM webhook_events;
      DELETE FROM entitlements;
      DELETE FROM payment_attempts;
      DELETE FROM revoked_purchases;
    `;
    if (this.d1Db) {
      await this.d1Db.exec(sql);
    } else if (this.sqliteDb) {
      this.sqliteDb.exec(sql);
    }
  }
}

export const transactionalBillingStore = new TransactionalBillingStore();
