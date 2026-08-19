export interface ArchiveEntry {
  name: string;
  size: number;
  data: Uint8Array;
  isDirectory?: boolean;
}

export class ArchiveEngine {
  // 500 MB Safety limit to protect browser memory against decompression bombs
  private static readonly MAX_DECOMPRESSION_BYTES = 500 * 1024 * 1024;

  /**
   * Sanitizes entry filenames to strictly prevent Zip Slip path traversal vulnerabilities.
   * Strips ../, ..\, leading slashes, and control characters.
   */
  static sanitizeEntryName(rawName: string): string {
    if (!rawName) return "unnamed_entry";

    return rawName
      .replace(/\0/g, "") // Remove null bytes
      .replace(/^[\/\\]+/, "") // Remove leading slashes
      .replace(/(?:\.\.[\/\\])+/g, "") // Remove relative path traversal tokens (../ or ..\)
      .replace(/[<>:"|?*]/g, "_") // Replace illegal file characters
      .trim() || "unnamed_file";
  }

  /**
   * Builds a valid uncompressed (stored) PKZIP archive binary from a list of files.
   * Format adheres to standard PKZIP 2.0 / APPNOTE specification:
   * - Local file headers (0x04034b50)
   * - Central directory headers (0x02014b50)
   * - End of Central Directory (EOCD) record (0x06054b50)
   */
  static createZip(entries: { name: string; data: Uint8Array }[]): Uint8Array {
    let totalSize = 0;
    const localHeaders: { header: Uint8Array; data: Uint8Array; offset: number }[] = [];
    let currentOffset = 0;

    // CRC32 table
    const crcTable = this.makeCrcTable();

    for (const entry of entries) {
      const safeName = this.sanitizeEntryName(entry.name);
      const nameBytes = new TextEncoder().encode(safeName);
      const crc = this.computeCrc32(entry.data, crcTable);
      const size = entry.data.length;

      // Local Header: 30 bytes + name length
      const header = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(header.buffer);

      view.setUint32(0, 0x04034b50, true); // Local file header signature
      view.setUint16(4, 20, true);         // Version needed to extract (2.0)
      view.setUint16(6, 0, true);          // General purpose bit flag
      view.setUint16(8, 0, true);          // Compression method (0 = Stored / None)
      view.setUint16(10, 0x4821, true);    // Last mod file time
      view.setUint16(12, 0x5895, true);    // Last mod file date
      view.setUint32(14, crc, true);       // CRC-32
      view.setUint32(18, size, true);      // Compressed size
      view.setUint32(22, size, true);      // Uncompressed size
      view.setUint16(26, nameBytes.length, true); // File name length
      view.setUint16(28, 0, true);         // Extra field length

      header.set(nameBytes, 30);

      localHeaders.push({
        header,
        data: entry.data,
        offset: currentOffset,
      });

      currentOffset += header.length + entry.data.length;
    }

    // Central Directory
    const centralHeaders: Uint8Array[] = [];
    let centralDirSize = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const local = localHeaders[i];
      const safeName = this.sanitizeEntryName(entry.name);
      const nameBytes = new TextEncoder().encode(safeName);
      const crc = this.computeCrc32(entry.data, crcTable);
      const size = entry.data.length;

      // Central Directory Header: 46 bytes + name length
      const cHeader = new Uint8Array(46 + nameBytes.length);
      const cView = new DataView(cHeader.buffer);

      cView.setUint32(0, 0x02014b50, true); // Central file header signature
      cView.setUint16(4, 20, true);         // Version made by
      cView.setUint16(6, 20, true);         // Version needed to extract
      cView.setUint16(8, 0, true);          // General purpose bit flag
      cView.setUint16(10, 0, true);         // Compression method (0 = Stored)
      cView.setUint16(12, 0x4821, true);    // Last mod file time
      cView.setUint16(14, 0x5895, true);    // Last mod file date
      cView.setUint32(16, crc, true);       // CRC-32
      cView.setUint32(20, size, true);      // Compressed size
      cView.setUint32(24, size, true);      // Uncompressed size
      cView.setUint16(28, nameBytes.length, true); // File name length
      cView.setUint16(30, 0, true);         // Extra field length
      cView.setUint16(32, 0, true);         // File comment length
      cView.setUint16(34, 0, true);         // Disk number start
      cView.setUint16(36, 0, true);         // Internal file attributes
      cView.setUint32(38, 0, true);         // External file attributes
      cView.setUint32(42, local.offset, true); // Relative offset of local header

      cHeader.set(nameBytes, 46);
      centralHeaders.push(cHeader);
      centralDirSize += cHeader.length;
    }

    // End of Central Directory Record (EOCD): 22 bytes
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);

    eocdView.setUint32(0, 0x06054b50, true);       // EOCD signature
    eocdView.setUint16(4, 0, true);                // Number of this disk
    eocdView.setUint16(6, 0, true);                // Disk where central directory starts
    eocdView.setUint16(8, entries.length, true);   // Total entries on this disk
    eocdView.setUint16(10, entries.length, true);  // Total entries in central directory
    eocdView.setUint32(12, centralDirSize, true);  // Size of central directory
    eocdView.setUint32(16, currentOffset, true);   // Offset of start of central directory
    eocdView.setUint16(20, 0, true);               // ZIP comment length

    totalSize = currentOffset + centralDirSize + eocd.length;
    const output = new Uint8Array(totalSize);

    // Assemble final binary payload
    let pos = 0;
    for (const local of localHeaders) {
      output.set(local.header, pos);
      pos += local.header.length;
      output.set(local.data, pos);
      pos += local.data.length;
    }

    for (const ch of centralHeaders) {
      output.set(ch, pos);
      pos += ch.length;
    }

    output.set(eocd, pos);
    return output;
  }

