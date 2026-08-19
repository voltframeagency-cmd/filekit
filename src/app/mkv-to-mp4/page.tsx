"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function MkvToMp4Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert MKV to MP4 Online Free – FileKit",
    "url": buildCanonicalUrl("/mkv-to-mp4"),
    "description": "Convert Matroska MKV video files to universal MP4 format online in your browser with zero quality loss.",
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
          title="Convert MKV to MP4 Online"
          subtitle="Remux and transcode Matroska MKV video files into universal MP4 video for seamless playback everywhere."
          allowedAccept=".mkv,video/x-matroska,video/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
