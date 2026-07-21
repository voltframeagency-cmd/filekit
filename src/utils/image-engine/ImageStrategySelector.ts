import { ImagePreflightReport } from "./types";

export interface ImageProcessingStep {
  scale: number;
  quality: number;
  targetMime: string;
  preserveAlpha: boolean;
}

export class ImageStrategySelector {
  static getProcessingSteps(report: ImagePreflightReport, outputFormat?: "jpeg" | "png" | "webp"): ImageProcessingStep[] {
    const targetFormat = outputFormat || (report.format === "unknown" ? "jpeg" : report.format);
    const targetMime = `image/${targetFormat}`;
    const preserveAlpha = report.hasAlpha && (targetFormat === "png" || targetFormat === "webp");

    if (targetFormat === "jpeg") {
      return [
        { scale: 1.0, quality: 0.85, targetMime: "image/jpeg", preserveAlpha: false },
        { scale: 1.0, quality: 0.70, targetMime: "image/jpeg", preserveAlpha: false },
        { scale: 0.85, quality: 0.60, targetMime: "image/jpeg", preserveAlpha: false },
        { scale: 0.70, quality: 0.45, targetMime: "image/jpeg", preserveAlpha: false }
      ];
    }

    if (targetFormat === "webp") {
      return [
        { scale: 1.0, quality: 0.85, targetMime: "image/webp", preserveAlpha },
        { scale: 1.0, quality: 0.70, targetMime: "image/webp", preserveAlpha },
        { scale: 0.85, quality: 0.55, targetMime: "image/webp", preserveAlpha },
        { scale: 0.70, quality: 0.40, targetMime: "image/webp", preserveAlpha }
      ];
    }

    // PNG: Lossless re-encoding / metadata stripping
    return [
      { scale: 1.0, quality: 0.90, targetMime: "image/png", preserveAlpha: true },
      { scale: 0.85, quality: 0.80, targetMime: "image/png", preserveAlpha: true },
      { scale: 0.70, quality: 0.70, targetMime: "image/png", preserveAlpha: true }
    ];
  }
}
