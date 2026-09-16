import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/mahdi/.gemini/antigravity-ide/brain/6599593d-7532-451f-9343-f8a5f66e8c66';
const TEST_PDF = path.resolve('test_sample.pdf');

interface WorkflowResult {
  locale: string;
  url: string;
  isMobile: boolean;
  isRtl: boolean;
  dropzoneTitle: string;
  controlsLabels: string[];
  validationErrorText: string;
  progressMessage: string;
  resultSuccessText: string;
  downloadButtonText: string;
  downloadedBytes: number;
  outputPageCount: number;
  hasExpectedWatermarkText: boolean;
  englishLeaks: string[];
}

async function runLocaleWorkflow(
  browser: any,
  locale: string,
  options: { isMobile?: boolean } = {}
): Promise<WorkflowResult> {
  const isMobile = !!options.isMobile;
  const context = await browser.newContext({
    viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    isMobile: isMobile,
    hasTouch: isMobile,
    acceptDownloads: true,
  });

  const page = await context.newPage();
  const url = `http://localhost:3000/${locale}/watermark-pdf`;
  console.log(`\n==============================================`);
  console.log(`Testing Workflow on: ${url} (Mobile: ${isMobile})`);
  console.log(`==============================================`);

  await page.goto(url, { waitUntil: 'networkidle' });

  // 1. Check RTL direction
  const isRtl = await page.evaluate(() => {
    return document.documentElement.dir === 'rtl' || getComputedStyle(document.body).direction === 'rtl';
  });

  // 2. Check Dropzone Text
  const dropzoneH3 = await page.locator('h3').first().innerText();
  console.log(`Dropzone title: "${dropzoneH3}"`);

  // Initial dropzone screenshot
  const initialScreenshot = path.join(ARTIFACTS_DIR, `watermark_${locale.replace('-', '_')}_initial.png`);
  await page.screenshot({ path: initialScreenshot, fullPage: false });

  // 3. Upload test_sample.pdf
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(TEST_PDF);

  // Wait for editor controls: query inside div.space-y-3 input[type="text"]
  const watermarkTextInput = page.locator('div.space-y-3 input[type="text"]').first();
  await watermarkTextInput.waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000); // Wait for canvas live preview render

  // 4. Extract visible labels in controls
  const controlsCard = page.locator('div.space-y-5').first();
  const allLabels = await controlsCard.locator('label, button, p, span').allInnerTexts();
  const cleanLabels = Array.from(new Set(allLabels.map((s: string) => s.trim()).filter((s: string) => s.length > 0)));
  console.log(`Extracted ${cleanLabels.length} control labels/buttons.`);

  // 5. Test validation error: Clear text input
  await watermarkTextInput.fill('');
  await page.waitForTimeout(500);

  // Validation alert should appear
  const validationAlert = page.locator('.bg-amber-950\\/80, .text-amber-200').first();
  await validationAlert.waitFor({ state: 'visible', timeout: 5000 });
  const validationErrorText = (await validationAlert.innerText()).trim();
  console.log(`Validation Error Text (empty text): "${validationErrorText}"`);

  // Validation error screenshot
  const valScreenshot = path.join(ARTIFACTS_DIR, `watermark_${locale.replace('-', '_')}_val_error.png`);
  await page.screenshot({ path: valScreenshot, fullPage: false });

  // 6. Restore text with customized test watermark
  const watermarkTextValue = `FILEKIT_${locale.replace('-', '_').toUpperCase()}`;
  await watermarkTextInput.fill(watermarkTextValue);
  await page.waitForTimeout(500);

  // Controls configured screenshot
  const controlsScreenshot = path.join(ARTIFACTS_DIR, `watermark_${locale.replace('-', '_')}_configured.png`);
  await page.screenshot({ path: controlsScreenshot, fullPage: false });

  // 7. Click Apply Watermark CTA
  const applyBtn = page.locator('button.bg-gradient-to-r').first();
  const applyBtnInitialText = (await applyBtn.innerText()).trim();
  console.log(`Apply Button label: "${applyBtnInitialText}"`);

  // Start listening for download event
  const downloadPromise = page.waitForEvent('download', { timeout: 25000 }).catch(() => null);

  console.log(`Clicking Apply button...`);
  await applyBtn.click();

  // 8. Capture progress message if visible
  let progressMessage = '';
  try {
    const progressSpan = page.locator('.animate-spin').locator('..');
    if (await progressSpan.isVisible()) {
      progressMessage = (await progressSpan.innerText()).trim();
      console.log(`Observed Progress Message: "${progressMessage}"`);
    }
  } catch (_) {}

  // 9. Wait for Result Card
  const resultCardH3 = page.locator('.bg-slate-900.border.border-slate-800.rounded-2xl.p-6 h3').first();
  await resultCardH3.waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(1000);

  const resultCard = page.locator('.bg-slate-900.border.border-slate-800.rounded-2xl.p-6').first();
  const resultSuccessText = (await resultCard.locator('p.text-xs.text-slate-400').innerText()).trim();
  const downloadBtn = resultCard.locator('button.bg-gradient-to-r').first();
  const downloadButtonText = (await downloadBtn.innerText()).trim();

  console.log(`Result Summary: "${resultSuccessText}"`);
  console.log(`Download CTA: "${downloadButtonText}"`);

  // Result card screenshot
  const resultScreenshot = path.join(ARTIFACTS_DIR, `watermark_${locale.replace('-', '_')}_result.png`);
  await page.screenshot({ path: resultScreenshot, fullPage: false });

  // 10. Trigger and capture download
  const downloadPromiseResult = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
  await downloadBtn.click();
  const download = await downloadPromiseResult;

  let downloadedBytes = 0;
  let outputPageCount = 0;
  let hasExpectedWatermarkText = false;

  if (download) {
    const downloadPath = path.join(ARTIFACTS_DIR, `output_${locale.replace('-', '_')}.pdf`);
    await download.saveAs(downloadPath);
    const downloadedBuf = fs.readFileSync(downloadPath);
    downloadedBytes = downloadedBuf.length;

    // Verify PDF structure and page count preservation with pdf-lib
    const parsedPdf = await PDFDocument.load(downloadedBuf);
    outputPageCount = parsedPdf.getPageCount();

    // Check raw stream for watermark text value
    const pdfRaw = downloadedBuf.toString('binary');
    hasExpectedWatermarkText = pdfRaw.includes(watermarkTextValue) || pdfRaw.includes('FILEKIT');

    console.log(`Downloaded PDF: ${downloadPath}`);
    console.log(`Bytes: ${downloadedBytes} | Page Count: ${outputPageCount} (Original: 3)`);
    console.log(`Expected Watermark Text in stream: ${hasExpectedWatermarkText}`);
  } else {
    console.error(`❌ Download did not trigger within timeout for ${locale}.`);
  }

  // 11. Scan for English leaks on visible text
  const FORBIDDEN_ENGLISH = [
    'Drop your PDF here',
    'Watermark Type',
    'Text Watermark',
    'Image Logo',
    'Watermark Text',
    'Font Color',
    'Font Size',
    'Opacity',
    'Rotation',
    'Position Preset',
    'Apply To Pages',
    'All Pages',
    'Odd Pages Only',
    'Even Pages Only',
    'Custom Range',
    'Apply Watermark',
    'Applying Watermark',
    'Reset',
    'Download Watermarked PDF',
    'Adjust Watermark',
    'Start Over',
    'Live Placement Preview',
    'Cancel Processing'
  ];

  const fullVisibleText = await page.evaluate(() => document.body.innerText);
  const englishLeaks: string[] = [];
  for (const phrase of FORBIDDEN_ENGLISH) {
    if (fullVisibleText.includes(phrase)) {
      englishLeaks.push(phrase);
    }
  }

  console.log(`English Leaks check:`, englishLeaks.length > 0 ? `LEAKS: ${englishLeaks.join(', ')}` : 'CLEAN (0 leaks)');

  await context.close();

  return {
    locale,
    url,
    isMobile,
    isRtl,
    dropzoneTitle: dropzoneH3,
    controlsLabels: cleanLabels,
    validationErrorText,
    progressMessage,
    resultSuccessText,
    downloadButtonText,
    downloadedBytes,
    outputPageCount,
    hasExpectedWatermarkText,
    englishLeaks,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  const localesToTest = [
    { locale: 'lt', isMobile: false },
    { locale: 'bg', isMobile: false },
    { locale: 'hi', isMobile: false },
    { locale: 'ar', isMobile: false }, // RTL test
    { locale: 'pt-BR', isMobile: false },
    { locale: 'zh-TW', isMobile: true }, // Mobile layout test
  ];

  const results: WorkflowResult[] = [];

  for (const item of localesToTest) {
    try {
      const res = await runLocaleWorkflow(browser, item.locale, { isMobile: item.isMobile });
      results.push(res);
    } catch (err: any) {
      console.error(`Error testing ${item.locale}:`, err.message);
    }
  }

  await browser.close();

  console.log(`\n==============================================`);
  console.log(`ALL WORKFLOW CHECKS COMPLETED (${results.length}/${localesToTest.length})`);
  console.log(`==============================================`);
  fs.writeFileSync('workflow_verification_results.json', JSON.stringify(results, null, 2));
  console.log('Saved workflow_verification_results.json');
})();
