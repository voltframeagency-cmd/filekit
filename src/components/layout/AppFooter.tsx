"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import Link from "next/link";

export default function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-8 mt-auto border-t border-blue-400/30 bg-[#0866d4]">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-4">
        <p className="text-[13px] font-medium text-blue-100">
          {t("homepage.footerNote")}
        </p>
        <div className="flex items-center gap-4 text-[12px] text-blue-200/80">
          <Link href="#" className="hover:text-white transition-colors duration-150">
            Privacy
          </Link>
          <span className="text-blue-300/50">·</span>
          <Link href="#" className="hover:text-white transition-colors duration-150">
            Pricing
          </Link>
          <span className="text-blue-300/50">·</span>
          <Link href="#" className="hover:text-white transition-colors duration-150">
            Terms
          </Link>
          <span className="text-blue-300/50">·</span>
          <Link href="#" className="hover:text-white transition-colors duration-150">
            Languages
          </Link>
        </div>
      </div>
    </footer>
  );
}
