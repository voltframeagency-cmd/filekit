"use client";

import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";

import React, { useEffect } from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import PdfCompressionWorkspace from "@/components/pdf-tools/PdfCompressionWorkspace";
import { PDF_COMPRESSION_ROUTES } from "@/config/pdfCompressionRoutes";
import { buildCanonicalUrl } from "@/utils/siteUrl";

import * as PDFLib from "pdf-lib";

export default function CompressPdf2MbPage() {
  const routeConfig = PDF_COMPRESSION_ROUTES["/compress-pdf-to-2mb"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).PDFLib = PDFLib;
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": routeConfig.jsonLdTitle,
    "url": buildCanonicalUrl(routeConfig.slug),
    "description": routeConfig.supportingCopy,
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-fk-primary">PDF Compressor</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            {routeConfig.h1}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed font-medium">
            {routeConfig.supportingCopy}
          </p>
        </section>

        <PdfCompressionWorkspace routeConfig={routeConfig} />
        <ToolContentRenderer operationId="compress-pdf-to-2mb" />
      </main>

      <AppFooter />
    </div>
  );
}
