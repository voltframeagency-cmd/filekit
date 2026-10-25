'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'active' | 'waiting_webhook' | 'error'>('loading');
  const [passData, setPassData] = useState<{
    passId?: string;
    expiresAt?: number;
    remainingSeconds?: number;
    token?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Missing checkout session identifier in URL.');
      return;
    }

    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 6;

    async function recoverPass() {
      try {
        const res = await fetch('/api/billing/recover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Includes filekit_session cookie
          body: JSON.stringify({
            checkoutSessionId: sessionId,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!isMounted) return;

        if (res.ok && data.recovered && data.token) {
          // Set entitlement pass token in cookie and local storage
          document.cookie = `filekit_pass_token=${encodeURIComponent(data.token)}; Path=/; Max-Age=604800; SameSite=Lax; Secure`;
          try {
            localStorage.setItem('filekit_pass_token', data.token);
            localStorage.setItem('filekit_pass_id', data.passId || '');
            localStorage.setItem('filekit_pass_expires', String(data.expiresAt || ''));
          } catch {
            // Storage quota or restricted mode fallback
          }

          setPassData({
            passId: data.passId,
            expiresAt: data.expiresAt,
            remainingSeconds: data.remainingSeconds,
            token: data.token,
          });
          setStatus('active');
          return;
        }

        // If payment was made but webhook is still processing
        if (attempts < maxAttempts) {
          attempts++;
          setStatus('waiting_webhook');
          setTimeout(recoverPass, 2000);
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Payment confirmation is still processing or session ownership unverified.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(err.message || 'Network error recovering pass.');
      }
    }

    recoverPass();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {status === 'loading' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold">Verifying Your Purchase...</h2>
            <p className="text-slate-400 text-sm">Validating server-authenticated session ownership with Stripe.</p>
          </div>
        )}

        {status === 'waiting_webhook' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold">Finalizing Payment Confirmation...</h2>
            <p className="text-slate-400 text-sm">
              Stripe is delivering the webhook to activate your entitlement in Cloudflare D1. Retrying automatically...
            </p>
          </div>
        )}

        {status === 'active' && passData && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-white">FileKit Job Pass Activated</h1>
              <p className="text-emerald-400 font-medium text-sm">7-Day High-Capacity Processing Unlocked</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Pass ID</span>
                <span className="font-mono text-xs text-slate-200">{passData.passId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-semibold text-slate-200">€4.90 (VAT Included)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="text-slate-200">7 Full Days (No Auto-Renewal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valid Until</span>
                <span className="text-slate-200">
                  {passData.expiresAt ? new Date(passData.expiresAt).toLocaleString() : '7 days from now'}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                href="/word-to-pdf"
                className="w-full inline-flex justify-center items-center py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
              >
                Proceed to Word to PDF Conversion →
              </Link>

              <Link
                href="/"
                className="w-full inline-flex justify-center items-center py-2.5 px-6 rounded-xl font-medium text-slate-400 hover:text-slate-200 transition text-sm"
              >
                Back to All Tools
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              ✕
            </div>
            <h2 className="text-xl font-bold text-white">Verification Pending</h2>
            <p className="text-rose-400 text-sm">{errorMessage}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Retry Access Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>}>
      <BillingSuccessContent />
    </Suspense>
  );
}
