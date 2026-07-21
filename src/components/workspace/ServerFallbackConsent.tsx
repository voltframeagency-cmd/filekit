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
      <div className="flex items-center gap-3 mb-6 p-4 rounded-fk-lg bg-amber-50 border border-amber-200 text-amber-900">
        {/* Info icon */}
        <svg
          className="w-6 h-6 shrink-0 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <div className="flex flex-col">
          <h3 className="text-[16px] font-bold leading-tight">
            Server processing is not available in this beta
          </h3>
          <span className="text-[11px] text-amber-800/80 truncate mt-0.5 max-w-[460px] block font-mono">
            {filename}
          </span>
        </div>
      </div>

      {/* Description explanation */}
      <p className="text-[14px] text-fk-text leading-relaxed mb-6 font-medium">
        Server-side processing backend is disabled in this controlled Chromium beta. All PDF optimization is executed strictly on your local device.
      </p>

      {/* Options list */}
      <div className="flex flex-col gap-3.5 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-fk-primary shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text">
            Use local engine with adjusted quality or page targets
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-fk-primary shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text">
            Run on Chromium Desktop or Mobile with WebAssembly & OffscreenCanvas
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-fk-primary shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-fk-text">
            Your files remain 100% private and never leave your browser
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-[50px] bg-fk-primary hover:bg-emerald-700 text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
        >
          Return to Local Settings
        </button>
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
