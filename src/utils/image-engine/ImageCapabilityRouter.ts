import { ImagePreflightReport } from "./types";

export type ImageRouteDecision = "LOCAL_SAFE" | "LOCAL_WITH_WARNING" | "UNSUPPORTED";

export interface ImageRoutingResult {
  decision: ImageRouteDecision;
  reason?: string;
  decodedMemoryMB: number;
  rgbaBytes: number;
  operationMultiplier: number;
  estimatedPeakBytes: number;
  activeBudgetBytes: number;
}

export class ImageCapabilityRouter {
  public static LOW_BUDGET_BYTES = 160 * 1024 * 1024;      // 160 MB
  public static MEDIUM_BUDGET_BYTES = 256 * 1024 * 1024;   // 256 MB
  public static HIGH_BUDGET_BYTES = 384 * 1024 * 1024;     // 384 MB
  public static ABSOLUTE_CEILING_BYTES = 512 * 1024 * 1024; // 512 MB

  static calculatePeakMemory(params: {
    width: number;
    height: number;
    inputSizeBytes: number;
    operation: "INSPECT" | "SINGLE_ENCODE" | "RESIZE_ENCODE" | "ITERATIVE_TARGET";
  }): { rgbaBytes: number; operationMultiplier: number; estimatedPeakBytes: number } {
    const rgbaBytes = params.width * params.height * 4;
    
    let operationMultiplier = 5.0;
    if (params.operation === "INSPECT") operationMultiplier = 1.5;
    else if (params.operation === "SINGLE_ENCODE") operationMultiplier = 3.0;
    else if (params.operation === "RESIZE_ENCODE") operationMultiplier = 4.0;
    else if (params.operation === "ITERATIVE_TARGET") operationMultiplier = 5.0;

    const estimatedCandidateBytes = Math.round(params.inputSizeBytes * 0.8);
    const estimatedPeakBytes = Math.round(
      rgbaBytes * operationMultiplier + params.inputSizeBytes + estimatedCandidateBytes
    );

    return { rgbaBytes, operationMultiplier, estimatedPeakBytes };
  }

  static evaluate(
    report: ImagePreflightReport,
    inputSizeBytes: number = 0,
    activeBudgetBytes: number = ImageCapabilityRouter.HIGH_BUDGET_BYTES
  ): ImageRoutingResult {
    const { rgbaBytes, operationMultiplier, estimatedPeakBytes } = this.calculatePeakMemory({
      width: report.width,
      height: report.height,
      inputSizeBytes,
      operation: "ITERATIVE_TARGET"
    });

    const decodedMemoryMB = Math.round((estimatedPeakBytes / (1024 * 1024)) * 10) / 10;

    // 1. Unsupported or unknown format
    if (report.format === "unknown") {
      return {
        decision: "UNSUPPORTED",
        reason: "UNSUPPORTED_FORMAT: Unrecognized or unsupported image format.",
        decodedMemoryMB,
        rgbaBytes,
        operationMultiplier,
        estimatedPeakBytes,
        activeBudgetBytes
      };
    }

    // 2. Animated images unsupported initially
    if (report.isAnimated || report.format === "gif") {
      return {
        decision: "UNSUPPORTED",
        reason: "UNSUPPORTED_ANIMATION: Animated GIF and animated WebP processing is not currently supported.",
        decodedMemoryMB,
        rgbaBytes,
        operationMultiplier,
        estimatedPeakBytes,
        activeBudgetBytes
      };
    }

    // 3. Peak memory budget check (absolute ceiling or active budget)
    if (estimatedPeakBytes > this.ABSOLUTE_CEILING_BYTES) {
      return {
        decision: "UNSUPPORTED",
        reason: `MEMORY_LIMIT_EXCEEDED: Image requires estimated peak memory ${decodedMemoryMB} MB (RGBA: ${Math.round(rgbaBytes/(1024*1024))} MB × ${operationMultiplier}), exceeding absolute browser limit of 512 MB.`,
        decodedMemoryMB,
        rgbaBytes,
        operationMultiplier,
        estimatedPeakBytes,
        activeBudgetBytes
      };
    }

    if (estimatedPeakBytes > activeBudgetBytes) {
      return {
        decision: "LOCAL_WITH_WARNING",
        reason: `HIGH_MEMORY_USAGE: Image requires estimated peak memory ${decodedMemoryMB} MB, exceeding recommended budget tier. Processing may be slow.`,
        decodedMemoryMB,
        rgbaBytes,
        operationMultiplier,
        estimatedPeakBytes,
        activeBudgetBytes
      };
    }

    return {
      decision: "LOCAL_SAFE",
      decodedMemoryMB,
      rgbaBytes,
      operationMultiplier,
      estimatedPeakBytes,
      activeBudgetBytes
    };
  }
}
