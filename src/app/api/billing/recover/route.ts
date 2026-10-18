import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { checkoutSessionId, purchaserSessionId, email } = body;

    if (!checkoutSessionId && !purchaserSessionId && !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one recovery identifier (checkoutSessionId, purchaserSessionId, or email) is required',
        },
        { status: 400 }
      );
    }

    // Server verifies payment record before granting access
    // A success URL query param alone never grants access!
    const result = jobPassService.recoverPurchase({
      checkoutSessionId,
      purchaserSessionId,
      email,
    });

    if (!result.recovered) {
      return NextResponse.json(
        {
          success: false,
          recovered: false,
          error: result.error || 'Unable to recover active pass',
        },
        { status: 404 }
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
