import fs from 'fs';

async function check(url) {
  const res = await fetch(url);
  const html = await res.text();
  console.log(`\n================== ${url} ==================`);

  // Dropzone headings / spans / labels
  const h2s = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1].trim());
  const dropzonePs = [...html.matchAll(/<p[^>]*class="[^"]*(?:font-bold|text-fk-text)[^"]*"[^>]*>([^<]+)<\/p>/g)].map(m => m[1].trim());
  const spans = [...html.matchAll(/<span[^>]*class="[^"]*(?:font-bold|text-slate-800)[^"]*"[^>]*>([^<]+)<\/span>/g)].map(m => m[1].trim());
  const labels = [...html.matchAll(/<label[^>]*class="[^"]*(?:cursor-pointer|bg-fk-primary)[^"]*"[^>]*>([^<]+)<input/g)].map(m => m[1].trim());

  console.log('h2:', h2s);
  console.log('dropzonePs:', dropzonePs);
  console.log('spans:', spans);
  console.log('labels:', labels);
}

const targets = [
  'http://localhost:3000/lv/compress-pdf',
  'http://localhost:3000/lv/compress-pdf-to-size',
  'http://localhost:3000/lv/resize-image',
  'http://localhost:3000/lv/flip-image',
  'http://localhost:3000/lv/rotate-image',
  'http://localhost:3000/lv/crop-image',
  'http://localhost:3000/lv/blur-image',
  'http://localhost:3000/lv/invert-image',
  'http://localhost:3000/lv/grayscale-image',
  'http://localhost:3000/lv/woff2-to-ttf',
  'http://localhost:3000/lv/ttf-to-woff2',
  'http://localhost:3000/lv/strip-exif',
  'http://localhost:3000/lv/tar-to-zip',
  'http://localhost:3000/lv/create-zip',
  'http://localhost:3000/lv/7z-to-zip',
  'http://localhost:3000/lv/rar-to-zip',
  'http://localhost:3000/lv/extract-rar',
  'http://localhost:3000/lv/extract-zip'
];

async function main() {
  for (const t of targets) {
    await check(t);
  }
}
main();
