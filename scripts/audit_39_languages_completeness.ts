import { SUPPORTED_LOCALES, NON_DEFAULT_LOCALES, SupportedLocale } from "../src/config/i18n/locales";
import { CONVERSION_CATALOG, getSitemapRoutes } from "../src/config/conversionCatalog";
import { getLocalizedToolMeta, getHreflangLinks } from "../src/utils/i18nHelper";
import { getToolSeoContent } from "../src/config/seo/toolFaqs";
import fs from "fs";
import path from "path";

async function auditAllLanguages() {
  console.log("==================================================");
  console.log("FILEKIT 39-LANGUAGE & 130-TOOL GLOBAL AUDIT ENGINE");
  console.log("==================================================");

  const indexableTools = Object.values(CONVERSION_CATALOG).filter(
    (t) => t.indexabilityStatus === "INDEXABLE" && t.implementationStatus === "PRODUCTION_FROZEN"
  );

  const allLocales = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];
  console.log(`Total Locales: ${allLocales.length}`);
  console.log(`Total Indexable Tools: ${indexableTools.length}`);
  console.log(`Total Route Combinations: ${allLocales.length * indexableTools.length} pages\n`);

  const report: {
    locale: string;
    missingMetaTitles: string[];
    missingMetaDescriptions: string[];
    untranslatedFaqCategories: string[];
    faqFallbacksToEnglish: string[];
  }[] = [];

  for (const loc of allLocales) {
    const locReport = {
      locale: loc,
      missingMetaTitles: [] as string[],
      missingMetaDescriptions: [] as string[],
      untranslatedFaqCategories: [] as string[],
      faqFallbacksToEnglish: [] as string[],
    };

    for (const tool of indexableTools) {
      // 1. Meta Audit
      const meta = getLocalizedToolMeta(tool.slug, loc);
      if (!meta.title || meta.title.trim() === "") {
        locReport.missingMetaTitles.push(tool.slug);
      }
      if (!meta.description || meta.description.trim() === "") {
        locReport.missingMetaDescriptions.push(tool.slug);
      }

      // 2. SEO / FAQ Content Audit
      const seoContent = getToolSeoContent(tool.slug, meta.title, loc);
      if (loc !== "en") {
        const enSeoContent = getToolSeoContent(tool.slug, meta.title, "en");
        if (seoContent.category === enSeoContent.category && !["ca", "id", "ms"].includes(loc)) {
          locReport.untranslatedFaqCategories.push(tool.slug);
        }
        // Check if FAQs are identical to English
        if (seoContent.faqs[0]?.question === enSeoContent.faqs[0]?.question) {
          locReport.faqFallbacksToEnglish.push(tool.slug);
        }
      }
    }

    report.push(locReport);
  }

  // Summary Table
  console.log("--------------------------------------------------------------------------------");
  console.log("| Locale | Meta Titles OK | Meta Descs OK | Localized Category | Localized FAQs |");
  console.log("--------------------------------------------------------------------------------");
  let totalFaqGaps = 0;
  for (const r of report) {
    const titleOk = indexableTools.length - r.missingMetaTitles.length;
    const descOk = indexableTools.length - r.missingMetaDescriptions.length;
    const catOk = indexableTools.length - r.untranslatedFaqCategories.length;
    const faqOk = indexableTools.length - r.faqFallbacksToEnglish.length;
    if (r.faqFallbacksToEnglish.length > 0) {
      totalFaqGaps += r.faqFallbacksToEnglish.length;
    }
    console.log(
      `| ${r.locale.padEnd(6)} | ${String(titleOk).padEnd(14)} | ${String(descOk).padEnd(13)} | ${String(catOk).padEnd(18)} | ${String(faqOk).padEnd(14)} |`
    );
  }
  console.log("--------------------------------------------------------------------------------");
  console.log(`Total FAQ Gaps requiring full native translation matrices: ${totalFaqGaps}`);

  // Write detailed JSON audit log
  fs.writeFileSync(
    path.resolve("audit_languages_output.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
  console.log("\nDetailed audit report saved to audit_languages_output.json");
}

auditAllLanguages().catch(console.error);
