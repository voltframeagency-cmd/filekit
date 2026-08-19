"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfManipulationWorkspace } from "@/components/pdf-manipulation/PdfManipulationWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function ReversePdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Reverse PDF Pages Online",
    "url": buildCanonicalUrl("/reverse-pdf"),
    "description": "Reverse PDF page order from last to first directly in your browser with complete privacy and zero server uploads.",
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
            Reverse PDF Pages
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed">
            Invert the page sequence of your PDF documents from last page to first locally on your device with 100% privacy.
          </p>
        </section>

        <PdfManipulationWorkspace mode="reverse" toolTitle="Reverse PDF Pages" toolSlug="/reverse-pdf" />

        <ToolContentRenderer operationId="reverse-pdf" />
      </main>

      <AppFooter />
    </div>
  );
}
