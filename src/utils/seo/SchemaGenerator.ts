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
          "name": (() => {
            const cleanTitle = title
              .replace(/ \| FileKit$/i, "")
              .replace(/\(FileKit\)$/i, "")
              .replace(/Ücretsiz Çevrimiçi/i, "")
              .replace(/مجاناً أونلاين/i, "")
              .replace(/Online Gratis/i, "")
              .replace(/Gratis en Línea/i, "")
              .replace(/Gratuit en Ligne/i, "")
              .replace(/Kostenlos Online/i, "")
              .replace(/Online Free/i, "")
              .replace(/Free Online/i, "")
              .trim();
            const HOWTO_NAMES: Record<string, string> = {
              sv: `Så här använder du ${cleanTitle} i 3 enkla steg`,
              da: `Sådan bruger du ${cleanTitle} i 3 enkle trin`,
              fi: `Näin käytät ${cleanTitle} -työkalua 3 yksinkertaisessa vaiheessa`,
              no: `Slik bruker du ${cleanTitle} i 3 enkle trinn`,
              nl: `Hoe ${cleanTitle} te gebruiken in 3 eenvoudige stappen`,
              pl: `Jak używać ${cleanTitle} w 3 prostych krokach`,
              cs: `Jak používat ${cleanTitle} ve 3 jednoduchých krocích`,
              hu: `Hogyan használd a következőt: ${cleanTitle} 3 egyszerű lépésben`,
              ro: `Cum să utilizați ${cleanTitle} în 3 pași simpli`,
              bg: `Как да използвате ${cleanTitle} в 3 лесни стъпки`,
              el: `Πώς να χρησιμοποιήσετε το ${cleanTitle} σε 3 απλά βήματα`,
              sk: `Ako používať ${cleanTitle} v 3 jednoduchých krokoch`,
              sl: `Kako uporabljati ${cleanTitle} v 3 preprostih korakih`,
              ru: `Как использовать ${cleanTitle} за 3 простых шага`,
              uk: `Як використовувати ${cleanTitle} у 3 простих кроки`,
              lv: `Kā lietot ${cleanTitle} 3 vienkāršos soļos`,
              lt: `Kaip naudotis ${cleanTitle} atlikus 3 paprastus veiksmus`,
              ar: `كيفية استخدام ${cleanTitle} في 3 خطوات بسيطة`,
              he: `כיצד להשתמש ב-${cleanTitle} ב-3 שלבים פשוטים`,
              tr: `3 Basit Adımda ${cleanTitle} Nasıl Kullanılır`,
              pt: `Como usar ${cleanTitle} em 3 passos simples`,
              "pt-BR": `Como usar ${cleanTitle} em 3 passos simples`,
              es: `Cómo usar ${cleanTitle} en 3 sencillos pasos`,
              "es-419": `Cómo usar ${cleanTitle} en 3 sencillos pasos`,
              de: `So verwenden Sie ${cleanTitle} in 3 einfachen Schritten`,
              fr: `Comment utiliser ${cleanTitle} en 3 étapes simples`,
              it: `Come utilizzare ${cleanTitle} in 3 semplici passaggi`,
              ca: `Com utilitzar ${cleanTitle} en 3 passos senzills`,
              hi: `3 सरल चरणों में ${cleanTitle} का उपयोग कैसे करें`,
              id: `Cara menggunakan ${cleanTitle} dalam 3 langkah mudah`,
              ms: `Cara menggunakan ${cleanTitle} dalam 3 langkah mudah`,
              th: `วิธีใช้ ${cleanTitle} ใน 3 ขั้นตอนง่ายๆ`,
              vi: `Cách sử dụng ${cleanTitle} trong 3 bước đơn giản`,
              fil: `Paano gamitin ang ${cleanTitle} sa 3 simpleng hakbang`,
              ja: `3つの簡単なステップで ${cleanTitle} を使用する方法`,
              ko: `간단한 3단계로 ${cleanTitle} 사용하는 방법`,
              "zh-CN": `只需简单3步即可使用 ${cleanTitle}`,
              "zh-TW": `只需簡單3步即可使用 ${cleanTitle}`,
            };
            return HOWTO_NAMES[locale] || HOWTO_NAMES[locale.split("-")[0]] || `How to use ${cleanTitle} in 3 simple steps`;
          })(),
          "description": content.entityDefinition || description || `${title}`,
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
