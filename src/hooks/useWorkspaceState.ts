"use client";

import { useState, useEffect } from "react";

export type WorkspaceState =
  | "EMPTY"
  | "INSPECTING"
  | "LOCAL_SAFE"
  | "LOCAL_WITH_WARNING"
  | "SERVER_RECOMMENDED"
  | "SERVER_REQUIRED"
  | "AWAITING_SERVER_CONSENT"
  | "PROCESSING"
  | "VERIFYING"
  | "COMPLETED"
  | "PAYMENT_REQUIRED"
  | "FAILED"
  | "UNSUPPORTED";

export interface FileMetadata {
  name: string;
  size: string;
  sizeBytes: number;
  pages: number;
}

export function useWorkspaceState(initialFile: File | null = null) {
  const [state, setState] = useState<WorkspaceState>("EMPTY");
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);

  // Helper to format bytes to human readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const loadFile = (selectedFile: File) => {
    setFile(selectedFile);
    setState("INSPECTING");

    // Simulate inspection delay (1.2s) for local security and file parsing
    setTimeout(() => {
      // In this demo, we assume the file is safe and processable locally
      const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");
      if (!isPdf) {
        setState("UNSUPPORTED");
        return;
      }

      setMetadata({
        name: selectedFile.name,
        size: formatBytes(selectedFile.size),
        sizeBytes: selectedFile.size,
        // Mocking page count or default to a solid number matching mockup spec (e.g. 24 pages)
        pages: 24,
      });
      setState("LOCAL_SAFE");
    }, 1200);
  };

  const removeFile = () => {
    setFile(null);
    setMetadata(null);
    setState("EMPTY");
  };

  // If a file is pre-loaded (e.g. from homepage drop)
  useEffect(() => {
    if (initialFile) {
      loadFile(initialFile);
    }
  }, [initialFile]);

  return {
    state,
    setState,
    file,
    metadata,
    loadFile,
    removeFile,
  };
}
