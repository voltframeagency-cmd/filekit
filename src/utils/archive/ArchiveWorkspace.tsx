"use client";

import React, { useState, useEffect } from "react";
import { ArchiveEngine, ArchiveEntry } from "./ArchiveEngine";

interface ArchiveWorkspaceProps {
  mode: "extract" | "create" | "tar-to-zip";
  title?: string;
  description?: string;
}

export function ArchiveWorkspace({ mode, title, description }: ArchiveWorkspaceProps) {
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

    if (mode === "extract" && selectedFiles.length > 0) {
      setLoading(true);
      try {
        const buf = new Uint8Array(await selectedFiles[0].arrayBuffer());
        const entries = ArchiveEngine.extractZip(buf);
        if (entries.length === 0) {
          setError("No uncompressed files found in ZIP archive or archive is empty.");
        } else {
          setExtractedEntries(entries);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to read ZIP archive. Please ensure it is a valid .zip file.");
      } finally {
        setLoading(false);
      }
    } else if (mode === "tar-to-zip" && selectedFiles.length > 0) {
      setLoading(true);
      try {
        const buf = new Uint8Array(await selectedFiles[0].arrayBuffer());
        const zipBytes = ArchiveEngine.tarToZip(buf);
        const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setOutputFileName(selectedFiles[0].name.replace(/\.(tar|tar\.gz|tgz)$/i, "") + ".zip");
      } catch (err) {
        console.error(err);
        setError("Failed to convert TAR to ZIP archive.");
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
      setError("Failed to create ZIP archive.");
    } finally {
      setLoading(false);
    }
  };

  const downloadEntry = (entry: ArchiveEntry) => {
    const blob = new Blob([entry.data as unknown as BlobPart]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title || (mode === "extract" ? "Extract ZIP Online" : mode === "create" ? "Create ZIP Archive" : "Convert TAR to ZIP")}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {description || "100% In-Browser · Fast, Private & Zero Server Uploads"}
        </p>
      </div>

      {files.length === 0 ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
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
            {mode === "create" ? "Drop files to zip together" : "Select archive file to extract"}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {mode === "create" ? "Supports all file formats (Multi-file enabled)" : "Processed locally inside your browser"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Selected Files Header */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800">
                {files.length} file{files.length > 1 ? "s" : ""} selected
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
              Reset
            </button>
          </div>

          {/* Mode Specific Work */}
          {mode === "create" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">Archive Name:</label>
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
                {loading ? "Compressing files into ZIP..." : "Create ZIP Archive"}
              </button>
            </div>
          )}

          {/* Extracted File Entries */}
          {mode === "extract" && extractedEntries.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-slate-800">
                Files inside archive ({extractedEntries.length}):
              </span>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-fk-lg bg-slate-50">
                {extractedEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-white transition-colors">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">{entry.name}</span>
                      <span className="text-xs text-slate-400">({(entry.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => downloadEntry(entry)}
                      className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-300 text-xs font-semibold rounded shadow-sm shrink-0"
                    >
                      Save
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Final Output */}
          {outputUrl && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-emerald-900 block">
                  ✓ Ready for Download: {outputFileName}
                </span>
                <span className="text-xs text-emerald-700">
                  Size: {((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                Download ZIP
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
