import { Metadata } from "next";
import { IMAGE_TO_PDF_ROUTES } from "@/config/imageToPdfRoutes";
import ImageToPdfWorkspace from "@/components/pdf-tools/ImageToPdfWorkspace";

const config = IMAGE_TO_PDF_ROUTES["/image-to-pdf"];

export const metadata: Metadata = {
  title: config.title,
  description: config.metaDescription,
  alternates: {
    canonical: "/image-to-pdf"
  }
};

export default function ImageToPdfPage() {
  return <ImageToPdfWorkspace config={config} />;
}
