"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import TrustPanel from "@/components/layout/TrustPanel";
import ImageComparisonSlider from "@/components/image-tools/ImageComparisonSlider";
import { ImageOptimizationEngine } from "@/utils/image-engine/ImageOptimizationEngine";
import { ImagePreflightInspector } from "@/utils/image-engine/ImagePreflightInspector";
import { ImageCapabilityRouter } from "@/utils/image-engine/ImageCapabilityRouter";
import { ImageVerificationResult, ImagePreflightReport } from "@/utils/image-engine/types";

export type CompressionGoalMode = "BALANCED" | "TARGET_SIZE" | "MANUAL";
export type QualityPriority = "BETTER_QUALITY" | "BALANCED" | "SMALLER_FILE";
export type DimensionPreset = "ORIGINAL" | "1920" | "1024" | "640" | "CUSTOM";

export interface ImageCompressionWorkspaceProps {
  initialMode?: CompressionGoalMode;
  initialTargetValue?: string;
  initialTargetUnit?: "kb" | "mb";
}

const MIN_BYTES = 20 * 1024; // 20 KB
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export default function ImageCompressionWorkspace({
  initialMode = "BALANCED",
  initialTargetValue = "200",
  initialTargetUnit = "kb"
}: ImageCompressionWorkspaceProps) {
  // Mode selection
  const [mode, setMode] = useState<CompressionGoalMode>(initialMode);

  // Balanced mode controls
  const [qualityPriority, setQualityPriority] = useState<QualityPriority>("BALANCED");

  // Target Size mode controls
  const [targetValue, setTargetValue] = useState<string>(initialTargetValue);
  const [targetUnit, setTargetUnit] = useState<"kb" | "mb">(initialTargetUnit);

  // Manual mode controls
  const [qualitySlider, setQualitySlider] = useState<number>(80);
  const [dimensionPreset, setDimensionPreset] = useState<DimensionPreset>("ORIGINAL");
  const [customWidth, setCustomWidth] = useState<string>("");

  // File and result states
  const [file, setFile] = useState<File | null>(null);
  const [preflight, setPreflight] = useState<ImagePreflightReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Object URLs
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);

  // Request versioning & cancellation refs
  const requestIdRef = useRef<number>(0);
  const settingsSectionRef = useRef<HTMLDivElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Privacy-compliant analytics logger
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const safePayload: Record<string, any> = {
      operation: mode === "TARGET_SIZE" ? "compress_image_to_custom_size" : "compress_image_workspace",
      mode,
      timestamp: Date.now(),
      ...payload
    };
    delete safePayload.filename;
    delete safePayload.imageData;
    delete safePayload.filePath;
    delete safePayload.exif;
    delete safePayload.hash;

    if ((window as any).__FILEKIT_ANALYTICS__) {
      (window as any).__FILEKIT_ANALYTICS__.push({ event: eventName, ...safePayload });
    }
  };

  // Manage original preview Object URL
  useEffect(() => {
    if (!file) {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      setOriginalPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setOriginalPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Manage output preview Object URL
  useEffect(() => {
    if (!result || !result.outputBuffer) {
      if (outputPreviewUrl) URL.revokeObjectURL(outputPreviewUrl);
      setOutputPreviewUrl(null);
      return;
    }
    const blob = new Blob([result.outputBuffer], { type: result.outputMimeType });
    const url = URL.createObjectURL(blob);
    setOutputPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [result]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setResult(null);
    setFile(selected);

    trackEvent("file_selected", {
      formatClass: selected.type,
      fileSizeBucket: selected.size > 1024 * 1024 ? ">1MB" : "<1MB"
    });

    try {
      const buf = await selected.arrayBuffer();
      const report = await ImagePreflightInspector.inspect(buf);
      const route = ImageCapabilityRouter.evaluate(report, selected.size);
      if (route.decision === "UNSUPPORTED") {
        let msg = route.reason || "UNSUPPORTED: Image processing rejected.";
        if (msg.includes("UNSUPPORTED_ANIMATION")) {
          msg = "Animated images are not supported yet.";
        } else if (msg.includes("MEMORY_LIMIT_EXCEEDED")) {
          msg = "This image is too large to process safely in your browser.";
        }
        setError(msg);
        return;
      }
      setPreflight(report);
      if (report.width > 0) {
        setCustomWidth(report.width.toString());
      }
    } catch (err: any) {
      let msg = err.message || "Failed to inspect selected image.";
      if (msg.includes("UNSUPPORTED_FORMAT")) {
        msg = "Unsupported format. Please select a valid JPEG, PNG, or WebP file.";
      }
      setError(msg);
    }
  };

  const calculateTargetBytes = useCallback((): number => {
    if (!file) return 200 * 1024;

    if (mode === "BALANCED") {
      if (qualityPriority === "BETTER_QUALITY") return Math.max(MIN_BYTES, Math.round(file.size * 0.85));
      if (qualityPriority === "BALANCED") return Math.max(MIN_BYTES, Math.round(file.size * 0.60));
      return Math.max(MIN_BYTES, Math.round(file.size * 0.35));
    }

    if (mode === "TARGET_SIZE") {
      const num = parseFloat(targetValue);
      if (isNaN(num) || num <= 0) return 200 * 1024;
      const bytes = targetUnit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);
      return Math.min(MAX_BYTES, Math.max(MIN_BYTES, bytes));
    }

    // MANUAL mode calculation
    const qFactor = qualitySlider / 100;
    let scaleFactor = 1.0;

    if (preflight && preflight.width > 0) {
      let targetW = preflight.width;
      if (dimensionPreset === "1920") targetW = 1920;
      else if (dimensionPreset === "1024") targetW = 1024;
      else if (dimensionPreset === "640") targetW = 640;
      else if (dimensionPreset === "CUSTOM") {
        const parsedW = parseInt(customWidth, 10);
        if (!isNaN(parsedW) && parsedW > 0) targetW = parsedW;
      }
      // Do not allow upscaling beyond original width by default
      targetW = Math.min(preflight.width, targetW);
      scaleFactor = targetW / preflight.width;
    }

    const estimatedBytes = Math.round(file.size * qFactor * scaleFactor);
    return Math.min(MAX_BYTES, Math.max(MIN_BYTES, estimatedBytes));
  }, [file, mode, qualityPriority, targetValue, targetUnit, qualitySlider, dimensionPreset, customWidth, preflight]);

  const runLiveCompressionPass = useCallback(async () => {
    if (!file) return;

    if (mode === "TARGET_SIZE") {
      const num = parseFloat(targetValue);
      const decimalCount = (targetValue.split(".")[1] || "").length;
      if (isNaN(num) || num <= 0 || decimalCount > 2) return;
      const bytes = targetUnit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);
      if (bytes < MIN_BYTES || bytes > MAX_BYTES) return;
    }

    const currentReqId = ++requestIdRef.current;
    setIsProcessing(true);
    setError(null);
    trackEvent("live_preview_started");

    try {
      const computedBytes = calculateTargetBytes();
      const buf = await file.arrayBuffer();
      const res = await ImageOptimizationEngine.compress(buf, computedBytes);

      // Ignore stale completion
      if (requestIdRef.current !== currentReqId) {
        trackEvent("live_preview_cancelled");
        return;
      }

      setResult(res);
      trackEvent("live_preview_completed", {
        outcome: res.outcome,
        outputSizeBytes: res.outputSizeBytes
      });
    } catch (err: any) {
      if (requestIdRef.current !== currentReqId) return;

      let msg = err.message || "Image compression failed.";
      if (msg.includes("UNSUPPORTED_ANIMATION")) {
        msg = "Animated images are not supported yet.";
      } else if (msg.includes("MEMORY_LIMIT_EXCEEDED")) {
        msg = "This image is too large to process safely in your browser.";
      }
      setError(msg);
      trackEvent("live_preview_failed");
    } finally {
      if (requestIdRef.current === currentReqId) {
        setIsProcessing(false);
      }
    }
  }, [file, mode, targetValue, targetUnit, calculateTargetBytes]);

  // Initial trigger when file is loaded
  useEffect(() => {
    if (file) {
      runLiveCompressionPass();
    }
  }, [file]);

  // Debounced live recompression watcher when settings change after initial load
  useEffect(() => {
    if (!file) return;

    let delay = 180; // Default quality slider debounce
    if (mode === "BALANCED" || dimensionPreset !== "CUSTOM") {
      delay = 150;
    }
    if (mode === "TARGET_SIZE" || (mode === "MANUAL" && dimensionPreset === "CUSTOM")) {
      delay = 400;
    }

    const timer = setTimeout(() => {
      runLiveCompressionPass();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [file, mode, qualityPriority, targetValue, targetUnit, qualitySlider, dimensionPreset, customWidth, runLiveCompressionPass]);

  const handleDownload = () => {
    if (!result || !result.outputBuffer || !file) return;
    const blob = new Blob([result.outputBuffer], { type: result.outputMimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${file.name.replace(/\.[^/.]+$/, "")}.${result.outputMimeType.split("/")[1] || "jpg"}`;
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
    requestIdRef.current++;
    setFile(null);
    setPreflight(null);
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

  // Outcome status evaluation
  const isNoReduction = result ? result.outcome === "NO_BENEFICIAL_REDUCTION" || result.outputSizeBytes >= result.originalSizeBytes : false;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* File Upload Zone (when no file selected) */}
      {!file && (
        <div className="w-full max-w-[840px] mx-auto bg-white border border-fk-border rounded-fk-xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-fk-border rounded-fk-lg p-10 text-center hover:border-fk-primary transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <svg className="w-12 h-12 text-fk-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-[15px] font-bold text-fk-text">Drop your image here or browse</p>
            <p className="text-[12px] font-medium text-fk-text-subtle mt-1">
              Supports JPG, PNG, and static WebP up to 50 MB
            </p>
            <p className="text-[11px] font-medium text-fk-text-subtle mt-2 bg-fk-surface-muted px-3 py-1 rounded-full border border-fk-border">
              🔒 Your image is processed locally in your browser and is not uploaded.
            </p>
          </div>
        </div>
      )}

      {/* Main Workspace (Side-by-Side Grid on Desktop) */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Preview & Results (Col Span 7 on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            {/* Status & Preview Box */}
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              {/* File Info Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-fk-border">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-fk-text dir-auto truncate max-w-[280px] sm:max-w-[400px]">{file.name}</span>
                  <span className="text-[12px] font-mono text-fk-text-subtle mt-0.5">
                    Original: {formatBytes(file.size)} {preflight && preflight.width > 0 ? `• ${preflight.width} × ${preflight.height} px` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetWorkspace}
                  className="text-[12px] font-bold text-fk-text-muted hover:text-fk-text px-3 py-1.5 border border-fk-border rounded-fk-md bg-white hover:bg-fk-surface-muted transition-colors shrink-0"
                >
                  Choose Another
                </button>
              </div>

              {/* Status Header Badge */}
              <div className="flex flex-col gap-2">
                {isProcessing ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-[14px] font-bold bg-blue-50 border-blue-200 text-blue-800 w-fit animate-pulse">
                    <span>⚡</span>
                    <span>Updating Preview...</span>
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
                        ? "No beneficial reduction"
                        : result.outcome === "TARGET_NOT_MET"
                        ? "We reduced the image, but could not reach requested size safely"
                        : result.outcome === "ALREADY_WITHIN_TARGET"
                        ? "Your image is already below requested size"
                        : "Image compressed successfully"}
                    </span>
                  </div>
                ) : null}

                {!isProcessing && isNoReduction && (
                  <p className="text-[13px] text-fk-text-muted leading-relaxed">
                    This image is already efficiently compressed with the selected settings. The original file has been preserved.
                  </p>
                )}
              </div>

              {/* Before/After Comparison Slider */}
              {originalPreviewUrl && (
                <div className="w-full flex flex-col items-center">
                  <ImageComparisonSlider
                    originalUrl={originalPreviewUrl}
                    outputUrl={outputPreviewUrl || originalPreviewUrl}
                    originalLabel="Original"
                    outputLabel={result && !isProcessing ? "Optimized" : "Preview"}
                    onSliderUsed={() => trackEvent("comparison_slider_used")}
                  />
                </div>
              )}

              {/* Metrics Display */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-6 w-full p-4 bg-fk-surface-muted border border-fk-border rounded-fk-xl font-mono">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-fk-text-subtle uppercase">Original</span>
                    <span className="text-[18px] font-bold text-fk-text mt-1">{formatBytes(file.size)}</span>
                  </div>
                  <div className="text-[22px] font-light text-fk-text-subtle ltr:rotate-0 rtl:rotate-180">→</div>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-fk-primary uppercase">New Size</span>
                    <span className="text-[20px] font-black text-fk-primary mt-1">
                      {isProcessing ? "Calculating..." : result ? formatBytes(result.outputSizeBytes) : "..."}
                    </span>
                  </div>
                </div>

                {/* Primary Download Action Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isProcessing || !result}
                    className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isProcessing
                      ? "Updating Preview..."
                      : isNoReduction || (result && result.outcome === "ALREADY_WITHIN_TARGET")
                      ? "Download Original Image"
                      : result && result.outcome === "TARGET_NOT_MET"
                      ? "Download Best Result"
                      : "Download Compressed Image"}
                  </button>

                  <button
                    type="button"
                    onClick={handleAdjustSettings}
                    className="h-[50px] px-5 border border-fk-border hover:bg-fk-surface-muted text-fk-text font-bold rounded-fk-md text-[13px] transition-colors"
                  >
                    Adjust Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Settings Controls (Col Span 5 on Desktop, Sticky Top) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-20" ref={settingsSectionRef}>
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              <h2 className="text-[16px] font-black text-fk-text flex items-center gap-2 border-b border-fk-border pb-3">
                <span>⚙️</span>
                <span>Compression Settings</span>
              </h2>

              {/* Compression Goal Mode Selection */}
              <fieldset className="flex flex-col gap-2">
                <legend className="text-[13px] font-bold text-fk-text">Compression Goal</legend>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("BALANCED");
                      trackEvent("compression_mode_selected", { mode: "BALANCED" });
                    }}
                    className={`py-2 text-[12px] font-bold rounded-fk-sm transition-colors ${
                      mode === "BALANCED" ? "bg-fk-primary text-white shadow-sm" : "text-fk-text hover:bg-white/60"
                    }`}
                  >
                    Balanced
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("TARGET_SIZE");
                      trackEvent("compression_mode_selected", { mode: "TARGET_SIZE" });
                    }}
                    className={`py-2 text-[12px] font-bold rounded-fk-sm transition-colors ${
                      mode === "TARGET_SIZE" ? "bg-fk-primary text-white shadow-sm" : "text-fk-text hover:bg-white/60"
                    }`}
                  >
                    Target Size
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("MANUAL");
                      trackEvent("compression_mode_selected", { mode: "MANUAL" });
                    }}
                    className={`py-2 text-[12px] font-bold rounded-fk-sm transition-colors ${
                      mode === "MANUAL" ? "bg-fk-primary text-white shadow-sm" : "text-fk-text hover:bg-white/60"
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </fieldset>

              {/* MODE 1: BALANCED */}
              {mode === "BALANCED" && (
                <div className="flex flex-col gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">Quality Priority</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "BETTER_QUALITY", label: "Better quality", desc: "Preserves more visual detail" },
                      { key: "BALANCED", label: "Balanced", desc: "Recommended balance of clarity & size" },
                      { key: "SMALLER_FILE", label: "Smaller file", desc: "Prioritizes maximum reduction" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setQualityPriority(item.key as QualityPriority);
                        }}
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

              {/* MODE 2: TARGET_SIZE */}
              {mode === "TARGET_SIZE" && (
                <div className="flex flex-col gap-4 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">Target File Size</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      min="20"
                      max="52428800"
                      value={targetValue}
                      onChange={(e) => {
                        setTargetValue(e.target.value);
                        setError(null);
                      }}
                      className="w-full h-10 px-3 border border-fk-border rounded-fk-md font-mono text-[14px] font-bold text-fk-text focus:outline-none focus:border-fk-primary"
                      placeholder="200"
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
                    <span className="text-[11px] font-bold text-fk-text-subtle">Quick Targets:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "100 KB", val: "100", unit: "kb" },
                        { label: "200 KB", val: "200", unit: "kb" },
                        { label: "500 KB", val: "500", unit: "kb" },
                        { label: "1 MB", val: "1", unit: "mb" }
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

              {/* MODE 3: MANUAL */}
              {mode === "MANUAL" && (
                <div className="flex flex-col gap-5 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  {/* Quality Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-fk-text">Quality</label>
                      <span className="text-[13px] font-mono font-bold text-fk-primary">{qualitySlider}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={qualitySlider}
                      onChange={(e) => {
                        setQualitySlider(Number(e.target.value));
                      }}
                      aria-valuetext={`${qualitySlider}% quality`}
                      className="w-full h-2 bg-fk-border rounded-lg appearance-none cursor-pointer accent-fk-primary"
                    />
                    <div className="flex items-center justify-between text-[11px] font-medium text-fk-text-subtle">
                      <span>Low</span>
                      <span>Balanced</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* Dimension Presets */}
                  <div className="flex flex-col gap-2 border-t border-fk-border pt-4">
                    <label className="text-[13px] font-bold text-fk-text">Dimensions</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { key: "ORIGINAL", label: "Keep original" },
                        { key: "1920", label: "1920 px" },
                        { key: "1024", label: "1024 px" },
                        { key: "640", label: "640 px" },
                        { key: "CUSTOM", label: "Custom width" }
                      ].map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => {
                            setDimensionPreset(preset.key as DimensionPreset);
                          }}
                          className={`px-2.5 py-2 text-[12px] font-bold rounded-fk-md border transition-colors ${
                            dimensionPreset === preset.key
                              ? "bg-fk-primary text-white border-fk-primary"
                              : "bg-white text-fk-text border-fk-border hover:border-fk-text-subtle"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {dimensionPreset === "CUSTOM" && (
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-[12px] font-bold text-fk-text whitespace-nowrap">Width (px):</label>
                        <input
                          type="number"
                          min="50"
                          max={preflight?.width || 8000}
                          value={customWidth}
                          onChange={(e) => {
                            setCustomWidth(e.target.value);
                          }}
                          className="w-full h-9 px-3 border border-fk-border rounded-fk-md text-[13px] font-mono font-bold text-fk-text focus:outline-none focus:border-fk-primary"
                          placeholder="1000"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback Action Button */}
              <button
                type="button"
                onClick={runLiveCompressionPass}
                disabled={isProcessing}
                className="w-full h-[46px] border border-fk-border hover:bg-fk-surface-muted text-fk-text rounded-fk-md text-[13px] font-bold transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Updating Preview..." : "Update Preview"}
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

      <TrustPanel />
    </div>
  );
}
