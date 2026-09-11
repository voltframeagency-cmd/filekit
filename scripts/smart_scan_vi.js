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
    if ((l.includes('isThai') || l.includes('isMalay') || l.includes('"th"') || l.includes('"ms"')) 
        && !l.includes('const is') 
        && !l.includes('SUPPORTED_LANGUAGES')
        && !l.includes('locale === "th"')
        && !l.includes('activeLocale === "th"')
        && !l.includes('effectiveLang === "th"')
        && !l.includes('//')) {
      const window = lines.slice(Math.max(0, idx - 6), Math.min(lines.length, idx + 7)).join('\n');
      if (!window.includes('isVietnamese') && !window.includes('"vi"') && !window.includes("'vi'")) {
        missingInFile.push({ line: idx + 1, text: l.trim().slice(0, 100) });
      }
    }
  });
  if (missingInFile.length > 0) {
    missing.push({ file: f, items: missingInFile });
  }
}
console.log(JSON.stringify(missing, null, 2));
