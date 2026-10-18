// Cloudflare Pages Function: /api/billing/webhook
import { jobPassService } from '../../../src/lib/billing/jobPassService';

export const onRequestPost = async (context: any) => {
  try {
    const rawPayload = await context.request.text();
    const signatureHeader = context.request.headers.get('stripe-signature') || '';

    if (!signatureHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await jobPassService.processWebhook(rawPayload, signatureHeader);

    if (!result.success) {
      const status = result.reason === 'INVALID_SIGNATURE' ? 401 : 400;
      return new Response(JSON.stringify({ success: false, error: result.reason }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        received: true,
        reason: result.reason,
        eventType: result.eventType,
        passId: result.passId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Webhook failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
