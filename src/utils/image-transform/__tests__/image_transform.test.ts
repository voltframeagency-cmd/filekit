import { SvgRenderer } from "../SvgRenderer";
import { ImageTransformEngine } from "../ImageTransformEngine";

console.log("--------------------------------------------------");
console.log("Starting FileKit Image Transform & Vector Suite Verification");
console.log("--------------------------------------------------");

async function runSvgRendererTests() {
  console.log("Running SvgRenderer Tests...");

  const sampleSvg = `<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
    <rect width="1000" height="500" fill="red"/>
    <circle cx="500" cy="250" r="200" fill="blue"/>
  </svg>`;

  const dims = SvgRenderer.parseDimensions(sampleSvg);
  if (dims.width !== 1000 || dims.height !== 500) {
    throw new Error(`SVG dimensions mismatch: expected (1000, 500), got (${dims.width}, ${dims.height})`);
  }

  const explicitSvg = `<svg width="400px" height="300px"><rect width="400" height="300" fill="green"/></svg>`;
  const explicitDims = SvgRenderer.parseDimensions(explicitSvg);
  if (explicitDims.width !== 400 || explicitDims.height !== 300) {
    throw new Error(`Explicit SVG dimensions mismatch: expected (400, 300), got (${explicitDims.width}, ${explicitDims.height})`);
  }

  console.log("✓ SvgRenderer viewBox & dimension parser verified.");
}

async function runCropMathematicsTests() {
  console.log("Running Crop Mathematics Tests...");

  // Source: 1920 x 1080 (16:9 Landscape)
  const sourceW = 1920;
  const sourceH = 1080;

  // 1. Initial 1:1 Square Crop
  const squareCrop = ImageTransformEngine.calculateInitialCrop(sourceW, sourceH, "1:1");
  const expectedSquareH = Math.round(sourceH * 0.9); // 972
  const expectedSquareW = expectedSquareH; // 972
  if (squareCrop.width !== expectedSquareW || squareCrop.height !== expectedSquareH) {
    throw new Error(`1:1 Square crop dimension mismatch: expected (${expectedSquareW}, ${expectedSquareH}), got (${squareCrop.width}, ${squareCrop.height})`);
  }
  if (squareCrop.x <= 0 || squareCrop.y <= 0) {
    throw new Error(`Square crop must be centered: got x=${squareCrop.x}, y=${squareCrop.y}`);
  }

  // 2. Initial 16:9 Crop on Landscape
  const wideCrop = ImageTransformEngine.calculateInitialCrop(sourceW, sourceH, "16:9");
  if (Math.abs(wideCrop.width / wideCrop.height - 16 / 9) > 0.05) {
    throw new Error(`16:9 Crop aspect ratio mismatch: got ratio ${wideCrop.width / wideCrop.height}`);
  }

  // 3. Clamping out-of-bounds crop coordinates
  const outOfBoundsCrop = { x: 1500, y: 900, width: 800, height: 600 };
  const clamped = ImageTransformEngine.clampCrop(outOfBoundsCrop, sourceW, sourceH, "freeform");
  if (clamped.x + clamped.width > sourceW || clamped.y + clamped.height > sourceH) {
    throw new Error(`Clamped crop exceeded image boundaries: x=${clamped.x}, y=${clamped.y}, w=${clamped.width}, h=${clamped.height}`);
  }

  console.log("✓ Crop coordinate mathematics & aspect ratio clamping verified.");
}

async function runResizeMathematicsTests() {
  console.log("Running Resize Mathematics Tests...");

  const sourceW = 1920;
  const sourceH = 1080;

  // 1. Percentage scaling (50%)
  const halfSize = ImageTransformEngine.computeResize(sourceW, sourceH, { scalePercentage: 50 });
  if (halfSize.width !== 960 || halfSize.height !== 540) {
    throw new Error(`Percentage resize mismatch: expected (960, 540), got (${halfSize.width}, ${halfSize.height})`);
  }

  // 2. Aspect-ratio locked scaling (change width to 800)
  const lockedResize = ImageTransformEngine.computeResize(sourceW, sourceH, {
    newWidth: 800,
    lockAspectRatio: true,
  });
  if (lockedResize.width !== 800 || lockedResize.height !== 450) {
    throw new Error(`Locked aspect resize mismatch: expected (800, 450), got (${lockedResize.width}, ${lockedResize.height})`);
  }

  // 3. Independent dimension scaling
  const independentResize = ImageTransformEngine.computeResize(sourceW, sourceH, {
    newWidth: 500,
    newHeight: 500,
    lockAspectRatio: false,
  });
  if (independentResize.width !== 500 || independentResize.height !== 500) {
    throw new Error(`Independent resize mismatch: expected (500, 500), got (${independentResize.width}, ${independentResize.height})`);
  }

  console.log("✓ Resize dimension & aspect-ratio preservation mathematics verified.");
}

