"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function NumbersToExcelPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Apple Numbers to Excel Online – FileKit",
    "url": buildCanonicalUrl("/numbers-to-excel"),
    "description": "Convert Apple Numbers (.numbers) spreadsheets into Microsoft Excel (.xlsx) files online.",
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
          toolTitle="Convert Apple Numbers to Excel Online"
          toolSlug="/numbers-to-excel"
          apiEndpoint="/api/internal/convert/excel-to-pdf"
          acceptedExtensions=".numbers"
          documentTypeLabel="Apple Numbers Spreadsheet"
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
