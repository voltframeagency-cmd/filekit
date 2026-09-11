"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import { SupportedLocale, NON_DEFAULT_LOCALES, getLocaleDirection, normalizeLocale } from "@/config/i18n/locales";
import { getLocalizedToolMeta, getHreflangLinks } from "@/utils/i18nHelper";
import { PdfEditorRouteTarget } from "@/utils/pdf-editor/types";
import dynamic from "next/dynamic";
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
import SubtitleWorkspace from "@/utils/subtitles/SubtitleWorkspace";
import CadWorkspace from "@/utils/cad/CadWorkspace";
import PdfCompressionWorkspace from "@/components/pdf-tools/PdfCompressionWorkspace";
import PdfToImageWorkspace from "@/components/pdf-tools/PdfToImageWorkspace";
import ImageCompressionWorkspace from "@/components/image-tools/ImageCompressionWorkspace";
import ImageConverterWorkspace from "@/components/image-tools/ImageConverterWorkspace";
import ToolGrid from "@/components/layout/ToolGrid";
import { HowToStepSection } from "@/components/seo/HowToStepSection";
import { AeoFaqSection } from "@/components/seo/AeoFaqSection";
import { SchemaGenerator } from "@/utils/seo/SchemaGenerator";
import { buildCanonicalUrl } from "@/utils/siteUrl";

// Routes & Config
import { PDF_COMPRESSION_ROUTES } from "@/config/pdfCompressionRoutes";
import { PDF_TO_IMAGE_ROUTES } from "@/config/pdfToImageRoutes";
import { IMAGE_CONVERSION_ROUTES } from "@/config/imageConversionRoutes";
import { getToolSeoContent } from "@/config/seo/toolFaqs";
import { useLanguage } from "@/components/layout/LanguageContext";
import * as PDFLib from "pdf-lib";

export interface UniversalToolPageProps {
  slug: string;
  locale?: string;
}

