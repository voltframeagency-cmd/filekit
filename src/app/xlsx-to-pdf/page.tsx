import { permanentRedirect } from "next/navigation";

export default function XlsxToPdfRedirectPage() {
  permanentRedirect("/excel-to-pdf");
}
