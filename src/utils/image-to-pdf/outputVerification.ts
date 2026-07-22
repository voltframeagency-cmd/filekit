import * as PDFLib from "pdf-lib";

export interface OutputVerificationResult {
  isValid: boolean;
  pageCount: number;
  mimeType: string;
  isPdfHeader: boolean;
  byteSize: number;
  error?: string;
}

export class ImageToPdfOutputVerification {
  static async verify(pdfBlob: Blob, expectedPageCount: number): Promise<OutputVerificationResult> {
    const buffer = await pdfBlob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. Magic Bytes Check (%PDF-)
    const isPdfHeader =
      bytes.length >= 5 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2d;

    if (!isPdfHeader || pdfBlob.size === 0) {
      return {
        isValid: false,
        pageCount: 0,
        mimeType: pdfBlob.type,
        isPdfHeader: false,
        byteSize: pdfBlob.size,
        error: "OUTPUT_VERIFICATION_FAILED: Generated file is not a valid PDF document."
      };
    }

    // 2. Parse PDF with pdf-lib to verify structural integrity and page count
    try {
      const pdfDoc = await PDFLib.PDFDocument.load(buffer);
      const pageCount = pdfDoc.getPageCount();

      if (pageCount !== expectedPageCount) {
        return {
          isValid: false,
          pageCount,
          mimeType: pdfBlob.type,
          isPdfHeader: true,
          byteSize: pdfBlob.size,
          error: `OUTPUT_VERIFICATION_FAILED: Generated page count (${pageCount}) does not match selected image count (${expectedPageCount}).`
        };
      }

      return {
        isValid: true,
        pageCount,
        mimeType: pdfBlob.type,
        isPdfHeader: true,
        byteSize: pdfBlob.size
      };
    } catch (err: any) {
      return {
        isValid: false,
        pageCount: 0,
        mimeType: pdfBlob.type,
        isPdfHeader: true,
        byteSize: pdfBlob.size,
        error: `OUTPUT_VERIFICATION_FAILED: ${err?.message || "Could not re-parse generated PDF."}`
      };
    }
  }
}
