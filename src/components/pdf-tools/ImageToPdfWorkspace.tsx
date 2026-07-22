"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ImageToPdfRouteConfig } from "@/config/imageToPdfRoutes";
import {
  ImageToPdfItem,
  ImageToPdfSettings,
  ImageToPdfResult,
  ImageToPdfPageSize,
  ImageToPdfOrientation,
  ImageToPdfMargin,
  ImageToPdfPlacement
} from "@/utils/image-to-pdf/types";
import { ImageToPdfPreflight } from "@/utils/image-to-pdf/ImageToPdfPreflight";
import { ImageToPdfEngine } from "@/utils/image-to-pdf/ImageToPdfEngine";
import { ImageToPdfOutputVerification } from "@/utils/image-to-pdf/outputVerification";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import Link from "next/link";

interface ImageToPdfWorkspaceProps {
  config: ImageToPdfRouteConfig;
}

export default function ImageToPdfWorkspace({ config }: ImageToPdfWorkspaceProps) {
  const [items, setItems] = useState<ImageToPdfItem[]>([]);
  const [settings, setSettings] = useState<ImageToPdfSettings>({
    pageSize: "FIT_IMAGE",
    orientation: "AUTO",
    margin: "SMALL",
    placement: "CONTAIN"
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState<ImageToPdfResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customFilename, setCustomFilename] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);
  const ownedUrlsRef = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string) => {
    ownedUrlsRef.current.add(url);
    return url;
  }, []);

  const revokeUrl = useCallback((url: string) => {
    if (ownedUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      ownedUrlsRef.current.delete(url);
    }
  }, []);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      ownedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      ownedUrlsRef.current.clear();
    };
  }, []);

  const handleFilesAdded = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const addedFiles = Array.from(fileList);
    const newItems: ImageToPdfItem[] = [];

    for (const file of addedFiles) {
      // Check mode restrictions
      if (config.mode === "FIXED_INPUT" && config.allowedMime) {
        if (config.allowedMime === "image/jpeg" && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
          setErrorMsg("UNSUPPORTED_INPUT_FORMAT: /jpg-to-pdf accepts JPEG files only.");
          continue;
        }
        if (config.allowedMime === "image/png" && !file.type.includes("png")) {
          setErrorMsg("UNSUPPORTED_INPUT_FORMAT: /png-to-pdf accepts PNG files only.");
          continue;
        }
      }

      const preflight = await ImageToPdfPreflight.inspectFile(file);
      if (!preflight.isValid || !preflight.mimeType) {
        setErrorMsg(preflight.error || "Selected file is not a supported image.");
        continue;
      }

      const previewUrl = registerUrl(URL.createObjectURL(file));
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl,
        rotation: 0,
        width: preflight.width || 800,
        height: preflight.height || 600,
        mimeType: preflight.mimeType
      });
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      if (result) {
        revokeUrl(result.pdfUrl);
        setResult(null);
      }
    }
  };

  const removeItem = (id: string) => {
    const target = items.find((it) => it.id === id);
    if (target) {
      revokeUrl(target.previewUrl);
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (result) {
      revokeUrl(result.pdfUrl);
      setResult(null);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const rotateItem = (id: string, direction: "left" | "right") => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        let newRot: 0 | 90 | 180 | 270;
        if (direction === "right") {
          newRot = ((it.rotation + 90) % 360) as any;
        } else {
          newRot = ((it.rotation - 90 + 360) % 360) as any;
        }
        return { ...it, rotation: newRot };
      })
    );
  };

  const handleCreatePdf = async () => {
    if (items.length === 0) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;
    setIsProcessing(true);
    setErrorMsg(null);
    setProgressText("Initializing PDF creation...");

    try {
      const res = await ImageToPdfEngine.convert({
        items,
        settings,
        signal: controller.signal,
        onProgress: (completed, total) => {
          setProgressText(`Adding image ${completed} of ${total}...`);
        }
      });

      if (currentReqId !== requestIdRef.current || controller.signal.aborted) {
        revokeUrl(res.pdfUrl);
        return;
      }

      registerUrl(res.pdfUrl);

      // Verify final PDF artifact
      const verification = await ImageToPdfOutputVerification.verify(res.pdfBlob, items.length);
      if (!verification.isValid) {
        revokeUrl(res.pdfUrl);
        setErrorMsg(verification.error || "OUTPUT_VERIFICATION_FAILED");
        setIsProcessing(false);
        return;
      }

      if (result) {
        revokeUrl(result.pdfUrl);
      }

      setResult(res);
    } catch (err: any) {
      if (err.message !== "CANCELLED_BY_ABORT_SIGNAL") {
        setErrorMsg(err.message || "PROCESSING_FAILED: Could not create PDF.");
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setIsProcessing(false);
      }
    }
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    items.forEach((it) => revokeUrl(it.previewUrl));
    if (result) {
      revokeUrl(result.pdfUrl);
    }
    setItems([]);
    setResult(null);
    setErrorMsg(null);
  };

  const getDownloadFilename = (): string => {
    if (customFilename.trim()) {
      let cleaned = customFilename.trim().replace(/[/\\]/g, "").replace(/\ control\ /g, "");
      if (!cleaned.endsWith(".pdf")) cleaned += ".pdf";
      return cleaned;
    }
    if (items.length === 1) {
      const base = items[0].file.name.replace(/\.[^/.]+$/, "");
      return `${base}.pdf`;
    }
    return "images-to-pdf.pdf";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-fk-bg text-fk-text font-sans">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-fk-text tracking-tight mb-2">{config.h1}</h1>
          <p className="text-fk-text-subtle text-sm max-w-xl mx-auto">{config.routeDescription}</p>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-fk-md flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Zone when queue is empty */}
        {items.length === 0 && (
          <div className="border-2 border-dashed border-fk-border rounded-fk-lg p-10 text-center bg-fk-surface hover:border-fk-accent transition-colors">
            <input
              type="file"
              multiple
              accept={
                config.mode === "FIXED_INPUT" && config.allowedMime
                  ? config.allowedMime
                  : "image/jpeg, image/png"
              }
              onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer block">
              <div className="w-12 h-12 mx-auto mb-3 text-fk-accent bg-fk-accent/10 rounded-full flex items-center justify-center font-bold text-xl">
                +
              </div>
              <p className="text-base font-bold text-fk-text mb-1">Select Images to Convert to PDF</p>
              <p className="text-xs text-fk-text-subtle">{config.acceptedFileTypesText} • 100% Local & Private</p>
            </label>
          </div>
        )}

        {/* Queue and Configuration View */}
        {items.length > 0 && !result && (
          <div className="space-y-6">
            {/* Control Bar: Add more files and Reset */}
            <div className="flex items-center justify-between bg-fk-surface p-4 rounded-fk-md border border-fk-border">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold">
                  {items.length} {items.length === 1 ? "Image" : "Images"} Selected
                </span>
                <input
                  type="file"
                  multiple
                  accept={
                    config.mode === "FIXED_INPUT" && config.allowedMime
                      ? config.allowedMime
                      : "image/jpeg, image/png"
                  }
                  onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                  className="hidden"
                  id="add-more-input"
                />
                <label
                  htmlFor="add-more-input"
                  className="text-xs font-bold px-3 py-1.5 bg-fk-surface-muted border border-fk-border rounded-fk-md hover:bg-fk-border cursor-pointer transition-colors"
                >
                  + Add More
                </label>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-bold text-fk-text-subtle hover:text-fk-text"
              >
                Clear All
              </button>
            </div>

            {/* Image Queue List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-fk-surface border border-fk-border rounded-fk-md p-3 flex items-center space-x-3"
                >
                  {/* Position Badge */}
                  <span className="w-6 h-6 rounded-full bg-fk-surface-muted text-fk-text-subtle text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-fk-bg rounded border border-fk-border overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    <img
                      src={item.previewUrl}
                      alt={`Page ${index + 1}`}
                      className="max-w-full max-h-full object-contain transition-transform"
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-fk-text truncate">{item.file.name}</p>
                    <p className="text-[11px] text-fk-text-subtle">
                      {item.width} × {item.height} px • {formatSize(item.file.size)}
                    </p>
                    <p className="text-[11px] font-semibold text-fk-accent mt-0.5">
                      Rotation: {item.rotation}°
                    </p>
                  </div>

                  {/* Reorder and Action Controls */}
                  <div className="flex flex-col space-y-1 flex-shrink-0">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => rotateItem(item.id, "left")}
                        title="Rotate Left"
                        className="p-1 hover:bg-fk-surface-muted rounded text-xs"
                      >
                        ↺
                      </button>
                      <button
                        onClick={() => rotateItem(item.id, "right")}
                        title="Rotate Right"
                        className="p-1 hover:bg-fk-surface-muted rounded text-xs"
                      >
                        ↻
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveItem(index, "up")}
                        title="Move Up"
                        className="p-1 hover:bg-fk-surface-muted rounded text-xs disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => moveItem(index, "down")}
                        title="Move Down"
                        className="p-1 hover:bg-fk-surface-muted rounded text-xs disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        title="Remove Image"
                        className="p-1 hover:bg-red-50 text-red-600 rounded text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Page Settings Form */}
            <div className="bg-fk-surface border border-fk-border rounded-fk-lg p-5 space-y-4">
              <h3 className="text-sm font-bold text-fk-text">Page Layout Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Page Size */}
                <div>
                  <label className="block text-xs font-bold text-fk-text-subtle mb-1">Page Size</label>
                  <select
                    value={settings.pageSize}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, pageSize: e.target.value as ImageToPdfPageSize }))
                    }
                    className="w-full text-xs font-bold p-2 bg-fk-bg border border-fk-border rounded-fk-md"
                  >
                    <option value="FIT_IMAGE">Fit Image Proportions</option>
                    <option value="A4">A4 (Standard Document)</option>
                    <option value="LETTER">US Letter</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-xs font-bold text-fk-text-subtle mb-1">Orientation</label>
                  <select
                    value={settings.orientation}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, orientation: e.target.value as ImageToPdfOrientation }))
                    }
                    disabled={settings.pageSize === "FIT_IMAGE"}
                    className="w-full text-xs font-bold p-2 bg-fk-bg border border-fk-border rounded-fk-md disabled:opacity-40"
                  >
                    <option value="AUTO">Auto</option>
                    <option value="PORTRAIT">Portrait</option>
                    <option value="LANDSCAPE">Landscape</option>
                  </select>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-xs font-bold text-fk-text-subtle mb-1">Margins</label>
                  <select
                    value={settings.margin}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, margin: e.target.value as ImageToPdfMargin }))
                    }
                    className="w-full text-xs font-bold p-2 bg-fk-bg border border-fk-border rounded-fk-md"
                  >
                    <option value="NONE">No Margins</option>
                    <option value="SMALL">Small Margins</option>
                    <option value="MEDIUM">Medium Margins</option>
                  </select>
                </div>

                {/* Placement */}
                <div>
                  <label className="block text-xs font-bold text-fk-text-subtle mb-1">Image Placement</label>
                  <select
                    value={settings.placement}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, placement: e.target.value as ImageToPdfPlacement }))
                    }
                    className="w-full text-xs font-bold p-2 bg-fk-bg border border-fk-border rounded-fk-md"
                  >
                    <option value="CONTAIN">Fit Without Cropping</option>
                    <option value="COVER">Fill Page (May Crop)</option>
                  </select>
                </div>
              </div>

              {settings.placement === "COVER" && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ Note: "Fill page" mode stretches images to cover the page bounds and may crop image edges.
                </p>
              )}

              {/* Convert Action Button */}
              <div className="pt-2">
                <button
                  disabled={isProcessing}
                  onClick={handleCreatePdf}
                  className="w-full py-3 bg-fk-accent text-white font-extrabold text-sm rounded-fk-md hover:bg-fk-accent/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? progressText || "Generating PDF..." : "Create PDF"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result View */}
        {result && (
          <div className="bg-fk-surface border border-fk-border rounded-fk-lg p-6 text-center space-y-5">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-fk-text">PDF Created Successfully!</h2>
              <p className="text-xs text-fk-text-subtle mt-1">
                {result.pageCount} {result.pageCount === 1 ? "Page" : "Pages"} • Source: {formatSize(result.totalSourceSize)} • PDF Size: {formatSize(result.outputPdfSize)}
              </p>
            </div>

            {/* Custom Output Filename */}
            <div className="max-w-xs mx-auto">
              <label className="block text-xs font-bold text-fk-text-subtle mb-1 text-left">Output Filename</label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder={getDownloadFilename()}
                className="w-full text-xs font-bold p-2 bg-fk-bg border border-fk-border rounded-fk-md"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={result.pdfUrl}
                download={getDownloadFilename()}
                className="w-full sm:w-auto px-6 py-3 bg-fk-accent text-white font-extrabold text-sm rounded-fk-md hover:bg-fk-accent/90 transition-colors inline-block"
              >
                Download PDF
              </a>
              <button
                onClick={() => {
                  revokeUrl(result.pdfUrl);
                  setResult(null);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-fk-surface-muted text-fk-text font-bold text-xs rounded-fk-md hover:bg-fk-border transition-colors"
              >
                Adjust Settings
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3 text-fk-text-subtle hover:text-fk-text font-bold text-xs"
              >
                Choose Different Images
              </button>
            </div>
          </div>
        )}
        <section className="mt-12 pt-8 border-t border-fk-border space-y-6">
          <div>
            <h2 className="text-lg font-bold text-fk-text mb-2">Supported Input Formats</h2>
            <p className="text-xs text-fk-text-subtle">{config.acceptedFileTypesText}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-fk-text mb-2">Common Use Cases</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-fk-text-subtle">
              {config.useCases.map((uc, idx) => (
                <li key={idx}>{uc}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-fk-text mb-2">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="bg-fk-surface p-3 rounded-fk-md border border-fk-border">
                  <p className="text-xs font-bold text-fk-text whitespace-pre-line">{faq.question}</p>
                  <p className="text-xs text-fk-text-subtle mt-1 whitespace-pre-line">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
