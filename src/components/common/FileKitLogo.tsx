"use client";

import React from "react";

interface FileKitLogoProps {
  variant?: "horizontal" | "compact" | "mark";
  colorMode?: "color" | "inverted" | "monochrome";
  className?: string;
}

export default function FileKitLogo({
  variant = "horizontal",
  colorMode = "color",
  className = "",
}: FileKitLogoProps) {
  // Color configuration
  const bgFill = colorMode === "inverted" ? "#FFFFFF" : "#0F172A"; // Midnight Ink / White
  const whiteLayerFill = colorMode === "inverted" ? "#0F172A" : "#FFFFFF"; // Whitespace inside document silhouette
  const primaryFill = colorMode === "monochrome" ? bgFill : "#2563EB"; // Cobalt Blue / Navy
  const textLeftColor = colorMode === "inverted" ? "text-white" : "text-fk-text";
  const textRightColor = colorMode === "monochrome" ? textLeftColor : "text-fk-primary";

  // Mark SVG Only (200x200 silhouette)
  const renderMarkSvg = (scaleClass = "w-10 h-10") => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      role="img"
      aria-label="FileKit mark"
      shapeRendering="geometricPrecision"
      className={`${scaleClass} shrink-0`}
    >
      <path
        fill={bgFill}
        fillRule="evenodd"
        d="M44 18 H120 L176 74 V162 C176 176.4 164.4 188 150 188 H44 C29.6 188 18 176.4 18 162 V44 C18 29.6 29.6 18 44 18 Z M46 32 H120 V58 C120 66.8 127.2 74 136 74 H162 V160 C162 167.7 155.7 174 148 174 H46 C38.3 174 32 167.7 32 160 V46 C32 38.3 38.3 32 46 32 Z"
      />
      <path
        fill={primaryFill}
        d="M120 18 H123 L174.5 69.5 Q176 71 176 74 H136 C127.2 74 120 66.8 120 58 Z"
      />
      <path
        d="M49 78 V52 H75"
        fill="none"
        stroke={primaryFill}
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M119 158 H149 V128"
        fill="none"
        stroke={primaryFill}
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );

  if (variant === "mark") {
    return renderMarkSvg(className || "w-10 h-10");
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {renderMarkSvg("w-9 h-9")}
      {variant !== "compact" && (
        <span className="flex text-[22px] font-bold tracking-tight leading-none">
          <span className={textLeftColor}>File</span>
          <span className={textRightColor}>Kit</span>
        </span>
      )}
    </div>
  );
}
