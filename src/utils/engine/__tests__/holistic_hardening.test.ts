import { ImageTransformEngine } from "../../image-transform/ImageTransformEngine";
import { PdfManipulationEngine } from "../../pdf-manipulation/PdfManipulationEngine";

export function runHolisticHardeningTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Holistic Engine Hardening & Resilience Suite");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. Image Dimension Clamping & Safe Bounds (Prevents Mobile OOM Crashes)
  console.log("▶ Testing Image Canvas Safety Bounds (Max 8192px)...");
  
  // Normal image (4000x3000) -> untouched
  const normal = ImageTransformEngine.getSafeDimensions(4000, 3000);
  if (normal.scaled || normal.width !== 4000 || normal.height !== 3000) {
    throw new Error("Normal dimensions were incorrectly scaled");
  }

  // Extreme wide camera photo (16000x8000) -> scaled down to 8192x4096 (2:1 ratio preserved)
  const hugeWide = ImageTransformEngine.getSafeDimensions(16000, 8000);
  if (!hugeWide.scaled || hugeWide.width !== 8192 || hugeWide.height !== 4096) {
    throw new Error(`Huge wide image scaled incorrectly: got ${hugeWide.width}x${hugeWide.height}`);
  }

  // Extreme tall banner (4000x12000) -> scaled down to 2731x8192 (1:3 ratio preserved)
  const hugeTall = ImageTransformEngine.getSafeDimensions(4000, 12000);
  if (!hugeTall.scaled || hugeTall.height !== 8192 || Math.abs(hugeTall.width - 2731) > 2) {
    throw new Error(`Huge tall image scaled incorrectly: got ${hugeTall.width}x${hugeTall.height}`);
  }
  totalAssertions += 6;
  console.log("✓ Canvas safe dimension clamping and aspect ratio fidelity verified.");

  // 2. Transparency Matte Export Defense
  console.log("▶ Testing Alpha Matte Background Compositing...");
  // Test mock canvas with transparent pixels
  class MockCanvas {
    width: number;
    height: number;
    filledColor: string | null = null;
    private ctx: any;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.ctx = {
        fillStyle: "",
        fillRect: (x: number, y: number, w: number, h: number) => {
          this.filledColor = this.ctx.fillStyle;
        },
        drawImage: () => {}
      };
    }

    getContext(type: string) {
      return this.ctx;
    }
  }

  // In Node environment, test prepareCanvasForExport logic
  const mockSrc = new MockCanvas(200, 200) as any;
  (globalThis as any).OffscreenCanvas = MockCanvas;

  const jpegExport = ImageTransformEngine.prepareCanvasForExport(mockSrc, "image/jpeg", "#FFFFFF") as any;
  if (jpegExport.filledColor !== "#FFFFFF") {
    throw new Error(`JPEG export matte fill failed: expected #FFFFFF, got ${jpegExport.filledColor}`);
  }

  const bmpExport = ImageTransformEngine.prepareCanvasForExport(mockSrc, "image/bmp", "#FFFFFF") as any;
  if (bmpExport.filledColor !== "#FFFFFF") {
    throw new Error(`BMP export matte fill failed: expected #FFFFFF, got ${bmpExport.filledColor}`);
  }

  const pngExport = ImageTransformEngine.prepareCanvasForExport(mockSrc, "image/png") as any;
  if (pngExport.filledColor !== null) {
    throw new Error("PNG export should preserve alpha and not fill matte background");
  }
  totalAssertions += 3;
  console.log("✓ Alpha matte compositing for opaque target formats (JPEG/BMP) verified.");

  // 3. PDF Integrity & Password-Protected File Detection
  console.log("▶ Testing PDF Format Integrity & Encryption Detection...");
  
  // Empty buffer
  const emptyRes = PdfManipulationEngine.validatePdfIntegrity(new Uint8Array(0));
  if (emptyRes.isValid || !emptyRes.error?.includes("empty or corrupted")) {
    throw new Error("Empty PDF buffer failed to trigger validation error");
  }

  // Corrupted non-PDF header
  const corruptHeader = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // GIF header
  const corruptRes = PdfManipulationEngine.validatePdfIntegrity(corruptHeader);
  if (corruptRes.isValid || !corruptRes.error?.includes("Missing %PDF-")) {
    throw new Error("Non-PDF buffer failed to trigger header validation error");
  }

  // Valid standard PDF bytes
  const validHeaderStr = "%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF";
  const validPdfBytes = new TextEncoder().encode(validHeaderStr);
  const validRes = PdfManipulationEngine.validatePdfIntegrity(validPdfBytes);
  if (!validRes.isValid || validRes.isEncrypted || validRes.error) {
    throw new Error("Valid PDF was incorrectly flagged as invalid or encrypted");
  }

  // Password-protected encrypted PDF bytes
  const encryptedPdfStr = "%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R /Encrypt 2 0 R >>\n%%EOF";
  const encryptedPdfBytes = new TextEncoder().encode(encryptedPdfStr);
  const encryptedRes = PdfManipulationEngine.validatePdfIntegrity(encryptedPdfBytes);
  if (!encryptedRes.isValid || !encryptedRes.isEncrypted || !encryptedRes.error?.includes("password-protected")) {
    throw new Error("Encrypted PDF failed to detect /Encrypt dictionary");
  }
  totalAssertions += 8;
  console.log("✓ PDF header validation and password protection detection verified.");

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Holistic Hardening assertions passed cleanly!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runHolisticHardeningTests();
}
