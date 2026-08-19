"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { ArchiveWorkspace } from "@/utils/archive/ArchiveWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function SevenZipToZipPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert 7Z to ZIP Online Free – FileKit",
    "url": buildCanonicalUrl("/7z-to-zip"),
    "description": "Convert 7-Zip (.7z) archives into standard ZIP format online in your browser without software.",
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
        <ArchiveWorkspace
          mode="7z-to-zip"
          title="Convert 7Z to ZIP Online"
          description="Convert 7-Zip archives into universal ZIP format directly in your browser with zero cloud storage."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
