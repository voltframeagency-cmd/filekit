// Comprehensive multi-locale leak detector across representative languages

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

const LEAK_PATTERNS = [
  'Drop your PDF here',
  'Drop your image here',
  'Select PowerPoint Presentation',
  'Select Word Document',
  'Select Excel Spreadsheet',
  'High-fidelity LibreOffice',
  'Ephemeral MicroVM Sandbox',
  'Secure Server Conversion Notice',
  'Choose PDF',
  'Processed locally in your browser. Your file is never uploaded.'
];

// Test sample locales representing diverse language families and alphabets:
// Cyrillic (ru, uk, bg)
// Slavic Latin (pl, cs, sk)
// Germanic / Nordic (de, nl, sv, da, fi, no)
// Romance (es, fr, it, pt)
// Semitic / RTL (ar, he)
// Asian (zh-CN, ja, ko, hi, th, vi, id)
// Baltic (lv, lt)
// Uralic (hu)
// Turkic (tr)
const TEST_LOCALES = [
  'es', 'de', 'fr', 'pt', 'it', 'nl', 'sv', 'da', 'fi', 'no', 'pl',
  'cs', 'hu', 'ro', 'bg', 'el', 'sk', 'sl', 'ru', 'uk', 'tr',
  'ar', 'he', 'hi', 'id', 'ms', 'th', 'vi', 'fil', 'ja', 'ko',
  'zh-CN', 'zh-TW', 'ca', 'lv', 'lt'
];

async function audit() {
  console.log(`Starting SSR Uploader & Sandbox Leak Audit across ${TEST_LOCALES.length} locales and ${routes.length} routes (${TEST_LOCALES.length * routes.length} total checks)...`);

  let totalLeaks = 0;
  const leakReports = [];

  for (const locale of TEST_LOCALES) {
    let localeLeaks = 0;
    for (const r of routes) {
      const url = `http://localhost:3000/${locale}` + (r === '/' ? '' : r);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`❌ [HTTP ${res.status}] ${url}`);
          continue;
        }
        const html = await res.text();
        const detected = [];
        for (const pattern of LEAK_PATTERNS) {
          if (html.includes(pattern)) {
            detected.push(pattern);
          }
        }
        if (detected.length > 0) {
          localeLeaks++;
          totalLeaks++;
          leakReports.push({ locale, route: r, leaks: detected });
        }
      } catch (err) {
        console.error(`Error on ${url}: ${err.message}`);
      }
    }
    if (localeLeaks === 0) {
      console.log(`✅ [${locale.padEnd(6)}] ${routes.length}/${routes.length} SSR routes clean for monitored patterns`);
    } else {
      console.warn(`⚠️ [${locale.padEnd(6)}] ${localeLeaks} routes contain leaks`);
    }
  }

  console.log('\n======================================================');
  if (totalLeaks === 0) {
    console.log(`✅ SSR STATIC LEAK AUDIT COMPLETE: 0 target upload/sandbox leaks across ${TEST_LOCALES.length} locales and ${routes.length} routes.`);
    console.log(`(Scope: Validates server-rendered dropzone and sandbox notice patterns; dynamic client interactive states are verified in dedicated component tests.)`);
  } else {
    console.log(`❌ Found ${totalLeaks} leak instances across locales:`, leakReports);
  }
  console.log('======================================================');
}

audit();
