const fs = require('fs');

// --- 1. ArchiveWorkspace.tsx ---
{
  const file = 'src/utils/archive/ArchiveWorkspace.tsx';
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    '  const isIndonesian = language === "id";',
    '  const isIndonesian = language === "id";\n  const isMalay = language === "ms";'
  );

  content = content.replace(
    ': isIndonesian\n                  ? "Tarik file ke sini untuk dijadikan ZIP"',
    ': isIndonesian\n                  ? "Tarik file ke sini untuk dijadikan ZIP"\n                  : isMalay\n                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? "Pilih file arsip untuk diekstrak atau dikonversi"',
    ': isIndonesian\n                  ? "Pilih file arsip untuk diekstrak atau dikonversi"\n                  : isMalay\n                  ? "Pilih fail arkib untuk diekstrak atau ditukar"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? "Mendukung semua format file (Multi-file diaktifkan)"',
    ': isIndonesian\n                  ? "Mendukung semua format file (Multi-file diaktifkan)"\n                  : isMalay\n                  ? "Menyokong semua format fail (Pilihan banyak fail didayakan)"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? "Diproses secara lokal di browser Anda"',
    ': isIndonesian\n                  ? "Diproses secara lokal di browser Anda"\n                  : isMalay\n                  ? "Diproses secara setempat dalam pelayar anda"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? `${files.length} file dipilih`',
    ': isIndonesian\n                  ? `${files.length} file dipilih`\n                  : isMalay\n                  ? `${files.length} fail dipilih`'
  );

  content = content.replace(
    ': isIndonesian ? "Atur Ulang" : "Reset"',
    ': isIndonesian ? "Atur Ulang" : isMalay ? "Tetapkan Semula" : "Reset"'
  );

  content = content.replace(
    ': isIndonesian ? "Nama Arsip:" : "Archive Name:"',
    ': isIndonesian ? "Nama Arsip:" : isMalay ? "Nama Arkib:" : "Archive Name:"'
  );

  content = content.replace(
    ': isIndonesian\n                      ? "Mengompresi file ke ZIP..."',
    ': isIndonesian\n                      ? "Mengompresi file ke ZIP..."\n                      : isMalay\n                      ? "Memampatkan fail ke ZIP..."'
  );

  content = content.replace(
    ': isIndonesian\n                      ? "Buat Arsip ZIP"',
    ': isIndonesian\n                      ? "Buat Arsip ZIP"\n                      : isMalay\n                      ? "Cipta Arkib ZIP"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? `File yang diekstrak (${extractedEntries.length}):`',
    ': isIndonesian\n                  ? `File yang diekstrak (${extractedEntries.length}):`\n                  : isMalay\n                  ? `Fail diekstrak (${extractedEntries.length}):`'
  );

  content = content.replace(
    ': isIndonesian ? "Unduh" : "Download"',
    ': isIndonesian ? "Unduh" : isMalay ? "Muat Turun" : "Download"'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `✓ ZIP siap: ${outputFileName}`',
    ': isIndonesian\n                    ? `✓ ZIP siap: ${outputFileName}`\n                  : isMalay\n                    ? `✓ ZIP sedia: ${outputFileName}`'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser`',
    ': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser`\n                    : isMalay\n                    ? `Saiz: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Dalam Pelayar`'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated ArchiveWorkspace.tsx');
}

// --- 2. EbookWorkspace.tsx ---
{
  const file = 'src/utils/ebook/EbookWorkspace.tsx';
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    '  const isIndonesian = language === "id";',
    '  const isIndonesian = language === "id";\n  const isMalay = language === "ms";'
  );

  content = content.replace(
    ': isIndonesian\n              ? `Pilih File eBook (${getAcceptExtensions().toUpperCase()})`',
    ': isIndonesian\n              ? `Pilih File eBook (${getAcceptExtensions().toUpperCase()})`\n              : isMalay\n              ? `Pilih Fail e-Buku (${getAcceptExtensions().toUpperCase()})`'
  );

  content = content.replace(
    ': isIndonesian\n              ? "Nol Unggahan Server · 100% Konversi Privat di Browser"',
    ': isIndonesian\n              ? "Nol Unggahan Server · 100% Konversi Privat di Browser"\n              : isMalay\n              ? "Sifar Muat Naik Pelayan · 100% Penukaran Peribadi dalam Pelayar"'
  );

  content = content.replace(
    ': isIndonesian ? "Ganti File" : "Change File"',
    ': isIndonesian ? "Ganti File" : isMalay ? "Tukar Fail" : "Change File"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? "Merender halaman eBook ke PDF..."',
    ': isIndonesian\n                  ? "Merender halaman eBook ke PDF..."\n                  : isMalay\n                  ? "Memaparkan halaman e-buku ke PDF..."'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `✓ Dikonversi: ${outputFileName}`',
    ': isIndonesian\n                    ? `✓ Dikonversi: ${outputFileName}`\n                    : isMalay\n                    ? `✓ Ditukar: ${outputFileName}`'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF`',
    ': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF`\n                    : isMalay\n                    ? `Saiz: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF`'
  );

  content = content.replace(
    ': isIndonesian ? "Unduh PDF" : "Download PDF"',
    ': isIndonesian ? "Unduh PDF" : isMalay ? "Muat Turun PDF" : "Download PDF"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated EbookWorkspace.tsx');
}

