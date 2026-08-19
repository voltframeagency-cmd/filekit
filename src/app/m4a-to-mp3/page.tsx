"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function M4aToMp3Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert M4A to MP3 Online Free – FileKit",
    "url": buildCanonicalUrl("/m4a-to-mp3"),
    "description": "Convert Apple M4A and voice memos into universal MP3 audio online in your browser.",
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
        <AudioWorkspace
          mode="convert"
          title="Convert M4A to MP3 Online"
          subtitle="Transform Apple Voice Memos and iTunes M4A audio into universal MP3 audio files in your browser."
          allowedAccept=".m4a,audio/m4a,audio/x-m4a,audio/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
