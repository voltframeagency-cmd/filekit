"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { ProcessingFailure } from "@/utils/engine/types";

interface ErrorRecoveryPanelProps {
  filename: string;
  failure: ProcessingFailure;
  onReset: () => void;
  onRetry?: () => void;
  onFallback?: () => void;
}

export default function ErrorRecoveryPanel({
  filename,
  failure,
  onReset,
  onRetry,
  onFallback,
}: ErrorRecoveryPanelProps) {
  const { t } = useLanguage();

  const isMemoryLimit = failure.category === "LOCAL_MEMORY_LIMIT";

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 animate-in fade-in duration-200 text-left ltr:text-left rtl:text-right gap-6">
      {/* Danger Header Icon Alert */}
      <div className="flex items-center gap-3 p-4 rounded-fk-lg bg-fk-danger-bg border border-fk-danger/20 text-fk-danger">
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
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <div className="flex flex-col min-w-0">
          <h3 className="text-[15px] font-bold leading-tight">Processing Failure</h3>
          <span className="text-[11px] text-fk-danger/80 truncate mt-0.5 max-w-[460px] font-mono block">
            <bdi>{filename}</bdi>
          </span>
        </div>
      </div>

      {/* Main Error Description */}
      <div className="flex flex-col gap-2">
        <p className="text-[14px] font-bold text-fk-text leading-relaxed">
          {failure.message}
        </p>
        <p className="text-[13px] text-fk-text-muted leading-relaxed">
          {failure.recommendedAction}
        </p>
      </div>

      {/* Diagnostic telemetry details footer */}
      <div className="p-3 bg-fk-surface-muted border border-fk-border rounded-fk-md font-mono text-[11px] text-fk-text-subtle flex items-center justify-between">
        <span>Diagnostic Code:</span>
        <span className="font-bold text-fk-text-muted">{failure.diagnosticCode}</span>
      </div>

      {/* Action buttons mapping recoverable state */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        {onRetry && failure.recoverable && (
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
          >
            Retry processing
          </button>
        )}
        {onFallback && (isMemoryLimit || failure.category === "UNSUPPORTED_PDF_FEATURE" || failure.category === "WORKER_CRASH") && (
          <button
            type="button"
            onClick={onFallback}
            className="flex-1 h-[50px] bg-fk-server hover:bg-indigo-700 text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-server focus-visible:ring-offset-2"
          >
            Try Server Processing
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="h-[50px] px-8 border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[14px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
        >
          Remove File
        </button>
      </div>
    </div>
  );
}
