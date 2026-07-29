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
  'compress-image': {
    path: '/brand-assets/conversions/compress-image.svg',
    alt: 'Compress image file size',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'pdf-to-excel': {
    path: '/brand-assets/conversions/pdf-to-excel.svg',
    alt: 'Convert PDF to Excel spreadsheet',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'excel-to-pdf': {
    path: '/brand-assets/conversions/excel-to-pdf.svg',
    alt: 'Convert Excel spreadsheet to PDF',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },
  'pdf-to-ppt': {
    path: '/brand-assets/conversions/pdf-to-ppt.svg',
    alt: 'Convert PDF to PowerPoint presentation',
    category: 'conversion',
    viewBox: '0 0 240 160',
  },

  // PDF Tool Icons
  'merge-pdf': {
    path: '/brand-assets/pdf-tools/merge-pdf.svg',
    alt: 'Merge PDF files together',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'split-pdf': {
    path: '/brand-assets/pdf-tools/split-pdf.svg',
    alt: 'Split PDF into separate files',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'compress-pdf': {
    path: '/brand-assets/pdf-tools/compress-pdf.svg',
    alt: 'Compress PDF file size',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'rotate-pdf': {
    path: '/brand-assets/pdf-tools/rotate-pdf.svg',
    alt: 'Rotate PDF pages',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'delete-pdf-pages': {
    path: '/brand-assets/pdf-tools/delete-pdf-pages.svg',
    alt: 'Delete pages from PDF',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'extract-pdf-pages': {
    path: '/brand-assets/pdf-tools/extract-pdf-pages.svg',
    alt: 'Extract selected PDF pages',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'reorder-pdf-pages': {
    path: '/brand-assets/pdf-tools/reorder-pdf-pages.svg',
    alt: 'Reorder PDF pages',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'watermark-pdf': {
    path: '/brand-assets/pdf-tools/watermark-pdf.svg',
    alt: 'Add watermark to PDF',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'protect-pdf': {
    path: '/brand-assets/pdf-tools/protect-pdf.svg',
    alt: 'Encrypt and password protect PDF',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'unlock-pdf': {
    path: '/brand-assets/pdf-tools/unlock-pdf.svg',
    alt: 'Remove password protection from PDF',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },
  'ocr-pdf': {
    path: '/brand-assets/pdf-tools/ocr-pdf.svg',
    alt: 'Optical character recognition PDF scanner',
    category: 'pdf-tool',
    viewBox: '0 0 96 96',
  },

  // How It Works Graphics
  'step-upload': {
    path: '/brand-assets/how-it-works/step-upload.svg',
    alt: 'Upload a file from your device',
    category: 'how-it-works',
    viewBox: '0 0 160 160',
  },
  'step-process': {
    path: '/brand-assets/how-it-works/step-process.svg',
    alt: 'Process the file locally in your browser',
    category: 'how-it-works',
    viewBox: '0 0 160 160',
  },
  'step-download': {
    path: '/brand-assets/how-it-works/step-download.svg',
    alt: 'Download the finished file',
    category: 'how-it-works',
    viewBox: '0 0 160 160',
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
