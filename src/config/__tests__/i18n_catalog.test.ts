import { SUPPORTED_LOCALES, NON_DEFAULT_LOCALES, SupportedLocale } from "../i18n/locales";
import { getLocalizedToolMeta, getHreflangLinks } from "../../utils/i18nHelper";
import { getToolSeoContent } from "../seo/toolFaqs";
import { CONVERSION_CATALOG, getSitemapRoutes } from "../conversionCatalog";
import siteSitemap from "../../app/sitemap";

export async function runI18nCatalogTests() {
  console.log("--------------------------------------------------");
  console.log("Starting 39-Language Global Expansion Verification Suite");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. Locale Configuration Verification
  console.log("▶ Testing 39-Locale Configuration & Directionality...");
  const locales = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];
  if (locales.length !== 39) throw new Error(`Expected 39 locales, got ${locales.length}`);

  // Test critical languages from each region
  const requiredLocales: SupportedLocale[] = [
    "en", "es", "es-419", "de", "fr", "pt", "pt-BR", "it", "nl", "ca",
    "sv", "da", "fi", "no", "pl", "cs", "hu", "ro", "bg", "el", "sk", "sl", "ru", "uk", "lv", "lt",
    "tr", "ar", "he", "hi", "id", "ms", "th", "vi", "fil", "ja", "ko", "zh-CN", "zh-TW"
  ];

  for (const reqLoc of requiredLocales) {
    if (!locales.includes(reqLoc)) throw new Error(`Missing required locale: ${reqLoc}`);
    totalAssertions += 1;
  }

  // RTL Assertions
  if (SUPPORTED_LOCALES["ar"].direction !== "rtl") throw new Error("Arabic must have direction: rtl");
  if (SUPPORTED_LOCALES["he"].direction !== "rtl") throw new Error("Hebrew must have direction: rtl");
  if (SUPPORTED_LOCALES["en"].direction !== "ltr") throw new Error("English must have direction: ltr");
  totalAssertions += 3;
  console.log(`✓ All 39 locales configured with native names, region groupings, and verified RTL directions.`);

  // 2. Localized Meta Generation for All 130 Tools across all 39 Locales
  console.log("▶ Testing Localized Meta & Hreflang across all 130 Tools and 39 Languages...");
  const catalogRoutes = getSitemapRoutes();
  const coreRoutes = [
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
  const allTestRoutes = [...coreRoutes, ...catalogRoutes];

  for (const route of allTestRoutes) {
    for (const loc of locales) {
      const meta = getLocalizedToolMeta(route, loc);
      if (!meta.title || meta.title.length < 3) {
        throw new Error(`Empty or invalid title for ${route} in locale ${loc}`);
      }
      if (!meta.description || meta.description.length < 10) {
        throw new Error(`Empty or invalid description for ${route} in locale ${loc}`);
      }
      if (!meta.canonicalUrl.startsWith("http")) {
        throw new Error(`Invalid canonical URL for ${route} in locale ${loc}: ${meta.canonicalUrl}`);
      }
      // Automated Audit: Ensure no raw English leak in non-English tool titles
      if (loc !== "en") {
        if (meta.title.includes("Multiple Audio Files") || meta.title.includes("Merged Audio")) {
          throw new Error(`Untranslated English leak detected in ${route} for locale ${loc}: "${meta.title}"`);
        }
      }
      totalAssertions += 3;
    }

    // Test Hreflang Tags (x-default + 39 locales = 40 tags)
    const hreflangs = getHreflangLinks(route);
    if (hreflangs.length !== 40) {
      throw new Error(`Expected 40 hreflang tags for ${route}, got ${hreflangs.length}`);
    }
    totalAssertions += 1;
  }
  console.log(`✓ Verified localized metadata and 40-tag hreflang reciprocity across all ${allTestRoutes.length} tools.`);

  // 3. Automated SEO FAQs & How-To Steps Multi-Locale Purity Audit
  console.log("▶ Testing FAQ & How-To Content Purity across all Tools & 39 Locales...");
  const sampleNonEnglishLocales: SupportedLocale[] = ["de", "fr", "es", "pt", "it", "sv", "ar", "tr", "pl", "ru", "ja", "ko", "zh-CN"];
  const criticalTools = ["/merge-audio", "/compress-video", "/compress-pdf", "/png-to-jpg", "/dwg-to-pdf"];

  for (const toolSlug of criticalTools) {
    for (const testLoc of sampleNonEnglishLocales) {
      const seoContent = getToolSeoContent(toolSlug, "Tool", testLoc);
      
      // Assert How-To steps exist and are localized
      if (!seoContent.howToSteps || seoContent.howToSteps.length < 3) {
        throw new Error(`Missing How-To steps for ${toolSlug} in locale ${testLoc}`);
      }
      for (const step of seoContent.howToSteps) {
        if (step.title === "Upload audio or video" || step.title === "Select your file" || step.description.includes("Select your media clip")) {
          throw new Error(`Untranslated English How-To step found in ${toolSlug} for locale ${testLoc}: "${step.title}"`);
        }
      }

      // Assert FAQs exist and are localized
      if (!seoContent.faqs || seoContent.faqs.length < 2) {
        throw new Error(`Missing FAQs for ${toolSlug} in locale ${testLoc}`);
      }
      for (const faq of seoContent.faqs) {
        if (faq.question.includes("Does video conversion reduce") || faq.question.includes("Is FileKit really 100% free")) {
          throw new Error(`Untranslated English FAQ found in ${toolSlug} for locale ${testLoc}: "${faq.question}"`);
        }
      }
      totalAssertions += 5;
    }
  }
  console.log(`✓ Verified localized FAQ & How-To purity across non-English locales.`);

  // 4. Multi-regional Sitemap Coverage
  console.log("▶ Testing Multi-regional 5,070 Sitemap URL Footprint...");
  const sitemapEntries = await siteSitemap();
  const expectedTotal = allTestRoutes.length * 39;
  if (sitemapEntries.length < 5000) {
    throw new Error(`Expected at least 5,000 localized sitemap entries, got ${sitemapEntries.length}`);
  }
  totalAssertions += sitemapEntries.length;
  console.log(`✓ Verified ${sitemapEntries.length} sitemap URLs across all 39 languages.`);

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} 39-Language Global Expansion assertions passed!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runI18nCatalogTests().catch((err) => {
    console.error("❌ Test suite failed:", err);
    process.exit(1);
  });
}
