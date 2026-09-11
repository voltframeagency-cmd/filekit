const fs = require('fs');

let content = fs.readFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', 'utf8');

// Normalize to LF temporarily for reliable replacement
const isCrlf = content.includes('\r\n');
if (isCrlf) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Language prop support
content = content.replace(
  'documentTypeLabel: string; // e.g. "Word Document", "PowerPoint Presentation", "Excel Spreadsheet"',
  'documentTypeLabel: string;\n  language?: string;'
);
content = content.replace(
  'documentTypeLabel,\n}) => {',
  'documentTypeLabel,\n  language: propLanguage,\n}) => {'
);
content = content.replace(
  'const { language } = useLanguage();',
  'const { language: contextLang } = useLanguage();\n  const language = propLanguage || contextLang || "en";\n  const isThai = language === "th";\n  const isMalay = language === "ms";'
);

// 2. Stages and errors
content = content.replace(
  'isSwedish\n        ? "Ansluter till isolerad microVM..."',
  'isThai\n        ? "กำลังเชื่อมต่อไปยัง microVM ที่แยกต่างหาก..."\n        : isMalay\n        ? "Menyambung ke microVM terpencil..."\n        : isSwedish\n        ? "Ansluter till isolerad microVM..."'
);
content = content.replace(
  'isSwedish\n          ? "Renderar dokumentets sidor..."',
  'isThai\n          ? "กำลังเรนเดอร์หน้าเอกสาร..."\n          : isMalay\n          ? "Memaparkan halaman dokumen..."\n          : isSwedish\n          ? "Renderar dokumentets sidor..."'
);
content = content.replace(
  'isSwedish\n              ? `Serverkonvertering misslyckades (${response.status})`',
  'isThai\n              ? `การแปลงผ่านเซิร์ฟเวอร์ล้มเหลว (${response.status})`\n              : isMalay\n              ? `Penukaran pelayan gagal (${response.status})`\n              : isSwedish\n              ? `Serverkonvertering misslyckades (${response.status})`'
);
content = content.replace(
  'isSwedish\n          ? "Verifierar genererat PDF-utflöde..."',
  'isThai\n          ? "กำลังตรวจสอบความถูกต้องของไฟล์ PDF ที่สร้างขึ้น..."\n          : isMalay\n          ? "Mengesahkan fail PDF yang dihasilkan..."\n          : isSwedish\n          ? "Verifierar genererat PDF-utflöde..."'
);
content = content.replace(
  'isSwedish\n              ? "Kunde inte konvertera dokumentet."',
  'isThai\n              ? "ไม่สามารถแปลงเอกสารได้"\n              : isMalay\n              ? "Gagal menukar dokumen."\n              : isSwedish\n              ? "Kunde inte konvertera dokumentet."'
);
content = content.replace(
  'isSwedish\n            ? "Ett oväntat fel uppstod vid konverteringen."',
  'isThai\n            ? "เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการแปลง"\n            : isMalay\n            ? "Ralat yang tidak dijangka berlaku semasa penukaran."\n            : isSwedish\n            ? "Ett oväntat fel uppstod vid konverteringen."'
);

// 3. Dropzone Header & Subtitle
content = content.replace(
  'isSwedish\n                ? "Välj dokument att konvertera"',
  'isThai\n                ? "เลือกเอกสารที่จะแปลง"\n                : isMalay\n                ? "Pilih dokumen untuk ditukar"\n                : isSwedish\n                ? "Välj dokument att konvertera"'
);
content = content.replace(
  'isSwedish\n                ? "Högprecisionskonvertering i isolerad microVM med 0% datalagring."',
  'isThai\n                ? "การแปลง microVM LibreOffice ความแม่นยำสูงโดยไม่มีการเก็บข้อมูล 0%"\n                : isMalay\n                ? "Penukaran microVM LibreOffice berketepatan tinggi dengan 0% pengekalan data."\n                : isSwedish\n                ? "Högprecisionskonvertering i isolerad microVM med 0% datalagring."'
);

// 4. Buttons
content = content.replace(
  'isSwedish ? "Välj fil"',
  'isThai ? "เลือกไฟล์" : isMalay ? "Pilih Fail" : isSwedish ? "Välj fil"'
);
content = content.replace(
  'isSwedish ? "Byt fil"',
  'isThai ? "เปลี่ยนไฟล์" : isMalay ? "Tukar Fail" : isSwedish ? "Byt fil"'
);

