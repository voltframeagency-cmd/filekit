"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/layout/LanguageContext";
import TrustPanel from "@/components/layout/TrustPanel";
import ImageComparisonSlider from "@/components/image-tools/ImageComparisonSlider";
import { ImageConversionEngine } from "@/utils/image-converter/ImageConversionEngine";
import { ImageConversionPreflight } from "@/utils/image-converter/ImageConversionPreflight";
import { ImageConversionResult, ImageConversionPreflightReport, SupportedImageFormat } from "@/utils/image-converter/types";
import { ImageConversionRouteConfig } from "@/config/imageConversionRoutes";
import { FileKitAsset } from "@/components/visuals/FileKitAsset";
import { FileKitAssetName, fileKitAssets } from "@/components/visuals/assetRegistry";

export interface ImageConverterWorkspaceProps {
  routeConfig: ImageConversionRouteConfig;
}

export default function ImageConverterWorkspace({ routeConfig }: ImageConverterWorkspaceProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Target format state
  const [targetFormat, setTargetFormat] = useState<SupportedImageFormat>(
    routeConfig.fixedOutputFormat || "image/png"
  );

  // Quality & Background controls
  const [qualitySlider, setQualitySlider] = useState<number>(80);
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [customHex, setCustomHex] = useState<string>("#FFFFFF");
  const [bgChoice, setBgChoice] = useState<"WHITE" | "BLACK" | "CUSTOM">("WHITE");

  // File and result states
  const [file, setFile] = useState<File | null>(null);
  const [preflight, setPreflight] = useState<ImageConversionPreflightReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Object URLs
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);

  // Request versioning & cancellation refs
  const requestIdRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const settingsSectionRef = useRef<HTMLDivElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Compute route asset name dynamically (handling /ar/png-to-ico or /png-to-ico)
  const pathSegments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  const routeSlug = (pathSegments.length > 1 && pathSegments[0].length <= 5)
    ? pathSegments[1]
    : pathSegments[0] || routeConfig.slug.replace(/^\//, '');
  const assetName = routeSlug || 'png-to-jpg';

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
      inputFormat: selected.type
    });

    try {
      const buf = await selected.arrayBuffer();
      const report = await ImageConversionPreflight.inspect(buf);
      if (!report.isValid) {
        setFile(null);
        setPreflight(null);
        setError(report.error || "Unsupported image format.");
        return;
      }

      // Check FIXED_PAIR route expected input
      if (routeConfig.mode === "FIXED_PAIR" && routeConfig.expectedInputFormat) {
        if (report.mimeType !== routeConfig.expectedInputFormat) {
          setFile(null);
          setPreflight(null);
          const expectedExt = routeConfig.expectedInputFormat === "image/jpeg" ? "JPG/JPEG" : routeConfig.expectedInputFormat.split("/")[1].toUpperCase();
          setError(`This page converts ${expectedExt} images. Please select a valid ${expectedExt} file.`);
          return;
        }
      }

      setPreflight(report);

      // In GENERAL mode, if targetFormat matches input mimeType, switch default to a different format
      if (routeConfig.mode === "GENERAL") {
        if (report.mimeType === "image/jpeg") setTargetFormat("image/png");
        else if (report.mimeType === "image/png") setTargetFormat("image/webp");
        else if (report.mimeType === "image/webp") setTargetFormat("image/png");
      }
    } catch (err: any) {
      setError(err.message || "Failed to inspect selected image.");
    }
  };

  const runLiveConversionPass = useCallback(async () => {
    if (!file || !preflight || !preflight.isValid) return;

    // Abort previous active operation if running
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    activeAbortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;
    setIsProcessing(true);
    setError(null);
    trackEvent("conversion_started");

    try {
      const buf = await file.arrayBuffer();
      const bgHex = bgChoice === "WHITE" ? "#FFFFFF" : bgChoice === "BLACK" ? "#000000" : customHex;

      const res = await ImageConversionEngine.convert({
        inputBuffer: buf,
        targetMime: targetFormat,
        quality: qualitySlider,
        backgroundColor: bgHex,
        signal: controller.signal
      });

      if (requestIdRef.current !== currentReqId || controller.signal.aborted) {
        trackEvent("cancelled");
        return;
      }

      setResult(res);
      trackEvent("conversion_completed", {
        inputFormat: res.inputMimeType,
        outputFormat: res.outputMimeType,
        outputSizeBytes: res.outputSizeBytes
      });

      setTimeout(() => {
        resultHeadingRef.current?.focus();
      }, 100);
    } catch (err: any) {
      if (requestIdRef.current !== currentReqId || controller.signal.aborted) return;
      setError(err.message || "Image conversion failed.");
      trackEvent("processing_failed");
    } finally {
      if (requestIdRef.current === currentReqId) {
        setIsProcessing(false);
      }
    }
  }, [file, preflight, targetFormat, qualitySlider, bgChoice, customHex]);

  // Initial trigger when file is loaded
  useEffect(() => {
    if (file && preflight && preflight.isValid) {
      runLiveConversionPass();
    }
  }, [file, preflight]);

  // Debounced watcher when settings change
  useEffect(() => {
    if (!file || !preflight || !preflight.isValid) return;
    const timer = setTimeout(() => {
      runLiveConversionPass();
    }, 180);
    return () => clearTimeout(timer);
  }, [file, preflight, targetFormat, qualitySlider, bgChoice, customHex, runLiveConversionPass]);

  const handleDownload = () => {
    if (!result || !result.outputBuffer || !file) return;
    const blob = new Blob([result.outputBuffer], { type: result.outputMimeType });
    const url = URL.createObjectURL(blob);
    const ext = result.outputMimeType === "image/jpeg" ? "jpg" : result.outputMimeType === "image/png" ? "png" : "webp";
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted_${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
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

  const isTransparentToJpg = preflight?.hasAlpha && targetFormat === "image/jpeg";
  const showQualityControl = targetFormat === "image/jpeg" || targetFormat === "image/webp";

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
            {/* Bespoke Route Brand Illustration Asset */}
            <div className="mb-5 flex items-center justify-center">
              <FileKitAsset
                name={assetName}
                className="w-28 h-28 sm:w-36 sm:h-36 max-w-[180px] max-h-[120px] object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                alt="Tool operation illustration"
              />
            </div>
            <p className="text-[15px] font-bold text-fk-text">
              {t("homepage.dropzoneTitle") || "Drop your image here to convert"}
            </p>
            <p className="text-[12px] font-medium text-fk-text-subtle mt-1">
              {t("homepage.dropzoneSubtitle") || "Supports JPG, PNG, and static WebP up to 50 MB"}
            </p>
            <p className="text-[11px] font-medium text-fk-text-subtle mt-2 bg-fk-surface-muted px-3 py-1 rounded-full border border-fk-border">
              🔒 {t("workspace.freeNotice") || "Your image is converted locally in your browser memory and is not uploaded."}
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-fk-md font-medium">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Workspace (Side-by-Side Grid on Desktop) */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Preview & Converted Results (Col Span 7 on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
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
                    <span>Converting Image...</span>
                  </div>
                ) : result ? (
                  <div
                    ref={resultHeadingRef as any}
                    tabIndex={-1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-[14px] font-bold bg-fk-success-bg border-[#BBF7D0] text-fk-success w-fit focus:outline-none"
                  >
                    <span>✓</span>
                    <span>Image converted successfully</span>
                  </div>
                ) : null}

                {/* Transparency Warning Notice */}
                {!isProcessing && isTransparentToJpg && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[12px] rounded-fk-md font-medium">
                    ⚠️ JPEG does not support transparency. Transparent areas will use the selected background color.
                  </div>
                )}
              </div>

              {/* Before/After Comparison Slider */}
              {originalPreviewUrl && (
                <div className="w-full flex flex-col items-center">
                  <ImageComparisonSlider
                    originalUrl={originalPreviewUrl}
                    outputUrl={outputPreviewUrl || originalPreviewUrl}
                    originalLabel={preflight ? preflight.mimeType.split("/")[1].toUpperCase() : "Original"}
                    outputLabel={targetFormat.split("/")[1].toUpperCase()}
                    onSliderUsed={() => trackEvent("comparison_slider_used")}
                  />
                </div>
              )}

              {/* Metrics Display */}
              {result && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-6 w-full p-4 bg-fk-surface-muted border border-fk-border rounded-fk-xl font-mono">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-fk-text-subtle uppercase">{result.inputMimeType.split("/")[1]}</span>
                      <span className="text-[18px] font-bold text-fk-text mt-1">{formatBytes(result.originalSizeBytes)}</span>
                    </div>
                    <div className="text-[22px] font-light text-fk-text-subtle ltr:rotate-0 rtl:rotate-180">→</div>
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-fk-primary uppercase">{result.outputMimeType.split("/")[1]}</span>
                      <span className="text-[20px] font-black text-fk-primary mt-1">{formatBytes(result.outputSizeBytes)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-around p-3 bg-white border border-fk-border rounded-fk-md text-[12px] font-bold text-fk-text">
                    <span>📐 {result.outputWidth} × {result.outputHeight} px</span>
                    <span>
                      {result.isLarger
                        ? `📈 Output is ${result.sizeChangePercentage}% larger`
                        : `📉 Output is ${result.sizeChangePercentage}% smaller`}
                    </span>
                  </div>

                  {/* Primary Download Action Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                      Download Converted Image
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
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Settings Controls (Col Span 5 on Desktop, Sticky Top) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-20" ref={settingsSectionRef}>
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              <h2 className="text-[16px] font-black text-fk-text flex items-center gap-2 border-b border-fk-border pb-3">
                <span>⚙️</span>
                <span>Conversion Settings</span>
              </h2>

              {/* GENERAL MODE FORMAT SELECTOR */}
              {routeConfig.mode === "GENERAL" && (
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-fk-text">Target Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mime: "image/jpeg", label: "JPG" },
                      { mime: "image/png", label: "PNG" },
                      { mime: "image/webp", label: "WebP" }
                    ].map((fmt) => (
                      <button
                        key={fmt.mime}
                        type="button"
                        onClick={() => setTargetFormat(fmt.mime as SupportedImageFormat)}
                        className={`py-2 text-[13px] font-bold rounded-fk-md border transition-colors ${
                          targetFormat === fmt.mime
                            ? "bg-fk-primary text-white border-fk-primary"
                            : "bg-white text-fk-text border-fk-border hover:border-fk-text-subtle"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FIXED PAIR DISPLAY */}
              {routeConfig.mode === "FIXED_PAIR" && (
                <div className="flex items-center justify-between p-3 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <span className="text-[13px] font-bold text-fk-text">Output Format</span>
                  <span className="text-[13px] font-mono font-bold text-fk-primary bg-white px-3 py-1 border border-fk-border rounded-fk-sm">
                    {targetFormat.split("/")[1].toUpperCase()}
                  </span>
                </div>
              )}

              {/* TRANSPARENCY BACKGROUND CONTROL (PNG/WebP -> JPG) */}
              {isTransparentToJpg && (
                <div className="flex flex-col gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">Background Color (for alpha)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "WHITE", label: "White", hex: "#FFFFFF" },
                      { key: "BLACK", label: "Black", hex: "#000000" },
                      { key: "CUSTOM", label: "Custom", hex: customHex }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setBgChoice(item.key as any)}
                        className={`py-2 text-[12px] font-bold rounded-fk-md border transition-colors ${
                          bgChoice === item.key
                            ? "bg-fk-primary text-white border-fk-primary"
                            : "bg-white text-fk-text border-fk-border hover:border-fk-text-subtle"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {bgChoice === "CUSTOM" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        className="w-8 h-8 rounded border border-fk-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        className="w-24 h-8 px-2 border border-fk-border rounded-fk-md font-mono text-[12px]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* QUALITY SLIDER (Shown for JPEG or WebP output) */}
              {showQualityControl && (
                <div className="flex flex-col gap-2 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-fk-text">Quality</label>
                    <span className="text-[13px] font-mono font-bold text-fk-primary">{qualitySlider}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={qualitySlider}
                    onChange={(e) => setQualitySlider(Number(e.target.value))}
                    aria-valuetext={`${qualitySlider}% quality`}
                    className="w-full h-2 bg-fk-border rounded-lg appearance-none cursor-pointer accent-fk-primary"
                  />
                  <div className="flex items-center justify-between text-[11px] font-medium text-fk-text-subtle">
                    <span>Low</span>
                    <span>Balanced</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={runLiveConversionPass}
                disabled={isProcessing}
                className="w-full h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Converting..." : result ? "Reconvert Image" : "Convert Image"}
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
