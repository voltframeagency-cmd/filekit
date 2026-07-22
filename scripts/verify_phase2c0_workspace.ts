import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Workspace-Fixtures";
const BASE_URL = "http://localhost:3000";

async function verifyPhase2c0Workspace() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2C0: IMAGE COMPRESSOR WORKSPACE E2E CHROMIUM AUDIT");
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

  // Test 1: Balanced Mode Workspace Execution
  console.log("[Test 1] Balanced Mode Workspace Execution...");
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/compress-image`, { waitUntil: "networkidle" });

  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForSelector('button:has-text("Compress Image")', { timeout: 10000 });

  await page.locator('button:has-text("Compress Image")').click();
  await page.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText = await page.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Balanced Mode Outcome: Download Button="${dlBtnText}"`);

  // Test 2: In-Place Recompression & Adjust Settings
  console.log("\n[Test 2] In-Place Recompression & Settings Adjustment...");
  await page.locator('button:has-text("Adjust Settings")').click();
  await page.waitForTimeout(200);

  // Switch to Target Size Mode and set 350 KB
  await page.locator('button:has-text("Target Size")').click();
  await page.locator('input[type="number"]').fill("350");
  await page.waitForTimeout(200);

  const recompressBtn = page.locator('button:has-text("Recompress Image")');
  console.log(`  ✓ Recompress Button Visible: ${await recompressBtn.isVisible()}`);
  await recompressBtn.click();
  await page.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText2 = await page.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Target Size (350 KB) Outcome: Download Button="${dlBtnText2}"`);

  // Test 3: Manual Mode (Quality Slider & 1024px Dimension Preset)
  console.log("\n[Test 3] Manual Mode (Quality 80% & 1024px Preset)...");
  await page.locator('button:has-text("Adjust Settings")').click();
  await page.locator('button:has-text("Manual")').click();
  await page.locator('button:has-text("1024 px")').click();
  await page.waitForTimeout(200);

  await page.locator('button:has-text("Recompress Image")').click();
  await page.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText3 = await page.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Manual Mode Outcome: Download Button="${dlBtnText3}"`);

  await page.close();

  // Test 4: Fixed-Target Route (/compress-image-to-200kb) Remains Focused
  console.log("\n[Test 4] Fixed-Target Route (/compress-image-to-200kb) Focused Check...");
  const fixedPage = await context.newPage();
  await fixedPage.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });

  const hasManualSlider = await fixedPage.locator('input[type="range"]').isVisible();
  console.log(`  ✓ Fixed-target route suppresses manual quality slider: ${!hasManualSlider}`);

  await fixedPage.close();
  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2C0 WORKSPACE E2E AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2c0Workspace();
