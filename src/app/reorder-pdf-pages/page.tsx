import { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { getSiteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Reorder PDF Pages Online — Drag & Drop PDF Page Organizer | FileKit",
  description:
    "Rearrange and reorder PDF pages visually using drag-and-drop or keyboard controls in your browser. 100% private & free.",
  alternates: {
    canonical: `${getSiteUrl()}/reorder-pdf-pages`,
  },
};

export default function ReorderPdfPagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppHeader />
      <main className="flex-1">
        <PdfPageEditorWorkspace
          targetRoute="/reorder-pdf-pages"
          title="Reorder PDF Pages"
          subtitle="Drag and drop page thumbnails to rearrange your PDF document sequence in seconds."
          actionButtonText="Save Reordered PDF"
        />
      </main>
      <AppFooter />
    </div>
  );
}
