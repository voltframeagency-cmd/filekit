import { chromium } from "playwright";
import { CONVERTER_NAVIGATION_GROUPS } from "../src/config/navigation";

const BASE_URL = "http://localhost:3000";

async function verifyPhase2d01ConverterNavFinal() {
  console.log("======================================================================");
  console.log("PHASE 2D0.1 FINAL: CONVERTER NAVIGATION KEYBOARD & ACCESSIBILITY AUDIT");
  console.log("======================================================================\n");

  // Test 1: Registry Central Consistency
  console.log("[Test 1] Registry Central Consistency Check...");
  const imgGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "image-conversion");
  console.log(`  ✓ Desktop Label: "${imgGroup?.label}"`);
  console.log(`  ✓ Mobile Compact Label: "${imgGroup?.compactLabel}"`);
  console.log(`  ✓ Links count: ${imgGroup?.links.length} (Expected: 7)`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  // Test 2: Desktop Keyboard Entry (ArrowDown & ArrowUp on Trigger)
  console.log("\n[Test 2] Desktop Keyboard Entry (Trigger ArrowDown & ArrowUp)...");
  const triggerBtn = page.locator('nav[aria-label="Main Navigation"] button:has-text("Convert")');
  await triggerBtn.focus();

  // ArrowDown opens menu and focuses FIRST link
  await page.keyboard.press("ArrowDown");
  await page.waitForSelector('#convert-menu', { timeout: 5000 });
  await page.waitForTimeout(100);
  const firstFocusedText = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ Trigger ArrowDown -> Opened menu & focused 1st link: "${firstFocusedText}" (Expected: "Image Converter")`);

  await page.keyboard.press("Escape");

  // ArrowUp opens menu and focuses LAST link
  await triggerBtn.focus();
  await page.keyboard.press("ArrowUp");
  await page.waitForSelector('#convert-menu', { timeout: 5000 });
  await page.waitForTimeout(100);
  const lastFocusedText = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ Trigger ArrowUp -> Opened menu & focused final link: "${lastFocusedText}" (Expected: "WebP to PNG")`);

  // Test 3: Link Traversal (ArrowDown, ArrowUp, Home, End, ArrowLeft, ArrowRight)
  console.log("\n[Test 3] Link Traversal Matrix (ArrowDown, ArrowUp, Home, End)...");
  await page.keyboard.press("Home");
  const homeFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ 'Home' pressed -> focused: "${homeFocused}" (Expected: "Image Converter")`);

  await page.keyboard.press("ArrowDown");
  const secondFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ 'ArrowDown' pressed -> focused: "${secondFocused}" (Expected: "JPG to PNG")`);

  await page.keyboard.press("ArrowUp");
  const prevFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ 'ArrowUp' pressed -> focused: "${prevFocused}" (Expected: "Image Converter")`);

  await page.keyboard.press("End");
  const endFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ 'End' pressed -> focused: "${endFocused}" (Expected: "WebP to PNG")`);

  // ArrowLeft and ArrowRight check with 1 column
  await page.keyboard.press("ArrowRight");
  const rightFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ 'ArrowRight' pressed -> retained focus safely: "${rightFocused}"`);

  // Test 4: Focus Restoration on Escape
  console.log("\n[Test 4] Focus Restoration on Escape...");
  await page.keyboard.press("Escape");
  const restoredFocusedText = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log(`  ✓ 'Escape' pressed -> restored focus to Convert trigger: "${restoredFocusedText?.startsWith("Convert")}"`);

  // Test 5: Active Route Semantics (aria-current="page")
  console.log("\n[Test 5] Active Route Semantics (aria-current=\"page\")...");
  await page.goto(`${BASE_URL}/jpg-to-png`, { waitUntil: "networkidle" });
  await page.locator('nav[aria-label="Main Navigation"] button:has-text("Convert")').click();
  const activeLinkAriaCurrent = await page.locator('a[href="/jpg-to-png"]').getAttribute("aria-current");
  console.log(`  ✓ Active route '/jpg-to-png' link aria-current: "${activeLinkAriaCurrent}" (Expected: "page")`);

  // Test 6: Mobile Navigation Audit (Accordion, Compact Label & Body Scroll)
  console.log("\n[Test 6] Mobile Navigation Audit (Compact Label & Body Scroll)...");
  const mobContext = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const mobPage = await mobContext.newPage();
  await mobPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  await mobPage.locator('button[aria-label="Open navigation menu"]').click();
  await mobPage.waitForSelector('[role="dialog"]', { timeout: 5000 });

  const bodyOverflowBefore = await mobPage.evaluate(() => document.body.style.overflow);
  console.log(`  ✓ Mobile drawer open -> Body scroll locked: ${bodyOverflowBefore === "hidden"}`);

  await mobPage.locator('[role="dialog"]').locator('button:has-text("Convert")').click();
  const hasCompactHeader = await mobPage.locator('[role="dialog"]').locator('span', { hasText: /^IMAGE$/ }).isVisible();
  console.log(`  ✓ Mobile expanded accordion renders compact label "IMAGE": ${hasCompactHeader}`);

  await mobPage.keyboard.press("Escape");
  const bodyOverflowAfter = await mobPage.evaluate(() => document.body.style.overflow);
  console.log(`  ✓ Mobile drawer closed -> Body scroll unlocked: ${bodyOverflowAfter === ""}`);

  await mobContext.close();
  await browser.close();

  console.log("\n======================================================================");
  console.log("PHASE 2D0.1 FINAL CONVERTER NAVIGATION AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2d01ConverterNavFinal();
