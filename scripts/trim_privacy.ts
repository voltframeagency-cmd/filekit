import fs from 'fs';

let content = fs.readFileSync('src/utils/privacy/PrivacyWorkspace.tsx', 'utf8');
const secondUseClient = content.indexOf('"use client"', 15);
console.log('Second use client index:', secondUseClient);
if (secondUseClient !== -1) {
  content = content.slice(secondUseClient);
  fs.writeFileSync('src/utils/privacy/PrivacyWorkspace.tsx', content, 'utf8');
  console.log('Trimmed duplicate block from PrivacyWorkspace.tsx');
}
