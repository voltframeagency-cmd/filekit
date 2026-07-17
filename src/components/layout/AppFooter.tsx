"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import Link from "next/link";

export default function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-8 mt-auto border-t border-fk-border bg-fk-bg">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-4">
        <p className="text-[13px] font-medium text-fk-text-muted">
          {t("homepage.footerNote")}
        </p>
        <div className="flex items-center gap-4 text-[12px] text-fk-text-subtle">
          <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
            Privacy
          </Link>
          <span>·</span>
          <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
            Pricing
          </Link>
          <span>·</span>
          <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
            Terms
          </Link>
          <span>·</span>
          <Link href="#" className="hover:text-fk-primary transition-colors duration-150">
            Languages
          </Link>
        </div>
      </div>
    </footer>
  );
}
