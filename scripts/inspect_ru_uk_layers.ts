import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';
import { UI_TRANSLATIONS } from '../src/config/i18n/translations.ts';
import { getLocalizedToolMeta } from '../src/utils/i18nHelper.ts';

function printLayerLedger(locale: 'ru' | 'uk', langName: string) {
  console.log(`\n======================================================`);
  console.log(` AUDIT & VERIFICATION LEDGER: ${langName.toUpperCase()} (${locale})`);
  console.log(`======================================================`);

  const ui = UI_TRANSLATIONS[locale];
  const sampleSeoPdf = getToolSeoContent('/compress-pdf', 'Compress PDF', locale);
  const sampleSeoImg = getToolSeoContent('/resize-image', 'Resize Image', locale);

  console.log(`\n--- LAYER 1: HEADER & NAVIGATION ---`);
  console.log(`Mega Menu Category 1 (IMAGE COMPRESSION): "${MEGA_MENU_CATEGORIES['IMAGE COMPRESSION'][locale]}"`);
  console.log(`Mega Menu Category 2 (PDF TOOLS): "${MEGA_MENU_CATEGORIES['PDF'][locale]}"`);
  console.log(`Nav Action (All Tools): "${ui.nav.allTools}"`);
  console.log(`Nav Action (Compress): "${ui.nav.compress}"`);
  console.log(`Nav Action (Convert): "${ui.nav.convert}"`);
  console.log(`Nav Action (Merge): "${ui.nav.merge}"`);
  console.log(`Search Placeholder: "${ui.nav.searchPlaceholder}"`);

  console.log(`\n--- LAYER 2: HOMEPAGE HERO ---`);
  console.log(`Hero Title: "${ui.homepage.heroTitle}"`);
  console.log(`Hero Subtitle: "${ui.homepage.heroSubtitle}"`);
  console.log(`Dropzone Title: "${ui.homepage.dropzoneTitle}"`);
  console.log(`Dropzone Subtitle: "${ui.homepage.dropzoneSubtitle}"`);
  console.log(`Popular Tools Heading: "${ui.homepage.popularTools}"`);

  console.log(`\n--- LAYER 3: POPULAR TOOLS CARDS ---`);
  console.log(`Merge PDF: "${EXACT_TOOL_LABELS['Merge PDF Files'][locale]}"`);
  console.log(`Compress PDF: "${EXACT_TOOL_LABELS['PDF Compressor'][locale]}"`);
  console.log(`Resize Image: "${EXACT_TOOL_LABELS['Resize Image'][locale]}"`);
  console.log(`Merge Audio: "${EXACT_TOOL_LABELS['Merge Audio'][locale]}"`);

  console.log(`\n--- LAYER 4: WORKSPACES & CONTROLS ---`);
  console.log(`Select File: "${ui.workspace.selectFile}"`);
  console.log(`Processing notice: "${ui.workspace.processing}"`);
  console.log(`Download button: "${ui.workspace.download}"`);
  console.log(`Change File button: "${ui.workspace.changeFile}"`);
  console.log(`Free Notice badge: "${ui.workspace.freeNotice}"`);

  console.log(`\n--- LAYER 5: SEO FAQs & STRUCTURED METADATA ---`);
  console.log(`Category: "${sampleSeoPdf.category}"`);
  console.log(`Entity Definition: "${sampleSeoPdf.entityDefinition?.slice(0, 60)}..."`);
  console.log(`How-To Step 1: "${sampleSeoPdf.howToSteps[0]?.title}"`);
  console.log(`FAQ 1: "${sampleSeoPdf.faqs[0]?.question}"`);

  console.log(`\n--- LAYER 6: TRUST PANEL ---`);
  console.log(`Badge 1: "${ui.trust.badge1}"`);
  console.log(`Badge 2: "${ui.trust.badge2}"`);
  console.log(`Badge 3: "${ui.trust.badge3}"`);
  console.log(`Badge 4: "${ui.trust.badge4}"`);
}

printLayerLedger('ru', 'Russian');
printLayerLedger('uk', 'Ukrainian');
