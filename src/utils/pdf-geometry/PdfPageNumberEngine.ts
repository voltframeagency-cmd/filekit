import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { PageNumberConfig, PdfGeometryOutputArtifact } from "./types";
import {
  transformVisualToPdfCoordinates,
  convertVisualToRawDrawingAngle,
} from "../pdf-overlay/coordinateTransform";

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return rgb(r, g, b);
}

function normalizeNumeralsAndEncoding(text: string): string {
  if (!text) return "";
  // 1. Normalize Eastern Arabic & Persian numerals to ASCII
  const easternDigits: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  };
  let normalized = text.replace(/[٠-٩۰-۹]/g, (d) => easternDigits[d] || d);

  // 2. Normalize typographic quotes, dashes, and spaces to standard ASCII
  normalized = normalized
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u00A0/g, " ");

  // 3. Fallback any non-WinAnsi character to safe equivalent
  let safeStr = "";
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255)) {
      safeStr += normalized[i];
    } else {
      safeStr += " ";
    }
  }
  return safeStr.trim();
}

function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

export class PdfPageNumberEngine {
  static async applyPageNumbers(
    sourceBuffer: ArrayBuffer,
    config: PageNumberConfig,
    fileName: string = "numbered.pdf"
  ): Promise<PdfGeometryOutputArtifact> {
    const startTime = Date.now();
    const pdfDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    if (totalPages === 0) {
      throw new Error("EMPTY_PDF: Document has 0 pages.");
    }

    // Select font
    let fontName = StandardFonts.Helvetica;
    if (config.fontFamily === "Times") fontName = StandardFonts.TimesRoman;
    if (config.fontFamily === "Courier") fontName = StandardFonts.Courier;
    const font = await pdfDoc.embedFont(fontName);

    const textColor = hexToRgb(config.fontColor || "#333333");
    const fontSize = Math.max(6, Math.min(72, config.fontSize || 10));
    const margin = Math.max(10, config.margin ?? 36);

    // Determine target page indices (0-based)
    let targetIndices: number[] = [];
    if (config.targetPages === "all") {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else if (config.targetPages === "odd") {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i).filter((i) => i % 2 === 0);
    } else if (config.targetPages === "even") {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i).filter((i) => i % 2 === 1);
    } else if (config.targetPages === "custom" && config.customRange) {
      targetIndices = parsePageRanges(config.customRange, totalPages);
    } else {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i);
    }

    for (let i = 0; i < targetIndices.length; i++) {
      const pageIndex = targetIndices[i];
      const page = pages[pageIndex];
      const { width: rawW, height: rawH } = page.getSize();
      const pageRotation = page.getRotation().angle || 0;
      const normRot = ((pageRotation % 360) + 360) % 360;

      // Extract CropBox or fallback to MediaBox / size
      let cropBox = { x: 0, y: 0, width: rawW, height: rawH };
      try {
        const cb = page.getCropBox();
        if (cb) {
          cropBox = { x: cb.x, y: cb.y, width: cb.width, height: cb.height };
        }
      } catch (_) {}

      // Calculate Visual Page Dimensions (swapped if 90 or 270 deg)
      let visualPageW = cropBox.width;
      let visualPageH = cropBox.height;
      if (normRot === 90 || normRot === 270) {
        visualPageW = cropBox.height;
        visualPageH = cropBox.width;
      }

      const currentNumber = config.startNumber + i;

      // Construct formatted string
      const rawText = (config.formatTemplate || "Page {n} of {total}")
        .replace(/{n}/g, String(currentNumber))
        .replace(/{total}/g, String(totalPages));
      const text = normalizeNumeralsAndEncoding(rawText) || `Page ${currentNumber}`;

      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      // Compute Visual (Screen-oriented) Coordinates
      let visualX = margin;
      let visualY = margin;

      switch (config.position) {
        case "bottom-center":
          visualX = (visualPageW - textWidth) / 2;
          visualY = margin;
          break;
        case "bottom-right":
          visualX = visualPageW - textWidth - margin;
          visualY = margin;
          break;
        case "bottom-left":
          visualX = margin;
          visualY = margin;
          break;
        case "top-center":
          visualX = (visualPageW - textWidth) / 2;
          visualY = visualPageH - margin - textHeight;
          break;
        case "top-right":
          visualX = visualPageW - textWidth - margin;
          visualY = visualPageH - margin - textHeight;
          break;
        case "top-left":
          visualX = margin;
          visualY = visualPageH - margin - textHeight;
          break;
      }

      // Map Visual Coordinates to Raw PDF Stream Coordinates accounting for /Rotate
      const rawCoords = transformVisualToPdfCoordinates(
        visualX,
        visualY,
        textWidth,
        textHeight,
        visualPageW,
        visualPageH,
        rawW,
        rawH,
        normRot,
        cropBox
      );

      const rawDrawingAngle = convertVisualToRawDrawingAngle(0, normRot);

      page.drawText(text, {
        x: rawCoords.x,
        y: rawCoords.y,
        size: fontSize,
        font,
        color: textColor,
        rotate: degrees(rawDrawingAngle)
      });
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
