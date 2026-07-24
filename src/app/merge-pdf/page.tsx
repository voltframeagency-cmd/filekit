import { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { getSiteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Merge PDF Files Online — Free 100% Local PDF Merger | FileKit",
  description:
    "Combine multiple PDF files into one document in your browser. Fast, free, zero file uploads, 100% private local PDF merger.",
  alternates: {
    canonical: `${getSiteUrl()}/merge-pdf`,
  },
};

export default function MergePdfPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppHeader />
      <main className="flex-1">
        <PdfPageEditorWorkspace
          targetRoute="/merge-pdf"
          title="Merge PDF Files"
          subtitle="Combine multiple PDF documents into a single organized file locally in your browser."
          actionButtonText="Save Merged PDF"
        />
      </main>
      <AppFooter />
    </div>
  );
}
