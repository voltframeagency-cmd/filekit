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

// 1. ExactImageTargetPage.tsx
patchFile('src/components/image-tools/ExactImageTargetPage.tsx', (c) => {
  // Dropzone title
  c = c.replace(
    "th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู',",
    "vi: 'Kéo thả hình ảnh của bạn vào đây hoặc duyệt tệp',\n                  th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู',"
  );

  // Target label subtitle
  c = c.replace(
    '{language === "th" ? `เป้าหมาย: สูงสุด ${config.targetLabel} • รองรับ JPG, PNG และ WebP แบบคงที่`',
    '{language === "vi" ? `Mục tiêu: tối đa ${config.targetLabel} • Hỗ trợ JPG, PNG và WebP tĩnh` : language === "th" ? `เป้าหมาย: สูงสุด ${config.targetLabel} • รองรับ JPG, PNG และ WebP แบบคงที่`'
  );

  // Local notice
  c = c.replace(
    "th: '🔒 รูปภาพของคุณได้รับการประมวลผลในเบราว์เซอร์และไม่มีการอัปโหลด',",
    "vi: '🔒 Hình ảnh của bạn được xử lý cục bộ trong trình duyệt và không được tải lên.',\n                    th: '🔒 รูปภาพของคุณได้รับการประมวลผลในเบราว์เซอร์และไม่มีการอัปโหลด',"
  );

  // Change file button
  c = c.replace(
    '{language === "th" ? "เปลี่ยนไฟล์" :',
    '{language === "vi" ? "Đổi tệp" : language === "th" ? "เปลี่ยนไฟล์" :'
  );

  return c;
});

// 2. ImageConverterWorkspace.tsx
patchFile('src/components/image-tools/ImageConverterWorkspace.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // Select another file
  c = c.replace(
    'isThai\n                    ? "เลือกไฟล์อื่น"',
    'isVietnamese\n                    ? "Chọn tệp khác"\n                    : isThai\n                    ? "เลือกไฟล์อื่น"'
  );

  // Download converted image
  c = c.replace(
    'isThai\n                        ? "ดาวน์โหลดรูปภาพที่แปลงแล้ว"',
    'isVietnamese\n                        ? "Tải xuống hình ảnh đã chuyển đổi"\n                        : isThai\n                        ? "ดาวน์โหลดรูปภาพที่แปลงแล้ว"'
  );

  // Adjust settings
  c = c.replace(
    'isThai\n                        ? "ปรับการตั้งค่า"',
    'isVietnamese\n                        ? "Điều chỉnh cài đặt"\n                        : isThai\n                        ? "ปรับการตั้งค่า"'
  );

  // Conversion Options header
  c = c.replace(
    'isThai\n                    ? "ตัวเลือกการแปลง"',
    'isVietnamese\n                    ? "Tùy chọn chuyển đổi"\n                    : isThai\n                    ? "ตัวเลือกการแปลง"'
  );

  // Target format
  c = c.replace(
    'isThai\n                      ? "รูปแบบเป้าหมาย"',
    'isVietnamese\n                      ? "Định dạng đích"\n                      : isThai\n                      ? "รูปแบบเป้าหมาย"'
  );

  // Output format
  c = c.replace(
    'isThai\n                      ? "รูปแบบผลลัพธ์"',
    'isVietnamese\n                      ? "Định dạng đầu ra"\n                      : isThai\n                      ? "รูปแบบผลลัพธ์"'
  );

  // Background color
  c = c.replace(
    'isThai\n                      ? "สีพื้นหลัง (สำหรับความโปร่งใส)"',
    'isVietnamese\n                      ? "Màu nền (cho độ trong suốt)"\n                      : isThai\n                      ? "สีพื้นหลัง (สำหรับความโปร่งใส)"'
  );

  c = c.replace('label: isThai ? "สีขาว" :', 'label: isVietnamese ? "Trắng" : isThai ? "สีขาว" :');
  c = c.replace('label: isThai ? "สีดำ" :', 'label: isVietnamese ? "Đen" : isThai ? "สีดำ" :');
  c = c.replace('label: isThai ? "กำหนดเอง" :', 'label: isVietnamese ? "Tùy chỉnh" : isThai ? "กำหนดเอง" :');

  // Quality slider
  c = c.replace('{isThai ? "คุณภาพ" :', '{isVietnamese ? "Chất lượng" : isThai ? "คุณภาพ" :');
  c = c.replace('<span>{isThai ? "ต่ำ" :', '<span>{isVietnamese ? "Thấp" : isThai ? "ต่ำ" :');
  c = c.replace('<span>{isThai ? "สมดุล" :', '<span>{isVietnamese ? "Cân bằng" : isThai ? "สมดุล" :');
  c = c.replace('<span>{isThai ? "สูง" :', '<span>{isVietnamese ? "Cao" : isThai ? "สูง" :');

  // Convert action buttons
  c = c.replace(
    'isThai\n                    ? "กำลังแปลงรูปภาพ..."',
    'isVietnamese\n                    ? "Đang chuyển đổi hình ảnh..."\n                    : isThai\n                    ? "กำลังแปลงรูปภาพ..."'
  );
  c = c.replace(
    'isThai\n                    ? "แปลงรูปภาพอีกครั้ง"',
    'isVietnamese\n                    ? "Chuyển đổi lại hình ảnh"\n                    : isThai\n                    ? "แปลงรูปภาพอีกครั้ง"'
  );
  c = c.replace(
    'isThai\n                  ? "แปลงรูปภาพ"',
    'isVietnamese\n                  ? "Chuyển đổi hình ảnh"\n                  : isThai\n                  ? "แปลงรูปภาพ"'
  );

  return c;
});

