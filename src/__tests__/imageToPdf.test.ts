import { ImageToPdfPreflight } from "@/utils/image-to-pdf/ImageToPdfPreflight";
import { PageLayoutCalculator } from "@/utils/image-to-pdf/pageLayout";
import { ImageToPdfEngine } from "@/utils/image-to-pdf/ImageToPdfEngine";
import { ImageToPdfOutputVerification } from "@/utils/image-to-pdf/outputVerification";
import * as PDFLib from "pdf-lib";

describe("Phase 2D2: Image-to-PDF Engine Unit Tests", () => {
  // 1. PageLayoutCalculator Tests
  describe("PageLayoutCalculator", () => {
    it("should calculate correct margin points", () => {
      expect(PageLayoutCalculator.getMarginPoints("NONE")).toBe(0);
      expect(PageLayoutCalculator.getMarginPoints("SMALL")).toBe(18);
      expect(PageLayoutCalculator.getMarginPoints("MEDIUM")).toBe(36);
    });

    it("should calculate FIT_IMAGE page bounds correctly", () => {
      const bounds = PageLayoutCalculator.calculatePageBounds("FIT_IMAGE", "AUTO", "NONE", 800, 600, 0);
      expect(bounds.pageWidth).toBe(800);
      expect(bounds.pageHeight).toBe(600);
    });

    it("should swap dimensions when rotated 90 degrees", () => {
      const bounds = PageLayoutCalculator.calculatePageBounds("FIT_IMAGE", "AUTO", "NONE", 800, 600, 90);
      expect(bounds.pageWidth).toBe(600);
      expect(bounds.pageHeight).toBe(800);
    });

    it("should calculate A4 portrait page bounds", () => {
      const bounds = PageLayoutCalculator.calculatePageBounds("A4", "PORTRAIT", "SMALL", 800, 600, 0);
      expect(bounds.pageWidth).toBeCloseTo(595.28, 1);
      expect(bounds.pageHeight).toBeCloseTo(841.89, 1);
      expect(bounds.marginPt).toBe(18);
    });

    it("should calculate CONTAIN draw bounds inside page margins", () => {
      const pageBounds = { pageWidth: 600, pageHeight: 800, marginPt: 50 };
      const draw = PageLayoutCalculator.calculateImageDrawBounds(pageBounds, "CONTAIN", 800, 600, 0);

      expect(draw.x).toBeGreaterThanOrEqual(50);
      expect(draw.y).toBeGreaterThanOrEqual(50);
      expect(draw.width).toBeLessThanOrEqual(500);
      expect(draw.height).toBeLessThanOrEqual(700);
    });
  });

  // 2. ImageToPdfEngine & OutputVerification Tests
  describe("ImageToPdfEngine", () => {
    it("should throw error for empty image selection", async () => {
      await expect(
        ImageToPdfEngine.convert({
          items: [],
          settings: { pageSize: "FIT_IMAGE", orientation: "AUTO", margin: "NONE", placement: "CONTAIN" }
        })
      ).rejects.toThrow("EMPTY_IMAGE_SELECTION");
    });

    it("should convert a sample JPEG image to a single-page PDF", async () => {
      // Create a minimal valid JPEG image buffer
      const doc = await PDFLib.PDFDocument.create();
      const page = doc.addPage([100, 100]);
      page.drawText("test");
      
      // Use PDFLib to embed an image or test pdf-lib creation
      const imageBytes = new Uint8Array([
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

      const fakeFile = new File([imageBytes], "sample.jpg", { type: "image/jpeg" });
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

      expect(result.pageCount).toBe(1);
      expect(result.outputPdfSize).toBeGreaterThan(0);

      // Verify output
      const verification = await ImageToPdfOutputVerification.verify(result.pdfBlob, 1);
      expect(verification.isValid).toBe(true);
      expect(verification.isPdfHeader).toBe(true);
      expect(verification.pageCount).toBe(1);
    });

    it("should respect AbortController cancellation signal", async () => {
      const controller = new AbortController();
      controller.abort();

      const imageBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
      const fakeFile = new File([imageBytes], "sample.jpg", { type: "image/jpeg" });
      const item = {
        id: "test1",
        file: fakeFile,
        previewUrl: "blob:test",
        rotation: 0 as const,
        width: 100,
        height: 100,
        mimeType: "image/jpeg" as const
      };

      await expect(
        ImageToPdfEngine.convert({
          items: [item],
          settings: { pageSize: "FIT_IMAGE", orientation: "AUTO", margin: "NONE", placement: "CONTAIN" },
          signal: controller.signal
        })
      ).rejects.toThrow("CANCELLED_BY_ABORT_SIGNAL");
    });
  });
});
