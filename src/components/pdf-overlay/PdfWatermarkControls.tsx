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
  onApplyWatermark: () => void;
  onResetWorkspace: () => void;
  isProcessing?: boolean;
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
  onApplyWatermark,
  onResetWorkspace,
  isProcessing = false,
  validationError,
}) => {
  const isWinAnsiValid = config.type === "text" ? isWinAnsiSupported(config.text || "") : true;
  const isApplyDisabled = isProcessing || !!validationError;

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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Font Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.fontColor || "#EF4444"}
                  onChange={(e) => onChange({ fontColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={config.fontColor || "#EF4444"}
                  onChange={(e) => onChange({ fontColor: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
                />
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
                step={2}
                value={config.fontSize || 36}
                onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 36 })}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Settings */}
      {config.type === "image" && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Select Logo Image (PNG / JPEG)
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={onImageFileChange}
              className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-950 file:text-blue-300 hover:file:bg-blue-900 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Opacity & Rotation */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Opacity ({Math.round((config.opacity || 0.4) * 100)}%)
          </label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={config.opacity || 0.4}
            onChange={(e) => onChange({ opacity: parseFloat(e.target.value) || 0.4 })}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Rotation ({config.rotationAngle || 0}°)
          </label>
          <input
            type="range"
            min={-180}
            max={180}
            step={5}
            value={config.rotationAngle || 0}
            onChange={(e) => onChange({ rotationAngle: parseInt(e.target.value) || 0 })}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* Position Preset */}
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

      {/* CTA Action Buttons */}
      <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
        <button
          type="button"
          onClick={onApplyWatermark}
          disabled={isApplyDisabled}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Applying Watermark...
            </>
          ) : (
            "Apply Watermark"
          )}
        </button>

        <button
          type="button"
          onClick={onResetWorkspace}
          className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
