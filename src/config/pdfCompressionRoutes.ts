export type PdfCompressionMode = "GENERAL" | "CUSTOM_TARGET" | "FIXED_TARGET";

export interface PdfRouteConfig {
  slug: string;
  mode: PdfCompressionMode;
  targetBytes?: number;
  navigationLabel: string;
  accessibleNavLabel?: string;
  h1: string;
  supportingCopy: string;
  analyticsOperation: string;
  jsonLdTitle: string;
}

export const PDF_COMPRESSION_ROUTES: Record<string, PdfRouteConfig> = {
  "/compress-pdf": {
    slug: "/compress-pdf",
    mode: "GENERAL",
    navigationLabel: "PDF Compressor",
    accessibleNavLabel: "General PDF Compressor",
    h1: "PDF Compressor",
    supportingCopy: "Reduce PDF file size locally while preserving readable document quality.",
    analyticsOperation: "compress_pdf",
    jsonLdTitle: "FileKit PDF Compressor"
  },
  "/compress-pdf-to-size": {
    slug: "/compress-pdf-to-size",
    mode: "CUSTOM_TARGET",
    navigationLabel: "Compress to a Specific Size",
    accessibleNavLabel: "Compress PDF to a specific size",
    h1: "Compress a PDF to a Specific Size",
    supportingCopy: "Enter any target size between 100 KB and 50 MB. FileKit optimizes your PDF document locally inside your browser memory.",
    analyticsOperation: "compress_pdf_to_custom_size",
    jsonLdTitle: "FileKit Compress a PDF to a Specific Size"
  },
  "/compress-pdf-to-2mb": {
    slug: "/compress-pdf-to-2mb",
    mode: "FIXED_TARGET",
    targetBytes: 2097152, // 2 MB
    navigationLabel: "2 MB",
    accessibleNavLabel: "Compress PDF to 2 MB",
    h1: "Compress a PDF below 2 MB",
    supportingCopy: "Compress PDF files below 2 MB locally in your browser memory.",
    analyticsOperation: "compress_pdf_to_2mb",
    jsonLdTitle: "FileKit Compress PDF below 2 MB"
  }
};
