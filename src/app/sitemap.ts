import { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const routes = [
    "",
    "/compress-pdf",
    "/compress-image",
    "/compress-image-to-100kb",
    "/compress-image-to-200kb",
    "/compress-image-to-500kb",
    "/compress-image-to-1mb",
    "/compress-image-to-size"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8
  }));
}
