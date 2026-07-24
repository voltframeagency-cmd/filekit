# FileKit Route Portfolio & Engine Architecture Inspired by PDFAid

> **Strategic Purpose**: This document separates raw competitor intelligence (Document A: Observed PDFAid 84-Route Inventory) from FileKit's normalized product portfolio and architectural roadmap (Document B: FileKit Route Portfolio).

---

## 🏛️ Executive Engine-Family Mapping (11 Core Families)

```mermaid
graph TD
    A["Observed Search Intent Routes"] --> B["11 Core Engine Families"]
    
    B --> C1["1. PDF_PAGE_ORGANIZATION (Local Native)"]
    B --> C2["2. PDF_COMPRESSION (Local Native)"]
    B --> C3["3. PDF_OVERLAY_EDITOR (Local Native)"]
    B --> C4["4. PDF_PAGE_GEOMETRY (Local Native)"]
    B --> C5["5. PDF_RENDER_TO_IMAGE (Local Native)"]
    B --> C6["6. IMAGE_TO_PDF (Local Native)"]
    B --> C7["7. IMAGE_CONVERTER (Local Native / Gated)"]
    B --> C8["8. OFFICE_TO_PDF (Server Required)"]
    B --> C9["9. PDF_TO_OFFICE (Server Required)"]
    B --> C10["10. OCR_ENGINE (Server Required)"]
    B --> C11["11. SPECIALIZED_CONVERSION (Rejected / Deferred)"]
```

---

## 📁 DOCUMENT A: Observed PDFAid 84-Route Inventory

Below is the unedited 84-route competitor inventory observed from PDFAid's landing page catalog:

