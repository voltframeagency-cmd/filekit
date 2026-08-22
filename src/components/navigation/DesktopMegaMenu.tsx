"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNavItem, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";
import { useLanguage } from "@/components/layout/LanguageContext";
import { getLocalizedHref, VERB_DICTIONARY } from "@/utils/i18nHelper";
import { SupportedLocale } from "@/config/i18n/locales";

export interface DesktopMegaMenuProps {
  navItem: TopNavItem;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  initialFocus?: "FIRST" | "LAST";
}

// Clean vector SVG icon renderer for mega-menu links (Distinct per format/tool category)
const NavItemIcon: React.FC<{ href: string; className?: string }> = ({ href, className = "w-4 h-4" }) => {
  // 1. PDF to Image / Rasterization
  if (href.includes("pdf-to-image") || href.includes("pdf-to-jpg") || href.includes("pdf-to-png")) {
    return (
      <svg className={`${className} text-emerald-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  // 2. Image to PDF / Document Creation
  if (href.includes("image-to-pdf") || href.includes("jpg-to-pdf") || href.includes("png-to-pdf") || href.includes("tiff-to-pdf")) {
    return (
      <svg className={`${className} text-red-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  // 3. Audio Tools
  if (href.includes("audio") || href.includes("mp3") || href.includes("wav") || href.includes("m4a") || href.includes("flac") || href.includes("ogg") || href.includes("volume")) {
    return (
      <svg className={`${className} text-violet-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    );
  }
  // 4. Video Tools
  if (href.includes("video") || href.includes("mp4") || href.includes("avi") || href.includes("webm") || href.includes("mov") || href.includes("mkv") || href.includes("gif")) {
    return (
      <svg className={`${className} text-amber-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }
  // 5. CAD & Vector Tools (DWG, DXF, EPS, AI, PSD)
  if (href.includes("dwg") || href.includes("dxf") || href.includes("eps") || href.includes("ai-to") || href.includes("psd")) {
    return (
      <svg className={`${className} text-cyan-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    );
  }
  // 6. Archive & Utilities (ZIP, RAR, 7Z, TAR, EXIF, Font)
  if (href.includes("zip") || href.includes("rar") || href.includes("7z") || href.includes("tar") || href.includes("exif") || href.includes("woff") || href.includes("ttf")) {
    return (
      <svg className={`${className} text-amber-700 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    );
  }
  // 7. Subtitle Tools
  if (href.includes("srt") || href.includes("vtt") || href.includes("subtitle")) {
    return (
      <svg className={`${className} text-teal-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    );
  }
  // 8. Documents & E-books (Word, Excel, PowerPoint, Pages, Keynote, EPUB)
  if (href.includes("word") || href.includes("excel") || href.includes("powerpoint") || href.includes("pages") || href.includes("numbers") || href.includes("keynote") || href.includes("epub") || href.includes("mobi")) {
    return (
      <svg className={`${className} text-sky-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  // 9. Compress tools
  if (href.includes("compress")) {
    return (
      <svg className={`${className} text-blue-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  }
  // 10. PDF Merge
  if (href.includes("merge")) {
    return (
      <svg className={`${className} text-indigo-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    );
  }
  // 11. PDF Split
  if (href.includes("split")) {
    return (
      <svg className={`${className} text-purple-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
      </svg>
    );
  }
  // 12. Rotate / Transform
  if (href.includes("rotate") || href.includes("flip")) {
    return (
      <svg className={`${className} text-amber-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  }
  // 13. Delete pages
  if (href.includes("delete")) {
    return (
      <svg className={`${className} text-rose-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    );
  }
  // 14. Watermark / Stamp
  if (href.includes("watermark")) {
    return (
      <svg className={`${className} text-teal-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zm0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
      </svg>
    );
  }
  // 15. Default 2-way arrow conversion icon (JPG to PNG, WebP, etc.)
  return (
    <svg className={`${className} text-blue-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
};

export default function DesktopMegaMenu({
  navItem,
  isOpen,
  onClose,
  triggerRef,
  initialFocus
}: DesktopMegaMenuProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const pathLocaleMatch = pathname.match(/^\/([a-z]{2}(?:-[A-Za-z0-9]+)?)(\/|$)/);
  const activeLocale = pathLocaleMatch ? pathLocaleMatch[1] : language || "en";
  const menuRef = useRef<HTMLDivElement | null>(null);

  const megaMenu = navItem.megaMenu;

  useEffect(() => {
    if (!isOpen || (!megaMenu && navItem.id !== "convert")) return;

    if (initialFocus) {
      setTimeout(() => {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
        if (links && links.length > 0) {
          if (initialFocus === "FIRST") {
            links[0].focus();
          } else if (initialFocus === "LAST") {
            links[links.length - 1].focus();
          }
        }
      }, 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (!menuRef.current) return;
      const links = Array.from(menuRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"));
      if (links.length === 0) return;

      const activeIndex = links.findIndex((link) => link === document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (activeIndex === -1 || activeIndex === links.length - 1) {
          links[0].focus();
        } else {
          links[activeIndex + 1].focus();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (activeIndex === -1 || activeIndex === 0) {
          links[links.length - 1].focus();
        } else {
          links[activeIndex - 1].focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }

      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef, megaMenu, navItem.id, initialFocus]);

  // Localized category header labels
  const getCategoryHeader = (label: string): string => {
    const isArabic = activeLocale === "ar";
    const isTurkish = activeLocale === "tr";
    const isSpanish = activeLocale === "es" || activeLocale === "es-419";
    const isFrench = activeLocale === "fr";
    const isGerman = activeLocale === "de";
    const isPortuguese = activeLocale === "pt" || activeLocale === "pt-BR";
    const isItalian = activeLocale === "it";
    const isCatalan = activeLocale === "ca";

    const isSwedish = activeLocale === "sv";
    const isDanish = activeLocale === "da";
    const isDutch = activeLocale === "nl";
    const isRussian = activeLocale === "ru";
    const isPolish = activeLocale === "pl";

    if (label === "IMAGE COMPRESSION") {
      if (isGerman) return "BILD KOMPRIMIEREN";
      if (isSpanish) return "COMPRIMIR IMAGEN";
      if (isFrench) return "COMPRESSER L'IMAGE";
      if (isItalian) return "COMPRIMI IMMAGINE";
      if (isPortuguese) return "COMPRIMIR IMAGEM";
      if (isDutch) return "AFBEELDING COMPRIMEREN";
      if (isCatalan) return "COMPRIMIR IMATGE";
      if (isTurkish) return "GÖRSEL SIKIŞTIRMA";
      if (isArabic) return "ضغط الصور";
    }
    if (label === "IMAGE CONVERT" || label === "IMAGE CONVERSION") {
      if (isSwedish) return "BILD KONVERTERING";
      if (isDanish) return "BILLEDKONVERTERING";
      if (isDutch) return "BEELD CONVERTEREN";
      if (isRussian) return "КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ";
      if (isPolish) return "KONWERSJA OBRAZÓW";
      if (isArabic) return "تحويل الصور";
      if (isTurkish) return "GÖRSEL DÖNÜŞTÜRME";
      if (isSpanish) return "CONVERTIR IMAGEN";
      if (isFrench) return "CONVERSION D'IMAGE";
      if (isGerman) return "BILD KONVERTIEREN";
      if (isPortuguese) return "CONVERTER IMAGEM";
      if (isItalian) return "CONVERTI IMMAGINE";
    }
    if (label === "IMAGE") {
      if (navItem.id === "compress") {
        if (isGerman) return "BILD KOMPRIMIEREN";
        if (isSpanish) return "COMPRIMIR IMAGEN";
        if (isFrench) return "COMPRESSER L'IMAGE";
        if (isItalian) return "COMPRIMI IMMAGINE";
        if (isPortuguese) return "COMPRIMIR IMAGEM";
        if (isDutch) return "AFBEELDING COMPRIMEREN";
        if (isCatalan) return "COMPRIMIR IMATGE";
        if (isTurkish) return "GÖRSEL SIKIŞTIRMA";
        if (isArabic) return "ضغط الصور";
      }
      if (isSwedish) return "BILD KONVERTERING";
      if (isDanish) return "BILLEDKONVERTERING";
      if (isDutch) return "BEELD CONVERTEREN";
      if (isRussian) return "КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ";
      if (isPolish) return "KONWERSJA OBRAZÓW";
      if (isArabic) return "تحويل الصور";
      if (isTurkish) return "GÖRSEL DÖNÜŞTÜRME";
      if (isSpanish) return "CONVERTIR IMAGEN";
      if (isFrench) return "CONVERSION D'IMAGE";
      if (isGerman) return "BILD KONVERTIEREN";
      if (isPortuguese) return "CONVERTER IMAGEM";
      if (isItalian) return "CONVERTI IMMAGINE";
    }
    if (label === "MORE FORMATS") {
      if (isSwedish) return "FLER FORMAT";
      if (isDanish) return "FLERE FORMATER";
      if (isDutch) return "MEER FORMATEN";
      if (isRussian) return "ДРУГИЕ ФОРМАТЫ";
      if (isPolish) return "WIĘCEJ FORMATÓW";
      if (isArabic) return "صيغ إضافية";
      if (isTurkish) return "DİĞER FORMATLAR";
      if (isSpanish) return "MÁS FORMATOS";
      if (isFrench) return "AUTRES FORMATS";
      if (isGerman) return "WEITERE FORMATE";
      if (isPortuguese) return "MAIS FORMATOS";
      if (isItalian) return "ALTRI FORMATI";
    }
    if (label === "IMAGE EDITORS") {
      if (isSwedish) return "BILDREDIGERING";
      if (isDanish) return "BILLEDBEHANDLING";
      if (isDutch) return "BEELDBEWERKING";
      if (isRussian) return "РЕДАКТОРЫ ИЗОБРАЖЕНИЙ";
      if (isPolish) return "EDYTORY OBRAZÓW";
      if (isArabic) return "محررات الصور";
      if (isTurkish) return "GÖRSEL DÜZENLEYİCİLER";
      if (isSpanish) return "EDITORES DE IMAGEN";
      if (isFrench) return "ÉDITEURS D'IMAGES";
      if (isGerman) return "BILDEDITOREN";
      if (isPortuguese) return "EDITORES DE IMAGEM";
      if (isItalian) return "EDITOR DI IMMAGINI";
    }
    if (label === "VIDEO TOOLS" || label === "VIDEO") {
      if (isSwedish) return "VIDEOVERKTYG";
      if (isDanish) return "VIDEOVÆRKTØJER";
      if (isDutch) return "VIDEO TOOLS";
      if (isRussian) return "ВИДЕО ИНСТРУМЕНТЫ";
      if (isPolish) return "NARZĘDZIA WIDEO";
      if (isArabic) return "أدوات الفيديو";
      if (isTurkish) return "VİDEO ARAÇLARI";
      if (isSpanish) return "HERRAMIENTAS DE VIDEO";
      if (isFrench) return "OUTILS VIDÉO";
      if (isGerman) return "VIDEO-WERKZEUGE";
      if (isPortuguese) return "FERRAMENTAS DE VÍDEO";
      if (isItalian) return "STRUMENTI VIDEO";
    }
    if (label === "SUBTITLE TOOLS" || label === "SUBTITLES") {
      if (isSwedish) return "UNDERTEXTERVERKTYG";
      if (isDanish) return "UNDERTEKSTVÆRKTØJER";
      if (isDutch) return "ONDERTITELING";
      if (isRussian) return "СУБТИТРЫ";
      if (isPolish) return "NARZĘDZIA NAPISÓW";
      if (isArabic) return "أدوات الترجمة";
      if (isTurkish) return "ALTYAZI ARAÇLARI";
      if (isSpanish) return "HERRAMIENTAS DE SUBTÍTULOS";
      if (isFrench) return "OUTILS DE SOUS-TITRES";
      if (isGerman) return "UNTERTITEL-WERKZEUGE";
      if (isPortuguese) return "FERRAMENTAS DE LEGENDAS";
      if (isItalian) return "STRUMENTI SOTTOTITOLI";
    }
    if (label === "CONVERT FROM PDF") {
      if (isSwedish) return "KONVERTERA FRÅN PDF";
      if (isDanish) return "KONVERTER FRA PDF";
      if (isDutch) return "CONVERTEREN VAN PDF";
      if (isRussian) return "ИЗ PDF";
      if (isPolish) return "KONWERTUJ Z PDF";
      if (isArabic) return "التحويل من PDF";
      if (isTurkish) return "PDF'TEN DÖNÜŞTÜR";
      if (isSpanish) return "CONVERTIR DESDE PDF";
      if (isFrench) return "CONVERTIR DEPUIS PDF";
      if (isGerman) return "VON PDF KONVERTIEREN";
      if (isPortuguese) return "CONVERTER DE PDF";
      if (isItalian) return "CONVERTI DA PDF";
    }
    if (label === "CONVERT TO PDF") {
      if (isSwedish) return "KONVERTERA TILL PDF";
      if (isDanish) return "KONVERTER TIL PDF";
      if (isDutch) return "CONVERTEREN NAAR PDF";
      if (isRussian) return "В PDF";
      if (isPolish) return "KONWERTUJ DO PDF";
      if (isArabic) return "التحويل إلى PDF";
      if (isTurkish) return "PDF'E DÖNÜŞTÜR";
      if (isSpanish) return "CONVERTIR A PDF";
      if (isFrench) return "CONVERTIR EN PDF";
      if (isGerman) return "IN PDF KONVERTIEREN";
      if (isPortuguese) return "CONVERTER PARA PDF";
      if (isItalian) return "CONVERTI IN PDF";
    }
    if (label === "DOCUMENTS & EBOOKS" || label === "DOCUMENTS & E-BOOKS" || label === "DOCUMENTS") {
      if (isSwedish) return "DOKUMENT & E-BÖCKER";
      if (isDanish) return "DOKUMENTER & E-BØGER";
      if (isDutch) return "DOCUMENTEN & E-BOOKS";
      if (isRussian) return "ДОКУМЕНТЫ И КНИГИ";
      if (isPolish) return "DOKUMENTY I E-BOOKI";
      if (isArabic) return "المستندات والكتب الإلكترونية";
      if (isTurkish) return "BELGELER VE E-KİTAPLAR";
      if (isSpanish) return "DOCUMENTOS Y EBOOKS";
      if (isFrench) return "DOCUMENTS & EBOOKS";
      if (isGerman) return "DOKUMENTE & E-BOOKS";
      if (isPortuguese) return "DOCUMENTOS E E-BOOKS";
      if (isItalian) return "DOCUMENTI ED EBOOK";
    }
    if (label === "CAD & VECTOR TOOLS" || label === "CAD") {
      if (isSwedish) return "CAD- & VEKTORVERKTYG";
      if (isDanish) return "CAD- OG VEKTORVÆRKTØJER";
      if (isDutch) return "CAD & VECTOR TOOLS";
      if (isRussian) return "CAD И ВЕКТОРЫ";
      if (isPolish) return "NARZĘDZIA CAD I WEKTOROWE";
      if (isArabic) return "أدوات CAD والمتجهات";
      if (isTurkish) return "CAD VE VEKTÖR ARAÇLARI";
      if (isSpanish) return "HERRAMIENTAS CAD Y VECTOR";
      if (isFrench) return "OUTILS CAD & VECTORIELS";
      if (isGerman) return "CAD- & VEKTOR-WERKZEUGE";
      if (isPortuguese) return "FERRAMENTAS CAD E VECTOR";
      if (isItalian) return "STRUMENTI CAD E VETTORIALI";
    }
    if (label === "AUDIO TOOLS" || label === "AUDIO") {
      if (isSwedish) return "LJUDVERKTYG";
      if (isDanish) return "LYDVÆRKTØJER";
      if (isDutch) return "AUDIO TOOLS";
      if (isRussian) return "АУДИО ИНСТРУМЕНТЫ";
      if (isPolish) return "NARZĘDZIA AUDIO";
      if (isArabic) return "أدوات الصوت";
      if (isTurkish) return "SES ARAÇLARI";
      if (isSpanish) return "HERRAMIENTAS DE AUDIO";
      if (isFrench) return "OUTILS AUDIO";
      if (isGerman) return "AUDIO-WERKZEUGE";
      if (isPortuguese) return "FERRAMENTAS DE ÁUDIO";
      if (isItalian) return "STRUMENTI AUDIO";
      if (isCatalan) return "EINES D'ÀUDIO";
    }
    if (label === "ARCHIVE & UTILITIES" || label === "ARCHIVE") {
      if (isSwedish) return "ARKIV & VERKTYG";
      if (isDanish) return "ARKIVER & VÆRKTØJER";
      if (isDutch) return "ARCHIEF & UTILITIES";
      if (isRussian) return "АРХИВЫ И УТИЛИТЫ";
      if (isPolish) return "ARCHIWA I NARZĘDZIA";
      if (isArabic) return "الأرشيف والأدوات المساعدة";
      if (isTurkish) return "ARŞİV VE YARDIMCI PROGRAMLAR";
      if (isSpanish) return "ARCHIVOS Y UTILIDADES";
      if (isFrench) return "ARCHIVES ET UTILITAIRES";
      if (isGerman) return "ARCHIV & HILFSPROGRAMME";
      if (isPortuguese) return "ARQUIVOS E UTILITÁRIOS";
      if (isItalian) return "ARCHIVI E UTILITÀ";
    }
    if (label === "PAGE EDITING & ORGANIZATION" || label === "Page Manipulation") {
      if (isSwedish) return "SIDREDIGERING & ORGANISATION";
      if (isDanish) return "SIDEORGANISERING";
      if (isDutch) return "PAGINA BEWERKEN & ORGANISEREN";
      if (isRussian) return "РЕДАКТИРОВАНИЕ СТРАНИЦ";
      if (isPolish) return "EDYCJA STRON I ORGANIZACJA";
      if (isArabic) return "تحرير وتنظيم الصفحات";
      if (isTurkish) return "SAYFA DÜZENLEME VE ORGANİZASYON";
      if (isSpanish) return "EDICIÓN Y ORGANIZACIÓN DE PÁGINAS";
      if (isFrench) return "ÉDITION ET ORGANISATION DE PAGES";
      if (isGerman) return "SEITENBEARBEITUNG & ORGANISATION";
      if (isPortuguese) return "EDIÇÃO E ORGANIZAÇÃO DE PÁGINAS";
      if (isItalian) return "MODIFICA E ORGANIZZAZIONE PAGINE";
    }
    if (label === "COMPRESS & CONVERT" || label === "PDF Conversions") {
      if (isSwedish) return "KOMPRIMERA & KONVERTERA";
      if (isDanish) return "KOMPRIMER & KONVERTER";
      if (isDutch) return "COMPRIMEREN & CONVERTEREN";
      if (isRussian) return "СЖАТИЕ И КОНВЕРТАЦИЯ";
      if (isPolish) return "KOMPRESJA I KONWERSJA";
      if (isArabic) return "الضغط والتحويل";
      if (isTurkish) return "SIKIŞTIR VE DÖNÜŞTÜR";
      if (isSpanish) return "COMPRIMIR Y CONVERTIR";
      if (isFrench) return "COMPRESSER ET CONVERTIR";
      if (isGerman) return "KOMPRIMIEREN & KONVERTIEREN";
      if (isPortuguese) return "COMPRIMIR E CONVERTER";
      if (isItalian) return "COMPRIMI E CONVERTI";
    }
    if (label === "Popular target sizes") {
      if (isSwedish) return "Populära målstorlekar";
      if (isArabic) return "أحجام شائعة";
      if (isTurkish) return "Popüler hedef boyutlar";
      if (isSpanish) return "Tamaños populares";
      if (isFrench) return "Tailles cibles populaires";
      if (isGerman) return "Beliebte Zielgrößen";
      if (isPortuguese) return "Tamanhos populares";
      if (isItalian) return "Dimensioni popolari";
    }
    return label;
  };

  // Localize individual link labels (e.g., "PNG to JPG", "JPG to PDF", "Trim Audio", "Compress Video")
  const getLocalizedLinkLabel = (label: string, href?: string): string => {
    if (activeLocale === "en") return label;

    // Handle pair conversions (e.g. "PNG to JPG" -> "PNG إلى JPG" in Arabic, "PNG a JPG" in Spanish, etc.)
    const isArabic = activeLocale === "ar";
    const isTurkish = activeLocale === "tr";
    const isSpanish = activeLocale === "es" || activeLocale === "es-419";
    const isPortuguese = activeLocale === "pt" || activeLocale === "pt-BR";
    const isGerman = activeLocale === "de";
    const isFrench = activeLocale === "fr";
    const isItalian = activeLocale === "it";
    const isCatalan = activeLocale === "ca";
    const isSwedish = activeLocale === "sv";
    const isDanish = activeLocale === "da";
    const isDutch = activeLocale === "nl";
    const isRussian = activeLocale === "ru";
    const isPolish = activeLocale === "pl";

    const dict = VERB_DICTIONARY[activeLocale as SupportedLocale];
    const toPrep = dict?.to || (isArabic ? "إلى" : isSpanish || isCatalan ? "a" : isPortuguese ? "para" : isGerman ? "in" : isFrench ? "en" : isItalian ? "in" : isTurkish ? "→" : "to");

    if (label === "Compress to a Specific Size" || label === "Compress to Specific Size") {
      if (isSwedish) return "Komprimera till specifik storlek";
      if (isArabic) return "الضغط إلى حجم محدد";
      if (isSpanish) return "Comprimir a un tamaño específico";
      if (isTurkish) return "Belirli bir boyuta sıkıştır";
      if (isFrench) return "Compresser à une taille spécifique";
      if (isGerman) return "Auf bestimmte Größe komprimieren";
      if (isPortuguese) return "Comprimir para tamanho específico";
      if (isItalian) return "Comprimi a dimensione specifica";
      if (isDutch) return "Comprimeren naar specifieke grootte";
      if (isCatalan) return "Comprimir a una mida específica";
    }

    // Exact Tool Names (Prioritized before generic prefix replacements)
    if (label === "Rotate Pages" || label === "Rotate PDF Pages") {
      if (isSwedish) return "Rotera sidor";
      if (isArabic) return "تدوير الصفحات";
      if (isSpanish) return "Rotar páginas";
      if (isTurkish) return "Sayfaları Döndür";
      if (isGerman) return "Seiten drehen";
      if (isFrench) return "Faire pivoter les pages";
      if (isPortuguese) return "Rodar páginas";
      if (isItalian) return "Ruota pagine";
      if (isDutch) return "Pagina's draaien";
      if (isCatalan) return "Girar pàgines";
    }
    if (label === "Extract Pages" || label === "Extract PDF Pages") {
      if (isSwedish) return "Extrahera sidor";
      if (isArabic) return "استخراج الصفحات";
      if (isSpanish) return "Extraer páginas";
      if (isTurkish) return "Sayfaları Ayıkla";
      if (isGerman) return "Seiten extrahieren";
      if (isFrench) return "Extraire des pages";
      if (isPortuguese) return "Extrair páginas";
      if (isItalian) return "Estrai pagine";
      if (isDutch) return "Pagina's extraheren";
      if (isCatalan) return "Extreure pàgines";
    }
    if (label === "Extract Images" || label === "Extract Images from PDF") {
      if (isSwedish) return "Extrahera bilder";
      if (isArabic) return "استخراج الصور";
      if (isSpanish) return "Extraer imágenes";
      if (isTurkish) return "Görselleri Ayıkla";
      if (isGerman) return "Bilder extrahieren";
      if (isFrench) return "Extraire des images";
      if (isPortuguese) return "Extrair imagens";
      if (isItalian) return "Estrai immagini";
      if (isDutch) return "Afbeeldingen extraheren";
      if (isCatalan) return "Extreure imatges";
    }
    if (label === "Add Watermark" || label === "Watermark PDF") {
      if (isSwedish) return "Lägg till vattenstämpel";
      if (isArabic) return "إضافة علامة مائية";
      if (isSpanish) return "Añadir marca de agua";
      if (isTurkish) return "Filigran Ekle";
      if (isGerman) return "Wasserzeichen hinzufügen";
      if (isFrench) return "Ajouter un filigrane";
      if (isPortuguese) return "Adicionar marca de água";
      if (isItalian) return "Aggiungi filigrana";
      if (isDutch) return "Watermerk toevoegen";
      if (isCatalan) return "Afegir marca d'aigua";
    }
    if (label === "PDF to Image" || label === "PDF in Image") {
      if (isSwedish) return "PDF till bild";
      if (isArabic) return "PDF إلى صورة";
      if (isSpanish) return "PDF a imagen";
      if (isTurkish) return "PDF'ten Görsele";
      if (isGerman) return "PDF in Bild";
      if (isFrench) return "PDF en image";
      if (isPortuguese) return "PDF para imagem";
      if (isItalian) return "PDF in immagine";
      if (isDutch) return "PDF naar afbeelding";
      if (isCatalan) return "PDF a imatge";
    }
    if (label === "Image to PDF" || label === "Image in PDF") {
      if (isSwedish) return "Bild till PDF";
      if (isArabic) return "صورة إلى PDF";
      if (isSpanish) return "Imagen a PDF";
      if (isTurkish) return "Görselden PDF'e";
      if (isGerman) return "Bild in PDF";
      if (isFrench) return "Image en PDF";
      if (isPortuguese) return "Imagem para PDF";
      if (isItalian) return "Immagine in PDF";
      if (isDutch) return "Afbeelding naar PDF";
      if (isCatalan) return "Imatge a PDF";
    }
    if (label === "PDF to Text") {
      if (isSwedish) return "PDF till text";
      if (isArabic) return "PDF إلى نص";
      if (isSpanish) return "PDF a texto";
      if (isTurkish) return "PDF'ten Metne";
      if (isGerman) return "PDF in Text";
      if (isFrench) return "PDF en texte";
      if (isPortuguese) return "PDF para texto";
      if (isItalian) return "PDF in testo";
      if (isDutch) return "PDF naar tekst";
      if (isCatalan) return "PDF a text";
    }
    if (label === "PDF Compressor") {
      if (isSwedish) return "PDF-komprimerare";
      if (isArabic) return "ضاغط PDF";
      if (isSpanish) return "Compresor de PDF";
      if (isTurkish) return "PDF Sıkıştırıcı";
      if (isFrench) return "Compresseur PDF";
      if (isGerman) return "PDF-Komprimierer";
      if (isPortuguese) return "Compressor de PDF";
      if (isItalian) return "Compressore PDF";
      if (isDutch) return "PDF-compressor";
      if (isCatalan) return "Compressor de PDF";
    }
    if (label === "Image Compressor") {
      if (isSwedish) return "Bildkomprimerare";
      if (isArabic) return "ضاغط الصور";
      if (isSpanish) return "Compresor de imágenes";
      if (isTurkish) return "Görsel Sıkıştırıcı";
      if (isFrench) return "Compresseur d'image";
      if (isGerman) return "Bild-Komprimierer";
      if (isPortuguese) return "Compressor de imagens";
      if (isItalian) return "Compressore immagini";
      if (isDutch) return "Afbeeldingscompressor";
      if (isCatalan) return "Compressor d'imatges";
    }
    if (label === "Image Converter") {
      if (isSwedish) return "Bildkonverterare";
      if (isArabic) return "محول الصور";
      if (isSpanish) return "Convertidor de imágenes";
      if (isTurkish) return "Görsel Dönüştürücü";
      if (isFrench) return "Convertisseur d'image";
      if (isGerman) return "Bild-Konverter";
      if (isPortuguese) return "Conversor de imagens";
      if (isItalian) return "Convertitore immagini";
      if (isDutch) return "Afbeeldingsconverter";
      if (isCatalan) return "Convertidor d'imatges";
    }
    if (label === "Merge PDF Files" || label === "Merge PDF") {
      if (isSwedish) return "Slå samman PDF-filer";
      if (isArabic) return "دمج ملفات PDF";
      if (isSpanish) return "Unir archivos PDF";
      if (isTurkish) return "PDF Dosyalarını Birleştir";
      if (isFrench) return "Fusionner des PDF";
      if (isGerman) return "PDF-Dateien zusammenfügen";
      if (isPortuguese) return "Juntar ficheiros PDF";
      if (isItalian) return "Unisci file PDF";
      if (isDutch) return "PDF-bestanden samenvoegen";
      if (isCatalan) return "Unir fitxers PDF";
    }
    if (label === "Split PDF Document" || label === "Split PDF") {
      if (isSwedish) return "Dela upp PDF-dokument";
      if (isArabic) return "تقسيم مستند PDF";
      if (isSpanish) return "Dividir documento PDF";
      if (isTurkish) return "PDF Belgesini Böl";
      if (isFrench) return "Diviser document PDF";
      if (isGerman) return "PDF-Dokument trennen";
      if (isPortuguese) return "Dividir documento PDF";
      if (isItalian) return "Dividi documento PDF";
      if (isDutch) return "PDF-document splitsen";
      if (isCatalan) return "Dividir document PDF";
    }
    if (label === "Reorder Pages") {
      if (isSwedish) return "Ändra ordning på sidor";
      if (isArabic) return "إعادة ترتيب الصفحات";
      if (isSpanish) return "Reordenar páginas";
      if (isTurkish) return "Sayfaları Yeniden Sırala";
      if (isGerman) return "Seiten neu anordnen";
      if (isFrench) return "Réorganiser les pages";
      if (isPortuguese) return "Reordenar páginas";
      if (isItalian) return "Riordina pagine";
      if (isDutch) return "Pagina's herschikken";
      if (isCatalan) return "Reordenar pàgines";
    }
    if (label === "Reverse PDF") {
      if (isSwedish) return "Vänd PDF-ordning";
      if (isArabic) return "عكس ترتيب PDF";
      if (isSpanish) return "Invertir PDF";
      if (isTurkish) return "PDF'i Tersine Çevir";
      if (isGerman) return "PDF umkehren";
      if (isFrench) return "Inverser le PDF";
      if (isPortuguese) return "Inverter PDF";
      if (isItalian) return "Inverti PDF";
      if (isDutch) return "PDF omkeren";
      if (isCatalan) return "Invertir PDF";
    }
    if (label === "Add Blank Page") {
      if (isSwedish) return "Lägg till tom sida";
      if (isArabic) return "إضافة صفحة فارغة";
      if (isSpanish) return "Añadir página en blanco";
      if (isTurkish) return "Boş Sayfa Ekle";
      if (isGerman) return "Leere Seite hinzufügen";
      if (isFrench) return "Ajouter une page blanche";
      if (isPortuguese) return "Adicionar página em branco";
      if (isItalian) return "Aggiungi pagina vuota";
      if (isDutch) return "Leere pagina toevoegen";
      if (isCatalan) return "Afegir pàgina en blanc";
    }
    if (label === "Duplicate Pages") {
      if (isSwedish) return "Duplicera sidor";
      if (isArabic) return "تكرار الصفحات";
      if (isSpanish) return "Duplicar páginas";
      if (isTurkish) return "Sayfaları Çoğalt";
      if (isGerman) return "Seiten duplizieren";
      if (isFrench) return "Dupliquer les pages";
      if (isPortuguese) return "Duplicar páginas";
      if (isItalian) return "Duplica pagine";
      if (isDutch) return "Pagina's dupliceren";
      if (isCatalan) return "Duplicar pàgines";
    }
    if (label === "Delete Pages") {
      if (isSwedish) return "Ta bort sidor";
      if (isArabic) return "حذف الصفحات";
      if (isSpanish) return "Eliminar páginas";
      if (isTurkish) return "Sayfaları Sil";
      if (isGerman) return "Seiten löschen";
      if (isFrench) return "Supprimer des pages";
      if (isPortuguese) return "Eliminar páginas";
      if (isItalian) return "Elimina pagine";
      if (isDutch) return "Pagina's verwijderen";
      if (isCatalan) return "Eliminar pàgines";
    }
    if (label === "Flatten PDF") {
      if (isSwedish) return "Platta till PDF";
      if (isArabic) return "تسطيح PDF";
      if (isSpanish) return "Aplanar PDF";
      if (isTurkish) return "PDF'i Düzleştir";
      if (isGerman) return "PDF glätten";
      if (isFrench) return "Aplatir le PDF";
      if (isPortuguese) return "Aplanar PDF";
      if (isItalian) return "Appiattisci PDF";
      if (isDutch) return "PDF afvlakken";
      if (isCatalan) return "Aplanar PDF";
    }
    if (label === "Grayscale Image") {
      if (isSwedish) return "Gör bilden gråskalig";
      if (isGerman) return "Bild in Graustufen";
      if (isFrench) return "Image en niveaux de gris";
      if (isSpanish) return "Escala de grises";
      if (isArabic) return "صورة بتدرج رمادي";
      if (isPortuguese) return "Escala de cinzentos";
      if (isItalian) return "Scala di grigi";
      if (isDutch) return "Grijswaarden afbeelding";
      if (isCatalan) return "Escala de grisos";
    }
    if (label === "Invert Image") {
      if (isSwedish) return "Invertera bild";
      if (isGerman) return "Bild invertieren";
      if (isFrench) return "Inverser l'image";
      if (isSpanish) return "Invertir imagen";
      if (isArabic) return "عكس ألوان الصورة";
      if (isPortuguese) return "Inverter imagem";
      if (isItalian) return "Inverti immagine";
      if (isDutch) return "Afbeelding omkeren";
      if (isCatalan) return "Invertir imatge";
    }
    if (label === "Blur Image") {
      if (isSwedish) return "Gör bilden oskarp";
      if (isGerman) return "Bild weichzeichnen";
      if (isFrench) return "Flouter l'image";
      if (isSpanish) return "Desenfocar imagen";
      if (isArabic) return "تعتيم الصورة";
      if (isPortuguese) return "Desfocar imagem";
      if (isItalian) return "Sfoca immagine";
      if (isDutch) return "Afbeelding vervagen";
      if (isCatalan) return "Desenfocar imatge";
    }
    if (label === "Crop Image") {
      if (isSwedish) return "Beskär bild";
      if (isGerman) return "Bild zuschneiden";
      if (isFrench) return "Rogner l'image";
      if (isSpanish) return "Recortar imagen";
      if (isArabic) return "قص الصورة";
      if (isPortuguese) return "Cortar imagem";
      if (isItalian) return "Ritaglia immagine";
      if (isDutch) return "Afbeelding bijsnijden";
      if (isCatalan) return "Retallar imatge";
    }
    if (label === "Resize Image") {
      if (isSwedish) return "Ändra bildstorlek";
      if (isGerman) return "Bildgröße ändern";
      if (isFrench) return "Redimensionner l'image";
      if (isSpanish) return "Redimensionar imagen";
      if (isArabic) return "تغيير حجم الصورة";
      if (isPortuguese) return "Redimensionar imagem";
      if (isItalian) return "Ridimensiona immagine";
      if (isDutch) return "Afbeeldingsformaat wijzigen";
      if (isCatalan) return "Redimensionar imatge";
    }
    if (label === "Rotate Image") {
      if (isSwedish) return "Rotera bild";
      if (isGerman) return "Bild drehen";
      if (isFrench) return "Faire pivoter l'image";
      if (isSpanish) return "Rotar imagen";
      if (isArabic) return "تدوير الصورة";
      if (isPortuguese) return "Rodar imagem";
      if (isItalian) return "Ruota immagine";
      if (isDutch) return "Afbeelding draaien";
      if (isCatalan) return "Girar imatge";
    }
    if (label === "Flip Image") {
      if (isSwedish) return "Vänd bild";
      if (isGerman) return "Bild spiegeln";
      if (isFrench) return "Retourner l'image";
      if (isSpanish) return "Voltear imagen";
      if (isArabic) return "قلب الصورة";
      if (isPortuguese) return "Inverter imagem horizontal";
      if (isItalian) return "Capovolgi immagine";
      if (isDutch) return "Afbeelding spiegelen";
      if (isCatalan) return "Voltejar imatge";
    }
    if (label === "Change Speed") {
      if (isSwedish) return "Ändra hastighet";
      if (isGerman) return "Geschwindigkeit ändern";
      if (isFrench) return "Changer la vitesse";
      if (isSpanish) return "Cambiar velocidad";
      if (isArabic) return "تغيير السرعة";
      if (isPortuguese) return "Alterar velocidade";
      if (isItalian) return "Cambia velocità";
      if (isDutch) return "Snelheid wijzigen";
      if (isCatalan) return "Canviar velocitat";
    }
    if (label === "Video to GIF") {
      if (isSwedish) return "Video till GIF";
      if (isGerman) return "Video zu GIF";
      if (isFrench) return "Vidéo en GIF";
      if (isSpanish) return "Video a GIF";
      if (isArabic) return "فيديو إلى GIF";
      if (isPortuguese) return "Vídeo para GIF";
      if (isItalian) return "Video in GIF";
      if (isDutch) return "Video naar GIF";
      if (isCatalan) return "Vídeo a GIF";
    }
    if (label === "Mute Video") {
      if (isSwedish) return "Stäng av videoljud";
      if (isGerman) return "Video stummschalten";
      if (isFrench) return "Couper le son vidéo";
      if (isSpanish) return "Silenciar video";
      if (isArabic) return "كتم صوت الفيديو";
      if (isPortuguese) return "Silenciar vídeo";
      if (isItalian) return "Disattiva audio video";
      if (isDutch) return "Video dempen";
      if (isCatalan) return "Silenciar vídeo";
    }
    if (label === "Boost Volume") {
      if (isSwedish) return "Höj volym";
      if (isGerman) return "Lautstärke erhöhen";
      if (isFrench) return "Augmenter le volume";
      if (isSpanish) return "Aumentar volumen";
      if (isArabic) return "تضخيم الصوت";
      if (isPortuguese) return "Aumentar volume";
      if (isItalian) return "Aumenta volume";
      if (isDutch) return "Volume verhogen";
      if (isCatalan) return "Augmentar volum";
    }
    if (label === "Create ZIP") {
      if (isSwedish) return "Skapa ZIP";
      if (isGerman) return "ZIP erstellen";
      if (isFrench) return "Créer un ZIP";
      if (isSpanish) return "Crear ZIP";
      if (isArabic) return "إنشاء ZIP";
      if (isPortuguese) return "Criar ZIP";
      if (isItalian) return "Crea ZIP";
      if (isDutch) return "ZIP maken";
      if (isCatalan) return "Crear ZIP";
    }
    if (label === "Strip EXIF") {
      if (isSwedish) return "Rensa EXIF-data";
      if (isGerman) return "EXIF entfernen";
      if (isFrench) return "Supprimer EXIF";
      if (isSpanish) return "Eliminar EXIF";
      if (isArabic) return "حذف بيانات EXIF";
      if (isPortuguese) return "Remover EXIF";
      if (isItalian) return "Rimuovi EXIF";
      if (isDutch) return "EXIF verwijderen";
      if (isCatalan) return "Eliminar EXIF";
    }
    if (label === "Convert Audio") {
      if (isSwedish) return "Konvertera ljud";
      if (isGerman) return "Audio konvertieren";
      if (isFrench) return "Convertir audio";
      if (isSpanish) return "Convertir audio";
      if (isArabic) return "تحويل الصوت";
      if (isPortuguese) return "Converter áudio";
      if (isItalian) return "Converti audio";
      if (isDutch) return "Audio converteren";
      if (isCatalan) return "Convertir àudio";
    }
    if (label === "Compress Audio") {
      if (isSwedish) return "Komprimera ljud";
      if (isGerman) return "Audio komprimieren";
      if (isFrench) return "Compresser audio";
      if (isSpanish) return "Comprimir audio";
      if (isArabic) return "ضغط الصوت";
      if (isPortuguese) return "Comprimir áudio";
      if (isItalian) return "Comprimi audio";
      if (isDutch) return "Audio comprimeren";
      if (isCatalan) return "Comprimir àudio";
    }
    if (label === "Trim Audio") {
      if (isSwedish) return "Klipp ljud";
      if (isGerman) return "Audio schneiden";
      if (isFrench) return "Couper audio";
      if (isSpanish) return "Recortar audio";
      if (isArabic) return "قص الصوت";
      if (isPortuguese) return "Cortar áudio";
      if (isItalian) return "Taglia audio";
      if (isDutch) return "Audio bijsnijden";
      if (isCatalan) return "Retallar àudio";
    }
    if (label === "Merge Audio") {
      if (isSwedish) return "Slå samman ljud";
      if (isGerman) return "Audio zusammenfügen";
      if (isFrench) return "Fusionner audio";
      if (isSpanish) return "Unir audio";
      if (isArabic) return "دمج الصوت";
      if (isPortuguese) return "Juntar áudio";
      if (isItalian) return "Unisci audio";
      if (isDutch) return "Audio samenvoegen";
      if (isCatalan) return "Unir àudio";
    }
    if (label === "Convert Video") {
      if (isSwedish) return "Konvertera video";
      if (isGerman) return "Video konvertieren";
      if (isFrench) return "Convertir vidéo";
      if (isSpanish) return "Convertir video";
      if (isArabic) return "تحويل الفيديو";
      if (isPortuguese) return "Converter vídeo";
      if (isItalian) return "Converti video";
      if (isDutch) return "Video converteren";
      if (isCatalan) return "Convertir vídeo";
    }
    if (label === "Compress Video") {
      if (isSwedish) return "Komprimera video";
      if (isGerman) return "Video komprimieren";
      if (isFrench) return "Compresser vidéo";
      if (isSpanish) return "Comprimir video";
      if (isArabic) return "ضغط الفيديو";
      if (isPortuguese) return "Comprimir vídeo";
      if (isItalian) return "Comprimi video";
      if (isDutch) return "Video comprimeren";
      if (isCatalan) return "Comprimir vídeo";
    }
    if (label === "Trim Video") {
      if (isSwedish) return "Klipp video";
      if (isGerman) return "Video schneiden";
      if (isFrench) return "Couper vidéo";
      if (isSpanish) return "Recortar video";
      if (isArabic) return "قص الفيديو";
      if (isPortuguese) return "Cortar vídeo";
      if (isItalian) return "Taglia video";
      if (isDutch) return "Video bijsnijden";
      if (isCatalan) return "Retallar vídeo";
    }
    if (label === "Rotate Video") {
      if (isSwedish) return "Rotera video";
      if (isGerman) return "Video drehen";
      if (isFrench) return "Faire pivoter la vidéo";
      if (isSpanish) return "Rotar video";
      if (isArabic) return "تدوير الفيديو";
      if (isPortuguese) return "Rodar vídeo";
      if (isItalian) return "Ruota video";
      if (isDutch) return "Video draaien";
      if (isCatalan) return "Girar vídeo";
    }
    if (label === "Extract ZIP") {
      if (isSwedish) return "Packa upp ZIP";
      if (isGerman) return "ZIP entpacken";
      if (isFrench) return "Extraire ZIP";
      if (isSpanish) return "Extraer ZIP";
      if (isArabic) return "استخراج ZIP";
      if (isPortuguese) return "Extrair ZIP";
      if (isItalian) return "Estrai ZIP";
      if (isDutch) return "ZIP uitpakken";
      if (isCatalan) return "Extreure ZIP";
    }
    if (label === "Extract RAR") {
      if (isSwedish) return "Packa upp RAR";
      if (isGerman) return "RAR entpacken";
      if (isFrench) return "Extraire RAR";
      if (isSpanish) return "Extraer RAR";
      if (isArabic) return "استخراج RAR";
      if (isPortuguese) return "Extrair RAR";
      if (isItalian) return "Estrai RAR";
      if (isDutch) return "RAR uitpakken";
      if (isCatalan) return "Extreure RAR";
    }

    // Localize common action prefixes
    if (label.startsWith("Compress ")) {
      const item = label.replace("Compress ", "");
      if (isSwedish) return `Komprimera ${item}`;
      if (isArabic) return `ضغط ${item}`;
      if (isSpanish) return `Comprimir ${item}`;
      if (isTurkish) return `${item} Sıkıştır`;
      if (isFrench) return `Compresser ${item}`;
      if (isGerman) return `${item} komprimieren`;
      if (isPortuguese) return `Comprimir ${item}`;
      if (isItalian) return `Comprimi ${item}`;
      if (isDutch) return `${item} comprimeren`;
      if (isCatalan) return `Comprimir ${item}`;
    }
    if (label.startsWith("Convert ")) {
      const item = label.replace("Convert ", "");
      if (isSwedish) return `Konvertera ${item}`;
      if (isArabic) return `تحويل ${item}`;
      if (isSpanish) return `Convertir ${item}`;
      if (isTurkish) return `${item} Dönüştür`;
      if (isFrench) return `Convertir ${item}`;
      if (isGerman) return `${item} konvertieren`;
      if (isPortuguese) return `Converter ${item}`;
      if (isItalian) return `Converti ${item}`;
      if (isDutch) return `${item} converteren`;
      if (isCatalan) return `Convertir ${item}`;
    }
    if (label.startsWith("Extract ")) {
      const item = label.replace("Extract ", "");
      if (isSwedish) return `Extrahera ${item}`;
      if (isArabic) return `استخراج ${item}`;
      if (isSpanish) return `Extraer ${item}`;
      if (isTurkish) return `${item} Ayıkla`;
      if (isFrench) return `Extraire ${item}`;
      if (isGerman) return `${item} extrahieren`;
      if (isPortuguese) return `Extrair ${item}`;
      if (isItalian) return `Estrai ${item}`;
      if (isDutch) return `${item} extraheren`;
      if (isCatalan) return `Extreure ${item}`;
    }
    if (label.startsWith("Rotate ")) {
      const item = label.replace("Rotate ", "");
      if (isSwedish) return `Rotera ${item}`;
      if (isArabic) return `تدوير ${item}`;
      if (isSpanish) return `Rotar ${item}`;
      if (isTurkish) return `${item} Döndür`;
      if (isFrench) return `Faire pivoter ${item}`;
      if (isGerman) return `${item} drehen`;
      if (isPortuguese) return `Rodar ${item}`;
      if (isItalian) return `Ruota ${item}`;
      if (isDutch) return `${item} draaien`;
      if (isCatalan) return `Girar ${item}`;
    }
    if (label.startsWith("Trim ")) {
      const item = label.replace("Trim ", "");
      if (isSwedish) return `Klipp ${item}`;
      if (isArabic) return `قص ${item}`;
      if (isSpanish) return `Recortar ${item}`;
      if (isTurkish) return `${item} Kırp`;
      if (isFrench) return `Couper ${item}`;
      if (isGerman) return `${item} schneiden`;
      if (isPortuguese) return `Cortar ${item}`;
      if (isItalian) return `Taglia ${item}`;
      if (isDutch) return `${item} bijsnijden`;
      if (isCatalan) return `Retallar ${item}`;
    }

    // Generic Pair Conversions (e.g. "PNG to JPG", "JPG to PDF", "AVI to MP4", "DWG to PDF")
    if (label.includes(" to ")) {
      const [rawSource, rawTarget] = label.split(" to ");
      if (rawSource && rawTarget) {
        let source = rawSource.trim();
        let target = rawTarget.trim();

        if (isSpanish) {
          if (source === "Image") source = "Imagen";
          if (target === "Image") target = "imagen";
          if (target === "Text") target = "texto";
          if (target === "Picture") target = "imagen";
        }
        if (isGerman) {
          if (source === "Image") source = "Bild";
          if (target === "Image") target = "Bild";
          if (target === "Text") target = "Text";
          if (target === "Picture") target = "Bild";
        }
        if (isFrench) {
          if (source === "Image") source = "Image";
          if (target === "Image") target = "Image";
          if (target === "Text") target = "Texte";
          if (target === "Picture") target = "Image";
        }

        return `${source} ${toPrep} ${target}`;
      }
    }

    return label;
  };

  if (!isOpen) return null;

  // Render ZenDocs / Smallpdf style mega-menu for Convert with 5 balanced columns (Wide, stretched layout with zero vertical gaps)
  if (navItem.id === "convert") {
    const imageGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "image-conversion");
    const fromPdfGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "pdf-to-image-conversion");
    const toPdfGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "image-to-pdf-conversion");
    const docGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "document-conversion");
    const audioGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "audio-tools");
    const videoGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "video-tools");
    const archiveGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "archive-tools");
    const cadGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "cad-tools");
    const subtitleGroup = CONVERTER_NAVIGATION_GROUPS.find((g) => g.id === "subtitle-tools");

    // Partition the 29 image links into Image Convert, More Formats, and Image Editors
    const imageLinks = imageGroup?.links || [];
    const coreConverters = imageLinks.slice(0, 8); // Top converters (JPG, PNG, WebP, ICO, HEIC)
    const moreFormats = imageLinks.slice(8, 18);   // Secondary formats (AVIF, SVG, BMP, GIF)
    const imageEditors = imageLinks.slice(18);     // Editing & Transforms (Grayscale, Invert, Blur, Crop, Resize, Rotate, Flip)

    const imageGroupCol1 = imageGroup ? { ...imageGroup, label: "IMAGE CONVERT", links: coreConverters } : null;
    const imageGroupCol2 = imageGroup ? { ...imageGroup, label: "MORE FORMATS", links: moreFormats } : null;
    const imageGroupCol3 = imageGroup ? { ...imageGroup, label: "IMAGE EDITORS", links: imageEditors } : null;

    // Localized category header labels
    const columns = [
      // Column 1: Image Convert (Top) + More Formats (Underneath) (8 + 10 = 18 links)
      { id: "col-1", groups: [imageGroupCol1, imageGroupCol2].filter(Boolean) as typeof CONVERTER_NAVIGATION_GROUPS },
      // Column 2: Image Editors & Optimization (11 links)
      { id: "col-2", groups: [imageGroupCol3].filter(Boolean) as typeof CONVERTER_NAVIGATION_GROUPS },
      // Column 3: Video Tools + Subtitle Tools (12 + 2 = 14 links)
      { id: "col-3", groups: [videoGroup, subtitleGroup].filter(Boolean) as typeof CONVERTER_NAVIGATION_GROUPS },
      // Column 4: PDF Interoperability (From PDF & To PDF) (3 + 7 = 10 links)
      { id: "col-4", groups: [fromPdfGroup, toPdfGroup].filter(Boolean) as typeof CONVERTER_NAVIGATION_GROUPS },
      // Column 5: Documents & E-Books + CAD & Vector Tools (4 + 8 = 12 links)
      { id: "col-5", groups: [docGroup, cadGroup].filter(Boolean) as typeof CONVERTER_NAVIGATION_GROUPS },
      // Column 6: Audio & Archive Utilities (10 + 9 = 19 links)
      { id: "col-6", groups: [audioGroup, archiveGroup].filter(Boolean) as typeof CONVERTER_NAVIGATION_GROUPS }
    ];

    return (
      <div
        id="convert-menu"
        ref={menuRef}
        role="region"
        aria-label="Convert Tools"
        className="fixed top-16 left-1/2 -translate-x-1/2 mt-2 w-[1240px] max-w-[calc(100vw-2rem)] max-h-[86vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
      >
        <div className="grid grid-cols-6 gap-5 items-start">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col gap-6">
              {col.groups.map((group) => (
                <div key={group.id} className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                    {getCategoryHeader(group.label)}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {group.links.map((link, lIdx) => {
                      const localizedTarget = getLocalizedHref(link.href, activeLocale);
                      const isActive = pathname === link.href || pathname === localizedTarget;
                      const localizedLabel = getLocalizedLinkLabel(link.label, link.href);
                      return (
                        <Link
                          key={lIdx}
                          href={localizedTarget}
                          onClick={onClose}
                          aria-current={isActive ? "page" : undefined}
                          className={`px-2.5 py-1.5 text-[12.5px] font-bold rounded-xl transition-all flex items-center gap-2 ${
                            isActive
                              ? "text-blue-600 bg-blue-50 font-bold border border-blue-100"
                              : "text-slate-800 hover:text-blue-600 hover:bg-slate-50"
                          }`}
                        >
                          <NavItemIcon href={link.href} className="w-3.5 h-3.5" />
                          <span className="truncate">{"\u2066"}{localizedLabel}{"\u2069"}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

    return (
      <div
        id={megaMenu?.id || "mega-menu"}
        ref={menuRef}
        role="region"
        aria-label={megaMenu?.label || "Mega Menu"}
        className="absolute top-full ltr:left-0 rtl:right-0 mt-3.5 w-[600px] max-w-[calc(100vw-3rem)] bg-white border border-slate-200 rounded-3xl p-7 shadow-2xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="grid grid-cols-2 gap-7">
          {megaMenu?.groups?.map((group, gIdx) => {
            const localizedGroupTitle = getCategoryHeader(group.title);
            return (
              <div key={gIdx} className="flex flex-col gap-3">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {localizedGroupTitle}
                </span>

                {/* Primary Tool Link */}
                {group.primaryLink && (() => {
                  const localizedPrimary = getLocalizedHref(group.primaryLink.href, activeLocale);
                  const isPrimaryActive = pathname === group.primaryLink.href || pathname === localizedPrimary;
                  const localizedPrimaryLabel = getLocalizedLinkLabel(group.primaryLink.label, group.primaryLink.href);

                  return (
                    <Link
                      href={localizedPrimary}
                      onClick={onClose}
                      aria-current={isPrimaryActive ? "page" : undefined}
                      className={`flex flex-col p-3 rounded-xl border transition-all ${
                        isPrimaryActive
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                          : "bg-slate-50/60 border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <NavItemIcon href={group.primaryLink.href} className="w-5 h-5" />
                        <span className="text-[14px] font-extrabold text-slate-900">{localizedPrimaryLabel}</span>
                      </div>
                      <span className="text-[12px] text-slate-500 font-normal mt-1 leading-snug">
                        {group.title === "IMAGE"
                          ? (activeLocale === "sv" ? "Optimera JPG, PNG och WebP lokalt" : activeLocale === "ar" ? "تحسين ملفات JPG وPNG وWebP محلياً" : activeLocale === "tr" ? "JPG, PNG ve WebP'leri yerel olarak optimize edin" : activeLocale === "es" || activeLocale === "es-419" ? "Optimiza imágenes JPG, PNG y WebP en tu dispositivo" : activeLocale === "de" ? "JPG, PNG und WebP lokal optimieren" : activeLocale === "fr" ? "Optimisez JPG, PNG et WebP localement" : (activeLocale === "pt" || activeLocale === "pt-BR") ? "Otimize imagens JPG, PNG e WebP no seu dispositivo" : activeLocale === "it" ? "Ottimizza immagini JPG, PNG e WebP localmente" : activeLocale === "nl" ? "Optimaliseer JPG, PNG en WebP lokaal" : activeLocale === "ca" ? "Optimitza imatges JPG, PNG i WebP localment" : "Optimize JPEGs, PNGs, and WebPs locally")
                          : (group.primaryLink?.href === "/merge-pdf")
                          ? (activeLocale === "sv" ? "Kombinera PDF-filer i webbläsaren" : activeLocale === "ar" ? "دمج ملفات PDF في المتصفح" : activeLocale === "tr" ? "PDF dosyalarını tarayıcıda birleştirin" : activeLocale === "es" || activeLocale === "es-419" ? "Combina múltiples archivos PDF en tu navegador" : activeLocale === "de" ? "Mehrere PDF-Dateien im Browser verbinden" : activeLocale === "fr" ? "Combinez plusieurs fichiers PDF dans le navigateur" : (activeLocale === "pt" || activeLocale === "pt-BR") ? "Combine múltiplos ficheiros PDF no navegador" : activeLocale === "it" ? "Combina più file PDF nel browser" : activeLocale === "nl" ? "Combineer meerdere PDF-bestanden in de browser" : activeLocale === "ca" ? "Combina múltiples fitxers PDF al teu navegador" : "Combine multiple PDF files in browser")
                          : (activeLocale === "sv" ? "Minska PDF under 2 MB i webbläsaren" : activeLocale === "ar" ? "تقليص ملفات PDF لأقل من 2 ميغابايت" : activeLocale === "tr" ? "PDF'leri 2 MB altına küçültün" : activeLocale === "es" || activeLocale === "es-419" ? "Reduce el tamaño de PDFs a menos de 2 MB" : activeLocale === "de" ? "PDFs unter 2 MB im Browser verkleinern" : activeLocale === "fr" ? "Réduisez les PDF à moins de 2 Mo dans le navigateur" : (activeLocale === "pt" || activeLocale === "pt-BR") ? "Reduza PDFs para menos de 2 MB no navegador" : activeLocale === "it" ? "Riduci PDF sotto i 2 MB nel browser" : activeLocale === "nl" ? "Verklein PDF's tot onder 2 MB in de browser" : activeLocale === "ca" ? "Redueix fitxers PDF a menys de 2 MB al navegador" : "Shrink PDFs below 2 MB in browser")}
                      </span>
                    </Link>
                  );
                })()}

                {/* Secondary Tool Link */}
                {group.secondaryLink && (() => {
                  const localizedSecondary = getLocalizedHref(group.secondaryLink.href, activeLocale);
                  const isSecondaryActive = pathname === group.secondaryLink.href || pathname === localizedSecondary;
                  const localizedSecondaryLabel = getLocalizedLinkLabel(group.secondaryLink.label, group.secondaryLink.href);
                  return (
                    <Link
                      href={localizedSecondary}
                      onClick={onClose}
                      aria-current={isSecondaryActive ? "page" : undefined}
                      className={`px-3 py-2 text-[13px] font-bold rounded-xl transition-all flex items-center gap-2.5 ${
                        isSecondaryActive
                          ? "text-blue-600 bg-blue-50 border border-blue-100"
                          : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <NavItemIcon href={group.secondaryLink.href} className="w-4 h-4" />
                      <span>{localizedSecondaryLabel}</span>
                    </Link>
                  );
                })()}

                {/* Subgroups (Popular Target Sizes / Page Editing) */}
                {group.subgroups?.map((sg, sIdx) => {
                  const localizedSgLabel = sg.label ? getCategoryHeader(sg.label) : "";
                  return (
                    <div key={sIdx} className="flex flex-col gap-2 mt-1 pt-3 border-t border-slate-100">
                      {localizedSgLabel && (
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          {localizedSgLabel}
                        </span>
                      )}
                      <div className="grid grid-cols-2 gap-1.5">
                        {sg.items.map((item, iIdx) => {
                          const localizedItemHref = getLocalizedHref(item.href, activeLocale);
                          const isActive = pathname === item.href || pathname === localizedItemHref;
                          const localizedItemLabel = getLocalizedLinkLabel(item.label, item.href);
                          return (
                            <Link
                              key={iIdx}
                              href={localizedItemHref}
                              onClick={onClose}
                              aria-current={isActive ? "page" : undefined}
                              className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-2 ${
                                isActive
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50"
                              }`}
                            >
                              <NavItemIcon href={item.href} className={`w-3.5 h-3.5 ${isActive ? "text-white" : ""}`} />
                              <span>{localizedItemLabel}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
}
