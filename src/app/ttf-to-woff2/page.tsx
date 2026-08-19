"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { FontWorkspace } from "@/utils/font/FontWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function TtfToWoff2Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert TTF to WOFF2 / WOFF Online – FileKit",
    "url": buildCanonicalUrl("/ttf-to-woff2"),
    "description": "Compress TrueType and OpenType fonts into lightweight web fonts for fast page loading.",
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
        <FontWorkspace
          mode="ttf-to-woff2"
          title="Convert TTF to WOFF2 / WOFF Online"
          description="Compress TrueType and OpenType fonts into lightweight web fonts for fast page loading."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
