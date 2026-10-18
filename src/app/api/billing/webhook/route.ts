import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.text();
    const signatureHeader = req.headers.get('stripe-signature') || '';

    if (!signatureHeader) {
      return NextResponse.json(
        { success: false, error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const result = await jobPassService.processWebhook(rawPayload, signatureHeader);

    if (!result.success) {
      const statusCode = result.reason === 'INVALID_SIGNATURE' ? 401 : 400;
      return NextResponse.json(
        { success: false, error: result.reason },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      received: true,
      reason: result.reason,
      eventType: result.eventType,
      passId: result.passId,
    });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
