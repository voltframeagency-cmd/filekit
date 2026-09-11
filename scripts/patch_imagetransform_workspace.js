const fs = require('fs');
let code = fs.readFileSync('src/components/image-transform/ImageTransformWorkspace.tsx', 'utf8');

function replaceExact(str, find, rep) {
  const normStr = str.replace(/\r\n/g, '\n');
  const normFind = find.replace(/\r\n/g, '\n');
  const normRep = rep.replace(/\r\n/g, '\n');
  if (!normStr.includes(normFind)) {
    console.error('Failed to find:', normFind.slice(0, 50));
    return str;
  }
  const result = normStr.replace(normFind, normRep);
  return str.includes('\r\n') ? result.replace(/\n/g, '\r\n') : result;
}

// 1. Processing on this device...
code = replaceExact(
  code,
  `<span>{isVietnamese ? "Đang xử lý trên thiết bị này..." : isSwedish ? "Bearbetar på denna enhet..." : isDanish ? "Behandler på denne enhed..." : isFinnish ? "Käsitellään tällä laitteella..." : isCatalan ? "Processant en aquest dispositiu..." : isDutch ? "Bezig met verwerken op dit apparaat..." : "Processing on this device..."}</span>`,
  `<span>{isFilipino ? "Pinoproseso sa device na ito..." : isVietnamese ? "Đang xử lý trên thiết bị này..." : isSwedish ? "Bearbetar på denna enhet..." : isDanish ? "Behandler på denne enhed..." : isFinnish ? "Käsitellään tällä laitteella..." : isCatalan ? "Processant en aquest dispositiu..." : isDutch ? "Bezig met verwerken op dit apparaat..." : "Processing on this device..."}</span>`
);

// 2. svg-to-png
code = replaceExact(
  code,
  `isVietnamese ? "Xuất dưới dạng PNG" : isSwedish ? "Exportera som PNG" : isDanish ? "Eksporter som PNG" : isFinnish ? "Vie PNG-muodossa" : isCatalan ? "Exportar com a PNG" : isDutch ? "Exporteren als PNG" : "Export as PNG"`,
  `isFilipino ? "I-export bilang PNG" : isVietnamese ? "Xuất dưới dạng PNG" : isSwedish ? "Exportera som PNG" : isDanish ? "Eksporter som PNG" : isFinnish ? "Vie PNG-muodossa" : isCatalan ? "Exportar com a PNG" : isDutch ? "Exporteren als PNG" : "Export as PNG"`
);

// 3. svg-to-jpg
code = replaceExact(
  code,
  `isVietnamese ? "Xuất dưới dạng JPG" : isSwedish ? "Exportera som JPG" : isDanish ? "Eksporter som JPG" : isFinnish ? "Vie JPG-muodossa" : isCatalan ? "Exportar com a JPG" : isDutch ? "Exporteren als JPG" : "Export as JPG"`,
  `isFilipino ? "I-export bilang JPG" : isVietnamese ? "Xuất dưới dạng JPG" : isSwedish ? "Exportera som JPG" : isDanish ? "Eksporter som JPG" : isFinnish ? "Vie JPG-muodossa" : isCatalan ? "Exportar com a JPG" : isDutch ? "Exporteren als JPG" : "Export as JPG"`
);

// 4. crop
code = replaceExact(
  code,
  `isVietnamese ? "Cắt hình ảnh" : isSwedish ? "Beskär bild" : isDanish ? "Beskær billede" : isFinnish ? "Rajaa kuva" : isCatalan ? "Retallar imatge" : isDutch ? "Afbeelding bijsnijden" : "Crop Image"`,
  `isFilipino ? "I-crop ang Larawan" : isVietnamese ? "Cắt hình ảnh" : isSwedish ? "Beskär bild" : isDanish ? "Beskær billede" : isFinnish ? "Rajaa kuva" : isCatalan ? "Retallar imatge" : isDutch ? "Afbeelding bijsnijden" : "Crop Image"`
);

