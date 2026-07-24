import { rgb, RGB } from "pdf-lib";
import { WatermarkTargetPages } from "./types";

/**
 * Validates text string against standard WinAnsi font encoding (StandardFonts.HelveticaBold).
 * Returns true if all characters are supported, or false if non-Latin / unsupported characters are present.
 */
export function isWinAnsiSupported(text: string): boolean {
  if (!text) return true;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Standard WinAnsi range: 32-126 (ASCII printable) plus standard Latin-1 extensions (160-255)
    if ((code < 32 || code > 126) && (code < 160 || code > 255) && code !== 10 && code !== 13) {
      return false;
    }
  }
  return true;
}

/**
 * Inspects magic bytes of image buffer to confirm PNG or JPEG format.
 * Returns "image/png", "image/jpeg", or null.
 */
export function detectImageMimeType(buffer?: Uint8Array): "image/png" | "image/jpeg" | null {
  if (!buffer || buffer.length < 4) return null;

  // PNG magic bytes: 0x89 0x50 0x4E 0x47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "image/png";
  }

  // JPEG magic bytes: 0xFF 0xD8 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  return null;
}

/**
 * Parses Hex string e.g. "#FF0000" or "#00FF00" into pdf-lib RGB color object.
 */
export function hexToPdfRgb(hexStr: string): RGB {
  let cleaned = hexStr.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (cleaned.length !== 6) {
    return rgb(0.5, 0.5, 0.5); // Fallback gray
  }

  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  return rgb(
    isNaN(r) ? 0.5 : r,
    isNaN(g) ? 0.5 : g,
    isNaN(b) ? 0.5 : b
  );
}

/**
 * Returns 0-indexed page array determining which pages will receive the watermark overlay.
 */
export function getTargetPageIndices(
  mode: WatermarkTargetPages,
  totalPages: number,
  customRangeStr?: string
): number[] {
  if (totalPages <= 0) return [];

  if (mode === "all") {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  if (mode === "odd") {
    return Array.from({ length: totalPages }, (_, i) => i).filter(
      (idx) => (idx + 1) % 2 !== 0
    );
  }

  if (mode === "even") {
    return Array.from({ length: totalPages }, (_, i) => i).filter(
      (idx) => (idx + 1) % 2 === 0
    );
  }

  if (mode === "custom" && customRangeStr) {
    return parsePageRangeString(customRangeStr, totalPages);
  }

  return Array.from({ length: totalPages }, (_, i) => i);
}

/**
 * Parses string like "1-3, 5, 8-10" into 0-indexed page indices.
 */
export function parsePageRangeString(
  rangeStr: string,
  totalItems: number
): number[] {
  const indices = new Set<number>();
  if (!rangeStr.trim()) return [];

  const parts = rangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalItems, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const val = parseInt(trimmed, 10);
      if (!isNaN(val) && val >= 1 && val <= totalItems) {
        indices.add(val - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}
