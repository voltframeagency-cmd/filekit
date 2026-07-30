"use client";

import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import ImageConverterWorkspace from "@/components/image-tools/ImageConverterWorkspace";
import { IMAGE_CONVERSION_ROUTES } from "@/config/imageConversionRoutes";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function GeneralConvertImagePage() {
  const cfg = IMAGE_CONVERSION_ROUTES["/convert-image"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": cfg.jsonLdTitle,
    "url": buildCanonicalUrl(cfg.slug),
    "description": cfg.supportingCopy,
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
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            {cfg.h1}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed font-medium">
            {cfg.supportingCopy}
          </p>
        </section>

        <ImageConverterWorkspace routeConfig={cfg} />
        <ToolContentRenderer operationId="convert-image" />
      </main>

      <AppFooter />
    </div>
  );
}
