// Targeted test for Batch 1: Navigation Surface Localization
import { 
  NOUN_MAP, 
  NAV_ACCESSIBILITY_LABELS, 
  SEARCH_HEADER_LABELS, 
  formatFoundCount, 
  EXACT_TOOL_LABELS 
} from '../src/components/navigation/megaMenuTranslations.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ Assertion Failed: ${message}`);
  }
}

console.log('--- Testing megaMenuTranslations Units ---');

// 1. NOUN_MAP coverage for no and bg
assert(NOUN_MAP.Image.no === 'Bilde', `NOUN_MAP.Image.no is ${NOUN_MAP.Image.no}, expected 'Bilde'`);
assert(NOUN_MAP.Image.bg === 'Изображение', `NOUN_MAP.Image.bg is ${NOUN_MAP.Image.bg}, expected 'Изображение'`);
assert(NOUN_MAP.Text.no === 'Tekst', `NOUN_MAP.Text.no is ${NOUN_MAP.Text.no}, expected 'Tekst'`);
assert(NOUN_MAP.Text.bg === 'Текст', `NOUN_MAP.Text.bg is ${NOUN_MAP.Text.bg}, expected 'Текст'`);

// 2. EXACT_TOOL_LABELS coverage for Image to PDF/WebP
assert(EXACT_TOOL_LABELS['Image to PDF']?.no === 'Bilde til PDF', `Image to PDF (no) is ${EXACT_TOOL_LABELS['Image to PDF']?.no}`);
assert(EXACT_TOOL_LABELS['Image to PDF']?.bg === 'Изображение в PDF', `Image to PDF (bg) is ${EXACT_TOOL_LABELS['Image to PDF']?.bg}`);
assert(EXACT_TOOL_LABELS['Image to WebP']?.no === 'Bilde til WebP', `Image to WebP (no) is ${EXACT_TOOL_LABELS['Image to WebP']?.no}`);
assert(EXACT_TOOL_LABELS['Image to WebP']?.bg === 'Изображение в WebP', `Image to WebP (bg) is ${EXACT_TOOL_LABELS['Image to WebP']?.bg}`);

// 3. NAV_ACCESSIBILITY_LABELS
assert(NAV_ACCESSIBILITY_LABELS.convertTools.no === 'Konverteringsverktøy', `convertTools (no) is ${NAV_ACCESSIBILITY_LABELS.convertTools.no}`);
assert(NAV_ACCESSIBILITY_LABELS.convertTools.bg === 'Инструменти за конвертиране', `convertTools (bg) is ${NAV_ACCESSIBILITY_LABELS.convertTools.bg}`);
assert(NAV_ACCESSIBILITY_LABELS.openMenu.no === 'Åpne navigasjonsmeny', `openMenu (no) is ${NAV_ACCESSIBILITY_LABELS.openMenu.no}`);
assert(NAV_ACCESSIBILITY_LABELS.openMenu.bg === 'Отваряне на навигационното меню', `openMenu (bg) is ${NAV_ACCESSIBILITY_LABELS.openMenu.bg}`);
assert(NAV_ACCESSIBILITY_LABELS.closeMenu.no === 'Lukk navigasjonsmeny', `closeMenu (no) is ${NAV_ACCESSIBILITY_LABELS.closeMenu.no}`);
assert(NAV_ACCESSIBILITY_LABELS.closeMenu.bg === 'Затваряне на навигационното меню', `closeMenu (bg) is ${NAV_ACCESSIBILITY_LABELS.closeMenu.bg}`);
assert(NAV_ACCESSIBILITY_LABELS.mobileMenu.no === 'Mobil navigasjonsmeny', `mobileMenu (no) is ${NAV_ACCESSIBILITY_LABELS.mobileMenu.no}`);
assert(NAV_ACCESSIBILITY_LABELS.mobileMenu.bg === 'Мобилно навигационно меню', `mobileMenu (bg) is ${NAV_ACCESSIBILITY_LABELS.mobileMenu.bg}`);

// 4. SEARCH_HEADER_LABELS and formatFoundCount
assert(SEARCH_HEADER_LABELS.matchingTools.no === 'Matchende verktøy', `matchingTools (no) is ${SEARCH_HEADER_LABELS.matchingTools.no}`);
assert(SEARCH_HEADER_LABELS.matchingTools.bg === 'Съвпадащи инструменти', `matchingTools (bg) is ${SEARCH_HEADER_LABELS.matchingTools.bg}`);
assert(formatFoundCount(5, 'no') === '5 funnet', `formatFoundCount(5, 'no') is ${formatFoundCount(5, 'no')}`);
assert(formatFoundCount(5, 'bg') === '5 намерени', `formatFoundCount(5, 'bg') is ${formatFoundCount(5, 'bg')}`);

console.log(`Unit checks: ${passed} passed, ${failed} failed.`);

// 5. Test Live SSR output for header navigation
async function testSsr() {
  console.log('\n--- Testing Live SSR Routes for no and bg ---');
  try {
    const resNo = await fetch('http://localhost:3000/no');
    if (!resNo.ok) {
      console.error(`HTTP ${resNo.status} fetching /no`);
      return;
    }
    const htmlNo = await resNo.text();

    assert(htmlNo.includes('Endre størrelse'), 'Norwegian SSR header includes Endre størrelse for nav.resize');
    assert(htmlNo.includes('Priser'), 'Norwegian SSR header includes Priser for nav.pricing');
    assert(htmlNo.includes('Åpne navigasjonsmeny'), 'Norwegian SSR header includes localized burger aria-label');
    assert(!htmlNo.includes('Image til PDF'), 'Norwegian SSR does NOT include mixed Image til PDF leak');

    const resBg = await fetch('http://localhost:3000/bg');
    if (!resBg.ok) {
      console.error(`HTTP ${resBg.status} fetching /bg`);
      return;
    }
    const htmlBg = await resBg.text();

    assert(htmlBg.includes('Преоразмеряване'), 'Bulgarian SSR header includes Преоразмеряване for nav.resize');
    assert(htmlBg.includes('Цени'), 'Bulgarian SSR header includes Цени for nav.pricing');
    assert(htmlBg.includes('Отваряне на навигационното меню'), 'Bulgarian SSR header includes localized burger aria-label');

    console.log(`Live SSR checks: ${passed} passed, ${failed} failed.`);
    if (failed === 0) {
      console.log('🎉 All Batch 1 navigation checks PASSED!');
    }
  } catch (err) {
    console.error('Error in SSR fetch:', err.message);
  }
}

testSsr();
