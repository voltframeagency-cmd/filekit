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

export type RoutingStatus = "LOCAL_SAFE" | "LOCAL_WITH_WARNING" | "UNSUPPORTED";

export type PreflightFailureReason =
  | "FILE_TOO_LARGE"
  | "PAGE_COUNT_EXCEEDED"
  | "ESTIMATED_MEMORY_EXCEEDED"
  | "INVALID_PDF"
  | "ENCRYPTED_PDF"
  | "MALFORMED_PDF"
  | "UNSUPPORTED_BROWSER";

export interface PdfPreflightInfo {
  pageCount: number;
  isEncrypted: boolean;
  isSigned: boolean;
  isValid: boolean;
  routingStatus: RoutingStatus;
  failureReason?: PreflightFailureReason;
  estimatedRasterMemoryBytes?: number;
  warningMessage?: string;
  error?: string;
}

export interface RenderedPageResult {
  pageNumber: number;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: PdfToImageOutputFormat;
  buffer: ArrayBuffer;
  blob: Blob;
  previewUrl: string;
  filename: string;
}

export interface PdfRasterizationResult {
  totalPages: number;
  selectedPageNumbers: number[];
  renderedPages: RenderedPageResult[];
  failedPageNumbers?: number[];
  totalSizeBytes: number;
  outputFormat: PdfToImageOutputFormat;
  resolutionPreset: ResolutionPreset;
  zipBlob?: Blob;
  zipUrl?: string;
  zipFilename?: string;
  outcome: PdfRasterizationOutcome;
  processingDurationMs: number;
  warnings: string[];
}
