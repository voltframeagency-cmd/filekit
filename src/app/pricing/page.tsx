import React from 'react';
import type { Metadata } from 'next';
import JobPassPaywallCard from '@/components/paywall/JobPassPaywallCard';

export const metadata: Metadata = {
  title: 'FileKit Job Pass — €4.90 One-Time 7-Day Access',
  description: '7 days of uninterrupted high-capacity file processing. €4.90 one-time, tax included. Never auto-renews.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl mx-auto text-center space-y-3 mb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Upgrade Your Workflow</h1>
        <p className="text-slate-400 text-sm">
          Simple, transparent pricing. Client tools remain 100% free; upgrade to unlock expanded server capacity.
        </p>
      </div>

      <JobPassPaywallCard className="my-0" />
    </div>
  );
}
