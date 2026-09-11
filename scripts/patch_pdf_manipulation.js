const fs = require('fs');
let code = fs.readFileSync('src/components/pdf-manipulation/PdfManipulationWorkspace.tsx', 'utf8');

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

// Add isFilipino declaration
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

// 1. Select a PDF to start with
code = replaceExact(
  code,
  `{isVietnamese ? \`Chọn tệp PDF để bắt đầu (\${toolTitle})\` : isThai ? \`เลือกไฟล์ PDF เพื่อเริ่มต้น (\${toolTitle})\``,
  `{isFilipino ? \`Pumili ng PDF file upang magsimula (\${toolTitle})\` : isVietnamese ? \`Chọn tệp PDF để bắt đầu (\${toolTitle})\` : isThai ? \`เลือกไฟล์ PDF เพื่อเริ่มต้น (\${toolTitle})\``
);

// 2. Processes entirely on your device inside your browser sandbox.
code = replaceExact(
  code,
  `{isVietnamese ? "Xử lý hoàn toàn trên thiết bị của bạn trong môi trường cách ly của trình duyệt. Dữ liệu của bạn không bao giờ rời khỏi máy tính."`,
  `{isFilipino ? "Ganap na pinoproseso sa iyong device sa loob ng sandbox ng browser. Hindi kailanman umaalis ang iyong data sa computer." : isVietnamese ? "Xử lý hoàn toàn trên thiết bị của bạn trong môi trường cách ly của trình duyệt. Dữ liệu của bạn không bao giờ rời khỏi máy tính."`
);

// 3. Choose PDF Document button
code = replaceExact(
  code,
  `{isVietnamese ? "Chọn tệp PDF" : isThai ? "เลือกไฟล์ PDF"`,
  `{isFilipino ? "Pumili ng PDF File" : isVietnamese ? "Chọn tệp PDF" : isThai ? "เลือกไฟล์ PDF"`
);

// 4. Local Safe
code = replaceExact(
  code,
  `• {isThai ? "ปลอดภัยในเครื่อง" : isMalay ? "Selamat Setempat" : "Local Safe"}</p>`,
  `• {isFilipino ? "Ligtas sa Lokal" : isThai ? "ปลอดภัยในเครื่อง" : isMalay ? "Selamat Setempat" : "Local Safe"}</p>`
);

// 5. Change PDF
code = replaceExact(
  code,
  `{isVietnamese ? "Đổi PDF" : isThai ? "เปลี่ยน PDF"`,
  `{isFilipino ? "Palitan ang PDF" : isVietnamese ? "Đổi PDF" : isThai ? "เปลี่ยน PDF"`
);

// 6. Blank Page Insertion Position:
code = replaceExact(
  code,
  `{isVietnamese ? "Vị trí chèn trang trống:" : isThai ? "ตำแหน่งการแทรกหน้าว่าง:"`,
  `{isFilipino ? "Posisyon ng Pagsingit ng Blangkong Pahina:" : isVietnamese ? "Vị trí chèn trang trống:" : isThai ? "ตำแหน่งการแทรกหน้าว่าง:"`
);

