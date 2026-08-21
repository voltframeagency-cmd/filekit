import React from 'react';
import { fileKitAssets, FileKitAssetName } from './assetRegistry';

export interface FileKitAssetProps {
  name: string;
  className?: string;
  alt?: string;
  decorative?: boolean;
  priority?: boolean;
}

// Brand color palette per file extension
const FORMAT_COLORS: Record<string, { stroke: string; fill: string; badge: string }> = {
  pdf: { stroke: '#ef4444', fill: '#fee2e2', badge: '#dc2626' },
  jpg: { stroke: '#7c3aed', fill: '#ede9fe', badge: '#7c3aed' },
  jpeg: { stroke: '#7c3aed', fill: '#ede9fe', badge: '#7c3aed' },
  png: { stroke: '#0f9f6e', fill: '#d1fae5', badge: '#059669' },
  webp: { stroke: '#0284c7', fill: '#e0f2fe', badge: '#0284c7' },
  ico: { stroke: '#d97706', fill: '#fef3c7', badge: '#d97706' },
  gif: { stroke: '#db2777', fill: '#fce7f3', badge: '#db2777' },
  svg: { stroke: '#ea580c', fill: '#ffedd5', badge: '#ea580c' },
  avif: { stroke: '#8b5cf6', fill: '#f3e8ff', badge: '#7c3aed' },
  heic: { stroke: '#2563eb', fill: '#dbeafe', badge: '#2563eb' },
  bmp: { stroke: '#64748b', fill: '#f1f5f9', badge: '#475569' },
  tiff: { stroke: '#0d9488', fill: '#ccfbf1', badge: '#0d9488' },
  tif: { stroke: '#0d9488', fill: '#ccfbf1', badge: '#0d9488' },
  psd: { stroke: '#3b82f6', fill: '#eff6ff', badge: '#1d4ed8' },
  eps: { stroke: '#f59e0b', fill: '#fef3c7', badge: '#d97706' },
  ai: { stroke: '#ea580c', fill: '#ffedd5', badge: '#c2410c' },
  dwg: { stroke: '#e11d48', fill: '#ffe4e6', badge: '#be123c' },
  dxf: { stroke: '#0284c7', fill: '#e0f2fe', badge: '#0369a1' },
  word: { stroke: '#2563eb', fill: '#dbeafe', badge: '#1d4ed8' },
  docx: { stroke: '#2563eb', fill: '#dbeafe', badge: '#1d4ed8' },
  excel: { stroke: '#16a34a', fill: '#dcfce7', badge: '#15803d' },
  xlsx: { stroke: '#16a34a', fill: '#dcfce7', badge: '#15803d' },
  powerpoint: { stroke: '#ea580c', fill: '#ffedd5', badge: '#c2410c' },
  pptx: { stroke: '#ea580c', fill: '#ffedd5', badge: '#c2410c' },
  zip: { stroke: '#475569', fill: '#f1f5f9', badge: '#334155' },
  mp3: { stroke: '#a855f7', fill: '#faf5ff', badge: '#9333ea' },
  mp4: { stroke: '#2563eb', fill: '#eff6ff', badge: '#1d4ed8' },
};

function getFormatConfig(fmt: string) {
  const clean = fmt.toLowerCase().trim();
  return FORMAT_COLORS[clean] || { stroke: '#3b82f6', fill: '#eff6ff', badge: '#2563eb' };
}

