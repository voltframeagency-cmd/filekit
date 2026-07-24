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
  | "INVALID_MAGIC_BYTES";

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

export interface PdfOverlayOutputArtifact {
  fileName: string;
  fileData: Uint8Array;
  mimeType: string;
  pageCount: number;
  byteLength: number;
  verification: PdfOverlayVerificationResult;
}
