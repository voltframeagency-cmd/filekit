"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface ImageComparisonSliderProps {
  originalUrl: string;
  outputUrl: string;
  originalLabel?: string;
  outputLabel?: string;
  className?: string;
  onSliderUsed?: () => void;
}

export default function ImageComparisonSlider({
  originalUrl,
  outputUrl,
  originalLabel = "Original",
  outputLabel = "Optimized",
  className = "",
  onSliderUsed
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0..100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLoggedUsedRef = useRef<boolean>(false);

  // Compute position percentage based on pointer coordinates
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const isRtl = document.documentElement.getAttribute("dir") === "rtl" || document.dir === "rtl";
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    let pct = (x / rect.width) * 100;
    if (isRtl) {
      pct = 100 - pct;
    }
    setSliderPosition(Math.max(0, Math.min(100, pct)));

    if (!hasLoggedUsedRef.current) {
      hasLoggedUsedRef.current = true;
      if (onSliderUsed) onSliderUsed();
    }
  }, [onSliderUsed]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let delta = 0;
    const step = e.shiftKey ? 10 : 1;
    const isRtl = document.documentElement.getAttribute("dir") === "rtl" || document.dir === "rtl";

    if (e.key === "ArrowLeft") {
      delta = isRtl ? step : -step;
    } else if (e.key === "ArrowRight") {
      delta = isRtl ? -step : step;
    } else if (e.key === "Home") {
      setSliderPosition(0);
      e.preventDefault();
      return;
    } else if (e.key === "End") {
      setSliderPosition(100);
      e.preventDefault();
      return;
    } else {
      return;
    }

    e.preventDefault();
    setSliderPosition((prev) => {
      const next = Math.max(0, Math.min(100, prev + delta));
      if (!hasLoggedUsedRef.current && onSliderUsed) {
        hasLoggedUsedRef.current = true;
        onSliderUsed();
      }
      return next;
    });
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {/* Visual Comparison Viewport */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-label="Compare original and optimized image"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] rounded-fk-xl overflow-hidden select-none border border-fk-border shadow-sm touch-none cursor-ew-resize bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]"
      >
        {/* Layer 1: Optimized Result Image (Background) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={outputUrl}
          alt={outputLabel}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Layer 2: Original Image (Clipped Overlay) */}
        <div
          className="absolute top-0 bottom-0 ltr:left-0 rtl:right-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt={originalLabel}
            className="absolute top-0 bottom-0 ltr:left-0 rtl:right-0 max-w-none w-full h-full object-contain pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
          />
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] pointer-events-none z-10"
          style={{
            left: document.dir === "rtl" || (typeof document !== "undefined" && document.documentElement.getAttribute("dir") === "rtl")
              ? `${100 - sliderPosition}%`
              : `${sliderPosition}%`
          }}
        >
          {/* Slider Handle Grip */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-fk-primary shadow-md flex items-center justify-center text-fk-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" className="rotate-90 origin-center" />
            </svg>
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute top-3 ltr:left-3 rtl:right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide pointer-events-none z-20">
          {originalLabel}
        </div>
        <div className="absolute top-3 ltr:right-3 rtl:left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide pointer-events-none z-20">
          {outputLabel}
        </div>
      </div>

      {/* Instructional Hint */}
      <div className="flex items-center justify-between text-[11px] text-fk-text-subtle px-1">
        <span>👈 Drag handle or use Arrow keys to compare original vs optimized</span>
        <span className="font-mono">{Math.round(sliderPosition)}%</span>
      </div>
    </div>
  );
}
