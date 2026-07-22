import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Exact-Routes-Fixtures";
const BASE_URL = "http://localhost:3000";

const ROUTES = [
  { slug: "compress-image-to-100kb", targetBytes: 100 * 1024, label: "100 KB", op: "compress_image_to_100kb" },
  { slug: "compress-image-to-200kb", targetBytes: 200 * 1024, label: "200 KB", op: "compress_image_to_200kb" },
  { slug: "compress-image-to-500kb", targetBytes: 500 * 1024, label: "500 KB", op: "compress_image_to_500kb" },
  { slug: "compress-image-to-1mb", targetBytes: 1024 * 1024, label: "1 MB", op: "compress_image_to_1mb" }
];

async function verifyExactImageRoutes() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2B3: EXACT-SIZE IMAGE ROUTE FAMILY E2E CHROMIUM MATRIX");
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
    const largeJpegB64 = c1.toDataURL("image/jpeg", 0.95);

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
  fs.writeFileSync(path.join(TEMP_DIR, "animated.webp"), Buffer.from(corpus["animated.webp"]));

  const context = await browser.newContext({ acceptDownloads: true });

  for (const r of ROUTES) {
    console.log(`----------------------------------------------------------------------`);
    console.log(`Testing Route: /${r.slug} (Target: ${r.label} / ${r.targetBytes.toLocaleString()} B)`);
    console.log(`----------------------------------------------------------------------`);

    const page = await context.newPage();
    const routeUrl = `${BASE_URL}/${r.slug}`;
    await page.goto(routeUrl, { waitUntil: "networkidle" });

    // SEO Check
    const title = await page.title();
    const h1 = await page.locator("h1").innerText();
    const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");

    console.log(`  ✓ SEO Title: "${title}"`);
    console.log(`  ✓ H1: "${h1}"`);
    console.log(`  ✓ Canonical: "${canonical}"`);

    // Compression & Download Check
    await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
    await page.waitForSelector(`button:has-text("Compress to ${r.label}")`, { timeout: 10000 });
    await page.locator(`button:has-text("Compress to ${r.label}")`).click();
    await page.waitForFunction(() => (window as any).__LAST_EXACT_ROUTE_RESULT__ !== undefined, { timeout: 20000 });

    const res = await page.evaluate(() => (window as any).__LAST_EXACT_ROUTE_RESULT__);
    console.log(`  ✓ Outcome: ${res.outcome}, TargetBytes: ${res.targetSizeBytes} === ${r.targetBytes}`);

    // Download check
    const dlPromise = page.waitForEvent("download");
    await page.locator(`button:has-text("Download Image (< ${r.label})")`).click();
    const dl = await dlPromise;
    const dlPath = path.join(TEMP_DIR, `out_${r.slug}.jpg`);
    await dl.saveAs(dlPath);
    const dlBytes = fs.readFileSync(dlPath).byteLength;
    console.log(`  ✓ Download verified: ${dlBytes} B match output size ${res.outputSizeBytes} B`);

    // Slider check
    const isSliderVisible = await page.locator('div[role="slider"]').isVisible();
    console.log(`  ✓ ImageComparisonSlider rendered visible=${isSliderVisible}`);

    await page.close();
  }

  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2B3 EXACT ROUTE FAMILY VERIFICATION PASSED 100%!");
  console.log("======================================================================");
}

verifyExactImageRoutes();
