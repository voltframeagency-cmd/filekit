import { ImageFormat, ImagePreflightReport } from "./types";
import { ImageCapabilityRouter } from "./ImageCapabilityRouter";

export class ImagePreflightInspector {
  static async inspect(input: ArrayBuffer | Uint8Array): Promise<ImagePreflightReport> {
    const bytes = ArrayBuffer.isView(input)
      ? new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
      : new Uint8Array(input);
    if (bytes.length < 12) {
      throw new Error("UNSUPPORTED_FORMAT: File buffer is too small to contain valid image headers.");
    }

    const format = this.detectFormat(bytes);

    if (format === "unknown") {
      throw new Error("UNSUPPORTED_FORMAT: Unrecognized image magic bytes.");
    }

    let width = 0;
    let height = 0;
    let hasAlpha = false;
    let isAnimated = false;
    let exifOrientation = 1;
    let mimeType = `image/${format}`;

    if (format === "jpeg") {
      const parsed = this.parseJpeg(bytes);
      width = parsed.width;
      height = parsed.height;
      exifOrientation = parsed.orientation;
    } else if (format === "png") {
      const parsed = this.parsePng(bytes);
      width = parsed.width;
      height = parsed.height;
      hasAlpha = parsed.hasAlpha;
    } else if (format === "webp") {
      const parsed = this.parseWebp(bytes);
      width = parsed.width;
      height = parsed.height;
      hasAlpha = parsed.hasAlpha;
      isAnimated = parsed.isAnimated;
    } else if (format === "gif") {
      const parsed = this.parseGif(bytes);
      width = parsed.width;
      height = parsed.height;
      hasAlpha = true;
      isAnimated = parsed.isAnimated;
    }

    if (width <= 0 || height <= 0) {
      throw new Error("CORRUPT_HEADER: Failed to parse image dimensions from header.");
    }

    const { rgbaBytes, operationMultiplier, estimatedPeakBytes } = ImageCapabilityRouter.calculatePeakMemory({
      width,
      height,
      inputSizeBytes: bytes.byteLength,
      operation: "ITERATIVE_TARGET"
    });

    return {
      format,
      mimeType,
      width,
      height,
      hasAlpha,
      isAnimated,
      exifOrientation,
      rgbaBytes,
      operationMultiplier,
      estimatedPeakBytes,
      activeBudgetBytes: ImageCapabilityRouter.HIGH_BUDGET_BYTES,
      decodedMemoryBytes: rgbaBytes,
      headerValid: true
    };
  }

  private static detectFormat(bytes: Uint8Array): ImageFormat {
    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return "jpeg";
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return "png";
    }

