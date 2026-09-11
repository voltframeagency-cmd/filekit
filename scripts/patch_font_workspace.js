const fs = require('fs');
let code = fs.readFileSync('src/utils/font/FontWorkspace.tsx', 'utf8');

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

// 0. Add isFilipino
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

// 1. previewText Pangram
code = replaceExact(
  code,
  `: isThai
      ? "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน ๑๒๓๔๕๖๗๘๙๐"
      : "The quick brown fox jumps over the lazy dog 1234567890"`,
  `: isThai
      ? "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน ๑๒๓๔๕๖๗๘๙๐"
      : isFilipino
      ? "Ang mabilis na kayumangging usa ay tumatalon sa ibabaw ng tamad na aso 1234567890"
      : "The quick brown fox jumps over the lazy dog 1234567890"`
);

// 2. Error: Failed to convert font
code = replaceExact(
  code,
  `: isThai
          ? "ไม่สามารถแปลงฟอนต์ได้ โปรดตรวจสอบว่าเป็นไฟล์ TTF, OTF หรือ WOFF ที่ถูกต้อง"
          : "Failed to convert font. Please ensure it is a valid TTF, OTF, or WOFF file."`,
  `: isThai
          ? "ไม่สามารถแปลงฟอนต์ได้ โปรดตรวจสอบว่าเป็นไฟล์ TTF, OTF หรือ WOFF ที่ถูกต้อง"
          : isFilipino
          ? "Nabigong i-convert ang font. Pakitiyak na ito ay wastong TTF, OTF, o WOFF file."
          : "Failed to convert font. Please ensure it is a valid TTF, OTF, or WOFF file."`
);

// 3. title
code = replaceExact(
  code,
  `: isThai ? "แปลง TTF เป็น WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF") : (isLatvian ? "Konvertēt WOFF2 uz TTF" : isLithuanian ? "Konvertuoti WOFF2 į TTF" : isHindi ? "WOFF2 को TTF में कनवर्ट करें" : isIndonesian ? "Konversi WOFF2 ke TTF" : isMalay ? "Tukar WOFF2 ke TTF" : isVietnamese ? "Chuyển đổi WOFF2 sang TTF" : isThai ? "แปลง WOFF2 เป็น TTF" : "Convert WOFF2 to TTF"))}`,
  `: isThai ? "แปลง TTF เป็น WOFF2 / WOFF" : isFilipino ? "I-convert ang TTF sa WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF") : (isLatvian ? "Konvertēt WOFF2 uz TTF" : isLithuanian ? "Konvertuoti WOFF2 į TTF" : isHindi ? "WOFF2 को TTF में कनवर्ट करें" : isIndonesian ? "Konversi WOFF2 ke TTF" : isMalay ? "Tukar WOFF2 ke TTF" : isVietnamese ? "Chuyển đổi WOFF2 sang TTF" : isThai ? "แปลง WOFF2 เป็น TTF" : isFilipino ? "I-convert ang WOFF2 sa TTF" : "Convert WOFF2 to TTF"))}`
);

// 4. description
code = replaceExact(
  code,
  `: isThai ? "เครื่องมือบีบอัดฟอนต์เว็บประสิทธิภาพสูง · ทำงานในเบราว์เซอร์ 100%" : "High-Performance Web Font Compressor · 100% In-Browser")`,
  `: isThai ? "เครื่องมือบีบอัดฟอนต์เว็บประสิทธิภาพสูง · ทำงานในเบราว์เซอร์ 100%" : isFilipino ? "Mataas na Pagganap na Web Font Compressor · 100% Sa Loob ng Browser" : "High-Performance Web Font Compressor · 100% In-Browser")`
);

// 5. Select Font File (TTF, OTF, WOFF)
code = replaceExact(
  code,
  `: isThai
              ? "เลือกไฟล์ฟอนต์ (TTF, OTF, WOFF)"
              : "Select Font File (TTF, OTF, WOFF)"`,
  `: isThai
              ? "เลือกไฟล์ฟอนต์ (TTF, OTF, WOFF)"
              : isFilipino
              ? "Pumili ng Font File (TTF, OTF, WOFF)"
              : "Select Font File (TTF, OTF, WOFF)"`
);

// 6. Optimized for fast web delivery...
code = replaceExact(
  code,
  `: isThai
              ? "เพิ่มประสิทธิภาพสำหรับเว็บ (ประมวลผลในเครื่อง 100% โดยไม่มีการส่งข้อมูล)"
              : "Optimized for fast web delivery (Zero server tracking)"`,
  `: isThai
              ? "เพิ่มประสิทธิภาพสำหรับเว็บ (ประมวลผลในเครื่อง 100% โดยไม่มีการส่งข้อมูล)"
              : isFilipino
              ? "Na-optimize para sa mabilis na paghahatid sa web (Walang server tracking)"
              : "Optimized for fast web delivery (Zero server tracking)"`
);