| # | Observed Competitor Route | Original Category | Normalized Search Intent | Probable Engine Family | Competitor SEO Strategy |
|---|---|---|---|---|---|
| **1** | PDF to Word | From PDF | Convert PDF to Word document | `PDF_TO_OFFICE` | Distinct Operation |
| **2** | PDF to DOCX | From PDF | Convert PDF to DOCX document | `PDF_TO_OFFICE` | Format Alias |
| **3** | PDF to DOC | From PDF | Convert PDF to DOC document | `PDF_TO_OFFICE` | Format Alias |
| **4** | PDF to Excel | From PDF | Convert PDF to Excel spreadsheet | `PDF_TO_OFFICE` | Distinct Operation |
| **5** | PDF to XLSX | From PDF | Convert PDF to XLSX spreadsheet | `PDF_TO_OFFICE` | Format Alias |
| **6** | PDF to XLS | From PDF | Convert PDF to XLS spreadsheet | `PDF_TO_OFFICE` | Format Alias |
| **7** | PDF to PowerPoint | From PDF | Convert PDF to PowerPoint presentation | `PDF_TO_OFFICE` | Distinct Operation |
| **8** | PDF to PPTX | From PDF | Convert PDF to PPTX presentation | `PDF_TO_OFFICE` | Format Alias |
| **9** | PDF to PPT | From PDF | Convert PDF to PPT presentation | `PDF_TO_OFFICE` | Format Alias |
| **10** | PDF to Text | From PDF | Extract raw text from PDF | `PDF_TO_OFFICE` | Distinct Operation |
| **11** | PDF to TXT | From PDF | Extract TXT from PDF | `PDF_TO_OFFICE` | Format Alias |
| **12** | PDF to HTML | From PDF | Convert PDF to HTML webpage | `PDF_TO_OFFICE` | Distinct Operation |
| **13** | PDF to RTF | From PDF | Convert PDF to Rich Text Format | `PDF_TO_OFFICE` | Format Alias |
| **14** | PDF to Pages | From PDF | Convert PDF to Apple Pages format | `PDF_TO_OFFICE` | Format Alias |
| **15** | PDF to JPG | From PDF | Render PDF pages to JPG images | `PDF_RENDER_TO_IMAGE` | Distinct Operation |
| **16** | PDF to JPEG | From PDF | Render PDF pages to JPEG images | `PDF_RENDER_TO_IMAGE` | Synonym Alias |
| **17** | PDF to PNG | From PDF | Render PDF pages to PNG images | `PDF_RENDER_TO_IMAGE` | Distinct Operation |
| **18** | PDF to Image | From PDF | Render PDF pages to Image Zip | `PDF_RENDER_TO_IMAGE` | Distinct Hub |
| **19** | PDF to Picture | From PDF | Render PDF pages to Picture Zip | `PDF_RENDER_TO_IMAGE` | Synonym Alias |
| **20** | PDF to WebP | From PDF | Render PDF pages to WebP images | `PDF_RENDER_TO_IMAGE` | Distinct Operation |
| **21** | PDF to BMP | From PDF | Render PDF pages to BMP images | `PDF_RENDER_TO_IMAGE` | Format Alias |
| **22** | PDF to TIFF | From PDF | Render PDF pages to TIFF images | `PDF_RENDER_TO_IMAGE` | Format Alias |
| **23** | PDF to GIF | From PDF | Convert PDF to GIF image | `PDF_RENDER_TO_IMAGE` | Format Alias |
| **24** | PDF to EPS | From PDF | Convert PDF to PostScript vector | `SPECIALIZED_CONVERSION` | Format Alias |
| **25** | Word to PDF | To PDF | Convert Word document to PDF | `OFFICE_TO_PDF` | Distinct Operation |
| **26** | DOCX to PDF | To PDF | Convert DOCX file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **27** | DOC to PDF | To PDF | Convert DOC file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **28** | Excel to PDF | To PDF | Convert Excel spreadsheet to PDF | `OFFICE_TO_PDF` | Distinct Operation |
| **29** | XLSX to PDF | To PDF | Convert XLSX file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **30** | XLS to PDF | To PDF | Convert XLS file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **31** | PowerPoint to PDF | To PDF | Convert PowerPoint file to PDF | `OFFICE_TO_PDF` | Distinct Operation |
| **32** | PPTX to PDF | To PDF | Convert PPTX file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **33** | PPT to PDF | To PDF | Convert PPT file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **34** | Text to PDF | To PDF | Convert plain text to PDF | `OFFICE_TO_PDF` | Distinct Operation |
| **35** | TXT to PDF | To PDF | Convert TXT file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **36** | HTML to PDF | To PDF | Convert HTML webpage to PDF | `OFFICE_TO_PDF` | Distinct Operation |
| **37** | Markdown to PDF | To PDF | Convert Markdown text to PDF | `OFFICE_TO_PDF` | Distinct Operation |
| **38** | RTF to PDF | To PDF | Convert Rich Text Format to PDF | `OFFICE_TO_PDF` | Format Alias |
| **39** | ODT to PDF | To PDF | Convert OpenDocument text to PDF | `OFFICE_TO_PDF` | Format Alias |
| **40** | WPS to PDF | To PDF | Convert WPS document to PDF | `OFFICE_TO_PDF` | Format Alias |
| **41** | CSV to PDF | To PDF | Convert CSV table to PDF | `OFFICE_TO_PDF` | Format Alias |
| **42** | PUB to PDF | To PDF | Convert Publisher file to PDF | `OFFICE_TO_PDF` | Format Alias |
| **43** | DWG to PDF | To PDF | Convert AutoCAD DWG to PDF | `SPECIALIZED_CONVERSION` | Specialized |
| **44** | Image to PDF | To PDF | Convert images to PDF document | `IMAGE_TO_PDF` | Distinct Hub |
| **45** | JPG to PDF | To PDF | Convert JPG images to PDF | `IMAGE_TO_PDF` | Distinct Operation |
| **46** | PNG to PDF | To PDF | Convert PNG images to PDF | `IMAGE_TO_PDF` | Distinct Operation |
| **47** | JPEG to PDF | To PDF | Convert JPEG images to PDF | `IMAGE_TO_PDF` | Synonym Alias |
| **48** | WebP to PDF | To PDF | Convert WebP images to PDF | `IMAGE_TO_PDF` | Distinct Operation |
| **49** | HEIC to PDF | To PDF | Convert HEIC photos to PDF | `IMAGE_TO_PDF` | Distinct Operation |
| **50** | BMP to PDF | To PDF | Convert BMP images to PDF | `IMAGE_TO_PDF` | Format Alias |
| **51** | TIFF to PDF | To PDF | Convert TIFF images to PDF | `IMAGE_TO_PDF` | Format Alias |
| **52** | Compress Image | Image Conversion | Compress image file size | `IMAGE_CONVERTER` | Distinct Operation |
| **53** | Resize Image | Image Conversion | Resize image dimensions | `IMAGE_CONVERTER` | Distinct Operation |
| **54** | JPG to PNG | Image Conversion | Convert JPG to PNG format | `IMAGE_CONVERTER` | Distinct Operation |
| **55** | PNG to JPG | Image Conversion | Convert PNG to JPG format | `IMAGE_CONVERTER` | Distinct Operation |
| **56** | WebP to JPG | Image Conversion | Convert WebP to JPG format | `IMAGE_CONVERTER` | Distinct Operation |
| **57** | WebP to PNG | Image Conversion | Convert WebP to PNG format | `IMAGE_CONVERTER` | Distinct Operation |
| **58** | JPG to WebP | Image Conversion | Convert JPG to WebP format | `IMAGE_CONVERTER` | Distinct Operation |
| **59** | PNG to WebP | Image Conversion | Convert PNG to WebP format | `IMAGE_CONVERTER` | Distinct Operation |
| **60** | HEIC to JPG | Image Conversion | Convert iPhone HEIC to JPG | `IMAGE_CONVERTER` | Distinct Operation |
| **61** | AVIF to JPG | Image Conversion | Convert AVIF image to JPG | `IMAGE_CONVERTER` | Distinct Operation |
| **62** | Image to Word | Image Conversion | OCR image into Word document | `OCR_ENGINE` | Distinct Operation |
| **63** | Image to Excel | Image Conversion | OCR image into Excel table | `OCR_ENGINE` | Distinct Operation |
| **64** | Image to SVG | Image Conversion | Vectorize raster image to SVG | `SPECIALIZED_CONVERSION` | Specialized |
| **65** | Video to GIF | Image Conversion | Convert video clip to animated GIF | `SPECIALIZED_CONVERSION` | Specialized |
| **66** | MP4 to GIF | Image Conversion | Convert MP4 video to GIF | `SPECIALIZED_CONVERSION` | Format Alias |
| **67** | PNG to ICO | Image Conversion | Convert PNG image to ICO favicon | `IMAGE_CONVERTER` | Distinct Operation |
| **68** | JFIF to JPG | Image Conversion | Convert JFIF file to JPG format | `IMAGE_CONVERTER` | Format Alias |
| **69** | DOCX to JPG | Image Conversion | Render Word document to JPG | `OFFICE_TO_PDF` | Format Alias |
| **70** | EPS to SVG | Image Conversion | Convert EPS vector to SVG | `SPECIALIZED_CONVERSION` | Specialized |
| **71** | HTML to JPG | Image Conversion | Render HTML webpage to JPG | `OFFICE_TO_PDF` | Format Alias |
| **72** | Word to JPG | Image Conversion | Render Word document to JPG | `OFFICE_TO_PDF` | Format Alias |
| **73** | Merge PDF | PDF Editing | Merge multiple PDF files | `PDF_PAGE_ORGANIZATION` | Distinct Operation |
| **74** | Split PDF | PDF Editing | Split PDF into separate pages | `PDF_PAGE_ORGANIZATION` | Distinct Operation |
| **75** | Rotate PDF | PDF Editing | Rotate PDF page orientation | `PDF_PAGE_ORGANIZATION` | Distinct Operation |
| **76** | Delete PDF Pages | PDF Editing | Delete selected pages from PDF | `PDF_PAGE_ORGANIZATION` | Distinct Operation |
| **77** | Crop PDF | PDF Editing | Change visible CropBox bounds | `PDF_PAGE_GEOMETRY` | Distinct Operation |
| **78** | Add Watermark | PDF Editing | Stamp text or image watermark | `PDF_OVERLAY_EDITOR` | Distinct Operation |
| **79** | Add Image to PDF | PDF Editing | Overlay image onto PDF page | `PDF_OVERLAY_EDITOR` | Distinct Operation |
| **80** | Edit PDF | PDF Editing | Edit PDF document | `PDF_OVERLAY_EDITOR` | Distinct Hub |
| **81** | Sign PDF | PDF Editing | Add visual signature to PDF | `PDF_OVERLAY_EDITOR` | Distinct Operation |
| **82** | OCR PDF | PDF Editing | Convert scanned PDF to text | `OCR_ENGINE` | Distinct Operation |
| **83** | PDF to EPUB | PDF Editing | Convert PDF to EPUB eBook | `SPECIALIZED_CONVERSION` | Specialized |
| **84** | HWP to PDF | PDF Editing | Convert Hangul Word file to PDF | `SPECIALIZED_CONVERSION` | Specialized |

