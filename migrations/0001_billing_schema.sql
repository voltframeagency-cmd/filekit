-- FileKit Billing & Entitlement Database Schema (Cloudflare D1 / SQLite)
-- Enforces transactional uniqueness and persistence across serverless executions.

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
CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements(purchaser_email);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_session ON payment_attempts(purchaser_session_id);
