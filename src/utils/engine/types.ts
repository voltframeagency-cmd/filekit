export type WorkspaceState =
  | "EMPTY"
  | "INSPECTING"
  | "LOCAL_SAFE"
  | "LOCAL_WITH_WARNING"
  | "SERVER_RECOMMENDED"
  | "SERVER_REQUIRED"
  | "AWAITING_SERVER_CONSENT"
  | "PROCESSING"
  | "VERIFYING"
  | "COMPLETED"
  | "PAYMENT_REQUIRED"
  | "FAILED"
  | "UNSUPPORTED";

export interface FileMetadata {
  name: string;
  size: string;
  sizeBytes: number;
  pages: number;
}

export type ProcessingStage = 
  | 'READING_FILE'
  | 'ANALYZING_PAGES'
  | 'COMPRESSING_IMAGES'
  | 'REBUILDING_PDF'
  | 'VERIFYING_OUTPUT';

export interface ProcessingProgressEvent {
  stage: ProcessingStage;
  message: string;
  timestamp: number;
}

export interface VerificationResult {
  originalSizeBytes: number;
  outputSizeBytes: number;
  reductionPercentage: number;
  pagesBefore: number;
  pagesAfter: number;
  targetRequested: string;
  targetAchieved: boolean;
  outputMimeType: string;
  isReadable: boolean;
  processingLocation: "local" | "server";
  engineIdentifier: string;
  completionTimestamp: number;
  warnings: string[];
  headerValid: boolean;
  parserReadable: boolean;
  eofStructureValid: boolean;
  mimeValid: boolean;
  fatalErrors: string[];
}

export type FailureCategory =
  | 'PASSWORD_PROTECTED'
  | 'CORRUPT_FILE'
  | 'UNSUPPORTED_PDF_FEATURE'
  | 'LOCAL_MEMORY_LIMIT'
  | 'WORKER_CRASH'
  | 'CANCELLED'
  | 'SERVER_UPLOAD_FAILED'
  | 'SERVER_PROCESSING_FAILED'
  | 'NETWORK_INTERRUPTED'
  | 'OUTPUT_VERIFICATION_FAILED'
  | 'UNKNOWN';

export interface ProcessingFailure {
  category: FailureCategory;
  message: string;
  recoverable: boolean;
  recommendedAction: string;
  diagnosticCode: string;
}

export interface ServerConsentRecord {
  consentGranted: boolean;
  timestamp: number;
  fileHash: string;
  transportSecurity: "TLS";
}

export interface ProcessingJob {
  id: string;
  abortSignal: AbortSignal;
  onProgress: (event: ProcessingProgressEvent) => void;
  onSuccess: (result: VerificationResult) => void;
  onError: (failure: ProcessingFailure) => void;
}

export interface CompressionEngine {
  id: string;
  compress(file: File, targetSize: string, job: ProcessingJob): Promise<void>;
}
