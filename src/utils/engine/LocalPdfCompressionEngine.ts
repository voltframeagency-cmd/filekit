import { PDFDocument } from "pdf-lib";
import { PdfPreflightInspector } from "./PdfPreflightInspector";
import { CompressionStrategySelector } from "./CompressionStrategySelector";
import { TargetSizeController, selectCompressionResult } from "./TargetSizeController";
import { ProcessingOutcome, CompressionProfile, StopReason } from "./types";

export interface CompressionResult {
  buffer: ArrayBuffer;
  replacedCount: number;
  status: "SUCCESS" | "TARGET_NOT_MET" | "NO_BENEFICIAL_REDUCTION" | "UNSUPPORTED_AND_ROUTED";
  outcome: ProcessingOutcome;
  targetAchieved: boolean;
  attemptsRun: number;
  selectedProfile: CompressionProfile;
  stopReason: StopReason;
  timingLoadMs?: number;
  timingCompressMs?: number;
  timingSaveMs?: number;
}

export class LocalPdfCompressionEngine {
  /**
   * Main entrypoint for compressing a PDF document locally inside Web Workers.
   * Throws preflight validation errors if the file is corrupt, signed, or password-locked.
   */
  static async compress(
    arrayBuffer: ArrayBuffer,
    targetSize: number,
    onProgress?: (progress: number) => void
  ): Promise<CompressionResult> {
    // 1. Run Preflight check (checks header signature, encryption, signatures)
    await PdfPreflightInspector.inspect(arrayBuffer);

    // 2. Select compression strategy
    const strategy = await CompressionStrategySelector.select(arrayBuffer);

    if (strategy === "UNSUPPORTED_SIGNED_DOCUMENT") {
      throw new Error("UNSUPPORTED_SIGNED_DOCUMENT");
    }

    if (strategy === "UNSUPPORTED_IMAGE_ENCODING") {
      return {
        buffer: arrayBuffer,
        replacedCount: 0,
        status: "UNSUPPORTED_AND_ROUTED",
        outcome: "NO_BENEFICIAL_REDUCTION",
        targetAchieved: arrayBuffer.byteLength <= targetSize,
        attemptsRun: 0,
        selectedProfile: "LOSSLESS",
        stopReason: "NO_COMPRESSIBLE_IMAGES"
      };
    }

    // 3. Iteratively compress using TargetSizeController quality steps
    const originalUint8 = new Uint8Array(arrayBuffer);
    const originalBytes = originalUint8.length;
    const maxIterations = 3;
    let attemptsRun = 0;

    const candidates: Array<{
      buffer: ArrayBuffer;
      size: number;
      replacedCount: number;
      timingLoadMs?: number;
      timingCompressMs?: number;
      timingSaveMs?: number;
    }> = [];

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      attemptsRun++;
      if (onProgress) {
        onProgress(Math.round((iteration / maxIterations) * 100));
      }

      const step = TargetSizeController.getStep(iteration);
      
      try {
        // Slice to get a fresh array buffer for transfer, keeping original untouched
        const sliceToTransfer = originalUint8.slice(0).buffer;
        const result = await this.runWorkerPass(sliceToTransfer, step.scale, step.quality);
        
        // Verify PDF structure
        await PDFDocument.load(result.buffer);

        const outputSize = result.buffer.byteLength;

        // Strict growth guard during candidate collection: output must be strictly smaller than original
        if (outputSize < originalBytes) {
          candidates.push({
            buffer: result.buffer,
            size: outputSize,
            replacedCount: result.replacedCount,
            timingLoadMs: result.timingLoadMs,
            timingCompressMs: result.timingCompressMs,
            timingSaveMs: result.timingSaveMs
          });

          // Break early if we hit the size target
          if (outputSize <= targetSize) {
            break;
          }
        }
      } catch (err) {
        console.warn(`Worker iteration ${iteration} failed:`, err);
      }
    }

    if (onProgress) {
      onProgress(100);
    }

    // Delegate result selection to pure selector
    return selectCompressionResult({
      originalBuffer: arrayBuffer,
      candidates,
      targetSizeBytes: targetSize,
      attemptsRun
    });
  }

  /**
   * Spawns a background Web Worker to execute a single compression pass.
   */
  private static runWorkerPass(
    buffer: ArrayBuffer,
    scale: number,
    quality: number
  ): Promise<{
    buffer: ArrayBuffer;
    replacedCount: number;
    timingLoadMs?: number;
    timingCompressMs?: number;
    timingSaveMs?: number;
  }> {
    return new Promise((resolve, reject) => {
      // Instantiate worker using Next.js Turbopack standard syntax
      const worker = new Worker(new URL("./pdf.worker.ts", import.meta.url));

      worker.onmessage = (e) => {
        const {
          status,
          buffer: outBuffer,
          replacedCount,
          errorMsg,
          timingLoadMs,
          timingCompressMs,
          timingSaveMs
        } = e.data;
        worker.terminate();

        if (status === "success") {
          resolve({
            buffer: outBuffer,
            replacedCount,
            timingLoadMs,
            timingCompressMs,
            timingSaveMs
          });
        } else {
          reject(new Error(errorMsg || "Worker execution failed"));
        }
      };

      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      };

      worker.postMessage(
        {
          action: "compress",
          buffer,
          scale,
          quality
        },
        [buffer]
      );
    });
  }
}
