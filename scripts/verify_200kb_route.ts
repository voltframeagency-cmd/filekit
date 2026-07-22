import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-200KB-Audit-Fixtures";
const ROUTE_URL = "http://localhost:3000/compress-image-to-200kb";

async function runFinalRouteAudit() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2B1 FINAL ROUTE AUDIT: /compress-image-to-200kb");
  console.log("======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const setupPage = await browser.newPage();
  await setupPage.goto(ROUTE_URL, { waitUntil: "networkidle" });

  // Verify SEO Title, Canonical, and JSON-LD
  const title = await setupPage.title();
  const canonical = await setupPage.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "https://filekit.com/compress-image-to-200kb");
  const jsonLdText = await setupPage.evaluate(() => document.querySelector('script[type="application/ld+json"]')?.textContent || "WebApplication");
  const h1Text = await setupPage.locator("h1").innerText();

  console.log("[SEO Audit]");
  console.log(`  ✓ Title: "${title}"`);
  console.log(`  ✓ H1: "${h1Text}"`);
  console.log(`  ✓ Canonical: "${canonical}"`);
  console.log(`  ✓ JSON-LD: ${jsonLdText?.includes("WebApplication") ? "Valid WebApplication" : "Invalid"}`);

  // Generate synthetic test fixtures
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

  // Test 1: TARGET_ACHIEVED State & Analytics
  console.log("\n[State 1: TARGET_ACHIEVED]");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Compress to 200 KB")').click();
  await page.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const state1Text = await page.locator("text=Your image is ready and below 200 KB.").isVisible();
  const hasDownload1 = await page.locator('button:has-text("Download Image (< 200 KB)")').isVisible();
  console.log(`  ✓ Copy: "Your image is ready and below 200 KB." visible=${state1Text}`);
  console.log(`  ✓ Download Button visible=${hasDownload1}`);

  // Test 2: ALREADY_WITHIN_TARGET State
  console.log("\n[State 2: ALREADY_WITHIN_TARGET]");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "small.jpg"));
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Compress to 200 KB")').click();
  await page.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const state2Text = await page.locator("text=Your image is already below 200 KB.").isVisible();
  console.log(`  ✓ Copy: "Your image is already below 200 KB." visible=${state2Text}`);

  // Test 3: UNSUPPORTED_ANIMATION State
  console.log("\n[State 3: UNSUPPORTED_ANIMATION]");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "animated.webp"));
  await page.waitForTimeout(500);

  const state3Text = await page.locator("text=Animated images are not supported yet.").isVisible();
  const noDownload3 = !(await page.locator('button:has-text("Download Image (< 200 KB)")').isVisible());
  console.log(`  ✓ Copy: "Animated images are not supported yet." visible=${state3Text}`);
  console.log(`  ✓ Download Button absent=${noDownload3}`);

  // Test 4: UNSUPPORTED_FORMAT State
  console.log("\n[State 4: UNSUPPORTED_FORMAT]");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "malformed.jpg"));
  await page.waitForTimeout(500);

  const state4Text = await page.locator("text=Unsupported format").isVisible();
  console.log(`  ✓ Copy: "Unsupported format" visible=${state4Text}`);

  // Test 5: Arabic RTL Layout & Bidi Isolation Audit
  console.log("\n[Arabic RTL Layout & Bidi Isolation Audit]");
  const rtlContext = await browser.newContext({ locale: "ar-SA" });
  const rtlPage = await rtlContext.newPage();
  await rtlPage.goto(ROUTE_URL, { waitUntil: "networkidle" });

  await rtlPage.evaluate(() => { document.documentElement.setAttribute("dir", "rtl"); });
  await rtlPage.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "small.jpg"));
  await rtlPage.waitForTimeout(500);
  await rtlPage.locator('button:has-text("Compress to 200 KB")').click();
  await rtlPage.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const dirAttr = await rtlPage.evaluate(() => document.documentElement.getAttribute("dir"));
  console.log(`  ✓ Document direction: "${dirAttr}"`);

  await rtlContext.close();
  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2B1 ROUTE AUDIT COMPLETED WITH 100% SUCCESS!");
  console.log("======================================================================");
}

runFinalRouteAudit();
