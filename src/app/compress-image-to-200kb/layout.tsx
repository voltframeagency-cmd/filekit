import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Image to 200 KB Online | FileKit",
  description:
    "Compress JPEG, PNG, or WebP images below 200 KB locally in your browser. Fast, private, and no installation required.",
  alternates: {
    canonical: "https://filekit.com/compress-image-to-200kb"
  },
  openGraph: {
    title: "Compress Image to 200 KB Online | FileKit",
    description:
      "Compress JPEG, PNG, or WebP images below 200 KB locally in your browser. Fast, private, and no installation required.",
    url: "https://filekit.com/compress-image-to-200kb",
    type: "website"
  }
};

export default function CompressImageTo200kbLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
