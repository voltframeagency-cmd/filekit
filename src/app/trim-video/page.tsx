"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function TrimVideoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Trim Video Online (Video Cutter) – FileKit",
    "url": buildCanonicalUrl("/trim-video"),
    "description": "Cut and trim MP4, MOV, and WebM videos with millisecond precision directly in your browser. Fast, private, and watermark-free.",
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
          mode="trim"
          title="Trim Video Online"
          subtitle="Cut video clips to exact start and end timestamps with instant playback preview and zero watermarks."
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
