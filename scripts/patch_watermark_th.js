const fs = require('fs');

const file = 'src/components/pdf-overlay/PdfWatermarkControls.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Add isThai
content = content.replace(
  '  const isMalay = language === "ms";',
  '  const isMalay = language === "ms";\n  const isThai = language === "th";'
);

// 2. Watermark Type
content = content.replace(
  ': isMalay ? "Jenis Tanda Air" : "Watermark Type"',
  ': isMalay ? "Jenis Tanda Air" : isThai ? "ประเภทลายน้ำ" : "Watermark Type"'
);

// 3. Text Watermark
content = content.replace(
  ': isMalay ? "Tanda Air Teks" : "Text Watermark"',
  ': isMalay ? "Tanda Air Teks" : isThai ? "ลายน้ำข้อความ" : "Text Watermark"'
);

// 4. Image Logo
content = content.replace(
  ': isMalay ? "Logo / Imej" : "Image Logo"',
  ': isMalay ? "Logo / Imej" : isThai ? "โลโก้ / รูปภาพ" : "Image Logo"'
);

// 5. Watermark Text input label
content = content.replace(
  ': isMalay ? "Teks Tanda Air" : "Watermark Text"',
  ': isMalay ? "Teks Tanda Air" : isThai ? "ข้อความลายน้ำ" : "Watermark Text"'
);

// 6. Font Color
content = content.replace(
  ': isMalay ? "Warna Fon" : "Font Color"',
  ': isMalay ? "Warna Fon" : isThai ? "สีข้อความ" : "Font Color"'
);

// 7. Font Size
content = content.replace(
  ': isMalay ? `Saiz Fon (${config.fontSize || 36} pt)` : `Font Size (${config.fontSize || 36} pt)`',
  ': isMalay ? `Saiz Fon (${config.fontSize || 36} pt)` : isThai ? `ขนาดตัวอักษร (${config.fontSize || 36} pt)` : `Font Size (${config.fontSize || 36} pt)`'
);

// 8. Select Logo Image
content = content.replace(
  ': isMalay ? "Pilih Imej Logo (PNG / JPEG)" : "Select Logo Image (PNG / JPEG)"',
  ': isMalay ? "Pilih Imej Logo (PNG / JPEG)" : isThai ? "เลือกรูปภาพโลโก้ (PNG / JPEG)" : "Select Logo Image (PNG / JPEG)"'
);

// 9. Opacity
content = content.replace(
  '{isHindi ? "अपारदर्शिता" : isIndonesian ? "Opasitas" : isMalay ? "Kelegapan" : "Opacity"}',
  '{isHindi ? "अपारदर्शिता" : isIndonesian ? "Opasitas" : isMalay ? "Kelegapan" : isThai ? "ความโปร่งใส" : "Opacity"}'
);

// 10. Rotation
content = content.replace(
  '{isHindi ? "घूर्णन" : isIndonesian ? "Rotasi" : isMalay ? "Putaran" : "Rotation"}',
  '{isHindi ? "घूर्णन" : isIndonesian ? "Rotasi" : isMalay ? "Putaran" : isThai ? "การหมุน" : "Rotation"}'
);

// 11. Position Preset label
content = content.replace(
  '{isHindi ? "स्थिति प्रीसेट" : isIndonesian ? "Preset Posisi" : isMalay ? "Pratetap Kedudukan" : "Position Preset"}',
  '{isHindi ? "स्थिति प्रीसेट" : isIndonesian ? "Preset Posisi" : isMalay ? "Pratetap Kedudukan" : isThai ? "ตำแหน่ง" : "Position Preset"}'
);

