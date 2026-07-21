import { CompressionResult } from "./LocalPdfCompressionEngine";

export interface QualityStep {
  scale: number;
  quality: number;
}

export interface CompressionCandidate {
  buffer: ArrayBuffer;
  size: number;
  replacedCount: number;
  timingLoadMs?: number;
  timingCompressMs?: number;
  timingSaveMs?: number;
}

export function selectCompressionResult(params: {
  originalBuffer: ArrayBuffer;
  candidates: CompressionCandidate[];
  targetSizeBytes: number;
  attemptsRun: number;
  imagesDiscovered?: number;
  imagesSupported?: number;
}): CompressionResult {
  const { originalBuffer, candidates, targetSizeBytes, attemptsRun, imagesDiscovered = 0, imagesSupported = 0 } = params;
  const originalBytes = originalBuffer.byteLength;

  // Filter candidates strictly smaller than original
  const validCandidates = candidates.filter((c) => c.size < originalBytes);

  // 1. Highest-quality candidate below or equal to target
  const belowTarget = validCandidates.find((c) => c.size <= targetSizeBytes);
  if (belowTarget) {
    return {
      buffer: belowTarget.buffer,
      imagesDiscovered,
      imagesSupported,
      replacedCount: belowTarget.replacedCount,
      status: "SUCCESS",
      outcome: "TARGET_ACHIEVED",
      targetAchieved: true,
      attemptsRun,
      selectedProfile: "BALANCED",
      stopReason: "TARGET_REACHED",
      timingLoadMs: belowTarget.timingLoadMs,
      timingCompressMs: belowTarget.timingCompressMs,
      timingSaveMs: belowTarget.timingSaveMs,
    };
  }

  // 2. Smallest valid candidate strictly smaller than original (beneficial target miss)
  if (validCandidates.length > 0) {
    const smallest = validCandidates.reduce((prev, curr) => (prev.size < curr.size ? prev : curr));
    return {
      buffer: smallest.buffer,
      imagesDiscovered,
      imagesSupported,
      replacedCount: smallest.replacedCount,
      status: "TARGET_NOT_MET",
      outcome: "TARGET_NOT_MET",
      targetAchieved: false,
      attemptsRun,
      selectedProfile: "BALANCED",
      stopReason: "MAX_ATTEMPTS",
      timingLoadMs: smallest.timingLoadMs,
      timingCompressMs: smallest.timingCompressMs,
      timingSaveMs: smallest.timingSaveMs,
    };
  }

  // 3. Original already within target size (no candidates smaller than original needed/found)
  if (originalBytes <= targetSizeBytes) {
    return {
      buffer: originalBuffer,
      imagesDiscovered,
      imagesSupported,
      replacedCount: 0,
      status: "SUCCESS",
      outcome: "TARGET_ACHIEVED",
      targetAchieved: true,
      attemptsRun,
      selectedProfile: "LOSSLESS",
      stopReason: "NO_COMPRESSIBLE_IMAGES",
    };
  }

  // 4. Genuine growth case (original > targetSizeBytes, but no candidates smaller than original)
  return {
    buffer: originalBuffer,
    imagesDiscovered,
    imagesSupported,
    replacedCount: 0,
    status: "NO_BENEFICIAL_REDUCTION",
    outcome: "NO_BENEFICIAL_REDUCTION",
    targetAchieved: false,
    attemptsRun,
    selectedProfile: "LOSSLESS",
    stopReason: "OUTPUT_GROWTH",
  };
}

export class TargetSizeController {
  private static STEPS: QualityStep[] = [
    { scale: 0.8, quality: 0.75 }, // Step 0: Balanced
    { scale: 0.6, quality: 0.6 },  // Step 1: Medium
    { scale: 0.5, quality: 0.45 }, // Step 2: Strong
    { scale: 0.4, quality: 0.3 }   // Step 3: Minimal acceptable quality
  ];

  /**
   * Retrieves scale and quality parameter settings for a given iteration count.
   */
  static getStep(index: number): QualityStep {
    const stepIndex = Math.min(index, this.STEPS.length - 1);
    return this.STEPS[stepIndex];
  }

  /**
   * Decides if the iterative size loop should break.
   */
  static shouldStop(params: {
    iteration: number;
    maxIterations: number;
    outputSize: number;
    targetSize: number;
  }): boolean {
    // Stop if size target is successfully hit
    if (params.outputSize <= params.targetSize) {
      return true;
    }
    // Stop if maximum allowed iterations are reached
    if (params.iteration >= params.maxIterations - 1) {
      return true;
    }
    return false;
  }

  /**
   * Safeguards against file size growth.
   * If the compressed file size is greater than or equal to the original size,
   * returns the original unchanged document.
   */
  static getBestBuffer(original: Uint8Array, compressed: Uint8Array): Uint8Array {
    if (compressed.length >= original.length) {
      return original;
    }
    return compressed;
  }
}