---

## 🏛️ DOCUMENT B: FileKit Normalized Route Portfolio

Below is FileKit's normalized, production-safe route portfolio with capability-driven processing modes and SEO canonical rules:

### Processing Mode Taxonomy
* `LOCAL_NATIVE`: Pure client-side JavaScript (`pdf-lib`, `pdfjs-dist`, Canvas 2D) running 100% in browser.
* `LOCAL_CAPABILITY_GATED`: Browser local execution subject to browser API support (e.g. HEIC WASM decoders).
* `SERVER_REQUIRED`: Requires server conversion worker containers (LibreOffice, OCR engines).
* `UNSUPPORTED`: Excluded from short-term roadmap due to low ROI or high support burden.

```ts
export interface ToolOperationManifest {
  operationId: string;
  engineFamily:
    | "PDF_PAGE_ORGANIZATION"
    | "PDF_COMPRESSION"
    | "PDF_OVERLAY_EDITOR"
    | "PDF_PAGE_GEOMETRY"
    | "PDF_RENDER_TO_IMAGE"
    | "IMAGE_TO_PDF"
    | "IMAGE_CONVERTER"
    | "OFFICE_TO_PDF"
    | "PDF_TO_OFFICE"
    | "OCR_ENGINE"
    | "SPECIALIZED_CONVERSION";
  canonicalRoute: string;
  aliases: string[];
  inputFormats: string[];
  outputFormats: string[];
  processingMode: "LOCAL_NATIVE" | "LOCAL_CAPABILITY_GATED" | "SERVER_REQUIRED" | "UNSUPPORTED";
  implementationStatus: "LIVE" | "BETA" | "PLANNED" | "DEFERRED" | "REJECTED";
  indexable: boolean;
  localizationEligible: boolean;
}
```

