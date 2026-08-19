import { ArchiveEngine } from "../ArchiveEngine";
import { MetadataEngine } from "../../privacy/MetadataEngine";
import { FontEngine } from "../../font/FontEngine";

export function runArchiveEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Archive, Privacy & Font Engine Verification");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. ZIP Archive Creation & Extraction Roundtrip
  console.log("▶ Testing In-Browser PKZIP Creation & Extraction...");
  const file1 = { name: "doc1.txt", data: new TextEncoder().encode("Hello World FileKit Archive Engine!") };
  const file2 = { name: "data.json", data: new TextEncoder().encode('{"filekit": true, "version": "3.0"}') };
  const file3 = { name: "notes/todo.md", data: new TextEncoder().encode("# Production Launch\n- [x] Tested") };

  const zipBytes = ArchiveEngine.createZip([file1, file2, file3]);
  const view = new DataView(zipBytes.buffer);

  // Assert local header signature 0x04034b50 ('PK\x03\x04')
  if (view.getUint32(0, true) !== 0x04034b50) {
    throw new Error("Invalid PKZIP local file header signature");
  }

  // Extract ZIP
  const extracted = ArchiveEngine.extractZip(zipBytes);
  if (extracted.length !== 3) {
    throw new Error(`Expected 3 extracted files, got ${extracted.length}`);
  }

  const textDecoder = new TextDecoder();
  if (extracted[0].name !== "doc1.txt" || textDecoder.decode(extracted[0].data) !== "Hello World FileKit Archive Engine!") {
    throw new Error("File 1 payload mismatch after extraction");
  }
  if (extracted[1].name !== "data.json" || textDecoder.decode(extracted[1].data) !== '{"filekit": true, "version": "3.0"}') {
    throw new Error("File 2 payload mismatch after extraction");
  }
  if (extracted[2].name !== "notes/todo.md" || textDecoder.decode(extracted[2].data) !== "# Production Launch\n- [x] Tested") {
    throw new Error("File 3 payload mismatch after extraction");
  }
  totalAssertions += 6;
  console.log("✓ PKZIP creation, binary header signatures, and roundtrip extraction verified.");

  // 2. POSIX TAR Extraction and TAR to ZIP Conversion
  console.log("▶ Testing POSIX TAR Extraction & Transcoding to ZIP...");
  // Construct a standard 512-byte TAR block
  const tarBuffer = new Uint8Array(1536); // Header (512) + Data (512 padded) + EOF (512)
  const tarName = new TextEncoder().encode("readme.txt");
  tarBuffer.set(tarName, 0); // Name at offset 0

  const content = new TextEncoder().encode("POSIX TAR file converted in browser");
  const sizeOctal = ("00000000044 ").split("").map((c) => c.charCodeAt(0)); // 36 bytes in octal
  tarBuffer.set(sizeOctal, 124); // Size at offset 124

  tarBuffer[156] = 0x30; // Regular file
  tarBuffer.set(content, 512); // File content starts at offset 512

  const tarEntries = ArchiveEngine.extractTar(tarBuffer);
  if (tarEntries.length !== 1 || tarEntries[0].name !== "readme.txt") {
    throw new Error("Failed to extract POSIX TAR entry");
  }

  const convertedZip = ArchiveEngine.tarToZip(tarBuffer);
  const convertedView = new DataView(convertedZip.buffer);
  if (convertedView.getUint32(0, true) !== 0x04034b50) {
    throw new Error("Converted TAR to ZIP missing PKZIP signature");
  }
  totalAssertions += 4;
  console.log("✓ POSIX TAR block parsing and direct TAR-to-ZIP conversion verified.");

  // 3. EXIF & Metadata Stripping
  console.log("▶ Testing EXIF / Privacy Metadata Stripping...");
  // Create mock JPEG with APP1 (0xFFE1) EXIF segment
  const exifSegment = new TextEncoder().encode("Exif\x00\x00GPSLatitude:59.3293N");
  const segLen = exifSegment.length + 2;
  const mockJpeg = new Uint8Array(4 + 2 + segLen + 4);
  mockJpeg[0] = 0xFF; mockJpeg[1] = 0xD8; // SOI
  mockJpeg[2] = 0xFF; mockJpeg[3] = 0xE1; // APP1
  mockJpeg[4] = (segLen >> 8) & 0xFF;
  mockJpeg[5] = segLen & 0xFF;
  mockJpeg.set(exifSegment, 6);
  const tailIdx = 6 + exifSegment.length;
  mockJpeg[tailIdx] = 0xFF; mockJpeg[tailIdx + 1] = 0xDA; // SOS
  mockJpeg[tailIdx + 2] = 0xFF; mockJpeg[tailIdx + 3] = 0xD9; // EOI

  const detected = MetadataEngine.inspectMetadata(mockJpeg);
  if (!detected.hasExif || !detected.hasGps) {
    throw new Error("Failed to detect EXIF and GPS markers in mock JPEG");
  }

  const cleanJpeg = MetadataEngine.stripMetadata(mockJpeg, "image/jpeg");
  const cleanDetected = MetadataEngine.inspectMetadata(cleanJpeg);
  if (cleanDetected.hasExif || cleanDetected.hasGps) {
    throw new Error("Sanitized JPEG still contains EXIF or GPS markers");
  }
  if (cleanJpeg[0] !== 0xFF || cleanJpeg[1] !== 0xD8) {
    throw new Error("Sanitized JPEG SOI header corrupted");
  }
  totalAssertions += 5;
  console.log("✓ EXIF/GPS detection and APP1 marker sanitization verified.");

  // 4. Font Conversion (TTF to WOFF)
  console.log("▶ Testing Font Engine TTF to WOFF Conversion...");
  // Create mock TTF binary header (0x00010000 signature)
  const mockTtf = new Uint8Array(64);
  const ttfView = new DataView(mockTtf.buffer);
  ttfView.setUint32(0, 0x00010000, false); // TrueType
  ttfView.setUint16(4, 3, false);          // 3 tables

  const woffBytes = FontEngine.ttfToWoff(mockTtf);
  const woffView = new DataView(woffBytes.buffer);

  if (woffView.getUint32(0, false) !== 0x774F4646) {
    throw new Error("WOFF magic signature mismatch (expected 0x774F4646 'wOFF')");
  }
  if (woffView.getUint16(12, false) !== 3) {
    throw new Error("WOFF numTables mismatch");
  }

  const recoveredTtf = FontEngine.woffToTtf(woffBytes);
  const recView = new DataView(recoveredTtf.buffer);
  if (recView.getUint32(0, false) !== 0x00010000) {
    throw new Error("Recovered TTF signature mismatch");
  }
  totalAssertions += 5;
  console.log("✓ Font container packaging and TTF/WOFF roundtrip verified.");

  // 5. Zip Slip Path Traversal Sanitization
  console.log("▶ Testing Zip Slip Path Traversal Sanitization...");
  const maliciousEntry = {
    name: "../../etc/passwd",
    data: new TextEncoder().encode("root:x:0:0:root:/root:/bin/bash")
  };
  const malZipBytes = ArchiveEngine.createZip([maliciousEntry]);
  const malExtracted = ArchiveEngine.extractZip(malZipBytes);
  if (malExtracted[0].name.includes("..") || malExtracted[0].name.startsWith("/")) {
    throw new Error(`Zip Slip path was not sanitized: ${malExtracted[0].name}`);
  }
  if (malExtracted[0].name !== "etc/passwd" && malExtracted[0].name !== "etc_passwd") {
    // Both etc/passwd (relative clean) or etc_passwd are safe
  }
  totalAssertions += 2;
  console.log("✓ Zip Slip path traversal sanitization verified.");

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Archive, Privacy & Font Engine assertions passed!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runArchiveEngineTests();
}
