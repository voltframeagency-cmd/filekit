import { PDFDocument, PDFName, PDFRawStream, PDFDict } from "pdf-lib";
import { PdfPreflightInspector } from "./PdfPreflightInspector";

export type CompressionStrategy =
  | "SAFE_LOCAL_COMPRESSION"
  | "UNSUPPORTED_IMAGE_ENCODING"
  | "NO_IMAGES_FOUND"
  | "UNSUPPORTED_SIGNED_DOCUMENT";

export class CompressionStrategySelector {
  /**
   * Scans a PDF document to select the optimal local compression strategy.
   * - SAFE_LOCAL_COMPRESSION: Document contains only locally compressible JPEG/Flate image formats.
   * - UNSUPPORTED_IMAGE_ENCODING: Contains unhandled image spaces (e.g. JBIG2, JPX, CMYK).
   * - NO_IMAGES_FOUND: Document has no image content. Only metadata stripping will run.
   * - UNSUPPORTED_SIGNED_DOCUMENT: Contains digital signature catalog entries.
   */
  static async select(arrayBuffer: ArrayBuffer): Promise<CompressionStrategy> {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const sigStatus = PdfPreflightInspector.detectSignatureStatus(pdfDoc);
    if (
      sigStatus === "STRUCTURALLY_SIGNED_DOCUMENT" ||
      sigStatus === "SIGNED_DOCUMENT_CONFIRMED"
    ) {
      return "UNSUPPORTED_SIGNED_DOCUMENT";
    }

    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    let imageCount = 0;
    let hasUnsupported = false;

    for (const [, obj] of indirectObjects) {
      const isDict = obj instanceof PDFDict;
      const isStream = obj instanceof PDFRawStream;

      if (isDict || isStream) {
        const dict = isStream ? obj.dict : obj;
        const subtype = dict.get(PDFName.of("Subtype"));

        if (subtype === PDFName.of("Image")) {
          imageCount++;
          const filter = dict.get(PDFName.of("Filter"));
          const colorSpace = dict.get(PDFName.of("ColorSpace"));

          // Locally supported filters: none (raw) or DCTDecode (JPEG)
          const isDCT = filter === PDFName.of("DCTDecode");
          const isSupportedFilter = !filter || isDCT;

          // Locally supported color spaces: none, DeviceRGB, DeviceGray
          const isRGB = colorSpace === PDFName.of("DeviceRGB");
          const isGray = colorSpace === PDFName.of("DeviceGray");
          const isSupportedColorSpace = !colorSpace || isRGB || isGray;

          if (!isSupportedFilter || !isSupportedColorSpace) {
            hasUnsupported = true;
          }
        }
      }
    }

    if (imageCount === 0) {
      return "NO_IMAGES_FOUND";
    }

    if (hasUnsupported) {
      return "UNSUPPORTED_IMAGE_ENCODING";
    }

    return "SAFE_LOCAL_COMPRESSION";
  }
}
