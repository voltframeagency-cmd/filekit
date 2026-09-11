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
const underused = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const msMatches = content.match(/isMalay/g) || [];
  const thMatches = content.match(/isThai/g) || [];
  if (msMatches.length > 2 && thMatches.length <= 2) {
    underused.push({ file: f, msCount: msMatches.length, thCount: thMatches.length });
  }
}
console.log('RESULTS_START');
console.log(JSON.stringify(underused, null, 2));
console.log('RESULTS_END');