// 7. Insertion positions: end, start, after-each, custom
code = replaceExact(
  code,
  `{ id: "end", label: isVietnamese ? "Ở cuối" : isThai ? "ที่ส่วนท้าย" : isMalay ? "Di Akhir" : isFinnish ? "Loppuun" : isNorwegian ? "Til slutt" : isDanish ? "Til sidst" : isSwedish ? "I slutet" : "At the End" },
                  { id: "start", label: isVietnamese ? "Ở đầu" : isThai ? "ที่ส่วนหน้า" : isMalay ? "Di Awal" : isFinnish ? "Alkuun" : isNorwegian ? "I starten" : isDanish ? "I starten" : isSwedish ? "I början" : "At the Start" },
                  { id: "after-each", label: isVietnamese ? "Sau mỗi trang" : isThai ? "หลังทุกหน้า" : isMalay ? "Selepas Setiap Halaman" : isFinnish ? "Jokaisen sivun jälkeen" : isNorwegian ? "Etter hver side" : isDanish ? "Efter hver side" : isSwedish ? "Efter varje sida" : "After Every Page" },
                  { id: "custom", label: isVietnamese ? "Số trang tùy chỉnh" : isThai ? "กำหนดเลขหน้าเอง" : isMalay ? "Nombor Halaman Tersuai" : isFinnish ? "Mukautettu sivunumero" : isNorwegian ? "Egendefinert sidetall" : isDanish ? "Brugerdefineret sidetal" : isSwedish ? "Anpassat sidnummer" : "Custom Page Offset" },`,
  `{ id: "end", label: isFilipino ? "Sa Dulo" : isVietnamese ? "Ở cuối" : isThai ? "ที่ส่วนท้าย" : isMalay ? "Di Akhir" : isFinnish ? "Loppuun" : isNorwegian ? "Til slutt" : isDanish ? "Til sidst" : isSwedish ? "I slutet" : "At the End" },
                  { id: "start", label: isFilipino ? "Sa Simula" : isVietnamese ? "Ở đầu" : isThai ? "ที่ส่วนหน้า" : isMalay ? "Di Awal" : isFinnish ? "Alkuun" : isNorwegian ? "I starten" : isDanish ? "I starten" : isSwedish ? "I början" : "At the Start" },
                  { id: "after-each", label: isFilipino ? "Pagkatapos ng Bawat Pahina" : isVietnamese ? "Sau mỗi trang" : isThai ? "หลังทุกหน้า" : isMalay ? "Selepas Setiap Halaman" : isFinnish ? "Jokaisen sivun jälkeen" : isNorwegian ? "Etter hver side" : isDanish ? "Efter hver side" : isSwedish ? "Efter varje sida" : "After Every Page" },
                  { id: "custom", label: isFilipino ? "Pasadya na Pahina" : isVietnamese ? "Số trang tùy chỉnh" : isThai ? "กำหนดเลขหน้าเอง" : isMalay ? "Nombor Halaman Tersuai" : isFinnish ? "Mukautettu sivunumero" : isNorwegian ? "Egendefinert sidetall" : isDanish ? "Brugerdefineret sidetal" : isSwedish ? "Anpassat sidnummer" : "Custom Page Offset" },`
);

// 8. Insert blank page after page number:
code = replaceExact(
  code,
  `{isThai ? "แทรกหน้าว่างหลังจากหน้าที่:" : isMalay ? "Masukkan halaman kosong selepas nombor halaman:"`,
  `{isFilipino ? "Magpasok ng blangkong pahina pagkatapos ng numerong:" : isThai ? "แทรกหน้าว่างหลังจากหน้าที่:" : isMalay ? "Masukkan halaman kosong selepas nombor halaman:"`
);

// 9. Duplication mode:
code = replaceExact(
  code,
  `{isThai ? "โหมดการทำซ้ำ:" : isMalay ? "Mod Penggandaan:"`,
  `{isFilipino ? "Paraan ng Pagkopya:" : isThai ? "โหมดการทำซ้ำ:" : isMalay ? "Mod Penggandaan:"`
);

