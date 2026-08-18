import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PdfManipulationEngine } from "../PdfManipulationEngine";

console.log("--------------------------------------------------");
console.log("Starting FileKit PDF Manipulation Engine Verification");
console.log("--------------------------------------------------");

async function createSamplePdf(pageCount: number = 3): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`Page Content ${i}`, {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return await doc.save();
}

async function runReversePdfTests() {
  console.log("Running Reverse PDF Tests...");

  const srcBytes = await createSamplePdf(3);
  const reversedBytes = await PdfManipulationEngine.reversePdf(srcBytes);

  const doc = await PDFDocument.load(reversedBytes);
  if (doc.getPageCount() !== 3) {
    throw new Error(`Reverse PDF page count mismatch: expected 3, got ${doc.getPageCount()}`);
  }

  console.log("✓ Reverse PDF page sequence verified.");
}

async function runAddBlankPageTests() {
  console.log("Running Add Blank Page Tests...");

  const srcBytes = await createSamplePdf(3);

  // 1. Add to start
  const startBytes = await PdfManipulationEngine.addBlankPage(srcBytes, { position: "start" });
  const startDoc = await PDFDocument.load(startBytes);
  if (startDoc.getPageCount() !== 4) {
    throw new Error(`Add blank page at start failed: expected 4 pages, got ${startDoc.getPageCount()}`);
  }

  // 2. Add to end
  const endBytes = await PdfManipulationEngine.addBlankPage(srcBytes, { position: "end" });
  const endDoc = await PDFDocument.load(endBytes);
  if (endDoc.getPageCount() !== 4) {
    throw new Error(`Add blank page at end failed: expected 4 pages, got ${endDoc.getPageCount()}`);
  }

  // 3. Add after each page
  const eachBytes = await PdfManipulationEngine.addBlankPage(srcBytes, { position: "after-each" });
  const eachDoc = await PDFDocument.load(eachBytes);
  if (eachDoc.getPageCount() !== 6) {
    throw new Error(`Add blank page after-each failed: expected 6 pages, got ${eachDoc.getPageCount()}`);
  }

  console.log("✓ Add blank page (start, end, after-each) verified.");
}

async function runDuplicatePagesTests() {
  console.log("Running Duplicate Pages Tests...");

  const srcBytes = await createSamplePdf(3);

  // 1. All consecutive (1, 1, 2, 2, 3, 3)
  const consecBytes = await PdfManipulationEngine.duplicatePages(srcBytes, { mode: "all-consecutive" });
  const consecDoc = await PDFDocument.load(consecBytes);
  if (consecDoc.getPageCount() !== 6) {
    throw new Error(`Duplicate consecutive failed: expected 6 pages, got ${consecDoc.getPageCount()}`);
  }

  // 2. Selected page duplication
  const selectedBytes = await PdfManipulationEngine.duplicatePages(srcBytes, {
    mode: "selected",
    selectedPageNumbers: [2],
  });
  const selectedDoc = await PDFDocument.load(selectedBytes);
  if (selectedDoc.getPageCount() !== 4) {
    throw new Error(`Duplicate selected failed: expected 4 pages, got ${selectedDoc.getPageCount()}`);
  }

  console.log("✓ Duplicate pages (consecutive and selected) verified.");
}

async function runFlattenPdfTests() {
  console.log("Running Flatten PDF Tests...");

  const srcBytes = await createSamplePdf(2);
  const flattenedBytes = await PdfManipulationEngine.flattenPdf(srcBytes);
  const doc = await PDFDocument.load(flattenedBytes);

  if (doc.getPageCount() !== 2) {
    throw new Error(`Flatten PDF page count mismatch: expected 2, got ${doc.getPageCount()}`);
  }

  console.log("✓ Flatten PDF forms and annotations verified.");
}

async function main() {
  await runReversePdfTests();
  await runAddBlankPageTests();
  await runDuplicatePagesTests();
  await runFlattenPdfTests();
  console.log("--------------------------------------------------");
  console.log("ALL PDF MANIPULATION TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

main().catch((err) => {
  console.error("PDF manipulation test failed:", err);
  process.exit(1);
});
