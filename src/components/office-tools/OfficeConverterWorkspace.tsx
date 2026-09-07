"use client";

import React, { useState } from "react";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";
import { useLanguage } from "@/components/layout/LanguageContext";
import { OFFICE_I18N } from "./officeTranslations";

export interface OfficeConverterWorkspaceProps {
  toolTitle: string;
  toolSlug: string;
  apiEndpoint: string;
  acceptedExtensions: string;
  documentTypeLabel: string; // e.g. "Word Document", "PowerPoint Presentation", "Excel Spreadsheet"
  language?: string;
}

export const OfficeConverterWorkspace: React.FC<OfficeConverterWorkspaceProps> = ({
  toolTitle,
  toolSlug,
  apiEndpoint,
  acceptedExtensions,
  documentTypeLabel,
  language: propLang,
}) => {
  const { language: ctxLang } = useLanguage();
  const rawLang = (propLang || ctxLang || "en").toLowerCase();
  const shortLang = rawLang.split("-")[0];
  const tr = OFFICE_I18N[rawLang] || OFFICE_I18N[shortLang] || OFFICE_I18N.en;

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>("Ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    downloadUrl: string;
    outputSizeBytes: number;
    durationMs: number;
    fileName: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setResult(null);
    setSourceFile(file);
  };

  const handleInitiateConversion = () => {
    if (!sourceFile) return;
    if (!hasConsented) {
      setShowConsentModal(true);
    } else {
      executeServerConversion();
    }
  };

  const executeServerConversion = async () => {
    if (!sourceFile) return;

    setShowConsentModal(false);
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressStage(tr.connecting);

    try {
      const formData = new FormData();
      formData.append("file", sourceFile);

      setProgressStage(tr.rendering);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `${tr.serverFailed} (${response.status})`);
      }

      setProgressStage(tr.verifying);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || tr.convertFailed);
      }

      setResult({
        downloadUrl: data.downloadSignedUrl,
        outputSizeBytes: data.outputSizeBytes,
        durationMs: data.executionDurationMs,
        fileName: sourceFile.name.replace(/\.[^/.]+$/, ".pdf"),
      });
    } catch (err: any) {
      setErrorMessage(err?.message || tr.unexpectedError);
    } finally {
      setIsProcessing(false);
      setProgressStage("Ready");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl.startsWith("http") ? result.downloadUrl : "#";
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Upload Zone */}
      {!sourceFile && (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-fk-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl">
            📊
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">
              {tr.selectDoc(documentTypeLabel)}
            </h2>
            <p className="text-sm text-slate-400">
              {tr.subDescription}
            </p>
          </div>
          <label className="cursor-pointer bg-fk-primary hover:bg-fk-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-fk-primary/20">
            {tr.chooseFile(documentTypeLabel)}
            <input type="file" accept={acceptedExtensions} className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}

      {/* Editor Workspace */}
      {sourceFile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          {/* File Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                DOC
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">{(sourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="server" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setResult(null);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                {tr.changeFile}
              </button>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
            <span className="text-blue-400 text-lg">🛡️</span>
            <div className="text-xs text-slate-300 flex flex-col gap-1 leading-relaxed">
              <span className="font-bold text-white">
                {tr.sandboxTitle}
              </span>
              <span>
                {tr.sandboxDesc}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          {!result && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleInitiateConversion}
              className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{progressStage}</span>
                </>
              ) : (
                tr.convertBtn
              )}
            </button>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {tr.convertSuccess}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {tr.renderedSummary(result.durationMs, (result.outputSizeBytes / 1024).toFixed(1))}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg"
              >
                {tr.downloadPdf}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Consent Before Upload Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-blue-400">
              <span className="text-2xl">🔒</span>
              <h3 className="font-bold text-white text-lg">
                {tr.noticeTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {tr.noticeBody}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition"
              >
                {tr.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasConsented(true);
                  executeServerConversion();
                }}
                className="px-5 py-2 text-xs font-bold bg-fk-primary hover:bg-fk-primary/90 text-white rounded-lg shadow-lg transition"
              >
                {tr.authorizeAndConvert}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
