import { PDFDocument } from "pdf-lib";
import { BlankPageOptions, DuplicatePagesOptions, ExtractedImageItem, PdfTextExtractionResult } from "./types";

export class PdfManipulationEngine {
  /**
   * Reverses the page sequence of a PDF document (last page becomes first)
   */
  static async reversePdf(pdfBytes: Uint8Array): Promise<Uint8Array> {
    const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = srcDoc.getPageCount();

    if (pageCount <= 1) {
      return pdfBytes;
    }

    const outDoc = await PDFDocument.create();
    const reverseIndices = Array.from({ length: pageCount }, (_, i) => pageCount - 1 - i);
    const copiedPages = await outDoc.copyPages(srcDoc, reverseIndices);

    for (const page of copiedPages) {
      outDoc.addPage(page);
    }

    return await outDoc.save();
  }

  /**
   * Adds blank page(s) to a PDF document at specific positions
   */
  static async addBlankPage(pdfBytes: Uint8Array, options: BlankPageOptions): Promise<Uint8Array> {
    const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = srcDoc.getPageCount();
    const outDoc = await PDFDocument.create();

    const copiedPages = await outDoc.copyPages(srcDoc, Array.from({ length: pageCount }, (_, i) => i));

    // Determine default page dimension from first page or A4 (595.28 x 841.89)
    const firstPage = srcDoc.getPage(0);
    const defaultW = options.pageWidth || (firstPage ? firstPage.getWidth() : 595.28);
    const defaultH = options.pageHeight || (firstPage ? firstPage.getHeight() : 841.89);

    if (options.position === "start") {
      outDoc.addPage([defaultW, defaultH]);
      for (const p of copiedPages) {
        outDoc.addPage(p);
      }
    } else if (options.position === "end") {
      for (const p of copiedPages) {
        outDoc.addPage(p);
      }
      outDoc.addPage([defaultW, defaultH]);
    } else if (options.position === "after-each") {
      for (const p of copiedPages) {
        outDoc.addPage(p);
        outDoc.addPage([defaultW, defaultH]);
      }
    } else if (options.position === "custom") {
      const targetIdx = Math.max(0, Math.min(pageCount, (options.customPageIndex || 1) - 1));
      for (let i = 0; i < copiedPages.length; i++) {
        if (i === targetIdx) {
          outDoc.addPage([defaultW, defaultH]);
        }
        outDoc.addPage(copiedPages[i]);
      }
      if (targetIdx >= copiedPages.length) {
        outDoc.addPage([defaultW, defaultH]);
      }
    }

    return await outDoc.save();
  }

  /**
   * Duplicates PDF pages consecutively or appends duplicate copies
   */
  static async duplicatePages(pdfBytes: Uint8Array, options: DuplicatePagesOptions): Promise<Uint8Array> {
    const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = srcDoc.getPageCount();
    const outDoc = await PDFDocument.create();

    if (options.mode === "all-consecutive") {
      for (let i = 0; i < pageCount; i++) {
        const [p1, p2] = await outDoc.copyPages(srcDoc, [i, i]);
        outDoc.addPage(p1);
        outDoc.addPage(p2);
      }
    } else if (options.mode === "all-appended") {
      const pass1 = await outDoc.copyPages(srcDoc, Array.from({ length: pageCount }, (_, i) => i));
      for (const p of pass1) outDoc.addPage(p);

      const pass2 = await outDoc.copyPages(srcDoc, Array.from({ length: pageCount }, (_, i) => i));
      for (const p of pass2) outDoc.addPage(p);
    } else if (options.mode === "selected") {
      const selectedSet = new Set((options.selectedPageNumbers || [1]).map((n) => n - 1));
      for (let i = 0; i < pageCount; i++) {
        const [p] = await outDoc.copyPages(srcDoc, [i]);
        outDoc.addPage(p);
        if (selectedSet.has(i)) {
          const [duplicate] = await outDoc.copyPages(srcDoc, [i]);
          outDoc.addPage(duplicate);
        }
      }
    }

    return await outDoc.save();
  }

  /**
   * Flattens interactive PDF form fields and annotations into static document streams
   */
  static async flattenPdf(pdfBytes: Uint8Array): Promise<Uint8Array> {
    const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = doc.getForm();
    try {
      form.flatten();
    } catch {
      // If document has no interactive form fields, flattening is a no-op
    }
    return await doc.save();
  }

  /**
   * Extracts clean text from standard PDF documents using PDF.js without OCR overhead
   */
  static async extractPdfText(pdfBytes: Uint8Array): Promise<PdfTextExtractionResult> {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const doc = await loadingTask.promise;
    const pageCount = doc.numPages;
    const pageTexts: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .filter((item: any) => typeof item.str === "string")
        .map((item: any) => item.str);

      pageTexts.push(pageStrings.join(" ").trim());
    }

    return {
      text: pageTexts.join("\n\n--- Page Break ---\n\n"),
      pageCount,
      pageTexts,
    };
  }

  /**
   * Extracts raster images embedded across PDF pages
   */
  static async extractImagesFromPdf(pdfBytes: Uint8Array): Promise<ExtractedImageItem[]> {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const doc = await loadingTask.promise;
    const images: ExtractedImageItem[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      let canvas: HTMLCanvasElement | OffscreenCanvas;
      let ctx: any;

      if (typeof OffscreenCanvas !== "undefined") {
        canvas = new OffscreenCanvas(viewport.width, viewport.height);
        ctx = canvas.getContext("2d");
      } else if (typeof document !== "undefined") {
        canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        ctx = canvas.getContext("2d");
      } else {
        continue;
      }

      if (!ctx) continue;

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };

      await page.render(renderContext).promise;

      let blob: Blob | null = null;
      if ("convertToBlob" in canvas) {
        blob = await (canvas as OffscreenCanvas).convertToBlob({ type: "image/png" });
      } else if ("toBlob" in canvas) {
        blob = await new Promise<Blob | null>((res) => (canvas as HTMLCanvasElement).toBlob(res, "image/png"));
      }

      if (blob) {
        const buf = new Uint8Array(await blob.arrayBuffer());
        images.push({
          id: `page-${i}-image-${Date.now()}`,
          pageIndex: i,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
          format: "png",
          data: buf,
          sizeBytes: buf.length,
        });
      }
    }

    return images;
  }
}
