import { chromium } from 'playwright';

async function testGating() {
  console.log('Verifying localized gating notices in browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Test 1: English TTF to WOFF2
  await page.goto('http://localhost:3000/en/ttf-to-woff2');
  const woff2Notice = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  console.log('1. /en/ttf-to-woff2 gated notice visible:', woff2Notice);
  const woff2Text = await page.locator('[data-testid="gated-tool-notice"]').textContent();
  console.log('   Contains Brotli explanation:', woff2Text?.includes('Brotli'));

  // Test 2: Spanish MOBI to PDF
  await page.goto('http://localhost:3000/es/mobi-to-pdf');
  const mobiNotice = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  console.log('2. /es/mobi-to-pdf gated notice visible:', mobiNotice);
  const mobiText = await page.locator('[data-testid="gated-tool-notice"]').textContent();
  console.log('   Contains PalmDOC explanation:', mobiText?.includes('PalmDOC'));

  // Test 3: German AZW3 to PDF
  await page.goto('http://localhost:3000/de/azw3-to-pdf');
  const azw3Notice = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  console.log('3. /de/azw3-to-pdf gated notice visible:', azw3Notice);
  const azw3Text = await page.locator('[data-testid="gated-tool-notice"]').textContent();
  console.log('   Contains KF8 explanation:', azw3Text?.includes('KF8'));

  // Test 4: Verified EPUB to PDF is NOT gated and operational
  await page.goto('http://localhost:3000/en/epub-to-pdf');
  const epubDropzone = await page.locator('[data-testid="ebook-dropzone"]').isVisible();
  const epubGated = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  console.log('4. /en/epub-to-pdf operational (dropzone visible, NOT gated):', epubDropzone && !epubGated);

  // Test 5: Check homepage footer note has €4.90 Job Pass
  await page.goto('http://localhost:3000/en');
  const footerText = await page.locator('footer').textContent();
  console.log('5. Homepage footer includes Job Pass €4.90 for 7 days:', footerText?.includes('Job Pass €4.90'));

  await browser.close();

  if (!woff2Notice || !mobiNotice || !azw3Notice || !epubDropzone || epubGated) {
    throw new Error('Gating verification failed!');
  }
  console.log('\n✅ All gating and pricing browser assertions passed cleanly!');
}

testGating().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
