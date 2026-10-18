// Cloudflare Pages Function: /api/billing/recover
import { jobPassService } from '../../../src/lib/billing/jobPassService';

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { checkoutSessionId, email, emailVerificationProof } = body;

    const authSessionHeader = context.request.headers.get('x-purchaser-session');
    const callerSuppliedSession = body.purchaserSessionId;
    const authenticatedSessionId = authSessionHeader || callerSuppliedSession;

    if (!authenticatedSessionId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'AUTHENTICATED_SESSION_REQUIRED',
          message: 'An authenticated purchaser session is required to recover a pass.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = jobPassService.recoverPurchase({
      authenticatedSessionId,
      checkoutSessionId,
      email,
      emailVerificationProof,
    });

    if (!result.recovered) {
      const status =
        result.error === 'UNAUTHORIZED_SESSION_OWNERSHIP' || result.error === 'UNVERIFIED_EMAIL_IDENTITY'
          ? 403
          : 404;

      return new Response(
        JSON.stringify({
          success: false,
          recovered: false,
          error: result.error || 'Unable to recover active pass',
        }),
        {
          status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        recovered: true,
        token: result.token,
        passId: result.pass?.passId,
        expiresAt: result.pass?.expiresAt,
        remainingSeconds: result.pass ? Math.max(0, Math.floor((result.pass.expiresAt - Date.now()) / 1000)) : 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Recovery failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