// 12. Position Preset buttons
content = content.replace(
  '              ms: {\n                "Top Left": "Kiri Atas",\n                "Center": "Tengah",\n                "Top Right": "Kanan Atas",\n                "Bottom Left": "Kiri Bawah",\n                "Tile Grid": "Grid Jubin",\n                "Bottom Right": "Kanan Bawah",\n                "Custom X/Y": "Tersuai X/Y"\n              }',
  '              ms: {\n                "Top Left": "Kiri Atas",\n                "Center": "Tengah",\n                "Top Right": "Kanan Atas",\n                "Bottom Left": "Kiri Bawah",\n                "Tile Grid": "Grid Jubin",\n                "Bottom Right": "Kanan Bawah",\n                "Custom X/Y": "Tersuai X/Y"\n              },\n              th: {\n                "Top Left": "บนซ้าย",\n                "Center": "กึ่งกลาง",\n                "Top Right": "บนขวา",\n                "Bottom Left": "ล่างซ้าย",\n                "Tile Grid": "เรียงต่อกัน",\n                "Bottom Right": "ล่างขวา",\n                "Custom X/Y": "กำหนดเอง X/Y"\n              }'
);

content = content.replace(
  'const translatedLabel = (isHindi ? labelMap.hi[preset.label] : isIndonesian ? labelMap.id[preset.label] : isMalay ? labelMap.ms[preset.label] : null) || preset.label;',
  'const translatedLabel = (isHindi ? labelMap.hi[preset.label] : isIndonesian ? labelMap.id[preset.label] : isMalay ? labelMap.ms[preset.label] : isThai ? labelMap.th[preset.label] : null) || preset.label;'
);

// 13. Custom X/Y
content = content.replace(
  '{isHindi ? "कस्टम X (pt)" : isIndonesian ? "Kustom X (pt)" : isMalay ? "Tersuai X (pt)" : "Custom X (pt)"}',
  '{isHindi ? "कस्टम X (pt)" : isIndonesian ? "Kustom X (pt)" : isMalay ? "Tersuai X (pt)" : isThai ? "กำหนดเอง X (pt)" : "Custom X (pt)"}'
);

content = content.replace(
  '{isHindi ? "कस्टम Y (pt)" : isIndonesian ? "Kustom Y (pt)" : isMalay ? "Tersuai Y (pt)" : "Custom Y (pt)"}',
  '{isHindi ? "कस्टम Y (pt)" : isIndonesian ? "Kustom Y (pt)" : isMalay ? "Tersuai Y (pt)" : isThai ? "กำหนดเอง Y (pt)" : "Custom Y (pt)"}'
);

// 14. Apply to Pages
content = content.replace(
  ': isMalay ? "Terapkan ke Halaman" : "Apply To Pages"',
  ': isMalay ? "Terapkan ke Halaman" : isThai ? "นำไปใช้กับหน้า" : "Apply To Pages"'
);

// 15. Target Pages options
content = content.replace(
  ': isMalay ? "Semua Halaman" : "All Pages"',
  ': isMalay ? "Semua Halaman" : isThai ? "ทุกหน้า" : "All Pages"'
);
content = content.replace(
  ': isMalay ? "Hanya Halaman Ganjil" : "Odd Pages Only"',
  ': isMalay ? "Hanya Halaman Ganjil" : isThai ? "หน้าคี่เท่านั้น" : "Odd Pages Only"'
);
content = content.replace(
  ': isMalay ? "Hanya Halaman Genap" : "Even Pages Only"',
  ': isMalay ? "Hanya Halaman Genap" : isThai ? "หน้าคู่เท่านั้น" : "Even Pages Only"'
);
content = content.replace(
  ': isMalay ? "Julat Tersuai" : "Custom Range"',
  ': isMalay ? "Julat Tersuai" : isThai ? "กำหนดเอง" : "Custom Range"'
);

// 16. CTA Apply & Reset
content = content.replace(
  ': isMalay ? "Menerapkan tanda air..." : "Applying Watermark..."',
  ': isMalay ? "Menerapkan tanda air..." : isThai ? "กำลังใส่ลายน้ำ..." : "Applying Watermark..."'
);
content = content.replace(
  ': isMalay ? "Terapkan Tanda Air" : "Apply Watermark"',
  ': isMalay ? "Terapkan Tanda Air" : isThai ? "ใส่ลายน้ำ" : "Apply Watermark"'
);
content = content.replace(
  ': isMalay ? "Tetapkan Semula" : "Reset"',
  ': isMalay ? "Tetapkan Semula" : isThai ? "รีเซ็ต" : "Reset"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched PdfWatermarkControls.tsx');
