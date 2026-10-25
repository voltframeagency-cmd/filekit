// Cloudflare Pages Function: /api/billing/recover
import { jobPassService } from '../../../src/lib/billing/jobPassService';
import { authenticateRequestSession, verifySessionToken } from '../../../src/lib/billing/sessionAuth';
import { getBillingConfig } from '../../../src/lib/billing/billingConfig';

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { checkoutSessionId, email, emailVerificationProof, sessionToken } = body;

    if (context.env) {
      if (context.env.DB) {
        jobPassService.bindD1(context.env.DB);
      }
      getBillingConfig(true, context.env);
    }

    // Authenticate purchaser session token
    let verifiedSessionId: string | undefined;

    if (sessionToken) {
      const check = verifySessionToken(sessionToken);
      if (check.authenticated && check.sessionId) {
        verifiedSessionId = check.sessionId;
      }
    }

    if (!verifiedSessionId) {
      const auth = authenticateRequestSession(context.request);
      if (auth.authenticated && auth.sessionId) {
        verifiedSessionId = auth.sessionId;
      }
    }

    if (!verifiedSessionId && !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'AUTHENTICATED_SESSION_REQUIRED',
          message: 'An authenticated, server-issued purchaser session token is required to recover a pass.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await jobPassService.recoverPurchase({
      verifiedSessionId,
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
