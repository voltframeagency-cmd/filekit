import { PDF_COMPRESSION_I18N } from "../src/components/pdf-tools/pdfCompressionTranslations.ts";
import { SUPPORTED_LOCALES } from "../src/config/i18n/locales.ts";

const REQUIRED_KEYS = [
  "dropPdf",
  "supportsPdf",
  "privacyPdf",
  "originalSize",
  "chooseAnother",
  "compressing",
  "noBeneficial",
  "targetNotMet",
  "alreadyBelow",
  "compressedOk",
  "noReductionDesc",
  "original",
  "newSize",
  "pages",
  "reduction",
  "processingLocal",
  "downloadOriginal",
  "downloadBest",
  "downloadCompressed",
  "adjustSettings",
  "settingsTitle",
  "compressionGoal",
  "betterQuality",
  "betterQualityDesc",
  "balanced",
  "balancedDesc",
  "smallerFile",
  "smallerFileDesc",
  "targetFileSize",
  "quickTargets",
  "targetOutcome",
  "below2mb",
  "targetOutcomeDesc",
  "compressBtn",
  "recompressBtn",
  "compressingBtn",
  "errInvalidPdf",
  "errInvalidNumber",
  "errDecimalPlaces",
  "errMinSize",
  "errMaxSize",
  "readingPdf",
  "errEncrypted",
  "errSigned",
  "errMemory",
  "errGeneric"
];

let errors = 0;
const supportedKeys = Object.keys(SUPPORTED_LOCALES);
console.log(`[1/2] Checking ${supportedKeys.length} supported locales in PDF_COMPRESSION_I18N...`);

for (const loc of supportedKeys) {
  const entry = PDF_COMPRESSION_I18N[loc];
  if (!entry) {
    console.error(`❌ Missing locale in PDF_COMPRESSION_I18N: ${loc}`);
    errors++;
    continue;
  }

  for (const key of REQUIRED_KEYS) {
    if (!entry[key] || typeof entry[key] !== "string" || entry[key].trim().length === 0) {
      console.error(`❌ Locale ${loc} missing key: ${key}`);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log(`✅ All ${supportedKeys.length} locales have all ${REQUIRED_KEYS.length} keys populated!`);
} else {
  console.error(`❌ Total dictionary errors: ${errors}`);
  process.exit(1);
}

console.log("\n[2/2] Running Live SSR Verification across key routes...");
const routesToTest = [
  { path: "/vi/compress-pdf-to-size", loc: "vi", expected: "Thả tài liệu PDF của bạn vào đây" },
  { path: "/sk/compress-pdf", loc: "sk", expected: "Sem pretiahnite svoj PDF dokument" },
  { path: "/lt/compress-pdf-to-size", loc: "lt", expected: "Vilkite savo PDF dokumentą čia" },
  { path: "/hi/compress-pdf-to-size", loc: "hi", expected: "अपना PDF दस्तावेज़ यहाँ छोड़ें" },
  { path: "/ms/compress-pdf", loc: "ms", expected: "Lepaskan dokumen PDF anda di sini" },
  { path: "/id/compress-pdf-to-size", loc: "id", expected: "Tarik dan lepas dokumen PDF Anda ke sini" },
  { path: "/fil/compress-pdf-to-size", loc: "fil", expected: "I-drop ang iyong PDF na dokumento dito" },
  { path: "/ru/compress-pdf", loc: "ru", expected: "Перетащите PDF-документ сюда" },
  { path: "/th/compress-pdf-to-size", loc: "th", expected: "วางเอกสาร PDF ของคุณที่นี่" },
  { path: "/ja/compress-pdf", loc: "ja", expected: "PDFドキュメントをここにドロップまたは参照" },
  { path: "/ar/compress-pdf", loc: "ar", expected: "اسحب مستند PDF هنا أو تصفّح" }
];

let ssrErrors = 0;
for (const tc of routesToTest) {
  try {
    const res = await fetch(`http://localhost:3000${tc.path}`);
    if (!res.ok) {
      console.error(`❌ HTTP error on ${tc.path}: status ${res.status}`);
      ssrErrors++;
      continue;
    }
    const html = await res.text();
    const hasEnglishLeak = html.includes("Drop your PDF document here");
    const hasExpected = html.includes(tc.expected);

    if (hasEnglishLeak) {
      console.error(`❌ English leak on ${tc.path}: contains "Drop your PDF document here"`);
      ssrErrors++;
    } else if (!hasExpected) {
      console.error(`❌ Expected text missing on ${tc.path}: missing "${tc.expected}"`);
      ssrErrors++;
    } else {
      console.log(`✅ ${tc.path}: 100% localized ("${tc.expected.slice(0, 30)}...")`);
    }
  } catch (err) {
    console.error(`❌ Fetch failure on ${tc.path}:`, err.message);
    ssrErrors++;
  }
}

if (ssrErrors === 0) {
  console.log("\n🎉 ALL 11 TESTED SSR ROUTES PASSED WITH ZERO LEAKS!");
} else {
  console.error(`\n❌ Total SSR errors: ${ssrErrors}`);
  process.exit(1);
}
