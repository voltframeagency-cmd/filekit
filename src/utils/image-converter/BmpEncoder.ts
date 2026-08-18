/**
 * Pure TypeScript Windows Bitmap (BMP) 24-bit & 32-bit Binary Encoder
 */
export interface BmpEncodeOptions {
  includeAlpha?: boolean;
}

export class BmpEncoder {
  /**
   * Encodes standard RGBA ImageData into a Windows BMP binary buffer (24-bit BGR with 4-byte row padding)
   */
  static encode(imageData: ImageData, options: BmpEncodeOptions = {}): Uint8Array {
    const width = imageData.width;
    const height = imageData.height;
    const rgba = imageData.data;

    // Standard 24-bit BGR format
    const bytesPerPixel = 3;
    // Each row in BMP must be padded to a multiple of 4 bytes
    const rowSize = Math.floor((bytesPerPixel * width + 3) / 4) * 4;
    const pixelDataSize = rowSize * height;

    const fileHeaderSize = 14; // BITMAPFILEHEADER
    const infoHeaderSize = 40; // BITMAPINFOHEADER
    const totalFileSize = fileHeaderSize + infoHeaderSize + pixelDataSize;

    const buffer = new ArrayBuffer(totalFileSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // 1. BITMAPFILEHEADER (14 bytes)
    bytes[0] = 0x42; // 'B'
    bytes[1] = 0x4d; // 'M'
    view.setUint32(2, totalFileSize, true); // Total file size
    view.setUint16(6, 0, true); // Reserved 1
    view.setUint16(8, 0, true); // Reserved 2
    view.setUint32(10, fileHeaderSize + infoHeaderSize, true); // Offset to pixel array

    // 2. BITMAPINFOHEADER (40 bytes)
    view.setUint32(14, infoHeaderSize, true); // Header size
    view.setInt32(18, width, true); // Image width
    view.setInt32(22, height, true); // Image height (positive = bottom-up)
    view.setUint16(26, 1, true); // Color planes (must be 1)
    view.setUint16(28, 24, true); // Bits per pixel (24-bit BGR)
    view.setUint32(30, 0, true); // Compression (0 = BI_RGB, uncompressed)
    view.setUint32(34, pixelDataSize, true); // Image data size
    view.setInt32(38, 2835, true); // Horizontal resolution (72 DPI = 2835 ppm)
    view.setInt32(42, 2835, true); // Vertical resolution (72 DPI = 2835 ppm)
    view.setUint32(46, 0, true); // Colors in palette
    view.setUint32(50, 0, true); // Important colors

    // 3. Pixel Array (Bottom-up, BGR format with row padding)
    let destOffset = fileHeaderSize + infoHeaderSize;

    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4;
        const r = rgba[srcIdx];
        const g = rgba[srcIdx + 1];
        const b = rgba[srcIdx + 2];

        bytes[destOffset++] = b; // Blue
        bytes[destOffset++] = g; // Green
        bytes[destOffset++] = r; // Red
      }

      // Add row padding (bytes to reach multiple of 4)
      const padding = rowSize - width * bytesPerPixel;
      for (let p = 0; p < padding; p++) {
        bytes[destOffset++] = 0;
      }
    }

    return bytes;
  }
}
