import { PDFDocument } from "pdf-lib";
import { generateInitialPageItems } from "./pageOperations";
import { PageOperationItem, PdfEditorPreflightResult } from "./types";

/**
 * Preflight inspection for input PDF documents.
 */
export async function preflightPdfDocuments(
  inputFiles: Uint8Array[]
): Promise<PdfEditorPreflightResult> {
  if (!inputFiles || inputFiles.length === 0) {
    return {
      isValid: false,
      error: "No input PDF files provided.",
      pageItems: [],
      totalPages: 0,
      documentsCount: 0,
    };
  }

  const allPageItems: PageOperationItem[] = [];
  let totalPages = 0;

  for (let docIdx = 0; docIdx < inputFiles.length; docIdx++) {
    const fileBuffer = inputFiles[docIdx];
    if (!fileBuffer || fileBuffer.length < 5) {
      return {
        isValid: false,
        error: `Document #${docIdx + 1} is empty or invalid.`,
        pageItems: [],
        totalPages: 0,
        documentsCount: inputFiles.length,
      };
    }

    // Check %PDF- magic bytes
    const isMagicValid =
      fileBuffer[0] === 0x25 &&
      fileBuffer[1] === 0x50 &&
      fileBuffer[2] === 0x44 &&
      fileBuffer[3] === 0x46 &&
      fileBuffer[4] === 0x2d;

    if (!isMagicValid) {
      return {
        isValid: false,
        error: `Document #${docIdx + 1} is not a valid PDF file (missing %PDF- header).`,
        pageItems: [],
        totalPages: 0,
        documentsCount: inputFiles.length,
      };
    }

    try {
      const pdfDoc = await PDFDocument.load(fileBuffer, {
        ignoreEncryption: true,
      });
      const pageCount = pdfDoc.getPageCount();
      if (pageCount === 0) {
        return {
          isValid: false,
          error: `Document #${docIdx + 1} has 0 pages.`,
          pageItems: [],
          totalPages: 0,
          documentsCount: inputFiles.length,
        };
      }

      const docPageItems = generateInitialPageItems(docIdx, pageCount);
      allPageItems.push(...docPageItems);
      totalPages += pageCount;
    } catch (err: any) {
      return {
        isValid: false,
        error: `Failed to load document #${docIdx + 1}: ${err.message || String(err)}`,
        pageItems: [],
        totalPages: 0,
        documentsCount: inputFiles.length,
      };
    }
  }

  return {
    isValid: true,
    pageItems: allPageItems,
    totalPages,
    documentsCount: inputFiles.length,
  };
}
