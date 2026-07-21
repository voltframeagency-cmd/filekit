export interface QualityStep {
  scale: number;
  quality: number;
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
