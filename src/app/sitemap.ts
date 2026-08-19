import { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/siteUrl";
import { getSitemapRoutes as getCatalogSitemapRoutes } from "@/config/conversionCatalog";
import { NON_DEFAULT_LOCALES } from "@/config/i18n/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const coreAndCompressorRoutes = [
    "",
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

  // Combine core routes and catalog indexable conversion routes
  const baseCanonicalRoutes = [...coreAndCompressorRoutes, ...conversionRoutes];

  const entries: MetadataRoute.Sitemap = [];

  // 1. English Canonical URLs
  for (const route of baseCanonicalRoutes) {
    const alternates: Record<string, string> = {
      en: `${baseUrl}${route}`,
      "x-default": `${baseUrl}${route}`
    };

    for (const loc of NON_DEFAULT_LOCALES) {
      alternates[loc] = `${baseUrl}/${loc}${route}`;
    }

    entries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: alternates
      }
    });
  }

  // 2. Localized URLs for each non-default locale (es, de, fr, pt, it, sv)
  for (const loc of NON_DEFAULT_LOCALES) {
    for (const route of baseCanonicalRoutes) {
      const alternates: Record<string, string> = {
        en: `${baseUrl}${route}`,
        "x-default": `${baseUrl}${route}`
      };

      for (const otherLoc of NON_DEFAULT_LOCALES) {
        alternates[otherLoc] = `${baseUrl}/${otherLoc}${route}`;
      }

      entries.push({
        url: `${baseUrl}/${loc}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 0.9 : 0.75,
        alternates: {
          languages: alternates
        }
      });
    }
  }

  return entries;
}
