"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";
import { useLanguage } from "../layout/LanguageContext";
import { isValidLocale, normalizeLocale } from "@/config/i18n/locales";
import { getLocalizedHref } from "@/utils/i18nHelper";
import FileKitLogo from "../common/FileKitLogo";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileNavigation({ isOpen, onClose, triggerRef }: MobileNavigationProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const activeLocale = segments.length > 0 ? normalizeLocale(segments[0]) : language || "en";
  const [openAccordion, setOpenAccordion] = useState<string | null>("compress");
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto-focus close button inside drawer
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  const handleLinkClick = () => {
    onClose();
    triggerRef?.current?.focus();
  };

  if (!isOpen) return null;

  const homeHref = activeLocale && activeLocale !== "en" ? `/${activeLocale}` : "/";

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-200 overflow-y-auto"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-fk-border">
        <Link href={homeHref} onClick={handleLinkClick} className="flex items-center">
          <FileKitLogo variant="horizontal" />
        </Link>

        <button
          type="button"
          ref={closeBtnRef}
          onClick={() => {
            onClose();
            triggerRef?.current?.focus();
          }}
          aria-label="Close navigation menu"
          className="p-2 text-fk-text-muted hover:text-fk-text rounded-fk-md focus:outline-none focus:ring-2 focus:ring-fk-primary"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Accordion Content */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {MAIN_NAVIGATION.map((item) => {
          const itemLabel = item.id === "compress"
            ? (t("nav.compress") || item.label)
            : item.id === "convert"
            ? (t("nav.convert") || item.label)
            : item.id === "pdf-tools"
            ? (t("nav.organize") || item.label)
            : item.id === "resize"
            ? (t("nav.resize") || item.label)
            : item.id === "pricing"
            ? (t("nav.pricing") || item.label)
            : item.label;

          // Helper for localized group titles
          const getCategoryHeader = (label: string): string => {
            const isChinese = activeLocale.startsWith("zh");
            const isTaiwan = activeLocale === "zh-TW";
            const isMalay = activeLocale === "ms";
            const isFilipino = activeLocale === "fil";
            const isThai = activeLocale === "th";
            const isVietnamese = activeLocale === "vi";
            const isArabic = activeLocale === "ar";
            const isTurkish = activeLocale === "tr";
            const isSpanish = activeLocale === "es" || activeLocale === "es-419";
            const isFrench = activeLocale === "fr";
            const isGerman = activeLocale === "de";
            const isPortuguese = activeLocale === "pt" || activeLocale === "pt-BR";
            const isItalian = activeLocale === "it";
            const isSwedish = activeLocale === "sv";
            const isJapanese = activeLocale === "ja";
            const isKorean = activeLocale === "ko";

            if (label.includes("IMAGE")) {
              if (isChinese) return isTaiwan ? "圖片" : "图片";
              if (isKorean) return "이미지";
              if (isJapanese) return "画像";
              if (isFilipino) return "IMAHE";
              if (isVietnamese) return "HÌNH ẢNH";
              if (isThai) return "รูปภาพ";
              if (isMalay) return "IMEJ";
              if (isSwedish) return "BILD";
              if (isArabic) return "تحويل الصور";
              if (isTurkish) return "GÖRSEL";
              if (isSpanish) return "IMAGEN";
              if (isFrench) return "IMAGE";
              if (isGerman) return "BILD";
              if (isPortuguese) return "IMAGEM";
              if (isItalian) return "IMMAGINE";
            }
            if (label.includes("PDF")) {
              if (isChinese) return "PDF";
              if (isKorean) return "PDF";
              if (isJapanese) return "PDF";
              if (isFilipino) return "PDF";
              if (isVietnamese) return "PDF";
              if (isThai) return "PDF";
              if (isArabic) return "ملفات PDF";
              if (isTurkish) return "PDF";
              if (isSpanish) return "PDF";
              if (isFrench) return "PDF";
              if (isGerman) return "PDF";
              if (isMalay) return "PDF";
            }
            if (label.includes("VIDEO")) {
              if (isChinese) return isTaiwan ? "影片" : "视频";
              if (isKorean) return "비디오";
              if (isJapanese) return "動画";
              if (isFilipino) return "VIDEO";
              if (isVietnamese) return "VIDEO";
              if (isThai) return "วิดีโอ";
              if (isMalay) return "VIDEO";
              if (isSwedish) return "VIDEO";
              if (isArabic) return "أدوات الفيديو";
              if (isTurkish) return "VİDEO";
              if (isSpanish) return "VIDEO";
              if (isFrench) return "VIDÉO";
              if (isGerman) return "VIDEO";
            }
            if (label.includes("SUBTITLE")) {
              if (isChinese) return "字幕";
              if (isKorean) return "자막";
              if (isJapanese) return "字幕";
              if (isFilipino) return "MGA SUBTITLE";
              if (isVietnamese) return "PHỤ ĐỀ";
              if (isThai) return "คำบรรยาย";
              if (isMalay) return "SARIKATA";
              if (isSwedish) return "UNDERTEXTER";
              if (isArabic) return "أدوات الترجمة";
              if (isTurkish) return "ALTYAZI";
              if (isSpanish) return "SUBTÍTULOS";
              if (isFrench) return "SOUS-TITRES";
              if (isGerman) return "UNTERTITEL";
            }
            if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {
              if (isChinese) return isTaiwan ? "檔案與辦公" : "文档与办公";
              if (isKorean) return "문서 및 오피스";
              if (isJapanese) return "文書・オフィス";
              if (isFilipino) return "MGA DOKUMENTO";
              if (isVietnamese) return "TÀI LIỆU";
              if (isThai) return "เอกสาร";
              if (isMalay) return "DOKUMEN";
              if (isSwedish) return "DOKUMENT";
              if (isArabic) return "المستندات والكتب";
              if (isTurkish) return "BELGELER";
              if (isSpanish) return "DOCUMENTOS";
              if (isFrench) return "DOCUMENTS";
              if (isGerman) return "DOKUMENTE";
            }
            if (label.includes("CAD")) {
              if (isChinese) return isTaiwan ? "CAD 與向量" : "CAD 与矢量";
              if (isKorean) return "CAD 및 벡터";
              if (isJapanese) return "CAD & ベクター";
              if (isFilipino) return "CAD & VECTOR";
              if (isVietnamese) return "CAD & VECTOR";
              if (isThai) return "CAD และเวกเตอร์";
              if (isMalay) return "CAD & VEKTOR";
              if (isSwedish) return "CAD & VEKTOR";
              if (isArabic) return "CAD والمتجهات";
              if (isTurkish) return "CAD VE VEKTÖR";
              if (isSpanish) return "CAD Y VECTOR";
              if (isFrench) return "CAD & VECTORIEL";
              if (isGerman) return "CAD & VEKTOR";
            }
            if (label.includes("AUDIO")) {
              if (isChinese) return isTaiwan ? "音訊" : "音频";
              if (isKorean) return "오디오";
              if (isJapanese) return "音声";
              if (isFilipino) return "AUDIO";
              if (isVietnamese) return "ÂM THANH";
              if (isThai) return "เสียง";
              if (isMalay) return "AUDIO";
              if (isSwedish) return "LJUD";
              if (isArabic) return "أدوات الصوت";
              if (isTurkish) return "SES";
              if (isSpanish) return "AUDIO";
              if (isFrench) return "AUDIO";
              if (isGerman) return "AUDIO";
            }
            if (label.includes("ARCHIVE")) {
              if (isChinese) return isTaiwan ? "壓縮檔與封存" : "压缩文件与归档";
              if (isKorean) return "압축 파일 및 아카이브";
              if (isJapanese) return "圧縮ファイル・アーカイブ";
              if (isFilipino) return "ARCHIVE";
              if (isVietnamese) return "LƯU TRỮ";
              if (isThai) return "คลังข้อมูล";
              if (isMalay) return "ARKIB";
              if (isSwedish) return "ARKIV";
              if (isArabic) return "الأرشيف والأدوات";
              if (isTurkish) return "ARŞİV";
              if (isSpanish) return "ARCHIVOS";
              if (isFrench) return "ARCHIVES";
              if (isGerman) return "ARCHIV";
            }
            return label;
          };

          // Helper for localized link titles
          const getLocalizedLinkLabel = (label: string): string => {
            if (activeLocale === "en") return label;
            const isChinese = activeLocale.startsWith("zh");
            const isTaiwan = activeLocale === "zh-TW";
            const isMalay = activeLocale === "ms";
            const isArabic = activeLocale === "ar";
            const isTurkish = activeLocale === "tr";
            const isSpanish = activeLocale === "es" || activeLocale === "es-419";
            const isPortuguese = activeLocale === "pt" || activeLocale === "pt-BR";
            const isGerman = activeLocale === "de";
            const isFrench = activeLocale === "fr";
            const isItalian = activeLocale === "it";
            const isSwedish = activeLocale === "sv";
            const isFilipino = activeLocale === "fil";
            const isJapanese = activeLocale === "ja";
            const isKorean = activeLocale === "ko";

            const toPrep = isJapanese ? "から" : isFilipino ? "sa" : activeLocale === "vi" ? "sang" : activeLocale === "th" ? "เป็น" : isMalay ? "ke" : isSwedish ? "till" : isArabic ? "إلى" : isSpanish ? "a" : isPortuguese ? "para" : isGerman ? "in" : isFrench ? "en" : isItalian ? "in" : isTurkish ? "→" : "to";

            if (label.includes(" to ")) {
              const [source, target] = label.split(" to ");
              if (source && target) {
                if (isChinese) return `${source} 轉 ${target}`;
                if (isKorean) return `${source}에서 ${target}(으)로 변환`;
                if (isJapanese) return `${source} を ${target} に変換`;
                return `${source} ${toPrep} ${target}`;
              }
            }

            if (label.startsWith("Compress ")) {
              const item = label.replace("Compress ", "");
              if (isChinese) return `${item} 壓縮`;
              if (isKorean) return `${item} 압축`;
              if (isJapanese) return `${item} を圧縮`;
              if (isFilipino) return `I-compress ang ${item}`;
              if (activeLocale === "vi") return `Nén ${item}`;
              if (activeLocale === "th") return `บีบอัด ${item}`;
              if (isMalay) return `Mampatkan ${item}`;
              if (isSwedish) return `Komprimera ${item}`;
              if (isArabic) return `ضغط ${item}`;
              if (isSpanish) return `Comprimir ${item}`;
              if (isTurkish) return `${item} Sıkıştır`;
              if (isFrench) return `Compresser ${item}`;
              if (isGerman) return `${item} komprimieren`;
            }
            if (label.startsWith("Convert ")) {
              const item = label.replace("Convert ", "");
              if (isChinese) return `${item} 轉換`;
              if (isKorean) return `${item} 변환`;
              if (isJapanese) return `${item} を変換`;
              if (isFilipino) return `I-convert ang ${item}`;
              if (activeLocale === "vi") return `Chuyển đổi ${item}`;
              if (activeLocale === "th") return `แปลง ${item}`;
              if (isMalay) return `Tukar ${item}`;
              if (isSwedish) return `Konvertera ${item}`;
              if (isArabic) return `تحويل ${item}`;
              if (isSpanish) return `Convertir ${item}`;
              if (isTurkish) return `${item} Dönüştür`;
              if (isFrench) return `Convertir ${item}`;
              if (isGerman) return `${item} konvertieren`;
            }
            if (label.startsWith("Extract ")) {
              const item = label.replace("Extract ", "");
              if (isChinese) return isTaiwan ? `${item} 擷取` : `${item} 提取`;
              if (isKorean) return `${item} 추출`;
              if (isJapanese) return `${item} を抽出`;
              if (isFilipino) return `I-extract ang ${item}`;
              if (activeLocale === "vi") return `Trích xuất ${item}`;
              if (activeLocale === "th") return `แยก ${item}`;
              if (isMalay) return `Ekstrak ${item}`;
              if (isSwedish) return `Extrahera ${item}`;
              if (isArabic) return `استخراج ${item}`;
              if (isSpanish) return `Extraer ${item}`;
              if (isTurkish) return `${item} Ayıkla`;
              if (isFrench) return `Extraire ${item}`;
              if (isGerman) return `${item} extrahieren`;
            }
            if (label.startsWith("Rotate ")) {
              const item = label.replace("Rotate ", "");
              if (isChinese) return `${item} 旋轉`;
              if (isKorean) return `${item} 회전`;
              if (isJapanese) return `${item} を回転`;
              if (isFilipino) return `Paikutin ang ${item}`;
              if (activeLocale === "vi") return `Xoay ${item}`;
              if (activeLocale === "th") return `หมุน ${item}`;
              if (isMalay) return `Putar ${item}`;
              if (isSwedish) return `Rotera ${item}`;
              if (isArabic) return `تدوير ${item}`;
              if (isSpanish) return `Rotar ${item}`;
              if (isTurkish) return `${item} Döndür`;
              if (isFrench) return `Faire pivoter ${item}`;
              if (isGerman) return `${item} drehen`;
            }
            if (label.startsWith("Trim ")) {
              const item = label.replace("Trim ", "");
              if (isChinese) return isTaiwan ? `${item} 剪裁與修剪` : `${item} 裁剪与修剪`;
              if (isKorean) return `${item} 자르기 및 트리밍`;
              if (isJapanese) return `${item} をカット・トリミング`;
              if (isFilipino) return `Gupitin ang ${item}`;
              if (activeLocale === "vi") return `Cắt ${item}`;
              if (activeLocale === "th") return `ตัด ${item}`;
              if (isMalay) return `Potong ${item}`;
              if (isSwedish) return `Klipp ${item}`;
              if (isArabic) return `قص ${item}`;
              if (isSpanish) return `Recortar ${item}`;
              if (isTurkish) return `${item} Kırp`;
              if (isFrench) return `Couper ${item}`;
              if (isGerman) return `${item} schneiden`;
            }

            return label;
          };

          if (!item.megaMenu) {
            const itemHref = getLocalizedHref(item.href || "/", activeLocale);
            return (
              <Link
                key={item.id}
                href={itemHref}
                onClick={handleLinkClick}
                className="text-[16px] font-bold text-fk-text py-2 border-b border-fk-border"
              >
                {itemLabel}
              </Link>
            );
          }

          const isExpanded = openAccordion === item.id;

          return (
            <div key={item.id} className="flex flex-col border-b border-fk-border pb-4">
              <button
                type="button"
                onClick={() => setOpenAccordion(isExpanded ? null : item.id)}
                aria-expanded={isExpanded}
                className="flex items-center justify-between text-[16px] font-bold text-fk-text py-2 text-left ltr:text-left rtl:text-right"
              >
                <span>{itemLabel}</span>
                <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="flex flex-col gap-6 mt-3 ltr:pl-4 rtl:pr-4 border-l-2 ltr:border-l-fk-primary rtl:border-r-2 rtl:border-r-fk-primary rtl:border-l-0">
                  {item.id === "convert" ? (
                    CONVERTER_NAVIGATION_GROUPS.map((group) => (
                      <div key={group.id} className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                          {getCategoryHeader(group.compactLabel || group.label)}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {group.links.map((subLink, sIdx) => {
                            const localizedSubHref = getLocalizedHref(subLink.href, activeLocale);
                            const isActive = pathname === subLink.href || pathname === localizedSubHref;
                            const localizedSubLabel = getLocalizedLinkLabel(subLink.label);
                            return (
                              <Link
                                key={sIdx}
                                href={localizedSubHref}
                                onClick={handleLinkClick}
                                aria-current={isActive ? "page" : undefined}
                                className={`text-[13px] font-bold py-1 ${
                                  isActive ? "text-fk-primary" : "text-fk-text"
                                }`}
                              >
                                {"\u2066"}{localizedSubLabel}{"\u2069"}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    item.megaMenu.groups.map((group, gIdx) => (
                      <div key={gIdx} className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                          {getCategoryHeader(group.title)}
                        </span>

                        {group.primaryLink && (() => {
                          const localizedPrimary = getLocalizedHref(group.primaryLink.href, activeLocale);
                          const localizedPrimaryLabel = getLocalizedLinkLabel(group.primaryLink.label);
                          return (
                            <Link
                              href={localizedPrimary}
                              onClick={handleLinkClick}
                              aria-current={pathname === group.primaryLink.href || pathname === localizedPrimary ? "page" : undefined}
                              className={`text-[14px] font-bold py-1 ${
                                pathname === group.primaryLink.href || pathname === localizedPrimary ? "text-fk-primary" : "text-fk-text"
                              }`}
                            >
                              {localizedPrimaryLabel}
                            </Link>
                          );
                        })()}

                        {group.secondaryLink && (() => {
                          const localizedSecondary = getLocalizedHref(group.secondaryLink.href, activeLocale);
                          const localizedSecondaryLabel = getLocalizedLinkLabel(group.secondaryLink.label);
                          return (
                            <Link
                              href={localizedSecondary}
                              onClick={handleLinkClick}
                              aria-current={pathname === group.secondaryLink.href || pathname === localizedSecondary ? "page" : undefined}
                              className={`text-[13px] font-medium py-1 ${
                                pathname === group.secondaryLink.href || pathname === localizedSecondary ? "text-fk-primary" : "text-fk-text-muted"
                              }`}
                            >
                              {localizedSecondaryLabel}
                            </Link>
                          );
                        })()}

                        {group.subgroups?.map((sg, sIdx) => (
                          <div key={sIdx} className="flex flex-col gap-2 mt-2">
                            {sg.label && (
                              <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                                {getCategoryHeader(sg.label)}
                              </span>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              {sg.items.map((subItem, iIdx) => {
                                const localizedSubItem = getLocalizedHref(subItem.href, activeLocale);
                                const isActive = pathname === subItem.href || pathname === localizedSubItem;
                                const localizedSubItemLabel = getLocalizedLinkLabel(subItem.label);
                                return (
                                  <Link
                                    key={iIdx}
                                    href={localizedSubItem}
                                    onClick={handleLinkClick}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`px-3 py-2 rounded-fk-md text-[12px] font-bold text-center border ${
                                      isActive
                                        ? "bg-fk-primary text-white border-fk-primary"
                                        : "bg-fk-surface-muted text-fk-text border-fk-border"
                                    }`}
                                  >
                                    {"\u2066"}{localizedSubItemLabel}{"\u2069"}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
