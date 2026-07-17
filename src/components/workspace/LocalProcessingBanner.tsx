"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";

export default function LocalProcessingBanner() {
  const { t } = useLanguage();

  return (
    <div className="w-full flex items-center gap-3 p-4 bg-fk-success-bg border border-[#BBF7D0] rounded-fk-lg animate-in fade-in duration-200">
      {/* Green lock icon */}
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-[13px] text-left ltr:text-left rtl:text-right">
        <span className="font-bold text-fk-success">{t("workspace.localReady")}</span>
        <span className="text-fk-text-muted">{t("workspace.notLeftDevice")}</span>
      </div>
    </div>
  );
}
