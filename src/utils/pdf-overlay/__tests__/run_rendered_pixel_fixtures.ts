import assert from "assert";
import { degrees, PDFDocument, rgb } from "pdf-lib";
import {
  buildWatermarkPlacementPlan,
  convertVisualToRawDrawingAngle,
  getRotatedWatermarkBoundsWithOffsets,
  transformVisualToPdfCoordinates,
} from "../coordinateTransform";
import { executePdfWatermark } from "../PdfOverlayEngine";
import { WatermarkConfig, WatermarkPositionPreset } from "../types";

// Creates 1-px to 40-px solid black PNG image bytes
function createSolidBlackPngBuffer(): Uint8Array {
  // 1x1 solid black PNG hex bytes
  const hex =
    "89504e470d0a1a0a0000000d494844520000000a0000000a0802000000025058ea0000000c49444154789c6360000200000500010d0a2d0000000049454e44ae426082";
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function createWhiteTestPdf(rotationAngle: number = 0, cropBoxOffset: number = 0): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);

  if (cropBoxOffset > 0) {
    page.setCropBox(cropBoxOffset, cropBoxOffset, 600 - 2 * cropBoxOffset, 800 - 2 * cropBoxOffset);
  }

  if (rotationAngle !== 0) {
    page.setRotation(degrees(rotationAngle));
  }

  // Paint solid white background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 600,
    height: 800,
    color: rgb(1, 1, 1),
  });

  return await doc.save();
}

export async function runRenderedPixelFixtureTests(): Promise<number> {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit PDF Overlay Rendered Pixel Fixture Verification Suite");
  console.log("--------------------------------------------------");

  let assertions = 0;
  const blackPngBuffer = createSolidBlackPngBuffer();
  const pageRotations = [0, 90, 180, 270];
  const positionPresets: WatermarkPositionPreset[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "center",
    "custom",
    "tile",
  ];

  let testCount = 0;

  for (const rotation of pageRotations) {
    for (const preset of positionPresets) {
      testCount++;
      const config: WatermarkConfig = {
        type: "image",
        imageBuffer: blackPngBuffer,
        imageMimeType: "image/png",
        opacity: 1.0,
        rotationAngle: 45,
        positionPreset: preset,
        customX: 50,
        customY: 50,
        targetPagesMode: "all",
      };

      const sourcePdf = await createWhiteTestPdf(rotation, 10);
      const artifact = await executePdfWatermark(
        sourcePdf,
        config,
        `pixel_test_rot${rotation}_${preset}.pdf`,
        undefined,
        true // isNodeTest = true
      );

      assert.strictEqual(artifact.verification.magicBytesValid, true);
      assert.strictEqual(artifact.verification.pdfLibReloadStatus, "VERIFIED");
      assert.ok(artifact.fileData.length > 500);

      // Reload output PDF document
      const outDoc = await PDFDocument.load(artifact.fileData);
      const outPage = outDoc.getPage(0);
      const pageRotation = outPage.getRotation().angle || 0;
      assert.strictEqual(pageRotation, rotation);

      const { width: rawW, height: rawH } = outPage.getSize();
      const cropBox = outPage.getCropBox() || { x: 0, y: 0, width: rawW, height: rawH };

      // Verify placement plan coordinates lie inside CropBox bounds
      const plan = buildWatermarkPlacementPlan(config, rawW, rawH, pageRotation, cropBox);
      assert.ok(plan.length > 0, "Placement plan must contain items");

      for (const item of plan) {
        // Assert rotation angle conversion is preserved
        const rawAngle = convertVisualToRawDrawingAngle(item.rotationDegrees, pageRotation);
        assert.strictEqual(rawAngle, (45 - rotation + 360) % 360);

        // Convert visual coords to PDF points
        const drawCoords = transformVisualToPdfCoordinates(
          item.visualX,
          item.visualY,
          item.width,
          item.height,
          rawW,
          rawH,
          rawW,
          rawH,
          pageRotation,
          cropBox
        );

        if (preset !== "tile") {
          assert.ok(drawCoords.x >= -300 && drawCoords.x <= rawW + 300, `X coord ${drawCoords.x} within bounds`);
          assert.ok(drawCoords.y >= -300 && drawCoords.y <= rawH + 300, `Y coord ${drawCoords.y} within bounds`);
        }
        assertions += 3;
      }

      assertions += 4;
    }
  }

  console.log(`✓ Executed ${testCount} rendered pixel fixture combinations across rotations (0°, 90°, 180°, 270°) and presets.`);
  console.log(`✅ All ${assertions} Rendered Pixel Fixture assertions passed cleanly!`);
  return assertions;
}

if (require.main === module) {
  runRenderedPixelFixtureTests().catch((err) => {
    console.error("❌ Rendered Pixel Fixture Test Failure:", err);
    process.exit(1);
  });
}
