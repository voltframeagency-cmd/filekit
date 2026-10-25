/**
 * Secure Purchaser Session Authentication
 * Establishes purchaser identity through server-issued, cryptographically signed sessions.
 * Never authenticates using raw caller-controlled header or body session IDs.
 */

import crypto from 'node:crypto';
import { getBillingConfig } from './billingConfig';

export interface VerifiedSession {
  authenticated: boolean;
  sessionId?: string;
  issuedAt?: number;
  error?: 'MISSING_SESSION' | 'MALFORMED_TOKEN' | 'INVALID_SIGNATURE' | 'SESSION_EXPIRED';
}

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Issues a cryptographically signed session token for a purchaser.
 */
export function issuePurchaserSession(customSessionId?: string): {
  sessionId: string;
  sessionToken: string;
  cookieHeader: string;
} {
  const config = getBillingConfig();
  const sessionId = customSessionId || `sess_${crypto.randomBytes(16).toString('hex')}`;
  const timestamp = Date.now();

  const hmac = crypto.createHmac('sha256', config.signingSecret);
  hmac.update(`${sessionId}:${timestamp}`);
  const signature = hmac.digest('base64url');

  const sessionToken = `${sessionId}.${timestamp}.${signature}`;
  const cookieHeader = `filekit_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; Secure`;

  return {
    sessionId,
    sessionToken,
    cookieHeader,
  };
}

/**
 * Verifies a server-issued session token in constant time.
 */
export function verifySessionToken(token: string, maxAgeMs: number = SESSION_MAX_AGE_MS): VerifiedSession {
  if (!token || typeof token !== 'string') {
    return { authenticated: false, error: 'MISSING_SESSION' };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { authenticated: false, error: 'MALFORMED_TOKEN' };
  }

  const [sessionId, timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { authenticated: false, error: 'MALFORMED_TOKEN' };
  }

  const now = Date.now();
  if (now < timestamp || now - timestamp > maxAgeMs) {
    return { authenticated: false, error: 'SESSION_EXPIRED' };
  }

  const config = getBillingConfig();
  const hmac = crypto.createHmac('sha256', config.signingSecret);
  hmac.update(`${sessionId}:${timestamp}`);
  const expectedSignature = hmac.digest('base64url');

  const expectedBuf = Buffer.from(expectedSignature);
  const providedBuf = Buffer.from(providedSignature);

  if (expectedBuf.length !== providedBuf.length || !crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    return { authenticated: false, error: 'INVALID_SIGNATURE' };
  }

  return {
    authenticated: true,
    sessionId,
    issuedAt: timestamp,
  };
}

/**
 * Extracts and verifies purchaser identity from standard Web Request headers or cookies.
 * Strictly ignores unauthenticated raw session ID strings.
 */
export function authenticateRequestSession(request: Request): VerifiedSession {
  // 1. Check signed authorization header
  const authHeader = request.headers.get('x-purchaser-session-token');
  if (authHeader) {
    const verified = verifySessionToken(authHeader);
    if (verified.authenticated) return verified;
  }

  // 2. Check signed cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith('filekit_session='));

  if (sessionCookie) {
    const token = sessionCookie.slice('filekit_session='.length);
    const verified = verifySessionToken(token);
    if (verified.authenticated) return verified;
  }

  return { authenticated: false, error: 'MISSING_SESSION' };
}
