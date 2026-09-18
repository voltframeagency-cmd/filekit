import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { resolveDictionaryEntry } from '../src/config/i18n/locales';
import { FONT_TRANSLATIONS } from '../src/utils/font/fontTranslations';
import { EBOOK_TRANSLATIONS } from '../src/utils/ebook/ebookTranslations';
import { ArchiveEngine } from '../src/utils/archive/ArchiveEngine';

interface TestResult {
  route: string;
  locale: string;
  passed: boolean;
  errors: string[];
}

const results: TestResult[] = [];

async function runTests() {
  console.log('=== Starting Font and E-Book E2E Verification Workflow ===\n');

  const browser = await chromium.launch({ headless: true });

  // Test matrix across representative diverse languages (Western, Asian, RTL, Slavic)
  const testLocales = ['en', 'es', 'de', 'ja', 'ar', 'zh-TW'];

  // Prepare dummy font payload (valid TTF header)
  const dummyTtfPath = path.resolve('test_dummy.ttf');
  const ttfBytes = new Uint8Array(128);
  const ttfView = new DataView(ttfBytes.buffer);
  ttfView.setUint32(0, 0x00010000); // SFNT TTF magic
  ttfView.setUint16(4, 3);          // 3 tables
  fs.writeFileSync(dummyTtfPath, ttfBytes);

  // Prepare dummy WOFF payload
  const dummyWoffPath = path.resolve('test_dummy.woff');
  const woffBytes = new Uint8Array(128);
  const woffView = new DataView(woffBytes.buffer);
  woffView.setUint32(0, 0x774F4646); // 'wOFF' magic
  woffView.setUint32(4, 0x00010000); // flavor
  woffView.setUint16(12, 2);          // numTables
  fs.writeFileSync(dummyWoffPath, woffBytes);

  // Prepare dummy PDF payload
  const dummyPdfDoc = await PDFDocument.create();
  const page = dummyPdfDoc.addPage([500, 700]);
  page.drawText('Sample E-Book Source Document Content for Conversion Verification', { x: 50, y: 650, size: 14 });
  const dummyPdfBytes = await dummyPdfDoc.save();
  const dummyPdfPath = path.resolve('test_dummy_ebook.pdf');
  fs.writeFileSync(dummyPdfPath, dummyPdfBytes);

  // Prepare dummy EPUB payload
  const textEncoder = new TextEncoder();
  const epubZip = ArchiveEngine.createZip([
    { name: 'mimetype', data: textEncoder.encode('application/epub+zip') },
    {
      name: 'META-INF/container.xml',
      data: textEncoder.encode(
        '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
      ),
    },
    {
      name: 'content.opf',
      data: textEncoder.encode(
        '<?xml version="1.0"?><package version="3.0"><metadata><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">Test EPUB</dc:title></metadata><manifest><item id="ch1" href="ch1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="ch1"/></spine></package>'
      ),
    },
    {
      name: 'ch1.xhtml',
      data: textEncoder.encode(
        '<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><body><h1>Chapter 1</h1><p>EPUB content converted from test fixture.</p></body></html>'
      ),
    },
  ]);
  const dummyEpubPath = path.resolve('test_dummy.epub');
  fs.writeFileSync(dummyEpubPath, epubZip);

  // Prepare dummy MOBI payload
  const dummyMobiPath = path.resolve('test_dummy.mobi');
  const mobiBuffer = new Uint8Array(500);
  mobiBuffer.set(new TextEncoder().encode('MOBI HEADER ... This is Kindle MOBI long text passage with over fifty characters for testing.'));
  fs.writeFileSync(dummyMobiPath, mobiBuffer);

  try {
    for (const locale of testLocales) {
      const page = await browser.newPage();
      const fontTr = resolveDictionaryEntry(FONT_TRANSLATIONS, locale);
      const ebookTr = resolveDictionaryEntry(EBOOK_TRANSLATIONS, locale);

      console.log(`\n--- Testing Locale: [${locale}] ---`);

      // 1. TTF to WOFF2 route (/ttf-to-woff2)
      {
        const route = `/${locale}/ttf-to-woff2`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        // Assert localized dropzone title
        const dropzone = page.locator('[data-testid="font-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });
        const dropzoneText = await dropzone.innerText();
        const expectedDropzone = fontTr.dropzoneTitle('ttf-to-woff2');
        if (!dropzoneText.includes(expectedDropzone)) {
          errors.push(`Dropzone text "${dropzoneText}" does not include expected "${expectedDropzone}"`);
        }

        // Upload font fixture
        const fileChooserPromise = page.waitForEvent('filechooser');
        await dropzone.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(dummyTtfPath);

        // Assert conversion result card appears
        const resultCard = page.locator('[data-testid="font-result-card"]');
        await resultCard.waitFor({ state: 'visible', timeout: 5000 });
        const resultCardText = await resultCard.innerText();

        if (!resultCardText.includes(fontTr.downloadButton)) {
          errors.push(`Result card does not contain localized download button "${fontTr.downloadButton}"`);
        }

        // Assert download triggers and produces valid binary
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          resultCard.locator('a').click(),
        ]);
        const downloadStream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) chunks.push(Buffer.from(chunk));
        const outBuf = Buffer.concat(chunks);

        if (outBuf.length < 44) {
          errors.push(`Downloaded WOFF font is too small (${outBuf.length} bytes)`);
        }
        if (outBuf.readUInt32BE(0) !== 0x774F4646) {
          errors.push(`Downloaded file does not have valid WOFF header`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ? TTF to WOFF2 completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 2. WOFF2 to TTF route (/woff2-to-ttf)
      {
        const route = `/${locale}/woff2-to-ttf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        const dropzone = page.locator('[data-testid="font-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });

        const fileChooserPromise = page.waitForEvent('filechooser');
        await dropzone.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(dummyWoffPath);

        const resultCard = page.locator('[data-testid="font-result-card"]');
        await resultCard.waitFor({ state: 'visible', timeout: 5000 });

        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          resultCard.locator('a').click(),
        ]);
        const downloadStream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) chunks.push(Buffer.from(chunk));
        const outBuf = Buffer.concat(chunks);

        if (outBuf.length < 12) {
          errors.push(`Downloaded TTF font is too small (${outBuf.length} bytes)`);
        }
        if (outBuf.readUInt32BE(0) !== 0x00010000) {
          errors.push(`Downloaded file does not have valid SFNT TTF header`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ? WOFF2 to TTF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 3. EPUB to PDF route (/epub-to-pdf)
      {
        const route = `/${locale}/epub-to-pdf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });

        const fileChooserPromise = page.waitForEvent('filechooser');
        await dropzone.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(dummyEpubPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        await resultCard.waitFor({ state: 'visible', timeout: 8000 });
        const resultCardText = await resultCard.innerText();

        const expectedBtn = ebookTr.downloadButton(false);
        if (!resultCardText.includes(expectedBtn)) {
          errors.push(`Result card does not contain localized download button "${expectedBtn}"`);
        }

        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          resultCard.locator('a').click(),
        ]);
        const downloadStream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) chunks.push(Buffer.from(chunk));
        const outBuf = Buffer.concat(chunks);

        try {
          const loadedPdf = await PDFDocument.load(new Uint8Array(outBuf));
          if (loadedPdf.getPageCount() < 1) {
            errors.push(`Output PDF has 0 pages`);
          }
        } catch (e: any) {
          errors.push(`Generated PDF is invalid or corrupted: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ? EPUB to PDF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 4. PDF to EPUB route (/pdf-to-epub)
      {
        const route = `/${locale}/pdf-to-epub`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });

        const fileChooserPromise = page.waitForEvent('filechooser');
        await dropzone.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(dummyPdfPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        await resultCard.waitFor({ state: 'visible', timeout: 8000 });
        const resultCardText = await resultCard.innerText();

        const expectedBtn = ebookTr.downloadButton(true);
        if (!resultCardText.includes(expectedBtn)) {
          errors.push(`Result card does not contain localized download button "${expectedBtn}"`);
        }

        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          resultCard.locator('a').click(),
        ]);
        const downloadStream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) chunks.push(Buffer.from(chunk));
        const outBuf = Buffer.concat(chunks);

        try {
          const entries = ArchiveEngine.extractZip(new Uint8Array(outBuf));
          const hasMime = entries.some(e => e.name === 'mimetype');
          const hasOpf = entries.some(e => e.name === 'EPUB/content.opf');
          if (!hasMime || !hasOpf) {
            errors.push(`Generated EPUB ZIP archive is missing required files (mimetype or content.opf)`);
          }
        } catch (e: any) {
          errors.push(`Generated EPUB archive could not be parsed: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ? PDF to EPUB completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 5. MOBI to PDF route (/mobi-to-pdf)
      {
        const route = `/${locale}/mobi-to-pdf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });

        const fileChooserPromise = page.waitForEvent('filechooser');
        await dropzone.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(dummyMobiPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        await resultCard.waitFor({ state: 'visible', timeout: 8000 });

        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          resultCard.locator('a').click(),
        ]);
        const downloadStream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) chunks.push(Buffer.from(chunk));
        const outBuf = Buffer.concat(chunks);

        try {
          const loadedPdf = await PDFDocument.load(new Uint8Array(outBuf));
          if (loadedPdf.getPageCount() < 1) {
            errors.push(`Output PDF has 0 pages`);
          }
        } catch (e: any) {
          errors.push(`Generated PDF from MOBI is invalid: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ? MOBI to PDF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 6. AZW3 to PDF route (/azw3-to-pdf)
      {
        const route = `/${locale}/azw3-to-pdf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });

        const fileChooserPromise = page.waitForEvent('filechooser');
        await dropzone.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(dummyMobiPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        await resultCard.waitFor({ state: 'visible', timeout: 8000 });

        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 8000 }),
          resultCard.locator('a').click(),
        ]);
        const downloadStream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of downloadStream) chunks.push(Buffer.from(chunk));
        const outBuf = Buffer.concat(chunks);

        try {
          const loadedPdf = await PDFDocument.load(new Uint8Array(outBuf));
          if (loadedPdf.getPageCount() < 1) {
            errors.push(`Output PDF has 0 pages`);
          }
        } catch (e: any) {
          errors.push(`Generated PDF from AZW3 is invalid: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ? AZW3 to PDF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
    try { fs.unlinkSync(dummyTtfPath); } catch (_) {}
    try { fs.unlinkSync(dummyWoffPath); } catch (_) {}
    try { fs.unlinkSync(dummyPdfPath); } catch (_) {}
    try { fs.unlinkSync(dummyEpubPath); } catch (_) {}
    try { fs.unlinkSync(dummyMobiPath); } catch (_) {}
  }

  console.log('\n======================================================');
  console.log('SUMMARY OF FONT & EBOOK WORKFLOW TESTS:');
  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = total - passedCount;
  console.log(`Total tests: ${total}, Passed: ${passedCount}, Failed: ${failedCount}`);
  console.log('======================================================');

  if (failedCount > 0) {
    console.error('Failed test details:');
    for (const r of results.filter(r => !r.passed)) {
      console.error(`  - ${r.route}: ${r.errors.join('; ')}`);
    }
    process.exit(1);
  } else {
    console.log('? ALL FONT & E-BOOK WORKFLOW TESTS PASSED 100%!');
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
