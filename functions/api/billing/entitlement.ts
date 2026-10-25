// Cloudflare Pages Function: /api/billing/entitlement
import { jobPassService } from '../../../src/lib/billing/jobPassService';

export const onRequest = async (context: any) => {
  try {
    const authHeader = context.request.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const sessionHeader = context.request.headers.get('x-purchaser-session') || undefined;

    const url = new URL(context.request.url);
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
