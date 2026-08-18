"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function CompressVideoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compress Video Online (Target File Size) – FileKit",
    "url": buildCanonicalUrl("/compress-video"),
    "description": "Compress MP4, MOV, and WebM videos to exact file sizes (Under 10MB, 25MB, 50MB) with zero watermarks.",
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
          mode="compress"
          title="Compress Video to Target Size"
          subtitle="Reduce MP4, MOV, and WebM video size to exact limits for email, Discord, and messaging apps. Zero watermarks."
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
