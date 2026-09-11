import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src');
const issues = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // If file checks for multiple languages
  if (content.includes('isFilipino') || content.includes('isThai') || content.includes('isVietnamese')) {
    if (!content.includes('isJapanese') && !content.includes('language === "ja"') && !content.includes("language === 'ja'")) {
      issues.push(f);
    }
  }
});

console.log('Files with language checks but missing isJapanese:', issues);
