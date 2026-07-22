import { ImageConversionPreflightReport } from "./types";

export class ImageConversionPreflight {
  static async inspect(buffer: ArrayBuffer): Promise<ImageConversionPreflightReport> {
    const bytes = new Uint8Array(buffer);
    let mimeType = "";

    // Magic Bytes Detection
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      mimeType = "image/jpeg";
    } else if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      mimeType = "image/png";
    } else if (
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      mimeType = "image/webp";
    } else {
      return {
        width: 0,
        height: 0,
        mimeType: "unsupported",
        isAnimated: false,
        hasAlpha: false,
        isValid: false,
        error: "UNSUPPORTED_FORMAT: Unsupported image format."
      };
    }

    // Check animated WebP (search for 'ANIM' chunk in header)
    let isAnimated = false;
    if (mimeType === "image/webp") {
      const headerStr = Array.from(bytes.slice(0, 100))
        .map((b) => String.fromCharCode(b))
        .join("");
      if (headerStr.includes("ANIM")) {
        isAnimated = true;
      }
    }

    // Read Dimensions & Alpha via OffscreenCanvas / DOM Image
    let width = 0;
    let height = 0;
    let hasAlpha = mimeType === "image/png" || mimeType === "image/webp";

    try {
      if (typeof createImageBitmap !== "undefined") {
        const blob = new Blob([buffer], { type: mimeType });
        const bitmap = await createImageBitmap(blob);
        width = bitmap.width;
        height = bitmap.height;
        bitmap.close();
      } else if (typeof document !== "undefined") {
        const blob = new Blob([buffer], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
        width = img.width;
        height = img.height;
        URL.revokeObjectURL(url);
      }
    } catch {
      return {
        width: 0,
        height: 0,
        mimeType,
        isAnimated,
        hasAlpha,
        isValid: false,
        error: "MALFORMED_IMAGE: Could not decode image bitmap."
      };
    }

    return {
      width,
      height,
      mimeType,
      isAnimated,
      hasAlpha,
      isValid: true
    };
  }
}
