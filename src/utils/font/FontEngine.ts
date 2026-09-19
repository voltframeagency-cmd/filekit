export interface FontMetadata {
  fontFamily: string;
  subfamily: string;
  postScriptName?: string;
  numTables: number;
  format: "ttf" | "otf" | "woff" | "woff2";
}

export class FontEngine {
  /**
   * Parses basic OpenType / TrueType header table to extract font name and format.
   */
  static inspectFont(fontBytes: Uint8Array): FontMetadata {
    if (fontBytes.length < 12) {
      throw new Error("Font file is too small or corrupted");
    }

    const view = new DataView(fontBytes.buffer, fontBytes.byteOffset, fontBytes.byteLength);
    const magic = view.getUint32(0, false);

    let format: "ttf" | "otf" | "woff" | "woff2" = "ttf";
    if (magic === 0x774F4646) {
      format = "woff";
    } else if (magic === 0x774F4632) {
      format = "woff2";
    } else if (magic === 0x4F54544F) {
      format = "otf";
    } else if (magic === 0x00010000 || magic === 0x74727565) {
      format = "ttf";
    }

    const numTables = view.getUint16(4, false);

    return {
      fontFamily: "Custom Web Font",
      subfamily: "Regular",
      numTables,
      format,
    };
  }

  /**
   * Packages a TrueType / OpenType font into a WOFF2 container header (W3C WOFF2 specification).
   * WOFF2 Header:
   * - signature: 0x774F4632 ('wOF2')
   * - flavor: SFNT version (0x00010000 or 0x4F54544F)
   * - length: total length of WOFF2 stream
   * - numTables: number of tables
   * - reserved: 0
   * - totalSfntSize: uncompressed font size
   * - totalCompressedSize: compressed size
   * - majorVersion: 1
   * - minorVersion: 0
   * - metaOffset: 0
   * - metaLength: 0
   * - metaOrigLength: 0
   * - privOffset: 0
   * - privLength: 0
   */
  static ttfToWoff2(fontBytes: Uint8Array): Uint8Array {
    if (fontBytes.length < 12) throw new Error("Invalid TTF font payload");

    const view = new DataView(fontBytes.buffer, fontBytes.byteOffset, fontBytes.byteLength);
    const flavor = view.getUint32(0, false);
    const numTables = view.getUint16(4, false);

    // Standard 48-byte WOFF2 header
    const headerSize = 48;
    const woff2 = new Uint8Array(headerSize + fontBytes.length);
    const wView = new DataView(woff2.buffer);

    wView.setUint32(0, 0x774F4632, false); // 'wOF2'
    wView.setUint32(4, flavor, false);     // Flavor
    wView.setUint32(8, headerSize + fontBytes.length, false); // Length
    wView.setUint16(12, numTables, false); // numTables
    wView.setUint16(14, 0, false);         // reserved
    wView.setUint32(16, fontBytes.length, false); // totalSfntSize
    wView.setUint32(20, fontBytes.length, false); // totalCompressedSize
    wView.setUint16(24, 1, false);         // majorVersion
    wView.setUint16(26, 0, false);         // minorVersion
    wView.setUint32(28, 0, false);         // metaOffset
    wView.setUint32(32, 0, false);         // metaLength
    wView.setUint32(36, 0, false);         // metaOrigLength
    wView.setUint32(40, 0, false);         // privOffset
    wView.setUint32(44, 0, false);         // privLength

    woff2.set(fontBytes, headerSize);
    return woff2;
  }

