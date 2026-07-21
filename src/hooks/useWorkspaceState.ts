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
  EntitlementStatus,
  LocalPdfRuntimeCapabilities
} from "@/utils/engine/types";
import { runtimeCapabilityService } from "@/utils/engine/runtimeCapabilities";
import { PdfPreflightInspector } from "@/utils/engine/PdfPreflightInspector";
import { engineRegistry } from "@/utils/engine/engineRegistry";
import { entitlementService, checkoutAdapter } from "@/utils/engine/entitlements";

export function useWorkspaceState(initialFile: File | null = null) {
  const [state, setState] = useState<WorkspaceState>("EMPTY");
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [detectedCapabilities, setDetectedCapabilities] = useState<LocalPdfRuntimeCapabilities | null>(null);
  
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

  const loadFile = async (selectedFile: File) => {
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

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      // Run preflight check (checks structure, signature, password-protection, cryptographic sigs)
      const report = await PdfPreflightInspector.inspect(arrayBuffer);

      // Feature-based capability probing via decoupled runtime service
      const caps = await runtimeCapabilityService.detect();
      setDetectedCapabilities(caps);

      // Determine browser memory class (navigator.deviceMemory is optional per MDN, treat missing as unknown/low)
      const browserMemoryClassGB: number | undefined = (navigator as any).deviceMemory ?? undefined;

      const evaluatedState = FileCapabilityRouter.evaluate({
        file: selectedFile,
        pages: report.pageCount,
        requestedOperation: "compress",
        estimatedDecodedMemoryMB: report.estimatedDecodedMemoryMB,
        browserMemoryClassGB,
        hasPdfSignature: true,
        capabilities: caps
      });

      const routingReason = FileCapabilityRouter.getRoutingReason({
        file: selectedFile,
        pages: report.pageCount,
        requestedOperation: "compress",
        estimatedDecodedMemoryMB: report.estimatedDecodedMemoryMB,
        browserMemoryClassGB,
        hasPdfSignature: true,
        capabilities: caps
      });

      if (evaluatedState === "UNSUPPORTED") {
        setState("UNSUPPORTED");
        return;
      }

      setMetadata({
        name: selectedFile.name,
        size: formatBytes(selectedFile.size),
        sizeBytes: selectedFile.size,
        pages: report.pageCount,
        imageCount: report.imageCount,
        estimatedDecodedMemoryMB: report.estimatedDecodedMemoryMB,
        routingReason: routingReason as any
      });
      setState(evaluatedState);

      if (evaluatedState === "LOCAL_SAFE" || evaluatedState === "LOCAL_WITH_WARNING") {
        logEvent("local_engine_eligible");
      } else if (evaluatedState === "SERVER_RECOMMENDED") {
        logEvent("server_fallback_shown");
      }
    } catch (err: any) {
      console.error("Preflight inspection failed:", err);
      if (err.message === "PDF_ENCRYPTED_OR_LOCKED" || err.message === "UNSUPPORTED_SIGNED_DOCUMENT") {
        setFailure({
          category: err.message as any,
          message: err.message === "PDF_ENCRYPTED_OR_LOCKED"
            ? "This PDF is password-protected or encrypted."
            : "This PDF contains a cryptographic digital signature.",
          recoverable: false,
          recommendedAction: "Use server-side secure processing instead.",
          diagnosticCode: err.message
        });
        setState("FAILED");
      } else {
        setState("UNSUPPORTED");
      }
    }
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

    const engine = engineRegistry.getEngine("local-pdf-engine");
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
            logEvent("local_engine_failed");
            return;
          }

          const outcome = result.outcome ?? (result.targetAchieved ? "TARGET_ACHIEVED" : result.reductionPercentage <= 0 ? "NO_BENEFICIAL_REDUCTION" : "TARGET_NOT_MET");

          setVerificationResult({
            ...result,
            targetSizeBytes: result.targetSizeBytes ?? 2 * 1024 * 1024,
            targetAchieved: result.targetAchieved ?? false,
            attemptsRun: result.attemptsRun ?? 1,
            selectedProfile: result.selectedProfile ?? "BALANCED",
            stopReason: result.stopReason ?? (outcome === "TARGET_ACHIEVED" ? "TARGET_REACHED" : outcome === "NO_BENEFICIAL_REDUCTION" ? "OUTPUT_GROWTH" : "MAX_ATTEMPTS"),
            outcome,
            processingLocation: isServerRoute ? "server" : "local",
          });
          
          logEvent("local_engine_completed");
          if (outcome === "TARGET_ACHIEVED") {
            logEvent("target_achieved");
          } else if (outcome === "NO_BENEFICIAL_REDUCTION") {
            logEvent("no_beneficial_reduction");
          } else {
            logEvent("target_not_achieved");
          }

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
            
            // Create Download Grant using real compressed buffer
            if (typeof window !== "undefined" && window.URL) {
              const buf = result.outputBuffer || new ArrayBuffer(0);
              const realBlob = new Blob([buf], { type: "application/pdf" });
              downloadUrlRef.current = window.URL.createObjectURL(realBlob);
            }
            
            setState("COMPLETED");
          } else {
            // Requires payment / paywall - show results card first!
            setEntitlement("NONE");
            setState("COMPLETED");
          }

          if (typeof window !== "undefined") {
            (window as any).__LAST_RESULT__ = {
              ...result,
              outcome,
              state: "COMPLETED"
            };
          }
        }, 800);
      },
      onError: (err) => {
        if (controller.signal.aborted) return;
        setFailure(err);
        setState("FAILED");
        logEvent("local_engine_failed");
      }
    };

    try {
      const activeTarget = (typeof window !== "undefined" && (window as any).__TEST_TARGET_SIZE__) || targetSize;
      await engine.compress(file, activeTarget, job);
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
    logEvent("server_fallback_accepted");
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
        try {
          // Mock payment verification success/failure via CheckoutAdapter
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
        } catch (e: any) {
          setPaymentError(e.message || "Card declined. Please try another card or billing method.");
          setCheckoutPending(false);
          logEvent("payment_failed", planId);
        }
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
