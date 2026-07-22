"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import PdfCompressionWorkspace from "@/components/pdf-tools/PdfCompressionWorkspace";
import { PDF_COMPRESSION_ROUTES } from "@/config/pdfCompressionRoutes";
import { buildCanonicalUrl } from "@/utils/siteUrl";

import * as PDFLib from "pdf-lib";

export default function CustomTargetPdfPage() {
  const searchParams = useSearchParams();
  const routeConfig = PDF_COMPRESSION_ROUTES["/compress-pdf-to-size"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).PDFLib = PDFLib;
    }
  }, []);

  const queryTarget = searchParams.get("target");
  const queryUnit = searchParams.get("unit")?.toLowerCase();

  let initialVal = "3";
  let initialUnit: "kb" | "mb" = "mb";

  if (queryTarget && !isNaN(Number(queryTarget))) {
    const num = parseFloat(queryTarget);
    const unit = queryUnit === "kb" ? "kb" : "mb";
    const bytes = unit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);

    if (bytes >= 100 * 1024 && bytes <= 50 * 1024 * 1024) {
      initialVal = num.toString();
      initialUnit = unit;
    }
  }

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
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-fk-text leading-[1.1] tracking-tight">
            {routeConfig.h1}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-fk-text-muted leading-relaxed">
            {routeConfig.supportingCopy}
          </p>
        </section>

        <PdfCompressionWorkspace
          routeConfig={routeConfig}
          initialTargetValue={initialVal}
          initialTargetUnit={initialUnit}
        />
      </main>

      <AppFooter />
    </div>
  );
}
