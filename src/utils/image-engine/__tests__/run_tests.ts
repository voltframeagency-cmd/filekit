import assert from "assert";
import { ImagePreflightInspector } from "../ImagePreflightInspector";
import { ImageCapabilityRouter } from "../ImageCapabilityRouter";
import { selectImageCompressionResult } from "../ImageTargetSizeController";
import { getTestImageCorpus } from "./fixtures";

async function runImageEngineTestSuite() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Image Engine Verification Suite");
  console.log("--------------------------------------------------");

  const corpus = getTestImageCorpus();

  // Test 1: Preflight Format & Dimension Parsing
  console.log("Running Preflight Inspection & Peak Memory Tests...");
  const jpgReport = await ImagePreflightInspector.inspect(corpus["sample.jpg"].buffer);
  assert.strictEqual(jpgReport.format, "jpeg");
  assert.strictEqual(jpgReport.width, 10);
  assert.strictEqual(jpgReport.height, 10);
  assert.strictEqual(jpgReport.hasAlpha, false);
  assert.strictEqual(jpgReport.rgbaBytes, 400); // 10 * 10 * 4
  assert.ok(jpgReport.estimatedPeakBytes > jpgReport.rgbaBytes);

  const pngReport = await ImagePreflightInspector.inspect(corpus["transparent.png"].buffer);
  assert.strictEqual(pngReport.format, "png");
  assert.strictEqual(pngReport.width, 8);
  assert.strictEqual(pngReport.height, 8);
  assert.strictEqual(pngReport.hasAlpha, true);

  const webpReport = await ImagePreflightInspector.inspect(corpus["static.webp"].buffer);
  assert.strictEqual(webpReport.format, "webp");
  assert.strictEqual(webpReport.hasAlpha, true);
  assert.strictEqual(webpReport.isAnimated, false);
  console.log("✓ Preflight inspection & peak memory tests passed.");

  // Test 2: Peak Memory Allocation Formula & Budget Tiers
  console.log("Running Peak Memory Formula & Budget Tier Tests...");
  const peak = ImageCapabilityRouter.calculatePeakMemory({
    width: 4000,
    height: 3000,
    inputSizeBytes: 5 * 1024 * 1024,
    operation: "ITERATIVE_TARGET"
  });
  // RGBA = 4000 * 3000 * 4 = 48,000,000 bytes (~48 MB)
  assert.strictEqual(peak.rgbaBytes, 48000000);
  assert.strictEqual(peak.operationMultiplier, 5.0);
  // estimatedPeakBytes = (48M * 5) + 5M + candidateEst (~240M + 5M + 4M = ~249M)
  assert.ok(peak.estimatedPeakBytes > 240000000);

  // Oversized dimensions rejection (e.g. 15,000 x 15,000 = 225M RGBA * 5.0 = 1.125 GB > 512 MB ceiling)
  const hugePeak = ImageCapabilityRouter.calculatePeakMemory({
    width: 15000,
    height: 15000,
    inputSizeBytes: 10 * 1024 * 1024,
    operation: "ITERATIVE_TARGET"
  });
  const mockHugeReport = {
    ...jpgReport,
    width: 15000,
    height: 15000,
    decodedMemoryBytes: 15000 * 15000 * 4
  };
  const hugeRoute = ImageCapabilityRouter.evaluate(mockHugeReport, 10 * 1024 * 1024);
  assert.strictEqual(hugeRoute.decision, "UNSUPPORTED");
  assert.ok(hugeRoute.reason?.includes("MEMORY_LIMIT_EXCEEDED"));
  console.log("✓ Peak memory formula & budget tier tests passed.");

  // Test 3: Animation & Malformed Rejections
  console.log("Running Routing & Rejection Tests...");
  const animWebpReport = await ImagePreflightInspector.inspect(corpus["animated.webp"].buffer);
  const animRoute = ImageCapabilityRouter.evaluate(animWebpReport);
  assert.strictEqual(animRoute.decision, "UNSUPPORTED");
  assert.ok(animRoute.reason?.includes("UNSUPPORTED_ANIMATION"));

  const gifReport = await ImagePreflightInspector.inspect(corpus["animated.gif"].buffer);
  const gifRoute = ImageCapabilityRouter.evaluate(gifReport);
  assert.strictEqual(gifRoute.decision, "UNSUPPORTED");

  await assert.rejects(
    async () => ImagePreflightInspector.inspect(corpus["malformed.jpg"].buffer),
    /UNSUPPORTED_FORMAT/
  );
  console.log("✓ Routing & rejection tests passed.");

  // Test 4: Candidate Selection & Target Outcome Matrix
  console.log("Running Target Outcome Matrix & Growth Guard Tests...");
  const sampleBuf = corpus["sample.jpg"].buffer;
  
  // Case 1: ALREADY_WITHIN_TARGET (original <= targetSizeBytes)
  const alreadyWithinRes = selectImageCompressionResult({
    originalBuffer: sampleBuf,
    candidates: [],
    targetSizeBytes: 50000,
    originalWidth: 10,
    originalHeight: 10,
    inputMimeType: "image/jpeg",
    attemptsRun: 0,
    exifOrientation: 1
  });
  assert.strictEqual(alreadyWithinRes.outcome, "ALREADY_WITHIN_TARGET");
  assert.strictEqual(alreadyWithinRes.targetAchieved, true);
  assert.strictEqual(alreadyWithinRes.attemptsRun, 0);

  // Case 2: TARGET_ACHIEVED (candidate <= targetSizeBytes)
  const mockCandBuf = new Uint8Array([1, 2, 3]).buffer;
  const targetHitRes = selectImageCompressionResult({
    originalBuffer: sampleBuf,
    candidates: [
      {
        buffer: mockCandBuf,
        size: 3,
        width: 10,
        height: 10,
        mimeType: "image/jpeg",
        orientationCorrected: false,
        alphaPreserved: false,
        metadataRemoved: true,
        scale: 1,
        quality: 0.8
      }
    ],
    targetSizeBytes: 10,
    originalWidth: 10,
    originalHeight: 10,
    inputMimeType: "image/jpeg",
    attemptsRun: 1,
    exifOrientation: 1
  });
  assert.strictEqual(targetHitRes.outcome, "TARGET_ACHIEVED");
  assert.strictEqual(targetHitRes.outputSizeBytes, 3);
  assert.strictEqual(targetHitRes.targetAchieved, true);

  // Case 3: TARGET_NOT_MET (original > candidate > targetSizeBytes)
  const midCandBuf = new Uint8Array(50).buffer;
  const targetNotMetRes = selectImageCompressionResult({
    originalBuffer: new Uint8Array(100).buffer,
    candidates: [
      {
        buffer: midCandBuf,
        size: 50,
        width: 10,
        height: 10,
        mimeType: "image/jpeg",
        orientationCorrected: false,
        alphaPreserved: false,
        metadataRemoved: true,
        scale: 1,
        quality: 0.8
      }
    ],
    targetSizeBytes: 10, // target is 10 B, candidate is 50 B, original is 100 B
    originalWidth: 10,
    originalHeight: 10,
    inputMimeType: "image/jpeg",
    attemptsRun: 3,
    exifOrientation: 1
  });
  assert.strictEqual(targetNotMetRes.outcome, "TARGET_NOT_MET");
  assert.strictEqual(targetNotMetRes.outputSizeBytes, 50);
  assert.strictEqual(targetNotMetRes.targetAchieved, false);

  // Case 4: NO_BENEFICIAL_REDUCTION (candidate >= original)
  const largeCandBuf = new Uint8Array(2000).buffer;
  const growthRes = selectImageCompressionResult({
    originalBuffer: sampleBuf,
    candidates: [
      {
        buffer: largeCandBuf,
        size: 2000,
        width: 10,
        height: 10,
        mimeType: "image/jpeg",
        orientationCorrected: false,
        alphaPreserved: false,
        metadataRemoved: true,
        scale: 1,
        quality: 0.8
      }
    ],
    targetSizeBytes: 10,
    originalWidth: 10,
    originalHeight: 10,
    inputMimeType: "image/jpeg",
    attemptsRun: 1,
    exifOrientation: 1
  });
  assert.strictEqual(growthRes.outcome, "NO_BENEFICIAL_REDUCTION");
  assert.strictEqual(growthRes.outputSizeBytes, sampleBuf.byteLength);
  console.log("✓ Target outcome matrix & growth guard tests passed.");

  console.log("--------------------------------------------------");
  console.log("ALL IMAGE ENGINE UNIT TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runImageEngineTestSuite();
