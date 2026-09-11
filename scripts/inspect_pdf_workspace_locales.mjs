import fs from 'fs';

const content = fs.readFileSync('src/components/pdf-tools/PdfCompressionWorkspace.tsx', 'utf8');

// Find all top-level keys in workspaceI18n
const regex = /\n  ([a-zA-Z0-9_-]+|\"[a-zA-Z0-9_-]+\"): \{/g;
let match;
const keys = [];
while ((match = regex.exec(content)) !== null) {
  keys.push(match[1].replace(/\"/g, ''));
}

console.log('Total keys found in workspaceI18n:', keys.length);
console.log('Keys:', keys.join(', '));

const checkLocales = ['en', 'ru', 'uk', 'sl', 'sk', 'bg'];
for (const loc of checkLocales) {
  console.log(`Locale ${loc} present:`, keys.includes(loc));
}
