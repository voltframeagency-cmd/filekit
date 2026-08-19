"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfManipulationWorkspace } from "@/components/pdf-manipulation/PdfManipulationWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function FlattenPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Flatten PDF Form Fields Online",
    "url": buildCanonicalUrl("/flatten-pdf"),
    "description": "Flatten fillable PDF forms, annotations, and form fields into read-only static PDF content directly on your device with complete privacy.",
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-fk-primary">PDF Security & Forms</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-slate-900 leading-[1.1] drop-shadow-sm tracking-tight">
            Flatten PDF Forms
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed">
            Lock interactive form fields, checkboxes, text inputs, and annotations permanently into non-editable PDF pages.
          </p>
        </section>

        <PdfManipulationWorkspace mode="flatten" toolTitle="Flatten PDF Forms" toolSlug="/flatten-pdf" />

        <ToolContentRenderer operationId="flatten-pdf" />
      </main>

      <AppFooter />
    </div>
  );
}
