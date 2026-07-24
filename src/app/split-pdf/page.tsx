import { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { getSiteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Split PDF Pages Online — Free Local PDF Splitter | FileKit",
  description:
    "Split PDF files into individual pages or custom page ranges in your browser. 100% private, free, zero server uploads.",
  alternates: {
    canonical: `${getSiteUrl()}/split-pdf`,
  },
};

export default function SplitPdfPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppHeader />
      <main className="flex-1">
        <PdfPageEditorWorkspace
          targetRoute="/split-pdf"
          title="Split PDF Document"
          subtitle="Separate PDF pages or extract custom page ranges locally in your browser."
          actionButtonText="Export Split PDF"
        />
      </main>
      <AppFooter />
    </div>
  );
}
