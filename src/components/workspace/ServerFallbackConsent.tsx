"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";

interface ServerFallbackConsentProps {
  filename: string;
  reason: "size" | "complexity" | "recommended";
  onConsent: () => void;
  onCancel: () => void;
}

export default function ServerFallbackConsent({
  filename,
  reason,
  onConsent,
  onCancel,
}: ServerFallbackConsentProps) {
  const { t } = useLanguage();

  const isRecommended = reason === "recommended";

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 animate-in fade-in duration-200 text-left ltr:text-left rtl:text-right">
      {/* Indigo header section */}
      <div className="flex items-center gap-3 mb-6 p-4 rounded-fk-lg bg-fk-server-bg border border-[#BFDBFE] text-fk-server">
        {/* Cloud icon */}
        <svg
          className="w-6 h-6 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
          />
        </svg>
        <div className="flex flex-col">
          <h3 className="text-[16px] font-bold leading-tight">
            {isRecommended ? "Secure server processing recommended" : "Secure temporary processing required"}
          </h3>
          <span className="text-[11px] text-fk-server/80 truncate mt-0.5 max-w-[460px] block font-mono">
            {filename}
          </span>
        </div>
      </div>

      {/* Description explanation */}
      <p className="text-[14px] text-fk-text leading-relaxed mb-6 font-medium">
        {isRecommended
          ? "This file is complex and may process much faster on our secure cloud nodes. You can continue locally, but it may take longer."
          : "This file is too large for local browser memory. Server-assisted processing is required to complete this task."}
      </p>

      {/* Safety guarantees list */}
      <div className="flex flex-col gap-3.5 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-fk-server shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text-muted">
            Encrypted in transit using TLS
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-fk-server shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text-muted">
            Processed in an isolated environment
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-fk-server shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text-muted">
            Source deleted shortly after processing
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-fk-server shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text-muted">
            Output expires automatically within 24 hours
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-fk-server shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text-muted">
            FileKit never silently changes processing location
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          type="button"
          onClick={onConsent}
          className="flex-1 h-[50px] bg-fk-server hover:bg-indigo-700 text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-server focus-visible:ring-offset-2"
        >
          Continue with Server Processing
        </button>
        {isRecommended && (
          <button
            type="button"
            onClick={onConsent} // We can handle custom logic for local continue in useWorkspaceState
            className="flex-1 h-[50px] bg-white border border-fk-border hover:border-fk-border-strong text-fk-text rounded-fk-md text-[14px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
          >
            Continue Locally
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="h-[50px] px-8 border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[14px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
