"use client";

import { useState, useEffect, useRef } from "react";
import { FileCapabilityRouter } from "@/utils/capabilityRouter";
import {
  WorkspaceState,
  FileMetadata,
  ProcessingProgressEvent,
  VerificationResult,
  ProcessingFailure,
  ServerConsentRecord,
  ProcessingJob
} from "@/utils/engine/types";
import { engineRegistry } from "@/utils/engine/engineRegistry";

export type EntitlementState = "DOWNLOAD_READY" | "PAYMENT_REQUIRED";

export function useWorkspaceState(initialFile: File | null = null) {
  const [state, setState] = useState<WorkspaceState>("EMPTY");
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  
  // Phase 1B States
  const [progressEvent, setProgressEvent] = useState<ProcessingProgressEvent | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [failure, setFailure] = useState<ProcessingFailure | null>(null);
  const [consentRecord, setConsentRecord] = useState<ServerConsentRecord | null>(null);
  const [targetSize, setTargetSize] = useState<string>("Under 2 MB (Recommended)");
  
  // Entitlement State for Phase 1C integration
  const [entitlement, setEntitlement] = useState<EntitlementState>("DOWNLOAD_READY");
  
  const abortControllerRef = useRef<AbortController | null>(null);

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
    setProgressEvent(null);
    setVerificationResult(null);
    setFailure(null);
    setConsentRecord(null);

    // Mock entitlement trigger: if file contains 'premium' or 'paywall', require payment
    const fileNameLower = selectedFile.name.toLowerCase();
    if (fileNameLower.includes("premium") || fileNameLower.includes("paywall")) {
      setEntitlement("PAYMENT_REQUIRED");
    } else {
      setEntitlement("DOWNLOAD_READY");
    }

    // Simulate preflight inspection delay (1.2s)
    setTimeout(() => {
      const evaluatedState = FileCapabilityRouter.evaluate({
        file: selectedFile,
        pages: 24, // Mock page count or extract in future
        requestedOperation: "compress",
      });

      if (evaluatedState === "UNSUPPORTED") {
        setState("UNSUPPORTED");
        return;
      }

      setMetadata({
        name: selectedFile.name,
        size: formatBytes(selectedFile.size),
        sizeBytes: selectedFile.size,
        pages: 24,
      });
      setState(evaluatedState);
    }, 1200);
  };

  const removeFile = () => {
    cancelProcessing();
    setFile(null);
    setMetadata(null);
    setProgressEvent(null);
    setVerificationResult(null);
    setFailure(null);
    setConsentRecord(null);
    setState("EMPTY");
  };

  const startProcessing = async (forceServer: boolean = false) => {
    if (!file) return;

    // Create abort controller for cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState("PROCESSING");
    setProgressEvent(null);
    setFailure(null);

    // Fetch engine from registry (throws in production if mock engine is requested)
    const engine = engineRegistry.getEngine("mock-wasm-retained-engine");

    const isServerRoute = forceServer || state === "SERVER_REQUIRED" || (state === "SERVER_RECOMMENDED" && consentRecord?.consentGranted);
    
    const job: ProcessingJob = {
      id: `job-${Math.random().toString(36).substr(2, 9)}`,
      abortSignal: controller.signal,
      onProgress: (event) => {
        setProgressEvent(event);
      },
      onSuccess: (result) => {
        setState("VERIFYING");
        
        setTimeout(() => {
          if (controller.signal.aborted) return;

          // Critical Fix 6: Strengthen verification checks
          const isValidPdf = result.outputMimeType === "application/pdf" && result.outputSizeBytes > 0;
          const isPageCountPreserved = result.pagesBefore === result.pagesAfter;
          
          const isVerificationPassed = 
            result.headerValid && 
            result.parserReadable && 
            result.eofStructureValid && 
            result.mimeValid && 
            result.fatalErrors.length === 0;

          if (!isValidPdf || !isPageCountPreserved || !isVerificationPassed) {
            const errors = [...result.fatalErrors];
            if (!isValidPdf) errors.push("Output is not a valid PDF MIME type.");
            if (!isPageCountPreserved) errors.push("Page count mismatch.");

            setFailure({
              category: "OUTPUT_VERIFICATION_FAILED",
              message: "The compressed file failed PDF structural verification checks.",
              recoverable: true,
              recommendedAction: "Try compressing again with a different target size.",
              diagnosticCode: "ERR_VERIFICATION_FAILED: " + errors.join(", ")
            });
            setState("FAILED");
            return;
          }

          setVerificationResult({
            ...result,
            processingLocation: isServerRoute ? "server" : "local",
          });
          
          setState("COMPLETED");
        }, 800);
      },
      onError: (err) => {
        if (controller.signal.aborted) return;
        setFailure(err);
        setState("FAILED");
      }
    };

    try {
      await engine.compress(file, targetSize, job);
    } catch (e: any) {
      if (controller.signal.aborted) return;
      setFailure({
        category: "UNKNOWN",
        message: e.message || "An unexpected processing error occurred.",
        recoverable: true,
        recommendedAction: "Try running the operation again.",
        diagnosticCode: "ERR_UNHANDLED_EXCEPTION"
      });
      setState("FAILED");
    }
  };

  const cancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (typeof window !== "undefined") {
      console.log("Workspace state: Aborted job, cleaned up object URLs and memory buffers.");
    }

    setProgressEvent(null);

    if (file) {
      const evaluatedState = FileCapabilityRouter.evaluate({
        file,
        pages: 24,
        requestedOperation: "compress",
      });
      setState(evaluatedState);
    } else {
      setState("EMPTY");
    }
  };

  const recordServerConsent = () => {
    if (!file) return;

    setConsentRecord({
      consentGranted: true,
      timestamp: Date.now(),
      fileHash: "sha256-mock-hash-value-178429",
      transportSecurity: "TLS",
    });

    setState("AWAITING_SERVER_CONSENT");
  };

  const startServerProcessing = () => {
    startProcessing(true);
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
    progressEvent,
    verificationResult,
    failure,
    consentRecord,
    targetSize,
    setTargetSize,
    entitlement,
    setEntitlement,
    loadFile,
    removeFile,
    startProcessing,
    cancelProcessing,
    recordServerConsent,
    startServerProcessing
  };
}
