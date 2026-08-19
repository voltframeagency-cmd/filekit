"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { ArchiveWorkspace } from "@/utils/archive/ArchiveWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function ExtractRarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract RAR Files Online Free – FileKit",
    "url": buildCanonicalUrl("/extract-rar"),
    "description": "Unpack and open WinRAR (.rar) archives online in your browser without installing WinRAR.",
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
          mode="extract-rar"
          title="Extract RAR Archive Online"
          description="Open, view, and extract files from WinRAR (.rar) archives online with zero server uploads."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
