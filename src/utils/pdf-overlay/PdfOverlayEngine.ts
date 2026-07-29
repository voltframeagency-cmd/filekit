import { degrees, PDFDocument, StandardFonts } from "pdf-lib";
import {
  buildWatermarkPlacementPlan,
  convertVisualToRawDrawingAngle,
  transformVisualToPdfCoordinates,
} from "./coordinateTransform";
import { preflightOverlayPdf } from "./PdfOverlayPreflight";
import { verifyPdfOverlayOutput } from "./outputVerification";
import {
  ExecutionMode,
  PdfOverlayOutputArtifact,
  PdfOverlayProgress,
  WatermarkConfig,
} from "./types";
import {
  detectImageMimeType,
  getTargetPageIndices,
  hexToPdfRgb,
  isWinAnsiSupported,
} from "./watermarkOperations";

export type ProgressCallback = (progress: PdfOverlayProgress) => void;

/**
 * Core PDF Watermark & Overlay Execution Engine.
 * Stamps text or image watermarks onto PDF page streams locally via pdf-lib.
 */
export async function executePdfWatermark(
  sourceBuffer: Uint8Array,
  config: WatermarkConfig,
  fileName: string = "watermarked.pdf",
  onProgress?: ProgressCallback,
  isNodeTest: boolean = false,
  executionMode: ExecutionMode = "WEB_WORKER"
): Promise<PdfOverlayOutputArtifact> {
  const reportProgress = (
    stage: PdfOverlayProgress["stage"],
    message: string,
    processedItems: number,
    totalItems: number
  ) => {
    if (onProgress) {
      const percentage =
        totalItems > 0 ? Math.round((processedItems / totalItems) * 100) : 0;
      onProgress({ stage, message, processedItems, totalItems, percentage });
    }
  };

  // Validation 1: Configuration pre-checks
  if (config.type === "image") {
    if (!config.imageBuffer || config.imageBuffer.length === 0) {
      throw new Error("IMAGE_WATERMARK_REQUIRED: Please select a valid PNG or JPEG watermark image logo.");
    }
    const detectedMime = detectImageMimeType(config.imageBuffer);
    if (!detectedMime) {
      throw new Error("INVALID_IMAGE_MAGIC_BYTES: Image watermark file must be a valid PNG or JPEG image.");
    }
  } else if (config.type === "text") {
    if (!config.text || !config.text.trim()) {
      throw new Error("EMPTY_TEXT_REQUIRED: Please enter watermark text.");
    }
    if (!isWinAnsiSupported(config.text)) {
      throw new Error("UNSUPPORTED_TEXT_CHARACTERS: Watermark text contains characters not supported by standard PDF fonts.");
    }
  }

  // Stage 1: Inspecting PDF
  reportProgress("inspecting", "Inspecting PDF document...", 0, 100);
  const preflight = await preflightOverlayPdf(sourceBuffer, fileName);
  if (!preflight.isValid) {
    throw new Error(`Preflight failed: ${preflight.error}`);
  }

  // Load document
  const pdfDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  // Target page indices
  const targetPageIndices = getTargetPageIndices(
    config.targetPagesMode,
    totalPages,
    config.customPageRange
  );

  if (targetPageIndices.length === 0) {
    throw new Error("No target pages selected for watermark overlay.");
  }

  // Stage 2: Preparing watermark layer assets
  reportProgress("applying-overlay", "Embedding watermark assets...", 15, 100);

  let embeddedFont: any = null;
  let embeddedImage: any = null;

  if (config.type === "text") {
    embeddedFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  } else if (config.type === "image" && config.imageBuffer) {
    const detectedMime = detectImageMimeType(config.imageBuffer);
    if (detectedMime === "image/png") {
      embeddedImage = await pdfDoc.embedPng(config.imageBuffer);
    } else if (detectedMime === "image/jpeg") {
      embeddedImage = await pdfDoc.embedJpg(config.imageBuffer);
    }
  }

  // Stage 3: Stamp watermarks page by page
  for (let i = 0; i < targetPageIndices.length; i++) {
    const pageIdx = targetPageIndices[i];
    const page = pdfDoc.getPage(pageIdx);

    const { width: rawW, height: rawH } = page.getSize();
    const pageRotation = page.getRotation().angle || 0;
    const cropBox = page.getCropBox() || { x: 0, y: 0, width: rawW, height: rawH };

    const placementPlan = buildWatermarkPlacementPlan(config, rawW, rawH, pageRotation, cropBox);

    if (config.type === "text" && config.text && embeddedFont) {
      const textColor = hexToPdfRgb(config.fontColor || "#EF4444");
      const fontSize = config.fontSize || 36;
      const opacity = config.opacity || 0.4;

      for (const item of placementPlan) {
        const drawCoords = transformVisualToPdfCoordinates(
          item.visualX,
          item.visualY,
          item.width,
          item.height,
          rawW,
          rawH,
          rawW,
          rawH,
          pageRotation,
          cropBox
        );
        const rawAngle = convertVisualToRawDrawingAngle(item.rotationDegrees, pageRotation);

        page.drawText(config.text, {
          x: drawCoords.x,
          y: drawCoords.y,
          size: fontSize,
          font: embeddedFont,
          color: textColor,
          opacity,
          rotate: degrees(rawAngle),
        });
      }
    } else if (config.type === "image" && embeddedImage) {
      const imgWidth = embeddedImage.width * (config.fontSize ? config.fontSize / 36 : 1);
      const imgHeight = embeddedImage.height * (config.fontSize ? config.fontSize / 36 : 1);
      const opacity = config.opacity || 0.4;

      for (const item of placementPlan) {
        const drawCoords = transformVisualToPdfCoordinates(
          item.visualX,
          item.visualY,
          item.width,
          item.height,
          rawW,
          rawH,
          rawW,
          rawH,
          pageRotation,
          cropBox
        );
        const rawAngle = convertVisualToRawDrawingAngle(item.rotationDegrees, pageRotation);

        page.drawImage(embeddedImage, {
          x: drawCoords.x,
          y: drawCoords.y,
          width: imgWidth,
          height: imgHeight,
          opacity,
          rotate: degrees(rawAngle),
        });
      }
    }

    const pct = 20 + Math.round(((i + 1) / targetPageIndices.length) * 65);
    reportProgress(
      "applying-overlay",
      `Stamping page ${i + 1} of ${targetPageIndices.length}...`,
      pct,
      100
    );
  }

  // Save watermarked PDF
  const outputBytes = await pdfDoc.save();

  // Stage 4: Verifying PDF output
  reportProgress("verifying-output", "Verifying watermarked PDF artifact...", 90, 100);
  const verification = await verifyPdfOverlayOutput(
    outputBytes,
    totalPages,
    preflight.signatureDetected,
    isNodeTest
  );

  if (!verification.isValid) {
    reportProgress("failed", `Verification failed: ${verification.error}`, 100, 100);
    throw new Error(`Output watermark verification failed: ${verification.error}`);
  }

  // Stage 5: Ready
  reportProgress("ready", "Watermark applied successfully.", 100, 100);

  return {
    fileName,
    fileData: outputBytes,
    mimeType: "application/pdf",
    pageCount: totalPages,
    byteLength: outputBytes.length,
    verification,
    executionMode,
  };
}
