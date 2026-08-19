"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function EpsToPngPage() {
  return (
    <CadWorkspace
      toolSlug="/eps-to-png"
      toolTitle="Convert EPS to PNG Online Free"
      description="Render Encapsulated PostScript (EPS) vector artwork into high-resolution transparent PNG images online."
      sourceFormat="EPS"
      targetFormat="PNG"
    />
  );
}
