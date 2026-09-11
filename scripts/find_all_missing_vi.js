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

const files = walk('./src');
const missing = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  // Check if file uses isSpanish, isFrench, isGerman, or isItalian
  const hasOtherLangs = content.includes('isSpanish') || content.includes('isGerman') || content.includes('isFrench') || content.includes('isItalian');
  const hasVietnamese = content.includes('isVietnamese') || content.includes('=== "vi"') || content.includes('=== \'vi\'') || content.includes('vi:');
  if (hasOtherLangs && !hasVietnamese) {
    missing.push(f);
  }
}

console.log('Files with other languages but missing Vietnamese:');
console.log(JSON.stringify(missing, null, 2));
