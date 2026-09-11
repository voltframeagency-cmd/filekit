const fs = require('fs');

const file = 'src/components/navigation/MobileNavigation.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. In getLocalizedCategoryGroup
content = content.replace(
  '            const isMalay = activeLocale === "ms";',
  '            const isMalay = activeLocale === "ms";\n            const isThai = activeLocale === "th";'
);

content = content.replace(
  'if (label.includes("IMAGE")) {\n              if (isMalay) return "IMEJ";',
  'if (label.includes("IMAGE")) {\n              if (isThai) return "รูปภาพ";\n              if (isMalay) return "IMEJ";'
);

content = content.replace(
  'if (label.includes("PDF")) {\n              if (isArabic) return "ملفات PDF";',
  'if (label.includes("PDF")) {\n              if (isThai) return "PDF";\n              if (isArabic) return "ملفات PDF";'
);

content = content.replace(
  'if (label.includes("VIDEO")) {\n              if (isMalay) return "VIDEO";',
  'if (label.includes("VIDEO")) {\n              if (isThai) return "วิดีโอ";\n              if (isMalay) return "VIDEO";'
);

content = content.replace(
  'if (label.includes("SUBTITLE")) {\n              if (isMalay) return "SARIKATA";',
  'if (label.includes("SUBTITLE")) {\n              if (isThai) return "คำบรรยาย";\n              if (isMalay) return "SARIKATA";'
);

content = content.replace(
  'if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {\n              if (isMalay) return "DOKUMEN";',
  'if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {\n              if (isThai) return "เอกสาร";\n              if (isMalay) return "DOKUMEN";'
);

content = content.replace(
  'if (label.includes("CAD")) {\n              if (isMalay) return "CAD & VEKTOR";',
  'if (label.includes("CAD")) {\n              if (isThai) return "CAD และเวกเตอร์";\n              if (isMalay) return "CAD & VEKTOR";'
);

content = content.replace(
  'if (label.includes("AUDIO")) {\n              if (isMalay) return "AUDIO";',
  'if (label.includes("AUDIO")) {\n              if (isThai) return "เสียง";\n              if (isMalay) return "AUDIO";'
);

content = content.replace(
  'if (label.includes("ARCHIVE")) {\n              if (isMalay) return "ARKIB";',
  'if (label.includes("ARCHIVE")) {\n              if (isThai) return "คลังข้อมูล";\n              if (isMalay) return "ARKIB";'
);

// 2. In getLocalizedLinkLabel
content = content.replace(
  'const toPrep = isMalay ? "ke" : isSwedish ? "till"',
  'const toPrep = activeLocale === "th" ? "เป็น" : isMalay ? "ke" : isSwedish ? "till"'
);

content = content.replace(
  'if (label.startsWith("Compress ")) {\n              const item = label.replace("Compress ", "");\n              if (isMalay) return `Mampatkan ${item}`;',
  'if (label.startsWith("Compress ")) {\n              const item = label.replace("Compress ", "");\n              if (activeLocale === "th") return `บีบอัด ${item}`;\n              if (isMalay) return `Mampatkan ${item}`;'
);

content = content.replace(
  'if (label.startsWith("Convert ")) {\n              const item = label.replace("Convert ", "");\n              if (isMalay) return `Tukar ${item}`;',
  'if (label.startsWith("Convert ")) {\n              const item = label.replace("Convert ", "");\n              if (activeLocale === "th") return `แปลง ${item}`;\n              if (isMalay) return `Tukar ${item}`;'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched MobileNavigation.tsx');
