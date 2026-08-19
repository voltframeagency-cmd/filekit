"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function KeynoteToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Apple Keynote to PDF Online – FileKit",
    "url": buildCanonicalUrl("/keynote-to-pdf"),
    "description": "Convert Apple Keynote (.key) presentations into high-fidelity PDF slide decks online.",
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
        <OfficeConverterWorkspace
          toolTitle="Convert Apple Keynote to PDF Online"
          toolSlug="/keynote-to-pdf"
          apiEndpoint="/api/internal/convert/powerpoint-to-pdf"
          acceptedExtensions=".key"
          documentTypeLabel="Apple Keynote Presentation"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
