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
  const dict = resolveDictionaryEntry(
    GATED_NOTICE_I18N,
    language as SupportedLocale
  );
  const tr: GatedNoticeI18n = dict[reasonKey] || dict.woff2 || GATED_NOTICE_I18N.en[reasonKey];

  const basePrefix = language && language !== "en" ? `/${language}` : "";

  return (
    <div
      data-testid="gated-tool-notice"
      className="w-full max-w-2xl mx-auto my-8 bg-white border border-amber-200/80 rounded-fk-xl shadow-fk-card p-6 sm:p-8 text-left ltr:text-left rtl:text-right animate-in fade-in duration-200"
    >
      {/* Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-fk-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl">
            ⚠️
          </div>
          <div>
            <h2 className="text-[18px] font-black text-slate-900 leading-tight">
              {tr.title}
            </h2>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              {tr.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Main explanation body */}
      <div className="mt-4 flex flex-col gap-4 text-slate-700 text-[13.5px] leading-relaxed">
        <p className="text-[13.5px] text-slate-700 leading-normal">
          {tr.reason}
        </p>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {tr.alternativeHeading}
            </span>
            <span className="text-[13px] font-medium text-slate-800">
              {tr.alternative}
            </span>
          </div>

          <Link
            href={`${basePrefix}/all-tools`}
            className="inline-flex items-center justify-center h-[40px] px-5 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[13px] font-bold shrink-0 transition-colors shadow-sm"
          >
            {tr.backToTools}
          </Link>
        </div>
      </div>
    </div>
  );
}
