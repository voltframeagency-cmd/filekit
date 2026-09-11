const fs = require('fs');
let code = fs.readFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', 'utf8');

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

// 0. Language flag
code = replaceExact(
  code,
  `  const isThai = language === "th";
  const isMalay = language === "ms";
  const isVietnamese = language === "vi";`,
  `  const isThai = language === "th";
  const isMalay = language === "ms";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";`
);

// 1. Line 78: Connecting to isolated microVM...
code = replaceExact(
  code,
  `    setProgressStage(
      isVietnamese
        ? "Đang kết nối với microVM riêng biệt..."`,
  `    setProgressStage(
      isFilipino
        ? "Kumokonekta sa hiwalay na microVM..."
        : isVietnamese
        ? "Đang kết nối với microVM riêng biệt..."`
);

// 2. Line 112: Rendering Office document pages...
code = replaceExact(
  code,
  `      setProgressStage(
        isVietnamese
          ? "Đang kết xuất các trang tài liệu..."`,
  `      setProgressStage(
        isFilipino
          ? "Nagre-render ng mga pahina ng dokumento..."
          : isVietnamese
          ? "Đang kết xuất các trang tài liệu..."`
);

// 3. Line 150: Server conversion failed
code = replaceExact(
  code,
  `        throw new Error(
          errJson.error ||
            (isVietnamese
              ? \`Chuyển đổi máy chủ thất bại (\${response.status})\``,
  `        throw new Error(
          errJson.error ||
            (isFilipino
              ? \`Nabigo ang conversion sa server (\${response.status})\`
              : isVietnamese
              ? \`Chuyển đổi máy chủ thất bại (\${response.status})\``
);

// 4. Line 208: Failed to convert document.
code = replaceExact(
  code,
  `        throw new Error(
          data.error ||
            (isVietnamese
              ? "Không thể chuyển đổi tài liệu."`,
  `        throw new Error(
          data.error ||
            (isFilipino
              ? "Nabigong i-convert ang dokumento."
              : isVietnamese
              ? "Không thể chuyển đổi tài liệu."`
);

// 5. Line 247: An unexpected error occurred during conversion.
code = replaceExact(
  code,
  `      setErrorMessage(
        err?.message ||
          (isVietnamese
            ? "Đã xảy ra lỗi không mong muốn trong khi chuyển đổi."`,
  `      setErrorMessage(
        err?.message ||
          (isFilipino
            ? "May hindi inaasahang error na naganap habang nagko-convert."
            : isVietnamese
            ? "Đã xảy ra lỗi không mong muốn trong khi chuyển đổi."`
);

// 6. Line 301: Select document to convert
code = replaceExact(
  code,
  `            <h2 className="text-lg font-bold text-white">
              {isVietnamese
                ? "Chọn tài liệu để chuyển đổi"`,
  `            <h2 className="text-lg font-bold text-white">
              {isFilipino
                ? "Pumili ng dokumento na iko-convert"
                : isVietnamese
                ? "Chọn tài liệu để chuyển đổi"`
);

// 7. Line 330: High-fidelity LibreOffice microVM conversion with 0% data retention.
code = replaceExact(
  code,
  `            <p className="text-sm text-slate-400">
              {isVietnamese
                ? "Chuyển đổi microVM LibreOffice độ chính xác cao với 0% lưu giữ dữ liệu."`,
  `            <p className="text-sm text-slate-400">
              {isFilipino
                ? "Mataas na katumpakan na LibreOffice microVM conversion na may 0% pagpapanatili ng data."
                : isVietnamese
                ? "Chuyển đổi microVM LibreOffice độ chính xác cao với 0% lưu giữ dữ liệu."`
);

// 8. Line 360: Choose File button
code = replaceExact(
  code,
  `{isVietnamese ? "Chọn tệp" : isThai ? "เลือกไฟล์"`,
  `{isFilipino ? "Pumili ng File" : isVietnamese ? "Chọn tệp" : isThai ? "เลือกไฟล์"`
);

// 9. Line 389: Change File
code = replaceExact(
  code,
  `{isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์"`,
  `{isFilipino ? "Palitan ang File" : isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์"`
);

// 10. Line 399: Ephemeral MicroVM Sandbox
code = replaceExact(
  code,
  `              <span className="font-bold text-white">
                {isVietnamese
                  ? "Hộp cát MicroVM tạm thời"`,
  `              <span className="font-bold text-white">
                {isFilipino
                  ? "Pansamantalang MicroVM Sandbox"
                  : isVietnamese
                  ? "Hộp cát MicroVM tạm thời"`
);

