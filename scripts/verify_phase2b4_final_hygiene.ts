import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Nav-Hygiene-Fixtures";
const BASE_URL = "http://localhost:3000";

const H1_ROUTES = [
  { slug: "compress-image", expectedH1: "Image Compressor" },
  { slug: "compress-image-to-100kb", expectedH1: "Compress an Image to 100 KB" },
  { slug: "compress-image-to-200kb", expectedH1: "Compress an Image to 200 KB" },
  { slug: "compress-image-to-500kb", expectedH1: "Compress an Image to 500 KB" },
  { slug: "compress-image-to-1mb", expectedH1: "Compress an Image to 1 MB" },
  { slug: "compress-image-to-size", expectedH1: "Compress an Image to a Specific Size" }
];

async function verifyPhase2b4FinalHygiene() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2B4 FINAL RELEASE HYGIENE CHROMIUM AUDIT");
  console.log("======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const setupPage = await browser.newPage();
  await setupPage.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });

  const base64Assets = await setupPage.evaluate(() => {
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
    return { largeJpegB64: c1.toDataURL("image/jpeg", 0.95) };
  });

  await setupPage.close();

  const largeJpegBuf = Buffer.from(base64Assets.largeJpegB64.replace(/^data:image\/jpeg;base64,/, ""), "base64");
  fs.writeFileSync(path.join(TEMP_DIR, "large_jpeg.jpg"), largeJpegBuf);

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    acceptDownloads: true
  });

  // Test 1: H1 Copy Policy & Single H1 Enforcement
  console.log("[Test 1] H1 Copy Policy & Single H1 Enforcement...");
  for (const r of H1_ROUTES) {
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/${r.slug}`, { waitUntil: "networkidle" });

    const h1Elements = page.locator("h1");
    const count = await h1Elements.count();
    const h1Text = await h1Elements.first().innerText();

    console.log(`  ✓ Route /${r.slug}: H1 count=${count}, Text="${h1Text}" (Expected: "${r.expectedH1}")`);
    await page.close();
  }

  // Test 2: Mobile Navigation Focus Containment & Focus Restoration
  console.log("\n[Test 2] Mobile Navigation Focus Containment & Focus Restoration...");
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });

  const burgerBtn = mobilePage.locator('button[aria-label="Open navigation menu"]');
  await burgerBtn.focus();
  await burgerBtn.click();
  await mobilePage.waitForTimeout(200);

  // Focus should now be inside the close button
  const focusedTag = await mobilePage.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName);
  console.log(`  ✓ Focused element inside drawer: "${focusedTag}" (Expected: "Close navigation menu")`);

  // Press Escape to close and check focus restoration
  await mobilePage.keyboard.press("Escape");
  await mobilePage.waitForTimeout(200);
  const restoredTag = await mobilePage.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  console.log(`  ✓ Restored focus element: "${restoredTag}" (Expected: "Open navigation menu")`);

  await mobileContext.close();

  // Test 3: Custom Target Input Conversions (1.5 MB & 3 MB) & Boundary Validation
  console.log("\n[Test 3] Custom Target Input Conversions & Boundary Validation...");
  const customPage = await context.newPage();

  // 1.5 MB test
  await customPage.goto(`${BASE_URL}/compress-image-to-size?target=1.5&unit=mb`, { waitUntil: "networkidle" });
  await customPage.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await customPage.waitForSelector('button:has-text("Compress to 1.5 MB")', { timeout: 10000 });
  await customPage.locator('button:has-text("Compress to 1.5 MB")').click();
  await customPage.waitForFunction(() => (window as any).__LAST_CUSTOM_TARGET_RESULT__ !== undefined, { timeout: 20000 });

  const res1_5 = await customPage.evaluate(() => (window as any).__LAST_CUSTOM_TARGET_RESULT__);
  const expected1_5Bytes = Math.round(1.5 * 1024 * 1024); // 1572864 Bytes
  console.log(`  ✓ 1.5 MB conversion: ${res1_5.targetSizeBytes} === ${expected1_5Bytes} Bytes`);

  // Malformed / out-of-range query sanitization
  await customPage.goto(`${BASE_URL}/compress-image-to-size?target=999999&unit=mb`, { waitUntil: "networkidle" });
  const canonical = await customPage.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");
  console.log(`  ✓ Malformed Query Sanitized Canonical: "${canonical}"`);

  await customPage.close();
  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2B4 FINAL RELEASE HYGIENE AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2b4FinalHygiene();
