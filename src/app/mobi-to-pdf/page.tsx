"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { EbookWorkspace } from "@/utils/ebook/EbookWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function MobiToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert MOBI to PDF Online Free – FileKit",
    "url": buildCanonicalUrl("/mobi-to-pdf"),
    "description": "Convert Kindle MOBI and PRC e-books into clean, printable PDF documents in your browser.",
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
          mode="mobi-to-pdf"
          title="Convert Kindle MOBI to PDF Online"
          description="Transform Amazon Kindle MOBI files into universal PDF documents for easy reading and printing."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
