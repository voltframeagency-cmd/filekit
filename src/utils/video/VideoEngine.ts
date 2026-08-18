/**
 * VideoEngine.ts
 * 
 * Video analysis, target-bitrate mathematics, frame sampling,
 * and client/server hybrid routing for FileKit Video Tools.
 */

export interface VideoMetadata {
  durationSeconds: number;
  width: number;
  height: number;
  aspectRatio: number;
  fileSizeBytes: number;
  estimatedBitrateKbps: number;
}

export interface TargetBitrateResult {
  totalBitrateKbps: number;
  videoBitrateKbps: number;
  audioBitrateKbps: number;
  estimatedOutputBytes: number;
  targetMaxBytes: number;
}

export interface VideoFrameSample {
  timestampSeconds: number;
  dataUrl: string;
}

export class VideoEngine {
  /**
   * Calculates the exact video and audio bitrates required to compress a video
   * to fit strictly within a target maximum file size (in MB or Bytes).
   * 
   * Formula:
   * Total Bitrate (bps) = (Target Size in Bytes * 8) / Duration (seconds)
   * Video Bitrate = Total Bitrate - Audio Bitrate (default 128 kbps or 64 kbps for small files)
   */
  static calculateTargetBitrate(
    durationSeconds: number,
    targetSizeBytes: number,
    audioBitrateKbps = 128
  ): TargetBitrateResult {
    if (durationSeconds <= 0) {
      throw new Error("Duration must be greater than 0 seconds");
    }
    if (targetSizeBytes <= 0) {
      throw new Error("Target size must be greater than 0 bytes");
    }

    // Convert target bytes to total allowable kilobits: (bytes * 8) / 1000
    const totalKilobits = (targetSizeBytes * 8) / 1000;
    const rawTotalBitrate = totalKilobits / durationSeconds;
    const totalBitrateKbps = Math.max(1, Math.floor(rawTotalBitrate));

    // Proportional bitrate allocation ensuring strict mathematical non-overflow
    let allocatedAudioBitrate: number;
    let videoBitrateKbps: number;

    if (totalBitrateKbps < 100) {
      allocatedAudioBitrate = Math.max(1, Math.floor(totalBitrateKbps * 0.2));
      videoBitrateKbps = Math.max(1, totalBitrateKbps - allocatedAudioBitrate);
    } else if (totalBitrateKbps < 500) {
      allocatedAudioBitrate = 64;
      videoBitrateKbps = totalBitrateKbps - allocatedAudioBitrate;
    } else {
      allocatedAudioBitrate = audioBitrateKbps;
      videoBitrateKbps = totalBitrateKbps - allocatedAudioBitrate;
    }

    // Strict non-overflow reduction
    while ((videoBitrateKbps + allocatedAudioBitrate) * durationSeconds * 125 > targetSizeBytes && videoBitrateKbps > 1) {
      videoBitrateKbps--;
    }

    const estimatedOutputBytes = Math.floor(
      ((videoBitrateKbps + allocatedAudioBitrate) * 1000 * durationSeconds) / 8
    );

    return {
      totalBitrateKbps,
      videoBitrateKbps,
      audioBitrateKbps: allocatedAudioBitrate,
      estimatedOutputBytes,
      targetMaxBytes: targetSizeBytes
    };
  }

  /**
   * Generates calculated frame timestamps for extracting animated GIF frames.
   */
  static calculateGifFrameTimestamps(
    startTime: number,
    endTime: number,
    targetFps = 10,
    maxFrames = 100
  ): number[] {
    const duration = Math.max(0.1, endTime - startTime);
    const frameInterval = 1 / targetFps;
    const totalFrames = Math.min(maxFrames, Math.floor(duration * targetFps));
    const timestamps: number[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const t = startTime + (i * frameInterval);
      if (t <= endTime) {
        timestamps.push(parseFloat(t.toFixed(3)));
      }
    }

    return timestamps;
  }

  /**
   * Determines whether a video job can safely run client-side or should route
   * to our high-efficiency ephemeral Cloud Run container.
   */
  static routeProcessingTier(
    fileSizeBytes: number,
    durationSeconds: number,
    mode: "compress" | "convert" | "gif" | "trim" | "mute"
  ): "local_browser" | "cloud_container" {
    const MAX_LOCAL_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
    const MAX_LOCAL_GIF_DURATION = 30; // 30 seconds max for browser GIF

    // Fast zero-reencode trims and mutes under 100MB run locally
    if (mode === "trim" || mode === "mute") {
      return fileSizeBytes <= MAX_LOCAL_FILE_SIZE ? "local_browser" : "cloud_container";
    }

    if (mode === "gif") {
      return durationSeconds <= MAX_LOCAL_GIF_DURATION && fileSizeBytes <= MAX_LOCAL_FILE_SIZE
        ? "local_browser"
        : "cloud_container";
    }

    // Heavy compression or cross-format conversion
    if (fileSizeBytes > MAX_LOCAL_FILE_SIZE || durationSeconds > 300) {
      return "cloud_container";
    }

    return "local_browser";
  }

  /**
   * Creates a mock/container response object for local/server conversion jobs.
   */
  static createConversionJobPayload(
    fileName: string,
    fileSizeBytes: number,
    mode: string,
    targetFormat: string
  ) {
    return {
      jobId: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      sourceFileName: fileName,
      sourceSizeBytes: fileSizeBytes,
      targetFormat,
      mode,
      status: "COMPLETED",
      createdAt: new Date().toISOString()
    };
  }
}
