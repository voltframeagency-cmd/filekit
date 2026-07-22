import React, { Suspense } from "react";
import CustomTargetPdfPage from "@/components/pdf-tools/CustomTargetPdfPage";

export default function CompressPdfToSizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-fk-bg" />}>
      <CustomTargetPdfPage />
    </Suspense>
  );
}
