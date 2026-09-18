import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { resolveDictionaryEntry } from '../src/config/i18n/locales';
import { PDF_OVERLAY_I18N } from '../src/components/pdf-overlay/pdfOverlayTranslations';

const ARTIFACTS_DIR = 'C:/Users/mahdi/.gemini/antigravity-ide/brain/6599593d-7532-451f-9343-f8a5f66e8c66';
const TEST_PDF = path.resolve('test_sample.pdf');

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
  'Reading PDF document...',
  'Preparing watermark assets...',
  'Verifying watermarked PDF artifact...',
  'Reset',
  'Download Watermarked PDF',
  'Adjust Watermark',
  'Start Over',
  'Live Placement Preview',
  'Cancel Processing',
  'Document is not a valid PDF.',
  'Could not read uploaded logo image.',
  'Watermark processing encountered an error.'
];

interface WorkflowResult {
  locale: string;
  url: string;
  isMobile: boolean;
  isRtl: boolean;
  dropzoneTitle: string;
  validationErrorText: string;
  progressMessage: string;
  resultSuccessText: string;
  downloadButtonText: string;
  downloadedBytes: number;
  outputPageCount: number;
  exactWatermarkExtracted: boolean;
  extractedPageTexts: string[];
  cancellationVerified: boolean;
  leaksPerState: Record<string, string[]>;
  passed: boolean;
  failureReasons: string[];
}

async function extractPdfPageTexts(pdfBytes: Uint8Array): Promise<string[]> {
  const pdfjsPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.mjs');
  const pdfjs = await import(pathToFileURL(pdfjsPath).href);
  const doc = await pdfjs.getDocument({ data: pdfBytes, disableFontFace: true }).promise;
  const pageTexts: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it: any) => it.str).join(' ');
    pageTexts.push(text);
  }
  return pageTexts;
}

async function checkStateLeaks(page: any, stateName: string): Promise<string[]> {
  const visibleText = await page.evaluate(() => document.body.innerText);
  const detected: string[] = [];
  for (const phrase of FORBIDDEN_ENGLISH) {
    if (visibleText.includes(phrase)) {
      detected.push(phrase);
    }
  }
  return detected;
}

