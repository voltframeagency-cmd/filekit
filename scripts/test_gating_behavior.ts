import { chromium } from 'playwright';

async function testGatingAndPricing() {
  console.log('Verifying localized gating notices and pricing assertions in browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors: string[] = [];

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`❌ Assertion Failed: ${message}`);
      errors.push(message);
    } else {
      console.log(`✅ Passed: ${message}`);
    }
  }

  // 1. Forward WOFF2 route: /en/ttf-to-woff2
  await page.goto('http://localhost:3000/en/ttf-to-woff2');
  const ttfToWoff2Gated = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  assert(ttfToWoff2Gated, '/en/ttf-to-woff2 must display gated-tool-notice');
  const ttfToWoff2Text = (await page.locator('[data-testid="gated-tool-notice"]').textContent()) || '';
  assert(
    ttfToWoff2Text.includes('WOFF2 Conversion Temporarily Unavailable') &&
    ttfToWoff2Text.includes('standard font compression') &&
    !ttfToWoff2Text.includes('Brotli'), // Customer friendly, no raw codec jargon
    '/en/ttf-to-woff2 must display concise customer-friendly explanation without codec internals'
  );

  // 2. Reverse WOFF2 route: /en/woff2-to-ttf
  await page.goto('http://localhost:3000/en/woff2-to-ttf');
  const woff2ToTtfGated = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  assert(woff2ToTtfGated, '/en/woff2-to-ttf must display gated-tool-notice');
  const woff2ToTtfText = (await page.locator('[data-testid="gated-tool-notice"]').textContent()) || '';
  assert(
    woff2ToTtfText.includes('WOFF2 Conversion Temporarily Unavailable') &&
    !woff2ToTtfText.includes('Brotli'),
    '/en/woff2-to-ttf must display customer-friendly notice and not expose raw decoder/codec internals'
  );

  // 3. MOBI route: /es/mobi-to-pdf
  await page.goto('http://localhost:3000/es/mobi-to-pdf');
  const mobiGated = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  assert(mobiGated, '/es/mobi-to-pdf must display gated-tool-notice');
  const mobiText = (await page.locator('[data-testid="gated-tool-notice"]').textContent()) || '';
  assert(
    mobiText.includes('Conversión MOBI no disponible') &&
    !mobiText.includes('PalmDOC'), // No raw codec internals
    '/es/mobi-to-pdf must display localized Spanish notice with working alternative'
  );

  // 4. AZW3 route: /de/azw3-to-pdf
  await page.goto('http://localhost:3000/de/azw3-to-pdf');
  const azw3Gated = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  assert(azw3Gated, '/de/azw3-to-pdf must display gated-tool-notice');
  const azw3Text = (await page.locator('[data-testid="gated-tool-notice"]').textContent()) || '';
  assert(
    azw3Text.includes('AZW3-Konvertierung') &&
    !azw3Text.includes('KF8'), // No raw codec internals
    '/de/azw3-to-pdf must display localized German notice with working alternative'
  );

  // 5. Operational route: /en/epub-to-pdf
  await page.goto('http://localhost:3000/en/epub-to-pdf');
  const epubDropzone = await page.locator('[data-testid="ebook-dropzone"]').isVisible();
  const epubGated = await page.locator('[data-testid="gated-tool-notice"]').isVisible();
  assert(epubDropzone && !epubGated, '/en/epub-to-pdf must be operational and NOT gated');

  // 6. Pricing & localized footer terms assertions across sample locales
  const pricingChecks = [
    {
      locale: 'en',
      path: '/en',
      expectedSubstrings: ['Job Pass €4.90 for 7 days (never renews)'],
      forbiddenSubstrings: ['€4.99', '4,99']
    },
    {
      locale: 'es',
      path: '/es',
      expectedSubstrings: ['Job Pass 4,90 € por 7 días (sin renovación automática)'],
      forbiddenSubstrings: ['4,99', '4.99', 'Free basic tools']
    },
    {
      locale: 'de',
      path: '/de',
      expectedSubstrings: ['Job-Pass 4,90 € für 7 Tage (keine automatische Verlängerung)'],
      forbiddenSubstrings: ['4,99', '4.99', 'Free basic tools']
    },
    {
      locale: 'ar',
      path: '/ar',
      expectedSubstrings: ['تذكرة مهام €4.90 لمدة 7 أيام (لا تتجدد تلقائياً)'],
      forbiddenSubstrings: ['4,99', '4.99', 'Free basic tools']
    },
    {
      locale: 'ja',
      path: '/ja',
      expectedSubstrings: ['ジョブパス €4.90（7日間・自動更新なし）'],
      forbiddenSubstrings: ['4,99', '4.99', 'Free basic tools']
    },
    {
      locale: 'zh-CN',
      path: '/zh-CN',
      expectedSubstrings: ['任务通行证 €4.90 有效期 7 天（永不自动续费）'],
      forbiddenSubstrings: ['4,99', '4.99', 'Free basic tools']
    }
  ];

  for (const check of pricingChecks) {
    await page.goto(`http://localhost:3000${check.path}`);
    const footerText = (await page.locator('footer').textContent()) || '';

    for (const exp of check.expectedSubstrings) {
      assert(
        footerText.includes(exp),
        `Footer on ${check.path} must contain expected localized terms: "${exp}"`
      );
    }
    for (const forb of check.forbiddenSubstrings) {
      assert(
        !footerText.includes(forb),
        `Footer on ${check.path} must NOT contain forbidden substring: "${forb}"`
      );
    }
  }

  await browser.close();

  if (errors.length > 0) {
    throw new Error(`Gating and pricing verification failed with ${errors.length} error(s):\n${errors.join('\n')}`);
  }

  console.log('\n🎉 ALL GATING AND PRICING ASSERTIONS PASSED DETERMINISTICALLY!');
}

testGatingAndPricing().catch(err => {
  console.error('\n💥 TEST RUNNER ABORTED WITH ERROR:\n', err);
  process.exit(1);
});
