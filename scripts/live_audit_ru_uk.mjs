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
  '/create-zip'
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
      
      // Check for expected native indicators
      const missingExpected = [];
      for (const exp of indicators) {
        if (!html.includes(exp)) {
          // only require certain indicators on homepage vs tools
          if (r === '/' && exp.forHomepage) {
            missingExpected.push(exp.text);
          }
        }
      }

      if (leaks.length > 0) {
        console.warn(`⚠️ [LEAK] ${r} contains English leaks: ${leaks.join(', ')}`);
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
  const ruIndicators = [
    { text: 'Все инструменты', forHomepage: true },
    { text: 'Поиск среди 100+ инструментов', forHomepage: true }
  ];
  const ukIndicators = [
    { text: 'Усі інструменти', forHomepage: true },
    { text: 'Пошук серед 100+ інструментів', forHomepage: true }
  ];

  console.log('Starting live audit for RU...');
  const ruRes = await deepAuditLocale('ru', 'Russian', ruIndicators);

  console.log('Starting live audit for UK...');
  const ukRes = await deepAuditLocale('uk', 'Ukrainian', ukIndicators);

  console.log('\n================ FINAL SUMMARY ================');
  console.log(`RU (Russian):   ${ruRes.passed}/${ruRes.total} routes fully clean`);
  console.log(`UK (Ukrainian): ${ukRes.passed}/${ukRes.total} routes fully clean`);
  console.log('===============================================');
}

run();
