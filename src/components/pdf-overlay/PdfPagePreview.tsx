"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { WatermarkConfig } from "@/utils/pdf-overlay/types";

if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderPageWithWatermark() {
      if (!canvasRef.current || !sourceBuffer) return;
      setIsRendering(true);
      setRenderError(null);

      try {
        const loadingTask = pdfjsLib.getDocument({
          data: sourceBuffer,
          cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdfDoc = await loadingTask.promise;
        if (isCancelled) return;

        const pdfPage = await pdfDoc.getPage(pageIndex + 1);
        if (isCancelled) return;

        const viewport = pdfPage.getViewport({ scale: 0.8 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pdfPage.render({ canvasContext: context, viewport }).promise;

        if (isCancelled) return;

        // Render Watermark Canvas Overlay Layer
        context.save();
        context.globalAlpha = config.opacity;
        context.fillStyle = config.fontColor || "#3B82F6";

        if (config.type === "text") {
          const text = config.text || "CONFIDENTIAL";
          const fontSize = Math.max(12, (config.fontSize || 36) * 0.8);
          context.font = `bold ${fontSize}px sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "middle";

          const centerX = viewport.width / 2;
          const centerY = viewport.height / 2;

          context.translate(centerX, centerY);
          context.rotate((-(config.rotationAngle || 45) * Math.PI) / 180);
          context.fillText(text, 0, 0);
        }

        context.restore();
        setIsRendering(false);
      } catch (err: any) {
        if (!isCancelled) {
          setRenderError(err.message || "Preview render error");
          setIsRendering(false);
        }
      }
    }

    renderPageWithWatermark();

    return () => {
      isCancelled = true;
    };
  }, [sourceBuffer, config, pageIndex]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center min-h-[380px] w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl overflow-hidden"
    >
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Updating Live Preview...</span>
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
