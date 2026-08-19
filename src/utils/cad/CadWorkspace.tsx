"use client";

import React, { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { buildCanonicalUrl } from "@/utils/siteUrl";

interface CadWorkspaceProps {
  toolSlug: string;
  toolTitle: string;
  description: string;
  sourceFormat: "DWG" | "DXF" | "EPS" | "PSD" | "AI";
  targetFormat: "PDF" | "DXF" | "PNG";
}

export function CadWorkspace({
  toolSlug,
  toolTitle,
  description,
  sourceFormat,
  targetFormat,
}: CadWorkspaceProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${toolTitle} – FileKit`,
    "url": buildCanonicalUrl(toolSlug),
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
  };

  const ext = `.${sourceFormat.toLowerCase()}`;
  const label = `${sourceFormat} Vector Document`;

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <OfficeConverterWorkspace
          toolTitle={toolTitle}
          toolSlug={toolSlug}
          apiEndpoint="/api/internal/convert/word-to-pdf"
          acceptedExtensions={ext}
          documentTypeLabel={label}
        />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
