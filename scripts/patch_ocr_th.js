const fs = require('fs');

const file = 'src/components/ocr-tools/OcrPdfWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Add isThai
content = content.replace(
  '  const isMalay = language === "ms";',
  '  const isMalay = language === "ms";\n  const isThai = language === "th";'
);

// 2. Reading file data stage
content = content.replace(
  'isMalay\n        ? "Membaca data fail ke dalam memori..." :',
  'isThai\n        ? "กำลังอ่านข้อมูลไฟล์ลงในหน่วยความจำ..."\n        : isMalay\n        ? "Membaca data fail ke dalam memori..." :'
);

// 3. Error recognizing text
content = content.replace(
  'isMalay\n            ? "Gagal mengecam teks dalam dokumen."',
  'isThai\n            ? "ไม่สามารถจดจำข้อความในเอกสารได้"\n            : isMalay\n            ? "Gagal mengecam teks dalam dokumen."'
);

// 4. Dropzone header
content = content.replace(
  'isSwedish\n                ? "Välj skannat dokument eller bild"',
  'isThai\n                ? "เลือกเอกสารที่สแกนหรือรูปภาพ"\n                : isSwedish\n                ? "Välj skannat dokument eller bild"'
);

// 5. Dropzone subtitle
content = content.replace(
  'isMalay\n                ? "100% OCR peribadi dalam pelayar. Fail tidak pernah meninggalkan peranti anda."',
  'isThai\n                ? "OCR ในเบราว์เซอร์ส่วนตัว 100% ไฟล์จะไม่ถูกอัปโหลดออกจากอุปกรณ์ของคุณ"\n                : isMalay\n                ? "100% OCR peribadi dalam pelayar. Fail tidak pernah meninggalkan peranti anda."'
);

// 6. Choose PDF or Image button
content = content.replace(
  'isMalay\n              ? "Pilih PDF atau Imej"',
  'isThai\n              ? "เลือก PDF หรือรูปภาพ"\n              : isMalay\n              ? "Pilih PDF atau Imej"'
);

// 7. OCR completed text
content = content.replace(
  'isMalay\n                      ? `OCR Selesai (${result.totalPages} halaman dalam ${result.durationMs}ms)`',
  'isThai\n                      ? `OCR สำเร็จแล้ว (${result.totalPages} หน้า ในเวลา ${result.durationMs}ms)`\n                      : isMalay\n                      ? `OCR Selesai (${result.totalPages} halaman dalam ${result.durationMs}ms)`'
);

// 8. Copied text
content = content.replace(
  'isMalay\n                          ? "✓ Disalin!"',
  'isThai\n                          ? "✓ คัดลอกแล้ว!"\n                          : isMalay\n                          ? "✓ Disalin!"'
);

// 9. Copy Text button
content = content.replace(
  'isMalay\n                      ? "Salin Teks"',
  'isThai\n                      ? "คัดลอกข้อความ"\n                      : isMalay\n                      ? "Salin Teks"'
);

// 10. Download .TXT
content = content.replace(
  'isSpanish ? "Descargar .TXT" : "Download .TXT"',
  'isThai ? "ดาวน์โหลด .TXT" : isSpanish ? "Descargar .TXT" : "Download .TXT"'
);

// 11. Download Searchable PDF
content = content.replace(
  'isMalay\n                        ? "Muat Turun PDF Boleh Dicari"',
  'isThai\n                        ? "ดาวน์โหลด PDF ที่ค้นหาข้อความได้"\n                        : isMalay\n                        ? "Muat Turun PDF Boleh Dicari"'
);

// 12. Extracted Text label
content = content.replace(
  'isSpanish ? "Texto extraído" : "Extracted Text"',
  'isThai ? "ข้อความที่แยกได้" : isSpanish ? "Texto extraído" : "Extracted Text"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched OcrPdfWorkspace.tsx');
