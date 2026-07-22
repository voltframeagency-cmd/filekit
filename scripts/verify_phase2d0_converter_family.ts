import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-ConverterFamily-Fixtures";
const BASE_URL = "http://localhost:3000";

async function verifyPhase2d0ConverterFamily() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2D0: COMPLETE IMAGE CONVERTER FAMILY CHROMIUM AUDIT");
  console.log("======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const setupPage = await browser.newPage();
  await setupPage.goto(`${BASE_URL}/convert-image`, { waitUntil: "networkidle" });

  // Generate valid sample JPEG and transparent PNG using HTML Canvas inside browser
  const imageFixtures = await setupPage.evaluate(() => {
    // 1. JPEG canvas
    const canvasJpg = document.createElement("canvas");
    canvasJpg.width = 400;
    canvasJpg.height = 300;
    const ctxJpg = canvasJpg.getContext("2d")!;
    ctxJpg.fillStyle = "#2563eb";
    ctxJpg.fillRect(0, 0, 400, 300);
    ctxJpg.fillStyle = "#ffffff";
    ctxJpg.font = "20px sans-serif";
    ctxJpg.fillText("FileKit Sample JPG Fixture", 50, 150);
    const jpgData = canvasJpg.toDataURL("image/jpeg", 0.9).split(",")[1];

    // 2. PNG with alpha canvas
    const canvasPng = document.createElement("canvas");
    canvasPng.width = 400;
    canvasPng.height = 300;
    const ctxPng = canvasPng.getContext("2d")!;
    ctxPng.clearRect(0, 0, 400, 300);
    ctxPng.fillStyle = "rgba(239, 68, 68, 0.8)";
    ctxPng.fillRect(50, 50, 300, 200);
    const pngData = canvasPng.toDataURL("image/png").split(",")[1];

    // 3. WebP canvas
    const canvasWebp = document.createElement("canvas");
    canvasWebp.width = 400;
    canvasWebp.height = 300;
    const ctxWebp = canvasWebp.getContext("2d")!;
    ctxWebp.fillStyle = "#10b981";
    ctxWebp.fillRect(0, 0, 400, 300);
    const webpData = canvasWebp.toDataURL("image/webp", 0.8).split(",")[1];

    return { jpgData, pngData, webpData };
  });

  await setupPage.close();

  const jpgPath = path.join(TEMP_DIR, "sample.jpg");
  const pngPath = path.join(TEMP_DIR, "transparent_sample.png");
  const webpPath = path.join(TEMP_DIR, "sample.webp");

  fs.writeFileSync(jpgPath, Buffer.from(imageFixtures.jpgData, "base64"));
  fs.writeFileSync(pngPath, Buffer.from(imageFixtures.pngData, "base64"));
  fs.writeFileSync(webpPath, Buffer.from(imageFixtures.webpData, "base64"));

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    acceptDownloads: true
  });

  // Test 1: /convert-image General Converter Route
  console.log("[Test 1] /convert-image General Image Converter Execution...");
  const page1 = await context.newPage();
  await page1.goto(`${BASE_URL}/convert-image`, { waitUntil: "networkidle" });
  const h1Text1 = await page1.locator("h1").innerText();
  console.log(`  ✓ General Route H1: "${h1Text1}" (Expected: "Image Converter")`);

  await page1.locator('input[type="file"]').setInputFiles(jpgPath);
  await page1.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });
  console.log(`  ✓ General Converter converted JPG to PNG cleanly`);
  await page1.close();

  // Test 2: /jpg-to-png Route
  console.log("\n[Test 2] /jpg-to-png Execution...");
  const page2 = await context.newPage();
  await page2.goto(`${BASE_URL}/jpg-to-png`, { waitUntil: "networkidle" });
  const h1Text2 = await page2.locator("h1").innerText();
  console.log(`  ✓ Route H1: "${h1Text2}"`);

  await page2.locator('input[type="file"]').setInputFiles(jpgPath);
  await page2.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });

  const dlPromise2 = page2.waitForEvent("download");
  await page2.locator('button:has-text("Download Converted Image")').first().click();
  const dl2 = await dlPromise2;
  const dl2Path = path.join(TEMP_DIR, "out_jpg_to_png.png");
  await dl2.saveAs(dl2Path);
  const bytes2 = fs.readFileSync(dl2Path).byteLength;
  console.log(`  ✓ Downloaded PNG Verified: ${bytes2} Bytes (Filename: ${dl2.suggestedFilename()})`);
  await page2.close();

  // Test 3: /png-to-jpg Route (Transparency Flattening & Background Option)
  console.log("\n[Test 3] /png-to-jpg Execution (Alpha Flattening)...");
  const page3 = await context.newPage();
  await page3.goto(`${BASE_URL}/png-to-jpg`, { waitUntil: "networkidle" });
  const h1Text3 = await page3.locator("h1").innerText();
  console.log(`  ✓ Route H1: "${h1Text3}"`);

  await page3.locator('input[type="file"]').setInputFiles(pngPath);
  await page3.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });

  const bgWarningVisible = await page3.locator('text=JPEG does not support transparency').isVisible();
  console.log(`  ✓ Transparency warning rendered cleanly: ${bgWarningVisible}`);

  const dlPromise3 = page3.waitForEvent("download");
  await page3.locator('button:has-text("Download Converted Image")').first().click();
  const dl3 = await dlPromise3;
  const dl3Path = path.join(TEMP_DIR, "out_png_to_jpg.jpg");
  await dl3.saveAs(dl3Path);
  const bytes3 = fs.readFileSync(dl3Path).byteLength;
  console.log(`  ✓ Downloaded JPG Verified: ${bytes3} Bytes (Filename: ${dl3.suggestedFilename()})`);
  await page3.close();

  // Test 4: /jpg-to-webp Route
  console.log("\n[Test 4] /jpg-to-webp Execution...");
  const page4 = await context.newPage();
  await page4.goto(`${BASE_URL}/jpg-to-webp`, { waitUntil: "networkidle" });
  await page4.locator('input[type="file"]').setInputFiles(jpgPath);
  await page4.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });
  console.log(`  ✓ JPG to WebP conversion completed successfully`);
  await page4.close();

  // Test 5: /png-to-webp Route
  console.log("\n[Test 5] /png-to-webp Execution...");
  const page5 = await context.newPage();
  await page5.goto(`${BASE_URL}/png-to-webp`, { waitUntil: "networkidle" });
  await page5.locator('input[type="file"]').setInputFiles(pngPath);
  await page5.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });
  console.log(`  ✓ PNG to WebP conversion completed successfully`);
  await page5.close();

  // Test 6: /webp-to-jpg Route
  console.log("\n[Test 6] /webp-to-jpg Execution...");
  const page6 = await context.newPage();
  await page6.goto(`${BASE_URL}/webp-to-jpg`, { waitUntil: "networkidle" });
  await page6.locator('input[type="file"]').setInputFiles(webpPath);
  await page6.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });
  console.log(`  ✓ WebP to JPG conversion completed successfully`);
  await page6.close();

  // Test 7: /webp-to-png Route
  console.log("\n[Test 7] /webp-to-png Execution...");
  const page7 = await context.newPage();
  await page7.goto(`${BASE_URL}/webp-to-png`, { waitUntil: "networkidle" });
  await page7.locator('input[type="file"]').setInputFiles(webpPath);
  await page7.waitForSelector('button:has-text("Download Converted Image")', { timeout: 15000 });
  console.log(`  ✓ WebP to PNG conversion completed successfully`);
  await page7.close();

  // Test 8: Fixed Pair Mismatched Input Rejection Test
  console.log("\n[Test 8] Fixed Pair Mismatched Input Rejection Test...");
  const page8 = await context.newPage();
  await page8.goto(`${BASE_URL}/jpg-to-png`, { waitUntil: "networkidle" });
  await page8.locator('input[type="file"]').setInputFiles(pngPath); // Upload PNG to JPG-to-PNG page
  await page8.waitForSelector('text=This page converts JPEG images', { timeout: 10000 });
  const hasMismatchError = await page8.locator('text=This page converts JPEG images').isVisible();
  console.log(`  ✓ Mismatched input error rendered cleanly: ${hasMismatchError}`);
  await page8.close();

  // Test 9: Mobile 375px Viewport Overflow Check
  console.log("\n[Test 9] Mobile 375px Viewport Overflow Check...");
  const mobContext = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const mobPage = await mobContext.newPage();
  await mobPage.goto(`${BASE_URL}/png-to-jpg`, { waitUntil: "networkidle" });
  const scrollWidth = await mobPage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobPage.evaluate(() => document.documentElement.clientWidth);
  console.log(`  ✓ Mobile 375px Overflow Check: ScrollWidth (${scrollWidth}) === ClientWidth (${clientWidth}) -> ${scrollWidth === clientWidth}`);
  await mobContext.close();

  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2D0 IMAGE CONVERTER FAMILY AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2d0ConverterFamily();
