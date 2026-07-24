"use client";

import React from "react";
import {
  WatermarkConfig,
  WatermarkPositionPreset,
  WatermarkTargetPages,
} from "@/utils/pdf-overlay/types";
import { isWinAnsiSupported } from "@/utils/pdf-overlay/watermarkOperations";

interface PdfWatermarkControlsProps {
  config: WatermarkConfig;
  onChange: (updated: Partial<WatermarkConfig>) => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationError?: string | null;
}

const POSITION_PRESETS: Array<{ id: WatermarkPositionPreset; label: string }> = [
  { id: "top-left", label: "Top Left" },
  { id: "center", label: "Center" },
  { id: "top-right", label: "Top Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "tile", label: "Tile Grid" },
  { id: "bottom-right", label: "Bottom Right" },
  { id: "custom", label: "Custom X/Y" },
];

export const PdfWatermarkControls: React.FC<PdfWatermarkControlsProps> = ({
  config,
  onChange,
  onImageFileChange,
  validationError,
}) => {
  const isWinAnsiValid = config.type === "text" ? isWinAnsiSupported(config.text || "") : true;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Type Selector (Text vs Image) */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Watermark Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ type: "text" })}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              config.type === "text"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Text Watermark
          </button>

          <button
            type="button"
            onClick={() => onChange({ type: "image" })}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              config.type === "image"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image Logo
          </button>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationError && (
        <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{validationError}</span>
        </div>
      )}

      {/* Text Settings */}
      {config.type === "text" && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Watermark Text
            </label>
            <input
              type="text"
              value={config.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="e.g. DRAFT / CONFIDENTIAL"
              className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-slate-100 text-xs focus:outline-none focus:ring-1 font-semibold ${
                !isWinAnsiValid ? "border-amber-600 focus:ring-amber-500" : "border-slate-800 focus:ring-blue-500"
              }`}
            />
            {!isWinAnsiValid && (
              <p className="text-[11px] text-amber-400 mt-1">
                Standard PDF fonts support Latin characters (A-Z, 0-9, standard symbols).
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Font Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.fontColor || "#3B82F6"}
                  onChange={(e) => onChange({ fontColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">
                  {config.fontColor || "#3B82F6"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Font Size ({config.fontSize || 36} pt)
              </label>
              <input
                type="range"
                min={12}
                max={96}
                value={config.fontSize || 36}
                onChange={(e) => onChange({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Settings */}
      {config.type === "image" && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Upload Logo / Image Watermark (PNG, JPG)
          </label>
          <label className={`cursor-pointer flex items-center justify-center p-3 border border-dashed rounded-xl text-xs font-semibold transition ${
            config.imageBuffer
              ? "border-emerald-700/80 bg-emerald-950/40 text-emerald-200"
              : "border-slate-700 hover:border-blue-500 bg-slate-950 text-slate-300"
          }`}>
            <span>{config.imageBuffer ? "✓ Image Uploaded (Click to Change)" : "Select PNG / JPG Logo"}</span>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={onImageFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Opacity & Rotation Sliders */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Opacity ({Math.round((config.opacity || 0.4) * 100)}%)
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round((config.opacity || 0.4) * 100)}
            onChange={(e) => onChange({ opacity: parseInt(e.target.value, 10) / 100 })}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Rotation ({config.rotationAngle || 45}°)
          </label>
          <input
            type="range"
            min={-90}
            max={90}
            value={config.rotationAngle || 45}
            onChange={(e) => onChange({ rotationAngle: parseInt(e.target.value, 10) })}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Position Preset Selector Grid */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Position Preset
        </label>
        <div className="grid grid-cols-3 gap-2">
          {POSITION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ positionPreset: preset.id })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                config.positionPreset === preset.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Coordinates Inputs */}
        {config.positionPreset === "custom" && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Custom X (pt)
              </label>
              <input
                type="number"
                value={config.customX ?? 36}
                onChange={(e) => onChange({ customX: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Custom Y (pt)
              </label>
              <input
                type="number"
                value={config.customY ?? 36}
                onChange={(e) => onChange({ customY: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Target Pages Mode */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Apply To Pages
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {(["all", "odd", "even", "custom"] as WatermarkTargetPages[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ targetPagesMode: mode })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition ${
                config.targetPagesMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {mode === "all"
                ? "All Pages"
                : mode === "odd"
                ? "Odd Pages Only"
                : mode === "even"
                ? "Even Pages Only"
                : "Custom Range"}
            </button>
          ))}
        </div>

        {config.targetPagesMode === "custom" && (
          <input
            type="text"
            value={config.customPageRange || ""}
            onChange={(e) => onChange({ customPageRange: e.target.value })}
            placeholder="e.g. 1-3, 5"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )}
      </div>
    </div>
  );
};
