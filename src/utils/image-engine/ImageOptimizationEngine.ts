import { ImagePreflightInspector } from "./ImagePreflightInspector";
import { ImageCapabilityRouter } from "./ImageCapabilityRouter";
import { ImageStrategySelector } from "./ImageStrategySelector";
import { selectImageCompressionResult, ImageCandidate } from "./ImageTargetSizeController";
import { ImageVerificationResult, ImageProcessingJob, ImagePreflightReport } from "./types";

export class ImageOptimizationEngine {
  id = "image-local-engine";

  static async compress(
    arrayBuffer: ArrayBuffer,
    targetSizeBytes: number,
    outputFormat?: "jpeg" | "png" | "webp",
    onProgress?: (progress: number) => void
  ): Promise<ImageVerificationResult> {
    const startTime = Date.now();

    // 1. Run Preflight Inspection
    const report: ImagePreflightReport = await ImagePreflightInspector.inspect(arrayBuffer);

    // 2. Check Routing
    const route = ImageCapabilityRouter.evaluate(report);
    if (route.decision === "UNSUPPORTED") {
      throw new Error(route.reason || "UNSUPPORTED: Image processing rejected by capability router.");
    }

    // 3. Early return if original is already within target
    if (arrayBuffer.byteLength <= targetSizeBytes) {
      const res = selectImageCompressionResult({
        originalBuffer: arrayBuffer,
        candidates: [],
        targetSizeBytes,
        originalWidth: report.width,
        originalHeight: report.height,
        inputMimeType: report.mimeType,
        attemptsRun: 0,
        exifOrientation: report.exifOrientation
      });
      res.processingDurationMs = Date.now() - startTime;
      return res;
    }

    // 4. Get Quality Steps
    const steps = ImageStrategySelector.getProcessingSteps(report, outputFormat);
    const candidates: ImageCandidate[] = [];
    let attemptsRun = 0;

    const originalUint8 = new Uint8Array(arrayBuffer);

    for (let i = 0; i < steps.length; i++) {
      attemptsRun++;
      if (onProgress) {
        onProgress(Math.round((i / steps.length) * 100));
      }

      const step = steps[i];
      try {
        const sliceToTransfer = originalUint8.slice(0).buffer;
        const res = await this.transformPass({
          buffer: sliceToTransfer,
          inputMime: report.mimeType,
          targetMime: step.targetMime,
          scale: step.scale,
          quality: step.quality,
          preserveAlpha: step.preserveAlpha,
          exifOrientation: report.exifOrientation
        });

        if (res && res.buffer && res.size < arrayBuffer.byteLength) {
          candidates.push({
            buffer: res.buffer,
            size: res.size,
            width: res.width,
            height: res.height,
            mimeType: step.targetMime,
            orientationCorrected: report.exifOrientation > 1,
            alphaPreserved: step.preserveAlpha,
            metadataRemoved: true,
            scale: step.scale,
            quality: step.quality
          });

          if (res.size <= targetSizeBytes) {
            break;
          }
        }
      } catch (err) {
        console.warn(`Image worker step ${i} failed:`, err);
      }
    }

    if (onProgress) {
      onProgress(100);
    }

    const finalResult = selectImageCompressionResult({
      originalBuffer: arrayBuffer,
      candidates,
      targetSizeBytes,
      originalWidth: report.width,
      originalHeight: report.height,
      inputMimeType: report.mimeType,
      attemptsRun,
      exifOrientation: report.exifOrientation
    });

    finalResult.processingDurationMs = Date.now() - startTime;
    finalResult.rgbaBytes = report.rgbaBytes;
    finalResult.estimatedPeakBytes = report.estimatedPeakBytes;
    finalResult.activeBudgetBytes = report.activeBudgetBytes;
    finalResult.routeReason = route.reason;
    return finalResult;
  }

  private static async transformPass(params: {
    buffer: ArrayBuffer;
    inputMime: string;
    targetMime: string;
    scale: number;
    quality: number;
    preserveAlpha: boolean;
    exifOrientation: number;
  }): Promise<{ buffer: ArrayBuffer; size: number; width: number; height: number }> {
    const { buffer, inputMime, targetMime, scale, quality, preserveAlpha } = params;

    // Use OffscreenCanvas if available, or HTMLCanvasElement in DOM context
    if (typeof OffscreenCanvas !== "undefined") {
      const blob = new Blob([buffer], { type: inputMime });
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });

      const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
      const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("OffscreenCanvas 2D context null");

      if (preserveAlpha && (targetMime === "image/png" || targetMime === "image/webp")) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();

      const outBlob = await canvas.convertToBlob({ type: targetMime, quality });
      const outBuf = await outBlob.arrayBuffer();

      return {
        buffer: outBuf,
        size: outBuf.byteLength,
        width: targetWidth,
        height: targetHeight
      };
    }

    // Fallback for DOM canvas
    if (typeof document !== "undefined") {
      const blob = new Blob([buffer], { type: inputMime });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      const targetWidth = Math.max(1, Math.round(img.width * scale));
      const targetHeight = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("DOM canvas 2D context null");

      if (preserveAlpha && (targetMime === "image/png" || targetMime === "image/webp")) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      const dataUrl = canvas.toDataURL(targetMime, quality);
      const base64 = dataUrl.split(",")[1];
      const binaryStr = atob(base64);
      const outBuf = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        outBuf[i] = binaryStr.charCodeAt(i);
      }

      return {
        buffer: outBuf.buffer,
        size: outBuf.byteLength,
        width: targetWidth,
        height: targetHeight
      };
    }

    throw new Error("Canvas environment not available for image transformation.");
  }
}
