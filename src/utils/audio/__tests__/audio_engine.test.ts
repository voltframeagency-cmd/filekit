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

// Mock AudioContext for Node.js test environment
class MockAudioContext {
  sampleRate = 44100;
  createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
    return new MockAudioBuffer(numberOfChannels, length, sampleRate);
  }
}

export function runAudioEngineTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit In-Browser Audio Engine Verification");
  console.log("--------------------------------------------------");

  const mockCtx = new MockAudioContext() as unknown as AudioContext;

  // 1. Test RIFF / WAVE Binary Header & Format
  console.log("Running RIFF/WAVE Binary Header Tests...");
  const sampleRate = 44100;
  const numChannels = 2;
  const numSamples = 1000;
  const buffer = new MockAudioBuffer(numChannels, numSamples, sampleRate);

  // Fill buffer with 440Hz sine wave
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    left[i] = sample;
    right[i] = sample * 0.8;
  }

  const wavBytes = AudioEngine.encodeWav(buffer);
  const dataView = new DataView(wavBytes.buffer);

  // Assert standard 44-byte WAV header
  const riff = String.fromCharCode(wavBytes[0], wavBytes[1], wavBytes[2], wavBytes[3]);
  if (riff !== "RIFF") throw new Error(`Invalid RIFF header: ${riff}`);

  const wave = String.fromCharCode(wavBytes[8], wavBytes[9], wavBytes[10], wavBytes[11]);
  if (wave !== "WAVE") throw new Error(`Invalid WAVE header: ${wave}`);

  const fmt = String.fromCharCode(wavBytes[12], wavBytes[13], wavBytes[14], wavBytes[15]);
  if (fmt !== "fmt ") throw new Error(`Invalid fmt header: ${fmt}`);

  const format = dataView.getUint16(20, true);
  if (format !== 1) throw new Error(`Expected PCM format 1, got ${format}`);

  const channels = dataView.getUint16(22, true);
  if (channels !== 2) throw new Error(`Expected 2 channels, got ${channels}`);

  const rate = dataView.getUint32(24, true);
  if (rate !== 44100) throw new Error(`Expected 44100 rate, got ${rate}`);

  const bitDepth = dataView.getUint16(34, true);
  if (bitDepth !== 16) throw new Error(`Expected 16 bit depth, got ${bitDepth}`);

  const dataTag = String.fromCharCode(wavBytes[36], wavBytes[37], wavBytes[38], wavBytes[39]);
  if (dataTag !== "data") throw new Error(`Invalid data tag: ${dataTag}`);

  const expectedDataSize = numSamples * numChannels * 2;
  const actualDataSize = dataView.getUint32(40, true);
  if (actualDataSize !== expectedDataSize) {
    throw new Error(`Data size mismatch: expected ${expectedDataSize}, got ${actualDataSize}`);
  }
  console.log("✓ RIFF/WAVE 16-bit PCM binary headers verified.");

  // 2. Test Waveform Peaks Extraction & Normalization
  console.log("Running Waveform Peak Extraction Tests...");
  const peaks = AudioEngine.extractWaveformPeaks(buffer, 100);
  if (peaks.peaks.length !== 100) {
    throw new Error(`Expected 100 peaks, got ${peaks.peaks.length}`);
  }
  for (const p of peaks.peaks) {
    if (p < 0 || p > 1.0) {
      throw new Error(`Peak value out of normalized bounds [0, 1]: ${p}`);
    }
  }
  console.log("✓ Waveform peak extraction and normalization verified.");

  // 3. Test AudioBuffer Slicing
  console.log("Running AudioBuffer Slice Tests...");
  const sliced = AudioEngine.sliceAudioBuffer(buffer, 0.005, 0.015, mockCtx);
  const expectedSlicedLength = Math.floor(0.015 * sampleRate) - Math.floor(0.005 * sampleRate);
  if (sliced.length !== expectedSlicedLength) {
    throw new Error(`Sliced buffer length mismatch: expected ${expectedSlicedLength}, got ${sliced.length}`);
  }
  console.log("✓ AudioBuffer millisecond slicing verified.");

  // 4. Test AudioBuffer Concatenation
  console.log("Running AudioBuffer Concatenation Tests...");
  const bufA = new MockAudioBuffer(2, 500, sampleRate);
  const bufB = new MockAudioBuffer(2, 700, sampleRate);
  const merged = AudioEngine.concatenateAudioBuffers([bufA, bufB], mockCtx);
  if (merged.length !== 1200) {
    throw new Error(`Merged buffer length mismatch: expected 1200, got ${merged.length}`);
  }
  if (merged.numberOfChannels !== 2) {
    throw new Error(`Merged channels mismatch: expected 2, got ${merged.numberOfChannels}`);
  }
  console.log("✓ AudioBuffer multi-track concatenation verified.");

  console.log("--------------------------------------------------");
  console.log("ALL IN-BROWSER AUDIO ENGINE TESTS PASSED!");
  console.log("--------------------------------------------------");
}

if (require.main === module) {
  runAudioEngineTests();
}
