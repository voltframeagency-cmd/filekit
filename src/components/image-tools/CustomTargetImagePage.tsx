"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import ImageComparisonSlider from "@/components/image-tools/ImageComparisonSlider";
import { ImageOptimizationEngine } from "@/utils/image-engine/ImageOptimizationEngine";
import { ImagePreflightInspector } from "@/utils/image-engine/ImagePreflightInspector";
import { ImageCapabilityRouter } from "@/utils/image-engine/ImageCapabilityRouter";
import { ImageVerificationResult, ImagePreflightReport } from "@/utils/image-engine/types";

export default function CustomTargetImagePage() {
  const searchParams = useSearchParams();

  // Query parameter defaults: ?target=3&unit=mb or default 200 KB
  const initialTargetStr = searchParams.get("target");
  const initialUnitStr = searchParams.get("unit")?.toLowerCase();

  const [targetValue, setTargetValue] = useState<string>(
    initialTargetStr && !isNaN(Number(initialTargetStr)) ? initialTargetStr : "200"
  );
  const [targetUnit, setTargetUnit] = useState<"kb" | "mb">(
    initialUnitStr === "mb" ? "mb" : "kb"
  );

  const [file, setFile] = useState<File | null>(null);
  const [preflight, setPreflight] = useState<ImagePreflightReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);

  // Compute exact target bytes
  const numericVal = Math.max(0.01, parseFloat(targetValue) || 200);
  const targetBytes =
    targetUnit === "mb"
      ? Math.round(numericVal * 1024 * 1024)
      : Math.round(numericVal * 1024);

  const targetLabel = `${numericVal} ${targetUnit.toUpperCase()}`;

  // Privacy-compliant analytics tracker
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const safePayload: Record<string, any> = {
      operation: "compress_image_custom_target",
      targetBytes,
      targetUnit,
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

  // Preview Object URL lifecycle management
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

  useEffect(() => {
    if (!result || !result.outputBuffer) {
      if (outputPreviewUrl) URL.revokeObjectURL(outputPreviewUrl);
      setOutputPreviewUrl(null);
      return;
    }
    const blob = new Blob([result.outputBuffer], { type: result.outputMimeType });
    const url = URL.createObjectURL(blob);
    setOutputPreviewUrl(url);
    trackEvent("comparison_viewed", {
      outcome: result.outcome,
      formatClass: result.outputMimeType
    });
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

    trackEvent("image_selected", {
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
          trackEvent("unsupported_format", { reason: "UNSUPPORTED_ANIMATION" });
        } else if (msg.includes("MEMORY_LIMIT_EXCEEDED")) {
          msg = "This image is too large to process safely in your browser.";
          trackEvent("memory_limit_exceeded", { estimatedPeakMB: route.decodedMemoryMB });
        }
        setError(msg);
        return;
      }
      setPreflight(report);
    } catch (err: any) {
      let msg = err.message || "Failed to inspect selected image.";
      if (msg.includes("UNSUPPORTED_FORMAT")) {
        msg = "Unsupported format. Please select a valid JPEG, PNG, or WebP file.";
        trackEvent("unsupported_format", { reason: "UNSUPPORTED_FORMAT" });
      }
      setError(msg);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    if (targetBytes < 20 * 1024) {
      setError("Minimum target size is 20 KB to prevent severe visual degradation.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    trackEvent("custom_target_processing_started", { targetSizeBytes: targetBytes });

    try {
      const buf = await file.arrayBuffer();
      const res = await ImageOptimizationEngine.compress(buf, targetBytes, undefined);
      setResult(res);

      trackEvent(res.outcome.toLowerCase(), {
        originalSizeBytes: res.originalSizeBytes,
        outputSizeBytes: res.outputSizeBytes,
        attemptsRun: res.attemptsRun,
        durationMs: res.processingDurationMs
      });

      if (typeof window !== "undefined") {
        (window as any).__LAST_CUSTOM_TARGET_RESULT__ = res;
      }
    } catch (err: any) {
      let msg = err.message || "Image compression failed.";
      if (msg.includes("UNSUPPORTED_ANIMATION")) {
        msg = "Animated images are not supported yet.";
        trackEvent("unsupported_format", { reason: "UNSUPPORTED_ANIMATION" });
      } else if (msg.includes("MEMORY_LIMIT_EXCEEDED")) {
        msg = "This image is too large to process safely in your browser.";
        trackEvent("memory_limit_exceeded");
      } else if (msg.includes("ABORT_SIGNAL") || msg.includes("CANCELLED")) {
        msg = "Compression pass cancelled.";
        trackEvent("processing_cancelled");
      }
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !result.outputBuffer || !file) return;
    const blob = new Blob([result.outputBuffer], { type: result.outputMimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${targetValue}${targetUnit}_${file.name.replace(/\.[^/.]+$/, "")}.${result.outputMimeType.split("/")[1] || "jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackEvent("output_downloaded", { downloadedSizeBytes: result.outputSizeBytes });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "\u20660 Bytes\u2069";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    return `\u2066${formatted}\u2069`;
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://filekit.com";
  const canonicalUrl = `${siteUrl}/compress-image-to-size`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Compress an Image to a Specific Size",
    "url": canonicalUrl,
    "description": "Compress JPEG, PNG, or WebP images to any custom file size limit (KB or MB) locally in your browser memory.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All"
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader />

      <main className="flex-1 flex flex-col gap-6 md:gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-6 md:py-12">
        <section className="flex flex-col gap-1.5 max-w-[840px] mx-auto w-full text-left ltr:text-left rtl:text-right px-2">
          <span className="text-[12px] font-bold uppercase tracking-wider text-fk-primary">Image Compressor</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-fk-text leading-[1.1] tracking-tight">
            Compress an Image to a Specific Size
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-fk-text-muted leading-relaxed">
            Enter your target size in KB or MB. FileKit optimizes your JPEG, PNG, or WebP image locally inside your browser memory.
          </p>
        </section>

        <section className="w-full max-w-[840px] mx-auto bg-white border border-fk-border rounded-fk-xl p-6 md:p-8 shadow-sm">
          {/* Custom Size Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md mb-6">
            <label className="text-[13px] font-bold text-fk-text whitespace-nowrap">
              Target Size Limit:
            </label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                step="any"
                min="20"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-28 h-10 px-3 border border-fk-border rounded-fk-md font-mono text-[14px] font-bold text-fk-text focus:outline-none focus:border-fk-primary"
                placeholder="200"
              />
              <select
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value as "kb" | "mb")}
                className="h-10 px-3 border border-fk-border rounded-fk-md font-bold text-[13px] text-fk-text bg-white focus:outline-none focus:border-fk-primary"
              >
                <option value="kb">KB</option>
                <option value="mb">MB</option>
              </select>
              <span className="text-[12px] font-mono text-fk-text-subtle">
                ({"Wait: \u2066"}{targetBytes.toLocaleString()} Bytes{"\u2069"})
              </span>
            </div>
          </div>

          {!file && (
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
                Target: {"\u2066"}{targetLabel} max{"\u2069"} • Supports JPG, PNG, and static WebP
              </p>
              <p className="text-[11px] font-medium text-fk-text-subtle mt-2 bg-fk-surface-muted px-3 py-1 rounded-full border border-fk-border">
                🔒 Your image is processed locally in your browser and is not uploaded.
              </p>
            </div>
          )}

          {file && !result && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-fk-text dir-auto">{file.name}</span>
                  <span className="text-[12px] font-mono text-fk-text-subtle mt-0.5">Original: {formatBytes(file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreflight(null); setError(null); }}
                  className="text-[12px] font-bold text-fk-text-muted hover:text-fk-text"
                >
                  Change File
                </button>
              </div>

              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {isProcessing ? `Compressing below ${targetLabel}...` : `Compress to ${targetLabel}`}
              </button>
            </div>
          )}

          {result && file && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-[14px] font-bold bg-fk-success-bg border-[#BBF7D0] text-fk-success">
                <span>✓</span>
                <span>Optimized below {targetLabel}</span>
              </div>

              {originalPreviewUrl && outputPreviewUrl && (
                <ImageComparisonSlider
                  originalUrl={originalPreviewUrl}
                  outputUrl={outputPreviewUrl}
                  originalLabel="Original"
                  outputLabel="Optimized"
                  onSliderUsed={() => trackEvent("comparison_slider_used")}
                />
              )}

              <div className="flex items-center justify-center gap-6 w-full max-w-[460px] p-4 bg-fk-surface-muted border border-fk-border rounded-fk-xl font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-fk-text-subtle uppercase">Original</span>
                  <span className="text-[18px] font-bold text-fk-text mt-1">{formatBytes(result.originalSizeBytes)}</span>
                </div>
                <div className="text-[22px] font-light text-fk-text-subtle ltr:rotate-0 rtl:rotate-180">→</div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-fk-primary uppercase">New Size</span>
                  <span className="text-[20px] font-black text-fk-primary mt-1">{formatBytes(result.outputSizeBytes)}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-[500px]">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors"
                >
                  {`Download Image (< ${targetLabel})`}
                </button>
                <button
                  type="button"
                  onClick={() => { setResult(null); setFile(null); }}
                  className="h-[50px] px-6 border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[13px] font-bold transition-colors"
                >
                  Process Another
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-fk-md font-medium">
              ⚠️ {error}
            </div>
          )}
        </section>

        <TrustPanel />
      </main>

      <AppFooter />
    </div>
  );
}
