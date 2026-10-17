import { spawn } from 'child_process';

const server = spawn('npx', ['next', 'start', '-p', '3005'], { stdio: 'pipe', shell: true });

server.stdout.on('data', async (data) => {
  const str = data.toString();
  if (str.includes('Ready') || str.includes('3005')) {
    console.log('Next.js server is ready on port 3005.');
    try {
      const routes = [
        '/compress-pdf',
        '/sv/compress-pdf',
        '/bg/watermark-pdf',
        '/pt-BR/compress-pdf',
        '/nonexistent-route-xyz-1234'
      ];

      for (const route of routes) {
        const res = await fetch(`http://localhost:3005${route}`);
        const text = await res.text();
        const titleMatch = text.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'NO_TITLE';
        console.log(`Route ${route}: status=${res.status}, title="${title}", length=${text.length}`);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      server.kill();
      process.exit(0);
    }
  }
});

server.stderr.on('data', (data) => {
  console.error('SERVER ERR:', data.toString());
});

setTimeout(() => {
  console.error('Timeout waiting for Next.js server');
  server.kill();
  process.exit(1);
}, 20000);
