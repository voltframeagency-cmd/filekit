import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      purchaserSessionId,
      customerEmail,
      countryCode,
      successUrl,
      cancelUrl,
    } = body;

    if (!purchaserSessionId) {
      return NextResponse.json(
        { success: false, error: 'purchaserSessionId is required' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || 'https://filekit.app';
    const effectiveSuccessUrl = successUrl || `${origin}/billing/success`;
    const effectiveCancelUrl = cancelUrl || `${origin}/billing/cancel`;

    // Pricing is strictly server-controlled (€4.90); client-supplied amounts are ignored
    const checkout = await jobPassService.createCheckout({
      purchaserSessionId,
      customerEmail,
      countryCode,
      successUrl: effectiveSuccessUrl,
      cancelUrl: effectiveCancelUrl,
    });

    return NextResponse.json({
      success: true,
      ...checkout,
    });
  } catch (err: any) {
    console.error('Checkout creation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
