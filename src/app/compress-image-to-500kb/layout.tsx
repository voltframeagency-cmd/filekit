import { Metadata } from "next";
import { EXACT_IMAGE_ROUTES } from "@/config/exactImageRoutes";

const cfg = EXACT_IMAGE_ROUTES["500kb"];
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://filekit.com";

export const metadata: Metadata = {
  title: cfg.title,
  description: cfg.description,
  alternates: {
    canonical: `${siteUrl}/${cfg.slug}`
  },
  openGraph: {
    title: cfg.title,
    description: cfg.description,
    url: `${siteUrl}/${cfg.slug}`,
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
