const http = require('http');

function get(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
  });
}

function stripHtml(html) {
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  clean = clean.replace(/<[^>]+>/g, ' ');
  return clean;
}

const suspiciousWords = [
  'Select', 'Choose', 'Drop', 'Download', 'Upload', 'Browse',
  'Process', 'Processing', 'Convert', 'Compress', 'Delete', 'Extract',
  'Rotate', 'Resize', 'Crop', 'Merge', 'Split', 'Watermark',
  'Files', 'Pages', 'Settings', 'Quality', 'Ready',
  'Change', 'Remove', 'Reset', 'Clear', 'Start', 'Cancel',
  'Loading', 'Done', 'Error', 'Success', 'Preview', 'Live', 'Original',
  'Compressed', 'Target', 'Custom', 'Preset', 'Dimensions', 'Width',
  'Height', 'Aspect', 'Ratio', 'Details', 'Detected', 'Camera', 'Location'
];

async function scanRoute(path) {
  const html = await get(path);
  const text = stripHtml(html);
  const words = text.split(/\s+/);
  
  const foundWords = {};
  for (const w of words) {
    const cleanW = w.replace(/[^A-Za-z]/g, '');
    if (suspiciousWords.includes(cleanW)) {
      foundWords[cleanW] = (foundWords[cleanW] || 0) + 1;
    }
  }
  return { path, foundWords };
}

async function run() {
  const routes = [
    '/vi',
    '/vi/all-tools',
    '/vi/compress-pdf',
    '/vi/merge-pdf',
    '/vi/split-pdf',
    '/vi/word-to-pdf',
    '/vi/jpg-to-png',
    '/vi/resize-image',
    '/vi/crop-image',
    '/vi/strip-exif',
    '/vi/convert-audio',
    '/vi/compress-video',
    '/vi/extract-zip',
    '/vi/ttf-to-woff2'
  ];

  for (const r of routes) {
    const res = await scanRoute(r);
    console.log('--- ' + r + ' ---');
    console.log(JSON.stringify(res.foundWords));
  }
}
run();
