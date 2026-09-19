"use client";

import React, { useState, useEffect } from "react";
import { FontEngine, FontMetadata } from "./FontEngine";
import { useLanguage } from "@/components/layout/LanguageContext";
import { resolveDictionaryEntry } from "@/config/i18n/locales";
import { FONT_TRANSLATIONS } from "./fontTranslations";

interface FontWorkspaceProps {
  mode: "ttf-to-woff2" | "woff2-to-ttf";
  title?: string;
  description?: string;
  embedded?: boolean;
  language?: string;
}

export function FontWorkspace({ mode, title, description, embedded = true, language: propLang }: FontWorkspaceProps) {
  const { language: contextLang } = useLanguage();
  const language = propLang || contextLang || "en";
  const tr = resolveDictionaryEntry(FONT_TRANSLATIONS, language);

  const [file, setFile] = useState<File | null>(null);
  const [fontMeta, setFontMeta] = useState<FontMetadata | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [customPreviewText, setCustomPreviewText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(28);

  const previewText = customPreviewText ?? tr.defaultPangram;

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());

      // Preflight font inspect
      try {
        const meta = FontEngine.inspectFont(buf);
        setFontMeta(meta);
      } catch {
        setFontMeta({
          fontFamily: selectedFile.name.replace(/\.[^/.]+$/, ""),
          subfamily: "Regular",
          numTables: 0,
          format: mode === "ttf-to-woff2" ? "ttf" : "woff",
        });
      }

      // Convert
      let outBytes: Uint8Array;
      let outExt = "ttf";
      let outMime = "font/ttf";
      if (mode === "ttf-to-woff2") {
        throw new Error("WOFF2 output is temporarily gated until standard Brotli W3C codec integration is verified.");
      } else {
        outBytes = FontEngine.woff2ToTtf(buf);
        outExt = "ttf";
        outMime = "font/ttf";
      }

      const blob = new Blob([outBytes as unknown as BlobPart], { type: outMime });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + `.${outExt}`);
    } catch (err) {
      console.error(err);
      setError(tr.conversionError);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      {!embedded && (
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || (mode === "ttf-to-woff2" ? tr.titleTtfToWoff : tr.titleWoffToTtf)}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || tr.description}
          </p>
        </div>
      )}

      {!file ? (
        <div
          data-testid="font-dropzone"
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            data-testid="font-file-input"
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            className="hidden"
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            }}
          />
          <div className="w-14 h-14 mx-auto mb-3 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {tr.dropzoneTitle(mode)}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {tr.privacyNotice}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Font Metadata Badge */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">
                {tr.formatBadge(
                  fontMeta?.format.toUpperCase() || "TTF",
                  fontMeta?.numTables || 0,
                  (file.size / 1024).toFixed(1)
                )}
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {tr.changeFont}
            </button>
          </div>

          {/* Interactive Font Preview Box */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {tr.livePreviewTitle}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {tr.fontSizeLabel} {fontSize}px
                </span>
                <input
                  type="range"
                  min="16"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <textarea
              value={previewText}
              onChange={(e) => setCustomPreviewText(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              rows={3}
              className="w-full p-4 border border-slate-200 rounded-fk-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 resize-none transition-colors"
            />
          </div>

          {/* Ready Download Card */}
          {outputUrl && (
            <div data-testid="font-result-card" className="p-4 bg-purple-50 border border-purple-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-purple-900 block">
                  {tr.conversionSuccess(outputFileName)}
                </span>
                <span className="text-xs text-purple-700">
                  {tr.fileSizeSummary(((outputBlob?.size || 0) / 1024).toFixed(1))}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {tr.downloadButton}
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
