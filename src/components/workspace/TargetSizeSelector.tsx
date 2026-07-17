"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../layout/LanguageContext";

export default function TargetSizeSelector() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Under 2 MB (Recommended)");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const options = [
    "Under 2 MB (Recommended)",
    "Under 5 MB",
    "Under 10 MB",
    "Lossless compression (Fast)",
  ];

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-4 text-left ltr:text-left rtl:text-right" ref={dropdownRef}>
      <label className="text-[13px] font-bold text-fk-text md:w-32 shrink-0">
        {t("workspace.targetSize")}
      </label>

      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-[54px] bg-white border border-fk-border hover:border-fk-border-strong rounded-fk-md px-4 flex items-center justify-between text-[14px] font-bold text-fk-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary transition-all duration-150"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{selectedOption === "Under 2 MB (Recommended)" ? t("workspace.recommended") : selectedOption}</span>
          <svg
            className={`w-4 h-4 text-fk-text-muted transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute left-0 mt-1 w-full bg-white border border-fk-border shadow-md rounded-fk-md overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-100"
            role="listbox"
          >
            <div className="py-1">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedOption(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left ltr:text-left rtl:text-right px-4 py-3 text-[14px] hover:bg-fk-surface-muted transition-colors duration-150 ${
                    selectedOption === opt ? "text-fk-primary font-bold bg-fk-server-bg/25" : "text-fk-text"
                  }`}
                  role="option"
                  aria-selected={selectedOption === opt}
                >
                  {opt === "Under 2 MB (Recommended)" ? t("workspace.recommended") : opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
