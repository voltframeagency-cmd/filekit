export type ConversionRouteStatus =
  | "PLANNED"
  | "ENGINE_DEVELOPMENT"
  | "FUNCTIONAL"
  | "ARTIFACT_VERIFIED"
  | "PRODUCTION_FROZEN"
  | "RETIRED";

export type IndexabilityStatus =
  | "NOT_PUBLIC"
  | "NOINDEX"
  | "INDEXABLE"
  | "REDIRECT_ALIAS";

export interface RouteReleaseEvidence {
  routeExists: boolean;
  workspaceImplemented: boolean;
  engineImplemented: boolean;
  processingConnected: boolean;
  outputVerified: boolean;
  downloadVerified: boolean;
  browserE2ePassed: boolean;
  securityPolicyImplemented: boolean;
  failureBehaviorVerified: boolean;
  productionBuildPassed: boolean;
}

export interface ConversionCatalogEntry {
  slug: string;
  aliases?: string[];
  inputFormat: string;
  outputFormat: string;
  family: "image-conversion" | "pdf-to-image" | "image-to-pdf" | "office-to-pdf" | "pdf-to-office" | "lightweight-data" | "ebook" | "archive" | "media" | "cad" | "pdf-overlay" | "pdf-geometry" | "ocr-engine";
  engineId: string;
  processingMode: "local" | "server" | "hybrid";
  implementationStatus: ConversionRouteStatus;
  indexabilityStatus: IndexabilityStatus;
  canonicalSlug?: string;
  navigationEnabled: boolean;
  sitemapEnabled: boolean;
  localizationEnabled: boolean;
  uniqueOutcomeDefinition?: string;
  limitations?: string[];
  relatedRoutes?: string[];
  releaseEvidence?: Partial<RouteReleaseEvidence>;
}

