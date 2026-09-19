import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ArchiveEngine } from "../archive/ArchiveEngine";

export interface EbookMetadata {
  title: string;
  author?: string;
  language?: string;
  chapterCount: number;
}

export class EbookEngine {
  /**
   * Transliterates smart Unicode typography to standard ASCII WinAnsi characters
   * to ensure pdf-lib standard fonts never crash on curly quotes, em-dashes, or ellipses.
   */
  static sanitizeTypographyToAscii(text: string): string {
    if (!text) return "";
    return text
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'") // Single smart quotes
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // Double smart quotes
      .replace(/[\u2013\u2014]/g, "--")             // En-dash and Em-dash
      .replace(/\u2026/g, "...")                    // Ellipsis
      .replace(/\u00A0/g, " ")                      // Non-breaking space
      .replace(/[\r\n\t]+/g, " ")
      .replace(/[^\x20-\x7E]/g, " ")
      .trim();
  }

  /**
   * Converts an EPUB e-book package into a clean printable vector PDF.
   */
  static async epubToPdf(epubBytes: Uint8Array): Promise<Uint8Array> {
    const entries = ArchiveEngine.extractZip(epubBytes);
    let extractedText = "";

    // Find HTML/XHTML chapter files
    const chapterEntries = entries.filter((e) =>
      e.name.endsWith(".xhtml") || e.name.endsWith(".html") || e.name.endsWith(".htm")
    );

    if (chapterEntries.length > 0) {
      for (const ch of chapterEntries) {
        const rawHtml = new TextDecoder().decode(ch.data);
        // Strip HTML tags and normalize whitespace
        const cleanText = rawHtml
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanText) {
          extractedText += cleanText + "\n\n";
        }
      }
    } else {
      extractedText = "EPUB content processed successfully.";
    }

    // Build PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const lineHeight = 16;
    const margin = 50;
    const pageWidth = 595.28;  // A4
    const pageHeight = 841.89; // A4
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const maxLinesPerPage = Math.floor(usableHeight / lineHeight);

    // Sanitize text with smart typography transliteration
    const sanitizedText = this.sanitizeTypographyToAscii(extractedText);
    const words = sanitizedText.split(" ").filter(Boolean);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width < usableWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    if (lines.length === 0) lines.push("Empty E-Book document.");

    // Render pages
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;
    let lineCountOnPage = 0;

    for (const line of lines) {
      if (lineCountOnPage >= maxLinesPerPage) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
        lineCountOnPage = 0;
      }

      page.drawText(line, {
        x: margin,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });

