const fs = require('fs');

const file = 'src/components/image-tools/ImageConverterWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Add isThai
content = content.replace(
  '  const isMalay = language === "ms";',
  '  const isMalay = language === "ms";\n  const isThai = language === "th";'
);

// 2. Select another file
content = content.replace(
  'isMalay\n                    ? "Pilih Yang Lain"',
  'isThai\n                    ? "เลือกไฟล์อื่น"\n                    : isMalay\n                    ? "Pilih Yang Lain"'
);

// 3. Download converted image
content = content.replace(
  'isMalay\n                        ? "Muat Turun Imej Ditukar"',
  'isThai\n                        ? "ดาวน์โหลดรูปภาพที่แปลงแล้ว"\n                        : isMalay\n                        ? "Muat Turun Imej Ditukar"'
);

// 4. Adjust settings
content = content.replace(
  'isMalay\n                        ? "Laraskan Tetapan"',
  'isThai\n                        ? "ปรับการตั้งค่า"\n                        : isMalay\n                        ? "Laraskan Tetapan"'
);

// 5. Conversion Options header
content = content.replace(
  'isMalay\n                    ? "Pilihan Penukaran"',
  'isThai\n                    ? "ตัวเลือกการแปลง"\n                    : isMalay\n                    ? "Pilihan Penukaran"'
);

// 6. Target format
content = content.replace(
  'isMalay\n                      ? "Format Sasaran"',
  'isThai\n                      ? "รูปแบบเป้าหมาย"\n                      : isMalay\n                      ? "Format Sasaran"'
);

// 7. Output format
content = content.replace(
  'isMalay\n                      ? "Format Output"',
  'isThai\n                      ? "รูปแบบผลลัพธ์"\n                      : isMalay\n                      ? "Format Output"'
);

// 8. Background Color
content = content.replace(
  'isMalay\n                      ? "Warna Latar Belakang (untuk alfa)"',
  'isThai\n                      ? "สีพื้นหลัง (สำหรับความโปร่งใส)"\n                      : isMalay\n                      ? "Warna Latar Belakang (untuk alfa)"'
);
content = content.replace(
  'label: isMalay ? "Putih" :',
  'label: isThai ? "สีขาว" : isMalay ? "Putih" :'
);
content = content.replace(
  'label: isMalay ? "Hitam" :',
  'label: isThai ? "สีดำ" : isMalay ? "Hitam" :'
);
content = content.replace(
  'label: isMalay ? "Tersuai" :',
  'label: isThai ? "กำหนดเอง" : isMalay ? "Tersuai" :'
);

// 9. Quality slider
content = content.replace(
  '{isMalay ? "Kualiti" :',
  '{isThai ? "คุณภาพ" : isMalay ? "Kualiti" :'
);
content = content.replace(
  '<span>{isMalay ? "Rendah" :',
  '<span>{isThai ? "ต่ำ" : isMalay ? "Rendah" :'
);
content = content.replace(
  '<span>{isMalay ? "Seimbang" :',
  '<span>{isThai ? "สมดุล" : isMalay ? "Seimbang" :'
);
content = content.replace(
  '<span>{isMalay ? "Tinggi" :',
  '<span>{isThai ? "สูง" : isMalay ? "Tinggi" :'
);

// 10. Convert action buttons
content = content.replace(
  'isMalay\n                    ? "Menukar imej..."',
  'isThai\n                    ? "กำลังแปลงรูปภาพ..."\n                    : isMalay\n                    ? "Menukar imej..."'
);
content = content.replace(
  'isMalay\n                    ? "Tukar Semula Imej"',
  'isThai\n                    ? "แปลงรูปภาพอีกครั้ง"\n                    : isMalay\n                    ? "Tukar Semula Imej"'
);
content = content.replace(
  'isMalay\n                  ? "Tukar Imej"',
  'isThai\n                  ? "แปลงรูปภาพ"\n                  : isMalay\n                  ? "Tukar Imej"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ImageConverterWorkspace.tsx');
