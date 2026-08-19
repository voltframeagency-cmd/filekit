"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function AiToPdfPage() {
  return (
    <CadWorkspace
      toolSlug="/ai-to-pdf"
      toolTitle="Convert Adobe Illustrator (AI) to PDF Online Free"
      description="Convert Adobe Illustrator AI vector documents into high-resolution, universal PDF vector files online."
      sourceFormat="AI"
      targetFormat="PDF"
    />
  );
}
