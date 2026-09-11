const fs = require('fs');

let content = fs.readFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', 'utf8');

// Normalize to LF temporarily
const isCrlf = content.includes('\r\n');
if (isCrlf) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Language definition
content = content.replace(
  'const isThai = language === "th";\n  const isMalay = language === "ms";',
  'const isThai = language === "th";\n  const isMalay = language === "ms";\n  const isVietnamese = language === "vi";'
);

// 2. Stages and errors
content = content.replace(
  'isThai\n        ? "กำลังเชื่อมต่อไปยัง microVM ที่แยกต่างหาก..."',
  'isVietnamese\n        ? "Đang kết nối với microVM riêng biệt..."\n        : isThai\n        ? "กำลังเชื่อมต่อไปยัง microVM ที่แยกต่างหาก..."'
);

content = content.replace(
  'isThai\n          ? "กำลังเรนเดอร์หน้าเอกสาร..."',
  'isVietnamese\n          ? "Đang kết xuất các trang tài liệu..."\n          : isThai\n          ? "กำลังเรนเดอร์หน้าเอกสาร..."'
);

content = content.replace(
  'isThai\n              ? `การแปลงผ่านเซิร์ฟเวอร์ล้มเหลว (${response.status})`',
  'isVietnamese\n              ? `Chuyển đổi máy chủ thất bại (${response.status})`\n              : isThai\n              ? `การแปลงผ่านเซิร์ฟเวอร์ล้มเหลว (${response.status})`'
);

content = content.replace(
  'isThai\n          ? "กำลังตรวจสอบความถูกต้องของไฟล์ PDF ที่สร้างขึ้น..."',
  'isVietnamese\n          ? "Đang xác thực tệp PDF kết quả..."\n          : isThai\n          ? "กำลังตรวจสอบความถูกต้องของไฟล์ PDF ที่สร้างขึ้น..."'
);

content = content.replace(
  'isThai\n              ? "ไม่สามารถแปลงเอกสารได้"',
  'isVietnamese\n              ? "Không thể chuyển đổi tài liệu."\n              : isThai\n              ? "ไม่สามารถแปลงเอกสารได้"'
);

content = content.replace(
  'isThai\n            ? "เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการแปลง"',
  'isVietnamese\n            ? "Đã xảy ra lỗi không mong muốn trong khi chuyển đổi."\n            : isThai\n            ? "เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการแปลง"'
);

// 3. Dropzone Header & Subtitle
content = content.replace(
  'isThai\n                ? "เลือกเอกสารที่จะแปลง"',
  'isVietnamese\n                ? "Chọn tài liệu để chuyển đổi"\n                : isThai\n                ? "เลือกเอกสารที่จะแปลง"'
);

content = content.replace(
  'isThai\n                ? "การแปลง microVM LibreOffice ความแม่นยำสูงโดยไม่มีการเก็บข้อมูล 0%"',
  'isVietnamese\n                ? "Chuyển đổi microVM LibreOffice độ chính xác cao với 0% lưu giữ dữ liệu."\n                : isThai\n                ? "การแปลง microVM LibreOffice ความแม่นยำสูงโดยไม่มีการเก็บข้อมูล 0%"'
);

// 4. Buttons
content = content.replace(
  'isThai ? "เลือกไฟล์"',
  'isVietnamese ? "Chọn tệp" : isThai ? "เลือกไฟล์"'
);

content = content.replace(
  'isThai ? "เปลี่ยนไฟล์"',
  'isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์"'
);

// 5. Ephemeral sandbox
content = content.replace(
  'isThai\n                  ? "แซนด์บ็อกซ์ MicroVM ชั่วคราว"',
  'isVietnamese\n                  ? "Hộp cát MicroVM tạm thời"\n                  : isThai\n                  ? "แซนด์บ็อกซ์ MicroVM ชั่วคราว"'
);

content = content.replace(
  'isThai\n                  ? "การประมวลผลเอกสารทำงานในคอนเทนเนอร์ microVM ที่แยกต่างหาก ไฟล์ได้รับการเข้ารหัสระหว่างส่งและลบออกจากหน่วยความจำคลาวด์โดยอัตโนมัติทันทีหลังจากการแปลง"',
  'isVietnamese\n                  ? "Xử lý tài liệu chạy trong vùng chứa microVM riêng biệt. Các tệp được mã hóa khi truyền và tự động xóa khỏi bộ nhớ đám mây ngay sau khi chuyển đổi."\n                  : isThai\n                  ? "การประมวลผลเอกสารทำงานในคอนเทนเนอร์ microVM ที่แยกต่างหาก ไฟล์ได้รับการเข้ารหัสระหว่างส่งและลบออกจากหน่วยความจำคลาวด์โดยอัตโนมัติทันทีหลังจากการแปลง"'
);

// 6. Action button & Result card
content = content.replace(
  'isThai ? (\n                "แปลงเป็น PDF"',
  'isVietnamese ? (\n                "Chuyển đổi sang PDF"\n              ) : isThai ? (\n                "แปลงเป็น PDF"'
);

content = content.replace(
  'isThai\n                      ? "แปลงเป็น PDF สำเร็จแล้ว!"',
  'isVietnamese\n                      ? "Đã chuyển đổi sang PDF thành công!"\n                      : isThai\n                      ? "แปลงเป็น PDF สำเร็จแล้ว!"'
);

content = content.replace(
  'isThai ? "ดาวน์โหลด PDF"',
  'isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF"'
);

// 7. Consent Modal
content = content.replace(
  'isThai\n                  ? "ประกาศการแปลงผ่านเซิร์ฟเวอร์ที่ปลอดภัย"',
  'isVietnamese\n                  ? "Thông báo chuyển đổi máy chủ an toàn"\n                  : isThai\n                  ? "ประกาศการแปลงผ่านเซิร์ฟเวอร์ที่ปลอดภัย"'
);

content = content.replace(
  'isThai\n                ? "การแปลงเอกสารนี้จำเป็นต้องใช้ microVM บนคลาวด์ที่แยกจากกันเพื่อรักษาความสมบูรณ์ของการจัดหน้าและแบบอักษร ไฟล์จะได้รับการประมวลผลในหน่วยความจำและลบทันที"',
  'isVietnamese\n                ? "Quá trình chuyển đổi tài liệu này yêu cầu microVM đám mây riêng biệt để đảm bảo độ trung thực hoàn toàn về bố cục và phông chữ. Tệp của bạn được xử lý trong bộ nhớ và xóa ngay sau đó."\n                : isThai\n                ? "การแปลงเอกสารนี้จำเป็นต้องใช้ microVM บนคลาวด์ที่แยกจากกันเพื่อรักษาความสมบูรณ์ของการจัดหน้าและแบบอักษร ไฟล์จะได้รับการประมวลผลในหน่วยความจำและลบทันที"'
);

content = content.replace(
  'isThai ? "ยกเลิก"',
  'isVietnamese ? "Hủy" : isThai ? "ยกเลิก"'
);

content = content.replace(
  'isThai ? "อนุญาตและแปลงไฟล์"',
  'isVietnamese ? "Cấp quyền & Chuyển đổi" : isThai ? "อนุญาตและแปลงไฟล์"'
);

// Convert back to CRLF if needed
if (isCrlf) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', content, 'utf8');
console.log('Successfully patched OfficeConverterWorkspace.tsx with Vietnamese support');
