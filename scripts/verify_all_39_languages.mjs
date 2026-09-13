import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';
import { ALL_LOCALES } from '../src/config/i18n/locales.ts';

const ALL_39_LOCALES = ALL_LOCALES;

console.log('=== VERIFYING ALL 39 LANGUAGES ACROSS THE ENTIRE PLATFORM ===');

let totalChecks = 0;
let passedChecks = 0;

for (const loc of ALL_39_LOCALES) {
  let locPass = 0;
  let locTotal = 0;

  function testLoc(cond) {
    locTotal++;
    totalChecks++;
    if (cond) {
      locPass++;
      passedChecks++;
    }
  }

  // 1. Categories
  for (const catKey of Object.keys(MEGA_MENU_CATEGORIES)) {
    const val = MEGA_MENU_CATEGORIES[catKey][loc] || MEGA_MENU_CATEGORIES[catKey][loc.split('-')[0]];
    testLoc(val && val.length > 0);
  }

  // 2. Tools
  for (const toolKey of Object.keys(EXACT_TOOL_LABELS)) {
    const val = EXACT_TOOL_LABELS[toolKey][loc] || EXACT_TOOL_LABELS[toolKey][loc.split('-')[0]];
    testLoc(val && val.length > 0);
  }

  // 3. Featured Cards
  for (const descKey of Object.keys(PRIMARY_DESCRIPTIONS)) {
    const val = PRIMARY_DESCRIPTIONS[descKey][loc] || PRIMARY_DESCRIPTIONS[descKey][loc.split('-')[0]];
    testLoc(val && val.length > 0);
  }

  // 4. SEO Content & FAQs
  const seo = getToolSeoContent('/compress-pdf', 'Compress PDF', loc);
  testLoc(seo.category && seo.category.length > 0);
  testLoc(seo.entityDefinition && seo.entityDefinition.length > 0);
  testLoc(seo.howToSteps && seo.howToSteps.length === 3);
  testLoc(seo.faqs && seo.faqs.length >= 3);

  const percent = Math.round((locPass / locTotal) * 100);
  console.log(`${loc.padEnd(8)}: ${locPass}/${locTotal} checks passed (${percent}%) ${percent === 100 ? '✅' : '❌'}`);
}

console.log(`\n======================================================`);
console.log(`GLOBAL TOTAL: ${passedChecks}/${totalChecks} PASSED (${Math.round(passedChecks/totalChecks*100)}%)`);
console.log(`======================================================`);

if (passedChecks !== totalChecks) {
  console.error(`❌ Audit failed: ${totalChecks - passedChecks} checks did not pass.`);
  process.exit(1);
}

