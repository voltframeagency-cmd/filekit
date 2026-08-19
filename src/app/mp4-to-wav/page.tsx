"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function Mp4ToWavPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract WAV from MP4 Online Free – FileKit",
    "url": buildCanonicalUrl("/mp4-to-wav"),
    "description": "Extract uncompressed, high-fidelity PCM WAV audio from MP4 video recordings online.",
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
          title="Extract WAV from MP4 Online"
          subtitle="Extract uncompressed, studio-quality PCM WAV audio directly from MP4 video files in your browser."
          allowedAccept=".mp4,video/mp4,video/*"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
