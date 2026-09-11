const fs = require('fs');

const file = 'src/components/pdf-editor/PdfSelectionToolbar.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// Add isThai
content = content.replace(
  '  const isMalay = language === "ms";',
  '  const isMalay = language === "ms";\n  const isThai = language === "th";'
);

// active pages text
content = content.replace(
  ': isMalay ? "halaman aktif" : "active pages"',
  ': isMalay ? "halaman aktif" : isThai ? "หน้าที่ใช้งานอยู่" : "active pages"'
);

// Total
content = content.replace(
  ': isMalay ? "Jumlah" : "Total"',
  ': isMalay ? "Jumlah" : isThai ? "ทั้งหมด" : "Total"'
);

// selected
content = content.replace(
  ': isMalay ? "dipilih" : "selected"',
  ': isMalay ? "dipilih" : isThai ? "เลือกแล้ว" : "selected"'
);

// deleted
content = content.replace(
  ': isMalay ? "dipadam" : "deleted"',
  ': isMalay ? "dipadam" : isThai ? "ลบแล้ว" : "deleted"'
);

// Add more PDFs
content = content.replace(
  ': isMalay ? "Tambah Fail PDF" : "Add More PDFs"',
  ': isMalay ? "Tambah Fail PDF" : isThai ? "เพิ่มไฟล์ PDF" : "Add More PDFs"'
);

// Sort by filename
content = content.replace(
  ': isMalay ? "Susun mengikut nama fail" : "Sort by Filename"',
  ': isMalay ? "Susun mengikut nama fail" : isThai ? "เรียงตามชื่อไฟล์" : "Sort by Filename"'
);

// Select All
content = content.replace(
  ': isMalay ? "Pilih Semua" : "Select All"',
  ': isMalay ? "Pilih Semua" : isThai ? "เลือกทั้งหมด" : "Select All"'
);

// Deselect All
content = content.replace(
  ': isMalay ? "Nyahpilih Semua" : "Deselect All"',
  ': isMalay ? "Nyahpilih Semua" : isThai ? "ยกเลิกการเลือก" : "Deselect All"'
);

// Invert
content = content.replace(
  ': isMalay ? "Songsangkan Pilihan" : "Invert"',
  ': isMalay ? "Songsangkan Pilihan" : isThai ? "สลับการเลือก" : "Invert"'
);

// Rotate 90
content = content.replace(
  ': isMalay ? "Putar 90°" : "Rotate 90°"',
  ': isMalay ? "Putar 90°" : isThai ? "หมุน 90°" : "Rotate 90°"'
);

// Rotate Odd
content = content.replace(
  ': isMalay ? "Putar Halaman Ganjil" : "Rotate Odd Pages"',
  ': isMalay ? "Putar Halaman Ganjil" : isThai ? "หมุนหน้าคี่" : "Rotate Odd Pages"'
);

// Rotate Even
content = content.replace(
  ': isMalay ? "Putar Halaman Genap" : "Rotate Even Pages"',
  ': isMalay ? "Putar Halaman Genap" : isThai ? "หมุนหน้าคู่" : "Rotate Even Pages"'
);

// Delete
content = content.replace(
  ': isMalay ? "Padam" : "Delete"',
  ': isMalay ? "Padam" : isThai ? "ลบ" : "Delete"'
);

// Restore All
content = content.replace(
  ': isMalay ? `Pulihkan Semua (${deletedPages.length})` : `Restore All (${deletedPages.length})`',
  ': isMalay ? `Pulihkan Semua (${deletedPages.length})` : isThai ? `กู้คืนทั้งหมด (${deletedPages.length})` : `Restore All (${deletedPages.length})`'
);

// Split mode label
content = content.replace(
  ': isMalay ? "Mod Pemisahan:" : "Split Mode:"',
  ': isMalay ? "Mod Pemisahan:" : isThai ? "โหมดการแยก:" : "Split Mode:"'
);

// Split Every Page
content = content.replace(
  ': isMalay ? "Setiap Halaman" : "Split Every Page"',
  ': isMalay ? "Setiap Halaman" : isThai ? "แยกทุกหน้า" : "Split Every Page"'
);

// Split Every N Pages
content = content.replace(
  ': isMalay ? "Setiap N Halaman" : "Split Every N Pages"',
  ': isMalay ? "Setiap N Halaman" : isThai ? "แยกทุก N หน้า" : "Split Every N Pages"'
);

// Custom Range Selection
content = content.replace(
  ': isMalay ? "Pilihan Julat Khas" : "Custom Range Selection"',
  ': isMalay ? "Pilihan Julat Khas" : isThai ? "เลือกช่วงหน้า" : "Custom Range Selection"'
);

// Page Range label
content = content.replace(
  ': isMalay ? "Julat Halaman:" : "Page Range:"',
  ': isMalay ? "Julat Halaman:" : isThai ? "ช่วงหน้า:" : "Page Range:"'
);

// Select Range button
content = content.replace(
  ': isMalay ? "Pilih Julat" : "Select Range"',
  ': isMalay ? "Pilih Julat" : isThai ? "เลือกช่วง" : "Select Range"'
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched PdfSelectionToolbar.tsx');
