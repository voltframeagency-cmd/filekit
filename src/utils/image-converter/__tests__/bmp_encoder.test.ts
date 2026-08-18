import { BmpEncoder } from "../BmpEncoder";

console.log("--------------------------------------------------");
console.log("Starting FileKit BMP Binary Encoder Verification");
console.log("--------------------------------------------------");

async function runBmpEncoderTests() {
  console.log("Running BmpEncoder Tests...");

  // Test 1: 4x4 image (Row size is exactly 4 * 3 = 12 bytes, already multiple of 4, 0 padding bytes)
  const width = 4;
  const height = 4;
  const rgba = new Uint8ClampedArray(width * height * 4);

  // Fill pixel (0, 0) with Pure Red (255, 0, 0, 255)
  rgba[0] = 255;
  rgba[1] = 0;
  rgba[2] = 0;
  rgba[3] = 255;

  const mockImageData = {
    width,
    height,
    data: rgba,
    colorSpace: "srgb" as PredefinedColorSpace,
  };

  const bmpBytes = BmpEncoder.encode(mockImageData);
  const view = new DataView(bmpBytes.buffer);

  // 1. Validate 'BM' signature
  if (bmpBytes[0] !== 0x42 || bmpBytes[1] !== 0x4d) {
    throw new Error(`Invalid BMP signature: expected 0x42 0x4D ('BM'), got ${bmpBytes[0]} ${bmpBytes[1]}`);
  }

  // 2. Validate BITMAPFILEHEADER & BITMAPINFOHEADER sizes
  const fileSize = view.getUint32(2, true);
  const pixelOffset = view.getUint32(10, true);
  const infoHeaderSize = view.getUint32(14, true);

  if (pixelOffset !== 54) {
    throw new Error(`Expected pixel offset 54, got ${pixelOffset}`);
  }
  if (infoHeaderSize !== 40) {
    throw new Error(`Expected info header size 40, got ${infoHeaderSize}`);
  }

  // 3. Validate width, height, and bits per pixel
  const outW = view.getInt32(18, true);
  const outH = view.getInt32(22, true);
  const bpp = view.getUint16(28, true);

  if (outW !== 4 || outH !== 4 || bpp !== 24) {
    throw new Error(`BMP header mismatch: width=${outW}, height=${outH}, bpp=${bpp}`);
  }

  // Test 2: Odd width (5x3 image) requiring row padding
  // Row size = ceil(5 * 3 / 4) * 4 = 16 bytes (15 data bytes + 1 padding byte)
  const oddW = 5;
  const oddH = 3;
  const oddRgba = new Uint8ClampedArray(oddW * oddH * 4);
  const oddImageData = {
    width: oddW,
    height: oddH,
    data: oddRgba,
    colorSpace: "srgb" as PredefinedColorSpace,
  };

  const oddBmp = BmpEncoder.encode(oddImageData);
  const expectedOddSize = 14 + 40 + 16 * 3; // 54 + 48 = 102 bytes
  if (oddBmp.length !== expectedOddSize) {
    throw new Error(`Odd width row padding mismatch: expected ${expectedOddSize} bytes, got ${oddBmp.length}`);
  }

  console.log("✓ BmpEncoder 24-bit Windows Bitmap binary headers and row padding verified.");
}

async function main() {
  await runBmpEncoderTests();
  console.log("--------------------------------------------------");
  console.log("ALL BMP ENCODER TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

main().catch((err) => {
  console.error("BMP encoder test failed:", err);
  process.exit(1);
});
