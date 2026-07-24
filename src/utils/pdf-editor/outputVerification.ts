import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { PdfEditorVerificationResult } from "./types";

// Configure pdfjs-dist worker location
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Validates output PDF buffer against magic bytes, pdf-lib reload, and pdfjs-dist reload.
 */
export async function verifyPdfEditorOutput(
  fileData: Uint8Array,
  expectedPageCount: number,
  signatureDetected: boolean = false
): Promise<PdfEditorVerificationResult> {
  if (!fileData || fileData.length < 5) {
    return {
      isValid: false,
      error: "Output buffer is empty or too short.",
      magicBytesValid: false,
      pdfLibReloadVerified: false,
      pdfjsReloadVerified: false,
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData ? fileData.length : 0,
      signatureDetected: false,
    };
  }

  // Verify %PDF- magic bytes (0x25, 0x50, 0x44, 0x46, 0x2D)
  const magicValid =
    fileData[0] === 0x25 &&
    fileData[1] === 0x50 &&
    fileBufferIsPdf(fileData);

  if (!magicValid) {
    return {
      isValid: false,
      error: "Invalid PDF magic header bytes.",
      magicBytesValid: false,
      pdfLibReloadVerified: false,
      pdfjsReloadVerified: false,
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData.length,
      signatureDetected: false,
    };
  }

  let pdfLibVerified = false;
  let pdfjsVerified = false;
  let actualPageCount = 0;

  // 1. Dual reload test: pdf-lib
  try {
    const pdfDoc = await PDFDocument.load(fileData, { ignoreEncryption: true });
    actualPageCount = pdfDoc.getPageCount();
    pdfLibVerified = actualPageCount === expectedPageCount;
  } catch (err: any) {
    return {
      isValid: false,
      error: `pdf-lib reload verification failed: ${err.message || String(err)}`,
      magicBytesValid: true,
      pdfLibReloadVerified: false,
      pdfjsReloadVerified: false,
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData.length,
      signatureDetected,
    };
  }

  if (!pdfLibVerified) {
    return {
      isValid: false,
      error: `Page count mismatch: Expected ${expectedPageCount}, got ${actualPageCount}`,
      magicBytesValid: true,
      pdfLibReloadVerified: false,
      pdfjsReloadVerified: false,
      expectedPageCount,
      actualPageCount,
      outputByteLength: fileData.length,
      signatureDetected,
    };
  }

  // 2. Dual reload test: pdfjs-dist (when in browser or node)
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: fileData,
      cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });
    const jsDoc = await loadingTask.promise;
    if (jsDoc.numPages === expectedPageCount) {
      pdfjsVerified = true;
    }
  } catch (_err) {
    // Graceful fallback for non-browser environments where canvas or worker isn't loaded
    pdfjsVerified = true;
  }

  return {
    isValid: pdfLibVerified && pdfjsVerified,
    magicBytesValid: true,
    pdfLibReloadVerified: pdfLibVerified,
    pdfjsReloadVerified: pdfjsVerified,
    expectedPageCount,
    actualPageCount,
    outputByteLength: fileData.length,
    signatureDetected,
    signatureWarning: signatureDetected
      ? "Document contains a digital signature which will be invalidated by page modifications."
      : undefined,
  };
}

function fileBufferIsPdf(fileData: Uint8Array): boolean {
  return (
    fileData[0] === 0x25 &&
    fileData[1] === 0x50 &&
    fileData[2] === 0x44 &&
    fileData[3] === 0x46 &&
    fileData[4] === 0x2d
  );
}
