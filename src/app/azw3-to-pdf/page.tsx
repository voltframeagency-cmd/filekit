"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { EbookWorkspace } from "@/utils/ebook/EbookWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function Azw3ToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert AZW3 to PDF Online Free – FileKit",
    "url": buildCanonicalUrl("/azw3-to-pdf"),
    "description": "Convert Amazon Kindle AZW3 and KF8 e-books to printable PDF format online in your browser.",
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
          mode="azw3-to-pdf"
          title="Convert Kindle AZW3 to PDF Online"
          description="Convert modern Kindle KF8 / AZW3 formatted e-books into universal PDF documents with 100% privacy."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
