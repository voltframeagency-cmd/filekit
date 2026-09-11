// Targeted test for Batch 2: Upload Controls Surface Localization
import { OFFICE_I18N } from '../src/components/office-tools/officeTranslations.ts';

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

console.log('--- Testing Office Translations Units (Batch 2) ---');

// 1. Check Norwegian OFFICE_I18N
assert(OFFICE_I18N.no !== undefined, 'OFFICE_I18N.no is defined');
assert(OFFICE_I18N.no?.convertBtn === 'Konverter til PDF', `OFFICE_I18N.no.convertBtn is ${OFFICE_I18N.no?.convertBtn}`);
assert(OFFICE_I18N.no?.subDescription === 'Presisjonskonvertering i isolert microVM med 0% datalagring.', `OFFICE_I18N.no.subDescription is ${OFFICE_I18N.no?.subDescription}`);
assert(OFFICE_I18N.no?.sandboxTitle === 'Isolert MicroVM-sandkasse', `OFFICE_I18N.no.sandboxTitle is ${OFFICE_I18N.no?.sandboxTitle}`);
assert(OFFICE_I18N.no?.selectDoc('Word-dokument') === 'Velg Word-dokument', `selectDoc('Word-dokument') is ${OFFICE_I18N.no?.selectDoc('Word-dokument')}`);

// 2. Check Bulgarian OFFICE_I18N
assert(OFFICE_I18N.bg !== undefined, 'OFFICE_I18N.bg is defined');
assert(OFFICE_I18N.bg?.convertBtn === 'Конвертиране в PDF', `OFFICE_I18N.bg.convertBtn is ${OFFICE_I18N.bg?.convertBtn}`);
assert(OFFICE_I18N.bg?.sandboxTitle === 'Изолирана MicroVM среда', `OFFICE_I18N.bg.sandboxTitle is ${OFFICE_I18N.bg?.sandboxTitle}`);

console.log(`Unit checks: ${passed} passed, ${failed} failed.`);

// 3. Live SSR Checks on running server
async function testLiveSsr() {
  console.log('\n--- Testing Live SSR Routes for Upload Controls (no & bg) ---');
  try {
    // 3a. Norwegian /no/compress-pdf
    const resNoCompress = await fetch('http://localhost:3000/no/compress-pdf');
    assert(resNoCompress.ok, `HTTP ${resNoCompress.status} fetching /no/compress-pdf`);
    const htmlNoCompress = await resNoCompress.text();
    assert(htmlNoCompress.includes('Slipp PDF-dokumentet ditt her eller bla gjennom'), 'Norwegian /no/compress-pdf has localized dropzone title');
    assert(htmlNoCompress.includes('Støtter standard PDF-dokumenter opptil 50 MB'), 'Norwegian /no/compress-pdf has localized supportsPdf text');
    assert(!htmlNoCompress.includes('Drop your PDF document here or browse'), 'Norwegian /no/compress-pdf does NOT leak English dropzone');

    // 3b. Bulgarian /bg/compress-pdf
    const resBgCompress = await fetch('http://localhost:3000/bg/compress-pdf');
    assert(resBgCompress.ok, `HTTP ${resBgCompress.status} fetching /bg/compress-pdf`);
    const htmlBgCompress = await resBgCompress.text();
    assert(htmlBgCompress.includes('Пуснете вашия PDF документ тук или изберете'), 'Bulgarian /bg/compress-pdf has localized dropzone title');
    assert(htmlBgCompress.includes('Поддържа стандартни PDF документи до 50 MB'), 'Bulgarian /bg/compress-pdf has localized supportsPdf text');
    assert(!htmlBgCompress.includes('Drop your PDF document here or browse'), 'Bulgarian /bg/compress-pdf does NOT leak English dropzone');

    // 3c. Norwegian /no/word-to-pdf
    const resNoWord = await fetch('http://localhost:3000/no/word-to-pdf');
    assert(resNoWord.ok, `HTTP ${resNoWord.status} fetching /no/word-to-pdf`);
    const htmlNoWord = await resNoWord.text();
    assert(htmlNoWord.includes('Presisjonskonvertering i isolert microVM'), 'Norwegian /no/word-to-pdf has localized subDescription');
    assert(!htmlNoWord.includes('High-fidelity LibreOffice'), 'Norwegian /no/word-to-pdf does NOT leak High-fidelity LibreOffice');

    // 3d. Norwegian /no/pdf-to-jpg (checking common.or and workspace.supportsPdf)
    const resNoPdfToJpg = await fetch('http://localhost:3000/no/pdf-to-jpg');
    assert(resNoPdfToJpg.ok, `HTTP ${resNoPdfToJpg.status} fetching /no/pdf-to-jpg`);
    const htmlNoPdfToJpg = await resNoPdfToJpg.text();
    assert(htmlNoPdfToJpg.includes('ELLER'), 'Norwegian /no/pdf-to-jpg includes ELLER for common.or');
    assert(!htmlNoPdfToJpg.includes('common.or'), 'Norwegian /no/pdf-to-jpg does NOT leak common.or key');
    assert(htmlNoPdfToJpg.includes('Støtter PDF opptil 50 MB'), 'Norwegian /no/pdf-to-jpg includes localized supportsPdf');
    assert(!htmlNoPdfToJpg.includes('workspace.supportsPdf'), 'Norwegian /no/pdf-to-jpg does NOT leak workspace.supportsPdf key');

    // 3e. Bulgarian /bg/pdf-to-jpg
    const resBgPdfToJpg = await fetch('http://localhost:3000/bg/pdf-to-jpg');
    assert(resBgPdfToJpg.ok, `HTTP ${resBgPdfToJpg.status} fetching /bg/pdf-to-jpg`);
    const htmlBgPdfToJpg = await resBgPdfToJpg.text();
    assert(htmlBgPdfToJpg.includes('ИЛИ'), 'Bulgarian /bg/pdf-to-jpg includes ИЛИ for common.or');
    assert(!htmlBgPdfToJpg.includes('common.or'), 'Bulgarian /bg/pdf-to-jpg does NOT leak common.or key');
    assert(htmlBgPdfToJpg.includes('Поддържа PDF до 50 MB'), 'Bulgarian /bg/pdf-to-jpg includes localized supportsPdf');
    assert(!htmlBgPdfToJpg.includes('workspace.supportsPdf'), 'Bulgarian /bg/pdf-to-jpg does NOT leak workspace.supportsPdf key');

    // 3f. Home Dropzone Check on /no and /bg
    const resNoHome = await fetch('http://localhost:3000/no');
    const htmlNoHome = await resNoHome.text();
    assert(htmlNoHome.includes('Slipp en fil her for å starte'), 'Norwegian /no has localized dropzone title');
    assert(htmlNoHome.includes('Velg fil'), 'Norwegian /no has localized chooseFile button');

    const resBgHome = await fetch('http://localhost:3000/bg');
    const htmlBgHome = await resBgHome.text();
    assert(htmlBgHome.includes('Пуснете файл тук, за да започнете'), 'Bulgarian /bg has localized dropzone title');
    assert(htmlBgHome.includes('Избор на файл'), 'Bulgarian /bg has localized chooseFile button');

    console.log(`\nFinal Results: ${passed} passed, ${failed} failed.`);
    if (failed === 0) {
      console.log('🎉 All Batch 2 upload controls checks PASSED!');
    }
  } catch (err) {
    console.error('Error during SSR tests:', err);
  }
}

testLiveSsr();