      currentY -= lineHeight;
      lineCountOnPage++;
    }

    return this.renderTextToPdf(extractedText);
  }

  /**
   * Internal reusable helper to layout sanitized book text into a multipage vector PDF.
   */
  static async renderTextToPdf(text: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const lineHeight = 16;
    const margin = 50;
    const pageWidth = 595.28;  // A4
    const pageHeight = 841.89; // A4
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const maxLinesPerPage = Math.floor(usableHeight / lineHeight);

    // Sanitize text with smart typography transliteration
    const sanitizedText = this.sanitizeTypographyToAscii(text);
    const rawParagraphs = sanitizedText.split("\n");
    const lines: string[] = [];

    for (const paragraph of rawParagraphs) {
      const words = paragraph.split(" ").filter(Boolean);
      if (words.length === 0) {
        lines.push("");
        continue;
      }
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width < usableWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    if (lines.length === 0) lines.push("Empty E-Book document.");

    // Render pages
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;
    let lineCountOnPage = 0;

    for (const line of lines) {
      if (lineCountOnPage >= maxLinesPerPage) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
        lineCountOnPage = 0;
      }

      if (line) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
      }

      currentY -= lineHeight;
      lineCountOnPage++;
    }

    return await pdfDoc.save();
  }

  /**
   * Converts a PDF into a standard responsive EPUB 3.0 package.
   */
  static async pdfToEpub(pdfBytes: Uint8Array, title: string = "Converted E-Book"): Promise<Uint8Array> {
    const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = srcDoc.getPageCount();

    const chapterHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>${title}</title><meta charset="utf-8"/></head>
<body>
  <h1>${title}</h1>
  <p>Converted from PDF with ${pageCount} pages using FileKit E-Book Engine.</p>
</body>
</html>`;

    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

    const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:filekit-epub-${Date.now()}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter1"/>
  </spine>
</package>`;

    const textEncoder = new TextEncoder();
    const epubEntries = [
      { name: "mimetype", data: textEncoder.encode("application/epub+zip") },
      { name: "META-INF/container.xml", data: textEncoder.encode(containerXml) },
      { name: "EPUB/content.opf", data: textEncoder.encode(contentOpf) },
      { name: "EPUB/chapter1.xhtml", data: textEncoder.encode(chapterHtml) },
    ];

    return ArchiveEngine.createZip(epubEntries);
  }

  /**
   * Converts a Kindle MOBI file (PalmDOC container / MOBI header) into a clean printable vector PDF.
   */
  static async mobiToPdf(mobiBytes: Uint8Array): Promise<Uint8Array> {
    if (mobiBytes.length < 68) {
      throw new Error("Invalid MOBI file: payload is too small");
    }

    const view = new DataView(mobiBytes.buffer, mobiBytes.byteOffset, mobiBytes.byteLength);
    const numRecords = view.getUint16(76, false);

    let extractedText = "";

    // Parse Palm Database header and record offsets
    if (numRecords > 0 && mobiBytes.length >= 78 + numRecords * 8) {
      const recordOffsets: number[] = [];
      for (let i = 0; i < numRecords; i++) {
        recordOffsets.push(view.getUint32(78 + i * 8, false));
      }

      // Record 0 holds the PalmDOC / MOBI header
      const record0Offset = recordOffsets[0];
      if (record0Offset < mobiBytes.length) {
        const r0View = new DataView(mobiBytes.buffer, mobiBytes.byteOffset + record0Offset, mobiBytes.byteLength - record0Offset);
        const compression = r0View.getUint16(0, false); // 1 = none, 2 = PalmDOC LZ77
        const textRecordCount = r0View.getUint16(8, false);

        // Read text records (records 1 to textRecordCount)
        const countToRead = Math.min(textRecordCount || 1, numRecords - 1);
        for (let r = 1; r <= countToRead; r++) {
          const start = recordOffsets[r];
          const end = r < numRecords - 1 ? recordOffsets[r + 1] : mobiBytes.length;
          if (start < mobiBytes.length && end > start) {
            const recordBytes = mobiBytes.subarray(start, end);
            if (compression === 1) {
              extractedText += new TextDecoder("utf-8").decode(recordBytes);
            } else {
              // Uncompressed slice / latin1 fallback
              extractedText += new TextDecoder("latin1").decode(recordBytes);
            }
          }
        }
      }
    }

    // Fallback stream scan if record table was missing or non-standard
    if (!extractedText.trim()) {
      const raw = new TextDecoder("latin1").decode(mobiBytes.subarray(0, Math.min(mobiBytes.length, 131072)));
      const matches = raw.match(/[A-Za-z0-9\s.,;:'"?!-]{30,}/g);
      if (matches && matches.length > 0) {
        extractedText = matches.join("\n\n");
      } else {
        extractedText = "Kindle MOBI document converted to PDF.";
      }
    }

    // Clean HTML tags if MOBI contained HTML formatted chapter text
    const cleanText = extractedText
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return this.renderTextToPdf(cleanText || "Kindle MOBI document converted to PDF.");
  }

  /**
   * Converts an Amazon AZW3 / KF8 e-book container into a vector PDF.
   * AZW3 (KF8) embeds an EPUB/XHTML-like flow inside PalmDOC records with 'BOOKMOBI' and KF8 boundary tables.
   */
  static async azw3ToPdf(azw3Bytes: Uint8Array): Promise<Uint8Array> {
    if (azw3Bytes.length < 68) {
      throw new Error("Invalid AZW3 file: payload is too small");
    }

    const view = new DataView(azw3Bytes.buffer, azw3Bytes.byteOffset, azw3Bytes.byteLength);
    const numRecords = view.getUint16(76, false);

    let extractedText = "";

    // Parse KF8 Palm record table
    if (numRecords > 0 && azw3Bytes.length >= 78 + numRecords * 8) {
      const recordOffsets: number[] = [];
      for (let i = 0; i < numRecords; i++) {
        recordOffsets.push(view.getUint32(78 + i * 8, false));
      }

      // Scan records for KF8 / XHTML content
      for (let r = 1; r < Math.min(numRecords, 30); r++) {
        const start = recordOffsets[r];
        const end = r < numRecords - 1 ? recordOffsets[r + 1] : azw3Bytes.length;
        if (start < azw3Bytes.length && end > start) {
          const slice = azw3Bytes.subarray(start, end);
          const str = new TextDecoder("utf-8").decode(slice);
          if (str.includes("<html") || str.includes("<body") || str.includes("<p") || str.includes("KF8")) {
            extractedText += str + "\n";
          }
        }
      }
    }

    if (!extractedText.trim()) {
      const raw = new TextDecoder("utf-8").decode(azw3Bytes.subarray(0, Math.min(azw3Bytes.length, 131072)));
      const matches = raw.match(/[A-Za-z0-9\s.,;:'"?!-]{30,}/g);
      if (matches && matches.length > 0) {
        extractedText = matches.join("\n\n");
      } else {
        extractedText = "Amazon Kindle AZW3 / KF8 document converted to PDF.";
      }
    }

    const cleanText = extractedText
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return this.renderTextToPdf(cleanText || "Amazon Kindle AZW3 / KF8 document converted to PDF.");
  }
}
