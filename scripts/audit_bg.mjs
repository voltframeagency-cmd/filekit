import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';

console.log('=== AUDITING BULGARIAN (bg) COMPONENT & SEO READINESS ===');

let pass = 0;
let total = 0;

function check(name, condition) {
  total++;
  if (condition) pass++;
  console.log((condition ? '✓' : '✗') + ' ' + name);
}

// 1. Mega Menu Categories (bg)
console.log('\n--- 1. Mega Menu Categories (bg) ---');
check('IMAGE COMPRESSION', MEGA_MENU_CATEGORIES['IMAGE COMPRESSION']['bg'] === 'КОМПРЕСИРАНЕ НА ИЗОБРАЖЕНИЯ');
check('PDF TOOLS', MEGA_MENU_CATEGORIES['PDF']['bg'] === 'PDF ИНСТРУМЕНТИ');
check('PAGE EDITING & ORGANIZATION', MEGA_MENU_CATEGORIES['PAGE EDITING & ORGANIZATION']['bg'] === 'РЕДАКТИРАНЕ И ОРГАНИЗИРАНЕ НА СТРАНИЦИ');
check('COMPRESS & CONVERT', MEGA_MENU_CATEGORIES['COMPRESS & CONVERT']['bg'] === 'КОМПРЕСИРАНЕ И КОНВЕРТИРАНЕ');
check('POPULAR TARGET SIZES', MEGA_MENU_CATEGORIES['POPULAR TARGET SIZES']['bg'] === 'ПОПУЛЯРНИ РАЗМЕРИ');
check('IMAGE CONVERT', MEGA_MENU_CATEGORIES['IMAGE CONVERT']['bg'] === 'КОНВЕРТИРАНЕ НА ИЗОБРАЖЕНИЯ');
check('VIDEO TOOLS', MEGA_MENU_CATEGORIES['VIDEO TOOLS']['bg'] === 'ВИДЕО ИНСТРУМЕНТИ');
check('AUDIO TOOLS', MEGA_MENU_CATEGORIES['AUDIO TOOLS']['bg'] === 'АУДИО ИНСТРУМЕНТИ');
check('ARCHIVE & UTILITIES', MEGA_MENU_CATEGORIES['ARCHIVE & UTILITIES']['bg'] === 'АРХИВИ И ПОМОЩНИ ПРОГРАМИ');

// 2. Exact Tool Links (bg)
console.log('\n--- 2. Exact Tool Links (bg) ---');
check('Merge PDF Files', EXACT_TOOL_LABELS['Merge PDF Files']['bg'] === 'Обединяване на PDF файлове');
check('Split PDF Document', EXACT_TOOL_LABELS['Split PDF Document']['bg'] === 'Разделяне на PDF документ');
check('PDF Compressor', EXACT_TOOL_LABELS['PDF Compressor']['bg'] === 'PDF компресор');
check('Image Compressor', EXACT_TOOL_LABELS['Image Compressor']['bg'] === 'Компресор на изображения');
check('Compress to a Specific Size', EXACT_TOOL_LABELS['Compress to a Specific Size']['bg'] === 'Компресиране до определен размер');
check('Reorder Pages', EXACT_TOOL_LABELS['Reorder Pages']['bg'] === 'Пренареждане на страници');
check('Reverse PDF', EXACT_TOOL_LABELS['Reverse PDF']['bg'] === 'Обръщане на реда на PDF');
check('Add Blank Page', EXACT_TOOL_LABELS['Add Blank Page']['bg'] === 'Добавяне на празна страница');
check('Duplicate Pages', EXACT_TOOL_LABELS['Duplicate Pages']['bg'] === 'Дублиране на страници');
check('Rotate Pages', EXACT_TOOL_LABELS['Rotate Pages']['bg'] === 'Завъртане на страници');
check('Delete Pages', EXACT_TOOL_LABELS['Delete Pages']['bg'] === 'Изтриване на страници');
check('Extract Pages', EXACT_TOOL_LABELS['Extract Pages']['bg'] === 'Извличане на страници');
check('Extract Images', EXACT_TOOL_LABELS['Extract Images']['bg'] === 'Извличане на изображения');
check('Flatten PDF', EXACT_TOOL_LABELS['Flatten PDF']['bg'] === 'Изглаждане на PDF');
check('Add Watermark', EXACT_TOOL_LABELS['Add Watermark']['bg'] === 'Добавяне на воден знак');
check('Grayscale Image', EXACT_TOOL_LABELS['Grayscale Image']['bg'] === 'Черно-бяло изображение');
check('Invert Image', EXACT_TOOL_LABELS['Invert Image']['bg'] === 'Инвертиране на цветовете');
check('Blur Image', EXACT_TOOL_LABELS['Blur Image']['bg'] === 'Замъгляване на изображение');
check('Crop Image', EXACT_TOOL_LABELS['Crop Image']['bg'] === 'Изрязване на изображение');
check('Resize Image', EXACT_TOOL_LABELS['Resize Image']['bg'] === 'Преоразмеряване на изображение');
check('Rotate Image', EXACT_TOOL_LABELS['Rotate Image']['bg'] === 'Завъртане на изображение');
check('Flip Image', EXACT_TOOL_LABELS['Flip Image']['bg'] === 'Обръщане на изображение');
check('Compress Video', EXACT_TOOL_LABELS['Compress Video']['bg'] === 'Компресиране на видео');
check('Convert Video', EXACT_TOOL_LABELS['Convert Video']['bg'] === 'Конвертиране на видео');
check('Convert Audio', EXACT_TOOL_LABELS['Convert Audio']['bg'] === 'Конвертиране на аудио');
check('Compress Audio', EXACT_TOOL_LABELS['Compress Audio']['bg'] === 'Компресиране на аудио');
check('Extract ZIP', EXACT_TOOL_LABELS['Extract ZIP']['bg'] === 'Разархивиране на ZIP');
check('Create ZIP', EXACT_TOOL_LABELS['Create ZIP']['bg'] === 'Създаване на ZIP');

// 3. Primary Descriptions (bg)
console.log('\n--- 3. Primary Card Descriptions (bg) ---');
check('IMAGE_OPTIMIZE', PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE.bg === 'Оптимизирайте JPG, PNG и WebP локално');
check('MERGE_PDF', PRIMARY_DESCRIPTIONS.MERGE_PDF.bg === 'Обединете няколко PDF файла в браузъра');
check('SHRINK_PDF', PRIMARY_DESCRIPTIONS.SHRINK_PDF.bg === 'Намалете PDF файловете под 2 MB в браузъра');

// 4. SEO Content & FAQs (bg)
console.log('\n--- 4. SEO FAQs & Content (bg) ---');
const pdfSeo = getToolSeoContent('/compress-pdf', 'Компресиране на PDF', 'bg');
check('PDF Category Pill', pdfSeo.category && pdfSeo.category.length > 0);
check('PDF Entity Definition', pdfSeo.entityDefinition && pdfSeo.entityDefinition.length > 0);
check('PDF How-To Steps (3 steps)', pdfSeo.howToSteps && pdfSeo.howToSteps.length === 3);
check('PDF FAQs (at least 3)', pdfSeo.faqs && pdfSeo.faqs.length >= 3);

console.log('\nFINAL BULGARIAN AUDIT SCORE: ' + pass + '/' + total + ' PASSED (' + Math.round(pass/total*100) + '%)');
