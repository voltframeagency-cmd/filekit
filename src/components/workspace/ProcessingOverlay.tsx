"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { ProcessingProgressEvent } from "@/utils/engine/types";

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

  const currentMessage = progressEvent ? progressEvent.message : "Starting compression engine...";

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 md:px-12 gap-8 animate-in fade-in duration-200 text-center">
      {/* File name headline */}
      <div className="flex flex-col gap-2 max-w-[500px]">
        <h3 className="text-[17px] font-bold text-fk-text leading-tight truncate">
          Compressing '<bdi>{filename}</bdi>'...
        </h3>
        <p className="text-[12px] text-fk-text-subtle">
          Please keep this tab open until processing finishes.
        </p>
      </div>

      {/* Modern Indeterminate Progress Bar */}
      <div className="w-full max-w-[420px] h-2 bg-fk-surface-muted rounded-full overflow-hidden border border-fk-border">
        <div className="h-full bg-fk-primary w-1/3 rounded-full animate-[loading_1.8s_infinite_ease-in-out]"></div>
      </div>

      {/* Display Stage Event Info */}
      <div className="flex flex-col gap-1.5 max-w-[360px]">
        <span className="text-[13px] font-bold text-fk-primary tracking-wide">
          {progressEvent?.stage.replace("_", " ") || "INITIALIZING"}
        </span>
        <p className="text-[12px] text-fk-text-muted leading-relaxed italic">
          "{currentMessage}"
        </p>
      </div>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className="h-[42px] px-8 border border-fk-border hover:border-fk-danger hover:text-fk-danger rounded-fk-md text-[13px] font-bold text-fk-text-muted bg-white hover:bg-red-50/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-danger focus-visible:ring-offset-2"
      >
        Cancel
      </button>
    </div>
  );
}
