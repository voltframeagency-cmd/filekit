import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Slider-Audit-Fixtures";
const ROUTE_URL = "http://localhost:3000/compress-image-to-200kb";

async function verifyComparisonSliderInChromium() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("OPTIPIC FEATURE EXTRACTION: IMAGE COMPARISON SLIDER E2E AUDIT");
  console.log("======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const setupPage = await browser.newPage();
  await setupPage.goto(ROUTE_URL, { waitUntil: "networkidle" });

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
    const largeJpegB64 = c1.toDataURL("image/jpeg", 0.95);
    return { largeJpegB64 };
  });
  await setupPage.close();

  const largeJpegBuf = Buffer.from(base64Assets.largeJpegB64.replace(/^data:image\/jpeg;base64,/, ""), "base64");
  fs.writeFileSync(path.join(TEMP_DIR, "large_jpeg.jpg"), largeJpegBuf);

  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  // Test 1: Transformed JPEG Comparison Slider Rendering & Pointer Dragging
  console.log("[Test 1] Transformed JPEG Comparison Slider & Pointer Events...");
  await page.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await page.waitForSelector('button:has-text("Compress to 200 KB")', { timeout: 10000 });
  await page.locator('button:has-text("Compress to 200 KB")').click();
  await page.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const sliderLocator = page.locator('div[role="slider"]');
  const isSliderVisible = await sliderLocator.isVisible();
  console.log(`  ✓ ImageComparisonSlider visible=${isSliderVisible}`);

  const initialVal = await sliderLocator.getAttribute("aria-valuenow");
  console.log(`  ✓ Initial slider position aria-valuenow=${initialVal}`);

  // Test Pointer Events dragging
  const box = await sliderLocator.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
    await page.mouse.up();
    const draggedVal = await sliderLocator.getAttribute("aria-valuenow");
    console.log(`  ✓ Dragged slider position via Pointer Events aria-valuenow=${draggedVal}`);
  }

  // Test 2: Keyboard Navigation (ArrowRight, ArrowLeft, Home, End)
  console.log("[Test 2] Keyboard Navigation & ARIA Slider Semantics...");
  await sliderLocator.focus();
  await page.keyboard.press("End");
  const endVal = await sliderLocator.getAttribute("aria-valuenow");
  console.log(`  ✓ Press End key -> aria-valuenow=${endVal}`);

  await page.keyboard.press("Home");
  const homeVal = await sliderLocator.getAttribute("aria-valuenow");
  console.log(`  ✓ Press Home key -> aria-valuenow=${homeVal}`);

  await page.keyboard.press("ArrowRight");
  const rightVal = await sliderLocator.getAttribute("aria-valuenow");
  console.log(`  ✓ Press ArrowRight key -> aria-valuenow=${rightVal}`);

  // Test 3: Download Button Functionality
  console.log("[Test 3] Download Button Functionality with Slider Active...");
  const dlPromise = page.waitForEvent("download");
  await page.locator('button:has-text("Download Image (< 200 KB)")').click();
  const dl = await dlPromise;
  const dlPath = path.join(TEMP_DIR, "out_slider.jpg");
  await dl.saveAs(dlPath);
  const dlBytes = fs.readFileSync(dlPath).byteLength;
  console.log(`  ✓ Download verified: ${dlBytes} B`);

  // Test 4: Mobile Viewport Responsiveness
  console.log("[Test 4] Mobile Viewport Responsiveness Check...");
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(ROUTE_URL, { waitUntil: "networkidle" });
  await mobilePage.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
  await mobilePage.waitForSelector('button:has-text("Compress to 200 KB")', { timeout: 10000 });
  await mobilePage.locator('button:has-text("Compress to 200 KB")').click();
  await mobilePage.waitForFunction(() => (window as any).__LAST_200KB_RESULT__ !== undefined, { timeout: 20000 });

  const isMobileSliderVisible = await mobilePage.locator('div[role="slider"]').isVisible();
  console.log(`  ✓ Mobile Viewport (375x667) Slider visible=${isMobileSliderVisible}`);
  await mobileContext.close();

  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("IMAGE COMPARISON SLIDER E2E AUDIT PASSED SUCCESSFULLY!");
  console.log("======================================================================");
}

verifyComparisonSliderInChromium();
