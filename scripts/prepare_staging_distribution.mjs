import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

const ROOT_DIR = process.cwd();
const NEXT_DIR = path.join(ROOT_DIR, '.next');
const NEXT_APP_DIR = path.join(NEXT_DIR, 'server', 'app');
const NEXT_STATIC_DIR = path.join(NEXT_DIR, 'static');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_DIR = path.join(ROOT_DIR, 'dist-staging');

console.log('▶ Preparing Cloudflare Staging Distribution...');

// 1. Recreate clean dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// 2. Copy static assets (_next/static)
const distNextStatic = path.join(DIST_DIR, '_next', 'static');
fs.mkdirSync(distNextStatic, { recursive: true });
fs.cpSync(NEXT_STATIC_DIR, distNextStatic, { recursive: true });
console.log('✓ Copied _next/static JS/CSS assets');

// 3. Copy public assets (including pdf.worker.min.mjs and brand assets)
fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });
console.log('✓ Copied public assets (including pdf.worker.min.mjs)');

// 3b. Copy Cloudflare Pages Functions for server runtime execution
const FUNCTIONS_DIR = path.join(ROOT_DIR, 'functions');
if (fs.existsSync(FUNCTIONS_DIR)) {
  const distFunctions = path.join(DIST_DIR, 'functions');
  fs.cpSync(FUNCTIONS_DIR, distFunctions, { recursive: true });
  console.log('✓ Packaged Cloudflare Pages Functions into dist-staging/functions');
}

// 4. Copy index.html
const indexHtml = path.join(NEXT_APP_DIR, 'index.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, path.join(DIST_DIR, 'index.html'));
  console.log('✓ Copied root index.html');
}

// 5. Copy all prerendered HTML tool pages
const appEntries = fs.readdirSync(NEXT_APP_DIR, { withFileTypes: true });
let pageCount = 0;

for (const entry of appEntries) {
  if (entry.isFile() && entry.name.endsWith('.html')) {
    const routeName = entry.name.replace(/\.html$/, '');
    if (routeName === 'index') continue;

    const sourcePath = path.join(NEXT_APP_DIR, entry.name);
    
    // Write both <route>.html and <route>/index.html for robust edge URL resolution
    const routeDir = path.join(DIST_DIR, routeName);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.copyFileSync(sourcePath, path.join(routeDir, 'index.html'));
    fs.copyFileSync(sourcePath, path.join(DIST_DIR, entry.name));
    pageCount++;
  }
}
console.log(`✓ Packaged ${pageCount} tool routes into static directories`);

// 6. Handle 404.html for genuine edge 404 responses
const notFoundHtml = path.join(NEXT_APP_DIR, '_not-found.html');
if (fs.existsSync(notFoundHtml)) {
  fs.copyFileSync(notFoundHtml, path.join(DIST_DIR, '404.html'));
  console.log('✓ Placed 404.html (for Cloudflare Pages genuine 404 handling)');
}

// 7. Handle robots.txt and sitemap.xml
const robotsBody = path.join(NEXT_APP_DIR, 'robots.txt.body');
if (fs.existsSync(robotsBody)) {
  fs.copyFileSync(robotsBody, path.join(DIST_DIR, 'robots.txt'));
  console.log('✓ Placed robots.txt');
}

const sitemapBody = path.join(NEXT_APP_DIR, 'sitemap.xml.body');
if (fs.existsSync(sitemapBody)) {
  fs.copyFileSync(sitemapBody, path.join(DIST_DIR, 'sitemap.xml'));
  console.log('✓ Placed sitemap.xml');
}

// 8. Pre-render localized routes by starting temporary local Next.js server
async function prerenderLocalizedRoutes() {
  console.log('▶ Pre-rendering localized routes for staging deployment...');
  const port = 3008;
  const server = spawn('npx', ['next', 'start', '-p', String(port)], { stdio: 'pipe', shell: true });

  await new Promise((resolve, reject) => {
    let resolved = false;
    server.stdout.on('data', (d) => {
      const s = d.toString();
      if (s.includes('Ready') || s.includes(String(port))) {
        resolved = true;
        resolve(true);
      }
    });
    server.on('error', reject);
    setTimeout(() => {
      if (!resolved) resolve(true); // Proceed to try fetching
    }, 8000);
  });

  // Target localized routes specified in staging verification requirements
  const targetRoutes = [
    '/sv/compress-pdf',
    '/bg/watermark-pdf',
    '/pt-BR/compress-pdf',
    '/es-419/compress-pdf',
    '/de/compress-pdf',
    '/fr/compress-pdf'
  ];

  for (const route of targetRoutes) {
    try {
      const res = await fetch(`http://localhost:${port}${route}`);
      if (res.ok) {
        const html = await res.text();
        const routePath = route.replace(/^\//, ''); // e.g. "sv/compress-pdf"
        const outDir = path.join(DIST_DIR, routePath);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
        console.log(`  ✓ Pre-rendered ${route} (${html.length} bytes)`);
      } else {
        console.warn(`  ⚠ Warning: Failed to pre-render ${route}: HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn(`  ⚠ Error pre-rendering ${route}: ${err.message}`);
    }
  }

  // Kill temporary server cleanly on Windows
  try {
    const { execSync } = await import('child_process');
    execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
  } catch {
    server.kill();
  }
}

await prerenderLocalizedRoutes();

console.log('✨ Staging distribution prepared successfully in dist-staging/');
process.exit(0);
