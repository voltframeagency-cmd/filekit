import { CONVERSION_CATALOG } from '../src/config/conversionCatalog.js';

const routes = ['/lv', ...Object.keys(CONVERSION_CATALOG).map(slug => `/lv${slug}`)];

console.log(`Starting deep audit for all ${routes.length} /lv routes...`);

const ENGLISH_LEAKS = [
  'Drop your PDF document here or browse',
  'Drop your image here or browse',
  'Select .SRT subtitle file',
  'Select .VTT subtitle file',
  '100% In-Browser · Private & Instant Conversion',
  'Supports standard PDF documents up to 50 MB',
  'Supports JPG, PNG, and static WebP up to 50 MB',
  '🔒 Your PDF is processed locally',
  '🔒 Your image is processed locally',
  'Download Compressed PDF',
  'Download Best Result',
  'Compress PDF',
  'Choose Another',
  'Compressing PDF...',
  'No beneficial reduction'
];

async function checkRoute(route) {
  const url = `http://localhost:3000${route}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { route, status: res.status, error: `HTTP ${res.status}` };
    }
    const html = await res.text();
    
    // Check English leaks
    const foundLeaks = [];
    for (const leak of ENGLISH_LEAKS) {
      if (html.includes(leak)) {
        foundLeaks.push(leak);
      }
    }

    // Check title & H1
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const h1 = h1Match ? h1Match[1] : '';

    return {
      route,
      status: 200,
      title,
      h1,
      leaks: foundLeaks
    };
  } catch (err) {
    return { route, status: 0, error: err.message };
  }
}

async function run() {
  const BATCH_SIZE = 10;
  const results = [];
  
  for (let i = 0; i < routes.length; i += BATCH_SIZE) {
    const batch = routes.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(checkRoute));
    results.push(...batchResults);
    process.stdout.write(`Audited ${results.length}/${routes.length} routes...\r`);
  }

  console.log(`\nAudit finished for ${results.length} routes.`);

  const errors = results.filter(r => r.status !== 200);
  const leaks = results.filter(r => r.leaks && r.leaks.length > 0);

  console.log(`\nHTTP Failures: ${errors.length}`);
  for (const e of errors) {
    console.log(`  [${e.status}] ${e.route}: ${e.error}`);
  }

  console.log(`\nRoutes with English Leaks: ${leaks.length}`);
  for (const l of leaks) {
    console.log(`  ${l.route}: leaks ->`, l.leaks);
  }

  if (errors.length === 0 && leaks.length === 0) {
    console.log(`\n✅ 100% of all ${routes.length} /lv routes are PASSING with 0 errors and 0 leaks!`);
  }
}

run();
