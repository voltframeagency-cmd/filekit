const http = require('http');
const fs = require('fs');

const slugs = JSON.parse(fs.readFileSync('all_tool_slugs.json', 'utf8'));

// Common English strings or raw untranslated keys that should not appear in Malay workspace UI
const rawKeyPatterns = [
  'workspace.dropNotice',
  'workspace.pdfOnly',
  'workspace.stayOnDevice',
  'workspace.dropFileHere',
  'workspace.dropHere',
  'homepage.',
  'trust.',
  'nav.'
];

const leakPatterns = [
  'Drop your PDF here or browse',
  'Drop files here to compress',
  'Drop files here to convert',
  'Drop images here',
  'Drop font files here',
  'Drop TAR file here',
  'Drop files here to create ZIP',
  'Drop 7Z file here',
  'Drop RAR file here',
  'Drop ZIP file here',
  'Drop your subtitle file here',
  'Drop your audio file here',
  'Drop your video file here',
  'Drop document here',
  'Drop your document here',
  'Select Scanned Document or Image',
  'Choose PDF or Image',
  '100% private in-browser OCR',
  'Recognize & Extract Text',
  'Performing OCR Recognition...',
  'Select Audio File',
  'Select Video File',
  'Select Document to Convert',
  'Convert to PDF',
  'Download Converted Image',
  'Conversion Options'
];

async function fetchRoute(slug) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/ms' + slug, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ slug, statusCode: res.statusCode, html: data });
      });
    }).on('error', err => {
      resolve({ slug, statusCode: 500, error: err.message, html: '' });
    });
  });
}

(async () => {
  console.log('Auditing all', slugs.length, 'routes under /ms ...');
  const leaksFound = [];
  const rawKeysFound = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const res = await fetchRoute(slug);
    if (res.statusCode !== 200) {
      console.log(`[HTTP ${res.statusCode}] /ms${slug}`);
      continue;
    }

    const mainMatch = res.html.match(/<main[\s\S]*?<\/main>/);
    const mainHtml = mainMatch ? mainMatch[0] : res.html;

    // Check for raw keys
    const matchedRawKeys = [];
    for (const k of rawKeyPatterns) {
      if (mainHtml.includes(k)) {
        matchedRawKeys.push(k);
      }
    }
    if (matchedRawKeys.length > 0) {
      console.log(`⚠️ RAW KEY in /ms${slug} =>`, matchedRawKeys.join(', '));
      rawKeysFound.push({ slug, rawKeys: matchedRawKeys });
    }

    // Check for leak patterns
    const matchedLeaks = [];
    for (const p of leakPatterns) {
      if (mainHtml.includes(p)) {
        matchedLeaks.push(p);
      }
    }
    if (matchedLeaks.length > 0) {
      console.log(`❌ LEAK in /ms${slug} =>`, matchedLeaks.join(', '));
      leaksFound.push({ slug, leaks: matchedLeaks });
    }
  }

  console.log('\n=======================================');
  console.log('Audit complete.');
  console.log('Total routes with raw keys:', rawKeysFound.length);
  console.log('Total routes with leaks:', leaksFound.length);
  console.log('=======================================');
  fs.writeFileSync('ms_leaks_audit.json', JSON.stringify({ rawKeysFound, leaksFound }, null, 2));
})();
