"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PdfToImageRouteConfig } from "@/config/pdfToImageRoutes";
import { PdfPreflightInfo, PdfRasterizationResult, PdfToImageOutputFormat, ResolutionPreset, RenderedPageResult } from "@/utils/pdf-to-image/types";
import { PdfRasterizationPreflight } from "@/utils/pdf-to-image/PdfRasterizationPreflight";
import { PdfRasterizationEngine } from "@/utils/pdf-to-image/PdfRasterizationEngine";
import { PageSelectionParser } from "@/utils/pdf-to-image/pageSelection";

export interface PdfToImageWorkspaceProps {
  config: PdfToImageRouteConfig;
}

export default function PdfToImageWorkspace({ config }: PdfToImageWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preflightInfo, setPreflightInfo] = useState<PdfPreflightInfo | null>(null);
  const [isPreflighting, setIsPreflighting] = useState<boolean>(false);

  const [pageSelectionMode, setPageSelectionMode] = useState<"ALL" | "CUSTOM">("ALL");
  const [customPageInput, setCustomPageInput] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<PdfToImageOutputFormat>(
    config.fixedOutputFormat || "image/jpeg"
  );
  const [resolutionPreset, setResolutionPreset] = useState<ResolutionPreset>("STANDARD");
  const [quality, setQuality] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);
  const [progressTotal, setProgressTotal] = useState<number>(0);

  const [result, setResult] = useState<PdfRasterizationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const createdUrlsRef = useRef<string[]>([]);

  const revokeAllUrls = () => {
    createdUrlsRef.current.forEach((url) => {
      if (url && typeof window !== "undefined") {
        URL.revokeObjectURL(url);
      }
    });
    createdUrlsRef.current = [];
  };

  useEffect(() => {
    return () => {
      revokeAllUrls();
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    revokeAllUrls();

    setFile(selected);
    setResult(null);
    setErrorMsg(null);
    setIsPreflighting(true);

    try {
      const buffer = await selected.arrayBuffer();
      const info = await PdfRasterizationPreflight.inspect(buffer);
      setPreflightInfo(info);
      if (!info.isValid) {
        setErrorMsg(info.error || "Selected PDF file is invalid or encrypted.");
      }
    } catch {
      setErrorMsg("Could not read the selected PDF file.");
    } finally {
      setIsPreflighting(false);
    }
  };

  const handleConvert = async () => {
    if (!file || !preflightInfo || !preflightInfo.isValid) return;

    let selectedPages: number[] = [];
    if (pageSelectionMode === "ALL") {
      selectedPages = Array.from({ length: preflightInfo.pageCount }, (_, i) => i + 1);
    } else {
      const parsed = PageSelectionParser.parse(customPageInput, preflightInfo.pageCount);
      if (!parsed.isValid) {
        setErrorMsg(parsed.error || "Invalid page selection.");
        return;
      }
      selectedPages = parsed.pageNumbers;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    revokeAllUrls();

    const currentReqId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setProgressCurrent(1);
    setProgressTotal(selectedPages.length);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await PdfRasterizationEngine.rasterize({
        file,
        selectedPageNumbers: selectedPages,
        outputFormat: config.fixedOutputFormat || outputFormat,
        resolutionPreset,
        quality,
        signal: controller.signal,
        onProgress: (current, total) => {
          if (requestIdRef.current === currentReqId) {
            setProgressCurrent(current);
            setProgressTotal(total);
          }
        }
      });

      if (requestIdRef.current === currentReqId) {
        res.renderedPages.forEach((p) => {
          if (p.previewUrl) createdUrlsRef.current.push(p.previewUrl);
        });
        if (res.zipUrl) createdUrlsRef.current.push(res.zipUrl);

        setResult(res);
      }
    } catch (err: any) {
      if (requestIdRef.current === currentReqId && err.message !== "CANCELLED_BY_ABORT_SIGNAL") {
        setErrorMsg(err.message || "PDF conversion failed.");
      }
    } finally {
      if (requestIdRef.current === currentReqId) {
        setIsProcessing(false);
      }
    }
  };

  const handleDownloadSingle = (page: RenderedPageResult) => {
    const a = document.createElement("a");
    a.href = page.previewUrl;
    a.download = page.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = () => {
    if (!result?.zipUrl || !result?.zipFilename) return;
    const a = document.createElement("a");
    a.href = result.zipUrl;
    a.download = result.zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    revokeAllUrls();
    setFile(null);
    setPreflightInfo(null);
    setResult(null);
    setErrorMsg(null);
    setCustomPageInput("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Route Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-fk-text mb-2">{config.h1}</h1>
        <p className="text-[15px] text-fk-text-muted max-w-2xl mx-auto">{config.supportingCopy}</p>
      </div>

      {/* File Select State */}
      {!file && (
        <div className="border-2 border-dashed border-fk-border rounded-fk-xl p-10 text-center bg-white shadow-sm hover:border-fk-primary transition-colors">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            id="pdf-upload-input"
            className="hidden"
          />
          <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center gap-3">
            <span className="text-4xl">📄</span>
            <span className="text-[16px] font-bold text-fk-text">Click to choose a PDF file</span>
            <span className="text-[13px] text-fk-text-muted">Files are processed 100% locally in your browser memory</span>
          </label>
        </div>
      )}

      {/* Preflight & Configuration State */}
      {file && preflightInfo && preflightInfo.isValid && !result && (
        <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-fk-border pb-4">
            <div>
              <h2 className="text-[16px] font-bold text-fk-text">{file.name}</h2>
              <span className="text-[13px] text-fk-text-muted">
                {preflightInfo.pageCount} {preflightInfo.pageCount === 1 ? "page" : "pages"} • {(file.size / 1024).toFixed(0)} KB
                {preflightInfo.isSigned && " • Digitally signed PDF"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-[13px] font-bold text-fk-text-subtle hover:text-fk-text"
            >
              Choose another PDF
            </button>
          </div>

          {/* Controls Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pages selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-fk-text">Pages</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPageSelectionMode("ALL")}
                  className={`flex-1 py-2 px-3 text-[13px] font-bold rounded-fk-md border transition-colors ${
                    pageSelectionMode === "ALL"
                      ? "bg-fk-primary text-white border-fk-primary"
                      : "bg-fk-surface-muted text-fk-text border-fk-border"
                  }`}
                >
                  All pages ({preflightInfo.pageCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPageSelectionMode("CUSTOM")}
                  className={`flex-1 py-2 px-3 text-[13px] font-bold rounded-fk-md border transition-colors ${
                    pageSelectionMode === "CUSTOM"
                      ? "bg-fk-primary text-white border-fk-primary"
                      : "bg-fk-surface-muted text-fk-text border-fk-border"
                  }`}
                >
                  Custom pages
                </button>
              </div>
              {pageSelectionMode === "CUSTOM" && (
                <input
                  type="text"
                  placeholder="e.g. 1, 3-5, 8"
                  value={customPageInput}
                  onChange={(e) => setCustomPageInput(e.target.value)}
                  className="mt-1 px-3 py-2 border border-fk-border rounded-fk-md text-[13px] text-fk-text focus:outline-none focus:border-fk-primary"
                />
              )}
            </div>

            {/* Format selector (hidden in FIXED_PAIR mode) */}
            {config.mode === "GENERAL" ? (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-fk-text">Output format</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOutputFormat("image/jpeg")}
                    className={`flex-1 py-2 px-3 text-[13px] font-bold rounded-fk-md border transition-colors ${
                      outputFormat === "image/jpeg"
                        ? "bg-fk-primary text-white border-fk-primary"
                        : "bg-fk-surface-muted text-fk-text border-fk-border"
                    }`}
                  >
                    JPG
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputFormat("image/png")}
                    className={`flex-1 py-2 px-3 text-[13px] font-bold rounded-fk-md border transition-colors ${
                      outputFormat === "image/png"
                        ? "bg-fk-primary text-white border-fk-primary"
                        : "bg-fk-surface-muted text-fk-text border-fk-border"
                    }`}
                  >
                    PNG
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-fk-text">Output format</label>
                <div className="px-3 py-2 bg-fk-surface-muted border border-fk-border rounded-fk-md text-[13px] font-bold text-fk-text">
                  {config.fixedOutputFormat === "image/jpeg" ? "JPG (Fixed)" : "PNG (Fixed)"}
                </div>
              </div>
            )}

            {/* Resolution Preset */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-fk-text">Resolution</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResolutionPreset("STANDARD")}
                  className={`flex-1 py-2 px-3 text-[13px] font-bold rounded-fk-md border transition-colors ${
                    resolutionPreset === "STANDARD"
                      ? "bg-fk-primary text-white border-fk-primary"
                      : "bg-fk-surface-muted text-fk-text border-fk-border"
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionPreset("HIGH")}
                  className={`flex-1 py-2 px-3 text-[13px] font-bold rounded-fk-md border transition-colors ${
                    resolutionPreset === "HIGH"
                      ? "bg-fk-primary text-white border-fk-primary"
                      : "bg-fk-surface-muted text-fk-text border-fk-border"
                  }`}
                >
                  High
                </button>
              </div>
            </div>

            {/* JPG Quality slider (shown only when JPG output is active) */}
            {(config.fixedOutputFormat === "image/jpeg" || (config.mode === "GENERAL" && outputFormat === "image/jpeg")) && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[13px] font-bold text-fk-text">
                  <span>JPG Quality</span>
                  <span>{quality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-fk-surface-muted rounded-lg appearance-none cursor-pointer accent-fk-primary"
                />
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="px-6 h-11 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {isProcessing
                ? `Converting page ${progressCurrent} of ${progressTotal}...`
                : "Convert PDF"}
            </button>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold rounded-fk-md flex items-center justify-between">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between border-b border-fk-border pb-4 gap-4">
            <div>
              <h2 className="text-[18px] font-extrabold text-fk-text">
                {result.outcome === "PARTIAL_CONVERSION_FAILED"
                  ? "Partial Conversion Completed"
                  : "Conversion Completed"}
              </h2>
              <span className="text-[13px] text-fk-text-muted">
                {result.renderedPages.length} {result.renderedPages.length === 1 ? "image" : "images"} generated • Total size: {(result.totalSizeBytes / 1024).toFixed(0)} KB
                {result.failedPageNumbers && result.failedPageNumbers.length > 0 && (
                  <span className="text-red-600 font-bold ml-2">
                    ({result.failedPageNumbers.length} failed: pages {result.failedPageNumbers.join(", ")})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {result.outcome === "CONVERSION_COMPLETED" && result.renderedPages.length > 1 && result.zipUrl ? (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="px-5 h-10 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[13px] font-bold shadow-sm transition-colors"
                >
                  Download All as ZIP
                </button>
              ) : (
                result.renderedPages.length === 1 && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(result.renderedPages[0])}
                    className="px-5 h-10 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[13px] font-bold shadow-sm transition-colors"
                  >
                    Download Image
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => {
                  revokeAllUrls();
                  setResult(null);
                }}
                className="px-4 h-10 border border-fk-border hover:bg-fk-surface-muted text-fk-text rounded-fk-md text-[13px] font-bold transition-colors"
              >
                Adjust Settings
              </button>
            </div>
          </div>

          {/* Generated Page Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {result.renderedPages.map((page) => (
              <div key={page.pageNumber} className="border border-fk-border rounded-fk-md p-3 flex flex-col gap-2 bg-fk-surface-muted">
                <div className="aspect-[4/3] bg-white rounded flex items-center justify-center overflow-hidden border border-fk-border">
                  <img src={page.previewUrl} alt={`Page ${page.pageNumber}`} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-fk-text">Page {page.pageNumber}</span>
                  <span className="text-fk-text-muted">{(page.sizeBytes / 1024).toFixed(0)} KB</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(page)}
                  className="w-full py-1.5 bg-white hover:bg-fk-surface-muted border border-fk-border rounded text-[12px] font-bold text-fk-text transition-colors mt-1"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
