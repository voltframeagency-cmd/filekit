const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        files = files.concat(walk(full));
      }
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(path.join(process.cwd(), 'src'));
console.log('Scanning ' + allFiles.length + ' files for inline ternary leak cascades...');
const results = [];
for (const file of allFiles) {
  const rel = path.relative(process.cwd(), file);
  if (rel.includes('Translations') || rel.includes('translations') || rel.includes('locales.ts')) continue;
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('isTaiwan') || content.includes('zh-TW') || content.includes('isJapanese') || content.includes('isKorean')) {
    results.push(rel);
  }
}

console.log('Files with inline language cascades:');
results.forEach(r => console.log(' - ' + r));
