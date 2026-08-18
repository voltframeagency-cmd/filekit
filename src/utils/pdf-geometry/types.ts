/**
 * Types for FileKit PDF Geometry Suite:
 * - Dynamic Page Numbering
 * - CropBox / MediaBox Modification
 */

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left";

export type PageNumberFontFamily = "Helvetica" | "Times" | "Courier";

export interface PageNumberConfig {
  position: PageNumberPosition;
  formatTemplate: string; // e.g. "Page {n} of {total}", "{n}", "{n} / {total}"
  startNumber: number;
  fontSize: number;
  fontColor: string; // Hex color e.g. "#333333"
  fontFamily: PageNumberFontFamily;
  margin: number; // in PDF points (default: 36pt = 0.5in)
  targetPages: "all" | "odd" | "even" | "custom";
  customRange?: string; // e.g. "1-5, 8"
}

export interface PdfCropConfig {
  topMargin: number; // in PDF points
  bottomMargin: number; // in PDF points
  leftMargin: number; // in PDF points
  rightMargin: number; // in PDF points
  applyTo: "all" | "selected";
  selectedPages?: number[]; // 1-based page numbers
}

export interface PdfGeometryOutputArtifact {
  fileName: string;
  outputBuffer: ArrayBuffer;
  originalSizeBytes: number;
  outputSizeBytes: number;
  pageCount: number;
  processingDurationMs: number;
}
