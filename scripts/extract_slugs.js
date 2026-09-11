const fs = require('fs');
const content = fs.readFileSync('src/config/conversionCatalog.ts', 'utf8');
const slugs = [];
const regex = /slug:\s*"(\/[^"]+)"/g;
let m;
while ((m = regex.exec(content)) !== null) {
  slugs.push(m[1]);
}
const unique = Array.from(new Set(slugs));
console.log('Found', unique.length, 'unique slugs in conversionCatalog.ts');
fs.writeFileSync('all_tool_slugs.json', JSON.stringify(unique, null, 2));
