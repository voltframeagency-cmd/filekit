import { permanentRedirect } from "next/navigation";

export default function PdfToJpegRedirectPage() {
  permanentRedirect("/pdf-to-jpg");
}
