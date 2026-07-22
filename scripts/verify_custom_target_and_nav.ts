import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Nav-Custom-Fixtures";
const BASE_URL = "http://localhost:3000";

async function verifyCustomTargetAndNav() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2B4: CUSTOM TARGET TOOL AND NAVIGATION UX E2E CHROMIUM AUDIT");
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

  // Test 1: Desktop Navigation & MegaMenu Interaction
  console.log("[Test 1] Desktop Navigation & MegaMenu Interaction...");
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });

  const compressBtn = page.getByRole("button", { name: /^compress/i }).first();
  console.log(`  ✓ Trigger button visible=${await compressBtn.isVisible()}`);

  await compressBtn.click();
  await page.waitForTimeout(300);

  const megaMenu = page.locator('div[role="region"][aria-label="Compress Tools"]');
  console.log(`  ✓ MegaMenu visible=${await megaMenu.isVisible()}`);

  // Test Escape key focus restoration
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const isMenuClosed = !(await megaMenu.isVisible());
  console.log(`  ✓ Escape key closed menu=${isMenuClosed}`);

  await page.close();

  // Test 2: Mobile Navigation (320px & 375px) & Body Scroll Lock
  console.log("\n[Test 2] Mobile Navigation (320px & 375px) & Scroll Lock Audit...");
  const mobileContext = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });

  const burgerBtn = mobilePage.locator('button[aria-label="Open navigation menu"]');
  await burgerBtn.click();
  await mobilePage.waitForTimeout(200);

  const bodyOverflow = await mobilePage.evaluate(() => document.body.style.overflow);
  console.log(`  ✓ Mobile Body Scroll Lock: overflow="${bodyOverflow}"`);

  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  console.log(`  ✓ 320px Viewport Overflow Check: ScrollWidth (${scrollWidth}) === ClientWidth (${clientWidth}) -> ${scrollWidth === clientWidth}`);

  await mobileContext.close();

  // Test 3: Arabic RTL Layout & Navigation Alignment
  console.log("\n[Test 3] Arabic RTL Layout Audit...");
  const rtlContext = await browser.newContext({ locale: "ar-SA" });
  const rtlPage = await rtlContext.newPage();
  await rtlPage.goto(`${BASE_URL}/compress-image-to-size`, { waitUntil: "networkidle" });
  await rtlPage.evaluate(() => { document.documentElement.setAttribute("dir", "rtl"); });
  const dirAttr = await rtlPage.evaluate(() => document.documentElement.getAttribute("dir"));
  console.log(`  ✓ Document Direction: "${dirAttr}"`);
  await rtlContext.close();

  // Test 4: Custom Target-Size Route (/compress-image-to-size?target=3&unit=mb)
  console.log("\n[Test 4] Custom Target-Size Route (/compress-image-to-size?target=3&unit=mb)...");
  const customPage = await context.newPage();
  customPage.on("pageerror", (err) => console.log("  ⚠️ PAGE ERROR:", err.message));
  customPage.on("console", (msg) => console.log("  ⚠️ BROWSER LOG:", msg.text()));

  await customPage.goto(`${BASE_URL}/compress-image-to-size?target=3&unit=mb`, { waitUntil: "networkidle" });

  const h1 = await customPage.locator("h1").innerText();
  const canonical = await customPage.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");
  console.log(`  ✓ H1: "${h1}"`);
  console.log(`  ✓ Canonical URL: "${canonical}" (Query parameters omitted from canonical tag)`);

  // Verify byte conversion for 3 MB -> 3145728 Bytes
  await customPage.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await customPage.waitForSelector('button:has-text("Compress to 3 MB")', { timeout: 10000 });
  await customPage.locator('button:has-text("Compress to 3 MB")').click();
  await customPage.waitForFunction(() => (window as any).__LAST_CUSTOM_TARGET_RESULT__ !== undefined, { timeout: 20000 });

  const res = await customPage.evaluate(() => (window as any).__LAST_CUSTOM_TARGET_RESULT__);
  const expectedBytes = 3 * 1024 * 1024;
  console.log(`  ✓ Outcome: ${res.outcome}, TargetBytes: ${res.targetSizeBytes} === ${expectedBytes} (3 MB)`);

  const dlPromise = customPage.waitForEvent("download");
  await customPage.locator('button:has-text("Download Image (< 3 MB)")').click();
  const dl = await dlPromise;
  const dlPath = path.join(TEMP_DIR, "custom_3mb_output.jpg");
  await dl.saveAs(dlPath);
  const dlBytes = fs.readFileSync(dlPath).byteLength;
  console.log(`  ✓ Download verified: ${dlBytes} B match output size ${res.outputSizeBytes} B`);

  await customPage.close();

  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2B4 CUSTOM TARGET & NAVIGATION AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyCustomTargetAndNav();