// --- 3. FontWorkspace.tsx ---
{
  const file = 'src/utils/font/FontWorkspace.tsx';
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    '  const isIndonesian = language === "id";',
    '  const isIndonesian = language === "id";\n  const isMalay = language === "ms";'
  );

  content = content.replace(
    ': isIndonesian\n          ? "Gagal mengonversi font. Harap pastikan ini adalah file TTF, OTF, atau WOFF yang valid."',
    ': isIndonesian\n          ? "Gagal mengonversi font. Harap pastikan ini adalah file TTF, OTF, atau WOFF yang valid."\n          : isMalay\n          ? "Gagal menukar fon. Sila pastikan ini fail TTF, OTF, atau WOFF yang sah."'
  );

  content = content.replace(
    ': isIndonesian ? "Konversi TTF ke WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF"',
    ': isIndonesian ? "Konversi TTF ke WOFF2 / WOFF" : isMalay ? "Tukar TTF ke WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF"'
  );

  content = content.replace(
    ': isIndonesian ? "Konversi WOFF2 ke TTF" : "Convert WOFF2 to TTF"',
    ': isIndonesian ? "Konversi WOFF2 ke TTF" : isMalay ? "Tukar WOFF2 ke TTF" : "Convert WOFF2 to TTF"'
  );

  content = content.replace(
    ': isIndonesian\n              ? "Pilih File Font (TTF, OTF, WOFF)"',
    ': isIndonesian\n              ? "Pilih File Font (TTF, OTF, WOFF)"\n              : isMalay\n              ? "Pilih Fail Fon (TTF, OTF, WOFF)"'
  );

  content = content.replace(
    ': isIndonesian\n              ? "Dioptimalkan untuk web (100% pemrosesan lokal di browser)"',
    ': isIndonesian\n              ? "Dioptimalkan untuk web (100% pemrosesan lokal di browser)"\n              : isMalay\n              ? "Dioptimumkan untuk web (100% pemprosesan setempat dalam pelayar)"'
  );

  content = content.replace(
    ': isIndonesian\n                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabel: ${fontMeta?.numTables} · Ukuran: ${(file.size / 1024).toFixed(1)} KB`',
    ': isIndonesian\n                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabel: ${fontMeta?.numTables} · Ukuran: ${(file.size / 1024).toFixed(1)} KB`\n                  : isMalay\n                  ? `Format: ${fontMeta?.format.toUpperCase()} · Jadual: ${fontMeta?.numTables} · Saiz: ${(file.size / 1024).toFixed(1)} KB`'
  );

  content = content.replace(
    ': isIndonesian ? "Ganti Font" : "Change Font"',
    ': isIndonesian ? "Ganti Font" : isMalay ? "Tukar Fon" : "Change Font"'
  );

  content = content.replace(
    ': isIndonesian ? "Pratinjau Font Langsung" : "Live Font Preview"',
    ': isIndonesian ? "Pratinjau Font Langsung" : isMalay ? "Pratonton Fon Langsung" : "Live Font Preview"'
  );

  content = content.replace(
    ': isIndonesian ? "Ukuran:" : "Size:"',
    ': isIndonesian ? "Ukuran:" : isMalay ? "Saiz:" : "Size:"'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `✓ Font Dikonversi: ${outputFileName}`',
    ': isIndonesian\n                    ? `✓ Font Dikonversi: ${outputFileName}`\n                    : isMalay\n                    ? `✓ Fon Ditukar: ${outputFileName}`'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · Di Browser`',
    ': isIndonesian\n                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · Di Browser`\n                    : isMalay\n                    ? `Saiz: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · Dalam Pelayar`'
  );

  content = content.replace(
    ': isIndonesian ? "Unduh Font" : "Download Font"',
    ': isIndonesian ? "Unduh Font" : isMalay ? "Muat Turun Fon" : "Download Font"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated FontWorkspace.tsx');
}

