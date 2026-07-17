"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
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

  const languages = [
    { code: "en", label: t("lang.en") },
    { code: "ar", label: t("lang.ar") },
    { code: "tr", label: t("lang.tr") },
  ] as const;

  const currentLabel = languages.find((l) => l.code === language)?.label || "English";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-semibold text-fk-text hover:text-fk-primary transition-colors duration-150 rounded-fk-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Globe icon */}
        <svg
          className="w-4 h-4 text-fk-text-muted group-hover:text-fk-primary shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4-9m0 0a9.003 9.003 0 018.716 6.747M12 3a9.003 9.003 0 00-8.716 6.747M3 12h18"
          />
        </svg>
        <span>{currentLabel}</span>
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
          className="absolute right-0 ltr:right-0 rtl:left-0 mt-1 w-32 origin-top-right rounded-fk-md bg-white border border-fk-border shadow-md focus:outline-none z-50 animate-in fade-in slide-in-from-top-1 duration-100"
          role="listbox"
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left ltr:text-left rtl:text-right px-4 py-2 text-[13px] hover:bg-fk-surface-muted transition-colors duration-150 ${
                  language === lang.code ? "text-fk-primary font-bold" : "text-fk-text"
                }`}
                role="option"
                aria-selected={language === lang.code}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
