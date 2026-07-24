import assert from "assert";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import {
  buildWatermarkPlacementPlan,
  calculateWatermarkCoordinates,
  generateTileGridCoordinates,
  getRotatedWatermarkBounds,
  getRotatedWatermarkBoundsWithOffsets,
  transformVisualToPdfCoordinates,
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

async function createBoxedPdfBuffer(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);
  page.setCropBox(10, 10, 580, 780);
  page.setTrimBox(20, 20, 560, 760);
  page.setBleedBox(5, 5, 590, 790);
  page.setArtBox(30, 30, 540, 740);
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

  // Test 0: Local Asset Presence Verification
  {
    const workerPath = path.join(process.cwd(), "public/pdf.worker.min.mjs");
    assert.ok(fs.existsSync(workerPath), "public/pdf.worker.min.mjs must exist");
    const stat = fs.statSync(workerPath);
    assert.ok(stat.size > 100000, "pdf.worker.min.mjs file size must be valid");
    assertions += 2;
  }

  // Test 1: Rotated Watermark Bounding Box Calculation & Origin Offsets
  {
    const bounds = getRotatedWatermarkBoundsWithOffsets(100, 50, 90);
    assert.strictEqual(Math.round(bounds.width), 50);
    assert.strictEqual(Math.round(bounds.height), 100);
    assert.ok(bounds.originOffsetX >= 0, "originOffsetX must be valid non-negative");

    const bounds45 = getRotatedWatermarkBounds(100, 100, 45);
    assert.ok(bounds45.width > 100, "Rotated 45 deg box width should expand");
    assertions += 4;
  }

  // Test 2: Page Rotation Visual-to-Raw Coordinate Transforms (0, 90, 180, 270 deg)
  {
    const markW = 100;
    const markH = 50;
    const pageW = 600;
    const pageH = 800;

    const t0 = transformVisualToPdfCoordinates(10, 20, markW, markH, pageW, pageH, 600, 800, 0);
    assert.strictEqual(t0.x, 10);
    assert.strictEqual(t0.y, 20);

    const t90 = transformVisualToPdfCoordinates(10, 20, markW, markH, pageW, pageH, 800, 600, 90);
    assert.strictEqual(t90.x, 20);
    assert.strictEqual(t90.y, 800 - 10 - markW);

    const t180 = transformVisualToPdfCoordinates(10, 20, markW, markH, pageW, pageH, 600, 800, 180);
    assert.strictEqual(t180.x, 600 - 10 - markW);
    assert.strictEqual(t180.y, 800 - 20 - markH);

    const t270 = transformVisualToPdfCoordinates(10, 20, markW, markH, pageW, pageH, 800, 600, 270);
    assert.strictEqual(t270.x, 600 - 20 - markH);
    assert.strictEqual(t270.y, 10);

    assertions += 8;
  }

  // Test 3: Unified Placement Plan Parity & Custom Placement
  {
    const pageDim = { width: 600, height: 800 };
    const markBounds = { width: 200, height: 100 };

    const planCenter = buildWatermarkPlacementPlan(
      { type: "text", opacity: 0.5, rotationAngle: 0, positionPreset: "center", targetPagesMode: "all" },
      pageDim,
      markBounds
    );
    assert.strictEqual(planCenter.length, 1);
    assert.strictEqual(planCenter[0].x, 200);
    assert.strictEqual(planCenter[0].y, 350);

    const planCustom = buildWatermarkPlacementPlan(
      { type: "text", opacity: 0.5, rotationAngle: 0, positionPreset: "custom", customX: 120, customY: 240, targetPagesMode: "all" },
      pageDim,
      markBounds
    );
    assert.strictEqual(planCustom[0].x, 120);
    assert.strictEqual(planCustom[0].y, 240);

    const planTile = buildWatermarkPlacementPlan(
      { type: "text", opacity: 0.5, rotationAngle: 0, positionPreset: "tile", targetPagesMode: "all" },
      pageDim,
      markBounds
    );
    assert.ok(planTile.length > 1, "Tile placement plan should produce multiple items");
    assertions += 6;
  }

  // Test 4: Watermark Operations & WinAnsi Character Validation
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

  // Test 5: Preflight Validation & 100 MB Limit Rejection
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

  // Test 6: Strict Validation Guard — Missing Image Rejection
  {
    const pdfBuffer = await createTestPdfBuffer(1);
    await assert.rejects(
      async () => {
        await executePdfWatermark(
          pdfBuffer,
          {
            type: "image",
            opacity: 0.5,
            rotationAngle: 0,
            positionPreset: "center",
            targetPagesMode: "all",
          },
          "watermarked.pdf",
          undefined,
          true
        );
      },
      (err: any) => err.message.includes("IMAGE_WATERMARK_REQUIRED")
    );
    assertions += 1;
  }

  // Test 7: Strict Validation Guard — Empty Text Rejection
  {
    const pdfBuffer = await createTestPdfBuffer(1);
    await assert.rejects(
      async () => {
        await executePdfWatermark(
          pdfBuffer,
          {
            type: "text",
            text: "   ",
            opacity: 0.5,
            rotationAngle: 0,
            positionPreset: "center",
            targetPagesMode: "all",
          },
          "watermarked.pdf",
          undefined,
          true
        );
      },
      (err: any) => err.message.includes("EMPTY_TEXT_REQUIRED")
    );
    assertions += 1;
  }

  // Test 8: Engine Execution — PNG Image Watermark Overlay
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
      "png_watermarked.pdf",
      undefined,
      true
    );

    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.verification.isValid, true);
    assert.strictEqual(result.verification.pdfLibReloadStatus, "VERIFIED");
    assertions += 3;
  }

  // Test 9: Engine Execution — Rotated Source PDF Pages (90 deg)
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
      "rotated_source_watermark.pdf",
      undefined,
      true
    );

    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.verification.isValid, true);
    assertions += 2;
  }

  // Test 10: Page Box Preservation Fixture
  {
    const boxedPdfBuffer = await createBoxedPdfBuffer();
    const result = await executePdfWatermark(
      boxedPdfBuffer,
      {
        type: "text",
        text: "BOX TEST",
        opacity: 0.5,
        rotationAngle: 0,
        positionPreset: "center",
        targetPagesMode: "all",
      },
      "boxed_output.pdf",
      undefined,
      true
    );

    const reloadedDoc = await PDFDocument.load(result.fileData);
    const reloadedPage = reloadedDoc.getPage(0);
    const crop = reloadedPage.getCropBox();
    assert.strictEqual(crop.x, 10);
    assert.strictEqual(crop.y, 10);
    assert.strictEqual(crop.width, 580);
    assert.strictEqual(crop.height, 780);
    assertions += 4;
  }

  // Test 11: Output Verification Rejection & Fail-Closed Logic
  {
    const invalidBuffer = new Uint8Array([0x00, 0x00, 0x00]);
    const verification = await verifyPdfOverlayOutput(invalidBuffer, 1, false, true);
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
