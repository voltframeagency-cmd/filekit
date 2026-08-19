"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { SchemaGenerator } from "@/utils/seo/SchemaGenerator";
import { HowToStepSection } from "@/components/seo/HowToStepSection";
import { AeoFaqSection } from "@/components/seo/AeoFaqSection";
import { getToolSeoContent } from "@/config/seo/toolFaqs";

interface CadWorkspaceProps {
  toolSlug?: string;
  toolTitle?: string;
  description?: string;
  sourceFormat?: "DWG" | "DXF" | "EPS" | "PSD" | "AI";
  targetFormat?: "PDF" | "DXF" | "PNG";
  mode?: "dwg-to-pdf" | "dxf-to-pdf" | "dwg-to-dxf" | "eps-to-pdf" | "eps-to-png" | "psd-to-png" | "ai-to-pdf" | "ai-to-png";
  title?: string;
  embedded?: boolean;
}

export function CadWorkspace({
  toolSlug,
  toolTitle,
  description = "Convert CAD & vector graphics directly in your browser with high precision.",
  sourceFormat,
  targetFormat,
  mode,
  title,
  embedded = false,
}: CadWorkspaceProps) {
  // Normalize parameters
  const effectiveSlug = toolSlug || (mode ? `/${mode}` : "/dwg-to-pdf");
  const effectiveTitle = toolTitle || title || "CAD & Vector Converter";

  let effectiveExt = ".dwg";
  let effectiveLabel = "CAD / Vector Document";

  if (sourceFormat) {
    effectiveExt = `.${sourceFormat.toLowerCase()}`;
    effectiveLabel = `${sourceFormat} Vector Document`;
  } else if (mode) {
    if (mode.startsWith("dwg")) { effectiveExt = ".dwg"; effectiveLabel = "AutoCAD DWG Drawing"; }
    else if (mode.startsWith("dxf")) { effectiveExt = ".dxf"; effectiveLabel = "AutoCAD DXF Drawing"; }
    else if (mode.startsWith("eps")) { effectiveExt = ".eps"; effectiveLabel = "PostScript EPS Vector"; }
    else if (mode.startsWith("psd")) { effectiveExt = ".psd"; effectiveLabel = "Adobe Photoshop PSD"; }
    else if (mode.startsWith("ai")) { effectiveExt = ".ai"; effectiveLabel = "Adobe Illustrator AI"; }
  }

  if (embedded) {
    return (
      <OfficeConverterWorkspace
        toolTitle={effectiveTitle}
        toolSlug={effectiveSlug}
        apiEndpoint="/api/internal/convert/word-to-pdf"
        acceptedExtensions={effectiveExt}
        documentTypeLabel={effectiveLabel}
      />
    );
  }

  const jsonLd = SchemaGenerator.generateFullStructuredData({
    slug: effectiveSlug,
    title: effectiveTitle,
    description,
  });

  const seoContent = getToolSeoContent(effectiveSlug, effectiveTitle);

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <OfficeConverterWorkspace
          toolTitle={effectiveTitle}
          toolSlug={effectiveSlug}
          apiEndpoint="/api/internal/convert/word-to-pdf"
          acceptedExtensions={effectiveExt}
          documentTypeLabel={effectiveLabel}
        />
        <HowToStepSection toolTitle={effectiveTitle} steps={seoContent.howToSteps} />
        <AeoFaqSection toolTitle={effectiveTitle} faqs={seoContent.faqs} />
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

export default CadWorkspace;
