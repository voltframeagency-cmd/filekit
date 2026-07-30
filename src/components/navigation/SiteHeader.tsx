"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, TopNavItem } from "@/config/navigation";
import DesktopMegaMenu from "./DesktopMegaMenu";
import MobileNavigation from "./MobileNavigation";
import { useLanguage } from "@/components/layout/LanguageContext";
import FileKitLogo from "../common/FileKitLogo";

const LANGUAGES = [
  { code: "en", label: "English", codeBadge: "EN" },
  { code: "ar", label: "العربية", codeBadge: "AR" },
  { code: "tr", label: "Türkçe", codeBadge: "TR" }
] as const;

// Tool search database for live header auto-complete
const ALL_SEARCHABLE_TOOLS = [
  { name: "Merge PDF Files", route: "/merge-pdf", tag: "PDF", desc: "Combine multiple PDF documents into one" },
  { name: "Split PDF Document", route: "/split-pdf", tag: "PDF", desc: "Extract pages or split PDF into separate files" },
  { name: "Rotate PDF Pages", route: "/rotate-pdf-pages", tag: "PDF", desc: "Rotate upside down PDF pages" },
  { name: "Delete PDF Pages", route: "/delete-pdf-pages", tag: "PDF", desc: "Remove unwanted pages from PDF" },
  { name: "Extract PDF Pages", route: "/extract-pdf-pages", tag: "PDF", desc: "Extract specific PDF pages into new file" },
  { name: "Reorder PDF Pages", route: "/reorder-pdf-pages", tag: "PDF", desc: "Drag and drop to rearrange PDF page order" },
  { name: "Watermark PDF", route: "/watermark-pdf", tag: "PDF", desc: "Add text or logo watermark overlay" },
  { name: "Compress PDF", route: "/compress-pdf", tag: "PDF", desc: "Reduce PDF file size in browser" },
  { name: "Compress PDF to 2 MB", route: "/compress-pdf-to-2mb", tag: "PDF", desc: "Shrink PDF below 2 MB target size" },
  { name: "Compress PDF to Custom Size", route: "/compress-pdf-to-size", tag: "PDF", desc: "Compress PDF to exact target size" },
  { name: "PNG to JPG", route: "/png-to-jpg", tag: "CONVERT", desc: "Convert PNG images to JPG photo format" },
  { name: "JPG to PNG", route: "/jpg-to-png", tag: "CONVERT", desc: "Convert JPG to transparent PNG format" },
  { name: "PNG to WebP", route: "/png-to-webp", tag: "CONVERT", desc: "Convert PNG to modern lightweight WebP" },
  { name: "JPG to WebP", route: "/jpg-to-webp", tag: "CONVERT", desc: "Convert JPG to modern lightweight WebP" },
  { name: "WebP to PNG", route: "/webp-to-png", tag: "CONVERT", desc: "Convert WebP back to standard PNG" },
  { name: "WebP to JPG", route: "/webp-to-jpg", tag: "CONVERT", desc: "Convert WebP images to JPG photo format" },
  { name: "PDF to JPG", route: "/pdf-to-jpg", tag: "CONVERT", desc: "Render PDF pages into high-res JPG photos" },
  { name: "PDF to PNG", route: "/pdf-to-png", tag: "CONVERT", desc: "Render PDF pages into crisp PNG graphics" },
  { name: "PDF to Image", route: "/pdf-to-image", tag: "CONVERT", desc: "Extract PDF pages into JPG or PNG images" },
  { name: "Image to PDF", route: "/image-to-pdf", tag: "CONVERT", desc: "Convert JPG, PNG, or WebP images to PDF" },
  { name: "JPG to PDF", route: "/jpg-to-pdf", tag: "CONVERT", desc: "Convert JPG photos into PDF document" },
  { name: "PNG to PDF", route: "/png-to-pdf", tag: "CONVERT", desc: "Convert PNG graphics into PDF document" },
  { name: "Universal Image Converter", route: "/convert-image", tag: "CONVERT", desc: "Convert between JPG, PNG, and WebP" },
  { name: "Compress Image", route: "/compress-image", tag: "COMPRESS", desc: "Reduce photo file sizes up to 80%" },
  { name: "Compress Image to 100 KB", route: "/compress-image-to-100kb", tag: "COMPRESS", desc: "Compress image below 100 KB" },
  { name: "Compress Image to 200 KB", route: "/compress-image-to-200kb", tag: "COMPRESS", desc: "Compress image below 200 KB" },
  { name: "Compress Image to 500 KB", route: "/compress-image-to-500kb", tag: "COMPRESS", desc: "Compress image below 500 KB" },
  { name: "Compress Image to 1 MB", route: "/compress-image-to-1mb", tag: "COMPRESS", desc: "Compress photo below 1 MB" },
  { name: "Compress Image to Custom Size", route: "/compress-image-to-size", tag: "COMPRESS", desc: "Compress image to exact target KB or MB" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [initialFocus, setInitialFocus] = useState<"FIRST" | "LAST" | undefined>(undefined);
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Live search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const filteredTools = searchQuery.trim()
    ? ALL_SEARCHABLE_TOOLS.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleToggleMenu = (id: string, focusDirection?: "FIRST" | "LAST") => {
    setIsLangOpen(false);
    setIsSearchOpen(false);
    if (activeMenuId === id && !focusDirection) {
      setActiveMenuId(null);
      setInitialFocus(undefined);
    } else {
      setActiveMenuId(id);
      setInitialFocus(focusDirection);
    }
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <FileKitLogo variant="horizontal" />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 relative">
          {MAIN_NAVIGATION.map((item: TopNavItem) => {
            const hasMega = Boolean(item.megaMenu);
            const isOpen = activeMenuId === item.id;

            if (!hasMega) {
              return (
                <Link
                  key={item.id}
                  href={item.href || "/"}
                  className="px-4 py-2 rounded-xl text-[14px] font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100/80 transition-colors"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  ref={(el) => { triggerRefs.current[item.id] = el; }}
                  onClick={() => handleToggleMenu(item.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`px-4 py-2 rounded-xl text-[14px] font-bold transition-all flex items-center gap-1.5 ${
                    isOpen ||
                    (item.id === "compress" && pathname.startsWith("/compress")) ||
                    (item.id === "convert" && pathname.startsWith("/convert")) ||
                    (item.id === "pdf-tools" && (pathname.includes("pdf") || pathname.startsWith("/merge") || pathname.startsWith("/split") || pathname.startsWith("/reorder") || pathname.startsWith("/rotate") || pathname.startsWith("/delete") || pathname.startsWith("/extract")))
                      ? "text-blue-600 bg-blue-50/90 font-bold border border-blue-100"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-100/80"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`}>
                    ▼
                  </span>
                </button>

                <DesktopMegaMenu
                  navItem={item}
                  isOpen={isOpen}
                  initialFocus={initialFocus}
                  onClose={() => {
                    setActiveMenuId(null);
                    setInitialFocus(undefined);
                  }}
                  triggerRef={{ current: triggerRefs.current[item.id] }}
                />
              </div>
            );
          })}
        </nav>

        {/* Right Controls: Live Search, Language, All Tools */}
        <div className="flex items-center gap-3">
          {/* Live Tool Search Component */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <input
              type="text"
              placeholder="Search tools (e.g. merge, png)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearchOpen(true);
              }}
              className="w-56 h-9 pl-9 pr-3 bg-slate-100/80 border border-slate-200 rounded-xl text-[12px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-sans"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Live Search Auto-Complete Dropdown */}
            {isSearchOpen && filteredTools.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Matching Tools</span>
                  <span>{filteredTools.length} found</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                  {filteredTools.map((t, idx) => (
                    <Link
                      key={idx}
                      href={t.route}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="px-3 py-2 rounded-xl text-left block hover:bg-blue-50/80 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600">{t.name}</span>
                        <span className="text-[9px] font-mono bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">{t.tag}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-1 block mt-0.5 font-normal">{t.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Language Dropdown with Vector Globe SVG Icon */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => {
                setActiveMenuId(null);
                setIsLangOpen(!isLangOpen);
              }}
              aria-expanded={isLangOpen}
              aria-haspopup="true"
              className="text-[12px] font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-xl flex items-center gap-2 bg-white transition-all shadow-sm hover:border-slate-300"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
              </svg>
              <span>{language.toUpperCase()}</span>
              <span className={`text-[9px] transition-transform duration-150 ${isLangOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`}>▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in duration-100">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left ltr:text-left rtl:text-right px-3 py-2 text-[13px] font-bold flex items-center justify-between transition-colors hover:bg-slate-50 ${
                      language === lang.code ? "text-blue-600 bg-blue-50/70" : "text-slate-800"
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">{lang.codeBadge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* All Tools Button */}
          <Link
            href="/#all-tools"
            className="hidden md:inline-flex items-center px-4 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold shadow-sm transition-all hover:shadow-md"
          >
            All tools
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            ref={(el) => { triggerRefs.current["mobile-burger"] = el; }}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        triggerRef={{ current: triggerRefs.current["mobile-burger"] }}
      />
    </header>
  );
}
