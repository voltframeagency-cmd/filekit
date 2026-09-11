const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
  });
  return results;
}

const files = walk('./src');
const missing = [];
for (const f of files) {
  if (f.includes('LanguageContext.tsx')) continue;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((l, idx) => {
    if ((l.includes('isMalay') || l.includes('isThai') || l.includes('=== "th"') || l.includes('=== "ms"')) && !l.includes('const is')) {
      const win = lines.slice(Math.max(0, idx - 12), Math.min(lines.length, idx + 13)).join('\n');
      if (!win.includes('isFilipino') && !win.includes('"fil"') && !win.includes("'fil'")) {
        missing.push({ file: f, line: idx + 1, text: l.trim() });
      }
    }
  });
}
console.log('Total missing across entire src:', missing.length);
if (missing.length > 0) {
  console.log(JSON.stringify(missing, null, 2));
} else {
  console.log('ALL CLEAR! Zero Filipino (fil) leaks detected across the workspace.');
}
