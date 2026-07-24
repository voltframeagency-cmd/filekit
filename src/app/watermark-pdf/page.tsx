import { Metadata } from "next";
import SiteHeader from "@/components/navigation/SiteHeader";
import { PdfOverlayWorkspace } from "@/components/pdf-overlay/PdfOverlayWorkspace";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online — Free Local Tool | FileKit",
  description:
    "Stamp text or image watermarks onto PDF documents online for free. 100% private in-browser processing with zero server uploads.",
  alternates: {
    canonical: "https://filekit.com/watermark-pdf",
  },
};

export default function WatermarkPdfPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <PdfOverlayWorkspace />
      </main>
    </div>
  );
}