// 5. rotate
code = replaceExact(
  code,
  `isVietnamese ? \`Xoay hình ảnh (\${rotationAngle}°)\` : isSwedish ? \`Rotera bild (\${rotationAngle}°)\` : isDanish ? \`Roter billede (\${rotationAngle}°)\` : isFinnish ? \`Kierrä kuvaa (\${rotationAngle}°)\` : isCatalan ? \`Girar imatge (\${rotationAngle}°)\` : isDutch ? \`Afbeelding draaien (\${rotationAngle}°)\` : \`Rotate Image (\${rotationAngle}°)\``,
  `isFilipino ? \`Iikot ang Larawan (\${rotationAngle}°)\` : isVietnamese ? \`Xoay hình ảnh (\${rotationAngle}°)\` : isSwedish ? \`Rotera bild (\${rotationAngle}°)\` : isDanish ? \`Roter billede (\${rotationAngle}°)\` : isFinnish ? \`Kierrä kuvaa (\${rotationAngle}°)\` : isCatalan ? \`Girar imatge (\${rotationAngle}°)\` : isDutch ? \`Afbeelding draaien (\${rotationAngle}°)\` : \`Rotate Image (\${rotationAngle}°)\``
);

// 6. flip
code = replaceExact(
  code,
  `isVietnamese ? \`Lật hình ảnh (\${flipDirection === "horizontal" ? "Ngang" : "Dọc"})\` : isSwedish ? \`Spegla bild (\${flipDirection === "horizontal" ? "Horisontellt" : "Vertikalt"})\` : isDanish ? \`Spejl billede (\${flipDirection === "horizontal" ? "Horisontalt" : "Vertikalt"})\` : isFinnish ? \`Käännä kuva (\${flipDirection === "horizontal" ? "Vaakasuunnassa" : "Pystysuunnassa"})\` : isCatalan ? \`Girar imatge (\${flipDirection === "horizontal" ? "Horitzontal" : "Vertical"})\` : isDutch ? \`Afbeelding spiegelen (\${flipDirection === "horizontal" ? "Horizontaal" : "Verticaal"})\` : \`Flip Image (\${flipDirection === "horizontal" ? "Horizontal" : "Vertical"})\``,
  `isFilipino ? \`I-flip ang Larawan (\${flipDirection === "horizontal" ? "Pahalang" : "Patayo"})\` : isVietnamese ? \`Lật hình ảnh (\${flipDirection === "horizontal" ? "Ngang" : "Dọc"})\` : isSwedish ? \`Spegla bild (\${flipDirection === "horizontal" ? "Horisontellt" : "Vertikalt"})\` : isDanish ? \`Spejl billede (\${flipDirection === "horizontal" ? "Horisontalt" : "Vertikalt"})\` : isFinnish ? \`Käännä kuva (\${flipDirection === "horizontal" ? "Vaakasuunnassa" : "Pystysuunnassa"})\` : isCatalan ? \`Girar imatge (\${flipDirection === "horizontal" ? "Horitzontal" : "Vertical"})\` : isDutch ? \`Afbeelding spiegelen (\${flipDirection === "horizontal" ? "Horizontaal" : "Verticaal"})\` : \`Flip Image (\${flipDirection === "horizontal" ? "Horizontal" : "Vertical"})\``
);

// 7. ico-to-png
code = replaceExact(
  code,
  `isVietnamese ? "Trích xuất biểu tượng PNG" : isSwedish ? "Extrahera PNG-ikon" : isDanish ? "Udtræk PNG-ikon" : isFinnish ? "Pura PNG-kuvake" : isCatalan ? "Extreure icona PNG" : isDutch ? "PNG-icoon extraheren" : "Extract PNG Icon"`,
  `isFilipino ? "I-extract ang PNG Icon" : isVietnamese ? "Trích xuất biểu tượng PNG" : isSwedish ? "Extrahera PNG-ikon" : isDanish ? "Udtræk PNG-ikon" : isFinnish ? "Pura PNG-kuvake" : isCatalan ? "Extreure icona PNG" : isDutch ? "PNG-icoon extraheren" : "Extract PNG Icon"`
);

