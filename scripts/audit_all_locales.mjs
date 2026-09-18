// Comprehensive multi-locale leak detector across representative languages

export const routes = [
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
  '/ttf-to-woff2',
  '/woff2-to-ttf',
  '/epub-to-pdf',
  '/pdf-to-epub',
  '/mobi-to-pdf',
  '/azw3-to-pdf'
];

export const LEAK_PATTERNS = [
  'Drop your PDF here',
  'Drop your image here',
  'Select PowerPoint Presentation',
  'Select Word Document',
  'Select Excel Spreadsheet',
  'High-fidelity LibreOffice',
  'Ephemeral MicroVM Sandbox',
  'Secure Server Conversion Notice',
  'Choose PDF',
  'Processed locally in your browser. Your file is never uploaded.',
  'Select Font File',
  'Live Font Preview',
  'Select eBook File',
  'Rendering eBook pages to PDF...',
  'Converting PDF into responsive EPUB eBook...'
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

export async function audit(options = {}) {
  const baseUrl = options.baseUrl || 'http://localhost:3000';
  const targetLocales = options.locales || TEST_LOCALES;
  const targetRoutes = options.routes || routes;
  const exitOnFailure = options.exitOnFailure !== undefined ? options.exitOnFailure : true;

  console.log(`Starting SSR Uploader & Sandbox Leak Audit across ${targetLocales.length} locales and ${targetRoutes.length} routes (${targetLocales.length * targetRoutes.length} total checks)...`);

  let totalLeaks = 0;
  let totalHttpErrors = 0;
  const leakReports = [];
  const httpErrorReports = [];

  for (const locale of targetLocales) {
    let localeLeaks = 0;
    let localeHttpErrors = 0;

    for (const r of targetRoutes) {
      const url = `${baseUrl}/${locale}` + (r === '/' ? '' : r);
      try {
        let res = await fetch(url);
        if (!res.ok) {
          // Retry once after brief pause if 500/busy
          await new Promise((resolve) => setTimeout(resolve, 300));
          res = await fetch(url);
        }
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
      console.log(`✅ [${locale.padEnd(8)}] ${targetRoutes.length}/${targetRoutes.length} SSR routes clean & reachable`);
    } else {
      console.warn(`⚠️ [${locale.padEnd(8)}] ${localeLeaks} leaks, ${localeHttpErrors} HTTP/network failures`);
    }
  }

  console.log('\n======================================================');
  console.log(`SUMMARY: ${targetLocales.length} locales checked across ${targetRoutes.length} routes (${targetLocales.length * targetRoutes.length} total requests).`);
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
    if (exitOnFailure) {
      process.exit(1);
    }
  } else {
    console.log(`✅ SSR STATIC LEAK AUDIT COMPLETE: 100% PASS with 0 HTTP errors and 0 monitored English leaks across all tested locales.`);
    console.log(`(Scope: Validates server-rendered dropzone and sandbox notice patterns; dynamic client interactive states are verified in dedicated component tests.)`);
  }

  return { totalLeaks, totalHttpErrors, leakReports, httpErrorReports };
}

// If run directly from CLI (e.g. npx tsx scripts/audit_all_locales.mjs)
import { fileURLToPath } from 'url';
import path from 'path';

if (process.argv[1]) {
  const scriptPath = path.resolve(process.argv[1]);
  const currentPath = path.resolve(fileURLToPath(import.meta.url));
  if (scriptPath === currentPath) {
    audit();
  }
}

