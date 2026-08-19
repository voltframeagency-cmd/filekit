"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import SubtitleWorkspace from "@/utils/subtitles/SubtitleWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function VttToSrtPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert VTT to SRT Subtitles Online Free – FileKit",
    "url": buildCanonicalUrl("/vtt-to-srt"),
    "description": "Convert WebVTT (.vtt) closed captions back to universal SubRip (.srt) subtitle format online.",
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
          mode="vtt-to-srt"
          title="Convert VTT to SRT Subtitles Online"
          subtitle="Transform WebVTT (.vtt) closed captions into universal SubRip (.srt) subtitles directly in your browser."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
