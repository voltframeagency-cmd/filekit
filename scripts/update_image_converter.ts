import fs from 'fs';

let content = fs.readFileSync('src/components/image-tools/ImageConverterWorkspace.tsx', 'utf8');

// 1. Add flags
content = content.replace(
  'const isTurkish = language === "tr";',
  'const isTurkish = language === "tr";\n  const isHindi = language === "hi";\n  const isIndonesian = language === "id";'
);

// 2. Choose another
content = content.replace(
  `: isSpanish\n                    ? "Elegir otra"\n                    : "Choose Another"`,
  `: isSpanish\n                    ? "Elegir otra"\n                    : isHindi\n                    ? "दूसरा चुनें"\n                    : isIndonesian\n                    ? "Pilih Lainnya"\n                    : "Choose Another"`
);

// 3. Converting Image... status
content = content.replace(
  `: isSpanish\n                        ? "Convirtiendo imagen..."\n                        : "Converting Image..."`,
  `: isSpanish\n                        ? "Convirtiendo imagen..."\n                        : isHindi\n                        ? "इमेज को रूपांतरित किया जा रहा है..."\n                        : isIndonesian\n                        ? "Mengonversi gambar..."\n                        : "Converting Image..."`
);

// 4. Image converted successfully
content = content.replace(
  `: isSpanish\n                        ? "Imagen convertida exitosamente"\n                        : "Image converted successfully"`,
  `: isSpanish\n                        ? "Imagen convertida exitosamente"\n                        : isHindi\n                        ? "इमेज सफलतापूर्वक रूपांतरित हो गई"\n                        : isIndonesian\n                        ? "Gambar berhasil dikonversi"\n                        : "Image converted successfully"`
);

// 5. Transparency warning
content = content.replace(
  `: isSpanish\n                      ? "⚠️ JPEG no admite transparencia. Las áreas transparentes usarán el color de fondo seleccionado."\n                      : "⚠️ JPEG does not support transparency. Transparent areas will use the selected background color."`,
  `: isSpanish\n                      ? "⚠️ JPEG no admite transparencia. Las áreas transparentes usarán el color de fondo seleccionado."\n                      : isHindi\n                      ? "⚠️ JPEG पारदर्शिता का समर्थन नहीं करता है। पारदर्शी क्षेत्र चयनित पृष्ठभूमि रंग का उपयोग करेंगे।"\n                      : isIndonesian\n                      ? "⚠️ JPEG tidak mendukung transparansi. Area transparan akan menggunakan warna latar belakang yang dipilih."\n                      : "⚠️ JPEG does not support transparency. Transparent areas will use the selected background color."`
);

// 6. Larger size
content = content.replace(
  `: isSpanish\n                          ? \`📈 Archivo es \${result.sizeChangePercentage}% mayor\`\n                          : \`📈 Output is \${result.sizeChangePercentage}% larger\``,
  `: isSpanish\n                          ? \`📈 Archivo es \${result.sizeChangePercentage}% mayor\`\n                          : isHindi\n                          ? \`📈 फ़ाइल \${result.sizeChangePercentage}% बड़ी है\`\n                          : isIndonesian\n                          ? \`📈 File \${result.sizeChangePercentage}% lebih besar\`\n                          : \`📈 Output is \${result.sizeChangePercentage}% larger\``
);

// 7. Smaller size
content = content.replace(
  `: isSpanish\n                        ? \`📉 Archivo es \${result.sizeChangePercentage}% menor\`\n                        : \`📉 Output is \${result.sizeChangePercentage}% smaller\``,
  `: isSpanish\n                        ? \`📉 Archivo es \${result.sizeChangePercentage}% menor\`\n                        : isHindi\n                        ? \`📈 फ़ाइल \${result.sizeChangePercentage}% छोटी है\`\n                        : isIndonesian\n                        ? \`📉 File \${result.sizeChangePercentage}% lebih kecil\`\n                        : \`📉 Output is \${result.sizeChangePercentage}% smaller\``
);

// 8. Download Converted Image
content = content.replace(
  `: isSpanish\n                        ? "Descargar imagen convertida"\n                        : "Download Converted Image"`,
  `: isSpanish\n                        ? "Descargar imagen convertida"\n                        : isHindi\n                        ? "रूपांतरित इमेज डाउनलोड करें"\n                        : isIndonesian\n                        ? "Unduh Gambar Terkonversi"\n                        : "Download Converted Image"`
);

// 9. Adjust Settings
content = content.replace(
  `: isSpanish\n                        ? "Ajustar opciones"\n                        : "Adjust Settings"`,
  `: isSpanish\n                        ? "Ajustar opciones"\n                        : isHindi\n                        ? "सेटिंग्स समायोजित करें"\n                        : isIndonesian\n                        ? "Sesuaikan Pengaturan"\n                        : "Adjust Settings"`
);

