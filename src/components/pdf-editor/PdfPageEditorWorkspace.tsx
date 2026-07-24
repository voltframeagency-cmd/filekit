"use client";

import React, { useState } from "react";
import {
  PageOperationItem,
  PdfEditorConfig,
  PdfEditorOutputArtifact,
  PdfEditorProgress,
  PdfEditorRouteTarget,
} from "@/utils/pdf-editor/types";
import {
  bulkDelete,
  bulkRotate,
  generateInitialPageItems,
  invertSelection,
  reorderPages,
  restoreDeletedPages,
  rotatePage,
  setAllSelected,
  toggleDeletePage,
  toggleSelectPage,
} from "@/utils/pdf-editor/pageOperations";
import { preflightPdfDocuments } from "@/utils/pdf-editor/PdfPageEditorPreflight";
import { executePdfPageEditor } from "@/utils/pdf-editor/PdfPageEditorEngine";
import { PdfSelectionToolbar } from "./PdfSelectionToolbar";
import { PdfPageThumbnailGrid } from "./PdfPageThumbnailGrid";
import { PdfEditorResultCard } from "./PdfEditorResultCard";

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
  const [documentBuffers, setDocumentBuffers] = useState<Uint8Array[]>([]);
  const [pageItems, setPageItems] = useState<PageOperationItem[]>([]);
  const [progress, setProgress] = useState<PdfEditorProgress | null>(null);
  const [artifact, setArtifact] = useState<PdfEditorOutputArtifact | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
      const newBuffers: Uint8Array[] = [];
      for (let i = 0; i < files.length; i++) {
        const arrayBuf = await files[i].arrayBuffer();
        newBuffers.push(new Uint8Array(arrayBuf));
      }

      const allBuffers = [...documentBuffers, ...newBuffers];
      const preflight = await preflightPdfDocuments(allBuffers);

      if (!preflight.isValid) {
        setErrorMessage(preflight.error || "Invalid PDF document");
        setProgress(null);
        return;
      }

      setDocumentBuffers(allBuffers);
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

  const handleExecuteOperation = async () => {
    if (documentBuffers.length === 0 || pageItems.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const config: PdfEditorConfig = {
      targetRoute,
      outputFilename: `filekit-${targetRoute.replace("/", "")}-${Date.now()
        .toString()
        .slice(-6)}.pdf`,
    };

    try {
      const output = await executePdfPageEditor(
        documentBuffers,
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
    setDocumentBuffers([]);
    setPageItems([]);
    setArtifact(null);
    setProgress(null);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  const activePages = pageItems.filter((p) => !p.isDeleted);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Local Processing Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          100% In-Browser & Zero File Uploads
        </div>
      </div>

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

      {/* State A: Empty File Upload Dropzone */}
      {documentBuffers.length === 0 && (
        <div className="bg-slate-900/80 border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-10 text-center transition-colors">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-200 mb-1">
            Drop PDF document{targetRoute === "/merge-pdf" ? "s" : ""} here
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Supports local PDF document manipulation up to 100 MB
          </p>

          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition">
            Select PDF File{targetRoute === "/merge-pdf" ? "s" : ""}
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
      {documentBuffers.length > 0 && !artifact && (
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
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onInvertSelection={handleInvertSelection}
            onBulkRotate={handleBulkRotate}
            onBulkDelete={handleBulkDelete}
            onRestoreAll={handleRestoreAll}
            onApplyRangeSelection={handleApplyRangeSelection}
            onAddFiles={handleAddMoreFiles}
          />

          {/* Page Thumbnail Grid */}
          <PdfPageThumbnailGrid
            items={pageItems}
            documentBuffers={documentBuffers}
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
