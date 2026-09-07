/**
 * SchemaGenerator.ts
 * 
 * Generates unified Schema.org JSON-LD structured data graph combining:
 * 1. WebApplication / SoftwareApplication
 * 2. HowTo (3-Step Procedural Schema for Google Rich Cards)
 * 3. FAQPage (High-Intent Q&As for AEO & Google AI Overviews)
 * 4. BreadcrumbList (Rich snippet navigation breadcrumbs)
 * 5. Organization (Publisher trust seal)
 */

import { buildCanonicalUrl } from "../siteUrl";
import { getToolSeoContent } from "@/config/seo/toolFaqs";

export interface UnifiedSchemaOptions {
  slug: string;
  title: string;
  description: string;
  locale?: string;
}

export class SchemaGenerator {
  static generateFullStructuredData({
    slug,
    title,
    description,
    locale = "en",
  }: UnifiedSchemaOptions) {
    const canonicalUrl = buildCanonicalUrl(slug);
    const content = getToolSeoContent(slug, title, locale);

    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        // 0. WebSite Entity
        {
          "@type": "WebSite",
          "@id": "https://filekit.co/#website",
          "url": "https://filekit.co",
          "name": "FileKit",
          "publisher": {
            "@id": "https://filekit.co/#organization"
          }
        },

        // 1. Organization / Brand Trust Entity
        {
          "@type": "Organization",
          "@id": "https://filekit.co/#organization",
          "name": "FileKit",
          "url": "https://filekit.co",
          "logo": {
            "@type": "ImageObject",
            "url": "https://filekit.co/brand-assets/filekit-logo.png",
            "width": "512",
            "height": "512"
          },
          "sameAs": [
            "https://twitter.com/filekit_app",
            "https://github.com/filekit"
          ]
        },

        // 2. WebApplication & SoftwareApplication Entity
        {
          "@type": ["WebApplication", "SoftwareApplication"],
          "@id": `${canonicalUrl}#software`,
          "name": `${title} – FileKit`,
          "url": canonicalUrl,
          "description": description || content.entityDefinition,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Supports Chrome, Firefox, Safari, Edge.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1284",
            "bestRating": "5",
            "worstRating": "1"
          },
          "publisher": {
            "@id": "https://filekit.co/#organization"
          }
        },

        // 3. HowTo 3-Step Schema (For Google AI Overviews & Rich Snippets)
        {
          "@type": "HowTo",
          "@id": `${canonicalUrl}#howto`,
          "name": locale === "ko" || locale === "kr"
            ? `${title} 사용 방법`
            : locale === "zh-CN" || (locale as string).startsWith("zh")
            ? `${title} 使用指南`
            : locale === "ja"
            ? `${title} の使い方`
            : locale === "de"
            ? `So verwenden Sie ${title}`
            : locale === "fr"
            ? `Comment utiliser ${title}`
            : locale === "es" || locale === "es-419"
            ? `Cómo usar ${title}`
            : `How to use ${title}`,
          "description": locale === "ko" || locale === "kr"
            ? `${title} 무료 온라인 도구를 사용하여 파일을 변환하고 처리하는 단계별 방법 안내.`
            : locale === "zh-CN" || (locale as string).startsWith("zh")
            ? `使用 ${title} 在线免费转换和处理文件的详细步骤。`
            : locale === "ja"
            ? `${title} 無料オンラインツールを使用してファイルを変換・処理するステップバイステップの手順。`
            : `Step-by-step instructions to convert and process files with ${title} online for free.`,
          "step": content.howToSteps.map((step, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": step.title,
            "text": step.description,
            "url": `${canonicalUrl}#step-${idx + 1}`
          }))
        },

        // 4. FAQPage Schema (For Voice Search, Perplexity, and AI Overviews)
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "mainEntity": content.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },

        // 5. BreadcrumbList Schema (For Clean Breadcrumbs in Search Results)
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": locale === "ko" || locale === "kr" ? "홈" : locale === "zh-TW" || (locale as string).toLowerCase() === "zh-tw" ? "首頁" : locale === "zh-CN" || (locale as string).startsWith("zh") ? "首页" : locale === "ja" ? "ホーム" : "Home",
              "item": "https://filekit.co"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": content.category,
              "item": `https://filekit.co/#${content.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": title,
              "item": canonicalUrl
            }
          ]
        }
      ]
    };

    return schemaGraph;
  }
}
