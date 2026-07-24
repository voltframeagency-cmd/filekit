import { PDFDocument } from "pdf-lib";
import { generateInitialPageItems } from "./pageOperations";
import { PageOperationItem, PdfEditorPreflightResult } from "./types";

export interface InputPdfDoc {
  name: string;
  buffer: Uint8Array;
}

/**
 * Preflight inspection for input PDF documents.
 */
export async function preflightPdfDocuments(
  inputDocs: Array<InputPdfDoc | Uint8Array>
): Promise<PdfEditorPreflightResult> {
  if (!inputDocs || inputDocs.length === 0) {
    return {
      isValid: false,
      error: "No input PDF files provided.",
      pageItems: [],
      totalPages: 0,
      documentsCount: 0,
      signatureDetected: false,
    };
  }

  const allPageItems: PageOperationItem[] = [];
  let totalPages = 0;
  let signatureDetected = false;

  for (let docIdx = 0; docIdx < inputDocs.length; docIdx++) {
    const item = inputDocs[docIdx];
    const fileBuffer = item instanceof Uint8Array ? item : item.buffer;
    const fileName = item instanceof Uint8Array ? `Document-${docIdx + 1}.pdf` : item.name;

    if (!fileBuffer || fileBuffer.length < 5) {
      return {
        isValid: false,
        error: `Document "${fileName}" is empty or invalid.`,
        errorCode: "CORRUPTED_DOCUMENT",
        pageItems: [],
        totalPages: 0,
        documentsCount: inputDocs.length,
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
        pageItems: [],
        totalPages: 0,
        documentsCount: inputDocs.length,
        signatureDetected: false,
      };
    }

    // Step A: Strict load test without ignoring encryption to catch password protection
    try {
      await PDFDocument.load(fileBuffer);
    } catch (strictErr: any) {
      const strictMsg = strictErr?.message || String(strictErr);
      if (
        strictMsg.toLowerCase().includes("encrypt") ||
        strictMsg.toLowerCase().includes("password") ||
        strictMsg.toLowerCase().includes("protected")
      ) {
        return {
          isValid: false,
          error: `Document "${fileName}" is password-protected or encrypted. Please remove the password before organizing pages.`,
          errorCode: "PASSWORD_REQUIRED",
          pageItems: [],
          totalPages: 0,
          documentsCount: inputDocs.length,
          signatureDetected: false,
        };
      }
    }

    // Step B: Load document for inspection
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer, {
        ignoreEncryption: true,
      });

      // Scan for digital signature dictionary /Sig or /ByteRange in catalog
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
          pageItems: [],
          totalPages: 0,
          documentsCount: inputDocs.length,
          signatureDetected: false,
        };
      }

      const docPageItems = generateInitialPageItems(docIdx, pageCount, fileName);
      allPageItems.push(...docPageItems);
      totalPages += pageCount;
    } catch (err: any) {
      const msg = err?.message || String(err);
      return {
        isValid: false,
        error: `Failed to inspect "${fileName}": ${msg}`,
        errorCode: "CORRUPTED_DOCUMENT",
        pageItems: [],
        totalPages: 0,
        documentsCount: inputDocs.length,
        signatureDetected: false,
      };
    }
  }

  return {
    isValid: true,
    pageItems: allPageItems,
    totalPages,
    documentsCount: inputDocs.length,
    signatureDetected,
    signatureWarning: signatureDetected
      ? "Potential digital signature detected which will be invalidated by page modifications."
      : undefined,
  };
}
