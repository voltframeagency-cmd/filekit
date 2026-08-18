"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function TrimAudioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Trim Audio Online (Audio Cutter) – FileKit",
    "url": buildCanonicalUrl("/trim-audio"),
    "description": "Cut and trim audio files with millisecond precision and interactive visual waveforms in your browser. Fast, private, and 100% free.",
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
        <AudioWorkspace
          mode="trim"
          title="Trim Audio Online"
          subtitle="Cut audio files with millisecond precision using interactive waveform scrubbing and real-time playback."
          allowedAccept="audio/*"
        />

        <section className="w-full mt-6">
          <TrustPanel />
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
