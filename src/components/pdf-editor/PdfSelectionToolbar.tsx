"use client";

import React, { useState } from "react";
import { PageOperationItem, PdfEditorRouteTarget, PdfSplitMode } from "@/utils/pdf-editor/types";
import { parsePageRangeString } from "@/utils/pdf-editor/pageOperations";

interface PdfSelectionToolbarProps {
  pageItems: PageOperationItem[];
  targetRoute: PdfEditorRouteTarget;
  splitMode?: PdfSplitMode;
  splitEveryN?: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onInvertSelection: () => void;
  onBulkRotate: (direction: "cw" | "ccw") => void;
  onRotateOddPages?: (direction: "cw" | "ccw") => void;
  onRotateEvenPages?: (direction: "cw" | "ccw") => void;
  onSortByFilename?: () => void;
  onBulkDelete: () => void;
  onRestoreAll: () => void;
  onApplyRangeSelection?: (selectedIndices: number[]) => void;
  onSetSplitMode?: (mode: PdfSplitMode, n?: number) => void;
  onAddFiles?: (files: FileList) => void;
}

export const PdfSelectionToolbar: React.FC<PdfSelectionToolbarProps> = ({
  pageItems,
  targetRoute,
  splitMode = "range",
  splitEveryN = 2,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onBulkRotate,
  onRotateOddPages,
  onRotateEvenPages,
  onSortByFilename,
  onBulkDelete,
  onRestoreAll,
  onApplyRangeSelection,
  onSetSplitMode,
  onAddFiles,
}) => {
  const [rangeText, setRangeText] = useState("");
  const [everyNInput, setEveryNInput] = useState(splitEveryN);

  const activePages = pageItems.filter((p) => !p.isDeleted);
  const selectedPages = pageItems.filter((p) => p.isSelected && !p.isDeleted);
  const deletedPages = pageItems.filter((p) => p.isDeleted);

  const handleApplyRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onApplyRangeSelection || !rangeText.trim()) return;
    const indices = parsePageRangeString(rangeText, pageItems.length);
    onApplyRangeSelection(indices);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onAddFiles) {
      onAddFiles(e.target.files);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Page Counts & Selection Badges */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-slate-300">
            <span className="text-blue-400 font-mono text-sm font-bold">
              {activePages.length}
            </span>{" "}
            active pages{" "}
            <span className="text-slate-500 font-normal">
              (Total: {pageItems.length})
            </span>
          </div>

          {selectedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-medium">
              {selectedPages.length} selected
            </span>
          )}

          {deletedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-700/50 font-medium">
              {deletedPages.length} deleted
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Files for Merge */}
          {targetRoute === "/merge-pdf" && onAddFiles && (
            <>
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add More PDFs
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {onSortByFilename && (
                <button
                  type="button"
                  onClick={onSortByFilename}
                  title="Sort merged pages alphabetically by filename"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort by Filename
                </button>
              )}
            </>
          )}

          {/* Selection Toggles */}
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Select All
          </button>

          <button
            type="button"
            onClick={onDeselectAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Deselect All
          </button>

          <button
            type="button"
            onClick={onInvertSelection}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Invert
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Bulk Rotate */}
          <button
            type="button"
            onClick={() => onBulkRotate("cw")}
            title="Rotate selected or all pages 90° Clockwise"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
            Rotate 90°
          </button>

          {/* Odd/Even Rotations for Rotate PDF Route */}
          {targetRoute === "/rotate-pdf-pages" && (
            <>
              {onRotateOddPages && (
                <button
                  type="button"
                  onClick={() => onRotateOddPages("cw")}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Rotate Odd Pages
                </button>
              )}
              {onRotateEvenPages && (
                <button
                  type="button"
                  onClick={() => onRotateEvenPages("cw")}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Rotate Even Pages
                </button>
              )}
            </>
          )}

          {/* Bulk Delete */}
          <button
            type="button"
            onClick={onBulkDelete}
            title="Delete selected or all active pages"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 text-xs font-medium transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>

          {/* Restore Deleted */}
          {deletedPages.length > 0 && (
            <button
              type="button"
              onClick={onRestoreAll}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-semibold transition"
            >
              Restore All ({deletedPages.length})
            </button>
          )}
        </div>
      </div>

      {/* Split Mode Selector for Split PDF */}
      {targetRoute === "/split-pdf" && onSetSplitMode && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
          <span className="text-xs text-slate-400 font-medium">Split Mode:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSetSplitMode("every-page")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                splitMode === "every-page"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Split Every Page
            </button>

            <button
              type="button"
              onClick={() => onSetSplitMode("every-n-pages", everyNInput)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                splitMode === "every-n-pages"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Split Every N Pages
            </button>

            {splitMode === "every-n-pages" && (
              <input
                type="number"
                min={1}
                max={50}
                value={everyNInput}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setEveryNInput(val);
                  onSetSplitMode("every-n-pages", val);
                }}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg font-mono"
              />
            )}

            <button
              type="button"
              onClick={() => onSetSplitMode("range")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                splitMode === "range"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Custom Range Selection
            </button>
          </div>
        </div>
      )}

      {/* Page Range Parser for Split / Extract */}
      {(targetRoute === "/extract-pdf-pages" ||
        (targetRoute === "/split-pdf" && splitMode === "range")) &&
        onApplyRangeSelection && (
          <form
            onSubmit={handleApplyRange}
            className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
          >
            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Page Range:
            </label>
            <input
              type="text"
              value={rangeText}
              onChange={(e) => setRangeText(e.target.value)}
              placeholder="e.g. 1-3, 5, 8-10"
              className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              Select Range
            </button>
          </form>
        )}
    </div>
  );
};
