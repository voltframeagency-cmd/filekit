import fs from 'fs';

let content = fs.readFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', 'utf8');

// 1. Add flags
content = content.replace(
  'const isTurkish = language === "tr";',
  'const isTurkish = language === "tr";\n  const isHindi = language === "hi";\n  const isIndonesian = language === "id";'
);

// 2. Stage 1: Connecting to isolated microVM...
content = content.replace(
  `: isSpanish\n        ? "Conectando a microVM aislada..."\n        : "Connecting to isolated microVM..."`,
  `: isSpanish\n        ? "Conectando a microVM aislada..."\n        : isHindi\n        ? "आइसोलेटेड microVM से कनेक्ट किया जा रहा है..."\n        : isIndonesian\n        ? "Menghubungkan ke microVM terisolasi..."\n        : "Connecting to isolated microVM..."`
);

// 3. Stage 2: Rendering Office document pages...
content = content.replace(
  `: isSpanish\n          ? "Renderizando páginas del documento..."\n          : "Rendering Office document pages..."`,
  `: isSpanish\n          ? "Renderizando páginas del documento..."\n          : isHindi\n          ? "दस्तावेज़ पृष्ठ रेंडर किए जा रहे हैं..."\n          : isIndonesian\n          ? "Merender halaman dokumen..."\n          : "Rendering Office document pages..."`
);

// 4. Stage 3: Server conversion failed
content = content.replace(
  `: isSpanish\n              ? \`Error en la conversión del servidor (\${response.status})\`\n              : \`Server conversion failed (\${response.status})\`)`,
  `: isSpanish\n              ? \`Error en la conversión del servidor (\${response.status})\`\n              : isHindi\n              ? \`सर्वर रूपांतरण विफल रहा (\${response.status})\`\n              : isIndonesian\n              ? \`Konversi server gagal (\${response.status})\`\n              : \`Server conversion failed (\${response.status})\`)`
);

// 5. Stage 4: Verifying PDF output stream...
content = content.replace(
  `: isSpanish\n          ? "Verificando archivo PDF resultante..."\n          : "Verifying PDF output stream..."`,
  `: isSpanish\n          ? "Verificando archivo PDF resultante..."\n          : isHindi\n          ? "PDF आउटपुट स्ट्रीम सत्यापित की जा रही है..."\n          : isIndonesian\n          ? "Memverifikasi aliran output PDF..."\n          : "Verifying PDF output stream..."`
);

// 6. Stage 5: Failed to convert document.
content = content.replace(
  `: isSpanish\n              ? "Error al convertir el documento."\n              : "Failed to convert document.")`,
  `: isSpanish\n              ? "Error al convertir el documento."\n              : isHindi\n              ? "दस्तावेज़ को रूपांतरित करने में विफल।"\n              : isIndonesian\n              ? "Gagal mengonversi dokumen."\n              : "Failed to convert document.")`
);

// 7. Unexpected error
content = content.replace(
  `: isSpanish\n            ? "Ocurrió un error inesperado durante la conversión."\n            : "An unexpected error occurred during conversion.")`,
  `: isSpanish\n            ? "Ocurrió un error inesperado durante la conversión."\n            : isHindi\n            ? "रूपांतरण के दौरान एक अप्रत्याशित त्रुटि हुई।"\n            : isIndonesian\n            ? "Terjadi kesalahan tak terduga selama konversi."\n            : "An unexpected error occurred during conversion.")`
);

// 8. Change file button
content = content.replace(
  `: isSpanish ? "Cambiar archivo" : "Change File"`,
  `: isSpanish ? "Cambiar archivo" : isHindi ? "फ़ाइल बदलें" : isIndonesian ? "Ganti File" : "Change File"`
);

// 9. Ephemeral MicroVM Sandbox badge
content = content.replace(
  `: isSpanish\n                  ? "Entorno aislado en microVM efímera"\n                  : "Ephemeral MicroVM Sandbox"`,
  `: isSpanish\n                  ? "Entorno aislado en microVM efímera"\n                  : isHindi\n                  ? "अल्पकालिक microVM सैंडबॉक्स"\n                  : isIndonesian\n                  ? "Sandbox MicroVM Efemeral"\n                  : "Ephemeral MicroVM Sandbox"`
);

