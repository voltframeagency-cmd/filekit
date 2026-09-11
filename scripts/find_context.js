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

function stripTags(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
             .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
}

async function findContext(path, term) {
  const html = await get(path);
  const clean = stripTags(html);
  let idx = 0;
  console.log('=== In ' + path + ' looking for ' + term + ' ===');
  while ((idx = clean.indexOf(term, idx)) !== -1) {
    console.log(clean.substring(Math.max(0, idx - 40), Math.min(clean.length, idx + 60)).replace(/\s+/g, ' '));
    idx += term.length;
  }
}

async function run() {
  await findContext('/vi/compress-pdf', 'Convert');
  await findContext('/vi/compress-pdf', 'Compress');
  await findContext('/vi/compress-pdf', 'Files');
  await findContext('/vi/resize-image', 'Select');
  await findContext('/vi/resize-image', 'Resize');
  await findContext('/vi/resize-image', 'Choose');
}
run();
