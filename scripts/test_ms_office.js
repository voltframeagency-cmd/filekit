const http = require('http');
const routes = ['/ms/excel-to-pdf', '/ms/word-to-pdf', '/ms/powerpoint-to-pdf', '/ms/dwg-to-pdf', '/ms/eps-to-pdf'];
let done = 0;
routes.forEach(r => {
  http.get('http://localhost:3000' + r, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const h2 = data.match(/<h2[^>]*class="text-lg font-bold text-white">([^<]+)<\/h2>/)?.[1];
      const p = data.match(/<p[^>]*class="text-sm text-slate-400">([^<]+)<\/p>/)?.[1];
      const btn = data.match(/<label[^>]*class="cursor-pointer[^"]*">([^<]+)<input/)?.[1];
      console.log(r, '-> H2:', h2);
      console.log('   P:', p);
      console.log('   BTN:', btn);
      done++;
      if (done === routes.length) process.exit(0);
    });
  });
});
