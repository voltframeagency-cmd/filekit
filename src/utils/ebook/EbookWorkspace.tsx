"use client";

import React, { useState, useEffect } from "react";
import { EbookEngine } from "./EbookEngine";

interface EbookWorkspaceProps {
  mode: "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";
  title?: string;
  description?: string;
}

export function EbookWorkspace({ mode, title, description }: EbookWorkspaceProps) {
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

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      let outBytes: Uint8Array;
      let outExt = "pdf";
      let mimeType = "application/pdf";

      if (mode === "epub-to-pdf") {
        outBytes = await EbookEngine.epubToPdf(buf);
        outExt = "pdf";
        mimeType = "application/pdf";
      } else if (mode === "pdf-to-epub") {
        outBytes = await EbookEngine.pdfToEpub(buf, selectedFile.name.replace(/\.[^/.]+$/, ""));
        outExt = "epub";
        mimeType = "application/epub+zip";
      } else if (mode === "mobi-to-pdf") {
        outBytes = await EbookEngine.mobiToPdf(buf);
        outExt = "pdf";
        mimeType = "application/pdf";
      } else {
        outBytes = await EbookEngine.azw3ToPdf(buf);
        outExt = "pdf";
        mimeType = "application/pdf";
      }

      const blob = new Blob([outBytes as unknown as BlobPart], { type: mimeType });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + `.${outExt}`);
    } catch (err) {
      console.error(err);
      setError("Failed to convert e-book. Please ensure the file is not DRM-locked.");
    } finally {
      setLoading(false);
    }
  };

  const getAcceptExtensions = () => {
    switch (mode) {
      case "epub-to-pdf":
        return ".epub";
      case "pdf-to-epub":
        return ".pdf";
      case "mobi-to-pdf":
        return ".mobi,.prc";
      case "azw3-to-pdf":
        return ".azw,.azw3,.kf8";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title || "E-Book Converter"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {description || "100% In-Browser · Formatted for Kindle, Kobo, and Print"}
        </p>
      </div>

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = getAcceptExtensions();
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            Select E-Book File ({getAcceptExtensions()})
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            Zero server uploads · Private in-browser conversion
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
              Change File
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-sm font-semibold text-slate-700">Converting e-book formatting...</span>
            </div>
          ) : outputUrl ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-amber-900 block">
                  ✓ Conversion Complete: {outputFileName}
                </span>
                <span className="text-xs text-amber-700">
                  Ready to download · {((outputBlob?.size || 0) / 1024).toFixed(1)} KB
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                Download E-Book
              </a>
            </div>
          ) : null}

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
