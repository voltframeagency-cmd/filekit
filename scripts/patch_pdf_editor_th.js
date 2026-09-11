const fs = require('fs');

const file = 'src/components/pdf-editor/PdfPageEditorWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// Dropzone header
content = content.replace(
  'language === "ms"\n              ? "Lepaskan dokumen PDF di sini"',
  'language === "th"\n              ? "ลากไฟล์ PDF มาวางที่นี่"\n              : language === "ms"\n              ? "Lepaskan dokumen PDF di sini"'
);

// Dropzone subtitle
content = content.replace(
  'language === "ms"\n              ? "Menyokong pemprosesan dokumen PDF setempat sehingga 100 MB"',
  'language === "th"\n              ? "รองรับการจัดการเอกสาร PDF ในเครื่องสูงสุด 100 MB"\n              : language === "ms"\n              ? "Menyokong pemprosesan dokumen PDF setempat sehingga 100 MB"'
);

// Dropzone select files (multiple)
content = content.replace(
  'language === "ms" ? "Pilih Fail PDF" : t("workspace.selectFiles")',
  'language === "th" ? "เลือกไฟล์ PDF หลายไฟล์" : language === "ms" ? "Pilih Fail PDF" : t("workspace.selectFiles")'
);

// Dropzone select file (single)
content = content.replace(
  'language === "ms" ? "Pilih Fail PDF" : t("workspace.selectFile")',
  'language === "th" ? "เลือกไฟล์ PDF" : language === "ms" ? "Pilih Fail PDF" : t("workspace.selectFile")'
);

// Processing text
content = content.replace(
  'language === "id" ? "Memproses PDF..." : "Processing PDF..."',
  'language === "th" ? "กำลังประมวลผล PDF..." : language === "id" ? "Memproses PDF..." : "Processing PDF..."'
);

// Process PDF button
content = content.replace(
  'actionButtonText === "Process PDF" && language === "id"\n                    ? "Proses PDF"',
  'actionButtonText === "Process PDF" && language === "th"\n                    ? "ประมวลผล PDF"\n                    : actionButtonText === "Process PDF" && language === "id"\n                    ? "Proses PDF"'
);

// Pages suffix
content = content.replace(
  'language === "id" ? "halaman" : "Pages"',
  'language === "th" ? "หน้า" : language === "id" ? "halaman" : "Pages"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched PdfPageEditorWorkspace.tsx');
