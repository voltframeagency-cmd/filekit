"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import ToolCard from "./ToolCard";
import { FileKitAsset } from "@/components/visuals/FileKitAsset";
import { FileKitAssetName } from "@/components/visuals/assetRegistry";

export default function ToolGrid() {
  const { t, language } = useLanguage();
  const basePrefix = language && language !== "en" ? `/${language}` : "";

  const popularTools: Array<{
    id: string;
    nameKey: string;
    descKey: string;
    route: string;
    assetName?: FileKitAssetName;
    iconBg: string;
    iconColor: string;
  }> = [
    {
      id: "compress-pdf",
      nameKey: "breadcrumb.compress",
      descKey: "tool.compress.desc",
      route: "/compress-pdf",
      assetName: "compress-pdf",
      iconBg: "bg-red-50 dark:bg-red-950/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      id: "merge-pdf",
      nameKey: "tool.merge.title",
      descKey: "tool.merge.desc",
      route: "/merge-pdf",
      assetName: "merge-pdf",
      iconBg: "bg-amber-50 dark:bg-amber-950/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "split-pdf",
      nameKey: "tool.split.title",
      descKey: "tool.split.desc",
      route: "/split-pdf",
      assetName: "split-pdf",
      iconBg: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "rotate-pdf",
      nameKey: "tool.rotate.title",
      descKey: "tool.rotate.desc",
      route: "/rotate-pdf-pages",
      assetName: "rotate-pdf",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "watermark-pdf",
      nameKey: "tool.watermark.title",
      descKey: "tool.watermark.desc",
      route: "/watermark-pdf",
      assetName: "watermark-pdf",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "pdf-to-word",
      nameKey: "tool.pdfToWord.title",
      descKey: "tool.pdfToWord.desc",
      route: "#",
      assetName: "pdf-to-word",
      iconBg: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 bg-white border border-white/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Title Header — slate-900 on white card background */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-900 leading-tight">
          {t("homepage.popularTools")}
        </h2>
        <a
          href={`${basePrefix}/#all-tools`}
          className="text-[13px] font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
        >
          {t("homepage.viewAll") || t("homepage.browseAll")}
        </a>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularTools.map((tool) => (
          <ToolCard
            key={tool.id}
            {...tool}
            iconPath={
              tool.assetName ? (
                <FileKitAsset name={tool.assetName} className="w-full h-full object-contain" />
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
