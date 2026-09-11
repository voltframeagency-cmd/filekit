const routes = [
  '/',
  '/all-tools',
  '/compress-pdf',
  '/compress-pdf-to-2mb',
  '/compress-image',
  '/compress-image-to-200kb',
  '/merge-pdf',
  '/split-pdf',
  '/rotate-pdf-pages',
  '/delete-pdf-pages',
  '/extract-pdf-pages',
  '/reorder-pdf-pages',
  '/watermark-pdf',
  '/flatten-pdf',
  '/crop-image',
  '/resize-image',
  '/rotate-image',
  '/flip-image',
  '/grayscale-image',
  '/invert-image',
  '/blur-image',
  '/pdf-to-jpg',
  '/pdf-to-png',
  '/jpg-to-png',
  '/png-to-jpg',
  '/word-to-pdf',
  '/powerpoint-to-pdf',
  '/excel-to-pdf',
  '/convert-audio',
  '/compress-video',
  '/extract-zip',
  '/create-zip',
  '/strip-exif',
  '/ttf-to-woff2',
  '/epub-to-pdf',
  '/ocr-pdf',
  '/reverse-pdf',
  '/duplicate-pdf-pages',
  '/svg-to-png',
  '/ico-to-png'
];

const potentialLeaks = [
  'Drop your PDF here',
  'Drop your image here',
  'Drop your font here',
  'Drop your audio here',
  'Drop your video here',
  'Drop your eBook here',
  'Drop your archive here',
  'Select PowerPoint Presentation',
  'High-fidelity LibreOffice',
  'All Tools',
  'Pricing',
  'Features',
  'How It Works',
  'Frequently Asked Questions',
  'Convert to PDF',
  'Download File',
  'Change File',
  'Change PDF',
  'Reset',
  'Processing...',
  'Operation Complete',
  'Processed 100% locally',
  'Apply Watermark',
  'Watermark Type',
  'Select Logo Image',
  'Preserve Transparent Background',
  'Background Fill Color',
  'Select Embedded Sub-Image',
  'Live Font Preview',
  'Strip EXIF',
  'Detected Metadata',
  'File Details',
  'Choose File',
  'Select File',
  'Select PDF',
  'Select Image',
  'Select Audio',
  'Select Video',
  'Select Document',
  'Free basic tools'
];

async function test() {
  for (const r of routes) {
    const res = await fetch('http://localhost:3000/zh-TW' + (r === '/' ? '' : r));
    const html = await res.text();
    const found = [];
    for (const leak of potentialLeaks) {
      if (html.includes('>' + leak + '<') || html.includes('>' + leak + ' ') || html.includes('"' + leak + '"')) {
        found.push(leak);
      }
    }
    if (found.length > 0) {
      console.log('❌ Leak in', r, ':', found.join(', '));
    } else {
      process.stdout.write('.');
    }
  }
  console.log('\nAudit complete.');
}
test();
