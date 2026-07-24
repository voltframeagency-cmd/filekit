"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import ToolCard from "./ToolCard";

export default function ToolGrid() {
  const { t } = useLanguage();

  const popularTools = [
    {
      id: "compress-pdf",
      nameKey: "breadcrumb.compress",
      descKey: "tool.compress.desc",
      route: "/compress-pdf",
      iconBg: "bg-red-50 dark:bg-red-950/20",
      iconColor: "text-red-600 dark:text-red-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l6-6m0 0l6 6m-6-6v12m0 0l-3-3m3 3l3-3"
        />
      ),
    },
    {
      id: "merge-pdf",
      nameKey: "tool.merge.title",
      descKey: "tool.merge.desc",
      route: "/merge-pdf",
      iconBg: "bg-amber-50 dark:bg-amber-950/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      ),
    },
    {
      id: "resize-image",
      nameKey: "tool.resize.title",
      descKey: "tool.resize.desc",
      route: "/compress-image",
      iconBg: "bg-green-50 dark:bg-green-950/20",
      iconColor: "text-green-600 dark:text-green-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75v16.5h16.5M12 12h4.5m-4.5 0v4.5"
        />
      ),
    },
    {
      id: "image-converter",
      nameKey: "tool.convert.title",
      descKey: "tool.convert.desc",
      route: "/convert-image",
      iconBg: "bg-cyan-50 dark:bg-cyan-950/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      ),
    },
    {
      id: "pdf-to-word",
      nameKey: "tool.pdfToWord.title",
      descKey: "tool.pdfToWord.desc",
      route: "#",
      iconBg: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      ),
    },
    {
      id: "all-tools",
      nameKey: "tool.allTools.title",
      descKey: "tool.allTools.desc",
      route: "#",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-fk-text leading-tight">
          {t("homepage.popularTools")}
        </h2>
        <a
          href="#"
          className="text-[13px] font-bold text-fk-primary hover:text-fk-primary-hover hover:underline transition-colors duration-150"
        >
          {t("homepage.browseAll")}
        </a>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularTools.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
}
