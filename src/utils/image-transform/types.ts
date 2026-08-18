export type ImageTransformMode =
  | "svg-to-png"
  | "svg-to-jpg"
  | "crop"
  | "resize"
  | "rotate"
  | "flip"
  | "ico-to-png"
  | "grayscale"
  | "invert"
  | "blur";

export type RotationAngle = 90 | 180 | 270;
export type FlipDirection = "horizontal" | "vertical";

export type AspectRatioPreset =
  | "freeform"
  | "1:1"
  | "16:9"
  | "4:3"
  | "3:2"
  | "9:16"
  | "2:1";

export interface CropCoordinates {
  x: number; // in pixel coordinates on the source image
  y: number;
  width: number;
  height: number;
}

export interface ResizeDimensions {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  scalePercentage?: number;
}

export interface SvgRenderOptions {
  scaleMultiplier: number; // e.g. 1x, 2x, 3x, 4x
  customWidth?: number;
  customHeight?: number;
  preserveTransparency: boolean;
  backgroundColor?: string; // Optional background color if transparent is disabled
}

export interface ImageExportOptions {
  format: "image/png" | "image/jpeg" | "image/webp";
  quality?: number; // 0.1 to 1.0 (for JPEG/WebP)
  backgroundColor?: string; // default "#FFFFFF" if converting transparent to JPEG
}

export interface ImageTransformResult {
  outputBuffer: ArrayBuffer;
  outputMimeType: string;
  outputWidth: number;
  outputHeight: number;
  outputSizeBytes: number;
  durationMs: number;
  fileName: string;
}
