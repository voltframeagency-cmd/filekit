"use client";

import React, { useState, useEffect } from "react";
import { ArchiveEngine, ArchiveEntry } from "./ArchiveEngine";
import { useLanguage } from "@/components/layout/LanguageContext";
import { ARCHIVE_TRANSLATIONS } from "@/config/i18n/archiveTranslations";
import { SupportedLocale } from "@/config/i18n/locales";

interface ArchiveWorkspaceProps {
  mode: "extract" | "create" | "tar-to-zip" | "rar-to-zip" | "extract-rar" | "7z-to-zip";
  title?: string;
  description?: string;
  embedded?: boolean;
  language?: string;
}

export function ArchiveWorkspace({ mode, title, description, embedded = true, language: propLang }: ArchiveWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const rawLang = propLang || ctxLang || "en";
  const tr = ARCHIVE_TRANSLATIONS[rawLang as SupportedLocale] || ARCHIVE_TRANSLATIONS[rawLang.split("-")[0] as SupportedLocale] || ARCHIVE_TRANSLATIONS.en;

  const [files, setFiles] = useState<File[]>([]);
  const [extractedEntries, setExtractedEntries] = useState<ArchiveEntry[]>([]);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customZipName, setCustomZipName] = useState<string>("archive.zip");

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFiles(selectedFiles);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setExtractedEntries([]);

    if ((mode === "extract" || mode === "extract-rar") && selectedFiles.length > 0) {
      setLoading(true);
      try {
        const buf = new Uint8Array(await selectedFiles[0].arrayBuffer());
        const entries = mode === "extract-rar" ? ArchiveEngine.extractRar(buf) : ArchiveEngine.extractZip(buf);
        if (entries.length === 0) {
          setError(tr.noFilesFound);
        } else {
          setExtractedEntries(entries);
        }
      } catch (err) {
        console.error(err);
        setError(tr.cannotReadFile);
      } finally {
        setLoading(false);
      }
    } else if ((mode === "tar-to-zip" || mode === "rar-to-zip" || mode === "7z-to-zip") && selectedFiles.length > 0) {
      setLoading(true);
      try {
        const buf = new Uint8Array(await selectedFiles[0].arrayBuffer());
        let zipBytes: Uint8Array;
        if (mode === "rar-to-zip") {
          zipBytes = ArchiveEngine.rarToZip(buf);
        } else if (mode === "7z-to-zip") {
          zipBytes = ArchiveEngine.sevenZipToZip(buf);
        } else {
          zipBytes = ArchiveEngine.tarToZip(buf);
        }

        const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setOutputFileName(selectedFiles[0].name.replace(/\.(tar|tar\.gz|tgz|rar|7z)$/i, "") + ".zip");
      } catch (err) {
        console.error(err);
        setError(tr.cannotConvert);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateZip = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const entries: { name: string; data: Uint8Array }[] = [];
      for (const f of files) {
        const buf = new Uint8Array(await f.arrayBuffer());
        entries.push({ name: f.name, data: buf });
      }

      const zipBytes = ArchiveEngine.createZip(entries);
      const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      const outName = customZipName.endsWith(".zip") ? customZipName : `${customZipName}.zip`;
      setOutputFileName(outName);
    } catch (err) {
      console.error(err);
      setError(tr.cannotCreate);
    } finally {
      setLoading(false);
    }
  };

  const downloadEntry = (entry: ArchiveEntry) => {
    const blob = new Blob([entry.data as unknown as BlobPart]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.name.split("/").pop() || entry.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${embedded ? "" : "p-6"}`}>
      {!embedded && (
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || (mode === "extract" ? "Extract ZIP Online" : mode === "create" ? "Create ZIP Archive" : "Convert TAR to ZIP")}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || "100% In-Browser · Fast, Private & Zero Server Uploads"}
          </p>
        </div>
      )}

      {files.length === 0 ? (
        <div
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-fk-2xl p-10 text-center cursor-pointer transition-all duration-200"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) {
              handleFilesSelected(droppedFiles);
            }
          }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = mode === "create";
            input.accept = mode === "extract" ? ".zip" : mode === "tar-to-zip" ? ".tar,.tar.gz,.tgz" : "*/*";
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList.length > 0) {
                handleFilesSelected(Array.from(fileList));
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {mode === "create" ? tr.dropFilesToZip : tr.selectArchiveToExtract}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {mode === "create" ? tr.supportsAllFormats : tr.localProcessing}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800">
                {tr.filesSelected(files.length)}
              </span>
              <span className="text-xs text-slate-500 block">
                Total: {((files.reduce((acc, f) => acc + f.size, 0)) / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={() => {
                setFiles([]);
                setExtractedEntries([]);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {tr.reset}
            </button>
          </div>

          {mode === "create" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">
                  {tr.archiveNameLabel}
                </label>
                <input
                  type="text"
                  value={customZipName}
                  onChange={(e) => setCustomZipName(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-fk-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleCreateZip}
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-fk-lg shadow-fk-button transition-all text-base flex items-center justify-center gap-2"
              >
                {loading ? tr.compressingToZip : tr.createZipButton}
              </button>
            </div>
          )}

          {mode === "extract" && extractedEntries.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-slate-800">
                {tr.extractedFiles(extractedEntries.length)}
              </span>
              <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-fk-lg divide-y divide-slate-100">
                {extractedEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-mono text-slate-700 truncate max-w-[240px] sm:max-w-xs">{entry.name}</span>
                    <button
                      onClick={() => downloadEntry(entry)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded"
                    >
                      {tr.download}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outputUrl && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-emerald-900 block truncate">
                  {tr.readyZip(outputFileName)}
                </span>
                <span className="text-xs text-emerald-700">
                  {tr.sizeLabel(((outputBlob?.size || 0) / 1024 / 1024).toFixed(2))}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {tr.downloadZip}
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
