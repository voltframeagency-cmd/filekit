"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ToolHero from "@/components/layout/ToolHero";
import ToolGrid from "@/components/layout/ToolGrid";
import TrustPanel from "@/components/layout/TrustPanel";
import UploadDropzone from "@/components/upload/UploadDropzone";
import ActionChooser from "@/components/layout/ActionChooser";
import { useLanguage } from "@/components/layout/LanguageContext";
import { fileManager } from "@/utils/fileManager";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export default function SwedishHomePage() {
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isChooserOpen, setIsChooserOpen] = useState(false);

  useEffect(() => {
    setLanguage("sv");
  }, [setLanguage]);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setIsChooserOpen(true);
  };

  const handleActionSelect = (actionId: string) => {
    if (actionId === "compress-pdf" && uploadedFile) {
      fileManager.setActiveFile(uploadedFile);
      router.push("/compress-pdf");
    }
    setIsChooserOpen(false);
    setUploadedFile(null);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FileKit – Konvertera, komprimera och redigera filer online",
    "url": buildCanonicalUrl("/sv"),
    "description": "Konvertera, komprimera, ändra storlek, ordna och reparera PDF-filer, bilder, Office-filer, arkiv, ljud och video. I webbläsaren när det går, med automatisk radering efter serverjobb.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "sv"
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg" lang="sv" dir="ltr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader />

      <main className="flex-1 flex flex-col gap-12 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-16">
        <section className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12">
          <div className="flex items-center w-full lg:w-1/2">
            <ToolHero />
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="bg-white border border-fk-border rounded-fk-xl shadow-sm p-6 md:p-8 w-full max-w-[560px]">
              <UploadDropzone isGeneric={true} onFileSelect={handleFileSelect} accept="*" />
            </div>
          </div>
        </section>

        <section className="w-full">
          <ToolGrid />
        </section>

        <section className="w-full">
          <TrustPanel />
        </section>
      </main>

      <AppFooter />

      <ActionChooser
        isOpen={isChooserOpen}
        file={uploadedFile}
        onClose={() => {
          setIsChooserOpen(false);
          setUploadedFile(null);
        }}
        onSelectAction={handleActionSelect}
      />
    </div>
  );
}
