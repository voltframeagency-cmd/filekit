"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function PsdToPngPage() {
  return (
    <CadWorkspace
      toolSlug="/psd-to-png"
      toolTitle="Convert PSD to PNG Online Free"
      description="Flatten and convert Adobe Photoshop (PSD) design files into crisp, transparent PNG images online."
      sourceFormat="PSD"
      targetFormat="PNG"
    />
  );
}
