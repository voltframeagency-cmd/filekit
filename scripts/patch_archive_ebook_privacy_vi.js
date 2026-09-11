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
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');
  
  c = c.replace(
    ': isThai\n                  ? "ลากไฟล์มาวางที่นี่เพื่อรวมเป็นไฟล์ ZIP"',
    ': isVietnamese\n                  ? "Kéo thả các tệp vào đây để tạo tệp ZIP"\n                  : isThai\n                  ? "ลากไฟล์มาวางที่นี่เพื่อรวมเป็นไฟล์ ZIP"'
  );
  c = c.replace(
    ': isThai\n                  ? "เลือกไฟล์คลังข้อมูลเพื่อแตกไฟล์หรือแปลง"',
    ': isVietnamese\n                  ? "Chọn tệp lưu trữ để giải nén hoặc chuyển đổi"\n                  : isThai\n                  ? "เลือกไฟล์คลังข้อมูลเพื่อแตกไฟล์หรือแปลง"'
  );
  c = c.replace(
    ': isThai\n                  ? "รองรับทุกรูปแบบไฟล์ (เลือกหลายไฟล์ได้)"',
    ': isVietnamese\n                  ? "Hỗ trợ mọi định dạng tệp (Được phép chọn nhiều tệp)"\n                  : isThai\n                  ? "รองรับทุกรูปแบบไฟล์ (เลือกหลายไฟล์ได้)"'
  );
  c = c.replace(
    ': isThai\n                  ? "ประมวลผลในเบราว์เซอร์ของคุณอย่างปลอดภัย 100%"',
    ': isVietnamese\n                  ? "Xử lý cục bộ 100% trong trình duyệt của bạn"\n                  : isThai\n                  ? "ประมวลผลในเบราว์เซอร์ของคุณอย่างปลอดภัย 100%"'
  );

  // Reset button
  c = c.replace(
    ': isThai ? "รีเซ็ต" : "Reset"',
    ': isVietnamese ? "Đặt lại" : isThai ? "รีเซ็ต" : "Reset"'
  );

  // Archive Name label
  c = c.replace(
    ': isThai ? "ชื่อไฟล์คลังข้อมูล:" : "Archive Name:"',
    ': isVietnamese ? "Tên tệp lưu trữ:" : isThai ? "ชื่อไฟล์คลังข้อมูล:" : "Archive Name:"'
  );

  // Ready ZIP card
  c = c.replace(
    ': isThai\n                    ? `✓ สร้าง ZIP สำเร็จ: ${outputFileName}`',
    ': isVietnamese\n                    ? `✓ Đã tạo tệp ZIP thành công: ${outputFileName}`\n                    : isThai\n                    ? `✓ สร้าง ZIP สำเร็จ: ${outputFileName}`'
  );
  c = c.replace(
    ': isThai\n                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% ในเบราว์เซอร์`',
    ': isVietnamese\n                    ? `Dung lượng: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% trong trình duyệt`\n                    : isThai\n                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% ในเบราว์เซอร์`'
  );

  // Download buttons
  c = c.replace(
    ': isThai ? "ดาวน์โหลด" : "Download"',
    ': isVietnamese ? "Tải xuống" : isThai ? "ดาวน์โหลด" : "Download"'
  );
  c = c.replace(
    'isThai ? "ดาวน์โหลด ZIP" : isSpanish ? "Descargar ZIP" : "Download ZIP"',
    'isVietnamese ? "Tải xuống ZIP" : isThai ? "ดาวน์โหลด ZIP" : isSpanish ? "Descargar ZIP" : "Download ZIP"'
  );

  return c;
});

