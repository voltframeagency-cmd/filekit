"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { ArchiveWorkspace } from "@/utils/archive/ArchiveWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function RarToZipPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert RAR to ZIP Online Free – FileKit",
    "url": buildCanonicalUrl("/rar-to-zip"),
    "description": "Convert WinRAR (.rar) archives into standard ZIP files online in your browser without software.",
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
          mode="rar-to-zip"
          title="Convert RAR to ZIP Online"
          description="Convert WinRAR archives into universal ZIP files directly in your browser with 100% privacy."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
