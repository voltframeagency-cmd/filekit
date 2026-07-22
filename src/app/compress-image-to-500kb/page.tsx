import ExactImageTargetPage from "@/components/image-tools/ExactImageTargetPage";
import { EXACT_IMAGE_ROUTES } from "@/config/exactImageRoutes";

export default function CompressImageTo500kbPage() {
  return <ExactImageTargetPage config={EXACT_IMAGE_ROUTES["500kb"]} />;
}
