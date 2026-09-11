const fs = require('fs');
let code = fs.readFileSync('src/components/image-tools/ImageConverterWorkspace.tsx', 'utf8');

// Replace using regex or normalized strings
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

// 1. Choose Another
code = replaceExact(
  code,
  `                  {isVietnamese
                    ? "Chọn tệp khác"`,
  `                  {isFilipino
                    ? "Pumili ng Iba"
                    : isVietnamese
                    ? "Chọn tệp khác"`
);

// 2. Converting Image...
code = replaceExact(
  code,
  `                      {isThai
                        ? "กำลังแปลงรูปภาพ..."`,
  `                      {isFilipino
                        ? "Kinukumberte ang Larawan..."
                        : isThai
                        ? "กำลังแปลงรูปภาพ..."`
);

// 3. Image converted successfully
code = replaceExact(
  code,
  `                      {isThai
                        ? "แปลงรูปภาพสำเร็จแล้ว"`,
  `                      {isFilipino
                        ? "Matagumpay na nakumberte ang larawan"
                        : isThai
                        ? "แปลงรูปภาพสำเร็จแล้ว"`
);

// 4. JPEG does not support transparency
code = replaceExact(
  code,
  `                    {isThai
                      ? "⚠️ รูปแบบ JPEG ไม่รองรับความโปร่งใส พื้นที่โปร่งใสจะถูกแทนที่ด้วยสีพื้นหลังที่เลือก"`,
  `                    {isFilipino
                      ? "⚠️ Hindi sinusuportahan ng JPEG ang transparency. Gagamitin ng mga transparent na bahagi ang napiling kulay ng background."
                      : isThai
                      ? "⚠️ รูปแบบ JPEG ไม่รองรับความโปร่งใส พื้นที่โปร่งใสจะถูกแทนที่ด้วยสีพื้นหลังที่เลือก"`
);

// 5. Output is X% larger / smaller
code = replaceExact(
  code,
  `                        ? isThai
                          ? \`📈 ไฟล์มีขนาดใหญ่ขึ้น \${result.sizeChangePercentage}%\``,
  `                        ? isFilipino
                          ? \`📈 Ang output ay \${result.sizeChangePercentage}% na mas malaki\`
                          : isThai
                          ? \`📈 ไฟล์มีขนาดใหญ่ขึ้น \${result.sizeChangePercentage}%\``
);

code = replaceExact(
  code,
  `                        : isThai
                        ? \`📉 ไฟล์มีขนาดเล็กลง \${result.sizeChangePercentage}%\``,
  `                        : isFilipino
                        ? \`📉 Ang output ay \${result.sizeChangePercentage}% na mas maliit\`
                        : isThai
                        ? \`📉 ไฟล์มีขนาดเล็กลง \${result.sizeChangePercentage}%\``
);

// 6. Download Converted Image
code = replaceExact(
  code,
  `                      {isVietnamese
                        ? "Tải xuống hình ảnh đã chuyển đổi"`,
  `                      {isFilipino
                        ? "I-download ang Nakumberteng Larawan"
                        : isVietnamese
                        ? "Tải xuống hình ảnh đã chuyển đổi"`
);

// 7. Adjust Settings
code = replaceExact(
  code,
  `                      {isVietnamese
                        ? "Điều chỉnh cài đặt"`,
  `                      {isFilipino
                        ? "Isaayos ang mga Setting"
                        : isVietnamese
                        ? "Điều chỉnh cài đặt"`
);

// 8. Conversion Options
code = replaceExact(
  code,
  `                  {isVietnamese
                    ? "Tùy chọn chuyển đổi"`,
  `                  {isFilipino
                    ? "Mga Opsyon sa Pagkumberte"
                    : isVietnamese
                    ? "Tùy chọn chuyển đổi"`
);

// 9. Target Format
code = replaceExact(
  code,
  `                    {isVietnamese
                      ? "Định dạng đích"`,
  `                    {isFilipino
                      ? "Target na Format"
                      : isVietnamese
                      ? "Định dạng đích"`
);

// 10. Output Format
code = replaceExact(
  code,
  `                    {isVietnamese
                      ? "Định dạng đầu ra"`,
  `                    {isFilipino
                      ? "Format ng Output"
                      : isVietnamese
                      ? "Định dạng đầu ra"`
);

// 11. Background Color (for alpha)
code = replaceExact(
  code,
  `                    {isVietnamese
                      ? "Màu nền (cho độ trong suốt)"`,
  `                    {isFilipino
                      ? "Kulay ng Background (para sa alpha)"
                      : isVietnamese
                      ? "Màu nền (cho độ trong suốt)"`
);

// 12. Submit Button: Converting... / Reconvert Image / Convert Image
code = replaceExact(
  code,
  `                {isProcessing
                  ? isVietnamese
                    ? "Đang chuyển đổi hình ảnh..."`,
  `                {isProcessing
                  ? isFilipino
                    ? "Kinukumberte ang larawan..."
                    : isVietnamese
                    ? "Đang chuyển đổi hình ảnh..."`
);

code = replaceExact(
  code,
  `                  : result
                  ? isVietnamese
                    ? "Chuyển đổi lại hình ảnh"`,
  `                  : result
                  ? isFilipino
                    ? "Muling Kumbertihin ang Larawan"
                    : isVietnamese
                    ? "Chuyển đổi lại hình ảnh"`
);

code = replaceExact(
  code,
  `                  : isVietnamese
                  ? "Chuyển đổi hình ảnh"`,
  `                  : isFilipino
                  ? "Kumbertihin ang Larawan"
                  : isVietnamese
                  ? "Chuyển đổi hình ảnh"`
);

fs.writeFileSync('src/components/image-tools/ImageConverterWorkspace.tsx', code, 'utf8');
console.log('ImageConverterWorkspace successfully updated!');
