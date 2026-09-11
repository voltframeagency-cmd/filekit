const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = [...walk('./src/components'), ...walk('./src/utils')];
const missing = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  let count = 0;
  lines.forEach((l, idx) => {
    const hasJa = l.includes('isJapanese') || l.includes('"ja"') || l.includes("'ja'");
    const hasKo = l.includes('isKorean') || l.includes('"ko"') || l.includes("'ko'");
    if (hasJa && !hasKo && !l.includes('const isJapanese') && !l.includes('const isKorean') && !l.includes('SUPPORTED_LOCALES')) {
      count++;
    }
  });
  if (count > 0) {
    missing.push({ file: f, count });
  }
}
console.log('MISSING_KO_COMPARED_TO_JA:');
console.log(JSON.stringify(missing, null, 2));
