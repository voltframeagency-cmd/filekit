"use client";

import React, { useState } from "react";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";
import { BlankPageOptions, DuplicatePagesOptions, ExtractedImageItem } from "@/utils/pdf-manipulation/types";
import { PdfManipulationEngine } from "@/utils/pdf-manipulation/PdfManipulationEngine";

export type PdfManipulationMode =
  | "reverse"
  | "add-blank"
  | "duplicate"
  | "pdf-to-text"
  | "extract-images"
  | "flatten";

export interface PdfManipulationWorkspaceProps {
  mode: PdfManipulationMode;
  toolTitle: string;
  toolSlug: string;
}

export const PdfManipulationWorkspace: React.FC<PdfManipulationWorkspaceProps> = ({
  mode,
  toolTitle,
  toolSlug,
}) => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Blank page options
  const [blankPosition, setBlankPosition] = useState<"start" | "end" | "after-each" | "custom">("end");
  const [customPageOffset, setCustomPageOffset] = useState<number>(1);

  // Duplicate pages options
  const [duplicateMode, setDuplicateMode] = useState<"all-consecutive" | "all-appended" | "selected">("all-consecutive");
  const [selectedPagesStr, setSelectedPagesStr] = useState<string>("1");

  // Output results
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [outputSizeBytes, setOutputSizeBytes] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extractedImages, setExtractedImages] = useState<ExtractedImageItem[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setDownloadUrl(null);
    setExtractedText(null);
    setExtractedImages([]);

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Please select a valid PDF document.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      setPdfBytes(new Uint8Array(buffer));
      setSourceFile(file);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to read PDF document.");
    }
  };

  const handleProcess = async () => {
    if (!sourceFile || !pdfBytes) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const baseName = sourceFile.name.replace(/\.pdf$/i, "");

    try {
      if (mode === "reverse") {
        const outBytes = await PdfManipulationEngine.reversePdf(pdfBytes);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-reversed.pdf`);
        setOutputSizeBytes(outBytes.length);
      } else if (mode === "add-blank") {
        const options: BlankPageOptions = {
          position: blankPosition,
          customPageIndex: customPageOffset,
        };
        const outBytes = await PdfManipulationEngine.addBlankPage(pdfBytes, options);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-with-blank-pages.pdf`);
        setOutputSizeBytes(outBytes.length);
      } else if (mode === "duplicate") {
        const pages = selectedPagesStr
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n) && n > 0);

        const options: DuplicatePagesOptions = {
          mode: duplicateMode,
          selectedPageNumbers: pages.length > 0 ? pages : [1],
        };
        const outBytes = await PdfManipulationEngine.duplicatePages(pdfBytes, options);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-duplicated.pdf`);
        setOutputSizeBytes(outBytes.length);
      } else if (mode === "flatten") {
        const outBytes = await PdfManipulationEngine.flattenPdf(pdfBytes);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-flattened.pdf`);
        setOutputSizeBytes(outBytes.length);
      } else if (mode === "pdf-to-text") {
        const textRes = await PdfManipulationEngine.extractPdfText(pdfBytes);
        setExtractedText(textRes.text);
        const blob = new Blob([textRes.text], { type: "text/plain;charset=utf-8" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}.txt`);
        setOutputSizeBytes(blob.size);
      } else if (mode === "extract-images") {
        const images = await PdfManipulationEngine.extractImagesFromPdf(pdfBytes);
        if (images.length === 0) {
          throw new Error("No raster images could be extracted from this PDF.");
        }
        setExtractedImages(images);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to process PDF operation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadSingleImage = (img: ExtractedImageItem) => {
    const blob = new Blob([img.data as unknown as BlobPart], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sourceFile?.name.replace(/\.pdf$/i, "")}-page-${img.pageIndex}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {!sourceFile && (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-fk-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl">
            {mode === "reverse"
              ? "🔄"
              : mode === "add-blank"
              ? "📄"
              : mode === "duplicate"
              ? "📑"
              : mode === "pdf-to-text"
              ? "📝"
              : mode === "extract-images"
              ? "🖼️"
              : "🔒"}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">Select PDF Document</h2>
            <p className="text-sm text-slate-400">
              {mode === "reverse"
                ? "Reverse PDF page order from last to first directly in browser memory."
                : mode === "add-blank"
                ? "Insert blank pages at start, end, or after specific pages locally."
                : mode === "duplicate"
                ? "Duplicate all pages or selected page ranges for double-sided workflows."
                : mode === "pdf-to-text"
                ? "Extract clean text from standard PDF documents without uploading files."
                : mode === "extract-images"
                ? "Extract high-resolution embedded images from PDF pages as PNG files."
                : "Flatten interactive form fields and annotations into static PDF pages."}
            </p>
          </div>
          <label className="cursor-pointer bg-fk-primary hover:bg-fk-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-fk-primary/20">
            Choose PDF
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}

      {sourceFile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                PDF
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">{(sourceFile.size / 1024).toFixed(1)} KB • Local Safe</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="local" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setPdfBytes(null);
                  setDownloadUrl(null);
                  setExtractedText(null);
                  setExtractedImages([]);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                Change PDF
              </button>
            </div>
          </div>

          {/* Mode Controls */}
          {mode === "add-blank" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Blank Page Insertion Position:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "end", label: "At the End" },
                  { id: "start", label: "At the Start" },
                  { id: "after-each", label: "After Every Page" },
                  { id: "custom", label: "Custom Page Offset" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setBlankPosition(pos.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      blankPosition === pos.id ? "bg-fk-primary text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {blankPosition === "custom" && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400">Insert blank page after page number:</span>
                  <input
                    type="number"
                    min="1"
                    value={customPageOffset}
                    onChange={(e) => setCustomPageOffset(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-fk-primary"
                  />
                </div>
              )}
            </div>
          )}

          {mode === "duplicate" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Duplication Mode:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all-consecutive", label: "Duplicate Each Page (1, 1, 2, 2...)" },
                  { id: "all-appended", label: "Append Full Copy at End" },
                  { id: "selected", label: "Duplicate Selected Pages Only" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDuplicateMode(m.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      duplicateMode === m.id ? "bg-fk-primary text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {duplicateMode === "selected" && (
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-xs text-slate-400">Page numbers to duplicate (comma-separated, e.g. 1, 3, 5):</label>
                  <input
                    type="text"
                    value={selectedPagesStr}
                    onChange={(e) => setSelectedPagesStr(e.target.value)}
                    placeholder="1, 3, 5"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-fk-primary"
                  />
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          {!downloadUrl && extractedImages.length === 0 && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProcess}
              className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing on this device...</span>
                </>
              ) : mode === "reverse" ? (
                "Reverse PDF Pages"
              ) : mode === "add-blank" ? (
                "Insert Blank Page(s)"
              ) : mode === "duplicate" ? (
                "Duplicate PDF Pages"
              ) : mode === "pdf-to-text" ? (
                "Extract Text"
              ) : mode === "extract-images" ? (
                "Extract Images"
              ) : (
                "Flatten PDF Form"
              )}
            </button>
          )}

          {/* PDF to Text Viewer */}
          {extractedText !== null && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Extracted Text Content:</span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-xs font-bold text-fk-primary hover:text-white bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-lg transition"
                >
                  {isCopied ? "✓ Copied!" : "📋 Copy All Text"}
                </button>
              </div>
              <textarea
                readOnly
                value={extractedText}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none select-all leading-relaxed"
              />
            </div>
          )}

          {/* Extracted Images Viewer */}
          {extractedImages.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Extracted {extractedImages.length} Image(s)</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {extractedImages.map((img) => {
                  const blob = new Blob([img.data as unknown as BlobPart], { type: "image/png" });
                  const url = URL.createObjectURL(blob);
                  return (
                    <div key={img.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                      <img src={url} alt={`Page ${img.pageIndex}`} className="h-32 object-contain rounded-lg bg-slate-900" />
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Page {img.pageIndex}</span>
                        <span>{img.width}×{img.height}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleImage(img)}
                        className="w-full bg-fk-primary/80 hover:bg-fk-primary text-white text-xs font-bold py-1.5 rounded-lg transition"
                      >
                        Download PNG
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Download Result Card */}
          {downloadUrl && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Operation Complete</h4>
                  <p className="text-xs text-slate-400">
                    {outputFileName} • {(outputSizeBytes / 1024).toFixed(1)} KB • Processed 100% locally
                  </p>
                </div>
              </div>
              <a
                href={downloadUrl}
                download={outputFileName}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition text-center shadow-lg"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
