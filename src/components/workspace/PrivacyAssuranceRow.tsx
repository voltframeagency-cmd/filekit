"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";

export default function PrivacyAssuranceRow() {
  const { t } = useLanguage();

  return (
    <div className="w-full flex items-center gap-3 p-4 bg-fk-server-bg border border-[#BFDBFE] rounded-fk-md text-[13px] text-fk-text leading-normal animate-in fade-in duration-200">
      {/* Information outline icon */}
      <div className="text-fk-primary shrink-0">
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
            d="M11.25 11.25l.041-.02a.75.75 0 111.086.797l-.138.286-.007.015-2.197 4.51a.75.75 0 01-1.25.021l-.045-.074-.024-.049a.75.75 0 01.106-.79l.11-.148 1.22-2.5H9.75a.75.75 0 01-.735-.612l-.014-.078a.75.75 0 01.612-.735l.078-.014h1.562zM12 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          />
        </svg>
      </div>
      <p className="font-semibold text-left ltr:text-left rtl:text-right">
        {t("workspace.qualityNote")}
      </p>
    </div>
  );
}
