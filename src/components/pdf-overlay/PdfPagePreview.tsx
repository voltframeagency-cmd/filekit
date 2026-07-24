"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { WatermarkConfig } from "@/utils/pdf-overlay/types";
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

  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
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
    if (config.type === "image" && config.imageBuffer) {
      const blob = new Blob([config.imageBuffer.buffer as ArrayBuffer], {
        type: config.imageMimeType || "image/png",
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        setImageObj(img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else {
      setImageObj(null);
    }
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

        const loadingTask = pdfjsLib.getDocument({
          data: sourceBuffer,
          cMapPacked: true,
        });

        const pdfDoc = await loadingTask.promise;
        if (isCancelled) return;
        pdfDocRef.current = pdfDoc;
        setTotalPages(pdfDoc.numPages);

        const pdfPage = await pdfDoc.getPage(pageIndex + 1);
        if (isCancelled) return;

        const viewport = pdfPage.getViewport({ scale: 0.8 });

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
    };
  }, [sourceBuffer, pageIndex]);

  // Redraw watermark overlay layer whenever config or base canvas changes
  useEffect(() => {
    if (!canvasRef.current || !baseCanvasRef.current) return;

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

    // Draw Watermark Overlay
    ctx.save();
    ctx.globalAlpha = Math.max(0.05, Math.min(1.0, config.opacity));

    const pageW = canvas.width;
    const pageH = canvas.height;
    const rotationRad = (- (config.rotationAngle || 0) * Math.PI) / 180;

    if (config.type === "text" && config.text) {
      ctx.fillStyle = config.fontColor || "#3B82F6";
      const fontSize = Math.max(12, (config.fontSize || 36) * 0.8);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = config.text;
      const metrics = ctx.measureText(text);
      const textW = metrics.width;
      const textH = fontSize;

      const drawSingleTextMark = (cx: number, cy: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotationRad);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      };

      if (config.positionPreset === "tile") {
        for (let y = 50; y < pageH; y += 120) {
          for (let x = 50; x < pageW; x += 160) {
            drawSingleTextMark(x, y);
          }
        }
      } else {
        const coords = getPreviewCoordinates(config.positionPreset, pageW, pageH, textW, textH, config.customX, config.customY);
        drawSingleTextMark(coords.x, coords.y);
      }
    } else if (config.type === "image" && imageObj) {
      const imgW = Math.min(pageW * 0.6, imageObj.width * 0.4);
      const scale = imgW / imageObj.width;
      const imgH = imageObj.height * scale;

      const drawSingleImageMark = (cx: number, cy: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotationRad);
        ctx.drawImage(imageObj, -imgW / 2, -imgH / 2, imgW, imgH);
        ctx.restore();
      };

      if (config.positionPreset === "tile") {
        for (let y = 60; y < pageH; y += imgH + 60) {
          for (let x = 60; x < pageW; x += imgW + 60) {
            drawSingleImageMark(x, y);
          }
        }
      } else {
        const coords = getPreviewCoordinates(config.positionPreset, pageW, pageH, imgW, imgH, config.customX, config.customY);
        drawSingleImageMark(coords.x, coords.y);
      }
    }

    ctx.restore();
  }, [config, imageObj, isPageTargeted]);

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

function getPreviewCoordinates(
  preset: string,
  pageW: number,
  pageH: number,
  markW: number,
  markH: number,
  customX?: number,
  customY?: number
): { x: number; y: number } {
  const margin = 36;
  switch (preset) {
    case "top-left":
      return { x: margin + markW / 2, y: margin + markH / 2 };
    case "top-right":
      return { x: pageW - margin - markW / 2, y: margin + markH / 2 };
    case "bottom-left":
      return { x: margin + markW / 2, y: pageH - margin - markH / 2 };
    case "bottom-right":
      return { x: pageW - margin - markW / 2, y: pageH - margin - markH / 2 };
    case "custom":
      return {
        x: customX !== undefined ? customX : pageW / 2,
        y: customY !== undefined ? pageH - customY : pageH / 2,
      };
    case "center":
    default:
      return { x: pageW / 2, y: pageH / 2 };
  }
}
