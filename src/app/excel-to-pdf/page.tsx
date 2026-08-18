"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function ExcelToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Convert Excel to PDF",
    "url": buildCanonicalUrl("/excel-to-pdf"),
    "description": "Convert XLSX and XLS spreadsheets to PDF online with exact table formatting.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All"
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="flex-1 flex flex-col gap-6 md:gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-6 md:py-12">
        <section className="flex flex-col gap-1.5 max-w-[840px] mx-auto w-full text-left ltr:text-left rtl:text-right px-2">
          <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400">Office Converter</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            Convert Excel to PDF
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            Convert Microsoft Excel spreadsheets (.xlsx, .xls) to clean, paginated PDF documents.
          </p>
        </section>

        <OfficeConverterWorkspace
          toolTitle="Convert Excel to PDF"
          toolSlug="/excel-to-pdf"
          apiEndpoint="/api/internal/convert/excel-to-pdf"
          acceptedExtensions=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          documentTypeLabel="Excel Spreadsheet"
        />
        <ToolContentRenderer operationId="excel-to-pdf" />
      </main>

      <AppFooter />
    </div>
  );
}
