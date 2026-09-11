const fs = require('fs');
const files = [
  'src/components/image-tools/ImageConverterWorkspace.tsx',
  'src/components/ocr-tools/OcrPdfWorkspace.tsx',
  'src/components/office-tools/OfficeConverterWorkspace.tsx',
  'src/utils/archive/ArchiveWorkspace.tsx',
  'src/utils/ebook/EbookWorkspace.tsx',
  'src/utils/font/FontWorkspace.tsx',
  'src/utils/privacy/PrivacyWorkspace.tsx'
];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  console.log('=== ' + f + ' ===');
  lines.forEach((l, idx) => {
    if (l.includes('"id"') || l.includes("'id'")) {
      console.log((idx+1) + ': ' + l.trim());
    }
  });
}
