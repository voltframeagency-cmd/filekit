const fs = require('fs');
let code = fs.readFileSync('src/components/pdf-editor/PdfSelectionToolbar.tsx', 'utf8');

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

// 1. active pages
code = replaceExact(
  code,
  `: isMalay ? "halaman aktif" : isVietnamese ? "trang đang hoạt động" : isThai ? "หน้าที่ใช้งานอยู่" : "active pages"`,
  `: isMalay ? "halaman aktif" : isVietnamese ? "trang đang hoạt động" : isThai ? "หน้าที่ใช้งานอยู่" : isFilipino ? "aktibong mga pahina" : "active pages"`
);

// 2. Total
code = replaceExact(
  code,
  `: isMalay ? "Jumlah" : isVietnamese ? "Tổng số" : isThai ? "ทั้งหมด" : "Total"`,
  `: isMalay ? "Jumlah" : isVietnamese ? "Tổng số" : isThai ? "ทั้งหมด" : isFilipino ? "Kabuuan" : "Total"`
);

// 3. selected
code = replaceExact(
  code,
  `: isMalay ? "dipilih" : isVietnamese ? "đã chọn" : isThai ? "เลือกแล้ว" : "selected"`,
  `: isMalay ? "dipilih" : isVietnamese ? "đã chọn" : isThai ? "เลือกแล้ว" : isFilipino ? "napili" : "selected"`
);

// 4. deleted
code = replaceExact(
  code,
  `: isMalay ? "dipadam" : isVietnamese ? "đã xóa" : isThai ? "ลบแล้ว" : "deleted"`,
  `: isMalay ? "dipadam" : isVietnamese ? "đã xóa" : isThai ? "ลบแล้ว" : isFilipino ? "tinanggal" : "deleted"`
);

// 5. Add More PDFs
code = replaceExact(
  code,
  `: isMalay ? "Tambah Fail PDF" : isVietnamese ? "Thêm tệp PDF" : isThai ? "เพิ่มไฟล์ PDF" : "Add More PDFs"`,
  `: isMalay ? "Tambah Fail PDF" : isVietnamese ? "Thêm tệp PDF" : isThai ? "เพิ่มไฟล์ PDF" : isFilipino ? "Magdagdag ng Higit Pang PDF" : "Add More PDFs"`
);

// 6. Sort by Filename
code = replaceExact(
  code,
  `: isMalay ? "Susun mengikut nama fail" : isVietnamese ? "Sắp xếp theo tên tệp" : isThai ? "เรียงตามชื่อไฟล์" : "Sort by Filename"`,
  `: isMalay ? "Susun mengikut nama fail" : isVietnamese ? "Sắp xếp theo tên tệp" : isThai ? "เรียงตามชื่อไฟล์" : isFilipino ? "Ayusin ayon sa Pangalan ng File" : "Sort by Filename"`
);

// 7. Select All
code = replaceExact(
  code,
  `: isMalay ? "Pilih Semua" : isVietnamese ? "Chọn tất cả" : isThai ? "เลือกทั้งหมด" : "Select All"`,
  `: isMalay ? "Pilih Semua" : isVietnamese ? "Chọn tất cả" : isThai ? "เลือกทั้งหมด" : isFilipino ? "Piliin Lahat" : "Select All"`
);

// 8. Deselect All
code = replaceExact(
  code,
  `: isMalay ? "Nyahpilih Semua" : isVietnamese ? "Bỏ chọn tất cả" : isThai ? "ยกเลิกการเลือก" : "Deselect All"`,
  `: isMalay ? "Nyahpilih Semua" : isVietnamese ? "Bỏ chọn tất cả" : isThai ? "ยกเลิกการเลือก" : isFilipino ? "Huwag Piliin Lahat" : "Deselect All"`
);

// 9. Invert
code = replaceExact(
  code,
  `: isMalay ? "Songsangkan Pilihan" : isVietnamese ? "Đảo vùng chọn" : isThai ? "สลับการเลือก" : "Invert"`,
  `: isMalay ? "Songsangkan Pilihan" : isVietnamese ? "Đảo vùng chọn" : isThai ? "สลับการเลือก" : isFilipino ? "Baligtarin ang Pili" : "Invert"`
);

// 10. Rotate 90 deg
code = replaceExact(
  code,
  `: isMalay ? "Putar 90°" : isVietnamese ? "Xoay 90°" : isThai ? "หมุน 90°" : "Rotate 90°"`,
  `: isMalay ? "Putar 90°" : isVietnamese ? "Xoay 90°" : isThai ? "หมุน 90°" : isFilipino ? "Paikutin nang 90°" : "Rotate 90°"`
);

