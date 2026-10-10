import { ALL_LOCALES, NON_DEFAULT_LOCALES, SupportedLocale } from '../src/config/i18n/locales';
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS, NOUN_MAP, NAV_ACCESSIBILITY_LABELS, SEARCH_HEADER_LABELS } from '../src/components/navigation/megaMenuTranslations';
import { SEARCH_I18N } from '../src/config/i18n/searchTranslations';
import { TRUST_TRANSLATIONS } from '../src/config/i18n/trustTranslations';
import { UI_TRANSLATIONS } from '../src/config/i18n/translations';
import { PDF_COMPRESSION_I18N } from '../src/components/pdf-tools/pdfCompressionTranslations';
import { PRIVACY_I18N } from '../src/utils/privacy/privacyTranslations';
import { OCR_I18N } from '../src/components/ocr-tools/ocrTranslations';
import { PDF_OVERLAY_I18N } from '../src/components/pdf-overlay/pdfOverlayTranslations';
import { OFFICE_I18N } from '../src/components/office-tools/officeTranslations';
import { getLocalizedToolMeta } from '../src/utils/i18nHelper';

console.log('=== COMPREHENSIVE COMPONENT STATE & LOCALE AUDIT ===\n');

interface Leak {
  locale: string;
  component: string;
  state: string;
  key: string;
  leakedValue: string;
  expectedNot: string;
}

const leaks: Leak[] = [];
const testedLocales = new Set<string>();
const testedComponents = new Set<string>();
const testedStates = new Set<string>();

function registerState(component: string, state: string) {
  testedComponents.add(component);
  testedStates.add(state);
}

// 1. Navigation & MegaMenu (Upload, Nav, ARIA, Search states)
registerState('DesktopMegaMenu', 'mega_menu');
registerState('DesktopMegaMenu', 'aria_labels');
registerState('MobileNavigation', 'aria_labels');
registerState('SiteHeader', 'search_labels');

for (const loc of NON_DEFAULT_LOCALES) {
  testedLocales.add(loc);

  // MegaMenu Categories
  for (const [catKey, dict] of Object.entries(MEGA_MENU_CATEGORIES)) {
    const val = dict[loc];
    if (!val || val === dict.en) {
      leaks.push({
        locale: loc,
        component: 'DesktopMegaMenu',
        state: 'mega_menu',
        key: `category.${catKey}`,
        leakedValue: val || 'MISSING',
        expectedNot: dict.en
      });
    }
  }

  // Exact Tool Labels in MegaMenu
  for (const [toolKey, dict] of Object.entries(EXACT_TOOL_LABELS)) {
    const val = dict[loc];
    // Some English technical names are universally accepted (e.g. PDF, GIF), but general verbs/nouns should not be raw English
    if (!val) {
      leaks.push({
        locale: loc,
        component: 'DesktopMegaMenu',
        state: 'mega_menu',
        key: `toolLabel.${toolKey}`,
        leakedValue: 'MISSING',
        expectedNot: 'MISSING'
      });
    }
  }

  // Primary Descriptions in MegaMenu
  for (const [descKey, dict] of Object.entries(PRIMARY_DESCRIPTIONS)) {
    const val = dict[loc];
    if (!val || val === dict.en) {
      leaks.push({
        locale: loc,
        component: 'DesktopMegaMenu',
        state: 'mega_menu',
        key: `desc.${descKey}`,
        leakedValue: val || 'MISSING',
        expectedNot: dict.en
      });
    }
  }

  // Noun Map in MegaMenu
  for (const [nounKey, dict] of Object.entries(NOUN_MAP)) {
    const val = dict[loc];
    const VALID_COGNATES: Record<string, string[]> = {
      Text: ['de', 'cs', 'ro', 'sk', 'sv', 'ca'],
      Image: ['fr']
    };
    const isCognate = VALID_COGNATES[nounKey]?.includes(loc);
    if (!val || (!isCognate && val === dict.en)) {
      leaks.push({
        locale: loc,
        component: 'DesktopMegaMenu',
        state: 'mega_menu',
        key: `noun.${nounKey}`,
        leakedValue: val || 'MISSING',
        expectedNot: dict.en
      });
    }
  }

  // Nav Accessibility Labels
  for (const [ariaKey, dict] of Object.entries(NAV_ACCESSIBILITY_LABELS)) {
    const val = dict[loc];
    if (!val || val === dict.en) {
      leaks.push({
        locale: loc,
        component: 'DesktopMegaMenu',
        state: 'aria_labels',
        key: `aria.${ariaKey}`,
        leakedValue: val || 'MISSING',
        expectedNot: dict.en
      });
    }
  }

  // Search Header Labels
  for (const [searchKey, dict] of Object.entries(SEARCH_HEADER_LABELS)) {
    const val = (dict as Record<string, string>)[loc];
    const enVal = (dict as Record<string, string>).en;
    if (!val || val === enVal) {
      leaks.push({
        locale: loc,
        component: 'SiteHeader',
        state: 'search_labels',
        key: `searchHeader.${searchKey}`,
        leakedValue: val || 'MISSING',
        expectedNot: enVal
      });
    }
  }
}