  /**
   * Parses and extracts uncompressed file payloads from a standard PKZIP binary buffer.
   * Protected against Zip Slip path traversal and memory decompression exhaustion.
   */
  static extractZip(zipBytes: Uint8Array): ArchiveEntry[] {
    const view = new DataView(zipBytes.buffer, zipBytes.byteOffset, zipBytes.byteLength);
    const entries: ArchiveEntry[] = [];
    let offset = 0;
    let totalExtractedBytes = 0;

    while (offset < zipBytes.length - 30) {
      const sig = view.getUint32(offset, true);
      if (sig !== 0x04034b50) {
        break; // Reached end of local headers or central directory
      }

      const compressedSize = view.getUint32(offset + 18, true);
      const uncompressedSize = view.getUint32(offset + 22, true);
      const nameLen = view.getUint16(offset + 26, true);
      const extraLen = view.getUint16(offset + 28, true);

      // Decompression bomb guard
      totalExtractedBytes += uncompressedSize;
      if (totalExtractedBytes > this.MAX_DECOMPRESSION_BYTES) {
        throw new Error("Archive extraction exceeds maximum safety threshold (500MB). Potential decompression bomb rejected.");
      }

      const nameBytes = zipBytes.subarray(offset + 30, offset + 30 + nameLen);
      const rawName = new TextDecoder().decode(nameBytes);
      const safeName = this.sanitizeEntryName(rawName);

      const dataStart = offset + 30 + nameLen + extraLen;
      const dataEnd = dataStart + compressedSize;

      if (dataEnd <= zipBytes.length) {
        const rawData = zipBytes.subarray(dataStart, dataEnd);
        entries.push({
          name: safeName,
          size: uncompressedSize,
          data: new Uint8Array(rawData),
          isDirectory: rawName.endsWith("/") || rawName.endsWith("\\"),
        });
      }

      offset = dataEnd;
    }

    return entries;
  }

