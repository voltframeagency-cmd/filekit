import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/layout/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ALL_LOCALES } from "@/config/i18n/locales";

const languageAlternates: Record<string, string> = {
  "x-default": "https://filekit.co",
  "en": "https://filekit.co",
};

ALL_LOCALES.forEach((loc) => {
  if (loc !== "en") {
    languageAlternates[loc] = `https://filekit.co/${loc}`;
  }
});

export const metadata: Metadata = {
  title: "FileKit — Convert, Compress & Edit Files Online",
  description: "Files on your terms. Convert, compress, resize, organize, and repair PDFs, images, Office files, archives, audio, and video with browser-first privacy.",
  alternates: {
    canonical: "https://filekit.co",
    languages: languageAlternates
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-fk-bg text-fk-text">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
