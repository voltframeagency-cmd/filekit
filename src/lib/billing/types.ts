/**
 * FileKit Billing Domain & Entitlement Types
 * Strictly enforces server-controlled pricing, 7-day payment-anchored expiry,
 * atomic records, and decoupled tax configurations.
 */

export const JOB_PASS_PRICE_CENTS = 490; // €4.90 strictly enforced server-side
export const JOB_PASS_CURRENCY = 'eur';
export const JOB_PASS_DURATION_DAYS = 7;
export const JOB_PASS_DURATION_MS = JOB_PASS_DURATION_DAYS * 24 * 60 * 60 * 1000;

export type EntitlementStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING';

export type PaymentAttemptStatus =
  | 'INITIATED'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELED'
  | 'REFUNDED';

export type TaxTreatment = 'INCLUSIVE' | 'EXCLUSIVE' | 'EXEMPT' | 'DYNAMIC_PROVIDER';

export interface TaxConfiguration {
  treatment: TaxTreatment;
  /** Percentage e.g. 25.0 for 25% or 0 for exempt. Configurable per jurisdiction. */
  ratePercentage?: number;
  /** Tax jurisdiction or tax code e.g. "SE", "DE", "FR", "US-CA", "NONE" */
  jurisdictionCode?: string;
  /** Description for invoices/receipts */
  taxLabel?: string;
}

export interface PaymentAttemptRecord {
  attemptId: string;
  checkoutSessionId: string;
  paymentIntentId?: string;
  purchaserSessionId: string;
  purchaserEmail?: string;
  amountCents: number;
  currency: string;
  status: PaymentAttemptStatus;
  taxConfig: TaxConfiguration;
  failureReason?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface JobPassEntitlementRecord {
  passId: string;
  purchaserSessionId: string;
  purchaserEmail?: string;
  sourceCheckoutSessionId: string;
  sourcePaymentIntentId: string;
  status: EntitlementStatus;
  /** Confirmed payment timestamp from provider */
  activatedAt: number;
  /** Strictly anchored: activatedAt + 7 * 86,400,000 ms */
  expiresAt: number;
  revokedAt?: number;
  revocationReason?: 'REFUND' | 'CHARGEBACK' | 'MANUAL_REVOCATION';
  createdAt: number;
  updatedAt: number;
}

export interface WebhookEventAudit {
  eventId: string;
  eventType: string;
  underlyingPurchaseId: string; // e.g. paymentIntentId or checkoutSessionId
  processedAt: number;
  status: 'PROCESSED' | 'DUPLICATE_IGNORED' | 'FAILED';
}

export interface EntitlementCheckResult {
  hasActivePass: boolean;
  status: EntitlementStatus | 'NO_PASS';
  passId?: string;
  expiresAt?: number;
  remainingSeconds?: number;
  error?: string;
}

/**
 * Agreed Commercial Boundary & Feature Matrix
 * Processing location alone does NOT determine pricing!
 * Standard client-safe tools remain 100% free with no account.
 * Gated features are defined by capability limits and high-intensity workloads.
 */
export type FeatureIdentifier =
  | 'LOCAL_CONVERSION_STANDARD'     // FREE €0 (client-side)
  | 'SERVER_OFFICE_CONVERSION'       // Server Office-to-PDF within free tier or pass
  | 'SERVER_OCR_EXTENDED'            // Multi-page batch OCR (requires pass)
  | 'BATCH_PROCESSING_HIGH_VOLUME'   // High-volume multi-file batch (requires pass)
  | 'LARGE_FILE_EXPANDED'            // Files exceeding standard size threshold (requires pass)
  | 'UNLIMITED_BURST_PROCESSING';    // Rapid sequential server tasks (requires pass)

export interface FeatureAccessRule {
  feature: FeatureIdentifier;
  requiresJobPass: boolean;
  description: string;
}

export const FEATURE_MATRIX: Record<FeatureIdentifier, FeatureAccessRule> = {
  LOCAL_CONVERSION_STANDARD: {
    feature: 'LOCAL_CONVERSION_STANDARD',
    requiresJobPass: false,
    description: 'Unlimited standard client-side conversions (100% free, no account, no card)',
  },
  SERVER_OFFICE_CONVERSION: {
    feature: 'SERVER_OFFICE_CONVERSION',
    requiresJobPass: false,
    description: 'Single standard Office conversions within fair-use staging thresholds',
  },
  SERVER_OCR_EXTENDED: {
    feature: 'SERVER_OCR_EXTENDED',
    requiresJobPass: true,
    description: 'High-volume server OCR with searchability layer & multi-language extraction',
  },
  BATCH_PROCESSING_HIGH_VOLUME: {
    feature: 'BATCH_PROCESSING_HIGH_VOLUME',
    requiresJobPass: true,
    description: 'Multi-file simultaneous batch processing pipeline',
  },
  LARGE_FILE_EXPANDED: {
    feature: 'LARGE_FILE_EXPANDED',
    requiresJobPass: true,
    description: 'Processing files exceeding standard 100MB client memory headroom',
  },
  UNLIMITED_BURST_PROCESSING: {
    feature: 'UNLIMITED_BURST_PROCESSING',
    requiresJobPass: true,
    description: 'Rapid sequential server tasks with zero queue delay',
  },
};
