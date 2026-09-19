import fs from 'fs';

const path = 'src/config/i18n/trustTranslations.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace all 4.99 in footerNote lines
content = content.replace(/footerNote:\s*"[^"]*4\.99[^"]*"/g, (match) => {
  return 'footerNote: "Free basic tools. Job Pass €4.90 for 7 days (never renews). No hidden subscriptions."';
});

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated trustTranslations footerNotes to €4.90 Job Pass');

// Also check LanguageContext.tsx
const ctxPath = 'src/components/layout/LanguageContext.tsx';
let ctxContent = fs.readFileSync(ctxPath, 'utf8');
ctxContent = ctxContent.replace(/"homepage\.footerNote":\s*"[^"]*4\.99[^"]*"/g, (match) => {
  return '"homepage.footerNote": "Free basic tools. Job Pass €4.90 for 7 days (never renews). No hidden subscriptions."';
});
fs.writeFileSync(ctxPath, ctxContent, 'utf8');
console.log('Successfully updated LanguageContext footerNotes to €4.90 Job Pass');
