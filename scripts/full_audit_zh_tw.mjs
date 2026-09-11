import fs from 'fs';

const allSlugs = JSON.parse(fs.readFileSync('./all_tool_slugs.json', 'utf8'));
const routes = ['/', '/all-tools', ...allSlugs];

const SUSPICIOUS_EN_PATTERNS = [
  /\bDrop your\b/i,
  /\bChoose (file|PDF|Image|Word|Excel|PowerPoint|Video|Audio|Document)\b/i,
  /\bSelect (file|PDF|Image|Word|Excel|PowerPoint|Video|Audio|Document|Files|PDFs)\b/i,
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
  /\bFast and secure\b/i,
  /\bactive pages\b/i,
  /\bselected\b/i,
  /\bStart Over\b/i,
  /\bAdjust Pages\b/i
];

async function scanZhTw() {
  console.log("==================================================");
  console.log(` FULL AUDIT FOR CHINESE TRADITIONAL (zh-TW): ${routes.length} routes`);
  console.log("==================================================");

  let leaksFound = 0;
  const report = [];

  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    const url = `http://localhost:3000/zh-TW` + (r === '/' ? '' : r);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`\n❌ [HTTP ${res.status}] ${url}`);
        report.push({ route: r, status: res.status, error: 'HTTP error' });
        leaksFound++;
        continue;
      }
      const html = await res.text();
      
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
        console.log(`\n⚠️  ${r}: Detected English phrases: [${matches.join(', ')}]`);
        report.push({ route: r, leaks: matches });
        leaksFound++;
      } else {
        process.stdout.write('.');
      }
    } catch (err) {
      console.error(`\nError fetching ${url}: ${err.message}`);
      report.push({ route: r, error: err.message });
      leaksFound++;
    }
  }

  console.log(`\n\n==================================================`);
  console.log(`Result for zh-TW: ${leaksFound === 0 ? '✅ 100% Clean (0 leaks across all routes)' : `❌ ${leaksFound} routes had leaks`}`);
  console.log(`==================================================`);
  fs.writeFileSync('./zh_tw_audit_report.json', JSON.stringify(report, null, 2));
}

scanZhTw();
