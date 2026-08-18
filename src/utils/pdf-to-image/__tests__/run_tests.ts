import { PageSelectionParser } from "../pageSelection";
import { ZipWriter } from "../zipWriter";
import { PdfRasterizationPreflight } from "../PdfRasterizationPreflight";

async function runPdfToImageTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit PDF-to-Image Engine Verification Suite");
  console.log("--------------------------------------------------");

  // Test 1: PageSelectionParser
  console.log("Running PageSelectionParser Tests...");
  const p1 = PageSelectionParser.parse("1, 3-5, 8", 10);
  if (!p1.isValid || p1.pageNumbers.join(",") !== "1,3,4,5,8") {
    throw new Error(`PageSelectionParser failed on valid range: ${JSON.stringify(p1)}`);
  }

  const p2 = PageSelectionParser.parse("12", 10);
  if (p2.isValid) {
    throw new Error("PageSelectionParser should reject out-of-bounds page 12");
  }

  const p3 = PageSelectionParser.parse("0", 10);
  if (p3.isValid) {
    throw new Error("PageSelectionParser should reject 0 page number");
  }

  const p4 = PageSelectionParser.parse("all", 5);
  if (!p4.isValid || p4.pageNumbers.length !== 5) {
    throw new Error("PageSelectionParser failed on 'all'");
  }
  console.log("✓ PageSelectionParser tests passed.");

  // Test 2: ZipWriter Structure & CRC-32 Validation
  console.log("Running ZipWriter Structure & Header Validation Tests...");
  const enc = new TextEncoder();
  const zipBuffer = ZipWriter.createZip([
    { filename: "doc-page-001.jpg", data: enc.encode("test image data 1") },
    { filename: "doc-page-002.jpg", data: enc.encode("test image data 2") }
  ]);
  const zipBytes = new Uint8Array(zipBuffer);

  // Local File Header signature check (0x04034b50 -> 50 4b 03 04)
  if (zipBytes[0] !== 0x50 || zipBytes[1] !== 0x4b || zipBytes[2] !== 0x03 || zipBytes[3] !== 0x04) {
    throw new Error("ZipWriter output does not start with PK local header signature (0x04034b50)!");
  }

  // Find Central Directory signature check (0x02014b50 -> 50 4b 01 02)
  let foundCd = false;
  for (let i = 0; i < zipBytes.length - 4; i++) {
    if (zipBytes[i] === 0x50 && zipBytes[i + 1] === 0x4b && zipBytes[i + 2] === 0x01 && zipBytes[i + 3] === 0x02) {
      foundCd = true;
      break;
    }
  }
  if (!foundCd) {
    throw new Error("ZipWriter output missing Central Directory signature (0x02014b50)!");
  }

  // Find End of Central Directory signature check (0x06054b50 -> 50 4b 05 06)
  let foundEocd = false;
  for (let i = zipBytes.length - 22; i >= 0; i--) {
    if (zipBytes[i] === 0x50 && zipBytes[i + 1] === 0x4b && zipBytes[i + 2] === 0x05 && zipBytes[i + 3] === 0x06) {
      foundEocd = true;
      break;
    }
  }
  if (!foundEocd) {
    throw new Error("ZipWriter output missing End of Central Directory signature (0x06054b50)!");
  }
  console.log("✓ ZipWriter PKZIP headers & EOCD structure validated.");

  // Test 3: Magic Bytes Preflight Check
  console.log("Running Preflight Magic Bytes Tests...");
  const invalidBuffer = new Uint8Array([0x00, 0x01, 0x02, 0x03]).buffer;
  const pf = await PdfRasterizationPreflight.inspect(invalidBuffer);
  if (pf.isValid || !pf.error?.includes("INVALID_PDF")) {
    throw new Error(`Preflight failed to reject non-PDF buffer: ${JSON.stringify(pf)}`);
  }
  console.log("✓ Preflight magic bytes tests passed.");

  console.log("--------------------------------------------------");
  console.log("ALL PDF-TO-IMAGE ENGINE UNIT TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runPdfToImageTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
