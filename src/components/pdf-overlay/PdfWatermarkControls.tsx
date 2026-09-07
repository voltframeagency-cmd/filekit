"use client";

import React from "react";
import {
  WatermarkConfig,
  WatermarkPositionPreset,
  WatermarkTargetPages,
} from "@/utils/pdf-overlay/types";
import { isWinAnsiSupported } from "@/utils/pdf-overlay/watermarkOperations";

interface PdfWatermarkControlsProps {
  language?: string;
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
  language = "en",
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
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isGreek = language === "el";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";
  const isTaiwan = language === "zh-TW" || (language as string).toLowerCase() === "zh-tw";
  const isChinese = language.startsWith("zh");

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Type Selector (Text vs Image) */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          {isTaiwan ? "浮水印類型" : isChinese ? "水印类型" : isRussian ? "Тип водяного знака" : isUkrainian ? "Тип водяного знака" : isGreek ? "Τύπος υδατογραφήματος" : isSlovak ? "Typ vodoznaku" : isSlovenian ? "Vrsta vodnega žiga" : isBulgarian ? "Тип воден знак" : "Watermark Type"}
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
            {isTaiwan ? "文字浮水印" : isChinese ? "文本水印" : isRussian ? "Текстовый водяной знак" : isUkrainian ? "Текстовий водяний знак" : isGreek ? "Υδατογράφημα κειμένου" : isSlovak ? "Textový vodoznak" : isSlovenian ? "Besedilni vodni žig" : isBulgarian ? "Текстов воден знак" : "Text Watermark"}
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
            {isTaiwan ? "圖片 / 標誌" : isChinese ? "图片 / 标志" : isRussian ? "Логотип / Изображение" : isUkrainian ? "Логотип / Зображення" : isGreek ? "Λογότυπο / Εικόνα" : isSlovak ? "Logo / Obrázok" : isSlovenian ? "Logotip / Slika" : isBulgarian ? "Лого / Изображение" : "Image Logo"}
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
              {isTaiwan ? "浮水印文字" : isChinese ? "水印文本" : isRussian ? "Текст водяного знака" : isUkrainian ? "Текст водяного знака" : isGreek ? "Κείμενο υδατογραφήματος" : isSlovak ? "Text vodoznaku" : isSlovenian ? "Besedilo vodnega žiga" : isBulgarian ? "Текст на водния знак" : "Watermark Text"}
            </label>
            <input
              type="text"
              value={config.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder={isTaiwan ? "例如：草稿 / 機密檔案" : isChinese ? "例如：草稿 / 机密文件" : "e.g. DRAFT / CONFIDENTIAL"}
              className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-slate-100 text-xs focus:outline-none focus:ring-1 font-semibold ${
                !isWinAnsiValid ? "border-amber-600 focus:ring-amber-500" : "border-slate-800 focus:ring-blue-500"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {isTaiwan ? "文字顏色" : isChinese ? "文字颜色" : isRussian ? "Цвет шрифта" : isUkrainian ? "Колір шрифту" : isGreek ? "Χρώμα γραμματοσειράς" : isSlovak ? "Farba písma" : isSlovenian ? "Barva pisave" : isBulgarian ? "Цвят на шрифта" : "Font Color"}
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
                {isTaiwan ? `字型大小 (${config.fontSize || 36} pt)` : isChinese ? `字体大小 (${config.fontSize || 36} pt)` : isRussian ? `Размер шрифта (${config.fontSize || 36} пт)` : isUkrainian ? `Розмір шрифту (${config.fontSize || 36} пт)` : isGreek ? `Μέγεθος (${config.fontSize || 36} pt)` : isSlovak ? `Veľkosť písma (${config.fontSize || 36} pt)` : isSlovenian ? `Velikost pisave (${config.fontSize || 36} pt)` : isBulgarian ? `Размер на шрифта (${config.fontSize || 36} pt)` : `Font Size (${config.fontSize || 36} pt)`}
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
              {isTaiwan ? "選取圖片 / 標誌檔案 (PNG / JPEG)" : isChinese ? "选择图片 / 标志文件 (PNG / JPEG)" : isRussian ? "Выберите изображение логотипа (PNG / JPEG)" : isUkrainian ? "Виберіть логотип (PNG / JPEG)" : isGreek ? "Επιλέξτε λογότυπο (PNG / JPEG)" : isSlovak ? "Vyberte obrázok loga (PNG / JPEG)" : isSlovenian ? "Izberite sliko logotipa (PNG / JPEG)" : isBulgarian ? "Изберете лого изображение (PNG / JPEG)" : "Select Logo Image (PNG / JPEG)"}
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
            {isTaiwan ? `不透明度 (${Math.round((config.opacity || 0.4) * 100)}%)` : isChinese ? `不透明度 (${Math.round((config.opacity || 0.4) * 100)}%)` : `Opacity (${Math.round((config.opacity || 0.4) * 100)}%)`}
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
            {isTaiwan ? `旋轉角度 (${config.rotationAngle || 0}°)` : isChinese ? `旋转角度 (${config.rotationAngle || 0}°)` : `Rotation (${config.rotationAngle || 0}°)`}
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
          {isTaiwan ? "位置設定" : isChinese ? "位置预设" : "Position Preset"}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {POSITION_PRESETS.map((preset) => {
            let label = preset.label;
            if (isTaiwan) {
              if (preset.id === "top-left") label = "左上";
              else if (preset.id === "center") label = "置中";
              else if (preset.id === "top-right") label = "右上";
              else if (preset.id === "bottom-left") label = "左下";
              else if (preset.id === "tile") label = "平鋪網格";
              else if (preset.id === "bottom-right") label = "右下";
              else if (preset.id === "custom") label = "自訂座標";
            } else if (isChinese) {
              if (preset.id === "top-left") label = "左上";
              else if (preset.id === "center") label = "居中";
              else if (preset.id === "top-right") label = "右上";
              else if (preset.id === "bottom-left") label = "左下";
              else if (preset.id === "tile") label = "平铺网格";
              else if (preset.id === "bottom-right") label = "右下";
              else if (preset.id === "custom") label = "自定义坐标";
            }
            return (
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
                {label}
              </button>
            );
          })}
        </div>

        {/* Custom Coordinates Inputs */}
        {config.positionPreset === "custom" && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {isTaiwan ? "自訂 X (pt)" : isChinese ? "自定义 X (pt)" : "Custom X (pt)"}
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
                {isTaiwan ? "自訂 Y (pt)" : isChinese ? "自定义 Y (pt)" : "Custom Y (pt)"}
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
          {isTaiwan ? "套用至頁面" : isChinese ? "应用至页面" : isRussian ? "Применить к страницам" : isUkrainian ? "Застосувати до сторінок" : isGreek ? "Εφαρμογή σε σελίδες" : isSlovak ? "Použiť na strany" : isSlovenian ? "Uporabi za strani" : isBulgarian ? "Прилагане към страници" : "Apply To Pages"}
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
                ? (isTaiwan ? "全部頁面" : isChinese ? "所有页面" : isRussian ? "Все страницы" : isUkrainian ? "Усі сторінки" : isGreek ? "Όλες οι σελίδες" : isSlovak ? "Všetky strany" : isSlovenian ? "Vse strani" : isBulgarian ? "Всички страници" : "All Pages")
                : mode === "odd"
                ? (isTaiwan ? "僅奇數頁" : isChinese ? "仅奇数页" : isRussian ? "Только нечетные" : isUkrainian ? "Лише непарні" : isGreek ? "Μόνο μονές" : isSlovak ? "Len nepárne" : isSlovenian ? "Samo lihe" : isBulgarian ? "Само нечетни" : "Odd Pages Only")
                : mode === "even"
                ? (isTaiwan ? "僅偶數頁" : isChinese ? "仅偶数页" : isRussian ? "Только четные" : isUkrainian ? "Лише парні" : isGreek ? "Μόνο ζυγές" : isSlovak ? "Len párne" : isSlovenian ? "Samo sode" : isBulgarian ? "Само четни" : "Even Pages Only")
                : (isTaiwan ? "自訂範圍" : isChinese ? "自定义范围" : isRussian ? "Свой диапазон" : isUkrainian ? "Власний діапазон" : isGreek ? "Προσαρμοσμένο εύρος" : isSlovak ? "Vlastný rozsah" : isSlovenian ? "Obseg po meri" : isBulgarian ? "Персонализиран обхват" : "Custom Range")}
            </button>
          ))}
        </div>

        {config.targetPagesMode === "custom" && (
          <input
            type="text"
            value={config.customPageRange || ""}
            onChange={(e) => onChange({ customPageRange: e.target.value })}
            placeholder={isTaiwan ? "例如：1-3, 5" : isChinese ? "例如：1-3, 5" : "e.g. 1-3, 5"}
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
              {isTaiwan ? "正在套用浮水印..." : isChinese ? "正在应用水印..." : isRussian ? "Применение водяного знака..." : isUkrainian ? "Застосування водяного знака..." : isGreek ? "Εφαρμογή υδατογραφήματος..." : isSlovak ? "Aplikovanie vodoznaku..." : isSlovenian ? "Uporaba vodnega žiga..." : isBulgarian ? "Прилагане на воден знак..." : "Applying Watermark..."}
            </>
          ) : (
            isTaiwan ? "套用浮水印" : isChinese ? "应用水印" : isRussian ? "Добавить водяной знак" : isUkrainian ? "Додати водяний знак" : isGreek ? "Εφαρμογή υδατογραφήματος" : isSlovak ? "Pridať vodoznak" : isSlovenian ? "Dodaj vodni žig" : isBulgarian ? "Добавяне на воден знак" : "Apply Watermark"
          )}
        </button>

        <button
          type="button"
          onClick={onResetWorkspace}
          className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"
        >
          {isTaiwan ? "重設" : isChinese ? "重置" : isRussian ? "Сбросить" : isUkrainian ? "Скинути" : isGreek ? "Επαναφορά" : isSlovak ? "Resetovať" : isSlovenian ? "Ponastavi" : isBulgarian ? "Нулиране" : "Reset"}
        </button>
      </div>
    </div>
  );
};