// 10. Duplicate options
code = replaceExact(
  code,
  `{ id: "all-consecutive", label: isThai ? "ทำซ้ำทุกหน้าเรียงต่อกัน (1, 1, 2, 2...)" : isMalay ? "Gandakan Setiap Halaman (1, 1, 2, 2...)" : isFinnish ? "Kahdenna jokainen sivu (1, 1, 2, 2...)" : isNorwegian ? "Dupliser hver side (1, 1, 2, 2...)" : isDanish ? "Dupliker hver side (1, 1, 2, 2...)" : isSwedish ? "Duplicera varje sida (1, 1, 2, 2...)" : "Duplicate Each Page (1, 1, 2, 2...)" },
                  { id: "all-appended", label: isThai ? "เพิ่มสำเนาทั้งหมดต่อท้าย" : isMalay ? "Tambah Salinan Penuh di Akhir" : isFinnish ? "Lisää koko kopio loppuun" : isNorwegian ? "Legg til full kopi til slutt" : isDanish ? "Tilføj fuld kopi til sidst" : isSwedish ? "Lägg till full kopia i slutet" : "Append Full Copy at End" },
                  { id: "selected", label: isThai ? "ทำซ้ำเฉพาะหน้าที่เลือก" : isMalay ? "Gandakan Halaman Terpilih Sahaja" : isFinnish ? "Kahdenna vain valitut sivut" : isNorwegian ? "Dupliser kun valgte sider" : isDanish ? "Dupliker kun valgte sider" : isSwedish ? "Duplicera endast valda sidor" : "Duplicate Selected Pages Only" },`,
  `{ id: "all-consecutive", label: isFilipino ? "Kopyahin ang Bawat Pahina nang Sunod-sunod (1, 1, 2, 2...)" : isThai ? "ทำซ้ำทุกหน้าเรียงต่อกัน (1, 1, 2, 2...)" : isMalay ? "Gandakan Setiap Halaman (1, 1, 2, 2...)" : isFinnish ? "Kahdenna jokainen sivu (1, 1, 2, 2...)" : isNorwegian ? "Dupliser hver side (1, 1, 2, 2...)" : isDanish ? "Dupliker hver side (1, 1, 2, 2...)" : isSwedish ? "Duplicera varje sida (1, 1, 2, 2...)" : "Duplicate Each Page (1, 1, 2, 2...)" },
                  { id: "all-appended", label: isFilipino ? "Idagdag ang Buong Kopya sa Dulo" : isThai ? "เพิ่มสำเนาทั้งหมดต่อท้าย" : isMalay ? "Tambah Salinan Penuh di Akhir" : isFinnish ? "Lisää koko kopio loppuun" : isNorwegian ? "Legg til full kopi til slutt" : isDanish ? "Tilføj fuld kopi til sidst" : isSwedish ? "Lägg till full kopia i slutet" : "Append Full Copy at End" },
                  { id: "selected", label: isFilipino ? "Kopyahin Lamang ang mga Napiling Pahina" : isThai ? "ทำซ้ำเฉพาะหน้าที่เลือก" : isMalay ? "Gandakan Halaman Terpilih Sahaja" : isFinnish ? "Kahdenna vain valitut sivut" : isNorwegian ? "Dupliser kun valgte sider" : isDanish ? "Dupliker kun valgte sider" : isSwedish ? "Duplicera endast valda sidor" : "Duplicate Selected Pages Only" },`
);

// 11. Page numbers to duplicate
code = replaceExact(
  code,
  `{isThai ? "หมายเลขหน้าที่ต้องการทำซ้ำ (คั่นด้วยจุลภาค เช่น 1, 3, 5):" : isMalay ? "Nombor halaman untuk digandakan (dipisahkan koma, cth. 1, 3, 5):"`,
  `{isFilipino ? "Mga numero ng pahina na kokopyahin (pinaghihiwalay ng kuwit, hal. 1, 3, 5):" : isThai ? "หมายเลขหน้าที่ต้องการทำซ้ำ (คั่นด้วยจุลภาค เช่น 1, 3, 5):" : isMalay ? "Nombor halaman untuk digandakan (dipisahkan koma, cth. 1, 3, 5):"`
);

// 12. Processing on this device...
code = replaceExact(
  code,
  `<span>{isVietnamese ? "Đang xử lý trên thiết bị này..." : isThai ? "กำลังประมวลผลบนอุปกรณ์นี้..."`,
  `<span>{isFilipino ? "Pinoproseso sa device na ito..." : isVietnamese ? "Đang xử lý trên thiết bị này..." : isThai ? "กำลังประมวลผลบนอุปกรณ์นี้..."`
);

