import { permanentRedirect } from "next/navigation";

export default function DocxToPdfRedirectPage() {
  permanentRedirect("/word-to-pdf");
}
