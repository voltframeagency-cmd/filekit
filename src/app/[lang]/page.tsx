"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ToolGrid from "@/components/layout/ToolGrid";
import ToolHero from "@/components/layout/ToolHero";
import TrustPanel from "@/components/layout/TrustPanel";
import UploadDropzone from "@/components/upload/UploadDropzone";
import ActionChooser from "@/components/layout/ActionChooser";
import { useLanguage } from "@/components/layout/LanguageContext";
import { SupportedLocale, NON_DEFAULT_LOCALES, getLocaleDirection } from "@/config/i18n/locales";
import { UI_TRANSLATIONS } from "@/config/i18n/translations";
import { buildCanonicalUrl } from "@/utils/siteUrl";
import { fileManager } from "@/utils/fileManager";

export default function LocalizedHomePage() {
  const params = useParams();
  const router = useRouter();
  const rawLang = (params?.lang as string) || "en";
  const locale = (NON_DEFAULT_LOCALES.includes(rawLang as SupportedLocale) ? rawLang : "en") as SupportedLocale;
  const direction = getLocaleDirection(locale);

  const { setLanguage } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isChooserOpen, setIsChooserOpen] = useState(false);

  const ui = UI_TRANSLATIONS[locale] || UI_TRANSLATIONS.en;

  useEffect(() => {
    setLanguage(locale);
    if (typeof document !== "undefined") {
      document.title = `${ui.homepage.heroTitle} | FileKit`;
    }
  }, [locale, setLanguage, ui.homepage.heroTitle]);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setIsChooserOpen(true);
  };

  const handleActionSelect = (actionId: string) => {
    if (uploadedFile) {
      fileManager.setActiveFile(uploadedFile);
      router.push(`/${locale}/${actionId}`);
    }
    setIsChooserOpen(false);
    setUploadedFile(null);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `FileKit – ${ui.homepage.heroTitle}`,
    "url": buildCanonicalUrl(`/${locale}`),
    "description": ui.homepage.heroSubtitle,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": locale
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg" lang={locale} dir={direction}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader />

      <main className="flex-1 flex flex-col gap-12 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-16">
        {/* Top Fold: Hero & Upload Area */}
        <section className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12">
          {/* Left Column: Copywriting & Banners */}
          <div className="flex items-center w-full lg:w-1/2">
            <ToolHero />
          </div>

          {/* Right Column: Generic Upload Dropzone Card */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="bg-white border border-fk-border rounded-fk-xl shadow-sm p-6 md:p-8 w-full max-w-[560px]">
              <UploadDropzone isGeneric={true} onFileSelect={handleFileSelect} accept="*" />
            </div>
          </div>
        </section>

        {/* Middle Fold: Popular Tools Grid */}
        <section className="w-full">
          <ToolGrid />
        </section>

        {/* Bottom Fold: Trust Panel */}
        <section className="w-full">
          <TrustPanel />
        </section>
      </main>

      <ActionChooser
        isOpen={isChooserOpen}
        onClose={() => {
          setIsChooserOpen(false);
          setUploadedFile(null);
        }}
        file={uploadedFile}
        onSelectAction={handleActionSelect}
      />

      <AppFooter />
    </div>
  );
}
