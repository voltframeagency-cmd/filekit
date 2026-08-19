/**
 * subtitle_engine.test.ts
 * 
 * Unit tests for SubtitleEngine SRT <-> WebVTT conversion and timestamp precision.
 */

import { SubtitleEngine } from "../SubtitleEngine";

export function runSubtitleEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Subtitle Engine Verification Suite");
  console.log("--------------------------------------------------");

  let totalAssertions = 0;

  // 1. SRT to WebVTT Conversion
  console.log("▶ Testing SRT to WebVTT Conversion...");
  const sampleSrt = `1
00:00:01,000 --> 00:00:04,000
Welcome to FileKit.

2
00:00:05,500 --> 00:00:08,250
100% In-Browser Privacy.`;

  const vttOutput = SubtitleEngine.srtToVtt(sampleSrt);
  if (!vttOutput.startsWith("WEBVTT")) {
    throw new Error("WebVTT output must begin with WEBVTT header.");
  }
  if (!vttOutput.includes("00:00:01.000 --> 00:00:04.000")) {
    throw new Error("SRT comma timestamp was not converted to WebVTT dot timestamp.");
  }
  if (!vttOutput.includes("Welcome to FileKit.")) {
    throw new Error("Subtitle cue text was missing in WebVTT output.");
  }
  totalAssertions += 3;
  console.log("✓ SRT to WebVTT timestamp formatting and cue preservation verified.");

  // 2. WebVTT to SRT Conversion
  console.log("▶ Testing WebVTT to SRT Conversion...");
  const sampleVtt = `WEBVTT
NOTE This is a commentary note

1
00:00:01.000 --> 00:00:04.000 line:0% position:50%
Welcome to FileKit.

2
00:00:05.500 --> 00:00:08.250
100% In-Browser Privacy.`;

  const srtOutput = SubtitleEngine.vttToSrt(sampleVtt);
  if (srtOutput.includes("WEBVTT") || srtOutput.includes("NOTE")) {
    throw new Error("WebVTT headers or NOTE blocks were not stripped in SRT output.");
  }
  if (!srtOutput.includes("00:00:01,000 --> 00:00:04,000")) {
    throw new Error("WebVTT dot timestamp was not converted to SRT comma timestamp.");
  }
  if (!srtOutput.includes("100% In-Browser Privacy.")) {
    throw new Error("Subtitle cue text missing in SRT output.");
  }
  totalAssertions += 3;
  console.log("✓ WebVTT to SRT conversion, header stripping, and comma formatting verified.");

  // 3. Empty & Edge Case Input Defenses
  console.log("▶ Testing Empty and Malformed Subtitle Defenses...");
  const emptyVtt = SubtitleEngine.srtToVtt("");
  if (emptyVtt !== "WEBVTT\n\n") throw new Error("Empty SRT did not return minimal valid WEBVTT.");
  const emptySrt = SubtitleEngine.vttToSrt("");
  if (emptySrt !== "") throw new Error("Empty VTT did not return empty SRT.");
  totalAssertions += 2;
  console.log("✓ Empty input and boundary defenses verified.");

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Subtitle Engine assertions passed cleanly!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runSubtitleEngineTests();
}
