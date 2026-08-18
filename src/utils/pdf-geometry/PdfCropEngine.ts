import { PDFDocument } from "pdf-lib";
import { PdfCropConfig, PdfGeometryOutputArtifact } from "./types";

export class PdfCropEngine {
  static async cropPdf(
    sourceBuffer: ArrayBuffer,
    config: PdfCropConfig,
    fileName: string = "cropped.pdf"
  ): Promise<PdfGeometryOutputArtifact> {
    const startTime = Date.now();
    const pdfDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    if (totalPages === 0) {
      throw new Error("EMPTY_PDF: Document has 0 pages.");
    }

    const top = Math.max(0, config.topMargin || 0);
    const bottom = Math.max(0, config.bottomMargin || 0);
    const left = Math.max(0, config.leftMargin || 0);
    const right = Math.max(0, config.rightMargin || 0);

    const targetIndices =
      config.applyTo === "selected" && config.selectedPages && config.selectedPages.length > 0
        ? config.selectedPages.map((p) => p - 1).filter((i) => i >= 0 && i < totalPages)
        : Array.from({ length: totalPages }, (_, i) => i);

    for (const pageIndex of targetIndices) {
      const page = pages[pageIndex];
      const { width: rawW, height: rawH } = page.getSize();

      let origX = 0;
      let origY = 0;
      let origW = rawW;
      let origH = rawH;

      try {
        const cb = page.getCropBox();
        if (cb) {
          origX = cb.x;
          origY = cb.y;
          origW = cb.width;
          origH = cb.height;
        }
      } catch (_) {}

      const newX = origX + left;
      const newY = origY + bottom;
      const newWidth = Math.max(10, origW - left - right);
      const newHeight = Math.max(10, origH - top - bottom);

      page.setCropBox(newX, newY, newWidth, newHeight);
      page.setMediaBox(newX, newY, newWidth, newHeight);
    }

    const outputBytes = await pdfDoc.save();
    return {
      fileName,
      outputBuffer: outputBytes.buffer as ArrayBuffer,
      originalSizeBytes: sourceBuffer.byteLength,
      outputSizeBytes: outputBytes.byteLength,
      pageCount: totalPages,
      processingDurationMs: Date.now() - startTime
    };
  }
}