// 3. ActionChooser.tsx
patchFile('src/components/layout/ActionChooser.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // OCR
  c = c.replace(
    'label: isThai ? "OCR PDF (ค้นหาข้อความได้)" :',
    'label: isVietnamese ? "OCR PDF (Tìm kiếm được)" : isThai ? "OCR PDF (ค้นหาข้อความได้)" :'
  );
  c = c.replace(
    'desc: isThai ? "ทำให้ไฟล์สแกน PDF ค้นหาข้อความได้" :',
    'desc: isVietnamese ? "Trích xuất văn bản từ bản quét PDF" : isThai ? "ทำให้ไฟล์สแกน PDF ค้นหาข้อความได้" :'
  );

  // Strip EXIF
  c = c.replace(
    'label: isThai ? "ลบข้อมูลเมทาดาทา (EXIF/GPS)" :',
    'label: isVietnamese ? "Xóa siêu dữ liệu (EXIF/GPS)" : isThai ? "ลบข้อมูลเมทาดาทา (EXIF/GPS)" :'
  );
  c = c.replace(
    'desc: isThai ? "ลบข้อมูลตำแหน่ง GPS และข้อมูลอุปกรณ์กล้อง" :',
    'desc: isVietnamese ? "Xóa dữ liệu vị trí GPS và máy ảnh" : isThai ? "ลบข้อมูลตำแหน่ง GPS และข้อมูลอุปกรณ์กล้อง" :'
  );

  // Office actions
  c = c.replace(
    'label: isThai ? "Word เป็น PDF" :',
    'label: isVietnamese ? "Word sang PDF" : isThai ? "Word เป็น PDF" :'
  );
  c = c.replace(
    'desc: isThai ? "แปลงไฟล์ DOCX เป็น PDF" :',
    'desc: isVietnamese ? "Chuyển đổi tệp DOCX sang PDF" : isThai ? "แปลงไฟล์ DOCX เป็น PDF" :'
  );

  c = c.replace(
    'label: isThai ? "Excel เป็น PDF" :',
    'label: isVietnamese ? "Excel sang PDF" : isThai ? "Excel เป็น PDF" :'
  );
  c = c.replace(
    'desc: isThai ? "แปลงไฟล์ XLSX เป็น PDF" :',
    'desc: isVietnamese ? "Chuyển đổi tệp XLSX sang PDF" : isThai ? "แปลงไฟล์ XLSX เป็น PDF" :'
  );

  c = c.replace(
    'label: isThai ? "PowerPoint เป็น PDF" :',
    'label: isVietnamese ? "PowerPoint sang PDF" : isThai ? "PowerPoint เป็น PDF" :'
  );
  c = c.replace(
    'desc: isThai ? "แปลงไฟล์ PPTX เป็น PDF" :',
    'desc: isVietnamese ? "Chuyển đổi tệp PPTX sang PDF" : isThai ? "แปลงไฟล์ PPTX เป็น PDF" :'
  );

  // Archive actions
  c = c.replace(
    'label: isThai ? "แตกไฟล์คลังข้อมูล" :',
    'label: isVietnamese ? "Giải nén tệp lưu trữ" : isThai ? "แตกไฟล์คลังข้อมูล" :'
  );
  c = c.replace(
    'desc: isThai ? "แตกไฟล์ที่บีบอัด ZIP, RAR, 7Z" :',
    'desc: isVietnamese ? "Giải nén tệp nén ZIP, RAR, 7Z" : isThai ? "แตกไฟล์ที่บีบอัด ZIP, RAR, 7Z" :'
  );

  c = c.replace(
    'label: isThai ? "สร้างไฟล์บีบอัด ZIP" :',
    'label: isVietnamese ? "Tạo tệp lưu trữ ZIP" : isThai ? "สร้างไฟล์บีบอัด ZIP" :'
  );
  c = c.replace(
    'desc: isThai ? "บีบอัดไฟล์เป็นรูปแบบ ZIP" :',
    'desc: isVietnamese ? "Nén các tệp thành định dạng ZIP" : isThai ? "บีบอัดไฟล์เป็นรูปแบบ ZIP" :'
  );

  // Header & Subtitle
  c = c.replace(
    'isThai ? "เลือกไฟล์แล้ว" :',
    'isVietnamese ? "Đã chọn tệp" : isThai ? "เลือกไฟล์แล้ว" :'
  );
  c = c.replace(
    'isThai ? "คุณต้องการดำเนินการใดกับไฟล์นี้?" :',
    'isVietnamese ? "Bạn muốn thực hiện thao tác nào trên tệp này?" : isThai ? "คุณต้องการดำเนินการใดกับไฟล์นี้?" :'
  );

  // Categories
  c = c.replace(
    'isThai ? "การดำเนินการ PDF ที่แนะนำ" :',
    'isVietnamese ? "Tác vụ PDF đề xuất" : isThai ? "การดำเนินการ PDF ที่แนะนำ" :'
  );
  c = c.replace(
    'isThai ? "การดำเนินการรูปภาพที่แนะนำ" :',
    'isVietnamese ? "Tác vụ hình ảnh đề xuất" : isThai ? "การดำเนินการรูปภาพที่แนะนำ" :'
  );
  c = c.replace(
    'isThai ? "การดำเนินการไฟล์ Office" :',
    'isVietnamese ? "Tác vụ Office" : isThai ? "การดำเนินการไฟล์ Office" :'
  );
  c = c.replace(
    'isThai ? "การดำเนินการไฟล์คลังข้อมูล" :',
    'isVietnamese ? "Tác vụ tệp lưu trữ" : isThai ? "การดำเนินการไฟล์คลังข้อมูล" :'
  );

  // Start button
  c = c.replaceAll(
    'isThai ? "เริ่ม →" :',
    'isVietnamese ? "Bắt đầu →" : isThai ? "เริ่ม →" :'
  );

  return c;
});

