const fs = require('fs');
const path = require('path');
const workspaces = [
  'src/components/image-tools/ImageConverterWorkspace.tsx',
  'src/components/image-tools/ImageCompressionWorkspace.tsx',
  'src/components/image-transform/ImageTransformWorkspace.tsx',
  'src/components/ocr-tools/OcrPdfWorkspace.tsx',
  'src/components/office-tools/OfficeConverterWorkspace.tsx',
  'src/components/pdf-editor/PdfPageEditorWorkspace.tsx',
  'src/components/pdf-editor/PdfSelectionToolbar.tsx',
  'src/components/pdf-editor/PdfEditorResultCard.tsx',
  'src/components/pdf-manipulation/PdfManipulationWorkspace.tsx',
  'src/components/pdf-overlay/PdfOverlayWorkspace.tsx',
  'src/components/pdf-overlay/PdfWatermarkControls.tsx',
  'src/components/pdf-tools/PdfCompressionWorkspace.tsx',
  'src/components/pdf-tools/PdfToImageWorkspace.tsx',
  'src/components/upload/UploadDropzone.tsx',
  'src/components/layout/TrustPanel.tsx',
  'src/components/layout/ActionChooser.tsx',
  'src/components/layout/ToolGrid.tsx',
  'src/components/layout/UniversalToolPage.tsx',
  'src/components/navigation/DesktopMegaMenu.tsx',
  'src/components/navigation/MobileNavigation.tsx',
  'src/utils/archive/ArchiveWorkspace.tsx',
  'src/utils/audio/AudioWorkspace.tsx',
  'src/utils/cad/CadWorkspace.tsx',
  'src/utils/ebook/EbookWorkspace.tsx',
  'src/utils/font/FontWorkspace.tsx',
  'src/utils/privacy/PrivacyWorkspace.tsx',
  'src/utils/subtitles/SubtitleWorkspace.tsx',
  'src/utils/video/VideoWorkspace.tsx'
];

workspaces.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  const hasZhTw = code.includes('"zh-TW"') || code.includes("'zh-TW'");
  const hasZhCn = code.includes('"zh-CN"') || code.includes("'zh-CN'");
  const hasZh = code.includes('isChinese') || code.includes('language.startsWith("zh")') || code.includes('effectiveLang.startsWith("zh")');
  console.log(path.basename(file).padEnd(32), '| zh-TW:', String(hasZhTw).padEnd(6), '| zh-CN:', String(hasZhCn).padEnd(6), '| isChinese:', hasZh);
});
