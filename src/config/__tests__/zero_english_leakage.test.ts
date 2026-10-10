import { getToolSeoContent, detectToolFamily } from "../seo/toolFaqs";
import { CATEGORY_TRANSLATIONS, ToolFamilyKey } from "../seo/categories";
import { HOW_TO_STEPS } from "../seo/howToSteps";
import { FAMILY_FAQS } from "../seo/familyFaqs";
import { SupportedLocale, NON_DEFAULT_LOCALES } from "../i18n/locales";

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

const ENGLISH_PATTERNS = [
  "Drop your PDF here",
  "Drop your image here",
  "Select PowerPoint Presentation",
  "Select Word Document",
  "Select Excel Spreadsheet",
  "Processed locally in your browser. Your file is never uploaded.",
  "Your files are processed locally within your browser sandbox",
  "without requiring Autodesk software",
  "eliminating the need for expensive software licenses",
  "directly in your browser using client-side vector parsing",
  "converts professional Adobe Photoshop",
  "Instant in-browser processing",
  "Download your result",
  "Select or drop file"
];

let completenessErrors = 0;
let completenessChecks = 0;
let leakErrors = 0;
let leakChecks = 0;

console.log("=== STAGE 1: SEO DICTIONARY COMPLETENESS AUDIT (39 LOCALES × 7 FAMILIES) ===");

for (const loc of LOCALES) {
  for (const [familyKey, slug] of Object.entries(SAMPLE_SLUGS) as [ToolFamilyKey, string][]) {
    completenessChecks++;
    const content = getToolSeoContent(slug, "Test Tool", loc);

    // 1. Verify category exists and is not empty
    if (!content.category || content.category.trim() === "") {
      console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Empty category`);
      completenessErrors++;
    }

    // 2. Verify entity definition exists
    if (!content.entityDefinition || content.entityDefinition.trim() === "") {
      console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Empty entity definition`);
      completenessErrors++;
    }

    // 3. Verify HowTo steps exist (exactly 3 steps)
    if (!content.howToSteps || content.howToSteps.length !== 3) {
      console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Invalid howToSteps count: ${content.howToSteps?.length}`);
      completenessErrors++;
    } else {
      for (let i = 0; i < 3; i++) {
        if (!content.howToSteps[i].title?.trim() || !content.howToSteps[i].description?.trim()) {
          console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Empty HowTo step ${i + 1}`);
          completenessErrors++;
        }
      }
    }

    // 4. Verify FAQs exist (at least 3 FAQs per family)
    if (!content.faqs || content.faqs.length < 3) {
      console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Insufficient FAQs: ${content.faqs?.length}`);
      completenessErrors++;
    } else {
      for (let j = 0; j < content.faqs.length; j++) {
        if (!content.faqs[j].question?.trim() || !content.faqs[j].answer?.trim()) {
          console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Empty FAQ ${j + 1}`);
          completenessErrors++;
        }
      }
    }

    // 5. For non-English locales, ensure FAQs are present in that specific locale dictionary
    if (loc !== "en") {
      const dictFaqs = FAMILY_FAQS[familyKey]?.[loc];
      if (!dictFaqs || dictFaqs.length === 0) {
        console.error(`❌ [COMPLETENESS][${loc}][${familyKey}] Missing direct FAQ entry in FAMILY_FAQS`);
        completenessErrors++;
      }
    }
  }
}

console.log(`Stage 1 Complete: ${completenessChecks} tests executed. Completeness errors: ${completenessErrors}.`);

console.log("\n=== STAGE 2: STRICT LANGUAGE VERIFICATION & ENGLISH-LEAK PROOF (38 NON-ENGLISH LOCALES) ===");

for (const loc of NON_DEFAULT_LOCALES) {
  for (const [familyKey, slug] of Object.entries(SAMPLE_SLUGS) as [ToolFamilyKey, string][]) {
    leakChecks++;
    const content = getToolSeoContent(slug, "Test Tool", loc);
    const enContent = getToolSeoContent(slug, "Test Tool", "en");

    // 1. Verify category is localized (not identical to English)
    if (content.category.trim() === enContent.category.trim()) {
      console.error(`❌ [LEAK][${loc}][${familyKey}] Category is untranslated English: "${content.category}"`);
      leakErrors++;
    }

    // 2. Verify entity definition is localized
    if (content.entityDefinition.trim() === enContent.entityDefinition.trim()) {
      console.error(`❌ [LEAK][${loc}][${familyKey}] Entity definition is identical to English`);
      leakErrors++;
    }

    // 3. Verify HowTo steps are localized
    for (let i = 0; i < 3; i++) {
      if (content.howToSteps[i]?.title.trim() === enContent.howToSteps[i]?.title.trim()) {
        console.error(`❌ [LEAK][${loc}][${familyKey}] HowTo title step ${i + 1} is identical to English`);
        leakErrors++;
      }
      if (content.howToSteps[i]?.description.trim() === enContent.howToSteps[i]?.description.trim()) {
        console.error(`❌ [LEAK][${loc}][${familyKey}] HowTo description step ${i + 1} is identical to English`);
        leakErrors++;
      }
    }

    // 4. Verify FAQs are localized
    for (let j = 0; j < Math.min(content.faqs.length, enContent.faqs.length); j++) {
      if (content.faqs[j]?.question.trim() === enContent.faqs[j]?.question.trim()) {
        console.error(`❌ [LEAK][${loc}][${familyKey}] FAQ question ${j + 1} is identical to English: "${content.faqs[j]?.question}"`);
        leakErrors++;
      }
      if (content.faqs[j]?.answer.trim() === enContent.faqs[j]?.answer.trim()) {
        console.error(`❌ [LEAK][${loc}][${familyKey}] FAQ answer ${j + 1} is identical to English`);
        leakErrors++;
      }
    }

    // 5. Verify no English leak patterns in non-English rendered content
    const combinedText = [
      content.category,
      content.entityDefinition,
      ...content.howToSteps.map(s => `${s.title} ${s.description}`),
      ...content.faqs.map(f => `${f.question} ${f.answer}`)
    ].join(" ");

    for (const pattern of ENGLISH_PATTERNS) {
      if (combinedText.toLowerCase().includes(pattern.toLowerCase())) {
        console.error(`❌ [LEAK][${loc}][${familyKey}] Found English leak phrase "${pattern}"`);
        leakErrors++;
      }
    }
  }
}

console.log(`Stage 2 Complete: ${leakChecks} tests executed. English leak errors: ${leakErrors}.`);

if (completenessErrors > 0 || leakErrors > 0) {
  console.error(`\n❌ REGRESSION GATE FAILED: ${completenessErrors} completeness errors, ${leakErrors} English leak errors.`);
  process.exit(1);
} else {
  console.log(`\n✅ 100% REGRESSION GATE PASSED: Verified dictionary completeness (${completenessChecks} checks) AND verified zero English leakage (${leakChecks} checks) across all 39 locales.`);
  process.exit(0);
}
