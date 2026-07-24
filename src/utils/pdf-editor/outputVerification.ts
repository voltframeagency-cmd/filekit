import { PDFDocument } from "pdf-lib";
import { PdfEditorVerificationResult } from "./types";

/**
 * Validates output PDF buffer against magic bytes and expected page count.
 */
export async function verifyPdfEditorOutput(
  fileData: Uint8Array,
  expectedPageCount: number
): Promise<PdfEditorVerificationResult> {
  if (!fileData || fileData.length < 5) {
    return {
      isValid: false,
      error: "Output buffer is empty or too short.",
      magicBytesValid: false,
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData ? fileData.length : 0,
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
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData.length,
    };
  }

  try {
    const pdfDoc = await PDFDocument.load(fileData, { ignoreEncryption: true });
    const actualPageCount = pdfDoc.getPageCount();

    const isPageCountMatch = actualPageCount === expectedPageCount;
    if (!isPageCountMatch) {
      return {
        isValid: false,
        error: `Page count mismatch: Expected ${expectedPageCount}, got ${actualPageCount}`,
        magicBytesValid: true,
        expectedPageCount,
        actualPageCount,
        outputByteLength: fileData.length,
      };
    }

    return {
      isValid: true,
      magicBytesValid: true,
      expectedPageCount,
      actualPageCount,
      outputByteLength: fileData.length,
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `PDF document parsing error: ${err.message || String(err)}`,
      magicBytesValid: true,
      expectedPageCount,
      actualPageCount: 0,
      outputByteLength: fileData.length,
    };
  }
}
