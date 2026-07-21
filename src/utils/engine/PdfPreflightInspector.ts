import { PDFDocument, PDFName, PDFRawStream, PDFDict } from "pdf-lib";

export type SignatureStatus =
  | "NONE"
  | "UNSIGNED_SIGNATURE_FIELD"
  | "STRUCTURALLY_SIGNED_DOCUMENT"
  | "SIGNED_DOCUMENT_CONFIRMED"
  | "SIGNATURE_STATUS_UNKNOWN";

export interface PreflightReport {
  pageCount: number;
  imageCount: number;
  estimatedDecodedMemoryMB: number;
  signatureStatus: SignatureStatus;
}

export class PdfPreflightInspector {
  /**
   * Evaluates the digital signature status of a loaded PDF document.
   * Distinguishes blank signature fields, synthetic structural signature streams, and confirmed cryptographic signatures.
   */
  static detectSignatureStatus(pdfDoc: PDFDocument): SignatureStatus {
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    let foundUnsignedField = false;

    for (const [, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream || obj instanceof PDFDict) {
        const dict = obj instanceof PDFRawStream ? obj.dict : obj;
        const type = dict.get(PDFName.of("Type"));
        const ft = dict.get(PDFName.of("FT"));

        if (type === PDFName.of("Sig") || ft === PDFName.of("Sig")) {
          const v = dict.get(PDFName.of("V"));
          if (!v) {
            foundUnsignedField = true;
            continue;
          }

          // Resolve indirect reference if needed
          const vObj = pdfDoc.context.lookup(v);
          if (vObj instanceof PDFDict || vObj instanceof PDFRawStream) {
            const vDict = vObj instanceof PDFRawStream ? vObj.dict : vObj;
            const byteRange = vDict.get(PDFName.of("ByteRange"));
            const contents = vDict.get(PDFName.of("Contents"));
            const subFilter = vDict.get(PDFName.of("SubFilter"));
            const filter = vDict.get(PDFName.of("Filter"));

            if (byteRange && contents) {
              // Check if signature contains genuine PKCS7/CMS filter or substantial signature payload
              const isConfirmedFilter =
                filter === PDFName.of("Adobe.PPKLite") ||
                subFilter === PDFName.of("adbe.pkcs7.detached") ||
                subFilter === PDFName.of("ETSI.CAdES.detached") ||
                subFilter === PDFName.of("adbe.pkcs7.sha1");

              const contentsStr = contents.toString();
              const isSubstantialPayload = contentsStr.length > 100;

              if (isConfirmedFilter || isSubstantialPayload) {
                return "SIGNED_DOCUMENT_CONFIRMED";
              }
              return "STRUCTURALLY_SIGNED_DOCUMENT";
            }
            return "SIGNATURE_STATUS_UNKNOWN";
          }
          foundUnsignedField = true;
        }
      }
    }

    return foundUnsignedField ? "UNSIGNED_SIGNATURE_FIELD" : "NONE";
  }

  /**
   * Performs preflight checks to validate a PDF file before compression.
   * Throws classified errors on failure:
   * - INVALID_PDF_STRUCTURE: If the header is missing or parsing fails.
   * - PDF_ENCRYPTED_OR_LOCKED: If the document is password-protected or encrypted.
   * - UNSUPPORTED_SIGNED_DOCUMENT: If the document contains a cryptographic or structural digital signature.
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

    // 3. Detect digital signature status
    const sigStatus = this.detectSignatureStatus(pdfDoc);
    if (
      sigStatus === "STRUCTURALLY_SIGNED_DOCUMENT" ||
      sigStatus === "SIGNED_DOCUMENT_CONFIRMED"
    ) {
      throw new Error("UNSUPPORTED_SIGNED_DOCUMENT");
    }

    // 4. Scan indirect objects for image objects and estimate memory
    let imageCount = 0;
    let totalImageDecodedBytes = 0;
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    for (const [, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream || obj instanceof PDFDict) {
        const dict = obj instanceof PDFRawStream ? obj.dict : obj;
        const subtype = dict.get(PDFName.of("Subtype"));
        if (subtype === PDFName.of("Image")) {
          imageCount++;
          const width = dict.get(PDFName.of("Width"));
          const height = dict.get(PDFName.of("Height"));
          let w = 1000;
          let h = 1000;
          
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
      estimatedDecodedMemoryMB,
      signatureStatus: sigStatus
    };
  }
}
