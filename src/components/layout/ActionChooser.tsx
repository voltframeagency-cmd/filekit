"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

interface ActionChooserProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export default function ActionChooser({
  isOpen,
  file,
  onClose,
  onSelectAction,
}: ActionChooserProps) {
  const { t } = useLanguage();

  if (!isOpen || !file) return null;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name);

  // Recommendations depending on file type
  const pdfActions = [
    { id: "compress-pdf", label: t("breadcrumb.compress"), desc: t("tool.compress.desc"), active: true },
    { id: "merge-pdf", label: t("tool.merge.title"), desc: t("tool.merge.desc"), active: false },
    { id: "pdf-to-word", label: t("tool.pdfToWord.title"), desc: t("tool.pdfToWord.desc"), active: false },
  ];

  const imageActions = [
    { id: "resize-image", label: t("tool.resize.title"), desc: t("tool.resize.desc"), active: false },
    { id: "image-converter", label: t("tool.convert.title"), desc: t("tool.convert.desc"), active: false },
  ];

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-fk-border rounded-fk-xl shadow-lg max-w-[480px] w-full p-6 text-left ltr:text-left rtl:text-right animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col min-w-0">
            <h3 className="text-[18px] font-black text-fk-text leading-tight truncate">
              File uploaded
            </h3>
            <span className="text-[12px] text-fk-text-subtle truncate mt-1 max-w-[360px] font-mono block">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-fk-text-muted hover:text-fk-text rounded-full hover:bg-fk-surface-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content body */}
        <div className="flex flex-col gap-4">
          <p className="text-[13px] text-fk-text-muted leading-relaxed">
            What action do you need to perform on this file?
          </p>

          {isPdf && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                Recommended PDF Actions
              </span>
              {pdfActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className={`w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right ${
                    act.active
                      ? "border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                      : "border-fk-border bg-fk-surface-muted opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  {act.active && (
                    <span className="text-[13px] font-bold text-fk-primary">Start →</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {isImage && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                Recommended Image Actions
              </span>
              {imageActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className={`w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right ${
                    act.active
                      ? "border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                      : "border-fk-border bg-fk-surface-muted opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                </button>
              ))}
              <div className="p-3 bg-fk-warning-bg border border-fk-warning/20 rounded-fk-md text-[11px] text-fk-warning font-semibold">
                Image tools coming soon. Only PDF compression is supported in this slice.
              </div>
            </div>
          )}

          {!isPdf && !isImage && (
            <div className="flex flex-col gap-3 mt-2 p-4 bg-fk-danger-bg border border-fk-danger/20 rounded-fk-md text-center">
              <div className="text-fk-danger mx-auto mb-1">
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
              <span className="text-[14px] font-bold text-fk-text">
                Unsupported File Family
              </span>
              <p className="text-[11px] text-fk-text-muted">
                FileKit currently only supports PDF and Image families. Please select a valid document format.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
