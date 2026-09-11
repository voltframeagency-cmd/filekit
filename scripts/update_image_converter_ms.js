const fs = require('fs');

const file = 'src/components/image-tools/ImageConverterWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isMalay flag
content = content.replace(
  '  const isIndonesian = language === "id";',
  '  const isIndonesian = language === "id";\n  const isMalay = language === "ms";'
);

// 2. Choose Another button
content = content.replace(
  ': isIndonesian\n                    ? "Pilih Lainnya"\n                    : "Choose Another"',
  ': isIndonesian\n                    ? "Pilih Lainnya"\n                    : isMalay\n                    ? "Pilih Yang Lain"\n                    : "Choose Another"'
);

// 3. Converting Image badge
content = content.replace(
  ': isIndonesian\n                        ? "Mengonversi gambar..."\n                        : "Converting Image..."',
  ': isIndonesian\n                        ? "Mengonversi gambar..."\n                        : isMalay\n                        ? "Menukar imej..."\n                        : "Converting Image..."'
);

// 4. Converted successfully badge
content = content.replace(
  ': isIndonesian\n                        ? "Gambar berhasil dikonversi"\n                        : "Image converted successfully"',
  ': isIndonesian\n                        ? "Gambar berhasil dikonversi"\n                        : isMalay\n                        ? "Imej berjaya ditukar"\n                        : "Image converted successfully"'
);

// 5. Transparency warning
content = content.replace(
  ': isIndonesian\n                      ? "⚠️ JPEG tidak mendukung transparansi. Area transparan akan menggunakan warna latar belakang yang dipilih."\n                      : "⚠️ JPEG does not support transparency. Transparent areas will use the selected background color."',
  ': isIndonesian\n                      ? "⚠️ JPEG tidak mendukung transparansi. Area transparan akan menggunakan warna latar belakang yang dipilih."\n                      : isMalay\n                      ? "⚠️ JPEG tidak menyokong ketelusan. Kawasan lut sinar akan menggunakan warna latar belakang yang dipilih."\n                      : "⚠️ JPEG does not support transparency. Transparent areas will use the selected background color."'
);

// 6. Size larger / smaller metrics
content = content.replace(
  ': isIndonesian\n                          ? `📈 File ${result.sizeChangePercentage}% lebih besar`\n                          : `📈 Output is ${result.sizeChangePercentage}% larger`',
  ': isIndonesian\n                          ? `📈 File ${result.sizeChangePercentage}% lebih besar`\n                          : isMalay\n                          ? `📈 Fail ${result.sizeChangePercentage}% lebih besar`\n                          : `📈 Output is ${result.sizeChangePercentage}% larger`'
);

content = content.replace(
  ': isIndonesian\n                        ? `📉 File ${result.sizeChangePercentage}% lebih kecil`\n                        : `📉 Output is ${result.sizeChangePercentage}% smaller`',
  ': isIndonesian\n                        ? `📉 File ${result.sizeChangePercentage}% lebih kecil`\n                        : isMalay\n                        ? `📉 Fail ${result.sizeChangePercentage}% lebih kecil`\n                        : `📉 Output is ${result.sizeChangePercentage}% smaller`'
);

// 7. Download Converted Image button
content = content.replace(
  ': isIndonesian\n                        ? "Unduh Gambar Terkonversi"\n                        : "Download Converted Image"',
  ': isIndonesian\n                        ? "Unduh Gambar Terkonversi"\n                        : isMalay\n                        ? "Muat Turun Imej Ditukar"\n                        : "Download Converted Image"'
);

// 8. Adjust Settings button
content = content.replace(
  ': isIndonesian\n                        ? "Sesuaikan Pengaturan"\n                        : "Adjust Settings"',
  ': isIndonesian\n                        ? "Sesuaikan Pengaturan"\n                        : isMalay\n                        ? "Laras Tetapan"\n                        : "Adjust Settings"'
);

// 9. Conversion Options header
content = content.replace(
  ': isIndonesian\n                    ? "Opsi Konversi"\n                    : "Conversion Options"',
  ': isIndonesian\n                    ? "Opsi Konversi"\n                    : isMalay\n                    ? "Pilihan Penukaran"\n                    : "Conversion Options"'
);

// 10. Target Format label
content = content.replace(
  ': isIndonesian\n                      ? "Format Target"\n                      : "Target Format"',
  ': isIndonesian\n                      ? "Format Target"\n                      : isMalay\n                      ? "Format Sasaran"\n                      : "Target Format"'
);

// 11. Output Format label
content = content.replace(
  ': isIndonesian\n                      ? "Format Output"\n                      : "Output Format"',
  ': isIndonesian\n                      ? "Format Output"\n                      : isMalay\n                      ? "Format Output"\n                      : "Output Format"'
);

// 12. Background Color (for alpha)
content = content.replace(
  ': isIndonesian\n                      ? "Warna Latar Belakang (untuk alfa)"\n                      : "Background Color (for alpha)"',
  ': isIndonesian\n                      ? "Warna Latar Belakang (untuk alfa)"\n                      : isMalay\n                      ? "Warna Latar Belakang (untuk alfa)"\n                      : "Background Color (for alpha)"'
);

// 13. Color options: White, Black, Custom
content = content.replace(
  ': isIndonesian ? "Putih" : "White"',
  ': isIndonesian ? "Putih" : isMalay ? "Putih" : "White"'
);
content = content.replace(
  ': isIndonesian ? "Hitam" : "Black"',
  ': isIndonesian ? "Hitam" : isMalay ? "Hitam" : "Black"'
);
content = content.replace(
  ': isIndonesian ? "Kustom" : "Custom"',
  ': isIndonesian ? "Kustom" : isMalay ? "Tersuai" : "Custom"'
);

// 14. Quality slider labels
content = content.replace(
  ': isIndonesian ? "Kualitas" : "Quality"',
  ': isIndonesian ? "Kualitas" : isMalay ? "Kualiti" : "Quality"'
);
content = content.replace(
  ': isIndonesian ? "Rendah" : "Low"',
  ': isIndonesian ? "Rendah" : isMalay ? "Rendah" : "Low"'
);
content = content.replace(
  ': isIndonesian ? "Seimbang" : "Balanced"',
  ': isIndonesian ? "Seimbang" : isMalay ? "Seimbang" : "Balanced"'
);
content = content.replace(
  ': isIndonesian ? "Tinggi" : "High"',
  ': isIndonesian ? "Tinggi" : isMalay ? "Tinggi" : "High"'
);

// 15. Submit button: Converting..., Reconvert Image, Convert Image
content = content.replace(
  ': isIndonesian\n                    ? "Mengonversi..."\n                    : "Converting..."',
  ': isIndonesian\n                    ? "Mengonversi..."\n                    : isMalay\n                    ? "Menukar..."\n                    : "Converting..."'
);

content = content.replace(
  ': isIndonesian\n                    ? "Konversi Ulang Gambar"\n                    : "Reconvert Image"',
  ': isIndonesian\n                    ? "Konversi Ulang Gambar"\n                    : isMalay\n                    ? "Tukar Semula Imej"\n                    : "Reconvert Image"'
);

content = content.replace(
  ': isDutch\n                    ? "Afbeelding converteren"\n                    : "Convert Image"',
  ': isDutch\n                    ? "Afbeelding converteren"\n                    : isMalay\n                    ? "Tukar Imej"\n                    : isIndonesian\n                    ? "Konversi Gambar"\n                    : "Convert Image"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated ImageConverterWorkspace.tsx');