// 8. Resize Image
code = replaceExact(
  code,
  `isVietnamese ? "Đổi kích thước hình ảnh" : isSwedish ? "Ändra storlek på bild" : isDanish ? "Tilpas billedstørrelse" : isFinnish ? "Muuta kuvan kokoa" : isCatalan ? "Redimensionar imatge" : isDutch ? "Formaat van afbeelding wijzigen" : "Resize Image"`,
  `isFilipino ? "Baguhin ang Laki ng Larawan" : isVietnamese ? "Đổi kích thước hình ảnh" : isSwedish ? "Ändra storlek på bild" : isDanish ? "Tilpas billedstørrelse" : isFinnish ? "Muuta kuvan kokoa" : isCatalan ? "Redimensionar imatge" : isDutch ? "Formaat van afbeelding wijzigen" : "Resize Image"`
);

// 9. Image Export Ready
code = replaceExact(
  code,
  `{isVietnamese ? "Hình ảnh đã sẵn sàng để tải xuống" : isSwedish ? "Bilden är klar för nedladdning" : isDanish ? "Billede klar til download" : isFinnish ? "Kuva valmis ladattavaksi" : isCatalan ? "Imatge a punt per descarregar" : isDutch ? "Afbeelding gereed voor downloaden" : "Image Export Ready"}`,
  `{isFilipino ? "Handa nang i-export ang larawan" : isVietnamese ? "Hình ảnh đã sẵn sàng để tải xuống" : isSwedish ? "Bilden är klar för nedladdning" : isDanish ? "Billede klar til download" : isFinnish ? "Kuva valmis ladattavaksi" : isCatalan ? "Imatge a punt per descarregar" : isDutch ? "Afbeelding gereed voor downloaden" : "Image Export Ready"}`
);

// 10. Processed locally in Xms
code = replaceExact(
  code,
  `{result.width} × {result.height} px • {(result.outputSizeBytes / 1024).toFixed(1)} KB • {isVietnamese ? \`Được xử lý cục bộ trong \${result.durationMs}ms\` : isSwedish ? \`Bearbetad lokalt på \${result.durationMs}ms\` : isDanish ? \`Behandlet lokalt på \${result.durationMs}ms\` : isFinnish ? \`Käsitelty paikallisesti ajassa \${result.durationMs}ms\` : isCatalan ? \`Processat localment en \${result.durationMs}ms\` : isDutch ? \`Lokaal verwerkt in \${result.durationMs}ms\` : \`Processed in \${result.durationMs}ms locally\`}`,
  `{result.width} × {result.height} px • {(result.outputSizeBytes / 1024).toFixed(1)} KB • {isFilipino ? \`Lokal na pinroseso sa loob ng \${result.durationMs}ms\` : isVietnamese ? \`Được xử lý cục bộ trong \${result.durationMs}ms\` : isSwedish ? \`Bearbetad lokalt på \${result.durationMs}ms\` : isDanish ? \`Behandlet lokalt på \${result.durationMs}ms\` : isFinnish ? \`Käsitelty paikallisesti ajassa \${result.durationMs}ms\` : isCatalan ? \`Processat localment en \${result.durationMs}ms\` : isDutch ? \`Lokaal verwerkt in \${result.durationMs}ms\` : \`Processed in \${result.durationMs}ms locally\`}`
);

// 11. Download Image
code = replaceExact(
  code,
  `{isVietnamese ? "Tải xuống hình ảnh" : isSwedish ? "Ladda ner bild" : isDanish ? "Download billede" : isFinnish ? "Lataa kuva" : isCatalan ? "Descarregar imatge" : isDutch ? "Afbeelding downloaden" : "Download Image"}`,
  `{isFilipino ? "I-download ang Larawan" : isVietnamese ? "Tải xuống hình ảnh" : isSwedish ? "Ladda ner bild" : isDanish ? "Download billede" : isFinnish ? "Lataa kuva" : isCatalan ? "Descarregar imatge" : isDutch ? "Afbeelding downloaden" : "Download Image"}`
);

fs.writeFileSync('src/components/image-transform/ImageTransformWorkspace.tsx', code, 'utf8');
console.log('ImageTransformWorkspace updated successfully!');
