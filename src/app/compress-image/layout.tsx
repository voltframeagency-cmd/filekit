import { Metadata } from "next";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export const metadata: Metadata = {
  title: "Image Compressor — Compress JPEG, PNG, WebP Online | FileKit",
  description:
    "Free client-side Image Compressor. Compress JPEG, PNG, and static WebP images locally in your browser memory without quality loss or file uploads.",
  alternates: {
    canonical: buildCanonicalUrl("/compress-image")
  },
  openGraph: {
    title: "Image Compressor — Compress JPEG, PNG, WebP Online | FileKit",
    description:
      "Free client-side Image Compressor. Compress JPEG, PNG, and static WebP images locally in your browser memory.",
    url: buildCanonicalUrl("/compress-image"),
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
