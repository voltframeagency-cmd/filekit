"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ToolHero from "@/components/layout/ToolHero";
import ToolGrid from "@/components/layout/ToolGrid";
import TrustPanel from "@/components/layout/TrustPanel";
import UploadDropzone from "@/components/upload/UploadDropzone";
import { fileManager } from "@/utils/fileManager";

export default function Home() {
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    // If it's a PDF, redirect to compress tool and pre-load file
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      fileManager.setActiveFile(file);
      router.push("/compress-pdf");
    } else {
      // Standard fallback / alert if not PDF (can expand later for other tools)
      alert("Please upload a PDF file for this workflow demo.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      {/* Header */}
      <AppHeader />

      {/* Main Container */}
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
              <UploadDropzone isGeneric={true} onFileSelect={handleFileSelect} />
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

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
