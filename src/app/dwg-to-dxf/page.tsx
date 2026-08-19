"use client";

import React from "react";
import { CadWorkspace } from "@/utils/cad/CadWorkspace";

export default function DwgToDxfPage() {
  return (
    <CadWorkspace
      toolSlug="/dwg-to-dxf"
      toolTitle="Convert DWG to DXF Online Free"
      description="Convert proprietary AutoCAD DWG drawings into open CAD standard DXF format online."
      sourceFormat="DWG"
      targetFormat="DXF"
    />
  );
}
