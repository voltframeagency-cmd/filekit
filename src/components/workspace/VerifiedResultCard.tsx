"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { VerificationResult } from "@/utils/engine/types";
import { EntitlementState } from "@/hooks/useWorkspaceState";

interface VerifiedResultCardProps {
  filename: string;
  result: VerificationResult;
  entitlement: EntitlementState;
  onReset: () => void;
}

export default function VerifiedResultCard({
  filename,
  result,
  entitlement,
  onReset,
}: VerifiedResultCardProps) {
  const { t } = useLanguage();

  const handleDownload = () => {
    if (entitlement === "PAYMENT_REQUIRED") {
      alert("Redirecting to paywall page (Phase 1C Integration)...");
    } else {
      alert(`Downloading compressed file: ${filename}`);
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

  const isDownloadReady = entitlement === "DOWNLOAD_READY";

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 animate-in fade-in duration-200 text-center items-center gap-6">
      {/* Green Header Success Badge */}
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-fk-success-bg border border-[#BBF7D0] text-fk-success text-[14px] font-bold select-none">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>Your file is ready</span>
      </div>

      {/* Target File details */}
      <span className="text-[13px] font-semibold text-fk-text-subtle truncate max-w-[420px] block font-mono">
        <bdi>{filename}</bdi>
      </span>

      {/* Metrics Row */}
      <div className="flex items-center justify-center gap-6 w-full max-w-[460px] my-2 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-xl">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-fk-text-subtle uppercase tracking-wider">
            Original
          </span>
          <span className="text-[18px] font-bold text-fk-text mt-1 font-mono">
            <bdi>{formatBytes(result.originalSizeBytes)}</bdi>
          </span>
        </div>

        {/* Transition arrow */}
        <div className="text-fk-text-subtle text-[22px] font-light">
          →
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-fk-primary uppercase tracking-wider">
            New Size
          </span>
          <span className="text-[20px] font-black text-fk-primary mt-1 font-mono">
            <bdi>{formatBytes(result.outputSizeBytes)}</bdi>
          </span>
        </div>
      </div>

      {/* Stats Description */}
      <div className="flex flex-col gap-1 text-[13px]">
        <p className="font-bold text-fk-text">
          <bdi>{changeDescription}</bdi>  •  <span className="text-fk-success">Target met</span>
        </p>
        <span className="text-fk-text-subtle text-[11px]">
          Processed {result.processingLocation === "local" ? "privately on your device" : "securely via server"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[500px] mt-2">
        <button
          type="button"
          onClick={handleDownload}
          className={`flex-1 h-[50px] text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDownloadReady 
              ? "bg-fk-primary hover:bg-fk-primary-hover focus-visible:ring-fk-primary" 
              : "bg-fk-server hover:bg-indigo-700 focus-visible:ring-fk-server"
          }`}
        >
          {isDownloadReady ? "Download Compressed PDF" : "Unlock Download"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="h-[50px] px-8 border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[14px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
        >
          Process Another
        </button>
      </div>
    </div>
  );
}
