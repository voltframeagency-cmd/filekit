"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function DxfToPdfPage() {
  return (
    <CadWorkspace
      toolSlug="/dxf-to-pdf"
      toolTitle="Convert DXF to PDF Online Free"
      description="Convert AutoCAD Drawing Exchange Format (DXF) vector files into high-quality PDF documents online."
      sourceFormat="DXF"
      targetFormat="PDF"
    />
  );
}
