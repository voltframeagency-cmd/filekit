import assert from "assert";
import { PDFDocument } from "pdf-lib";
import {
  calculateWatermarkCoordinates,
  generateTileGridCoordinates,
  getRotatedWatermarkBounds,
} from "../coordinateTransform";
import {
  detectImageMimeType,
  getTargetPageIndices,
  hexToPdfRgb,
  isWinAnsiSupported,
  parsePageRangeString,
} from "../watermarkOperations";
import { preflightOverlayPdf, MAX_PDF_FILE_BYTES } from "../PdfOverlayPreflight";
import { executePdfWatermark } from "../PdfOverlayEngine";
import { verifyPdfOverlayOutput } from "../outputVerification";

async function createTestPdfBuffer(pageCount: number, rotationAngle: number = 0): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([595, 842]); // A4
    if (rotationAngle !== 0) {
      page.setRotation({ type: "degrees", angle: rotationAngle });
    }
  }
  return await doc.save();
}

// 1x1 PNG image buffer helper
const SAMPLE_PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06,
  0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44,
  0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d,
  0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42,
  0x60, 0x82,
]);

async function runOverlayTests() {
  console.log("▶ Running Production-Hardened PDF Watermark & Overlay Engine Unit Tests...\n");
  let assertions = 0;

  // Test 1: Rotated Watermark Bounding Box Calculation
  {
    const bounds = getRotatedWatermarkBounds(100, 50, 90);
    assert.strictEqual(Math.round(bounds.width), 50);
    assert.strictEqual(Math.round(bounds.height), 100);

    const bounds45 = getRotatedWatermarkBounds(100, 100, 45);
    assert.ok(bounds45.width > 100, "Rotated 45 deg box width should expand");
    assertions += 3;
  }

  // Test 2: Coordinate Transformations & Custom Placement
  {
    const pageDim = { width: 600, height: 800 };
    const markBounds = { width: 200, height: 100 };

    const centerCoords = calculateWatermarkCoordinates("center", pageDim, markBounds);
    assert.strictEqual(centerCoords.x, 200);
    assert.strictEqual(centerCoords.y, 350);

    const customCoords = calculateWatermarkCoordinates("custom", pageDim, markBounds, 120, 240);
    assert.strictEqual(customCoords.x, 120);
    assert.strictEqual(customCoords.y, 240);

    const tiles = generateTileGridCoordinates(pageDim, markBounds, 100, 100);
    assert.ok(tiles.length > 1, "Tile grid should produce multiple coordinate pairs");
    assertions += 4;
  }

  // Test 3: Watermark Operations & WinAnsi Character Validation
  {
    const colorRgb = hexToPdfRgb("#FF0000");
    assert.strictEqual(colorRgb.type, "RGB");

    assert.strictEqual(isWinAnsiSupported("CONFIDENTIAL 123"), true);
    assert.strictEqual(isWinAnsiSupported("Draft v1.0"), true);
    assert.strictEqual(isWinAnsiSupported("مرحبا"), false, "Arabic non-Latin text must fail WinAnsi");

    assert.strictEqual(detectImageMimeType(SAMPLE_PNG_BYTES), "image/png");
    assert.strictEqual(detectImageMimeType(new Uint8Array([0x00, 0x00])), null);

    const rangeIndices = parsePageRangeString("1-2, 4", 5);
    assert.deepStrictEqual(rangeIndices, [0, 1, 3]);
    assertions += 7;
  }

  // Test 4: Preflight Validation & 100 MB Limit Rejection
  {
    const pdfBuffer = await createTestPdfBuffer(3);
    const preflight = await preflightOverlayPdf(pdfBuffer, "test.pdf");

    assert.strictEqual(preflight.isValid, true);
    assert.strictEqual(preflight.totalPages, 3);
    assert.strictEqual(preflight.signatureDetected, false);

    const fakeHugeBuffer = new Uint8Array(MAX_PDF_FILE_BYTES + 10);
    fakeHugeBuffer[0] = 0x25;
    fakeHugeBuffer[1] = 0x50;
    fakeHugeBuffer[2] = 0x44;
    fakeHugeBuffer[3] = 0x46;
    fakeHugeBuffer[4] = 0x2d;
    const hugePreflight = await preflightOverlayPdf(fakeHugeBuffer, "huge.pdf");
    assert.strictEqual(hugePreflight.isValid, false);
    assert.strictEqual(hugePreflight.errorCode, "FILE_TOO_LARGE");
    assertions += 5;
  }

  // Test 5: Strict Validation Guard — Missing Image Rejection
  {
    const pdfBuffer = await createTestPdfBuffer(1);
    await assert.rejects(
      async () => {
        await executePdfWatermark(pdfBuffer, {
          type: "image",
          opacity: 0.5,
          rotationAngle: 0,
          positionPreset: "center",
          targetPagesMode: "all",
        });
      },
      (err: any) => err.message.includes("IMAGE_WATERMARK_REQUIRED")
    );
    assertions += 1;
  }

  // Test 6: Strict Validation Guard — Empty Text Rejection
  {
    const pdfBuffer = await createTestPdfBuffer(1);
    await assert.rejects(
      async () => {
        await executePdfWatermark(pdfBuffer, {
          type: "text",
          text: "   ",
          opacity: 0.5,
          rotationAngle: 0,
          positionPreset: "center",
          targetPagesMode: "all",
        });
      },
      (err: any) => err.message.includes("EMPTY_TEXT_REQUIRED")
    );
    assertions += 1;
  }

  // Test 7: Engine Execution — PNG Image Watermark Overlay
  {
    const pdfBuffer = await createTestPdfBuffer(2);

    const result = await executePdfWatermark(
      pdfBuffer,
      {
        type: "image",
        imageBuffer: SAMPLE_PNG_BYTES,
        imageMimeType: "image/png",
        opacity: 0.5,
        rotationAngle: 0,
        positionPreset: "center",
        targetPagesMode: "all",
      },
      "png_watermarked.pdf"
    );

    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.verification.isValid, true);
    assert.strictEqual(result.verification.pdfLibReloadStatus, "VERIFIED");
    assertions += 3;
  }

  // Test 8: Engine Execution — Rotated Source PDF Pages (90 deg)
  {
    const pdfRotatedBuffer = await createTestPdfBuffer(2, 90);

    const result = await executePdfWatermark(
      pdfRotatedBuffer,
      {
        type: "text",
        text: "ROTATED SOURCE",
        fontColor: "#10B981",
        fontSize: 28,
        opacity: 0.3,
        rotationAngle: 45,
        positionPreset: "top-right",
        targetPagesMode: "all",
      },
      "rotated_source_watermark.pdf"
    );

    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.verification.isValid, true);
    assertions += 2;
  }

  // Test 9: Output Verification Rejection
  {
    const invalidBuffer = new Uint8Array([0x00, 0x00, 0x00]);
    const verification = await verifyPdfOverlayOutput(invalidBuffer, 1);
    assert.strictEqual(verification.isValid, false);
    assert.strictEqual(verification.magicBytesValid, false);
    assertions += 2;
  }

  console.log(`\n✅ All ${assertions} Production-Hardened PDF Watermark Engine assertions passed cleanly!`);
}

runOverlayTests().catch((err) => {
  console.error("❌ PDF Watermark Engine Production-Hardening Test Failure:", err);
  process.exit(1);
});
