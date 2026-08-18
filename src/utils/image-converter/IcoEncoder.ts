/**
 * Pure TypeScript Multi-Resolution ICO Binary Container Encoder
 * Adheres to Microsoft ICO file specification with embedded PNG sub-images.
 * Standard Favicon / Icon Resolutions: 16x16, 32x32, 48x48, 64x64.
 */

export interface IcoSubImage {
  width: number;
  height: number;
  pngBuffer: Uint8Array;
}

export class IcoEncoder {
  /**
   * Encodes an array of PNG sub-images into a valid multi-resolution .ico binary ArrayBuffer
   */
  static encode(images: IcoSubImage[]): ArrayBuffer {
    if (!images || images.length === 0) {
      throw new Error("IcoEncoder: At least one sub-image is required.");
    }

    const numImages = images.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    const dirSize = headerSize + numImages * dirEntrySize;

    // Calculate total file size and offsets
    let currentOffset = dirSize;
    const entries: {
      width: number;
      height: number;
      size: number;
      offset: number;
      pngBuffer: Uint8Array;
    }[] = [];

    for (const img of images) {
      entries.push({
        width: img.width,
        height: img.height,
        size: img.pngBuffer.byteLength,
        offset: currentOffset,
        pngBuffer: img.pngBuffer
      });
      currentOffset += img.pngBuffer.byteLength;
    }

    const totalFileSize = currentOffset;
    const buffer = new Uint8Array(totalFileSize);
    const view = new DataView(buffer.buffer);

    // 1. ICONDIR Header
    view.setUint16(0, 0, true); // Reserved (must be 0)
    view.setUint16(2, 1, true); // Image type (1 = ICO)
    view.setUint16(4, numImages, true); // Number of images

    // 2. ICONDIRENTRY list
    let entryOffset = 6;
    for (const entry of entries) {
      const w = entry.width >= 256 ? 0 : entry.width;
      const h = entry.height >= 256 ? 0 : entry.height;

      view.setUint8(entryOffset + 0, w); // Width
      view.setUint8(entryOffset + 1, h); // Height
      view.setUint8(entryOffset + 2, 0); // Color count (0 for 32bpp)
      view.setUint8(entryOffset + 3, 0); // Reserved (must be 0)
      view.setUint16(entryOffset + 4, 1, true); // Color planes (1)
      view.setUint16(entryOffset + 6, 32, true); // Bits per pixel (32bpp RGBA)
      view.setUint32(entryOffset + 8, entry.size, true); // Size of image data
      view.setUint32(entryOffset + 12, entry.offset, true); // Offset of image data

      // Copy PNG sub-image data to designated offset
      buffer.set(entry.pngBuffer, entry.offset);

      entryOffset += dirEntrySize;
    }

    return buffer.buffer;
  }
}
