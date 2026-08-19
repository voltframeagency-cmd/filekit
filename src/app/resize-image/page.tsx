"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import { ImageTransformWorkspace } from "@/components/image-transform/ImageTransformWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function ResizeImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Resize Image",
    "url": buildCanonicalUrl("/resize-image"),
    "description": "Resize image width and height in pixels or percentage with aspect ratio lock directly in your browser.",
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
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-slate-900 leading-[1.1] drop-shadow-sm tracking-tight">
            Resize Image
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-slate-600 leading-relaxed">
            Change image dimensions by exact pixels or percentage while preserving crisp visual clarity and aspect ratio.
          </p>
        </section>

        <ImageTransformWorkspace
          mode="resize"
          toolTitle="Resize Image"
          toolSlug="/resize-image"
          allowedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", "image/*"]}
        />
        <ToolContentRenderer operationId="resize-image" />
      </main>

      <AppFooter />
    </div>
  );
}
