import fs from 'fs';

const content = fs.readFileSync('src/components/pdf-tools/PdfCompressionWorkspace.tsx', 'utf8');

const regex = /\n  ([a-zA-Z0-9_-]+|\"[a-zA-Z0-9_-]+\"): \{/g;
let match;
const existingKeys = [];
while ((match = regex.exec(content)) !== null) {
  existingKeys.push(match[1].replace(/\"/g, ''));
}

const all39 = [
  "en", "es", "de", "fr", "pt", "pt-BR", "it", "nl", "sv", "da",
  "fi", "no", "pl", "cs", "hu", "ro", "bg", "el", "sk", "sl",
  "ru", "uk", "tr", "ar", "he", "hi", "id", "ms", "th", "vi",
  "fil", "ja", "ko", "zh-CN", "zh-TW", "ca", "es-419", "lv", "lt"
];

const missing = all39.filter(l => !existingKeys.includes(l) && !existingKeys.includes(l.toLowerCase()));
console.log('Existing count:', existingKeys.length);
console.log('Missing from PdfCompressionWorkspace:', missing);
