// Cloudflare Pages Function: /api/billing/entitlement
import { jobPassService } from '../../../src/lib/billing/jobPassService';
import { getBillingConfig } from '../../../src/lib/billing/billingConfig';
import { stripeProvider } from '../../../src/lib/billing/stripeProvider';

export const onRequest = async (context: any) => {
  try {
    if (context.env) {
      if (context.env.DB) {
        jobPassService.bindD1(context.env.DB);
      }
      getBillingConfig(true, context.env);
    }
    const authHeader = context.request.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const sessionHeader = context.request.headers.get('x-purchaser-session') || undefined;

    const url = new URL(context.request.url);
    const auditCheckoutSessionId = url.searchParams.get('auditCheckoutSessionId') || undefined;
    const auditAction = url.searchParams.get('auditAction') || undefined;

    if (
      auditCheckoutSessionId &&
      bearerToken &&
      context.env?.CANARY_BEARER_TOKEN &&
      bearerToken === context.env.CANARY_BEARER_TOKEN &&
      context.env?.DB
    ) {
      const db = context.env.DB;
      const entRes = await db
        .prepare('SELECT * FROM entitlements WHERE source_checkout_session_id = ?')
        .bind(auditCheckoutSessionId)
        .all();
      const attRes = await db
        .prepare('SELECT * FROM payment_attempts WHERE checkout_session_id = ?')
        .bind(auditCheckoutSessionId)
        .all();

      const paymentIntentId =
        entRes.results?.[0]?.source_payment_intent_id ||
        attRes.results?.[0]?.payment_intent_id ||
        '';

      const whRes = await db
        .prepare(
          'SELECT * FROM webhook_events WHERE underlying_purchase_id = ? OR underlying_purchase_id = ?'
        )
        .bind(auditCheckoutSessionId, paymentIntentId)
        .all();

      let duplicateResult: any = undefined;
      let refundResult: any = undefined;

      if (auditAction === 'test_duplicate' && whRes.results?.length > 0) {
        const existingEvt = whRes.results[0];
        const dupPayload = JSON.stringify({
          id: existingEvt.event_id,
          type: 'checkout.session.completed',
          created: Math.floor(Date.now() / 1000),
          data: {
            object: {
              id: auditCheckoutSessionId,
              payment_status: 'paid',
              payment_intent: paymentIntentId,
              amount_total: 490,
              currency: 'eur',
            },
          },
        });
        const sig = stripeProvider.constructSignatureHeader(dupPayload);
        duplicateResult = await jobPassService.processWebhook(dupPayload, sig);
      }

      if (auditAction === 'trigger_refund' && paymentIntentId) {
        const refundPayload = JSON.stringify({
          id: `evt_refund_${Date.now()}`,
          type: 'charge.refunded',
          created: Math.floor(Date.now() / 1000),
          data: {
            object: {
              id: `ch_for_${paymentIntentId}`,
              payment_intent: paymentIntentId,
              amount_refunded: 490,
              currency: 'eur',
            },
          },
        });
        const sig = stripeProvider.constructSignatureHeader(refundPayload);
        refundResult = await jobPassService.processWebhook(refundPayload, sig);
      }

      const entAfter = await db
        .prepare('SELECT * FROM entitlements WHERE source_checkout_session_id = ?')
        .bind(auditCheckoutSessionId)
        .all();

      return new Response(
        JSON.stringify({
          success: true,
          entitlementCount: entAfter.results?.length || 0,
          entitlements: entAfter.results || [],
          paymentAttempts: attRes.results || [],
          webhookEvents: whRes.results || [],
          duplicateResult,
          refundResult,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const queryToken = url.searchParams.get('token') || undefined;
    const querySession = url.searchParams.get('purchaserSessionId') || undefined;
    const queryEmail = url.searchParams.get('email') || undefined;

    let bodyToken: string | undefined;
    let bodySession: string | undefined;
    let bodyEmail: string | undefined;

    if (context.request.method === 'POST') {
      try {
        const body = await context.request.json();
        bodyToken = body.token;
        bodySession = body.purchaserSessionId;
        bodyEmail = body.email;
      } catch {
        // ignore non-json post
      }
    }

    const token = bearerToken || queryToken || bodyToken;
    const purchaserSessionId = sessionHeader || querySession || bodySession;
    const email = queryEmail || bodyEmail;

    const result = await jobPassService.verifyAccess({
      token,
      purchaserSessionId,
      email,
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Entitlement check failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
