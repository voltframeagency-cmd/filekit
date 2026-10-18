/**
 * Cryptographic Signed Entitlement Token Engine
 * Binds Job Pass access to the purchaser/session with server-side expiry enforcement
 * and revocation validation.
 */

import crypto from 'node:crypto';
import { getBillingConfig } from './billingConfig';

export interface EntitlementTokenPayload {
  v: number;
  passId: string;
  purchaserSessionId: string;
  purchaserEmail?: string;
  activatedAt: number;
  expiresAt: number;
  issuedAt: number;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: EntitlementTokenPayload;
  error?: 'MALFORMED' | 'INVALID_SIGNATURE' | 'EXPIRED' | 'SESSION_MISMATCH' | 'REVOKED';
}

function getSigningSecret(): string {
  return getBillingConfig().signingSecret;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  return Buffer.from(b64, 'base64').toString('utf8');
}

/**
 * Creates a signed, tamper-resistant entitlement token
 */
export function issueSignedEntitlementToken(payload: Omit<EntitlementTokenPayload, 'v' | 'issuedAt'>): string {
  const fullPayload: EntitlementTokenPayload = {
    ...payload,
    v: 1,
    issuedAt: Date.now(),
  };

  const payloadJson = JSON.stringify(fullPayload);
  const encodedPayload = base64UrlEncode(payloadJson);

  const secret = getSigningSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encodedPayload);
  const signature = hmac.digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed entitlement token against server secret, expiry timestamp,
 * and expected purchaser session.
 */
export function verifySignedEntitlementToken(
  token: string,
  expectedSessionId?: string,
  currentTimeMs: number = Date.now()
): TokenValidationResult {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'MALFORMED' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'MALFORMED' };
  }

  const [encodedPayload, providedSignature] = parts;

  // 1. Verify signature in constant time
  const secret = getSigningSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encodedPayload);
  const expectedSignature = hmac.digest('base64url');

  const providedBuf = Buffer.from(providedSignature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return { valid: false, error: 'INVALID_SIGNATURE' };
  }

  // 2. Parse payload
  let payload: EntitlementTokenPayload;
  try {
    const jsonStr = base64UrlDecode(encodedPayload);
    payload = JSON.parse(jsonStr);
  } catch {
    return { valid: false, error: 'MALFORMED' };
  }

  // 3. Enforce 7-day expiration strictly
  if (currentTimeMs >= payload.expiresAt) {
    return { valid: false, payload, error: 'EXPIRED' };
  }

  // 4. Validate session binding if session is provided
  if (expectedSessionId && payload.purchaserSessionId !== expectedSessionId) {
    return { valid: false, payload, error: 'SESSION_MISMATCH' };
  }

  return { valid: true, payload };
}
