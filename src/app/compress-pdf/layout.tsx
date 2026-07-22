import { Metadata } from "next";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Compress PDF below 2 MB Online | FileKit",
  description:
    "Compress PDF files below 2 MB locally in your browser. Preserve optimal visual quality without uploading files to external servers.",
  alternates: {
    canonical: buildCanonicalUrl("/compress-pdf")
  },
  openGraph: {
    title: "Compress PDF below 2 MB Online | FileKit",
    description:
      "Compress PDF files below 2 MB locally in your browser.",
    url: buildCanonicalUrl("/compress-pdf"),
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
