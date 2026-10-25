import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';
import { issuePurchaserSession } from '@/lib/billing/sessionAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      purchaserSessionId,
      customerEmail,
      countryCode,
      successUrl,
      cancelUrl,
    } = body;

    // Issue or sign authenticated purchaser session
    const issuedSession = issuePurchaserSession(purchaserSessionId);
    const effectiveSessionId = issuedSession.sessionId;

    const origin = req.headers.get('origin') || 'https://filekit.app';
    const effectiveSuccessUrl = successUrl || `${origin}/billing/success`;
    const effectiveCancelUrl = cancelUrl || `${origin}/billing/cancel`;

    // Pricing is strictly server-controlled (€4.90); client-supplied amounts are ignored
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId: effectiveSessionId,
      customerEmail,
      countryCode,
      successUrl: effectiveSuccessUrl,
      cancelUrl: effectiveCancelUrl,
    });

    const res = NextResponse.json({
      success: true,
      ...checkout,
      purchaserSessionId: effectiveSessionId,
      sessionToken: issuedSession.sessionToken,
    });

    res.headers.set('Set-Cookie', issuedSession.cookieHeader);

    return res;
  } catch (err: any) {
    console.error('Checkout creation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
