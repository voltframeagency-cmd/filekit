import { SUPPORTED_LOCALES } from '../src/config/i18n/locales';
import { PDF_OVERLAY_I18N, PdfOverlayI18nEntry } from '../src/components/pdf-overlay/pdfOverlayTranslations';

const locales = Object.keys(SUPPORTED_LOCALES);
console.log(`Auditing PDF_OVERLAY_I18N across ${locales.length} locales...`);

const requiredKeys: Array<keyof PdfOverlayI18nEntry> = [
  'dropHere',
  'pdfOnlyNotice',
  'selectPdfFile',
  'readingPdf',
  'cancelProcessing',
  'livePlacementPreview',
  'watermarkType',
  'textWatermark',
  'imageLogo',
  'uploadLogoPrompt',
  'invalidImageFormat',
  'enterWatermarkText',
  'unsupportedWinAnsi',
  'watermarkText',
  'textPlaceholder',
  'fontColor',
  'fontSize',
  'selectLogoFile',
  'opacity',
  'rotation',
  'positionPreset',
  'posTopLeft',
  'posCenter',
  'posTopRight',
  'posBottomLeft',
  'posTileGrid',
  'posBottomRight',
  'posCustom',
  'customX',
  'customY',
  'applyToPages',
  'allPages',
  'oddPagesOnly',
  'evenPagesOnly',
  'customRange',
  'customRangePlaceholder',
  'applyWatermark',
  'applyingWatermark',
  'reset',
  'digitalSignatureNotice',
  'signatureWarning',
  'verifiedBadge',
  'watermarkSuccessSummary',
  'downloadWatermarkedPdf',
  'adjustWatermark',
  'startOver',
  'dismiss',
  'progressInspecting',
  'progressPreparing',
  'progressStamping',
  'progressVerifying',
  'progressReady',
  'errorFileTooLarge',
  'errorInvalidPdf',
  'errorPasswordRequired',
  'errorZeroPages',
  'errorLogoRead',
  'errorWorkerFailed',
  'errorGenericLoad',
];

let totalErrors = 0;

for (const code of locales) {
  const entry = PDF_OVERLAY_I18N[code];
  if (!entry) {
    console.error(`❌ Locale ${code}: Missing dictionary entry entirely!`);
    totalErrors++;
    continue;
  }

  const missingKeys: string[] = [];
  for (const k of requiredKeys) {
    const val = (entry as any)[k];
    if (val === undefined || val === null || val === '') {
      missingKeys.push(k);
    } else if (typeof val === 'function') {
      try {
        const testRes = (val as any)(10);
        if (!testRes || typeof testRes !== 'string') {
          missingKeys.push(`${k}() invalid return`);
        }
      } catch (err: any) {
        missingKeys.push(`${k}() threw error: ${err.message}`);
      }
    }
  }

  if (missingKeys.length > 0) {
    console.error(`❌ Locale ${code}: Missing or invalid keys: ${missingKeys.join(', ')}`);
    totalErrors += missingKeys.length;
  } else {
    // Check template placeholder functions specifically
    const fontSizeTest = entry.fontSize(24);
    const opacityTest = entry.opacity(50);
    const rotTest = entry.rotation(45);
    const summaryTest = entry.watermarkSuccessSummary(3);
    const stampingTest = entry.progressStamping(2, 5);
    const fileTooLargeTest = entry.errorFileTooLarge("test.pdf");

    if (
      !fontSizeTest.includes('24') ||
      !opacityTest.includes('50') ||
      !rotTest.includes('45') ||
      !summaryTest.includes('3') ||
      !stampingTest.includes('2') ||
      !stampingTest.includes('5') ||
      !fileTooLargeTest.includes('test.pdf')
    ) {
      console.error(`❌ Locale ${code}: Template placeholder interpolation failed!`, {
        fontSizeTest,
        opacityTest,
        rotTest,
        summaryTest,
        stampingTest,
        fileTooLargeTest,
      });
      totalErrors++;
    }
  }
}

if (totalErrors === 0) {
  console.log(`✅ All ${locales.length} locales passed 100% dictionary completeness with ${requiredKeys.length}/${requiredKeys.length} verified keys and valid placeholder functions.`);
} else {
  console.error(`❌ Audit failed with ${totalErrors} errors.`);
  process.exit(1);
}
