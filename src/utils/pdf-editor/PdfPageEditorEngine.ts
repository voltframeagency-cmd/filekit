import { degrees, PDFDocument } from "pdf-lib";
import { preflightPdfDocuments } from "./PdfPageEditorPreflight";
import { verifyPdfEditorOutput } from "./outputVerification";
import {
  PageOperationItem,
  PdfEditorConfig,
  PdfEditorOutputArtifact,
  PdfEditorProgress,
} from "./types";

export type ProgressCallback = (progress: PdfEditorProgress) => void;

/**
 * Core PDF Page Editor & Organization Execution Engine.
 * Executes merge, split, reorder, rotate, delete, and extract operations locally via pdf-lib.
 */
export async function executePdfPageEditor(
  inputBuffers: Uint8Array[],
  pageItems: PageOperationItem[],
  config: PdfEditorConfig,
  onProgress?: ProgressCallback
): Promise<PdfEditorOutputArtifact> {
  const reportProgress = (
    stage: PdfEditorProgress["stage"],
    message: string,
    processedItems: number,
    totalItems: number
  ) => {
    if (onProgress) {
      const percentage =
        totalItems > 0 ? Math.round((processedItems / totalItems) * 100) : 0;
      onProgress({ stage, message, processedItems, totalItems, percentage });
    }
  };

  // Stage 1: Inspecting documents
  reportProgress("inspecting", "Inspecting input documents...", 0, 100);
  const preflight = await preflightPdfDocuments(inputBuffers);
  if (!preflight.isValid) {
    throw new Error(`Preflight failed: ${preflight.error}`);
  }

  // Filter non-deleted pages
  const activePageItems = pageItems.filter((item) => !item.isDeleted);
  if (activePageItems.length === 0) {
    throw new Error("Cannot generate PDF: All pages have been deleted.");
  }

  // Stage 2: Applying changes
  reportProgress("applying-changes", "Applying page operations...", 20, 100);

  // Load all source PDF documents
  const loadedDocs: PDFDocument[] = [];
  for (let i = 0; i < inputBuffers.length; i++) {
    const doc = await PDFDocument.load(inputBuffers[i], {
      ignoreEncryption: true,
    });
    loadedDocs.push(doc);
  }

  // Create new destination PDF document
  const outDoc = await PDFDocument.create();

  const totalPagesToProcess = activePageItems.length;
  for (let i = 0; i < activePageItems.length; i++) {
    const item = activePageItems[i];
    const sourceDoc = loadedDocs[item.sourceDocIndex];
    if (!sourceDoc) {
      throw new Error(`Invalid source document index: ${item.sourceDocIndex}`);
    }

    const [copiedPage] = await outDoc.copyPages(sourceDoc, [
      item.originalPageIndex,
    ]);

    // Apply rotation angle if needed
    if (item.currentRotation !== 0) {
      const currentRot = copiedPage.getRotation().angle;
      const finalAngle = (currentRot + item.currentRotation) % 360;
      copiedPage.setRotation(degrees(finalAngle));
    }

    outDoc.addPage(copiedPage);

    const progressPct = 20 + Math.round(((i + 1) / totalPagesToProcess) * 60);
    reportProgress(
      "applying-changes",
      `Processing page ${i + 1} of ${totalPagesToProcess}...`,
      progressPct,
      100
    );
  }

  // Save generated document
  const outputBytes = await outDoc.save();

  // Stage 3: Verifying PDF output
  reportProgress("verifying-output", "Verifying generated PDF artifact...", 90, 100);
  const verification = await verifyPdfEditorOutput(
    outputBytes,
    activePageItems.length
  );

  if (!verification.isValid) {
    reportProgress("failed", `Verification failed: ${verification.error}`, 100, 100);
    throw new Error(`Output artifact verification failed: ${verification.error}`);
  }

  // Stage 4: Ready
  reportProgress("ready", "PDF organization complete.", 100, 100);

  const defaultName =
    config.outputFilename ||
    `filekit-edited-${Date.now().toString().slice(-6)}.pdf`;

  return {
    fileName: defaultName,
    fileData: outputBytes,
    mimeType: "application/pdf",
    pageCount: activePageItems.length,
    byteLength: outputBytes.length,
    verification,
  };
}
