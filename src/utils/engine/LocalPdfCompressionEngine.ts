import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import { PdfPreflightInspector } from "./PdfPreflightInspector";
import { CompressionStrategySelector } from "./CompressionStrategySelector";
import { TargetSizeController, selectCompressionResult } from "./TargetSizeController";
import { ProcessingOutcome, CompressionProfile, StopReason } from "./types";

export interface CompressionResult {
  buffer: ArrayBuffer;
  imagesDiscovered: number;
  imagesSupported: number;
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
   * Main entrypoint for compressing a PDF document locally inside Web Workers (or direct in Node/tests).
   * Throws preflight validation errors if the file is corrupt, signed, or password-locked.
   */
  static async compress(
    arrayBuffer: ArrayBuffer,
    targetSize: number,
    onProgress?: (progress: number) => void,
    abortSignal?: AbortSignal,
    isNodeTest: boolean = false
  ): Promise<CompressionResult> {
    // 1. Run Preflight check (checks header signature, encryption, signatures)
    const report = await PdfPreflightInspector.inspect(arrayBuffer);
    const imagesDiscovered = report.imageCount;

    // 2. Select compression strategy
    const strategy = await CompressionStrategySelector.select(arrayBuffer);

    if (strategy === "UNSUPPORTED_SIGNED_DOCUMENT") {
      throw new Error("UNSUPPORTED_SIGNED_DOCUMENT");
    }

    if (strategy === "UNSUPPORTED_IMAGE_ENCODING") {
      return {
        buffer: arrayBuffer,
        imagesDiscovered,
        imagesSupported: 0,
        replacedCount: 0,
        status: "UNSUPPORTED_AND_ROUTED",
        outcome: "NO_BENEFICIAL_REDUCTION",
        targetAchieved: arrayBuffer.byteLength <= targetSize,
        attemptsRun: 0,
        selectedProfile: "LOSSLESS",
        stopReason: "NO_COMPRESSIBLE_IMAGES"
      };
    }

    if (abortSignal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const originalUint8 = new Uint8Array(arrayBuffer);
    const originalBytes = originalUint8.length;

    // 3. Lossless strategy for documents without compressible image objects
    // Preserves cancellation and executes off-thread via Web Worker in browser environments
    if (strategy === "NO_IMAGES_FOUND") {
      if (abortSignal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      if (onProgress) onProgress(50);

      const sliceToTransfer = originalUint8.slice(0).buffer;
      let passResult: {
        buffer: ArrayBuffer;
        replacedCount: number;
        timingLoadMs?: number;
        timingCompressMs?: number;
        timingSaveMs?: number;
      };

      if (typeof Worker !== "undefined" && !isNodeTest) {
        passResult = await this.runWorkerPass(sliceToTransfer, 1.0, 1.0, abortSignal);
      } else {
        passResult = await this.runDirectPass(sliceToTransfer, 1.0, 1.0);
      }

      if (abortSignal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      if (onProgress) onProgress(100);

      const candidates: Array<{ buffer: ArrayBuffer; size: number; replacedCount: number }> = [];
      if (passResult.buffer.byteLength < originalBytes) {
        candidates.push({
          buffer: passResult.buffer,
          size: passResult.buffer.byteLength,
          replacedCount: passResult.replacedCount
        });
      }
      return selectCompressionResult({
        originalBuffer: arrayBuffer,
        candidates,
        targetSizeBytes: targetSize,
        attemptsRun: 1,
        imagesDiscovered: 0,
        imagesSupported: 0
      });
    }

    // 4. Iteratively compress using TargetSizeController quality steps
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
      if (abortSignal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      attemptsRun++;
      if (onProgress) {
        onProgress(Math.round((iteration / maxIterations) * 100));
      }

      const step = TargetSizeController.getStep(iteration);
      
      try {
        const sliceToTransfer = originalUint8.slice(0).buffer;
        let result: {
          buffer: ArrayBuffer;
          replacedCount: number;
          timingLoadMs?: number;
          timingCompressMs?: number;
          timingSaveMs?: number;
        };

        if (typeof Worker !== "undefined" && !isNodeTest) {
          result = await this.runWorkerPass(sliceToTransfer, step.scale, step.quality, abortSignal);
        } else {
          result = await this.runDirectPass(sliceToTransfer, step.scale, step.quality);
        }
        
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
      } catch (err: any) {
        if (err.name === "AbortError" || abortSignal?.aborted) {
          throw err;
        }
        console.warn(`Compression iteration ${iteration} failed:`, err);
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
      attemptsRun,
      imagesDiscovered,
      imagesSupported: imagesDiscovered
    });
  }

  /**
   * Executes a direct in-process compression pass (used in Node test environments).
   */
  static async runDirectPass(
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
    const t0 = performance.now();
    const doc = await PDFDocument.load(buffer);
    const t1 = performance.now();

    const objects = doc.context.enumerateIndirectObjects();
    let replacedCount = 0;

    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        const subtype = dict.get(PDFName.of("Subtype"));
        if (subtype === PDFName.of("Image")) {
          const filter = dict.get(PDFName.of("Filter"));
          const colorSpace = dict.get(PDFName.of("ColorSpace"));

          const isDCT = filter === PDFName.of("DCTDecode");
          const isRGB = colorSpace === PDFName.of("DeviceRGB");
          const isGray = colorSpace === PDFName.of("DeviceGray");

          if ((!filter || isDCT) && (!colorSpace || isRGB || isGray)) {
            if (typeof createImageBitmap !== "undefined" && typeof OffscreenCanvas !== "undefined") {
              try {
                const rawBytes = obj.contents;
                const blob = new Blob([rawBytes as any], { type: "image/jpeg" });
                const bitmap = await createImageBitmap(blob);
                const width = Math.round(bitmap.width * scale);
                const height = Math.round(bitmap.height * scale);
                const canvas = new OffscreenCanvas(width, height);
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(bitmap, 0, 0, width, height);
                  const compressedBlob = await canvas.convertToBlob({
                    type: "image/jpeg",
                    quality: quality
                  });
                  const compressedBytes = new Uint8Array(await compressedBlob.arrayBuffer());
                  const imgDict = doc.context.obj({
                    Type: PDFName.of("XObject"),
                    Subtype: PDFName.of("Image"),
                    Width: width,
                    Height: height,
                    BitsPerComponent: 8,
                    ColorSpace: colorSpace || PDFName.of("DeviceRGB"),
                    Filter: PDFName.of("DCTDecode")
                  });
                  const newStream = PDFRawStream.of(imgDict, compressedBytes);
                  doc.context.assign(ref, newStream);
                  replacedCount++;
                }
                bitmap.close();
              } catch {}
            }
          }
        }
      }
    }

    const t2 = performance.now();
    doc.catalog.delete(PDFName.of("Metadata"));
    const outputBytes = await doc.save({ useObjectStreams: true });
    const t3 = performance.now();

    return {
      buffer: outputBytes.buffer as ArrayBuffer,
      replacedCount,
      timingLoadMs: Math.round(t1 - t0),
      timingCompressMs: Math.round(t2 - t1),
      timingSaveMs: Math.round(t3 - t2)
    };
  }

  /**
   * Spawns a background Web Worker to execute a single compression pass.
   */
  private static runWorkerPass(
    buffer: ArrayBuffer,
    scale: number,
    quality: number,
    abortSignal?: AbortSignal
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

      let cleanedUp = false;
      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        if (abortSignal) {
          abortSignal.removeEventListener("abort", onAbort);
        }
        try {
          worker.terminate();
        } catch {}
      };

      const onAbort = () => {
        cleanup();
        reject(new DOMException("Aborted", "AbortError"));
      };

      if (abortSignal) {
        if (abortSignal.aborted) {
          onAbort();
          return;
        }
        abortSignal.addEventListener("abort", onAbort, { once: true });
      }

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
        cleanup();

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
        cleanup();
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
