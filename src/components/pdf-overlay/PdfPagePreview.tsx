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
        if (isCancelled) return;
        pdfDocRef.current = pdfDoc;
        setTotalPages(pdfDoc.numPages);

        const pdfPage = await pdfDoc.getPage(pageIndex + 1);
        if (isCancelled) return;

        const viewport = pdfPage.getViewport({ scale: 0.8 });
        setPageViewport(viewport);

        // Create offscreen base canvas
        const baseCanvas = document.createElement("canvas");
        baseCanvas.width = viewport.width;
        baseCanvas.height = viewport.height;
        const baseCtx = baseCanvas.getContext("2d");
        if (!baseCtx) return;

        const renderTask = pdfPage.render({ canvasContext: baseCtx, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (isCancelled) return;
        baseCanvasRef.current = baseCanvas;

        setIsRendering(false);
      } catch (err: any) {
        if (!isCancelled && err.name !== "RenderingCancelledException") {
          setRenderError(err.message || "Preview load error");
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
      if (pdfDocRef.current) {
        try { pdfDocRef.current.destroy(); } catch (_) {}
      }
      if (loadingTaskRef.current) {
        try { loadingTaskRef.current.destroy(); } catch (_) {}
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

    if (config.type === "text" && config.text) {
      ctx.fillStyle = config.fontColor || "#3B82F6";
      const fontSizePdf = Math.max(8, config.fontSize || 36);
      const fontSizeCanvas = fontSizePdf * pageViewport.scale;
      ctx.font = `bold ${fontSizeCanvas}px sans-serif`;

      const text = config.text;
      const textMetrics = ctx.measureText(text);
      const markBoundsPdf = {
        width: textMetrics.width / pageViewport.scale,
        height: fontSizePdf,
      };

      const placementPlan = buildWatermarkPlacementPlan(
        config,
        { width: pdfPageWidth, height: pdfPageHeight },
        markBoundsPdf,
        36
      );

      for (const item of placementPlan) {
        // Convert bottom-left origin PDF point (x, y) to top-left origin canvas pixel
        const canvasPt = pageViewport.convertToViewportPoint(item.x, item.y);
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
      const markBoundsPdf = { width: imgWidthPdf, height: imgHeightPdf };

      const placementPlan = buildWatermarkPlacementPlan(
        config,
        { width: pdfPageWidth, height: pdfPageHeight },
        markBoundsPdf,
        36
      );

      const canvasWidth = imgWidthPdf * pageViewport.scale;
      const canvasHeight = imgHeightPdf * pageViewport.scale;

      for (const item of placementPlan) {
        const canvasPt = pageViewport.convertToViewportPoint(item.x, item.y);
        ctx.save();
        ctx.translate(canvasPt[0], canvasPt[1]);
        ctx.rotate((-item.rotationDegrees * Math.PI) / 180);
        ctx.drawImage(imageObj, 0, -canvasHeight, canvasWidth, canvasHeight);
        ctx.restore();
      }
    }

    ctx.restore();
  }, [config, imageObj, isPageTargeted, pageViewport]);

  return (
    <div className="relative flex items-center justify-center min-h-[380px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl overflow-hidden">
      {!isPageTargeted && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-700/80 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Page excluded from watermark range
        </div>
      )}

      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Rendering Page Preview...</span>
          </div>
        </div>
      )}

      {renderError ? (
        <div className="text-xs text-slate-400 font-mono text-center">{renderError}</div>
      ) : (
        <canvas ref={canvasRef} className="max-h-[460px] max-w-full rounded-lg shadow-lg border border-slate-900" />
      )}
    </div>
  );
};
