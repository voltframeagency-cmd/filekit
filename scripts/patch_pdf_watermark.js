const fs = require('fs');
let code = fs.readFileSync('src/components/pdf-overlay/PdfWatermarkControls.tsx', 'utf8');

function replaceExact(str, find, rep) {
  const normStr = str.replace(/\r\n/g, '\n');
  const normFind = find.replace(/\r\n/g, '\n');
  const normRep = rep.replace(/\r\n/g, '\n');
  if (!normStr.includes(normFind)) {
    console.error('Failed to find:', normFind.slice(0, 50));
    return str;
  }
  const result = normStr.replace(normFind, normRep);
  return str.includes('\r\n') ? result.replace(/\n/g, '\r\n') : result;
}

// Add isFilipino
code = replaceExact(
  code,
  `  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";`,
  `  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";`
);

// 1. Watermark Type
code = replaceExact(
  code,
  `: isMalay ? "Jenis Tanda Air" : isVietnamese ? "Loại dấu bản quyền" : isThai ? "ประเภทลายน้ำ" : "Watermark Type"`,
  `: isMalay ? "Jenis Tanda Air" : isVietnamese ? "Loại dấu bản quyền" : isThai ? "ประเภทลายน้ำ" : isFilipino ? "Uri ng Watermark" : "Watermark Type"`
);

// 2. Text Watermark
code = replaceExact(
  code,
  `: isMalay ? "Tanda Air Teks" : isVietnamese ? "Dấu văn bản" : isThai ? "ลายน้ำข้อความ" : "Text Watermark"`,
  `: isMalay ? "Tanda Air Teks" : isVietnamese ? "Dấu văn bản" : isThai ? "ลายน้ำข้อความ" : isFilipino ? "Text Watermark" : "Text Watermark"`
);

// 3. Image Logo
code = replaceExact(
  code,
  `: isMalay ? "Logo / Imej" : isVietnamese ? "Logo / Hình ảnh" : isThai ? "โลโก้ / รูปภาพ" : "Image Logo"`,
  `: isMalay ? "Logo / Imej" : isVietnamese ? "Logo / Hình ảnh" : isThai ? "โลโก้ / รูปภาพ" : isFilipino ? "Logo / Larawan" : "Image Logo"`
);

// 4. Watermark Text
code = replaceExact(
  code,
  `: isMalay ? "Teks Tanda Air" : isVietnamese ? "Văn bản dấu bản quyền" : isThai ? "ข้อความลายน้ำ" : "Watermark Text"`,
  `: isMalay ? "Teks Tanda Air" : isVietnamese ? "Văn bản dấu bản quyền" : isThai ? "ข้อความลายน้ำ" : isFilipino ? "Teksto ng Watermark" : "Watermark Text"`
);

// 5. Font Color
code = replaceExact(
  code,
  `: isMalay ? "Warna Fon" : isVietnamese ? "Màu chữ" : isThai ? "สีข้อความ" : "Font Color"`,
  `: isMalay ? "Warna Fon" : isVietnamese ? "Màu chữ" : isThai ? "สีข้อความ" : isFilipino ? "Kulay ng Font" : "Font Color"`
);

// 6. Font Size
code = replaceExact(
  code,
  `: isMalay ? \`Saiz Fon (\${config.fontSize || 36} pt)\` : isVietnamese ? \`Cỡ chữ (\${config.fontSize || 36} pt)\` : isThai ? \`ขนาดตัวอักษร (\${config.fontSize || 36} pt)\` : \`Font Size (\${config.fontSize || 36} pt)\``,
  `: isMalay ? \`Saiz Fon (\${config.fontSize || 36} pt)\` : isVietnamese ? \`Cỡ chữ (\${config.fontSize || 36} pt)\` : isThai ? \`ขนาดตัวอักษร (\${config.fontSize || 36} pt)\` : isFilipino ? \`Laki ng Font (\${config.fontSize || 36} pt)\` : \`Font Size (\${config.fontSize || 36} pt)\``
);

// 7. Select Logo Image
code = replaceExact(
  code,
  `: isMalay ? "Pilih Imej Logo (PNG / JPEG)" : isVietnamese ? "Chọn hình ảnh logo (PNG / JPEG)" : isThai ? "เลือกรูปภาพโลโก้ (PNG / JPEG)" : "Select Logo Image (PNG / JPEG)"`,
  `: isMalay ? "Pilih Imej Logo (PNG / JPEG)" : isVietnamese ? "Chọn hình ảnh logo (PNG / JPEG)" : isThai ? "เลือกรูปภาพโลโก้ (PNG / JPEG)" : isFilipino ? "Pumili ng Larawan ng Logo (PNG / JPEG)" : "Select Logo Image (PNG / JPEG)"`
);

