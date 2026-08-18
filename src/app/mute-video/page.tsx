"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import VideoWorkspace from "@/utils/video/VideoWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function MuteVideoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mute Video Online (Remove Audio) – FileKit",
    "url": buildCanonicalUrl("/mute-video"),
    "description": "Remove audio and sound tracks from MP4, MOV, and WebM videos with 0 re-encoding and zero quality loss.",
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
          mode="mute"
          title="Mute Video Online"
          subtitle="Strip audio tracks from video clips with 0 re-encoding, preserving 100% original video clarity and quality."
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
