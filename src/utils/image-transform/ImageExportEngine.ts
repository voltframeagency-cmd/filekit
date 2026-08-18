import { ImageExportOptions, ImageTransformResult } from "./types";

export class ImageExportEngine {
  static async exportCanvas(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    options: ImageExportOptions,
    originalFileName: string
  ): Promise<ImageTransformResult> {
    const startTime = Date.now();
    const { format = "image/png", quality = 0.9, backgroundColor = "#FFFFFF" } = options;

    let targetCanvas = canvas;
    const width = "width" in canvas ? canvas.width : 0;
    const height = "height" in canvas ? canvas.height : 0;

    // Flatten alpha for JPEG output if needed
    if (format === "image/jpeg") {
      if (typeof OffscreenCanvas !== "undefined") {
        const bgCanvas = new OffscreenCanvas(width, height);
        const ctx = bgCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = backgroundColor || "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(canvas, 0, 0);
          targetCanvas = bgCanvas;
        }
      } else if (typeof document !== "undefined") {
        const bgCanvas = document.createElement("canvas");
        bgCanvas.width = width;
        bgCanvas.height = height;
        const ctx = bgCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = backgroundColor || "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(canvas, 0, 0);
          targetCanvas = bgCanvas;
        }
      }
    }

    let outputBuffer: ArrayBuffer;

    if ("convertToBlob" in targetCanvas) {
      const blob = await (targetCanvas as OffscreenCanvas).convertToBlob({
        type: format,
        quality,
      });
      outputBuffer = await blob.arrayBuffer();
    } else if ("toBlob" in targetCanvas) {
      const blob = await new Promise<Blob>((resolve, reject) => {
        (targetCanvas as HTMLCanvasElement).toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to convert canvas to blob"));
          },
          format,
          quality
        );
      });
      outputBuffer = await blob.arrayBuffer();
    } else {
      throw new Error("Unable to export canvas blob");
    }

    let ext = ".png";
    if (format === "image/jpeg") ext = ".jpg";
    if (format === "image/webp") ext = ".webp";

    const baseName = originalFileName.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}-filekit${ext}`;

    return {
      outputBuffer,
      outputMimeType: format,
      outputWidth: width,
      outputHeight: height,
      outputSizeBytes: outputBuffer.byteLength,
      durationMs: Date.now() - startTime,
      fileName,
    };
  }
}
