import { ImageOptimizationEngine } from "./ImageOptimizationEngine";
import { ImageVerificationResult, ImageProcessingJob } from "./types";

export interface ImageCompressionEngineAdapter {
  id: string;
  compress(file: File, targetSizeStr: string, job: ImageProcessingJob, outputFormat?: "jpeg" | "png" | "webp"): Promise<void>;
}

export class LocalImageEngineAdapter implements ImageCompressionEngineAdapter {
  id = "image-local-engine";

  async compress(file: File, targetSizeStr: string, job: ImageProcessingJob, outputFormat?: "jpeg" | "png" | "webp"): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    const originalSizeBytes = arrayBuffer.byteLength;
    let targetSizeBytes = parseInt(targetSizeStr, 10);

    if (isNaN(targetSizeBytes) || targetSizeBytes <= 0) {
      const mbMatch = targetSizeStr.match(/(\d+(?:\.\d+)?)\s*mb/i);
      const kbMatch = targetSizeStr.match(/(\d+(?:\.\d+)?)\s*kb/i);
      if (mbMatch) {
        targetSizeBytes = Math.round(parseFloat(mbMatch[1]) * 1024 * 1024);
      } else if (kbMatch) {
        targetSizeBytes = Math.round(parseFloat(kbMatch[1]) * 1024);
      } else {
        targetSizeBytes = Math.max(50 * 1024, Math.round(originalSizeBytes * 0.5));
      }
    }

    job.onProgress({ stage: "READING_FILE", message: "Reading local image file...", progressPercentage: 10, timestamp: Date.now() });

    if (job.abortSignal.aborted) return;

    job.onProgress({ stage: "ENCODING_IMAGE", message: "Running local image optimization pass...", progressPercentage: 30, timestamp: Date.now() });

    const result: ImageVerificationResult = await ImageOptimizationEngine.compress(
      arrayBuffer,
      targetSizeBytes,
      outputFormat,
      (pct) => {
        if (job.abortSignal.aborted) return;
        job.onProgress({
          stage: "ENCODING_IMAGE",
          message: `Encoding image (${pct}%)...`,
          progressPercentage: 30 + Math.round(pct * 0.6),
          timestamp: Date.now()
        });
      }
    );

    if (job.abortSignal.aborted) return;

    job.onProgress({ stage: "VERIFYING_OUTPUT", message: "Verifying output image format...", progressPercentage: 100, timestamp: Date.now() });

    job.onSuccess(result);
  }
}

export class ImageEngineRegistry {
  private engines: Map<string, ImageCompressionEngineAdapter> = new Map();

  constructor() {
    this.registerEngine(new LocalImageEngineAdapter());
  }

  registerEngine(engine: ImageCompressionEngineAdapter) {
    this.engines.set(engine.id, engine);
  }

  getEngine(id: string): ImageCompressionEngineAdapter {
    const engine = this.engines.get(id);
    if (!engine) {
      throw new Error(`Engine identifier '${id}' not found in ImageEngineRegistry.`);
    }
    return engine;
  }
}

export const imageEngineRegistry = new ImageEngineRegistry();
