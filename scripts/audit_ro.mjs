import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';

console.log('=== VERIFYING ROMANIAN (ro) COMPONENT & SEO READINESS ===');

let pass = 0;
let total = 0;

function check(name, condition) {
  total++;
  if (condition) pass++;
  console.log((condition ? '✓' : '✗') + ' ' + name);
}

// 1. Mega Menu Categories
console.log('\n--- 1. Mega Menu Categories (ro) ---');
check('IMAGE COMPRESSION', MEGA_MENU_CATEGORIES['IMAGE COMPRESSION']['ro'] === 'COMPRESIE IMAGINI');
check('PDF TOOLS', MEGA_MENU_CATEGORIES['PDF']['ro'] === 'INSTRUMENTE PDF');
check('PAGE EDITING & ORGANIZATION', MEGA_MENU_CATEGORIES['PAGE EDITING & ORGANIZATION']['ro'] === 'EDITARE ȘI ORGANIZARE PAGINI');
check('COMPRESS & CONVERT', MEGA_MENU_CATEGORIES['COMPRESS & CONVERT']['ro'] === 'COMPRESIE ȘI CONVERSIE');
check('POPULAR TARGET SIZES', MEGA_MENU_CATEGORIES['POPULAR TARGET SIZES']['ro'] === 'DIMENSIUNI ȚINTĂ POPULARE');
check('IMAGE CONVERT', MEGA_MENU_CATEGORIES['IMAGE CONVERT']['ro'] === 'CONVERSIE IMAGINI');
check('VIDEO TOOLS', MEGA_MENU_CATEGORIES['VIDEO TOOLS']['ro'] === 'INSTRUMENTE VIDEO');
check('AUDIO TOOLS', MEGA_MENU_CATEGORIES['AUDIO TOOLS']['ro'] === 'INSTRUMENTE AUDIO');
check('ARCHIVE & UTILITIES', MEGA_MENU_CATEGORIES['ARCHIVE & UTILITIES']['ro'] === 'ARHIVE ȘI UTILITĂȚI');

// 2. Exact Tool Links (ro)
console.log('\n--- 2. Exact Tool Links (ro) ---');
check('Merge PDF Files', EXACT_TOOL_LABELS['Merge PDF Files']['ro'] === 'Îmbină fișiere PDF');
check('Split PDF Document', EXACT_TOOL_LABELS['Split PDF Document']['ro'] === 'Împarte document PDF');
check('PDF Compressor', EXACT_TOOL_LABELS['PDF Compressor']['ro'] === 'Compresor PDF');
check('Image Compressor', EXACT_TOOL_LABELS['Image Compressor']['ro'] === 'Compresor imagini');
check('Compress to a Specific Size', EXACT_TOOL_LABELS['Compress to a Specific Size']['ro'] === 'Comprimă la o dimensiune specifică');
check('Reorder Pages', EXACT_TOOL_LABELS['Reorder Pages']['ro'] === 'Reordonează paginile');
check('Reverse PDF', EXACT_TOOL_LABELS['Reverse PDF']['ro'] === 'Inversează PDF');
check('Add Blank Page', EXACT_TOOL_LABELS['Add Blank Page']['ro'] === 'Adaugă pagină albă');
check('Duplicate Pages', EXACT_TOOL_LABELS['Duplicate Pages']['ro'] === 'Duplică paginile');
check('Rotate Pages', EXACT_TOOL_LABELS['Rotate Pages']['ro'] === 'Rotește paginile');
check('Delete Pages', EXACT_TOOL_LABELS['Delete Pages']['ro'] === 'Șterge pagini');
check('Extract Pages', EXACT_TOOL_LABELS['Extract Pages']['ro'] === 'Extrage pagini');
check('Extract Images', EXACT_TOOL_LABELS['Extract Images']['ro'] === 'Extrage imagini');
check('Flatten PDF', EXACT_TOOL_LABELS['Flatten PDF']['ro'] === 'Aplatizează PDF');
check('Add Watermark', EXACT_TOOL_LABELS['Add Watermark']['ro'] === 'Adaugă filigran');
check('Grayscale Image', EXACT_TOOL_LABELS['Grayscale Image']['ro'] === 'Imagine în tonuri de gri');
check('Invert Image', EXACT_TOOL_LABELS['Invert Image']['ro'] === 'Inversează culori imagine');
check('Blur Image', EXACT_TOOL_LABELS['Blur Image']['ro'] === 'Estompează imaginea');
check('Crop Image', EXACT_TOOL_LABELS['Crop Image']['ro'] === 'Decupează imaginea');
check('Resize Image', EXACT_TOOL_LABELS['Resize Image']['ro'] === 'Redimensionează imaginea');
check('Rotate Image', EXACT_TOOL_LABELS['Rotate Image']['ro'] === 'Rotește imaginea');
check('Flip Image', EXACT_TOOL_LABELS['Flip Image']['ro'] === 'Întoarce imaginea');
check('Compress Video', EXACT_TOOL_LABELS['Compress Video']['ro'] === 'Comprimă video');
check('Convert Video', EXACT_TOOL_LABELS['Convert Video']['ro'] === 'Convertește video');
check('Convert Audio', EXACT_TOOL_LABELS['Convert Audio']['ro'] === 'Convertește audio');
check('Compress Audio', EXACT_TOOL_LABELS['Compress Audio']['ro'] === 'Comprimă audio');
check('Extract ZIP', EXACT_TOOL_LABELS['Extract ZIP']['ro'] === 'Extrage ZIP');
check('Create ZIP', EXACT_TOOL_LABELS['Create ZIP']['ro'] === 'Creează ZIP');

// 3. Primary Descriptions
console.log('\n--- 3. Primary Card Descriptions (ro) ---');
check('IMAGE_OPTIMIZE', PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE.ro === 'Optimizează imagini JPG, PNG și WebP local');
check('MERGE_PDF', PRIMARY_DESCRIPTIONS.MERGE_PDF.ro === 'Combină mai multe fișiere PDF în browser');
check('SHRINK_PDF', PRIMARY_DESCRIPTIONS.SHRINK_PDF.ro === 'Redu fișierele PDF sub 2 MB în browser');

// 4. SEO Content & FAQs
console.log('\n--- 4. SEO FAQs & Content (ro) ---');
const pdfSeo = getToolSeoContent('/compress-pdf', 'Comprimare PDF', 'ro');
check('PDF Category Pill', pdfSeo.category.length > 0);
check('PDF Entity Definition', pdfSeo.entityDefinition.length > 0);
check('PDF How-To Steps (3 steps)', pdfSeo.howToSteps.length === 3);
check('PDF FAQs (at least 3)', pdfSeo.faqs.length >= 3);

console.log('\nFINAL ROMANIAN AUDIT SCORE: ' + pass + '/' + total + ' PASSED (' + Math.round(pass/total*100) + '%)');
