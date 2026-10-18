/**
 * Entitlement Guard for Conversion Handlers
 * Wires server-side Job Pass enforcement directly into actual premium processing routes.
 * Preserves the agreed free/paid feature matrix.
 */

import { NextRequest, NextResponse } from 'next/server';
import { FeatureIdentifier, FEATURE_MATRIX } from './types';
import { jobPassService } from './jobPassService';

export interface GuardAuthorizationResult {
  authorized: boolean;
  passId?: string;
  response?: NextResponse;
}

export async function assertFeatureEntitlement(
  req: NextRequest,
  feature: FeatureIdentifier,
  metadata?: {
    fileSizeBytes?: number;
    isBatch?: boolean;
    pageCount?: number;
  }
): Promise<GuardAuthorizationResult> {
  // 1. Evaluate whether this specific request exceeds free-tier boundary
  let effectiveFeature = feature;

  // If a standard office conversion exceeds 50MB, it qualifies as LARGE_FILE_EXPANDED
  if (feature === 'SERVER_OFFICE_CONVERSION' && metadata?.fileSizeBytes && metadata.fileSizeBytes > 50 * 1024 * 1024) {
    effectiveFeature = 'LARGE_FILE_EXPANDED';
  }

  // If request contains multiple files, it qualifies as BATCH_PROCESSING_HIGH_VOLUME
  if (metadata?.isBatch) {
    effectiveFeature = 'BATCH_PROCESSING_HIGH_VOLUME';
  }

  const rule = FEATURE_MATRIX[effectiveFeature] || FEATURE_MATRIX.LOCAL_CONVERSION_STANDARD;

  // If feature does not require pass, authorize immediately
  if (!rule.requiresJobPass) {
    return { authorized: true };
  }

  // 2. Extract entitlement credentials from request
  const authHeader = req.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  const cookieToken = req.cookies.get('filekit_pass_token')?.value;
  const sessionHeader = req.headers.get('x-purchaser-session') || undefined;

  const token = bearerToken || cookieToken;

  // 3. Verify server-side access (enforces backing database record & 7-day validity)
  const check = jobPassService.verifyAccess({
    token,
    purchaserSessionId: sessionHeader,
  });

  if (check.hasActivePass) {
    return { authorized: true, passId: check.passId };
  }

  // 4. Return structured 402 Payment Required
  const paymentRequiredResponse = NextResponse.json(
    {
      success: false,
      error: 'JOB_PASS_REQUIRED',
      feature: effectiveFeature,
      message: `Access denied. ${rule.description} requires an active FileKit 7-Day Job Pass (€4.90 one-time).`,
      pricing: {
        amountEUR: 4.90,
        currency: 'EUR',
        durationDays: 7,
        renewPolicy: 'Never auto-renews • One-time checkout',
      },
      checkoutEndpoint: '/api/billing/checkout',
      reason: check.error || 'NO_ACTIVE_PASS',
    },
    { status: 402 }
  );

  return {
    authorized: false,
    response: paymentRequiredResponse,
  };
}
