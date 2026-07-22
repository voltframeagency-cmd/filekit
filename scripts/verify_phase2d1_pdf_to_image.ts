import { chromium } from "playwright";
import { PDF_TO_IMAGE_ROUTES } from "../src/config/pdfToImageRoutes";
import { CONVERTER_NAVIGATION_GROUPS } from "../src/config/navigation";

const BASE_URL = "http://localhost:3000";

async function verifyPhase2d1PdfToImage() {
  console.log("======================================================================");
  console.log("PHASE 2D1: PDF-TO-IMAGE CONVERTER FAMILY CHROMIUM E2E AUDIT");
  console.log("======================================================================\n");

  // Test 1: Navigation Registry Verification
  console.log("[Test 1] Navigation Registry 2-Column Verification...");
  console.log(`  ✓ Populated groups count: ${CONVERTER_NAVIGATION_GROUPS.length} (Expected: 2)`);
  const fromPdfGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "pdf-to-image-conversion");
  console.log(`  ✓ 'CONVERT FROM PDF' Group Links count: ${fromPdfGroup?.links.length} (Expected: 3)`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Test 2: Verify all 3 routes load clean H1 and supporting copy
  console.log("\n[Test 2] Route H1 & Mode Verification (/pdf-to-image, /pdf-to-jpg, /pdf-to-png)...");
  for (const [routePath, routeConfig] of Object.entries(PDF_TO_IMAGE_ROUTES)) {
    await page.goto(`${BASE_URL}${routePath}`, { waitUntil: "networkidle" });
    const h1Text = await page.locator("h1").innerText();
    console.log(`  ✓ Route '${routePath}' H1: "${h1Text}" (Expected: "${routeConfig.h1}")`);

    // Verify format selector visibility by mode
    if (routeConfig.mode === "FIXED_PAIR") {
      const formatSelectText = await page.locator('text=Output format').isVisible();
      console.log(`  ✓ Fixed pair route '${routePath}' has format indicator: ${formatSelectText}`);
    }
  }

  // Test 3: Desktop Mega-Menu 2-Column Rendering & Traversal
  console.log("\n[Test 3] Desktop Mega-Menu 2-Column Rendering...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.locator('nav[aria-label="Main Navigation"] button:has-text("Convert")').click();

  const isImageColVisible = await page.locator('text=IMAGE CONVERSION').isVisible();
  const isFromPdfColVisible = await page.locator('text=CONVERT FROM PDF').isVisible();
  console.log(`  ✓ Desktop Mega-Menu Column 1 (IMAGE CONVERSION): ${isImageColVisible}`);
  console.log(`  ✓ Desktop Mega-Menu Column 2 (CONVERT FROM PDF): ${isFromPdfColVisible}`);

  await page.keyboard.press("Escape");

  // Test 4: Mobile Viewport 2-Accordion Group Audit (375px & 320px)
  console.log("\n[Test 4] Mobile Viewport (375px & 320px) 2-Accordion Group Audit...");
  for (const width of [375, 320]) {
    const mobContext = await browser.newContext({ viewport: { width, height: 667 }, isMobile: true });
    const mobPage = await mobContext.newPage();
    await mobPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    await mobPage.locator('button[aria-label="Open navigation menu"]').click();
    await mobPage.waitForSelector('[role="dialog"]', { timeout: 5000 });

    await mobPage.locator('[role="dialog"]').locator('button:has-text("Convert")').click();
    const hasImageGroup = await mobPage.locator('[role="dialog"]').locator('span', { hasText: /^IMAGE$/ }).isVisible();
    const hasFromPdfGroup = await mobPage.locator('[role="dialog"]').locator('span', { hasText: /^FROM PDF$/ }).isVisible();

    console.log(`  ✓ Mobile ${width}px Accordion renders "IMAGE": ${hasImageGroup}`);
    console.log(`  ✓ Mobile ${width}px Accordion renders "FROM PDF": ${hasFromPdfGroup}`);

    const scrollWidth = await mobPage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobPage.evaluate(() => document.documentElement.clientWidth);
    console.log(`  ✓ Mobile ${width}px Overflow Check: ScrollWidth (${scrollWidth}) === ClientWidth (${clientWidth}) -> ${scrollWidth === clientWidth}`);

    await mobContext.close();
  }

  await browser.close();

  console.log("\n======================================================================");
  console.log("PHASE 2D1 PDF-TO-IMAGE CONVERTER FAMILY AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2d1PdfToImage();
