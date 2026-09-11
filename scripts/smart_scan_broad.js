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
  const missingInFile = [];
  lines.forEach((l, idx) => {
    if ((l.includes('isMalay') || l.includes('isThai') || l.includes('isVietnamese') || l.includes('isIndonesian')) && 
        !l.includes('const isMalay') && !l.includes('const isThai') && !l.includes('const isVietnamese') && !l.includes('const isIndonesian') &&
        !l.includes('locales') && !l.includes('SUPPORTED_LANGUAGES') && !l.includes('megaMenuTranslations')) {
      const window = lines.slice(Math.max(0, idx - 6), Math.min(lines.length, idx + 7)).join('\n');
      if (!window.includes('isFilipino') && !window.includes('"fil"') && !window.includes("'fil'")) {
        missingInFile.push({ line: idx + 1, text: l.trim().slice(0, 100) });
      }
    }
  });
  if (missingInFile.length > 0) {
    missing.push({ file: f, count: missingInFile.length, sample: missingInFile.slice(0, 3) });
  }
}
console.log(JSON.stringify(missing, null, 2));
