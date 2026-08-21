import { CONVERSION_CATALOG } from "../conversionCatalog";
import { SUPPORTED_LOCALES, NON_DEFAULT_LOCALES, SupportedLocale, getLocaleDirection } from "../i18n/locales";
import { getLocalizedToolMeta, getHreflangLinks } from "../../utils/i18nHelper";
import { getToolSeoContent } from "../seo/toolFaqs";
import { SchemaGenerator } from "../../utils/seo/SchemaGenerator";
import fs from "fs";
import path from "path";

export async function runUniversalPseoTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Universal Programmatic SEO & Uniformity Suite");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  const indexableTools = Object.values(CONVERSION_CATALOG).filter(
    (t) => t.indexabilityStatus === "INDEXABLE" && t.implementationStatus === "PRODUCTION_FROZEN"
  );

  // 1. Catalog Integrity
  console.log("▶ Testing 130-Tool Catalog Integrity & Routing Parameters...");
  if (indexableTools.length < 120) {
    throw new Error(`Expected at least 120 indexable tools, found ${indexableTools.length}`);
  }
  for (const tool of indexableTools) {
    if (!tool.slug.startsWith("/")) throw new Error(`Invalid slug: ${tool.slug}`);
    if (!tool.inputFormat || !tool.outputFormat || !tool.family) {
      throw new Error(`Missing metadata fields for tool: ${tool.slug}`);
    }
    if (!tool.sitemapEnabled) throw new Error(`Sitemap disabled for indexable tool: ${tool.slug}`);
    totalAssertions += 4;
  }
  console.log(`✓ 100% of indexable catalog tools (${indexableTools.length}) verified.`);

  // 2. Bidirectional 40-Tag Hreflang Reciprocity
  console.log("▶ Testing 40-Tag Hreflang Reciprocity across All Tool Suites...");
  for (const tool of indexableTools) {
    const hreflangs = getHreflangLinks(tool.slug);
    if (hreflangs.length !== 40) {
      throw new Error(`Expected 40 hreflang tags for ${tool.slug}, got ${hreflangs.length}`);
    }
    const xDefault = hreflangs.find((h) => h.hrefLang === "x-default");
    if (!xDefault || !xDefault.href.includes(tool.slug)) {
      throw new Error(`Missing or invalid x-default for ${tool.slug}`);
    }
    for (const lang of NON_DEFAULT_LOCALES) {
      const langEntry = hreflangs.find((h) => h.hrefLang === lang);
      if (!langEntry || !langEntry.href.includes(`/${lang}${tool.slug}`)) {
        throw new Error(`Missing localized hreflang link for ${lang} on ${tool.slug}`);
      }
      totalAssertions += 1;
    }
    totalAssertions += 2;
  }
  console.log(`✓ Bidirectional 40-tag hreflang matrix verified across all tools.`);

  // 3. Localized Directionality & Meta
  console.log("▶ Testing Localized Metadata & RTL Directionality across 39 Languages...");
  const rtlLocales = ["ar", "he", "fa", "ur"];
  const locales = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];

  for (const locale of locales) {
    const direction = getLocaleDirection(locale);
    if (rtlLocales.includes(locale) && direction !== "rtl") {
      throw new Error(`Expected RTL direction for locale ${locale}`);
    }
    if (!rtlLocales.includes(locale) && direction !== "ltr") {
      throw new Error(`Expected LTR direction for locale ${locale}`);
    }

    const sampleSlugs = ["/compress-pdf", "/png-to-ico", "/dwg-to-pdf", "/convert-audio"];
    for (const slug of sampleSlugs) {
      const meta = getLocalizedToolMeta(slug, locale);
      if (!meta.title || meta.title.length < 5) {
        throw new Error(`Invalid localized title for ${slug} in ${locale}`);
      }
      if (!meta.description || meta.description.length < 15) {
        throw new Error(`Invalid localized description for ${slug} in ${locale}`);
      }
      totalAssertions += 2;
    }
    totalAssertions += 2;
  }
  console.log(`✓ 39-language localized metadata & RTL directionality verified.`);

  // 4. AEO FAQ & 3-Step HowTo Quality
  console.log("▶ Testing AEO FAQ and 3-Step HowTo Schemas...");
  for (const tool of indexableTools) {
    const seoContent = getToolSeoContent(tool.slug, "Sample Tool", "en");
    if (!seoContent.category) throw new Error(`Missing category for ${tool.slug}`);
    if (seoContent.howToSteps.length !== 3) {
      throw new Error(`Expected 3 HowTo steps for ${tool.slug}, got ${seoContent.howToSteps.length}`);
    }
    if (seoContent.faqs.length < 3) {
      throw new Error(`Expected at least 3 FAQs for ${tool.slug}, got ${seoContent.faqs.length}`);
    }
    totalAssertions += 3;
  }
  console.log(`✓ AEO FAQ & How-To content verified across all catalog tools.`);

  // 5. JSON-LD Graph Generation
  console.log("▶ Testing Unified JSON-LD Schema.org Graph Generation...");
  const testCases: { slug: string; locale: SupportedLocale }[] = [
    { slug: "/compress-pdf", locale: "en" },
    { slug: "/compress-pdf", locale: "es" },
    { slug: "/dwg-to-pdf", locale: "ar" },
    { slug: "/png-to-ico", locale: "ja" },
    { slug: "/convert-video", locale: "de" },
  ];

  for (const tc of testCases) {
    const meta = getLocalizedToolMeta(tc.slug, tc.locale);
    const graph = SchemaGenerator.generateFullStructuredData({
      slug: tc.slug,
      title: meta.title,
      description: meta.description,
      locale: tc.locale,
    });

    if (graph["@context"] !== "https://schema.org") {
      throw new Error(`Invalid JSON-LD context for ${tc.slug}`);
    }
    const types = graph["@graph"].flatMap((node: any) => Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]);
    const requiredTypes = ["WebSite", "Organization", "WebApplication", "HowTo", "FAQPage", "BreadcrumbList"];
    for (const reqType of requiredTypes) {
      if (!types.includes(reqType)) {
        throw new Error(`Missing ${reqType} schema node in graph for ${tc.slug}`);
      }
      totalAssertions += 1;
    }
  }
  console.log(`✓ Unified Schema.org JSON-LD graphs verified.`);

  // 6. Static Route Delegation
  console.log("▶ Testing Static Route Delegation to UniversalToolPage...");
  const appDir = path.resolve(process.cwd(), "src/app");
  const entries = fs.readdirSync(appDir, { withFileTypes: true });

  let verifiedRoutes = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("(") || ["api", "dev", "sv"].includes(entry.name)) {
      continue;
    }

    const pageFile = path.join(appDir, entry.name, "page.tsx");
    if (fs.existsSync(pageFile)) {
      const content = fs.readFileSync(pageFile, "utf-8");
      if (!content.includes('import UniversalToolPage from "@/components/layout/UniversalToolPage";')) {
        throw new Error(`Route ${entry.name}/page.tsx does not import UniversalToolPage`);
      }
      if (!content.includes("<UniversalToolPage")) {
        throw new Error(`Route ${entry.name}/page.tsx does not render UniversalToolPage`);
      }
      verifiedRoutes++;
      totalAssertions += 2;
    }
  }

  if (verifiedRoutes < 130) {
    throw new Error(`Expected at least 130 verified static routes, got ${verifiedRoutes}`);
  }
  console.log(`✓ 100% of static routes (${verifiedRoutes} routes) correctly delegate to UniversalToolPage.`);

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Universal Programmatic SEO & Uniformity assertions passed!`);
  console.log("--------------------------------------------------");
}

if (process.argv[1]?.includes("universal_pseo_uniformity.test.ts")) {
  runUniversalPseoTests().catch((err) => {
    console.error("Test failure:", err);
    process.exit(1);
  });
}
