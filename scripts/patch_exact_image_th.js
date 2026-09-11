const fs = require('fs');

const file = 'src/components/image-tools/ExactImageTargetPage.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Dropzone title
content = content.replace(
  "ms: 'Lepaskan imej anda di sini atau semak imbas',",
  "th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู',\n                  ms: 'Lepaskan imej anda di sini atau semak imbas',"
);

// 2. Target info subtitle
content = content.replace(
  '{language === "hu" ? `Célméret: max ${config.targetLabel}',
  '{language === "th" ? `เป้าหมาย: สูงสุด ${config.targetLabel} • รองรับ JPG, PNG และ WebP แบบคงที่` : language === "hu" ? `Célméret: max ${config.targetLabel}'
);

// 3. Local notice
content = content.replace(
  "ms: '🔒 Imej anda diproses secara tempatan dalam pelayar anda dan tidak dimuat naik.',",
  "th: '🔒 รูปภาพของคุณได้รับการประมวลผลในเบราว์เซอร์และไม่มีการอัปโหลด',\n                    ms: '🔒 Imej anda diproses secara tempatan dalam pelayar anda dan tidak dimuat naik.',"
);

// 4. Change File
content = content.replace(
  '{language === "ms" ? "Tukar Fail" : "Change File"}',
  '{language === "th" ? "เปลี่ยนไฟล์" : language === "ms" ? "Tukar Fail" : "Change File"}'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ExactImageTargetPage.tsx');
