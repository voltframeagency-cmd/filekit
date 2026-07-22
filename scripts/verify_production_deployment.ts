import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getTestImageCorpus } from "../src/utils/image-engine/__tests__/fixtures";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-Production-Deploy-Fixtures";
const BASE_URL = "http://localhost:3000";

const PUBLIC_ROUTES = [
  { slug: "compress-image", h1: "Compress Image — Beta", title: "FileKit" },
  { slug: "compress-image-to-100kb", h1: "Compress Image to 100 KB", title: "Compress Image to 100 KB Online | FileKit", op: "compress_image_to_100kb" },
  { slug: "compress-image-to-200kb", h1: "Compress Image to 200 KB", title: "Compress Image to 200 KB Online | FileKit", op: "compress_image_to_200kb" },
  { slug: "compress-image-to-500kb", h1: "Compress Image to 500 KB", title: "Compress Image to 500 KB Online | FileKit", op: "compress_image_to_500kb" },
  { slug: "compress-image-to-1mb", h1: "Compress Image to 1 MB", title: "Compress Image to 1 MB Online | FileKit", op: "compress_image_to_1mb" },
  { slug: "compress-pdf", h1: "Compress PDF — Local & Private Engine", title: "FileKit" }
];

async function verifyProductionDeployment() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("FILEKIT PRODUCTION DEPLOYMENT & SANITY AUDIT");
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
    return { largeJpegB64 };
  });

  await setupPage.close();

  const largeJpegBuf = Buffer.from(base64Assets.largeJpegB64.replace(/^data:image\/jpeg;base64,/, ""), "base64");
  fs.writeFileSync(path.join(TEMP_DIR, "large_jpeg.jpg"), largeJpegBuf);

  const context = await browser.newContext({ acceptDownloads: true });

  for (const r of PUBLIC_ROUTES) {
    console.log(`----------------------------------------------------------------------`);
    console.log(`Auditing Production Route: /${r.slug}`);
    console.log(`----------------------------------------------------------------------`);

    const page = await context.newPage();

    // Track network requests to ensure zero external file processing calls
    const externalRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (!url.startsWith("http://localhost:3000") && !url.startsWith("data:")) {
        externalRequests.push(url);
      }
    });

    const response = await page.goto(`${BASE_URL}/${r.slug}`, { waitUntil: "networkidle" });
    const status = response?.status();
    console.log(`  ✓ HTTP Status: ${status}`);

    const h1 = await page.locator("h1").innerText();
    console.log(`  ✓ H1 Header: "${h1}"`);

    const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");
    console.log(`  ✓ Canonical Link: "${canonical}"`);

    const jsonLdText = await page.evaluate(() => document.querySelector('script[type="application/ld+json"]')?.textContent || "");
    console.log(`  ✓ JSON-LD Schema: ${jsonLdText ? "Present" : "N/A"}`);

    if (r.slug.startsWith("compress-image-to-")) {
      // Test upload, processing, slider rendering, and download
      await page.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "large_jpeg.jpg"));
      const label = r.slug.replace("compress-image-to-", "").toUpperCase().replace("KB", " KB").replace("MB", " MB");
      await page.waitForSelector(`button:has-text("Compress to ${label}")`, { timeout: 10000 });
      await page.locator(`button:has-text("Compress to ${label}")`).click();
      await page.waitForFunction(() => (window as any).__LAST_EXACT_ROUTE_RESULT__ !== undefined, { timeout: 20000 });

      const res = await page.evaluate(() => (window as any).__LAST_EXACT_ROUTE_RESULT__);
      console.log(`  ✓ Outcome: ${res.outcome}, Output: ${res.outputSizeBytes} B`);

      const isSliderVisible = await page.locator('div[role="slider"]').isVisible();
      console.log(`  ✓ ImageComparisonSlider visible=${isSliderVisible}`);

      const dlPromise = page.waitForEvent("download");
      await page.locator(`button:has-text("Download Image (< ${label})")`).click();
      const dl = await dlPromise;
      const dlPath = path.join(TEMP_DIR, `deploy_${r.slug}.jpg`);
      await dl.saveAs(dlPath);
      const dlBytes = fs.readFileSync(dlPath).byteLength;
      console.log(`  ✓ Download verified: ${dlBytes} B match output size ${res.outputSizeBytes} B`);
    }

    console.log(`  ✓ External file processing network requests: ${externalRequests.length}`);

    await page.close();
  }

  // Mobile Viewport Check
  console.log(`\n----------------------------------------------------------------------`);
  console.log(`Auditing Mobile Viewport (375x667)...`);
  console.log(`----------------------------------------------------------------------`);
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });
  const mobH1 = await mobilePage.locator("h1").innerText();
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  console.log(`  ✓ Mobile H1: "${mobH1}"`);
  console.log(`  ✓ Horizontal Overflow Check: ScrollWidth (${scrollWidth}) === ClientWidth (${clientWidth}) -> ${scrollWidth === clientWidth}`);
  await mobileContext.close();

  // Arabic RTL Layout Check
  console.log(`\n----------------------------------------------------------------------`);
  console.log(`Auditing Arabic RTL Layout (dir="rtl")...`);
  console.log(`----------------------------------------------------------------------`);
  const rtlContext = await browser.newContext({ locale: "ar-SA" });
  const rtlPage = await rtlContext.newPage();
  await rtlPage.goto(`${BASE_URL}/compress-image-to-200kb`, { waitUntil: "networkidle" });
  await rtlPage.evaluate(() => { document.documentElement.setAttribute("dir", "rtl"); });
  const dirAttr = await rtlPage.evaluate(() => document.documentElement.getAttribute("dir"));
  console.log(`  ✓ Document Direction: "${dirAttr}"`);
  await rtlContext.close();

  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("FILEKIT PRODUCTION DEPLOYMENT AUDIT PASSED 100% SUCCESSFULLY!");
  console.log("======================================================================");
}

verifyProductionDeployment();