export default function UniversalToolPage({ slug, locale: inputLocale }: UniversalToolPageProps) {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const { language, setLanguage } = useLanguage();
  const rawLangInput = inputLocale || language || "en";
  const normalized = normalizeLocale(rawLangInput);
  const locale = (NON_DEFAULT_LOCALES.includes(normalized) ? normalized : "en") as SupportedLocale;

  const meta = getLocalizedToolMeta(normSlug, locale);
  const hreflangs = getHreflangLinks(normSlug);
  const seoContent = getToolSeoContent(normSlug, meta.title, locale);

  React.useEffect(() => {
    if (locale && language !== locale) {
      setLanguage(locale);
    }
    if (meta.title && typeof document !== "undefined") {
      document.title = meta.title;
    }
    if (typeof window !== "undefined") {
      (window as any).PDFLib = PDFLib;
    }
  }, [locale, language, setLanguage, meta.title]);

  const jsonLd = SchemaGenerator.generateFullStructuredData({
    slug: normSlug,
    title: meta.title,
    description: meta.description,
    locale,
  });

  // Render workspace based on slug
  const renderWorkspace = () => {
    // -1. All Tools Directory
    if (normSlug === "/all-tools") {
      return (
        <div className="w-full max-w-5xl mx-auto">
          <ToolGrid />
        </div>
      );
    }

    // 0. PDF & Image Compression Tools
    if (PDF_COMPRESSION_ROUTES[normSlug]) {
      return (
        <PdfCompressionWorkspace
          routeConfig={PDF_COMPRESSION_ROUTES[normSlug]}
          language={locale}
        />
      );
    }

    // 0.02 PDF to Image Suite (pdf-to-jpg, pdf-to-png, pdf-to-image)
    if (PDF_TO_IMAGE_ROUTES[normSlug]) {
      return (
        <PdfToImageWorkspace
          config={PDF_TO_IMAGE_ROUTES[normSlug]}
        />
      );
    }

    if (normSlug.startsWith("/compress-image")) {
      return (
        <ImageCompressionWorkspace initialMode="BALANCED" language={locale} />
      );
    }

    // 0.05 Image Converter Suite (AVIF, HEIC, PNG, JPG, WebP, BMP, ICO)
    if (IMAGE_CONVERSION_ROUTES[normSlug]) {
      return (
        <ImageConverterWorkspace
          routeConfig={IMAGE_CONVERSION_ROUTES[normSlug]}
          language={locale}
        />
      );
    }

    // 0.1 CAD & Vector Graphics Suite
    if (
      normSlug === "/dwg-to-pdf" ||
      normSlug === "/dxf-to-pdf" ||
      normSlug === "/dwg-to-dxf" ||
      normSlug === "/eps-to-pdf" ||
      normSlug === "/eps-to-png" ||
      normSlug === "/psd-to-png" ||
      normSlug === "/ai-to-pdf" ||
      normSlug === "/ai-to-png"
    ) {
      let mode: "dwg-to-pdf" | "dxf-to-pdf" | "dwg-to-dxf" | "eps-to-pdf" | "eps-to-png" | "psd-to-png" | "ai-to-pdf" | "ai-to-png" = "dwg-to-pdf";
      if (normSlug === "/dxf-to-pdf") mode = "dxf-to-pdf";
      else if (normSlug === "/dwg-to-dxf") mode = "dwg-to-dxf";
      else if (normSlug === "/eps-to-pdf") mode = "eps-to-pdf";
      else if (normSlug === "/eps-to-png") mode = "eps-to-png";
      else if (normSlug === "/psd-to-png") mode = "psd-to-png";
      else if (normSlug === "/ai-to-pdf") mode = "ai-to-pdf";
      else if (normSlug === "/ai-to-png") mode = "ai-to-png";

      return (
        <CadWorkspace
          mode={mode}
          title={meta.title}
          description={meta.description}
          embedded={true}
          language={locale}
        />
      );
    }

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
          language={locale}
        />
      );
    }

    // 2. PDF Watermark & Overlay
    if (normSlug === "/watermark-pdf") {
      return <PdfOverlayWorkspace language={locale} />;
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
          language={locale}
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
          language={locale}
        />
      );
    }

    // 5. Privacy & EXIF
    if (normSlug === "/strip-exif") {
      return (
        <PrivacyWorkspace
          title={meta.title}
          description={meta.description}
          language={locale}
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
          language={locale}
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
          language={locale}
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
          language={locale}
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
          language={locale}
        />
      );
    }

    // 10. Subtitle Tools
    if (normSlug === "/srt-to-vtt" || normSlug === "/vtt-to-srt") {
      const subMode = normSlug === "/srt-to-vtt" ? "srt-to-vtt" : "vtt-to-srt";
      return (
        <SubtitleWorkspace
          mode={subMode}
          title={meta.title}
          subtitle={meta.description}
          language={locale}
        />
      );
    }

    // 11. Image Transform & Converter
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
          language={locale}
        />
      );
    }

    // 12. Office, CAD & Universal Document Converter Fallback
    const isWord = normSlug.includes("word") || normSlug.includes("docx") || normSlug.includes("doc");
    const isExcel = normSlug.includes("excel") || normSlug.includes("xlsx") || normSlug.includes("xls");
    const isCad = normSlug.includes("dwg") || normSlug.includes("dxf") || normSlug.includes("eps") || normSlug.includes("psd") || normSlug.includes("ai");
    const endpoint = isWord
      ? "/api/internal/convert/word-to-pdf"
      : isExcel
      ? "/api/internal/convert/excel-to-pdf"
      : isCad
      ? "/api/internal/convert/word-to-pdf"
      : "/api/internal/convert/powerpoint-to-pdf";
    const extensions = isWord
      ? ".docx,.doc"
      : isExcel
      ? ".xlsx,.xls"
      : isCad
      ? ".dwg,.dxf,.eps,.psd,.ai"
      : ".pptx,.ppt";
    const getDocTypeLabel = () => {
      const l = (locale || "en").toLowerCase();
      const prefix = l.split("-")[0];
      const map: Record<string, { word: string; excel: string; cad: string; ppt: string }> = {
        en: { word: "Word Document", excel: "Excel Spreadsheet", cad: "CAD / Vector Document", ppt: "PowerPoint Presentation" },
        ru: { word: "Документ Word", excel: "Таблицу Excel", cad: "CAD / Векторный документ", ppt: "Презентацию PowerPoint" },
        uk: { word: "Документ Word", excel: "Таблицю Excel", cad: "CAD / Векторний документ", ppt: "Презентацію PowerPoint" },
        "zh-tw": { word: "Word 文件", excel: "Excel 試算表", cad: "CAD / 向量圖檔", ppt: "PowerPoint 簡報" },
        zh: { word: "Word 文档", excel: "Excel 工作表", cad: "CAD / 矢量文档", ppt: "PowerPoint 演示文稿" },
        es: { word: "Documento Word", excel: "Hoja de cálculo Excel", cad: "Documento CAD / Vectorial", ppt: "Presentación PowerPoint" },
        de: { word: "Word-Dokument", excel: "Excel-Tabelle", cad: "CAD- / Vektordokument", ppt: "PowerPoint-Präsentation" },
        fr: { word: "Document Word", excel: "Feuille de calcul Excel", cad: "Document CAO / Vectoriel", ppt: "Présentation PowerPoint" },
        pt: { word: "Documento Word", excel: "Folha de cálculo Excel", cad: "Documento CAD / Vetorial", ppt: "Apresentação PowerPoint" },
        it: { word: "Documento Word", excel: "Foglio di calcolo Excel", cad: "Documento CAD / Vettoriale", ppt: "Presentazione PowerPoint" },
        nl: { word: "Word-document", excel: "Excel-spreadsheet", cad: "CAD- / Vectorbestand", ppt: "PowerPoint-presentatie" },
        ca: { word: "Document Word", excel: "Full de càlcul Excel", cad: "Document CAD / Vectorial", ppt: "Presentació PowerPoint" },
        sv: { word: "Word-dokument", excel: "Excel-kalkylblad", cad: "CAD- / Vektordokument", ppt: "PowerPoint-presentation" },
        da: { word: "Word-dokument", excel: "Excel-regneark", cad: "CAD- / Vektordokument", ppt: "PowerPoint-præsentation" },
        fi: { word: "Word-asiakirja", excel: "Excel-laskentataulukko", cad: "CAD- / Vektori-asiakirja", ppt: "PowerPoint-esitys" },
        no: { word: "Word-dokument", excel: "Excel-regneark", cad: "CAD- / Vektordokument", ppt: "PowerPoint-presentasjon" },
        pl: { word: "Dokument Word", excel: "Arkusz kalkulacyjny Excel", cad: "Dokument CAD / Wektorowy", ppt: "Prezentację PowerPoint" },
        cs: { word: "Dokument Word", excel: "Tabulku Excel", cad: "CAD / Vektorový dokument", ppt: "Prezentaci PowerPoint" },
        hu: { word: "Word dokumentum", excel: "Excel táblázat", cad: "CAD / Vektorgrafikus dokumentum", ppt: "PowerPoint bemutató" },
        ro: { word: "Document Word", excel: "Foaie de calcul Excel", cad: "Document CAD / Vectorial", ppt: "Prezentare PowerPoint" },
        bg: { word: "Word документ", excel: "Excel електронна таблица", cad: "CAD / Векторен документ", ppt: "PowerPoint презентация" },
        el: { word: "Έγγραφο Word", excel: "Υπολογιστικό φύλλο Excel", cad: "Έγγραφο CAD / Διανυσματικό", ppt: "Παρουσίαση PowerPoint" },
        sk: { word: "Dokument Word", excel: "Tabuľku Excel", cad: "CAD / Vektorový dokument", ppt: "Prezentáciu PowerPoint" },
        sl: { word: "Dokument Word", excel: "Preglednico Excel", cad: "Dokument CAD / Vektorski", ppt: "Predstavitev PowerPoint" },
        tr: { word: "Word Belgesi", excel: "Excel E-Tablosu", cad: "CAD / Vektör Belgesi", ppt: "PowerPoint Sunumu" },
        ar: { word: "مستند Word", excel: "جدول بيانات Excel", cad: "مستند CAD / متجهي", ppt: "عرض تقديمي PowerPoint" },
        he: { word: "מסמך Word", excel: "גיליון אלקטרוני של Excel", cad: "מסמך CAD / וקטורי", ppt: "מצגת PowerPoint" },
        hi: { word: "Word दस्तावेज़", excel: "Excel स्प्रेडशीट", cad: "CAD / वेक्टर दस्तावेज़", ppt: "PowerPoint प्रस्तुति" },
        id: { word: "Dokumen Word", excel: "Spreadsheet Excel", cad: "Dokumen CAD / Vektor", ppt: "Presentasi PowerPoint" },
        ms: { word: "Dokumen Word", excel: "Hamparan Excel", cad: "Dokumen CAD / Vektor", ppt: "Persembahan PowerPoint" },
        th: { word: "เอกสาร Word", excel: "สเปรดชีต Excel", cad: "เอกสาร CAD / เวกเตอร์", ppt: "งานนำเสนอ PowerPoint" },
        vi: { word: "Tài liệu Word", excel: "Bảng tính Excel", cad: "Tài liệu CAD / Vector", ppt: "Bản trình bày PowerPoint" },
        fil: { word: "Word Dokumento", excel: "Excel Spreadsheet", cad: "CAD / Vector Dokumento", ppt: "PowerPoint Presentasyon" },
        ja: { word: "Word 文書", excel: "Excel スプレッドシート", cad: "CAD / ベクター文書", ppt: "PowerPoint プレゼンテーション" },
        ko: { word: "Word 문서", excel: "Excel 스프레드시트", cad: "CAD / 벡터 문서", ppt: "PowerPoint 프레젠테이션" },
        lv: { word: "Word dokuments", excel: "Excel izklājlapa", cad: "CAD / Vektoru dokuments", ppt: "PowerPoint prezentācija" },
        lt: { word: "„Word“ dokumentas", excel: "„Excel“ skaičiuoklė", cad: "CAD / Vektorinis dokumentas", ppt: "„PowerPoint“ pateiktis" }
      };
      const entry = map[l] || map[prefix] || map.en;
      if (isWord) return entry.word;
      if (isExcel) return entry.excel;
      if (isCad) return entry.cad;
      return entry.ppt;
    };
    const label = getDocTypeLabel();

    return (
      <OfficeConverterWorkspace
        toolTitle={meta.title}
        toolSlug={normSlug}
        apiEndpoint={endpoint}
        acceptedExtensions={extensions}
        documentTypeLabel={label}
        language={locale}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg" lang={locale} dir={getLocaleDirection(locale)}>
      <title>{meta.title}</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {hreflangs.map((h) => (
        <link key={h.hrefLang} rel="alternate" hrefLang={h.hrefLang} href={h.href} />
      ))}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={buildCanonicalUrl(locale === "en" ? normSlug : `/${locale}${normSlug}`)} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://filekit.co/brand-assets/hero/client-side-privacy-hero.png" />
      <meta property="og:site_name" content="FileKit" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content="https://filekit.co/brand-assets/hero/client-side-privacy-hero.png" />
      <meta name="twitter:creator" content="@filekit_app" />
      <AppHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        <section className="flex flex-col gap-1.5 max-w-[840px] mx-auto w-full text-left ltr:text-left rtl:text-right px-2">
          <span className="text-[12px] font-bold uppercase tracking-wider text-blue-200">{seoContent.category}</span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] drop-shadow-sm tracking-tight">
            {meta.h1}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            {meta.description}
          </p>
        </section>

        {renderWorkspace()}
        <HowToStepSection toolTitle={meta.title} steps={seoContent.howToSteps} />
        <AeoFaqSection toolTitle={meta.title} faqs={seoContent.faqs} />
        <div className="mt-8">
          <TrustPanel language={locale} />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
