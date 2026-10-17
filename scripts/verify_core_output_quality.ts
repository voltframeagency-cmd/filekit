import assert from "assert";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { PdfPreflightInspector } from "../src/utils/engine/PdfPreflightInspector";
import { CompressionStrategySelector } from "../src/utils/engine/CompressionStrategySelector";
import { selectCompressionResult } from "../src/utils/engine/TargetSizeController";
import { LocalPdfCompressionEngine } from "../src/utils/engine/LocalPdfCompressionEngine";
import { PdfManipulationEngine } from "../src/utils/pdf-manipulation/PdfManipulationEngine";
import { executePdfWatermark } from "../src/utils/pdf-overlay/PdfOverlayEngine";
import { ImageToPdfEngine } from "../src/utils/image-to-pdf/ImageToPdfEngine";
import { IcoEncoder } from "../src/utils/image-converter/IcoEncoder";
import { BmpEncoder } from "../src/utils/image-converter/BmpEncoder";

const FIXTURES_DIR = path.join(__dirname, "../test-fixtures");

function readFixture(name: string): Uint8Array {
  const filePath = path.join(FIXTURES_DIR, name);
  const buf = fs.readFileSync(filePath);
  const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return new Uint8Array(arrayBuf);
}

/**
 * Generates a genuine, specification-compliant PNG image in Node with valid IHDR, IDAT, and IEND chunks.
 */
function createGenuinePng(width: number, height: number, r: number, g: number, b: number): Uint8Array {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }
  function crc32(buf: Buffer): number {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 2; // Truecolor (RGB)
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk("IHDR", ihdrData);

  const rowLen = 1 + width * 3;
  const rawData = Buffer.alloc(rowLen * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowLen;
    rawData[rowStart] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3;
      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
    }
  }
  const idatData = zlib.deflateSync(rawData);
  const idat = makeChunk("IDAT", idatData);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return new Uint8Array(Buffer.concat([sig, ihdr, idat, iend]));
}

/**
 * Decodes 24-bit uncompressed BMP bytes and reconstructs the RGB pixel grid.
 */
function decodeBmp24(bmpBytes: Uint8Array): {
  width: number;
  height: number;
  bpp: number;
  getPixel: (x: number, y: number) => { r: number; g: number; b: number };
} {
  const view = new DataView(bmpBytes.buffer, bmpBytes.byteOffset, bmpBytes.byteLength);
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1));
  assert.strictEqual(magic, "BM", "BMP magic must be 'BM'");

  const dataOffset = view.getUint32(10, true);
  const width = view.getInt32(18, true);
  const height = view.getInt32(22, true);
  const bpp = view.getUint16(28, true);
  assert.strictEqual(bpp, 24, "Expected 24-bit BMP");

  const rowStride = Math.floor((24 * width + 31) / 32) * 4;
  const isBottomUp = height > 0;
  const absHeight = Math.abs(height);

  return {
    width,
    height: absHeight,
    bpp,
    getPixel(x: number, y: number) {
      const actualY = isBottomUp ? absHeight - 1 - y : y;
      const pixelOffset = dataOffset + actualY * rowStride + x * 3;
      const b = bmpBytes[pixelOffset];
      const g = bmpBytes[pixelOffset + 1];
      const r = bmpBytes[pixelOffset + 2];
      return { r, g, b };
    },
  };
}

interface QualityTestResult {
  suite: string;
  testCase: string;
  status: "PASSED" | "FAILED";
  details: string;
}

const auditLog: QualityTestResult[] = [];

function record(suite: string, testCase: string, passed: boolean, details: string) {
  auditLog.push({
    suite,
    testCase,
    status: passed ? "PASSED" : "FAILED",
    details,
  });
  const symbol = passed ? "✓" : "❌";
  console.log(`  ${symbol} [${suite}] ${testCase}: ${details}`);
}

