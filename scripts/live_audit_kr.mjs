const routes = [
  '/',
  '/all-tools',
  '/compress-pdf',
  '/compress-pdf-to-2mb',
  '/compress-image',
  '/compress-image-to-200kb',
  '/merge-pdf',
  '/split-pdf',
  '/rotate-pdf-pages',
  '/delete-pdf-pages',
  '/extract-pdf-pages',
  '/reorder-pdf-pages',
  '/watermark-pdf',
  '/flatten-pdf',
  '/crop-image',
  '/resize-image',
  '/rotate-image',
  '/flip-image',
  '/grayscale-image',
  '/invert-image',
  '/blur-image',
  '/pdf-to-jpg',
  '/pdf-to-png',
  '/jpg-to-png',
  '/png-to-jpg',
  '/word-to-pdf',
  '/powerpoint-to-pdf',
  '/excel-to-pdf',
  '/convert-audio',
  '/compress-video',
  '/extract-zip',
  '/create-zip',
  '/tar-to-zip',
  '/strip-exif',
  '/ocr-pdf',
  '/ttf-to-woff2',
  '/epub-to-pdf'
];

async function deepAuditLocale(locale, name) {
  console.log(`\n==============================================`);
  console.log(` DEEP LIVE ROUTE AUDIT: ${name.toUpperCase()} (${locale})`);
  console.log(`==============================================`);

  let passed = 0;
  let failed = 0;
  const failureDetails = [];

  for (const r of routes) {
    const url = `http://localhost:3000/${locale}` + (r === '/' ? '' : r);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`\n❌ [HTTP ${res.status}] ${url}`);
        failed++;
        failureDetails.push({ route: r, reason: `HTTP status ${res.status}` });
        continue;
      }
      const html = await res.text();

      // Check for raw keys or English fallback leaks
      const leaks = [];
      const rawKeyMatches = html.match(/workspace\.[a-zA-Z0-9_.]+/g) || [];
      if (rawKeyMatches.length > 0) {
        leaks.push(`Raw keys: ${[...new Set(rawKeyMatches)].join(', ')}`);
      }

      if (html.includes('Drop your PDF here')) leaks.push('Drop your PDF here');
      if (html.includes('Select PDF Files') && !html.includes('PDF 파일 선택')) leaks.push('Select PDF Files');
      if (html.includes('Select PowerPoint Presentation')) leaks.push('Select PowerPoint Presentation');
      if (html.includes('High-fidelity LibreOffice')) leaks.push('High-fidelity LibreOffice');

      if (leaks.length > 0) {
        console.warn(`\n⚠️ [LEAK] ${r} contains leaks: ${leaks.join(', ')}`);
        failed++;
        failureDetails.push({ route: r, reason: leaks.join('; ') });
      } else {
        passed++;
        process.stdout.write(`✓`);
      }
    } catch (e) {
      console.error(`\n❌ [EXCEPTION] ${url} -> ${e.message}`);
      failed++;
      failureDetails.push({ route: r, reason: e.message });
    }
  }

  console.log(`\n\nResult for ${name} (${locale}): ${passed}/${passed + failed} routes clean.`);
  if (failureDetails.length > 0) {
    console.log('Issues found:', failureDetails);
  }
  return { locale, passed, failed, total: passed + failed };
}

async function run() {
  console.log('Testing KR and KO routes against live Next.js server...');
  const krRes = await deepAuditLocale('kr', 'Korean (kr alias)');
  const koRes = await deepAuditLocale('ko', 'Korean (ko standard)');

  console.log('\n================ FINAL SUMMARY ================');
  console.log(`KR (Alias):    ${krRes.passed}/${krRes.total} routes fully clean`);
  console.log(`KO (Standard): ${koRes.passed}/${koRes.total} routes fully clean`);
  console.log('===============================================');

  if (krRes.failed > 0 || koRes.failed > 0) {
    process.exit(1);
  }
}

run();
