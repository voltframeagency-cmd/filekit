import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { Metadata } from "next";
import { IMAGE_TO_PDF_ROUTES } from "@/config/imageToPdfRoutes";
import ImageToPdfWorkspace from "@/components/pdf-tools/ImageToPdfWorkspace";

const config = IMAGE_TO_PDF_ROUTES["/png-to-pdf"];

export const metadata: Metadata = {
  title: config.title,
  description: config.metaDescription,
  alternates: {
    canonical: "/png-to-pdf"
  }
};

export default function PngToPdfPage() {
  return <ImageToPdfWorkspace config={config} />;
}
