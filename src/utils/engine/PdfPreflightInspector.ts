import { PDFDocument, PDFName, PDFRawStream, PDFDict } from "pdf-lib";

export interface PreflightReport {
  pageCount: number;
  imageCount: number;
  estimatedDecodedMemoryMB: number;
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

    // 3. Scan indirect objects for cryptographic signatures and estimate memory
    let imageCount = 0;
    let totalImageDecodedBytes = 0;
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    for (const [, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream || obj instanceof PDFDict) {
        const dict = obj instanceof PDFRawStream ? obj.dict : obj;
        const type = dict.get(PDFName.of("Type"));
        if (type === PDFName.of("Sig")) {
          throw new Error("UNSUPPORTED_SIGNED_DOCUMENT");
        }

        const subtype = dict.get(PDFName.of("Subtype"));
        if (subtype === PDFName.of("Image")) {
          imageCount++;
          const width = dict.get(PDFName.of("Width"));
          const height = dict.get(PDFName.of("Height"));
          let w = 1000;
          let h = 1000;
          
          // Using typescript checks since these are pdflib types
          if (width && typeof (width as any).asNumber === "function") {
            w = (width as any).asNumber();
          }
          if (height && typeof (height as any).asNumber === "function") {
            h = (height as any).asNumber();
          }
          totalImageDecodedBytes += w * h * 4;
        }
      }
    }

    const estimatedDecodedMemoryMB = parseFloat(
      ((arrayBuffer.byteLength + totalImageDecodedBytes) / (1024 * 1024)).toFixed(1)
    );

    return {
      pageCount: pdfDoc.getPageCount(),
      imageCount,
      estimatedDecodedMemoryMB
    };
  }
}
