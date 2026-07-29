"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

interface ToolCardProps {
  id: string;
  nameKey: string;
  descKey: string;
  route: string;
  iconBg: string;
  iconColor: string;
  iconPath: React.ReactNode;
}

export default function ToolCard({
  nameKey,
  descKey,
  route,
  iconBg,
  iconColor,
  iconPath,
}: ToolCardProps) {
  const { t } = useLanguage();

  return (
    <Link
      href={route}
      className="flex items-center justify-between p-4 bg-white border border-fk-border hover:border-fk-primary rounded-fk-xl shadow-sm hover:shadow-md transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Tool icon */}
        <div className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden p-1.5 ${iconBg}`}>
          {iconPath || (
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col text-left ltr:text-left rtl:text-right min-w-0">
          <span className="text-[14px] font-bold text-fk-text leading-tight truncate">
            {t(nameKey)}
          </span>
          <span className="text-[11px] text-fk-text-subtle mt-1 truncate">
            {t(descKey)}
          </span>
        </div>
      </div>

      {/* Right chevron indicator */}
      <span className="text-[20px] font-normal text-fk-text-muted group-hover:text-fk-primary transition-colors duration-150 pl-2 rtl:pr-2 rtl:pl-0">
        ›
      </span>
    </Link>
  );
}
