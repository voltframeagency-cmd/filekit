import { ImageToPdfPreflight } from "../ImageToPdfPreflight";
import { PageLayoutCalculator } from "../pageLayout";
import { ImageToPdfEngine } from "../ImageToPdfEngine";
import { ImageToPdfOutputVerification } from "../outputVerification";
import * as PDFLib from "pdf-lib";

async function runImageToPdfTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Image-to-PDF Engine Verification Suite");
  console.log("--------------------------------------------------");

  // 1. PageLayoutCalculator Tests
  console.log("Running PageLayoutCalculator Tests...");
  if (PageLayoutCalculator.getMarginPoints("NONE") !== 0) throw new Error("Margin NONE failed");
  if (PageLayoutCalculator.getMarginPoints("SMALL") !== 18) throw new Error("Margin SMALL failed");
  if (PageLayoutCalculator.getMarginPoints("MEDIUM") !== 36) throw new Error("Margin MEDIUM failed");

  const fitBounds = PageLayoutCalculator.calculatePageBounds("FIT_IMAGE", "AUTO", "NONE", 800, 600, 0);
  if (fitBounds.pageWidth !== 800 || fitBounds.pageHeight !== 600) throw new Error("FIT_IMAGE bounds failed");

  const rotBounds = PageLayoutCalculator.calculatePageBounds("FIT_IMAGE", "AUTO", "NONE", 800, 600, 90);
  if (rotBounds.pageWidth !== 600 || rotBounds.pageHeight !== 800) throw new Error("Rotation swap bounds failed");

  const a4Bounds = PageLayoutCalculator.calculatePageBounds("A4", "PORTRAIT", "SMALL", 800, 600, 0);
  if (Math.round(a4Bounds.pageWidth) !== 595 || Math.round(a4Bounds.pageHeight) !== 842) {
    throw new Error("A4 bounds failed");
  }
  console.log("✓ PageLayoutCalculator tests passed.");

  // 2. ImageToPdfEngine Tests
  console.log("Running ImageToPdfEngine Tests...");
  let threwEmpty = false;
  try {
    await ImageToPdfEngine.convert({
      items: [],
      settings: { pageSize: "FIT_IMAGE", orientation: "AUTO", margin: "NONE", placement: "CONTAIN" }
    });
  } catch (err: any) {
    if (err.message.includes("EMPTY_IMAGE_SELECTION")) threwEmpty = true;
  }
  if (!threwEmpty) throw new Error("Empty image selection error handling failed");

  // Create a minimal 1x1 JPEG image buffer
  const jpegBytes = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);

  const fakeFile = new File([jpegBytes], "sample.jpg", { type: "image/jpeg" });
  const item = {
    id: "test1",
    file: fakeFile,
    previewUrl: "blob:test",
    rotation: 0 as const,
    width: 100,
    height: 100,
    mimeType: "image/jpeg" as const
  };

  const result = await ImageToPdfEngine.convert({
    items: [item],
    settings: { pageSize: "FIT_IMAGE", orientation: "AUTO", margin: "NONE", placement: "CONTAIN" }
  });

  if (result.pageCount !== 1) throw new Error("Single page conversion failed");
  if (result.outputPdfSize <= 0) throw new Error("Output size <= 0");
  console.log("✓ ImageToPdfEngine conversion passed.");

  // 3. Output Verification Tests
  console.log("Running Output Verification Tests...");
  const verification = await ImageToPdfOutputVerification.verify(result.pdfBlob, 1);
  if (!verification.isValid) throw new Error(`Output verification failed: ${verification.error}`);
  if (!verification.isPdfHeader) throw new Error("PDF header magic bytes check failed");
  console.log("✓ Output verification tests passed.");

  console.log("--------------------------------------------------");
  console.log("ALL IMAGE-TO-PDF ENGINE UNIT TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runImageToPdfTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
