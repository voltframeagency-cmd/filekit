"use client";

import React, { useState, useRef } from "react";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";
import { useLanguage } from "@/components/layout/LanguageContext";
import {
  AspectRatioPreset,
  CropCoordinates,
  FlipDirection,
  ImageTransformMode,
  RotationAngle,
  SvgRenderOptions,
} from "@/utils/image-transform/types";
import { SvgRenderer } from "@/utils/image-transform/SvgRenderer";
import { ImageTransformEngine } from "@/utils/image-transform/ImageTransformEngine";
import { ImageExportEngine } from "@/utils/image-transform/ImageExportEngine";
import { IcoDecoder, IcoSubImage } from "@/utils/image-converter/IcoDecoder";

export interface ImageTransformWorkspaceProps {
  mode: ImageTransformMode;
  toolTitle: string;
  toolSlug: string;
  allowedExtensions: string[]; // e.g. [".svg"] or [".jpg", ".png", ".webp", ".avif", ".heic", ".ico"]
}

export const ImageTransformWorkspace: React.FC<ImageTransformWorkspaceProps> = ({
  mode,
  toolTitle,
  toolSlug,
  allowedExtensions,
}) => {
  const { language } = useLanguage();
  const isSpanish = language === "es" || language === "es-419";
  const isGerman = language === "de";
  const isFrench = language === "fr";
  const isPortuguese = language === "pt" || language === "pt-BR";

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [svgText, setSvgText] = useState<string | null>(null);
  const [icoImages, setIcoImages] = useState<IcoSubImage[]>([]);
  const [selectedIcoIndex, setSelectedIcoIndex] = useState<number>(0);
  const [sourceDims, setSourceDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    downloadUrl: string;
    outputSizeBytes: number;
    width: number;
    height: number;
    durationMs: number;
    fileName: string;
    mimeType: string;
  } | null>(null);

  // SVG options
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2);
  const [preserveTransparency, setPreserveTransparency] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");

  // Crop options
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>("freeform");
  const [cropBox, setCropBox] = useState<CropCoordinates>({ x: 0, y: 0, width: 0, height: 0 });

  // Resize options
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [exportQuality, setExportQuality] = useState<number>(90);

  // Rotate & Flip options
  const [rotationAngle, setRotationAngle] = useState<RotationAngle>(90);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("horizontal");
  const [blurRadius, setBlurRadius] = useState<number>(8);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // File loading handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setResult(null);

    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    const isIco = file.type === "image/x-icon" || file.name.toLowerCase().endsWith(".ico");

    if ((mode === "svg-to-png" || mode === "svg-to-jpg") && !isSvg) {
      setErrorMessage(isSpanish ? "Por favor selecciona un archivo vectorial SVG válido." : "Please select a valid SVG vector file.");
      return;
    }

    if (mode === "ico-to-png" && !isIco) {
      setErrorMessage(isSpanish ? "Por favor selecciona un archivo de favicon ICO válido." : "Please select a valid ICO favicon file.");
      return;
    }

    try {
      if (isSvg) {
        const text = await file.text();
        const dims = SvgRenderer.parseDimensions(text);
        setSvgText(text);
        setSourceDims({ width: dims.width, height: dims.height });
        setTargetWidth(dims.width * scaleMultiplier);
        setTargetHeight(dims.height * scaleMultiplier);
        setSourceFile(file);
      } else if (isIco) {
        const buffer = await file.arrayBuffer();
        const icoRes = IcoDecoder.decode(buffer);
        if (!icoRes.isValid || icoRes.images.length === 0) {
          throw new Error(isSpanish ? "No se encontraron iconos válidos dentro del archivo ICO." : "No valid image frames found in ICO file.");
        }
        setIcoImages(icoRes.images);
        setSelectedIcoIndex(icoRes.images.length - 1);
        const best = icoRes.images[icoRes.images.length - 1];
        setSourceDims({ width: best.width, height: best.height });
        const blob = new Blob([best.pngBuffer as unknown as BlobPart], { type: "image/png" });
        setSourceDataUrl(URL.createObjectURL(blob));
        setSourceFile(file);
      } else {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = () => rej(new Error(isSpanish ? "Error al cargar la imagen." : "Failed to load image."));
        });
        setSourceDataUrl(url);
        setSourceDims({ width: img.naturalWidth, height: img.naturalHeight });
        setTargetWidth(img.naturalWidth);
        setTargetHeight(img.naturalHeight);
        setCropBox({ x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight });
        setSourceFile(file);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || (isSpanish ? "Error al abrir el archivo de imagen." : "Failed to parse image file."));
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Aspect ratio change for Crop
  const handleAspectPresetChange = (preset: AspectRatioPreset) => {
    setAspectPreset(preset);
    if (sourceDims.width > 0 && sourceDims.height > 0) {
      const initial = ImageTransformEngine.calculateInitialCrop(sourceDims.width, sourceDims.height, preset);
      setCropBox(initial);
    }
  };

  // Resize dimension changes
  const handleWidthChange = (val: number) => {
    const w = Math.max(1, val);
    setTargetWidth(w);
    if (lockAspectRatio && sourceDims.width > 0 && sourceDims.height > 0) {
      const h = Math.round(w / (sourceDims.width / sourceDims.height));
      setTargetHeight(Math.max(1, h));
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(1, val);
    setTargetHeight(h);
    if (lockAspectRatio && sourceDims.width > 0 && sourceDims.height > 0) {
      const w = Math.round(h * (sourceDims.width / sourceDims.height));
      setTargetWidth(Math.max(1, w));
    }
  };

  const handlePercentageScale = (percent: number) => {
    if (sourceDims.width > 0 && sourceDims.height > 0) {
      const dims = ImageTransformEngine.computeResize(sourceDims.width, sourceDims.height, {
        scalePercentage: percent,
      });
      setTargetWidth(dims.width);
      setTargetHeight(dims.height);
    }
  };

  // Main Transformation Execution
  const handleExecuteTransform = async () => {
    if (!sourceFile) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (mode === "svg-to-png" || mode === "svg-to-jpg") {
        if (!svgText) throw new Error("No SVG markup available");
        const isJpg = mode === "svg-to-jpg";
        const svgOptions: SvgRenderOptions = {
          scaleMultiplier,
          preserveTransparency: isJpg ? false : preserveTransparency,
          backgroundColor: isJpg ? backgroundColor : preserveTransparency ? undefined : backgroundColor,
        };

        const { canvas, width, height } = await SvgRenderer.renderToCanvas(svgText, svgOptions);
        const exportFormat = isJpg ? "image/jpeg" : "image/png";
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: isJpg ? 0.92 : 1.0, backgroundColor },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width,
          height,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "ico-to-png") {
        if (icoImages.length === 0) throw new Error("No ICO images available");
        const selected = icoImages[selectedIcoIndex] || icoImages[0];
        const blob = new Blob([selected.pngBuffer as unknown as BlobPart], { type: "image/png" });
        const downloadUrl = URL.createObjectURL(blob);
        const baseName = sourceFile.name.replace(/\.ico$/i, "");

        setResult({
          downloadUrl,
          outputSizeBytes: selected.sizeBytes,
          width: selected.width,
          height: selected.height,
          durationMs: 12,
          fileName: `${baseName}-${selected.width}x${selected.height}.png`,
          mimeType: "image/png",
        });
      } else if (mode === "rotate") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = ImageTransformEngine.rotateCanvas(img, rotationAngle);
        const isSwapped = rotationAngle === 90 || rotationAngle === 270;
        const outW = isSwapped ? sourceDims.height : sourceDims.width;
        const outH = isSwapped ? sourceDims.width : sourceDims.height;

        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: outW,
          height: outH,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "flip") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = ImageTransformEngine.flipCanvas(img, flipDirection);
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: sourceDims.width,
          height: sourceDims.height,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "crop") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const clampedCrop = ImageTransformEngine.clampCrop(
          cropBox,
          sourceDims.width,
          sourceDims.height,
          aspectPreset
        );
        const canvas = ImageTransformEngine.cropCanvas(img, clampedCrop);
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: clampedCrop.width,
          height: clampedCrop.height,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "resize") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = ImageTransformEngine.resizeCanvas(img, targetWidth, targetHeight);
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer as unknown as BlobPart], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: targetWidth,
          height: targetHeight,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "grayscale") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = ImageTransformEngine.applyGrayscale(img);
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer as unknown as BlobPart], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: sourceDims.width,
          height: sourceDims.height,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "invert") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = ImageTransformEngine.applyInvert(img);
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer as unknown as BlobPart], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: sourceDims.width,
          height: sourceDims.height,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      } else if (mode === "blur") {
        if (!sourceDataUrl) throw new Error("No source image available");
        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = ImageTransformEngine.applyBlur(img, blurRadius);
        const exportRes = await ImageExportEngine.exportCanvas(
          canvas,
          { format: exportFormat, quality: exportQuality / 100 },
          sourceFile.name
        );

        const blob = new Blob([exportRes.outputBuffer as unknown as BlobPart], { type: exportFormat });
        const downloadUrl = URL.createObjectURL(blob);

        setResult({
          downloadUrl,
          outputSizeBytes: exportRes.outputSizeBytes,
          width: sourceDims.width,
          height: sourceDims.height,
          durationMs: exportRes.durationMs,
          fileName: exportRes.fileName,
          mimeType: exportFormat,
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during image transformation.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Upload Zone */}
      {!sourceFile && (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-fk-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl">
            {mode === "svg-to-png" || mode === "svg-to-jpg"
              ? "📐"
              : mode === "crop"
              ? "✂️"
              : mode === "rotate"
              ? "🔄"
              : mode === "flip"
              ? "↔️"
              : mode === "ico-to-png"
              ? "⭐"
              : "🖼️"}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">
              {isPortuguese
                ? `Selecionar ${mode.startsWith("svg") ? "ficheiro SVG" : mode === "ico-to-png" ? "ícone ICO" : "imagem"}`
                : isFrench
                ? `Sélectionner ${mode.startsWith("svg") ? "un fichier SVG" : mode === "ico-to-png" ? "un favicon ICO" : "une image"}`
                : isGerman
                ? `Wählen Sie ${mode.startsWith("svg") ? "SVG-Datei" : mode === "ico-to-png" ? "ICO-Icon" : "Bilddatei"}`
                : isSpanish
                ? `Selecciona ${mode.startsWith("svg") ? "archivo SVG" : mode === "ico-to-png" ? "icono ICO" : "imagen"}`
                : `Select ${mode.startsWith("svg") ? "SVG File" : mode === "ico-to-png" ? "ICO Favicon" : "Image"}`}
            </h2>
            <p className="text-sm text-slate-400">
              {isPortuguese
                ? "Processamento 100% privado na memória do seu navegador."
                : isFrench
                ? "Traitement 100% privé dans la mémoire de votre navigateur."
                : isGerman
                ? "100% private Verarbeitung im Speicher Ihres Browsers."
                : isSpanish
                ? "Procesamiento 100% privado en la memoria de tu navegador."
                : mode === "svg-to-png"
                ? "Convert scalable vector SVG graphics into crisp PNG raster images."
                : mode === "svg-to-jpg"
                ? "Convert scalable vector SVG graphics into universal JPG photos."
                : mode === "crop"
                ? "Crop and trim photos with custom aspect ratios directly on your device."
                : mode === "rotate"
                ? "Rotate images by 90°, 180°, or 270° with zero loss in visual quality."
                : mode === "flip"
                ? "Flip and mirror images horizontally or vertically in browser memory."
                : mode === "ico-to-png"
                ? "Extract high-resolution PNG icons from Windows ICO favicon files."
                : "Resize image dimensions and file size locally in your browser memory."}
            </p>
          </div>
          <label className="cursor-pointer bg-fk-primary hover:bg-fk-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-fk-primary/20">
            {isPortuguese ? "Escolher ficheiro" : isFrench ? "Choisir un fichier" : isGerman ? "Datei wählen" : isSpanish ? "Elegir archivo" : "Choose File"}
            <input
              type="file"
              accept={allowedExtensions.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {/* Interactive Editor Workspace */}
      {sourceFile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                {mode.startsWith("svg") ? "SVG" : mode === "ico-to-png" ? "ICO" : "IMG"}
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">
                  {sourceDims.width} × {sourceDims.height} px • {(sourceFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="local" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setResult(null);
                  setSourceDataUrl(null);
                  setIcoImages([]);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                {isPortuguese ? "Alterar ficheiro" : isFrench ? "Changer de fichier" : isGerman ? "Datei ändern" : isSpanish ? "Cambiar archivo" : "Change File"}
              </button>
            </div>
          </div>

          {/* Mode Controls */}
          {(mode === "svg-to-png" || mode === "svg-to-jpg") && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300">Resolution Multiplier (DPI):</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => setScaleMultiplier(scale)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        scaleMultiplier === scale
                          ? "bg-fk-primary text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {scale}x ({sourceDims.width * scale}×{sourceDims.height * scale})
                    </button>
                  ))}
                </div>
              </div>

              {mode === "svg-to-png" && (
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-700/50">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={preserveTransparency}
                      onChange={(e) => setPreserveTransparency(e.target.checked)}
                      className="w-4 h-4 rounded text-fk-primary bg-slate-900 border-slate-700"
                    />
                    <span>Preserve Transparent Background</span>
                  </label>
                  {!preserveTransparency && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Background:</span>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              {mode === "svg-to-jpg" && (
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-700/50">
                  <span className="text-xs text-slate-300">Background Fill Color:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-slate-400 font-mono">{backgroundColor}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "ico-to-png" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Select Embedded Sub-Image to Extract:</span>
              <div className="flex flex-wrap gap-2">
                {icoImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedIcoIndex(idx);
                      const blob = new Blob([img.pngBuffer as unknown as BlobPart], { type: "image/png" });
                      setSourceDataUrl(URL.createObjectURL(blob));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                      selectedIcoIndex === idx
                        ? "bg-fk-primary text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>{img.width} × {img.height} px</span>
                    <span className="text-[10px] opacity-70">({(img.sizeBytes / 1024).toFixed(1)} KB)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "rotate" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300">Rotation Angle:</span>
                <div className="flex items-center gap-2">
                  {([90, 180, 270] as RotationAngle[]).map((angle) => (
                    <button
                      key={angle}
                      type="button"
                      onClick={() => setRotationAngle(angle)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        rotationAngle === angle
                          ? "bg-fk-primary text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {angle === 90 ? "90° CW" : angle === 180 ? "180°" : "270° (90° CCW)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "flip" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300">Flip Direction:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlipDirection("horizontal")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      flipDirection === "horizontal"
                        ? "bg-fk-primary text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    ↔ Horizontal Flip
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipDirection("vertical")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      flipDirection === "vertical"
                        ? "bg-fk-primary text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    ↕ Vertical Flip
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "crop" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300">Aspect Ratio Preset:</span>
                <div className="flex flex-wrap gap-2">
                  {(["freeform", "1:1", "16:9", "4:3", "3:2", "9:16"] as AspectRatioPreset[]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAspectPresetChange(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        aspectPreset === preset
                          ? "bg-fk-primary text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {preset === "freeform" ? "Freeform" : preset}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Crop Selection: {cropBox.width} × {cropBox.height} px</span>
                <span>Origin: ({cropBox.x}, {cropBox.y})</span>
              </div>
            </div>
          )}

          {mode === "resize" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              {/* Dimensions Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth || ""}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-fk-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight || ""}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-fk-primary"
                  />
                </div>
              </div>

              {/* Aspect Ratio Lock & Quick Scales */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    lockAspectRatio ? "bg-blue-600/30 text-blue-300 border border-blue-500/30" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <span>{lockAspectRatio ? "🔒 Aspect Ratio Locked" : "🔓 Independent Dimensions"}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {[25, 50, 75, 150, 200].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentageScale(pct)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          {sourceDataUrl && (
            <div className="relative rounded-xl overflow-hidden bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 border border-slate-800 p-4 flex items-center justify-center min-h-[220px] max-h-[400px]">
              <img
                ref={imgRef}
                src={sourceDataUrl}
                alt="Source Preview"
                style={{
                  transform:
                    mode === "rotate"
                      ? `rotate(${rotationAngle}deg)`
                      : mode === "flip"
                      ? flipDirection === "horizontal"
                        ? "scaleX(-1)"
                        : "scaleY(-1)"
                      : undefined,
                  transition: "transform 0.2s ease",
                }}
                className="max-h-[360px] max-w-full object-contain shadow-md rounded-lg"
              />
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          {!result && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleExecuteTransform}
              className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing on this device...</span>
                </>
              ) : mode === "svg-to-png" ? (
                "Export as PNG"
              ) : mode === "svg-to-jpg" ? (
                "Export as JPG"
              ) : mode === "crop" ? (
                "Crop Image"
              ) : mode === "rotate" ? (
                `Rotate Image (${rotationAngle}°)`
              ) : mode === "flip" ? (
                `Flip Image (${flipDirection === "horizontal" ? "Horizontal" : "Vertical"})`
              ) : mode === "ico-to-png" ? (
                "Extract PNG Icon"
              ) : (
                "Resize Image"
              )}
            </button>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Image Export Ready</h4>
                  <p className="text-xs text-slate-400">
                    {result.width} × {result.height} px • {(result.outputSizeBytes / 1024).toFixed(1)} KB • Processed in {result.durationMs}ms locally
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
