"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";
import { useLanguage } from "../layout/LanguageContext";
import { isValidLocale, normalizeLocale, SupportedLocale } from "@/config/i18n/locales";
import { getLocalizedHref, VERB_DICTIONARY } from "@/utils/i18nHelper";
import FileKitLogo from "../common/FileKitLogo";
import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, NOUN_MAP, NAV_ACCESSIBILITY_LABELS } from "./megaMenuTranslations";

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
  const shortLocale = activeLocale.split("-")[0];
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
      aria-label={NAV_ACCESSIBILITY_LABELS.mobileMenu[activeLocale] || NAV_ACCESSIBILITY_LABELS.mobileMenu[shortLocale] || "Mobile Navigation Menu"}
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
          aria-label={NAV_ACCESSIBILITY_LABELS.closeMenu[activeLocale] || NAV_ACCESSIBILITY_LABELS.closeMenu[shortLocale] || "Close navigation menu"}
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

          // Localized category header labels
          const getCategoryHeader = (label: string): string => {
            const cleanKey = label.trim().toUpperCase();
            const shortLocale = activeLocale.split("-")[0];

            if (MEGA_MENU_CATEGORIES[cleanKey]) {
              const match = MEGA_MENU_CATEGORIES[cleanKey][activeLocale] || MEGA_MENU_CATEGORIES[cleanKey][shortLocale];
              if (match) return match;
            }

            if (cleanKey === "IMAGE") {
              if (item.id === "compress") {
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
          const getLocalizedLinkLabel = (label: string): string => {
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
