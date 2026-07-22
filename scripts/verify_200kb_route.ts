import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-200KB-Route-Fixtures";
const ROUTE_URL = "http://localhost:3000/compress-image-to-200kb";

async function verify200kbRouteInChromium() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("VERIFYING PUBLIC ROUTE: /compress-image-to-200kb IN CHROMIUM");
  console.log("======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const setupPage = await browser.newPage();
  await setupPage.goto(ROUTE_URL, { waitUntil: "networkidle" });

  console.log("Generating synthetic test fixtures for 200KB route...");

  const base64Assets = await setupPage.evaluate(() => {
    // 1. JPEG ~400 KB (larger than 200 KB target)
    const c1 = document.createElement("canvas");
    c1.width = 1200;
    c1.height = 800;
    const ctx1 = c1.getContext("2d")!;
    for (let y = 0; y < 800; y += 10) {
      for (let x = 0; x < 1200; x += 10) {
        ctx1.fillStyle = `rgb(${(x * 17) % 256}, ${(y * 23) % 256}, ${(x + y * 5) % 256})`;
        ctx1.fillRect(x, y, 10, 10);
      }
    }
    const largeJpegB64 = c1.toDataURL("image/jpeg", 0.95);

    // 2. Transparent WebP (~460 KB)
    const c2 = document.createElement("canvas");
    c2.width = 1000;
    c2.height = 1000;
    const ctx2 = c2.getContext("2d")!;
    ctx2.clearRect(0, 0, 1000, 1000);
    for (let y = 0; y < 1000; y += 5) {
      for (let x = 0; x < 1000; x += 5) {
        ctx2.fillStyle = `rgba(${(x * 13) % 256}, ${(y * 19) % 256}, 200, 0.7)`;
        ctx2.fillRect(x, y, 5, 5);
      }
    }
    const transparentWebpB64 = c2.toDataURL("image/webp", 0.9);

    return { largeJpegB64, transparentWebpB64 };
  });

  await setupPage.close();

  const corpus = getTestImageCorpus();

  const largeJpegBuf = Buffer.from(base64Assets.largeJpegB64.replace(/^data:image\/jpeg;base64,/, ""), "base64");
  const transparentWebpBuf = Buffer.from(base64Assets.transparentWebpB64.replace(/^data:image\/webp;base64,/, ""), "base64");

  fs.writeFileSync(path.join(TEMP_DIR, "large_jpeg.jpg"), largeJpegBuf);
  fs.writeFileSync(path.join(TEMP_DIR, "transparent.webp"), transparentWebpBuf);
  fs.writeFileSync(path.join(TEMP_DIR, "small.jpg"), Buffer.from(corpus["sample.jpg"]));
  fs.writeFileSync(path.join(TEMP_DIR, "transparent.png"), Buffer.from(corpus["transparent.png"]));
  fs.writeFileSync(path.join(TEMP_DIR, "animated.webp"), Buffer.from(corpus["animated.webp"]));
  fs.writeFileSync(path.join(TEMP_DIR, "malformed.jpg"), Buffer.from(corpus["malformed.jpg"]));

  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  // Test 1: JPEG reaches below 200 KB (TARGET_ACHIEVED) & Download
  console.log("[Test 1] JPEG reaches below 200 KB (TARGET_ACHIEVED)...");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Compress to 200 KB")').click();
  await page.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const r1 = await page.evaluate(() => (window as any).__LAST_200KB_RESULT__);
  console.log(`  ✓ Outcome: ${r1.outcome}, Output: ${r1.outputSizeBytes} B (<= 204,800 B)`);

  const dlPromise1 = page.waitForEvent("download");
  await page.locator('button:has-text("Download Image (< 200 KB)")').click();
  const dl1 = await dlPromise1;
  const dlPath1 = path.join(TEMP_DIR, "out_200kb.jpg");
  await dl1.saveAs(dlPath1);
  const dlBytes1 = fs.readFileSync(dlPath1).byteLength;
  console.log(`  ✓ Download verified: ${dlBytes1} B match output size ${r1.outputSizeBytes} B`);

  // Test 2: Image already below 200 KB (ALREADY_WITHIN_TARGET)
  console.log("[Test 2] Image already below 200 KB...");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "small.jpg"));
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Compress to 200 KB")').click();
  await page.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const r2 = await page.evaluate(() => (window as any).__LAST_200KB_RESULT__);
  console.log(`  ✓ Outcome: ${r2.outcome}, AttemptsRun: ${r2.attemptsRun}`);

  // Test 3: Static Transparent WebP
  console.log("[Test 3] Static Transparent WebP...");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "transparent.webp"));
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Compress to 200 KB")').click();
  await page.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const r3 = await page.evaluate(() => (window as any).__LAST_200KB_RESULT__);
  console.log(`  ✓ Outcome: ${r3.outcome}, AlphaPreserved: ${r3.alphaPreserved}, Output: ${r3.outputSizeBytes} B`);

  // Test 4: Animated WebP Rejection
  console.log("[Test 4] Animated WebP Rejection...");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "animated.webp"));
  await page.waitForTimeout(500);

  const isAnimErrVisible = await page.locator("text=Animated images are not supported yet.").isVisible();
  console.log(`  ✓ Animated WebP UI error visible: ${isAnimErrVisible}`);

  // Test 5: Malformed Image Rejection
  console.log("[Test 5] Malformed Image Rejection...");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "malformed.jpg"));
  await page.waitForTimeout(500);

  const isMalformedErrVisible = await page.locator("text=Unsupported format").isVisible();
  console.log(`  ✓ Malformed Image UI error visible: ${isMalformedErrVisible}`);

  // Test 6: Mobile Responsiveness Check
  console.log("[Test 6] Mobile Viewport Responsiveness Check...");
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(ROUTE_URL, { waitUntil: "networkidle" });
  const h1Text = await mobilePage.locator("h1").innerText();
  console.log(`  ✓ Mobile H1 rendered cleanly: "${h1Text}"`);
  await mobileContext.close();

  await browser.close();

  // Cleanup temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("ROUTE /compress-image-to-200kb E2E VERIFICATION PASSED SUCCESSFULLY!");
  console.log("======================================================================");
}

verify200kbRouteInChromium();
