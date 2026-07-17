"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ToolHero from "@/components/layout/ToolHero";
import ToolGrid from "@/components/layout/ToolGrid";
import TrustPanel from "@/components/layout/TrustPanel";
import UploadDropzone from "@/components/upload/UploadDropzone";
import ActionChooser from "@/components/layout/ActionChooser";
import { fileManager } from "@/utils/fileManager";

export default function Home() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isChooserOpen, setIsChooserOpen] = useState(false);

  const handleFileSelect = (file: File) => {
    // Stage the file and prompt user for intent choice
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

      {/* Footer */}
      <AppFooter />

      {/* Action Chooser Modal for Universal Homepage Drop routing */}
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
