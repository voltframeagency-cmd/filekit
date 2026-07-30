import React from "react";
import Metadata from "next";
import { PDF_TO_IMAGE_ROUTES } from "@/config/pdfToImageRoutes";
import PdfToImageWorkspace from "@/components/pdf-tools/PdfToImageWorkspace";
import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";

const routeConfig = PDF_TO_IMAGE_ROUTES["/pdf-to-image"];

export const metadata = {
  title: routeConfig.metaTitle,
  description: routeConfig.metaDescription,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://test-filekit-compressor.org"}${routeConfig.slug}`
  }
};

export default function PdfToImagePage() {
  return (
    <main className="min-h-screen bg-fk-bg py-6 pb-16">
      <PdfToImageWorkspace config={routeConfig} />
      <ToolContentRenderer operationId="pdf-to-image" />
    </main>
  );
}
