"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, TopNavItem } from "@/config/navigation";
import DesktopMegaMenu from "./DesktopMegaMenu";
import MobileNavigation from "./MobileNavigation";
import { useLanguage } from "@/components/layout/LanguageContext";

import FileKitLogo from "../common/FileKitLogo";

export default function SiteHeader() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const trackNavEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const safePayload = {
      timestamp: Date.now(),
      sourceRoute: pathname,
      ...payload
    };
    delete (safePayload as any).filename;
    delete (safePayload as any).imageData;

    if ((window as any).__FILEKIT_ANALYTICS__) {
      (window as any).__FILEKIT_ANALYTICS__.push({ event: eventName, ...safePayload });
    }
  };

  const handleToggleMenu = (id: string) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
      trackNavEvent("navigation_menu_opened", { menuCategory: id });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-fk-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <FileKitLogo variant="horizontal" />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 relative">
          {MAIN_NAVIGATION.map((item: TopNavItem) => {
            const hasMega = Boolean(item.megaMenu);
            const isOpen = activeMenuId === item.id;

            if (!hasMega) {
              return (
                <Link
                  key={item.id}
                  href={item.href || "/"}
                  className="px-3.5 py-2 rounded-fk-md text-[14px] font-bold text-fk-text-muted hover:text-fk-text hover:bg-fk-surface-muted transition-colors"
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
                  aria-controls={item.megaMenu?.id}
                  aria-haspopup="true"
                  className={`px-3.5 py-2 rounded-fk-md text-[14px] font-bold transition-colors flex items-center gap-1.5 ${
                    isOpen || pathname.startsWith("/compress")
                      ? "text-fk-primary bg-fk-surface-muted"
                      : "text-fk-text-muted hover:text-fk-text hover:bg-fk-surface-muted"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                <DesktopMegaMenu
                  navItem={item}
                  isOpen={isOpen}
                  onClose={() => setActiveMenuId(null)}
                  triggerRef={{ current: triggerRefs.current[item.id] }}
                />
              </div>
            );
          })}
        </nav>

        {/* Right Controls: Search, Language, All Tools */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-48 h-9 pl-8 pr-3 bg-fk-surface-muted border border-fk-border rounded-fk-md text-[12px] text-fk-text focus:outline-none focus:border-fk-primary"
            />
            <svg className="w-3.5 h-3.5 text-fk-text-subtle absolute left-2.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-[12px] font-bold text-fk-text-muted hover:text-fk-text px-2 py-1 border border-fk-border rounded-fk-md"
          >
            🌐 {language.toUpperCase()}
          </button>

          <Link
            href="/#all-tools"
            className="hidden md:inline-flex items-center px-4 h-9 bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[13px] font-bold shadow-sm transition-colors"
          >
            All tools
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            ref={(el) => { triggerRefs.current["mobile-burger"] = el; }}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-fk-text hover:bg-fk-surface-muted rounded-fk-md"
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
