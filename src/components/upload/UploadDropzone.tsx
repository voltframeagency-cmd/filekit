"use client";

import React, { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../layout/LanguageContext";
import { FileKitAsset } from "../visuals/FileKitAsset";
import { FileKitAssetName, fileKitAssets } from "../visuals/assetRegistry";

interface UploadDropzoneProps {
  isGeneric?: boolean;
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
  assetName?: FileKitAssetName;
}

// Map pathnames to brand illustration assets
function getRouteAssetName(pathname: string): FileKitAssetName {
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  const route = (segments.length > 1 && segments[0].length <= 5) ? segments[1] : segments[0];

  if (!route) return 'step-upload';

  // Direct mapping check or format conversion slug
  if (route in fileKitAssets || route.match(/^[a-z0-9]+-to-[a-z0-9]+$/i)) {
    return route as FileKitAssetName;
  }

  // Specialized route mappings
  if (route.includes('pdf-to-png')) return 'pdf-to-jpg';
  if (route.includes('rotate')) return 'rotate-pdf';
  if (route.includes('delete')) return 'delete-pdf-pages';
  if (route.includes('extract')) return 'extract-pdf-pages';
  if (route.includes('reorder')) return 'reorder-pdf';
  if (route.includes('watermark')) return 'watermark-pdf';
  if (route.includes('compress-pdf')) return 'compress-pdf';
  if (route.includes('compress-image') || route.includes('compress-jpg') || route.includes('compress-png')) {
    return 'compress-image';
  }

  return 'step-upload';
}

export default function UploadDropzone({
  isGeneric = false,
  onFileSelect,
  accept = ".pdf",
  className = "",
  assetName,
}: UploadDropzoneProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveAssetName = assetName || getRouteAssetName(pathname);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full aspect-[496/291] min-h-[260px] md:min-h-[291px] flex flex-col items-center justify-center border-2 border-dashed rounded-fk-lg p-6 text-center transition-all duration-200 select-none ${
        isDragActive
          ? "border-fk-primary bg-fk-server-bg/30 scale-[1.01]"
          : "border-fk-border-strong bg-white hover:border-fk-primary hover:bg-fk-bg/50"
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Bespoke Route Use-Case Brand Asset Graphic */}
      <div className="mb-4 flex items-center justify-center">
        <FileKitAsset
          name={effectiveAssetName}
          className="w-28 h-28 sm:w-36 sm:h-36 max-w-[180px] max-h-[120px] object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
          alt="Tool operation illustration"
        />
      </div>

      {/* Main Drop Text */}
      <h3 className="text-[20px] font-bold text-fk-text leading-tight mb-1">
        {isGeneric ? (t("homepage.dropzoneTitle") || t("homepage.dropAnywhere")) : (t("workspace.selectFile") || t("workspace.dropHere"))}
      </h3>

      {/* Sub Drop Text */}
      <p className="text-[13px] text-fk-text-muted mb-5 leading-normal">
        {isGeneric ? (t("homepage.dropzoneSubtitle") || t("homepage.orChoose")) : t("workspace.pdfOnly")}
      </p>

      {/* Choose File Button */}
      <button
        type="button"
        onClick={onButtonClick}
        className="h-[48px] px-8 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2 mb-4"
      >
        {t("workspace.selectFile") || t("homepage.chooseFile")}
      </button>

      {/* Small Help Text */}
      <p className="text-[11px] text-fk-text-subtle max-w-[380px] mx-auto leading-normal">
        {isGeneric ? (t("trust.badge1") || t("homepage.methodShown")) : t("workspace.freeNotice")}
      </p>
    </div>
  );
}
