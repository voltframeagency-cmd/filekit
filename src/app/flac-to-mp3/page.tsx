"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function FlacToMp3Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert FLAC to MP3 Online Free – FileKit",
    "url": buildCanonicalUrl("/flac-to-mp3"),
    "description": "Convert lossless FLAC audio files into high-bitrate 320kbps MP3 audio online in your browser.",
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
          title="Convert FLAC to MP3 Online"
          subtitle="Compress large lossless FLAC tracks into high-quality MP3 audio files directly in your browser."
          allowedAccept=".flac,audio/flac,audio/x-flac,audio/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
