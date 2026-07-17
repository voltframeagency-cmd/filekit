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
        <div className={`w-11 h-11 rounded-fk-md flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            {iconPath}
          </svg>
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
