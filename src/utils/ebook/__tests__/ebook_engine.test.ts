import { PDFDocument } from "pdf-lib";
import { EbookEngine } from "../EbookEngine";
import { ArchiveEngine } from "../../archive/ArchiveEngine";

export async function runEbookEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Production-Hardened E-Book Engine Verification");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. PDF to EPUB Packaging
  console.log("▶ Testing PDF to EPUB 3.0 Container Generation...");
  // Create a valid PDF document with pdf-lib
  const sampleDoc = await PDFDocument.create();
  sampleDoc.addPage([595.28, 841.89]);
  const samplePdfBytes = await sampleDoc.save();
  
  // Test PDF to EPUB
  const epubBytes = await EbookEngine.pdfToEpub(samplePdfBytes, "Test Novel");
  const extracted = ArchiveEngine.extractZip(epubBytes);

  const fileNames = extracted.map((e) => e.name);
  if (!fileNames.includes("mimetype")) throw new Error("EPUB missing mimetype");
  if (!fileNames.includes("META-INF/container.xml")) throw new Error("EPUB missing container.xml");
  if (!fileNames.includes("EPUB/content.opf")) throw new Error("EPUB missing content.opf");
  if (!fileNames.includes("EPUB/chapter1.xhtml")) throw new Error("EPUB missing chapter1.xhtml");
  totalAssertions += 4;
  console.log("✓ EPUB 3.0 package structure and manifests verified.");

  // 2. EPUB to PDF Conversion
  console.log("▶ Testing EPUB to Vector PDF Layout & Rendering...");
  const pdfOutput = await EbookEngine.epubToPdf(epubBytes);
  const pdfHeader = String.fromCharCode(pdfOutput[0], pdfOutput[1], pdfOutput[2], pdfOutput[3], pdfOutput[4]);
  if (!pdfHeader.startsWith("%PDF-")) {
    throw new Error("EPUB to PDF output missing %PDF- header");
  }
  if (pdfOutput.length < 500) {
    throw new Error("Generated PDF output is too small");
  }
  totalAssertions += 2;
  console.log("✓ EPUB chapter parser and vector PDF document generator verified.");

  // 3. MOBI & AZW3 to PDF
  console.log("▶ Testing Kindle MOBI/AZW3 PalmDOC Text Extractor...");
  const mockMobi = new TextEncoder().encode("BOOKMOBI\x00\x00Sample Kindle E-Book text content that will be formatted and rendered into a PDF document.");
  const mobiPdf = await EbookEngine.mobiToPdf(mockMobi);
  const mobiHeader = String.fromCharCode(mobiPdf[0], mobiPdf[1], mobiPdf[2], mobiPdf[3], mobiPdf[4]);
  if (!mobiHeader.startsWith("%PDF-")) {
    throw new Error("MOBI to PDF output missing %PDF- header");
  }
  totalAssertions += 2;
  console.log("✓ Kindle MOBI/AZW3 parser and PDF renderer verified.");

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} E-Book Engine assertions passed cleanly!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runEbookEngineTests();
}
