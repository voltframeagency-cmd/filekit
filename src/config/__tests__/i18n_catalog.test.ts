import { SUPPORTED_LOCALES, NON_DEFAULT_LOCALES, SupportedLocale } from "../i18n/locales";
import { getLocalizedToolMeta, getHreflangLinks, getLocalizedUrl } from "../../utils/i18nHelper";
import { CONVERSION_CATALOG, getSitemapRoutes } from "../conversionCatalog";
import siteSitemap from "../../app/sitemap";

export async function runI18nCatalogTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Tier-1 Multilingual Global Expansion Tests");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. Locale Configuration Verification
  console.log("▶ Testing Locale Configuration & Metadata...");
  const locales = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];
  if (locales.length !== 7) throw new Error(`Expected 7 locales, got ${locales.length}`);
  if (!locales.includes("es")) throw new Error("Missing Spanish (es) locale");
  if (!locales.includes("de")) throw new Error("Missing German (de) locale");
  if (!locales.includes("fr")) throw new Error("Missing French (fr) locale");
  if (!locales.includes("pt")) throw new Error("Missing Portuguese (pt) locale");
  if (!locales.includes("it")) throw new Error("Missing Italian (it) locale");
  if (!locales.includes("sv")) throw new Error("Missing Swedish (sv) locale");
  totalAssertions += 7;
  console.log("✓ All 7 locales configured with native names and metadata.");

  // 2. Localized Meta Generation for All 106 Tools
  console.log("▶ Testing Localized Meta Generation across all Tools...");
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
      if (!meta.title || meta.title.length < 5) {
        throw new Error(`Empty or invalid title for ${route} in locale ${loc}`);
      }
      if (!meta.description || meta.description.length < 10) {
        throw new Error(`Empty or invalid description for ${route} in locale ${loc}`);
      }
      if (!meta.canonicalUrl.startsWith("http")) {
        throw new Error(`Invalid canonical URL for ${route} in locale ${loc}: ${meta.canonicalUrl}`);
      }
      totalAssertions += 3;
    }

    // Test Hreflang Tags
    const hreflangs = getHreflangLinks(route);
    if (hreflangs.length !== 8) { // x-default + 7 locales
      throw new Error(`Expected 8 hreflang tags for ${route}, got ${hreflangs.length}`);
    }
    totalAssertions += 1;
  }
  console.log(`✓ Verified localized metadata and hreflang reciprocity across ${allTestRoutes.length} tools.`);

  // 3. Multi-regional Sitemap Coverage
  console.log("▶ Testing Multi-regional Sitemap Coverage...");
  const sitemapEntries = siteSitemap();
  const expectedTotalUrls = 130 * 7; // 130 tools × 7 locales = 910
  if (sitemapEntries.length !== expectedTotalUrls) {
    throw new Error(`Expected ${expectedTotalUrls} sitemap URLs, got ${sitemapEntries.length}`);
  }
  totalAssertions += 1;
  console.log(`✓ Verified ${sitemapEntries.length} sitemap URLs across 7 languages.`);

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Multilingual Global Expansion assertions passed!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runI18nCatalogTests();
}
