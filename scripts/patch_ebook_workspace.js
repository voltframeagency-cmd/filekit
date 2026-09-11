const fs = require('fs');
let code = fs.readFileSync('src/utils/ebook/EbookWorkspace.tsx', 'utf8');

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

// 1. Error DRM
code = replaceExact(
  code,
  `: isIndonesian
          ? "Gagal mengonversi eBook ke PDF. Harap pastikan file bebas DRM."
          : "Failed to convert eBook to PDF. Please ensure the file is DRM-free."`,
  `: isIndonesian
          ? "Gagal mengonversi eBook ke PDF. Harap pastikan file bebas DRM."
          : isFilipino
          ? "Nabigong i-convert ang eBook sa PDF. Pakitiyak na walang DRM ang file."
          : "Failed to convert eBook to PDF. Please ensure the file is DRM-free."`
);

// 2. Select eBook File
code = replaceExact(
  code,
  `: isVietnamese
              ? \`Chọn tệp eBook (\${getAcceptExtensions().toUpperCase()})\`
              : isThai
              ? \`เลือกไฟล์ eBook (\${getAcceptExtensions().toUpperCase()})\`
              : isIndonesian
              ? \`Pilih File eBook (\${getAcceptExtensions().toUpperCase()})\`
              : \`Select eBook File (\${getAcceptExtensions().toUpperCase()})\``,
  `: isVietnamese
              ? \`Chọn tệp eBook (\${getAcceptExtensions().toUpperCase()})\`
              : isThai
              ? \`เลือกไฟล์ eBook (\${getAcceptExtensions().toUpperCase()})\`
              : isIndonesian
              ? \`Pilih File eBook (\${getAcceptExtensions().toUpperCase()})\`
              : isFilipino
              ? \`Pumili ng eBook File (\${getAcceptExtensions().toUpperCase()})\`
              : \`Select eBook File (\${getAcceptExtensions().toUpperCase()})\``
);

// 3. Zero Server Uploads
code = replaceExact(
  code,
  `: isIndonesian
              ? "Nol Unggahan Server · 100% Konversi Privat di Browser"
              : "Zero Server Uploads · 100% In-Browser Private Conversion"`,
  `: isIndonesian
              ? "Nol Unggahan Server · 100% Konversi Privat di Browser"
              : isFilipino
              ? "Walang Pag-upload sa Server · 100% Pribadong Pag-convert sa Browser"
              : "Zero Server Uploads · 100% In-Browser Private Conversion"`
);

// 4. Change File
code = replaceExact(
  code,
  `: isMalay ? "Tukar Fail" : isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์" : "Change File"`,
  `: isMalay ? "Tukar Fail" : isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์" : isFilipino ? "Palitan ang File" : "Change File"`
);

// 5. Rendering eBook pages to PDF...
code = replaceExact(
  code,
  `: isIndonesian
                  ? "Merender halaman eBook ke PDF..."
                  : isMalay
                  ? "Merender halaman eBook ke PDF..."
                  : isThai
                  ? "กำลังเรนเดอร์หน้า eBook เป็น PDF..."
                  : "Rendering eBook pages to PDF..."`,
  `: isIndonesian
                  ? "Merender halaman eBook ke PDF..."
                  : isMalay
                  ? "Merender halaman eBook ke PDF..."
                  : isThai
                  ? "กำลังเรนเดอร์หน้า eBook เป็น PDF..."
                  : isFilipino
                  ? "Nire-render ang mga pahina ng eBook sa PDF..."
                  : "Rendering eBook pages to PDF..."`
);

// 6. Converted:
code = replaceExact(
  code,
  `: isMalay
                    ? \`✓ Ditukar: \${outputFileName}\`
                    : isThai
                    ? \`✓ แปลงสำเร็จ: \${outputFileName}\`
                    : \`✓ Converted: \${outputFileName}\``,
  `: isMalay
                    ? \`✓ Ditukar: \${outputFileName}\`
                    : isThai
                    ? \`✓ แปลงสำเร็จ: \${outputFileName}\`
                    : isFilipino
                    ? \`✓ Na-convert: \${outputFileName}\`
                    : \`✓ Converted: \${outputFileName}\``
);

// 7. Size: ... PDF Document
code = replaceExact(
  code,
  `: isMalay
                    ? \`Saiz: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF\`
                    : isThai
                    ? \`ขนาด: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · เอกสาร PDF\`
                    : \`Size: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF Document\``,
  `: isMalay
                    ? \`Saiz: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF\`
                    : isThai
                    ? \`ขนาด: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · เอกสาร PDF\`
                    : isFilipino
                    ? \`Laki: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumentong PDF\`
                    : \`Size: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF Document\``
);

// 8. Download PDF
code = replaceExact(
  code,
  `: isMalay ? "Muat Turun PDF" : isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF" : "Download PDF"`,
  `: isMalay ? "Muat Turun PDF" : isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF" : isFilipino ? "I-download ang PDF" : "Download PDF"`
);

fs.writeFileSync('src/utils/ebook/EbookWorkspace.tsx', code, 'utf8');
console.log('EbookWorkspace updated successfully!');
