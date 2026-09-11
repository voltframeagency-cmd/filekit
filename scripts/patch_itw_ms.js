const fs = require('fs');

let itw = fs.readFileSync('src/components/image-transform/ImageTransformWorkspace.tsx', 'utf8');

// Title
itw = itw.replace(
  `: isIndonesian\n                ? \`Pilih \${mode.startsWith("svg") ? "File SVG" : mode === "ico-to-png" ? "Favicon ICO" : "Gambar"}\`\n                : \`Select \${mode.startsWith("svg") ? "SVG File" : mode === "ico-to-png" ? "ICO Favicon" : "Image"}\`}`,
  `: isIndonesian\n                ? \`Pilih \${mode.startsWith("svg") ? "File SVG" : mode === "ico-to-png" ? "Favicon ICO" : "Gambar"}\`\n                : isMalay\n                ? \`Pilih \${mode.startsWith("svg") ? "Fail SVG" : mode === "ico-to-png" ? "Favikon ICO" : "Imej"}\`\n                : \`Select \${mode.startsWith("svg") ? "SVG File" : mode === "ico-to-png" ? "ICO Favicon" : "Image"}\`}`
);

// Subtitle
itw = itw.replace(
  `: isIndonesian\n                ? "Pemrosesan memori 100% privat di peramban Anda."\n                : "100% private in-browser memory processing."}`,
  `: isIndonesian\n                ? "Pemrosesan memori 100% privat di peramban Anda."\n                : isMalay\n                ? "100% pemprosesan memori peribadi dalam pelayar anda."\n                : "100% private in-browser memory processing."}`
);

// Button
itw = itw.replace(
  `: isIndonesian\n                ? "Pilih File"\n                : "Choose File"}`,
  `: isIndonesian\n                ? "Pilih File"\n                : isMalay\n                ? "Pilih Fail"\n                : "Choose File"}`
);

// Change file button
itw = itw.replace(
  `: isIndonesian\n                ? "Ubah File"\n                : "Change File"}`,
  `: isIndonesian\n                ? "Ubah File"\n                : isMalay\n                ? "Tukar Fail"\n                : "Change File"}`
);

// Resolution multiplier
itw = itw.replace(
  `:                     isLatvian ? "Izšķirtspējas reizinātājs (DPI):" : isLithuanian ? "Rezoliucijos daugiklis (DPI):" : "Resolution Multiplier (DPI):"}`,
  `: isMalay ? "Pengganda Resolusi (DPI):" : isLatvian ? "Izšķirtspējas reizinātājs (DPI):" : isLithuanian ? "Rezoliucijos daugiklis (DPI):" : "Resolution Multiplier (DPI):"}`
);

// Processing on this device
itw = itw.replace(
  `: isLatvian ? "Apstrādā šajā ierīcē..." : isLithuanian ? "Apdorojama šiame įrenginyje..." : "Processing on this device..."}`,
  `: isMalay ? "Memproses pada peranti ini..." : isLatvian ? "Apstrādā šajā ierīcē..." : isLithuanian ? "Apdorojama šiame įrenginyje..." : "Processing on this device..."}`
);

// Export as PNG
itw = itw.replace(
  `: isLatvian ? "Eksportēt kā PNG" : isLithuanian ? "Eksportuoti kaip PNG" : "Export as PNG"`,
  `: isMalay ? "Eksport sebagai PNG" : isLatvian ? "Eksportēt kā PNG" : isLithuanian ? "Eksportuoti kaip PNG" : "Export as PNG"`
);

// Export as JPG
itw = itw.replace(
  `: isLatvian ? "Eksportēt kā JPG" : isLithuanian ? "Eksportuoti kaip JPG" : "Export as JPG"`,
  `: isMalay ? "Eksport sebagai JPG" : isLatvian ? "Eksportēt kā JPG" : isLithuanian ? "Eksportuoti kaip JPG" : "Export as JPG"`
);

// Crop Image
itw = itw.replace(
  `: isLatvian ? "Apgriezt attēlu" : isLithuanian ? "Apkarpyti vaizdą" : "Crop Image"`,
  `: isMalay ? "Pangkas Imej" : isLatvian ? "Apgriezt attēlu" : isLithuanian ? "Apkarpyti vaizdą" : "Crop Image"`
);

// Rotate Image
itw = itw.replace(
  `: isLatvian ? \`Pagriezt attēlu (\${rotationAngle}°)\` : isLithuanian ? \`Pasukti vaizdą (\${rotationAngle}°)\` : \`Rotate Image (\${rotationAngle}°)\``,
  `: isMalay ? \`Putar Imej (\${rotationAngle}°)\` : isLatvian ? \`Pagriezt attēlu (\${rotationAngle}°)\` : isLithuanian ? \`Pasukti vaizdą (\${rotationAngle}°)\` : \`Rotate Image (\${rotationAngle}°)\``
);

// Flip Image
itw = itw.replace(
  `: isLatvian ? \`Apmest attēlu (\${flipDirection === "horizontal" ? "Horizontāli" : "Vertikāli"})\` : isLithuanian ? \`Apversti vaizdą (\${flipDirection === "horizontal" ? "Horizontaliai" : "Vertikaliai"})\` : \`Flip Image (\${flipDirection === "horizontal" ? "Horizontal" : "Vertical"})\``,
  `: isMalay ? \`Balikkan Imej (\${flipDirection === "horizontal" ? "Mendatar" : "Menegak"})\` : isLatvian ? \`Apmest attēlu (\${flipDirection === "horizontal" ? "Horizontāli" : "Vertikāli"})\` : isLithuanian ? \`Apversti vaizdą (\${flipDirection === "horizontal" ? "Horizontaliai" : "Vertikaliai"})\` : \`Flip Image (\${flipDirection === "horizontal" ? "Horizontal" : "Vertical"})\``
);

// Extract PNG Icon
itw = itw.replace(
  `: isLatvian ? "Izvilkt PNG ikonu" : isLithuanian ? "Išskleisti PNG piktogramą" : "Extract PNG Icon"`,
  `: isMalay ? "Ekstrak Ikon PNG" : isLatvian ? "Izvilkt PNG ikonu" : isLithuanian ? "Išskleisti PNG piktogramą" : "Extract PNG Icon"`
);

// Resize Image
itw = itw.replace(
  `: isLatvian ? "Mainīt attēla izmēru" : isLithuanian ? "Keisti vaizdo dydį" : "Resize Image"`,
  `: isMalay ? "Ubah Saiz Imej" : isLatvian ? "Mainīt attēla izmēru" : isLithuanian ? "Keisti vaizdo dydį" : "Resize Image"`
);

// Download Image
itw = itw.replace(
  `: isLatvian ? "Lejupielādēt attēlu" : isLithuanian ? "Atsisiųsti vaizdą" : "Download Image"`,
  `: isMalay ? "Muat Turun Imej" : isLatvian ? "Lejupielādēt attēlu" : isLithuanian ? "Atsisiųsti vaizdą" : "Download Image"`
);

// Image Export Ready
itw = itw.replace(
  `: isLatvian ? "Attēla eksports gatavs" : isLithuanian ? "Vaizdo eksportas paruoštas" : "Image Export Ready"`,
  `: isMalay ? "Eksport Imej Sedia" : isLatvian ? "Attēla eksports gatavs" : isLithuanian ? "Vaizdo eksportas paruoštas" : "Image Export Ready"`
);

fs.writeFileSync('src/components/image-transform/ImageTransformWorkspace.tsx', itw, 'utf8');
console.log('ImageTransformWorkspace patched!');