// 11. Rotate Odd Pages
code = replaceExact(
  code,
  `: isMalay ? "Putar Halaman Ganjil" : isVietnamese ? "Xoay trang lẻ" : isThai ? "หมุนหน้าคี่" : "Rotate Odd Pages"`,
  `: isMalay ? "Putar Halaman Ganjil" : isVietnamese ? "Xoay trang lẻ" : isThai ? "หมุนหน้าคี่" : isFilipino ? "Paikutin ang mga Kakaibang Pahina" : "Rotate Odd Pages"`
);

// 12. Rotate Even Pages
code = replaceExact(
  code,
  `: isMalay ? "Putar Halaman Genap" : isVietnamese ? "Xoay trang chẵn" : isThai ? "หมุนหน้าคู่" : "Rotate Even Pages"`,
  `: isMalay ? "Putar Halaman Genap" : isVietnamese ? "Xoay trang chẵn" : isThai ? "หมุนหน้าคู่" : isFilipino ? "Paikutin ang mga Tukol na Pahina" : "Rotate Even Pages"`
);

// 13. Delete
code = replaceExact(
  code,
  `: isMalay ? "Padam" : isVietnamese ? "Xóa" : isThai ? "ลบ" : "Delete"`,
  `: isMalay ? "Padam" : isVietnamese ? "Xóa" : isThai ? "ลบ" : isFilipino ? "Tanggalin" : "Delete"`
);

// 14. Restore All
code = replaceExact(
  code,
  `: isMalay ? \`Pulihkan Semua (\${deletedPages.length})\` : isVietnamese ? \`Khôi phục tất cả (\${deletedPages.length})\` : isThai ? \`กู้คืนทั้งหมด (\${deletedPages.length})\` : \`Restore All (\${deletedPages.length})\``,
  `: isMalay ? \`Pulihkan Semua (\${deletedPages.length})\` : isVietnamese ? \`Khôi phục tất cả (\${deletedPages.length})\` : isThai ? \`กู้คืนทั้งหมด (\${deletedPages.length})\` : isFilipino ? \`Ibalik Lahat (\${deletedPages.length})\` : \`Restore All (\${deletedPages.length})\``
);

// 15. Split Mode:
code = replaceExact(
  code,
  `: isMalay ? "Mod Pemisahan:" : isThai ? "โหมดการแยก:" : "Split Mode:"`,
  `: isMalay ? "Mod Pemisahan:" : isThai ? "โหมดการแยก:" : isFilipino ? "Paraan ng Paghati:" : "Split Mode:"`
);

// 16. Split Every Page
code = replaceExact(
  code,
  `: isMalay ? "Setiap Halaman" : isThai ? "แยกทุกหน้า" : "Split Every Page"`,
  `: isMalay ? "Setiap Halaman" : isThai ? "แยกทุกหน้า" : isFilipino ? "Hatiin Bawat Pahina" : "Split Every Page"`
);

// 17. Split Every N Pages
code = replaceExact(
  code,
  `: isMalay ? "Setiap N Halaman" : isThai ? "แยกทุก N หน้า" : "Split Every N Pages"`,
  `: isMalay ? "Setiap N Halaman" : isThai ? "แยกทุก N หน้า" : isFilipino ? "Hatiin Bawat N Pahina" : "Split Every N Pages"`
);

// 18. Custom Range Selection
code = replaceExact(
  code,
  `: isMalay ? "Pilihan Julat Khas" : isThai ? "เลือกช่วงหน้า" : "Custom Range Selection"`,
  `: isMalay ? "Pilihan Julat Khas" : isThai ? "เลือกช่วงหน้า" : isFilipino ? "Pasadya na Pagpili ng Saklaw" : "Custom Range Selection"`
);

// 19. Page Range:
code = replaceExact(
  code,
  `: isMalay ? "Julat Halaman:" : isThai ? "ช่วงหน้า:" : "Page Range:"`,
  `: isMalay ? "Julat Halaman:" : isThai ? "ช่วงหน้า:" : isFilipino ? "Saklaw ng Pahina:" : "Page Range:"`
);

// 20. Select Range
code = replaceExact(
  code,
  `: isMalay ? "Pilih Julat" : isThai ? "เลือกช่วง" : "Select Range"`,
  `: isMalay ? "Pilih Julat" : isThai ? "เลือกช่วง" : isFilipino ? "Piliin ang Saklaw" : "Select Range"`
);

fs.writeFileSync('src/components/pdf-editor/PdfSelectionToolbar.tsx', code, 'utf8');
console.log('PdfSelectionToolbar updated successfully!');
