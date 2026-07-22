import { PdfToImageOutputFormat } from "@/utils/pdf-to-image/types";

export type PdfToImageRouteMode = "GENERAL" | "FIXED_PAIR";

export interface PdfToImageRouteConfig {
  slug: string;
  mode: PdfToImageRouteMode;
  fixedOutputFormat?: PdfToImageOutputFormat;
  navigationLabel: string;
  h1: string;
  supportingCopy: string;
  analyticsOperation: string;
  jsonLdTitle: string;
  metaTitle: string;
  metaDescription: string;
}

export const PDF_TO_IMAGE_ROUTES: Record<string, PdfToImageRouteConfig> = {
  "/pdf-to-image": {
    slug: "/pdf-to-image",
    mode: "GENERAL",
    navigationLabel: "PDF to Image",
    h1: "Convert PDF to Images",
    supportingCopy: "Convert selected PDF pages to JPG or PNG format locally in your browser memory.",
    analyticsOperation: "pdf_to_image",
    jsonLdTitle: "FileKit Convert PDF to Images",
    metaTitle: "Convert PDF to Images Online — Free Local PDF Converter | FileKit",
    metaDescription: "Convert PDF pages to high-quality JPG or PNG images locally inside your browser."
  },
  "/pdf-to-jpg": {
    slug: "/pdf-to-jpg",
    mode: "FIXED_PAIR",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "PDF to JPG",
    h1: "Convert PDF to JPG",
    supportingCopy: "Convert PDF pages to JPG format locally in your browser memory for easy sharing.",
    analyticsOperation: "pdf_to_jpg",
    jsonLdTitle: "FileKit Convert PDF to JPG",
    metaTitle: "Convert PDF to JPG Online — Free Local PDF Converter | FileKit",
    metaDescription: "Convert PDF documents to JPG images locally inside your browser memory."
  },
  "/pdf-to-png": {
    slug: "/pdf-to-png",
    mode: "FIXED_PAIR",
    fixedOutputFormat: "image/png",
    navigationLabel: "PDF to PNG",
    h1: "Convert PDF to PNG",
    supportingCopy: "Convert PDF pages to crisp PNG format locally in your browser memory.",
    analyticsOperation: "pdf_to_png",
    jsonLdTitle: "FileKit Convert PDF to PNG",
    metaTitle: "Convert PDF to PNG Online — Free Local PDF Converter | FileKit",
    metaDescription: "Convert PDF documents to PNG images with sharp text and graphics locally."
  }
};
