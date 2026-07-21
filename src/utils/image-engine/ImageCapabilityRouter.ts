import { ImagePreflightReport } from "./types";

export type ImageRouteDecision = "LOCAL_SAFE" | "LOCAL_WITH_WARNING" | "UNSUPPORTED";

export interface ImageRoutingResult {
  decision: ImageRouteDecision;
  reason?: string;
  decodedMemoryMB: number;
}

export class ImageCapabilityRouter {
  private static DESKTOP_MEMORY_CEILING_BYTES = 512 * 1024 * 1024; // 512 MB
  private static WARNING_MEMORY_CEILING_BYTES = 256 * 1024 * 1024; // 256 MB

  static evaluate(report: ImagePreflightReport): ImageRoutingResult {
    const decodedMemoryMB = Math.round((report.decodedMemoryBytes / (1024 * 1024)) * 10) / 10;

    // 1. Unsupported or unknown format
    if (report.format === "unknown") {
      return {
        decision: "UNSUPPORTED",
        reason: "UNSUPPORTED_FORMAT: Unrecognized or unsupported image format.",
        decodedMemoryMB
      };
    }

    // 2. Animated images unsupported initially
    if (report.isAnimated || report.format === "gif") {
      return {
        decision: "UNSUPPORTED",
        reason: "UNSUPPORTED_ANIMATION: Animated GIF and animated WebP processing is not currently supported.",
        decodedMemoryMB
      };
    }

    // 3. Decoded memory budget check
    if (report.decodedMemoryBytes > this.DESKTOP_MEMORY_CEILING_BYTES) {
      return {
        decision: "UNSUPPORTED",
        reason: `MEMORY_LIMIT_EXCEEDED: Image requires ${decodedMemoryMB} MB decoded memory, exceeding browser limit.`,
        decodedMemoryMB
      };
    }

    if (report.decodedMemoryBytes > this.WARNING_MEMORY_CEILING_BYTES) {
      return {
        decision: "LOCAL_WITH_WARNING",
        reason: `HIGH_MEMORY_USAGE: Image requires ${decodedMemoryMB} MB decoded memory. Local processing may be slow.`,
        decodedMemoryMB
      };
    }

    return {
      decision: "LOCAL_SAFE",
      decodedMemoryMB
    };
  }
}
