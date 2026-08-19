"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { EbookWorkspace } from "@/utils/ebook/EbookWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function PdfToEpubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert PDF to EPUB Online Free – FileKit",
    "url": buildCanonicalUrl("/pdf-to-epub"),
    "description": "Convert PDF documents into reflowable EPUB e-books for Kindle, Apple Books, and Kobo readers.",
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
        <EbookWorkspace
          mode="pdf-to-epub"
          title="Convert PDF to EPUB E-Book Online"
          description="Convert fixed-layout PDF documents into responsive e-reader EPUB books with zero cloud upload."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