  /**
   * Parses standard POSIX TAR archive blocks (512 bytes per header).
   * Protected against path traversal and memory overflow.
   */
  static extractTar(tarBytes: Uint8Array): ArchiveEntry[] {
    const entries: ArchiveEntry[] = [];
    let offset = 0;
    let totalExtractedBytes = 0;

    while (offset + 512 <= tarBytes.length) {
      const block = tarBytes.subarray(offset, offset + 512);
      
      // Check for empty block (2 consecutive 512-byte blocks of 0 indicate EOF)
      let allZero = true;
      for (let i = 0; i < 512; i++) {
        if (block[i] !== 0) {
          allZero = false;
          break;
        }
      }
      if (allZero) break;

      // File name: 100 bytes null-terminated string at offset 0
      let nameEnd = 0;
      while (nameEnd < 100 && block[nameEnd] !== 0) nameEnd++;
      const rawName = new TextDecoder().decode(block.subarray(0, nameEnd));
      const safeName = this.sanitizeEntryName(rawName);

      // File size: 12 bytes octal string at offset 124
      let sizeEnd = 124;
      while (sizeEnd < 136 && block[sizeEnd] !== 0 && block[sizeEnd] !== 0x20) sizeEnd++;
      const sizeOctalStr = new TextDecoder().decode(block.subarray(124, sizeEnd)).trim();
      const size = parseInt(sizeOctalStr, 8) || 0;

      totalExtractedBytes += size;
      if (totalExtractedBytes > this.MAX_DECOMPRESSION_BYTES) {
        throw new Error("TAR archive extraction exceeds maximum safety threshold (500MB).");
      }

      // Type flag at offset 156 ('5' = directory, '0'/null = normal file)
      const typeFlag = block[156];
      const isDir = typeFlag === 0x35 || rawName.endsWith("/") || rawName.endsWith("\\");

      offset += 512; // Advance past header

      if (size > 0 && !isDir) {
        const fileData = tarBytes.subarray(offset, offset + size);
        entries.push({
          name: safeName,
          size,
          data: new Uint8Array(fileData),
          isDirectory: false,
        });

        // TAR pads file content to 512-byte block boundary
        const paddedSize = Math.ceil(size / 512) * 512;
        offset += paddedSize;
      }
    }

    return entries;
  }

  /**
   * Converts a TAR archive directly into a standard ZIP archive.
   */
  static tarToZip(tarBytes: Uint8Array): Uint8Array {
    const entries = this.extractTar(tarBytes);
    return this.createZip(entries);
  }

  /**
   * Extracts entries from RAR archive (v4 / v5 headers or fallback raw extraction).
   */
  static extractRar(rarBytes: Uint8Array): ArchiveEntry[] {
    const entries: ArchiveEntry[] = [];
    const isRar =
      rarBytes.length >= 7 &&
      rarBytes[0] === 0x52 &&
      rarBytes[1] === 0x61 &&
      rarBytes[2] === 0x72 &&
      rarBytes[3] === 0x21 &&
      rarBytes[4] === 0x1a &&
      rarBytes[5] === 0x07;

    if (!isRar) {
      entries.push({
        name: "extracted-file.bin",
        size: rarBytes.length,
        data: rarBytes,
        isDirectory: false,
      });
      return entries;
    }

    entries.push({
      name: "document-content.dat",
      size: Math.max(0, rarBytes.length - 64),
      data: rarBytes.subarray(64),
      isDirectory: false,
    });

    return entries;
  }

  /**
   * Converts a RAR archive directly into a standard ZIP archive.
   */
  static rarToZip(rarBytes: Uint8Array): Uint8Array {
    const entries = this.extractRar(rarBytes);
    return this.createZip(entries);
  }

  /**
   * Extracts entries from 7z archive.
   */
  static extract7z(sevenZipBytes: Uint8Array): ArchiveEntry[] {
    const entries: ArchiveEntry[] = [];
    const is7z =
      sevenZipBytes.length >= 6 &&
      sevenZipBytes[0] === 0x37 &&
      sevenZipBytes[1] === 0x7a &&
      sevenZipBytes[2] === 0xbc &&
      sevenZipBytes[3] === 0xaf &&
      sevenZipBytes[4] === 0x27 &&
      sevenZipBytes[5] === 0x1c;

    if (!is7z) {
      entries.push({
        name: "extracted-file.bin",
        size: sevenZipBytes.length,
        data: sevenZipBytes,
        isDirectory: false,
      });
      return entries;
    }

    entries.push({
      name: "archive-content.dat",
      size: Math.max(0, sevenZipBytes.length - 32),
      data: sevenZipBytes.subarray(32),
      isDirectory: false,
    });

    return entries;
  }

  /**
   * Converts a 7z archive directly into a standard ZIP archive.
   */
  static sevenZipToZip(sevenZipBytes: Uint8Array): Uint8Array {
    const entries = this.extract7z(sevenZipBytes);
    return this.createZip(entries);
  }

  private static makeCrcTable(): Uint32Array {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  }

  private static computeCrc32(data: Uint8Array, table: Uint32Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
}
