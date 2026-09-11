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

async function runAudit() {
  console.log('Auditing Japanese (/ja/...) routes for English leaks:');
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
    'Privacy Policy',
    'Terms of Service',
    'Pricing',
    'Contact Us',
    'Features',
    'How It Works',
    'Frequently Asked Questions',
    'Convert to PDF',
    'Compress PDF',
    'Merge PDF',
    'Split PDF',
    'Rotate PDF',
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
    'File Details'
  ];

  for (const r of routes) {
    const url = `http://localhost:3000/ja` + (r === '/' ? '' : r);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`[HTTP ${res.status}] ${url}`);
        continue;
      }
      const html = await res.text();
      
      const foundLeaks = [];
      for (const leak of potentialLeaks) {
        // Look for literal leaks inside text or headings (not internal javascript variable names or script tags if possible)
        // Check if leak exists in body text
        const regex = new RegExp(`(>|")\\s*${leak.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(<|")`, 'i');
        if (regex.test(html) || html.includes(`>${leak}<`) || html.includes(`>${leak} `)) {
          foundLeaks.push(leak);
        }
      }
      
      if (foundLeaks.length > 0) {
        console.log(`❌ ${r}: Leaks detected -> ${foundLeaks.join(', ')}`);
      } else {
        console.log(`✓ ${r}`);
      }
    } catch (e) {
      console.log(`ERROR on ${url}: ${e.message}`);
    }
  }
}

runAudit();
