"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { SUPPORTED_LOCALES, SupportedLocale, NON_DEFAULT_LOCALES } from "@/config/i18n/locales";
import { getLocalizedHref } from "@/utils/i18nHelper";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const localeEntries = Object.values(SUPPORTED_LOCALES);
  const currentConfig = SUPPORTED_LOCALES[language] || SUPPORTED_LOCALES["en"];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-fk-text hover:text-fk-primary transition-colors duration-150 rounded-fk-md border border-slate-200 hover:border-slate-300 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm">{currentConfig.flag || "🌐"}</span>
        <span className="truncate max-w-[90px]">{currentConfig.nativeName || currentConfig.name}</span>
        {/* Chevron icon */}
        <svg
          className={`w-3.5 h-3.5 text-fk-text-muted transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 ltr:right-0 rtl:left-0 mt-1 w-52 max-h-80 overflow-y-auto origin-top-right rounded-fk-lg bg-white border border-fk-border shadow-xl focus:outline-none z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-100"
          role="listbox"
        >
          <div className="py-1">
            {localeEntries.map((loc) => {
              const isSelected = language === loc.code;
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => {
                    const targetLocale = loc.code as SupportedLocale;
                    setLanguage(targetLocale);
                    setIsOpen(false);
                    if (pathname) {
                      const localizedTarget = getLocalizedHref(pathname, targetLocale);
                      if (localizedTarget !== pathname) {
                        router.push(localizedTarget);
                      }
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs hover:bg-blue-50/60 transition-colors duration-150 ${
                    isSelected ? "text-fk-primary font-bold bg-blue-50/40" : "text-slate-700"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{loc.flag}</span>
                    <span>{loc.nativeName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{loc.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
