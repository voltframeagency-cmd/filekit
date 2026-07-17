"use client";

import React from "react";
import { useLanguage } from "../layout/LanguageContext";

interface ProcessingModeBadgeProps {
  mode: "local" | "server";
  className?: string;
}

export default function ProcessingModeBadge({
  mode,
  className = "",
}: ProcessingModeBadgeProps) {
  const { t } = useLanguage();

  if (mode === "local") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-fk-success-bg border border-[#BBF7D0] text-fk-success text-[13px] font-bold select-none ${className}`}
        role="status"
        aria-label={t("badge.local")}
      >
        {/* Lock SVG Icon */}
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <span>{t("badge.local")}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-fk-server-bg border border-[#BFDBFE] text-fk-server text-[13px] font-bold select-none ${className}`}
      role="status"
      aria-label="Secure temporary processing"
    >
      {/* Cloud SVG Icon */}
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
        />
      </svg>
      <span>Secure temporary processing</span>
    </div>
  );
}
