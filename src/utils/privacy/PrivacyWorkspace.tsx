"use client";

import React, { useState, useEffect } from "react";
import { MetadataEngine, DetectedMetadata } from "./MetadataEngine";

interface PrivacyWorkspaceProps {
  title?: string;
  description?: string;
}

export function PrivacyWorkspace({ title, description }: PrivacyWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<DetectedMetadata | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [previewUrl, outputUrl]);

  const handleFileSelected = async (selectedFile: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      const detected = MetadataEngine.inspectMetadata(buf);
      setMetadata(detected);
    } catch (err) {
      console.error(err);
      setError("Failed to inspect file metadata.");
    } finally {
      setLoading(false);
    }
  };

  const handleStripMetadata = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      const cleanBytes = MetadataEngine.stripMetadata(buf, file.type);
      const blob = new Blob([cleanBytes as unknown as BlobPart], { type: file.type || "image/jpeg" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to strip metadata from file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title || "Strip EXIF & Photo Metadata"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {description || "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"}
        </p>
      </div>

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpeg,image/png,image/webp";
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            Select Photo to Strip Metadata
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            Supports JPG, PNG, and WebP (Zero uploads to servers)
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* File & Privacy Audit Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                File Details
              </span>
              <span className="text-sm font-semibold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Detected Metadata
              </span>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${metadata?.hasGps ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                  GPS Location: {metadata?.hasGps ? "Detected (Vulnerable)" : "Clean"}
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${metadata?.hasExif ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                  EXIF Device Tags: {metadata?.hasExif ? "Detected" : "None"}
                </span>
                {metadata?.cameraMake && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">
                    Camera: {metadata.cameraMake}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!outputUrl ? (
            <button
              onClick={handleStripMetadata}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-fk-lg shadow-fk-button transition-all text-base flex items-center justify-center gap-2"
            >
              {loading ? "Sanitizing image..." : "Strip All EXIF & GPS Metadata"}
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-emerald-900 block">
                  ✓ Photo Sanitized (Zero GPS, Device, or Serial Tags)
                </span>
                <span className="text-xs text-emerald-700">
                  Ready to download: clean_{file.name}
                </span>
              </div>
              <a
                href={outputUrl}
                download={`clean_${file.name}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                Download Clean Photo
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