// 4. MobileNavigation.tsx
patchFile('src/components/navigation/MobileNavigation.tsx', (c) => {
  c = c.replace(
    '            const isThai = activeLocale === "th";',
    '            const isThai = activeLocale === "th";\n            const isVietnamese = activeLocale === "vi";'
  );

  // Categories
  c = c.replace('if (label.includes("IMAGE")) {\n              if (isThai) return "รูปภาพ";', 'if (label.includes("IMAGE")) {\n              if (isVietnamese) return "HÌNH ẢNH";\n              if (isThai) return "รูปภาพ";');
  c = c.replace('if (label.includes("PDF")) {\n              if (isThai) return "PDF";', 'if (label.includes("PDF")) {\n              if (isVietnamese) return "PDF";\n              if (isThai) return "PDF";');
  c = c.replace('if (label.includes("VIDEO")) {\n              if (isThai) return "วิดีโอ";', 'if (label.includes("VIDEO")) {\n              if (isVietnamese) return "VIDEO";\n              if (isThai) return "วิดีโอ";');
  c = c.replace('if (label.includes("SUBTITLE")) {\n              if (isThai) return "คำบรรยาย";', 'if (label.includes("SUBTITLE")) {\n              if (isVietnamese) return "PHỤ ĐỀ";\n              if (isThai) return "คำบรรยาย";');
  c = c.replace('if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {\n              if (isThai) return "เอกสาร";', 'if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {\n              if (isVietnamese) return "TÀI LIỆU";\n              if (isThai) return "เอกสาร";');
  c = c.replace('if (label.includes("CAD")) {\n              if (isThai) return "CAD และเวกเตอร์";', 'if (label.includes("CAD")) {\n              if (isVietnamese) return "CAD & VECTOR";\n              if (isThai) return "CAD และเวกเตอร์";');
  c = c.replace('if (label.includes("AUDIO")) {\n              if (isThai) return "เสียง";', 'if (label.includes("AUDIO")) {\n              if (isVietnamese) return "ÂM THANH";\n              if (isThai) return "เสียง";');
  c = c.replace('if (label.includes("ARCHIVE")) {\n              if (isThai) return "คลังข้อมูล";', 'if (label.includes("ARCHIVE")) {\n              if (isVietnamese) return "LƯU TRỮ";\n              if (isThai) return "คลังข้อมูล";');

  // getLocalizedLinkLabel
  c = c.replace(
    'const toPrep = activeLocale === "th" ? "เป็น" :',
    'const toPrep = activeLocale === "vi" ? "sang" : activeLocale === "th" ? "เป็น" :'
  );

  c = c.replace(
    'if (activeLocale === "th") return `บีบอัด ${item}`;',
    'if (activeLocale === "vi") return `Nén ${item}`;\n              if (activeLocale === "th") return `บีบอัด ${item}`;'
  );
  c = c.replace(
    'if (activeLocale === "th") return `แปลง ${item}`;',
    'if (activeLocale === "vi") return `Chuyển đổi ${item}`;\n              if (activeLocale === "th") return `แปลง ${item}`;'
  );
  c = c.replace(
    'if (activeLocale === "th") return `แยก ${item}`;',
    'if (activeLocale === "vi") return `Trích xuất ${item}`;\n              if (activeLocale === "th") return `แยก ${item}`;'
  );
  c = c.replace(
    'if (activeLocale === "th") return `หมุน ${item}`;',
    'if (activeLocale === "vi") return `Xoay ${item}`;\n              if (activeLocale === "th") return `หมุน ${item}`;'
  );
  c = c.replace(
    'if (activeLocale === "th") return `ตัด ${item}`;',
    'if (activeLocale === "vi") return `Cắt ${item}`;\n              if (activeLocale === "th") return `ตัด ${item}`;'
  );

  return c;
});

