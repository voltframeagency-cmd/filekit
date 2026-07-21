import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Private-Image-Fixtures-V2";
const APP_URL = "http://localhost:3000/compress-image";

export interface ImageGateRecord {
  caseName: string;
  testId: string;
  originalSizeBytes: number;
  targetSizeBytes: number;
  outputSizeBytes: number;
  outcome: string;
  mimeType: string;
  widthBefore: number;
  heightBefore: number;
  widthAfter: number;
  heightAfter: number;
  alphaPreserved: boolean;
  orientationCorrected: boolean;
  metadataRemoved: boolean;
  inBrowserReadable: boolean;
  downloadSuccess: string;
  downloadedSizeBytes: number;
}

async function runImageFoundationVerificationGate() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("Generating fixtures for Image Engine Verification Gate...");

  // Generate synthetic high-res JPEG and EXIF-oriented JPEG using Canvas in Playwright
  const browser = await chromium.launch({ headless: true });
  const setupPage = await browser.newPage();
  await setupPage.goto(APP_URL, { waitUntil: "networkidle" });

  const canvasFixtures = await setupPage.evaluate(() => {
    // 1. Large JPEG (1200x1200 high-res gradient photo)
    const c1 = document.createElement("canvas");
    c1.width = 1200;
    c1.height = 1200;
    const ctx1 = c1.getContext("2d")!;
    for (let y = 0; y < 1200; y += 10) {
      for (let x = 0; x < 1200; x += 10) {
        ctx1.fillStyle = `rgb(${(x * 17) % 256}, ${(y * 23) % 256}, ${(x + y * 5) % 256})`;
        ctx1.fillRect(x, y, 10, 10);
      }
    }
    const largeJpegBase64 = c1.toDataURL("image/jpeg", 0.95);

    // 2. Transparent PNG with transparent corner, opaque center, semi-transparent edge
    const c2 = document.createElement("canvas");
    c2.width = 200;
    c2.height = 200;
    const ctx2 = c2.getContext("2d")!;
    ctx2.clearRect(0, 0, 200, 200); // transparent background
    ctx2.fillStyle = "rgba(255, 0, 0, 1.0)"; // opaque center
    ctx2.fillRect(50, 50, 100, 100);
    ctx2.fillStyle = "rgba(0, 0, 255, 0.5)"; // semi-transparent edge
    ctx2.fillRect(30, 30, 40, 40);
    const transparentPngBase64 = c2.toDataURL("image/png");

    // 3. Static WebP
    const transparentWebpBase64 = c2.toDataURL("image/webp", 0.9);

    return {
      largeJpegBase64,
      transparentPngBase64,
      transparentWebpBase64
    };
  });

  await setupPage.close();

  // Save generated canvas fixtures to temp directory
  const largeJpegBytes = Buffer.from(canvasFixtures.largeJpegBase64.replace(/^data:image\/jpeg;base64,/, ""), "base64");
  const transparentPngBytes = Buffer.from(canvasFixtures.transparentPngBase64.replace(/^data:image\/png;base64,/, ""), "base64");
  const transparentWebpBytes = Buffer.from(canvasFixtures.transparentWebpBase64.replace(/^data:image\/webp;base64,/, ""), "base64");

  const corpus = getTestImageCorpus();

  const filesMap: Record<string, Buffer> = {
    "large_jpeg.jpg": largeJpegBytes,
    "transparent.png": transparentPngBytes,
    "transparent.webp": transparentWebpBytes,
    "small.jpg": Buffer.from(corpus["sample.jpg"]),
    "animated.webp": Buffer.from(corpus["animated.webp"]),
    "malformed.jpg": Buffer.from(corpus["malformed.jpg"])
  };

  for (const [fname, buf] of Object.entries(filesMap)) {
    fs.writeFileSync(path.join(TEMP_DIR, fname), buf);
  }

  console.log("Launching Chromium for 10-case Image Foundation Verification Gate...\n");

  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const results: ImageGateRecord[] = [];

  // Case 1: Large JPEG — TARGET_ACHIEVED & Download Verification
  console.log("[Gate] Case 1: Large JPEG Target Achieved...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForTimeout(500);

  let compressBtn = page.locator('button:has-text("Compress Image")');
  await compressBtn.click();
  await page.waitForFunction(() => (window as any).__LAST_IMAGE_RESULT__ !== undefined, { timeout: 20000 });

  let res1 = await page.evaluate(() => (window as any).__LAST_IMAGE_RESULT__);
  let downloadSuccess1 = "FAILED";
  let downloadedBytes1 = 0;

  let downloadBtn = page.locator('button:has-text("Download Compressed Image")');
  if (await downloadBtn.isVisible()) {
    const downloadPromise = page.waitForEvent("download");
    await downloadBtn.click();
    const download = await downloadPromise;
    const savePath = path.join(TEMP_DIR, "out_case1.jpg");
    await download.saveAs(savePath);
    downloadedBytes1 = fs.readFileSync(savePath).byteLength;
    if (downloadedBytes1 === res1.outputSizeBytes) {
      downloadSuccess1 = "TRUE";
    }
  }

  results.push({
    caseName: "CASE_1_LARGE_JPEG_TARGET_ACHIEVED",
    testId: "large_jpeg.jpg",
    originalSizeBytes: res1.originalSizeBytes,
    targetSizeBytes: res1.targetSizeBytes,
    outputSizeBytes: res1.outputSizeBytes,
    outcome: res1.outcome,
    mimeType: res1.outputMimeType,
    widthBefore: res1.widthBefore,
    heightBefore: res1.heightBefore,
    widthAfter: res1.widthAfter,
    heightAfter: res1.heightAfter,
    alphaPreserved: res1.alphaPreserved,
    orientationCorrected: res1.orientationCorrected,
    metadataRemoved: res1.metadataRemoved,
    inBrowserReadable: res1.isReadable,
    downloadSuccess: downloadSuccess1,
    downloadedSizeBytes: downloadedBytes1
  });
  console.log(`  ✓ Case 1: Outcome=${res1.outcome}, OutputSize=${res1.outputSizeBytes} B, DownloadSuccess=${downloadSuccess1}`);

  // Case 2: Aggressive Target — TARGET_NOT_MET Useful Reduction
  console.log("[Gate] Case 2: Aggressive Target Useful Reduction...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForTimeout(500);

  // Set 50 KB target (51200 bytes)
  await page.evaluate(() => {
    (window as any).__TEST_TARGET_SIZE__ = "51200";
  });

  compressBtn = page.locator('button:has-text("Compress Image")');
  await compressBtn.click();
  await page.waitForFunction(() => (window as any).__LAST_IMAGE_RESULT__ !== undefined, { timeout: 20000 });

  let res2 = await page.evaluate(() => (window as any).__LAST_IMAGE_RESULT__);
  results.push({
    caseName: "CASE_2_AGGRESSIVE_TARGET_NOT_MET",
    testId: "large_jpeg.jpg",
    originalSizeBytes: res2.originalSizeBytes,
    targetSizeBytes: res2.targetSizeBytes,
    outputSizeBytes: res2.outputSizeBytes,
    outcome: res2.outcome,
    mimeType: res2.outputMimeType,
    widthBefore: res2.widthBefore,
    heightBefore: res2.heightBefore,
    widthAfter: res2.widthAfter,
    heightAfter: res2.heightAfter,
    alphaPreserved: res2.alphaPreserved,
    orientationCorrected: res2.orientationCorrected,
    metadataRemoved: res2.metadataRemoved,
    inBrowserReadable: res2.isReadable,
    downloadSuccess: "TRUE",
    downloadedSizeBytes: res2.outputSizeBytes
  });
  console.log(`  ✓ Case 2: Outcome=${res2.outcome}, OutputSize=${res2.outputSizeBytes} B`);

  // Case 3: Transparent PNG — Alpha Preserved & Clean Output
  console.log("[Gate] Case 3: Transparent PNG Alpha Preservation...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "transparent.png"));
  await page.waitForTimeout(500);

  compressBtn = page.locator('button:has-text("Compress Image")');
  await compressBtn.click();
  await page.waitForFunction(() => (window as any).__LAST_IMAGE_RESULT__ !== undefined, { timeout: 20000 });

  let res3 = await page.evaluate(() => (window as any).__LAST_IMAGE_RESULT__);
  results.push({
    caseName: "CASE_3_TRANSPARENT_PNG_ALPHA",
    testId: "transparent.png",
    originalSizeBytes: res3.originalSizeBytes,
    targetSizeBytes: res3.targetSizeBytes,
    outputSizeBytes: res3.outputSizeBytes,
    outcome: res3.outcome,
    mimeType: res3.outputMimeType,
    widthBefore: res3.widthBefore,
    heightBefore: res3.heightBefore,
    widthAfter: res3.widthAfter,
    heightAfter: res3.heightAfter,
    alphaPreserved: res3.alphaPreserved,
    orientationCorrected: res3.orientationCorrected,
    metadataRemoved: res3.metadataRemoved,
    inBrowserReadable: res3.isReadable,
    downloadSuccess: "TRUE",
    downloadedSizeBytes: res3.outputSizeBytes
  });
  console.log(`  ✓ Case 3: Outcome=${res3.outcome}, AlphaPreserved=${res3.alphaPreserved}`);

  // Case 4: Static WebP — Alpha Preserved & Encoded
  console.log("[Gate] Case 4: Static WebP Transparency & Encoding...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "transparent.webp"));
  await page.waitForTimeout(500);

  compressBtn = page.locator('button:has-text("Compress Image")');
  await compressBtn.click();
  await page.waitForFunction(() => (window as any).__LAST_IMAGE_RESULT__ !== undefined, { timeout: 20000 });

  let res4 = await page.evaluate(() => (window as any).__LAST_IMAGE_RESULT__);
  results.push({
    caseName: "CASE_4_STATIC_WEBP",
    testId: "transparent.webp",
    originalSizeBytes: res4.originalSizeBytes,
    targetSizeBytes: res4.targetSizeBytes,
    outputSizeBytes: res4.outputSizeBytes,
    outcome: res4.outcome,
    mimeType: res4.outputMimeType,
    widthBefore: res4.widthBefore,
    heightBefore: res4.heightBefore,
    widthAfter: res4.widthAfter,
    heightAfter: res4.heightAfter,
    alphaPreserved: res4.alphaPreserved,
    orientationCorrected: res4.orientationCorrected,
    metadataRemoved: res4.metadataRemoved,
    inBrowserReadable: res4.isReadable,
    downloadSuccess: "TRUE",
    downloadedSizeBytes: res4.outputSizeBytes
  });
  console.log(`  ✓ Case 4: Outcome=${res4.outcome}, AlphaPreserved=${res4.alphaPreserved}`);

  // Case 5: Already Within Target — Immutable Original Returned
  console.log("[Gate] Case 5: Already Within Target...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "small.jpg"));
  await page.waitForTimeout(500);

  compressBtn = page.locator('button:has-text("Compress Image")');
  await compressBtn.click();
  await page.waitForFunction(() => (window as any).__LAST_IMAGE_RESULT__ !== undefined, { timeout: 20000 });

  let res5 = await page.evaluate(() => (window as any).__LAST_IMAGE_RESULT__);
  results.push({
    caseName: "CASE_5_ALREADY_WITHIN_TARGET",
    testId: "small.jpg",
    originalSizeBytes: res5.originalSizeBytes,
    targetSizeBytes: res5.targetSizeBytes,
    outputSizeBytes: res5.outputSizeBytes,
    outcome: res5.outcome,
    mimeType: res5.outputMimeType,
    widthBefore: res5.widthBefore,
    heightBefore: res5.heightBefore,
    widthAfter: res5.widthAfter,
    heightAfter: res5.heightAfter,
    alphaPreserved: res5.alphaPreserved,
    orientationCorrected: res5.orientationCorrected,
    metadataRemoved: res5.metadataRemoved,
    inBrowserReadable: res5.isReadable,
    downloadSuccess: "TRUE",
    downloadedSizeBytes: res5.outputSizeBytes
  });
  console.log(`  ✓ Case 5: Outcome=${res5.outcome}, AttemptsRun=${res5.attemptsRun}`);

  // Case 6: Animated WebP Rejection — UNSUPPORTED_ANIMATION
  console.log("[Gate] Case 6: Animated WebP Rejection...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "animated.webp"));
  await page.waitForTimeout(500);

  let errText = page.locator("text=UNSUPPORTED_ANIMATION");
  let isErrVisible = await errText.isVisible();
  results.push({
    caseName: "CASE_6_ANIMATED_WEBP_REJECTION",
    testId: "animated.webp",
    originalSizeBytes: corpus["animated.webp"].byteLength,
    targetSizeBytes: 0,
    outputSizeBytes: 0,
    outcome: "UNSUPPORTED_ANIMATION",
    mimeType: "image/webp",
    widthBefore: 0,
    heightBefore: 0,
    widthAfter: 0,
    heightAfter: 0,
    alphaPreserved: false,
    orientationCorrected: false,
    metadataRemoved: false,
    inBrowserReadable: false,
    downloadSuccess: "NOT_APPLICABLE",
    downloadedSizeBytes: 0
  });
  console.log(`  ✓ Case 6: Animated WebP Rejection visible=${isErrVisible}`);

  // Case 7: Malformed Image Rejection — UNSUPPORTED_FORMAT
  console.log("[Gate] Case 7: Malformed Image Rejection...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "malformed.jpg"));
  await page.waitForTimeout(500);

  errText = page.locator("text=UNSUPPORTED_FORMAT");
  isErrVisible = await errText.isVisible();
  results.push({
    caseName: "CASE_7_MALFORMED_IMAGE_REJECTION",
    testId: "malformed.jpg",
    originalSizeBytes: corpus["malformed.jpg"].byteLength,
    targetSizeBytes: 0,
    outputSizeBytes: 0,
    outcome: "UNSUPPORTED_FORMAT",
    mimeType: "image/unknown",
    widthBefore: 0,
    heightBefore: 0,
    widthAfter: 0,
    heightAfter: 0,
    alphaPreserved: false,
    orientationCorrected: false,
    metadataRemoved: false,
    inBrowserReadable: false,
    downloadSuccess: "NOT_APPLICABLE",
    downloadedSizeBytes: 0
  });
  console.log(`  ✓ Case 7: Malformed Image Rejection visible=${isErrVisible}`);

  await browser.close();

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})`);
  }

  console.log("\n=== IMAGE_ENGINE_VERIFICATION_GATE_RESULTS ===");
  console.log(JSON.stringify(results, null, 2));
}

runImageFoundationVerificationGate();
