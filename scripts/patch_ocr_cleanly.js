const fs = require('fs');

const file = 'src/components/ocr-tools/OcrPdfWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '  const isFinnish = language === "fi";',
  '  const isFinnish = language === "fi";\n  const isMalay = language === "ms";'
);

content = content.replace(
  '                : isSpanish\n                ? "Selecciona documento escaneado o imagen"\n                : "Select Scanned Document or Image"',
  '                : isSpanish\n                ? "Selecciona documento escaneado o imagen"\n                : isMalay\n                ? "Pilih Dokumen atau Imej Diimbas"\n                : "Select Scanned Document or Image"'
);

content = content.replace(
  '                : isSpanish\n                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."\n                : "100% private in-browser OCR. Files never leave your browser."',
  '                : isSpanish\n                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."\n                : isMalay\n                ? "100% OCR peribadi dalam pelayar. Fail tidak pernah meninggalkan peranti anda."\n                : "100% private in-browser OCR. Files never leave your browser."'
);

content = content.replace(
  '              : isSpanish\n              ? "Elegir PDF o imagen"\n              : "Choose PDF or Image"',
  '              : isSpanish\n              ? "Elegir PDF o imagen"\n              : isMalay\n              ? "Pilih PDF atau Imej"\n              : "Choose PDF or Image"'
);

content = content.replace(
  ': isSpanish ? "Cambiar archivo" : "Change File"',
  ': isSpanish ? "Cambiar archivo" : isMalay ? "Tukar Fail" : "Change File"'
);

content = content.replace(
  ': isSpanish\n                    ? "Realizando reconocimiento OCR..."\n                    : "Performing OCR Recognition..."',
  ': isSpanish\n                    ? "Realizando reconocimiento OCR..."\n                    : isMalay\n                    ? "Melaksanakan Pengecaman OCR..."\n                    : "Performing OCR Recognition..."'
);

content = content.replace(
  ': isSpanish\n                  ? "Reconocer y extraer texto"\n                  : "Recognize & Extract Text"',
  ': isSpanish\n                  ? "Reconocer y extraer texto"\n                  : isMalay\n                  ? "Camat & Ekstrak Teks"\n                  : "Recognize & Extract Text"'
);

content = content.replace(
  ': isSpanish ? "Descargar .TXT" : "Download .TXT"',
  ': isSpanish ? "Descargar .TXT" : isMalay ? "Muat Turun .TXT" : "Download .TXT"'
);

content = content.replace(
  ': isSpanish ? "Texto extraído" : "Extracted Text"',
  ': isSpanish ? "Texto extraído" : isMalay ? "Teks Diekstrak" : "Extracted Text"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated OcrPdfWorkspace.tsx');
