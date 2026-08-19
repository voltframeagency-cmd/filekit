"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { EbookWorkspace } from "@/utils/ebook/EbookWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function EpubToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert EPUB to PDF Online Free – FileKit",
    "url": buildCanonicalUrl("/epub-to-pdf"),
    "description": "Convert EPUB e-books to high-quality printable PDF documents online in your browser with 100% privacy.",
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
          mode="epub-to-pdf"
          title="Convert EPUB to PDF Online"
          description="Transform EPUB e-books into clean, formatted, printable PDF documents in your browser."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
