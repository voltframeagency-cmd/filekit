// Comprehensive multi-locale leak detector across representative languages and rendered DOM surfaces

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
  'Converting PDF into responsive EPUB eBook...',
  'Your conversion is complete',
  'Drop a file anywhere to get started',
  'or click to browse files from your device',
  'Explore all 100+ tools',
  'Popular Tools',
  'Browser-first processing',
  'Automatic deletion after server jobs',
  'No account required',
  '100% Private & Secure'
];

// Structural DOM and Interactive State Leak Patterns
export const DOM_LEAK_RULES = {
  buttons: [
    'Select File',
    'Choose File',
    'Download File',
    'Change File',
    'Compress PDF',
    'Recompress PDF',
    'Download Compressed PDF',
    'Download Original PDF',
    'Download Best Result',
    'Download TXT',
    'Download Searchable PDF',
    'Recognize & Extract Text',
    'Copy Text',
    'Apply Watermark',
    'Convert to PDF',
    'All Tools →',
    'Dismiss'
  ],
  placeholders: [
    'Search 100+ tools...',
    'Search tools (e.g. merge, png)...',
    'Enter watermark text',
    'e.g. 1-3, 5'
  ],
  ariaLabels: [
    'Convert Tools',
    'Open navigation menu',
    'Close navigation menu',
    'Mobile Navigation Menu',
    'Search tools',
    'Tool search results'
  ],
  megaMenus: [
    'IMAGE COMPRESSION',
    'PDF TOOLS',
    'COMPRESS & CONVERT',
    'POPULAR TARGET SIZES',
    'PAGE EDITING & ORGANIZATION',
    'CONVERT FROM PDF',
    'CONVERT TO PDF',
    'DOCUMENTS & E-BOOKS',
    'CAD & VECTOR TOOLS',
    'AUDIO TOOLS',
    'ARCHIVE & UTILITIES',
    'FORMAT PAIRS'
  ],
  uploadStates: [
    'Drop your PDF document here',
    'Drop your image here',
    'Supports standard PDF documents up to 50 MB',
    'Supports JPG, PNG, and WebP',
    'Select Scanned Document or Image'
  ],
  progressStates: [
    'Compressing PDF locally...',
    'Processing locally...',
    'Reading file data into memory...',
    'Performing OCR Recognition...',
    'Sanitizing image...',
    'Rendering document pages...'
  ],
  errorStates: [
    'Failed to recognize text in document.',
    'Please select a valid PDF document.',
    'Minimum PDF target size limit is 100 KB.',
    'Maximum PDF target size limit is 50 MB.',
    'An error occurred while processing your file.'
  ],
  resultStates: [
    'PDF compressed successfully',
    'No beneficial reduction',
    'We reduced the PDF, but could not reach requested size safely',
    'Your PDF is already below requested size',
    'OCR Completed',
    'Successfully converted to PDF'
  ]
};

import { ALL_LOCALES, NON_DEFAULT_LOCALES } from '../src/config/i18n/locales.ts';

const TEST_LOCALES = ALL_LOCALES;
const NON_EN_LOCALES = NON_DEFAULT_LOCALES;

export function inspectRenderedDom(html, locale, route = '') {
  const leaks = [];
  if (locale === 'en') return leaks;

  // 1. Static LEAK_PATTERNS
  for (const pattern of LEAK_PATTERNS) {
    if (html.includes(pattern)) {
      leaks.push({ type: 'static_pattern', pattern, context: route });
    }
  }

  // 2. Buttons: <button[^>]*>([\s\S]*?)<\/button>
  const buttonMatches = html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi);
  for (const match of buttonMatches) {
    const rawText = match[1].replace(/<[^>]+>/g, '').trim();
    for (const rule of DOM_LEAK_RULES.buttons) {
      if (rawText === rule) {
        leaks.push({ type: 'button', pattern: rule, text: rawText, context: route });
      }
    }
  }

  // 3. Placeholders: placeholder="([^"]+)"
  const placeholderMatches = html.matchAll(/placeholder=["']([^"']+)["']/gi);
  for (const match of placeholderMatches) {
    const ph = match[1].trim();
    for (const rule of DOM_LEAK_RULES.placeholders) {
      if (ph === rule) {
        leaks.push({ type: 'placeholder', pattern: rule, text: ph, context: route });
      }
    }
  }

  // 4. ARIA labels: aria-label="([^"]+)"
  const ariaMatches = html.matchAll(/aria-label=["']([^"']+)["']/gi);
  for (const match of ariaMatches) {
    const label = match[1].trim();
    for (const rule of DOM_LEAK_RULES.ariaLabels) {
      if (label === rule) {
        leaks.push({ type: 'aria_label', pattern: rule, text: label, context: route });
      }
    }
  }

  // 5. Mega Menu categories & headings
  for (const rule of DOM_LEAK_RULES.megaMenus) {
    if (html.includes(`>${rule}<`) || html.includes(`>${rule} <`) || html.includes(`">${rule}"`)) {
      leaks.push({ type: 'mega_menu', pattern: rule, context: route });
    }
  }

  // 6. Interactive state texts: uploadStates, progressStates, errorStates, resultStates
  const stateCategories = ['uploadStates', 'progressStates', 'errorStates', 'resultStates'];
  for (const cat of stateCategories) {
    for (const rule of DOM_LEAK_RULES[cat]) {
      if (html.includes(rule)) {
        leaks.push({ type: cat, pattern: rule, context: route });
      }
    }
  }

  return leaks;
}

export async function audit(options = {}) {
  const baseUrl = options.baseUrl || 'http://localhost:3000';
  const targetLocales = options.locales || TEST_LOCALES;
  const targetRoutes = options.routes || routes;
  const exitOnFailure = options.exitOnFailure !== undefined ? options.exitOnFailure : true;

  console.log(`Starting Comprehensive Rendered-DOM & State Audit across ${targetLocales.length} locales and ${targetRoutes.length} routes (${targetLocales.length * targetRoutes.length} total checks)...`);

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
        const detected = inspectRenderedDom(html, locale, r);

        if (detected.length > 0) {
          localeLeaks += detected.length;
          totalLeaks += detected.length;
          leakReports.push({ locale, route: r, leaks: detected.map(d => `${d.type}: ${d.pattern}`), url });
        }
      } catch (err) {
        console.error(`❌ [Network/Fetch Error] ${url}: ${err.message}`);
        localeHttpErrors++;
        totalHttpErrors++;
        httpErrorReports.push({ locale, route: r, error: err.message, url });
      }
    }
    if (localeLeaks === 0 && localeHttpErrors === 0) {
      console.log(`✅ [${locale.padEnd(8)}] ${targetRoutes.length}/${targetRoutes.length} routes clean (DOM, ARIA, states, buttons verified)`);
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
    console.log(`✅ RENDERED-DOM & STATE LEAK AUDIT COMPLETE: 100% PASS with 0 HTTP errors and 0 monitored English leaks across all tested locales.`);
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
