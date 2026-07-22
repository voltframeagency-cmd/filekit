import * as PDFLib from "pdf-lib";
import { ImageToPdfOptions, ImageToPdfResult } from "./types";
import { PageLayoutCalculator } from "./pageLayout";

export class ImageToPdfEngine {
  static async convert(options: ImageToPdfOptions): Promise<ImageToPdfResult> {
    const { items, settings, signal, onProgress } = options;

    if (signal?.aborted) {
      throw new Error("CANCELLED_BY_ABORT_SIGNAL");
    }

    if (!items || items.length === 0) {
      throw new Error("EMPTY_IMAGE_SELECTION: No images selected for PDF creation.");
    }

    const pdfDoc = await PDFLib.PDFDocument.create();
    let totalSourceSize = 0;
    const warnings: string[] = [];

    if (settings.placement === "COVER" && settings.pageSize !== "FIT_IMAGE") {
      warnings.push("IMAGE_CROPPED: 'Fill page' mode may crop outer edges of images.");
    }

    for (let i = 0; i < items.length; i++) {
      if (signal?.aborted) {
        throw new Error("CANCELLED_BY_ABORT_SIGNAL");
      }

      const item = items[i];
      totalSourceSize += item.file.size;

      const fileBuffer = await item.file.arrayBuffer();
      let embeddedImage: PDFLib.PDFImage;

      if (item.mimeType === "image/jpeg") {
        embeddedImage = await pdfDoc.embedJpg(fileBuffer);
      } else {
        embeddedImage = await pdfDoc.embedPng(fileBuffer);
      }

      const rawWidth = embeddedImage.width;
      const rawHeight = embeddedImage.height;

      const pageBounds = PageLayoutCalculator.calculatePageBounds(
        settings.pageSize,
        settings.orientation,
        settings.margin,
        rawWidth,
        rawHeight,
        item.rotation
      );

      const drawBounds = PageLayoutCalculator.calculateImageDrawBounds(
        pageBounds,
        settings.placement,
        rawWidth,
        rawHeight,
        item.rotation
      );

      const page = pdfDoc.addPage([pageBounds.pageWidth, pageBounds.pageHeight]);

      // Draw white background
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageBounds.pageWidth,
        height: pageBounds.pageHeight,
        color: PDFLib.rgb(1, 1, 1)
      });

      // Handle rotation angles
      let rotationAngle = PDFLib.degrees(0);
      if (item.rotation === 90) rotationAngle = PDFLib.degrees(90);
      if (item.rotation === 180) rotationAngle = PDFLib.degrees(180);
      if (item.rotation === 270) rotationAngle = PDFLib.degrees(270);

      page.drawImage(embeddedImage, {
        x: drawBounds.x,
        y: drawBounds.y,
        width: drawBounds.width,
        height: drawBounds.height,
        rotate: rotationAngle
      });

      if (onProgress) {
        onProgress(i + 1, items.length);
      }
    }

    if (signal?.aborted) {
      throw new Error("CANCELLED_BY_ABORT_SIGNAL");
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return {
      pdfBlob,
      pdfUrl,
      pageCount: items.length,
      totalSourceSize,
      outputPdfSize: pdfBytes.length,
      settings,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}
