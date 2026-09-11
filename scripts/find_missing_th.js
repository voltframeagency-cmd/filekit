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
  if (content.includes('"ms"') || content.includes("'ms'")) {
    if (!content.includes('"th"') && !content.includes("'th'")) {
      missing.push(f);
    }
  }
}
console.log('Total files checked:', files.length);
console.log('Files missing th:', JSON.stringify(missing, null, 2));
