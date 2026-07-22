import * as PDFLib from "pdf-lib";
import { PdfPreflightInfo } from "./types";

export class PdfRasterizationPreflight {
  static async inspect(buffer: ArrayBuffer): Promise<PdfPreflightInfo> {
    const bytes = new Uint8Array(buffer);

    // 1. Magic Bytes Check (%PDF-)
    if (bytes.length < 5 || bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46 || bytes[4] !== 0x2d) {
      return {
        pageCount: 0,
        isEncrypted: false,
        isSigned: false,
        isValid: false,
        error: "MALFORMED_PDF: Selected file is not a valid PDF document."
      };
    }

    try {
      // First try loading without ignoreEncryption to catch encrypted PDFs directly
      let isEncrypted = false;
      let pdfDoc: PDFLib.PDFDocument;

      try {
        pdfDoc = await PDFLib.PDFDocument.load(buffer);
      } catch (err: any) {
        if (err?.message?.toLowerCase().includes("encrypt") || err?.message?.toLowerCase().includes("password")) {
          return {
            pageCount: 0,
            isEncrypted: true,
            isSigned: false,
            isValid: false,
            error: "ENCRYPTED_PDF: Password-protected or encrypted PDFs cannot be converted locally."
          };
        }
        // Fall back to loading with ignoreEncryption to inspect catalog
        pdfDoc = await PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
        isEncrypted = true;
      }

      if (isEncrypted || pdfDoc.isEncrypted || pdfDoc.catalog.has(PDFLib.PDFName.of("Encrypt"))) {
        return {
          pageCount: 0,
          isEncrypted: true,
          isSigned: false,
          isValid: false,
          error: "ENCRYPTED_PDF: Password-protected or encrypted PDFs cannot be converted locally."
        };
      }

      const pageCount = pdfDoc.getPageCount();

      // Check digital signatures (Sig fields in Catalog)
      let isSigned = false;
      try {
        const catalog = pdfDoc.catalog;
        const acroForm = catalog.get(PDFLib.PDFName.of("AcroForm"));
        if (acroForm) {
          const acroFormDict = pdfDoc.context.lookup(acroForm) as PDFLib.PDFDict;
          if (acroFormDict && acroFormDict.has(PDFLib.PDFName.of("SigFlags"))) {
            isSigned = true;
          }
        }
      } catch {
        isSigned = false;
      }

      return {
        pageCount,
        isEncrypted: false,
        isSigned,
        isValid: true
      };
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("encrypted") || msg.includes("password")) {
        return {
          pageCount: 0,
          isEncrypted: true,
          isSigned: false,
          isValid: false,
          error: "ENCRYPTED_PDF: Password-protected or encrypted PDFs cannot be converted locally."
        };
      }

      return {
        pageCount: 0,
        isEncrypted: false,
        isSigned: false,
        isValid: false,
        error: `MALFORMED_PDF: ${msg || "Could not parse PDF document structure."}`
      };
    }
  }
}
