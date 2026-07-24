import { degrees, PDFDocument, StandardFonts } from "pdf-lib";
import {
  buildWatermarkPlacementPlan,
  transformVisualToPdfCoordinates,
} from "./coordinateTransform";
import { preflightOverlayPdf } from "./PdfOverlayPreflight";
import { verifyPdfOverlayOutput } from "./outputVerification";
import {
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
  isNodeTest: boolean = false
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

  const textColor = hexToPdfRgb(config.fontColor || "#3B82F6");
  const fontSize = Math.max(8, config.fontSize || 36);
  const opacity = Math.max(0.05, Math.min(1.0, config.opacity));

  // Stage 3: Stamping watermark onto target pages using unified placement plan
  for (let i = 0; i < targetPageIndices.length; i++) {
    const pageIndex = targetPageIndices[i];
    const page = pdfDoc.getPage(pageIndex);
    const { width: rawW, height: rawH } = page.getSize();
    const cropBox = page.getCropBox();
    const pageRotation = page.getRotation().angle;

    // Respect page rotation geometry and CropBox placement boundary
    const isRotated90or270 = pageRotation === 90 || pageRotation === 270;
    const pageW = isRotated90or270 ? cropBox.height : cropBox.width;
    const pageH = isRotated90or270 ? cropBox.width : cropBox.height;

    if (config.type === "text") {
      const text = config.text || "WATERMARK";
      const textWidth = embeddedFont.widthOfTextAtSize(text, fontSize);
      const textHeight = embeddedFont.heightAtSize(fontSize);
      const markBounds = { width: textWidth, height: textHeight };

      const placementPlan = buildWatermarkPlacementPlan(
        config,
        { width: pageW, height: pageH },
        markBounds,
        36
      );

      for (const item of placementPlan) {
        const drawCoords = transformVisualToPdfCoordinates(
          item.x,
          item.y,
          textWidth,
          textHeight,
          pageW,
          pageH,
          rawW,
          rawH,
          pageRotation,
          cropBox
        );

        page.drawText(text, {
          x: drawCoords.x,
          y: drawCoords.y,
          size: fontSize,
          font: embeddedFont,
          color: textColor,
          opacity,
          rotate: degrees(item.rotationDegrees),
        });
      }
    } else if (config.type === "image" && embeddedImage) {
      const imgWidth = Math.min(pageW * 0.8, embeddedImage.width * 0.5);
      const scaleFactor = imgWidth / embeddedImage.width;
      const imgHeight = embeddedImage.height * scaleFactor;
      const markBounds = { width: imgWidth, height: imgHeight };

      const placementPlan = buildWatermarkPlacementPlan(
        config,
        { width: pageW, height: pageH },
        markBounds,
        36
      );

      for (const item of placementPlan) {
        const drawCoords = transformVisualToPdfCoordinates(
          item.x,
          item.y,
          imgWidth,
          imgHeight,
          pageW,
          pageH,
          rawW,
          rawH,
          pageRotation,
          cropBox
        );

        page.drawImage(embeddedImage, {
          x: drawCoords.x,
          y: drawCoords.y,
          width: imgWidth,
          height: imgHeight,
          opacity,
          rotate: degrees(item.rotationDegrees),
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
  };
}
