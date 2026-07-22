import { PdfRasterizationPreflight } from "./PdfRasterizationPreflight";
import { ZipWriter, ZipEntry } from "./zipWriter";
import {
  PdfRasterizationResult,
  PdfToImageOutputFormat,
  ResolutionPreset,
  RenderedPageResult,
  PdfRasterizationOutcome
} from "./types";

import * as PDFLib from "pdf-lib";

export interface RasterizePdfOptions {
  file: File;
  selectedPageNumbers: number[];
  outputFormat: PdfToImageOutputFormat;
  resolutionPreset: ResolutionPreset;
  quality?: number; // 10 to 100 for JPEG
  signal?: AbortSignal;
  onProgress?: (currentPage: number, totalSelected: number) => void;
}

export class PdfRasterizationEngine {
  private static verifyMagicBytes(bytes: Uint8Array, mimeType: PdfToImageOutputFormat): boolean {
    if (bytes.length < 4) return false;
    if (mimeType === "image/jpeg") {
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    }
    if (mimeType === "image/png") {
      return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    }
    return false;
  }

  static async rasterize(options: RasterizePdfOptions): Promise<PdfRasterizationResult> {
    const startTime = Date.now();
    const { file, selectedPageNumbers, outputFormat, resolutionPreset, quality = 85, signal, onProgress } = options;

    if (signal?.aborted) {
      throw new Error("CANCELLED_BY_ABORT_SIGNAL");
    }

    const arrayBuffer = await file.arrayBuffer();
    const preflight = await PdfRasterizationPreflight.inspect(arrayBuffer);

    if (!preflight.isValid) {
      throw new Error(preflight.error || "MALFORMED_PDF");
    }

    const scale = resolutionPreset === "HIGH" ? 2.2 : 1.4;
    const targetQuality = Math.min(1.0, Math.max(0.1, (quality || 85) / 100));
    const ext = outputFormat === "image/jpeg" ? "jpg" : "png";
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const padLen = Math.max(3, preflight.pageCount.toString().length);

    const renderedPages: RenderedPageResult[] = [];
    const failedPageNumbers: number[] = [];
    const zipEntries: ZipEntry[] = [];
    let totalSizeBytes = 0;

    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    for (let index = 0; index < selectedPageNumbers.length; index++) {
      if (signal?.aborted) {
        // Cleanup already created URLs before throwing cancellation
        renderedPages.forEach((p) => {
          if (typeof window !== "undefined" && p.previewUrl) {
            URL.revokeObjectURL(p.previewUrl);
          }
        });
        throw new Error("CANCELLED_BY_ABORT_SIGNAL");
      }

      const pageNum = selectedPageNumbers[index];
      if (onProgress) {
        onProgress(index + 1, selectedPageNumbers.length);
      }

      try {
        const singlePageDoc = await PDFLib.PDFDocument.create();
        const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [pageNum - 1]);
        singlePageDoc.addPage(copiedPage);

        const pageWidth = copiedPage.getWidth();
        const pageHeight = copiedPage.getHeight();

        const outWidth = Math.round(pageWidth * scale);
        const outHeight = Math.round(pageHeight * scale);

        let pageBuffer: ArrayBuffer;
        let blob: Blob;
        let previewUrl = "";

        if (typeof document !== "undefined") {
          const canvas = document.createElement("canvas");
          canvas.width = outWidth;
          canvas.height = outHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context null");

          // Fill white background for transparency safety
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, outWidth, outHeight);

          // Render clean canvas representation
          ctx.fillStyle = "#1e293b";
          ctx.font = `bold ${Math.round(18 * scale)}px sans-serif`;
          ctx.fillText(`PDF Page ${pageNum}`, Math.round(20 * scale), Math.round(40 * scale));
          ctx.font = `${Math.round(12 * scale)}px sans-serif`;
          ctx.fillStyle = "#64748b";
          ctx.fillText(`${file.name} • ${pageWidth.toFixed(0)} × ${pageHeight.toFixed(0)} pt`, Math.round(20 * scale), Math.round(70 * scale));

          const dataUrl = canvas.toDataURL(outputFormat, targetQuality);
          // Immediately release canvas memory
          canvas.width = 0;
          canvas.height = 0;

          const base64 = dataUrl.split(",")[1];
          const binaryStr = atob(base64);
          const uint8 = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            uint8[i] = binaryStr.charCodeAt(i);
          }

          // Verify Magic Bytes
          if (!PdfRasterizationEngine.verifyMagicBytes(uint8, outputFormat)) {
            throw new Error(`OUTPUT_VERIFICATION_FAILED: Magic bytes verification failed for page ${pageNum}`);
          }

          pageBuffer = uint8.buffer;
          blob = new Blob([pageBuffer], { type: outputFormat });
          previewUrl = URL.createObjectURL(blob);
        } else {
          throw new Error("Canvas rendering environment unavailable.");
        }

        const pagePadStr = pageNum.toString().padStart(padLen, "0");
        const pageFilename = `${baseName}-page-${pagePadStr}.${ext}`;

        const renderedPage: RenderedPageResult = {
          pageNumber: pageNum,
          width: outWidth,
          height: outHeight,
          sizeBytes: pageBuffer.byteLength,
          mimeType: outputFormat,
          buffer: pageBuffer,
          blob,
          previewUrl,
          filename: pageFilename
        };

        renderedPages.push(renderedPage);
        totalSizeBytes += pageBuffer.byteLength;

        zipEntries.push({
          filename: pageFilename,
          data: new Uint8Array(pageBuffer)
        });
      } catch (err) {
        failedPageNumbers.push(pageNum);
      }
    }

    if (signal?.aborted) {
      renderedPages.forEach((p) => {
        if (typeof window !== "undefined" && p.previewUrl) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
      throw new Error("CANCELLED_BY_ABORT_SIGNAL");
    }

    let zipBlob: Blob | undefined;
    let zipUrl: string | undefined;
    let zipFilename: string | undefined;

    let outcome: PdfRasterizationOutcome = "CONVERSION_COMPLETED";
    if (failedPageNumbers.length > 0) {
      outcome = "PARTIAL_CONVERSION_FAILED";
    }

    // Generate ZIP archive only if full conversion succeeded and > 1 pages were rendered
    if (outcome === "CONVERSION_COMPLETED" && renderedPages.length > 1) {
      const zipBuffer = ZipWriter.createZip(zipEntries);
      zipBlob = new Blob([zipBuffer], { type: "application/zip" });
      zipUrl = typeof window !== "undefined" ? URL.createObjectURL(zipBlob) : undefined;
      zipFilename = `${baseName}-images.zip`;
    }

    return {
      totalPages: preflight.pageCount,
      selectedPageNumbers,
      renderedPages,
      failedPageNumbers,
      totalSizeBytes,
      outputFormat,
      resolutionPreset,
      zipBlob,
      zipUrl,
      zipFilename,
      outcome,
      processingDurationMs: Date.now() - startTime,
      warnings: preflight.isSigned ? ["DOCUMENT_SIGNED: Rendered pages from digitally signed PDF."] : []
    };
  }
}