export const FileKitAsset: React.FC<FileKitAssetProps> = ({
  name,
  className = 'h-auto w-full max-w-[240px]',
  alt,
  decorative = false,
  priority = false,
}) => {
  // If the asset name matches a "X-to-Y" conversion pattern, render a dynamic pixel-perfect SVG
  // with the exact format text and brand colors for each side.
  const toMatch = name.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/i);

  if (toMatch) {
    const fromFmt = toMatch[1].toUpperCase();
    const toFmt = toMatch[2].toUpperCase();
    const fromColors = getFormatConfig(fromFmt);
    const toColors = getFormatConfig(toFmt);
    const effectiveAlt = decorative ? '' : alt ?? `Convert ${fromFmt} to ${toFmt}`;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 720 420"
        className={className}
        aria-hidden={decorative ? true : undefined}
        role={decorative ? 'presentation' : 'img'}
        aria-label={effectiveAlt}
      >
        <title>{`Convert ${fromFmt} to ${toFmt}`}</title>
        
        {/* Left Source File Card */}
        <g transform="translate(46, 54)">
          {/* Main Card Sheet */}
          <path
            fill="#ffffff"
            stroke={fromColors.stroke}
            strokeLinejoin="round"
            strokeWidth="11"
            d="M22 0h156l50 50v240q0 22-22 22H22q-22 0-22-22V22Q0 0 22 0Z"
          />
          {/* Folded Corner */}
          <path
            fill="none"
            stroke={fromColors.stroke}
            strokeLinejoin="round"
            strokeWidth="11"
            d="M178 0v50h50"
          />
          {/* Format Badge Header */}
          <rect width="132" height="54" y="56" fill={fromColors.badge} rx="4" />
          <text
            x="66"
            y="93"
            fill="#ffffff"
            fontFamily="Inter, Arial, sans-serif"
            fontSize={fromFmt.length > 3 ? "24" : "29"}
            fontWeight="700"
            textAnchor="middle"
          >
            {fromFmt}
          </text>
          
          {/* Document Content Preview Graphic */}
          <g transform="translate(38, 146)">
            <rect
              width="152"
              height="112"
              fill="#ffffff"
              stroke={fromColors.stroke}
              strokeWidth="8"
              rx="6"
            />
            {/* Inner Graphic Elements */}
            <circle cx="52" cy="38" r="14" fill={fromColors.badge} />
            <path
              fill={fromColors.badge}
              d="m16 94 42-42 32 26 30-34 20 50Z"
            />
          </g>
        </g>

        {/* Center Conversion Directional Arrow */}
        <path
          fill="none"
          stroke="#2563eb"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="10"
          d="M306 210h92m-24-22 28 22-28 22"
        />

        {/* Right Target File Card */}
        <g transform="translate(446, 54)">
          {/* Main Card Sheet */}
          <path
            fill="#ffffff"
            stroke={toColors.stroke}
            strokeLinejoin="round"
            strokeWidth="11"
            d="M22 0h156l50 50v240q0 22-22 22H22q-22 0-22-22V22Q0 0 22 0Z"
          />
          {/* Folded Corner */}
          <path
            fill="none"
            stroke={toColors.stroke}
            strokeLinejoin="round"
            strokeWidth="11"
            d="M178 0v50h50"
          />
          {/* Format Badge Header */}
          <rect width="132" height="54" y="56" fill={toColors.badge} rx="4" />
          <text
            x="66"
            y="93"
            fill="#ffffff"
            fontFamily="Inter, Arial, sans-serif"
            fontSize={toFmt.length > 3 ? "24" : "29"}
            fontWeight="700"
            textAnchor="middle"
          >
            {toFmt}
          </text>
          
          {/* Document Content Preview Graphic */}
          <g transform="translate(38, 146)">
            <rect
              width="152"
              height="112"
              fill="#ffffff"
              stroke={toColors.stroke}
              strokeWidth="8"
              rx="6"
            />
            {/* Inner Graphic Elements */}
            <circle cx="52" cy="38" r="14" fill={toColors.badge} />
            <path
              fill={toColors.badge}
              d="m16 94 42-42 32 26 30-34 20 50Z"
            />
          </g>
        </g>
      </svg>
    );
  }

  // Fallback to static asset from registry if defined
  const asset = (fileKitAssets as any)[name];

  if (!asset) {
    console.warn(`[FileKitAsset] Asset "${name}" not found in registry.`);
    return null;
  }

  const effectiveAlt = decorative ? '' : alt ?? asset.alt;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.path}
      alt={effectiveAlt}
      aria-hidden={decorative ? true : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  );
};

