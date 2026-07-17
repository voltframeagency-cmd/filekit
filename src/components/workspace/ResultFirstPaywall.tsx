"use client";

import React, { useState } from "react";
import { useLanguage } from "../layout/LanguageContext";
import { VerificationResult, PurchasePlan } from "@/utils/engine/types";
import PlanCard from "./PlanCard";

interface ResultFirstPaywallProps {
  filename: string;
  result: VerificationResult;
  onSelectPlan: (planId: string) => void;
  onCancel: () => void;
  checkoutPending: boolean;
  paymentError: string | null;
}

export default function ResultFirstPaywall({
  filename,
  result,
  onSelectPlan,
  onCancel,
  checkoutPending,
  paymentError,
}: ResultFirstPaywallProps) {
  const { t } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plans: PurchasePlan[] = [
    {
      id: "single-export",
      name: t("paywall.single.title"),
      price: "€4.99",
      billingFrequency: "once",
      renewalLanguage: t("paywall.single.billing"),
      tagline: t("paywall.single.tagline"),
    },
    {
      id: "pass-24h",
      name: t("paywall.pass.title"),
      price: "€7.99",
      billingFrequency: "once",
      renewalLanguage: t("paywall.pass.billing"),
      tagline: t("paywall.pass.tagline"),
      badge: t("paywall.pass.badge"), // "Best value"
    },
    {
      id: "pro-monthly",
      name: t("paywall.pro.title"),
      price: "€9.99",
      billingFrequency: "monthly",
      renewalLanguage: t("paywall.pro.billing"),
      tagline: t("paywall.pro.tagline"),
    },
  ];

  const handlePlanSelect = (id: string) => {
    setSelectedPlanId(id);
  };

  const handleCheckout = () => {
    if (selectedPlanId) {
      onSelectPlan(selectedPlanId);
    }
  };

  // Format bytes helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Safe result metrics format
  let changeDescription = "";
  if (result.outputSizeBytes < result.originalSizeBytes) {
    changeDescription = `${result.reductionPercentage.toFixed(1)}% smaller`;
  } else if (result.outputSizeBytes === result.originalSizeBytes) {
    changeDescription = "No size reduction";
  } else {
    changeDescription = `Output is ${result.reductionPercentage.toFixed(1)}% larger`;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-8 animate-in fade-in duration-250 text-left ltr:text-left rtl:text-right">
      
      {/* LEFT PANEL: Verified Result Details */}
      <div className="flex-1 flex flex-col p-6 border border-fk-border bg-fk-surface-muted/30 rounded-fk-xl justify-between">
        <div className="flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-fk-success-bg border border-[#BBF7D0] text-fk-success text-[12px] font-bold self-start select-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{t("paywall.resultVerified")}</span>
          </div>

          {/* File details */}
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-fk-text-subtle uppercase tracking-wider">
              {t("paywall.fileLabel")}
            </span>
            <span className="text-[14px] font-black text-fk-text truncate mt-1 font-mono">
              <bdi>{filename}</bdi>
            </span>
          </div>

          {/* Sizes and reduction */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-fk-border">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-fk-text-subtle uppercase tracking-wider">
                {t("paywall.originalLabel")}
              </span>
              <span className="text-[16px] font-bold text-fk-text mt-0.5 font-mono">
                <bdi>{formatBytes(result.originalSizeBytes)}</bdi>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-fk-primary uppercase tracking-wider">
                {t("paywall.outputLabel")}
              </span>
              <span className="text-[16px] font-black text-fk-primary mt-0.5 font-mono">
                <bdi>{formatBytes(result.outputSizeBytes)}</bdi>
              </span>
            </div>
          </div>

          {/* Summary table list */}
          <div className="flex flex-col gap-3.5 text-[13px]">
            <div className="flex justify-between items-center">
              <span className="text-fk-text-muted">{t("paywall.changeLabel")}</span>
              <span className="font-bold text-fk-text font-mono"><bdi>{changeDescription}</bdi></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fk-text-muted">{t("paywall.pagesLabel")}</span>
              <span className="font-bold text-fk-text font-mono"><bdi>{result.pagesAfter} pages</bdi></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fk-text-muted">{t("paywall.locationLabel")}</span>
              <span className="font-bold text-fk-text-subtle uppercase tracking-wider text-[11px]">
                {result.processingLocation === "local" ? t("paywall.localLocation") : t("paywall.serverLocation")}
              </span>
            </div>
          </div>
        </div>

        {/* Security / TLS text */}
        <div className="mt-8 flex items-center gap-2 p-3 bg-white border border-fk-border rounded-fk-lg text-[11px] text-fk-text-muted">
          <svg className="w-4 h-4 text-fk-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t("paywall.tlsGuarantee")}</span>
        </div>
      </div>

      {/* RIGHT PANEL: Plan Selector & Checkout CTA */}
      <div className="flex-1 flex flex-col gap-6 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-black text-fk-text leading-tight">
              {t("paywall.title")}
            </h3>
            <p className="text-[12px] text-fk-text-subtle mt-1 leading-relaxed">
              {t("paywall.subtitle")}
            </p>
          </div>

          {/* Payment error display */}
          {paymentError && (
            <div className="p-3.5 bg-fk-danger-bg border border-fk-danger/25 rounded-fk-lg text-[12px] text-fk-danger font-semibold flex items-start gap-2.5" role="alert" aria-live="assertive">
              <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{paymentError}</span>
            </div>
          )}

          {/* Plans Group Selector */}
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Purchase plan options">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => handlePlanSelect(plan.id)}
              />
            ))}
          </div>
        </div>

        {/* CTA checkout button */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="button"
            disabled={!selectedPlanId || checkoutPending}
            onClick={handleCheckout}
            className={`w-full h-[52px] rounded-fk-md text-[14px] font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              selectedPlanId && !checkoutPending
                ? "bg-fk-primary hover:bg-fk-primary-hover text-white focus-visible:ring-fk-primary cursor-pointer"
                : "bg-fk-surface-muted border border-fk-border text-fk-text-muted cursor-not-allowed opacity-60"
            }`}
          >
            {checkoutPending ? (
              <>
                <div className="w-4 h-4 border-2 border-fk-text-muted border-t-transparent rounded-full animate-spin"></div>
                <span>{t("paywall.pending")}</span>
              </>
            ) : (
              <span>{selectedPlanId ? t("paywall.ctaUnlock") : t("paywall.ctaSelect")}</span>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full h-[46px] border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[13px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
          >
            {t("paywall.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
