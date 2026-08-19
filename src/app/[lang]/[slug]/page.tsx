"use client";

import React from "react";
import { useParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { SupportedLocale, NON_DEFAULT_LOCALES } from "@/config/i18n/locales";
import { getLocalizedToolMeta, getHreflangLinks } from "@/utils/i18nHelper";
import { PdfEditorRouteTarget } from "@/utils/pdf-editor/types";
import { ImageTransformMode } from "@/utils/image-transform/types";

// Workspaces
import { ImageTransformWorkspace } from "@/components/image-transform/ImageTransformWorkspace";
import { PdfPageEditorWorkspace } from "@/components/pdf-editor/PdfPageEditorWorkspace";
import { PdfOverlayWorkspace } from "@/components/pdf-overlay/PdfOverlayWorkspace";
import { OcrPdfWorkspace } from "@/components/ocr-tools/OcrPdfWorkspace";
import { OfficeConverterWorkspace } from "@/components/office-tools/OfficeConverterWorkspace";
import { ArchiveWorkspace } from "@/utils/archive/ArchiveWorkspace";
import { PrivacyWorkspace } from "@/utils/privacy/PrivacyWorkspace";
import { FontWorkspace } from "@/utils/font/FontWorkspace";
import { EbookWorkspace } from "@/utils/ebook/EbookWorkspace";
import AudioWorkspace from "@/utils/audio/AudioWorkspace";
import VideoWorkspace from "@/utils/video/VideoWorkspace";

export default function LocalizedToolPage() {
  const params = useParams();
  const rawLang = (params?.lang as string) || "en";
  const rawSlug = (params?.slug as string) || "";
  const normSlug = rawSlug.startsWith("/") ? rawSlug : `/${rawSlug}`;

  const locale = (NON_DEFAULT_LOCALES.includes(rawLang as SupportedLocale) ? rawLang : "en") as SupportedLocale;
  const meta = getLocalizedToolMeta(normSlug, locale);
  const hreflangs = getHreflangLinks(normSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": meta.title,
    "url": meta.canonicalUrl,
    "description": meta.description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": locale
  };

  // Render workspace based on slug
  const renderWorkspace = () => {
    // 1. PDF Page Manipulation & Geometry
    if (
      normSlug === "/merge-pdf" ||
      normSlug === "/split-pdf" ||
      normSlug === "/reorder-pdf-pages" ||
      normSlug === "/rotate-pdf-pages" ||
      normSlug === "/delete-pdf-pages" ||
      normSlug === "/extract-pdf-pages" ||
      normSlug === "/reverse-pdf" ||
      normSlug === "/add-blank-page-to-pdf" ||
      normSlug === "/duplicate-pdf-pages" ||
      normSlug === "/flatten-pdf" ||
      normSlug === "/crop-pdf" ||
      normSlug === "/add-page-numbers-to-pdf"
    ) {
      const target = normSlug.replace(/^\//, "") as PdfEditorRouteTarget;
      return (
        <PdfPageEditorWorkspace
          targetRoute={target}
          title={meta.title}
          subtitle={meta.description}
          actionButtonText="Process PDF"
        />
      );
    }

    // 2. PDF Watermark & Overlay
    if (normSlug === "/watermark-pdf") {
      return <PdfOverlayWorkspace />;
    }

    // 3. OCR Tools
    if (
      normSlug === "/ocr-pdf" ||
      normSlug === "/make-pdf-searchable" ||
      normSlug === "/image-to-text" ||
      normSlug === "/pdf-to-text"
    ) {
      const defaultMode = (normSlug === "/ocr-pdf" || normSlug === "/make-pdf-searchable")
        ? "searchable_pdf"
        : "extract_text";

      return (
        <OcrPdfWorkspace
          toolTitle={meta.title}
          toolSlug={normSlug}
          defaultMode={defaultMode}
        />
      );
    }

    // 4. Archive Tools
    if (
      normSlug === "/extract-zip" ||
      normSlug === "/create-zip" ||
      normSlug === "/tar-to-zip" ||
      normSlug === "/rar-to-zip" ||
      normSlug === "/extract-rar" ||
      normSlug === "/7z-to-zip"
    ) {
      let mode: "extract" | "create" | "tar-to-zip" | "rar-to-zip" | "extract-rar" | "7z-to-zip" = "extract";
      if (normSlug === "/create-zip") mode = "create";
      else if (normSlug === "/tar-to-zip") mode = "tar-to-zip";
      else if (normSlug === "/rar-to-zip") mode = "rar-to-zip";
      else if (normSlug === "/extract-rar") mode = "extract-rar";
      else if (normSlug === "/7z-to-zip") mode = "7z-to-zip";

      return (
        <ArchiveWorkspace
          mode={mode}
          title={meta.title}
          description={meta.description}
        />
      );
    }

    // 5. Privacy & EXIF
    if (normSlug === "/strip-exif") {
      return (
        <PrivacyWorkspace
          title={meta.title}
          description={meta.description}
        />
      );
    }

    // 6. Font Tools
    if (normSlug === "/ttf-to-woff2" || normSlug === "/woff2-to-ttf") {
      const fontMode = normSlug === "/ttf-to-woff2" ? "ttf-to-woff2" : "woff2-to-ttf";
      return (
        <FontWorkspace
          mode={fontMode}
          title={meta.title}
          description={meta.description}
        />
      );
    }

    // 7. E-Book Tools
    if (
      normSlug === "/epub-to-pdf" ||
      normSlug === "/pdf-to-epub" ||
      normSlug === "/mobi-to-pdf" ||
      normSlug === "/azw3-to-pdf"
    ) {
      const ebookMode = normSlug.replace(/^\//, "") as "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";
      return (
        <EbookWorkspace
          mode={ebookMode}
          title={meta.title}
          description={meta.description}
        />
      );
    }

    // 8. Audio Tools
    if (
      normSlug === "/convert-audio" ||
      normSlug === "/compress-audio" ||
      normSlug === "/trim-audio" ||
      normSlug === "/merge-audio" ||
      normSlug === "/wav-to-mp3" ||
      normSlug === "/boost-audio-volume" ||
      normSlug === "/m4a-to-mp3" ||
      normSlug === "/flac-to-mp3" ||
      normSlug === "/ogg-to-mp3" ||
      normSlug === "/mp4-to-wav"
    ) {
      let audioMode: "convert" | "compress" | "trim" | "merge" | "boost" = "convert";
      if (normSlug === "/compress-audio") audioMode = "compress";
      else if (normSlug === "/trim-audio") audioMode = "trim";
      else if (normSlug === "/merge-audio") audioMode = "merge";
      else if (normSlug === "/boost-audio-volume") audioMode = "boost";

      return (
        <AudioWorkspace
          mode={audioMode}
          title={meta.title}
          subtitle={meta.description}
        />
      );
    }

    // 9. Video Tools
    if (
      normSlug === "/convert-video" ||
      normSlug === "/compress-video" ||
      normSlug === "/video-to-gif" ||
      normSlug === "/video-to-mp3" ||
      normSlug === "/trim-video" ||
      normSlug === "/mute-video" ||
      normSlug === "/mov-to-mp4" ||
      normSlug === "/mkv-to-mp4" ||
      normSlug === "/change-video-speed" ||
      normSlug === "/rotate-video" ||
      normSlug === "/avi-to-mp4" ||
      normSlug === "/webm-to-mp4" ||
      normSlug === "/wmv-to-mp4"
    ) {
      let videoMode: "convert" | "compress" | "gif" | "trim" | "mute" | "speed" | "rotate" = "convert";
      if (normSlug === "/compress-video") videoMode = "compress";
      else if (normSlug === "/video-to-gif") videoMode = "gif";
      else if (normSlug === "/trim-video") videoMode = "trim";
      else if (normSlug === "/mute-video") videoMode = "mute";
      else if (normSlug === "/change-video-speed") videoMode = "speed";
      else if (normSlug === "/rotate-video") videoMode = "rotate";

      return (
        <VideoWorkspace
          mode={videoMode}
          title={meta.title}
          subtitle={meta.description}
        />
      );
    }

    // 10. Image Transform & Converter
    if (
      normSlug === "/resize-image" ||
      normSlug === "/crop-image" ||
      normSlug === "/rotate-image" ||
      normSlug === "/flip-image" ||
      normSlug === "/grayscale-image" ||
      normSlug === "/invert-image" ||
      normSlug === "/blur-image" ||
      normSlug === "/ico-to-png" ||
      normSlug === "/svg-to-png" ||
      normSlug === "/svg-to-jpg"
    ) {
      let imageMode: ImageTransformMode = "crop";
      if (normSlug === "/resize-image") imageMode = "resize";
      else if (normSlug === "/crop-image") imageMode = "crop";
      else if (normSlug === "/rotate-image") imageMode = "rotate";
      else if (normSlug === "/flip-image") imageMode = "flip";
      else if (normSlug === "/grayscale-image") imageMode = "grayscale";
      else if (normSlug === "/invert-image") imageMode = "invert";
      else if (normSlug === "/blur-image") imageMode = "blur";
      else if (normSlug === "/ico-to-png") imageMode = "ico-to-png";
      else if (normSlug === "/svg-to-png") imageMode = "svg-to-png";
      else if (normSlug === "/svg-to-jpg") imageMode = "svg-to-jpg";

      return (
        <ImageTransformWorkspace
          mode={imageMode}
          toolTitle={meta.title}
          toolSlug={normSlug}
          allowedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".bmp", ".ico", ".svg"]}
        />
      );
    }

    // 11. Office & Universal Document Converter Fallback
    const isWord = normSlug.includes("word") || normSlug.includes("docx") || normSlug.includes("doc");
    const isExcel = normSlug.includes("excel") || normSlug.includes("xlsx") || normSlug.includes("xls");
    const endpoint = isWord
      ? "/api/internal/convert/word-to-pdf"
      : isExcel
      ? "/api/internal/convert/excel-to-pdf"
      : "/api/internal/convert/powerpoint-to-pdf";
    const extensions = isWord ? ".docx,.doc" : isExcel ? ".xlsx,.xls" : ".pptx,.ppt";
    const label = isWord ? "Word Document" : isExcel ? "Excel Spreadsheet" : "PowerPoint Presentation";

    return (
      <OfficeConverterWorkspace
        toolTitle={meta.title}
        toolSlug={normSlug}
        apiEndpoint={endpoint}
        acceptedExtensions={extensions}
        documentTypeLabel={label}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg" lang={locale} dir="ltr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {hreflangs.map((h) => (
        <link key={h.hrefLang} rel="alternate" hrefLang={h.hrefLang} href={h.href} />
      ))}
      <AppHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {renderWorkspace()}
        <div className="mt-8">
          <TrustPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
