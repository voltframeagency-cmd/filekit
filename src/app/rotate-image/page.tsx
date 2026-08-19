"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { ImageTransformWorkspace } from "@/components/image-transform/ImageTransformWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function RotateImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Rotate Image Online",
    "url": buildCanonicalUrl("/rotate-image"),
    "description": "Rotate image files (JPG, PNG, WebP, AVIF) by 90, 180, or 270 degrees locally in your browser with zero visual quality loss.",
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-fk-primary">Image Transformer</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            Rotate Image
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            Rotate photos and pictures by 90°, 180°, or 270° clockwise or counter-clockwise locally on your device with complete privacy.
          </p>
        </section>

        <ImageTransformWorkspace
          mode="rotate"
          toolTitle="Rotate Image"
          toolSlug="/rotate-image"
          allowedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".avif"]}
        />

        <ToolContentRenderer operationId="rotate-image" />
      </main>

      <AppFooter />
    </div>
  );
}