// 5. PdfSelectionToolbar.tsx
patchFile('src/components/pdf-editor/PdfSelectionToolbar.tsx', (c) => {
  c = c.replace('  const isMalay = language === "ms";', '  const isMalay = language === "ms";\n  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // active pages
  c = c.replace(': isThai ? "หน้าที่ใช้งานอยู่" :', ': isVietnamese ? "trang đang hoạt động" : isThai ? "หน้าที่ใช้งานอยู่" :');
  // Total
  c = c.replace(': isThai ? "ทั้งหมด" :', ': isVietnamese ? "Tổng số" : isThai ? "ทั้งหมด" :');
  // selected
  c = c.replace(': isThai ? "เลือกแล้ว" :', ': isVietnamese ? "đã chọn" : isThai ? "เลือกแล้ว" :');
  // deleted
  c = c.replace(': isThai ? "ลบแล้ว" :', ': isVietnamese ? "đã xóa" : isThai ? "ลบแล้ว" :');
  // Add More PDFs
  c = c.replace(': isThai ? "เพิ่มไฟล์ PDF" :', ': isVietnamese ? "Thêm tệp PDF" : isThai ? "เพิ่มไฟล์ PDF" :');
  // Sort by Filename
  c = c.replace(': isThai ? "เรียงตามชื่อไฟล์" :', ': isVietnamese ? "Sắp xếp theo tên tệp" : isThai ? "เรียงตามชื่อไฟล์" :');
  // Select All
  c = c.replace(': isThai ? "เลือกทั้งหมด" :', ': isVietnamese ? "Chọn tất cả" : isThai ? "เลือกทั้งหมด" :');
  // Deselect All
  c = c.replace(': isThai ? "ยกเลิกการเลือก" :', ': isVietnamese ? "Bỏ chọn tất cả" : isThai ? "ยกเลิกการเลือก" :');
  // Invert
  c = c.replace(': isThai ? "สลับการเลือก" :', ': isVietnamese ? "Đảo vùng chọn" : isThai ? "สลับการเลือก" :');
  // Rotate 90
  c = c.replace(': isThai ? "หมุน 90°" :', ': isVietnamese ? "Xoay 90°" : isThai ? "หมุน 90°" :');
  // Rotate Odd Pages
  c = c.replace(': isThai ? "หมุนหน้าคี่" :', ': isVietnamese ? "Xoay trang lẻ" : isThai ? "หมุนหน้าคี่" :');
  // Rotate Even Pages
  c = c.replace(': isThai ? "หมุนหน้าคู่" :', ': isVietnamese ? "Xoay trang chẵn" : isThai ? "หมุนหน้าคู่" :');
  // Delete
  c = c.replace(': isThai ? "ลบ" :', ': isVietnamese ? "Xóa" : isThai ? "ลบ" :');
  // Restore All
  c = c.replace(': isThai ? `กู้คืนทั้งหมด (${deletedPages.length})` :', ': isVietnamese ? `Khôi phục tất cả (${deletedPages.length})` : isThai ? `กู้คืนทั้งหมด (${deletedPages.length})` :');

  return c;
});

// 6. PdfManipulationWorkspace.tsx
patchFile('src/components/pdf-manipulation/PdfManipulationWorkspace.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // Dropzone header
  c = c.replace(
    'isThai ? `เลือกไฟล์ PDF เพื่อเริ่มต้น (${toolTitle})` :',
    'isVietnamese ? `Chọn tệp PDF để bắt đầu (${toolTitle})` : isThai ? `เลือกไฟล์ PDF เพื่อเริ่มต้น (${toolTitle})` :'
  );

  // Dropzone subtitle
  c = c.replace(
    'isThai ? "ประมวลผลทั้งหมดบนอุปกรณ์ของคุณภายในเบราว์เซอร์ ไฟล์ของคุณจะไม่ถูกอัปโหลด" :',
    'isVietnamese ? "Xử lý hoàn toàn trên thiết bị của bạn trong môi trường cách ly của trình duyệt. Dữ liệu của bạn không bao giờ rời khỏi máy tính." : isThai ? "ประมวลผลทั้งหมดบนอุปกรณ์ของคุณภายในเบราว์เซอร์ ไฟล์ของคุณจะไม่ถูกอัปโหลด" :'
  );

  // Choose PDF button
  c = c.replace(
    'isThai ? "เลือกไฟล์ PDF" :',
    'isVietnamese ? "Chọn tệp PDF" : isThai ? "เลือกไฟล์ PDF" :'
  );

  // Local Safe badge
  c = c.replace(
    ': isThai ? "ปลอดภัยในเครื่อง" :',
    ': isVietnamese ? "An toàn cục bộ" : isThai ? "ปลอดภัยในเครื่อง" :'
  );

  // Change PDF button
  c = c.replace(
    'isThai ? "เปลี่ยน PDF" :',
    'isVietnamese ? "Đổi PDF" : isThai ? "เปลี่ยน PDF" :'
  );

  // Blank page options label
  c = c.replace(
    'isThai ? "ตำแหน่งการแทรกหน้าว่าง:" :',
    'isVietnamese ? "Vị trí chèn trang trống:" : isThai ? "ตำแหน่งการแทรกหน้าว่าง:" :'
  );

  // Blank page positions
  c = c.replace('label: isThai ? "ที่ส่วนท้าย" :', 'label: isVietnamese ? "Ở cuối" : isThai ? "ที่ส่วนท้าย" :');
  c = c.replace('label: isThai ? "ที่ส่วนหน้า" :', 'label: isVietnamese ? "Ở đầu" : isThai ? "ที่ส่วนหน้า" :');
  c = c.replace('label: isThai ? "หลังทุกหน้า" :', 'label: isVietnamese ? "Sau mỗi trang" : isThai ? "หลังทุกหน้า" :');
  c = c.replace('label: isThai ? "กำหนดเลขหน้าเอง" :', 'label: isVietnamese ? "Số trang tùy chỉnh" : isThai ? "กำหนดเลขหน้าเอง" :');

  // Processing state
  c = c.replace(
    'isThai ? "กำลังประมวลผลบนอุปกรณ์นี้..." :',
    'isVietnamese ? "Đang xử lý trên thiết bị này..." : isThai ? "กำลังประมวลผลบนอุปกรณ์นี้..." :'
  );

  // Action buttons
  c = c.replace('isThai ? "กลับลำดับหน้า PDF" :', 'isVietnamese ? "Đảo ngược thứ tự trang PDF" : isThai ? "กลับลำดับหน้า PDF" :');
  c = c.replace('isThai ? "แทรกหน้าว่าง" :', 'isVietnamese ? "Chèn trang trống" : isThai ? "แทรกหน้าว่าง" :');
  c = c.replace('isThai ? "ทำซ้ำหน้า PDF" :', 'isVietnamese ? "Nhân bản trang PDF" : isThai ? "ทำซ้ำหน้า PDF" :');
  c = c.replace('isThai ? "แยกข้อความ" :', 'isVietnamese ? "Trích xuất văn bản" : isThai ? "แยกข้อความ" :');
  c = c.replace('isThai ? "แยกรูปภาพ" :', 'isVietnamese ? "Trích xuất hình ảnh" : isThai ? "แยกรูปภาพ" :');
  c = c.replace('isThai ? "ผสานแบบฟอร์ม PDF" :', 'isVietnamese ? "Làm phẳng biểu mẫu PDF" : isThai ? "ผสานแบบฟอร์ม PDF" :');

  // Extracted text content
  c = c.replace(
    'isThai ? "เนื้อหาข้อความที่แยกได้:" :',
    'isVietnamese ? "Nội dung văn bản đã trích xuất:" : isThai ? "เนื้อหาข้อความที่แยกได้:" :'
  );
  c = c.replace(
    ': isThai ? "📋 คัดลอกข้อความทั้งหมด" :',
    ': isVietnamese ? "📋 Sao chép toàn bộ văn bản" : isThai ? "📋 คัดลอกข้อความทั้งหมด" :'
  );

  // Extracted images
  c = c.replace(
    'isThai ? `แยกรูปภาพสำเร็จ ${extractedImages.length} รูป` :',
    'isVietnamese ? `Trích xuất thành công ${extractedImages.length} hình ảnh` : isThai ? `แยกรูปภาพสำเร็จ ${extractedImages.length} รูป` :'
  );
  c = c.replace(
    'isThai ? `หน้า ${img.pageIndex}` :',
    'isVietnamese ? `Trang ${img.pageIndex}` : isThai ? `หน้า ${img.pageIndex}` :'
  );
  c = c.replace(
    'isThai ? "ดาวน์โหลด PNG" : isMalay ? "Muat Turun PNG" : "Download PNG"',
    'isVietnamese ? "Tải xuống PNG" : isThai ? "ดาวน์โหลด PNG" : isMalay ? "Muat Turun PNG" : "Download PNG"'
  );

  // Complete result
  c = c.replace('isThai ? "การดำเนินการเสร็จสมบูรณ์" :', 'isVietnamese ? "Thao tác hoàn tất" : isThai ? "การดำเนินการเสร็จสมบูรณ์" :');
  c = c.replace('isThai ? "ประมวลผลในเครื่อง 100%" :', 'isVietnamese ? "Được xử lý 100% cục bộ" : isThai ? "ประมวลผลในเครื่อง 100%" :');
  c = c.replace('isThai ? "ดาวน์โหลดไฟล์" :', 'isVietnamese ? "Tải xuống tệp" : isThai ? "ดาวน์โหลดไฟล์" :');

  return c;
});

