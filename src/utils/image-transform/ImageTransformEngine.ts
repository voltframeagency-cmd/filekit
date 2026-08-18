import { AspectRatioPreset, CropCoordinates, ResizeDimensions } from "./types";

export class ImageTransformEngine {
  /**
   * Calculates aspect ratio ratio number (width / height)
   */
  static getAspectRatioValue(preset: AspectRatioPreset): number | null {
    switch (preset) {
      case "1:1":
        return 1.0;
      case "16:9":
        return 16 / 9;
      case "4:3":
        return 4 / 3;
      case "3:2":
        return 3 / 2;
      case "9:16":
        return 9 / 16;
      case "2:1":
        return 2.0;
      case "freeform":
      default:
        return null;
    }
  }

  /**
   * Generates centered initial crop box coordinates for a given aspect ratio preset
   */
  static calculateInitialCrop(
    sourceWidth: number,
    sourceHeight: number,
    preset: AspectRatioPreset
  ): CropCoordinates {
    const ratio = this.getAspectRatioValue(preset);
    if (!ratio) {
      // Freeform default: 90% centered box
      const w = Math.round(sourceWidth * 0.9);
      const h = Math.round(sourceHeight * 0.9);
      return {
        x: Math.round((sourceWidth - w) / 2),
        y: Math.round((sourceHeight - h) / 2),
        width: w,
        height: h,
      };
    }

    const sourceRatio = sourceWidth / sourceHeight;
    let cropWidth: number;
    let cropHeight: number;

    if (sourceRatio > ratio) {
      // Source is wider than target aspect ratio -> fit to height
      cropHeight = Math.round(sourceHeight * 0.9);
      cropWidth = Math.round(cropHeight * ratio);
    } else {
      // Source is taller than target aspect ratio -> fit to width
      cropWidth = Math.round(sourceWidth * 0.9);
      cropHeight = Math.round(cropWidth / ratio);
    }

    const x = Math.max(0, Math.round((sourceWidth - cropWidth) / 2));
    const y = Math.max(0, Math.round((sourceHeight - cropHeight) / 2));

    return { x, y, width: cropWidth, height: cropHeight };
  }

  /**
   * Clamps crop coordinates strictly within source image dimensions
   */
  static clampCrop(
    crop: CropCoordinates,
    sourceWidth: number,
    sourceHeight: number,
    preset: AspectRatioPreset = "freeform"
  ): CropCoordinates {
    let width = Math.max(10, Math.min(crop.width, sourceWidth));
    let height = Math.max(10, Math.min(crop.height, sourceHeight));

    const ratio = this.getAspectRatioValue(preset);
    if (ratio) {
      if (width / height > ratio) {
        width = Math.round(height * ratio);
      } else {
        height = Math.round(width / ratio);
      }
    }

    let x = Math.max(0, Math.min(crop.x, sourceWidth - width));
    let y = Math.max(0, Math.min(crop.y, sourceHeight - height));

    return { x, y, width, height };
  }

