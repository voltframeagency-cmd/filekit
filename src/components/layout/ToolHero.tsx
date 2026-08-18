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
    <div className="flex flex-col gap-6 max-w-[560px] w-full text-left ltr:text-left rtl:text-right">
      {/* Brand Tagline Pill */}
      <div className="flex items-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[12px] font-bold uppercase tracking-wider text-blue-100 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {t("hero.tagline")}
        </span>
      </div>

      {/* Headings — White on #0977fd blue canvas */}
      <h1 className="text-[40px] md:text-[50px] font-black leading-[1.08] tracking-tight text-white font-sans drop-shadow-sm">
        <span>{t("hero.title1")}</span>{" "}
        <span className="text-blue-100">{t("hero.title2")}</span>
      </h1>

      {/* Paragraph Description — Soft white on blue */}
      <p className="text-[15px] md:text-[16px] font-medium text-blue-100 leading-relaxed">
        {t("hero.subtitle1")} {t("hero.subtitle2")}
      </p>

      {/* Main Large Search Box */}
      <div className="relative w-full max-w-[530px]">
        <div className="relative flex items-center bg-white border border-white/20 hover:border-white/40 focus-within:border-white focus-within:ring-2 focus-within:ring-white/30 focus-within:ring-offset-2 focus-within:ring-offset-[#0977fd] rounded-fk-lg shadow-lg transition-all duration-150 h-[56px] px-4">
          <svg
            className="w-5 h-5 text-slate-400 shrink-0"
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
            className="w-full bg-transparent border-none outline-none pl-3 pr-8 text-[15px] text-slate-900 placeholder-slate-400"
          />
          {!query && (
            <div className="absolute right-4 flex items-center justify-center w-6 h-6 bg-slate-100 border border-slate-200 rounded-md pointer-events-none">
              <span className="text-[12px] font-bold text-slate-500">/</span>
            </div>
          )}
        </div>

        {/* Dropdown Results */}
        {isFocused && query.length > 0 && (
          <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200 shadow-xl rounded-fk-lg overflow-hidden z-20">
            {filteredTools.length > 0 ? (
              <div className="py-1">
                {filteredTools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery("");
                      if (tool.route !== "#") router.push(tool.route);
                    }}
                    className="w-full flex flex-col px-4 py-2.5 text-left hover:bg-slate-50 transition-colors duration-150"
                  >
                    <span className="text-[14px] font-bold text-slate-900">{tool.name}</span>
                    <span className="text-[11px] text-slate-500">{tool.desc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-[13px] text-slate-500">
                No tools found matching &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust Mini Badges Grid — White cards on blue canvas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full max-w-[530px] mt-1">
        {/* 1. Browser-first processing */}
        <div className="flex items-center gap-2.5 p-2.5 bg-white/95 backdrop-blur-sm border border-white/30 rounded-fk-lg shadow-sm hover:shadow transition-all duration-150">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <span className="text-[12px] font-bold text-slate-800 leading-tight">
            {t("trust.badge1")}
          </span>
        </div>

        {/* 2. Automatic deletion */}
        <div className="flex items-center gap-2.5 p-2.5 bg-white/95 backdrop-blur-sm border border-white/30 rounded-fk-lg shadow-sm hover:shadow transition-all duration-150">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <span className="text-[12px] font-bold text-slate-800 leading-tight">
            {t("trust.badge2")}
          </span>
        </div>

        {/* 3. No account for basic tools */}
        <div className="flex items-center gap-2.5 p-2.5 bg-white/95 backdrop-blur-sm border border-white/30 rounded-fk-lg shadow-sm hover:shadow transition-all duration-150">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <span className="text-[12px] font-bold text-slate-800 leading-tight">
            {t("trust.badge3")}
          </span>
        </div>

        {/* 4. Verified results */}
        <div className="flex items-center gap-2.5 p-2.5 bg-white/95 backdrop-blur-sm border border-white/30 rounded-fk-lg shadow-sm hover:shadow transition-all duration-150">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <span className="text-[12px] font-bold text-slate-800 leading-tight">
            {t("trust.badge4")}
          </span>
        </div>
      </div>
    </div>
  );
}
