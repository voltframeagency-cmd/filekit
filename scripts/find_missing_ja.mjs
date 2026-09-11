import fs from 'fs';
import path from 'path';

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
    const hasOtherLang = l.includes('isSpanish') || l.includes('isGerman') || l.includes('isFrench') || l.includes('isRussian') || l.includes('isSwedish');
    const hasJa = l.includes('isJapanese') || l.includes('"ja"') || l.includes("'ja'");
    if (hasOtherLang && !hasJa && !l.includes('const is') && !l.includes('SupportedLocale')) {
      count++;
    }
  });
  if (count > 0) {
    missing.push({ file: f, count });
  }
}
console.log('FILES_MISSING_JAPANESE_BRANCHES:');
console.log(JSON.stringify(missing, null, 2));
