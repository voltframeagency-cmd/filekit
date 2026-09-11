import { promises as fs } from 'fs';

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
  '/ico-to-png',
  '/svg-to-png',
  '/svg-to-jpg',
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
  '/woff2-to-ttf',
  '/ocr-pdf'
];

async function scanLocale(loc) {
  console.log(`\n==============================================`);
  console.log(` AUDITING LOCALE: ${loc}`);
  console.log(`==============================================`);

  let clean = 0;
  let leaksCount = 0;
  const leaksFound = [];

  const leakSubstrings = [
    'Drop your PDF here',
    'Drop your image here',
    'Supports JPG, PNG, and static WebP up to 50 MB',
    'Select PowerPoint Presentation',
    'High-fidelity LibreOffice',
    'Select Photo to Strip Metadata',
    'Zero uploads to servers',
    'Select Font File',
    'Optimized for fast web delivery',
    'Drop files to zip together',
    'Select archive file to extract',
    'Supports all file formats',
    'Processed locally inside your browser',
    'Open navigation menu',
    'Free basic tools. Premium exports from €4.99. No hidden trials.',
    'Files never leave your browser',
    'Resize image dimensions and file size locally',
    'Target Width (px)',
    'Target Height (px)',
    'Download Compressed Image',
    'Compression Settings'
  ];

  for (const r of routes) {
    const url = `http://localhost:3000/${loc}` + (r === '/' ? '' : r);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`❌ [HTTP ${res.status}] ${url}`);
        leaksCount++;
        leaksFound.push({ route: r, reason: `HTTP status ${res.status}` });
        continue;
      }
      const html = await res.text();

      const routeLeaks = [];
      for (const pattern of leakSubstrings) {
        if (html.includes(pattern)) {
          routeLeaks.push(pattern);
        }
      }

      if (routeLeaks.length > 0) {
        console.log(`⚠️ [LEAK] ${r} -> ${routeLeaks.join('; ')}`);
        leaksCount++;
        leaksFound.push({ route: r, leaks: routeLeaks });
      } else {
        clean++;
        process.stdout.write('✓');
      }
    } catch (err) {
      console.error(`❌ [ERR] ${url} -> ${err.message}`);
      leaksCount++;
      leaksFound.push({ route: r, error: err.message });
    }
  }

  console.log(`\nResult for ${loc}: ${clean}/${clean + leaksCount} routes clean.`);
  return { loc, clean, leaksCount, leaksFound };
}

async function main() {
  await scanLocale('zh-CN');
  await scanLocale('zh-cn');
  await scanLocale('zh');
}

main();
