const fs = require('fs');
let code = fs.readFileSync('src/components/image-transform/ImageTransformWorkspace.tsx', 'utf8');

// 1. Dropzone Title
code = code.replace(
  ': isMalay\n                ? `Pilih ${mode.startsWith("svg") ? "Fail SVG" : mode === "ico-to-png" ? "Favikon ICO" : "Imej"}`',
  ': isMalay\n                ? `Pilih ${mode.startsWith("svg") ? "Fail SVG" : mode === "ico-to-png" ? "Favikon ICO" : "Imej"}`\n                : isThai\n                ? `เลือก ${mode.startsWith("svg") ? "ไฟล์ SVG" : mode === "ico-to-png" ? "ไอคอน ICO" : "รูปภาพ"}`'
);

// 2. Dropzone Subtitle
code = code.replace(
  ': isMalay\n                ? "100% pemprosesan memori peribadi dalam pelayar anda."\n                : "100% private in-browser memory processing."}',
  ': isMalay\n                ? "100% pemprosesan memori peribadi dalam pelayar anda."\n                : isThai\n                ? "ประมวลผลอย่างเป็นส่วนตัว 100% ในหน่วยความจำของเบราว์เซอร์คุณ"\n                : "100% private in-browser memory processing."}'
);

// 3. Choose File Button
code = code.replace(
  ': isMalay\n                ? "Pilih Fail"\n                : "Choose File"}',
  ': isMalay\n                ? "Pilih Fail"\n                : isThai\n                ? "เลือกไฟล์"\n                : "Choose File"}'
);

// 4. Change File Button
code = code.replace(
  ': isMalay\n                ? "Tukar Fail"\n                : "Change File"}',
  ': isMalay\n                ? "Tukar Fail"\n                : isThai\n                ? "เปลี่ยนไฟล์"\n                : "Change File"}'
);

// 5. DPI Multiplier Label
code = code.replace(
  ': isMalay ? "Pengganda Resolusi (DPI):" : isLatvian ? "Izšķirtspējas reizinātājs (DPI):"',
  ': isMalay ? "Pengganda Resolusi (DPI):" : isThai ? "ตัวคูณความละเอียด (DPI):" : isLatvian ? "Izšķirtspējas reizinātājs (DPI):"'
);

// 6. Processing text
code = code.replace(
  ': isMalay ? "Memproses pada peranti ini..." : isLatvian ? "Apstrādā šajā ierīcē..."',
  ': isMalay ? "Memproses pada peranti ini..." : isThai ? "กำลังประมวลผลบนอุปกรณ์นี้...\" : isLatvian ? "Apstrādā šajā ierīcē..."'
);

// 7. Export PNG
code = code.replace(
  ': isMalay ? "Eksport sebagai PNG" : isLatvian ? "Eksportēt kā PNG"',
  ': isMalay ? "Eksport sebagai PNG" : isThai ? "ส่งออกเป็น PNG" : isLatvian ? "Eksportēt kā PNG"'
);

// 8. Export JPG
code = code.replace(
  ': isMalay ? "Eksport sebagai JPG" : isLatvian ? "Eksportēt kā JPG"',
  ': isMalay ? "Eksport sebagai JPG" : isThai ? "ส่งออกเป็น JPG" : isLatvian ? "Eksportēt kā JPG"'
);

// 9. Crop Image
code = code.replace(
  ': isMalay ? "Pangkas Imej" : isLatvian ? "Apgriezt attēlu"',
  ': isMalay ? "Pangkas Imej" : isThai ? "ครอบตัดรูปภาพ" : isLatvian ? "Apgriezt attēlu"'
);

// 10. Rotate Image
code = code.replace(
  ': isMalay ? `Putar Imej (${rotationAngle}°)` : isLatvian ? `Pagriezt attēlu (${rotationAngle}°)`',
  ': isMalay ? `Putar Imej (${rotationAngle}°)` : isThai ? `หมุนรูปภาพ (${rotationAngle}°)` : isLatvian ? `Pagriezt attēlu (${rotationAngle}°)`'
);

// 11. Flip Image
code = code.replace(
  ': isMalay ? `Balikkan Imej (${flipDirection === "horizontal" ? "Mendatar" : "Menegak"})` : isLatvian',
  ': isMalay ? `Balikkan Imej (${flipDirection === "horizontal" ? "Mendatar" : "Menegak"})` : isThai ? `พลิกรูปภาพ (${flipDirection === "horizontal" ? "แนวนอน" : "แนวตั้ง"})` : isLatvian'
);

// 12. Extract PNG Icon
code = code.replace(
  ': isMalay ? "Ekstrak Ikon PNG" : isLatvian ? "Izvilkt PNG ikonu"',
  ': isMalay ? "Ekstrak Ikon PNG" : isThai ? "แยกไอคอน PNG" : isLatvian ? "Izvilkt PNG ikonu"'
);

// 13. Resize Image
code = code.replace(
  ': isMalay ? "Ubah Saiz Imej" : isLatvian ? "Mainīt attēla izmēru"',
  ': isMalay ? "Ubah Saiz Imej" : isThai ? "ปรับขนาดรูปภาพ" : isLatvian ? "Mainīt attēla izmēru"'
);

// 14. Image Export Ready
code = code.replace(
  ': isMalay ? "Eksport Imej Sedia" : isLatvian ? "Attēla eksports gatavs"',
  ': isMalay ? "Eksport Imej Sedia" : isThai ? "ส่งออกรูปภาพสำเร็จแล้ว" : isLatvian ? "Attēla eksports gatavs"'
);

// 15. Download Image
code = code.replace(
  ': isMalay ? "Muat Turun Imej" : isLatvian ? "Lejupielādēt attēlu"',
  ': isMalay ? "Muat Turun Imej" : isThai ? "ดาวน์โหลดรูปภาพ" : isLatvian ? "Lejupielādēt attēlu"'
);

fs.writeFileSync('src/components/image-transform/ImageTransformWorkspace.tsx', code, 'utf8');
console.log('Successfully patched ImageTransformWorkspace.tsx');
