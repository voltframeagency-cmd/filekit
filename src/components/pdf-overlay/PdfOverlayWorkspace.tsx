"use client";

import React, { useState } from "react";
import {
  PdfOverlayOutputArtifact,
  PdfOverlayProgress,
  WatermarkConfig,
} from "@/utils/pdf-overlay/types";
import { preflightOverlayPdf } from "@/utils/pdf-overlay/PdfOverlayPreflight";
import { executePdfWatermark } from "@/utils/pdf-overlay/PdfOverlayEngine";
import { PdfWatermarkControls } from "./PdfWatermarkControls";
import { PdfPagePreview } from "./PdfPagePreview";
import { PdfOverlayResultCard } from "./PdfOverlayResultCard";

export const PdfOverlayWorkspace: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceBuffer, setSourceBuffer] = useState<Uint8Array | null>(null);
  const [progress, setProgress] = useState<PdfOverlayProgress | null>(null);
  const [artifact, setArtifact] = useState<PdfOverlayOutputArtifact | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signatureWarning, setSignatureWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    type: "text",
    text: "CONFIDENTIAL",
    fontColor: "#EF4444",
    fontSize: 36,
    opacity: 0.4,
    rotationAngle: 45,
    positionPreset: "center",
    targetPagesMode: "all",
  });

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);
    setProgress({
      stage: "inspecting",
      message: "Reading PDF document...",
      processedItems: 0,
      totalItems: 1,
      percentage: 10,
    });

    try {
      const arrayBuf = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuf);
      const preflight = await preflightOverlayPdf(buffer, file.name);

      if (!preflight.isValid) {
        setErrorMessage(preflight.error || "Invalid PDF document");
        setProgress(null);
        return;
      }

      if (preflight.signatureWarning) {
        setSignatureWarning(preflight.signatureWarning);
      } else {
        setSignatureWarning(null);
      }

      setSourceFile(file);
      setSourceBuffer(buffer);
      setProgress(null);
      setArtifact(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load PDF file.");
      setProgress(null);
    }
  };

  const handleWatermarkConfigChange = (updated: Partial<WatermarkConfig>) => {
    setWatermarkConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const arrayBuf = await file.arrayBuffer();
      const imgBuffer = new Uint8Array(arrayBuf);
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      setWatermarkConfig((prev) => ({
        ...prev,
        imageBuffer: imgBuffer,
        imageMimeType: mimeType,
      }));
    }
  };

  const handleApplyWatermark = async () => {
    if (!sourceBuffer || !sourceFile) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const outputName = `watermarked-${sourceFile.name}`;

    try {
      const output = await executePdfWatermark(
        sourceBuffer,
        watermarkConfig,
        outputName,
        (prog) => setProgress(prog)
      );

      setArtifact(output);
      setIsProcessing(false);
      setProgress(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to apply watermark to PDF.");
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleResetWorkspace = () => {
    setSourceFile(null);
    setSourceBuffer(null);
    setArtifact(null);
    setProgress(null);
    setErrorMessage(null);
    setSignatureWarning(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-2">
          Add Watermark to PDF
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Stamp text or image watermarks onto PDF pages with custom opacity, rotation, and position.
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          100% In-Browser & Zero File Uploads
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Signature Warning Notice */}
      {signatureWarning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs font-medium flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{signatureWarning}</span>
        </div>
      )}

      {/* State A: Dropzone */}
      {!sourceBuffer && (
        <div className="bg-slate-900/80 border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-10 text-center transition-colors">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-200 mb-1">
            Drop PDF document here
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Supports local PDF watermark overlay up to 100 MB
          </p>

          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition">
            Select PDF File
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* State B: Active Editing Workspace */}
      {sourceBuffer && !artifact && (
        <div>
          {/* Progress Indicator */}
          {progress && (
            <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-blue-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-300 mb-2">
                <span>{progress.message}</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Column: Watermark Controls */}
            <div className="lg:col-span-5">
              <PdfWatermarkControls
                config={watermarkConfig}
                onChange={handleWatermarkConfigChange}
                onImageFileChange={handleImageFileChange}
              />
            </div>

            {/* Right Column: Live Page Preview */}
            <div className="lg:col-span-7">
              <PdfPagePreview sourceBuffer={sourceBuffer} config={watermarkConfig} />
            </div>
          </div>

          {/* Action Button */}
          <div className="sticky bottom-6 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={handleApplyWatermark}
              disabled={isProcessing}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-base shadow-2xl shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Stamping Watermark...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Apply Watermark
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* State C: Verified Result Card */}
      {artifact && (
        <PdfOverlayResultCard
          artifact={artifact}
          onAdjustWatermark={() => setArtifact(null)}
          onResetWorkspace={handleResetWorkspace}
        />
      )}
    </div>
  );
};
