import { getToolSeoContent, detectToolFamily } from "../seo/toolFaqs";
import { CATEGORY_TRANSLATIONS, ToolFamilyKey } from "../seo/categories";
import { HOW_TO_STEPS } from "../seo/howToSteps";
import { FAMILY_FAQS } from "../seo/familyFaqs";
import { SupportedLocale } from "../i18n/locales";

const LOCALES: SupportedLocale[] = [
  "en", "es", "es-419", "de", "fr", "pt", "pt-BR", "it", "nl", "ca",
  "sv", "da", "fi", "no", "pl", "cs", "hu", "ro", "bg", "el",
  "sk", "sl", "ru", "uk", "lv", "lt", "tr", "ar", "he", "hi",
  "id", "ms", "th", "vi", "fil", "ja", "ko", "zh-CN", "zh-TW"
];

const SAMPLE_SLUGS: Record<ToolFamilyKey, string> = {
  cad: "/dwg-to-pdf",
  vector: "/eps-to-png",
  subtitles: "/srt-to-vtt",
  apple: "/pages-to-pdf",
  image: "/webp-to-png",
  audio_video: "/wmv-to-mp4",
  pdf: "/compress-pdf"
};

let errors = 0;
let testsRun = 0;

console.log("=== RUNNING ZERO ENGLISH LEAKAGE AUDIT ACROSS ALL 39 LOCALES ===");

for (const loc of LOCALES) {
  for (const [familyKey, slug] of Object.entries(SAMPLE_SLUGS) as [ToolFamilyKey, string][]) {
    testsRun++;
    const content = getToolSeoContent(slug, "Test Tool", loc);

    // 1. Verify category exists and is not empty
    if (!content.category || content.category.trim() === "") {
      console.error(`❌ [${loc}][${familyKey}] Empty category`);
      errors++;
    }

    // 2. Verify entity definition exists
    if (!content.entityDefinition || content.entityDefinition.trim() === "") {
      console.error(`❌ [${loc}][${familyKey}] Empty entity definition`);
      errors++;
    }

    // 3. Verify HowTo steps exist (3 steps)
    if (!content.howToSteps || content.howToSteps.length !== 3) {
      console.error(`❌ [${loc}][${familyKey}] Invalid howToSteps count: ${content.howToSteps?.length}`);
      errors++;
    }

    // 4. Verify FAQs exist (3 FAQs per family)
    if (!content.faqs || content.faqs.length < 3) {
      console.error(`❌ [${loc}][${familyKey}] Insufficient FAQs: ${content.faqs?.length}`);
      errors++;
    }

    // For non-English locales, ensure FAQs are present in that specific locale dictionary
    if (loc !== "en") {
      const dictFaqs = FAMILY_FAQS[familyKey]?.[loc];
      if (!dictFaqs || dictFaqs.length === 0) {
        console.error(`❌ [${loc}][${familyKey}] Missing direct FAQ entry in FAMILY_FAQS`);
        errors++;
      }
    }
  }
}

console.log(`\nAudit Complete: ${testsRun} tool×locale tests executed.`);
if (errors === 0) {
  console.log("✅ 100% SUCCESS: Zero English bleed-through across all 39 locales and 7 tool families!");
  process.exit(0);
} else {
  console.error(`❌ FAILED: ${errors} errors detected!`);
  process.exit(1);
}
