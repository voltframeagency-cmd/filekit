"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function WebmToMp4Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert WebM to MP4 Online Free – FileKit",
    "url": buildCanonicalUrl("/webm-to-mp4"),
    "description": "Convert WebM screen recordings and browser videos to universal MP4 format online.",
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <VideoWorkspace
          mode="convert"
          title="Convert WebM to MP4 Online"
          subtitle="Convert WebM video captures and HTML5 clips into high-quality MP4 video in your browser."
          allowedAccept=".webm,video/webm,video/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
