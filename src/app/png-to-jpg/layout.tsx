import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/utils/siteUrl";
import { IMAGE_CONVERSION_ROUTES } from "@/config/imageConversionRoutes";

const cfg = IMAGE_CONVERSION_ROUTES["/png-to-jpg"];

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  alternates: { canonical: buildCanonicalUrl(cfg.slug) },
  robots: { index: true, follow: true }
};

export default function PngToJpgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
