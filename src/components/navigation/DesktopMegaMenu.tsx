"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNavItem, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";
import { useLanguage } from "@/components/layout/LanguageContext";
import { getLocalizedHref, VERB_DICTIONARY } from "@/utils/i18nHelper";
import { SupportedLocale, isValidLocale, normalizeLocale } from "@/config/i18n/locales";
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS, NOUN_MAP, NAV_ACCESSIBILITY_LABELS } from "./megaMenuTranslations";

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
  // 6. Font Tools (TTF, WOFF2)
  if (href.includes("font") || href.includes("ttf") || href.includes("woff2")) {
    return (
      <svg className={`${className} text-indigo-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    );
  }
  // 7. E-Book Tools (EPUB, MOBI, AZW3)
  if (href.includes("epub") || href.includes("mobi") || href.includes("azw3")) {
    return (
      <svg className={`${className} text-amber-700 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  // 8. Archive Tools (ZIP, TAR, RAR, 7Z)
  if (href.includes("zip") || href.includes("rar") || href.includes("tar") || href.includes("7z")) {
    return (
      <svg className={`${className} text-emerald-700 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    );
  }
  // 9. Compress Action
  if (href.includes("compress")) {
    return (
      <svg className={`${className} text-sky-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
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
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const activeLocale = segments.length > 0 ? normalizeLocale(segments[0]) : language || "en";
  const shortLocale = activeLocale.split("-")[0];
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
    const cleanKey = label.trim().toUpperCase();
    const shortLocale = activeLocale.split("-")[0];

    if (MEGA_MENU_CATEGORIES[cleanKey]) {
      const match = MEGA_MENU_CATEGORIES[cleanKey][activeLocale] || MEGA_MENU_CATEGORIES[cleanKey][shortLocale];
      if (match) return match;
    }

    if (cleanKey === "IMAGE") {
      if (navItem.id === "compress") {
        return MEGA_MENU_CATEGORIES["IMAGE COMPRESSION"]?.[activeLocale] || MEGA_MENU_CATEGORIES["IMAGE COMPRESSION"]?.[shortLocale] || "IMAGE COMPRESSION";
      }
      return MEGA_MENU_CATEGORIES["IMAGE CONVERT"]?.[activeLocale] || MEGA_MENU_CATEGORIES["IMAGE CONVERT"]?.[shortLocale] || "IMAGE CONVERSION";
    }
    if (cleanKey === "PDF-TYÖKALUT" || cleanKey === "PDF-VERKTØY" || cleanKey === "PDF TOOLS" || cleanKey === "PDF") {
      return MEGA_MENU_CATEGORIES["PDF"]?.[activeLocale] || MEGA_MENU_CATEGORIES["PDF"]?.[shortLocale] || "PDF TOOLS";
    }
    if (cleanKey === "PAGE MANIPULATION" || cleanKey === "PAGE EDITING & ORGANIZATION") {
      return MEGA_MENU_CATEGORIES["PAGE EDITING & ORGANIZATION"]?.[activeLocale] || MEGA_MENU_CATEGORIES["PAGE EDITING & ORGANIZATION"]?.[shortLocale] || "PAGE EDITING & ORGANIZATION";
    }
    if (cleanKey === "PDF CONVERSIONS" || cleanKey === "COMPRESS & CONVERT") {
      return MEGA_MENU_CATEGORIES["COMPRESS & CONVERT"]?.[activeLocale] || MEGA_MENU_CATEGORIES["COMPRESS & CONVERT"]?.[shortLocale] || "COMPRESS & CONVERT";
    }
    if (cleanKey === "POPULAR TARGET SIZES") {
      return MEGA_MENU_CATEGORIES["POPULAR TARGET SIZES"]?.[activeLocale] || MEGA_MENU_CATEGORIES["POPULAR TARGET SIZES"]?.[shortLocale] || "POPULAR TARGET SIZES";
    }
    if (cleanKey === "IMAGE CONVERSION" || cleanKey === "IMAGE CONVERT") {
      return MEGA_MENU_CATEGORIES["IMAGE CONVERT"]?.[activeLocale] || MEGA_MENU_CATEGORIES["IMAGE CONVERT"]?.[shortLocale] || "IMAGE CONVERSION";
    }
    if (cleanKey === "FORMAT PAIRS") {
      return MEGA_MENU_CATEGORIES["FORMAT PAIRS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["FORMAT PAIRS"]?.[shortLocale] || "FORMAT PAIRS";
    }
    if (cleanKey === "FORMATS") {
      return MEGA_MENU_CATEGORIES["FORMATS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["FORMATS"]?.[shortLocale] || "FORMATS";
    }
    if (cleanKey === "MORE FORMATS") {
      return MEGA_MENU_CATEGORIES["MORE FORMATS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["MORE FORMATS"]?.[shortLocale] || "MORE FORMATS";
    }
    if (cleanKey === "IMAGE EDITORS") {
      return MEGA_MENU_CATEGORIES["IMAGE EDITORS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["IMAGE EDITORS"]?.[shortLocale] || "IMAGE EDITORS";
    }
    if (cleanKey === "VIDEO TOOLS" || cleanKey === "VIDEO") {
      return MEGA_MENU_CATEGORIES["VIDEO TOOLS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["VIDEO TOOLS"]?.[shortLocale] || "VIDEO TOOLS";
    }
    if (cleanKey === "SUBTITLE TOOLS" || cleanKey === "SUBTITLES") {
      return MEGA_MENU_CATEGORIES["SUBTITLE TOOLS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["SUBTITLE TOOLS"]?.[shortLocale] || "SUBTITLE TOOLS";
    }
    if (cleanKey === "CONVERT FROM PDF" || cleanKey === "FROM PDF") {
      return MEGA_MENU_CATEGORIES["CONVERT FROM PDF"]?.[activeLocale] || MEGA_MENU_CATEGORIES["CONVERT FROM PDF"]?.[shortLocale] || "CONVERT FROM PDF";
    }
    if (cleanKey === "CONVERT TO PDF" || cleanKey === "TO PDF") {
      return MEGA_MENU_CATEGORIES["CONVERT TO PDF"]?.[activeLocale] || MEGA_MENU_CATEGORIES["CONVERT TO PDF"]?.[shortLocale] || "CONVERT TO PDF";
    }
    if (cleanKey === "DOCUMENTS & EBOOKS" || cleanKey === "DOCUMENTS & E-BOOKS" || cleanKey === "DOCUMENTS") {
      return MEGA_MENU_CATEGORIES["DOCUMENTS & EBOOKS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["DOCUMENTS & EBOOKS"]?.[shortLocale] || "DOCUMENTS & EBOOKS";
    }
    if (cleanKey === "CAD & VECTOR TOOLS" || cleanKey === "CAD") {
      return MEGA_MENU_CATEGORIES["CAD & VECTOR TOOLS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["CAD & VECTOR TOOLS"]?.[shortLocale] || "CAD & VECTOR TOOLS";
    }
    if (cleanKey === "AUDIO TOOLS" || cleanKey === "AUDIO") {
      return MEGA_MENU_CATEGORIES["AUDIO TOOLS"]?.[activeLocale] || MEGA_MENU_CATEGORIES["AUDIO TOOLS"]?.[shortLocale] || "AUDIO TOOLS";
    }
    if (cleanKey === "ARCHIVE & UTILITIES" || cleanKey === "ARCHIVE") {
      return MEGA_MENU_CATEGORIES["ARCHIVE & UTILITIES"]?.[activeLocale] || MEGA_MENU_CATEGORIES["ARCHIVE & UTILITIES"]?.[shortLocale] || "ARCHIVE & UTILITIES";
    }

    return label;
  };

  // Localize individual link labels
  const getLocalizedLinkLabel = (label: string, href?: string): string => {
    const shortLocale = activeLocale.split("-")[0];

    // 1. Direct dictionary exact match
    if (EXACT_TOOL_LABELS[label]) {
      const exactMatch = EXACT_TOOL_LABELS[label][activeLocale] || EXACT_TOOL_LABELS[label][shortLocale];
      if (exactMatch) return exactMatch;
    }

    // 2. Format pair conversion (e.g. "JPG to PNG", "PDF to JPG", "TIFF to PDF", "DWG to PDF")
    if (label.includes(" to ")) {
      const [rawSource, rawTarget] = label.split(" to ");
      if (rawSource && rawTarget) {
        let source = rawSource.trim();
        let target = rawTarget.trim();

        const pairKey = `${source} to ${target}`;
        if (EXACT_TOOL_LABELS[pairKey]) {
          const match = EXACT_TOOL_LABELS[pairKey][activeLocale] || EXACT_TOOL_LABELS[pairKey][shortLocale];
          if (match) return match;
        }

        const dict = VERB_DICTIONARY[activeLocale as SupportedLocale];
        const PREPOSITIONS: Record<string, string> = {
          ar: "إلى",
          bg: "в",
          cs: "na",
          da: "til",
          de: "in",
          el: "σε",
          es: "a",
          "es-419": "a",
          fi: "muotoon",
          fil: "patungo sa",
          fr: "en",
          he: "ל-",
          hi: "में",
          hu: "formátumba",
          id: "ke",
          it: "in",
          ja: "→",
          ko: "→",
          lt: "į",
          lv: "par",
          ms: "kepada",
          nl: "naar",
          no: "til",
          pl: "na",
          pt: "para",
          "pt-BR": "para",
          ro: "în",
          ru: "в",
          sk: "na",
          sl: "v",
          sv: "till",
          th: "เป็น",
          tr: "→",
          uk: "у",
          vi: "sang",
          "zh-CN": "转",
          "zh-TW": "轉"
        };

        const toPrep = PREPOSITIONS[activeLocale] || PREPOSITIONS[shortLocale] || dict?.to || "to";

        if (NOUN_MAP[source]?.[activeLocale] || NOUN_MAP[source]?.[shortLocale]) {
          source = NOUN_MAP[source][activeLocale] || NOUN_MAP[source][shortLocale];
        }
        if (NOUN_MAP[target]?.[activeLocale] || NOUN_MAP[target]?.[shortLocale]) {
          target = NOUN_MAP[target][activeLocale] || NOUN_MAP[target][shortLocale];
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
        aria-label={NAV_ACCESSIBILITY_LABELS.convertTools[activeLocale] || NAV_ACCESSIBILITY_LABELS.convertTools[shortLocale] || "Convert Tools"}
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
        aria-label={(megaMenu?.label && getCategoryHeader(megaMenu.label)) || NAV_ACCESSIBILITY_LABELS.megaMenu[activeLocale] || NAV_ACCESSIBILITY_LABELS.megaMenu[shortLocale] || "Mega Menu"}
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
                        {(() => {
                          const shortLocale = activeLocale.split("-")[0];
                          if (group.title === "IMAGE") {
                            return (PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE as any)[activeLocale] || (PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE as any)[shortLocale] || PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE.en;
                          }
                          if (group.primaryLink?.href === "/merge-pdf") {
                            return (PRIMARY_DESCRIPTIONS.MERGE_PDF as any)[activeLocale] || (PRIMARY_DESCRIPTIONS.MERGE_PDF as any)[shortLocale] || PRIMARY_DESCRIPTIONS.MERGE_PDF.en;
                          }
                          return (PRIMARY_DESCRIPTIONS.SHRINK_PDF as any)[activeLocale] || (PRIMARY_DESCRIPTIONS.SHRINK_PDF as any)[shortLocale] || PRIMARY_DESCRIPTIONS.SHRINK_PDF.en;
                        })()}
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
