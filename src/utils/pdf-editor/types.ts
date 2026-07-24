/**
 * Types for FileKit PDF Page Editor & Organization Engine Suite.
 */

export type PageRotation = 0 | 90 | 180 | 270;

export interface PageOperationItem {
  id: string; // Unique identifier for key tracking & drag-and-drop
  sourceDocIndex: number; // Index in input files array
  originalPageIndex: number; // 0-indexed page number in source document
  currentRotation: PageRotation;
  isSelected: boolean;
  isDeleted: boolean;
}

export type PdfEditorRouteTarget =
  | "/merge-pdf"
  | "/split-pdf"
  | "/reorder-pdf-pages"
  | "/delete-pdf-pages"
  | "/rotate-pdf-pages"
  | "/extract-pdf-pages";

export type PdfSplitMode = "all-pages" | "range" | "selection";

export interface PdfEditorConfig {
  targetRoute: PdfEditorRouteTarget;
  outputFilename?: string;
  splitMode?: PdfSplitMode;
  splitRange?: string; // e.g. "1-3, 5"
}

export type PdfEditorStage =
  | "inspecting"
  | "rendering-thumbnails"
  | "applying-changes"
  | "verifying-output"
  | "ready"
  | "failed";

export interface PdfEditorProgress {
  stage: PdfEditorStage;
  message: string;
  processedItems: number;
  totalItems: number;
  percentage: number;
}

export interface PdfEditorPreflightResult {
  isValid: boolean;
  error?: string;
  pageItems: PageOperationItem[];
  totalPages: number;
  documentsCount: number;
}

export interface PdfEditorVerificationResult {
  isValid: boolean;
  error?: string;
  magicBytesValid: boolean;
  expectedPageCount: number;
  actualPageCount: number;
  outputByteLength: number;
}

export interface PdfEditorOutputArtifact {
  fileName: string;
  fileData: Uint8Array;
  mimeType: string;
  pageCount: number;
  byteLength: number;
  verification: PdfEditorVerificationResult;
}
