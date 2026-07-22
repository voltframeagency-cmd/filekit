"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ImageCompressionWorkspace from "@/components/image-tools/ImageCompressionWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function CustomTargetImagePage() {
  const searchParams = useSearchParams();

  const queryTarget = searchParams.get("target");
  const queryUnit = searchParams.get("unit")?.toLowerCase();

  let initialVal = "200";
  let initialUnit: "kb" | "mb" = "kb";

  if (queryTarget && !isNaN(Number(queryTarget))) {
    const num = parseFloat(queryTarget);
    const unit = queryUnit === "mb" ? "mb" : "kb";
    const bytes = unit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);

    if (bytes >= 20 * 1024 && bytes <= 50 * 1024 * 1024) {
      initialVal = num.toString();
      initialUnit = unit;
    }
  }

  const canonicalUrl = buildCanonicalUrl("/compress-image-to-size");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit Compress an Image to a Specific Size",
    "url": canonicalUrl,
    "description": "Compress JPEG, PNG, or WebP images to any custom target size (between 20 KB and 50 MB) locally in your browser memory.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All"
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader />

      <main className="flex-1 flex flex-col gap-6 md:gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-6 md:py-12">
        <section className="flex flex-col gap-1.5 max-w-[840px] mx-auto w-full text-left ltr:text-left rtl:text-right px-2">
          <span className="text-[12px] font-bold uppercase tracking-wider text-fk-primary">Image Compressor</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-fk-text leading-[1.1] tracking-tight">
            Compress an Image to a Specific Size
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-fk-text-muted leading-relaxed">
            Enter any target size between 20 KB and 50 MB. FileKit optimizes your JPEG, PNG, or WebP image locally inside your browser memory.
          </p>
        </section>

        <ImageCompressionWorkspace
          initialMode="TARGET_SIZE"
          initialTargetValue={initialVal}
          initialTargetUnit={initialUnit}
        />
      </main>

      <AppFooter />
    </div>
  );
}
