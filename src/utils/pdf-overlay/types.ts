/**
 * Types for FileKit PDF Overlay Engine & Watermark Suite.
 */

export type WatermarkType = "text" | "image";

export type WatermarkPositionPreset =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "tile"
  | "custom";

export type WatermarkTargetPages = "all" | "odd" | "even" | "custom";

export interface WatermarkConfig {
  type: WatermarkType;
  text?: string;
  fontColor?: string; // e.g. "#FF0000"
  fontSize?: number;
  imageBuffer?: Uint8Array;
  imageMimeType?: "image/png" | "image/jpeg";
  opacity: number; // 0.1 - 1.0
  rotationAngle: number; // degrees e.g. 0, 45, 90, -45
  positionPreset: WatermarkPositionPreset;
  customX?: number; // PDF points
  customY?: number; // PDF points
  targetPagesMode: WatermarkTargetPages;
  customPageRange?: string; // e.g. "1-3, 5"
}

export type PdfOverlayStage =
  | "inspecting"
  | "rendering-preview"
  | "applying-overlay"
  | "verifying-output"
  | "ready"
  | "failed";

export interface PdfOverlayProgress {
  stage: PdfOverlayStage;
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
  | "INVALID_MAGIC_BYTES"
  | "FILE_TOO_LARGE"
  | "IMAGE_WATERMARK_REQUIRED"
  | "INVALID_IMAGE_MAGIC_BYTES"
  | "EMPTY_TEXT_REQUIRED"
  | "UNSUPPORTED_TEXT_CHARACTERS";

export interface PdfOverlayPreflightResult {
  isValid: boolean;
  error?: string;
  errorCode?: PreflightErrorCode;
  totalPages: number;
  signatureDetected: boolean;
  signatureWarning?: string;
}

export type VerificationReloadStatus = "VERIFIED" | "FAILED" | "UNAVAILABLE";

export interface PdfOverlayVerificationResult {
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
}

export type ExecutionMode = "WEB_WORKER" | "MAIN_THREAD_FALLBACK";

export interface PdfOverlayOutputArtifact {
  fileName: string;
  fileData: Uint8Array;
  mimeType: string;
  pageCount: number;
  byteLength: number;
  verification: PdfOverlayVerificationResult;
  executionMode: ExecutionMode;
}

// Worker message protocol
export type WorkerRequestMessage =
  | { type: "START_OVERLAY"; payload: { sourceBuffer: ArrayBuffer; config: WatermarkConfig; fileName: string } }
  | { type: "CANCEL" };

export type WorkerResponseMessage =
  | { type: "PROGRESS"; payload: PdfOverlayProgress }
  | { type: "SUCCESS"; payload: { artifact: PdfOverlayOutputArtifact } }
  | { type: "ERROR"; payload: { error: string; code?: string } };
