"use client";

import React, { useState, useEffect } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import TrustPanel from "@/components/layout/TrustPanel";
import UploadWorkspace from "@/components/upload/UploadWorkspace";
import { fileManager } from "@/utils/fileManager";
import { useLanguage } from "@/components/layout/LanguageContext";

import * as PDFLib from "pdf-lib";

export default function CompressPdfPage() {
  const { t } = useLanguage();
  const [initialFile, setInitialFile] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).PDFLib = PDFLib;
    }
    const file = fileManager.getActiveFile();
    if (file) {
      setInitialFile(file);
      // Consume the file reference so reload starts empty
      fileManager.clearActiveFile();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      {/* Header */}
      <AppHeader />

      {/* Main Container */}
      <main className="flex-1 flex flex-col gap-6 md:gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-6 md:py-12">
        
        {/* H1 Title & Intro */}
        <section className="flex flex-col gap-1.5 max-w-[840px] mx-auto w-full text-left ltr:text-left rtl:text-right px-2">
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-fk-text leading-[1.1] tracking-tight">
            {t("compress.title")}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-fk-text-muted leading-relaxed">
            {t("compress.subtitle")}
          </p>
        </section>

        {/* Workspace Card */}
        <section className="w-full">
          <UploadWorkspace initialFile={initialFile} />
        </section>

        {/* Trust Panel */}
        <section className="w-full mt-6">
          <TrustPanel />
        </section>

      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
