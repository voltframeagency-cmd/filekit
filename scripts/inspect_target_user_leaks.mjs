import fs from 'fs';

const targets = [
  'http://localhost:3000/fil/rar-to-zip',
  'http://localhost:3000/ja/rar-to-zip',
  'http://localhost:3000/cs/change-video-speed',
  'http://localhost:3000/hi/rotate-image',
  'http://localhost:3000/mp4-to-wav'
];

async function main() {
  for (const url of targets) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      console.log(`\n================== ${url} ==================`);
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      console.log('Title:', titleMatch ? titleMatch[1] : 'none');
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      console.log('H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, '') : 'none');

      const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const h3s = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      console.log('h2:', h2s);
      console.log('h3 (sample):', h3s.slice(0, 6));

      // Extract dropzone or workspace texts
      const dropzoneArea = html.match(/<div[^>]*data-dropzone[^>]*>([\s\S]*?)<\/div>/) || html.match(/class="[^"]*dropzone[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      
      // Let's find any text matches like "Drop your", "Choose file", "Drag and drop", "Convert", "Select", "Processing", "Download"
      const englishPatterns = [
        /Drop your/gi,
        /Choose file/gi,
        /Drag and drop/gi,
        /Select file/gi,
        /Free online/gi,
        /How to/gi,
        /Frequently Asked Questions/gi,
        /Fast and Easy/gi,
        /Privacy Protected/gi,
        /No Software Required/gi,
        /Works on Any Device/gi
      ];

      for (const p of englishPatterns) {
        if (p.test(html)) {
          console.log(`  Found English pattern match: ${p.source}`);
        }
      }
    } catch (e) {
      console.error(url, e.message);
    }
  }
}
main();
