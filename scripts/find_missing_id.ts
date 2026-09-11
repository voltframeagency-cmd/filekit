import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
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
const missing: string[] = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (
    content.includes('"hi"') ||
    content.includes('"ru"') ||
    content.includes('"uk"') ||
    content.includes('"sk"') ||
    content.includes('"lv"') ||
    content.includes('"lt"')
  ) {
    const hasId = content.includes('"id"') || content.includes('isIndonesian');
    if (!hasId) {
      missing.push(f);
    }
  }
}
console.log('Files missing id/isIndonesian count:', missing.length);
console.log(missing);
