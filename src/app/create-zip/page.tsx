"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { ArchiveWorkspace } from "@/utils/archive/ArchiveWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function CreateZipPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Create ZIP Archive Online – FileKit",
    "url": buildCanonicalUrl("/create-zip"),
    "description": "Bundle and compress multiple files into a single standard ZIP archive in your browser.",
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
        <ArchiveWorkspace
          mode="create"
          title="Create ZIP Archive Online"
          description="Bundle and compress multiple files into a single standard ZIP archive inside your browser."
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
