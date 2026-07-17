"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";
import { FileMetadata } from "@/hooks/useWorkspaceState";

interface FileSummaryCardProps {
  metadata: FileMetadata;
  onRemove: () => void;
}

export default function FileSummaryCard({
  metadata,
  onRemove,
}: FileSummaryCardProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full flex items-center justify-between p-4 md:p-6 bg-fk-surface-muted border border-fk-border rounded-fk-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center gap-4 min-w-0">
        {/* PDF Icon container */}
        <div className="w-12 h-12 rounded-fk-md bg-red-50 flex items-center justify-center shrink-0 text-red-600">
          {/* PDF Page Icon */}
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>

        {/* File name and metadata details */}
        <div className="flex flex-col text-left ltr:text-left rtl:text-right min-w-0">
          <span className="text-[15px] font-bold text-fk-text leading-tight truncate">
            <bdi>{metadata.name}</bdi>
          </span>
          <span className="text-[12px] text-fk-text-subtle mt-1 font-mono">
            Original size: <bdi>{metadata.size}</bdi>  •  <bdi>{metadata.pages} pages</bdi>
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="h-[42px] px-6 border border-fk-text-muted hover:border-fk-danger hover:text-fk-danger rounded-fk-md text-[13px] font-bold text-fk-text-muted bg-white hover:bg-red-50/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-danger focus-visible:ring-offset-2 shrink-0 ml-4 rtl:mr-4 rtl:ml-0"
      >
        {t("workspace.remove")}
      </button>
    </div>
  );
}