// 8. Opacity
code = replaceExact(
  code,
  `{isHindi ? "अपारदर्शिता" : isIndonesian ? "Opasitas" : isMalay ? "Kelegapan" : isVietnamese ? "Độ mờ đục" : isThai ? "ความโปร่งใส" : "Opacity"}`,
  `{isHindi ? "अपारदर्शिता" : isIndonesian ? "Opasitas" : isMalay ? "Kelegapan" : isVietnamese ? "Độ mờ đục" : isThai ? "ความโปร่งใส" : isFilipino ? "Kalabuan (Opacity)" : "Opacity"}`
);

// 9. Rotation
code = replaceExact(
  code,
  `{isHindi ? "घूर्णन" : isIndonesian ? "Rotasi" : isMalay ? "Putaran" : isVietnamese ? "Góc xoay" : isThai ? "การหมุน" : "Rotation"}`,
  `{isHindi ? "घूर्णन" : isIndonesian ? "Rotasi" : isMalay ? "Putaran" : isVietnamese ? "Góc xoay" : isThai ? "การหมุน" : isFilipino ? "Pag-ikot" : "Rotation"}`
);

// 10. Position Preset
code = replaceExact(
  code,
  `{isHindi ? "स्थिति प्रीसेट" : isIndonesian ? "Preset Posisi" : isMalay ? "Pratetap Kedudukan" : isVietnamese ? "Vị trí đặt sẵn" : isThai ? "ตำแหน่ง" : "Position Preset"}`,
  `{isHindi ? "स्थिति प्रीसेट" : isIndonesian ? "Preset Posisi" : isMalay ? "Pratetap Kedudukan" : isVietnamese ? "Vị trí đặt sẵn" : isThai ? "ตำแหน่ง" : isFilipino ? "Preset ng Posisyon" : "Position Preset"}`
);

// 11. labelMap
code = replaceExact(
  code,
  `              vi: {
                "Top Left": "Trên cùng bên trái",
                "Center": "Ở giữa",
                "Top Right": "Trên cùng bên phải",
                "Bottom Left": "Dưới cùng bên trái",
                "Tile Grid": "Dạng lưới lặp lại",
                "Bottom Right": "Dưới cùng bên phải",
                "Custom X/Y": "Tùy chỉnh X/Y"
              }
            };
            const translatedLabel = (isHindi ? labelMap.hi[preset.label] : isIndonesian ? labelMap.id[preset.label] : isMalay ? labelMap.ms[preset.label] : isVietnamese ? labelMap.vi[preset.label] : isThai ? labelMap.th[preset.label] : null) || preset.label;`,
  `              vi: {
                "Top Left": "Trên cùng bên trái",
                "Center": "Ở giữa",
                "Top Right": "Trên cùng bên phải",
                "Bottom Left": "Dưới cùng bên trái",
                "Tile Grid": "Dạng lưới lặp lại",
                "Bottom Right": "Dưới cùng bên phải",
                "Custom X/Y": "Tùy chỉnh X/Y"
              },
              fil: {
                "Top Left": "Itaas Kaliwa",
                "Center": "Gitna",
                "Top Right": "Itaas Kanan",
                "Bottom Left": "Ibaba Kaliwa",
                "Tile Grid": "Grid ng Tile",
                "Bottom Right": "Ibaba Kanan",
                "Custom X/Y": "Pasadya X/Y"
              }
            };
            const translatedLabel = (isHindi ? labelMap.hi[preset.label] : isIndonesian ? labelMap.id[preset.label] : isMalay ? labelMap.ms[preset.label] : isVietnamese ? labelMap.vi[preset.label] : isThai ? labelMap.th[preset.label] : isFilipino ? labelMap.fil[preset.label] : null) || preset.label;`
);

