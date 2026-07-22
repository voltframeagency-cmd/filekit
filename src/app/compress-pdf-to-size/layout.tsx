import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Compress a PDF to a Specific Size Online | FileKit",
  description: "Compress PDF files to any custom target size (between 100 KB and 50 MB) locally inside your browser memory.",
  alternates: {
    canonical: buildCanonicalUrl("/compress-pdf-to-size")
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function CustomTargetPdfLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