// --- 4. PrivacyWorkspace.tsx ---
{
  const file = 'src/utils/privacy/PrivacyWorkspace.tsx';
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    '  const isIndonesian = language === "id";',
    '  const isIndonesian = language === "id";\n  const isMalay = language === "ms";'
  );

  content = content.replace(
    ': isIndonesian\n          ? "Gagal menghapus metadata dari file."',
    ': isIndonesian\n          ? "Gagal menghapus metadata dari file."\n          : isMalay\n          ? "Gagal membuang metadata daripada fail."'
  );

  content = content.replace(
    ': isIndonesian ? "Hapus EXIF & Metadata Foto" : "Strip EXIF & Photo Metadata"',
    ': isIndonesian ? "Hapus EXIF & Metadata Foto" : isMalay ? "Buang EXIF & Metadata Foto" : "Strip EXIF & Photo Metadata"'
  );

  content = content.replace(
    ': isIndonesian ? "Hapus Lokasi GPS, Serial Kamera & Info Perangkat · 100% Di Browser" : "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"',
    ': isIndonesian ? "Hapus Lokasi GPS, Serial Kamera & Info Perangkat · 100% Di Browser" : isMalay ? "Buang Lokasi GPS, Siri Kamera & Maklumat Peranti · 100% Dalam Pelayar" : "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"'
  );

  content = content.replace(
    ': isIndonesian\n              ? "Pilih Foto untuk Menghapus Metadata"',
    ': isIndonesian\n              ? "Pilih Foto untuk Menghapus Metadata"\n              : isMalay\n              ? "Pilih Foto untuk Membuang Metadata"'
  );

  content = content.replace(
    ': isIndonesian\n                ? "Mendukung JPG, PNG, dan WebP (100% pemrosesan privat)"',
    ': isIndonesian\n                ? "Mendukung JPG, PNG, dan WebP (100% pemrosesan privat)"\n                : isMalay\n                ? "Menyokong JPG, PNG dan WebP (100% pemprosesan peribadi)"'
  );

  content = content.replace(
    ': isIndonesian ? "Detail File" : "File Details"',
    ': isIndonesian ? "Detail File" : isMalay ? "Butiran Fail" : "File Details"'
  );

  content = content.replace(
    ': isIndonesian ? "Metadata Terdeteksi" : "Detected Metadata"',
    ': isIndonesian ? "Metadata Terdeteksi" : isMalay ? "Metadata Dikesan" : "Detected Metadata"'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `Lokasi GPS: ${metadata?.hasGps ? "Terdeteksi (Risiko Privasi)" : "Aman / Bersih"}`',
    ': isIndonesian\n                    ? `Lokasi GPS: ${metadata?.hasGps ? "Terdeteksi (Risiko Privasi)" : "Aman / Bersih"}`\n                    : isMalay\n                    ? `Lokasi GPS: ${metadata?.hasGps ? "Dikesan (Risiko Privasi)" : "Selamat / Bersih"}`'
  );

  content = content.replace(
    ': isIndonesian\n                    ? `Serial Kamera: ${metadata?.hasCameraSerial ? "Tersemat" : "Tidak ada"}`',
    ': isIndonesian\n                    ? `Serial Kamera: ${metadata?.hasCameraSerial ? "Tersemat" : "Tidak ada"}`\n                    : isMalay\n                    ? `Siri Kamera: ${metadata?.hasCameraSerial ? "Ditemui" : "Tiada"}`'
  );

  content = content.replace(
    ': isIndonesian ? "Kamera:" : "Camera:"',
    ': isIndonesian ? "Kamera:" : isMalay ? "Kamera:" : "Camera:"'
  );

  content = content.replace(
    ': isIndonesian\n                    ? "Membersihkan gambar..."',
    ': isIndonesian\n                    ? "Membersihkan gambar..."\n                    : isMalay\n                    ? "Membersihkan imej..."'
  );

  content = content.replace(
    ': isIndonesian\n                    ? "Hapus Semua Metadata EXIF & GPS"',
    ': isIndonesian\n                    ? "Hapus Semua Metadata EXIF & GPS"\n                    : isMalay\n                    ? "Buang Semua Metadata EXIF & GPS"'
  );

  content = content.replace(
    ': isIndonesian\n                    ? "✓ Gambar dibersihkan! Semua metadata telah dihapus."',
    ': isIndonesian\n                    ? "✓ Gambar dibersihkan! Semua metadata telah dihapus."\n                    : isMalay\n                    ? "✓ Imej dibersihkan! Semua metadata telah dibuang."'
  );

  content = content.replace(
    ': isIndonesian\n                  ? "Unduh Gambar yang Dibersihkan"',
    ': isIndonesian\n                  ? "Unduh Gambar yang Dibersihkan"\n                  : isMalay\n                  ? "Muat Turun Imej Dibersihkan"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated PrivacyWorkspace.tsx');
}
