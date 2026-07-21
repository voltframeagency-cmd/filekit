import { ImageVerificationResult, ImageProcessingOutcome, ImageStopReason, ImageCompressionProfile } from "./types";

export interface ImageCandidate {
  buffer: ArrayBuffer;
  size: number;
  width: number;
  height: number;
  mimeType: string;
  orientationCorrected: boolean;
  alphaPreserved: boolean;
  metadataRemoved: boolean;
  scale: number;
  quality: number;
}

export interface SelectImageResultParams {
  originalBuffer: ArrayBuffer;
  candidates: ImageCandidate[];
  targetSizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  inputMimeType: string;
  attemptsRun: number;
  exifOrientation: number;
}

export function selectImageCompressionResult(params: SelectImageResultParams): ImageVerificationResult {
  const {
    originalBuffer,
    candidates,
    targetSizeBytes,
    originalWidth,
    originalHeight,
    inputMimeType,
    attemptsRun,
    exifOrientation
  } = params;

  const originalSizeBytes = originalBuffer.byteLength;

  // 1. Original already within target size
  if (originalSizeBytes <= targetSizeBytes) {
    return {
      originalSizeBytes,
      outputSizeBytes: originalSizeBytes,
      outputBuffer: originalBuffer,
      targetSizeBytes,
      reductionPercentage: 0,
      inputMimeType,
      outputMimeType: inputMimeType,
      widthBefore: originalWidth,
      heightBefore: originalHeight,
      widthAfter: originalWidth,
      heightAfter: originalHeight,
      orientationCorrected: exifOrientation > 1,
      alphaPreserved: true,
      metadataRemoved: false,
      targetAchieved: true,
      attemptsRun: 0,
      selectedProfile: "LOSSLESS",
      stopReason: "NO_COMPRESSIBLE_DATA",
      outcome: "ALREADY_WITHIN_TARGET",
      processingDurationMs: 0,
      engineIdentifier: "image-local-engine",
      isReadable: true
    };
  }

  // Filter candidates strictly smaller than original
  const validCandidates = candidates.filter((c) => c.size < originalSizeBytes);

  // 2. Highest quality candidate below or equal to target
  const belowTarget = validCandidates.find((c) => c.size <= targetSizeBytes);
  if (belowTarget) {
    const pct = parseFloat((((originalSizeBytes - belowTarget.size) / originalSizeBytes) * 100).toFixed(1));
    return {
      originalSizeBytes,
      outputSizeBytes: belowTarget.size,
      outputBuffer: belowTarget.buffer,
      targetSizeBytes,
      reductionPercentage: pct,
      inputMimeType,
      outputMimeType: belowTarget.mimeType,
      widthBefore: originalWidth,
      heightBefore: originalHeight,
      widthAfter: belowTarget.width,
      heightAfter: belowTarget.height,
      orientationCorrected: belowTarget.orientationCorrected,
      alphaPreserved: belowTarget.alphaPreserved,
      metadataRemoved: belowTarget.metadataRemoved,
      targetAchieved: true,
      attemptsRun,
      selectedProfile: "BALANCED",
      stopReason: "TARGET_REACHED",
      outcome: "TARGET_ACHIEVED",
      processingDurationMs: 0,
      engineIdentifier: "image-local-engine",
      isReadable: true
    };
  }

  // 3. Smallest valid candidate strictly smaller than original (beneficial target miss)
  if (validCandidates.length > 0) {
    const smallest = validCandidates.reduce((prev, curr) => (prev.size < curr.size ? prev : curr));
    const pct = parseFloat((((originalSizeBytes - smallest.size) / originalSizeBytes) * 100).toFixed(1));
    return {
      originalSizeBytes,
      outputSizeBytes: smallest.size,
      outputBuffer: smallest.buffer,
      targetSizeBytes,
      reductionPercentage: pct,
      inputMimeType,
      outputMimeType: smallest.mimeType,
      widthBefore: originalWidth,
      heightBefore: originalHeight,
      widthAfter: smallest.width,
      heightAfter: smallest.height,
      orientationCorrected: smallest.orientationCorrected,
      alphaPreserved: smallest.alphaPreserved,
      metadataRemoved: smallest.metadataRemoved,
      targetAchieved: false,
      attemptsRun,
      selectedProfile: "BALANCED",
      stopReason: "MAX_ATTEMPTS",
      outcome: "TARGET_NOT_MET",
      processingDurationMs: 0,
      engineIdentifier: "image-local-engine",
      isReadable: true
    };
  }

  // 4. No valid candidate smaller than original: return immutable original buffer
  return {
    originalSizeBytes,
    outputSizeBytes: originalSizeBytes,
    outputBuffer: originalBuffer,
    targetSizeBytes,
    reductionPercentage: 0,
    inputMimeType,
    outputMimeType: inputMimeType,
    widthBefore: originalWidth,
    heightBefore: originalHeight,
    widthAfter: originalWidth,
    heightAfter: originalHeight,
    orientationCorrected: false,
    alphaPreserved: true,
    metadataRemoved: false,
    targetAchieved: false,
    attemptsRun,
    selectedProfile: "LOSSLESS",
    stopReason: "OUTPUT_GROWTH",
    outcome: "NO_BENEFICIAL_REDUCTION",
    processingDurationMs: 0,
    engineIdentifier: "image-local-engine",
    isReadable: true
  };
}
