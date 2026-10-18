import { NextRequest, NextResponse } from 'next/server';
import { jobPassService } from '@/lib/billing/jobPassService';

export async function GET(req: NextRequest) {
  return handleCheck(req);
}

export async function POST(req: NextRequest) {
  return handleCheck(req);
}

async function handleCheck(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const sessionHeader = req.headers.get('x-purchaser-session') || undefined;

    const url = new URL(req.url);
    const queryToken = url.searchParams.get('token') || undefined;
    const querySession = url.searchParams.get('purchaserSessionId') || undefined;
    const queryEmail = url.searchParams.get('email') || undefined;

    let bodyToken: string | undefined;
    let bodySession: string | undefined;
    let bodyEmail: string | undefined;

    if (req.method === 'POST') {
      try {
        const body = await req.json();
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

    const result = jobPassService.verifyAccess({
      token,
      purchaserSessionId,
      email,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error('Entitlement check error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal entitlement check error' },
      { status: 500 }
    );
  }
}
