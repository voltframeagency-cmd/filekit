"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function PagesToWordPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Apple Pages to Word DOCX Online – FileKit",
    "url": buildCanonicalUrl("/pages-to-word"),
    "description": "Convert Apple Pages (.pages) documents into Microsoft Word (.docx) files online.",
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
          toolTitle="Convert Apple Pages to Word DOCX"
          toolSlug="/pages-to-word"
          apiEndpoint="/api/internal/convert/word-to-pdf"
          acceptedExtensions=".pages"
          documentTypeLabel="Apple Pages Document"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
