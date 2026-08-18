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

export const metadata: Metadata = {
  title: "FileKit — Convert, Compress & Edit Files Online",
  description: "Files on your terms. Convert, compress, resize, organize, and repair PDFs, images, Office files, archives, audio, and video with browser-first privacy.",
  alternates: {
    canonical: "https://filekit.co",
    languages: {
      "en": "https://filekit.co",
      "sv": "https://filekit.co/sv",
      "x-default": "https://filekit.co"
    }
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
