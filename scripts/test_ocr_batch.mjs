// Validation test for First Batch: OcrPdfWorkspace & ocrTranslations.ts

import { OCR_I18N } from '../src/components/ocr-tools/ocrTranslations.ts';
import assert from 'node:assert';

const CANONICAL_LOCALES = [
  "en", "es", "es-419", "de", "fr", "pt", "pt-BR", "it", "nl", "ca",
  "sv", "da", "fi", "no", "pl", "cs", "hu", "ro", "bg", "el",
  "sk", "sl", "ru", "uk", "tr", "ar", "he", "hi", "id", "ms",
  "th", "vi", "fil", "ja", "ko", "zh-CN", "zh-TW", "lv", "lt"
];

const REQUIRED_STRING_KEYS = [
  "dropzoneTitle",
  "dropzonePrivacy",
  "chooseButton",
  "changeFile",
  "initialReading",
  "recognizing",
  "recognizeBtn",
  "errorOcrFailed",
  "copied",
  "copyText",
  "downloadTxt",
  "downloadSearchablePdf",
  "extractedTextLabel"
];

console.log(`\n=== 1. Checking 39 Canonical Locales in OCR_I18N ===`);
assert.strictEqual(CANONICAL_LOCALES.length, 39, "Expected 39 canonical locales");

for (const loc of CANONICAL_LOCALES) {
  const entry = OCR_I18N[loc];
  assert(entry, `Missing OCR_I18N entry for locale: ${loc}`);
  
  for (const key of REQUIRED_STRING_KEYS) {
    assert(
      typeof entry[key] === 'string' && entry[key].trim().length > 0,
      `Locale ${loc} missing or empty string key: ${key}`
    );
  }

  assert(
    typeof entry.completedSummary === 'function',
    `Locale ${loc} missing completedSummary function`
  );
  const summaryTest = entry.completedSummary(3, 1200);
  assert(
    typeof summaryTest === 'string' && summaryTest.includes("3") && summaryTest.includes("1200"),
    `Locale ${loc} completedSummary failed format test: ${summaryTest}`
  );
}
console.log(`✅ All 39 canonical locales exist and have 100% complete keys without empty strings!`);

console.log(`\n=== 2. Testing Live SSR Rendering on Target Routes ===`);

const TARGET_ROUTES = [
  { url: 'http://localhost:3000/bg/pdf-to-text', locale: 'bg', check: 'Изберете сканиран документ или изображение', button: 'Изберете PDF или изображение' },
  { url: 'http://localhost:3000/ru/pdf-to-text', locale: 'ru', check: 'Выберите отсканированный документ или изображение', button: 'Выбрать PDF или изображение' },
  { url: 'http://localhost:3000/hi/pdf-to-text', locale: 'hi', check: 'स्कैन किया गया दस्तावेज़ या छवि चुनें', button: 'PDF या छवि चुनें' },
  { url: 'http://localhost:3000/no/pdf-to-text', locale: 'no', check: 'Velg skannet dokument eller bilde', button: 'Velg PDF eller bilde' },
  { url: 'http://localhost:3000/bg/image-to-text', locale: 'bg', check: 'Изберете сканиран документ или изображение', button: 'Изберете PDF или изображение' }
];

const LEAK_TEXTS = [
  'Select Scanned Document or Image',
  '100% private in-browser OCR. Files never leave your browser.',
  'Choose PDF or Image'
];

async function runSSRTests() {
  for (const t of TARGET_ROUTES) {
    const res = await fetch(t.url);
    assert.strictEqual(res.status, 200, `Expected 200 OK for ${t.url}`);
    const html = await res.text();

    assert(
      html.includes(t.check),
      `Expected localized dropzone heading "${t.check}" in ${t.url}`
    );
    assert(
      html.includes(t.button),
      `Expected localized choose button "${t.button}" in ${t.url}`
    );

    for (const leak of LEAK_TEXTS) {
      assert(
        !html.includes(leak),
        `Unexpected English leak "${leak}" found in ${t.url}`
      );
    }
    console.log(`✅ ${t.url} rendered correctly with 0 English dropzone leaks!`);
  }
}

runSSRTests().then(() => {
  console.log(`\n🎉 All OCR Workspace batch tests passed successfully!`);
}).catch(err => {
  console.error(`❌ Test failed:`, err);
  process.exit(1);
});
