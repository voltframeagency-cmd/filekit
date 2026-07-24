import { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { getSiteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Extract PDF Pages Online — Select & Save PDF Pages | FileKit",
  description:
    "Select specific pages from a PDF document and extract them into a new standalone PDF file locally in your browser.",
  alternates: {
    canonical: `${getSiteUrl()}/extract-pdf-pages`,
  },
};

export default function ExtractPdfPagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppHeader />
      <main className="flex-1">
        <PdfPageEditorWorkspace
          targetRoute="/extract-pdf-pages"
          title="Extract PDF Pages"
          subtitle="Select specific pages from your PDF file and export them as a new standalone document."
          actionButtonText="Export Extracted Pages"
        />
      </main>
      <AppFooter />
    </div>
  );
}
