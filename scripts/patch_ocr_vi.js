const fs = require('fs');

const file = 'src/components/ocr-tools/OcrPdfWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Language prop & definition
content = content.replace(
  'export interface OcrPdfWorkspaceProps {\n  toolTitle: string;\n  toolSlug: string;\n  defaultMode: "searchable_pdf" | "extract_text";\n}',
  'export interface OcrPdfWorkspaceProps {\n  toolTitle: string;\n  toolSlug: string;\n  defaultMode: "searchable_pdf" | "extract_text";\n  language?: string;\n}'
);

content = content.replace(
  'export const OcrPdfWorkspace: React.FC<OcrPdfWorkspaceProps> = ({\n  toolTitle,\n  toolSlug,\n  defaultMode,\n}) => {\n  const { language } = useLanguage();',
  'export const OcrPdfWorkspace: React.FC<OcrPdfWorkspaceProps> = ({\n  toolTitle,\n  toolSlug,\n  defaultMode,\n  language: propLanguage,\n}) => {\n  const { language: contextLang } = useLanguage();\n  const language = propLanguage || contextLang || "en";'
);

content = content.replace(
  '  const isThai = language === "th";',
  '  const isThai = language === "th";\n  const isVietnamese = language === "vi";'
);

// 2. Reading file data stage
content = content.replace(
  '        : isThai\n        ? "กำลังอ่านข้อมูลไฟล์เข้าสู่หน่วยความจำ..."',
  '        : isVietnamese\n        ? "Đang đọc dữ liệu tệp vào bộ nhớ..."\n        : isThai\n        ? "กำลังอ่านข้อมูลไฟล์เข้าสู่หน่วยความจำ..."'
);

// 3. Error recognizing text
content = content.replace(
  '            : isThai\n            ? "ไม่สามารถจดจำข้อความในเอกสารได้"',
  '            : isVietnamese\n            ? "Không thể nhận dạng văn bản trong tài liệu."\n            : isThai\n            ? "ไม่สามารถจดจำข้อความในเอกสารได้"'
);

// 4. Dropzone header
content = content.replace(
  '              {isThai\n                ? "เลือกเอกสารที่สแกนหรือรูปภาพ"',
  '              {isVietnamese\n                ? "Chọn tài liệu quét hoặc hình ảnh"\n                : isThai\n                ? "เลือกเอกสารที่สแกนหรือรูปภาพ"'
);

// 5. Dropzone subtitle
content = content.replace(
  '                : isThai\n                ? "OCR ในเบราว์เซอร์ส่วนตัว 100% ไฟล์จะไม่ถูกอัปโหลดออกจากอุปกรณ์ของคุณ"',
  '                : isVietnamese\n                ? "OCR 100% riêng tư trong trình duyệt. Tệp không bao giờ rời khỏi thiết bị của bạn."\n                : isThai\n                ? "OCR ในเบราว์เซอร์ส่วนตัว 100% ไฟล์จะไม่ถูกอัปโหลดออกจากอุปกรณ์ของคุณ"'
);

// 6. Choose PDF or Image button
content = content.replace(
  '              : isThai\n              ? "เลือก PDF หรือรูปภาพ"',
  '              : isVietnamese\n              ? "Chọn PDF hoặc Hình ảnh"\n              : isThai\n              ? "เลือก PDF หรือรูปภาพ"'
);

// 7. Change File
content = content.replace(
  ': isSpanish ? "Cambiar archivo" : isMalay ? "Tukar Fail" : "Change File"',
  ': isVietnamese ? "Đổi tệp khác" : isSpanish ? "Cambiar archivo" : isMalay ? "Tukar Fail" : "Change File"'
);

// 8. OCR Processing / button
content = content.replace(
  '                    : isThai\n                    ? "กำลังดำเนินการรู้จำอักขระ OCR..."',
  '                    : isVietnamese\n                    ? "Đang thực hiện nhận dạng OCR..."\n                    : isThai\n                    ? "กำลังดำเนินการรู้จำอักขระ OCR..."'
);

content = content.replace(
  '                  : isThai\n                  ? "รู้จำและแยกข้อความ"',
  '                  : isVietnamese\n                  ? "Nhận dạng & Trích xuất văn bản"\n                  : isThai\n                  ? "รู้จำและแยกข้อความ"'
);

// 9. OCR completed text
content = content.replace(
  '                      : isThai\n                      ? `OCR สำเร็จแล้ว (${result.totalPages} หน้า ในเวลา ${result.durationMs}ms)`',
  '                      : isVietnamese\n                      ? `Hoàn tất OCR (${result.totalPages} trang trong ${result.durationMs}ms)`\n                      : isThai\n                      ? `OCR สำเร็จแล้ว (${result.totalPages} หน้า ในเวลา ${result.durationMs}ms)`'
);

// 10. Copied text & Copy button
content = content.replace(
  '                        : isThai\n                        ? "✓ คัดลอกแล้ว!"',
  '                        : isVietnamese\n                        ? "✓ Đã sao chép!"\n                        : isThai\n                        ? "✓ คัดลอกแล้ว!"'
);

content = content.replace(
  '                      : isThai\n                      ? "คัดลอกข้อความ"',
  '                      : isVietnamese\n                      ? "Sao chép văn bản"\n                      : isThai\n                      ? "คัดลอกข้อความ"'
);

// 11. Download buttons
content = content.replace(
  'isThai ? "ดาวน์โหลด .TXT"',
  'isVietnamese ? "Tải xuống .TXT" : isThai ? "ดาวน์โหลด .TXT"'
);

content = content.replace(
  '                        : isThai\n                        ? "ดาวน์โหลด PDF ที่ค้นหาข้อความได้"',
  '                        : isVietnamese\n                        ? "Tải xuống PDF có thể tìm kiếm"\n                        : isThai\n                        ? "ดาวน์โหลด PDF ที่ค้นหาข้อความได้"'
);

content = content.replace(
  'isThai ? "ข้อความที่แยกได้"',
  'isVietnamese ? "Văn bản đã trích xuất" : isThai ? "ข้อความที่แยกได้"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched OcrPdfWorkspace.tsx with Vietnamese support');
