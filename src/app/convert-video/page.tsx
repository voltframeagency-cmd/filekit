"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function ConvertVideoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Video Online – FileKit",
    "url": buildCanonicalUrl("/convert-video"),
    "description": "Convert video files between MP4, WebM, MOV, MKV, and AVI containers online. Fast, secure, and watermark-free.",
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
          mode="convert"
          title="Convert Video Online"
          subtitle="Convert videos between MP4, WebM, MOV, MKV, and AVI formats with pristine visual quality and zero watermarks."
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
