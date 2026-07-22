import { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const routes = [
    "",
    "/compress-pdf",
    "/compress-pdf-to-size",
    "/compress-pdf-to-2mb",
    "/compress-image",
    "/compress-image-to-size",
    "/compress-image-to-100kb",
    "/compress-image-to-200kb",
    "/compress-image-to-500kb",
    "/compress-image-to-1mb",
    "/convert-image",
    "/jpg-to-png",
    "/png-to-jpg",
    "/jpg-to-webp",
    "/png-to-webp",
    "/webp-to-jpg",
    "/webp-to-png",
    "/pdf-to-image",
    "/pdf-to-jpg",
    "/pdf-to-png"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8
  }));
}
