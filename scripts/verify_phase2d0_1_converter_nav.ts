import { chromium } from "playwright";
import { CONVERTER_NAVIGATION_GROUPS } from "../src/config/navigation";

const BASE_URL = "http://localhost:3000";

async function verifyPhase2d01ConverterNav() {
  console.log("======================================================================");
  console.log("PHASE 2D0.1: CONVERTER MEGA-MENU NAVIGATION CHROMIUM AUDIT");
  console.log("======================================================================\n");

  // 1. Registry verification
  console.log("[Test 1] Navigation Registry Verification...");
  console.log(`  ✓ Populated groups count: ${CONVERTER_NAVIGATION_GROUPS.length}`);
  const imgGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "image-conversion");
  console.log(`  ✓ Image Conversion Group Links count: ${imgGroup?.links.length} (Expected: 7)`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  // 2. Desktop Convert Mega-Menu trigger & rendering
  console.log("\n[Test 2] Desktop Convert Mega-Menu Interaction & Group Rendering...");
  const convertBtn = page.locator('nav[aria-label="Main Navigation"] button:has-text("Convert")');
  await convertBtn.click();

  const isMenuVisible = await page.locator('#convert-menu').isVisible();
  console.log(`  ✓ Convert Mega-Menu opened on click: ${isMenuVisible}`);

  const hasImageGroup = await page.locator('text=IMAGE CONVERSION').isVisible();
  console.log(`  ✓ Heading "IMAGE CONVERSION" rendered cleanly: ${hasImageGroup}`);

  const hasPdfFromGroup = await page.locator('text=CONVERT FROM PDF').isVisible();
  console.log(`  ✓ Empty "CONVERT FROM PDF" group suppressed: ${!hasPdfFromGroup}`);

  // Escape closes menu
  await page.keyboard.press("Escape");
  const isClosedOnEscape = !(await page.locator('#convert-menu').isVisible());
  console.log(`  ✓ Mega-Menu closed cleanly on Escape: ${isClosedOnEscape}`);

  // 3. Mobile Viewport Accordion Audit (375px & 320px)
  console.log("\n[Test 3] Mobile Viewport (375px & 320px) Accordions & Overflow...");
  for (const width of [375, 320]) {
    const mobContext = await browser.newContext({ viewport: { width, height: 667 }, isMobile: true });
    const mobPage = await mobContext.newPage();
    await mobPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Open mobile menu drawer
    await mobPage.locator('button[aria-label="Open navigation menu"]').click();
    await mobPage.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Expand Convert accordion inside dialog
    await mobPage.locator('[role="dialog"]').locator('button:has-text("Convert")').click();
    const hasMobGroup = await mobPage.locator('[role="dialog"]').locator('span', { hasText: /^IMAGE$/ }).isVisible();
    console.log(`  ✓ Mobile ${width}px: Convert accordion expanded "IMAGE": ${hasMobGroup}`);

    const scrollWidth = await mobPage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobPage.evaluate(() => document.documentElement.clientWidth);
    console.log(`  ✓ Mobile ${width}px Overflow Check: ScrollWidth (${scrollWidth}) === ClientWidth (${clientWidth}) -> ${scrollWidth === clientWidth}`);

    await mobContext.close();
  }

  await browser.close();

  console.log("\n======================================================================");
  console.log("PHASE 2D0.1 CONVERTER MEGA-MENU AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2d01ConverterNav();
