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

export interface ConversionCatalogEntry {
  slug: string;
  aliases?: string[];
  inputFormat: string;
  outputFormat: string;
  family: "image-conversion" | "pdf-to-image" | "image-to-pdf" | "office-to-pdf" | "pdf-to-office" | "lightweight-data" | "ebook" | "archive" | "media" | "cad";
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
}

export const CONVERSION_CATALOG: Record<string, ConversionCatalogEntry> = {
  // =========================================================================
  // 1. IMAGE CONVERSION FAMILY (FROZEN & INDEXABLE)
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
    uniqueOutcomeDefinition: "General multi-format image converter supporting JPEG, PNG, and WebP client-side transformations.",
    relatedRoutes: ["/jpg-to-png", "/png-to-jpg", "/jpg-to-webp", "/png-to-webp", "/webp-to-jpg", "/webp-to-png"]
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

  // =========================================================================
  // 2. CONVERT FROM PDF FAMILY (FROZEN & INDEXABLE)
  // =========================================================================
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
    uniqueOutcomeDefinition: "Rasterizes PDF document pages into high-resolution JPG or PNG images."
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
    uniqueOutcomeDefinition: "Converts PDF pages into compressed JPEG images with quality control."
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
    uniqueOutcomeDefinition: "Converts PDF pages into high-fidelity lossless PNG images."
  },

  // Synonym Aliases -> 301 Redirects (NOT INDEXABLE separately)
  "/pdf-to-jpeg": {
    slug: "/pdf-to-jpeg",
    inputFormat: "PDF",
    outputFormat: "JPG",
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

  // =========================================================================
  // 3. CONVERT TO PDF FAMILY (FROZEN & INDEXABLE)
  // =========================================================================
  "/image-to-pdf": {
    slug: "/image-to-pdf",
    inputFormat: "Image (JPG/PNG)",
    outputFormat: "PDF",
    family: "image-to-pdf",
    engineId: "image-to-pdf-engine-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "INDEXABLE",
    navigationEnabled: true,
    sitemapEnabled: true,
    localizationEnabled: true,
    uniqueOutcomeDefinition: "Combines multiple JPG and PNG images into a clean multi-page PDF document."
  },
  "/jpg-to-pdf": {
    slug: "/jpg-to-pdf",
    aliases: ["/jpeg-to-pdf"],
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
    uniqueOutcomeDefinition: "Converts single or multiple JPEG images into a formatted PDF document."
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
    uniqueOutcomeDefinition: "Converts PNG graphics and transparent screenshots into a formatted PDF."
  },

  // =========================================================================
  // 4. POST-LAUNCH TIER 1: EXTENDED IMAGE DECODING (PLANNED)
  // =========================================================================
  "/heic-to-jpg": {
    slug: "/heic-to-jpg",
    inputFormat: "HEIC",
    outputFormat: "JPG",
    family: "image-conversion",
    engineId: "heic-decoder-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/heic-to-png": {
    slug: "/heic-to-png",
    inputFormat: "HEIC",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "heic-decoder-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/avif-to-jpg": {
    slug: "/avif-to-jpg",
    inputFormat: "AVIF",
    outputFormat: "JPG",
    family: "image-conversion",
    engineId: "avif-decoder-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/svg-to-png": {
    slug: "/svg-to-png",
    inputFormat: "SVG",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "svg-rasterizer-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },

  // =========================================================================
  // 5. POST-LAUNCH TIER 2: LIGHTWEIGHT DATA & TEXT (PLANNED)
  // =========================================================================
  "/pdf-to-txt": {
    slug: "/pdf-to-txt",
    inputFormat: "PDF",
    outputFormat: "TXT",
    family: "lightweight-data",
    engineId: "pdf-text-extractor-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/txt-to-pdf": {
    slug: "/txt-to-pdf",
    inputFormat: "TXT",
    outputFormat: "PDF",
    family: "lightweight-data",
    engineId: "text-to-pdf-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/csv-to-excel": {
    slug: "/csv-to-excel",
    inputFormat: "CSV",
    outputFormat: "XLSX",
    family: "lightweight-data",
    engineId: "spreadsheet-converter-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/xlsx-to-csv": {
    slug: "/xlsx-to-csv",
    inputFormat: "XLSX",
    outputFormat: "CSV",
    family: "lightweight-data",
    engineId: "spreadsheet-converter-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },

  // =========================================================================
  // 6. SERVER INFRASTRUCTURE FAMILY (PLANNED)
  // =========================================================================
  "/word-to-pdf": {
    slug: "/word-to-pdf",
    inputFormat: "DOCX",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-converter-v1",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/excel-to-pdf": {
    slug: "/excel-to-pdf",
    inputFormat: "XLSX",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-converter-v1",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/powerpoint-to-pdf": {
    slug: "/powerpoint-to-pdf",
    inputFormat: "PPTX",
    outputFormat: "PDF",
    family: "office-to-pdf",
    engineId: "server-office-converter-v1",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pdf-to-word": {
    slug: "/pdf-to-word",
    inputFormat: "PDF",
    outputFormat: "DOCX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },
  "/pdf-to-excel": {
    slug: "/pdf-to-excel",
    inputFormat: "PDF",
    outputFormat: "XLSX",
    family: "pdf-to-office",
    engineId: "server-pdf-to-office-v1",
    processingMode: "server",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
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
 * Returns catalog stats for release attestation and SEO audit
 */
export function getCatalogStats() {
  const entries = Object.values(CONVERSION_CATALOG);
  return {
    totalEntries: entries.length,
    productionFrozenCount: entries.filter((e) => e.implementationStatus === "PRODUCTION_FROZEN").length,
    indexableCount: entries.filter((e) => e.indexabilityStatus === "INDEXABLE").length,
    redirectAliasCount: entries.filter((e) => e.indexabilityStatus === "REDIRECT_ALIAS").length,
    plannedCount: entries.filter((e) => e.implementationStatus === "PLANNED").length
  };
}
