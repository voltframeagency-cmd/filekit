import { permanentRedirect } from "next/navigation";

export default function PdfToPictureRedirectPage() {
  permanentRedirect("/pdf-to-image");
}
