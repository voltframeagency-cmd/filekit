"use client";

import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import ImageCompressionWorkspace from "@/components/image-tools/ImageCompressionWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function CompressImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Image Compressor",
    "url": buildCanonicalUrl("/compress-image"),
    "description": "Compress JPEG, PNG, and static WebP images locally in your browser memory.",
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
            Image Compressor
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed font-medium">
            Compress JPEG, PNG, and static WebP images locally in your browser memory. Choose quality priority, target file size, or dimension limits.
          </p>
        </section>

        <ImageCompressionWorkspace initialMode="BALANCED" />
        <ToolContentRenderer operationId="compress-image" />
      </main>

      <AppFooter />
    </div>
  );
}
