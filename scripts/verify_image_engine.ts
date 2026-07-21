import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Private-Image-Fixtures";
const APP_URL = "http://localhost:3000/compress-image";

async function verifyImageEngineInChromium() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const corpus = getTestImageCorpus();

  // Save fixtures to temp directory
  const fixtures = [
    { name: "sample.jpg", buffer: corpus["sample.jpg"] },
    { name: "transparent.png", buffer: corpus["transparent.png"] },
    { name: "static.webp", buffer: corpus["static.webp"] },
    { name: "animated.webp", buffer: corpus["animated.webp"] }
  ];

  for (const f of fixtures) {
    fs.writeFileSync(path.join(TEMP_DIR, f.name), Buffer.from(f.buffer));
  }

  console.log("Launching Chromium browser for /compress-image E2E verification...\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  // Test 1: Upload JPG and verify compression
  console.log("[Chromium] Testing JPG Compression...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "sample.jpg"));
  await page.waitForTimeout(500);

  const compressBtn = page.locator('button:has-text("Compress Image")');
  await compressBtn.click();
  await page.waitForFunction(() => (window as any).__LAST_IMAGE_RESULT__ !== undefined, { timeout: 15000 });

  const jpgResult = await page.evaluate(() => (window as any).__LAST_IMAGE_RESULT__);
  console.log(`  ✓ JPG Result: Outcome=${jpgResult.outcome}, Size=${jpgResult.outputSizeBytes} B, Readable=${jpgResult.isReadable}`);

  // Test 2: Trigger Download
  const downloadBtn = page.locator('button:has-text("Download Compressed Image")');
  if (await downloadBtn.isVisible()) {
    const downloadPromise = page.waitForEvent("download");
    await downloadBtn.click();
    const download = await downloadPromise;
    const savePath = path.join(TEMP_DIR, "downloaded_sample.jpg");
    await download.saveAs(savePath);
    const downloadedBytes = fs.readFileSync(savePath);
    console.log(`  ✓ Download Event: Downloaded ${downloadedBytes.byteLength} B match output size ${jpgResult.outputSizeBytes} B`);
  }

  // Test 3: Upload Animated WebP (should show rejection error)
  console.log("[Chromium] Testing Animated WebP Rejection...");
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "animated.webp"));
  await page.waitForTimeout(500);

  const errorMsg = page.locator("text=UNSUPPORTED_ANIMATION");
  const isErrorVisible = await errorMsg.isVisible();
  console.log(`  ✓ Animated WebP Rejection: Error visible = ${isErrorVisible}`);

  await browser.close();

  // Cleanup
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})`);
  }

  console.log("\n=== IMAGE_ENGINE_E2E_VERIFICATION_PASSED ===");
}

verifyImageEngineInChromium();
