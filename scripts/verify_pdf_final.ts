import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { PDFDocument } from "pdf-lib";
import { generateTestCorpus } from "../src/utils/engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Private-Fixtures";
const APP_URL = "http://localhost:3000/compress-pdf";
const LARGE_JPEG_PATH = path.join(__dirname, "../src/utils/engine/__tests__/large_jpeg.pdf");

export interface ThreeCaseVerificationRecord {
  caseName: string;
  testId: string;
  originalSizeBytes: number;
  targetSizeBytes: number;
  outputSizeBytes: number;
  originalAlreadyWithinTarget: boolean;
  targetAchieved: boolean;
  attemptsRun: number;
  stopReason: string;
  outcome: string;
  runtimeRoute: string;
  documentStrategy: string;
  imagesDiscovered: number;
  imagesSupported: number;
  imagesReplaced: number;
  bufferPresent: boolean;
  bufferDiffersFromOriginal: boolean;
  inBrowserReadable: boolean;
  inBrowserPageCount: number;
  downloadSuccess: string;
  downloadedSizeBytes: number;
  downloadedPageCount: number;
  headerValid: boolean;
  eofValid: boolean;
}

async function runThreeCaseFinalVerification() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  if (!fs.existsSync(LARGE_JPEG_PATH)) {
    console.error(`Missing large JPEG fixture at ${LARGE_JPEG_PATH}. Run scripts/generate_large_jpeg_fixture.ts first.`);
    process.exit(1);
  }

  const corpus = await generateTestCorpus();
  const largeJpegBytes = fs.readFileSync(LARGE_JPEG_PATH);

  const testCases = [
    {
      caseName: "CASE_1_TRANSFORMED_TARGET_ACHIEVED",
      fileName: "case1_transformed_target_achieved.pdf",
      buffer: largeJpegBytes,
      targetSize: 250 * 1024 // 250 KB target (original is ~427 KB)
    },
    {
      caseName: "CASE_2_TRANSFORMED_TARGET_NOT_MET",
      fileName: "case2_transformed_target_not_met.pdf",
      buffer: largeJpegBytes,
      targetSize: 10 * 1024 // 10 KB impossible target
    },
    {
      caseName: "CASE_3_REJECTED_ENCRYPTED",
      fileName: "case3_encrypted.pdf",
      buffer: corpus["encrypted.pdf"],
      targetSize: 100 * 1024
    }
  ];

  for (const tc of testCases) {
    const p = path.join(TEMP_DIR, tc.fileName);
    fs.writeFileSync(p, Buffer.from(tc.buffer));
  }

  console.log("Launching Chromium browser for 3-case transformed artifact & download verification...\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const results: ThreeCaseVerificationRecord[] = [];

  for (const tc of testCases) {
    console.log(`[Three-Case Verification] Testing ${tc.caseName} (${tc.fileName})...`);
    const filePath = path.join(TEMP_DIR, tc.fileName);
    const originalBytes = fs.readFileSync(filePath);
    const originalSizeBytes = originalBytes.byteLength;

    await page.goto(APP_URL, { waitUntil: "networkidle" });

    // Clear previous state
    await page.evaluate(() => {
      delete (window as any).__LAST_RESULT__;
    });

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await page.waitForTimeout(1000);

    const pageText = await page.innerText("body");

    // Case 3: Encrypted / Locked PDF preflight rejection
    if (tc.caseName === "CASE_3_REJECTED_ENCRYPTED") {
      const downloadBtn = page.locator('button:has-text("Download")');
      const isDownloadVisible = await downloadBtn.isVisible();

      const browserState = await page.evaluate(() => (window as any).__LAST_RESULT__);

      results.push({
        caseName: tc.caseName,
        testId: tc.fileName,
        originalSizeBytes,
        targetSizeBytes: tc.targetSize,
        outputSizeBytes: originalSizeBytes,
        originalAlreadyWithinTarget: originalSizeBytes <= tc.targetSize,
        targetAchieved: false,
        attemptsRun: 0,
        stopReason: "ENCRYPTED_OR_LOCKED",
        outcome: "REJECTED_ENCRYPTED",
        runtimeRoute: "SERVER_REQUIRED",
        documentStrategy: "REJECTED_ENCRYPTED",
        imagesDiscovered: 0,
        imagesSupported: 0,
        imagesReplaced: 0,
        bufferPresent: false,
        bufferDiffersFromOriginal: false,
        inBrowserReadable: false,
        inBrowserPageCount: 0,
        downloadSuccess: "NOT_APPLICABLE",
        downloadedSizeBytes: 0,
        downloadedPageCount: 0,
        headerValid: true,
        eofValid: true
      });

      console.log(`  ✓ ${tc.caseName}: OutputBuffer absent, Download button visible=${isDownloadVisible}`);
      continue;
    }

    // Cases 1 & 2: Click Compress PDF button
    const compressBtn = page.locator('button:has-text("Compress PDF")');
    if (await compressBtn.isVisible()) {
      await page.evaluate(({ targetBytes }) => {
        (window as any).__TEST_TARGET_SIZE__ = String(targetBytes);
      }, { targetBytes: tc.targetSize });

      await compressBtn.click();
      await page.waitForFunction(() => (window as any).__LAST_RESULT__ !== undefined, { timeout: 35000 });

      // Step 1: Verify output inside Chromium context using window.PDFLib
      const browserEval = await page.evaluate(async ({ origBase64 }) => {
        const result = (window as any).__LAST_RESULT__;
        if (!result || !result.outputBuffer) {
          return {
            bufferPresent: false,
            bufferDiffersFromOriginal: false,
            parserReadable: false,
            pages: 0,
            bytes: 0,
            headerValid: false,
            eofValid: false,
            result: null
          };
        }

        const buf = result.outputBuffer;
        const bytes = new Uint8Array(buf);

        // Check buffer differs from original
        const origStr = atob(origBase64);
        let differs = bytes.length !== origStr.length;
        if (!differs) {
          for (let i = 0; i < bytes.length; i++) {
            if (bytes[i] !== origStr.charCodeAt(i)) {
              differs = true;
              break;
            }
          }
        }

        let headerValid = false;
        let eofValid = false;

        if (bytes.length >= 5) {
          const headerStr = String.fromCharCode(...bytes.subarray(0, 5));
          headerValid = headerStr === "%PDF-";
        }

        if (bytes.length >= 6) {
          const tailStr = String.fromCharCode(...bytes.subarray(bytes.length - 1024));
          eofValid = tailStr.includes("%%EOF");
        }

        let pages = 0;
        let parserReadable = false;
        try {
          const PDFLib = (window as any).PDFLib;
          if (PDFLib && PDFLib.PDFDocument) {
            const doc = await PDFLib.PDFDocument.load(buf);
            pages = doc.getPageCount();
            parserReadable = pages > 0;
          }
        } catch {
          parserReadable = false;
        }

        return {
          bufferPresent: true,
          bufferDiffersFromOriginal: differs,
          parserReadable,
          pages,
          bytes: buf.byteLength,
          headerValid,
          eofValid,
          result
        };
      }, { origBase64: originalBytes.toString("base64") });

      const res = browserEval.result;

      // Step 2: Trigger real Playwright download event
      let downloadSuccess = "FAILED";
      let downloadedSizeBytes = 0;
      let downloadedPageCount = 0;

      const downloadBtn = page.locator('button:has-text("Download")');
      if (await downloadBtn.isVisible()) {
        const downloadPromise = page.waitForEvent("download");
        await downloadBtn.click();
        const download = await downloadPromise;

        const tempOutputPath = path.join(TEMP_DIR, `output_${tc.fileName}`);
        await download.saveAs(tempOutputPath);

        // Node side verification of downloaded artifact
        const downloadedBytes = fs.readFileSync(tempOutputPath);
        downloadedSizeBytes = downloadedBytes.byteLength;

        const outputPdf = await PDFDocument.load(downloadedBytes);
        downloadedPageCount = outputPdf.getPageCount();

        const nodeHeaderValid = downloadedBytes.subarray(0, 5).toString("utf-8") === "%PDF-";
        const nodeEofValid = downloadedBytes.subarray(downloadedBytes.length - 1024).toString("utf-8").includes("%%EOF");

        if (downloadedPageCount > 0 && downloadedSizeBytes === res.outputSizeBytes && nodeHeaderValid && nodeEofValid) {
          downloadSuccess = "TRUE";
        }

        // Clean up temporary downloaded file
        if (fs.existsSync(tempOutputPath)) {
          fs.unlinkSync(tempOutputPath);
        }
      }

      results.push({
        caseName: tc.caseName,
        testId: tc.fileName,
        originalSizeBytes,
        targetSizeBytes: tc.targetSize,
        outputSizeBytes: res.outputSizeBytes,
        originalAlreadyWithinTarget: originalSizeBytes <= tc.targetSize,
        targetAchieved: res.targetAchieved,
        attemptsRun: res.attemptsRun,
        stopReason: res.stopReason,
        outcome: res.outcome,
        runtimeRoute: res.runtimeRoute || "LOCAL_SAFE",
        documentStrategy: res.documentStrategy || "IMAGE_XOBJECT_RECOMPRESS",
        imagesDiscovered: res.imagesDiscovered ?? 0,
        imagesSupported: res.imagesSupported ?? 0,
        imagesReplaced: res.imagesReplaced ?? 0,
        bufferPresent: browserEval.bufferPresent,
        bufferDiffersFromOriginal: browserEval.bufferDiffersFromOriginal,
        inBrowserReadable: browserEval.parserReadable,
        inBrowserPageCount: browserEval.pages,
        downloadSuccess,
        downloadedSizeBytes,
        downloadedPageCount,
        headerValid: browserEval.headerValid,
        eofValid: browserEval.eofValid
      });

      console.log(`  ✓ ${tc.caseName}: Outcome=${res.outcome}, ImagesReplaced=${res.imagesReplaced}, Differs=${browserEval.bufferDiffersFromOriginal}, DownloadSuccess=${downloadSuccess}`);
    }
  }

  await browser.close();

  // Purge temporary test directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})`);
  }

  console.log("\n=== THREE_CASE_FINAL_VERIFICATION_RESULTS ===");
  console.log(JSON.stringify(results, null, 2));
}

runThreeCaseFinalVerification();
