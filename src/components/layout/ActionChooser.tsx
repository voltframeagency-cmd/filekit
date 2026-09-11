"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { ACTION_CHOOSER_STRINGS } from "@/config/i18n/actionChooserTranslations";
import { SupportedLocale } from "@/config/i18n/locales";

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
  const { t, language } = useLanguage();
  const rawLang = (language || "en") as SupportedLocale;
  const shortLang = (language || "en").split("-")[0] as SupportedLocale;
  const tr = ACTION_CHOOSER_STRINGS[rawLang] || ACTION_CHOOSER_STRINGS[shortLang] || ACTION_CHOOSER_STRINGS.en;

  if (!isOpen || !file) return null;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp|tiff|avif|ico)$/i.test(file.name);
  const isOffice = /\.(docx?|xlsx?|pptx?)$/i.test(file.name);
  const isArchive = /\.(zip|rar|7z|tar)$/i.test(file.name);
  const isAudioVideo = /\.(mp3|wav|ogg|m4a|mp4|mov|avi|mkv|webm)$/i.test(file.name);

  // Recommendations depending on file type
  const pdfActions = [
    { id: "compress-pdf", label: t("breadcrumb.compress"), desc: t("tool.compress.desc"), active: true },
    { id: "merge-pdf", label: t("tool.merge.title"), desc: t("tool.merge.desc"), active: true },
    { id: "pdf-to-word", label: t("tool.pdfToWord.title"), desc: t("tool.pdfToWord.desc"), active: true },
    { id: "ocr-pdf", label: tr.ocrTitle, desc: tr.ocrDesc, active: true },
  ];

  const imageActions = [
    { id: "resize-image", label: t("tool.resize.title"), desc: t("tool.resize.desc"), active: true },
    { id: "convert-image", label: t("tool.convert.title"), desc: t("tool.convert.desc"), active: true },
    { id: "strip-exif", label: tr.stripTitle, desc: tr.stripDesc, active: true },
  ];

  const officeActions = [
    { id: "word-to-pdf", label: tr.wordTitle, desc: tr.wordDesc, active: true },
    { id: "excel-to-pdf", label: tr.excelTitle, desc: tr.excelDesc, active: true },
    { id: "powerpoint-to-pdf", label: tr.pptTitle, desc: tr.pptDesc, active: true },
  ];

  const archiveActions = [
    { id: "extract-zip", label: tr.extractTitle, desc: tr.extractDesc, active: true },
    { id: "create-zip", label: tr.createTitle, desc: tr.createDesc, active: true },
  ];

  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-fk-border rounded-fk-xl shadow-lg max-w-[480px] w-full p-6 text-left ltr:text-left rtl:text-right animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col min-w-0">
            <h3 className="text-[18px] font-black text-fk-text leading-tight truncate">
              {tr.fileSelected}
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
            {tr.whatAction}
          </p>

          {isPdf && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {tr.recPdf}
              </span>
              {pdfActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{tr.startBtn}</span>
                </button>
              ))}
            </div>
          )}

          {isImage && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {tr.recImage}
              </span>
              {imageActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{tr.startBtn}</span>
                </button>
              ))}
            </div>
          )}

          {isOffice && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {tr.recOffice}
              </span>
              {officeActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{tr.startBtn}</span>
                </button>
              ))}
            </div>
          )}

          {isArchive && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {tr.recArchive}
              </span>
              {archiveActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{tr.startBtn}</span>
                </button>
              ))}
            </div>
          )}

          {!isPdf && !isImage && !isOffice && !isArchive && !isAudioVideo && (
            <div className="flex flex-col gap-3 mt-2 p-4 bg-fk-danger-bg border border-fk-danger/20 rounded-fk-md text-center">
              <span className="text-[14px] font-bold text-fk-text">
                {tr.catalogTitle}
              </span>
              <p className="text-[11px] text-fk-text-muted">
                {tr.catalogDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