// 11. Line 428: Document rendering runs in an isolated container microVM...
code = replaceExact(
  code,
  `              <span>
                {isVietnamese
                  ? "Xử lý tài liệu chạy trong vùng chứa microVM riêng biệt. Các tệp được mã hóa khi truyền và tự động xóa khỏi bộ nhớ đám mây ngay sau khi chuyển đổi."`,
  `              <span>
                {isFilipino
                  ? "Tumatakbo ang pagproseso ng dokumento sa isang hiwalay na microVM container. Naka-encrypt ang mga file habang ipinapadala at awtomatikong binubura mula sa cloud memory pagkatapos ng conversion."
                  : isVietnamese
                  ? "Xử lý tài liệu chạy trong vùng chứa microVM riêng biệt. Các tệp được mã hóa khi truyền và tự động xóa khỏi bộ nhớ đám mây ngay sau khi chuyển đổi."`
);

// 12. Line 478: Convert to PDF
code = replaceExact(
  code,
  `              ) : isVietnamese ? (
                "Chuyển đổi sang PDF"`,
  `              ) : isFilipino ? (
                "I-convert sa PDF"
              ) : isVietnamese ? (
                "Chuyển đổi sang PDF"`
);

// 13. Line 519: Converted to PDF Successfully!
code = replaceExact(
  code,
  `                  <h4 className="font-bold text-white text-sm">
                    {isVietnamese
                      ? "Đã chuyển đổi sang PDF thành công!"`,
  `                  <h4 className="font-bold text-white text-sm">
                    {isFilipino
                      ? "Matagumpay na Na-convert sa PDF!"
                      : isVietnamese
                      ? "Đã chuyển đổi sang PDF thành công!"`
);

// 14. Line 548: Rendered in Xms...
code = replaceExact(
  code,
  `                  <p className="text-xs text-slate-400">
                    {isSwedish`,
  `                  <p className="text-xs text-slate-400">
                    {isFilipino
                      ? \`Naproseso sa loob ng \${result.durationMs}ms • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • Nabura ang pansamantalang container\`
                      : isSwedish`
);

// 15. Line 577: Download PDF
code = replaceExact(
  code,
  `{isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF"`,
  `{isFilipino ? "I-download ang PDF" : isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF"`
);

// 16. Line 591: Secure Server Conversion Notice
code = replaceExact(
  code,
  `              <h3 className="font-bold text-white text-lg">
                {isVietnamese
                  ? "Thông báo chuyển đổi máy chủ an toàn"`,
  `              <h3 className="font-bold text-white text-lg">
                {isFilipino
                  ? "Paunawa sa Ligtas na Server Conversion"
                  : isVietnamese
                  ? "Thông báo chuyển đổi máy chủ an toàn"`
);

// 17. Line 621: Modal description
code = replaceExact(
  code,
  `            <p className="text-xs text-slate-300 leading-relaxed">
              {isVietnamese
                ? "Quá trình chuyển đổi tài liệu này yêu cầu microVM đám mây riêng biệt để đảm bảo độ trung thực hoàn toàn về bố cục và phông chữ. Tệp của bạn được xử lý trong bộ nhớ và xóa ngay sau đó."`,
  `            <p className="text-xs text-slate-300 leading-relaxed">
              {isFilipino
                ? "Nangangailangan ang conversion ng dokumentong ito ng nakahiwalay na cloud microVM upang matiyak ang buong katumpakan ng typography at layout. Ang iyong file ay ipoproseso sa memorya at buburahin kaagad pagkatapos."
                : isVietnamese
                ? "Quá trình chuyển đổi tài liệu này yêu cầu microVM đám mây riêng biệt để đảm bảo độ trung thực hoàn toàn về bố cục và phông chữ. Tệp của bạn được xử lý trong bộ nhớ và xóa ngay sau đó."`
);

// 18. Line 655: Cancel
code = replaceExact(
  code,
  `{isVietnamese ? "Hủy" : isThai ? "ยกเลิก"`,
  `{isFilipino ? "Kanselahin" : isVietnamese ? "Hủy" : isThai ? "ยกเลิก"`
);

// 19. Line 665: Authorize & Convert
code = replaceExact(
  code,
  `{isVietnamese ? "Cấp quyền & Chuyển đổi" : isThai ? "อนุญาตและแปลงไฟล์"`,
  `{isFilipino ? "Pahintulutan at I-convert" : isVietnamese ? "Cấp quyền & Chuyển đổi" : isThai ? "อนุญาตและแปลงไฟล์"`
);

fs.writeFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', code, 'utf8');
console.log('OfficeConverterWorkspace updated successfully!');
