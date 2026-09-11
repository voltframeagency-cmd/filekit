const fs = require('fs');

const file = 'src/components/pdf-overlay/PdfOverlayWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Dropzone Title
content = content.replace(
  'language === "ms"\n              ? "Lepaskan PDF di sini"',
  'language === "th"\n              ? "ลากไฟล์ PDF มาวางที่นี่"\n              : language === "ms"\n              ? "Lepaskan PDF di sini"'
);

// 2. Dropzone Subtitle
content = content.replace(
  'language === "ms"\n              ? "atau klik untuk memilih dari komputer anda (Sehingga 100 MB)"',
  'language === "th"\n              ? "หรือคลิกเพื่อเลือกจากคอมพิวเตอร์ของคุณ (สูงสุด 100 MB)"\n              : language === "ms"\n              ? "atau klik untuk memilih dari komputer anda (Sehingga 100 MB)"'
);

// 3. Dropzone Select File button
content = content.replace(
  'language === "ms"\n              ? "Pilih Fail PDF"',
  'language === "th"\n              ? "เลือกไฟล์ PDF"\n              : language === "ms"\n              ? "Pilih Fail PDF"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched PdfOverlayWorkspace.tsx');
