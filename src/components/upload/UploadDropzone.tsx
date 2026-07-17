"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "../layout/LanguageContext";

interface UploadDropzoneProps {
  isGeneric?: boolean;
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export default function UploadDropzone({
  isGeneric = false,
  onFileSelect,
  accept = ".pdf",
  className = "",
}: UploadDropzoneProps) {
  const { t } = useLanguage();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      {/* Upload Document SVG Icon */}
      <div className="mb-4 text-fk-primary">
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>

      {/* Main Drop Text */}
      <h3 className="text-[20px] font-bold text-fk-text leading-tight mb-1">
        {isGeneric ? t("homepage.dropAnywhere") : t("workspace.dropHere")}
      </h3>

      {/* Sub Drop Text */}
      <p className="text-[13px] text-fk-text-muted mb-5 leading-normal">
        {t("homepage.orChoose")}
      </p>

      {/* Choose File Button */}
      <button
        type="button"
        onClick={onButtonClick}
        className="h-[48px] px-8 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2 mb-4"
      >
        {t("homepage.chooseFile")}
      </button>

      {/* Small Help Text */}
      <p className="text-[11px] text-fk-text-subtle max-w-[380px] mx-auto leading-normal">
        {isGeneric ? t("homepage.methodShown") : t("workspace.pdfOnly")}
      </p>
    </div>
  );
}