async function runCorePdfQualityAudit() {
  console.log("\n==================================================");
  console.log("STAGE 1: CORE PDF OUTPUT QUALITY & PRODUCTION PIPELINE AUDIT");
  console.log("==================================================");

  // 1a. Text Preservation: Production Compression Pipeline & Text Content Equality
  try {
    const textPdfBuf = readFixture("text_simple.pdf");
    
    // Extract original text using production PdfManipulationEngine
    const originalExtracted = await PdfManipulationEngine.extractPdfText(textPdfBuf.slice());
    assert.strictEqual(originalExtracted.pageCount, 1, "Original document must contain 1 page");
    assert.ok(originalExtracted.text.length > 0, "Original document must have non-empty text");

    const preflight = await PdfPreflightInspector.inspect(textPdfBuf.buffer as ArrayBuffer);
    assert.strictEqual(preflight.pageCount, 1, "Preflight must detect 1 page");
    assert.strictEqual(preflight.signatureStatus, "NONE", "SignatureStatus must be NONE");

    const strategy = await CompressionStrategySelector.select(textPdfBuf.buffer as ArrayBuffer);
    assert.strictEqual(strategy, "NO_IMAGES_FOUND", "Pure text document must select NO_IMAGES_FOUND strategy");

    // Invoke FileKit's production LocalPdfCompressionEngine
    const compResult = await LocalPdfCompressionEngine.compress(
      textPdfBuf.buffer as ArrayBuffer,
      500000,
      undefined,
      undefined,
      true // isNodeTest
    );
    assert.ok(compResult.buffer.byteLength > 0, "Production compression engine must return buffer");

    // Extract text from production compression output using production PdfManipulationEngine
    const optimizedBytes = new Uint8Array(compResult.buffer);
    const optimizedExtracted = await PdfManipulationEngine.extractPdfText(optimizedBytes.slice());
    
    // Strict comparison of preserved text and page counts
    assert.strictEqual(optimizedExtracted.pageCount, originalExtracted.pageCount, "Page count must match exactly");
    assert.strictEqual(optimizedExtracted.text, originalExtracted.text, "Preserved text content must match original text exactly");

    // Independent Reader: pdfjs-dist structure extraction
    const pdfJsDoc = await pdfjsLib.getDocument({ data: optimizedBytes.slice() }).promise;
    assert.strictEqual(pdfJsDoc.numPages, 1, "pdfjs-dist page count must match");
    const page1 = await pdfJsDoc.getPage(1);
    assert.ok(page1.view.length === 4, "pdfjs-dist must successfully read page bounding box");

    record(
      "PDF-Compression",
      "Text Preservation & Strict Comparison",
      true,
      `Executed LocalPdfCompressionEngine; extracted text preserved identically (${originalExtracted.text.length} chars), verified via pdfjs-dist`
    );
  } catch (err: any) {
    record("PDF-Compression", "Text Preservation & Strict Comparison", false, err.message);
  }

  // 1b. Image-Bearing Document: Production Compression Pipeline & Viewport Preservation
  try {
    const jpgBytes = readFixture("sample_photo.jpg");
    const doc = await PDFDocument.create();
    const jpgImage = await doc.embedJpg(jpgBytes);
    const page = doc.addPage([jpgImage.width, jpgImage.height]);
    page.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
    const pdfWithImageBytes = await doc.save();

    // Verify preflight and strategy on image-bearing PDF
    const preflight = await PdfPreflightInspector.inspect(pdfWithImageBytes.buffer as ArrayBuffer);
    assert.strictEqual(preflight.imageCount, 1, "Preflight must discover 1 image XObject");
    const strategy = await CompressionStrategySelector.select(pdfWithImageBytes.buffer as ArrayBuffer);
    assert.strictEqual(strategy, "SAFE_LOCAL_COMPRESSION", "Document with JPEG image must select SAFE_LOCAL_COMPRESSION");

    // Invoke FileKit's production LocalPdfCompressionEngine
    const imageCompResult = await LocalPdfCompressionEngine.compress(
      pdfWithImageBytes.buffer as ArrayBuffer,
      300000,
      undefined,
      undefined,
      true // isNodeTest
    );
    assert.ok(imageCompResult.buffer.byteLength > 0, "Compressed output must be non-empty");
    assert.strictEqual(imageCompResult.imagesDiscovered, 1, "Engine must report 1 image discovered");

    // Independently verify compressed output with pdfjs-dist
    const pdfJsImageDoc = await pdfjsLib.getDocument({ data: new Uint8Array(imageCompResult.buffer).slice() }).promise;
    assert.strictEqual(pdfJsImageDoc.numPages, 1, "Image PDF output must have 1 valid page");
    const imgPage = await pdfJsImageDoc.getPage(1);
    const viewport = imgPage.getViewport({ scale: 1.0 });
    assert.strictEqual(viewport.width, jpgImage.width, "Page width must match original image width");
    assert.strictEqual(viewport.height, jpgImage.height, "Page height must match original image height");

    record(
      "PDF-Compression",
      "Image Document Production Pipeline",
      true,
      `Executed LocalPdfCompressionEngine on image PDF (discovered 1 image, verified ${viewport.width}x${viewport.height} viewport via pdfjs-dist)`
    );
  } catch (err: any) {
    record("PDF-Compression", "Image Document Production Pipeline", false, err.message);
  }

  // 2. Growth Guard: Verify Candidate Selection and Oversized Candidate Rejection
  try {
    const origBuf = new ArrayBuffer(500000);
    const smallerBuf = new ArrayBuffer(200000);
    const largerBuf = new ArrayBuffer(600000);

    // Test 2a: Beneficial candidate below target size
    const beneficialResult = selectCompressionResult({
      originalBuffer: origBuf,
      candidates: [{ buffer: smallerBuf, size: smallerBuf.byteLength, replacedCount: 2 }],
      targetSizeBytes: 250000,
      attemptsRun: 1,
    });
    assert.strictEqual(beneficialResult.outcome, "TARGET_ACHIEVED", "Candidate below target must yield TARGET_ACHIEVED");
    assert.strictEqual(beneficialResult.targetAchieved, true);
    assert.strictEqual(beneficialResult.buffer, smallerBuf);

    // Test 2b: Growth guard rejection when candidate size exceeds original
    const growthResult = selectCompressionResult({
      originalBuffer: origBuf,
      candidates: [{ buffer: largerBuf, size: largerBuf.byteLength, replacedCount: 2 }],
      targetSizeBytes: 250000,
      attemptsRun: 1,
    });
    assert.strictEqual(growthResult.outcome, "NO_BENEFICIAL_REDUCTION", "Candidate exceeding original must be rejected");
    assert.strictEqual(growthResult.stopReason, "OUTPUT_GROWTH", "Stop reason must be OUTPUT_GROWTH");
    assert.strictEqual(growthResult.targetAchieved, false);
    assert.strictEqual(growthResult.buffer, origBuf, "Must revert to originalBuffer to prevent output growth");

    record(
      "PDF-Engine",
      "Growth Guard & Candidate Selection",
      true,
      "Exercised both target achievement and oversized candidate rejection (reverting to originalBuffer)"
    );
  } catch (err: any) {
    record("PDF-Engine", "Growth Guard & Candidate Selection", false, err.message);
  }

  // 3. PDF Page Manipulation: Production Engine Invocations with Page Order & Text Assertions
  try {
    // Construct a multi-page document with distinct text per page
    const sampleDoc = await PDFDocument.create();
    const font = await sampleDoc.embedFont(StandardFonts.Helvetica);

    const p1 = sampleDoc.addPage([600, 400]);
    p1.drawText("PAGE_ORDER_1_FIRST_HEADER", { x: 50, y: 350, size: 20, font, color: rgb(0, 0, 0) });

    const p2 = sampleDoc.addPage([600, 400]);
    p2.drawText("PAGE_ORDER_2_SECOND_FOOTER", { x: 50, y: 350, size: 20, font, color: rgb(0, 0, 0) });

    const twoPageBytes = await sampleDoc.save();

    // Invoke FileKit's production reversePdf engine
    const reversedBytes = await PdfManipulationEngine.reversePdf(twoPageBytes);
    
    // Independently inspect reversed output with PdfManipulationEngine
    const reversedExtracted = await PdfManipulationEngine.extractPdfText(reversedBytes.slice());
    assert.strictEqual(reversedExtracted.pageCount, 2, "Reversed document must have 2 pages");
    assert.ok(
      reversedExtracted.pageTexts[0].includes("PAGE_ORDER_2_SECOND_FOOTER"),
      "Page 1 of reversed PDF must contain content from original page 2"
    );
    assert.ok(
      reversedExtracted.pageTexts[1].includes("PAGE_ORDER_1_FIRST_HEADER"),
      "Page 2 of reversed PDF must contain content from original page 1"
    );

    // Invoke FileKit's production addBlankPage engine
    const expandedBytes = await PdfManipulationEngine.addBlankPage(reversedBytes, { position: "end" });
    const expandedDoc = await pdfjsLib.getDocument({ data: expandedBytes.slice() }).promise;
    assert.strictEqual(expandedDoc.numPages, 3, "Expanded document must contain exactly 3 pages");

    record(
      "PDF-Organize",
      "Production Manipulation & Page Order Integrity",
      true,
      "Reversed page text sequence and added blank page using PdfManipulationEngine"
    );
  } catch (err: any) {
    record("PDF-Organize", "Production Manipulation & Page Order Integrity", false, err.message);
  }

  // 4. Production Watermark Engine & Watermark Text Survival in Rendered Output
  try {
    const textPdfBuf = readFixture("text_simple.pdf");
    const watermarkText = "CONFIDENTIAL_PRODUCTION_AUDIT";

    // Invoke FileKit's actual production watermark engine
    const watermarkResult = await executePdfWatermark(
      textPdfBuf,
      {
        type: "text",
        text: watermarkText,
        fontSize: 32,
        fontColor: "#FF0000",
        opacity: 0.7,
        rotation: 45,
        positionPreset: "center",
        targetPagesMode: "all",
      },
      "watermarked.pdf",
      undefined,
      true, // isNodeTest
      "MAIN_THREAD"
    );

    assert.ok(watermarkResult.fileData.length > 0, "Watermark engine must produce output bytes");
    assert.strictEqual(watermarkResult.pageCount, 1, "Output page count must match");

    // Independently inspect rendered output using pdfjs-dist
    const pdfJsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(watermarkResult.fileData) }).promise;
    const page1 = await pdfJsDoc.getPage(1);
    const textContent = await page1.getTextContent();

    const hasWatermarkText = textContent.items.some(
      (item: any) => typeof item.str === "string" && item.str.includes(watermarkText)
    );
    assert.ok(hasWatermarkText, "Watermark text must survive in independent rendered text stream");

    record(
      "PDF-Organize",
      "Production Watermark Workflow & Text Survival",
      true,
      `Executed executePdfWatermark; verified "${watermarkText}" survived in pdfjs-dist text stream`
    );
  } catch (err: any) {
    record("PDF-Organize", "Production Watermark Workflow & Text Survival", false, err.message);
  }

  // 5. Boundary Defense: Encrypted and Password-Protected Rejection
  try {
    const encBuf = readFixture("encrypted_aes256.pdf");
    let caughtEnc = false;
    try {
      await PdfPreflightInspector.inspect(encBuf.buffer as ArrayBuffer);
    } catch (e: any) {
      caughtEnc = e.message.includes("PDF_ENCRYPTED_OR_LOCKED");
    }
    assert.ok(caughtEnc, "Encrypted PDF must throw PDF_ENCRYPTED_OR_LOCKED");

    const pwdBuf = readFixture("password_protected.pdf");
    let caughtPwd = false;
    try {
      await PdfPreflightInspector.inspect(pwdBuf.buffer as ArrayBuffer);
    } catch (e: any) {
      caughtPwd = e.message.includes("PDF_ENCRYPTED_OR_LOCKED");
    }
    assert.ok(caughtPwd, "Password protected PDF must throw PDF_ENCRYPTED_OR_LOCKED");

    record("PDF-Boundary", "Encrypted / Locked Defense", true, "Safely rejected AES-256 and password protected documents");
  } catch (err: any) {
    record("PDF-Boundary", "Encrypted / Locked Defense", false, err.message);
  }

  // 6. Boundary Defense: Structurally Signed Documents
  try {
    const signedDoc = await PDFDocument.create();
    const page = signedDoc.addPage();
    const vDict = signedDoc.context.obj({
      ByteRange: [0, 100, 200, 300],
      Contents: "<00112233445566778899aabbccddeeff>",
    });
    const fieldDict = signedDoc.context.obj({
      Type: "Annot",
      Subtype: "Widget",
      FT: "Sig",
      V: signedDoc.context.register(vDict),
      Rect: [0, 0, 100, 100],
    });
    page.node.addAnnot(signedDoc.context.register(fieldDict));
    const signedBytes = await signedDoc.save();

    let caughtSig = false;
    try {
      await PdfPreflightInspector.inspect(signedBytes.buffer as ArrayBuffer);
    } catch (e: any) {
      caughtSig = e.message.includes("UNSUPPORTED_SIGNED_DOCUMENT");
    }
    assert.ok(caughtSig, "Structurally signed document must throw UNSUPPORTED_SIGNED_DOCUMENT");

    record("PDF-Boundary", "Digital Signature Defense", true, "Protected cryptographically signed document from alteration");
  } catch (err: any) {
    record("PDF-Boundary", "Digital Signature Defense", false, err.message);
  }
}

