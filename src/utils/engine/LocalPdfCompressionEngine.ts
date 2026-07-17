import { PdfPreflightInspector } from "./PdfPreflightInspector";
import { CompressionStrategySelector } from "./CompressionStrategySelector";
import { TargetSizeController } from "./TargetSizeController";

export interface CompressionResult {
  buffer: ArrayBuffer;
  replacedCount: number;
  status: "SUCCESS" | "TARGET_NOT_MET" | "UNSUPPORTED_AND_ROUTED";
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
        status: "UNSUPPORTED_AND_ROUTED"
      };
    }

    // 3. Iteratively compress using TargetSizeController quality steps
    const originalUint8 = new Uint8Array(arrayBuffer);
    let bestUint8 = originalUint8;
    let replacedCount = 0;
    const maxIterations = 3;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      if (onProgress) {
        onProgress(Math.round((iteration / maxIterations) * 100));
      }

      const step = TargetSizeController.getStep(iteration);
      
      try {
        // Slice to get a fresh array buffer for transfer, keeping original untouched
        const sliceToTransfer = originalUint8.slice(0).buffer;
        const result = await this.runWorkerPass(sliceToTransfer, step.scale, step.quality);
        const compressedUint8 = new Uint8Array(result.buffer);
        replacedCount = result.replacedCount;

        // Guard growth using TargetSizeController (rejects if output is larger than original + 2%)
        bestUint8 = TargetSizeController.getBestBuffer(bestUint8, compressedUint8);

        // Break early if we hit the size target
        if (
          TargetSizeController.shouldStop({
            iteration,
            maxIterations,
            outputSize: bestUint8.length,
            targetSize
          })
        ) {
          break;
        }
      } catch (err) {
        console.warn(`Worker iteration ${iteration} failed:`, err);
        // Continue to next quality step or break if final
      }
    }

    if (onProgress) {
      onProgress(100);
    }

    const hitTarget = bestUint8.length <= targetSize;
    return {
      buffer: bestUint8.buffer,
      replacedCount,
      status: hitTarget ? "SUCCESS" : "TARGET_NOT_MET"
    };
  }

  /**
   * Spawns a background Web Worker to execute a single compression pass.
   */
  private static runWorkerPass(
    buffer: ArrayBuffer,
    scale: number,
    quality: number
  ): Promise<{ buffer: ArrayBuffer; replacedCount: number }> {
    return new Promise((resolve, reject) => {
      // Instantiate worker using Next.js Turbopack standard syntax
      const worker = new Worker(new URL("./pdf.worker.ts", import.meta.url));

      worker.onmessage = (e) => {
        const { status, buffer: outBuffer, replacedCount, errorMsg } = e.data;
        worker.terminate();

        if (status === "success") {
          resolve({ buffer: outBuffer, replacedCount });
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
