import { CompressionEngine, ProcessingJob, ProcessingStage, ProcessingProgressEvent, VerificationResult, ProcessingFailure } from "./types";

export class MockCompressionEngine implements CompressionEngine {
  id = "mock-wasm-retained-engine";

  async compress(file: File, targetSize: string, job: ProcessingJob): Promise<void> {
    const stages: { stage: ProcessingStage; message: string }[] = [
      { stage: "READING_FILE", message: "Loading file buffer into memory..." },
      { stage: "ANALYZING_PAGES", message: "Analyzing page elements and font outlines..." },
      { stage: "COMPRESSING_IMAGES", message: "Downsampling color images and compressing streams..." },
      { stage: "REBUILDING_PDF", message: "Optimizing structure and rebuilding PDF structure..." },
      { stage: "VERIFYING_OUTPUT", message: "Verifying output PDF structure and compliance..." }
    ];

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      for (const item of stages) {
        // 1. Check for cancellation before executing each phase
        if (job.abortSignal.aborted) {
          console.log("Mock Compression Engine: cancelled by abort signal.");
          return;
        }

        // 2. Emit progress event
        job.onProgress({
          stage: item.stage,
          message: item.message,
          timestamp: Date.now()
        });

        // 3. Wait for simulated processing step
        await sleep(500);
      }

      // Check abort one final time before producing result
      if (job.abortSignal.aborted) return;

      const fileNameLower = file.name.toLowerCase();

      // Mock failure trigger
      if (fileNameLower.includes("fail") || fileNameLower === "fail.pdf") {
        const failure: ProcessingFailure = {
          category: "CORRUPT_FILE",
          message: "The PDF file structure appears to be corrupted and cannot be rebuilt.",
          recoverable: false,
          recommendedAction: "Try re-exporting the original document and upload it again.",
          diagnosticCode: "ERR_PDF_MOCK_CORRUPT"
        };
        job.onError(failure);
        return;
      }

      // Mock target-not-met trigger
      if (fileNameLower.includes("not-met") || fileNameLower === "not-met.pdf") {
        const originalBytes = file.size > 0 ? file.size : 4.8 * 1024 * 1024;
        // Output size exceeds 2 MB target (e.g. 3.2 MB)
        const outputBytes = Math.round(3.2 * 1024 * 1024);
        
        const result: VerificationResult = {
          originalSizeBytes: originalBytes,
          outputSizeBytes: outputBytes,
          reductionPercentage: Math.round(((originalBytes - outputBytes) / originalBytes) * 100),
          pagesBefore: 24,
          pagesAfter: 24,
          targetRequested: targetSize,
          targetAchieved: false,
          outputMimeType: "application/pdf",
          isReadable: true,
          processingLocation: "local",
          engineIdentifier: this.id,
          completionTimestamp: Date.now(),
          warnings: ["Image compression limits reached. Further reduction could degrade text legibility."]
        };
        job.onSuccess(result);
        return;
      }

      // Normal mock success
      const originalBytes = file.size > 0 ? file.size : 4.8 * 1024 * 1024;
      const outputBytes = Math.round(originalBytes * 0.38); // 62% reduction
      
      const result: VerificationResult = {
        originalSizeBytes: originalBytes,
        outputSizeBytes: outputBytes,
        reductionPercentage: 62,
        pagesBefore: 24,
        pagesAfter: 24,
        targetRequested: targetSize,
        targetAchieved: true,
        outputMimeType: "application/pdf",
        isReadable: true,
        processingLocation: "local",
        engineIdentifier: this.id,
        completionTimestamp: Date.now(),
        warnings: []
      };
      
      job.onSuccess(result);

    } catch (e: any) {
      if (job.abortSignal.aborted) return;
      job.onError({
        category: "UNKNOWN",
        message: e.message || "An unexpected error occurred during local processing.",
        recoverable: true,
        recommendedAction: "Try running the operation again or use server-assisted processing.",
        diagnosticCode: "ERR_PDF_MOCK_UNEXPECTED"
      });
    }
  }
}
