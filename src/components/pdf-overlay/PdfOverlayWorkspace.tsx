"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  PdfOverlayOutputArtifact,
  PdfOverlayProgress,
  WatermarkConfig,
  WorkerResponseMessage,
} from "@/utils/pdf-overlay/types";
import { preflightOverlayPdf, MAX_PDF_FILE_BYTES } from "@/utils/pdf-overlay/PdfOverlayPreflight";
import { isWinAnsiSupported, detectImageMimeType } from "@/utils/pdf-overlay/watermarkOperations";
import { PdfWatermarkControls } from "./PdfWatermarkControls";
import { PdfPagePreview } from "./PdfPagePreview";
import { PdfOverlayResultCard } from "./PdfOverlayResultCard";
import { useLanguage } from "@/components/layout/LanguageContext";
import { resolveDictionaryEntry } from "@/config/i18n/locales";
import { PDF_OVERLAY_I18N } from "./pdfOverlayTranslations";

interface PdfOverlayWorkspaceProps {
  language?: string;
}

export const PdfOverlayWorkspace: React.FC<PdfOverlayWorkspaceProps> = ({ language: propLang }) => {
  const { t, language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const tr = resolveDictionaryEntry(PDF_OVERLAY_I18N, language);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceBuffer, setSourceBuffer] = useState<Uint8Array | null>(null);
  const [progress, setProgress] = useState<PdfOverlayProgress | null>(null);
  const [artifact, setArtifact] = useState<PdfOverlayOutputArtifact | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signatureWarning, setSignatureWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);

  // Terminate worker on component unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        try { workerRef.current.terminate(); } catch (_) {}
        workerRef.current = null;
      }
    };
  }, []);

  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    type: "text",
    text: "CONFIDENTIAL",
    fontColor: "#EF4444",
    fontSize: 36,
    opacity: 0.4,
    rotationAngle: 45,
    positionPreset: "center",
    targetPagesMode: "all",
  });

  // Calculate config validation error
  const getValidationError = (): string | null => {
    if (watermarkConfig.type === "image") {
      if (!watermarkConfig.imageBuffer || watermarkConfig.imageBuffer.length === 0) {
        return tr.uploadLogoPrompt;
      }
      const detectedMime = detectImageMimeType(watermarkConfig.imageBuffer);
      if (!detectedMime) {
        return tr.invalidImageFormat;
      }
    } else if (watermarkConfig.type === "text") {
      if (!watermarkConfig.text || !watermarkConfig.text.trim()) {
        return tr.enterWatermarkText;
      }
      if (!isWinAnsiSupported(watermarkConfig.text)) {
        return tr.unsupportedWinAnsi;
      }
    }
    return null;
  };

  const validationError = getValidationError();
  const isApplyDisabled = isProcessing || !!validationError;

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMessage(null);

    // Enforce 100 MB max size
    if (file.size > MAX_PDF_FILE_BYTES) {
      setErrorMessage(tr.errorFileTooLarge(file.name));
      return;
    }

    setProgress({
      stage: "inspecting",
      subStage: "inspecting",
      message: tr.progressInspecting,
      processedItems: 0,
      totalItems: 1,
      percentage: 10,
    });

    try {
      let arrayBuf: ArrayBuffer | null = null;
      try {
        arrayBuf = await file.arrayBuffer();
      } catch (_) {}

      if (!arrayBuf || arrayBuf.byteLength === 0) {
        try {
          const sliced = file.slice(0, file.size);
          arrayBuf = await sliced.arrayBuffer();
        } catch (_) {}
      }

      if (!arrayBuf || arrayBuf.byteLength === 0) {
        arrayBuf = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
      }

      const buffer = new Uint8Array(arrayBuf);
      const preflight = await preflightOverlayPdf(buffer, file.name);

      if (!preflight.isValid) {
        let localizedPreflightError = tr.errorInvalidPdf;
        if (preflight.errorCode === "FILE_TOO_LARGE") {
          localizedPreflightError = tr.errorFileTooLarge(file.name);
        } else if (preflight.errorCode === "PASSWORD_REQUIRED") {
          localizedPreflightError = tr.errorPasswordRequired;
        } else if (preflight.errorCode === "ZERO_PAGES") {
          localizedPreflightError = tr.errorZeroPages;
        }
        setErrorMessage(localizedPreflightError);
        setProgress(null);
        return;
      }

      if (preflight.signatureWarning) {
        setSignatureWarning(tr.signatureWarning);
      }

      setSourceFile(file);
      setSourceBuffer(buffer);
      setProgress(null);
    } catch (err: any) {
      setErrorMessage(tr.errorGenericLoad);
      setProgress(null);
    }
  };

  const handleWatermarkConfigChange = (updated: Partial<WatermarkConfig>) => {
    setWatermarkConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setWatermarkConfig((prev) => ({
        ...prev,
        type: "image",
        imageBuffer: bytes,
        imageFileName: file.name,
      }));
    } catch (err: any) {
      setErrorMessage(tr.errorLogoRead);
    }
  };

  const handleApplyWatermark = () => {
    if (isApplyDisabled || !sourceBuffer || !sourceFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgress({
      stage: "applying-overlay",
      subStage: "embedding",
      message: tr.progressPreparing,
      processedItems: 0,
      totalItems: 100,
      percentage: 20,
    });

    try {
      const worker = new Worker(
        new URL("../../utils/pdf-overlay/pdfOverlay.worker.ts", import.meta.url)
      );

      // Instrument worker termination tracking to observe actual terminate() call
      const originalTerminate = worker.terminate.bind(worker);
      let isTerminated = false;
      worker.terminate = () => {
        isTerminated = true;
        if (typeof window !== "undefined") {
          (window as any).__filekit_pdf_worker_terminated = true;
          (window as any).__filekit_pdf_worker_active = false;
        }
        return originalTerminate();
      };

      workerRef.current = worker;

      const baseName = sourceFile.name.replace(/\.[^/.]+$/, "");
      const outputName = `${baseName}_watermarked.pdf`;

      worker.onmessage = (e: MessageEvent<WorkerResponseMessage>) => {
        const msg = e.data;
        if (msg.type === "PROGRESS") {
          setProgress(msg.payload);
        } else if (msg.type === "SUCCESS") {
          if (typeof window !== "undefined") {
            (window as any).__filekit_pdf_worker_active = false;
          }
          setArtifact(msg.payload.artifact);
          setIsProcessing(false);
          setProgress(null);
          worker.terminate();
          workerRef.current = null;
        } else if (msg.type === "ERROR") {
          if (typeof window !== "undefined") {
            (window as any).__filekit_pdf_worker_active = false;
          }
          setErrorMessage(tr.errorWorkerFailed);
          setArtifact(null);
          setIsProcessing(false);
          setProgress(null);
          worker.terminate();
          workerRef.current = null;
        }
      };

      worker.onerror = () => {
        if (typeof window !== "undefined") {
          (window as any).__filekit_pdf_worker_active = false;
        }
        setErrorMessage(tr.errorWorkerFailed);
        setArtifact(null);
        setIsProcessing(false);
        setProgress(null);
        if (workerRef.current) {
          try { workerRef.current.terminate(); } catch (_) {}
          workerRef.current = null;
        }
      };

      if (typeof window !== "undefined") {
        (window as any).__filekit_pdf_worker_active = true;
        (window as any).__filekit_pdf_worker_terminated = false;
      }

      // Check if test timing delay is configured
      const testDelay = typeof window !== "undefined" && typeof (window as any).__FILEKIT_TEST_DELAY_MS === "number"
        ? (window as any).__FILEKIT_TEST_DELAY_MS
        : 0;

      const freshCopy = new Uint8Array(sourceBuffer.length);
      freshCopy.set(sourceBuffer);
      const bufferCopy = freshCopy.buffer;

      if (testDelay > 0) {
        setTimeout(() => {
          if (workerRef.current && !isTerminated) {
            worker.postMessage(
              {
                type: "START_OVERLAY",
                payload: {
                  sourceBuffer: bufferCopy,
                  config: watermarkConfig,
                  fileName: outputName,
                },
              },
              [bufferCopy]
            );
          }
        }, testDelay);
      } else {
        worker.postMessage(
          {
            type: "START_OVERLAY",
            payload: {
              sourceBuffer: bufferCopy,
              config: watermarkConfig,
              fileName: outputName,
            },
          },
          [bufferCopy]
        );
      }
    } catch (err: any) {
      if (typeof window !== "undefined") {
        (window as any).__filekit_pdf_worker_active = false;
      }
      setErrorMessage(tr.errorWorkerFailed);
      setArtifact(null);
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleCancelWorker = () => {
    if (workerRef.current) {
      try { workerRef.current.terminate(); } catch (_) {}
      workerRef.current = null;
    }
    if (typeof window !== "undefined") {
      (window as any).__filekit_pdf_worker_active = false;
    }
    setIsProcessing(false);
    setProgress(null);
  };

  const handleResetWorkspace = () => {
    if (workerRef.current) {
      try { workerRef.current.terminate(); } catch (_) {}
      workerRef.current = null;
    }
    if (typeof window !== "undefined") {
      (window as any).__filekit_pdf_worker_active = false;
    }
    setSourceFile(null);
    setSourceBuffer(null);
    setArtifact(null);
    setProgress(null);
    setErrorMessage(null);
    setSignatureWarning(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs font-bold"
          >
            {tr.dismiss || "Dismiss"}
          </button>
        </div>
      )}

      {/* Signature Warning Notice */}
      {signatureWarning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs font-medium flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{tr.signatureWarning}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      {!sourceBuffer ? (
        /* Dropzone Card */
        <div className="max-w-xl mx-auto bg-slate-900 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-3xl p-10 text-center transition cursor-pointer relative group">
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-950/80 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-800/60 group-hover:scale-110 transition">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {tr.dropHere}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {tr.pdfOnlyNotice}
          </p>
          <span className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition">
            {tr.selectPdfFile}
          </span>
        </div>
      ) : (
        <div>
          {/* Result Card when artifact is ready */}
          {artifact && (
            <PdfOverlayResultCard
              artifact={artifact}
              language={language}
              onAdjustWatermark={() => setArtifact(null)}
              onResetWorkspace={handleResetWorkspace}
            />
          )}

          {/* Progress Banner */}
          {progress && (
            <div data-testid="progress-banner" className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span data-testid="progress-status-message" className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {progress.subStage === "stamping" && progress.currentPage && progress.totalPages
                    ? tr.progressStamping(progress.currentPage, progress.totalPages)
                    : progress.subStage === "embedding"
                    ? tr.progressPreparing
                    : progress.subStage === "inspecting" || progress.stage === "inspecting"
                    ? tr.progressInspecting
                    : progress.subStage === "verifying" || progress.stage === "verifying-output"
                    ? tr.progressVerifying
                    : progress.subStage === "ready" || progress.stage === "ready"
                    ? tr.progressReady
                    : progress.message}
                </span>
                <span className="text-xs font-mono font-semibold text-blue-400">
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              {isProcessing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCancelWorker}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold"
                  >
                    {tr.cancelProcessing}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Editor Workspace Controls & Preview */}
          {!artifact && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls Column */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <PdfWatermarkControls
                  language={language}
                  config={watermarkConfig}
                  onChange={handleWatermarkConfigChange}
                  onImageFileChange={handleImageFileChange}
                  onApplyWatermark={handleApplyWatermark}
                  onResetWorkspace={handleResetWorkspace}
                  isProcessing={isProcessing}
                  validationError={validationError}
                />
              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 self-start">
                  {tr.livePlacementPreview}
                </h3>
                <PdfPagePreview
                  sourceBuffer={sourceBuffer}
                  config={watermarkConfig}
                  pageIndex={0}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
