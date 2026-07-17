"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { useWorkspaceState } from "@/hooks/useWorkspaceState";
import UploadDropzone from "./UploadDropzone";
import FileSummaryCard from "./FileSummaryCard";
import ProcessingModeBadge from "../common/ProcessingModeBadge";
import TargetSizeSelector from "../workspace/TargetSizeSelector";
import PrivacyAssuranceRow from "../workspace/PrivacyAssuranceRow";
import LocalProcessingBanner from "../workspace/LocalProcessingBanner";

// Phase 1B Components
import ProcessingOverlay from "../workspace/ProcessingOverlay";
import ServerFallbackConsent from "../workspace/ServerFallbackConsent";
import VerifiedResultCard from "../workspace/VerifiedResultCard";
import TargetNotMetCard from "../workspace/TargetNotMetCard";
import ErrorRecoveryPanel from "../workspace/ErrorRecoveryPanel";

interface UploadWorkspaceProps {
  initialFile?: File | null;
}

export default function UploadWorkspace({ initialFile = null }: UploadWorkspaceProps) {
  const { t } = useLanguage();
  
  const {
    state,
    setState,
    file,
    metadata,
    progressEvent,
    verificationResult,
    failure,
    consentRecord,
    loadFile,
    removeFile,
    startProcessing,
    cancelProcessing,
    recordServerConsent,
    startServerProcessing
  } = useWorkspaceState(initialFile);

  const handleFileSelect = (file: File) => {
    loadFile(file);
  };

  const handleLocalCompress = () => {
    startProcessing();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Badge Header Area */}
      <div className="flex items-center justify-between min-h-[36px] px-2">
        <div className="flex items-center gap-2 text-[13px] text-fk-text-muted">
          <span>{t("breadcrumb.home")}</span>
          <span>›</span>
          <span className="font-bold text-fk-primary">{t("breadcrumb.compress")}</span>
        </div>
        
        {/* Render correct route badge */}
        <ProcessingModeBadge 
          mode={
            state === "SERVER_REQUIRED" || 
            state === "AWAITING_SERVER_CONSENT" || 
            (verificationResult && verificationResult.processingLocation === "server") 
              ? "server" 
              : "local"
          } 
        />
      </div>

      {/* Main Workspace Box */}
      <div className="bg-white border border-fk-border rounded-fk-xl shadow-sm p-6 md:p-8 w-full max-w-[840px] mx-auto min-h-[420px] flex flex-col justify-between transition-all duration-200">
        
        {state === "EMPTY" && (
          <div className="flex flex-col gap-6 h-full flex-1 justify-between">
            <UploadDropzone isGeneric={false} onFileSelect={handleFileSelect} accept=".pdf" />
            
            {/* Bottom Safe Banner inside workspace */}
            <div className="w-full flex items-center gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md text-[13px] text-fk-text-muted leading-normal">
              <div className="text-fk-success shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <p className="text-left ltr:text-left rtl:text-right font-medium">
                {t("workspace.stayOnDevice")}{" "}
                <span className="text-fk-text-subtle font-normal">
                  {t("workspace.askBeforeTransfer")}
                </span>
              </p>
            </div>
          </div>
        )}

        {state === "INSPECTING" && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-6">
            <div className="w-12 h-12 border-4 border-fk-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-[17px] font-bold text-fk-text">Inspecting file locally...</h3>
              <p className="text-[12px] text-fk-text-subtle">Evaluating file integrity and processing capacity</p>
            </div>
            <div className="w-full max-w-[320px] h-1.5 bg-fk-surface-muted rounded-full overflow-hidden border border-fk-border">
              <div className="h-full bg-fk-primary w-2/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
            </div>
          </div>
        )}

        {/* Local Safe & Warnings */}
        {(state === "LOCAL_SAFE" || state === "LOCAL_WITH_WARNING") && metadata && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {state === "LOCAL_WITH_WARNING" && (
              <div className="p-3 bg-fk-warning-bg border border-fk-warning/20 rounded-fk-md text-[12px] text-fk-warning font-semibold text-left ltr:text-left rtl:text-right">
                Warning: High page count. Compressing locally might feel slow on older devices.
              </div>
            )}
            <FileSummaryCard metadata={metadata} onRemove={removeFile} />
            <TargetSizeSelector />
            <PrivacyAssuranceRow />
            <button
              type="button"
              onClick={handleLocalCompress}
              className="w-full h-[54px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[15px] font-bold shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
            >
              {t("workspace.compressBtn")}
            </button>
            <LocalProcessingBanner />
          </div>
        )}

        {/* Server Recommended option */}
        {state === "SERVER_RECOMMENDED" && metadata && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200 text-left ltr:text-left rtl:text-right">
            <div className="p-4 bg-fk-server-bg border border-[#BFDBFE] rounded-fk-md text-fk-server">
              <h4 className="text-[14px] font-bold">Secure server processing recommended</h4>
              <p className="text-[12px] text-fk-server/80 mt-1">
                This file exceeds 50 MB. Processing locally in the browser is possible but might slow down your browser tab.
              </p>
            </div>
            <FileSummaryCard metadata={metadata} onRemove={removeFile} />
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                type="button"
                onClick={recordServerConsent}
                className="flex-1 h-[52px] bg-fk-server hover:bg-indigo-700 text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none"
              >
                Use Server Processing
              </button>
              <button
                type="button"
                onClick={() => setState("LOCAL_SAFE")} // Downgrade to local route voluntarily
                className="flex-1 h-[52px] bg-white border border-fk-border hover:bg-fk-surface-muted text-fk-text rounded-fk-md text-[14px] font-bold transition-colors duration-150"
              >
                Process Locally Instead
              </button>
            </div>
          </div>
        )}

        {/* Server Required warning */}
        {state === "SERVER_REQUIRED" && metadata && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200 text-left ltr:text-left rtl:text-right">
            <div className="p-4 bg-fk-danger-bg border border-fk-danger/20 rounded-fk-md text-fk-danger">
              <h4 className="text-[14px] font-bold">Secure server processing required</h4>
              <p className="text-[12px] text-fk-danger/80 mt-1">
                This file exceeds 100 MB, which is too large for local browser memory.
              </p>
            </div>
            <FileSummaryCard metadata={metadata} onRemove={removeFile} />
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                type="button"
                onClick={recordServerConsent}
                className="flex-1 h-[52px] bg-fk-server hover:bg-indigo-700 text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none"
              >
                Use Server Processing
              </button>
              <button
                type="button"
                onClick={removeFile}
                className="h-[52px] px-8 border border-fk-border hover:bg-fk-surface-muted text-fk-text-muted rounded-fk-md text-[14px] font-bold transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Awaiting Server Consent Overlay */}
        {state === "AWAITING_SERVER_CONSENT" && file && (
          <ServerFallbackConsent
            filename={file.name}
            reason={metadata && metadata.sizeBytes > 100 * 1024 * 1024 ? "size" : "recommended"}
            onConsent={startServerProcessing}
            onCancel={cancelProcessing}
          />
        )}

        {/* Processing State */}
        {state === "PROCESSING" && file && (
          <ProcessingOverlay
            filename={file.name}
            progressEvent={progressEvent}
            onCancel={cancelProcessing}
          />
        )}

        {/* Verifying state */}
        {state === "VERIFYING" && file && (
          <ProcessingOverlay
            filename={file.name}
            progressEvent={{ stage: "VERIFYING_OUTPUT", message: "Verifying output structure and format compliance...", timestamp: Date.now() }}
            onCancel={cancelProcessing}
          />
        )}

        {/* Completed Outcome */}
        {state === "COMPLETED" && file && verificationResult && (
          <>
            {verificationResult.targetAchieved ? (
              <VerifiedResultCard
                filename={file.name}
                result={verificationResult}
                onReset={removeFile}
              />
            ) : (
              <TargetNotMetCard
                filename={file.name}
                result={verificationResult}
                onReset={removeFile}
                onTryServer={recordServerConsent}
              />
            )}
          </>
        )}

        {/* Failure Panel */}
        {state === "FAILED" && file && failure && (
          <ErrorRecoveryPanel
            filename={file.name}
            failure={failure}
            onReset={removeFile}
            onRetry={startProcessing}
            onFallback={recordServerConsent}
          />
        )}

        {state === "UNSUPPORTED" && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
            <div className="p-3 bg-red-50 text-fk-danger rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-fk-text">Unsupported File Format</h3>
            <p className="text-[13px] text-fk-text-muted text-center max-w-[320px]">
              FileKit only supports PDF documents for this compression workflow.
            </p>
            <button
              type="button"
              onClick={removeFile}
              className="mt-2 h-[38px] px-6 bg-fk-surface border border-fk-border text-[13px] font-bold text-fk-text hover:bg-fk-surface-muted rounded-fk-md transition-colors duration-150"
            >
              Try Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
