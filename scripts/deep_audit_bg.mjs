import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';
import { UI_TRANSLATIONS } from '../src/config/i18n/translations.ts';

console.log('=== DEEP AUDIT FOR BULGARIAN (bg) ===');

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

async function deepAudit() {
  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    const url = 'http://localhost:3001/bg' + (r === '/' ? '' : r);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[FAIL] ${url} -> Status ${res.status}`);
        failed++;
        continue;
      }
      const html = await res.text();

      // Check for English leaks in core headings or buttons
      const leaks = [];
      if (html.includes('Drop your PDF here')) leaks.push('Drop your PDF here');
      if (html.includes('Drop your image here')) leaks.push('Drop your image here');
      if (html.includes('File Utility')) leaks.push('File Utility');
      if (html.includes('Select PowerPoint Presentation')) leaks.push('Select PowerPoint Presentation');
      if (html.includes('High-fidelity LibreOffice')) leaks.push('High-fidelity LibreOffice');
      
      if (leaks.length > 0) {
        console.warn(`[WARN] ${r} contains leaks: ${leaks.join(', ')}`);
        failed++;
      } else {
        passed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${url} -> ${e.message}`);
      failed++;
    }
  }

  console.log(`\nBulgarian Deep Audit Result: ${passed}/${passed + failed} routes fully clean.`);
}

deepAudit();
