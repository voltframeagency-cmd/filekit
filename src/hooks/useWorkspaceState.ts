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
  ProcessingJob,
  EntitlementStatus
} from "@/utils/engine/types";
import { engineRegistry } from "@/utils/engine/engineRegistry";
import { entitlementService, checkoutAdapter } from "@/utils/engine/entitlements";

export function useWorkspaceState(initialFile: File | null = null) {
  const [state, setState] = useState<WorkspaceState>("EMPTY");
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  
  // Phase 1B/1C States
  const [progressEvent, setProgressEvent] = useState<ProcessingProgressEvent | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [failure, setFailure] = useState<ProcessingFailure | null>(null);
  const [consentRecord, setConsentRecord] = useState<ServerConsentRecord | null>(null);
  const [targetSize, setTargetSize] = useState<string>("Under 2 MB (Recommended)");
  
  // Phase 1C Gating
  const [entitlement, setEntitlement] = useState<EntitlementStatus>("NONE");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [checkoutPending, setCheckoutPending] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const downloadUrlRef = useRef<string | null>(null);

  // Helper to format bytes to human readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(nsLog(bytes, k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const nsLog = (x: number, y: number) => {
    return Math.log(x) / Math.log(y);
  };

  // Revoke object URLs to clear browser RAM
  const revokeActiveDownload = () => {
    if (downloadUrlRef.current) {
      if (typeof window !== "undefined" && window.URL) {
        window.URL.revokeObjectURL(downloadUrlRef.current);
      }
      downloadUrlRef.current = null;
    }
  };

  const loadFile = (selectedFile: File) => {
    revokeActiveDownload();
    setFile(selectedFile);
    setState("INSPECTING");
    setProgressEvent(null);
    setVerificationResult(null);
    setFailure(null);
    setConsentRecord(null);
    setSelectedPlanId(null);
    setPaymentError(null);
    setEntitlement("NONE");

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
    revokeActiveDownload();
    setFile(null);
    setMetadata(null);
    setProgressEvent(null);
    setVerificationResult(null);
    setFailure(null);
    setConsentRecord(null);
    setSelectedPlanId(null);
    setPaymentError(null);
    setEntitlement("NONE");
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
        
        setTimeout(async () => {
          if (controller.signal.aborted) return;

          // Verification checks
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
          
          // PHASE 1C: Gating and Entitlement checking
          setState("VERIFYING"); // Maintain visual verification during check
          
          // Formal entitlement check (no filenames, no query parameters)
          const checkInput = {
            fileHash: "sha256-mock-hash-value-178429",
            fileSize: result.outputSizeBytes,
            locale: "en"
          };

          const checkResult = await entitlementService.check(checkInput);
          
          if (checkResult.isEligible) {
            // Entitled (FREE_DOWNLOAD or active subscription)
            setEntitlement(checkResult.status);
            
            // Create Download Grant
            if (typeof window !== "undefined" && window.URL) {
              const mockBlob = new Blob(["%PDF-1.4\n%mock output content"], { type: "application/pdf" });
              downloadUrlRef.current = window.URL.createObjectURL(mockBlob);
            }
            
            setState("COMPLETED");
          } else {
            // Requires payment / paywall
            setEntitlement("NONE");
            setState("PAYMENT_REQUIRED");
          }
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
    
    revokeActiveDownload();
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

  // Phase 1C: Checkout triggers
  const executePlanCheckout = async (planId: string) => {
    if (!file || !verificationResult) return;
    
    setCheckoutPending(true);
    setPaymentError(null);

    try {
      // 1. Decoupled Checkout session creation
      const session = await checkoutAdapter.createSession(planId, "sha256-mock-hash-value-178429");
      
      // Simulate remote payment processor latency
      setTimeout(async () => {
        // Mock failure scenario (if file has 'fail' or input fails)
        if (file.name.toLowerCase().includes("fail")) {
          setPaymentError("Card declined. Please try another card or billing method.");
          setCheckoutPending(false);
          // Analytics track checkout failure
          logEvent("payment_failed", planId);
          return;
        }

        // Mock payment verification success
        const confirmation = await checkoutAdapter.verifyPayment(session.sessionId);
        
        // 2. Grant download entitlements
        const grant = await entitlementService.grant(confirmation);
        
        // Register mock grant in local development service
        entitlementService.registerMockGrant("sha256-mock-hash-value-178429");
        
        if (typeof window !== "undefined" && window.URL) {
          const mockBlob = new Blob(["%PDF-1.4\n%mock premium output content"], { type: "application/pdf" });
          downloadUrlRef.current = window.URL.createObjectURL(mockBlob);
        }
        
        setEntitlement("SINGLE_EXPORT");
        setCheckoutPending(false);
        setState("COMPLETED");

        // Analytics track checkout success
        logEvent("payment_succeeded", planId);
        logEvent("download_unlocked", planId);
      }, 1500);

    } catch (e: any) {
      setPaymentError(e.message || "An unexpected error occurred during checkout initialization.");
      setCheckoutPending(false);
    }
  };

  const triggerCheckoutCancel = () => {
    // Abort checkout session
    setCheckoutPending(false);
    setPaymentError(null);
    logEvent("checkout_cancelled", selectedPlanId ?? undefined);
  };

  // Privacy-safe analytics tracking helper
  const logEvent = (eventName: string, planId?: string) => {
    console.log(`[Privacy-Safe Analytics] Tracked: "${eventName}"`, {
      planId,
      route: verificationResult?.processingLocation ?? "local",
      fileSizeBucket: (file?.size ?? 0) > 50 * 1024 * 1024 ? "over_50MB" : (file?.size ?? 0) > 5 * 1024 * 1024 ? "5MB_to_50MB" : "under_5MB",
      pageCountBucket: (verificationResult?.pagesAfter ?? 24) > 50 ? "over_50" : "under_50",
      targetMet: verificationResult?.targetAchieved ?? true,
      deviceClass: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
      locale: "en",
      anonymousSessionId: "fk-anon-session-10928374",
    });
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
    checkoutPending,
    paymentError,
    downloadUrl: downloadUrlRef.current,
    loadFile,
    removeFile,
    startProcessing,
    cancelProcessing,
    recordServerConsent,
    startServerProcessing,
    executePlanCheckout,
    triggerCheckoutCancel,
    logEvent,
    revokeActiveDownload
  };
}
