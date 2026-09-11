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
  const hasOtherLangs = content.includes('isJapanese') || content.includes('isKorean') || content.includes('isThai') || content.includes('isSpanish');
  const hasZhTw = content.includes('zh-TW') || content.includes('isTaiwan') || content.includes('isZhTw') || content.includes('isTraditionalChinese');
  if (hasOtherLangs && !hasZhTw) {
    missing.push(f);
  }
}
console.log('Total files with language checks missing zh-TW:', missing.length);
console.log(JSON.stringify(missing, null, 2));
