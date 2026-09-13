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
import { ALL_LOCALES, NON_DEFAULT_LOCALES } from '../src/config/i18n/locales.ts';

const TEST_LOCALES = ALL_LOCALES;
const NON_EN_LOCALES = NON_DEFAULT_LOCALES;

async function audit() {
  console.log(`Starting SSR Uploader & Sandbox Leak Audit across ${TEST_LOCALES.length} locales and ${routes.length} routes (${TEST_LOCALES.length * routes.length} total checks)...`);

  let totalLeaks = 0;
  let totalHttpErrors = 0;
  const leakReports = [];
  const httpErrorReports = [];

  for (const locale of TEST_LOCALES) {
    let localeLeaks = 0;
    let localeHttpErrors = 0;

    for (const r of routes) {
      const url = `http://localhost:3000/${locale}` + (r === '/' ? '' : r);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`❌ [HTTP ${res.status}] ${url}`);
          localeHttpErrors++;
          totalHttpErrors++;
          httpErrorReports.push({ locale, route: r, status: res.status, url });
          continue;
        }
        const html = await res.text();
        const detected = [];
        if (locale !== 'en') {
          for (const pattern of LEAK_PATTERNS) {
            if (html.includes(pattern)) {
              detected.push(pattern);
            }
          }
        }
        if (detected.length > 0) {
          localeLeaks++;
          totalLeaks++;
          leakReports.push({ locale, route: r, leaks: detected, url });
        }
      } catch (err) {
        console.error(`❌ [Network/Fetch Error] ${url}: ${err.message}`);
        localeHttpErrors++;
        totalHttpErrors++;
        httpErrorReports.push({ locale, route: r, error: err.message, url });
      }
    }
    if (localeLeaks === 0 && localeHttpErrors === 0) {
      console.log(`✅ [${locale.padEnd(8)}] ${routes.length}/${routes.length} SSR routes clean & reachable`);
    } else {
      console.warn(`⚠️ [${locale.padEnd(8)}] ${localeLeaks} leaks, ${localeHttpErrors} HTTP/network failures`);
    }
  }

  console.log('\n======================================================');
  console.log(`SUMMARY: ${TEST_LOCALES.length} locales checked across ${routes.length} routes (${TEST_LOCALES.length * routes.length} total requests).`);
  console.log(`HTTP/Network Failures: ${totalHttpErrors}`);
  console.log(`English Leak Instances: ${totalLeaks}`);
  console.log('======================================================');

  if (totalHttpErrors > 0 || totalLeaks > 0) {
    if (totalHttpErrors > 0) {
      console.error(`❌ HTTP/Network Failure Details:`, httpErrorReports);
    }
    if (totalLeaks > 0) {
      console.error(`❌ English Leak Details:`, leakReports);
    }
    console.error(`\n❌ AUDIT FAILED: Requirements not met (total failures: ${totalHttpErrors + totalLeaks}).`);
    process.exit(1);
  }

  console.log(`✅ SSR STATIC LEAK AUDIT COMPLETE: 100% PASS with 0 HTTP errors and 0 monitored English leaks across all 39 canonical locales.`);
  console.log(`(Scope: Validates server-rendered dropzone and sandbox notice patterns; dynamic client interactive states are verified in dedicated component tests.)`);
}

audit();

