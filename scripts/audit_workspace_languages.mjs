import fs from 'fs';
import path from 'path';

const files = [
  'src/components/image-transform/ImageTransformWorkspace.tsx',
  'src/utils/archive/ArchiveWorkspace.tsx',
  'src/utils/privacy/PrivacyWorkspace.tsx',
  'src/utils/font/FontWorkspace.tsx',
  'src/utils/ebook/EbookWorkspace.tsx',
  'src/utils/audio/AudioWorkspace.tsx',
  'src/utils/video/VideoWorkspace.tsx',
  'src/utils/subtitles/SubtitleWorkspace.tsx',
  'src/utils/cad/CadWorkspace.tsx',
  'src/components/pdf-editor/PdfPageEditorWorkspace.tsx',
  'src/components/pdf-overlay/PdfOverlayWorkspace.tsx',
  'src/components/ocr-tools/OcrPdfWorkspace.tsx',
  'src/components/office-tools/OfficeConverterWorkspace.tsx',
  'src/components/pdf-tools/PdfCompressionWorkspace.tsx',
  'src/components/pdf-tools/PdfToImageWorkspace.tsx',
  'src/components/image-tools/ImageCompressionWorkspace.tsx',
  'src/components/image-tools/ImageConverterWorkspace.tsx',
  'src/components/layout/ActionChooser.tsx',
  'src/components/layout/TrustPanel.tsx',
  'src/components/upload/UploadDropzone.tsx',
  'src/components/layout/LanguageContext.tsx'
];

files.forEach(f => {
  const full = path.join(process.cwd(), f);
  if (fs.existsSync(full)) {
    const content = fs.readFileSync(full, 'utf8');
    const hasHi = content.includes('isHindi') || content.includes('language === "hi"') || content.includes('lang === "hi"');
    const hasFil = content.includes('isFilipino') || content.includes('language === "fil"') || content.includes('lang === "fil"');
    const hasJa = content.includes('isJapanese') || content.includes('language === "ja"') || content.includes('lang === "ja"');
    const hasCs = content.includes('isCzech') || content.includes('language === "cs"') || content.includes('lang === "cs"');
    console.log(`${f.padEnd(55)} -> hi:${hasHi} | fil:${hasFil} | ja:${hasJa} | cs:${hasCs}`);
  }
});
