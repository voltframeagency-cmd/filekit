import { getToolSeoContent, detectToolFamily } from '../src/config/seo/toolFaqs.ts';
import { CATEGORY_TRANSLATIONS } from '../src/config/seo/categories.ts';
import { HOW_TO_STEPS } from '../src/config/seo/howToSteps.ts';
import { FAMILY_FAQS } from '../src/config/seo/familyFaqs.ts';

console.log('=== AUDITING BULGARIAN SEO & FAQ COVERAGE ===');

const families = [
  'pdf', 'image', 'video', 'audio', 'archive', 'office',
  'ebook', 'cad', 'vector', 'subtitles', 'apple', 'ocr', 'fonts'
];

let pass = true;

for (const fam of families) {
  const cat = CATEGORY_TRANSLATIONS[fam]?.bg;
  const steps = HOW_TO_STEPS[fam]?.bg;
  const faqs = FAMILY_FAQS[fam]?.bg;

  console.log(`\nFamily [${fam}]:`);
  console.log(`  Category: ${cat || 'MISSING ❌'}`);
  console.log(`  HowTo Steps: ${steps ? steps.length + ' steps' : 'MISSING ❌'}`);
  console.log(`  FAQs: ${faqs ? faqs.length + ' items' : 'MISSING ❌'}`);

  if (!cat || !steps || !faqs) pass = false;
}

console.log(`\nSEO & FAQ Audit Result: ${pass ? '100% COMPLETE ✅' : 'FAIL ❌'}`);
