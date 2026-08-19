import { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dev/", "/api/internal/"]
      },
      // Explicit AI Answer Engines & LLM RAG Crawlers (AEO / AIO / GEO)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          "Meta-ExternalAgent",
          "OAI-SearchBot",
          "Bingbot"
        ],
        allow: "/"
      }
    ],
    sitemap: `${siteUrl.origin}/sitemap.xml`
  };
}
