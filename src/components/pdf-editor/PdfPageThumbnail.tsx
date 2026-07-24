"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PageOperationItem } from "@/utils/pdf-editor/types";

// Configure pdfjs-dist worker location
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface PdfPageThumbnailProps {
  item: PageOperationItem;
  docBuffer: Uint8Array;
  displayIndex: number;
  totalDisplayPages: number;
  onRotate: (id: string, direction: "cw" | "ccw") => void;
  onToggleDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
}

export const PdfPageThumbnail: React.FC<PdfPageThumbnailProps> = ({
  item,
  docBuffer,
  displayIndex,
  totalDisplayPages,
  onRotate,
  onToggleDelete,
  onToggleSelect,
  onMovePage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;

    async function renderThumbnail() {
      if (!canvasRef.current || !docBuffer) return;
      setIsRendering(true);
      setRenderError(null);

      try {
        const loadingTask = pdfjsLib.getDocument({
          data: docBuffer,
          cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdfDoc = await loadingTask.promise;
        if (isCancelled) return;

        // pdfjs-dist pages are 1-indexed
        const pdfPage = await pdfDoc.getPage(item.originalPageIndex + 1);
        if (isCancelled) return;

        const viewport = pdfPage.getViewport({ scale: 0.3 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        await pdfPage.render(renderContext).promise;
        if (!isCancelled) {
          setIsRendering(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setRenderError(err.message || "Thumbnail error");
          setIsRendering(false);
        }
      }
    }

    renderThumbnail();

    return () => {
      isCancelled = true;
    };
  }, [docBuffer, item.originalPageIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      onToggleSelect(item.id);
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      onRotate(item.id, "cw");
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onToggleDelete(item.id);
    } else if (e.key === "ArrowLeft" && onMovePage && displayIndex > 0) {
      e.preventDefault();
      onMovePage(displayIndex, displayIndex - 1);
    } else if (
      e.key === "ArrowRight" &&
      onMovePage &&
      displayIndex < totalDisplayPages - 1
    ) {
      e.preventDefault();
      onMovePage(displayIndex, displayIndex + 1);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col items-center p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        item.isDeleted
          ? "bg-slate-900/40 border-red-500/40 opacity-40 grayscale"
          : item.isSelected
          ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10"
          : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
      }`}
    >
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between mb-2">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={item.isSelected}
            onChange={() => onToggleSelect(item.id)}
            disabled={item.isDeleted}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-semibold text-slate-300">
            Page {displayIndex + 1}
          </span>
        </label>

        {item.currentRotation !== 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono border border-blue-700/50">
            {item.currentRotation}°
          </span>
        )}
      </div>

      {/* Thumbnail Canvas Container */}
      <div
        className="relative flex items-center justify-center min-h-[160px] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80"
        style={{
          transform: `rotate(${item.currentRotation}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {renderError ? (
          <div className="p-2 text-center text-xs text-slate-400">
            Page {item.originalPageIndex + 1}
          </div>
        ) : (
          <canvas ref={canvasRef} className="max-h-[150px] max-w-full object-contain" />
        )}

        {/* Deleted Overlay Banner */}
        {item.isDeleted && (
          <div className="absolute inset-0 bg-red-950/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-red-300">
            <span className="text-xs font-bold uppercase tracking-wider mb-1">Deleted</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDelete(item.id);
              }}
              className="text-[11px] px-2 py-1 rounded bg-red-800/80 hover:bg-red-700 text-white font-medium transition"
            >
              Undo
            </button>
          </div>
        )}
      </div>

      {/* Bottom Quick Action Overlay Controls */}
      <div className="mt-2.5 w-full flex items-center justify-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onRotate(item.id, "ccw")}
          disabled={item.isDeleted}
          title="Rotate Left 90° (Key: Shift+R)"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-30"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onRotate(item.id, "cw")}
          disabled={item.isDeleted}
          title="Rotate Right 90° (Key: R)"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-30"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onToggleDelete(item.id)}
          title={item.isDeleted ? "Restore Page" : "Delete Page (Key: Del)"}
          className={`p-1.5 rounded-lg transition ${
            item.isDeleted
              ? "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300"
              : "bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300"
          }`}
        >
          {item.isDeleted ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
