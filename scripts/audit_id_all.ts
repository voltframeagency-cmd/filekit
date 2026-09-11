import http from 'http';
import fs from 'fs';

const slugs = JSON.parse(fs.readFileSync('all_tool_slugs.json', 'utf8'));

// English leak strings to audit in Indonesian pages
const leakPatterns = [
  { pattern: 'Drop your PDF here or browse', name: 'Drop your PDF here or browse' },
  { pattern: 'Drop files here to compress', name: 'Drop files here to compress' },
  { pattern: 'Drop files here to convert', name: 'Drop files here to convert' },
  { pattern: 'Drop images here', name: 'Drop images here' },
  { pattern: 'Drop font files here', name: 'Drop font files here' },
  { pattern: 'Drop TAR file here', name: 'Drop TAR file here' },
  { pattern: 'Drop files here to create ZIP', name: 'Drop files here to create ZIP' },
  { pattern: 'Drop 7Z file here', name: 'Drop 7Z file here' },
  { pattern: 'Drop RAR file here', name: 'Drop RAR file here' },
  { pattern: 'Drop ZIP file here', name: 'Drop ZIP file here' },
  { pattern: 'Drop your subtitle file here', name: 'Drop your subtitle file here' },
  { pattern: 'Drop your audio file here', name: 'Drop your audio file here' },
  { pattern: 'Drop your video file here', name: 'Drop your video file here' },
  { pattern: 'Drop document here', name: 'Drop document here' },
  { pattern: 'Drop your document here', name: 'Drop your document here' },
  { pattern: 'Select Scanned Document or Image', name: 'Select Scanned Document or Image' },
  { pattern: 'Choose PDF or Image', name: 'Choose PDF or Image' },
  { pattern: '100% private in-browser OCR', name: '100% private in-browser OCR' },
  { pattern: 'Change File', name: 'Change File' },
  { pattern: 'Recognize & Extract Text', name: 'Recognize & Extract Text' },
  { pattern: 'Performing OCR Recognition...', name: 'Performing OCR Recognition...' },
  { pattern: 'Choose File', name: 'Choose File' },
  { pattern: 'Choose file', name: 'Choose file' },
  { pattern: 'Select File', name: 'Select File' },
  { pattern: 'Select file', name: 'Select file' },
  { pattern: 'Browse files', name: 'Browse files' },
  { pattern: 'or drag and drop', name: 'or drag and drop' },
  { pattern: 'Maximum file size', name: 'Maximum file size' },
  { pattern: 'Select Audio File', name: 'Select Audio File' },
  { pattern: 'Select Video File', name: 'Select Video File' },
  { pattern: 'Select Document to Convert', name: 'Select Document to Convert' },
  { pattern: 'Convert to PDF', name: 'Convert to PDF' },
  { pattern: 'Download File', name: 'Download File' },
  { pattern: 'Download PDF', name: 'Download PDF' },
  { pattern: 'Choose Another', name: 'Choose Another' },
  { pattern: 'Strip All EXIF', name: 'Strip All EXIF' },
  { pattern: 'Download Sanitized Image', name: 'Download Sanitized Image' },
  { pattern: 'Adjust Settings', name: 'Adjust Settings' },
  { pattern: 'Download Converted Image', name: 'Download Converted Image' },
  { pattern: 'Target Format', name: 'Target Format' },
  { pattern: 'Output Format', name: 'Output Format' },
  { pattern: 'Download Compressed Image', name: 'Download Compressed Image' }
];

async function fetchRoute(slug: string): Promise<{ slug: string; statusCode: number; html: string }> {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/id' + slug, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ slug, statusCode: res.statusCode || 200, html: data });
      });
    }).on('error', err => {
      resolve({ slug, statusCode: 500, html: '' });
    });
  });
}

(async () => {
  console.log('Auditing', slugs.length, 'routes under /id ...');
  const leaksFound: { slug: string; leaks: string[] }[] = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const res = await fetchRoute(slug);
    if (res.statusCode !== 200) {
      console.log(`[HTTP ${res.statusCode}] /id${slug}`);
      continue;
    }

    const mainMatch = res.html.match(/<main[\s\S]*?<\/main>/);
    const mainHtml = mainMatch ? mainMatch[0] : res.html;

    const matchedLeaks: string[] = [];
    for (const p of leakPatterns) {
      if (mainHtml.includes(p.pattern)) {
        matchedLeaks.push(p.name);
      }
    }

    if (matchedLeaks.length > 0) {
      console.log(`❌ LEAK in /id${slug} =>`, matchedLeaks.join(', '));
      leaksFound.push({ slug, leaks: matchedLeaks });
    }
  }

  console.log('\n=======================================');
  console.log('Audit complete. Total routes with leaks:', leaksFound.length);
  console.log('=======================================');
  fs.writeFileSync('id_leaks_audit.json', JSON.stringify(leaksFound, null, 2));
})();
