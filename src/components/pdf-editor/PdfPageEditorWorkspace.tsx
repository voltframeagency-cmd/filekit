"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  PageOperationItem,
  PdfEditorConfig,
  PdfEditorOutputArtifact,
  PdfEditorProgress,
  PdfEditorRouteTarget,
  PdfSplitMode,
} from "@/utils/pdf-editor/types";
import {
  bulkDelete,
  bulkRotate,
  invertSelection,
  reorderPages,
  restoreDeletedPages,
  rotateEvenPages,
  rotateOddPages,
  rotatePage,
  setAllSelected,
  sortPagesByFileName,
  toggleDeletePage,
  toggleSelectPage,
} from "@/utils/pdf-editor/pageOperations";
import { InputPdfDoc, preflightPdfDocuments } from "@/utils/pdf-editor/PdfPageEditorPreflight";
import { executePdfPageEditor } from "@/utils/pdf-editor/PdfPageEditorEngine";
import { PdfSelectionToolbar } from "./PdfSelectionToolbar";
import { PdfPageThumbnailGrid } from "./PdfPageThumbnailGrid";
import { PdfEditorResultCard } from "./PdfEditorResultCard";
import { useLanguage } from "@/components/layout/LanguageContext";

// Configure pdfjs-dist worker location
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface PdfPageEditorWorkspaceProps {
  targetRoute: PdfEditorRouteTarget;
  title: string;
  subtitle: string;
  actionButtonText: string;
}

