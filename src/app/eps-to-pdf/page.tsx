"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function EpsToPdfPage() {
  return (
    <CadWorkspace
      toolSlug="/eps-to-pdf"
      toolTitle="Convert EPS to PDF Online Free"
      description="Convert Encapsulated PostScript (EPS) vector artwork into clean, scalable vector PDF files online."
      sourceFormat="EPS"
      targetFormat="PDF"
    />
  );
}
