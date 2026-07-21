/**
 * Web Worker for image resizing, format conversion, and compression using OffscreenCanvas.
 */

export interface ImageWorkerTransformRequest {
  type: "TRANSFORM";
  id: string;
  buffer: ArrayBuffer;
  inputMime: string;
  targetMime: string;
  scale: number;
  quality: number;
  preserveAlpha: boolean;
  exifOrientation: number;
}

export interface ImageWorkerTransformResponse {
  type: "TRANSFORM_RESULT";
  id: string;
  success: boolean;
  buffer?: ArrayBuffer;
  width?: number;
  height?: number;
  mimeType?: string;
  error?: string;
}

self.onmessage = async (event: MessageEvent) => {
  const data = event.data as ImageWorkerTransformRequest;
  if (!data || data.type !== "TRANSFORM") return;

  const { id, buffer, inputMime, targetMime, scale, quality, preserveAlpha } = data;

  try {
    const blob = new Blob([buffer], { type: inputMime });
    
    // Automatically correct EXIF orientation during bitmap decode
    const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });

    const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
    const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to acquire 2D rendering context on OffscreenCanvas.");
    }

    // Preserve transparency or fill background
    if (preserveAlpha && (targetMime === "image/png" || targetMime === "image/webp")) {
      ctx.clearRect(0, 0, targetWidth, targetHeight);
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    const outputBlob = await canvas.convertToBlob({
      type: targetMime,
      quality: Math.min(1.0, Math.max(0.1, quality))
    });

    const outputArrayBuffer = await outputBlob.arrayBuffer();

    const response: ImageWorkerTransformResponse = {
      type: "TRANSFORM_RESULT",
      id,
      success: true,
      buffer: outputArrayBuffer,
      width: targetWidth,
      height: targetHeight,
      mimeType: targetMime
    };

    // Transfer output ArrayBuffer for maximum performance
    (self as any).postMessage(response, [outputArrayBuffer]);
  } catch (err: any) {
    const response: ImageWorkerTransformResponse = {
      type: "TRANSFORM_RESULT",
      id,
      success: false,
      error: err.message || "Worker image transformation failed."
    };
    (self as any).postMessage(response);
  }
};
