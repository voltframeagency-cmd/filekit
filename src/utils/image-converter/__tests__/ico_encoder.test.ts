import { IcoEncoder } from "../IcoEncoder";

export function runIcoEncoderTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit ICO Binary Encoder Verification Suite");
  console.log("--------------------------------------------------");

  // Test 1: Generate valid mock PNG sub-images
  // A minimal PNG signature is 8 bytes: 89 50 4E 47 0D 0A 1A 0A
  const mockPng16 = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x10]);
  const mockPng32 = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x20, 0x20]);

  const icoBuffer = IcoEncoder.encode([
    { width: 16, height: 16, pngBuffer: mockPng16 },
    { width: 32, height: 32, pngBuffer: mockPng32 }
  ]);

  const icoBytes = new Uint8Array(icoBuffer);
  const view = new DataView(icoBuffer);

  // Assertion 1: ICO Header
  if (view.getUint16(0, true) !== 0 || view.getUint16(2, true) !== 1 || view.getUint16(4, true) !== 2) {
    throw new Error("ICO Header verification failed!");
  }
  console.log("✓ ICONDIR header (0x0000 0x0001 count=2) verified.");

  // Assertion 2: Entry 1 (16x16)
  if (view.getUint8(6) !== 16 || view.getUint8(7) !== 16) {
    throw new Error("Entry 1 dimensions mismatch!");
  }
  const entry1Size = view.getUint32(6 + 8, true);
  const entry1Offset = view.getUint32(6 + 12, true);
  if (entry1Size !== mockPng16.byteLength || entry1Offset !== 6 + 32) {
    throw new Error(`Entry 1 offset/size mismatch: size=${entry1Size}, offset=${entry1Offset}`);
  }
  console.log("✓ ICONDIRENTRY 1 (16x16) offset and size verified.");

  // Assertion 3: Entry 2 (32x32)
  if (view.getUint8(22) !== 32 || view.getUint8(23) !== 32) {
    throw new Error("Entry 2 dimensions mismatch!");
  }
  const entry2Size = view.getUint32(22 + 8, true);
  const entry2Offset = view.getUint32(22 + 12, true);
  if (entry2Size !== mockPng32.byteLength || entry2Offset !== entry1Offset + entry1Size) {
    throw new Error(`Entry 2 offset/size mismatch: size=${entry2Size}, offset=${entry2Offset}`);
  }
  console.log("✓ ICONDIRENTRY 2 (32x32) offset and size verified.");

  // Assertion 4: Sub-image payload integrity
  for (let i = 0; i < mockPng16.length; i++) {
    if (icoBytes[entry1Offset + i] !== mockPng16[i]) {
      throw new Error("Sub-image 1 payload corruption!");
    }
  }
  for (let i = 0; i < mockPng32.length; i++) {
    if (icoBytes[entry2Offset + i] !== mockPng32[i]) {
      throw new Error("Sub-image 2 payload corruption!");
    }
  }
  console.log("✓ Sub-image PNG binary payloads verified intact.");

  console.log("--------------------------------------------------");
  console.log("ALL ICO ENCODER TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  try {
    runIcoEncoderTests();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
