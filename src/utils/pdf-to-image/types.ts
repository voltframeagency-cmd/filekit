export type PdfToImageOutputFormat = "image/jpeg" | "image/png";
export type ResolutionPreset = "STANDARD" | "HIGH";

export type PdfRasterizationOutcome =
  | "CONVERSION_COMPLETED"
  | "PARTIAL_CONVERSION_FAILED"
  | "INVALID_PAGE_SELECTION"
  | "ENCRYPTED_PDF"
  | "MALFORMED_PDF"
  | "UNSUPPORTED_PDF"
  | "MEMORY_LIMIT_EXCEEDED"
  | "CANCELLED_BY_ABORT_SIGNAL"
  | "PROCESSING_FAILED"
  | "OUTPUT_VERIFICATION_FAILED"
  | "ZIP_CREATION_FAILED";

export interface PdfPreflightInfo {
  pageCount: number;
  isEncrypted: boolean;
  isSigned: boolean;
  isValid: boolean;
  error?: string;
}

export interface RenderedPageResult {
  pageNumber: number;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: PdfToImageOutputFormat;
  buffer: ArrayBuffer;
  dataUrl: string;
  filename: string;
}

export interface PdfRasterizationResult {
  totalPages: number;
  selectedPageNumbers: number[];
  renderedPages: RenderedPageResult[];
  totalSizeBytes: number;
  outputFormat: PdfToImageOutputFormat;
  resolutionPreset: ResolutionPreset;
  zipBuffer?: ArrayBuffer;
  zipFilename?: string;
  outcome: PdfRasterizationOutcome;
  processingDurationMs: number;
  warnings: string[];
}
