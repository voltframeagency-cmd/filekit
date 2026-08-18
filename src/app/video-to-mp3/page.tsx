"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function VideoToMp3Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract Audio from Video (Video to MP3) – FileKit",
    "url": buildCanonicalUrl("/video-to-mp3"),
    "description": "Extract crystal-clear audio tracks from MP4, MOV, and WebM video files directly in your browser with zero server uploads.",
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
          mode="video-to-mp3"
          title="Video to MP3 Audio Converter"
          subtitle="Extract high-fidelity audio tracks from MP4, WebM, and MOV video files directly in your browser."
          allowedAccept="video/*,audio/*"
        />

        <section className="w-full mt-6">
          <TrustPanel />
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
