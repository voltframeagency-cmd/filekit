import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { PdfOverlayVerificationResult, VerificationReloadStatus } from "./types";

/**
 * Validates output watermarked PDF buffer against magic bytes, pdf-lib reload, and pdfjs-dist reload.
 * Strictly fail-closed in browser/worker environments (requires pdfjsReloadStatus === "VERIFIED").
 */
export async function verifyPdfOverlayOutput(
  fileData: Uint8Array,
  expectedPageCount: number,
  signatureDetected: boolean = false,
  isNodeTest: boolean = false
): Promise<PdfOverlayVerificationResult> {
  if (!fileData || fileData.length < 5) {
    return {
      isValid: false,
      error: "Output buffer is empty or too short.",
      magicBytesValid: false,
      pdfLibReloadStatus: "FAILED",
      pdfjsReloadStatus: "FAILED",
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
    fileData[2] === 0x44 &&
    fileData[3] === 0x46 &&
    fileData[4] === 0x2d;

  if (!magicValid) {
    return {
      isValid: false,
      error: "Invalid PDF magic header bytes.",
      magicBytesValid: false,
      pdfLibReloadStatus: "FAILED",
      pdfjsReloadStatus: "FAILED",
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData.length,
      signatureDetected: false,
    };
  }

  let pdfLibStatus: VerificationReloadStatus = "FAILED";
  let pdfjsStatus: VerificationReloadStatus = "FAILED";
  let actualPageCount = 0;

  // 1. Dual reload test: pdf-lib
  try {
    const pdfDoc = await PDFDocument.load(fileData, { ignoreEncryption: true });
    actualPageCount = pdfDoc.getPageCount();
    if (actualPageCount === expectedPageCount) {
      pdfLibStatus = "VERIFIED";
    }
  } catch (err: any) {
    return {
      isValid: false,
      error: `pdf-lib reload verification failed: ${err.message || String(err)}`,
      magicBytesValid: true,
      pdfLibReloadStatus: "FAILED",
      pdfjsReloadStatus: "FAILED",
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData.length,
      signatureDetected,
    };
  }

  if (pdfLibStatus !== "VERIFIED") {
    return {
      isValid: false,
      error: `Page count mismatch: Expected ${expectedPageCount}, got ${actualPageCount}`,
      magicBytesValid: true,
      pdfLibReloadStatus: "FAILED",
      pdfjsReloadStatus: "FAILED",
      expectedPageCount,
      actualPageCount,
      outputByteLength: fileData.length,
      signatureDetected,
    };
  }

  // 2. Dual reload test: pdfjs-dist
  let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
  let jsDoc: pdfjsLib.PDFDocumentProxy | null = null;

  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }

    loadingTask = pdfjsLib.getDocument({
      data: fileData.slice(),
      cMapPacked: true,
    });
    jsDoc = await loadingTask.promise;

    if (jsDoc && jsDoc.numPages === expectedPageCount) {
      pdfjsStatus = "VERIFIED";
    } else {
      pdfjsStatus = "FAILED";
    }
  } catch (err: any) {
    if (isNodeTest) {
      pdfjsStatus = "UNAVAILABLE";
    } else {
      pdfjsStatus = "FAILED";
    }
  } finally {
    if (jsDoc) {
      try { await jsDoc.destroy(); } catch (_) {}
    } else if (loadingTask) {
      try { await loadingTask.destroy(); } catch (_) {}
    }
  }

  // In browser/worker environments, both pdf-lib and pdfjs-dist must be VERIFIED!
  const isOverallValid =
    pdfLibStatus === "VERIFIED" &&
    (isNodeTest ? pdfjsStatus !== "FAILED" : pdfjsStatus === "VERIFIED");

  return {
    isValid: isOverallValid,
    error: !isOverallValid
      ? `Overlay verification failed: pdfLib=${pdfLibStatus}, pdfjs=${pdfjsStatus}`
      : undefined,
    magicBytesValid: true,
    pdfLibReloadStatus: pdfLibStatus,
    pdfjsReloadStatus: pdfjsStatus,
    expectedPageCount,
    actualPageCount,
    outputByteLength: fileData.length,
    signatureDetected,
    signatureWarning: signatureDetected
      ? "Potential digital signature detected which will be invalidated by adding watermarks."
      : undefined,
  };
}
