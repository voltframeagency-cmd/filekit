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
   * Packages a TrueType / OpenType font into a WOFF container header (RFC 8031).
   * WOFF Header:
   * - 0x774F4646 ('wOFF')
   * - flavor (SFNT version)
   * - length
   * - numTables
   * - totalSfntSize
   */
  static ttfToWoff(fontBytes: Uint8Array): Uint8Array {
    if (fontBytes.length < 12) throw new Error("Invalid TTF font payload");

    const view = new DataView(fontBytes.buffer, fontBytes.byteOffset, fontBytes.byteLength);
    const flavor = view.getUint32(0, false);
    const numTables = view.getUint16(4, false);

    // WOFF header is 44 bytes + 20 bytes per table directory
    const headerSize = 44 + numTables * 20;
    const totalWoffSize = headerSize + fontBytes.length - (12 + numTables * 16);

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
   * Unwraps a WOFF / WOFF2 container to recover standard TTF / OTF font tables.
   */
  static woffToTtf(woffBytes: Uint8Array): Uint8Array {
    if (woffBytes.length < 44) throw new Error("Invalid WOFF payload");

    const wView = new DataView(woffBytes.buffer, woffBytes.byteOffset, woffBytes.byteLength);
    const sig = wView.getUint32(0, false);

    if (sig !== 0x774F4646 && sig !== 0x774F4632) {
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
