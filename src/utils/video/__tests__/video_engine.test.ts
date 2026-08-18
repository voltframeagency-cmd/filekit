import { VideoEngine } from "../VideoEngine";

export function runVideoEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Production-Hardened Video Engine Verification");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. Exhaustive Target Bitrate Matrix (100+ Combinations)
  console.log("▶ Testing Target Bitrate Zero-Overflow & Exact Cap Mathematics...");
  const testDurations = [0.5, 1, 5, 10, 30, 60, 120, 300, 600, 1800, 3600, 7200];
  const testTargetSizes = [
    500 * 1024,         // 500 KB
    2 * 1024 * 1024,    // 2 MB
    8 * 1024 * 1024,    // 8 MB (Old Discord)
    10 * 1024 * 1024,   // 10 MB (Discord)
    25 * 1024 * 1024,   // 25 MB (Email / Gmail)
    50 * 1024 * 1024,   // 50 MB
    100 * 1024 * 1024,  // 100 MB
    500 * 1024 * 1024,  // 500 MB
    1024 * 1024 * 1024  // 1 GB
  ];

  for (const dur of testDurations) {
    for (const targetBytes of testTargetSizes) {
      const rawKbps = (targetBytes * 8) / (dur * 1000);
      const result = VideoEngine.calculateTargetBitrate(dur, targetBytes);

      // Must be strictly positive
      if (result.videoBitrateKbps <= 0) {
        throw new Error(`Video bitrate non-positive for dur ${dur}s, target ${targetBytes} bytes`);
      }
      if (result.audioBitrateKbps <= 0) {
        throw new Error(`Audio bitrate non-positive for dur ${dur}s, target ${targetBytes} bytes`);
      }

      // CRITICAL ZERO-OVERFLOW ASSERTION for achievable bitrates (>= 2 kbps):
      // Output byte estimate must NEVER exceed target maximum bytes!
      if (rawKbps >= 2 && result.estimatedOutputBytes > targetBytes) {
        throw new Error(
          `Target cap overflow! Dur: ${dur}s, Target: ${targetBytes} bytes, Output: ${result.estimatedOutputBytes} bytes`
        );
      }
      totalAssertions += 3;
    }
  }
  console.log(`✓ Verified 108 duration & target-size matrix combinations with zero overflow.`);

  // 2. Audio Bitrate Allocation Adaptation
  console.log("▶ Testing Audio Bitrate Adaptive Throttling Tiers...");
  // Tiny target (500KB @ 60s -> ~66 kbps total -> audio throttled to <= 32k)
  const tinyPlan = VideoEngine.calculateTargetBitrate(60, 500 * 1024);
  if (tinyPlan.audioBitrateKbps > 32 || tinyPlan.audioBitrateKbps < 8) {
    throw new Error(`Expected throttled audio (8k-32k) for tiny budget, got ${tinyPlan.audioBitrateKbps}k`);
  }

  // Medium target (2MB @ 60s -> ~266 kbps total -> audio throttled to 64k)
  const medPlan = VideoEngine.calculateTargetBitrate(60, 2 * 1024 * 1024);
  if (medPlan.audioBitrateKbps !== 64) {
    throw new Error(`Expected 64k audio for medium budget, got ${medPlan.audioBitrateKbps}k`);
  }

  // Large target (25MB @ 60s -> audio full 128k)
  const largePlan = VideoEngine.calculateTargetBitrate(60, 25 * 1024 * 1024);
  if (largePlan.audioBitrateKbps !== 128) {
    throw new Error(`Expected 128k audio for large budget, got ${largePlan.audioBitrateKbps}k`);
  }
  totalAssertions += 3;
  console.log("✓ Dynamic audio bitrate tier adaptation (32k / 64k / 128k) verified.");

  // 3. GIF Frame Timestamps Generator
  console.log("▶ Testing GIF Frame Sampling Intervals & Max Frame Caps...");
  const fpsOptions = [5, 10, 15, 24, 30];
  for (const fps of fpsOptions) {
    const stamps = VideoEngine.calculateGifFrameTimestamps(0, 4, fps, 50);
    const expectedCount = Math.min(50, 4 * fps);
    if (stamps.length !== expectedCount) {
      throw new Error(`GIF frame count mismatch for ${fps} fps: expected ${expectedCount}, got ${stamps.length}`);
    }
    if (stamps[0] !== 0) throw new Error("First timestamp must be start time 0");
    if (stamps[stamps.length - 1] > 4.0) throw new Error("Last timestamp exceeds clip boundary");
    totalAssertions += 3;
  }
  console.log("✓ Multi-framerate GIF sampling and boundary constraints verified.");

  // 4. Processing Tier Routing
  console.log("▶ Testing Local Browser vs Cloud Container Tier Boundaries...");
  const tierTests = [
    { size: 10 * 1024 * 1024, dur: 15, mode: "trim" as const, expected: "local_browser" },
    { size: 90 * 1024 * 1024, dur: 60, mode: "mute" as const, expected: "local_browser" },
    { size: 150 * 1024 * 1024, dur: 60, mode: "trim" as const, expected: "cloud_container" },
    { size: 20 * 1024 * 1024, dur: 10, mode: "gif" as const, expected: "local_browser" },
    { size: 20 * 1024 * 1024, dur: 45, mode: "gif" as const, expected: "cloud_container" },
    { size: 200 * 1024 * 1024, dur: 120, mode: "compress" as const, expected: "cloud_container" },
    { size: 30 * 1024 * 1024, dur: 400, mode: "convert" as const, expected: "cloud_container" }
  ];

  for (const t of tierTests) {
    const tier = VideoEngine.routeProcessingTier(t.size, t.dur, t.mode);
    if (tier !== t.expected) {
      throw new Error(`Tier routing mismatch for mode ${t.mode}, size ${t.size}: expected ${t.expected}, got ${tier}`);
    }
    totalAssertions += 1;
  }
  console.log("✓ Hybrid client/cloud container tier boundaries verified.");

  // 5. Input Validation & Defense
  console.log("▶ Testing Input Validation & Zero/Negative Defenses...");
  try {
    VideoEngine.calculateTargetBitrate(0, 1000);
    throw new Error("Failed to reject 0s duration");
  } catch (e: unknown) {
    if ((e as Error).message.includes("Failed to reject")) throw e;
  }

  try {
    VideoEngine.calculateTargetBitrate(10, 0);
    throw new Error("Failed to reject 0 bytes target");
  } catch (e: unknown) {
    if ((e as Error).message.includes("Failed to reject")) throw e;
  }
  totalAssertions += 2;
  console.log("✓ Zero duration and negative byte input defenses verified.");

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Production-Hardened Video Engine assertions passed!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runVideoEngineTests();
}