---

## 🚀 Refined Track C Subtracks (PDF Editing & Page Geometry)

To maintain safety and operational predictability, **Track C** is split into 3 distinct engineering subtracks:

### Track C1: Deterministic Overlays (Next Development Priority)
* `/watermark-pdf`: Stamp text/image watermarks with opacity and rotation.
* `/add-image-to-pdf`: Embed visual images onto specific page coordinates.
* `/add-page-numbers-to-pdf`: Render footer/header page numbers across documents.
* `/sign-pdf` (Interface Copy: *"Add visual signature to your PDF"*): Draw signature on canvas or upload signature image and overlay onto page.

### Track C2: Visual Markup Workspace
* `/annotate-pdf`: Freehand drawing, text callouts, shapes, and highlights.
* `/add-text-to-pdf`: Add text blocks onto existing PDF pages.
* Requires coordinate mapping, zoom transformations, object selection, and multi-page layer ordering.

### Track C3: Page Geometry Engine
* `/crop-pdf`: Adjust visible `CropBox` boundaries with UI disclosure: *"Cropping changes visible page boundaries. It does not securely erase hidden content."*
* `/resize-pdf-pages`: Convert page dimensions (A4 ↔ Letter ↔ Legal).

---

## 🌐 Localization & URL Slug Schema

FileKit handles international expansion by decoupling `operationId` from localized URL paths:

```ts
export const LOCALIZED_ROUTE_MAP: Record<string, Record<string, string>> = {
  "pdf-merge": {
    en: "/merge-pdf",
    es: "/combinar-pdf",
    "pt-BR": "/juntar-pdf",
    de: "/pdf-zusammenfuegen",
    fr: "/fusionner-pdf",
  },
  "pdf-split": {
    en: "/split-pdf",
    es: "/dividir-pdf",
    "pt-BR": "/separar-pdf",
    de: "/pdf-teilen",
    fr: "/diviser-pdf",
  },
  "pdf-compress": {
    en: "/compress-pdf",
    es: "/comprimir-pdf",
    "pt-BR": "/compactar-pdf",
    de: "/pdf-verkleinern",
    fr: "/compresser-pdf",
  },
};
```
