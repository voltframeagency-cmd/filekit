const fs = require('fs');
const files = [
  'src/utils/archive/ArchiveWorkspace.tsx',
  'src/components/image-tools/ImageCompressionWorkspace.tsx',
  'src/components/image-tools/ImageConverterWorkspace.tsx',
  'src/components/office-tools/OfficeConverterWorkspace.tsx',
  'src/utils/ebook/EbookWorkspace.tsx',
  'src/utils/font/FontWorkspace.tsx',
  'src/utils/privacy/PrivacyWorkspace.tsx'
];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  console.log(f, 'has isHindi:', content.includes('isHindi'), 'has "hi":', content.includes('"hi"'));
}
