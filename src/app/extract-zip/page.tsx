"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { ArchiveWorkspace } from "@/utils/archive/ArchiveWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function ExtractZipPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract ZIP Online Free – FileKit",
    "url": buildCanonicalUrl("/extract-zip"),
    "description": "Unpack and download files from ZIP archives directly in your browser with 100% privacy.",
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
          mode="extract"
          title="Extract ZIP Online Free"
          description="Unpack and download files from ZIP archives directly in your browser with 100% privacy."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
