import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { resolveDictionaryEntry } from '../src/config/i18n/locales';
import { FONT_TRANSLATIONS } from '../src/utils/font/fontTranslations';
import { EBOOK_TRANSLATIONS } from '../src/utils/ebook/ebookTranslations';
import { ArchiveEngine } from '../src/utils/archive/ArchiveEngine';
import { FontEngine } from '../src/utils/font/FontEngine';

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

  // Prepare authentic WOFF2 payload using FontEngine.ttfToWoff2
  const dummyWoff2Path = path.resolve('test_dummy.woff2');
  const woff2Bytes = FontEngine.ttfToWoff2(ttfBytes);
  fs.writeFileSync(dummyWoff2Path, woff2Bytes);

  // Prepare dummy PDF payload with verified text
  const pdfTitle = 'Ebook Preservation Test Document';
  const pdfBody = 'This paragraph must be faithfully extracted and preserved in the generated EPUB package.';
  const dummyPdfDoc = await PDFDocument.create();
  const page = dummyPdfDoc.addPage([500, 700]);
  page.drawText(`${pdfTitle} - ${pdfBody}`, { x: 50, y: 650, size: 12 });
  const dummyPdfBytes = await dummyPdfDoc.save();
  const dummyPdfPath = path.resolve('test_dummy_ebook.pdf');
  fs.writeFileSync(dummyPdfPath, dummyPdfBytes);

  // Prepare dummy EPUB payload with verified text
  const epubTitle = 'A Tale of Two Cities';
  const epubBody = 'It was the best of times, it was the worst of times.';
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
        `<?xml version="1.0"?><package version="3.0"><metadata><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${epubTitle}</dc:title></metadata><manifest><item id="ch1" href="ch1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="ch1"/></spine></package>`
      ),
    },
    {
      name: 'ch1.xhtml',
      data: textEncoder.encode(
        `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><body><h1>${epubTitle}</h1><p>${epubBody}</p></body></html>`
      ),
    },
  ]);
  const dummyEpubPath = path.resolve('test_dummy.epub');
  fs.writeFileSync(dummyEpubPath, epubZip);

  // Prepare authentic PalmDOC MOBI payload
  const mobiTitle = 'The Call of the Wild';
  const mobiBody = 'Buck did not read the newspapers, or he would have known that trouble was brewing.';
  const mobiTextBytes = textEncoder.encode(mobiTitle + '\n\n' + mobiBody);
  const mobiHeader = new Uint8Array(78 + 2 * 8);
  const mHeadView = new DataView(mobiHeader.buffer);
  new Uint8Array(mobiHeader.buffer, 60, 8).set(textEncoder.encode('BOOKMOBI'));
  mHeadView.setUint16(76, 2, false); // 2 records
  const rec0Offset = mobiHeader.length;
  const rec1Offset = rec0Offset + 16;
  mHeadView.setUint32(78, rec0Offset, false);
  mHeadView.setUint32(86, rec1Offset, false);
  const rec0 = new Uint8Array(16);
  const r0View = new DataView(rec0.buffer);
  r0View.setUint16(0, 1, false); // uncompressed
  r0View.setUint16(8, 1, false); // 1 text record
  const mobiPayload = new Uint8Array(mobiHeader.length + rec0.length + mobiTextBytes.length);
  mobiPayload.set(mobiHeader, 0);
  mobiPayload.set(rec0, rec0Offset);
  mobiPayload.set(mobiTextBytes, rec1Offset);
  const dummyMobiPath = path.resolve('test_dummy.mobi');
  fs.writeFileSync(dummyMobiPath, mobiPayload);

  // Prepare authentic KF8 AZW3 payload with distinct content
  const azw3Title = 'Moby Dick';
  const azw3Body = 'Call me Ishmael. Some years ago never mind how long precisely.';
  const azw3Html = `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><body><h1>${azw3Title}</h1><p>${azw3Body}</p></body></html>`;
  const azw3HtmlBytes = textEncoder.encode(azw3Html);
  const azw3Header = new Uint8Array(78 + 2 * 8);
  const aHeadView = new DataView(azw3Header.buffer);
  new Uint8Array(azw3Header.buffer, 60, 8).set(textEncoder.encode('BOOKMOBI'));
  aHeadView.setUint16(76, 2, false);
  const aRec0Offset = azw3Header.length;
  const aRec1Offset = aRec0Offset + 16;
  aHeadView.setUint32(78, aRec0Offset, false);
  aHeadView.setUint32(86, aRec1Offset, false);
  const aRec0 = new Uint8Array(16);
  const aR0View = new DataView(aRec0.buffer);
  aR0View.setUint32(0, 0x4B463820, false); // 'KF8 '
  const azw3Payload = new Uint8Array(azw3Header.length + aRec0.length + azw3HtmlBytes.length);
  azw3Payload.set(azw3Header, 0);
  azw3Payload.set(aRec0, aRec0Offset);
  azw3Payload.set(azw3HtmlBytes, aRec1Offset);
  const dummyAzw3Path = path.resolve('test_dummy.azw3');
  fs.writeFileSync(dummyAzw3Path, azw3Payload);

  try {
    for (const locale of testLocales) {
      const page = await browser.newPage();
      page.on('console', msg => console.log(`[Browser Console]: ${msg.type()}: ${msg.text()}`));
      page.on('pageerror', err => console.error(`[Browser PageError]:`, err));
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
        const fileInput = page.locator('[data-testid="font-file-input"]');
        await fileInput.setInputFiles(dummyTtfPath);

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

        if (outBuf.length < 48) {
          errors.push(`Downloaded WOFF2 font is too small (${outBuf.length} bytes)`);
        }
        if (outBuf.readUInt32BE(0) !== 0x774F4632) {
          errors.push(`Downloaded file does not have valid WOFF2 header ('wOF2')`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ✔ TTF to WOFF2 completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 2. WOFF2 to TTF route (/woff2-to-ttf)
      {
        const route = `/${locale}/woff2-to-ttf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });

        const dropzone = page.locator('[data-testid="font-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 5000 });

        const fileInput = page.locator('[data-testid="font-file-input"]');
        await fileInput.setInputFiles(dummyWoff2Path);

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
        console.log(`  ✔ WOFF2 to TTF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
      }

      // 3. EPUB to PDF route (/epub-to-pdf)
      {
        const route = `/${locale}/epub-to-pdf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle');

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 8000 });

        const fileInput = page.locator('[data-testid="ebook-file-input"]');
        await fileInput.setInputFiles(dummyEpubPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        try {
          await resultCard.waitFor({ state: 'visible', timeout: 10000 });
        } catch (waitErr) {
          const errBox = await page.locator('.text-red-700').textContent().catch(() => null);
          const bodyHtml = await page.evaluate(() => document.body.innerHTML);
          throw new Error(`Wait for ebook-result-card failed. Error box: "${errBox}". Body snippet: ${bodyHtml.slice(0, 500)}`);
        }
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
          // Verify actual content preservation using pdfjs-dist
          const pdfjsPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.mjs');
          const pdfjs = await import(pathToFileURL(pdfjsPath).href);
          const doc = await pdfjs.getDocument({ data: new Uint8Array(outBuf), disableFontFace: true }).promise;
          let fullText = '';
          for (let i = 1; i <= doc.numPages; i++) {
            const p = await doc.getPage(i);
            const tc = await p.getTextContent();
            fullText += tc.items.map((it: any) => it.str).join(' ') + ' ';
          }
          if (!fullText.includes(epubTitle) || !fullText.includes('best of times')) {
            errors.push(`Output PDF missing preserved EPUB book content. Found: "${fullText.trim()}"`);
          }
        } catch (e: any) {
          errors.push(`Generated PDF is invalid or corrupted: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ✔ EPUB to PDF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}${errors.length > 0 ? ' -> ' + errors.join('; ') : ''}`);
      }

      // 4. PDF to EPUB route (/pdf-to-epub)
      {
        const route = `/${locale}/pdf-to-epub`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle');

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 8000 });

        const fileInput = page.locator('[data-testid="ebook-file-input"]');
        await fileInput.setInputFiles(dummyPdfPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        try {
          await resultCard.waitFor({ state: 'visible', timeout: 15000 });
        } catch (waitErr) {
          const errBox = await page.locator('.text-red-700').textContent().catch(() => null);
          throw new Error(`Wait for ebook-result-card failed on ${route}. Error box: "${errBox}"`);
        }
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
        console.log(`  ✔ PDF to EPUB completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}${errors.length > 0 ? ' -> ' + errors.join('; ') : ''}`);
      }

      // 5. MOBI to PDF route (/mobi-to-pdf)
      {
        const route = `/${locale}/mobi-to-pdf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle');

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 8000 });

        const fileInput = page.locator('[data-testid="ebook-file-input"]');
        await fileInput.setInputFiles(dummyMobiPath);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        try {
          await resultCard.waitFor({ state: 'visible', timeout: 15000 });
        } catch (waitErr) {
          const errBox = await page.locator('.text-red-700').textContent().catch(() => null);
          throw new Error(`Wait for ebook-result-card failed on ${route}. Error box: "${errBox}"`);
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
          // Verify actual MOBI content preservation using pdfjs-dist
          const pdfjsPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.mjs');
          const pdfjs = await import(pathToFileURL(pdfjsPath).href);
          const doc = await pdfjs.getDocument({ data: new Uint8Array(outBuf), disableFontFace: true }).promise;
          let fullText = '';
          for (let i = 1; i <= doc.numPages; i++) {
            const p = await doc.getPage(i);
            const tc = await p.getTextContent();
            fullText += tc.items.map((it: any) => it.str).join(' ') + ' ';
          }
          if (!fullText.includes(mobiTitle) || !fullText.includes('Buck did not read')) {
            errors.push(`Output PDF missing preserved MOBI book content. Found: "${fullText.trim()}"`);
          }
        } catch (e: any) {
          errors.push(`Generated PDF from MOBI is invalid: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ✔ MOBI to PDF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}${errors.length > 0 ? ' -> ' + errors.join('; ') : ''}`);
      }

      // 6. AZW3 to PDF route (/azw3-to-pdf)
      {
        const route = `/${locale}/azw3-to-pdf`;
        const errors: string[] = [];
        console.log(`Testing Route: ${route}`);
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle');

        const dropzone = page.locator('[data-testid="ebook-dropzone"]');
        await dropzone.waitFor({ state: 'visible', timeout: 8000 });

        const fileInput = page.locator('[data-testid="ebook-file-input"]');
        await fileInput.setInputFiles(dummyAzw3Path);

        const resultCard = page.locator('[data-testid="ebook-result-card"]');
        try {
          await resultCard.waitFor({ state: 'visible', timeout: 15000 });
        } catch (waitErr) {
          const errBox = await page.locator('.text-red-700').textContent().catch(() => null);
          throw new Error(`Wait for ebook-result-card failed on ${route}. Error box: "${errBox}"`);
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
          // Verify actual AZW3 content preservation using pdfjs-dist
          const pdfjsPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.mjs');
          const pdfjs = await import(pathToFileURL(pdfjsPath).href);
          const doc = await pdfjs.getDocument({ data: new Uint8Array(outBuf), disableFontFace: true }).promise;
          let fullText = '';
          for (let i = 1; i <= doc.numPages; i++) {
            const p = await doc.getPage(i);
            const tc = await p.getTextContent();
            fullText += tc.items.map((it: any) => it.str).join(' ') + ' ';
          }
          if (!fullText.includes(azw3Title) || !fullText.includes('Call me Ishmael')) {
            errors.push(`Output PDF missing preserved AZW3 book content. Found: "${fullText.trim()}"`);
          }
        } catch (e: any) {
          errors.push(`Generated PDF from AZW3 is invalid: ${e.message}`);
        }

        results.push({ route, locale, passed: errors.length === 0, errors });
        console.log(`  ✔ AZW3 to PDF completed. Status: ${errors.length === 0 ? 'PASS' : 'FAIL'}${errors.length > 0 ? ' -> ' + errors.join('; ') : ''}`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
    try { fs.unlinkSync(dummyTtfPath); } catch (_) {}
    try { fs.unlinkSync(dummyWoff2Path); } catch (_) {}
    try { fs.unlinkSync(dummyPdfPath); } catch (_) {}
    try { fs.unlinkSync(dummyEpubPath); } catch (_) {}
    try { fs.unlinkSync(dummyMobiPath); } catch (_) {}
    try { fs.unlinkSync(dummyAzw3Path); } catch (_) {}
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
