"use client";

import React, { useState, useRef, useEffect } from "react";
import { PdfToImageRouteConfig } from "@/config/pdfToImageRoutes";
import { PdfPreflightInfo, PdfRasterizationResult, PdfToImageOutputFormat, ResolutionPreset, RenderedPageResult } from "@/utils/pdf-to-image/types";
import { PdfRasterizationPreflight } from "@/utils/pdf-to-image/PdfRasterizationPreflight";
import { PdfRasterizationEngine } from "@/utils/pdf-to-image/PdfRasterizationEngine";
import { PageSelectionParser } from "@/utils/pdf-to-image/pageSelection";
import { getDeviceBudget, formatBytes } from "@/utils/pdf-to-image/limits";
import { FileKitAsset } from "../visuals/FileKitAsset";

export interface PdfToImageWorkspaceProps {
  config: PdfToImageRouteConfig;
}

export default function PdfToImageWorkspace({ config }: PdfToImageWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preflightInfo, setPreflightInfo] = useState<PdfPreflightInfo | null>(null);
  const [isPreflighting, setIsPreflighting] = useState<boolean>(false);

  const budget = getDeviceBudget();
  const formattedMaxSize = formatBytes(budget.maxBytes);

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

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentReqId = ++requestIdRef.current;

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressCurrent(0);
    setProgressTotal(selectedPages.length);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const res = await PdfRasterizationEngine.convert({
        pdfBuffer: arrayBuffer,
        pageNumbers: selectedPages,
        outputFormat,
        resolutionPreset,
        quality: outputFormat === "image/jpeg" ? quality : undefined,
        signal: controller.signal,
        onProgress: (current, total) => {
          if (currentReqId === requestIdRef.current) {
            setProgressCurrent(current);
            setProgressTotal(total);
          }
        }
      });

      if (currentReqId !== requestIdRef.current || controller.signal.aborted) {
        return;
      }

      // Track created object URLs
      res.renderedPages.forEach((p) => {
        if (p.previewUrl) createdUrlsRef.current.push(p.previewUrl);
      });
      if (res.zipUrl) createdUrlsRef.current.push(res.zipUrl);

      setResult(res);
    } catch (err: any) {
      if (err.message !== "CANCELLED_BY_ABORT_SIGNAL") {
        setErrorMsg(err.message || "Failed to convert PDF pages to images.");
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-center justify-between shadow-sm">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* File Dropzone State */}
      {!file && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center bg-blue-50/30 hover:bg-blue-50/70 hover:border-blue-500 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              id="pdf-upload-input"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="mb-2 flex items-center justify-center">
              <FileKitAsset
                name={(config.slug.replace(/^\//, '') as any) || "pdf-to-jpg"}
                className="w-28 h-28 sm:w-36 sm:h-36 max-w-[180px] max-h-[120px] object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                alt="Tool operation illustration"
              />
            </div>
            
            <p className="text-lg font-extrabold text-slate-900 mb-4 z-20 relative pointer-events-none">Drop a PDF here</p>
            
            <div className="flex items-center justify-center gap-4 w-full max-w-[200px] mx-auto mb-5 z-20 relative pointer-events-none">
              <div className="h-px bg-blue-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
              <div className="h-px bg-blue-200 flex-1"></div>
            </div>

            <div className="flex flex-col items-center gap-2.5 z-20 relative pointer-events-none">
              <div className="bg-blue-600 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-md flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                Choose PDF
              </div>
              <p className="text-[13px] font-semibold text-slate-500">PDF up to {formattedMaxSize}</p>
            </div>

            <div className="mt-6 flex justify-center z-20 relative pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-blue-700 border border-blue-200 shadow-sm">
                🔒 Processed locally in your browser. Your file is never uploaded.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preflight & Configuration State */}
      {file && preflightInfo && preflightInfo.isValid && !result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{file.name}</h2>
              <span className="text-xs font-semibold text-slate-500">
                {preflightInfo.pageCount} {preflightInfo.pageCount === 1 ? "page" : "pages"} • {(file.size / 1024).toFixed(0)} KB
                {preflightInfo.isSigned && " • Digitally signed PDF"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
            >
              Choose another PDF
            </button>
          </div>

          {/* Warning Banner */}
          {preflightInfo.warningMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{preflightInfo.warningMessage}</span>
            </div>
          )}

          {/* Controls Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pages selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">Pages</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPageSelectionMode("ALL")}
                  className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl border transition-colors ${
                    pageSelectionMode === "ALL"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  All pages ({preflightInfo.pageCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPageSelectionMode("CUSTOM")}
                  className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl border transition-colors ${
                    pageSelectionMode === "CUSTOM"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Custom pages
                </button>
              </div>
              {pageSelectionMode === "CUSTOM" && (
                <input
                  type="text"
                  placeholder="e.g. 1, 3, 5-8"
                  value={customPageInput}
                  onChange={(e) => setCustomPageInput(e.target.value)}
                  className="mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
            </div>

            {/* Format Selector (if not fixed) */}
            {!config.fixedOutputFormat && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700">Image Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as PdfToImageOutputFormat)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="image/jpeg">JPG (JPEG Image)</option>
                  <option value="image/png">PNG (Portable Network Graphics)</option>
                  <option value="image/webp">WebP (Modern Image Format)</option>
                </select>
              </div>
            )}

            {/* Resolution Preset */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">Image Resolution</label>
              <select
                value={resolutionPreset}
                onChange={(e) => setResolutionPreset(e.target.value as ResolutionPreset)}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="STANDARD">Standard Quality (150 DPI)</option>
                <option value="HIGH">High Quality (200 DPI)</option>
                <option value="MAXIMUM">Maximum Quality (300 DPI)</option>
              </select>
            </div>

            {/* Quality Slider (for JPG) */}
            {outputFormat === "image/jpeg" && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">JPEG Quality</label>
                  <span className="text-xs font-black text-blue-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConvert}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-colors shadow-md disabled:opacity-50 mt-2"
          >
            {isProcessing
              ? `Rendering page ${progressCurrent} of ${progressTotal}...`
              : `Convert PDF to ${outputFormat === "image/png" ? "PNG" : "JPG"}`}
          </button>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {result.outcome === "PARTIAL_CONVERSION_FAILED"
                  ? "Partial Conversion Completed"
                  : "Conversion Completed Successfully!"}
              </h2>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
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
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-colors"
                >
                  Download All as ZIP
                </button>
              ) : (
                result.renderedPages.length === 1 && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(result.renderedPages[0])}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-colors"
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
                className="px-4 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Adjust Settings
              </button>
            </div>
          </div>

          {/* Generated Page Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {result.renderedPages.map((page) => (
              <div key={page.pageNumber} className="border border-slate-200 rounded-2xl p-3 flex flex-col gap-2 bg-slate-50">
                <div className="aspect-[4/3] bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                  <img src={page.previewUrl} alt={`Page ${page.pageNumber}`} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-extrabold text-slate-900">Page {page.pageNumber}</span>
                  <span className="text-slate-500 font-medium">{(page.sizeBytes / 1024).toFixed(0)} KB</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(page)}
                  className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-blue-600 transition-colors mt-1 shadow-sm"
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
