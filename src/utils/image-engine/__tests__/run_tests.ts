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
  console.log("Running Preflight Inspection Tests...");
  const jpgReport = await ImagePreflightInspector.inspect(corpus["sample.jpg"].buffer);
  assert.strictEqual(jpgReport.format, "jpeg");
  assert.strictEqual(jpgReport.width, 10);
  assert.strictEqual(jpgReport.height, 10);
  assert.strictEqual(jpgReport.hasAlpha, false);

  const pngReport = await ImagePreflightInspector.inspect(corpus["transparent.png"].buffer);
  assert.strictEqual(pngReport.format, "png");
  assert.strictEqual(pngReport.width, 8);
  assert.strictEqual(pngReport.height, 8);
  assert.strictEqual(pngReport.hasAlpha, true);

  const webpReport = await ImagePreflightInspector.inspect(corpus["static.webp"].buffer);
  assert.strictEqual(webpReport.format, "webp");
  assert.strictEqual(webpReport.hasAlpha, true);
  assert.strictEqual(webpReport.isAnimated, false);
  console.log("✓ Preflight inspection tests passed.");

  // Test 2: Animation & Memory Rejection
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

  // Test 3: Candidate Selection & Target Controller
  console.log("Running Candidate Selection & Growth Guard Tests...");
  const sampleBuf = corpus["sample.jpg"].buffer;
  
  // Case A: Original already within target
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

  // Case B: Candidate smaller than original and hits target
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

  // Case C: Candidate larger than original -> Growth Guard returns original
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
  console.log("✓ Candidate selection & growth guard tests passed.");

  console.log("--------------------------------------------------");
  console.log("ALL IMAGE ENGINE TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runImageEngineTestSuite();
