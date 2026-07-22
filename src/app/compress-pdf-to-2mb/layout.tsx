import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Compress PDF below 2 MB Online | FileKit",
  description: "Compress PDF files below 2 MB locally inside your browser memory for easy email attachments and upload compliance.",
  alternates: {
    canonical: buildCanonicalUrl("/compress-pdf-to-2mb")
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function CompressPdf2MbLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
