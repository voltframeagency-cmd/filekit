"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { useRouter } from "next/navigation";

export default function ToolHero() {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tools list for search
  const tools = [
    { name: t("breadcrumb.compress"), desc: t("tool.compress.desc"), route: "/compress-pdf" },
    { name: t("tool.merge.title"), desc: t("tool.merge.desc"), route: "#" },
    { name: t("tool.resize.title"), desc: t("tool.resize.desc"), route: "#" },
    { name: t("tool.convert.title"), desc: t("tool.convert.desc"), route: "#" },
    { name: t("tool.pdfToWord.title"), desc: t("tool.pdfToWord.desc"), route: "#" },
  ];

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-[560px] w-full text-left ltr:text-left rtl:text-right">
      {/* Headings */}
      <h1 className="text-[44px] md:text-[54px] font-black leading-[1.1] tracking-tight text-fk-text font-sans">
        <span>{t("hero.title1")}</span>
        <br />
        <span className="text-fk-primary">{t("hero.title2")}</span>
      </h1>

      {/* Paragraph Description */}
      <p className="text-[16px] md:text-[18px] font-medium text-fk-text-muted leading-relaxed">
        {t("hero.subtitle1")}
        <br />
        {t("hero.subtitle2")}
      </p>

      {/* Main Large Search Box */}
      <div className="relative w-full max-w-[530px]">
        <div className="relative flex items-center bg-white border border-fk-border hover:border-fk-border-strong focus-within:border-fk-primary focus-within:ring-2 focus-within:ring-fk-primary focus-within:ring-offset-2 rounded-fk-lg shadow-sm transition-all duration-150 h-[56px] px-4">
          <svg
            className="w-5 h-5 text-fk-text-subtle shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={t("homepage.searchPlaceholder")}
            className="w-full bg-transparent border-none outline-none pl-3 pr-8 text-[15px] text-fk-text placeholder-fk-text-subtle"
          />
          {!query && (
            <div className="absolute right-4 flex items-center justify-center w-6 h-6 bg-fk-surface-muted border border-fk-border rounded-md pointer-events-none">
              <span className="text-[12px] font-bold text-fk-text-muted">/</span>
            </div>
          )}
        </div>

        {/* Dropdown Results */}
        {isFocused && query.length > 0 && (
          <div className="absolute left-0 mt-2 w-full bg-white border border-fk-border shadow-md rounded-fk-lg overflow-hidden z-20">
            {filteredTools.length > 0 ? (
              <div className="py-1">
                {filteredTools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery("");
                      if (tool.route !== "#") router.push(tool.route);
                    }}
                    className="w-full flex flex-col px-4 py-2.5 text-left hover:bg-fk-surface-muted transition-colors duration-150"
                  >
                    <span className="text-[14px] font-bold text-fk-text">{tool.name}</span>
                    <span className="text-[11px] text-fk-text-subtle">{tool.desc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-[13px] text-fk-text-muted">
                No tools found matching "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust Mini Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[530px] mt-2">
        {/* Private by Design */}
        <div className="flex items-center gap-3 p-3 bg-white border border-fk-border rounded-fk-lg shadow-sm hover:border-fk-border-strong transition-colors duration-150">
          <div className="p-2 rounded-lg bg-fk-surface-muted text-fk-text shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 0v1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-fk-text truncate">
              {t("homepage.privateTitle")}
            </span>
            <span className="text-[11px] text-fk-text-subtle truncate">
              {t("homepage.privateDesc")}
            </span>
          </div>
        </div>

        {/* Processed Locally */}
        <div className="flex items-center gap-3 p-3 bg-white border border-fk-border rounded-fk-lg shadow-sm hover:border-fk-border-strong transition-colors duration-150">
          <div className="p-2 rounded-lg bg-fk-surface-muted text-fk-text shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-fk-text truncate">
              {t("homepage.localTitle")}
            </span>
            <span className="text-[11px] text-fk-text-subtle truncate">
              {t("homepage.localDesc")}
            </span>
          </div>
        </div>

        {/* Secure Fallback */}
        <div className="flex items-center gap-3 p-3 bg-white border border-fk-border rounded-fk-lg shadow-sm hover:border-fk-border-strong transition-colors duration-150">
          <div className="p-2 rounded-lg bg-fk-surface-muted text-fk-text shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-fk-text truncate">
              {t("homepage.fallbackTitle")}
            </span>
            <span className="text-[11px] text-fk-text-subtle truncate">
              {t("homepage.fallbackDesc")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
