import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';

const loc = 'lv';

console.log('--- Categories ---');
for (const catKey of Object.keys(MEGA_MENU_CATEGORIES)) {
  const val = MEGA_MENU_CATEGORIES[catKey][loc];
  if (!val) console.log('Missing category:', catKey);
}

console.log('--- Tools ---');
for (const toolKey of Object.keys(EXACT_TOOL_LABELS)) {
  const val = EXACT_TOOL_LABELS[toolKey][loc];
  if (!val) console.log('Missing tool:', toolKey);
}

console.log('--- Featured Cards ---');
for (const descKey of Object.keys(PRIMARY_DESCRIPTIONS)) {
  const val = PRIMARY_DESCRIPTIONS[descKey][loc];
  if (!val) console.log('Missing desc:', descKey);
}

console.log('--- SEO ---');
const seo = getToolSeoContent('/compress-pdf', 'Compress PDF', loc);
console.log('seo category:', !!seo.category);
console.log('seo entityDefinition:', !!seo.entityDefinition);
console.log('seo howToSteps:', seo.howToSteps?.length);
console.log('seo faqs:', seo.faqs?.length);
