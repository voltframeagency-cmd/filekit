import { PDFDocument } from "pdf-lib";
import { PdfOverlayPreflightResult } from "./types";

export const MAX_PDF_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Preflight inspection for input PDF document prior to overlay application.
 */
export async function preflightOverlayPdf(
  fileBuffer: Uint8Array,
  fileName: string = "document.pdf"
): Promise<PdfOverlayPreflightResult> {
  if (!fileBuffer || fileBuffer.length < 5) {
    return {
      isValid: false,
      error: `Document "${fileName}" is empty or invalid.`,
      errorCode: "CORRUPTED_DOCUMENT",
      totalPages: 0,
      signatureDetected: false,
    };
  }

  if (fileBuffer.length > MAX_PDF_FILE_BYTES) {
    return {
      isValid: false,
      error: `Document "${fileName}" exceeds maximum supported size of 100 MB.`,
      errorCode: "FILE_TOO_LARGE",
      totalPages: 0,
      signatureDetected: false,
    };
  }

  // Check %PDF- magic bytes (0x25, 0x50, 0x44, 0x46, 0x2D)
  const isMagicValid =
    fileBuffer[0] === 0x25 &&
    fileBuffer[1] === 0x50 &&
    fileBuffer[2] === 0x44 &&
    fileBuffer[3] === 0x46 &&
    fileBuffer[4] === 0x2d;

  if (!isMagicValid) {
    return {
      isValid: false,
      error: `Document "${fileName}" is not a valid PDF file (missing %PDF- header).`,
      errorCode: "INVALID_MAGIC_BYTES",
      totalPages: 0,
      signatureDetected: false,
    };
  }

  // Step A: Strict load test without ignoring encryption
  try {
    await PDFDocument.load(fileBuffer);
  } catch (strictErr: any) {
    const strictMsg = (strictErr?.message || String(strictErr)).toLowerCase();
    if (
      strictMsg.includes("encrypt") ||
      strictMsg.includes("password") ||
      strictMsg.includes("protected")
    ) {
      return {
        isValid: false,
        error: `Document "${fileName}" is password-protected or encrypted. Please remove the password before adding watermarks.`,
        errorCode: "PASSWORD_REQUIRED",
        totalPages: 0,
        signatureDetected: false,
      };
    }
  }

  // Step B: Load document for page count & signature inspection
  try {
    const pdfDoc = await PDFDocument.load(fileBuffer, {
      ignoreEncryption: true,
    });

    let signatureDetected = false;
    const rawCatalogStr = new TextDecoder().decode(fileBuffer.slice(0, 10000));
    if (rawCatalogStr.includes("/Sig") || rawCatalogStr.includes("/ByteRange")) {
      signatureDetected = true;
    }

    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      return {
        isValid: false,
        error: `Document "${fileName}" contains 0 pages.`,
        errorCode: "ZERO_PAGES",
        totalPages: 0,
        signatureDetected: false,
      };
    }

    return {
      isValid: true,
      totalPages: pageCount,
      signatureDetected,
      signatureWarning: signatureDetected
        ? "Potential digital signature detected which will be invalidated by adding watermarks."
        : undefined,
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `Failed to inspect "${fileName}": ${err.message || String(err)}`,
      errorCode: "CORRUPTED_DOCUMENT",
      totalPages: 0,
      signatureDetected: false,
    };
  }
}
