const fs = require('fs');

const file = 'src/components/pdf-manipulation/PdfManipulationWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Add isThai
content = content.replace(
  '  const isMalay = language === "ms";',
  '  const isMalay = language === "ms";\n  const isThai = language === "th";'
);

// 2. Dropzone header
content = content.replace(
  'isMalay ? `Pilih fail PDF untuk memulakan (${toolTitle})` :',
  'isThai ? `เลือกไฟล์ PDF เพื่อเริ่มต้น (${toolTitle})` : isMalay ? `Pilih fail PDF untuk memulakan (${toolTitle})` :'
);

// 3. Dropzone subtitle
content = content.replace(
  'isMalay ? "Diproses sepenuhnya pada peranti anda dalam kotak pasir pelayar. Data anda tidak pernah meninggalkan komputer anda." :',
  'isThai ? "ประมวลผลทั้งหมดบนอุปกรณ์ของคุณภายในเบราว์เซอร์ ไฟล์ของคุณจะไม่ถูกอัปโหลด" : isMalay ? "Diproses sepenuhnya pada peranti anda dalam kotak pasir pelayar. Data anda tidak pernah meninggalkan komputer anda." :'
);

// 4. Choose PDF Document button
content = content.replace(
  'isMalay ? "Pilih Fail PDF" :',
  'isThai ? "เลือกไฟล์ PDF" : isMalay ? "Pilih Fail PDF" :'
);

// 5. Local safe badge
content = content.replace(
  ': isMalay ? "Selamat Setempat" : "Local Safe"',
  ': isThai ? "ปลอดภัยในเครื่อง" : isMalay ? "Selamat Setempat" : "Local Safe"'
);

// 6. Change PDF button
content = content.replace(
  'isMalay ? "Tukar PDF" :',
  'isThai ? "เปลี่ยน PDF" : isMalay ? "Tukar PDF" :'
);

// 7. Blank page options label
content = content.replace(
  'isMalay ? "Kedudukan Sisipan Halaman Kosong:" :',
  'isThai ? "ตำแหน่งการแทรกหน้าว่าง:" : isMalay ? "Kedudukan Sisipan Halaman Kosong:" :'
);

// 8. Blank page positions
content = content.replace(
  'label: isMalay ? "Di Akhir" : isFinnish ? "Loppuun"',
  'label: isThai ? "ที่ส่วนท้าย" : isMalay ? "Di Akhir" : isFinnish ? "Loppuun"'
);
content = content.replace(
  'label: isMalay ? "Di Awal" : isFinnish ? "Alkuun"',
  'label: isThai ? "ที่ส่วนหน้า" : isMalay ? "Di Awal" : isFinnish ? "Alkuun"'
);
content = content.replace(
  'label: isMalay ? "Selepas Setiap Halaman" : isFinnish ? "Jokaisen sivun jälkeen"',
  'label: isThai ? "หลังทุกหน้า" : isMalay ? "Selepas Setiap Halaman" : isFinnish ? "Jokaisen sivun jälkeen"'
);
content = content.replace(
  'label: isMalay ? "Nombor Halaman Tersuai" : isFinnish ? "Mukautettu sivunumero"',
  'label: isThai ? "กำหนดเลขหน้าเอง" : isMalay ? "Nombor Halaman Tersuai" : isFinnish ? "Mukautettu sivunumero"'
);

// 9. Processing state
content = content.replace(
  'isMalay ? "Memproses pada peranti ini..." :',
  'isThai ? "กำลังประมวลผลบนอุปกรณ์นี้..." : isMalay ? "Memproses pada peranti ini..." :'
);

// 10. Action buttons
content = content.replace(
  'isMalay ? "Balikkan Susunan Halaman PDF" :',
  'isThai ? "กลับลำดับหน้า PDF" : isMalay ? "Balikkan Susunan Halaman PDF" :'
);
content = content.replace(
  'isMalay ? "Masukkan Halaman Kosong" :',
  'isThai ? "แทรกหน้าว่าง" : isMalay ? "Masukkan Halaman Kosong" :'
);
content = content.replace(
  'isMalay ? "Gandakan Halaman PDF" :',
  'isThai ? "ทำซ้ำหน้า PDF" : isMalay ? "Gandakan Halaman PDF" :'
);
content = content.replace(
  'isMalay ? "Ekstrak Teks" :',
  'isThai ? "แยกข้อความ" : isMalay ? "Ekstrak Teks" :'
);
content = content.replace(
  'isMalay ? "Ekstrak Imej" :',
  'isThai ? "แยกรูปภาพ" : isMalay ? "Ekstrak Imej" :'
);
content = content.replace(
  'isMalay ? "Ratakan Borang PDF" :',
  'isThai ? "ผสานแบบฟอร์ม PDF" : isMalay ? "Ratakan Borang PDF" :'
);

// 11. Extracted Text content header
content = content.replace(
  'isMalay ? "Kandungan Teks Diekstrak:" :',
  'isThai ? "เนื้อหาข้อความที่แยกได้:" : isMalay ? "Kandungan Teks Diekstrak:" :'
);
content = content.replace(
  ': isMalay ? "📋 Salin Semua Teks" :',
  ': isThai ? "📋 คัดลอกข้อความทั้งหมด" : isMalay ? "📋 Salin Semua Teks" :'
);

// 12. Extracted Images header
content = content.replace(
  'isMalay ? `Berjaya mengekstrak ${extractedImages.length} imej` :',
  'isThai ? `แยกรูปภาพสำเร็จ ${extractedImages.length} รูป` : isMalay ? `Berjaya mengekstrak ${extractedImages.length} imej` :'
);
content = content.replace(
  'isMalay ? `Halaman ${img.pageIndex}` :',
  'isThai ? `หน้า ${img.pageIndex}` : isMalay ? `Halaman ${img.pageIndex}` :'
);
content = content.replace(
  'isMalay ? "Muat Turun PNG" : "Download PNG"',
  'isThai ? "ดาวน์โหลด PNG" : isMalay ? "Muat Turun PNG" : "Download PNG"'
);

// 13. Operation complete result
content = content.replace(
  'isMalay ? "Operasi Selesai" :',
  'isThai ? "การดำเนินการเสร็จสมบูรณ์" : isMalay ? "Operasi Selesai" :'
);
content = content.replace(
  'isMalay ? "Diproses 100% secara setempat" :',
  'isThai ? "ประมวลผลในเครื่อง 100%" : isMalay ? "Diproses 100% secara setempat" :'
);
content = content.replace(
  'isMalay ? "Muat Turun Fail" :',
  'isThai ? "ดาวน์โหลดไฟล์" : isMalay ? "Muat Turun Fail" :'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched PdfManipulationWorkspace.tsx');