// 10. Conversion Options
content = content.replace(
  `: isSpanish\n                    ? "Opciones de conversión"\n                    : "Conversion Options"`,
  `: isSpanish\n                    ? "Opciones de conversión"\n                    : isHindi\n                    ? "रूपांतरण विकल्प"\n                    : isIndonesian\n                    ? "Opsi Konversi"\n                    : "Conversion Options"`
);

// 11. Target Format
content = content.replace(
  `: isSpanish\n                      ? "Formato de destino"\n                      : "Target Format"`,
  `: isSpanish\n                      ? "Formato de destino"\n                      : isHindi\n                      ? "लक्षित प्रारूप"\n                      : isIndonesian\n                      ? "Format Target"\n                      : "Target Format"`
);

// 12. Output Format
content = content.replace(
  `: isSpanish\n                      ? "Formato de salida"\n                      : "Output Format"`,
  `: isSpanish\n                      ? "Formato de salida"\n                      : isHindi\n                      ? "आउटपुट प्रारूप"\n                      : isIndonesian\n                      ? "Format Output"\n                      : "Output Format"`
);

// 13. Background Color label
content = content.replace(
  `: isDutch\n                      ? "Achtergrondkleur (voor alpha)"\n                      : "Background Color (for alpha)"`,
  `: isDutch\n                      ? "Achtergrondkleur (voor alpha)"\n                      : isHindi\n                      ? "पृष्ठभूमि का रंग (अल्फ़ा के लिए)"\n                      : isIndonesian\n                      ? "Warna Latar Belakang (untuk alfa)"\n                      : "Background Color (for alpha)"`
);

// 14. White, Black, Custom
content = content.replace(
  `: isDutch ? "Wit" : "White"`,
  `: isDutch ? "Wit" : isHindi ? "सफ़ेद" : isIndonesian ? "Putih" : "White"`
);
content = content.replace(
  `: isDutch ? "Zwart" : "Black"`,
  `: isDutch ? "Zwart" : isHindi ? "काला" : isIndonesian ? "Hitam" : "Black"`
);
content = content.replace(
  `: isDutch ? "Aangepast" : "Custom"`,
  `: isDutch ? "Aangepast" : isHindi ? "कस्टम" : isIndonesian ? "Kustom" : "Custom"`
);

// 15. Quality slider label
content = content.replace(
  `: isDutch ? "Kwaliteit" : "Quality"`,
  `: isDutch ? "Kwaliteit" : isHindi ? "गुणवत्ता" : isIndonesian ? "Kualitas" : "Quality"`
);

// 16. Low, Balanced, High
content = content.replace(
  `: isDutch ? "Laag" : "Low"`,
  `: isDutch ? "Laag" : isHindi ? "कम" : isIndonesian ? "Rendah" : "Low"`
);
content = content.replace(
  `: isDutch ? "Gebalanceerd" : "Balanced"`,
  `: isDutch ? "Gebalanceerd" : isHindi ? "संतुलित" : isIndonesian ? "Seimbang" : "Balanced"`
);
content = content.replace(
  `: isDutch ? "Hoog" : "High"`,
  `: isDutch ? "Hoog" : isHindi ? "उच्च" : isIndonesian ? "Tinggi" : "High"`
);

// 17. Convert button states
content = content.replace(
  `: isDutch\n                    ? "Afbeelding converteren..."\n                    : "Converting..."`,
  `: isDutch\n                    ? "Afbeelding converteren..."\n                    : isHindi\n                    ? "रूपांतरित किया जा रहा है..."\n                    : isIndonesian\n                    ? "Mengonversi..."\n                    : "Converting..."`
);
content = content.replace(
  `: isDutch\n                    ? "Afbeelding opnieuw converteren"\n                    : "Reconvert Image"`,
  `: isDutch\n                    ? "Afbeelding opnieuw converteren"\n                    : isHindi\n                    ? "इमेज को पुनः रूपांतरित करें"\n                    : isIndonesian\n                    ? "Konversi Ulang Gambar"\n                    : "Reconvert Image"`
);
content = content.replace(
  `: isDutch\n                    ? "Afbeelding converteren"\n                    : "Convert Image"`,
  `: isDutch\n                    ? "Afbeelding converteren"\n                    : isHindi\n                    ? "इमेज रूपांतरित करें"\n                    : isIndonesian\n                    ? "Konversi Gambar"\n                    : "Convert Image"`
);

fs.writeFileSync('src/components/image-tools/ImageConverterWorkspace.tsx', content, 'utf8');
console.log('Successfully updated ImageConverterWorkspace.tsx');
