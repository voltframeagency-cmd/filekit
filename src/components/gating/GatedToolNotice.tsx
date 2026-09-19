"use client";

import React from "react";
import Link from "next/link";
import { SupportedLocale, resolveDictionaryEntry } from "@/config/i18n/locales";
import { GATED_NOTICE_I18N, GatedNoticeI18n } from "./gatedNoticeTranslations";

export interface GatedToolNoticeProps {
  reasonKey: "woff2" | "mobi" | "azw3";
  formatTitle: string;
  language?: string;
}

export default function GatedToolNotice({
  reasonKey,
  formatTitle,
  language = "en",
}: GatedToolNoticeProps) {
  const tr: GatedNoticeI18n = resolveDictionaryEntry(
    GATED_NOTICE_I18N,
    language as SupportedLocale
  );

  const reason = tr.reasons[reasonKey] || tr.reasons.woff2;
  const alternative = tr.alternatives[reasonKey] || tr.alternatives.woff2;

  const basePrefix = language && language !== "en" ? `/${language}` : "";

  return (
    <div
      data-testid="gated-tool-notice"
      className="w-full max-w-3xl mx-auto my-8 bg-white border border-amber-200/80 rounded-fk-xl shadow-fk-card p-6 sm:p-8 text-left ltr:text-left rtl:text-right animate-in fade-in duration-200"
    >
      {/* Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-fk-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
            ⚠️
          </div>
          <div>
            <h2 className="text-[19px] font-black text-slate-900 leading-tight">
              {formatTitle}: {tr.title}
            </h2>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              {tr.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Main explanation body */}
      <div className="mt-5 flex flex-col gap-4 text-slate-700 text-[13.5px] leading-relaxed">
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-fk-lg p-4">
          <h3 className="text-[13px] font-bold text-amber-900 mb-1">
            {tr.reasonHeading}
          </h3>
          <p className="text-[13px] text-amber-950/90 font-normal">
            {reason}
          </p>
        </div>

        <div>
          <h3 className="text-[13px] font-bold text-slate-900 mb-1">
            {tr.standardsHeading}
          </h3>
          <p className="text-[12.5px] text-slate-600">
            {tr.standardsBody}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {tr.alternativeHeading}
            </span>
            <span className="text-[13px] font-medium text-slate-800">
              {alternative}
            </span>
          </div>

          <Link
            href={`${basePrefix}/all-tools`}
            className="inline-flex items-center justify-center h-[42px] px-5 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[13px] font-bold shrink-0 transition-colors shadow-sm"
          >
            {tr.backToTools}
          </Link>
        </div>
      </div>
    </div>
  );
}
