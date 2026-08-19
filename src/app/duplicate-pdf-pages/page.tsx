"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfManipulationWorkspace } from "@/components/pdf-manipulation/PdfManipulationWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function DuplicatePdfPagesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Duplicate PDF Pages",
    "url": buildCanonicalUrl("/duplicate-pdf-pages"),
    "description": "Duplicate selected or all pages in your PDF document for double-sided printing or booklet workflows with zero file uploads.",
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
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-slate-900 leading-[1.1] drop-shadow-sm tracking-tight">
            Duplicate PDF Pages
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed">
            Clone specific pages or duplicate the entire PDF document for duplex scanning and booklet printing workflows.
          </p>
        </section>

        <PdfManipulationWorkspace mode="duplicate" toolTitle="Duplicate PDF Pages" toolSlug="/duplicate-pdf-pages" />

        <ToolContentRenderer operationId="duplicate-pdf-pages" />
      </main>

      <AppFooter />
    </div>
  );
}
