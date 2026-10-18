import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { checkoutSessionId, email, emailVerificationProof } = body;

    // Authenticated session is extracted from secure header or signed cookie
    const authSessionHeader = req.headers.get('x-purchaser-session');
    const authSessionCookie = req.cookies.get('filekit_session')?.value;
    const callerSuppliedSession = body.purchaserSessionId;

    const authenticatedSessionId = authSessionHeader || authSessionCookie || callerSuppliedSession;

    if (!authenticatedSessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTHENTICATED_SESSION_REQUIRED',
          message: 'An authenticated purchaser session is required to recover a pass.',
        },
        { status: 401 }
      );
    }

    // Server-side authentication and ownership check
    // Pass is NEVER rebound to an arbitrary session ID!
    const result = jobPassService.recoverPurchase({
      authenticatedSessionId,
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
