"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { ImageTransformWorkspace } from "@/components/image-transform/ImageTransformWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function SvgToPngPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Convert SVG to PNG",
    "url": buildCanonicalUrl("/svg-to-png"),
    "description": "Convert scalable SVG vector graphics into high-resolution PNG raster images in your browser memory.",
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400">Vector Converter</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            Convert SVG to PNG
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            Convert scalable vector graphics into crisp, high-resolution PNG images with transparent backgrounds directly on your device.
          </p>
        </section>

        <ImageTransformWorkspace
          mode="svg-to-png"
          toolTitle="Convert SVG to PNG"
          toolSlug="/svg-to-png"
          allowedExtensions={[".svg", "image/svg+xml"]}
        />
        <ToolContentRenderer operationId="svg-to-png" />
      </main>

      <AppFooter />
    </div>
  );
}
