import { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dev/"]
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/"
      }
    ],
    sitemap: `${siteUrl.origin}/sitemap.xml`
  };
}
