"use client";

import React, { useState, useEffect } from "react";
import { EbookEngine } from "./EbookEngine";
import { useLanguage } from "@/components/layout/LanguageContext";
import { resolveDictionaryEntry } from "@/config/i18n/locales";
import { EBOOK_TRANSLATIONS } from "./ebookTranslations";

interface EbookWorkspaceProps {
  mode: "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";
  title?: string;
  description?: string;
  embedded?: boolean;
  language?: string;
}

export function EbookWorkspace({ mode, title, description, embedded = true, language: propLang }: EbookWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const tr = resolveDictionaryEntry(EBOOK_TRANSLATIONS, language);

  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const getAcceptExtensions = () => {
    if (mode === "epub-to-pdf") return ".epub";
    if (mode === "pdf-to-epub") return ".pdf";
    if (mode === "mobi-to-pdf") return ".mobi";
    if (mode === "azw3-to-pdf") return ".azw3,.azw";
    return ".epub,.pdf,.mobi,.azw3,.azw";
  };

  const getToolTitle = () => {
    if (mode === "epub-to-pdf") return tr.titleEpubToPdf;
    if (mode === "pdf-to-epub") return tr.titlePdfToEpub;
    if (mode === "mobi-to-pdf") return tr.titleMobiToPdf;
    if (mode === "azw3-to-pdf") return tr.titleAzw3ToPdf;
    return tr.defaultTitle;
  };

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      let outputBytes: Uint8Array;
      let outputMime = "application/pdf";
      let extension = "pdf";

      if (mode === "pdf-to-epub") {
        outputBytes = await EbookEngine.pdfToEpub(buf, selectedFile.name.replace(/\.[^/.]+$/, ""));
        outputMime = "application/epub+zip";
        extension = "epub";
      } else if (mode === "mobi-to-pdf") {
        throw new Error("MOBI conversion is temporarily gated pending verified PalmDOC LZ77 parser integration.");
      } else if (mode === "azw3-to-pdf") {
        throw new Error("AZW3 conversion is temporarily gated pending verified KF8 container parser integration.");
      } else {
        outputBytes = await EbookEngine.epubToPdf(buf);
      }

      const blob = new Blob([outputBytes as unknown as BlobPart], { type: outputMime });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + `.${extension}`);
    } catch (err: any) {
      console.error("Ebook conversion error:", err?.message || err);
      setError(err?.message ? `Failed: ${err.message}` : tr.errorDrmOrCorrupt);
    } finally {
      setLoading(false);
    }
  };

  const isEpubOutput = mode === "pdf-to-epub";

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      {!embedded && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            {title || getToolTitle()}
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            {description || tr.defaultDescription}
          </p>
        </div>
      )}

      {!file ? (
        <div
          data-testid="ebook-dropzone"
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            data-testid="ebook-file-input"
            type="file"
            accept={getAcceptExtensions()}
            className="hidden"
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            }}
          />
          <div className="w-14 h-14 mx-auto mb-3 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {tr.dropzoneTitle(getAcceptExtensions().toUpperCase())}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {tr.privacyNotice}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {tr.changeFile}
            </button>
          </div>

          {loading && (
            <div data-testid="ebook-loading" className="p-6 bg-slate-50 rounded-fk-lg border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-slate-700">
                {tr.renderingNotice(mode)}
              </span>
            </div>
          )}

          {outputUrl && (
            <div data-testid="ebook-result-card" className="p-4 bg-amber-50 border border-amber-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-amber-900 block">
                  {tr.conversionSuccess(outputFileName)}
                </span>
                <span className="text-xs text-amber-700">
                  {tr.outputSizeNotice(((outputBlob?.size || 0) / 1024 / 1024).toFixed(2), isEpubOutput)}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {tr.downloadButton(isEpubOutput)}
              </a>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-fk-md">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
