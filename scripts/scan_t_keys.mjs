import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(item)) {
        files = files.concat(scanDir(full));
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = scanDir('./src');
const keys = new Set();
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /t\(\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
}

const langCtx = fs.readFileSync('./src/components/layout/LanguageContext.tsx', 'utf8');
const trans = fs.readFileSync('./src/config/i18n/translations.ts', 'utf8');

console.log('Total unique t() keys found:', keys.size);
const missing = [];
for (const k of Array.from(keys).sort()) {
  const inTrans = trans.includes(`"${k}"`) || trans.includes(`'${k}'`);
  const inCtx = langCtx.includes(`"${k}"`) || langCtx.includes(`'${k}'`);
  if (!inTrans && !inCtx) {
    missing.push(k);
  }
}
console.log('Missing keys from both files:', missing);
