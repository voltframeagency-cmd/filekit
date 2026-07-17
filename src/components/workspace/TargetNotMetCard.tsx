"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { VerificationResult, EntitlementStatus } from "@/utils/engine/types";

interface TargetNotMetCardProps {
  filename: string;
  result: VerificationResult;
  entitlement: EntitlementStatus;
  downloadUrl?: string | null;
  onReset: () => void;
  onTryServer: () => void;
  onUnlock: () => void;
}

export default function TargetNotMetCard({
  filename,
  result,
  entitlement,
  downloadUrl,
  onReset,
  onTryServer,
  onUnlock,
}: TargetNotMetCardProps) {
  const { t } = useLanguage();

  const handleDownload = () => {
    if (entitlement === "NONE") {
      onUnlock();
    } else if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `compressed_${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Downloading partially compressed file: ${filename}`);
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

  // Critical Fix 1: Safe result metrics format
  let changeDescription = "";
  if (result.outputSizeBytes < result.originalSizeBytes) {
    changeDescription = `${result.reductionPercentage.toFixed(1)}% smaller`;
  } else if (result.outputSizeBytes === result.originalSizeBytes) {
    changeDescription = "No size reduction";
  } else {
    changeDescription = `Output is ${result.reductionPercentage.toFixed(1)}% larger`;
  }

  const isDownloadReady = entitlement !== "NONE";

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 animate-in fade-in duration-200 text-left ltr:text-left rtl:text-right gap-6">
      {/* Warning Alert Badge */}
      <div className="flex items-center gap-3 p-4 rounded-fk-lg bg-fk-warning-bg border border-fk-warning/20 text-fk-warning">
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
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <div className="flex flex-col">
          <h3 className="text-[15px] font-bold leading-tight">Target size not reached</h3>
          <span className="text-[11px] text-fk-warning/80 truncate mt-0.5 max-w-[460px] font-mono block">
            <bdi>{filename}</bdi>
          </span>
        </div>
      </div>

      <p className="text-[13px] text-fk-text-muted leading-relaxed font-semibold">
        The PDF structure could not be compressed below your requested target size of <span className="font-bold text-fk-text"><bdi>{result.targetRequested}</bdi></span> locally without degrading text or image readability.
      </p>

      {/* Actual achieved metrics comparison */}
      <div className="p-4 bg-fk-surface-muted border border-fk-border rounded-fk-lg flex items-center justify-between text-[13px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-fk-text-subtle uppercase tracking-wider font-bold">Original Size</span>
          <span className="font-bold text-fk-text font-mono"><bdi>{formatBytes(result.originalSizeBytes)}</bdi></span>
        </div>
        <div className="text-[20px] text-fk-text-subtle font-light">→</div>
        <div className="flex flex-col gap-0.5 text-right rtl:text-left">
          <span className="text-[11px] text-fk-text-subtle uppercase tracking-wider font-bold">Size Achieved</span>
          <span className="font-bold text-fk-text font-mono"><bdi>{formatBytes(result.outputSizeBytes)}</bdi></span>
        </div>
        <div className="flex flex-col gap-0.5 text-right rtl:text-left">
          <span className="text-[11px] text-fk-primary uppercase tracking-wider font-bold">Change</span>
          <span className="font-bold text-fk-primary font-mono"><bdi>{changeDescription}</bdi></span>
        </div>
      </div>

      {/* Suggested next steps */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
          Available Next Steps
        </span>
        
        {/* Option 1: Download anyway / Unlock */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full flex items-center justify-between p-3.5 border border-fk-border hover:border-fk-primary rounded-fk-md bg-white hover:bg-fk-primary/[0.01] transition-colors duration-150 text-left ltr:text-left rtl:text-right"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-fk-text">
              {isDownloadReady ? "Download Valid Result" : "Unlock Download"}
            </span>
            <span className="text-[11px] text-fk-text-subtle mt-0.5">
              {isDownloadReady 
                ? `Save the current version (${formatBytes(result.outputSizeBytes)}) anyway.` 
                : "Complete premium acquisition to unlock the partial file."}
            </span>
          </div>
          <span className="text-[13px] font-bold text-fk-primary">Download →</span>
        </button>

        {/* Option 2: Server fallback for stronger compression - forces consent */}
        {result.processingLocation === "local" && (
          <button
            type="button"
            onClick={onTryServer}
            className="w-full flex items-center justify-between p-3.5 border border-fk-border hover:border-fk-server rounded-fk-md bg-white hover:bg-fk-server/[0.01] transition-colors duration-150 text-left ltr:text-left rtl:text-right"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-fk-text">Try Server-Assisted Compression</span>
              <span className="text-[11px] text-fk-text-subtle mt-0.5">Upload file to run advanced compression filters on isolated servers.</span>
            </div>
            <span className="text-[13px] font-bold text-fk-server">Use Server →</span>
          </button>
        )}
      </div>

      {/* Cancel/Reset row */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onReset}
          className="h-[44px] px-6 border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[13px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
        >
          Remove & Try Another
        </button>
      </div>
    </div>
  );
}
