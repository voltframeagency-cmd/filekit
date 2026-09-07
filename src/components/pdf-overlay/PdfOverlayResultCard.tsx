"use client";

import React from "react";
import { PdfOverlayOutputArtifact } from "@/utils/pdf-overlay/types";

interface PdfOverlayResultCardProps {
  artifact: PdfOverlayOutputArtifact;
  language?: string;
  onAdjustWatermark: () => void;
  onResetWorkspace: () => void;
}

export const PdfOverlayResultCard: React.FC<PdfOverlayResultCardProps> = ({
  artifact,
  language = "en",
  onAdjustWatermark,
  onResetWorkspace,
}) => {
  const isTaiwan = language === "zh-TW" || (language as string).toLowerCase() === "zh-tw";
  const isChinese = language.startsWith("zh");

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    const blob = new Blob([artifact.fileData.buffer as ArrayBuffer], {
      type: artifact.mimeType,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = artifact.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8">
      {/* Signature Warning Notice */}
      {artifact.verification.signatureDetected && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-200 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <strong className="block font-bold">
              {isTaiwan ? "數位簽章注意" : isChinese ? "数字签名提示" : "Digital Signature Notice"}
            </strong>
            <span>{artifact.verification.signatureWarning || (isTaiwan ? "文件包含數位簽章，修改頁面將導致簽章失效。" : isChinese ? "文档包含数字签名，修改页面将导致签名失效。" : "Potential digital signature detected which will be invalidated by page modifications.")}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Artifact Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800/60 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isTaiwan ? "完整性已驗證" : isChinese ? "完整性已验证" : "Dual-Reload Verified"}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-xs font-mono font-semibold border border-blue-800/60">
              {artifact.executionMode || "WEB_WORKER"}
            </span>

            <span className="text-xs text-slate-400 font-mono">
              {formatBytes(artifact.byteLength)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1 truncate max-w-md">
            {artifact.fileName}
          </h3>

          <p className="text-xs text-slate-400">
            {isTaiwan ? (
              <>已在 <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> 個頁面套用浮水印 • 100% 透過 Web Worker 於背景執行緒安全運算</>
            ) : isChinese ? (
              <>已在 <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> 个页面应用水印 • 100% 通过 Web Worker 在后台线程安全处理</>
            ) : (
              <>Watermarked <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> page{artifact.pageCount !== 1 ? "s" : ""} • Processed 100% off-thread via Web Worker</>
            )}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isTaiwan ? "下載浮水印 PDF" : isChinese ? "下载水印 PDF" : "Download Watermarked PDF"}
          </button>

          <button
            type="button"
            onClick={onAdjustWatermark}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            {isTaiwan ? "調整浮水印" : isChinese ? "调整水印" : "Adjust Watermark"}
          </button>

          <button
            type="button"
            onClick={onResetWorkspace}
            className="px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs border border-slate-800 transition"
          >
            {isTaiwan ? "重新開始" : isChinese ? "重新开始" : "Start Over"}
          </button>
        </div>
      </div>
    </div>
  );
};