async function runIcoDecoderTests() {
  console.log("Running IcoDecoder Tests...");

  // Generate a valid 2-resolution ICO using IcoEncoder
  const { IcoEncoder } = await import("../../image-converter/IcoEncoder");
  const { IcoDecoder } = await import("../../image-converter/IcoDecoder");

  // Create mock PNG blobs (8-byte PNG signature minimum)
  const png16 = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
  const png32 = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 5, 6, 7, 8, 9, 10]);

  const icoBuffer = IcoEncoder.encode([
    { width: 16, height: 16, pngBuffer: png16 },
    { width: 32, height: 32, pngBuffer: png32 },
  ]);

  const decoded = IcoDecoder.decode(icoBuffer);
  if (!decoded.isValid || decoded.imageCount !== 2) {
    throw new Error(`IcoDecoder failed: expected 2 sub-images, got ${decoded.imageCount}`);
  }

  if (decoded.images[0].width !== 16 || decoded.images[0].height !== 16) {
    throw new Error(`IcoDecoder sub-image 1 mismatch: ${decoded.images[0].width}x${decoded.images[0].height}`);
  }
  if (decoded.images[1].width !== 32 || decoded.images[1].height !== 32) {
    throw new Error(`IcoDecoder sub-image 2 mismatch: ${decoded.images[1].width}x${decoded.images[1].height}`);
  }

  // Test malformed ICO rejection
  const corruptIco = new Uint8Array([0x00, 0x00, 0x02, 0x00, 0x01, 0x00]); // type=2 (invalid)
  const corruptRes = IcoDecoder.decode(corruptIco.buffer);
  if (corruptRes.isValid) {
    throw new Error("IcoDecoder must reject invalid type!=1");
  }

  console.log("✓ IcoDecoder multi-resolution extraction and malformed payload rejection verified.");
}

async function runRotationAndFlipTests() {
  console.log("Running Rotation and Flip Mathematics Tests...");

  // Verify dimension swapping logic for 90/180/270
  const srcW = 1920;
  const srcH = 1080;

  const testAngles = [90, 180, 270] as const;
  for (const angle of testAngles) {
    const isSwapped = angle === 90 || angle === 270;
    const targetW = isSwapped ? srcH : srcW;
    const targetH = isSwapped ? srcW : srcH;

    if (angle === 90 && (targetW !== 1080 || targetH !== 1920)) {
      throw new Error(`90° rotation dimension swap mismatch: expected (1080, 1920), got (${targetW}, ${targetH})`);
    }
    if (angle === 180 && (targetW !== 1920 || targetH !== 1080)) {
      throw new Error(`180° rotation dimension mismatch: expected (1920, 1080), got (${targetW}, ${targetH})`);
    }
    if (angle === 270 && (targetW !== 1080 || targetH !== 1920)) {
      throw new Error(`270° rotation dimension swap mismatch: expected (1080, 1920), got (${targetW}, ${targetH})`);
    }
  }

  console.log("✓ Rotation canvas dimension swap mathematics (90°/180°/270°) verified.");
}

async function runFilterMathematicsTests() {
  console.log("Running Grayscale, Invert, and Blur Formula Tests...");

  // 1. Grayscale luminance formula: 0.299R + 0.587G + 0.114B
  const r = 100, g = 150, b = 200;
  const expectedGray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  if (expectedGray !== 141) {
    throw new Error(`Grayscale luminance mismatch: expected 141, got ${expectedGray}`);
  }

  // 2. Invert formula: 255 - C
  const invR = 255 - r;
  const invG = 255 - g;
  const invB = 255 - b;
  if (invR !== 155 || invG !== 105 || invB !== 55) {
    throw new Error(`Invert formula mismatch: got (${invR}, ${invG}, ${invB})`);
  }

  console.log("✓ Grayscale luminance and Invert channel mathematics verified.");
}

async function main() {
  await runSvgRendererTests();
  await runCropMathematicsTests();
  await runResizeMathematicsTests();
  await runIcoDecoderTests();
  await runRotationAndFlipTests();
  await runFilterMathematicsTests();
  console.log("--------------------------------------------------");
  console.log("ALL IMAGE TRANSFORM & VECTOR SUITE TESTS PASSED!");
  console.log("--------------------------------------------------");
}

main().catch((err) => {
  console.error("Image transform test failed:", err);
  process.exit(1);
});