// 5. Ephemeral sandbox
content = content.replace(
  'isSwedish\n                  ? "Isolerad mikrovirtuell maskin-sandbox"',
  'isThai\n                  ? "แซนด์บ็อกซ์ MicroVM ชั่วคราว"\n                  : isMalay\n                  ? "Kotak Pasir MicroVM Sementara"\n                  : isSwedish\n                  ? "Isolerad mikrovirtuell maskin-sandbox"'
);
content = content.replace(
  'isSwedish\n                  ? "Dokumentbehandlingen körs i en isolerad microVM-container. Filer krypteras under överföring och raderas automatiskt ur minnet direkt efter konverteringen."',
  'isThai\n                  ? "การประมวลผลเอกสารทำงานในคอนเทนเนอร์ microVM ที่แยกต่างหาก ไฟล์ได้รับการเข้ารหัสระหว่างส่งและลบออกจากหน่วยความจำคลาวด์โดยอัตโนมัติทันทีหลังจากการแปลง"\n                  : isMalay\n                  ? "Pemaparan dokumen dijalankan dalam microVM bekas terpencil. Fail disulitkan semasa transit dan dipadamkan secara automatik daripada memori awan serta-merta selepas penukaran."\n                  : isSwedish\n                  ? "Dokumentbehandlingen körs i en isolerad microVM-container. Filer krypteras under överföring och raderas automatiskt ur minnet direkt efter konverteringen."'
);

// 6. Action button & Result card
content = content.replace(
  'isSwedish ? (\n                "Konvertera till PDF"',
  'isThai ? (\n                "แปลงเป็น PDF"\n              ) : isMalay ? (\n                "Tukar ke PDF"\n              ) : isSwedish ? (\n                "Konvertera till PDF"'
);
content = content.replace(
  'isSwedish\n                      ? "Konverterad till PDF"',
  'isThai\n                      ? "แปลงเป็น PDF สำเร็จแล้ว!"\n                      : isMalay\n                      ? "Berjaya Ditukar ke PDF!"\n                      : isSwedish\n                      ? "Konverterad till PDF"'
);
content = content.replace(
  'isSwedish ? "Ladda ner PDF"',
  'isThai ? "ดาวน์โหลด PDF" : isMalay ? "Muat Turun PDF" : isSwedish ? "Ladda ner PDF"'
);

// 7. Consent Modal
content = content.replace(
  'isSwedish\n                  ? "Meddelande om säker serverkonvertering"',
  'isThai\n                  ? "ประกาศการแปลงผ่านเซิร์ฟเวอร์ที่ปลอดภัย"\n                  : isMalay\n                  ? "Notis Penukaran Pelayan Selamat"\n                  : isSwedish\n                  ? "Meddelande om säker serverkonvertering"'
);
content = content.replace(
  'isSwedish\n                ? "Denna dokumentkonvertering kräver en isolerad moln-microVM för att säkerställa fullständig typografi- och layouttrohet. Din fil bearbetas i minnet och raderas omedelbart efteråt."',
  'isThai\n                ? "การแปลงเอกสารนี้จำเป็นต้องใช้ microVM บนคลาวด์ที่แยกจากกันเพื่อรักษาความสมบูรณ์ของการจัดหน้าและแบบอักษร ไฟล์จะได้รับการประมวลผลในหน่วยความจำและลบทันที"\n                : isMalay\n                ? "Penukaran dokumen ini memerlukan microVM awan terpencil untuk memastikan ketepatan tipografi dan susun atur yang lengkap. Fail anda diproses dalam memori dan dipadamkan serta-merta."\n                : isSwedish\n                ? "Denna dokumentkonvertering kräver en isolerad moln-microVM för att säkerställa fullständig typografi- och layouttrohet. Din fil bearbetas i minnet och raderas omedelbart efteråt."'
);
content = content.replace(
  'isSwedish ? "Avbryt"',
  'isThai ? "ยกเลิก" : isMalay ? "Batal" : isSwedish ? "Avbryt"'
);
content = content.replace(
  'isSwedish ? "Auktorisera och konvertera"',
  'isThai ? "อนุญาตและแปลงไฟล์" : isMalay ? "Kebenaran & Tukar" : isSwedish ? "Auktorisera och konvertera"'
);

// Convert back to CRLF if needed
if (isCrlf) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', content, 'utf8');
console.log('Successfully patched OfficeConverterWorkspace.tsx with Thai/Malay support');
