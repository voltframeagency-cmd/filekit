import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';
import { authenticateRequestSession, verifySessionToken } from '@/lib/billing/sessionAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { checkoutSessionId, email, emailVerificationProof, sessionToken } = body;

    // 1. Authenticate purchaser identity via server-issued session token
    let verifiedSessionId: string | undefined;

    if (sessionToken) {
      const check = verifySessionToken(sessionToken);
      if (check.authenticated && check.sessionId) {
        verifiedSessionId = check.sessionId;
      }
    }

    if (!verifiedSessionId) {
      const auth = authenticateRequestSession(req);
      if (auth.authenticated && auth.sessionId) {
        verifiedSessionId = auth.sessionId;
      }
    }

    if (!verifiedSessionId && !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTHENTICATED_SESSION_REQUIRED',
          message: 'An authenticated, server-issued purchaser session token is required to recover a pass.',
        },
        { status: 401 }
      );
    }

    // 2. Server-side recovery: pass is strictly bound to original purchase session
    // Never rebinds to an arbitrary session ID!
    const result = await jobPassService.recoverPurchase({
      verifiedSessionId,
      checkoutSessionId,
      email,
      emailVerificationProof,
    });

    if (!result.recovered) {
      const statusCode =
        result.error === 'UNAUTHORIZED_SESSION_OWNERSHIP' || result.error === 'UNVERIFIED_EMAIL_IDENTITY'
          ? 403
          : 404;

      return NextResponse.json(
        {
          success: false,
          recovered: false,
          error: result.error || 'Unable to recover active pass',
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      recovered: true,
      token: result.token,
      passId: result.pass?.passId,
      expiresAt: result.pass?.expiresAt,
      remainingSeconds: result.pass ? Math.max(0, Math.floor((result.pass.expiresAt - Date.now()) / 1000)) : 0,
    });
  } catch (err: any) {
    console.error('Purchase recovery error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Recovery failed' },
      { status: 500 }
    );
  }
}