async function runCoreImageQualityAudit() {
  console.log("\n==================================================");
  console.log("STAGE 2: CORE IMAGE ENCODING, DECODING & PRODUCTION WORKFLOWS");
  console.log("==================================================");

  // 1. BMP Encoder & Pixel-Level Binary Decoding
  try {
    const width = 16;
    const height = 16;
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < rgba.length; i += 4) {
      rgba[i] = 255;     // R
      rgba[i + 1] = 128; // G
      rgba[i + 2] = 64;  // B
      rgba[i + 3] = 255; // A
    }

    const bmpBytes = BmpEncoder.encode({ width, height, data: rgba } as any);
    const decoded = decodeBmp24(bmpBytes);

    assert.strictEqual(decoded.width, width, "Decoded width must match");
    assert.strictEqual(decoded.height, height, "Decoded height must match");

    // Independently verify decoded pixel values at corners and center
    const topLeft = decoded.getPixel(0, 0);
    assert.strictEqual(topLeft.r, 255, "Top-left red channel mismatch");
    assert.strictEqual(topLeft.g, 128, "Top-left green channel mismatch");
    assert.strictEqual(topLeft.b, 64, "Top-left blue channel mismatch");

    const center = decoded.getPixel(8, 8);
    assert.strictEqual(center.r, 255, "Center red channel mismatch");
    assert.strictEqual(center.g, 128, "Center green channel mismatch");
    assert.strictEqual(center.b, 64, "Center blue channel mismatch");

    record(
      "Image-Engine",
      "BMP 24-bit BGR Encoding & Pixel Decoding",
      true,
      `Encoded and decoded ${width}x${height} BMP; verified exact RGB(255, 128, 64) pixel match`
    );
  } catch (err: any) {
    record("Image-Engine", "BMP 24-bit BGR Encoding & Pixel Decoding", false, err.message);
  }

  // 2. Genuine Multi-Resolution ICO Packaging & Independent Image Decoding
  try {
    // Generate genuine specification-compliant PNG images with declared dimensions
    const genuine16x16 = createGenuinePng(16, 16, 255, 0, 0); // Red 16x16
    const genuine32x32 = createGenuinePng(32, 32, 0, 0, 255); // Blue 32x32

    const icoBuffer = IcoEncoder.encode([
      { width: 16, height: 16, pngBuffer: genuine16x16 },
      { width: 32, height: 32, pngBuffer: genuine32x32 },
    ]);
    const icoBytes = new Uint8Array(icoBuffer);
    const view = new DataView(icoBuffer);

    // Verify ICONDIR header
    assert.strictEqual(view.getUint16(0, true), 0, "ICO reserved field must be 0");
    assert.strictEqual(view.getUint16(2, true), 1, "ICO type field must be 1 (icon)");
    assert.strictEqual(view.getUint16(4, true), 2, "ICO image count must be 2");

    // Directory entry 1 (16x16)
    const icon1Width = view.getUint8(6);
    const icon1Height = view.getUint8(7);
    const icon1Size = view.getUint32(14, true);
    const icon1Offset = view.getUint32(18, true);
    assert.strictEqual(icon1Width, 16, "Entry 1 directory width must be 16");
    assert.strictEqual(icon1Height, 16, "Entry 1 directory height must be 16");

    // Directory entry 2 (32x32)
    const icon2Width = view.getUint8(22);
    const icon2Height = view.getUint8(23);
    const icon2Size = view.getUint32(30, true);
    const icon2Offset = view.getUint32(34, true);
    assert.strictEqual(icon2Width, 32, "Entry 2 directory width must be 32");
    assert.strictEqual(icon2Height, 32, "Entry 2 directory height must be 32");

    // Unpack sub-image 1 and independently decode via PDFDocument.embedPng
    const subImage1Bytes = icoBytes.slice(icon1Offset, icon1Offset + icon1Size);
    const testDoc1 = await PDFDocument.create();
    const embeddedImg1 = await testDoc1.embedPng(subImage1Bytes);
    assert.strictEqual(embeddedImg1.width, 16, "Decoded sub-image 1 width must be 16");
    assert.strictEqual(embeddedImg1.height, 16, "Decoded sub-image 1 height must be 16");

    // Unpack sub-image 2 and independently decode via PDFDocument.embedPng
    const subImage2Bytes = icoBytes.slice(icon2Offset, icon2Offset + icon2Size);
    const testDoc2 = await PDFDocument.create();
    const embeddedImg2 = await testDoc2.embedPng(subImage2Bytes);
    assert.strictEqual(embeddedImg2.width, 32, "Decoded sub-image 2 width must be 32");
    assert.strictEqual(embeddedImg2.height, 32, "Decoded sub-image 2 height must be 32");

    record(
      "Image-Engine",
      "Genuine Multi-Res ICO Packaging & Decoding",
      true,
      "Packaged genuine 16x16 and 32x32 PNGs; unpacked sub-streams and confirmed exact dimensions via decoder"
    );
  } catch (err: any) {
    record("Image-Engine", "Genuine Multi-Res ICO Packaging & Decoding", false, err.message);
  }

  // 3. Image to PDF Production Engine Workflow & Independent Viewport Inspection
  try {
    const genuinePng = createGenuinePng(64, 48, 30, 140, 220);
    const file = new File([genuinePng], "source_image.png", { type: "image/png" });

    // Invoke FileKit's production ImageToPdfEngine
    const conversionResult = await ImageToPdfEngine.convert({
      items: [
        {
          id: "item-1",
          file,
          name: "source_image.png",
          size: genuinePng.byteLength,
          mimeType: "image/png",
          previewUrl: "",
          rotation: 0,
        },
      ],
      settings: {
        pageSize: "FIT_IMAGE",
        orientation: "AUTO",
        margin: "NONE",
        placement: "FIT",
        imageQuality: 1.0,
      },
    });

    assert.strictEqual(conversionResult.pageCount, 1, "Image to PDF result must report 1 page");
    const outputBuffer = await conversionResult.pdfBlob.arrayBuffer();

    // Independently verify rendered PDF with pdfjs-dist
    const pdfJsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(outputBuffer) }).promise;
    assert.strictEqual(pdfJsDoc.numPages, 1, "Rendered PDF must contain 1 page");

    const page1 = await pdfJsDoc.getPage(1);
    const viewport = page1.getViewport({ scale: 1.0 });
    assert.strictEqual(viewport.width, 64, "Page width must match embedded image width (64)");
    assert.strictEqual(viewport.height, 48, "Page height must match embedded image height (48)");

    record(
      "Image-To-PDF",
      "Production ImageToPdfEngine Workflow",
      true,
      "Executed ImageToPdfEngine.convert; confirmed 64x48 viewport with pdfjs-dist"
    );
  } catch (err: any) {
    record("Image-To-PDF", "Production ImageToPdfEngine Workflow", false, err.message);
  }
}

async function main() {
  await runCorePdfQualityAudit();
  await runCoreImageQualityAudit();

  console.log("\n==================================================");
  console.log("QUALITY AUDIT SUMMARY");
  console.log("==================================================");
  const passedCount = auditLog.filter((a) => a.status === "PASSED").length;
  const failedCount = auditLog.filter((a) => a.status === "FAILED").length;
  console.log(`Total Checks: ${auditLog.length}`);
  console.log(`Passed:       ${passedCount}`);
  console.log(`Failed:       ${failedCount}`);

  if (failedCount > 0) {
    console.error("❌ Quality audit failed!");
    process.exit(1);
  } else {
    console.log("✅ All core PDF and Image output quality checks passed successfully!");
  }
}

main().catch((err) => {
  console.error("Unhandled audit failure:", err);
  process.exit(1);
});
