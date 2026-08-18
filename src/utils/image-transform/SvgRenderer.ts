import { SvgRenderOptions } from "./types";

export interface SvgDimensions {
  width: number;
  height: number;
  viewBox?: string;
}

export class SvgRenderer {
  /**
   * Inspects and parses basic dimensions from SVG markup or Uint8Array
   */
  static parseDimensions(svgContent: string): SvgDimensions {
    let width = 800;
    let height = 600;
    let viewBox: string | undefined;

    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
    if (viewBoxMatch) {
      viewBox = viewBoxMatch[1].trim();
      const parts = viewBox.split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        width = parts[2];
        height = parts[3];
      }
    }

    const widthMatch = svgContent.match(/<svg[^>]*\bwidth=["']([^"']+)["']/i);
    if (widthMatch) {
      const parsedW = parseFloat(widthMatch[1]);
      if (!isNaN(parsedW) && parsedW > 0) {
        width = parsedW;
      }
    }

    const heightMatch = svgContent.match(/<svg[^>]*\bheight=["']([^"']+)["']/i);
    if (heightMatch) {
      const parsedH = parseFloat(heightMatch[1]);
      if (!isNaN(parsedH) && parsedH > 0) {
        height = parsedH;
      }
    }

    return { width: Math.round(width), height: Math.round(height), viewBox };
  }

  /**
   * Renders SVG string/buffer to a high-resolution Canvas and returns the canvas element or ImageBitmap
   */
  static async renderToCanvas(
    svgContent: string,
    options: SvgRenderOptions
  ): Promise<{ canvas: HTMLCanvasElement | OffscreenCanvas; width: number; height: number }> {
    const dims = this.parseDimensions(svgContent);
    const scale = options.scaleMultiplier || 1;

    let targetWidth = Math.round((options.customWidth || dims.width) * scale);
    let targetHeight = Math.round((options.customHeight || dims.height) * scale);

    // Safeguard max canvas dimension (e.g. 16384px)
    targetWidth = Math.min(16384, Math.max(1, targetWidth));
    targetHeight = Math.min(16384, Math.max(1, targetHeight));

    // Ensure valid SVG XML header & namespaces if missing
    let cleanSvg = svgContent.trim();
    if (!cleanSvg.includes("xmlns=")) {
      cleanSvg = cleanSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    if (typeof OffscreenCanvas !== "undefined" && typeof createImageBitmap !== "undefined") {
      const blob = new Blob([cleanSvg], { type: "image/svg+xml;charset=utf-8" });
      const bitmap = await createImageBitmap(blob, {
        resizeWidth: targetWidth,
        resizeHeight: targetHeight,
        resizeQuality: "high",
      });

      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("OffscreenCanvas 2D context null");

      if (!options.preserveTransparency && options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();

      return { canvas, width: targetWidth, height: targetHeight };
    }

    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context null");

      if (!options.preserveTransparency && options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      }

      const blob = new Blob([cleanSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(new Error("Failed to load SVG into image element"));
        img.src = url;
      });

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      return { canvas, width: targetWidth, height: targetHeight };
    }

    throw new Error("No canvas rendering context available in current environment");
  }
}
