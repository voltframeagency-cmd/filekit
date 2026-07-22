export interface ZipEntry {
  filename: string;
  data: Uint8Array;
}

export class ZipWriter {
  // Simple CRC32 table calculation
  private static crcTable: Uint32Array = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c;
    }
    return table;
  })();

  private static crc32(buf: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ ZipWriter.crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  static createZip(entries: ZipEntry[]): ArrayBuffer {
    const localHeaders: Uint8Array[] = [];
    const cdHeaders: Uint8Array[] = [];
    let offset = 0;

    const encoder = new TextEncoder();

    for (const entry of entries) {
      const filenameBytes = encoder.encode(entry.filename);
      const crc = ZipWriter.crc32(entry.data);
      const size = entry.data.length;

      // 1. Local File Header (30 bytes + filename + data)
      const lh = new Uint8Array(30 + filenameBytes.length + size);
      const lhView = new DataView(lh.buffer);

      lhView.setUint32(0, 0x04034b50, true); // Local file header signature
      lhView.setUint16(4, 20, true); // Version needed to extract
      lhView.setUint16(6, 0, true); // General bit flag
      lhView.setUint16(8, 0, true); // Compression method (0 = Store)
      lhView.setUint16(10, 0, true); // Last mod file time
      lhView.setUint16(12, 0, true); // Last mod file date
      lhView.setUint32(14, crc, true); // CRC32
      lhView.setUint32(18, size, true); // Compressed size
      lhView.setUint32(22, size, true); // Uncompressed size
      lhView.setUint16(26, filenameBytes.length, true); // Filename length
      lhView.setUint16(28, 0, true); // Extra field length

      lh.set(filenameBytes, 30);
      lh.set(entry.data, 30 + filenameBytes.length);

      localHeaders.push(lh);

      // 2. Central Directory Record (46 bytes + filename)
      const cd = new Uint8Array(46 + filenameBytes.length);
      const cdView = new DataView(cd.buffer);

      cdView.setUint32(0, 0x02014b50, true); // Central directory header signature
      cdView.setUint16(4, 20, true); // Version made by
      cdView.setUint16(6, 20, true); // Version needed to extract
      cdView.setUint16(8, 0, true); // General bit flag
      cdView.setUint16(10, 0, true); // Compression method (0 = Store)
      cdView.setUint16(12, 0, true); // Last mod file time
      cdView.setUint16(14, 0, true); // Last mod file date
      cdView.setUint32(16, crc, true); // CRC32
      cdView.setUint32(20, size, true); // Compressed size
      cdView.setUint32(24, size, true); // Uncompressed size
      cdView.setUint16(28, filenameBytes.length, true); // Filename length
      cdView.setUint16(30, 0, true); // Extra field length
      cdView.setUint16(32, 0, true); // File comment length
      cdView.setUint16(34, 0, true); // Disk number start
      cdView.setUint16(36, 0, true); // Internal file attributes
      cdView.setUint32(38, 0, true); // External file attributes
      cdView.setUint32(42, offset, true); // Relative offset of local header

      cd.set(filenameBytes, 46);
      cdHeaders.push(cd);

      offset += lh.length;
    }

    const cdOffset = offset;
    let cdSize = 0;
    for (const cd of cdHeaders) cdSize += cd.length;

    // 3. End of Central Directory Record (EOCD) (22 bytes)
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);

    eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
    eocdView.setUint16(4, 0, true); // Number of this disk
    eocdView.setUint16(6, 0, true); // Disk where central directory starts
    eocdView.setUint16(8, entries.length, true); // Total entries on this disk
    eocdView.setUint16(10, entries.length, true); // Total entries in central directory
    eocdView.setUint32(12, cdSize, true); // Size of central directory
    eocdView.setUint32(16, cdOffset, true); // Offset of central directory
    eocdView.setUint16(20, 0, true); // ZIP comment length

    // Assemble final Uint8Array
    const totalSize = offset + cdSize + eocd.length;
    const out = new Uint8Array(totalSize);

    let currentPos = 0;
    for (const lh of localHeaders) {
      out.set(lh, currentPos);
      currentPos += lh.length;
    }
    for (const cd of cdHeaders) {
      out.set(cd, currentPos);
      currentPos += cd.length;
    }
    out.set(eocd, currentPos);

    return out.buffer;
  }
}
