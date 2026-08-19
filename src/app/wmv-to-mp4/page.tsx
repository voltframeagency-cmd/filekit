"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function WmvToMp4Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert WMV to MP4 Online Free – FileKit",
    "url": buildCanonicalUrl("/wmv-to-mp4"),
    "description": "Convert Windows Media Video (.wmv) clips to universal MP4 format online in your browser.",
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
          title="Convert WMV to MP4 Online"
          subtitle="Transform legacy Windows Media Video files into universal MP4 videos with zero server uploads."
          allowedAccept=".wmv,video/x-ms-wmv,video/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
