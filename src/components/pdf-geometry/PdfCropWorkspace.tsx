"use client";

import React, { useState } from "react";
import { PdfCropConfig, PdfGeometryOutputArtifact } from "@/utils/pdf-geometry/types";
import { PdfCropEngine } from "@/utils/pdf-geometry/PdfCropEngine";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";

export const PdfCropWorkspace: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceBuffer, setSourceBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [artifact, setArtifact] = useState<PdfGeometryOutputArtifact | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [config, setConfig] = useState<PdfCropConfig>({
    topMargin: 36,
    bottomMargin: 36,
    leftMargin: 36,
    rightMargin: 36,
    applyTo: "all",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please select a valid PDF file.");
      return;
    }

    setErrorMessage(null);
    setArtifact(null);
    setSourceFile(file);

    try {
      const buffer = await file.arrayBuffer();
      setSourceBuffer(buffer);
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setErrorMessage("Could not load PDF document. File may be corrupted or password-protected.");
    }
  };

  const handleApply = async () => {
    if (!sourceBuffer || !sourceFile) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const out = await PdfCropEngine.cropPdf(
        sourceBuffer,
        config,
        sourceFile.name.replace(/\.pdf$/i, "-cropped.pdf")
      );
      setArtifact(out);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to crop PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!artifact) return;
    const blob = new Blob([artifact.outputBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = artifact.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Upload Box */}
      {!sourceFile && (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-fk-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-fk-primary/10 flex items-center justify-center text-fk-primary text-2xl">
            ✂️
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">Select PDF Document</h2>
            <p className="text-sm text-slate-400">Crop margins and adjust page dimensions locally in your browser memory.</p>
          </div>
          <label className="cursor-pointer bg-fk-primary hover:bg-fk-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-fk-primary/20">
            Choose PDF File
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}

      {/* Workspace Editor */}
      {sourceFile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          {/* File Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-sm">
                PDF
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">
                  {(sourceFile.size / 1024 / 1024).toFixed(2)} MB • {pageCount} page{pageCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="local" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setSourceBuffer(null);
                  setArtifact(null);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                Change File
              </button>
            </div>
          </div>

          {/* Margins Control Grid */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Crop Margins (Points)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Top Margin</label>
                <input
                  type="number"
                  min={0}
                  value={config.topMargin}
                  onChange={(e) => setConfig({ ...config, topMargin: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fk-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Bottom Margin</label>
                <input
                  type="number"
                  min={0}
                  value={config.bottomMargin}
                  onChange={(e) => setConfig({ ...config, bottomMargin: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fk-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Left Margin</label>
                <input
                  type="number"
                  min={0}
                  value={config.leftMargin}
                  onChange={(e) => setConfig({ ...config, leftMargin: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fk-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Right Margin</label>
                <input
                  type="number"
                  min={0}
                  value={config.rightMargin}
                  onChange={(e) => setConfig({ ...config, rightMargin: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fk-primary"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">72 points = 1 inch (2.54 cm). Standard margin is 36 pt (0.5 inch).</p>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          {!artifact && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApply}
              className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50"
            >
              {isProcessing ? "Cropping PDF..." : "Crop PDF Document"}
            </button>
          )}

          {/* Result Card */}
          {artifact && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">PDF Cropped Successfully</h4>
                  <p className="text-xs text-slate-400">
                    {pageCount} pages cropped in {artifact.processingDurationMs}ms • {(artifact.outputSizeBytes / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg"
              >
                Download Cropped PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
