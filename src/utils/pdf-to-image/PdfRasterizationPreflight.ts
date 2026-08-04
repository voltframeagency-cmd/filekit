import * as PDFLib from "pdf-lib";
import { PdfPreflightInfo } from "./types";
import { getDeviceBudget, formatBytes } from "./limits";

export class PdfRasterizationPreflight {
  static async inspect(buffer: ArrayBuffer): Promise<PdfPreflightInfo> {
    const bytes = new Uint8Array(buffer);
    const budget = getDeviceBudget();

    // 1. Magic Bytes Check (%PDF-)
    if (bytes.length < 5 || bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46 || bytes[4] !== 0x2d) {
      return {
        pageCount: 0,
        isEncrypted: false,
        isSigned: false,
        isValid: false,
        routingStatus: "UNSUPPORTED",
        failureReason: "INVALID_PDF",
        error: "INVALID_PDF: Selected file is not a valid PDF document."
      };
    }

    // 2. Encoded Input Size Check
    if (bytes.length > budget.maxBytes) {
      return {
        pageCount: 0,
        isEncrypted: false,
        isSigned: false,
        isValid: false,
        routingStatus: "UNSUPPORTED",
        failureReason: "FILE_TOO_LARGE",
        error: `FILE_TOO_LARGE: Selected PDF (${formatBytes(bytes.length)}) exceeds maximum size limit of ${formatBytes(budget.maxBytes)} for your browser.`
      };
    }

    try {
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
            routingStatus: "UNSUPPORTED",
            failureReason: "ENCRYPTED_PDF",
            error: "ENCRYPTED_PDF: Password-protected or encrypted PDFs cannot be converted locally."
          };
        }
        pdfDoc = await PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
        isEncrypted = true;
      }

      if (isEncrypted || pdfDoc.isEncrypted || pdfDoc.catalog.has(PDFLib.PDFName.of("Encrypt"))) {
        return {
          pageCount: 0,
          isEncrypted: true,
          isSigned: false,
          isValid: false,
          routingStatus: "UNSUPPORTED",
          failureReason: "ENCRYPTED_PDF",
          error: "ENCRYPTED_PDF: Password-protected or encrypted PDFs cannot be converted locally."
        };
      }

      const pageCount = pdfDoc.getPageCount();

      // 3. Page Count Check
      if (pageCount > budget.maxPages) {
        return {
          pageCount,
          isEncrypted: false,
          isSigned: false,
          isValid: false,
          routingStatus: "UNSUPPORTED",
          failureReason: "PAGE_COUNT_EXCEEDED",
          error: `PAGE_COUNT_EXCEEDED: PDF contains ${pageCount} pages, which exceeds the limit of ${budget.maxPages} pages.`
        };
      }

      // 4. First-Page Dimensions & 5. Memory Estimation
      let estimatedActiveBytes = bytes.length;
      let firstPageWidth = 612; // default 8.5" * 72
      let firstPageHeight = 792; // default 11" * 72

      try {
        const pages = pdfDoc.getPages();
        if (pages.length > 0) {
          const { width, height } = pages[0].getSize();
          firstPageWidth = width || 612;
          firstPageHeight = height || 792;
        }
      } catch {
        // Fallback to standard page dimensions
      }

      // Width and Height in pixels assuming 150 DPI render multiplier (2.08x point size)
      const renderWidth = firstPageWidth * 2.08;
      const renderHeight = firstPageHeight * 2.08;
      const rgbaBytesPerPage = renderWidth * renderHeight * 4;
      
      // Estimated peak memory: Encoded file + (1 active page canvas * safety multiplier 2.5)
      estimatedActiveBytes = bytes.length + (rgbaBytesPerPage * 2.5);

      // Check Digital Signatures
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

      // Determine Routing Status
      let routingStatus: "LOCAL_SAFE" | "LOCAL_WITH_WARNING" = "LOCAL_SAFE";
      let warningMessage: string | undefined = undefined;

      // Heavy PDF warning threshold (e.g. > 150 pages or > 60 MB input)
      if (pageCount > 100 || bytes.length > (budget.maxBytes * 0.6)) {
        routingStatus = "LOCAL_WITH_WARNING";
        warningMessage = `Large PDF detected (${pageCount} pages, ${formatBytes(bytes.length)}). Conversion will render 1 page at a time to optimize memory.`;
      }

      return {
        pageCount,
        isEncrypted: false,
        isSigned,
        isValid: true,
        routingStatus,
        estimatedRasterMemoryBytes: estimatedActiveBytes,
        warningMessage
      };
    } catch (err: any) {
      const msg = err.message || "";
      return {
        pageCount: 0,
        isEncrypted: false,
        isSigned: false,
        isValid: false,
        routingStatus: "UNSUPPORTED",
        failureReason: "MALFORMED_PDF",
        error: `MALFORMED_PDF: ${msg || "Could not parse PDF document structure."}`
      };
    }
  }
}
