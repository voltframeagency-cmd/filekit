import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src');
const hits = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const hasLangCheck = /isFilipino|isThai|isVietnamese|isMalay|isIndonesian|isHindi|isRussian|isUkrainian|isGreek|isSpanish|isFrench|isGerman|isItalian|isDutch|isPolish|isSwedish/.test(line);
    const hasJa = /isJapanese|["']ja["']/.test(line);
    if (hasLangCheck && !hasJa && line.includes('?') && line.includes(':')) {
      if (!hits[f]) hits[f] = [];
      hits[f].push({ line: idx + 1, text: line.trim() });
    }
  });
});

console.log('Files with ternary language checks missing Japanese:');
let total = 0;
for (const [file, items] of Object.entries(hits)) {
  total += items.length;
  console.log(`\n${file} (${items.length} occurrences):`);
  items.slice(0, 10).forEach(it => console.log(`  L${it.line}: ${it.text.substring(0, 110)}`));
}
console.log(`\nTotal occurrences: ${total}`);
