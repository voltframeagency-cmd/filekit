import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";
import { Suspense } from "react";
import CustomTargetImagePage from "@/components/image-tools/CustomTargetImagePage";

export default function CompressImageToSizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-fk-bg p-12 text-center text-fk-text font-bold">Loading Custom Target Tool...  <ToolContentRenderer operationId="compress-image-to-size" />
    </div>}>
      <CustomTargetImagePage />
    </Suspense>
  );
}