// 7. PdfWatermarkControls.tsx
patchFile('src/components/pdf-overlay/PdfWatermarkControls.tsx', (c) => {
  c = c.replace('  const isThai = language === "th";', '  const isThai = language === "th";\n  const isVietnamese = language === "vi";');

  // Watermark Type
  c = c.replace(': isThai ? "ประเภทลายน้ำ" :', ': isVietnamese ? "Loại dấu bản quyền" : isThai ? "ประเภทลายน้ำ" :');
  // Text Watermark
  c = c.replace(': isThai ? "ลายน้ำข้อความ" :', ': isVietnamese ? "Dấu văn bản" : isThai ? "ลายน้ำข้อความ" :');
  // Image Logo
  c = c.replace(': isThai ? "โลโก้ / รูปภาพ" :', ': isVietnamese ? "Logo / Hình ảnh" : isThai ? "โลโก้ / รูปภาพ" :');
  // Watermark Text input
  c = c.replace(': isThai ? "ข้อความลายน้ำ" :', ': isVietnamese ? "Văn bản dấu bản quyền" : isThai ? "ข้อความลายน้ำ" :');
  // Font Color
  c = c.replace(': isThai ? "สีข้อความ" :', ': isVietnamese ? "Màu chữ" : isThai ? "สีข้อความ" :');
  // Font Size
  c = c.replace(': isThai ? `ขนาดตัวอักษร (${config.fontSize || 36} pt)` :', ': isVietnamese ? `Cỡ chữ (${config.fontSize || 36} pt)` : isThai ? `ขนาดตัวอักษร (${config.fontSize || 36} pt)` :');
  // Select Logo Image
  c = c.replace(': isThai ? "เลือกรูปภาพโลโก้ (PNG / JPEG)" :', ': isVietnamese ? "Chọn hình ảnh logo (PNG / JPEG)" : isThai ? "เลือกรูปภาพโลโก้ (PNG / JPEG)" :');
  // Opacity
  c = c.replace(': isThai ? "ความโปร่งใส" :', ': isVietnamese ? "Độ mờ đục" : isThai ? "ความโปร่งใส" :');
  // Rotation
  c = c.replace(': isThai ? "การหมุน" :', ': isVietnamese ? "Góc xoay" : isThai ? "การหมุน" :');
  // Position Preset label
  c = c.replace(': isThai ? "ตำแหน่ง" :', ': isVietnamese ? "Vị trí đặt sẵn" : isThai ? "ตำแหน่ง" :');

  // Position presets map
  c = c.replace(
    '              th: {\n                "Top Left": "บนซ้าย",\n                "Center": "กึ่งกลาง",\n                "Top Right": "บนขวา",\n                "Bottom Left": "ล่างซ้าย",\n                "Tile Grid": "เรียงต่อกัน",\n                "Bottom Right": "ล่างขวา",\n                "Custom X/Y": "กำหนดเอง X/Y"\n              }',
    '              th: {\n                "Top Left": "บนซ้าย",\n                "Center": "กึ่งกลาง",\n                "Top Right": "บนขวา",\n                "Bottom Left": "ล่างซ้าย",\n                "Tile Grid": "เรียงต่อกัน",\n                "Bottom Right": "ล่างขวา",\n                "Custom X/Y": "กำหนดเอง X/Y"\n              },\n              vi: {\n                "Top Left": "Trên cùng bên trái",\n                "Center": "Ở giữa",\n                "Top Right": "Trên cùng bên phải",\n                "Bottom Left": "Dưới cùng bên trái",\n                "Tile Grid": "Dạng lưới lặp lại",\n                "Bottom Right": "Dưới cùng bên phải",\n                "Custom X/Y": "Tùy chỉnh X/Y"\n              }'
  );

  c = c.replace(
    ': isThai ? labelMap.th[preset.label] : null',
    ': isVietnamese ? labelMap.vi[preset.label] : isThai ? labelMap.th[preset.label] : null'
  );

  // Custom X/Y
  c = c.replace(': isThai ? "กำหนดเอง X (pt)" :', ': isVietnamese ? "Tùy chỉnh X (pt)" : isThai ? "กำหนดเอง X (pt)" :');
  c = c.replace(': isThai ? "กำหนดเอง Y (pt)" :', ': isVietnamese ? "Tùy chỉnh Y (pt)" : isThai ? "กำหนดเอง Y (pt)" :');

  // Apply to Pages
  c = c.replace(': isThai ? "นำไปใช้กับหน้า" :', ': isVietnamese ? "Áp dụng cho các trang" : isThai ? "นำไปใช้กับหน้า" :');

  return c;
});

console.log('Finished patching all remaining components for Vietnamese.');
