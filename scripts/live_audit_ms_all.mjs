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
  'Change File'
];

async function run() {
  console.log('Total routes in catalog:', ALL_SLUGS.length);
  const leaksFound = [];
  let checked = 0;

  for (const slug of ALL_SLUGS) {
    const url = `http://localhost:3000/ms/${slug}`;
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
        console.warn(`[LEAK] /ms/${slug} ->`, leaks);
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

  console.log(`\nChecked ${checked}/${ALL_SLUGS.length} routes.`);
  if (leaksFound.length === 0) {
    console.log('🎉 100% CLEAN! Zero English leaks detected across all Malay routes.');
  } else {
    console.log(`Found ${leaksFound.length} routes with leaks:`, JSON.stringify(leaksFound, null, 2));
  }
}

run();
