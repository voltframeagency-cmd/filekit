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
const missingFil = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const hasOtherLangs = content.includes('isVietnamese') || content.includes('isThai') || content.includes('isMalay');
  const hasFil = content.includes('isFilipino') || content.includes('=== "fil"') || content.includes('=== \'fil\'') || content.includes('fil:');
  if (hasOtherLangs && !hasFil) {
    missingFil.push(f);
  }
}

console.log('Files with other Asian languages but missing Filipino (fil):');
console.log(JSON.stringify(missingFil, null, 2));
