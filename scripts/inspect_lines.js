const fs = require('fs');
const files = [
  'src/utils/font/FontWorkspace.tsx',
  'src/utils/privacy/PrivacyWorkspace.tsx',
  'src/components/image-tools/ImageConverterWorkspace.tsx',
  'src/components/ocr-tools/OcrPdfWorkspace.tsx',
  'src/components/office-tools/OfficeConverterWorkspace.tsx',
  'src/components/pdf-editor/PdfPageEditorWorkspace.tsx',
  'src/components/pdf-overlay/PdfOverlayWorkspace.tsx'
];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split(/\r?\n/);
  console.log('=== ' + f + ' ===');
  lines.forEach((l, idx) => {
    if ((l.includes('isMalay') || l.includes('isThai') || l.includes('language === "th"') || l.includes('language === "ms"')) && !l.includes('const is')) {
      const win = lines.slice(Math.max(0, idx - 6), Math.min(lines.length, idx + 7)).join('\n');
      if (!win.includes('isFilipino') && !win.includes('"fil"') && !win.includes("'fil'")) {
        console.log('  Line ' + (idx + 1) + ': ' + l.trim().slice(0, 80));
      }
    }
  });
}
