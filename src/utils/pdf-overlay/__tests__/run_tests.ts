import assert from "assert";
import { PDFDocument } from "pdf-lib";
import { calculateWatermarkCoordinates, generateTileGridCoordinates } from "../coordinateTransform";
import { getTargetPageIndices, hexToPdfRgb, parsePageRangeString } from "../watermarkOperations";
import { preflightOverlayPdf } from "../PdfOverlayPreflight";
import { executePdfWatermark } from "../PdfOverlayEngine";
import { verifyPdfOverlayOutput } from "../outputVerification";

async function createTestPdfBuffer(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([595, 842]); // A4
  }
  return await doc.save();
}

async function runOverlayTests() {
  console.log("▶ Running PDF Watermark & Overlay Engine Unit & Integration Tests...\n");
  let assertions = 0;

  // Test 1: Coordinate Calculations
  {
    const pageDim = { width: 600, height: 800 };
    const markBounds = { width: 200, height: 100 };

    const centerCoords = calculateWatermarkCoordinates("center", pageDim, markBounds);
    assert.strictEqual(centerCoords.x, 200);
    assert.strictEqual(centerCoords.y, 350);

    const topLeftCoords = calculateWatermarkCoordinates("top-left", pageDim, markBounds, undefined, undefined, 36);
    assert.strictEqual(topLeftCoords.x, 36);
    assert.strictEqual(topLeftCoords.y, 800 - 100 - 36);

    const tiles = generateTileGridCoordinates(pageDim, markBounds, 100, 100);
    assert.ok(tiles.length > 1, "Tile grid should produce multiple coordinate pairs");
    assertions += 4;
  }

  // Test 2: Watermark Operations Helpers
  {
    const colorRgb = hexToPdfRgb("#FF0000");
    assert.strictEqual(colorRgb.type, "RGB");

    const allIndices = getTargetPageIndices("all", 5);
    assert.deepStrictEqual(allIndices, [0, 1, 2, 3, 4]);

    const oddIndices = getTargetPageIndices("odd", 5);
    assert.deepStrictEqual(oddIndices, [0, 2, 4]);

    const evenIndices = getTargetPageIndices("even", 5);
    assert.deepStrictEqual(evenIndices, [1, 3]);

    const rangeIndices = parsePageRangeString("1-2, 4", 5);
    assert.deepStrictEqual(rangeIndices, [0, 1, 3]);
    assertions += 5;
  }

  // Test 3: Preflight Validation
  {
    const pdfBuffer = await createTestPdfBuffer(3);
    const preflight = await preflightOverlayPdf(pdfBuffer, "test.pdf");

    assert.strictEqual(preflight.isValid, true);
    assert.strictEqual(preflight.totalPages, 3);
    assert.strictEqual(preflight.signatureDetected, false);
    assertions += 3;
  }

  // Test 4: Engine Execution — Text Watermark Overlay
  {
    const pdfBuffer = await createTestPdfBuffer(3);

    const result = await executePdfWatermark(
      pdfBuffer,
      {
        type: "text",
        text: "CONFIDENTIAL",
        fontColor: "#EF4444",
        fontSize: 32,
        opacity: 0.4,
        rotationAngle: 45,
        positionPreset: "center",
        targetPagesMode: "all",
      },
      "watermarked_test.pdf"
    );

    assert.strictEqual(result.pageCount, 3);
    assert.strictEqual(result.verification.isValid, true);
    assert.strictEqual(result.verification.magicBytesValid, true);
    assert.strictEqual(result.verification.pdfLibReloadStatus, "VERIFIED");
    assert.strictEqual(result.fileName, "watermarked_test.pdf");
    assertions += 5;
  }

  // Test 5: Engine Execution — Tile Preset & Odd Pages Mode
  {
    const pdfBuffer = await createTestPdfBuffer(4);

    const result = await executePdfWatermark(
      pdfBuffer,
      {
        type: "text",
        text: "SAMPLE TILE",
        fontColor: "#3B82F6",
        fontSize: 24,
        opacity: 0.2,
        rotationAngle: 30,
        positionPreset: "tile",
        targetPagesMode: "odd",
      },
      "tiled_test.pdf"
    );

    assert.strictEqual(result.pageCount, 4);
    assert.strictEqual(result.verification.isValid, true);
    assertions += 2;
  }

  // Test 6: Output Verification Rejection
  {
    const invalidBuffer = new Uint8Array([0x00, 0x00, 0x00]);
    const verification = await verifyPdfOverlayOutput(invalidBuffer, 1);
    assert.strictEqual(verification.isValid, false);
    assert.strictEqual(verification.magicBytesValid, false);
    assertions += 2;
  }

  console.log(`\n✅ All ${assertions} PDF Watermark Engine assertions passed cleanly in run_tests.ts!`);
}

runOverlayTests().catch((err) => {
  console.error("❌ PDF Watermark Engine Unit Test Failure:", err);
  process.exit(1);
});
