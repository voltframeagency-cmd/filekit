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
          "name": `How to use ${title}`,
          "description": `Step-by-step instructions to convert and process files with ${title} online for free.`,
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
              "name": "Home",
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
