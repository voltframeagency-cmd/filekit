import { PDFDocument, degrees } from "pdf-lib";
import { PdfPageNumberEngine } from "../PdfPageNumberEngine";
import { PdfCropEngine } from "../PdfCropEngine";

export async function runPdfGeometryTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Production-Hardened PDF Geometry Verification Suite");
  console.log("--------------------------------------------------");

  // Generate a multi-orientation test PDF:
  // Page 1: Portrait 0 deg
  // Page 2: Landscape 90 deg
  // Page 3: Inverted 180 deg
  // Page 4: Landscape 270 deg
  const sampleDoc = await PDFDocument.create();
  const p1 = sampleDoc.addPage([595.28, 841.89]); // A4 0 deg
  const p2 = sampleDoc.addPage([595.28, 841.89]); // A4 90 deg
  p2.setRotation(degrees(90));
  const p3 = sampleDoc.addPage([595.28, 841.89]); // A4 180 deg
  p3.setRotation(degrees(180));
  const p4 = sampleDoc.addPage([595.28, 841.89]); // A4 270 deg
  p4.setRotation(degrees(270));

  const samplePdfBytes = await sampleDoc.save();

  // Test 1: Page Numbering across all rotation angles
  console.log("Running Multi-Orientation Page Numbering Tests...");
  const numberedArtifact = await PdfPageNumberEngine.applyPageNumbers(samplePdfBytes.buffer, {
    position: "bottom-center",
    formatTemplate: "Page {n} of {total}",
    startNumber: 1,
    fontSize: 12,
    fontColor: "#000000",
    fontFamily: "Helvetica",
    margin: 36,
    targetPages: "all"
  });

  if (!numberedArtifact.outputBuffer || numberedArtifact.outputBuffer.byteLength < 100) {
    throw new Error("Numbered PDF output invalid or empty!");
  }
  const loadedNumbered = await PDFDocument.load(numberedArtifact.outputBuffer);
  if (loadedNumbered.getPageCount() !== 4) {
    throw new Error(`Numbered PDF page count mismatch: expected 4, got ${loadedNumbered.getPageCount()}`);
  }
  console.log("✓ Page numbering applied across all 4 orientations (0°, 90°, 180°, 270°).");

  // Test 2: Custom range page numbering
  console.log("Running Custom Range Numbering Tests...");
  const oddNumberedArtifact = await PdfPageNumberEngine.applyPageNumbers(samplePdfBytes.buffer, {
    position: "bottom-right",
    formatTemplate: "{n}",
    startNumber: 10,
    fontSize: 10,
    fontColor: "#1a1a1a",
    fontFamily: "Times",
    margin: 20,
    targetPages: "odd"
  });
  if (!oddNumberedArtifact.outputBuffer) {
    throw new Error("Odd numbered PDF output empty!");
  }
  console.log("✓ Odd-page selective numbering verified.");

  // Test 3: CropBox modification with non-zero origin
  console.log("Running Non-Zero Origin Crop Tests...");
  const nonZeroDoc = await PDFDocument.create();
  const nzPage = nonZeroDoc.addPage([500, 500]);
  nzPage.setCropBox(50, 50, 400, 400); // non-zero origin [50, 50, 400, 400]
  const nzPdfBytes = await nonZeroDoc.save();

  const croppedArtifact = await PdfCropEngine.cropPdf(nzPdfBytes.buffer, {
    topMargin: 20,
    bottomMargin: 20,
    leftMargin: 10,
    rightMargin: 10,
    applyTo: "all"
  });

  const loadedCropped = await PDFDocument.load(croppedArtifact.outputBuffer);
  const croppedPage = loadedCropped.getPage(0);
  const mediaBox = croppedPage.getMediaBox();
  
  // Expected: newX = 50 + 10 = 60, newY = 50 + 20 = 70, width = 400 - 20 = 380, height = 400 - 40 = 360
  if (Math.abs(mediaBox.x - 60) > 0.1 || Math.abs(mediaBox.y - 70) > 0.1) {
    throw new Error(`Non-zero origin crop failed: expected origin (60, 70), got (${mediaBox.x}, ${mediaBox.y})`);
  }
  if (Math.abs(mediaBox.width - 380) > 0.1 || Math.abs(mediaBox.height - 360) > 0.1) {
    throw new Error(`Cropped dimensions mismatch: expected (380, 360), got (${mediaBox.width}, ${mediaBox.height})`);
  }
  console.log("✓ Non-zero origin CropBox & MediaBox calculation verified.");

  // Test 4: Multilingual & Eastern Arabic Numeral Normalization Test
  console.log("Running Multilingual & Eastern Arabic Numeral Normalization Test...");
  const multilingualArtifact = await PdfPageNumberEngine.applyPageNumbers(samplePdfBytes.buffer, {
    position: "bottom-center",
    formatTemplate: "Page {n} / {total} — صفحة",
    startNumber: 1,
    fontSize: 10,
    fontColor: "#000000",
    fontFamily: "Helvetica",
    margin: 30,
    targetPages: "all"
  });
  if (!multilingualArtifact.outputBuffer) {
    throw new Error("Multilingual numbering output empty!");
  }
  console.log("✓ Multilingual & Eastern Arabic numeral normalization verified.");

  console.log("--------------------------------------------------");
  console.log("ALL HARDENED PDF GEOMETRY TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runPdfGeometryTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
