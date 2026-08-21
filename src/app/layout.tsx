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
  metadataBase: new URL("https://filekit.co"),
  title: {
    default: "FileKit — Convert, Compress & Edit Files Online Free",
    template: "%s – FileKit",
  },
  description: "Files on your terms. Convert, compress, resize, organize, and repair PDFs, images, Office files, archives, audio, and video with browser-first privacy.",
  alternates: {
    canonical: "https://filekit.co",
    languages: languageAlternates
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://filekit.co",
    siteName: "FileKit",
    title: "FileKit — 100% Private In-Browser File Tools",
    description: "Convert, compress, and edit PDFs, images, CAD drawings, video, and audio directly in your browser with zero data retention.",
    images: [
      {
        url: "/brand-assets/hero/client-side-privacy-hero.png",
        width: 1200,
        height: 630,
        alt: "FileKit – 100% Private In-Browser File Converter & Utility Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FileKit — 100% Private In-Browser File Tools",
    description: "Convert, compress, and edit PDFs, images, CAD drawings, video, and audio directly in your browser with zero data retention.",
    images: ["/brand-assets/hero/client-side-privacy-hero.png"],
    creator: "@filekit_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
