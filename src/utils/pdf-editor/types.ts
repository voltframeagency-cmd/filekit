/**
 * Types for FileKit PDF Page Editor & Organization Engine Suite.
 */

export type PageRotation = 0 | 90 | 180 | 270;

export interface PageOperationItem {
  id: string; // Unique identifier for key tracking & drag-and-drop
  sourceDocIndex: number; // Index in input files array
  sourceFileName?: string; // Original filename for merge sorting & visual badges
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

export type PdfSplitMode = "all-pages" | "every-page" | "every-n-pages" | "range";

export interface PdfEditorConfig {
  targetRoute: PdfEditorRouteTarget;
  outputFilename?: string;
  splitMode?: PdfSplitMode;
  splitEveryN?: number;
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

export type PreflightErrorCode =
  | "PASSWORD_REQUIRED"
  | "ENCRYPTED_UNSUPPORTED"
  | "PERMISSION_RESTRICTED"
  | "CORRUPTED_DOCUMENT"
  | "ZERO_PAGES"
  | "INVALID_MAGIC_BYTES";

export interface ExpectedPageDescriptor {
  pageIndex: number;
  expectedWidth?: number;
  expectedHeight?: number;
  expectedRotation?: PageRotation;
}

export interface PdfEditorPreflightResult {
  isValid: boolean;
  error?: string;
  errorCode?: PreflightErrorCode;
  pageItems: PageOperationItem[];
  totalPages: number;
  documentsCount: number;
  signatureDetected: boolean;
  signatureWarning?: string;
}

export type VerificationReloadStatus = "VERIFIED" | "FAILED" | "UNAVAILABLE";

export interface PdfEditorVerificationResult {
  isValid: boolean;
  error?: string;
  magicBytesValid: boolean;
  pdfLibReloadStatus: VerificationReloadStatus;
  pdfjsReloadStatus: VerificationReloadStatus;
  expectedPageCount: number;
  actualPageCount: number;
  outputByteLength: number;
  signatureDetected: boolean;
  signatureWarning?: string;
  descriptorsVerified?: boolean;
}

export interface PdfEditorOutputArtifact {
  fileName: string;
  fileData: Uint8Array;
  mimeType: string;
  pageCount: number;
  byteLength: number;
  verification: PdfEditorVerificationResult;
  splitArtifacts?: Array<{
    fileName: string;
    fileData: Uint8Array;
    pageCount: number;
    byteLength: number;
    verification: PdfEditorVerificationResult;
  }>;
}
