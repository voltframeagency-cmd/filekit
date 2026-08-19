"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ToolGrid from "@/components/layout/ToolGrid";
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
  }, [locale, setLanguage]);

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
        <section className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12">
          <div className="flex-1 flex flex-col justify-center text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              {ui.trust.badge4}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              {ui.homepage.heroTitle}
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8">
              {ui.homepage.heroSubtitle}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-fk-lg border border-slate-100 shadow-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-xs font-medium text-slate-700">{ui.trust.badge1}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-fk-lg border border-slate-100 shadow-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-xs font-medium text-slate-700">{ui.trust.badge3}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl flex flex-col justify-center">
            <div className="bg-white p-6 md:p-8 rounded-fk-2xl border border-slate-200/80 shadow-fk-card relative">
              <UploadDropzone
                onFileSelect={handleFileSelect}
                isGeneric={true}
              />
            </div>
          </div>
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {ui.homepage.popularTools}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {ui.trust.badge1}
              </p>
            </div>
          </div>
          <ToolGrid />
        </section>

        <section className="mt-8">
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
