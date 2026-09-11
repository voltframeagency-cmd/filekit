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

// Patterns that indicate English text in user-facing UI
// (excluding code, JSON-LD, standard format acronyms like PDF, JPG, PNG, MB, KB, URL, etc.)
const SUSPICIOUS_EN_PATTERNS = [
  /\bDrop your\b/i,
  /\bChoose (file|PDF|Image|Word|Excel|PowerPoint)\b/i,
  /\bSelect (file|PDF|Image|Word|Excel|PowerPoint)\b/i,
  /\bProcessed locally\b/i,
  /\bBrowser-first\b/i,
  /\bAll tools\b/i,
  /\bPopular tools\b/i,
  /\bConvert to\b/i,
  /\bHigh-fidelity\b/i,
  /\bEphemeral\b/i,
  /\bMicroVM\b/i,
  /\bSandbox\b/i,
  /\bChange file\b/i,
  /\bDownload\b/i,
  /\bOriginal size\b/i,
  /\bNew size\b/i,
  /\bReduction\b/i,
  /\bProcessing\b/i,
  /\bSettings\b/i,
  /\bBalanced\b/i,
  /\bSmaller file\b/i,
  /\bBetter quality\b/i,
  /\bAdjust settings\b/i,
  /\bSupports\b/i,
  /\bPrivacy\b/i,
  /\bNotice\b/i,
  /\bAuthorize\b/i,
  /\bCancel\b/i,
  /\bDismiss\b/i,
  /\bMatching tools\b/i,
  /\bSearch tools\b/i,
  /\bExplore all\b/i,
  /\bZero file uploads\b/i,
  /\bNo account\b/i,
  /\bHow it works\b/i,
  /\bFrequently asked questions\b/i,
  /\bStep \d\b/i,
  /\bFree online\b/i,
  /\bFast and secure\b/i
];

async function scanZhCn() {
  console.log("==================================================");
  console.log(" DEEP AUDIT FOR CHINESE (zh-CN & zh-TW)");
  console.log("==================================================");

  for (const locale of ['zh-CN', 'zh-TW']) {
    console.log(`\nAuditing locale: ${locale}...`);
    let leaksFound = 0;

    for (const r of routes) {
      const url = `http://localhost:3000/${locale}` + (r === '/' ? '' : r);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`❌ [HTTP ${res.status}] ${url}`);
          continue;
        }
        const html = await res.text();
        
        // Strip script, style, SVG path tags to inspect visible text
        const textOnly = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
          .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
          .replace(/<!--[\s\S]*?-->/g, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&[a-z0-9#]+;/gi, ' ');

        const matches = [];
        for (const regex of SUSPICIOUS_EN_PATTERNS) {
          const m = textOnly.match(regex);
          if (m) {
            matches.push(m[0]);
          }
        }

        if (matches.length > 0) {
          console.log(`⚠️  ${r}: Detected English phrases: [${matches.join(', ')}]`);
          leaksFound++;
        } else {
          process.stdout.write('.');
        }
      } catch (err) {
        console.error(`\nError fetching ${url}: ${err.message}`);
      }
    }
    console.log(`\nResult for ${locale}: ${leaksFound === 0 ? '✅ 100% Clean (0 leaks)' : `❌ ${leaksFound} routes had leaks`}`);
  }
}

scanZhCn();
