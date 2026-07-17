"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { ProcessingProgressEvent, ProcessingStage } from "@/utils/engine/types";

interface ProcessingOverlayProps {
  filename: string;
  progressEvent: ProcessingProgressEvent | null;
  onCancel: () => void;
}

export default function ProcessingOverlay({
  filename,
  progressEvent,
  onCancel,
}: ProcessingOverlayProps) {
  const { t } = useLanguage();

  const stages: { key: ProcessingStage; label: string }[] = [
    { key: "READING_FILE", label: "Reading file buffer into memory" },
    { key: "ANALYZING_PAGES", label: "Analyzing page structure & fonts" },
    { key: "COMPRESSING_IMAGES", label: "Downsampling color images" },
    { key: "REBUILDING_PDF", label: "Optimizing cross-reference tables" },
    { key: "VERIFYING_OUTPUT", label: "Verifying compliance & rendering" },
  ];

  const currentStage: ProcessingStage = progressEvent ? progressEvent.stage : "READING_FILE";

  const getStageIndex = (stage: ProcessingStage): number => {
    return stages.findIndex((s) => s.key === stage);
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 animate-in fade-in duration-200 text-left ltr:text-left rtl:text-right">
      {/* Title */}
      <div className="flex flex-col mb-6">
        <h3 className="text-[17px] font-black text-fk-text leading-tight truncate">
          Compressing '<bdi>{filename}</bdi>'...
        </h3>
        <p className="text-[12px] text-fk-text-subtle mt-1">
          Keep this tab active until processing completes.
        </p>
      </div>

      {/* Five-stage Stepper Card */}
      <div className="flex flex-col gap-4 p-5 border border-fk-border bg-fk-surface-muted rounded-fk-xl mb-6">
        {stages.map((s, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={s.key} className="flex items-center gap-3.5 select-none transition-all duration-200">
              {/* Dot Status Indicator */}
              <div className="shrink-0">
                {isCompleted && (
                  <div className="w-6 h-6 rounded-full bg-fk-success-bg border border-[#BBF7D0] flex items-center justify-center text-fk-success text-[12px] font-black animate-in zoom-in-50 duration-200">
                    ✓
                  </div>
                )}
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-[#EEF2FF] border-2 border-fk-server flex items-center justify-center relative">
                    <span className="w-2.5 h-2.5 bg-fk-server rounded-full animate-ping absolute"></span>
                    <span className="w-2.5 h-2.5 bg-fk-server rounded-full"></span>
                  </div>
                )}
                {isPending && (
                  <div className="w-6 h-6 rounded-full bg-white border border-fk-border-strong"></div>
                )}
              </div>

              {/* Step Label */}
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[13px] transition-colors duration-200 ${
                    isActive
                      ? "font-black text-fk-text"
                      : isCompleted
                      ? "font-medium text-fk-text-muted/70 line-through decoration-fk-text-muted/40"
                      : "font-medium text-fk-text-subtle"
                  }`}
                >
                  {s.label}
                </span>
                {isActive && (
                  <span className="text-[11px] text-fk-text-subtle font-mono mt-0.5 animate-pulse">
                    {progressEvent?.message || "Running step..."}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer and cancel action */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] text-fk-text-subtle font-mono">
          Engine: mock-wasm-retained
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="h-[42px] px-8 border border-fk-border hover:border-fk-danger hover:text-fk-danger rounded-fk-md text-[13px] font-bold text-fk-text-muted bg-white hover:bg-red-50/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-danger focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