// 2. EbookWorkspace.tsx
patchFile('src/utils/ebook/EbookWorkspace.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // Dropzone title
  c = c.replace(
    ': isThai\n              ? `เลือกไฟล์ eBook (${getAcceptExtensions().toUpperCase()})`',
    ': isVietnamese\n              ? `Chọn tệp eBook (${getAcceptExtensions().toUpperCase()})`\n              : isThai\n              ? `เลือกไฟล์ eBook (${getAcceptExtensions().toUpperCase()})`'
  );

  // Dropzone subtitle
  c = c.replace(
    'isThai\n              ? "ไม่มีการอัปโหลดไฟล์ · แปลงไฟล์ในเบราว์เซอร์อย่างเป็นส่วนตัว 100%"',
    'isVietnamese\n              ? "Không tải tệp lên máy chủ · Chuyển đổi riêng tư 100% trong trình duyệt"\n              : isThai\n              ? "ไม่มีการอัปโหลดไฟล์ · แปลงไฟล์ในเบราว์เซอร์อย่างเป็นส่วนตัว 100%"'
  );

  // Change file button
  c = c.replace(
    ': isThai ? "เปลี่ยนไฟล์" : "Change File"',
    ': isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์" : "Change File"'
  );

  // Download PDF button
  c = c.replace(
    ': isThai ? "ดาวน์โหลด PDF" : "Download PDF"',
    ': isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF" : "Download PDF"'
  );

  return c;
});

// 3. PrivacyWorkspace.tsx
patchFile('src/utils/privacy/PrivacyWorkspace.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // Title fallback
  c = c.replace(
    ': isThai ? "ลบข้อมูล EXIF และข้อมูลภาพถ่าย" : "Strip EXIF & Photo Metadata"',
    ': isVietnamese ? "Xóa EXIF & siêu dữ liệu ảnh" : isThai ? "ลบข้อมูล EXIF และข้อมูลภาพถ่าย" : "Strip EXIF & Photo Metadata"'
  );

  // Description fallback
  c = c.replace(
    ': isThai ? "ลบตำแหน่ง GPS, ซีเรียลกล้อง และข้อมูลอุปกรณ์ · ในเบราว์เซอร์ 100%" : "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"',
    ': isVietnamese ? "Xóa vị trí GPS, số sê-ri máy ảnh & thông tin thiết bị · 100% trong trình duyệt" : isThai ? "ลบตำแหน่ง GPS, ซีเรียลกล้อง และข้อมูลอุปกรณ์ · ในเบราว์เซอร์ 100%" : "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"'
  );

  // Dropzone title
  c = c.replace(
    ': isThai\n              ? "เลือกรูปภาพหรือเอกสารเพื่อลบข้อมูลเมทาดาทา"',
    ': isVietnamese\n              ? "Chọn hình ảnh hoặc tài liệu để làm sạch siêu dữ liệu"\n              : isThai\n              ? "เลือกรูปภาพหรือเอกสารเพื่อลบข้อมูลเมทาดาทา"'
  );

  // Dropzone subtitle
  c = c.replace(
    ': isThai\n              ? "ข้อมูล EXIF, GPS และข้อมูลอุปกรณ์ทั้งหมดจะถูกลบออกในเบราว์เซอร์ของคุณโดยตรง"',
    ': isVietnamese\n              ? "Mọi dữ liệu EXIF, GPS và thông tin thiết bị đều được xóa trực tiếp trong trình duyệt của bạn"\n              : isThai\n              ? "ข้อมูล EXIF, GPS และข้อมูลอุปกรณ์ทั้งหมดจะถูกลบออกในเบราว์เซอร์ของคุณโดยตรง"'
  );

  // File Details label
  c = c.replace(
    ': isThai ? "รายละเอียดไฟล์" : "File Details"',
    ': isVietnamese ? "Chi tiết tệp" : isThai ? "รายละเอียดไฟล์" : "File Details"'
  );

  // Detected Metadata label
  c = c.replace(
    ': isThai ? "ข้อมูลเมทาดาทาที่ตรวจพบ" : "Detected Metadata"',
    ': isVietnamese ? "Siêu dữ liệu phát hiện được" : isThai ? "ข้อมูลเมทาดาทาที่ตรวจพบ" : "Detected Metadata"'
  );

  // Camera label
  c = c.replace(
    ': isThai ? "กล้อง:" : "Camera:"',
    ': isVietnamese ? "Máy ảnh:" : isThai ? "กล้อง:" : "Camera:"'
  );

  return c;
});

console.log('Finished patching Archive, Ebook, Privacy workspaces.');
