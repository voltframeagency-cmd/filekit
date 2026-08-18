import { VideoEngine } from "../VideoEngine";

export function runVideoEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Video Engine Verification Suite");
  console.log("--------------------------------------------------");

  // 1. Target Bitrate Calculation Formula Tests
  console.log("Running Target Bitrate Mathematics Tests...");
  
  // Test Discord limit (Under 10 MB for 60s video)
  const discordTargetBytes = 10 * 1024 * 1024; // 10,485,760 bytes
  const duration60s = 60;
  const result10mb = VideoEngine.calculateTargetBitrate(duration60s, discordTargetBytes, 128);

  // Bitrate must be positive and output must strictly be <= targetMaxBytes
  if (result10mb.videoBitrateKbps <= 0) throw new Error("Video bitrate must be positive");
  if (result10mb.estimatedOutputBytes > discordTargetBytes) {
    throw new Error(`Estimated output (${result10mb.estimatedOutputBytes}) exceeds target max (${discordTargetBytes})`);
  }
  console.log(`✓ 10MB/60s Target Bitrate: ${result10mb.videoBitrateKbps}k video + ${result10mb.audioBitrateKbps}k audio -> ${result10mb.estimatedOutputBytes} bytes.`);

  // Test Email limit (Under 25 MB for 120s video)
  const emailTargetBytes = 25 * 1024 * 1024; // 26,214,400 bytes
  const duration120s = 120;
  const result25mb = VideoEngine.calculateTargetBitrate(duration120s, emailTargetBytes, 128);
  if (result25mb.estimatedOutputBytes > emailTargetBytes) {
    throw new Error(`Estimated output exceeds 25MB target max`);
  }
  console.log(`✓ 25MB/120s Target Bitrate: ${result25mb.videoBitrateKbps}k video + ${result25mb.audioBitrateKbps}k audio.`);

  // Test Low-bitrate small file adaptation (< 200 kbps total)
  const smallTargetBytes = 500 * 1024; // 500 KB for 30s video
  const smallResult = VideoEngine.calculateTargetBitrate(30, smallTargetBytes);
  if (smallResult.audioBitrateKbps !== 32) {
    throw new Error(`Expected throttled 32k audio for small file, got ${smallResult.audioBitrateKbps}k`);
  }
  console.log("✓ Low-bitrate automatic audio throttling verified.");

  // 2. GIF Frame Timestamps Generator Tests
  console.log("Running GIF Frame Sampling Tests...");
  const gifTimestamps = VideoEngine.calculateGifFrameTimestamps(2.0, 7.0, 10, 50);
  if (gifTimestamps.length !== 50) {
    throw new Error(`Expected 50 timestamps for 5s clip @ 10fps, got ${gifTimestamps.length}`);
  }
  if (gifTimestamps[0] !== 2.0) throw new Error(`First timestamp should be 2.0, got ${gifTimestamps[0]}`);
  if (gifTimestamps[gifTimestamps.length - 1] > 7.0) {
    throw new Error(`Last timestamp exceeds end time 7.0: ${gifTimestamps[gifTimestamps.length - 1]}`);
  }
  console.log("✓ GIF frame sampling intervals verified.");

  // 3. Processing Tier Routing Tests
  console.log("Running Tier Routing Logic Tests...");
  const localTrim = VideoEngine.routeProcessingTier(50 * 1024 * 1024, 60, "trim");
  if (localTrim !== "local_browser") throw new Error("Expected 50MB trim to route locally");

  const heavyVideo = VideoEngine.routeProcessingTier(250 * 1024 * 1024, 600, "compress");
  if (heavyVideo !== "cloud_container") throw new Error("Expected 250MB compress to route to cloud container");

  const longGif = VideoEngine.routeProcessingTier(20 * 1024 * 1024, 45, "gif");
  if (longGif !== "cloud_container") throw new Error("Expected 45s GIF to route to cloud container");
  console.log("✓ Processing tier routing boundaries verified.");

  console.log("--------------------------------------------------");
  console.log("ALL VIDEO ENGINE UNIT TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runVideoEngineTests();
}
