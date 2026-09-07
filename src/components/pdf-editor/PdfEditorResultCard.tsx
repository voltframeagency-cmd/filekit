"use client";

import React from "react";
import { PdfEditorOutputArtifact } from "@/utils/pdf-editor/types";

interface PdfEditorResultCardProps {
  artifact: PdfEditorOutputArtifact;
  language?: string;
  onAdjustPages: () => void;
  onResetWorkspace: () => void;
}

export const PdfEditorResultCard: React.FC<PdfEditorResultCardProps> = ({
  artifact,
  language = "en",
  onAdjustPages,
  onResetWorkspace,
}) => {
  const isJapanese = language === "ja";
  const isKorean = language === "ko";
  const isChinese = language.startsWith("zh");
  const isTaiwan = language === "zh-TW";
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const downloadFile = (fileData: Uint8Array, fileName: string, mimeType: string) => {
    const blob = new Blob([fileData.buffer as ArrayBuffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMain = () => {
    downloadFile(artifact.fileData, artifact.fileName, artifact.mimeType);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8">
      {/* Digital Signature Warning Banner */}
      {artifact.verification.signatureDetected && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-200 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <strong className="block font-bold">
              {isChinese ? (isTaiwan ? "數位簽章注意" : "数字签名提示") : isJapanese ? "電子署名に関する注意" : isKorean ? "전자 서명 안내" : "Digital Signature Notice"}
            </strong>
            <span>{artifact.verification.signatureWarning || (isChinese ? (isTaiwan ? "文件包含數位簽章，修改頁面將導致簽章失效。" : "文档包含数字签名，修改页面将导致签名失效。") : isJapanese ? "文書に電子署名が含まれています。ページの変更により署名は無効になります。" : isKorean ? "문서에 전자 서명이 포함되어 있습니다. 페이지를 수정하면 서명이 무효화됩니다." : "Document contains a digital signature which will be invalidated by page modifications.")}</span>
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
              {isChinese ? (isTaiwan ? "完整性已驗證" : "双重重载已验证") : isJapanese ? "整合性検証済み" : isKorean ? "무결성 검증 완료" : "Dual-Reload Verified"}
            </span>

            <span className="text-xs text-slate-400 font-mono">
              {formatBytes(artifact.byteLength)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1 truncate max-w-md">
            {artifact.fileName}
          </h3>

          <p className="text-xs text-slate-400">
            {isChinese
              ? (isTaiwan
                  ? <>共 <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> 頁 • 100% 瀏覽器本機安全處理</>
                  : <>共 <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> 页 • 100% 浏览器本地安全处理</>)
              : isJapanese
              ? <>全 <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> ページ • 100% ブラウザ内で安全にローカル処理</>
              : isKorean
              ? <>총 <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> 페이지 • 브라우저에서 100% 안전하게 로컬 처리</>
              : <>Contains <span className="text-slate-200 font-semibold">{artifact.pageCount}</span> page{artifact.pageCount !== 1 ? "s" : ""} • Processed 100% locally in browser</>}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadMain}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isChinese ? (isTaiwan ? "下載 PDF" : "下载 PDF") : isJapanese ? "PDFをダウンロード" : isKorean ? "PDF 다운로드" : "Download PDF"}
          </button>

          <button
            type="button"
            onClick={onAdjustPages}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            {isChinese ? (isTaiwan ? "重新調整頁面" : "重新调整页面") : isJapanese ? "ページを再調整" : isKorean ? "페이지 재조정" : "Adjust Pages"}
          </button>

          <button
            type="button"
            onClick={onResetWorkspace}
            className="px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs border border-slate-800 transition"
          >
            {isChinese ? (isTaiwan ? "重新開始" : "重新开始") : isJapanese ? "最初からやり直す" : isKorean ? "처음부터 다시" : "Start Over"}
          </button>
        </div>
      </div>

      {/* Render Split Files Array if Available */}
      {artifact.splitArtifacts && artifact.splitArtifacts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            {isChinese
              ? (isTaiwan
                  ? `分割檔案清單 (${artifact.splitArtifacts.length} 個)`
                  : `分割文件列表 (${artifact.splitArtifacts.length} 个)`)
              : isJapanese
              ? `分割ファイル一覧 (${artifact.splitArtifacts.length} 件)`
              : isKorean
              ? `분할된 파일 목록 (${artifact.splitArtifacts.length}개)`
              : `Split Output Files (${artifact.splitArtifacts.length} Parts)`}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {artifact.splitArtifacts.map((splitItem, sIdx) => (
              <div key={sIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                    {splitItem.fileName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {splitItem.pageCount} {isChinese ? (isTaiwan ? "頁" : "页") : isJapanese ? "ページ" : isKorean ? "페이지" : "pages"} • {formatBytes(splitItem.byteLength)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => downloadFile(splitItem.fileData, splitItem.fileName, "application/pdf")}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  {isChinese ? (isTaiwan ? "儲存" : "保存") : isJapanese ? "保存" : isKorean ? "저장" : "Save"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
