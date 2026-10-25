"use client";

import React, { useState } from 'react';

export interface JobPassPaywallCardProps {
  purchaserSessionId?: string;
  onPassActivated?: (token: string, expiresAt: number) => void;
  taxLabel?: string;
  className?: string;
}

export default function JobPassPaywallCard({
  purchaserSessionId = 'anon_session',
  onPassActivated,
  taxLabel = 'VAT included where applicable',
  className = '',
}: JobPassPaywallCardProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [recoverySessionId, setRecoverySessionId] = useState('');
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);

  const handleStartCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaserSessionId,
          successUrl: `${window.location.origin}/billing/success`,
          cancelUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to start checkout session');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to payment provider.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPass = async () => {
    setRecovering(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/billing/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutSessionId: recoverySessionId.trim() || undefined,
          purchaserSessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No confirmed active pass found for this session.');
      }

      if (data.token && data.expiresAt) {
        localStorage.setItem('filekit_job_pass_token', data.token);
        if (onPassActivated) {
          onPassActivated(data.token, data.expiresAt);
        }
        setShowRecoveryInput(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Purchase recovery failed.');
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div
      data-testid="job-pass-paywall-card"
      className={`w-full max-w-xl mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-left ${className}`}
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide uppercase">
          ⚡ 7-Day Access
        </div>
        <h3 className="mt-3 text-2xl font-black tracking-tight leading-tight">
          FileKit Job Pass
        </h3>
        <p className="mt-1 text-sm text-blue-100">
          One-time payment for 7 days of full premium server power. Never auto-renews.
        </p>
      </div>

      {/* Pricing & Entitlement Details */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">€4.90</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 7-day pass</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {taxLabel} • Single one-time charge
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              No subscription
            </span>
          </div>
        </div>

        {/* Feature List */}
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>7 full days</strong> of uninterrupted premium processing.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Batch OCR & deep text extraction</strong> with multilingual recognition.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Large files & high-volume batches</strong> beyond browser memory limits.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>One-time checkout:</strong> strictly expires after 7 days, never auto-renews.</span>
          </li>
          <li className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>ℹ️</span>
            <span>Standard client-side tools remain 100% free with no account required.</span>
          </li>
        </ul>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 text-xs rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          data-testid="job-pass-checkout-button"
          onClick={handleStartCheckout}
          disabled={loading}
          className="w-full h-12 flex items-center justify-center font-bold text-base text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Preparing Checkout...' : 'Get 7-Day Job Pass • €4.90'}
        </button>

        {/* Recovery Section (Tab closed or interrupted redirect) */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {!showRecoveryInput ? (
            <button
              type="button"
              data-testid="job-pass-restore-toggle"
              onClick={() => setShowRecoveryInput(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Already paid in another tab? Restore your pass
            </button>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Restore Interrupted or Closed-Tab Purchase
              </span>
              <p className="text-[11px] text-slate-500">
                Enter your Stripe session ID (e.g. cs_test_...) or restore using your browser session.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Session ID (optional)"
                  value={recoverySessionId}
                  onChange={(e) => setRecoverySessionId(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <button
                  type="button"
                  data-testid="job-pass-restore-submit"
                  onClick={handleRecoverPass}
                  disabled={recovering}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 rounded-lg disabled:opacity-50"
                >
                  {recovering ? 'Verifying...' : 'Restore'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
