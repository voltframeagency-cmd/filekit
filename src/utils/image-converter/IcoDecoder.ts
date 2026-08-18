export interface IcoSubImage {
  width: number;
  height: number;
  colorCount: number;
  sizeBytes: number;
  offset: number;
  pngBuffer: Uint8Array;
}

export interface IcoDecodeResult {
  isValid: boolean;
  imageCount: number;
  images: IcoSubImage[];
  error?: string;
}

export class IcoDecoder {
  /**
   * Decodes an ICO binary buffer and extracts all embedded PNG sub-images
   */
  static decode(buffer: ArrayBuffer): IcoDecodeResult {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);

    if (bytes.length < 6) {
      return { isValid: false, imageCount: 0, images: [], error: "ICO file is too small (under 6 bytes)." };
    }

    // 1. Validate ICONDIR Header
    const reserved = view.getUint16(0, true); // Must be 0
    const type = view.getUint16(2, true); // Must be 1 for ICO
    const count = view.getUint16(4, true); // Number of images

    if (reserved !== 0 || type !== 1 || count === 0) {
      return { isValid: false, imageCount: 0, images: [], error: "Invalid ICO header (reserved=0, type=1 required)." };
    }

    const headerSize = 6;
    const entrySize = 16;
    if (bytes.length < headerSize + count * entrySize) {
      return { isValid: false, imageCount: 0, images: [], error: "Truncated ICO directory entries." };
    }

    const images: IcoSubImage[] = [];

    for (let i = 0; i < count; i++) {
      const entryOffset = headerSize + i * entrySize;
      let rawW = bytes[entryOffset];
      let rawH = bytes[entryOffset + 1];
      const colorCount = bytes[entryOffset + 2];
      const imgBytes = view.getUint32(entryOffset + 8, true);
      const dataOffset = view.getUint32(entryOffset + 12, true);

      // Width/Height of 0 represents 256px
      const width = rawW === 0 ? 256 : rawW;
      const height = rawH === 0 ? 256 : rawH;

      if (dataOffset + imgBytes > bytes.length) {
        return { isValid: false, imageCount: 0, images: [], error: `Corrupted ICO payload offset for image #${i + 1}.` };
      }

      const rawPayload = bytes.subarray(dataOffset, dataOffset + imgBytes);

      // Check if sub-image is PNG format (89 50 4E 47)
      const isPng =
        rawPayload.length >= 8 &&
        rawPayload[0] === 0x89 &&
        rawPayload[1] === 0x50 &&
        rawPayload[2] === 0x4e &&
        rawPayload[3] === 0x47;

      if (isPng) {
        images.push({
          width,
          height,
          colorCount,
          sizeBytes: imgBytes,
          offset: dataOffset,
          pngBuffer: rawPayload,
        });
      } else {
        // Fallback: raw bitmap DIB payload or other sub-format
        images.push({
          width,
          height,
          colorCount,
          sizeBytes: imgBytes,
          offset: dataOffset,
          pngBuffer: rawPayload,
        });
      }
    }

    return {
      isValid: images.length > 0,
      imageCount: images.length,
      images,
    };
  }
}