// 10. Privacy Notice Banner text
content = content.replace(
  `: isSpanish\n                  ? "El renderizado del documento se ejecuta en un contenedor aislado. Los archivos están cifrados en tránsito y se eliminan automáticamente de la memoria inmediatamente tras la conversión."\n                  : "Office document rendering runs in an isolated container microVM. Files are encrypted in transit and purged automatically from cloud memory immediately after conversion."`,
  `: isSpanish\n                  ? "El renderizado del documento se ejecuta en un contenedor aislado. Los archivos están cifrados en tránsito y se eliminan automáticamente de la memoria inmediatamente tras la conversión."\n                  : isHindi\n                  ? "ऑफ़िस दस्तावेज़ रेंडरिंग एक आइसोलेटेड कंटेनर microVM में चलती है। फ़ाइलें ट्रांज़िट में एन्क्रिप्टेड होती हैं और रूपांतरण के तुरंत बाद क्लाउड मेमोरी से स्वचालित रूप से हटा दी जाती हैं।"\n                  : isIndonesian\n                  ? "Perenderan dokumen Office berjalan dalam microVM kontainer terisolasi. File dienkripsi saat transit dan dihapus otomatis dari memori cloud segera setelah konversi."\n                  : "Office document rendering runs in an isolated container microVM. Files are encrypted in transit and purged automatically from cloud memory immediately after conversion."`
);

// 11. Convert to PDF button
content = content.replace(
  `: isSpanish ? (\n                "Convertir a PDF"\n              ) : (\n                "Convert to PDF"\n              )`,
  `: isSpanish ? (\n                "Convertir a PDF"\n              ) : isHindi ? (\n                "PDF में रूपांतरित करें"\n              ) : isIndonesian ? (\n                "Konversi ke PDF"\n              ) : (\n                "Convert to PDF"\n              )`
);

// 12. Converted to PDF Successfully
content = content.replace(
  `: isSpanish\n                      ? "Convertido a PDF exitosamente"\n                      : "Converted to PDF Successfully"`,
  `: isSpanish\n                      ? "Convertido a PDF exitosamente"\n                      : isHindi\n                      ? "सफलतापूर्वक PDF में रूपांतरित हुआ"\n                      : isIndonesian\n                      ? "Berhasil Dikonversi ke PDF"\n                      : "Converted to PDF Successfully"`
);

// 13. Rendered in ms
content = content.replace(
  `: isSpanish\n                      ? \`Procesado en \${result.durationMs}ms • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contenedor purgado\`\n                      : \`Rendered in \${result.durationMs}ms • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • Ephemeral container purged\``,
  `: isSpanish\n                      ? \`Procesado en \${result.durationMs}ms • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contenedor purgado\`\n                      : isHindi\n                      ? \`\${result.durationMs}ms में रेंडर किया गया • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • कंटेनर हटा दिया गया\`\n                      : isIndonesian\n                      ? \`Dirender dalam \${result.durationMs}ms • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • Kontainer dihapus\`\n                      : \`Rendered in \${result.durationMs}ms • \${(result.outputSizeBytes / 1024).toFixed(1)} KB • Ephemeral container purged\``
);

// 14. Download PDF button
content = content.replace(
  `: isSpanish ? "Descargar PDF" : "Download PDF"`,
  `: isSpanish ? "Descargar PDF" : isHindi ? "PDF डाउनलोड करें" : isIndonesian ? "Unduh PDF" : "Download PDF"`
);

// 15. Secure Server Conversion Notice modal title
content = content.replace(
  `: isSpanish\n                  ? "Aviso de conversión segura en servidor"\n                  : "Secure Server Conversion Notice"`,
  `: isSpanish\n                  ? "Aviso de conversión segura en servidor"\n                  : isHindi\n                  ? "सुरक्षित सर्वर रूपांतरण सूचना"\n                  : isIndonesian\n                  ? "Pemberitahuan Konversi Server Aman"\n                  : "Secure Server Conversion Notice"`
);

// 16. Modal body
content = content.replace(
  `: isSpanish\n                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."\n                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."`,
  `: isSpanish\n                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."\n                : isHindi\n                ? "पूर्ण टाइपोग्राफी और लेआउट सटीकता सुनिश्चित करने के लिए इस दस्तावेज़ रूपांतरण के लिए क्लाउड में एक आइसोलेटेड microVM की आवश्यकता होती है। आपकी फ़ाइल मेमोरी में संसाधित होती है और तुरंत हटा दी जाती है।"\n                : isIndonesian\n                ? "Konversi dokumen ini memerlukan microVM cloud terisolasi untuk memastikan ketepatan tata letak dan tipografi. File Anda akan diproses di memori dan segera dihapus."\n                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."`
);

// 17. Cancel button
content = content.replace(
  `: isSpanish ? "Cancelar" : "Cancel"`,
  `: isSpanish ? "Cancelar" : isHindi ? "रद्द करें" : isIndonesian ? "Batal" : "Cancel"`
);

// 18. Authorize & Convert button
content = content.replace(
  `: isSpanish ? "Autorizar y convertir" : "Authorize & Convert"`,
  `: isSpanish ? "Autorizar y convertir" : isHindi ? "स्वीकृत करें और रूपांतरित करें" : isIndonesian ? "Otorisasi & Konversi" : "Authorize & Convert"`
);

fs.writeFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', content, 'utf8');
console.log('Successfully updated OfficeConverterWorkspace.tsx');