    // WebP: RIFF ... WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return "webp";
    }

    // GIF: GIF87a or GIF89a
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61
    ) {
      return "gif";
    }

    return "unknown";
  }

  private static parseJpeg(bytes: Uint8Array): { width: number; height: number; orientation: number } {
    let offset = 2;
    let width = 0;
    let height = 0;
    let orientation = 1;

    while (offset < bytes.length) {
      if (bytes[offset] !== 0xff) {
        // Find next 0xFF marker byte if unaligned
        const nextMarker = bytes.indexOf(0xff, offset);
        if (nextMarker === -1) break;
        offset = nextMarker;
      }
      const marker = bytes[offset + 1];
      offset += 2;

      // End of image or Start of Scan (SOS)
      if (marker === 0xd9 || marker === 0xda) break;

      // Read chunk length
      if (offset + 2 > bytes.length) break;
      const length = (bytes[offset] << 8) | bytes[offset + 1];

      // SOF markers (SOF0..SOF15 except Huffman tables 0xC4, 0xC8, 0xCC)
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        if (offset + 7 <= bytes.length) {
          height = (bytes[offset + 3] << 8) | bytes[offset + 4];
          width = (bytes[offset + 5] << 8) | bytes[offset + 6];
        }
      }

      // APP1 marker (EXIF)
      if (marker === 0xe1 && length >= 14) {
        const exifHeader = String.fromCharCode(...bytes.subarray(offset + 2, offset + 6));
        if (exifHeader === "Exif") {
          orientation = this.parseExifOrientation(bytes, offset + 8, length - 8);
        }
      }

      offset += length;
    }

    return { width, height, orientation };
  }

  private static parseExifOrientation(bytes: Uint8Array, startOffset: number, length: number): number {
    try {
      const dataView = new DataView(bytes.buffer, bytes.byteOffset + startOffset, length);
      const isLittleEndian = dataView.getUint16(0) === 0x4949;
      if (dataView.getUint16(2, isLittleEndian) !== 0x002a) return 1;

      const firstIfdOffset = dataView.getUint32(4, isLittleEndian);
      if (firstIfdOffset >= length) return 1;

      const numEntries = dataView.getUint16(firstIfdOffset, isLittleEndian);
      let entryOffset = firstIfdOffset + 2;

      for (let i = 0; i < numEntries; i++) {
        if (entryOffset + 12 > length) break;
        const tag = dataView.getUint16(entryOffset, isLittleEndian);
        if (tag === 0x0112) { // Orientation tag
          return dataView.getUint16(entryOffset + 8, isLittleEndian);
        }
        entryOffset += 12;
      }
    } catch {
      // Return 1 on parse error
    }
    return 1;
  }

  private static parsePng(bytes: Uint8Array): { width: number; height: number; hasAlpha: boolean } {
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = dataView.getUint32(16);
    const height = dataView.getUint32(20);
    const colorType = bytes[25];

    let hasAlpha = colorType === 4 || colorType === 6;

    // Check for tRNS chunk if not already alpha color type
    if (!hasAlpha) {
      let offset = 8;
      while (offset + 12 <= bytes.length) {
        const chunkLen = dataView.getUint32(offset);
        const chunkType = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
        if (chunkType === "tRNS") {
          hasAlpha = true;
          break;
        }
        if (chunkType === "IDAT") break;
        offset += 12 + chunkLen;
      }
    }

    return { width, height, hasAlpha };
  }

  private static parseWebp(bytes: Uint8Array): { width: number; height: number; hasAlpha: boolean; isAnimated: boolean } {
    const chunkType = String.fromCharCode(...bytes.subarray(12, 16));
    let width = 0;
    let height = 0;
    let hasAlpha = false;
    let isAnimated = false;

    if (chunkType === "VP8 ") {
      // Lossy WebP
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      width = dataView.getUint16(26, true) & 0x3fff;
      height = dataView.getUint16(28, true) & 0x3fff;
    } else if (chunkType === "VP8L") {
      // Lossless WebP
      const b0 = bytes[21];
      const b1 = bytes[22];
      const b2 = bytes[23];
      const b3 = bytes[24];
      width = 1 + (((b1 & 0x3f) << 8) | b0);
      height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      hasAlpha = (b3 & 0x10) !== 0;
    } else if (chunkType === "VP8X") {
      // Extended WebP
      const flags = bytes[20];
      hasAlpha = (flags & 0x10) !== 0;
      isAnimated = (flags & 0x02) !== 0;

      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      width = 1 + (dataView.getUint8(24) | (dataView.getUint8(25) << 8) | (dataView.getUint8(26) << 16));
      height = 1 + (dataView.getUint8(27) | (dataView.getUint8(28) << 8) | (dataView.getUint8(29) << 16));
    }

    return { width, height, hasAlpha, isAnimated };
  }

  private static parseGif(bytes: Uint8Array): { width: number; height: number; isAnimated: boolean } {
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = dataView.getUint16(6, true);
    const height = dataView.getUint16(8, true);

    // Count image descriptors (0x2C)
    let imageDescriptorCount = 0;
    for (let i = 13; i < bytes.length - 1; i++) {
      if (bytes[i] === 0x2c) {
        imageDescriptorCount++;
        if (imageDescriptorCount > 1) break;
      }
    }

    return { width, height, isAnimated: imageDescriptorCount > 1 };
  }
}
