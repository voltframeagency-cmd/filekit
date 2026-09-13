import { SUPPORTED_LOCALES, ALL_LOCALES, normalizeLocale, resolveDictionaryEntry } from '../src/config/i18n/locales.ts';
import { OCR_I18N } from '../src/components/ocr-tools/ocrTranslations.ts';
import { PDF_COMPRESSION_I18N } from '../src/components/pdf-tools/pdfCompressionTranslations.ts';
import { PDF_OVERLAY_I18N } from '../src/components/pdf-overlay/pdfOverlayTranslations.ts';
import { IMAGE_COMPRESSION_I18N } from '../src/components/image-tools/imageCompressionTranslations.ts';
import { IMAGE_CONVERTER_I18N } from '../src/components/image-tools/imageConverterTranslations.ts';
import { OFFICE_I18N } from '../src/components/office-tools/officeTranslations.ts';

console.log('=== VERIFYING SHARED LOCALE RESOLUTION ACROSS ALL 39 CANONICAL LOCALES ===');

let failures = 0;

// Test 1: Canonical locales count
if (ALL_LOCALES.length !== 39) {
  console.error(`❌ ALL_LOCALES has ${ALL_LOCALES.length} entries, expected 39.`);
  failures++;
} else {
  console.log(`✅ ALL_LOCALES has exactly 39 canonical entries.`);
}

// Test 2: Specific Priority 1 test cases: zh-CN, zh-TW, pt-BR, es-419
const priorityTestCases = [
  { input: 'zh-CN', expected: 'zh-CN', expectedOcrTitle: '选择扫描文档或图片' },
  { input: 'zh-cn', expected: 'zh-CN', expectedOcrTitle: '选择扫描文档或图片' },
  { input: 'zh_CN', expected: 'zh-CN', expectedOcrTitle: '选择扫描文档或图片' },
  { input: 'zh-TW', expected: 'zh-TW', expectedOcrTitle: '選取掃描文件或圖片' },
  { input: 'zh-tw', expected: 'zh-TW', expectedOcrTitle: '選取掃描文件或圖片' },
  { input: 'zh_TW', expected: 'zh-TW', expectedOcrTitle: '選取掃描文件或圖片' },
  { input: 'pt-BR', expected: 'pt-BR', expectedOcrTitle: 'Selecionar documento digitalizado ou imagem' },
  { input: 'pt-br', expected: 'pt-BR', expectedOcrTitle: 'Selecionar documento digitalizado ou imagem' },
  { input: 'pt_BR', expected: 'pt-BR', expectedOcrTitle: 'Selecionar documento digitalizado ou imagem' },
  { input: 'es-419', expected: 'es-419', expectedOcrTitle: 'Selecciona documento escaneado o imagen' },
  { input: 'es_419', expected: 'es-419', expectedOcrTitle: 'Selecciona documento escaneado o imagen' },
];

for (const tc of priorityTestCases) {
  const norm = normalizeLocale(tc.input);
  if (norm !== tc.expected) {
    console.error(`❌ normalizeLocale('${tc.input}') returned '${norm}', expected '${tc.expected}'`);
    failures++;
  } else {
    console.log(`✅ normalizeLocale('${tc.input}') -> '${norm}'`);
  }

  const ocrEntry = resolveDictionaryEntry(OCR_I18N, tc.input);
  if (!ocrEntry || ocrEntry.dropzoneTitle !== tc.expectedOcrTitle) {
    console.error(`❌ resolveDictionaryEntry(OCR_I18N, '${tc.input}') failed. Got:`, ocrEntry?.dropzoneTitle);
    failures++;
  } else {
    console.log(`✅ resolveDictionaryEntry(OCR_I18N, '${tc.input}') correctly matched '${tc.expected}' entry.`);
  }

  const pdfCompEntry = resolveDictionaryEntry(PDF_COMPRESSION_I18N, tc.input);
  if (!pdfCompEntry || !pdfCompEntry.dropPdf) {
    console.error(`❌ resolveDictionaryEntry(PDF_COMPRESSION_I18N, '${tc.input}') failed.`);
    failures++;
  }

  const pdfOverlayEntry = resolveDictionaryEntry(PDF_OVERLAY_I18N, tc.input);
  if (!pdfOverlayEntry || !pdfOverlayEntry.dropHere) {
    console.error(`❌ resolveDictionaryEntry(PDF_OVERLAY_I18N, '${tc.input}') failed.`);
    failures++;
  }
}

// Test 3: Every canonical locale must resolve its exact intended dictionary entry across all workspaces
const dicts = [
  { name: 'OCR_I18N', dict: OCR_I18N },
  { name: 'PDF_COMPRESSION_I18N', dict: PDF_COMPRESSION_I18N },
  { name: 'PDF_OVERLAY_I18N', dict: PDF_OVERLAY_I18N },
  { name: 'IMAGE_COMPRESSION_I18N', dict: IMAGE_COMPRESSION_I18N },
  { name: 'IMAGE_CONVERTER_I18N', dict: IMAGE_CONVERTER_I18N },
  { name: 'OFFICE_I18N', dict: OFFICE_I18N },
];

for (const { name, dict } of dicts) {
  for (const loc of ALL_LOCALES) {
    const entry = resolveDictionaryEntry(dict, loc);
    if (!entry) {
      console.error(`❌ ${name} failed to resolve for canonical locale '${loc}'`);
      failures++;
    }
  }
  console.log(`✅ ${name}: 39/39 canonical locales successfully resolved without missing entries.`);
}

console.log('======================================================');
if (failures > 0) {
  console.error(`❌ Verification failed with ${failures} errors.`);
  process.exit(1);
} else {
  console.log('✅ ALL SHARED LOCALE RESOLUTION TESTS PASSED (100%)');
}
