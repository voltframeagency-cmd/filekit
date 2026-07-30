import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { getSiteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online — Permanent 90° PDF Page Rotator | FileKit",
  description:
    "Rotate individual or all pages in your PDF file clockwise or counter-clockwise in 90° increments. 100% private in-browser tool.",
  alternates: {
    canonical: `${getSiteUrl()}/rotate-pdf-pages`,
  },
};

export default function RotatePdfPagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppHeader />
      <main className="flex-1">
        <PdfPageEditorWorkspace
          targetRoute="/rotate-pdf-pages"
          title="Rotate PDF Pages"
          subtitle="Rotate specific pages or all pages 90° clockwise or counter-clockwise in your browser."
          actionButtonText="Save Rotated PDF"
        />
        <ToolContentRenderer operationId="rotate-pdf-pages" />
      </main>
      <AppFooter />
    </div>
  );
}
