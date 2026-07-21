import { CompressionEngine, ProcessingJob, ProcessingStage, VerificationResult, ProcessingFailure } from "./types";

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
      // Rule: Reject originalBytes <= 0
      if (file.size <= 0) {
        throw new Error("Validation Error: Cannot process empty files (0 bytes original size).");
      }

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
        const originalBytes = file.size;
        const visualOriginal = originalBytes < 1000 ? 4.8 * 1024 * 1024 : originalBytes;
        const visualOutput = Math.round(3.2 * 1024 * 1024);
        
        const delta = visualOutput - visualOriginal;
        const pct = parseFloat((Math.abs(delta / visualOriginal) * 100).toFixed(1));

        const result: VerificationResult = {
          originalSizeBytes: visualOriginal,
          outputSizeBytes: visualOutput,
          targetSizeBytes: 2 * 1024 * 1024,
          reductionPercentage: pct,
          pagesBefore: 24,
          pagesAfter: 24,
          targetAchieved: false,
          attemptsRun: 3,
          selectedProfile: "BALANCED",
          stopReason: "MAX_ATTEMPTS",
          outcome: "TARGET_NOT_MET",
          outputMimeType: "application/pdf",
          isReadable: true,
          processingLocation: "local",
          engineIdentifier: this.id,
          completionTimestamp: Date.now(),
          warnings: ["Image compression limits reached. Further reduction could degrade text legibility."],
          headerValid: true,
          parserReadable: true,
          eofStructureValid: true,
          mimeValid: true,
          fatalErrors: []
        };
        job.onSuccess(result);
        return;
      }

      // Mock output larger than input trigger (Growth Guard Enforced: Returns original buffer, 0% reduction, NO_BENEFICIAL_REDUCTION)
      if (fileNameLower.includes("larger") || fileNameLower === "larger.pdf") {
        const originalBytes = file.size;
        const visualOriginal = originalBytes < 1000 ? 1.2 * 1024 * 1024 : originalBytes;
        // Growth guard returns immutable original buffer, output = original size
        const visualOutput = visualOriginal;

        const result: VerificationResult = {
          originalSizeBytes: visualOriginal,
          outputSizeBytes: visualOutput,
          targetSizeBytes: 1 * 1024 * 1024,
          reductionPercentage: 0,
          pagesBefore: 24,
          pagesAfter: 24,
          targetAchieved: visualOriginal <= (1 * 1024 * 1024),
          attemptsRun: 3,
          selectedProfile: "LOSSLESS",
          stopReason: "OUTPUT_GROWTH",
          outcome: "NO_BENEFICIAL_REDUCTION",
          outputMimeType: "application/pdf",
          isReadable: true,
          processingLocation: "local",
          engineIdentifier: this.id,
          completionTimestamp: Date.now(),
          warnings: ["No beneficial reduction. Returned unchanged original file."],
          headerValid: true,
          parserReadable: true,
          eofStructureValid: true,
          mimeValid: true,
          fatalErrors: []
        };
        job.onSuccess(result);
        return;
      }

      // Normal mock success
      const originalBytes = file.size;
      const visualOriginal = originalBytes < 1000 ? 4.8 * 1024 * 1024 : originalBytes;
      const visualOutput = Math.round(visualOriginal * 0.38); // 62% reduction
      
      const delta = visualOutput - visualOriginal;
      const pct = parseFloat((Math.abs(delta / visualOriginal) * 100).toFixed(1));

      const result: VerificationResult = {
        originalSizeBytes: visualOriginal,
        outputSizeBytes: visualOutput,
        targetSizeBytes: 2 * 1024 * 1024,
        reductionPercentage: pct,
        pagesBefore: 24,
        pagesAfter: 24,
        targetAchieved: true,
        attemptsRun: 1,
        selectedProfile: "BALANCED",
        stopReason: "TARGET_REACHED",
        outcome: "TARGET_ACHIEVED",
        outputMimeType: "application/pdf",
        isReadable: true,
        processingLocation: "local",
        engineIdentifier: this.id,
        completionTimestamp: Date.now(),
        warnings: [],
        headerValid: true,
        parserReadable: true,
        eofStructureValid: true,
        mimeValid: true,
        fatalErrors: []
      };
      
      job.onSuccess(result);

    } catch (e: any) {
      if (job.abortSignal.aborted) return;
      job.onError({
        category: e.message && e.message.includes("Validation") ? "CORRUPT_FILE" : "UNKNOWN",
        message: e.message || "An unexpected error occurred during local processing.",
        recoverable: true,
        recommendedAction: "Try running the operation again or use server-assisted processing.",
        diagnosticCode: "ERR_PDF_MOCK_UNEXPECTED"
      });
    }
  }
}
