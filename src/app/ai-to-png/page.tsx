"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function AiToPngPage() {
  return (
    <CadWorkspace
      toolSlug="/ai-to-png"
      toolTitle="Convert Adobe Illustrator (AI) to PNG Online Free"
      description="Render Adobe Illustrator AI vector artwork into high-resolution transparent PNG graphics online."
      sourceFormat="AI"
      targetFormat="PNG"
    />
  );
}
