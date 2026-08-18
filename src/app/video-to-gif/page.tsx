"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function VideoToGifPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Video to GIF Converter – FileKit",
    "url": buildCanonicalUrl("/video-to-gif"),
    "description": "Convert MP4, WebM, and MOV videos into high-quality animated GIFs with customizable frame rates and smooth palettes.",
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

      <main className="flex-1 flex flex-col gap-12 max-w-7xl mx-auto w-full px-6 md:px-12 py-10">
        <VideoWorkspace
          mode="gif"
          title="Video to Animated GIF Converter"
          subtitle="Turn video clips into smooth, lightweight animated GIFs with customizable framerates and zero watermarks."
          allowedAccept="video/*"
        />

        <section className="w-full mt-6">
          <TrustPanel />
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
