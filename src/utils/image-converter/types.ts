export type SupportedImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/x-icon"
  | "image/heic"
  | "image/avif"
  | "image/bmp";

export type ImageConversionOutcome =
  | "CONVERSION_COMPLETED"
  | "UNSUPPORTED_INPUT_FORMAT"
  | "UNSUPPORTED_OUTPUT_FORMAT"
  | "SAME_FORMAT_SELECTED"
  | "UNSUPPORTED_ANIMATION"
  | "TRANSPARENCY_FLATTENED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "CANCELLED_BY_ABORT_SIGNAL"
  | "PROCESSING_FAILED"
  | "OUTPUT_VERIFICATION_FAILED";

export interface ImageConversionPreflightReport {
  width: number;
  height: number;
  mimeType: string;
  isAnimated: boolean;
  hasAlpha: boolean;
  isValid: boolean;
  error?: string;
}

export interface ImageConversionResult {
  originalSizeBytes: number;
  outputSizeBytes: number;
  outputBuffer: ArrayBuffer;
  inputMimeType: string;
  outputMimeType: string;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  sizeChangePercentage: number;
  isLarger: boolean;
  alphaPreserved: boolean;
  alphaFlattened: boolean;
  outcome: ImageConversionOutcome;
  processingDurationMs: number;
  warnings: string[];
}
