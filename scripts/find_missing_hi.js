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
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('language === "ru"') || content.includes('language === "uk"') || content.includes('language === "el"') || content.includes('language === "sk"') || content.includes('language === "sl"') || content.includes('language === "bg"')) {
    const hasHi = content.includes('language === "hi"');
    if (!hasHi) {
      console.log('MISSING HI:', f);
    }
  }
}
