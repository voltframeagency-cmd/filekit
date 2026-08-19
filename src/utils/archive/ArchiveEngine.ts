export interface ArchiveEntry {
  name: string;
  size: number;
  data: Uint8Array;
  isDirectory?: boolean;
}

export class ArchiveEngine {
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
      const nameBytes = new TextEncoder().encode(entry.name);
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
      const nameBytes = new TextEncoder().encode(entry.name);
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

    // End of Central Directory (EOCD): 22 bytes
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
   */
  static extractZip(zipBytes: Uint8Array): ArchiveEntry[] {
    const view = new DataView(zipBytes.buffer, zipBytes.byteOffset, zipBytes.byteLength);
    const entries: ArchiveEntry[] = [];
    let offset = 0;

    while (offset < zipBytes.length - 30) {
      const sig = view.getUint32(offset, true);
      if (sig !== 0x04034b50) {
        break; // Reached end of local headers or central directory
      }

      const compressionMethod = view.getUint16(offset + 8, true);
      const compressedSize = view.getUint32(offset + 18, true);
      const uncompressedSize = view.getUint32(offset + 22, true);
      const nameLen = view.getUint16(offset + 26, true);
      const extraLen = view.getUint16(offset + 28, true);

      const nameBytes = zipBytes.subarray(offset + 30, offset + 30 + nameLen);
      const name = new TextDecoder().decode(nameBytes);

      const dataStart = offset + 30 + nameLen + extraLen;
      const dataEnd = dataStart + compressedSize;

      if (dataEnd <= zipBytes.length) {
        const rawData = zipBytes.subarray(dataStart, dataEnd);
        entries.push({
          name,
          size: uncompressedSize,
          data: new Uint8Array(rawData),
          isDirectory: name.endsWith("/"),
        });
      }

      offset = dataEnd;
    }

    return entries;
  }

  /**
   * Parses standard POSIX TAR archive blocks (512 bytes per header)
   */
  static extractTar(tarBytes: Uint8Array): ArchiveEntry[] {
    const entries: ArchiveEntry[] = [];
    let offset = 0;

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
      const name = new TextDecoder().decode(block.subarray(0, nameEnd));

      // File size: 12 bytes octal string at offset 124
      let sizeEnd = 124;
      while (sizeEnd < 136 && block[sizeEnd] !== 0 && block[sizeEnd] !== 0x20) sizeEnd++;
      const sizeOctalStr = new TextDecoder().decode(block.subarray(124, sizeEnd)).trim();
      const size = parseInt(sizeOctalStr, 8) || 0;

      // Type flag at offset 156 ('5' = directory, '0'/null = normal file)
      const typeFlag = block[156];
      const isDir = typeFlag === 0x35 || name.endsWith("/");

      offset += 512; // Advance past header

      if (size > 0 && !isDir) {
        const fileData = tarBytes.subarray(offset, offset + size);
        entries.push({
          name,
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
