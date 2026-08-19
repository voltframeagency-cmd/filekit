"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import PdfToImageWorkspace from "@/components/pdf-tools/PdfToImageWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { PDF_TO_IMAGE_ROUTES } from "@/config/pdfToImageRoutes";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function PdfToJpgPage() {
  const routeConfig = PDF_TO_IMAGE_ROUTES["/pdf-to-jpg"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": routeConfig.metaTitle,
    "url": buildCanonicalUrl(routeConfig.slug),
    "description": routeConfig.metaDescription,
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
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-slate-900 leading-[1.1] drop-shadow-sm tracking-tight">
            {routeConfig.h1}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed font-medium">
            {routeConfig.metaDescription}
          </p>
        </section>

        <PdfToImageWorkspace config={routeConfig} />
        <ToolContentRenderer operationId="pdf-to-jpg" />
      </main>

      <AppFooter />
    </div>
  );
}
