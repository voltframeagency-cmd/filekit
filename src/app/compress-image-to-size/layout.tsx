import { Metadata } from "next";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Compress Image to Specific Size (KB or MB) Online | FileKit",
  description:
    "Compress JPEG, PNG, or WebP images to any custom target size (e.g., 200 KB, 3 MB) locally in your browser. Fast, private, and no installation required.",
  alternates: {
    canonical: buildCanonicalUrl("/compress-image-to-size")
  },
  openGraph: {
    title: "Compress Image to Specific Size (KB or MB) Online | FileKit",
    description:
      "Compress JPEG, PNG, or WebP images to any custom target size (e.g., 200 KB, 3 MB) locally in your browser.",
    url: buildCanonicalUrl("/compress-image-to-size"),
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
