const fs = require('fs');

const file = 'src/components/office-tools/OfficeConverterWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isMalay flag
content = content.replace(
  '  const isIndonesian = language === "id";',
  '  const isIndonesian = language === "id";\n  const isMalay = language === "ms";'
);

// 2. Change File button
content = content.replace(
  ': isIndonesian ? "Ganti File" : "Change File"',
  ': isIndonesian ? "Ganti File" : isMalay ? "Tukar Fail" : "Change File"'
);

// 3. Download PDF button
content = content.replace(
  ': isIndonesian ? "Unduh PDF" : "Download PDF"',
  ': isIndonesian ? "Unduh PDF" : isMalay ? "Muat Turun PDF" : "Download PDF"'
);

// 4. Modal Header
content = content.replace(
  ': isSpanish\n                  ? "Aviso de conversión segura en servidor"\n                  : "Secure Server Conversion Notice"',
  ': isSpanish\n                  ? "Aviso de conversión segura en servidor"\n                  : isMalay\n                  ? "Notis Penukaran Pelayan Selamat"\n                  : isIndonesian\n                  ? "Pemberitahuan Konversi Server Aman"\n                  : "Secure Server Conversion Notice"'
);

// 5. Modal Description
content = content.replace(
  ': isSpanish\n                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."\n                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."',
  ': isSpanish\n                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."\n                : isMalay\n                ? "Penukaran dokumen ini memerlukan microVM awan terpencil untuk memastikan ketepatan tipografi dan reka letak sepenuhnya. Fail anda akan diproses dalam memori dan dipadamkan serta-merta."\n                : isIndonesian\n                ? "Konversi dokumen ini memerlukan microVM cloud terisolasi untuk memastikan ketelitian tipografi dan tata letak sepenuhnya. File Anda akan diproses di memori dan segera dihapus."\n                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."'
);

// 6. Modal Cancel
content = content.replace(
  ': isIndonesian ? "Batal" : "Cancel"',
  ': isIndonesian ? "Batal" : isMalay ? "Batal" : "Cancel"'
);

// 7. Modal Authorize & Convert
content = content.replace(
  ': isIndonesian ? "Otorisasi & Konversi" : "Authorize & Convert"',
  ': isIndonesian ? "Otorisasi & Konversi" : isMalay ? "Benarkan & Tukar" : "Authorize & Convert"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated OfficeConverterWorkspace.tsx');
