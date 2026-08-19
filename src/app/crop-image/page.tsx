"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { ImageTransformWorkspace } from "@/components/image-transform/ImageTransformWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function CropImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Crop Image",
    "url": buildCanonicalUrl("/crop-image"),
    "description": "Crop JPG, PNG, WebP, and AVIF photos with custom aspect ratios directly in your browser.",
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
          <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400">Image Editor</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            Crop Image
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            Trim and crop photos to exact dimensions or standard aspect ratios (1:1, 16:9, 4:3) with zero server upload.
          </p>
        </section>

        <ImageTransformWorkspace
          mode="crop"
          toolTitle="Crop Image"
          toolSlug="/crop-image"
          allowedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", "image/*"]}
        />
        <ToolContentRenderer operationId="crop-image" />
      </main>

      <AppFooter />
    </div>
  );
}
