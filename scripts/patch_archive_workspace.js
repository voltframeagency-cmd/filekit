const fs = require('fs');
let code = fs.readFileSync('src/utils/archive/ArchiveWorkspace.tsx', 'utf8');

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

// 0. Add isFilipino definition
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

// 1. Error: No uncompressed files found...
code = replaceExact(
  code,
  `: isSpanish
              ? "No se encontraron archivos en el archivo o está vacío."
              : "No uncompressed files found in archive or archive is empty."`,
  `: isSpanish
              ? "No se encontraron archivos en el archivo o está vacío."
              : isFilipino
              ? "Walang nakitang mga file sa archive o walang laman ang archive."
              : "No uncompressed files found in archive or archive is empty."`
);

// 2. Error: Failed to read archive file
code = replaceExact(
  code,
  `: isSpanish
            ? "Error al leer el archivo."
            : "Failed to read archive file."`,
  `: isSpanish
            ? "Error al leer el archivo."
            : isFilipino
            ? "Nabigong basahin ang archive file."
            : "Failed to read archive file."`
);

// 3. Error: Failed to convert archive to ZIP
code = replaceExact(
  code,
  `: isSpanish
            ? "Error al convertir a ZIP."
            : "Failed to convert archive to ZIP."`,
  `: isSpanish
            ? "Error al convertir a ZIP."
            : isFilipino
            ? "Nabigong i-convert ang archive sa ZIP."
            : "Failed to convert archive to ZIP."`
);

// 4. Error: Failed to create ZIP archive
code = replaceExact(
  code,
  `: isSpanish
          ? "Error al crear archivo ZIP."
          : "Failed to create ZIP archive."`,
  `: isSpanish
          ? "Error al crear archivo ZIP."
          : isFilipino
          ? "Nabigong gawin ang ZIP archive."
          : "Failed to create ZIP archive."`
);

// 5. Drop files to zip together
code = replaceExact(
  code,
  `: isThai
                  ? "ลากไฟล์มาวางที่นี่เพื่อรวมเป็นไฟล์ ZIP"
                  : isMalay
                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"
                  : "Drop files to zip together"`,
  `: isThai
                  ? "ลากไฟล์มาวางที่นี่เพื่อรวมเป็นไฟล์ ZIP"
                  : isMalay
                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"
                  : isFilipino
                  ? "I-drop ang mga file dito upang pagsamahin sa ZIP"
                  : "Drop files to zip together"`
);

// 6. Select archive file to extract
code = replaceExact(
  code,
  `: isThai
                  ? "เลือกไฟล์คลังข้อมูลเพื่อแตกไฟล์หรือแปลง"
                  : isMalay
                  ? "Pilih fail arkib untuk diekstrak atau ditukar"
                  : "Select archive file to extract"`,
  `: isThai
                  ? "เลือกไฟล์คลังข้อมูลเพื่อแตกไฟล์หรือแปลง"
                  : isMalay
                  ? "Pilih fail arkib untuk diekstrak atau ditukar"
                  : isFilipino
                  ? "Pumili ng archive file upang i-extract o i-convert"
                  : "Select archive file to extract"`
);

// 7. Supports all file formats (Multi-file enabled)
code = replaceExact(
  code,
  `: isThai
                  ? "รองรับทุกรูปแบบไฟล์ (เลือกหลายไฟล์ได้)"
                  : isMalay
                  ? "Menyokong semua format fail (Pilihan berbilang fail diaktifkan)"
                  : "Supports all file formats (Multi-file enabled)"`,
  `: isThai
                  ? "รองรับทุกรูปแบบไฟล์ (เลือกหลายไฟล์ได้)"
                  : isMalay
                  ? "Menyokong semua format fail (Pilihan berbilang fail diaktifkan)"
                  : isFilipino
                  ? "Sumusuporta sa lahat ng format ng file (Piliin ang maramihang file)"
                  : "Supports all file formats (Multi-file enabled)"`
);

// 8. Processed locally inside your browser
code = replaceExact(
  code,
  `: isIndonesian
                  ? "Diproses secara lokal di browser Anda"
                  : "Processed locally inside your browser"`,
  `: isIndonesian
                  ? "Diproses secara lokal di browser Anda"
                  : isFilipino
                  ? "Lokal na pinoproseso sa loob ng iyong browser"
                  : "Processed locally inside your browser"`
);

