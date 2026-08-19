"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import SubtitleWorkspace from "@/utils/subtitles/SubtitleWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function SrtToVttPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert SRT to VTT Subtitles Online Free – FileKit",
    "url": buildCanonicalUrl("/srt-to-vtt"),
    "description": "Convert SubRip (.srt) subtitle files to WebVTT (.vtt) format for HTML5 video players online.",
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
        <SubtitleWorkspace
          mode="srt-to-vtt"
          title="Convert SRT to VTT Subtitles Online"
          subtitle="Transform SubRip (.srt) subtitle files into WebVTT (.vtt) format for HTML5 video players in your browser."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