async function runLocaleWorkflow(
  browser: any,
  locale: string,
  options: { isMobile?: boolean } = {}
): Promise<WorkflowResult> {
  const isMobile = !!options.isMobile;
  const tr = resolveDictionaryEntry(PDF_OVERLAY_I18N, locale);
  const failureReasons: string[] = [];
  const leaksPerState: Record<string, string[]> = {};

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

  // 2. Assert Initial Dropzone state & leaks
  const dropzoneH3 = await page.locator('h3').first().innerText();
  console.log(`State [Dropzone] - Title: "${dropzoneH3}"`);
  if (!dropzoneH3.includes(tr.dropHere)) {
    failureReasons.push(`Dropzone title "${dropzoneH3}" does not match localized translation "${tr.dropHere}"`);
  }
  leaksPerState['dropzone'] = await checkStateLeaks(page, 'dropzone');
  if (leaksPerState['dropzone'].length > 0) {
    failureReasons.push(`Dropzone state leaked English phrases: ${leaksPerState['dropzone'].join(', ')}`);
  }

  const initialScreenshot = path.join(ARTIFACTS_DIR, `watermark_${locale.replace('-', '_')}_initial.png`);
  await page.screenshot({ path: initialScreenshot, fullPage: false });

  // 3. Upload test_sample.pdf
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(TEST_PDF);

  const watermarkTextInput = page.locator('div.space-y-3 input[type="text"]').first();
  await watermarkTextInput.waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);

  // 4. Assert Configured Controls state & leaks
  leaksPerState['configured'] = await checkStateLeaks(page, 'configured');
  if (leaksPerState['configured'].length > 0) {
    failureReasons.push(`Configured controls state leaked English phrases: ${leaksPerState['configured'].join(', ')}`);
  }

  // 5. Test Validation Error state
  await watermarkTextInput.fill('');
  await page.waitForTimeout(500);

  const validationAlert = page.locator('.bg-amber-950\\/80, .text-amber-200').first();
  await validationAlert.waitFor({ state: 'visible', timeout: 5000 });
  const validationErrorText = (await validationAlert.innerText()).trim();
  console.log(`State [Validation Error] - Alert: "${validationErrorText}"`);
  if (!validationErrorText.includes(tr.enterWatermarkText)) {
    failureReasons.push(`Validation alert "${validationErrorText}" does not contain expected localized error "${tr.enterWatermarkText}"`);
  }

  // 6. Test Cancellation State (Mandatory, Controlled Timing & Deterministic Worker Termination)
  const cancelTestWatermark = `FILEKIT_CANCEL_${locale.replace('-', '_').toUpperCase()}`;
  await watermarkTextInput.fill(cancelTestWatermark);
  await page.waitForTimeout(300);

  // Inject controlled timing delay so worker execution is paused during cancellation check
  await page.evaluate(() => {
    (window as any).__FILEKIT_TEST_DELAY_MS = 2500;
  });

  const applyBtn = page.locator('button.bg-gradient-to-r').first();
  await applyBtn.click();

  let cancellationVerified = false;
  try {
    // Assert worker active flag is set to true immediately upon start and terminated is false
    await page.waitForFunction(() => (window as any).__filekit_pdf_worker_active === true, { timeout: 3000 });

    const cancelBtn = page.locator('button:has-text("' + tr.cancelProcessing + '")').first();
    await cancelBtn.waitFor({ state: 'visible', timeout: 3000 });
    await cancelBtn.click();
    console.log(`State [Cancellation] - Clicked localized cancel button.`);

    // Deterministically verify that actual worker.terminate() was invoked
    await page.waitForFunction(
      () => (window as any).__filekit_pdf_worker_terminated === true && (window as any).__filekit_pdf_worker_active === false,
      { timeout: 3000 }
    );
    const isProgressBannerVisible = await page.locator('[data-testid="progress-banner"]').isVisible();
    if (!isProgressBannerVisible) {
      cancellationVerified = true;
      console.log(`State [Cancellation] - Verified off-thread worker.terminate() actually executed deterministically (__filekit_pdf_worker_terminated === true, banner dismissed).`);
    } else {
      failureReasons.push(`Cancellation state failed: progress banner is still visible after cancellation.`);
    }
  } catch (err: any) {
    failureReasons.push(`Cancellation verification failed: ${err.message}`);
  }

  if (!cancellationVerified) {
    failureReasons.push(`Mandatory cancellation check failed for locale ${locale}`);
  }

  // Reset test delay so subsequent full job runs at normal speed
  await page.evaluate(() => {
    (window as any).__FILEKIT_TEST_DELAY_MS = 0;
  });

  // 7. Configure actual test watermark
  const watermarkTextValue = `FILEKIT_${locale.replace('-', '_').toUpperCase()}`;
  await watermarkTextInput.fill(watermarkTextValue);
  await page.waitForTimeout(500);

  // 8. Click Apply Watermark CTA
  console.log(`Clicking Apply button for full execution...`);
  await applyBtn.click();

  // Capture progress message deterministically and verify it matches exact localized templates
  let progressMessage = '';
  try {
    const progressSpan = page.locator('[data-testid="progress-status-message"]');
    await progressSpan.waitFor({ state: 'visible', timeout: 4000 });
    progressMessage = (await progressSpan.innerText()).trim();
    console.log(`State [Progress] - Observed: "${progressMessage}"`);

    // Expected valid localized progress messages for this locale
    const expectedPreparing = tr.progressPreparing;
    const expectedInspecting = tr.progressInspecting;
    const expectedStampingP1 = tr.progressStamping(1, 3);
    const expectedStampingP2 = tr.progressStamping(2, 3);
    const expectedStampingP3 = tr.progressStamping(3, 3);
    const expectedVerifying = tr.progressVerifying;
    const expectedReady = tr.progressReady;

    const matchesLocalizedProgress =
      progressMessage.includes(expectedPreparing) ||
      progressMessage.includes(expectedInspecting) ||
      progressMessage.includes(expectedStampingP1) ||
      progressMessage.includes(expectedStampingP2) ||
      progressMessage.includes(expectedStampingP3) ||
      progressMessage.includes(expectedVerifying) ||
      progressMessage.includes(expectedReady);

    if (!matchesLocalizedProgress) {
      failureReasons.push(
        `Progress message "${progressMessage}" did not match any expected localized progress template (e.g. "${expectedPreparing}" or "${expectedStampingP1}")`
      );
    }

    leaksPerState['progress'] = await checkStateLeaks(page, 'progress');
    if (leaksPerState['progress'].length > 0) {
      failureReasons.push(`Progress state leaked English phrases: ${leaksPerState['progress'].join(', ')}`);
    }
  } catch (err: any) {
    failureReasons.push(`Mandatory progress check failed to observe progress state: ${err.message}`);
  }

  // 9. Wait for Result Card
  const resultCardH3 = page.locator('.bg-slate-900.border.border-slate-800.rounded-2xl.p-6 h3').first();
  await resultCardH3.waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForTimeout(1000);

  const resultCard = page.locator('.bg-slate-900.border.border-slate-800.rounded-2xl.p-6').first();
  const resultSuccessText = (await resultCard.locator('p.text-xs.text-slate-400').innerText()).trim();
  const downloadBtn = resultCard.locator('button.bg-gradient-to-r').first();
  const downloadButtonText = (await downloadBtn.innerText()).trim();

  console.log(`State [Result Card] - Summary: "${resultSuccessText}"`);
  console.log(`State [Result Card] - CTA: "${downloadButtonText}"`);

  if (!downloadButtonText.includes(tr.downloadWatermarkedPdf)) {
    failureReasons.push(`Download CTA text "${downloadButtonText}" does not contain expected localized string "${tr.downloadWatermarkedPdf}"`);
  }

  leaksPerState['result'] = await checkStateLeaks(page, 'result');
  if (leaksPerState['result'].length > 0) {
    failureReasons.push(`Result state leaked English phrases: ${leaksPerState['result'].join(', ')}`);
  }

  const resultScreenshot = path.join(ARTIFACTS_DIR, `watermark_${locale.replace('-', '_')}_result.png`);
  await page.screenshot({ path: resultScreenshot, fullPage: false });

  // 10. Trigger download & extract exact watermark from PDF
  const downloadPromiseResult = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
  await downloadBtn.click();
  const download = await downloadPromiseResult;

  let downloadedBytes = 0;
  let outputPageCount = 0;
  let exactWatermarkExtracted = false;
  let extractedPageTexts: string[] = [];

  if (download) {
    const downloadPath = path.join(ARTIFACTS_DIR, `output_${locale.replace('-', '_')}.pdf`);
    await download.saveAs(downloadPath);
    const downloadedBuf = fs.readFileSync(downloadPath);
    downloadedBytes = downloadedBuf.length;

    // Verify PDF page count preservation
    const parsedPdf = await PDFDocument.load(downloadedBuf);
    outputPageCount = parsedPdf.getPageCount();
    if (outputPageCount !== 3) {
      failureReasons.push(`Output PDF page count is ${outputPageCount}, expected 3`);
    }

    // Extract exact text using pdfjs
    extractedPageTexts = await extractPdfPageTexts(new Uint8Array(downloadedBuf));
    console.log(`Extracted page texts:`, extractedPageTexts);

    // Assert exact watermark text on every target page (all 3 pages)
    const pagesMissingWatermark: number[] = [];
    for (let i = 0; i < extractedPageTexts.length; i++) {
      if (!extractedPageTexts[i].includes(watermarkTextValue)) {
        pagesMissingWatermark.push(i + 1);
      }
    }

    if (pagesMissingWatermark.length === 0) {
      exactWatermarkExtracted = true;
      console.log(`✅ Exact watermark text "${watermarkTextValue}" verified on all ${extractedPageTexts.length} pages.`);
    } else {
      failureReasons.push(`Watermark "${watermarkTextValue}" missing on pages: ${pagesMissingWatermark.join(', ')}`);
    }
  } else {
    failureReasons.push(`Download event did not fire within 15s`);
  }

  await context.close();

  const passed = failureReasons.length === 0;

  return {
    locale,
    url,
    isMobile,
    isRtl,
    dropzoneTitle: dropzoneH3,
    validationErrorText,
    progressMessage,
    resultSuccessText,
    downloadButtonText,
    downloadedBytes,
    outputPageCount,
    exactWatermarkExtracted,
    extractedPageTexts,
    cancellationVerified,
    leaksPerState,
    passed,
    failureReasons,
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
  let allPassed = true;

  for (const item of localesToTest) {
    try {
      const res = await runLocaleWorkflow(browser, item.locale, { isMobile: item.isMobile });
      results.push(res);
      if (!res.passed) {
        allPassed = false;
        console.error(`❌ Locale ${item.locale} FAILED:`, res.failureReasons);
      } else {
        console.log(`✅ Locale ${item.locale} PASSED all workflow, leak, and text extraction checks.`);
      }
    } catch (err: any) {
      allPassed = false;
      console.error(`❌ Uncaught exception testing ${item.locale}:`, err.message);
    }
  }

  await browser.close();

  console.log(`\n==============================================`);
  console.log(`ALL WORKFLOW CHECKS COMPLETED (${results.length}/${localesToTest.length})`);
  console.log(`Overall Result: ${allPassed ? 'ALL PASSED (100%)' : 'FAILURES DETECTED'}`);
  console.log(`==============================================`);
  fs.writeFileSync('workflow_verification_results.json', JSON.stringify(results, null, 2));
  console.log('Saved workflow_verification_results.json');

  if (!allPassed || results.length !== localesToTest.length) {
    console.error('❌ One or more locales failed verification assertions.');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTED LOCALES PASSED VERIFICATION SUITE.');
  }
})();
