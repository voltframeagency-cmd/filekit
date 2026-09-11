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

// 1. FontWorkspace.tsx
patchFile('src/utils/font/FontWorkspace.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // Preview pangram
  c = c.replace(
    ': isThai\n      ? "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน ๑๒๓๔๕๖๗๘๙๐"',
    ': isVietnamese\n      ? "Cơm, phở, bánh mì, bún chả là những món ăn ngon của Việt Nam 1234567890"\n      : isThai\n      ? "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน ๑๒๓๔๕๖๗๘๙๐"'
  );

  // Conversion error
  c = c.replace(
    ': isThai\n          ? "ไม่สามารถแปลงฟอนต์ได้ โปรดตรวจสอบว่าเป็นไฟล์ TTF, OTF หรือ WOFF ที่ถูกต้อง"',
    ': isVietnamese\n          ? "Không thể chuyển đổi phông chữ. Vui lòng đảm bảo tệp hợp lệ (TTF, OTF hoặc WOFF)."\n          : isThai\n          ? "ไม่สามารถแปลงฟอนต์ได้ โปรดตรวจสอบว่าเป็นไฟล์ TTF, OTF หรือ WOFF ที่ถูกต้อง"'
  );

  // Title fallback
  c = c.replace(
    'isThai ? "แปลง TTF เป็น WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF"',
    'isVietnamese ? "Chuyển đổi TTF sang WOFF2 / WOFF" : isThai ? "แปลง TTF เป็น WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF"'
  );
  c = c.replace(
    'isThai ? "แปลง WOFF2 เป็น TTF" : "Convert WOFF2 to TTF"',
    'isVietnamese ? "Chuyển đổi WOFF2 sang TTF" : isThai ? "แปลง WOFF2 เป็น TTF" : "Convert WOFF2 to TTF"'
  );

  // Description fallback
  c = c.replace(
    'isThai ? "เครื่องมือบีบอัดฟอนต์เว็บประสิทธิภาพสูง · ทำงานในเบราว์เซอร์ 100%" : "High-Performance Web Font Compressor · 100% In-Browser"',
    'isVietnamese ? "Công cụ nén phông chữ web hiệu năng cao · 100% trong trình duyệt" : isThai ? "เครื่องมือบีบอัดฟอนต์เว็บประสิทธิภาพสูง · ทำงานในเบราว์เซอร์ 100%" : "High-Performance Web Font Compressor · 100% In-Browser"'
  );

  // Dropzone title
  c = c.replace(
    ': isThai\n              ? "เลือกไฟล์ฟอนต์ (TTF, OTF, WOFF)"',
    ': isVietnamese\n              ? "Chọn tệp phông chữ (TTF, OTF, WOFF)"\n              : isThai\n              ? "เลือกไฟล์ฟอนต์ (TTF, OTF, WOFF)"'
  );

  // Dropzone subtitle
  c = c.replace(
    ': isThai\n              ? "เพิ่มประสิทธิภาพสำหรับเว็บ (ประมวลผลในเครื่อง 100% โดยไม่มีการส่งข้อมูล)"',
    ': isVietnamese\n              ? "Tối ưu hóa tải web nhanh (100% xử lý cục bộ, không gửi dữ liệu ra ngoài)"\n              : isThai\n              ? "เพิ่มประสิทธิภาพสำหรับเว็บ (ประมวลผลในเครื่อง 100% โดยไม่มีการส่งข้อมูล)"'
  );

  // Font metadata line
  c = c.replace(
    ': isThai\n                  ? `รูปแบบ: ${fontMeta?.format.toUpperCase()} · ตาราง: ${fontMeta?.numTables} · ขนาด: ${(file.size / 1024).toFixed(1)} KB`',
    ': isVietnamese\n                  ? `Định dạng: ${fontMeta?.format.toUpperCase()} · Bảng: ${fontMeta?.numTables} · Kích thước: ${(file.size / 1024).toFixed(1)} KB`\n                  : isThai\n                  ? `รูปแบบ: ${fontMeta?.format.toUpperCase()} · ตาราง: ${fontMeta?.numTables} · ขนาด: ${(file.size / 1024).toFixed(1)} KB`'
  );

  // Change font button
  c = c.replace(
    ': isThai ? "เปลี่ยนฟอนต์" : "Change Font"',
    ': isVietnamese ? "Đổi phông chữ" : isThai ? "เปลี่ยนฟอนต์" : "Change Font"'
  );

  // Live font preview label
  c = c.replace(
    ': isThai ? "ตัวอย่างฟอนต์สด" : "Live Font Preview"',
    ': isVietnamese ? "Xem trước phông chữ trực tiếp" : isThai ? "ตัวอย่างฟอนต์สด" : "Live Font Preview"'
  );

  // Size label
  c = c.replace(
    ': isThai ? "ขนาด:" : "Size:"',
    ': isVietnamese ? "Cỡ chữ:" : isThai ? "ขนาด:" : "Size:"'
  );

  // Converted badge
  c = c.replace(
    ': isThai\n                    ? `✓ แปลงฟอนต์สำเร็จ: ${outputFileName}`',
    ': isVietnamese\n                    ? `✓ Đã chuyển đổi phông chữ: ${outputFileName}`\n                    : isThai\n                    ? `✓ แปลงฟอนต์สำเร็จ: ${outputFileName}`'
  );

  // Converted size note
  c = c.replace(
    ': isThai\n                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · ในเบราว์เซอร์ 100%`',
    ': isVietnamese\n                    ? `Dung lượng: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% trong trình duyệt`\n                    : isThai\n                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · ในเบราว์เซอร์ 100%`'
  );

  // Download button
  c = c.replace(
    ': isThai ? "ดาวน์โหลดฟอนต์" : "Download Font"',
    ': isVietnamese ? "Tải xuống phông chữ" : isThai ? "ดาวน์โหลดฟอนต์" : "Download Font"'
  );

  return c;
});

// 2. ImageCompressionWorkspace.tsx
patchFile('src/components/image-tools/ImageCompressionWorkspace.tsx', (c) => {
  c = c.replace(
    "th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู',",
    "vi: 'Kéo thả hình ảnh của bạn vào đây hoặc duyệt tệp', th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู',"
  );
  c = c.replace(
    "th: 'รองรับ JPG, PNG และ WebP แบบคงที่ สูงสุด 50 MB',",
    "vi: 'Hỗ trợ JPG, PNG và WebP tĩnh tối đa 50 MB', th: 'รองรับ JPG, PNG และ WebP แบบคงที่ สูงสุด 50 MB',"
  );
  c = c.replace(
    "th: '🔒 รูปภาพของคุณได้รับการประมวลผลในเบราว์เซอร์และไม่มีการอัปโหลด',",
    "vi: '🔒 Hình ảnh của bạn được xử lý cục bộ trong trình duyệt và không được tải lên.', th: '🔒 รูปภาพของคุณได้รับการประมวลผลในเบราว์เซอร์และไม่มีการอัปโหลด',"
  );
  return c;
});

console.log('Finished FontWorkspace and ImageCompressionWorkspace patches.');
