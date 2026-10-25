// Cloudflare Pages Function: /api/billing/checkout
import { jobPassService } from '../../../src/lib/billing/jobPassService';
import { issuePurchaserSession } from '../../../src/lib/billing/sessionAuth';

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { purchaserSessionId, customerEmail, countryCode, successUrl, cancelUrl } = body;

    // Issue or sign authenticated purchaser session
    const issuedSession = issuePurchaserSession(purchaserSessionId);
    const effectiveSessionId = issuedSession.sessionId;

    const url = new URL(context.request.url);
    const origin = url.origin || 'https://filekit.app';
    const effectiveSuccessUrl = successUrl || `${origin}/billing/success`;
    const effectiveCancelUrl = cancelUrl || `${origin}/billing/cancel`;

    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: effectiveSessionId,
      customerEmail,
      countryCode,
      successUrl: effectiveSuccessUrl,
      cancelUrl: effectiveCancelUrl,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Set-Cookie': issuedSession.cookieHeader,
    };

    return new Response(
      JSON.stringify({
        success: true,
        ...checkout,
        purchaserSessionId: effectiveSessionId,
        sessionToken: issuedSession.sessionToken,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Checkout creation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
