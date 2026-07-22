import { ImageConversionPreflight } from "./ImageConversionPreflight";
import { ImageConversionResult, SupportedImageFormat } from "./types";

export interface ConvertOptions {
  inputBuffer: ArrayBuffer;
  targetMime: SupportedImageFormat;
  quality?: number; // 10 to 100
  backgroundColor?: string; // Hex e.g. "#FFFFFF" or "#000000"
  signal?: AbortSignal;
}

export class ImageConversionEngine {
  static async convert(options: ConvertOptions): Promise<ImageConversionResult> {
    const startTime = Date.now();
    const { inputBuffer, targetMime, quality = 0.8, backgroundColor = "#FFFFFF", signal } = options;

    if (signal?.aborted) {
      throw new Error("CANCELLED_BY_ABORT_SIGNAL");
    }

    // 1. Inspect Input
    const report = await ImageConversionPreflight.inspect(inputBuffer);
    if (!report.isValid) {
      throw new Error(report.error || "UNSUPPORTED_INPUT_FORMAT");
    }

    if (report.isAnimated) {
      throw new Error("UNSUPPORTED_ANIMATION: Animated WebP images cannot be converted statically.");
    }

    if (report.mimeType === targetMime && (!options.quality || options.quality === 100)) {
      // Allow re-encoding if target format matches but quality or options differ, otherwise reject
    }

    // 2. Perform Canvas Conversion
    const targetQuality = Math.min(1.0, Math.max(0.1, (options.quality ?? 80) / 100));
    const flattenAlpha = (report.mimeType === "image/png" || report.mimeType === "image/webp") && targetMime === "image/jpeg";

    let outBuffer: ArrayBuffer;
    let outWidth = report.width;
    let outHeight = report.height;

    if (typeof OffscreenCanvas !== "undefined") {
      const blob = new Blob([inputBuffer], { type: report.mimeType });
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      outWidth = bitmap.width;
      outHeight = bitmap.height;

      const canvas = new OffscreenCanvas(outWidth, outHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("OffscreenCanvas context null");

      if (flattenAlpha || targetMime === "image/jpeg") {
        ctx.fillStyle = backgroundColor || "#FFFFFF";
        ctx.fillRect(0, 0, outWidth, outHeight);
      } else {
        ctx.clearRect(0, 0, outWidth, outHeight);
      }

      ctx.drawImage(bitmap, 0, 0, outWidth, outHeight);
      bitmap.close();

      const outBlob = await canvas.convertToBlob({ type: targetMime, quality: targetQuality });
      outBuffer = await outBlob.arrayBuffer();
    } else if (typeof document !== "undefined") {
      const blob = new Blob([inputBuffer], { type: report.mimeType });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      outWidth = img.width;
      outHeight = img.height;

      const canvas = document.createElement("canvas");
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("DOM Canvas context null");

      if (flattenAlpha || targetMime === "image/jpeg") {
        ctx.fillStyle = backgroundColor || "#FFFFFF";
        ctx.fillRect(0, 0, outWidth, outHeight);
      } else {
        ctx.clearRect(0, 0, outWidth, outHeight);
      }

      ctx.drawImage(img, 0, 0, outWidth, outHeight);
      URL.revokeObjectURL(url);

      const dataUrl = canvas.toDataURL(targetMime, targetQuality);
      const base64 = dataUrl.split(",")[1];
      const binaryStr = atob(base64);
      const uint8 = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        uint8[i] = binaryStr.charCodeAt(i);
      }
      outBuffer = uint8.buffer;
    } else {
      throw new Error("Canvas environment not available.");
    }

    if (signal?.aborted) {
      throw new Error("CANCELLED_BY_ABORT_SIGNAL");
    }

    const originalSizeBytes = inputBuffer.byteLength;
    const outputSizeBytes = outBuffer.byteLength;
    const isLarger = outputSizeBytes > originalSizeBytes;
    const diff = Math.abs(outputSizeBytes - originalSizeBytes);
    const sizeChangePercentage = originalSizeBytes > 0 ? parseFloat(((diff / originalSizeBytes) * 100).toFixed(1)) : 0;

    const warnings: string[] = [];
    if (flattenAlpha) {
      warnings.push("TRANSPARENCY_FLATTENED: Transparent background flattened to selected background color.");
    }

    return {
      originalSizeBytes,
      outputSizeBytes,
      outputBuffer: outBuffer,
      inputMimeType: report.mimeType,
      outputMimeType: targetMime,
      originalWidth: report.width,
      originalHeight: report.height,
      outputWidth: outWidth,
      outputHeight: outHeight,
      sizeChangePercentage,
      isLarger,
      alphaPreserved: !flattenAlpha && report.hasAlpha,
      alphaFlattened: flattenAlpha,
      outcome: "CONVERSION_COMPLETED",
      processingDurationMs: Date.now() - startTime,
      warnings
    };
  }
}
