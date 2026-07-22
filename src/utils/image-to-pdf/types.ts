export type ImageToPdfPageSize = "FIT_IMAGE" | "A4" | "LETTER";
export type ImageToPdfOrientation = "AUTO" | "PORTRAIT" | "LANDSCAPE";
export type ImageToPdfMargin = "NONE" | "SMALL" | "MEDIUM";
export type ImageToPdfPlacement = "CONTAIN" | "COVER";

export interface ImageToPdfItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: 0 | 90 | 180 | 270;
  width: number;
  height: number;
  mimeType: "image/jpeg" | "image/png";
}

export interface ImageToPdfSettings {
  pageSize: ImageToPdfPageSize;
  orientation: ImageToPdfOrientation;
  margin: ImageToPdfMargin;
  placement: ImageToPdfPlacement;
  outputFilename?: string;
}

export interface ImageToPdfOptions {
  items: ImageToPdfItem[];
  settings: ImageToPdfSettings;
  signal?: AbortSignal;
  onProgress?: (completed: number, total: number) => void;
}

export interface ImageToPdfResult {
  pdfBlob: Blob;
  pdfUrl: string;
  pageCount: number;
  totalSourceSize: number;
  outputPdfSize: number;
  settings: ImageToPdfSettings;
  warnings?: string[];
}

export type ImageToPdfOutcome =
  | "PDF_CREATED"
  | "UNSUPPORTED_INPUT_FORMAT"
  | "MALFORMED_IMAGE"
  | "EMPTY_IMAGE_SELECTION"
  | "MEMORY_LIMIT_EXCEEDED"
  | "CANCELLED_BY_ABORT_SIGNAL"
  | "PROCESSING_FAILED"
  | "OUTPUT_VERIFICATION_FAILED";
