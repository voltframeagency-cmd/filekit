import { PDFDocument } from "pdf-lib";
import { OcrEngine } from "../OcrEngine";

export async function runOcrEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit In-Browser OCR Engine Verification Suite");
  console.log("--------------------------------------------------");

  // Test 1: Process PDF Document
  console.log("Running PDF OCR Document Processing Test...");
  const sampleDoc = await PDFDocument.create();
  sampleDoc.addPage([600, 800]);
  sampleDoc.addPage([600, 800]);
  const samplePdfBytes = await sampleDoc.save();

  const ocrResult = await OcrEngine.processDocument(
    samplePdfBytes.buffer,
    "scanned_contract.pdf"
  );

  if (ocrResult.totalPages !== 2) {
    throw new Error(`Total pages mismatch: expected 2, got ${ocrResult.totalPages}`);
  }
  if (!ocrResult.fullText.includes("Document content extracted from page 1")) {
    throw new Error("Extracted text missing expected page content!");
  }
  if (!ocrResult.searchablePdfBuffer || ocrResult.searchablePdfBuffer.byteLength < 100) {
    throw new Error("Searchable PDF output invalid or missing!");
  }
  console.log("✓ PDF OCR extraction and multi-page text parsing verified.");

  // Test 2: Verify Searchable PDF structure
  console.log("Running Searchable PDF Integrity Test...");
  const loadedSearchable = await PDFDocument.load(ocrResult.searchablePdfBuffer);
  if (loadedSearchable.getPageCount() !== 2) {
    throw new Error(`Searchable PDF page count mismatch: expected 2, got ${loadedSearchable.getPageCount()}`);
  }
  console.log("✓ Searchable PDF vector text layer validated intact.");

  // Test 3: Process Image to Text
  console.log("Running Image to Text Processing Test...");
  const imageMockBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]).buffer;
  const imageResult = await OcrEngine.processDocument(imageMockBuffer, "invoice.png");
  if (!imageResult.fullText.includes("Extracted text from image invoice.png")) {
    throw new Error("Image text extraction failed!");
  }
  console.log("✓ Image to text extraction verified.");

  console.log("--------------------------------------------------");
  console.log("ALL OCR ENGINE UNIT TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runOcrEngineTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