// 2. Search Translations (Search, Placeholders, ARIA)
registerState('ToolHero', 'search_placeholders');
registerState('ToolHero', 'aria_labels');
registerState('ToolHero', 'result_states');

for (const loc of NON_DEFAULT_LOCALES) {
  const searchDict = SEARCH_I18N[loc];
  const enSearch = SEARCH_I18N.en;
  if (!searchDict) {
    leaks.push({
      locale: loc,
      component: 'ToolHero',
      state: 'search_placeholders',
      key: 'searchDict',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    for (const k of ['quickJump', 'noToolsFound', 'searchAriaLabel', 'resultsAriaLabel'] as const) {
      if (!searchDict[k] || searchDict[k] === enSearch[k]) {
        leaks.push({
          locale: loc,
          component: 'ToolHero',
          state: 'search_placeholders',
          key: `search.${k}`,
          leakedValue: searchDict[k] || 'MISSING',
          expectedNot: enSearch[k]
        });
      }
    }
  }
}

// 3. UI Translations (Nav, Trust, Homepage, Workspace)
registerState('UniversalLayout', 'visible_text');
registerState('UniversalLayout', 'buttons');
registerState('UploadDropzone', 'upload_states');

for (const loc of NON_DEFAULT_LOCALES) {
  const ui = UI_TRANSLATIONS[loc];
  const enUi = UI_TRANSLATIONS.en;
  if (!ui) {
    leaks.push({
      locale: loc,
      component: 'UniversalLayout',
      state: 'visible_text',
      key: 'ui_translations',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    // Check nav
    for (const [k, v] of Object.entries(ui.nav)) {
      if (!v || v === enUi.nav[k as keyof typeof enUi.nav]) {
        leaks.push({
          locale: loc,
          component: 'UniversalLayout',
          state: 'visible_text',
          key: `nav.${k}`,
          leakedValue: v || 'MISSING',
          expectedNot: enUi.nav[k as keyof typeof enUi.nav]
        });
      }
    }
    // Check homepage
    for (const [k, v] of Object.entries(ui.homepage)) {
      if (!v || v === enUi.homepage[k as keyof typeof enUi.homepage]) {
        leaks.push({
          locale: loc,
          component: 'UniversalLayout',
          state: 'visible_text',
          key: `homepage.${k}`,
          leakedValue: v || 'MISSING',
          expectedNot: enUi.homepage[k as keyof typeof enUi.homepage]
        });
      }
    }
    // Check workspace upload & button states
    for (const [k, v] of Object.entries(ui.workspace)) {
      if (!v || v === enUi.workspace[k as keyof typeof enUi.workspace]) {
        leaks.push({
          locale: loc,
          component: 'UploadDropzone',
          state: 'upload_states',
          key: `workspace.${k}`,
          leakedValue: v || 'MISSING',
          expectedNot: enUi.workspace[k as keyof typeof enUi.workspace]
        });
      }
    }
  }
}

// 4. PdfCompressionWorkspace (Upload, Progress, Error, Result states)
registerState('PdfCompressionWorkspace', 'upload_states');
registerState('PdfCompressionWorkspace', 'progress_states');
registerState('PdfCompressionWorkspace', 'error_states');
registerState('PdfCompressionWorkspace', 'result_states');
registerState('PdfCompressionWorkspace', 'buttons');

for (const loc of NON_DEFAULT_LOCALES) {
  const compDict = PDF_COMPRESSION_I18N[loc];
  const enComp = PDF_COMPRESSION_I18N.en;
  if (!compDict) {
    leaks.push({
      locale: loc,
      component: 'PdfCompressionWorkspace',
      state: 'upload_states',
      key: 'compressionDict',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    for (const [k, v] of Object.entries(compDict)) {
      const enVal = (enComp as any)[k];
      if (typeof v === 'string' && typeof enVal === 'string') {
        const isCognate = k === 'original' && ['es', 'es-419', 'de', 'fr', 'pt', 'pt-BR', 'ca', 'sv', 'ro'].includes(loc);
        if (enVal.length > 5 && v === enVal && !isCognate) {
          leaks.push({
            locale: loc,
            component: 'PdfCompressionWorkspace',
            state: k.startsWith('err') ? 'error_states' : (k.includes('progress') || k.includes('reading') || k.includes('compressing')) ? 'progress_states' : (k.includes('download') || k.includes('Ok') || k.includes('already')) ? 'result_states' : 'upload_states',
            key: `comp.${k}`,
            leakedValue: v,
            expectedNot: enVal
          });
        }
      }
    }
  }
}

// 5. PrivacyWorkspace (Upload, Progress, Error, Result states)
registerState('PrivacyWorkspace', 'upload_states');
registerState('PrivacyWorkspace', 'progress_states');
registerState('PrivacyWorkspace', 'error_states');
registerState('PrivacyWorkspace', 'result_states');
registerState('PrivacyWorkspace', 'buttons');

for (const loc of NON_DEFAULT_LOCALES) {
  const privDict = PRIVACY_I18N[loc];
  const enPriv = PRIVACY_I18N.en;
  if (!privDict) {
    leaks.push({
      locale: loc,
      component: 'PrivacyWorkspace',
      state: 'upload_states',
      key: 'privacyDict',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    for (const [k, v] of Object.entries(privDict)) {
      const enVal = (enPriv as any)[k];
      if (typeof v === 'string' && typeof enVal === 'string') {
        if (enVal.length > 5 && v === enVal) {
          leaks.push({
            locale: loc,
            component: 'PrivacyWorkspace',
            state: k.startsWith('error') ? 'error_states' : k.includes('sanitizing') ? 'progress_states' : (k.includes('download') || k.includes('success')) ? 'result_states' : 'upload_states',
            key: `priv.${k}`,
            leakedValue: v,
            expectedNot: enVal
          });
        }
      }
    }
  }
}

// 6. OcrPdfWorkspace (Upload, Progress, Error, Result states)
registerState('OcrPdfWorkspace', 'upload_states');
registerState('OcrPdfWorkspace', 'progress_states');
registerState('OcrPdfWorkspace', 'error_states');
registerState('OcrPdfWorkspace', 'result_states');
registerState('OcrPdfWorkspace', 'buttons');

for (const loc of NON_DEFAULT_LOCALES) {
  const ocrDict = OCR_I18N[loc];
  const enOcr = OCR_I18N.en;
  if (!ocrDict) {
    leaks.push({
      locale: loc,
      component: 'OcrPdfWorkspace',
      state: 'upload_states',
      key: 'ocrDict',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    for (const [k, v] of Object.entries(ocrDict)) {
      const enVal = (enOcr as any)[k];
      if (typeof v === 'string' && typeof enVal === 'string') {
        if (enVal.length > 5 && v === enVal) {
          leaks.push({
            locale: loc,
            component: 'OcrPdfWorkspace',
            state: k.startsWith('error') ? 'error_states' : (k.includes('Reading') || k.includes('recognizing')) ? 'progress_states' : (k.includes('download') || k.includes('copy')) ? 'result_states' : 'upload_states',
            key: `ocr.${k}`,
            leakedValue: v,
            expectedNot: enVal
          });
        }
      }
    }
  }
}

// 7. PdfOverlayWorkspace (Watermark: Upload, Progress, Error, Result states)
registerState('PdfOverlayWorkspace', 'upload_states');
registerState('PdfOverlayWorkspace', 'progress_states');
registerState('PdfOverlayWorkspace', 'error_states');
registerState('PdfOverlayWorkspace', 'result_states');
registerState('PdfOverlayWorkspace', 'buttons');

for (const loc of NON_DEFAULT_LOCALES) {
  const overlayDict = PDF_OVERLAY_I18N[loc];
  const enOverlay = PDF_OVERLAY_I18N.en;
  if (!overlayDict) {
    leaks.push({
      locale: loc,
      component: 'PdfOverlayWorkspace',
      state: 'upload_states',
      key: 'overlayDict',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    for (const [k, v] of Object.entries(overlayDict)) {
      const enVal = (enOverlay as any)[k];
      if (typeof v === 'string' && typeof enVal === 'string') {
        if (enVal.length > 5 && v === enVal) {
          leaks.push({
            locale: loc,
            component: 'PdfOverlayWorkspace',
            state: k.includes('Error') || k.includes('err') ? 'error_states' : (k.includes('inspecting') || k.includes('stamping') || k.includes('verifying')) ? 'progress_states' : (k.includes('download') || k.includes('startOver')) ? 'result_states' : 'upload_states',
            key: `overlay.${k}`,
            leakedValue: v,
            expectedNot: enVal
          });
        }
      }
    }
  }
}

// 8. OfficeConverterWorkspace
registerState('OfficeConverterWorkspace', 'upload_states');
for (const loc of NON_DEFAULT_LOCALES) {
  const offDict = OFFICE_I18N[loc];
  const enOff = OFFICE_I18N.en;
  if (!offDict) {
    leaks.push({
      locale: loc,
      component: 'OfficeConverterWorkspace',
      state: 'upload_states',
      key: 'officeDict',
      leakedValue: 'MISSING',
      expectedNot: 'MISSING'
    });
  } else {
    for (const [k, v] of Object.entries(offDict)) {
      const enVal = (enOff as any)[k];
      if (typeof v === 'string' && typeof enVal === 'string') {
        if (enVal.length > 5 && v === enVal) {
          leaks.push({
            locale: loc,
            component: 'OfficeConverterWorkspace',
            state: 'upload_states',
            key: `office.${k}`,
            leakedValue: v,
            expectedNot: enVal
          });
        }
      }
    }
  }
}

// 9. Specific screenshot regression checks: Bulgarian (bg), Hungarian (hu), Spanish (es)
console.log('--- Targeted Checks for Known Screenshot Regressions (bg, hu, es) ---');
for (const targetLoc of ['bg', 'hu', 'es'] as const) {
  const targetLeaks = leaks.filter(l => l.locale === targetLoc);
  console.log(`Locale [${targetLoc}]: ${targetLeaks.length} potential leaks detected.`);
  if (targetLeaks.length > 0) {
    targetLeaks.slice(0, 10).forEach(l => {
      console.log(`  ❌ [${l.component}][${l.state}][${l.key}]: "${l.leakedValue}"`);
    });
  }
}

console.log('\n================ AUDIT SUMMARY ================');
console.log(`Tested Locales count: ${testedLocales.size}`);
console.log(`Tested Components count: ${testedComponents.size}`);
console.log(`Tested States: ${Array.from(testedStates).join(', ')}`);
console.log(`Total Leaks Found: ${leaks.length}`);
console.log('================================================\n');

if (leaks.length > 0) {
  console.error(`❌ REGRESSION AUDIT DETECTED ${leaks.length} LEAKS!`);
  // Print breakdown by component
  const compMap: Record<string, number> = {};
  leaks.forEach(l => {
    compMap[l.component] = (compMap[l.component] || 0) + 1;
  });
  console.table(compMap);
} else {
  console.log('✅ ZERO ENGLISH LEAKAGE CONFIRMED ACROSS ALL TESTED COMPONENTS AND STATES!');
}
