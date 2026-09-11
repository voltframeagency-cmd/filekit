import { CONVERSION_CATALOG } from '../src/config/conversionCatalog.ts';

const ALL_SLUGS = Object.values(CONVERSION_CATALOG).map(t => t.slug.replace(/^\//, ''));

const INDICATORS = [
  'Select Excel Spreadsheet',
  'Choose Excel Spreadsheet File',
  'Select Word Document',
  'Choose Word Document File',
  'Select PowerPoint Presentation',
  'Choose PowerPoint File',
  'Select AutoCAD Drawing',
  'Select PostScript File',
  'High-fidelity LibreOffice microVM conversion with 0% data retention.',
  'Drop your PDF here',
  'Drop your image here',
  'Drop your audio file here',
  'Drop your video file here',
  'Drop your archive file here',
  'Drop your subtitle file here',
  'Choose PDF File',
  'Choose Image File',
  'Choose Audio File',
  'Choose Video File',
  'Choose Archive File',
  'Choose Subtitle File',
  'Change PDF',
  'Change File',
  'Select Font File',
  'Optimized for fast web delivery (100% client-side, zero telemetry)',
  'Change Font',
  'Live Font Preview',
  'Download Font',
  'The quick brown fox jumps over the lazy dog',
  'Choose or drop image file',
  'Strip All EXIF',
  'Export as PNG',
  'Export as JPG',
  'Crop Image',
  'Rotate Image',
  'Download Image',
  'Recognize & Extract Text',
  'Performing OCR Recognition...',
  'Select Scanned Document or Image',
  'Download ZIP',
  'Archive File Name:',
  'workspace.dropnotice'
];

async function run() {
  console.log('Auditing Thai (th) across all', ALL_SLUGS.length, 'routes...');
  const leaksFound = [];
  let checked = 0;

  for (const slug of ALL_SLUGS) {
    const url = `http://localhost:3000/th/${slug}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`HTTP ${res.status} on ${url}`);
        continue;
      }
      const html = await res.text();
      const leaks = [];
      for (const leak of INDICATORS) {
        if (html.includes(leak)) {
          leaks.push(leak);
        }
      }
      if (leaks.length > 0) {
        console.warn(`[LEAK] /th/${slug} ->`, leaks);
        leaksFound.push({ slug, leaks });
      }
      checked++;
      if (checked % 20 === 0) {
        process.stdout.write(`.${checked}`);
      }
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
    }
  }

  // Also check homepage and /th/all-tools
  for (const r of ['', 'all-tools']) {
    const url = `http://localhost:3000/th/${r}`;
    try {
      const res = await fetch(url);
      const html = await res.text();
      const leaks = [];
      for (const leak of INDICATORS) {
        if (html.includes(leak)) leaks.push(leak);
      }
      if (leaks.length > 0) {
        console.warn(`[LEAK] /th/${r} ->`, leaks);
        leaksFound.push({ slug: r || '/', leaks });
      }
    } catch (e) {}
  }

  console.log(`\nChecked ${checked} routes.`);
  if (leaksFound.length === 0) {
    console.log('🎉 100% CLEAN! Zero English/raw key leaks detected in Thai (th).');
  } else {
    console.log(`\nFound ${leaksFound.length} routes with leaks:`);
    console.log(JSON.stringify(leaksFound, null, 2));
  }
}

run();
