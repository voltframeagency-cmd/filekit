const fs = require('fs');
let code = fs.readFileSync('src/components/ocr-tools/OcrPdfWorkspace.tsx', 'utf8');

// 1. Reading file data into memory
code = code.replace(
  `: isSpanish\n        ? "Leyendo archivo en memoria..."\n        : "Reading file data into memory..."`,
  `: isSpanish\n        ? "Leyendo archivo en memoria..."\n        : isMalay\n        ? "Membaca data fail ke dalam memori..."\n        : "Reading file data into memory..."`
);

// 2. Failed to recognize text
code = code.replace(
  `: isSpanish\n            ? "Error al reconocer texto en el documento."\n            : "Failed to recognize text in document.")`,
  `: isSpanish\n            ? "Error al reconocer texto en el documento."\n            : isMalay\n            ? "Gagal mengecam teks dalam dokumen."\n            : "Failed to recognize text in document.")`
);

// 3. Dropzone title
code = code.replace(
  `: isSpanish\n                ? "Selecciona documento escaneado o imagen"\n                : "Select Scanned Document or Image"}`,
  `: isSpanish\n                ? "Selecciona documento escaneado o imagen"\n                : isMalay\n                ? "Pilih Dokumen atau Imej Diimbas"\n                : "Select Scanned Document or Image"}`
);

// 4. Dropzone subtitle
code = code.replace(
  `: isSpanish\n                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."\n                : "100% private in-browser OCR. Files never leave your browser."}`,
  `: isSpanish\n                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."\n                : isMalay\n                ? "100% OCR peribadi dalam pelayar. Fail tidak pernah meninggalkan peranti anda."\n                : "100% private in-browser OCR. Files never leave your browser."}`
);

// 5. Choose PDF or Image
code = code.replace(
  `: isSpanish\n              ? "Elegir PDF o imagen"\n              : "Choose PDF or Image"}`,
  `: isSpanish\n              ? "Elegir PDF o imagen"\n              : isMalay\n              ? "Pilih PDF atau Imej"\n              : "Choose PDF or Image"}`
);

// 6. Performing OCR / Recognize button
code = code.replace(
  `: isSpanish\n                    ? "Realizando reconocimiento OCR..."\n                    : "Performing OCR Recognition..."`,
  `: isSpanish\n                    ? "Realizando reconocimiento OCR..."\n                    : isMalay\n                    ? "Melaksanakan Pengecaman OCR..."\n                    : "Performing OCR Recognition..."`
);
code = code.replace(
  `: isSpanish\n                  ? "Reconocer y extraer texto"\n                  : "Recognize & Extract Text"}`,
  `: isSpanish\n                  ? "Reconocer y extraer texto"\n                  : isMalay\n                  ? "Camat & Ekstrak Teks"\n                  : "Recognize & Extract Text"}`
);

// 7. OCR completed count
code = code.replace(
  `: isSpanish\n                      ? \`OCR completado (\${result.totalPages} página\${result.totalPages !== 1 ? "s" : ""} en \${result.durationMs}ms)\`\n                      : \`OCR Completed (\${result.totalPages} page\${result.totalPages !== 1 ? "s" : ""} in \${result.durationMs}ms)\`}`,
  `: isSpanish\n                      ? \`OCR completado (\${result.totalPages} página\${result.totalPages !== 1 ? "s" : ""} en \${result.durationMs}ms)\`\n                      : isMalay\n                      ? \`OCR Selesai (\${result.totalPages} halaman dalam \${result.durationMs}ms)\`\n                      : \`OCR Completed (\${result.totalPages} page\${result.totalPages !== 1 ? "s" : ""} in \${result.durationMs}ms)\`}`
);

// 8. Copied / Copy Text
code = code.replace(
  `: isSpanish\n                        ? "✓ ¡Copiado!"\n                        : "✓ Copied!"`,
  `: isSpanish\n                        ? "✓ ¡Copiado!"\n                        : isMalay\n                        ? "✓ Disalin!"\n                        : "✓ Copied!"`
);
code = code.replace(
  `: isSpanish\n                      ? "Copiar texto"\n                      : "Copy Text"}`,
  `: isSpanish\n                      ? "Copiar texto"\n                      : isMalay\n                      ? "Salin Teks"\n                      : "Copy Text"}`
);

// 9. Download Searchable PDF
code = code.replace(
  `: isSpanish\n                        ? "Descargar PDF con búsqueda"\n                        : "Download Searchable PDF"}`,
  `: isSpanish\n                        ? "Descargar PDF con búsqueda"\n                        : isMalay\n                        ? "Muat Turun PDF Boleh Dicari"\n                        : "Download Searchable PDF"}`
);

fs.writeFileSync('src/components/ocr-tools/OcrPdfWorkspace.tsx', code, 'utf8');
console.log('OcrPdfWorkspace updated successfully!');