  /**
   * Executes canvas crop extraction
   */
  static cropCanvas(
    sourceCanvas: HTMLCanvasElement | OffscreenCanvas | ImageBitmap | HTMLImageElement,
    crop: CropCoordinates
  ): HTMLCanvasElement | OffscreenCanvas {
    const targetW = Math.max(1, Math.round(crop.width));
    const targetH = Math.max(1, Math.round(crop.height));

    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(targetW, targetH);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("OffscreenCanvas context null");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        sourceCanvas,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        targetW,
        targetH
      );
      return canvas;
    }

    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context null");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        sourceCanvas,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        targetW,
        targetH
      );
      return canvas;
    }

    throw new Error("No canvas context available");
  }

  /**
   * Calculates new dimensions given target changes & aspect ratio constraints
   */
  static computeResize(
    sourceWidth: number,
    sourceHeight: number,
    options: {
      newWidth?: number;
      newHeight?: number;
      lockAspectRatio?: boolean;
      scalePercentage?: number;
    }
  ): { width: number; height: number } {
    if (options.scalePercentage && options.scalePercentage > 0) {
      const factor = options.scalePercentage / 100;
      return {
        width: Math.max(1, Math.round(sourceWidth * factor)),
        height: Math.max(1, Math.round(sourceHeight * factor)),
      };
    }

    const aspectRatio = sourceWidth / sourceHeight;
    let targetW = options.newWidth || sourceWidth;
    let targetH = options.newHeight || sourceHeight;

    if (options.lockAspectRatio) {
      if (options.newWidth && !options.newHeight) {
        targetH = Math.round(targetW / aspectRatio);
      } else if (options.newHeight && !options.newWidth) {
        targetW = Math.round(targetH * aspectRatio);
      }
    }

    return {
      width: Math.max(1, Math.round(targetW)),
      height: Math.max(1, Math.round(targetH)),
    };
  }

  /**
   * Scales a canvas to target dimensions using high-quality smoothing
   */
  static resizeCanvas(
    sourceCanvas: HTMLCanvasElement | OffscreenCanvas | ImageBitmap | HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): HTMLCanvasElement | OffscreenCanvas {
    const targetW = Math.max(1, Math.round(targetWidth));
    const targetH = Math.max(1, Math.round(targetHeight));

    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(targetW, targetH);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("OffscreenCanvas context null");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sourceCanvas, 0, 0, targetW, targetH);
      return canvas;
    }

    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context null");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sourceCanvas, 0, 0, targetW, targetH);
      return canvas;
    }

    throw new Error("No canvas context available");
  }

  /**
   * Rotates a canvas by 90, 180, or 270 degrees and correctly swaps width/height
   */
  static rotateCanvas(
    sourceCanvas: HTMLCanvasElement | OffscreenCanvas | ImageBitmap | HTMLImageElement,
    angle: 90 | 180 | 270
  ): HTMLCanvasElement | OffscreenCanvas {
    const srcW = "width" in sourceCanvas ? sourceCanvas.width : (sourceCanvas as any).naturalWidth;
    const srcH = "height" in sourceCanvas ? sourceCanvas.height : (sourceCanvas as any).naturalHeight;

    const isSwapped = angle === 90 || angle === 270;
    const targetW = isSwapped ? srcH : srcW;
    const targetH = isSwapped ? srcW : srcH;

    let canvas: HTMLCanvasElement | OffscreenCanvas;
    let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

    if (typeof OffscreenCanvas !== "undefined") {
      canvas = new OffscreenCanvas(targetW, targetH);
      ctx = canvas.getContext("2d");
    } else if (typeof document !== "undefined") {
      canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      ctx = canvas.getContext("2d");
    } else {
      throw new Error("No canvas context available");
    }

    if (!ctx) throw new Error("Canvas context null");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (angle === 90) {
      ctx.translate(targetW, 0);
      ctx.rotate((90 * Math.PI) / 180);
    } else if (angle === 180) {
      ctx.translate(targetW, targetH);
      ctx.rotate((180 * Math.PI) / 180);
    } else if (angle === 270) {
      ctx.translate(0, targetH);
      ctx.rotate((270 * Math.PI) / 180);
    }

    ctx.drawImage(sourceCanvas, 0, 0);
    return canvas;
  }

  /**
   * Flips a canvas horizontally or vertically
   */
  static flipCanvas(
    sourceCanvas: HTMLCanvasElement | OffscreenCanvas | ImageBitmap | HTMLImageElement,
    direction: "horizontal" | "vertical"
  ): HTMLCanvasElement | OffscreenCanvas {
    const srcW = "width" in sourceCanvas ? sourceCanvas.width : (sourceCanvas as any).naturalWidth;
    const srcH = "height" in sourceCanvas ? sourceCanvas.height : (sourceCanvas as any).naturalHeight;

    let canvas: HTMLCanvasElement | OffscreenCanvas;
    let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

    if (typeof OffscreenCanvas !== "undefined") {
      canvas = new OffscreenCanvas(srcW, srcH);
      ctx = canvas.getContext("2d");
    } else if (typeof document !== "undefined") {
      canvas = document.createElement("canvas");
      canvas.width = srcW;
      canvas.height = srcH;
      ctx = canvas.getContext("2d");
    } else {
      throw new Error("No canvas context available");
    }

    if (!ctx) throw new Error("Canvas context null");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (direction === "horizontal") {
      ctx.translate(srcW, 0);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(0, srcH);
      ctx.scale(1, -1);
    }

    ctx.drawImage(sourceCanvas, 0, 0);
    return canvas;
  }
}
