"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function DwgToPdfPage() {
  return (
    <CadWorkspace
      toolSlug="/dwg-to-pdf"
      toolTitle="Convert AutoCAD DWG to PDF Online Free"
      description="Convert AutoCAD DWG engineering drawings into universal high-resolution vector PDF blueprints online."
      sourceFormat="DWG"
      targetFormat="PDF"
    />
  );
}
