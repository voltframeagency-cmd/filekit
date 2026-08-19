"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { FontWorkspace } from "@/utils/font/FontWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function Woff2ToTtfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert WOFF2 to TTF Online – FileKit",
    "url": buildCanonicalUrl("/woff2-to-ttf"),
    "description": "Decompress web fonts back into standard TrueType fonts for Windows and Mac desktop installation.",
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
          mode="woff2-to-ttf"
          title="Convert WOFF2 / WOFF to TTF Online"
          description="Decompress web fonts back into standard TrueType fonts for Windows and Mac desktop installation."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
