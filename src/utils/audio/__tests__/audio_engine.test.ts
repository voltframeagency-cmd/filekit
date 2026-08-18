import { AudioEngine } from "../AudioEngine";

// Mock AudioBuffer for Node.js test environment
class MockAudioBuffer implements AudioBuffer {
  length: number;
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  private channelData: Float32Array[];

  constructor(numberOfChannels: number, length: number, sampleRate: number) {
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.sampleRate = sampleRate;
    this.duration = length / sampleRate;
    this.channelData = [];
    for (let c = 0; c < numberOfChannels; c++) {
      this.channelData.push(new Float32Array(length));
    }
  }

  getChannelData(channel: number): Float32Array {
    if (channel >= this.numberOfChannels) throw new Error("IndexSizeError");
    return this.channelData[channel];
  }

  copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset?: number): void {
    const src = this.getChannelData(channelNumber);
    const offset = bufferOffset || 0;
    destination.set(src.subarray(offset, offset + destination.length));
  }

  copyToChannel(source: Float32Array, channelNumber: number, bufferOffset?: number): void {
    const dest = this.getChannelData(channelNumber);
    const offset = bufferOffset || 0;
    dest.set(source, offset);
  }
}

class MockAudioContext {
  sampleRate = 44100;
  createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
    return new MockAudioBuffer(numberOfChannels, length, sampleRate);
  }
}

