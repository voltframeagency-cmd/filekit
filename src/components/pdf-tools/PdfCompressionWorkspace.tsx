"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import TrustPanel from "@/components/layout/TrustPanel";
import { LocalPdfEngineAdapter } from "@/utils/engine/LocalPdfEngineAdapter";
import { VerificationResult, ProcessingJob, ProcessingProgressEvent, ProcessingFailure } from "@/utils/engine/types";
import { PdfCompressionMode, PdfRouteConfig } from "@/config/pdfCompressionRoutes";
import { useLanguage } from "@/components/layout/LanguageContext";
import { PDF_COMPRESSION_I18N } from "./pdfCompressionTranslations";

export type QualityPriority = "BETTER_QUALITY" | "BALANCED" | "SMALLER_FILE";

export interface PdfCompressionWorkspaceProps {
  routeConfig: PdfRouteConfig;
  initialTargetValue?: string;
  initialTargetUnit?: "kb" | "mb";
  language?: string;
}

const MIN_BYTES = 100 * 1024; // 100 KB
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export default function PdfCompressionWorkspace({
  routeConfig,
  initialTargetValue = "2",
  initialTargetUnit = "mb",
  language: propLang
}: PdfCompressionWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const fullKey = (language || 'en').toLowerCase();
  const shortKey = fullKey.slice(0, 2);
  const wt = PDF_COMPRESSION_I18N[fullKey] || PDF_COMPRESSION_I18N[shortKey] || PDF_COMPRESSION_I18N.en;

  // Mode selection & controls
  const [qualityPriority, setQualityPriority] = useState<QualityPriority>("BALANCED");
  const [targetValue, setTargetValue] = useState<string>(initialTargetValue);
  const [targetUnit, setTargetUnit] = useState<"kb" | "mb">(initialTargetUnit);

  // File and result states
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Request versioning & cancellation refs
  const requestIdRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const settingsSectionRef = useRef<HTMLDivElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Privacy-compliant analytics logger
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const safePayload: Record<string, any> = {
      operation: routeConfig.analyticsOperation,
      mode: routeConfig.mode,
      timestamp: Date.now(),
      ...payload
    };
    delete safePayload.filename;
    delete safePayload.pdfBytes;
    delete safePayload.filePath;
    delete safePayload.signatureData;
    delete safePayload.hash;

    if ((window as any).__FILEKIT_ANALYTICS__) {
      (window as any).__FILEKIT_ANALYTICS__.push({ event: eventName, ...safePayload });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError(wt.errInvalidPdf);
      return;
    }

    setError(null);
    setResult(null);
    setFile(selected);

    trackEvent("file_selected", {
      inputSizeBucket: selected.size > 2 * 1024 * 1024 ? ">2MB" : "<2MB"
    });
  };

  const calculateTargetSizeBytes = (): number => {
    if (!file) return 2 * 1024 * 1024;

    if (routeConfig.mode === "FIXED_TARGET" && routeConfig.targetBytes) {
      return routeConfig.targetBytes;
    }

    if (routeConfig.mode === "GENERAL") {
      if (qualityPriority === "BETTER_QUALITY") return Math.max(MIN_BYTES, Math.round(file.size * 0.80));
      if (qualityPriority === "BALANCED") return Math.max(MIN_BYTES, Math.round(file.size * 0.50));
      return Math.max(MIN_BYTES, Math.round(file.size * 0.30));
    }

    // CUSTOM_TARGET mode calculation
    const num = parseFloat(targetValue);
    if (isNaN(num) || num <= 0) return 2 * 1024 * 1024;
    const bytes = targetUnit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);
    return Math.min(MAX_BYTES, Math.max(MIN_BYTES, bytes));
  };

  const handleCompress = async () => {
    if (!file) return;

    // Validate CUSTOM_TARGET inputs
    if (routeConfig.mode === "CUSTOM_TARGET") {
      const num = parseFloat(targetValue);
      const decimalCount = (targetValue.split(".")[1] || "").length;
      if (isNaN(num) || num <= 0) {
        setError(wt.errInvalidNumber);
        return;
      }
      if (decimalCount > 2) {
        setError(wt.errDecimalPlaces);
        return;
      }
      const bytes = targetUnit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);
      if (bytes < MIN_BYTES) {
        setError(wt.errMinSize);
        return;
      }
      if (bytes > MAX_BYTES) {
        setError(wt.errMaxSize);
        return;
      }
    }

    // Abort previous active operation if running
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    activeAbortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;
    setIsProcessing(true);
    setError(null);
    setProgressMsg(wt.readingPdf);

    const targetSizeBytes = calculateTargetSizeBytes();
    trackEvent("compression_settings_submitted", {
      targetSizeBytes,
      qualityPriority: routeConfig.mode === "GENERAL" ? qualityPriority : undefined
    });

    try {
      const adapter = new LocalPdfEngineAdapter();
      const targetSizeStr = `${targetSizeBytes}`;

      const job: ProcessingJob = {
        id: `pdf-job-${currentReqId}`,
        abortSignal: controller.signal,
        onProgress: (update: ProcessingProgressEvent) => {
          if (requestIdRef.current === currentReqId) {
            setProgressMsg(update.message);
          }
        },
        onSuccess: (ver: VerificationResult) => {
          if (requestIdRef.current !== currentReqId || controller.signal.aborted) {
            trackEvent("cancelled");
            return;
          }
          setResult(ver);
          setIsProcessing(false);
          trackEvent(ver.outcome.toLowerCase(), {
            originalSizeBytes: ver.originalSizeBytes,
            outputSizeBytes: ver.outputSizeBytes,
            pagesBefore: ver.pagesBefore
          });

          setTimeout(() => {
            resultHeadingRef.current?.focus();
          }, 100);
        },
        onError: (failure: ProcessingFailure) => {
          if (requestIdRef.current !== currentReqId || controller.signal.aborted) return;
          let msg = failure.message || wt.errGeneric;
          if (msg.includes("REJECTED_ENCRYPTED") || failure.category === "PASSWORD_PROTECTED" || failure.category === "PDF_ENCRYPTED_OR_LOCKED") {
            msg = wt.errEncrypted;
          } else if (msg.includes("REJECTED_SIGNED") || failure.category === "UNSUPPORTED_SIGNED_DOCUMENT") {
            msg = wt.errSigned;
          } else if (msg.includes("MEMORY_LIMIT_EXCEEDED") || failure.category === "LOCAL_MEMORY_LIMIT") {
            msg = wt.errMemory;
          }
          setError(msg);
          setIsProcessing(false);
          trackEvent("processing_failed");
        }
      };

      await adapter.compress(file, targetSizeStr, job);
    } catch (err: any) {
      if (requestIdRef.current !== currentReqId || controller.signal.aborted) return;
      setError(err.message || wt.errGeneric);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !result.outputBuffer || !file) return;
    const blob = new Blob([result.outputBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${file.name.replace(/\.pdf$/i, "")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackEvent("download_completed", { downloadedSizeBytes: result.outputSizeBytes });
  };

  const handleAdjustSettings = () => {
    trackEvent("adjust_settings_selected");
    settingsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    const firstInput = settingsSectionRef.current?.querySelector<HTMLElement>("input, button");
    firstInput?.focus();
  };

  const handleResetWorkspace = () => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }
    requestIdRef.current++;
    setFile(null);
    setResult(null);
    setError(null);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "\u20660 Bytes\u2069";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    return `\u2066${formatted}\u2069`;
  };

  const isNoReduction = result ? result.outcome === "NO_BENEFICIAL_REDUCTION" || result.outputSizeBytes >= result.originalSizeBytes : false;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* File Upload Zone (when no file selected) */}
      {!file && (
        <div className="w-full max-w-[840px] mx-auto bg-white border border-fk-border rounded-fk-xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-fk-border rounded-fk-lg p-10 text-center hover:border-fk-primary transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <svg className="w-12 h-12 text-fk-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-[15px] font-bold text-fk-text">{wt.dropPdf}</p>
            <p className="text-[12px] font-medium text-fk-text-subtle mt-1">
              {wt.supportsPdf}
            </p>
            <p className="text-[11px] font-medium text-fk-text-subtle mt-2 bg-fk-surface-muted px-3 py-1 rounded-full border border-fk-border">
              {wt.privacyPdf}
            </p>
          </div>
        </div>
      )}

      {/* Main Workspace (Side-by-Side Grid on Desktop) */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Results & Document Summary (Col Span 7 on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              {/* File Info Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-fk-border">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-fk-text dir-auto truncate max-w-[280px] sm:max-w-[400px]">{file.name}</span>
                  <span className="text-[12px] font-mono text-fk-text-subtle mt-0.5">
                    {wt.originalSize}: {formatBytes(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetWorkspace}
                  className="text-[12px] font-bold text-fk-text-muted hover:text-fk-text px-3 py-1.5 border border-fk-border rounded-fk-md bg-white hover:bg-fk-surface-muted transition-colors shrink-0"
                >
                  {wt.chooseAnother}
                </button>
              </div>

              {/* Status Header Badge */}
              <div className="flex flex-col gap-2">
                {isProcessing ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-[14px] font-bold bg-blue-50 border-blue-200 text-blue-800 w-fit animate-pulse">
                    <span>⚙️</span>
                    <span>{progressMsg || wt.compressing}</span>
                  </div>
                ) : result ? (
                  <div
                    ref={resultHeadingRef as any}
                    tabIndex={-1}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[14px] font-bold focus:outline-none w-fit ${
                      isNoReduction
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : result.outcome === "TARGET_NOT_MET"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-fk-success-bg border-[#BBF7D0] text-fk-success"
                    }`}
                  >
                    <span>{isNoReduction ? "ℹ️" : result.outcome === "TARGET_NOT_MET" ? "⚠️" : "✓"}</span>
                    <span>
                      {isNoReduction
                        ? wt.noBeneficial
                        : result.outcome === "TARGET_NOT_MET"
                        ? wt.targetNotMet
                        : result.originalAlreadyWithinTarget
                        ? wt.alreadyBelow
                        : wt.compressedOk}
                    </span>
                  </div>
                ) : null}

                {!isProcessing && isNoReduction && (
                  <p className="text-[13px] text-fk-text-muted leading-relaxed">
                    {wt.noReductionDesc}
                  </p>
                )}
              </div>

              {/* Metrics Display */}
              {result && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-6 w-full p-4 bg-fk-surface-muted border border-fk-border rounded-fk-xl font-mono">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-fk-text-subtle uppercase">{wt.original}</span>
                      <span className="text-[18px] font-bold text-fk-text mt-1">{formatBytes(result.originalSizeBytes)}</span>
                    </div>
                    <div className="text-[22px] font-light text-fk-text-subtle ltr:rotate-0 rtl:rotate-180">→</div>
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-fk-primary uppercase">{wt.newSize}</span>
                      <span className="text-[20px] font-black text-fk-primary mt-1">{formatBytes(result.outputSizeBytes)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-around p-3 bg-white border border-fk-border rounded-fk-md text-[12px] font-bold text-fk-text">
                    <span>📄 {wt.pages}: {result.pagesAfter || 1}</span>
                    <span>📉 {wt.reduction}: {result.reductionPercentage}%</span>
                    <span>🔒 {wt.processingLocal}</span>
                  </div>

                  {/* Primary Download Action Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                      {isNoReduction || (result && result.originalAlreadyWithinTarget)
                        ? wt.downloadOriginal
                        : result && result.outcome === "TARGET_NOT_MET"
                        ? wt.downloadBest
                        : wt.downloadCompressed}
                    </button>

                    <button
                      type="button"
                      onClick={handleAdjustSettings}
                      className="h-[50px] px-5 border border-fk-border hover:bg-fk-surface-muted text-fk-text font-bold rounded-fk-md text-[13px] transition-colors"
                    >
                      {wt.adjustSettings}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Settings Controls (Col Span 5 on Desktop, Sticky Top) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-20" ref={settingsSectionRef}>
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              <h2 className="text-[16px] font-black text-fk-text flex items-center gap-2 border-b border-fk-border pb-3">
                <span>⚙️</span>
                <span>{wt.settingsTitle}</span>
              </h2>

              {/* GENERAL MODE CONTROLS */}
              {routeConfig.mode === "GENERAL" && (
                <div className="flex flex-col gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">{wt.compressionGoal}</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "BETTER_QUALITY", label: wt.betterQuality, desc: wt.betterQualityDesc },
                      { key: "BALANCED", label: wt.balanced, desc: wt.balancedDesc },
                      { key: "SMALLER_FILE", label: wt.smallerFile, desc: wt.smallerFileDesc }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setQualityPriority(item.key as QualityPriority)}
                        className={`flex flex-col p-3 rounded-fk-md border text-left ltr:text-left rtl:text-right transition-colors ${
                          qualityPriority === item.key
                            ? "bg-white border-fk-primary ring-1 ring-fk-primary text-fk-text"
                            : "bg-white border-fk-border text-fk-text-muted hover:border-fk-text-subtle"
                        }`}
                      >
                        <span className="text-[13px] font-bold text-fk-text">{item.label}</span>
                        <span className="text-[11px] font-medium text-fk-text-subtle mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOM TARGET MODE CONTROLS */}
              {routeConfig.mode === "CUSTOM_TARGET" && (
                <div className="flex flex-col gap-4 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">{wt.targetFileSize}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      min="100"
                      max="52428800"
                      value={targetValue}
                      onChange={(e) => {
                        setTargetValue(e.target.value);
                        setError(null);
                      }}
                      className="w-full h-10 px-3 border border-fk-border rounded-fk-md font-mono text-[14px] font-bold text-fk-text focus:outline-none focus:border-fk-primary"
                      placeholder="2"
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => {
                        setTargetUnit(e.target.value as "kb" | "mb");
                        setError(null);
                      }}
                      className="h-10 px-3 border border-fk-border rounded-fk-md font-bold text-[13px] text-fk-text bg-white focus:outline-none focus:border-fk-primary"
                    >
                      <option value="kb">KB</option>
                      <option value="mb">MB</option>
                    </select>
                  </div>

                  {/* Quick-fill Chips */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-fk-text-subtle">{wt.quickTargets}</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "500 KB", val: "500", unit: "kb" },
                        { label: "1 MB", val: "1", unit: "mb" },
                        { label: "2 MB", val: "2", unit: "mb" },
                        { label: "5 MB", val: "5", unit: "mb" }
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => {
                            setTargetValue(chip.val);
                            setTargetUnit(chip.unit as "kb" | "mb");
                          }}
                          className="px-2 py-1.5 text-[11px] font-bold border border-fk-border rounded-fk-md bg-white hover:border-fk-primary hover:text-fk-primary transition-colors text-center"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FIXED TARGET MODE CONTROLS */}
              {routeConfig.mode === "FIXED_TARGET" && (
                <div className="flex flex-col gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-fk-text">{wt.targetOutcome}</span>
                    <span className="text-[12px] font-mono font-bold text-fk-primary bg-white px-2.5 py-1 rounded-fk-sm border border-fk-border">
                      {wt.below2mb}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-fk-text-subtle leading-relaxed">
                    {wt.targetOutcomeDesc}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {isProcessing ? wt.compressingBtn : result ? wt.recompressBtn : wt.compressBtn}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-fk-md font-medium">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TrustPanel language={language} />
    </div>
  );
}