// 13. Actions for reverse, add-blank, duplicate, pdf-to-text, extract-images, flatten
code = replaceExact(
  code,
  `              ) : mode === "reverse" ? (
                isVietnamese ? "Đảo ngược thứ tự trang PDF" : isThai ? "กลับลำดับหน้า PDF" : isMalay ? "Balikkan Susunan Halaman PDF" : isFinnish ? "Käännä PDF:n sivujärjestys" : isNorwegian ? "Omvendt PDF-siderekkefølge" : isDanish ? "Omvend PDF-siderækkefølge" : isSwedish ? "Vänd PDF-sidordning" : "Reverse PDF Pages"
              ) : mode === "add-blank" ? (
                isVietnamese ? "Chèn trang trống" : isThai ? "แทรกหน้าว่าง" : isMalay ? "Masukkan Halaman Kosong" : isFinnish ? "Lisää tyhjä sivu" : isNorwegian ? "Sett inn tom side" : isDanish ? "Indsæt tom(me) side(r)" : isSwedish ? "Infoga tom sida" : "Insert Blank Page(s)"
              ) : mode === "duplicate" ? (
                isVietnamese ? "Nhân bản trang PDF" : isThai ? "ทำซ้ำหน้า PDF" : isMalay ? "Gandakan Halaman PDF" : isFinnish ? "Kahdenna PDF-sivut" : isNorwegian ? "Dupliser PDF-sider" : isDanish ? "Dupliker PDF-sider" : isSwedish ? "Duplicera PDF-sidor" : "Duplicate PDF Pages"
              ) : mode === "pdf-to-text" ? (
                isVietnamese ? "Trích xuất văn bản" : isThai ? "แยกข้อความ" : isMalay ? "Ekstrak Teks" : isFinnish ? "Pura teksti" : isNorwegian ? "Pakk ut tekst" : isDanish ? "Udtræk tekst" : isSwedish ? "Extrahera text" : "Extract Text"
              ) : mode === "extract-images" ? (
                isVietnamese ? "Trích xuất hình ảnh" : isThai ? "แยกรูปภาพ" : isMalay ? "Ekstrak Imej" : isFinnish ? "Pura kuvat" : isNorwegian ? "Pakk ut bilder" : isDanish ? "Udtræk billeder" : isSwedish ? "Extrahera bilder" : "Extract Images"
              ) : (
                isVietnamese ? "Làm phẳng biểu mẫu PDF" : isThai ? "ผสานแบบฟอร์ม PDF" : isMalay ? "Ratakan Borang PDF" : isFinnish ? "Litistä PDF-lomake" : isNorwegian ? "Flat ut PDF-skjema" : isDanish ? "Fladgør PDF-formular" : isSwedish ? "Platta till PDF" : "Flatten PDF Form"
              )}`,
  `              ) : mode === "reverse" ? (
                isFilipino ? "Baligtarin ang Pagkakasunod-sunod ng mga Pahina" : isVietnamese ? "Đảo ngược thứ tự trang PDF" : isThai ? "กลับลำดับหน้า PDF" : isMalay ? "Balikkan Susunan Halaman PDF" : isFinnish ? "Käännä PDF:n sivujärjestys" : isNorwegian ? "Omvendt PDF-siderekkefølge" : isDanish ? "Omvend PDF-siderækkefølge" : isSwedish ? "Vänd PDF-sidordning" : "Reverse PDF Pages"
              ) : mode === "add-blank" ? (
                isFilipino ? "Magpasok ng Blangkong Pahina" : isVietnamese ? "Chèn trang trống" : isThai ? "แทรกหน้าว่าง" : isMalay ? "Masukkan Halaman Kosong" : isFinnish ? "Lisää tyhjä sivu" : isNorwegian ? "Sett inn tom side" : isDanish ? "Indsæt tom(me) side(r)" : isSwedish ? "Infoga tom sida" : "Insert Blank Page(s)"
              ) : mode === "duplicate" ? (
                isFilipino ? "Kopyahin ang mga Pahina ng PDF" : isVietnamese ? "Nhân bản trang PDF" : isThai ? "ทำซ้ำหน้า PDF" : isMalay ? "Gandakan Halaman PDF" : isFinnish ? "Kahdenna PDF-sivut" : isNorwegian ? "Dupliser PDF-sider" : isDanish ? "Dupliker PDF-sider" : isSwedish ? "Duplicera PDF-sidor" : "Duplicate PDF Pages"
              ) : mode === "pdf-to-text" ? (
                isFilipino ? "I-extract ang Teksto" : isVietnamese ? "Trích xuất văn bản" : isThai ? "แยกข้อความ" : isMalay ? "Ekstrak Teks" : isFinnish ? "Pura teksti" : isNorwegian ? "Pakk ut tekst" : isDanish ? "Udtræk tekst" : isSwedish ? "Extrahera text" : "Extract Text"
              ) : mode === "extract-images" ? (
                isFilipino ? "I-extract ang mga Larawan" : isVietnamese ? "Trích xuất hình ảnh" : isThai ? "แยกรูปภาพ" : isMalay ? "Ekstrak Imej" : isFinnish ? "Pura kuvat" : isNorwegian ? "Pakk ut bilder" : isDanish ? "Udtræk billeder" : isSwedish ? "Extrahera bilder" : "Extract Images"
              ) : (
                isFilipino ? "I-flatten ang Form ng PDF" : isVietnamese ? "Làm phẳng biểu mẫu PDF" : isThai ? "ผสานแบบฟอร์ม PDF" : isMalay ? "Ratakan Borang PDF" : isFinnish ? "Litistä PDF-lomake" : isNorwegian ? "Flat ut PDF-skjema" : isDanish ? "Fladgør PDF-formular" : isSwedish ? "Platta till PDF" : "Flatten PDF Form"
              )}`
);

