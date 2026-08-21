"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AudioEngine, WaveformPeaks } from "./AudioEngine";
import UploadDropzone from "@/components/upload/UploadDropzone";
import { fileManager } from "@/utils/fileManager";

export interface AudioWorkspaceProps {
  mode: "convert" | "compress" | "trim" | "merge" | "video-to-mp3" | "boost";
  title: string;
  subtitle: string;
  allowedAccept?: string;
}

export default function AudioWorkspace({
  mode,
  title,
  subtitle,
  allowedAccept = "audio/*,video/*"
}: AudioWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [audioBuffers, setAudioBuffers] = useState<AudioBuffer[]>([]);
  const [waveformPeaks, setWaveformPeaks] = useState<WaveformPeaks | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Playback & Timing
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);

  // Settings
  const [gainFactor, setGainFactor] = useState<number>(1.5);
  const [targetBitrate, setTargetBitrate] = useState<number>(128); // kbps for compress
  const [targetFormat, setTargetFormat] = useState<string>("wav"); // wav / mp3
  const [channelsMode, setChannelsMode] = useState<"stereo" | "mono">("stereo");

  // Output
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {}
      }
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  // Waveform seek handler for both mouse and touch events
  const handleWaveformSeek = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    setCurrentTime(newTime);
    if (isPlaying) {
      stopPlayback();
    }
  };

  const handleFileSelected = async (file: File) => {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }
    setLoading(true);
    setErrorMessage(null);
    setOutputUrl(null);
    setOutputBlob(null);

    try {
      if (!audioContextRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await AudioEngine.decodeAudioData(
        arrayBuffer,
        audioContextRef.current
      );

      const peaks = AudioEngine.extractWaveformPeaks(decodedBuffer, 240);

      setFiles([file]);
      setAudioBuffers([decodedBuffer]);
      setWaveformPeaks(peaks);
      setDuration(decodedBuffer.duration);
      setTrimRange([0, decodedBuffer.duration]);
      setCurrentTime(0);
    } catch (err) {
      console.error("Audio decoding failed:", err);
      setErrorMessage("Could not decode audio. Please ensure the file is a valid audio/video container.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMergeFile = async (file: File) => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await AudioEngine.decodeAudioData(
        arrayBuffer,
        audioContextRef.current
      );

      setFiles((prev) => [...prev, file]);
      setAudioBuffers((prev) => [...prev, decodedBuffer]);
    } catch (err) {
      console.error("Merge file decode failed:", err);
      setErrorMessage("Failed to decode audio track for merge.");
    }
  };

  // Play / Pause Logic
  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {}
      sourceNodeRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    if (!audioBuffers[0] || !audioContextRef.current) return;

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    stopPlayback();

    const src = audioContextRef.current.createBufferSource();
    src.buffer = audioBuffers[0];
    src.connect(audioContextRef.current.destination);

    const startFrom = currentTime >= duration ? 0 : currentTime;
    src.start(0, startFrom);
    sourceNodeRef.current = src;
    startTimeRef.current = audioContextRef.current.currentTime;
    startOffsetRef.current = startFrom;
    setIsPlaying(true);

    const updateLoop = () => {
      if (!audioContextRef.current) return;
      const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
      const current = startOffsetRef.current + elapsed;

      if (current >= duration) {
        setCurrentTime(duration);
        stopPlayback();
      } else {
        setCurrentTime(current);
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
  }, [audioBuffers, currentTime, duration, stopPlayback]);

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Draw Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformPeaks) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const barWidth = Math.max(2, (width / waveformPeaks.peaks.length) - 1.5);
    const progressX = duration > 0 ? (currentTime / duration) * width : 0;
    const trimStartX = duration > 0 ? (trimRange[0] / duration) * width : 0;
    const trimEndX = duration > 0 ? (trimRange[1] / duration) * width : width;

    // Draw Trim Inactive Area
    if (mode === "trim") {
      ctx.fillStyle = "rgba(15, 23, 42, 0.06)";
      if (trimStartX > 0) ctx.fillRect(0, 0, trimStartX, height);
      if (trimEndX < width) ctx.fillRect(trimEndX, 0, width - trimEndX, height);
    }

    // Draw Waveform Bars
    waveformPeaks.peaks.forEach((peak, i) => {
      const x = i * (width / waveformPeaks.peaks.length);
      const barHeight = Math.max(3, peak * (height - 12));
      const y = (height - barHeight) / 2;

      const isPast = x <= progressX;
      const isInTrim = mode !== "trim" || (x >= trimStartX && x <= trimEndX);

      if (isPast && isInTrim) {
        ctx.fillStyle = "#0977fd";
      } else if (isInTrim) {
        ctx.fillStyle = "#93c5fd";
      } else {
        ctx.fillStyle = "#cbd5e1";
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    });

    // Draw Playhead
    ctx.fillStyle = "#0977fd";
    ctx.fillRect(progressX - 1, 0, 2, height);
  }, [waveformPeaks, currentTime, duration, trimRange, mode]);

  // Execute Processing & Export
  const handleProcess = async () => {
    if (audioBuffers.length === 0) return;
    setProcessing(true);
    setErrorMessage(null);

    try {
      let finalBuffer: AudioBuffer = audioBuffers[0];

      if (mode === "merge") {
        finalBuffer = AudioEngine.concatenateAudioBuffers(audioBuffers, audioContextRef.current || undefined);
      } else if (mode === "trim") {
        finalBuffer = AudioEngine.sliceAudioBuffer(
          audioBuffers[0],
          trimRange[0],
          trimRange[1],
          audioContextRef.current || undefined
        );
      } else if (mode === "boost") {
        finalBuffer = AudioEngine.boostVolume(
          audioBuffers[0],
          gainFactor,
          audioContextRef.current || undefined
        );
      }

      // Encode to WAV binary
      const wavBytes = AudioEngine.encodeWav(finalBuffer);
      const blob = new Blob([wavBytes as BlobPart], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      const baseName = files[0]?.name.replace(/\.[^/.]+$/, "") || "processed-audio";
      const ext = targetFormat === "mp3" ? "mp3" : "wav";
      const outName = `${baseName}-${mode}.${ext}`;

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(outName);
    } catch (err) {
      console.error("Audio processing failed:", err);
      setErrorMessage("Failed to process audio file.");
    } finally {
      setProcessing(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins}:${remainder.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Main Container */}
      <div className="bg-white border border-fk-border rounded-fk-xl shadow-sm p-6 md:p-8 flex flex-col gap-6">
        {files.length === 0 ? (
          <UploadDropzone
            onFileSelect={handleFileSelected}
            accept={allowedAccept}
            isGeneric={false}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Waveform Card */}
            {loading ? (
              <div className="h-40 flex items-center justify-center bg-slate-50 rounded-fk-lg border border-slate-200">
                <span className="text-sm font-medium text-slate-600 animate-pulse">
                  Decoding audio stream in browser...
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Waveform Canvas */}
                <div
                  className="relative h-32 bg-slate-50 border border-slate-200 rounded-fk-lg p-2 cursor-pointer select-none touch-none"
                  onClick={(e) => handleWaveformSeek(e.clientX, e.currentTarget)}
                  onTouchStart={(e) => {
                    if (e.touches[0]) handleWaveformSeek(e.touches[0].clientX, e.currentTarget);
                  }}
                  onTouchMove={(e) => {
                    if (e.touches[0]) handleWaveformSeek(e.touches[0].clientX, e.currentTarget);
                  }}
                >
                  <canvas ref={canvasRef} className="w-full h-full" />
                </div>

                {/* Timeline Controls */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-fk-md shadow-sm transition-all text-sm flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                          Pause
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Play
                        </>
                      )}
                    </button>
                    <span className="text-sm font-mono font-medium text-slate-700">
                      {formatSeconds(currentTime)} / {formatSeconds(duration)}
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Browser-First · Zero Cloud Upload
                  </span>
                </div>
              </div>
            )}

            {/* Mode-Specific Parameter Controls */}
            {mode === "trim" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-fk-lg">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Start Time (seconds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={trimRange[1]}
                    step={0.1}
                    value={parseFloat(trimRange[0].toFixed(2))}
                    onChange={(e) => setTrimRange([Math.max(0, parseFloat(e.target.value) || 0), trimRange[1]])}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    End Time (seconds)
                  </label>
                  <input
                    type="number"
                    min={trimRange[0]}
                    max={duration}
                    step={0.1}
                    value={parseFloat(trimRange[1].toFixed(2))}
                    onChange={(e) => setTrimRange([trimRange[0], Math.min(duration, parseFloat(e.target.value) || duration)])}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-mono text-slate-900"
                  />
                </div>
              </div>
            )}

            {mode === "compress" && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-fk-lg flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Audio Bitrate
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[64, 128, 192, 320].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setTargetBitrate(rate)}
                      className={`px-3 py-2 rounded-md font-bold text-sm border transition-all ${
                        targetBitrate === rate
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {rate} kbps {rate === 128 ? "(Recommended)" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "boost" && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-fk-lg flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Volume Boost Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "125% (+2 dB)", factor: 1.25 },
                    { label: "150% (+3.5 dB)", factor: 1.5 },
                    { label: "200% (+6 dB)", factor: 2.0 },
                    { label: "300% (+9.5 dB)", factor: 3.0 }
                  ].map((item) => (
                    <button
                      key={item.factor}
                      type="button"
                      onClick={() => setGainFactor(item.factor)}
                      className={`px-3 py-2 rounded-md font-bold text-sm border transition-all ${
                        gainFactor === item.factor
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "merge" && (
              <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-fk-lg">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tracks to Merge ({files.length})
                </span>
                <div className="flex flex-col gap-2">
                  {files.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md text-sm">
                      <span className="font-medium text-slate-800 truncate max-w-xs">{idx + 1}. {f.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
                <label className="cursor-pointer text-center py-2 px-4 border border-dashed border-blue-300 rounded-md text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all">
                  + Add another audio file
                  <input
                    type="file"
                    accept={allowedAccept}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleAddMergeFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  stopPlayback();
                  setFiles([]);
                  setAudioBuffers([]);
                  setWaveformPeaks(null);
                  setOutputUrl(null);
                  setOutputBlob(null);
                }}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Choose different file
              </button>

              <button
                onClick={handleProcess}
                disabled={processing || loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-fk-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {processing ? "Processing Audio..." : `Export ${title.split(" ")[0]} Output`}
              </button>
            </div>

            {/* Output Download Section */}
            {outputUrl && outputBlob && (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Ready for Download (Result Verified)
                  </span>
                  <span className="text-xs text-emerald-700 mt-0.5 font-mono">
                    {outputFileName} · {(outputBlob.size / 1024).toFixed(1)} KB · 100% In-Browser
                  </span>
                </div>
                <a
                  href={outputUrl}
                  download={outputFileName}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-fk-md shadow-sm transition-all"
                >
                  Download Output
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
