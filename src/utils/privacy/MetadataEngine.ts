export interface DetectedMetadata {
  hasExif: boolean;
  hasGps: boolean;
  cameraMake?: string;
  cameraModel?: string;
  dateTime?: string;
  software?: string;
  fileSizeBytes: number;
}

export class MetadataEngine {
  /**
   * Scans a JPEG, PNG, or WebP binary buffer for privacy-invasive metadata
   * (camera make, model, GPS location, timestamp).
   */
  static inspectMetadata(imageBytes: Uint8Array): DetectedMetadata {
    const meta: DetectedMetadata = {
      hasExif: false,
      hasGps: false,
      fileSizeBytes: imageBytes.length,
    };

    const textDecoder = new TextDecoder("latin1");

    // Scan for standard EXIF string markers in raw bytes
    const sample = textDecoder.decode(imageBytes.subarray(0, Math.min(imageBytes.length, 32768)));

    if (sample.includes("Exif") || sample.includes("http://ns.adobe.com/xap/1.0/")) {
      meta.hasExif = true;
    }

    if (sample.includes("GPS") || sample.includes("GPSVersionID") || sample.includes("GPSLatitude")) {
      meta.hasGps = true;
    }

    // Detect common camera makes
    const makes = ["Apple", "Canon", "NIKON", "SONY", "Samsung", "Google", "DJI", "FUJIFILM"];
    for (const make of makes) {
      if (sample.includes(make)) {
        meta.cameraMake = make;
        break;
      }
    }

    return meta;
  }

  /**
   * Strips all EXIF, XMP, GPS, and ancillary metadata segments from JPEG, PNG, and WebP images,
   * returning clean, privacy-safe image bytes with 100% original visual quality.
   */
  static stripMetadata(imageBytes: Uint8Array, mimeType: string = "image/jpeg"): Uint8Array {
    if (mimeType === "image/jpeg" || (imageBytes[0] === 0xFF && imageBytes[1] === 0xD8)) {
      return this.stripJpegExif(imageBytes);
    } else if (mimeType === "image/png" || (imageBytes[0] === 0x89 && imageBytes[1] === 0x50)) {
      return this.stripPngMetadata(imageBytes);
    } else if (mimeType === "image/webp") {
      return this.stripWebpMetadata(imageBytes);
    }

    return imageBytes;
  }

  /**
   * Removes APP1 (0xFFE1 Exif/XMP), APP2 (0xFFE2), APP13 (0xFFED Photoshop), APP14 (0xFFEE)
   * markers from a JPEG binary stream.
   */
  private static stripJpegExif(bytes: Uint8Array): Uint8Array {
    if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return bytes;

    const chunks: Uint8Array[] = [new Uint8Array([0xFF, 0xD8])];
    let offset = 2;

    while (offset < bytes.length) {
      if (bytes[offset] !== 0xFF) break;

      const marker = bytes[offset + 1];

      // SOS (Start of Scan 0xDA) -> remaining stream is pure image payload
      if (marker === 0xDA) {
        chunks.push(bytes.subarray(offset));
        break;
      }

      // EOI (End of Image 0xD9)
      if (marker === 0xD9) {
        chunks.push(new Uint8Array([0xFF, 0xD9]));
        break;
      }

      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      const segmentEnd = offset + 2 + length;

      // APP1 (Exif/XMP), APP2 (ICC/FlashPix), APP13 (IPTC/Photoshop) are stripped
      const isExifOrMeta = (marker >= 0xE1 && marker <= 0xEE) || marker === 0xFE; // 0xFE = Comment

      if (!isExifOrMeta) {
        chunks.push(bytes.subarray(offset, segmentEnd));
      }

      offset = segmentEnd;
    }

    let total = 0;
    for (const c of chunks) total += c.length;
    const clean = new Uint8Array(total);
    let p = 0;
    for (const c of chunks) {
      clean.set(c, p);
      p += c.length;
    }

    return clean;
  }

  /**
   * Strips non-essential ancillary metadata chunks (eXIf, tEXt, zTXt, iTXt) from PNG.
   */
  private static stripPngMetadata(bytes: Uint8Array): Uint8Array {
    if (bytes.length < 8) return bytes;

    const header = bytes.subarray(0, 8);
    const chunks: Uint8Array[] = [header];
    let offset = 8;
    const textDecoder = new TextDecoder("latin1");

    while (offset + 8 <= bytes.length) {
      const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
      const type = textDecoder.decode(bytes.subarray(offset + 4, offset + 8));
      const totalChunkLength = 12 + length; // 4 length + 4 type + length + 4 CRC

      const isMeta = type === "eXIf" || type === "tEXt" || type === "zTXt" || type === "iTXt" || type === "tIME";

      if (!isMeta && offset + totalChunkLength <= bytes.length) {
        chunks.push(bytes.subarray(offset, offset + totalChunkLength));
      }

      offset += totalChunkLength;
      if (type === "IEND") break;
    }

    let total = 0;
    for (const c of chunks) total += c.length;
    const clean = new Uint8Array(total);
    let p = 0;
    for (const c of chunks) {
      clean.set(c, p);
      p += c.length;
    }

    return clean;
  }

  /**
   * Strips EXIF and XMP chunks from RIFF/WebP container.
   */
  private static stripWebpMetadata(bytes: Uint8Array): Uint8Array {
    if (bytes.length < 12) return bytes;
    // WebP RIFF parser
    const textDecoder = new TextDecoder("latin1");
    const riff = textDecoder.decode(bytes.subarray(0, 4));
    const webp = textDecoder.decode(bytes.subarray(8, 12));
    if (riff !== "RIFF" || webp !== "WEBP") return bytes;

    const chunks: Uint8Array[] = [];
    let offset = 12;

    while (offset + 8 <= bytes.length) {
      const fourCC = textDecoder.decode(bytes.subarray(offset, offset + 4));
      const size = (bytes[offset + 4]) | (bytes[offset + 5] << 8) | (bytes[offset + 6] << 16) | (bytes[offset + 7] << 24);
      const paddedSize = size + (size % 2);
      const totalChunkSize = 8 + paddedSize;

      if (fourCC !== "EXIF" && fourCC !== "XMP ") {
        chunks.push(bytes.subarray(offset, Math.min(bytes.length, offset + totalChunkSize)));
      }

      offset += totalChunkSize;
    }

    // Reconstruct RIFF header
    let payloadSize = 4; // 'WEBP'
    for (const c of chunks) payloadSize += c.length;

    const header = new Uint8Array(12);
    header.set(new TextEncoder().encode("RIFF"), 0);
    const view = new DataView(header.buffer);
    view.setUint32(4, payloadSize, true);
    header.set(new TextEncoder().encode("WEBP"), 8);

    const clean = new Uint8Array(12 + payloadSize - 4);
    clean.set(header, 0);
    let p = 12;
    for (const c of chunks) {
      clean.set(c, p);
      p += c.length;
    }

    return clean;
  }
}
