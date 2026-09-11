const fs = require('fs');

let aw = fs.readFileSync('src/utils/archive/ArchiveWorkspace.tsx', 'utf8');

// loading ?
aw = aw.replace(
  `: isIndonesian\n                      ? "Mengompresi file ke ZIP..."\n                      : "Compressing files into ZIP...")`,
  `: isIndonesian\n                      ? "Mengompresi file ke ZIP..."\n                      : isMalay\n                      ? "Memampatkan fail ke dalam ZIP..."\n                      : "Compressing files into ZIP...")`
);

// button text
aw = aw.replace(
  `: isIndonesian\n                      ? "Buat Arsip ZIP"\n                      : "Create ZIP Archive")}`,
  `: isIndonesian\n                      ? "Buat Arsip ZIP"\n                      : isMalay\n                      ? "Cipta Arkib ZIP"\n                      : "Create ZIP Archive")}`
);

// extracted files count
aw = aw.replace(
  `: isIndonesian\n                  ? \`File yang diekstrak (\${extractedEntries.length}):\`\n                  : \`Extracted Files (\${extractedEntries.length}):\`}`,
  `: isIndonesian\n                  ? \`File yang diekstrak (\${extractedEntries.length}):\`\n                  : isMalay\n                  ? \`Fail yang diekstrak (\${extractedEntries.length}):\`\n                  : \`Extracted Files (\${extractedEntries.length}):\`}`
);

// selected count
aw = aw.replace(
  `: isIndonesian\n                  ? \`\${files.length} file dipilih\`\n                  : \`\${files.length} file\${files.length > 1 ? "s" : ""} selected\`}`,
  `: isIndonesian\n                  ? \`\${files.length} file dipilih\`\n                  : isMalay\n                  ? \`\${files.length} fail dipilih\`\n                  : \`\${files.length} file\${files.length > 1 ? "s" : ""} selected\`}`
);

// ready zip
aw = aw.replace(
  `: isIndonesian\n                    ? \`✓ ZIP siap: \${outputFileName}\`\n                    : \`✓ Ready ZIP: \${outputFileName}\`}`,
  `: isIndonesian\n                    ? \`✓ ZIP siap: \${outputFileName}\`\n                    : isMalay\n                    ? \`✓ ZIP sedia: \${outputFileName}\`\n                    : \`✓ Ready ZIP: \${outputFileName}\`}`
);

// size
aw = aw.replace(
  `: isIndonesian\n                    ? \`Ukuran: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser\`\n                    : \`Size: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser\`}`,
  `: isIndonesian\n                    ? \`Ukuran: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Di Browser\`\n                    : isMalay\n                    ? \`Saiz: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Dalam Pelayar\`\n                    : \`Size: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser\`}`
);

fs.writeFileSync('src/utils/archive/ArchiveWorkspace.tsx', aw, 'utf8');
console.log('ArchiveWorkspace fully localized for Malay!');
