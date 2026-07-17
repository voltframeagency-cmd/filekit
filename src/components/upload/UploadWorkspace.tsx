"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { useWorkspaceState, WorkspaceState } from "@/hooks/useWorkspaceState";
import UploadDropzone from "./UploadDropzone";
import FileSummaryCard from "./FileSummaryCard";
import ProcessingModeBadge from "../common/ProcessingModeBadge";
import TargetSizeSelector from "../workspace/TargetSizeSelector";
import PrivacyAssuranceRow from "../workspace/PrivacyAssuranceRow";
import LocalProcessingBanner from "../workspace/LocalProcessingBanner";

interface UploadWorkspaceProps {
  initialFile?: File | null;
}

export default function UploadWorkspace({ initialFile = null }: UploadWorkspaceProps) {
  const { t } = useLanguage();
  const { state, metadata, loadFile, removeFile } = useWorkspaceState(initialFile);

  const handleFileSelect = (file: File) => {
    loadFile(file);
  };

  const handleCompressClick = () => {
    alert("Compression process initiated! (Proceeding to Phase 1B states in future phases)");
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
        <ProcessingModeBadge mode="local" />
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
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-6 animate-pulse">
            {/* Minimalist Spinner */}
            <div className="w-12 h-12 border-4 border-fk-primary border-t-transparent rounded-full animate-spin"></div>
            
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-[18px] font-bold text-fk-text">Inspecting file locally...</h3>
              <p className="text-[12px] text-fk-text-subtle">Reading document structure and safety compliance</p>
            </div>

            {/* Simulated Progress bar */}
            <div className="w-full max-w-[320px] h-1.5 bg-fk-surface-muted rounded-full overflow-hidden border border-fk-border">
              <div className="h-full bg-fk-primary w-2/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
            </div>
          </div>
        )}

        {state === "LOCAL_SAFE" && metadata && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {/* File Info */}
            <FileSummaryCard metadata={metadata} onRemove={removeFile} />

            {/* Target Size Select */}
            <TargetSizeSelector />

            {/* Quality Note Alert */}
            <PrivacyAssuranceRow />

            {/* Big Action Button */}
            <button
              type="button"
              onClick={handleCompressClick}
              className="w-full h-[54px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[15px] font-bold shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
            >
              {t("workspace.compressBtn")}
            </button>

            {/* Local Processing Verified Success Banner */}
            <LocalProcessingBanner />
          </div>
        )}

        {state === "UNSUPPORTED" && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
            <div className="p-3 bg-red-50 text-fk-danger rounded-full">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
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
