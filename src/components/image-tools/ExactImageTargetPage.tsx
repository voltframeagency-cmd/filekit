"use client";

import React, { useState, useEffect } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import ImageComparisonSlider from "@/components/image-tools/ImageComparisonSlider";
import { useLanguage } from "@/components/layout/LanguageContext";
import { ImageOptimizationEngine } from "@/utils/image-engine/ImageOptimizationEngine";
import { ImagePreflightInspector } from "@/utils/image-engine/ImagePreflightInspector";
import { ImageCapabilityRouter } from "@/utils/image-engine/ImageCapabilityRouter";
import { ImageVerificationResult, ImagePreflightReport } from "@/utils/image-engine/types";
import { ExactImageRouteConfig } from "@/config/exactImageRoutes";

import { buildCanonicalUrl } from "@/utils/siteUrl";

export interface ExactImageTargetPageProps {
  config: ExactImageRouteConfig;
}

export default function ExactImageTargetPage({ config }: ExactImageTargetPageProps) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preflight, setPreflight] = useState<ImagePreflightReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);

  // Privacy-compliant analytics tracker
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const safePayload: Record<string, any> = {
      operation: config.analyticsOperation,
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

  // Manage preview object URLs safely (parent owns URL creation and cleanup)
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

    setIsProcessing(true);
    setError(null);
    trackEvent("exact_target_processing_started", { targetSizeBytes: config.targetBytes });

    try {
      const buf = await file.arrayBuffer();
      const res = await ImageOptimizationEngine.compress(buf, config.targetBytes, undefined);
      setResult(res);

      trackEvent(res.outcome.toLowerCase(), {
        originalSizeBytes: res.originalSizeBytes,
        outputSizeBytes: res.outputSizeBytes,
        attemptsRun: res.attemptsRun,
        durationMs: res.processingDurationMs
      });

      if (typeof window !== "undefined") {
        (window as any)[`__LAST_${config.targetLabel.replace(/\s+/g, "")}_RESULT__`] = res;
        (window as any).__LAST_EXACT_ROUTE_RESULT__ = res;
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
    link.download = `compressed_${config.targetLabel.toLowerCase().replace(/\s+/g, "")}_${file.name.replace(/\.[^/.]+$/, "")}.${result.outputMimeType.split("/")[1] || "jpg"}`;
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

  const getStatusMessage = (res: ImageVerificationResult) => {
    switch (res.outcome) {
      case "TARGET_ACHIEVED":
        return {
          title: config.successCopy,
          badgeBg: "bg-fk-success-bg border-[#BBF7D0] text-fk-success",
          icon: "✓"
        };
      case "TARGET_NOT_MET":
        return {
          title: config.targetMissCopy,
          badgeBg: "bg-amber-50 border-amber-200 text-amber-800",
          icon: "ℹ"
        };
      case "ALREADY_WITHIN_TARGET":
        return {
          title: config.alreadyWithinCopy,
          badgeBg: "bg-blue-50 border-blue-200 text-blue-800",
          icon: "✓"
        };
      case "NO_BENEFICIAL_REDUCTION":
        return {
          title: config.noBenefitCopy,
          badgeBg: "bg-gray-100 border-gray-300 text-gray-800",
          icon: "ℹ"
        };
      default:
        return {
          title: "Compression pass completed.",
          badgeBg: "bg-gray-100 border-gray-300 text-gray-800",
          icon: "✓"
        };
    }
  };

  const canonicalUrl = buildCanonicalUrl(`/${config.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `FileKit ${config.h1}`,
    "url": canonicalUrl,
    "description": config.description,
    "applicationCategory": "UtilitiesApplication",
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
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-fk-text leading-[1.1] tracking-tight">
            {config.h1}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-fk-text-muted leading-relaxed">
            {config.supportingCopy}
          </p>
        </section>

        <section className="w-full max-w-[840px] mx-auto bg-white border border-fk-border rounded-fk-xl p-6 md:p-8 shadow-sm">
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
                Target: {"\u2066"}{config.targetLabel} max{"\u2069"} • Supports JPG, PNG, and static WebP
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

              {file.type === "image/png" && (
                <p className="text-[12px] text-fk-text-muted italic bg-amber-50 p-3 rounded-fk-md border border-amber-200">
                  ℹ PNG files are processed safely, but some optimized PNGs may not become smaller.
                </p>
              )}

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-fk-md text-[13px] text-blue-900 font-medium">
                <span>Target Size Limit: <strong>{"\u2066"}{config.targetLabel} ({config.targetBytes.toLocaleString()} Bytes){"\u2069"}</strong></span>
              </div>

              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {isProcessing ? `Compressing below ${config.targetLabel}...` : `Compress to ${config.targetLabel}`}
              </button>
            </div>
          )}

          {result && file && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-200">
              {(() => {
                const status = getStatusMessage(result);
                return (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[14px] font-bold ${status.badgeBg}`}>
                    <span>{status.icon}</span>
                    <span>{status.title}</span>
                  </div>
                );
              })()}

              {/* Visual Comparison Slider */}
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

              <div className="flex flex-col gap-1 text-center text-[13px]">
                <p className="font-bold text-fk-text">
                  {"\u2066"}{result.reductionPercentage.toFixed(1)}% smaller{"\u2069"} • {"\u2066"}{result.widthAfter} × {result.heightAfter} px{"\u2069"}
                </p>
                <span className="text-[11px] text-fk-text-subtle">
                  Processed locally in browser ({"\u2066"}{result.processingDurationMs} ms{"\u2069"})
                </span>
              </div>

              <div className="flex gap-3 w-full max-w-[500px]">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors"
                >
                  {`Download Image (< ${config.targetLabel})`}
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

        {/* Route Specific Use Cases & FAQs */}
        <section className="w-full max-w-[840px] mx-auto flex flex-col gap-6 mt-4">
          <div className="bg-white border border-fk-border rounded-fk-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-[18px] font-bold text-fk-text mb-3">Common Use Cases for {config.targetLabel} Compression</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-fk-text-muted">
              {config.useCases.map((useCase, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-fk-primary font-bold">✓</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-fk-border rounded-fk-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-[18px] font-bold text-fk-text mb-4">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4 text-[13px]">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-fk-border pb-3 last:border-0 last:pb-0">
                  <h3 className="font-bold text-fk-text">{faq.question}</h3>
                  <p className="text-fk-text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TrustPanel />
      </main>

      <AppFooter />
    </div>
  );
}
