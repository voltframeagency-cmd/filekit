// Validation test for PrivacyWorkspace & privacyTranslations.ts

import { PRIVACY_I18N } from '../src/utils/privacy/privacyTranslations.ts';
import assert from 'node:assert';

const CANONICAL_LOCALES = [
  "en", "es", "es-419", "de", "fr", "pt", "pt-BR", "it", "nl", "ca",
  "sv", "da", "fi", "no", "pl", "cs", "hu", "ro", "bg", "el",
  "sk", "sl", "ru", "uk", "tr", "ar", "he", "hi", "id", "ms",
  "th", "vi", "fil", "ja", "ko", "zh-CN", "zh-TW", "lv", "lt"
];

const REQUIRED_STRING_KEYS = [
  "errorInspect",
  "errorStrip",
  "selectPhoto",
  "supportsNotice",
  "fileDetails",
  "detectedMetadata",
  "gpsDetected",
  "gpsClean",
  "exifDetected",
  "exifClean",
  "cameraLabel",
  "sanitizing",
  "stripBtn",
  "successTitle",
  "downloadBtn"
];

console.log(`\n=== 1. Checking 39 Canonical Locales in PRIVACY_I18N ===`);
assert.strictEqual(CANONICAL_LOCALES.length, 39, "Expected 39 canonical locales");

for (const loc of CANONICAL_LOCALES) {
  const entry = PRIVACY_I18N[loc];
  assert(entry, `Missing PRIVACY_I18N entry for locale: ${loc}`);
  
  for (const key of REQUIRED_STRING_KEYS) {
    assert(
      typeof entry[key] === 'string' && entry[key].trim().length > 0,
      `Locale ${loc} missing or empty string key: ${key}`
    );
  }

  assert(
    typeof entry.readyDownload === 'function',
    `Locale ${loc} missing readyDownload function`
  );
  const readyTest = entry.readyDownload("sample.jpg");
  assert(
    typeof readyTest === 'string' && readyTest.includes("clean_sample.jpg"),
    `Locale ${loc} readyDownload failed format test: ${readyTest}`
  );
}
console.log(`✅ All 39 canonical locales exist and have 100% complete keys without empty strings!`);

console.log(`\n=== 2. Testing Live SSR Rendering on Target Routes ===`);

const TARGET_ROUTES = [
  { url: 'http://localhost:3000/ms/strip-exif', locale: 'ms', check: 'Pilih Foto untuk Memadamkan Metadata', notice: 'Menyokong JPG, PNG dan WebP' },
  { url: 'http://localhost:3000/id/strip-exif', locale: 'id', check: 'Pilih Foto untuk Menghapus Metadata', notice: 'Mendukung JPG, PNG, dan WebP' },
  { url: 'http://localhost:3000/fil/strip-exif', locale: 'fil', check: 'Pumili ng Larawan para Alisin ang Metadata', notice: 'Sumusuporta sa JPG, PNG, at WebP' },
  { url: 'http://localhost:3000/bg/strip-exif', locale: 'bg', check: 'Изберете снимка за премахване на метаданни', notice: 'Поддържа JPG, PNG и WebP' },
  { url: 'http://localhost:3000/ru/strip-exif', locale: 'ru', check: 'Выберите фото для удаления метаданных', notice: 'Поддерживает JPG, PNG и WebP' },
  { url: 'http://localhost:3000/hi/strip-exif', locale: 'hi', check: 'मेटाडेटा हटाने के लिए फ़ोटो चुनें', notice: 'JPG, PNG और WebP का समर्थन करता है' },
  { url: 'http://localhost:3000/no/strip-exif', locale: 'no', check: 'Velg bilde for å fjerne metadata', notice: 'Støtter JPG, PNG og WebP' }
];

const LEAK_TEXTS = [
  'Select Photo to Strip Metadata',
  'Supports JPG, PNG, and WebP (Zero uploads to servers)'
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
      html.includes(t.notice),
      `Expected localized notice "${t.notice}" in ${t.url}`
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
  console.log(`\n🎉 All Privacy Workspace batch tests passed successfully!`);
}).catch(err => {
  console.error(`❌ Test failed:`, err);
  process.exit(1);
});
