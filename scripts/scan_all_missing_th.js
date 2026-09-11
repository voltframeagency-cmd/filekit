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
    // Check if line has language check for ms but not th
    const hasMs = l.includes('isMalay') || l.includes('"ms"') || l.includes("'ms'");
    const hasTh = l.includes('isThai') || l.includes('"th"') || l.includes("'th'");
    // Exclude the definition line like const isThai = ... or locale arrays
    if (hasMs && !hasTh && !l.includes('const isMalay') && !l.includes('const isThai')) {
      count++;
    }
  });
  if (count > 0) {
    missing.push({ file: f, count });
  }
}
console.log('MISSING_TH_LINES:');
console.log(JSON.stringify(missing, null, 2));