// 9. files selected
code = replaceExact(
  code,
  `: isThai
                  ? \`เลือกไฟล์แล้ว \${files.length} ไฟล์\`
                  : \`\${files.length} file\${files.length > 1 ? "s" : ""} selected\``,
  `: isThai
                  ? \`เลือกไฟล์แล้ว \${files.length} ไฟล์\`
                  : isFilipino
                  ? \`\${files.length} (na) file ang napili\`
                  : \`\${files.length} file\${files.length > 1 ? "s" : ""} selected\``
);

// 10. Reset
code = replaceExact(
  code,
  `: isThai ? "รีเซ็ต" : "Reset"`,
  `: isThai ? "รีเซ็ต" : isFilipino ? "I-reset" : "Reset"`
);

// 11. Archive Name:
code = replaceExact(
  code,
  `: isThai ? "ชื่อไฟล์คลังข้อมูล:" : "Archive Name:"`,
  `: isThai ? "ชื่อไฟล์คลังข้อมูล:" : isFilipino ? "Pangalan ng Archive:" : "Archive Name:"`
);

// 12. Compressing files into ZIP...
code = replaceExact(
  code,
  `: isThai
                      ? "กำลังบีบอัดไฟล์เป็น ZIP..."
                      : "Compressing files into ZIP..."`,
  `: isThai
                      ? "กำลังบีบอัดไฟล์เป็น ZIP..."
                      : isFilipino
                      ? "Pina-pack ang mga file sa ZIP..."
                      : "Compressing files into ZIP..."`
);

// 13. Create ZIP Archive
code = replaceExact(
  code,
  `: isThai
                      ? "สร้างไฟล์ ZIP"
                      : "Create ZIP Archive"`,
  `: isThai
                      ? "สร้างไฟล์ ZIP"
                      : isFilipino
                      ? "Gumawa ng ZIP Archive"
                      : "Create ZIP Archive"`
);

// 14. Extracted Files (count):
code = replaceExact(
  code,
  `: isThai
                  ? \`ไฟล์ที่แตกออกมา (\${extractedEntries.length}):\`
                  : \`Extracted Files (\${extractedEntries.length}):\``,
  `: isThai
                  ? \`ไฟล์ที่แตกออกมา (\${extractedEntries.length}):\`
                  : isFilipino
                  ? \`Mga Na-extract na File (\${extractedEntries.length}):\`
                  : \`Extracted Files (\${extractedEntries.length}):\``
);

// 15. Download (entry)
code = replaceExact(
  code,
  `: isThai ? "ดาวน์โหลด" : "Download"`,
  `: isThai ? "ดาวน์โหลด" : isFilipino ? "I-download" : "Download"`
);

// 16. Ready ZIP
code = replaceExact(
  code,
  `: isThai
                    ? \`✓ สร้าง ZIP สำเร็จ: \${outputFileName}\`
                    : isIndonesian
                    ? \`✓ ZIP siap: \${outputFileName}\`
                    : \`✓ Ready ZIP: \${outputFileName}\``,
  `: isThai
                    ? \`✓ สร้าง ZIP สำเร็จ: \${outputFileName}\`
                    : isIndonesian
                    ? \`✓ ZIP siap: \${outputFileName}\`
                    : isFilipino
                    ? \`✓ Handa na ang ZIP: \${outputFileName}\`
                    : \`✓ Ready ZIP: \${outputFileName}\``
);

// 17. Size: ... In-Browser
code = replaceExact(
  code,
  `: isThai
                    ? \`ขนาด: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% ในเบราว์เซอร์\`
                    : isIndonesian
                    ? \`Ukuran: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser\`
                    : \`Size: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser\``,
  `: isThai
                    ? \`ขนาด: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% ในเบราว์เซอร์\`
                    : isIndonesian
                    ? \`Ukuran: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser\`
                    : isFilipino
                    ? \`Laki: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Sa Loob ng Browser\`
                    : \`Size: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser\``
);

// 18. Download ZIP
code = replaceExact(
  code,
  `: isVietnamese ? "Tải xuống ZIP" : isThai ? "ดาวน์โหลด ZIP" : isSpanish ? "Descargar ZIP" : "Download ZIP"`,
  `: isVietnamese ? "Tải xuống ZIP" : isThai ? "ดาวน์โหลด ZIP" : isSpanish ? "Descargar ZIP" : isFilipino ? "I-download ang ZIP" : "Download ZIP"`
);

fs.writeFileSync('src/utils/archive/ArchiveWorkspace.tsx', code, 'utf8');
console.log('ArchiveWorkspace updated successfully!');
