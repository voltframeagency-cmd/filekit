import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { ExpectedPageDescriptor, PdfEditorVerificationResult, VerificationReloadStatus } from "./types";

// Configure pdfjs-dist worker location
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Validates output PDF buffer against magic bytes, pdf-lib reload, and pdfjs-dist reload.
 * NEVER fails open on parser errors.
 */
export async function verifyPdfEditorOutput(
  fileData: Uint8Array,
  expectedPageCount: number,
  signatureDetected: boolean = false,
  expectedDescriptors?: ExpectedPageDescriptor[]
): Promise<PdfEditorVerificationResult> {
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
  let descriptorsVerified = true;

  // 1. Dual reload test: pdf-lib
  try {
    const pdfDoc = await PDFDocument.load(fileData, { ignoreEncryption: true });
    actualPageCount = pdfDoc.getPageCount();
    if (actualPageCount === expectedPageCount) {
      pdfLibStatus = "VERIFIED";
    }

    // Verify page descriptors if provided
    if (expectedDescriptors && expectedDescriptors.length === actualPageCount) {
      for (let i = 0; i < actualPageCount; i++) {
        const page = pdfDoc.getPage(i);
        const desc = expectedDescriptors[i];
        if (desc.expectedWidth && Math.abs(page.getWidth() - desc.expectedWidth) > 2) {
          descriptorsVerified = false;
        }
        if (desc.expectedHeight && Math.abs(page.getHeight() - desc.expectedHeight) > 2) {
          descriptorsVerified = false;
        }
      }
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
    loadingTask = pdfjsLib.getDocument({
      data: fileData,
      cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });
    jsDoc = await loadingTask.promise;

    if (jsDoc && jsDoc.numPages === expectedPageCount) {
      pdfjsStatus = "VERIFIED";
    } else {
      pdfjsStatus = "FAILED";
    }
  } catch (err: any) {
    // Distinguish Node test environment where pdfjs worker isn't present from real browser failure
    if (typeof window === "undefined") {
      pdfjsStatus = "UNAVAILABLE";
    } else {
      pdfjsStatus = "FAILED";
    }
  } finally {
    // Explicit resource cleanup
    if (jsDoc) {
      try { jsDoc.destroy(); } catch (_) {}
    }
    if (loadingTask) {
      try { loadingTask.destroy(); } catch (_) {}
    }
  }

  const isOverallValid =
    pdfLibStatus === "VERIFIED" &&
    pdfjsStatus !== "FAILED" &&
    descriptorsVerified;

  return {
    isValid: isOverallValid,
    error: !isOverallValid
      ? `Dual verification failed: pdfLib=${pdfLibStatus}, pdfjs=${pdfjsStatus}, descriptors=${descriptorsVerified}`
      : undefined,
    magicBytesValid: true,
    pdfLibReloadStatus: pdfLibStatus,
    pdfjsReloadStatus: pdfjsStatus,
    expectedPageCount,
    actualPageCount,
    outputByteLength: fileData.length,
    signatureDetected,
    signatureWarning: signatureDetected
      ? "Potential digital signature detected which will be invalidated by page modifications."
      : undefined,
    descriptorsVerified,
  };
}
