"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { PrivacyWorkspace } from "@/utils/privacy/PrivacyWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function StripExifPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Strip EXIF & Photo Metadata Free – FileKit",
    "url": buildCanonicalUrl("/strip-exif"),
    "description": "Sanitize photos by wiping GPS coordinates, camera serials, and timestamp tags before sharing online.",
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
        <PrivacyWorkspace
          title="Strip EXIF & Photo Metadata Free"
          description="Sanitize photos by wiping GPS coordinates, camera serials, and timestamp tags before sharing online."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
