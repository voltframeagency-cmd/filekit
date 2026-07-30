import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { getSiteUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Delete PDF Pages Online — Remove Unwanted PDF Pages | FileKit",
  description:
    "Remove and delete unwanted pages from your PDF documents in your browser with instant undo support. 100% private local processing.",
  alternates: {
    canonical: `${getSiteUrl()}/delete-pdf-pages`,
  },
};

export default function DeletePdfPagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppHeader />
      <main className="flex-1">
        <PdfPageEditorWorkspace
          targetRoute="/delete-pdf-pages"
          title="Delete PDF Pages"
          subtitle="Select and remove unwanted pages from your PDF document locally with full undo support."
          actionButtonText="Save Cleaned PDF"
        />
        <ToolContentRenderer operationId="delete-pdf-pages" />
      </main>
      <AppFooter />
    </div>
  );
}
