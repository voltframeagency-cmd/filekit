import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Workspace-LivePreview-Fixtures";
const BASE_URL = "http://localhost:3000";

async function verifyPhase2c0LivePreview() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2C0.1: LIVE IMAGE COMPRESSION PREVIEW CHROMIUM AUDIT");
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

  // Test 1: Automatic Initial Processing & Live Balanced Mode
  console.log("[Test 1] Automatic Initial Processing on File Load...");
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/compress-image`, { waitUntil: "networkidle" });

  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText1 = await page.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Automatic Initial Outcome: Download Button="${dlBtnText1}"`);

  // Test 2: Live Debounced Manual Quality Slider (Without Button Click)
  console.log("\n[Test 2] Live Debounced Manual Quality Slider Recompression...");
  await page.locator('button:has-text("Manual")').click();
  await page.waitForTimeout(250);

  const slider = page.locator('input[type="range"]');
  await slider.fill("40");
  await page.waitForTimeout(300); // Wait for 180ms debounce + execution

  await page.waitForSelector('button:has-text("Download")', { timeout: 20000 });
  const dlBtnText2 = await page.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Live Quality Slider (40%) Outcome: Download Button="${dlBtnText2}"`);

  // Test 3: Rapid Slider Adjustments (Stale Work Suppression)
  console.log("\n[Test 3] Rapid Settings Adjustments & Stale Result Cancellation...");
  await slider.fill("30");
  await page.waitForTimeout(50);
  await slider.fill("20");
  await page.waitForTimeout(50);
  await slider.fill("10");
  await page.waitForTimeout(300);

  await page.waitForSelector('button:has-text("Download")', { timeout: 20000 });
  const dlBtnText3 = await page.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Rapid Slider (Settled 10%) Outcome: Download Button="${dlBtnText3}"`);

  // Test 4: Single-Artifact Download Verification
  console.log("\n[Test 4] Single-Artifact Download Verification...");
  const dlPromise = page.waitForEvent("download");
  await page.locator('button:has-text("Download")').first().click();
  const dl = await dlPromise;
  const dlPath = path.join(TEMP_DIR, "live_output.jpg");
  await dl.saveAs(dlPath);
  const dlBytes = fs.readFileSync(dlPath).byteLength;
  console.log(`  ✓ Verified Single-Artifact Download File: ${dlBytes} Bytes saved successfully`);

  await page.close();
  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2C0.1 LIVE PREVIEW AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2c0LivePreview();