// 12. Custom X / Y
code = replaceExact(
  code,
  `{isHindi ? "कस्टम X (pt)" : isIndonesian ? "Kustom X (pt)" : isMalay ? "Tersuai X (pt)" : isVietnamese ? "Tùy chỉnh X (pt)" : isThai ? "กำหนดเอง X (pt)" : "Custom X (pt)"}`,
  `{isHindi ? "कस्टम X (pt)" : isIndonesian ? "Kustom X (pt)" : isMalay ? "Tersuai X (pt)" : isVietnamese ? "Tùy chỉnh X (pt)" : isThai ? "กำหนดเอง X (pt)" : isFilipino ? "Pasadya X (pt)" : "Custom X (pt)"}`
);

code = replaceExact(
  code,
  `{isHindi ? "कस्टम Y (pt)" : isIndonesian ? "Kustom Y (pt)" : isMalay ? "Tersuai Y (pt)" : isVietnamese ? "Tùy chỉnh Y (pt)" : isThai ? "กำหนดเอง Y (pt)" : "Custom Y (pt)"}`,
  `{isHindi ? "कस्टम Y (pt)" : isIndonesian ? "Kustom Y (pt)" : isMalay ? "Tersuai Y (pt)" : isVietnamese ? "Tùy chỉnh Y (pt)" : isThai ? "กำหนดเอง Y (pt)" : isFilipino ? "Pasadya Y (pt)" : "Custom Y (pt)"}`
);

// 13. Apply To Pages
code = replaceExact(
  code,
  `: isMalay ? "Terapkan ke Halaman" : isVietnamese ? "Áp dụng cho các trang" : isThai ? "นำไปใช้กับหน้า" : "Apply To Pages"`,
  `: isMalay ? "Terapkan ke Halaman" : isVietnamese ? "Áp dụng cho các trang" : isThai ? "นำไปใช้กับหน้า" : isFilipino ? "Ilapat sa mga Pahina" : "Apply To Pages"`
);

// 14. Target page modes
code = replaceExact(
  code,
  `: isMalay ? "Semua Halaman" : isThai ? "ทุกหน้า" : "All Pages"`,
  `: isMalay ? "Semua Halaman" : isThai ? "ทุกหน้า" : isFilipino ? "Lahat ng Pahina" : "All Pages"`
);

code = replaceExact(
  code,
  `: isMalay ? "Hanya Halaman Ganjil" : isThai ? "หน้าคี่เท่านั้น" : "Odd Pages Only"`,
  `: isMalay ? "Hanya Halaman Ganjil" : isThai ? "หน้าคี่เท่านั้น" : isFilipino ? "Mga Kakaibang Pahina Lamang" : "Odd Pages Only"`
);

code = replaceExact(
  code,
  `: isMalay ? "Hanya Halaman Genap" : isThai ? "หน้าคู่เท่านั้น" : "Even Pages Only"`,
  `: isMalay ? "Hanya Halaman Genap" : isThai ? "หน้าคู่เท่านั้น" : isFilipino ? "Mga Tukol na Pahina Lamang" : "Even Pages Only"`
);

code = replaceExact(
  code,
  `: isMalay ? "Julat Tersuai" : isThai ? "กำหนดเอง" : "Custom Range"`,
  `: isMalay ? "Julat Tersuai" : isThai ? "กำหนดเอง" : isFilipino ? "Pasadyang Saklaw" : "Custom Range"`
);

// 15. Applying Watermark...
code = replaceExact(
  code,
  `: isMalay ? "Menerapkan tanda air..." : isThai ? "กำลังใส่ลายน้ำ..." : "Applying Watermark..."`,
  `: isMalay ? "Menerapkan tanda air..." : isThai ? "กำลังใส่ลายน้ำ..." : isFilipino ? "Inilalapat ang watermark..." : "Applying Watermark..."`
);

// 16. Apply Watermark
code = replaceExact(
  code,
  `: isMalay ? "Terapkan Tanda Air" : isThai ? "ใส่ลายน้ำ" : "Apply Watermark"`,
  `: isMalay ? "Terapkan Tanda Air" : isThai ? "ใส่ลายน้ำ" : isFilipino ? "Ilapat ang Watermark" : "Apply Watermark"`
);

// 17. Reset
code = replaceExact(
  code,
  `: isMalay ? "Tetapkan Semula" : isThai ? "รีเซ็ต" : "Reset"`,
  `: isMalay ? "Tetapkan Semula" : isThai ? "รีเซ็ต" : isFilipino ? "I-reset" : "Reset"`
);

fs.writeFileSync('src/components/pdf-overlay/PdfWatermarkControls.tsx', code, 'utf8');
console.log('PdfWatermarkControls updated successfully!');
