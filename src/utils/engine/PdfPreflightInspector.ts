import { PDFDocument, PDFName, PDFRawStream, PDFDict } from "pdf-lib";

export interface PreflightReport {
  pageCount: number;
}

export class PdfPreflightInspector {
  /**
   * Performs preflight checks to validate a PDF file before compression.
   * Throws classified errors on failure:
   * - INVALID_PDF_STRUCTURE: If the header is missing or parsing fails.
   * - PDF_ENCRYPTED_OR_LOCKED: If the document is password-protected or encrypted.
   * - UNSUPPORTED_SIGNED_DOCUMENT: If the document contains a cryptographic digital signature.
   */
  static async inspect(arrayBuffer: ArrayBuffer): Promise<PreflightReport> {
    // 1. Verify basic PDF header signature
    const headerBytes = new Uint8Array(arrayBuffer.slice(0, 5));
    const headerStr = new TextDecoder().decode(headerBytes);
    if (headerStr !== "%PDF-") {
      throw new Error("INVALID_PDF_STRUCTURE");
    }

    // 2. Load document to catch encryption or password locks
    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer);
    } catch (e: any) {
      if (
        e.message?.toLowerCase().includes("encrypt") ||
        e.message?.toLowerCase().includes("password")
      ) {
        throw new Error("PDF_ENCRYPTED_OR_LOCKED");
      }
      throw new Error("INVALID_PDF_STRUCTURE");
    }

    // 3. Scan indirect objects for cryptographic signatures
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    for (const [, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream || obj instanceof PDFDict) {
        const dict = obj instanceof PDFRawStream ? obj.dict : obj;
        const type = dict.get(PDFName.of("Type"));
        if (type === PDFName.of("Sig")) {
          throw new Error("UNSUPPORTED_SIGNED_DOCUMENT");
        }
      }
    }

    return {
      pageCount: pdfDoc.getPageCount(),
    };
  }
}
