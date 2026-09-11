const fs = require('fs');

const file = 'src/components/layout/ActionChooser.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Add isThai
content = content.replace(
  '  const isMalay = language === "ms";',
  '  const isMalay = language === "ms";\n  const isThai = language === "th";'
);

// 2. OCR action in pdfActions
content = content.replace(
  'label: isMalay ? "OCR PDF (Teks Boleh Dicari)" :',
  'label: isThai ? "OCR PDF (ค้นหาข้อความได้)" : isMalay ? "OCR PDF (Teks Boleh Dicari)" :'
);
content = content.replace(
  'desc: isMalay ? "Jadikan PDF yang diimbas boleh dicari" :',
  'desc: isThai ? "ทำให้ไฟล์สแกน PDF ค้นหาข้อความได้" : isMalay ? "Jadikan PDF yang diimbas boleh dicari" :'
);

// 3. Strip EXIF in imageActions
content = content.replace(
  'label: isMalay ? "Buang Metadata (EXIF/GPS)" :',
  'label: isThai ? "ลบข้อมูลเมทาดาทา (EXIF/GPS)" : isMalay ? "Buang Metadata (EXIF/GPS)" :'
);
content = content.replace(
  'desc: isMalay ? "Padam data lokasi dan peranti kamera" :',
  'desc: isThai ? "ลบข้อมูลตำแหน่ง GPS และข้อมูลอุปกรณ์กล้อง" : isMalay ? "Padam data lokasi dan peranti kamera" :'
);

// 4. Office actions
content = content.replace(
  'label: isMalay ? "Word ke PDF" :',
  'label: isThai ? "Word เป็น PDF" : isMalay ? "Word ke PDF" :'
);
content = content.replace(
  'desc: isMalay ? "Tukar fail DOCX ke PDF" :',
  'desc: isThai ? "แปลงไฟล์ DOCX เป็น PDF" : isMalay ? "Tukar fail DOCX ke PDF" :'
);

content = content.replace(
  'label: isMalay ? "Excel ke PDF" :',
  'label: isThai ? "Excel เป็น PDF" : isMalay ? "Excel ke PDF" :'
);
content = content.replace(
  'desc: isMalay ? "Tukar fail XLSX ke PDF" :',
  'desc: isThai ? "แปลงไฟล์ XLSX เป็น PDF" : isMalay ? "Tukar fail XLSX ke PDF" :'
);

content = content.replace(
  'label: isMalay ? "PowerPoint ke PDF" :',
  'label: isThai ? "PowerPoint เป็น PDF" : isMalay ? "PowerPoint ke PDF" :'
);
content = content.replace(
  'desc: isMalay ? "Tukar fail PPTX ke PDF" :',
  'desc: isThai ? "แปลงไฟล์ PPTX เป็น PDF" : isMalay ? "Tukar fail PPTX ke PDF" :'
);

// 5. Archive actions
content = content.replace(
  'label: isMalay ? "Ekstrak Arkib" :',
  'label: isThai ? "แตกไฟล์คลังข้อมูล" : isMalay ? "Ekstrak Arkib" :'
);
content = content.replace(
  'desc: isMalay ? "Buka mampatan fail ZIP, RAR, 7Z" :',
  'desc: isThai ? "แตกไฟล์ที่บีบอัด ZIP, RAR, 7Z" : isMalay ? "Buka mampatan fail ZIP, RAR, 7Z" :'
);

content = content.replace(
  'label: isMalay ? "Cipta Arkib ZIP" :',
  'label: isThai ? "สร้างไฟล์บีบอัด ZIP" : isMalay ? "Cipta Arkib ZIP" :'
);
content = content.replace(
  'desc: isMalay ? "Mampatkan fail ke format ZIP" :',
  'desc: isThai ? "บีบอัดไฟล์เป็นรูปแบบ ZIP" : isMalay ? "Mampatkan fail ke format ZIP" :'
);

// 6. Header
content = content.replace(
  'isMalay ? "Fail dipilih" :',
  'isThai ? "เลือกไฟล์แล้ว" : isMalay ? "Fail dipilih" :'
);

// 7. Subtitle
content = content.replace(
  'isMalay ? "Apakah tindakan yang ingin anda lakukan pada fail ini?" :',
  'isThai ? "คุณต้องการดำเนินการใดกับไฟล์นี้?" : isMalay ? "Apakah tindakan yang ingin anda lakukan pada fail ini?" :'
);

// 8. Categories
content = content.replace(
  'isMalay ? "Tindakan PDF Disyorkan" :',
  'isThai ? "การดำเนินการ PDF ที่แนะนำ" : isMalay ? "Tindakan PDF Disyorkan" :'
);
content = content.replace(
  'isMalay ? "Tindakan Imej Disyorkan" :',
  'isThai ? "การดำเนินการรูปภาพที่แนะนำ" : isMalay ? "Tindakan Imej Disyorkan" :'
);
content = content.replace(
  'isMalay ? "Tindakan Office" :',
  'isThai ? "การดำเนินการไฟล์ Office" : isMalay ? "Tindakan Office" :'
);
content = content.replace(
  'isMalay ? "Tindakan Arkib" :',
  'isThai ? "การดำเนินการไฟล์คลังข้อมูล" : isMalay ? "Tindakan Arkib" :'
);

// 9. Start button
content = content.replaceAll(
  'isMalay ? "Mula →" :',
  'isThai ? "เริ่ม →" : isMalay ? "Mula →" :'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ActionChooser.tsx');
