export interface FileKitAssetMeta {
  path: string;
  alt: string;
  category: 'conversion' | 'pdf-tool' | 'how-it-works' | 'benefit' | 'hero';
  viewBox: string;
}

export const fileKitAssets = {
  // Conversion Graphics
  'pdf-to-word': {
    path: '/brand-assets/conversions/pdf-to-word.svg',
    alt: 'Convert PDF to editable Word document',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'word-to-pdf': {
    path: '/brand-assets/conversions/word-to-pdf.svg',
    alt: 'Convert Word document to PDF',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'excel-to-pdf': {
    path: '/brand-assets/conversions/word-to-pdf.svg',
    alt: 'Convert Excel spreadsheet to PDF',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'powerpoint-to-pdf': {
    path: '/brand-assets/conversions/word-to-pdf.svg',
    alt: 'Convert PowerPoint presentation to PDF',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'pdf-to-excel': {
    path: '/brand-assets/conversions/pdf-to-word.svg',
    alt: 'Convert PDF to Excel spreadsheet',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'pdf-to-powerpoint': {
    path: '/brand-assets/conversions/pdf-to-word.svg',
    alt: 'Convert PDF to PowerPoint presentation',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'jpg-to-pdf': {
    path: '/brand-assets/conversions/jpg-to-pdf.svg',
    alt: 'Convert JPG image to PDF',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'pdf-to-jpg': {
    path: '/brand-assets/conversions/pdf-to-jpg.svg',
    alt: 'Convert PDF pages to JPG images',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'image-to-pdf': {
    path: '/brand-assets/conversions/image-to-pdf.svg',
    alt: 'Convert multiple images into one PDF',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'png-to-jpg': {
    path: '/brand-assets/conversions/png-to-jpg.svg',
    alt: 'Convert PNG image to JPG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'jpg-to-png': {
    path: '/brand-assets/conversions/jpg-to-png.svg',
    alt: 'Convert JPG image to PNG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'webp-to-png': {
    path: '/brand-assets/conversions/webp-to-png.svg',
    alt: 'Convert WEBP image to PNG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'png-to-webp': {
    path: '/brand-assets/conversions/png-to-webp.svg',
    alt: 'Convert PNG image to WEBP format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'jpg-to-webp': {
    path: '/brand-assets/conversions/jpg-to-png.svg',
    alt: 'Convert JPG image to WEBP format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'webp-to-jpg': {
    path: '/brand-assets/conversions/png-to-jpg.svg',
    alt: 'Convert WEBP image to JPG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'heic-to-jpg': {
    path: '/brand-assets/conversions/png-to-jpg.svg',
    alt: 'Convert HEIC photo to JPG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'heic-to-png': {
    path: '/brand-assets/conversions/jpg-to-png.svg',
    alt: 'Convert HEIC photo to PNG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'avif-to-jpg': {
    path: '/brand-assets/conversions/png-to-jpg.svg',
    alt: 'Convert AVIF image to JPG format',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'png-to-ico': {
    path: '/brand-assets/conversions/png-to-webp.svg',
    alt: 'Convert PNG image to ICO favicon',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'image-to-text': {
    path: '/brand-assets/conversions/jpg-to-png.svg',
    alt: 'OCR extract text from image',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },

  // PDF Tools Graphics
  'compress-pdf': {
    path: '/brand-assets/pdf-tools/compress-pdf.svg',
    alt: 'Compress PDF document file size',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'merge-pdf': {
    path: '/brand-assets/pdf-tools/merge-pdf.svg',
    alt: 'Merge multiple PDF files into one',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'split-pdf': {
    path: '/brand-assets/pdf-tools/split-pdf.svg',
    alt: 'Split PDF document into pages',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'rotate-pdf': {
    path: '/brand-assets/pdf-tools/rotate-pdf.svg',
    alt: 'Rotate PDF page orientation',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'watermark-pdf': {
    path: '/brand-assets/pdf-tools/watermark-pdf.svg',
    alt: 'Add watermark overlay to PDF',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'delete-pdf-pages': {
    path: '/brand-assets/pdf-tools/delete-pdf-pages.svg',
    alt: 'Delete pages from PDF document',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'extract-pdf-pages': {
    path: '/brand-assets/pdf-tools/extract-pdf-pages.svg',
    alt: 'Extract pages from PDF document',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'reorder-pdf': {
    path: '/brand-assets/pdf-tools/reorder-pdf.svg',
    alt: 'Rearrange page order in PDF document',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'sign-pdf': {
    path: '/brand-assets/pdf-tools/watermark-pdf.svg',
    alt: 'Add signature overlay to PDF document',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'add-image-to-pdf': {
    path: '/brand-assets/conversions/jpg-to-pdf.svg',
    alt: 'Add image overlay onto PDF page',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'crop-pdf': {
    path: '/brand-assets/pdf-tools/split-pdf.svg',
    alt: 'Crop visible PDF page boundaries',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'add-page-numbers-to-pdf': {
    path: '/brand-assets/pdf-tools/reorder-pdf.svg',
    alt: 'Add page numbers to PDF header or footer',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'ocr-pdf': {
    path: '/brand-assets/conversions/pdf-to-word.svg',
    alt: 'OCR convert scanned PDF into text',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },
  'make-pdf-searchable': {
    path: '/brand-assets/conversions/pdf-to-word.svg',
    alt: 'OCR make scanned PDF text searchable',
    category: 'pdf-tool',
    viewBox: '0 0 240 160',
  },

  // Benefit & Process Vector Graphics (SVG)
  'step-upload': {
    path: '/brand-assets/how-it-works/step-upload.svg',
    alt: '1. Upload your file illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-1-upload': {
    path: '/brand-assets/how-it-works/step-upload.svg',
    alt: '1. Upload your file illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-process': {
    path: '/brand-assets/how-it-works/step-process.svg',
    alt: '2. Process changes illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-2-changes': {
    path: '/brand-assets/how-it-works/step-process.svg',
    alt: '2. Make your changes illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-2-convert': {
    path: '/brand-assets/how-it-works/step-process.svg',
    alt: '2. Make your changes (Convert) illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-2-compress': {
    path: '/brand-assets/how-it-works/step-process.svg',
    alt: '2. Make your changes (Compress) illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-3-download': {
    path: '/brand-assets/how-it-works/step-download.svg',
    alt: '3. Download or share illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },
  'step-download': {
    path: '/brand-assets/how-it-works/step-download.svg',
    alt: '3. Download or share illustration',
    category: 'how-it-works',
    viewBox: '0 0 720 420',
  },

  // Benefits & Trust
  'private-local-processing': {
    path: '/brand-assets/benefits/private-local-processing.svg',
    alt: 'Files stay private on your device',
    category: 'benefit',
    viewBox: '0 0 160 160',
  },
  'verified-output': {
    path: '/brand-assets/benefits/verified-output.svg',
    alt: 'Output verified before download',
    category: 'benefit',
    viewBox: '0 0 160 160',
  },

  // Hero Graphics (PNG)
  'batch-processing-hero': {
    path: '/brand-assets/hero/batch-processing.png',
    alt: 'Batch multi-file processing engine illustration',
    category: 'hero',
    viewBox: '0 0 1200 800',
  },
  'client-side-privacy-hero': {
    path: '/brand-assets/hero/client-side-privacy-hero.png',
    alt: '100% Client-side local privacy security illustration',
    category: 'hero',
    viewBox: '0 0 1200 800',
  },
} as const;

export type FileKitAssetName = keyof typeof fileKitAssets;
