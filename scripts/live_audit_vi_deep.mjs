import { CONVERSION_CATALOG } from '../src/config/conversionCatalog.ts';

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
  '/strip-exif',
  '/ttf-to-woff2',
  '/woff2-to-ttf'
];

async function deepAuditLocale(locale, name, indicators) {
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
        console.error(`❌ [HTTP ${res.status}] ${url}`);
        failed++;
        failureDetails.push({ route: r, reason: `HTTP status ${res.status}` });
        continue;
      }
      const html = await res.text();

      // Check for English leaks in core headings or buttons
      const leaks = [];
      if (html.includes('Drop your PDF here')) leaks.push('Drop your PDF here');
      if (html.includes('Drop your image here')) leaks.push('Drop your image here');
      if (html.includes('Select PowerPoint Presentation')) leaks.push('Select PowerPoint Presentation');
      if (html.includes('High-fidelity LibreOffice')) leaks.push('High-fidelity LibreOffice');
      if (html.includes('Select Photo to Strip Metadata')) leaks.push('Select Photo to Strip Metadata');
      if (html.includes('Strip All EXIF')) leaks.push('Strip All EXIF');
      if (html.includes('Select Font File')) leaks.push('Select Font File');
      if (html.includes('Live Font Preview')) leaks.push('Live Font Preview');
      if (html.includes('The quick brown fox')) leaks.push('The quick brown fox');
      if (html.includes('Choose File')) leaks.push('Choose File');
      if (html.includes('Change File') && !html.includes('Đổi tệp')) leaks.push('Change File');
      if (html.includes('Select Image') && html.includes('<h2')) leaks.push('Select Image (heading)');
      if (html.includes('Resize Image') && html.includes('<button')) leaks.push('Resize Image (button)');
      
      // Check for expected native indicators
      for (const exp of indicators) {
        if (!html.includes(exp.text)) {
          if (r === '/' && exp.forHomepage) {
            leaks.push(`Missing expected: ${exp.text}`);
          }
        }
      }

      if (leaks.length > 0) {
        console.warn(`\n⚠️ [LEAK] ${r} contains English leaks: ${leaks.join(', ')}`);
        failed++;
        failureDetails.push({ route: r, reason: `Leaks: ${leaks.join(', ')}` });
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
  const viIndicators = [
    { text: 'Tất cả công cụ', forHomepage: true },
    { text: 'Tìm kiếm hơn 100 công cụ', forHomepage: true }
  ];

  console.log('Starting live audit for VI...');
  const viRes = await deepAuditLocale('vi', 'Vietnamese', viIndicators);

  console.log('\n================ FINAL SUMMARY ================');
  console.log(`VI (Vietnamese): ${viRes.passed}/${viRes.total} routes fully clean`);
  console.log('===============================================');
}

run();
