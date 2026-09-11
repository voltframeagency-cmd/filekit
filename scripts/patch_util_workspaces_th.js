const fs = require('fs');

function patchFile(filepath, fn) {
  let content = fs.readFileSync(filepath, 'utf8');
  const isCrlf = content.includes('\r\n');
  if (isCrlf) content = content.replace(/\r\n/g, '\n');
  content = fn(content);
  if (isCrlf) content = content.replace(/\n/g, '\r\n');
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Patched ${filepath}`);
}

// 1. ArchiveWorkspace.tsx
patchFile('src/utils/archive/ArchiveWorkspace.tsx', (c) => {
  c = c.replace('  const isMalay = language === "ms";', '  const isMalay = language === "ms";\n  const isThai = language === "th";');
  c = c.replace(': isMalay\n                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"', ': isThai\n                  ? "ลากไฟล์มาวางที่นี่เพื่อรวมเป็นไฟล์ ZIP"\n                  : isMalay\n                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"');
  c = c.replace(': isMalay\n                  ? "Pilih fail arkib untuk diekstrak atau ditukar"', ': isThai\n                  ? "เลือกไฟล์คลังข้อมูลเพื่อแตกไฟล์หรือแปลง"\n                  : isMalay\n                  ? "Pilih fail arkib untuk diekstrak atau ditukar"');
  c = c.replace(': isMalay\n                  ? "Menyokong semua format fail (Pilihan berbilang fail diaktifkan)"', ': isThai\n                  ? "รองรับทุกรูปแบบไฟล์ (เลือกหลายไฟล์ได้)"\n                  : isMalay\n                  ? "Menyokong semua format fail (Pilihan berbilang fail diaktifkan)"');
  c = c.replace(': isMalay\n                  ? "Diproses secara lokal di browser Anda"', ': isThai\n                  ? "ประมวลผลในเบราว์เซอร์ของคุณอย่างปลอดภัย 100%"\n                  : isMalay\n                  ? "Diproses secara lokal di browser Anda"');
  c = c.replace(': isIndonesian\n                    ? `✓ ZIP siap: ${outputFileName}`', ': isThai\n                    ? `✓ สร้าง ZIP สำเร็จ: ${outputFileName}`\n                    : isIndonesian\n                    ? `✓ ZIP siap: ${outputFileName}`');
  c = c.replace(': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser`', ': isThai\n                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% ในเบราว์เซอร์`\n                    : isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser`');
  c = c.replace('isSpanish ? "Descargar ZIP" : "Download ZIP"', 'isThai ? "ดาวน์โหลด ZIP" : isSpanish ? "Descargar ZIP" : "Download ZIP"');
  return c;
});

// 2. EbookWorkspace.tsx
patchFile('src/utils/ebook/EbookWorkspace.tsx', (c) => {
  c = c.replace('  const isMalay = language === "ms";', '  const isMalay = language === "ms";\n  const isThai = language === "th";');
  c = c.replace(': isIndonesian\n              ? `Pilih File eBook (${getAcceptExtensions().toUpperCase()})`', ': isThai\n              ? `เลือกไฟล์ eBook (${getAcceptExtensions().toUpperCase()})`\n              : isIndonesian\n              ? `Pilih File eBook (${getAcceptExtensions().toUpperCase()})`');
  c = c.replace('isMalay\n              ? "Tiada muat naik pelayan · 100% penukaran peribadi dalam pelayar"', 'isThai\n              ? "ไม่มีการอัปโหลดไฟล์ · แปลงไฟล์ในเบราว์เซอร์อย่างเป็นส่วนตัว 100%"\n              : isMalay\n              ? "Tiada muat naik pelayan · 100% penukaran peribadi dalam pelayar"');
  return c;
});

// 3. FontWorkspace.tsx
patchFile('src/utils/font/FontWorkspace.tsx', (c) => {
  c = c.replace('  const isMalay = language === "ms";', '  const isMalay = language === "ms";\n  const isThai = language === "th";');
  c = c.replace('isMalay\n              ? `Pilih Fail Fon (${mode === "ttf-to-woff2" ? ".TTF" : ".WOFF2"})`', 'isThai\n              ? `เลือกไฟล์ฟอนต์ (${mode === "ttf-to-woff2" ? ".TTF" : ".WOFF2"})`\n              : isMalay\n              ? `Pilih Fail Fon (${mode === "ttf-to-woff2" ? ".TTF" : ".WOFF2"})`');
  c = c.replace('isMalay\n              ? "Tiada muat naik pelayan · 100% penukaran peribadi dalam pelayar"', 'isThai\n              ? "ไม่มีการอัปโหลดไฟล์ · แปลงไฟล์ในเบราว์เซอร์อย่างเป็นส่วนตัว 100%"\n              : isMalay\n              ? "Tiada muat naik pelayan · 100% penukaran peribadi dalam pelayar"');
  return c;
});

// 4. PrivacyWorkspace.tsx
patchFile('src/utils/privacy/PrivacyWorkspace.tsx', (c) => {
  c = c.replace('  const isMalay = language === "ms";', '  const isMalay = language === "ms";\n  const isThai = language === "th";');
  c = c.replace(': isMalay\n              ? "Pilih Imej atau Dokumen untuk Pembersihan"', ': isThai\n              ? "เลือกรูปภาพหรือเอกสารเพื่อลบข้อมูลเมทาดาทา"\n              : isMalay\n              ? "Pilih Imej atau Dokumen untuk Pembersihan"');
  c = c.replace(': isMalay\n              ? "Semua data EXIF, GPS dan peranti dialih keluar terus dalam pelayar anda"', ': isThai\n              ? "ข้อมูล EXIF, GPS และข้อมูลอุปกรณ์ทั้งหมดจะถูกลบออกในเบราว์เซอร์ของคุณโดยตรง"\n              : isMalay\n              ? "Semua data EXIF, GPS dan peranti dialih keluar terus dalam pelayar anda"');
  return c;
});
