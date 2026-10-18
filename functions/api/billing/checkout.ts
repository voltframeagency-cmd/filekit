// Cloudflare Pages Function: /api/billing/checkout
import { jobPassService } from '../../../src/lib/billing/jobPassService';

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const { purchaserSessionId, customerEmail, countryCode, successUrl, cancelUrl } = body;

    if (!purchaserSessionId) {
      return new Response(JSON.stringify({ success: false, error: 'purchaserSessionId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(context.request.url);
    const origin = url.origin || 'https://filekit.app';
    const effectiveSuccessUrl = successUrl || `${origin}/billing/success`;
    const effectiveCancelUrl = cancelUrl || `${origin}/billing/cancel`;

    const checkout = await jobPassService.createCheckout({
      purchaserSessionId,
      customerEmail,
      countryCode,
      successUrl: effectiveSuccessUrl,
      cancelUrl: effectiveCancelUrl,
    });

    return new Response(JSON.stringify({ success: true, ...checkout }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Checkout creation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
