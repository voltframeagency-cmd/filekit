"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function OggToMp3Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert OGG to MP3 Online Free – FileKit",
    "url": buildCanonicalUrl("/ogg-to-mp3"),
    "description": "Convert Ogg Vorbis and Opus audio files into universal MP3 format online in your browser.",
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
          title="Convert OGG to MP3 Online"
          subtitle="Transform Ogg Vorbis gaming and voice recordings into universal MP3 audio files in your browser."
          allowedAccept=".ogg,.oga,.opus,audio/ogg,audio/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
