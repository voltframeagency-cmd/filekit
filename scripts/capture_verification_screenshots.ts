import { chromium } from 'playwright';
import * as path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\mahdi\\.gemini\\antigravity-ide\\brain\\a223c973-af13-4166-93cb-bddafbf5ec14';

async function capture() {
  console.log('Capturing verification screenshots via Playwright...');
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Context (1536 x 900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1536, height: 900 }
  });
  const page = await desktopContext.newPage();

  // A. Search Active with Combobox Semantics
  await page.goto('http://localhost:3000/en');
  await page.waitForSelector('input[role="combobox"]');
  const searchInput = page.locator('input[role="combobox"]');
  await searchInput.click();
  await searchInput.fill('pdf');
  await page.keyboard.press('ArrowDown');
  await page.waitForSelector('[role="listbox"]');
  await page.waitForTimeout(600);

  const searchPath = path.join(ARTIFACT_DIR, '01_hero_search_keyboard_en.png');
  await page.screenshot({ path: searchPath, fullPage: false });
  console.log(`Saved: ${searchPath}`);

  // B. Popular Tools and Prominent Button
  await searchInput.fill('');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 340));
  await page.waitForTimeout(600);

  const popularToolsPath = path.join(ARTIFACT_DIR, '02_popular_tools_icons_en.png');
  await page.screenshot({ path: popularToolsPath, fullPage: false });
  console.log(`Saved: ${popularToolsPath}`);

  // C. Compress PDF Workspace (/en/compress-pdf)
  await page.goto('http://localhost:3000/en/compress-pdf');
  await page.waitForSelector('text=Select PDF File');
  await page.waitForTimeout(800);

  const compressPdfPath = path.join(ARTIFACT_DIR, '03_compress_pdf_workspace_en.png');
  await page.screenshot({ path: compressPdfPath, fullPage: false });
  console.log(`Saved: ${compressPdfPath}`);

  // D. Arabic RTL (/ar/compress-pdf)
  await page.goto('http://localhost:3000/ar/compress-pdf');
  await page.waitForTimeout(800);
  const rtlPath = path.join(ARTIFACT_DIR, '04_compress_pdf_rtl_arabic.png');
  await page.screenshot({ path: rtlPath, fullPage: false });
  console.log(`Saved: ${rtlPath}`);

  // E. German Long Text (/de/compress-pdf)
  await page.goto('http://localhost:3000/de/compress-pdf');
  await page.waitForTimeout(800);
  const dePath = path.join(ARTIFACT_DIR, '05_compress_pdf_long_german.png');
  await page.screenshot({ path: dePath, fullPage: false });
  console.log(`Saved: ${dePath}`);

  // 2. Mobile Viewport Context (390 x 844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/en/compress-pdf');
  await mobilePage.waitForTimeout(800);

  const mobilePath = path.join(ARTIFACT_DIR, '06_compress_pdf_mobile_responsive.png');
  await mobilePage.screenshot({ path: mobilePath, fullPage: false });
  console.log(`Saved: ${mobilePath}`);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
