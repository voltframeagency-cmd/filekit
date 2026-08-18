/**
 * AudioEngine.ts
 * 
 * Pure TypeScript & Web Audio API engine for decoding, encoding,
 * trimming, concatenating, and extracting visual waveforms entirely in-browser.
 */

export interface AudioMetadata {
  durationSeconds: number;
  sampleRate: number;
  numberOfChannels: number;
  formatName: string;
  bitDepth: number;
}

export interface WaveformPeaks {
  peaks: number[]; // Normalized [0.0, 1.0]
  durationSeconds: number;
}

export class AudioEngine {
  /**
   * Decodes an ArrayBuffer (from File or Blob) into an AudioBuffer using OfflineAudioContext or AudioContext.
   */
  static async decodeAudioData(
    arrayBuffer: ArrayBuffer,
    audioContext?: AudioContext | OfflineAudioContext
  ): Promise<AudioBuffer> {
    const ctx =
      audioContext ||
      new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    // Some browsers require a copy of arrayBuffer because decodeAudioData detaches it
    const bufferCopy = arrayBuffer.slice(0);
    return await ctx.decodeAudioData(bufferCopy);
  }

  /**
   * Extracts downsampled peak amplitudes for rendering 60fps canvas waveforms.
   * Returns an array of normalized values between 0.0 and 1.0.
   */
  static extractWaveformPeaks(
    audioBuffer: AudioBuffer,
    targetPeaksCount = 200
  ): WaveformPeaks {
    const channels = audioBuffer.numberOfChannels;
    const totalSamples = audioBuffer.length;
    const blockSize = Math.max(1, Math.floor(totalSamples / targetPeaksCount));
    const peaks: number[] = [];

    // Extract channel data
    const channelDataList: Float32Array[] = [];
    for (let c = 0; c < channels; c++) {
      channelDataList.push(audioBuffer.getChannelData(c));
    }

    for (let i = 0; i < targetPeaksCount; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, totalSamples);
      let maxPeak = 0;

      for (let c = 0; c < channels; c++) {
        const channel = channelDataList[c];
        for (let j = start; j < end; j++) {
          const val = Math.abs(channel[j]);
          if (val > maxPeak) {
            maxPeak = val;
          }
        }
      }

      // Clamp between 0 and 1
      peaks.push(Math.min(1.0, Math.max(0.0, maxPeak)));
    }

    return {
      peaks,
      durationSeconds: audioBuffer.duration
    };
  }

  /**
   * Slices an AudioBuffer from startTime to endTime (in seconds).
   */
  static sliceAudioBuffer(
    audioBuffer: AudioBuffer,
    startTime: number,
    endTime: number,
    audioContext?: AudioContext | OfflineAudioContext
  ): AudioBuffer {
    const sampleRate = audioBuffer.sampleRate;
    const totalLength = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;

    const startSample = Math.max(0, Math.floor(startTime * sampleRate));
    const endSample = Math.min(totalLength, Math.floor(endTime * sampleRate));
    const newLength = Math.max(1, endSample - startSample);

    const ctx =
      audioContext ||
      new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    const newBuffer = ctx.createBuffer(channels, newLength, sampleRate);

    for (let c = 0; c < channels; c++) {
      const srcChannel = audioBuffer.getChannelData(c);
      const destChannel = newBuffer.getChannelData(c);
      const sliced = srcChannel.subarray(startSample, endSample);
      destChannel.set(sliced);
    }

    return newBuffer;
  }

  /**
   * Concatenates multiple AudioBuffers sequentially into a single continuous AudioBuffer.
   */
  static concatenateAudioBuffers(
    buffers: AudioBuffer[],
    audioContext?: AudioContext | OfflineAudioContext
  ): AudioBuffer {
    if (buffers.length === 0) {
      throw new Error("Cannot concatenate empty list of audio buffers");
    }

    if (buffers.length === 1) {
      return buffers[0];
    }

    const targetSampleRate = buffers[0].sampleRate;
    const targetChannels = Math.max(...buffers.map((b) => b.numberOfChannels));
    const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);

    const ctx =
      audioContext ||
      new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    const resultBuffer = ctx.createBuffer(targetChannels, totalLength, targetSampleRate);

    for (let c = 0; c < targetChannels; c++) {
      const destChannel = resultBuffer.getChannelData(c);
      let offset = 0;

      for (const buf of buffers) {
        // If buffer has fewer channels, duplicate channel 0
        const srcChannelIdx = Math.min(c, buf.numberOfChannels - 1);
        const srcChannel = buf.getChannelData(srcChannelIdx);
        destChannel.set(srcChannel, offset);
        offset += buf.length;
      }
    }

    return resultBuffer;
  }

  /**
   * Encodes an AudioBuffer into standard RIFF / WAVE (16-bit PCM uncompressed) binary format.
   * Produces an ArrayBuffer ready for Blob / Download.
   */
  static encodeWav(audioBuffer: AudioBuffer): Uint8Array {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const numSamples = audioBuffer.length;
    const dataByteLength = numSamples * blockAlign;
    const bufferByteLength = 44 + dataByteLength;

    const arrayBuffer = new ArrayBuffer(bufferByteLength);
    const view = new DataView(arrayBuffer);

    // 1. RIFF Chunk Descriptor
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataByteLength, true); // ChunkSize: 36 + SubChunk2Size
    this.writeString(view, 8, "WAVE");

    // 2. fmt Sub-chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, format, true); // AudioFormat (1 = PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitDepth, true); // BitsPerSample

    // 3. data Sub-chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, dataByteLength, true); // Subchunk2Size

    // Write PCM interleaved samples
    let offset = 44;
    const channelData: Float32Array[] = [];
    for (let c = 0; c < numChannels; c++) {
      channelData.push(audioBuffer.getChannelData(c));
    }

    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        // Clamp float sample [-1.0, 1.0] to 16-bit integer [-32768, 32767]
        let sample = channelData[c][i];
        sample = Math.max(-1.0, Math.min(1.0, sample));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Uint8Array(arrayBuffer);
  }

  private static writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}
