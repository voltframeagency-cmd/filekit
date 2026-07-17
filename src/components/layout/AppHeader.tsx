"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import FileKitLogo from "../common/FileKitLogo";
import LanguageSelector from "./LanguageSelector";
import ToolSearch from "./ToolSearch";

export default function AppHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 w-full h-[72px] bg-white border-b border-fk-border z-40 px-6 md:px-12">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2 rounded-fk-md">
            <FileKitLogo variant="horizontal" />
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-fk-text-muted">
            <Link href="/" className="hover:text-fk-primary transition-colors duration-150">
              {t("nav.allTools")}
            </Link>
            <Link href="/compress-pdf" className="hover:text-fk-primary transition-colors duration-150">
              {t("nav.compress")}
            </Link>
            <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
              {t("nav.convert")}
            </Link>
            <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
              {t("nav.merge")}
            </Link>
            <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
              {t("nav.image")}
            </Link>
            <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
              {t("nav.organize")}
            </Link>
          </nav>
        </div>

        {/* Right Section: Search, Lang, CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ToolSearch />
          </div>
          <LanguageSelector />
          <Link
            href="/"
            className="hidden md:flex h-[38px] items-center justify-center px-5 border border-fk-primary rounded-fk-md text-[13px] font-bold text-fk-primary hover:bg-fk-primary hover:text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2"
          >
            {t("nav.allToolsBtn")}
          </Link>
        </div>
      </div>
    </header>
  );
}
