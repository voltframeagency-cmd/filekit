"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { WatermarkConfig } from "@/utils/pdf-overlay/types";
import { buildWatermarkPlacementPlan } from "@/utils/pdf-overlay/coordinateTransform";
import { getTargetPageIndices } from "@/utils/pdf-overlay/watermarkOperations";

if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PdfPagePreviewProps {
  sourceBuffer: Uint8Array;
  config: WatermarkConfig;
  pageIndex?: number;
}

export const PdfPagePreview: React.FC<PdfPagePreviewProps> = ({
  sourceBuffer,
  config,
  pageIndex = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [pageViewport, setPageViewport] = useState<pdfjsLib.PageViewport | null>(null);

  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Helper: check if current preview page is targeted
  const targetIndices = getTargetPageIndices(
    config.targetPagesMode,
    totalPages || 1,
    config.customPageRange
  );
  const isPageTargeted = targetIndices.includes(pageIndex);

  // Load image object for preview when image mode is selected
  useEffect(() => {
    let active = true;

    if (config.type === "image" && config.imageBuffer && config.imageBuffer.length > 0) {
      const blob = new Blob([config.imageBuffer.buffer as ArrayBuffer], {
        type: config.imageMimeType || "image/png",
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        if (active) {
          setImageObj(img);
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        if (active) setImageObj(null);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else {
      setImageObj(null);
    }

    return () => {
      active = false;
    };
  }, [config.type, config.imageBuffer, config.imageMimeType]);

  // Load base PDF document page once
  useEffect(() => {
    let isCancelled = false;

    async function loadBasePage() {
      if (!sourceBuffer) return;
      setIsRendering(true);
      setRenderError(null);

      try {
        if (renderTaskRef.current) {
          try { renderTaskRef.current.cancel(); } catch (_) {}
        }
        if (pdfDocRef.current) {
          try { await pdfDocRef.current.destroy(); } catch (_) {}
        }
        if (loadingTaskRef.current) {
          try { await loadingTaskRef.current.destroy(); } catch (_) {}
        }

        const loadingTask = pdfjsLib.getDocument({
          data: sourceBuffer,
          cMapPacked: true,
        });
        loadingTaskRef.current = loadingTask;

        const pdfDoc = await loadingTask.promise;
        pdfDocRef.current = pdfDoc;
        setTotalPages(pdfDoc.numPages);

        const page = await pdfDoc.getPage(pageIndex + 1);

        // Target fixed preview canvas container width ~ 500px
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = 500 / unscaledViewport.width;
        const viewport = page.getViewport({ scale });
        setPageViewport(viewport);

        if (!baseCanvasRef.current) {
          baseCanvasRef.current = document.createElement("canvas");
        }
        const baseCanvas = baseCanvasRef.current;
        baseCanvas.width = viewport.width;
        baseCanvas.height = viewport.height;
        const baseCtx = baseCanvas.getContext("2d");

        if (baseCtx) {
          const renderContext = {
            canvasContext: baseCtx,
            viewport,
          };
          renderTaskRef.current = page.render(renderContext);
          await renderTaskRef.current.promise;
        }

        if (!isCancelled) {
          setIsRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException" && !isCancelled) {
          setRenderError(err.message || "Failed to render preview canvas.");
          setIsRendering(false);
        }
      }
    }

    loadBasePage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
      }
    };
  }, [sourceBuffer, pageIndex]);

  // Redraw watermark overlay layer using unified placement plan
  useEffect(() => {
    if (!canvasRef.current || !baseCanvasRef.current || !pageViewport) return;

    const canvas = canvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = baseCanvas.width;
    canvas.height = baseCanvas.height;

    // Draw base PDF page image
    ctx.drawImage(baseCanvas, 0, 0);

    // If current page is excluded by target page range, return base page without watermark
    if (!isPageTargeted) return;

    // PDF point page dimensions (unscaled)
    const pdfPageWidth = pageViewport.width / pageViewport.scale;
    const pdfPageHeight = pageViewport.height / pageViewport.scale;

    // Save context for watermark overlay
    ctx.save();
    ctx.globalAlpha = Math.max(0.05, Math.min(1.0, config.opacity));

    const placementPlan = buildWatermarkPlacementPlan(
      config,
      pdfPageWidth,
      pdfPageHeight,
      0, // Viewport rotation is pre-applied by PDF.js viewport
      undefined,
      36
    );

    if (config.type === "text" && config.text) {
      ctx.fillStyle = config.fontColor || "#EF4444";
      const fontSizePdf = Math.max(8, config.fontSize || 36);
      const fontSizeCanvas = fontSizePdf * pageViewport.scale;
      ctx.font = `bold ${fontSizeCanvas}px sans-serif`;

      const text = config.text;

      for (const item of placementPlan) {
        // Convert bottom-left origin PDF point (x, y) to top-left origin canvas pixel
        const canvasPt = pageViewport.convertToViewportPoint(item.visualX, item.visualY);
        ctx.save();
        ctx.translate(canvasPt[0], canvasPt[1]);
        ctx.rotate((-item.rotationDegrees * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    } else if (config.type === "image" && imageObj) {
      const imgWidthPdf = Math.min(pdfPageWidth * 0.8, imageObj.width * 0.5);
      const scale = imgWidthPdf / imageObj.width;
      const imgHeightPdf = imageObj.height * scale;

      const canvasWidth = imgWidthPdf * pageViewport.scale;
      const canvasHeight = imgHeightPdf * pageViewport.scale;

      for (const item of placementPlan) {
        const canvasPt = pageViewport.convertToViewportPoint(item.visualX, item.visualY);
        ctx.save();
        ctx.translate(canvasPt[0], canvasPt[1]);
        ctx.rotate((-item.rotationDegrees * Math.PI) / 180);
        ctx.drawImage(imageObj, 0, -canvasHeight, canvasWidth, canvasHeight);
        ctx.restore();
      }
    }

    ctx.restore();
  }, [config, isPageTargeted, pageViewport, imageObj]);

  if (renderError) {
    return (
      <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
        Preview error: {renderError}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {isRendering && (
        <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Rendering preview...
          </div>
        </div>
      )}

      <div className="relative border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl bg-white">
        <canvas ref={canvasRef} className="block max-w-full h-auto" />
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
        <span>Page {pageIndex + 1} of {totalPages || 1}</span>
        {!isPageTargeted && (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-semibold">
            Excluded by page range
          </span>
        )}
      </div>
    </div>
  );
};
