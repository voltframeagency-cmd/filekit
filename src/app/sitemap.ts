import { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/siteUrl";
import { getSitemapRoutes as getCatalogSitemapRoutes } from "@/config/conversionCatalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const coreAndCompressorRoutes = [
    "",
    "/sv",
    "/compress-pdf",
    "/compress-pdf-to-size",
    "/compress-pdf-to-2mb",
    "/compress-image",
    "/compress-image-to-size",
    "/compress-image-to-100kb",
    "/compress-image-to-200kb",
    "/compress-image-to-500kb",
    "/compress-image-to-1mb"
  ];

  const conversionRoutes = getCatalogSitemapRoutes();

  // Combine core routes and catalog indexable conversion routes (guaranteeing 0 planned/alias routes)
  const allRoutes = [...coreAndCompressorRoutes, ...conversionRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8
  }));
}
