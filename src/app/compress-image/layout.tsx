import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://filekit.com";

export const metadata: Metadata = {
  title: "Image Compressor — Compress JPEG, PNG, WebP Online | FileKit",
  description:
    "Free client-side Image Compressor. Compress JPEG, PNG, and static WebP images locally in your browser memory without quality loss or file uploads.",
  alternates: {
    canonical: `${siteUrl}/compress-image`
  },
  openGraph: {
    title: "Image Compressor — Compress JPEG, PNG, WebP Online | FileKit",
    description:
      "Free client-side Image Compressor. Compress JPEG, PNG, and static WebP images locally in your browser memory.",
    url: `${siteUrl}/compress-image`,
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