// 14. Extracted Text Content:
code = replaceExact(
  code,
  `{isVietnamese ? "Nội dung văn bản đã trích xuất:" : isThai ? "เนื้อหาข้อความที่แยกได้:"`,
  `{isFilipino ? "Nilalaman ng Na-extract na Teksto:" : isVietnamese ? "Nội dung văn bản đã trích xuất:" : isThai ? "เนื้อหาข้อความที่แยกได้:"`
);

// 15. Copy All Text
code = replaceExact(
  code,
  `{isCopied ? "✓ Disalin!" : isVietnamese ? "📋 Sao chép toàn bộ văn bản" : isThai ? "📋 คัดลอกข้อความทั้งหมด"`,
  `{isCopied ? (isFilipino ? "✓ Nakopya!" : "✓ Disalin!") : isFilipino ? "📋 Kopyahin ang Lahat ng Teksto" : isVietnamese ? "📋 Sao chép toàn bộ văn bản" : isThai ? "📋 คัดลอกข้อความทั้งหมด"`
);

// 16. Extracted X images
code = replaceExact(
  code,
  `{isVietnamese ? \`Trích xuất thành công \${extractedImages.length} hình ảnh\` : isThai ? \`แยกรูปภาพสำเร็จ \${extractedImages.length} รูป\``,
  `{isFilipino ? \`Matagumpay na na-extract ang \${extractedImages.length} na larawan\` : isVietnamese ? \`Trích xuất thành công \${extractedImages.length} hình ảnh\` : isThai ? \`แยกรูปภาพสำเร็จ \${extractedImages.length} รูป\``
);

// 17. Page X in preview
code = replaceExact(
  code,
  `<span>{isVietnamese ? \`Trang \${img.pageIndex}\` : isThai ? \`หน้า \${img.pageIndex}\` : isMalay ? \`Halaman \${img.pageIndex}\``,
  `<span>{isFilipino ? \`Pahina \${img.pageIndex}\` : isVietnamese ? \`Trang \${img.pageIndex}\` : isThai ? \`หน้า \${img.pageIndex}\` : isMalay ? \`Halaman \${img.pageIndex}\``
);

// 18. Download PNG
code = replaceExact(
  code,
  `{isVietnamese ? "Tải xuống PNG" : isThai ? "ดาวน์โหลด PNG" : isMalay ? "Muat Turun PNG" : "Download PNG"}`,
  `{isFilipino ? "I-download ang PNG" : isVietnamese ? "Tải xuống PNG" : isThai ? "ดาวน์โหลด PNG" : isMalay ? "Muat Turun PNG" : "Download PNG"}`
);

// 19. Operation Complete
code = replaceExact(
  code,
  `{isVietnamese ? "Thao tác hoàn tất" : isThai ? "การดำเนินการเสร็จสมบูรณ์"`,
  `{isFilipino ? "Tapos na ang Operasyon" : isVietnamese ? "Thao tác hoàn tất" : isThai ? "การดำเนินการเสร็จสมบูรณ์"`
);

// 20. Processed 100% locally
code = replaceExact(
  code,
  `{isVietnamese ? "Được xử lý 100% cục bộ" : isThai ? "ประมวลผลในเครื่อง 100%"`,
  `{isFilipino ? "100% na naproseso nang lokal" : isVietnamese ? "Được xử lý 100% cục bộ" : isThai ? "ประมวลผลในเครื่อง 100%"`
);

// 21. Download File
code = replaceExact(
  code,
  `{isVietnamese ? "Tải xuống tệp" : isThai ? "ดาวน์โหลดไฟล์"`,
  `{isFilipino ? "I-download ang File" : isVietnamese ? "Tải xuống tệp" : isThai ? "ดาวน์โหลดไฟล์"`
);

fs.writeFileSync('src/components/pdf-manipulation/PdfManipulationWorkspace.tsx', code, 'utf8');
console.log('PdfManipulationWorkspace updated successfully!');
