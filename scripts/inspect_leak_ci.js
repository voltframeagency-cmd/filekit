const http = require('http');

http.get('http://localhost:3000/ms/compress-image', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const main = (d.match(/<main[\s\S]*?<\/main>/) || [''])[0];
    const idx = main.indexOf('Drop your');
    if (idx !== -1) {
      console.log('Context around "Drop your":');
      console.log(main.slice(Math.max(0, idx - 100), idx + 200));
    } else {
      console.log('Not found in main');
    }
  });
});
