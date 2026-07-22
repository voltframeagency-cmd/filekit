import ExactImageTargetPage from "@/components/image-tools/ExactImageTargetPage";
import { EXACT_IMAGE_ROUTES } from "@/config/exactImageRoutes";

export default function CompressImageTo1mbPage() {
  return <ExactImageTargetPage config={EXACT_IMAGE_ROUTES["1mb"]} />;
}
