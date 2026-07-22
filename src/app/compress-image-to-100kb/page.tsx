import ExactImageTargetPage from "@/components/image-tools/ExactImageTargetPage";
import { EXACT_IMAGE_ROUTES } from "@/config/exactImageRoutes";

export default function CompressImageTo100kbPage() {
  return <ExactImageTargetPage config={EXACT_IMAGE_ROUTES["100kb"]} />;
}
