import { Metadata } from "next";
import { EXACT_IMAGE_ROUTES } from "@/config/exactImageRoutes";
import { buildCanonicalUrl } from "@/utils/siteUrl";

const cfg = EXACT_IMAGE_ROUTES["200kb"];

export const metadata: Metadata = {
  title: cfg.title,
  description: cfg.description,
  alternates: {
    canonical: buildCanonicalUrl(`/${cfg.slug}`)
  },
  openGraph: {
    title: cfg.title,
    description: cfg.description,
    url: buildCanonicalUrl(`/${cfg.slug}`),
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
