import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';
import { UI_TRANSLATIONS } from '../src/config/i18n/translations.ts';

function auditLocale(locale, name) {
  console.log(`\n========================================`);
  console.log(` AUDITING LOCALE: ${name} (${locale})`);
  console.log(`========================================`);

  let total = 0;
  let pass = 0;

  function assert(condition, desc) {
    total++;
    if (condition) {
      pass++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
    }
  }

  // 1. UI_TRANSLATIONS
  const ui = UI_TRANSLATIONS[locale];
  assert(!!ui, 'UI_TRANSLATIONS entry exists');
  if (ui) {
    assert(!!ui.nav?.allTools, 'nav.allTools defined');
    assert(!!ui.nav?.searchPlaceholder, 'nav.searchPlaceholder defined');
    assert(!!ui.homepage?.heroTitle, 'homepage.heroTitle defined');
    assert(!!ui.homepage?.dropzoneTitle, 'homepage.dropzoneTitle defined');
    assert(!!ui.workspace?.selectFile, 'workspace.selectFile defined');
    assert(!!ui.workspace?.processing, 'workspace.processing defined');
    assert(!!ui.trust?.badge1, 'trust.badge1 defined');
  }

  // 2. Mega Menu Categories
  let mmCatPassed = 0;
  let mmCatTotal = 0;
  for (const [cat, map] of Object.entries(MEGA_MENU_CATEGORIES)) {
    mmCatTotal++;
    if (map[locale] && map[locale].trim().length > 0 && !map[locale].includes('MISSING')) {
      mmCatPassed++;
    } else {
      console.warn(`⚠️ Missing MegaMenu Category [${cat}] for ${locale}: got "${map[locale]}"`);
    }
  }
  assert(mmCatPassed === mmCatTotal, `MegaMenu Categories complete (${mmCatPassed}/${mmCatTotal})`);

  // 3. Exact Tool Labels
  let toolLabelPassed = 0;
  let toolLabelTotal = 0;
  for (const [tool, map] of Object.entries(EXACT_TOOL_LABELS)) {
    toolLabelTotal++;
    if (map[locale] && map[locale].trim().length > 0) {
      toolLabelPassed++;
    } else {
      console.warn(`⚠️ Missing Tool Label [${tool}] for ${locale}`);
    }
  }
  assert(toolLabelPassed === toolLabelTotal, `Exact Tool Labels complete (${toolLabelPassed}/${toolLabelTotal})`);

  // 4. Primary Descriptions
  let descPassed = 0;
  let descTotal = 0;
  for (const [key, map] of Object.entries(PRIMARY_DESCRIPTIONS)) {
    descTotal++;
    if (map[locale] && map[locale].trim().length > 0) {
      descPassed++;
    } else {
      console.warn(`⚠️ Missing Primary Description [${key}] for ${locale}`);
    }
  }
  assert(descPassed === descTotal, `Primary Descriptions complete (${descPassed}/${descTotal})`);

  // 5. SEO FAQs & How-To for key tools
  const sampleTools = [
    '/compress-pdf',
    '/merge-pdf',
    '/resize-image',
    '/word-to-pdf'
  ];
  for (const tool of sampleTools) {
    const seo = getToolSeoContent(tool, 'Tool', locale);
    assert(!!seo.category && seo.category.length > 0, `SEO category exists for ${tool}`);
    assert(!!seo.entityDefinition && seo.entityDefinition.length > 0, `SEO entityDefinition exists for ${tool}`);
    assert(seo.howToSteps && seo.howToSteps.length === 3, `SEO 3 howToSteps exist for ${tool}`);
    assert(seo.faqs && seo.faqs.length >= 3, `SEO FAQs (>=3) exist for ${tool}`);
  }

  console.log(`Audit summary for ${locale}: ${pass}/${total} assertions passed (${Math.round((pass/total)*100)}%)`);
  return { locale, pass, total, clean: pass === total };
}

console.log('--- STARTING IN-MEMORY AUDIT FOR RU & UK ---');
const ruResult = auditLocale('ru', 'Russian');
const ukResult = auditLocale('uk', 'Ukrainian');

if (ruResult.clean && ukResult.clean) {
  console.log('\n✅ BOTH RU AND UK PASSED 100% OF LOCALIZATION AUDIT ASSERTIONS!');
} else {
  console.error('\n❌ AUDIT FOUND ISSUES IN RU OR UK');
  process.exit(1);
}