export const PdfPageEditorWorkspace: React.FC<PdfPageEditorWorkspaceProps> = ({
  targetRoute,
  title,
  subtitle,
  actionButtonText,
}) => {
  const { t } = useLanguage();
  const [inputDocs, setInputDocs] = useState<InputPdfDoc[]>([]);
  const [pageItems, setPageItems] = useState<PageOperationItem[]>([]);
  const [progress, setProgress] = useState<PdfEditorProgress | null>(null);
  const [artifact, setArtifact] = useState<PdfEditorOutputArtifact | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signatureWarning, setSignatureWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitMode, setSplitMode] = useState<PdfSplitMode>("range");
  const [splitEveryN, setSplitEveryN] = useState<number>(2);

  // Shared cached PDF.js proxies to avoid parsing buffers 200 times per document
  const pdfProxiesRef = useRef<Record<number, pdfjsLib.PDFDocumentProxy>>({});

  useEffect(() => {
    return () => {
      // Cleanup PDF.js document proxies on workspace unmount
      Object.values(pdfProxiesRef.current).forEach((proxy) => {
        try { proxy.destroy(); } catch (_) {}
      });
      pdfProxiesRef.current = {};
    };
  }, []);

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setProgress({
      stage: "inspecting",
      message: "Reading PDF files...",
      processedItems: 0,
      totalItems: files.length,
      percentage: 10,
    });

    try {
      const newDocs: InputPdfDoc[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuf = await file.arrayBuffer();
        newDocs.push({
          name: file.name,
          buffer: new Uint8Array(arrayBuf),
        });
      }

      const allDocs = [...inputDocs, ...newDocs];
      const preflight = await preflightPdfDocuments(allDocs);

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

      // Pre-load PDF.js document proxies ONCE for bounded thumbnail rendering
      for (let docIdx = 0; docIdx < allDocs.length; docIdx++) {
        if (!pdfProxiesRef.current[docIdx]) {
          try {
            const loadingTask = pdfjsLib.getDocument({
              data: allDocs[docIdx].buffer,
              cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
              cMapPacked: true,
            });
            const proxy = await loadingTask.promise;
            pdfProxiesRef.current[docIdx] = proxy;
          } catch (_) {
            // Gracefully fallback if local proxy creation fails
          }
        }
      }

      setInputDocs(allDocs);
      setPageItems(preflight.pageItems);
      setProgress(null);
      setArtifact(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load PDF file.");
      setProgress(null);
    }
  };

  const handleAddMoreFiles = (files: FileList) => {
    handleFileUpload(files);
  };

  const handleRotate = (id: string, direction: "cw" | "ccw") => {
    setPageItems((prev) => rotatePage(prev, id, direction));
  };

  const handleToggleDelete = (id: string) => {
    setPageItems((prev) => toggleDeletePage(prev, id));
  };

  const handleToggleSelect = (id: string) => {
    setPageItems((prev) => toggleSelectPage(prev, id));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setPageItems((prev) => reorderPages(prev, fromIndex, toIndex));
  };

  const handleSelectAll = () => {
    setPageItems((prev) => setAllSelected(prev, true));
  };

  const handleDeselectAll = () => {
    setPageItems((prev) => setAllSelected(prev, false));
  };

  const handleInvertSelection = () => {
    setPageItems((prev) => invertSelection(prev));
  };

  const handleBulkRotate = (direction: "cw" | "ccw") => {
    const hasSelection = pageItems.some((p) => p.isSelected && !p.isDeleted);
    setPageItems((prev) => bulkRotate(prev, direction, hasSelection));
  };

  const handleRotateOddPages = (direction: "cw" | "ccw") => {
    setPageItems((prev) => rotateOddPages(prev, direction));
  };

  const handleRotateEvenPages = (direction: "cw" | "ccw") => {
    setPageItems((prev) => rotateEvenPages(prev, direction));
  };

  const handleSortByFilename = () => {
    setPageItems((prev) => sortPagesByFileName(prev));
  };

  const handleBulkDelete = () => {
    const hasSelection = pageItems.some((p) => p.isSelected && !p.isDeleted);
    setPageItems((prev) => bulkDelete(prev, hasSelection));
  };

  const handleRestoreAll = () => {
    setPageItems((prev) => restoreDeletedPages(prev));
  };

  const handleApplyRangeSelection = (selectedIndices: number[]) => {
    const selectedSet = new Set(selectedIndices);
    setPageItems((prev) =>
      prev.map((item, idx) => ({
        ...item,
        isSelected: selectedSet.has(idx),
      }))
    );
  };

  const handleSetSplitMode = (mode: PdfSplitMode, n?: number) => {
    setSplitMode(mode);
    if (n && n > 0) {
      setSplitEveryN(n);
    }
  };

  const handleExecuteOperation = async () => {
    if (inputDocs.length === 0 || pageItems.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const config: PdfEditorConfig = {
      targetRoute,
      splitMode,
      splitEveryN,
      outputFilename: `filekit-${targetRoute.replace("/", "")}-${Date.now()
        .toString()
        .slice(-6)}.pdf`,
    };

    try {
      const output = await executePdfPageEditor(
        inputDocs,
        pageItems,
        config,
        (prog) => setProgress(prog)
      );

      setArtifact(output);
      setIsProcessing(false);
      setProgress(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate output PDF.");
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleResetWorkspace = () => {
    // Destroy all cached proxies
    Object.values(pdfProxiesRef.current).forEach((proxy) => {
      try { proxy.destroy(); } catch (_) {}
    });
    pdfProxiesRef.current = {};

    setInputDocs([]);
    setPageItems([]);
    setArtifact(null);
    setProgress(null);
    setErrorMessage(null);
    setSignatureWarning(null);
    setIsProcessing(false);
  };

  const activePages = pageItems.filter((p) => !p.isDeleted);
  const documentBuffers = inputDocs.map((d) => d.buffer);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      {/* Error Notice */}
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

      {/* Digital Signature Warning Notice */}
      {signatureWarning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs font-medium flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{signatureWarning}</span>
        </div>
      )}

      {/* State A: Empty File Upload Dropzone */}
      {inputDocs.length === 0 && (
        <div className="bg-slate-900/80 border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-10 text-center transition-colors">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-200 mb-1">
            {t("workspace.dropHere") || (targetRoute === "/merge-pdf" ? "Drop PDF documents here" : "Drop PDF document here")}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            {t("workspace.pdfOnly") || "Supports local PDF document manipulation up to 100 MB"}
          </p>

          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition">
            {t("workspace.selectFile") || (targetRoute === "/merge-pdf" ? "Select PDF Files" : "Select PDF File")}
            <input
              type="file"
              multiple={targetRoute === "/merge-pdf"}
              accept="application/pdf"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* State B: Active Editing Workspace */}
      {inputDocs.length > 0 && !artifact && (
        <div>
          {/* Progress Indicator Banner */}
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

          {/* Selection Toolbar */}
          <PdfSelectionToolbar
            pageItems={pageItems}
            targetRoute={targetRoute}
            splitMode={splitMode}
            splitEveryN={splitEveryN}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onInvertSelection={handleInvertSelection}
            onBulkRotate={handleBulkRotate}
            onRotateOddPages={handleRotateOddPages}
            onRotateEvenPages={handleRotateEvenPages}
            onSortByFilename={handleSortByFilename}
            onBulkDelete={handleBulkDelete}
            onRestoreAll={handleRestoreAll}
            onApplyRangeSelection={handleApplyRangeSelection}
            onSetSplitMode={handleSetSplitMode}
            onAddFiles={handleAddMoreFiles}
          />

          {/* Page Thumbnail Grid */}
          <PdfPageThumbnailGrid
            items={pageItems}
            documentBuffers={documentBuffers}
            pdfDocProxies={pdfProxiesRef.current}
            onRotate={handleRotate}
            onToggleDelete={handleToggleDelete}
            onToggleSelect={handleToggleSelect}
            onReorder={handleReorder}
          />

          {/* Footer Action Button */}
          <div className="sticky bottom-6 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={handleExecuteOperation}
              disabled={isProcessing || activePages.length === 0}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-base shadow-2xl shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing PDF...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {actionButtonText} ({activePages.length} Pages)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* State C: Verified Result Card */}
      {artifact && (
        <PdfEditorResultCard
          artifact={artifact}
          onAdjustPages={() => setArtifact(null)}
          onResetWorkspace={handleResetWorkspace}
        />
      )}
    </div>
  );
};
