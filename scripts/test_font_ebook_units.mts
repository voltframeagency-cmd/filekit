import { FontEngine } from '../src/utils/font/FontEngine.ts';
import { EbookEngine } from '../src/utils/ebook/EbookEngine.ts';
import { ArchiveEngine } from '../src/utils/archive/ArchiveEngine.ts';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { pathToFileURL } from 'url';

async function extractPdfText(pdfBytes: Uint8Array): Promise<string> {
  const pdfjsPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.mjs');
  const pdfjs = await import(pathToFileURL(pdfjsPath).href);
  const doc = await pdfjs.getDocument({ data: pdfBytes, disableFontFace: true }).promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((it: any) => it.str).join(' ') + ' ';
  }
  return fullText;
}

async function testAll() {
  console.log('Testing WOFF2, MOBI PalmDOC, AZW3 KF8, and preserved content...\n');

  // 1. WOFF2
  const dummyTtf = new Uint8Array(64);
  const ttfView = new DataView(dummyTtf.buffer);
  ttfView.setUint32(0, 0x00010000);
  ttfView.setUint16(4, 2);

  const woff2Out = FontEngine.ttfToWoff2(dummyTtf);
  const woff2View = new DataView(woff2Out.buffer);
  if (woff2View.getUint32(0, false) !== 0x774F4632) {
    throw new Error('WOFF2 output missing wOF2 magic signature');
  }
  console.log('? ttfToWoff2 generates valid 0x774F4632 wOF2 signature.');

  const recoveredTtf = FontEngine.woff2ToTtf(woff2Out);
  const recView = new DataView(recoveredTtf.buffer);
  if (recView.getUint32(0, false) !== 0x00010000) {
    throw new Error('woff2ToTtf did not recover 0x00010000 SFNT TTF');
  }
  console.log('? woff2ToTtf restores authentic SFNT TTF.');

  // 2. MOBI PalmDOC with distinct verified content
  const mobiTitle = 'The Call of the Wild';
  const mobiText = 'Buck did not read the newspapers, or he would have known that trouble was brewing.';
  const pRecordText = new TextEncoder().encode(mobiTitle + '\n\n' + mobiText);

  // Build binary PalmDOC header + records
  const mobiHeader = new Uint8Array(78 + 2 * 8);
  const mHeadView = new DataView(mobiHeader.buffer);
  new Uint8Array(mobiHeader.buffer, 60, 8).set(new TextEncoder().encode('BOOKMOBI'));
  mHeadView.setUint16(76, 2, false); // 2 records
  const rec0Offset = mobiHeader.length;
  const rec1Offset = rec0Offset + 16;
  mHeadView.setUint32(78, rec0Offset, false);
  mHeadView.setUint32(86, rec1Offset, false);

  const rec0 = new Uint8Array(16);
  const r0View = new DataView(rec0.buffer);
  r0View.setUint16(0, 1, false); // uncompressed
  r0View.setUint16(8, 1, false); // 1 text record

  const completeMobi = new Uint8Array(mobiHeader.length + rec0.length + pRecordText.length);
  completeMobi.set(mobiHeader, 0);
  completeMobi.set(rec0, rec0Offset);
  completeMobi.set(pRecordText, rec1Offset);

  const mobiPdf = await EbookEngine.mobiToPdf(completeMobi);
  const extractedMobiPdfText = await extractPdfText(mobiPdf);
  if (!extractedMobiPdfText.includes('Buck did not read the newspapers')) {
    throw new Error(`MOBI PDF text extraction failed to preserve book content! Got: ${extractedMobiPdfText}`);
  }
  console.log('? MOBI PalmDOC parser converted and preserved book content in PDF.');

  // 3. AZW3 KF8 with distinct verified XHTML content
  const azw3Title = 'Moby Dick Adventure';
  const azw3Content = 'Call me Ishmael. Some years ago never mind how long precisely.';
  const azw3Html = `<html xmlns="http://www.w3.org/1999/xhtml"><body><h1>${azw3Title}</h1><p>${azw3Content}</p></body></html>`;
  const azw3HtmlBytes = new TextEncoder().encode(azw3Html);

  const azw3Header = new Uint8Array(78 + 2 * 8);
  const aHeadView = new DataView(azw3Header.buffer);
  new Uint8Array(azw3Header.buffer, 60, 8).set(new TextEncoder().encode('BOOKMOBI'));
  aHeadView.setUint16(76, 2, false);
  const aRec0Offset = azw3Header.length;
  const aRec1Offset = aRec0Offset + 16;
  aHeadView.setUint32(78, aRec0Offset, false);
  aHeadView.setUint32(86, aRec1Offset, false);

  const completeAzw3 = new Uint8Array(azw3Header.length + 16 + azw3HtmlBytes.length);
  completeAzw3.set(azw3Header, 0);
  completeAzw3.set(azw3HtmlBytes, aRec1Offset);

  const azw3Pdf = await EbookEngine.azw3ToPdf(completeAzw3);
  const extractedAzw3PdfText = await extractPdfText(azw3Pdf);
  if (!extractedAzw3PdfText.includes('Call me Ishmael')) {
    throw new Error(`AZW3 PDF text extraction failed to preserve book content! Got: ${extractedAzw3PdfText}`);
  }
  console.log('? AZW3 KF8 parser converted and preserved book content in PDF.');

  // 4. EPUB to PDF content preservation
  const epubText = 'It was the best of times, it was the worst of times.';
  const sampleEpub = ArchiveEngine.createZip([
    { name: 'mimetype', data: new TextEncoder().encode('application/epub+zip') },
    { name: 'META-INF/container.xml', data: new TextEncoder().encode('<container version="1.0"><rootfiles><rootfile full-path="content.opf"/></rootfiles></container>') },
    { name: 'content.opf', data: new TextEncoder().encode('<package version="3.0"><spine><itemref idref="c1"/></spine></package>') },
    { name: 'chapter1.xhtml', data: new TextEncoder().encode(`<html><body><h1>A Tale of Two Cities</h1><p>${epubText}</p></body></html>`) }
  ]);
  const epubPdf = await EbookEngine.epubToPdf(sampleEpub);
  const extractedEpubPdfText = await extractPdfText(epubPdf);
  if (!extractedEpubPdfText.includes('worst of times')) {
    throw new Error(`EPUB to PDF text extraction failed to preserve book content! Got: ${extractedEpubPdfText}`);
  }
  console.log('? EPUB to PDF preserved book chapter content in PDF.');

  console.log('\n?? ALL UNIT CHECKS VERIFIED 100%!');
}

testAll().catch(e => {
  console.error('Fatal test failure:', e);
  process.exit(1);
});
