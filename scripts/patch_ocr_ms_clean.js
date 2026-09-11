const fs = require('fs');

const file = 'src/components/ocr-tools/OcrPdfWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Language flag
content = content.replace(
  '  const isFinnish = language === "fi";',
  '  const isFinnish = language === "fi";\n  const isMalay = language === "ms";'
);

// 2. Reading file data into memory...
content = content.replace(
  ': isSpanish\n        ? "Leyendo archivo en memoria..."\n        : "Reading file data into memory..."',
  ': isSpanish\n        ? "Leyendo archivo en memoria..."\n        : isMalay\n        ? "Membaca data fail ke dalam memori..."\n        : "Reading file data into memory..."'
);

// 3. Failed to recognize text in document.
content = content.replace(
  ': isSpanish\n            ? "Error al reconocer texto en el documento."\n            : "Failed to recognize text in document."',
  ': isSpanish\n            ? "Error al reconocer texto en el documento."\n            : isMalay\n            ? "Gagal mengecam teks dalam dokumen."\n            : "Failed to recognize text in document."'
);

// 4. Select Scanned Document or Image
content = content.replace(
  ': isSpanish\n                ? "Selecciona documento escaneado o imagen"\n                : "Select Scanned Document or Image"',
  ': isSpanish\n                ? "Selecciona documento escaneado o imagen"\n                : isMalay\n                ? "Pilih Dokumen atau Imej Diimbas"\n                : "Select Scanned Document or Image"'
);

// 5. 100% private in-browser OCR...
content = content.replace(
  ': isSpanish\n                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."\n                : "100% private in-browser OCR. Files never leave your browser."',
  ': isSpanish\n                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."\n                : isMalay\n                ? "100% OCR peribadi dalam pelayar. Fail tidak pernah meninggalkan peranti anda."\n                : "100% private in-browser OCR. Files never leave your browser."'
);

// 6. Choose PDF or Image
content = content.replace(
  ': isSpanish\n              ? "Elegir PDF o imagen"\n              : "Choose PDF or Image"',
  ': isSpanish\n              ? "Elegir PDF o imagen"\n              : isMalay\n              ? "Pilih PDF atau Imej"\n              : "Choose PDF or Image"'
);

// 7. Change File
content = content.replace(
  ': isSpanish ? "Cambiar archivo" : "Change File"',
  ': isSpanish ? "Cambiar archivo" : isMalay ? "Tukar Fail" : "Change File"'
);

// 8. Performing OCR Recognition...
content = content.replace(
  ': isSpanish\n                    ? "Realizando reconocimiento OCR..."\n                    : "Performing OCR Recognition..."',
  ': isSpanish\n                    ? "Realizando reconocimiento OCR..."\n                    : isMalay\n                    ? "Melaksanakan Pengecaman OCR..."\n                    : "Performing OCR Recognition..."'
);

// 9. Recognize & Extract Text
content = content.replace(
  ': isSpanish\n                  ? "Reconocer y extraer texto"\n                  : "Recognize & Extract Text"',
  ': isSpanish\n                  ? "Reconocer y extraer texto"\n                  : isMalay\n                  ? "Camat & Ekstrak Teks"\n                  : "Recognize & Extract Text"'
);

// 10. OCR Completed (...)
content = content.replace(
  ': isSpanish\n                      ? `OCR completado (${result.totalPages} página${result.totalPages !== 1 ? "s" : ""} en ${result.durationMs}ms)`\n                      : `OCR Completed (${result.totalPages} page${result.totalPages !== 1 ? "s" : ""} in ${result.durationMs}ms)`',
  ': isSpanish\n                      ? `OCR completado (${result.totalPages} página${result.totalPages !== 1 ? "s" : ""} en ${result.durationMs}ms)`\n                      : isMalay\n                      ? `OCR Selesai (${result.totalPages} halaman dalam ${result.durationMs}ms)`\n                      : `OCR Completed (${result.totalPages} page${result.totalPages !== 1 ? "s" : ""} in ${result.durationMs}ms)`'
);

// 11. Copied!
content = content.replace(
  ': isSpanish\n                        ? "✓ ¡Copiado!"\n                        : "✓ Copied!"',
  ': isSpanish\n                        ? "✓ ¡Copiado!"\n                        : isMalay\n                        ? "✓ Disalin!"\n                        : "✓ Copied!"'
);

// 12. Copy Text
content = content.replace(
  ': isSpanish\n                        ? "Copiar texto"\n                        : "Copy Text"',
  ': isSpanish\n                        ? "Copiar texto"\n                        : isMalay\n                        ? "Salin Teks"\n                        : "Copy Text"'
);

// 13. Download .TXT
content = content.replace(
  ': isSpanish ? "Descargar .TXT" : "Download .TXT"',
  ': isSpanish ? "Descargar .TXT" : isMalay ? "Muat Turun .TXT" : "Download .TXT"'
);

// 14. Download Searchable PDF
content = content.replace(
  ': isSpanish\n                        ? "Descargar PDF con búsqueda"\n                        : "Download Searchable PDF"',
  ': isSpanish\n                        ? "Descargar PDF con búsqueda"\n                        : isMalay\n                        ? "Muat Turun PDF Boleh Dicari"\n                        : "Download Searchable PDF"'
);

// 15. Extracted Text
content = content.replace(
  ': isSpanish ? "Texto extraído" : "Extracted Text"',
  ': isSpanish ? "Texto extraído" : isMalay ? "Teks Diekstrak" : "Extracted Text"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated OcrPdfWorkspace.tsx with exact strings');