export const CONVERSION_CATALOG: Record<string, ConversionCatalogEntry> = {
  // =========================================================================
  // 1. PROVEN FUNCTIONAL & INDEXABLE ROUTES (29 OPERATIONAL ROUTES)
  // =========================================================================
  "/convert-image": {
    slug: "/convert-image",
    inputFormat: "Image (JPG/PNG/WebP)",
    outputFormat: "Image (JPG/PNG/WebP)",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "General multi-format image converter supporting JPEG, PNG, and WebP client-side transformations."
  },
  "/jpg-to-png": {
    slug: "/jpg-to-png",
    inputFormat: "JPG",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts JPEG images to lossless PNG format with transparency support."
  },
  "/png-to-jpg": {
    slug: "/png-to-jpg",
    inputFormat: "PNG",
    outputFormat: "JPG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts PNG graphics to compressed JPEG format with background color filling."
  },
  "/jpg-to-webp": {
    slug: "/jpg-to-webp",
    inputFormat: "JPG",
    outputFormat: "WebP",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts JPEG photos to web-optimized WebP format with quality adjustment."
  },
  "/png-to-webp": {
    slug: "/png-to-webp",
    inputFormat: "PNG",
    outputFormat: "WebP",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts PNG graphics to modern WebP format preserving alpha transparency."
  },
  "/webp-to-jpg": {
    slug: "/webp-to-jpg",
    inputFormat: "WebP",
    outputFormat: "JPG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts WebP images to universal JPEG format."
  },
  "/webp-to-png": {
    slug: "/webp-to-png",
    inputFormat: "WebP",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts WebP images to lossless PNG format."
  },
  "/compress-image": {
    slug: "/compress-image",
    inputFormat: "Image (JPG/PNG/WebP)",
    outputFormat: "Image (JPG/PNG/WebP)",
    family: "image-conversion",
    engineId: "shared-image-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses image file sizes locally in browser."
  },
  "/compress-image-to-100kb": {
    slug: "/compress-image-to-100kb",
    inputFormat: "Image",
    outputFormat: "Compressed Image",
    family: "image-conversion",
    engineId: "shared-image-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses images below 100 KB target size."
  },
  "/compress-image-to-200kb": {
    slug: "/compress-image-to-200kb",
    inputFormat: "Image",
    outputFormat: "Compressed Image",
    family: "image-conversion",
    engineId: "shared-image-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses images below 200 KB target size."
  },
  "/compress-image-to-500kb": {
    slug: "/compress-image-to-500kb",
    inputFormat: "Image",
    outputFormat: "Compressed Image",
    family: "image-conversion",
    engineId: "shared-image-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses images below 500 KB target size."
  },
  "/compress-image-to-1mb": {
    slug: "/compress-image-to-1mb",
    inputFormat: "Image",
    outputFormat: "Compressed Image",
    family: "image-conversion",
    engineId: "shared-image-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses images below 1 MB target size."
  },
  "/compress-image-to-size": {
    slug: "/compress-image-to-size",
    inputFormat: "Image",
    outputFormat: "Compressed Image",
    family: "image-conversion",
    engineId: "shared-image-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses images to exact user-defined target KB or MB."
  },
  "/pdf-to-image": {
    slug: "/pdf-to-image",
    aliases: ["/pdf-to-picture"],
    inputFormat: "PDF",
    outputFormat: "Image (JPG/PNG)",
    family: "pdf-to-image",
    engineId: "pdf-rasterization-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Renders PDF pages into high-resolution JPG or PNG images inside a zip archive."
  },
  "/pdf-to-jpg": {
    slug: "/pdf-to-jpg",
    aliases: ["/pdf-to-jpeg"],
    inputFormat: "PDF",
    outputFormat: "JPG",
    family: "pdf-to-image",
    engineId: "pdf-rasterization-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Renders PDF document pages into individual JPEG photo files."
  },
  "/pdf-to-png": {
    slug: "/pdf-to-png",
    inputFormat: "PDF",
    outputFormat: "PNG",
    family: "pdf-to-image",
    engineId: "pdf-rasterization-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Renders PDF pages into crisp, high-resolution PNG images with crisp text."
  },
  "/image-to-pdf": {
    slug: "/image-to-pdf",
    inputFormat: "Image (JPG/PNG/WebP)",
    outputFormat: "PDF",
    family: "image-to-pdf",
    engineId: "image-to-pdf-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Combines multiple image files into a single PDF document."
  },
  "/jpg-to-pdf": {
    slug: "/jpg-to-pdf",
    inputFormat: "JPG",
    outputFormat: "PDF",
    family: "image-to-pdf",
    engineId: "image-to-pdf-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts JPEG photos into a multi-page PDF document with custom page margins."
  },
  "/png-to-pdf": {
    slug: "/png-to-pdf",
    inputFormat: "PNG",
    outputFormat: "PDF",
    family: "image-to-pdf",
    engineId: "image-to-pdf-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Converts PNG graphics into a standardized PDF document."
  },
  "/compress-pdf": {
    slug: "/compress-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-to-image",
    engineId: "pdf-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses PDF document file size using stream optimization."
  },
  "/compress-pdf-to-2mb": {
    slug: "/compress-pdf-to-2mb",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-to-image",
    engineId: "pdf-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses PDF document below 2 MB target size."
  },
  "/compress-pdf-to-size": {
    slug: "/compress-pdf-to-size",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-to-image",
    engineId: "pdf-compressor-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Compresses PDF document to exact user-specified target size."
  },
  "/merge-pdf": {
    slug: "/merge-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-organizer-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Merges multiple PDF documents into a single unified file."
  },
  "/split-pdf": {
    slug: "/split-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-organizer-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Splits PDF document into individual pages or ranges."
  },
  "/rotate-pdf-pages": {
    slug: "/rotate-pdf-pages",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-organizer-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Rotates orientation of specific PDF pages."
  },
  "/delete-pdf-pages": {
    slug: "/delete-pdf-pages",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-organizer-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Removes unwanted pages from PDF documents."
  },
  "/extract-pdf-pages": {
    slug: "/extract-pdf-pages",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-organizer-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Extracts target pages from PDF into a new document."
  },
  "/reorder-pdf-pages": {
    slug: "/reorder-pdf-pages",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-organizer-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Rearranges page order of PDF documents via drag-and-drop."
  },
  "/watermark-pdf": {
    slug: "/watermark-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-overlay-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Stamps visual text watermarks onto PDF pages with custom opacity and positioning."
  },

  // =========================================================================
  // 2. PLANNED ROUTE SHELLS (17 UN-ENGINEERED EXPANSION SHELLS - NOT PUBLIC)
  // =========================================================================
  "/sign-pdf": {
    slug: "/sign-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-overlay-engine-v2-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Visual signature overlay engine."
  },
  "/add-image-to-pdf": {
    slug: "/add-image-to-pdf",
    inputFormat: "PDF + Image",
    outputFormat: "PDF",
    family: "pdf-overlay",
    engineId: "pdf-overlay-engine-v2-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Image overlay engine onto PDF page coordinates."
  },
  "/crop-pdf": {
    slug: "/crop-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-geometry",
    engineId: "pdf-geometry-engine-v1-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: PDF page CropBox boundary modifier."
  },
  "/add-page-numbers-to-pdf": {
    slug: "/add-page-numbers-to-pdf",
    inputFormat: "PDF",
    outputFormat: "PDF",
    family: "pdf-geometry",
    engineId: "pdf-geometry-engine-v1-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Header and footer page numbering engine."
  },
  "/word-to-pdf": {
    slug: "/word-to-pdf",
    aliases: ["/docx-to-pdf"],
    inputFormat: "DOCX/DOC",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Server LibreOffice Word-to-PDF conversion worker cluster."
  },
  "/excel-to-pdf": {
    slug: "/excel-to-pdf",
    aliases: ["/xlsx-to-pdf"],
    inputFormat: "XLSX/XLS",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Server LibreOffice Excel-to-PDF conversion worker cluster."
  },
  "/powerpoint-to-pdf": {
    slug: "/powerpoint-to-pdf",
    aliases: ["/pptx-to-pdf", "/ppt-to-pdf"],
    inputFormat: "PPTX/PPT",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Server LibreOffice PowerPoint-to-PDF conversion worker cluster."
  },
  "/ocr-pdf": {
    slug: "/ocr-pdf",
    inputFormat: "Scanned PDF",
    outputFormat: "Searchable PDF",
    family: "ocr-engine",
    engineId: "server-ocr-engine-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Server Tesseract OCR text layer generator."
  },
  "/image-to-text": {
    slug: "/image-to-text",
    inputFormat: "Image",
    outputFormat: "TXT",
    family: "ocr-engine",
    engineId: "server-ocr-engine-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: OCR image text extractor."
  },
  "/make-pdf-searchable": {
    slug: "/make-pdf-searchable",
    inputFormat: "PDF",
    outputFormat: "Searchable PDF",
    family: "ocr-engine",
    engineId: "server-ocr-engine-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: OCR searchable layer embedder."
  },
  "/pdf-to-word": {
    slug: "/pdf-to-word",
    inputFormat: "PDF",
    outputFormat: "DOCX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: PDF layout parser to Word DOCX converter."
  },
  "/pdf-to-excel": {
    slug: "/pdf-to-excel",
    aliases: ["/pdf-to-xlsx", "/pdf-to-xls"],
    inputFormat: "PDF",
    outputFormat: "XLSX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: PDF table extraction to Excel spreadsheet."
  },
  "/pdf-to-powerpoint": {
    slug: "/pdf-to-powerpoint",
    aliases: ["/pdf-to-pptx"],
    inputFormat: "PDF",
    outputFormat: "PPTX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: PDF slides to PowerPoint PPTX converter."
  },
  "/heic-to-jpg": {
    slug: "/heic-to-jpg",
    inputFormat: "HEIC",
    outputFormat: "JPG",
    family: "image-conversion",
    engineId: "heic-wasm-converter-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Client WASM HEIC photo decoder."
  },
  "/heic-to-png": {
    slug: "/heic-to-png",
    inputFormat: "HEIC",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "heic-wasm-converter-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Client WASM HEIC to PNG converter."
  },
  "/avif-to-jpg": {
    slug: "/avif-to-jpg",
    inputFormat: "AVIF",
    outputFormat: "JPG",
    family: "image-conversion",
    engineId: "avif-canvas-converter-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Client AVIF image decoder."
  },
  "/png-to-ico": {
    slug: "/png-to-ico",
    inputFormat: "PNG",
    outputFormat: "ICO",
    family: "image-conversion",
    engineId: "ico-encoder-planned",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false,
    uniqueOutcomeDefinition: "Planned: Multi-resolution ICO favicon encoder."
  },

  // =========================================================================
  // 3. ALIAS REDIRECTS (QUARANTINED - NOT PUBLIC)
  // =========================================================================
  "/pdf-to-jpeg": {
    slug: "/pdf-to-jpeg",
    inputFormat: "PDF",
    outputFormat: "JPEG",
    family: "pdf-to-image",
    engineId: "pdf-rasterization-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "REDIRECT_ALIAS",
    canonicalSlug: "/pdf-to-jpg",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pdf-to-picture": {
    slug: "/pdf-to-picture",
    inputFormat: "PDF",
    outputFormat: "Image",
    family: "pdf-to-image",
    engineId: "pdf-rasterization-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "REDIRECT_ALIAS",
    canonicalSlug: "/pdf-to-image",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/jpeg-to-png": {
    slug: "/jpeg-to-png",
    inputFormat: "JPEG",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "REDIRECT_ALIAS",
    canonicalSlug: "/jpg-to-png",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/docx-to-pdf": {
    slug: "/docx-to-pdf",
    inputFormat: "DOCX",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/word-to-pdf",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pptx-to-pdf": {
    slug: "/pptx-to-pdf",
    inputFormat: "PPTX",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/powerpoint-to-pdf",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/ppt-to-pdf": {
    slug: "/ppt-to-pdf",
    inputFormat: "PPT",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/powerpoint-to-pdf",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/xlsx-to-pdf": {
    slug: "/xlsx-to-pdf",
    inputFormat: "XLSX",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-to-pdf-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/excel-to-pdf",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pdf-to-pptx": {
    slug: "/pdf-to-pptx",
    inputFormat: "PDF",
    outputFormat: "PPTX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/pdf-to-powerpoint",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pdf-to-xlsx": {
    slug: "/pdf-to-xlsx",
    inputFormat: "PDF",
    outputFormat: "XLSX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/pdf-to-excel",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pdf-to-xls": {
    slug: "/pdf-to-xls",
    inputFormat: "PDF",
    outputFormat: "XLS",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1-planned",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/pdf-to-excel",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  }
};

/**
 * Returns only routes eligible for public sitemap inclusion
 */
export function getSitemapRoutes(): string[] {
  return Object.values(CONVERSION_CATALOG)
    .filter((entry) => entry.sitemapEnabled && entry.indexabilityStatus === "INDEXABLE" && entry.implementationStatus === "PRODUCTION_FROZEN")
    .map((entry) => entry.slug);
}

/**
 * Returns catalog stats for release attestation, governance freeze, and SEO audit
 */
export function getCatalogStats() {
  const entries = Object.values(CONVERSION_CATALOG);
  
  const canonicalFunctionalRoutes = entries.filter(
    (e) => e.implementationStatus === "PRODUCTION_FROZEN" && e.indexabilityStatus === "INDEXABLE"
  ).length;

  const activeFunctionalAliases = entries.filter(
    (e) => e.implementationStatus === "PRODUCTION_FROZEN" && e.indexabilityStatus === "REDIRECT_ALIAS"
  ).length;

  const plannedCanonicalRoutes = entries.filter(
    (e) => e.implementationStatus === "PLANNED" && !e.canonicalSlug
  ).length;

  const quarantinedPlannedAliases = entries.filter(
    (e) => e.implementationStatus === "PLANNED" && Boolean(e.canonicalSlug)
  ).length;

  return {
    totalEntries: entries.length,
    canonicalFunctionalRoutes,
    activeFunctionalAliases,
    plannedCanonicalRoutes,
    quarantinedPlannedAliases,
    publicToolCount: canonicalFunctionalRoutes,
    sitemapCanonicalCount: getSitemapRoutes().length,
  };
}