export function runAudioEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting Production-Hardened Audio Engine Verification");
  console.log("--------------------------------------------------");

  const mockCtx = new MockAudioContext() as unknown as AudioContext;
  let totalAssertions = 0;

  // 1. RIFF/WAVE Binary Header & Format Verification
  console.log("▶ Testing RIFF/WAVE Binary Format & PCM Encoding...");
  const sampleRates = [8000, 22050, 44100, 48000, 96000, 192000];
  const channelConfigs = [1, 2, 4, 6]; // Mono, Stereo, Quad, 5.1

  for (const rate of sampleRates) {
    for (const ch of channelConfigs) {
      const numSamples = 500;
      const buf = new MockAudioBuffer(ch, numSamples, rate);
      const wavBytes = AudioEngine.encodeWav(buf);
      const view = new DataView(wavBytes.buffer);

      const riff = String.fromCharCode(wavBytes[0], wavBytes[1], wavBytes[2], wavBytes[3]);
      const wave = String.fromCharCode(wavBytes[8], wavBytes[9], wavBytes[10], wavBytes[11]);
      const fmt = String.fromCharCode(wavBytes[12], wavBytes[13], wavBytes[14], wavBytes[15]);
      const dataTag = String.fromCharCode(wavBytes[36], wavBytes[37], wavBytes[38], wavBytes[39]);

      if (riff !== "RIFF" || wave !== "WAVE" || fmt !== "fmt " || dataTag !== "data") {
        throw new Error(`Invalid WAV magic headers for rate ${rate}, ch ${ch}`);
      }
      if (view.getUint16(20, true) !== 1) throw new Error("Format is not PCM 1");
      if (view.getUint16(22, true) !== ch) throw new Error(`Channel mismatch: expected ${ch}`);
      if (view.getUint32(24, true) !== rate) throw new Error(`Sample rate mismatch: expected ${rate}`);
      if (view.getUint16(34, true) !== 16) throw new Error("Bit depth is not 16");

      const expectedDataSize = numSamples * ch * 2;
      if (view.getUint32(40, true) !== expectedDataSize) {
        throw new Error(`Data size mismatch: expected ${expectedDataSize}`);
      }
      totalAssertions += 7;
    }
  }
  console.log(`✓ Verified 24 sample-rate & multi-channel combinations (${totalAssertions} assertions).`);

  // 2. Float Sample Clamping & Integer Wrap-Around Guard
  console.log("▶ Testing Sample Clamping & Float-to-Int16 Normalization...");
  const clampBuf = new MockAudioBuffer(1, 4, 44100);
  const clampChannel = clampBuf.getChannelData(0);
  clampChannel[0] = 1.5;   // Overdrive positive -> must clamp to +32767
  clampChannel[1] = -2.0;  // Overdrive negative -> must clamp to -32768
  clampChannel[2] = 0.0;   // Zero -> 0
  clampChannel[3] = 0.5;   // Normal -> +16383

  const clampedWav = AudioEngine.encodeWav(clampBuf);
  const clampView = new DataView(clampedWav.buffer);

  if (clampView.getInt16(44, true) !== 32767) throw new Error("Failed to clamp +1.5 sample to +32767");
  if (clampView.getInt16(46, true) !== -32768) throw new Error("Failed to clamp -2.0 sample to -32768");
  if (clampView.getInt16(48, true) !== 0) throw new Error("Failed to encode 0.0 sample to 0");
  if (Math.abs(clampView.getInt16(50, true) - 16383) > 1) throw new Error("Failed to scale 0.5 sample");
  totalAssertions += 4;
  console.log("✓ Overdrive float sample clamping & int16 wrap-around guard verified.");

  // 3. Waveform Peak Extraction & Normalization
  console.log("▶ Testing Waveform Peak Extraction & Normalization...");
  const peakBuf = new MockAudioBuffer(2, 10000, 44100);
  const left = peakBuf.getChannelData(0);
  for (let i = 0; i < 10000; i++) {
    left[i] = (Math.random() * 2) - 1; // [-1.0, 1.0]
  }

  const peakCounts = [50, 100, 200, 500];
  for (const count of peakCounts) {
    const p = AudioEngine.extractWaveformPeaks(peakBuf, count);
    if (p.peaks.length !== count) throw new Error(`Expected ${count} peaks, got ${p.peaks.length}`);
    for (const val of p.peaks) {
      if (val < 0.0 || val > 1.0 || isNaN(val)) {
        throw new Error(`Invalid peak amplitude value: ${val}`);
      }
    }
    totalAssertions += count + 1;
  }
  console.log(`✓ Waveform peak extraction verified across multi-resolution bins.`);

  // 4. Slice Boundary & Edge Cases
  console.log("▶ Testing Buffer Slicing Boundary & Out-of-Bounds Guards...");
  const sliceSrc = new MockAudioBuffer(2, 44100, 44100); // 1.0 second

  // Sub-slice
  const s1 = AudioEngine.sliceAudioBuffer(sliceSrc, 0.25, 0.75, mockCtx);
  if (s1.length !== 22050) throw new Error("Sub-slice length mismatch");

  // Slice past EOF -> clamped to buffer end
  const s2 = AudioEngine.sliceAudioBuffer(sliceSrc, 0.5, 2.5, mockCtx);
  if (s2.length !== 22050) throw new Error("Past-EOF slice length mismatch");

  // Slice start = end -> minimum 1 sample
  const s3 = AudioEngine.sliceAudioBuffer(sliceSrc, 0.5, 0.5, mockCtx);
  if (s3.length < 1) throw new Error("Zero-length slice guard failed");
  totalAssertions += 3;
  console.log("✓ Sub-second, past-EOF, and zero-length slice guards verified.");

  // 5. Multi-Track Concatenation
  console.log("▶ Testing Multi-Track Audio Concatenation...");
  const track1 = new MockAudioBuffer(1, 1000, 44100); // Mono
  const track2 = new MockAudioBuffer(2, 2000, 44100); // Stereo
  const track3 = new MockAudioBuffer(2, 3000, 44100); // Stereo

  const merged = AudioEngine.concatenateAudioBuffers([track1, track2, track3], mockCtx);
  if (merged.length !== 6000) throw new Error(`Merged length mismatch: expected 6000, got ${merged.length}`);
  if (merged.numberOfChannels !== 2) throw new Error("Merged channels mismatch");
  totalAssertions += 2;
  console.log("✓ Multi-channel upmixing and sequential concatenation verified.");

  console.log("--------------------------------------------------");
  console.log(`✅ All ${totalAssertions} Production-Hardened Audio Engine assertions passed!`);
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runAudioEngineTests();
}
