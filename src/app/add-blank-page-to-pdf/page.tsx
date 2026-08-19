"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfManipulationWorkspace } from "@/components/pdf-manipulation/PdfManipulationWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function AddBlankPageToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Add Blank Page to PDF",
    "url": buildCanonicalUrl("/add-blank-page-to-pdf"),
    "description": "Insert blank pages at the start, end, or custom positions of your PDF document directly on your device with complete privacy.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-fk-primary">PDF Page Tool</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            Add Blank Page to PDF
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            Insert clean blank pages at the beginning, end, or between specific page numbers locally in browser memory.
          </p>
        </section>

        <PdfManipulationWorkspace mode="add-blank" toolTitle="Add Blank Page to PDF" toolSlug="/add-blank-page-to-pdf" />

        <ToolContentRenderer operationId="add-blank-page-to-pdf" />
      </main>

      <AppFooter />
    </div>
  );
}
