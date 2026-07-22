export interface ImageToPdfRouteConfig {
  slug: string;
  mode: "GENERAL" | "FIXED_INPUT";
  allowedMime?: "image/jpeg" | "image/png";
  h1: string;
  title: string;
  metaDescription: string;
  acceptedFileTypesText: string;
  routeDescription: string;
  useCases: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const IMAGE_TO_PDF_ROUTES: Record<string, ImageToPdfRouteConfig> = {
  "/image-to-pdf": {
    slug: "/image-to-pdf",
    mode: "GENERAL",
    h1: "Convert Images to PDF",
    title: "Convert Images to PDF Online - Free & Private | FileKit",
    metaDescription: "Convert JPG and PNG images to a high-quality PDF document instantly in your browser. Reorder pages, customize margins, page sizes, and orientation 100% locally.",
    acceptedFileTypesText: "Supports JPG & PNG images",
    routeDescription: "Combine multiple JPG and PNG images into a clean, professional multi-page PDF document without uploading files to remote servers.",
    useCases: [
      "Merge multiple receipts or invoices into one PDF report",
      "Convert scanned photo documents into a single PDF file",
      "Prepare image portfolios for email distribution",
      "Combine screenshots into a presentation document"
    ],
    faqs: [
      {
        question: "Are my images uploaded to any server?",
        answer: "No. FileKit converts images to PDF 100% locally inside your web browser using client-side JavaScript."
      },
      {
        question: "Can I reorder images before creating the PDF?",
        answer: "Yes. You can move images up, down, rotate them, or remove individual items before building the PDF."
      },
      {
        question: "Does FileKit perform OCR or text extraction?",
        answer: "No. FileKit places your original images on PDF pages while preserving full image clarity."
      }
    ]
  },
  "/jpg-to-pdf": {
    slug: "/jpg-to-pdf",
    mode: "FIXED_INPUT",
    allowedMime: "image/jpeg",
    h1: "Convert JPG to PDF",
    title: "Convert JPG to PDF Online - Free & Private | FileKit",
    metaDescription: "Convert JPEG photos and documents into a clean PDF file locally in your browser. Fast, private, and customizable page layouts.",
    acceptedFileTypesText: "Supports JPG & JPEG images only",
    routeDescription: "Convert single or multiple JPEG images into a formatted PDF document with customizable page sizes and margins.",
    useCases: [
      "Convert JPEG photo scans into PDF documents",
      "Combine JPEG camera photos into a photo book",
      "Package JPEG design drafts for clients"
    ],
    faqs: [
      {
        question: "Is JPEG quality preserved during PDF creation?",
        answer: "Yes. FileKit embeds the original JPEG byte streams directly into the PDF without lossy re-encoding."
      },
      {
        question: "Can I convert multiple JPG files at once?",
        answer: "Yes. You can select multiple JPG images and combine them into a single multi-page PDF."
      }
    ]
  },
  "/png-to-pdf": {
    slug: "/png-to-pdf",
    mode: "FIXED_INPUT",
    allowedMime: "image/png",
    h1: "Convert PNG to PDF",
    title: "Convert PNG to PDF Online - Free & Private | FileKit",
    metaDescription: "Convert PNG graphics and screenshots to PDF online. Preserves image clarity, white background, and customizable document margins.",
    acceptedFileTypesText: "Supports PNG images only",
    routeDescription: "Convert PNG images and transparent graphics into a formatted PDF document with clean page backgrounds.",
    useCases: [
      "Convert high-resolution PNG graphics into print-ready PDF pages",
      "Bundle desktop and mobile screenshots into a PDF report",
      "Save PNG diagrams as clean PDF documents"
    ],
    faqs: [
      {
        question: "How are transparent PNG images handled?",
        answer: "Transparent PNGs are rendered against a clean white PDF page background."
      },
      {
        question: "Is my PNG data kept private?",
        answer: "Yes. All processing occurs locally in browser memory without sending data over the network."
      }
    ]
  }
};
