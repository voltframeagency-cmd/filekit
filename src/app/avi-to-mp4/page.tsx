"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function AviToMp4Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert AVI to MP4 Online Free – FileKit",
    "url": buildCanonicalUrl("/avi-to-mp4"),
    "description": "Convert Audio Video Interleave (.avi) video files to universal MP4 format online in your browser.",
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
          title="Convert AVI to MP4 Online"
          subtitle="Convert legacy AVI video clips into modern, web-standard MP4 video with 100% privacy."
          allowedAccept=".avi,video/x-msvideo,video/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
