"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { ReverseOfficeWorkspace } from "@/components/office-tools/ReverseOfficeWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function PdfToPowerpointPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Convert PDF to PowerPoint",
    "url": buildCanonicalUrl("/pdf-to-powerpoint"),
    "description": "Convert PDF documents to editable Microsoft PowerPoint (.pptx) presentation slides online.",
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400">PDF to Office</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-slate-900 leading-[1.1] drop-shadow-sm tracking-tight">
            Convert PDF to PowerPoint PPTX
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed">
            Convert PDF pages and slide decks into editable Microsoft PowerPoint presentations.
          </p>
        </section>

        <ReverseOfficeWorkspace
          toolTitle="Convert PDF to PowerPoint"
          toolSlug="/pdf-to-powerpoint"
          apiEndpoint="/api/internal/convert/pdf-to-powerpoint"
          targetFormatExtension=".pptx"
          targetFormatName="PowerPoint Presentation (PPTX)"
          targetFormatBadge="PPTX"
        />
        <ToolContentRenderer operationId="pdf-to-powerpoint" />
      </main>

      <AppFooter />
    </div>
  );
}
