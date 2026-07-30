import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('▶ Executing SEO Registry & Governance CI Audit Pass...');

// 1. Read contentRegistry.ts
const registryPath = path.join(rootDir, 'src', 'lib', 'seo', 'contentRegistry.ts');
if (!fs.existsSync(registryPath)) {
  console.error('❌ FAIL: contentRegistry.ts file not found at:', registryPath);
  process.exit(1);
}

const registryContent = fs.readFileSync(registryPath, 'utf-8');

// Verification checks:
// A. Ensure no "/dev/" route is marked indexable
if (registryContent.includes("canonicalRoute: '/dev/") && registryContent.includes("indexable: true")) {
  console.error('❌ FAIL: Found development route (/dev/*) marked indexable: true');
  process.exit(1);
}

// B. Ensure no "zero file limits" claim exists
if (/zero file limits/i.test(registryContent) || /unlimited file size/i.test(registryContent)) {
  console.error('❌ FAIL: Found banned claim ("zero file limits" / "unlimited file size") in registry content');
  process.exit(1);
}

// C. Verify sitemap.ts excludes /dev/
const sitemapPath = path.join(rootDir, 'src', 'app', 'sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  if (sitemapContent.includes('/dev/brand-assets')) {
    console.error('❌ FAIL: sitemap.ts includes dev route /dev/brand-assets');
    process.exit(1);
  }
}

console.log('✓ SEO Registry & Governance CI Audit Passed cleanly!');
