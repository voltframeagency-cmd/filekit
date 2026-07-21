export type ImageFormat = "jpeg" | "png" | "webp" | "gif" | "unknown";

export type ImageProcessingOutcome =
  | "TARGET_ACHIEVED"
  | "TARGET_NOT_MET"
  | "NO_BENEFICIAL_REDUCTION"
  | "ALREADY_WITHIN_TARGET"
  | "UNSUPPORTED_FORMAT"
  | "UNSUPPORTED_ANIMATION"
  | "MEMORY_LIMIT_EXCEEDED"
  | "PROCESSING_FAILED";

export type ImageStopReason =
  | "TARGET_REACHED"
  | "MAX_ATTEMPTS"
  | "QUALITY_FLOOR"
  | "NEGLIGIBLE_IMPROVEMENT"
  | "OUTPUT_GROWTH"
  | "NO_COMPRESSIBLE_DATA"
  | "PREFLIGHT_REJECTION";

export type ImageCompressionProfile = "HIGH_QUALITY" | "BALANCED" | "COMPACT" | "LOSSLESS";

export interface ImagePreflightReport {
  format: ImageFormat;
  mimeType: string;
  width: number;
  height: number;
  hasAlpha: boolean;
  isAnimated: boolean;
  exifOrientation: number; // 1..8
  rgbaBytes: number;
  operationMultiplier: number;
  estimatedPeakBytes: number;
  activeBudgetBytes: number;
  decodedMemoryBytes: number;
  headerValid: boolean;
}

export interface ImageVerificationResult {
  originalSizeBytes: number;
  outputSizeBytes: number;
  outputBuffer?: ArrayBuffer;
  targetSizeBytes: number;
  reductionPercentage: number;
  inputMimeType: string;
  outputMimeType: string;
  widthBefore: number;
  heightBefore: number;
  widthAfter: number;
  heightAfter: number;
  orientationCorrected: boolean;
  alphaPreserved: boolean;
  metadataRemoved: boolean;
  targetAchieved: boolean;
  attemptsRun: number;
  selectedProfile: ImageCompressionProfile;
  stopReason: ImageStopReason;
  outcome: ImageProcessingOutcome;
  processingDurationMs: number;
  engineIdentifier: string;
  isReadable: boolean;
  rgbaBytes?: number;
  estimatedPeakBytes?: number;
  activeBudgetBytes?: number;
  routeReason?: string;
}

export interface ImageProcessingProgressEvent {
  stage: "READING_FILE" | "PREFLIGHT_INSPECTION" | "RESIZING_DECODING" | "ENCODING_IMAGE" | "VERIFYING_OUTPUT";
  message: string;
  progressPercentage: number;
  timestamp: number;
}

export interface ImageProcessingJob {
  id: string;
  abortSignal: AbortSignal;
  onProgress: (event: ImageProcessingProgressEvent) => void;
  onSuccess: (result: ImageVerificationResult) => void;
  onError: (error: Error) => void;
}