// 7. Format: ... Tables: ... Size: ...
code = replaceExact(
  code,
  `: isThai
                  ? \`รูปแบบ: \${fontMeta?.format.toUpperCase()} · ตาราง: \${fontMeta?.numTables} · ขนาด: \${(file.size / 1024).toFixed(1)} KB\`
                  : \`Format: \${fontMeta?.format.toUpperCase()} · Tables: \${fontMeta?.numTables} · Size: \${(file.size / 1024).toFixed(1)} KB\``,
  `: isThai
                  ? \`รูปแบบ: \${fontMeta?.format.toUpperCase()} · ตาราง: \${fontMeta?.numTables} · ขนาด: \${(file.size / 1024).toFixed(1)} KB\`
                  : isFilipino
                  ? \`Format: \${fontMeta?.format.toUpperCase()} · Mga Talahanayan: \${fontMeta?.numTables} · Laki: \${(file.size / 1024).toFixed(1)} KB\`
                  : \`Format: \${fontMeta?.format.toUpperCase()} · Tables: \${fontMeta?.numTables} · Size: \${(file.size / 1024).toFixed(1)} KB\``
);

// 8. Change Font
code = replaceExact(
  code,
  `: isMalay ? "Tukar Fon" : isVietnamese ? "Đổi phông chữ" : isThai ? "เปลี่ยนฟอนต์" : "Change Font"`,
  `: isMalay ? "Tukar Fon" : isVietnamese ? "Đổi phông chữ" : isThai ? "เปลี่ยนฟอนต์" : isFilipino ? "Palitan ang Font" : "Change Font"`
);

// 9. Live Font Preview
code = replaceExact(
  code,
  `: isMalay ? "Pratonton Fon Langsung" : isVietnamese ? "Xem trước phông chữ trực tiếp" : isThai ? "ตัวอย่างฟอนต์สด" : "Live Font Preview"`,
  `: isMalay ? "Pratonton Fon Langsung" : isVietnamese ? "Xem trước phông chữ trực tiếp" : isThai ? "ตัวอย่างฟอนต์สด" : isFilipino ? "Live na Preview ng Font" : "Live Font Preview"`
);

// 10. Size:
code = replaceExact(
  code,
  `: isMalay ? "Saiz:" : isVietnamese ? "Cỡ chữ:" : isThai ? "ขนาด:" : "Size:"`,
  `: isMalay ? "Saiz:" : isVietnamese ? "Cỡ chữ:" : isThai ? "ขนาด:" : isFilipino ? "Laki:" : "Size:"`
);

// 11. Font Converted:
code = replaceExact(
  code,
  `: isMalay
                    ? \`✓ Fon Ditukar: \${outputFileName}\`
                    : isVietnamese
                    ? \`✓ Đã chuyển đổi phông chữ: \${outputFileName}\`
                    : isThai
                    ? \`✓ แปลงฟอนต์สำเร็จ: \${outputFileName}\`
                    : \`✓ Font Converted: \${outputFileName}\``,
  `: isMalay
                    ? \`✓ Fon Ditukar: \${outputFileName}\`
                    : isVietnamese
                    ? \`✓ Đã chuyển đổi phông chữ: \${outputFileName}\`
                    : isThai
                    ? \`✓ แปลงฟอนต์สำเร็จ: \${outputFileName}\`
                    : isFilipino
                    ? \`✓ Na-convert ang Font: \${outputFileName}\`
                    : \`✓ Font Converted: \${outputFileName}\``
);

// 12. Size: ... In-Browser
code = replaceExact(
  code,
  `: isMalay
                    ? \`Saiz: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Dalam Pelayar\`
                    : isVietnamese
                    ? \`Dung lượng: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% trong trình duyệt\`
                    : isThai
                    ? \`ขนาด: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · ในเบราว์เซอร์ 100%\`
                    : \`Size: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% In-Browser\``,
  `: isMalay
                    ? \`Saiz: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Dalam Pelayar\`
                    : isVietnamese
                    ? \`Dung lượng: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% trong trình duyệt\`
                    : isThai
                    ? \`ขนาด: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · ในเบราว์เซอร์ 100%\`
                    : isFilipino
                    ? \`Laki: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Sa Loob ng Browser\`
                    : \`Size: \${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% In-Browser\``
);

// 13. Download Font
code = replaceExact(
  code,
  `: isMalay ? "Muat Turun Fon" : isVietnamese ? "Tải xuống phông chữ" : isThai ? "ดาวน์โหลดฟอนต์" : "Download Font"`,
  `: isMalay ? "Muat Turun Fon" : isVietnamese ? "Tải xuống phông chữ" : isThai ? "ดาวน์โหลดฟอนต์" : isFilipino ? "I-download ang Font" : "Download Font"`
);

fs.writeFileSync('src/utils/font/FontWorkspace.tsx', code, 'utf8');
console.log('FontWorkspace updated successfully!');