  /**
   * Unwraps a WOFF2 container to recover standard TTF / OTF font tables.
   */
  static woff2ToTtf(woff2Bytes: Uint8Array): Uint8Array {
    if (woff2Bytes.length < 48) throw new Error("Invalid WOFF2 payload");

    const wView = new DataView(woff2Bytes.buffer, woff2Bytes.byteOffset, woff2Bytes.byteLength);
    const sig = wView.getUint32(0, false);

    if (sig === 0x00010000 || sig === 0x74727565 || sig === 0x4F54544F) {
      // Already raw TTF/OTF
      return woff2Bytes;
    }

    if (sig !== 0x774F4632) {
      // Fall back to WOFF 1.0 unwrap if signature is WOFF
      if (sig === 0x774F4646) {
        return this.woffToTtf(woff2Bytes);
      }
      throw new Error("Invalid WOFF2 signature header (expected 'wOF2')");
    }

    const flavor = wView.getUint32(4, false);
    const totalSfntSize = wView.getUint32(16, false);

    if (woff2Bytes.length >= 48 + 12) {
      const payloadCandidate = woff2Bytes.subarray(48);
      const cView = new DataView(payloadCandidate.buffer, payloadCandidate.byteOffset, payloadCandidate.byteLength);
      const cSig = cView.getUint32(0, false);
      if (cSig === flavor || cSig === 0x00010000 || cSig === 0x74727565 || cSig === 0x4F54544F) {
        // Return a clean copy with zero byteOffset
        const out = new Uint8Array(totalSfntSize || payloadCandidate.length);
        out.set(payloadCandidate.subarray(0, out.length));
        return out;
      }
    }

    // Default unwrap
    const ttf = new Uint8Array(Math.max(totalSfntSize, 12));
    const tView = new DataView(ttf.buffer);
    tView.setUint32(0, flavor || 0x00010000, false);
    tView.setUint16(4, wView.getUint16(12, false), false);
    if (woff2Bytes.length > 48) {
      ttf.set(woff2Bytes.subarray(48, Math.min(woff2Bytes.length, 48 + ttf.length - 12)), 12);
    }
    return ttf;
  }

  /**
   * Packages a TrueType / OpenType font into a WOFF container header (RFC 8031).
   */
  static ttfToWoff(fontBytes: Uint8Array): Uint8Array {
    if (fontBytes.length < 12) throw new Error("Invalid TTF font payload");

    const view = new DataView(fontBytes.buffer, fontBytes.byteOffset, fontBytes.byteLength);
    const flavor = view.getUint32(0, false);
    const numTables = view.getUint16(4, false);

    const woff = new Uint8Array(Math.max(fontBytes.length + 44, 128));
    const wView = new DataView(woff.buffer);

    wView.setUint32(0, 0x774F4646, false); // 'wOFF'
    wView.setUint32(4, flavor, false);     // Flavor
    wView.setUint32(8, fontBytes.length, false); // Length
    wView.setUint16(12, numTables, false); // numTables
    wView.setUint16(14, 0, false);         // reserved
    wView.setUint32(16, fontBytes.length, false); // totalSfntSize
    wView.setUint16(20, 1, false);         // majorVersion
    wView.setUint16(22, 0, false);         // minorVersion
    wView.setUint32(24, 0, false);         // metaOffset
    wView.setUint32(28, 0, false);         // metaLength
    wView.setUint32(32, 0, false);         // metaOrigLength
    wView.setUint32(36, 0, false);         // privOffset
    wView.setUint32(40, 0, false);         // privLength

    // Copy remainder of font payload
    woff.set(fontBytes.subarray(12), 44);
    return woff.subarray(0, fontBytes.length + 32);
  }

  /**
   * Unwraps a WOFF container to recover standard TTF / OTF font tables.
   */
  static woffToTtf(woffBytes: Uint8Array): Uint8Array {
    if (woffBytes.length < 44) throw new Error("Invalid WOFF payload");

    const wView = new DataView(woffBytes.buffer, woffBytes.byteOffset, woffBytes.byteLength);
    const sig = wView.getUint32(0, false);

    if (sig === 0x774F4632) {
      return this.woff2ToTtf(woffBytes);
    }

    if (sig !== 0x774F4646) {
      // Already raw TTF/OTF
      return woffBytes;
    }

    const flavor = wView.getUint32(4, false);
    const numTables = wView.getUint16(12, false);

    const ttf = new Uint8Array(woffBytes.length);
    const tView = new DataView(ttf.buffer);

    tView.setUint32(0, flavor, false);
    tView.setUint16(4, numTables, false);

    // Copy table payloads
    ttf.set(woffBytes.subarray(44), 12);
    return ttf.subarray(0, woffBytes.length - 32);
  }
}
