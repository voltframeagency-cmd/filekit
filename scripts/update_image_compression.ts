import fs from 'fs';

let content = fs.readFileSync('src/components/image-tools/ImageCompressionWorkspace.tsx', 'utf8');

// 1. Add flags
content = content.replace(
  'const isTurkish = language === "tr";',
  'const isTurkish = language === "tr";\n  const isHindi = language === "hi";\n  const isIndonesian = language === "id";'
);

// 2. Download Original Image
content = content.replace(
  `: isFrench\n                        ? "Télécharger l'image originale"\n                        : "Download Original Image"`,
  `: isFrench\n                        ? "Télécharger l'image originale"\n                        : isHindi\n                        ? "मूल इमेज डाउनलोड करें"\n                        : isIndonesian\n                        ? "Unduh Gambar Asli"\n                        : "Download Original Image"`
);

// 3. Download Best Result
content = content.replace(
  `: isFrench\n                        ? "Télécharger le meilleur résultat"\n                        : "Download Best Result"`,
  `: isFrench\n                        ? "Télécharger le meilleur résultat"\n                        : isHindi\n                        ? "सर्वोत्तम परिणाम डाउनलोड करें"\n                        : isIndonesian\n                        ? "Unduh Hasil Terbaik"\n                        : "Download Best Result"`
);

// 4. Download Compressed Image
content = content.replace(
  `: isPortuguese\n                      ? "Descarregar imagem comprimida"\n                      : "Download Compressed Image"`,
  `: isPortuguese\n                      ? "Descarregar imagem comprimida"\n                      : isHindi\n                      ? "कंप्रेस की गई इमेज डाउनलोड करें"\n                      : isIndonesian\n                      ? "Unduh Gambar Terkompresi"\n                      : "Download Compressed Image"`
);

// 5. Adjust Settings
content = content.replace(
  `: isFrench\n                      ? "Ajuster les paramètres"\n                      : "Adjust Settings"`,
  `: isFrench\n                      ? "Ajuster les paramètres"\n                      : isHindi\n                      ? "सेटिंग्स समायोजित करें"\n                      : isIndonesian\n                      ? "Sesuaikan Pengaturan"\n                      : "Adjust Settings"`
);

// 6. Compression Settings
content = content.replace(
  `: isPortuguese\n                    ? "Definições de compressão"\n                    : "Compression Settings"`,
  `: isPortuguese\n                    ? "Definições de compressão"\n                    : isHindi\n                    ? "कंप्रेशन सेटिंग्स"\n                    : isIndonesian\n                    ? "Pengaturan Kompresi"\n                    : "Compression Settings"`
);

// 7. Compression Goal
content = content.replace(
  `: isPortuguese\n                    ? "Objetivo de compressão"\n                    : "Compression Goal"`,
  `: isPortuguese\n                    ? "Objetivo de compressão"\n                    : isHindi\n                    ? "कंप्रेशन लक्ष्य"\n                    : isIndonesian\n                    ? "Tujuan Kompresi"\n                    : "Compression Goal"`
);

// 8. Balanced mode button
content = content.replace(
  `: isPortuguese\n                      ? "Equilibrado"\n                      : "Balanced"`,
  `: isPortuguese\n                      ? "Equilibrado"\n                      : isHindi\n                      ? "संतुलित"\n                      : isIndonesian\n                      ? "Seimbang"\n                      : "Balanced"`
);

// 9. Target Size mode button
content = content.replace(
  `: isPortuguese\n                      ? "Tamanho alvo"\n                      : "Target Size"`,
  `: isPortuguese\n                      ? "Tamanho alvo"\n                      : isHindi\n                      ? "लक्षित आकार"\n                      : isIndonesian\n                      ? "Ukuran Target"\n                      : "Target Size"`
);

// 10. Manual mode button
content = content.replace(
  `: isPortuguese\n                      ? "Manual"\n                      : "Manual"`,
  `: isPortuguese\n                      ? "Manual"\n                      : isHindi\n                      ? "मैन्युअल"\n                      : isIndonesian\n                      ? "Manual"\n                      : "Manual"`
);

// 11. Quality Priority
content = content.replace(
  `: isFrench\n                      ? "Priorité de qualité"\n                      : "Quality Priority"`,
  `: isFrench\n                      ? "Priorité de qualité"\n                      : isHindi\n                      ? "गुणवत्ता प्राथमिकता"\n                      : isIndonesian\n                      ? "Prioritas Kualitas"\n                      : "Quality Priority"`
);

// 12. Better quality label & desc
content = content.replace(
  `: isFrench\n                          ? "Meilleure qualité"\n                          : "Better quality"`,
  `: isFrench\n                          ? "Meilleure qualité"\n                          : isHindi\n                          ? "बेहतर गुणवत्ता"\n                          : isIndonesian\n                          ? "Kualitas lebih baik"\n                          : "Better quality"`
);
content = content.replace(
  `: isFrench\n                          ? "Préserve davantage de détails visuels"\n                          : "Preserves more visual detail"`,
  `: isFrench\n                          ? "Préserve davantage de détails visuels"\n                          : isHindi\n                          ? "अधिक विज़ुअल विवरण सुरक्षित रखता है"\n                          : isIndonesian\n                          ? "Mempertahankan lebih banyak detail visual"\n                          : "Preserves more visual detail"`
);

// 13. Balanced label & desc
content = content.replace(
  `: isFrench\n                          ? "Équilibré"\n                          : "Balanced"`,
  `: isFrench\n                          ? "Équilibré"\n                          : isHindi\n                          ? "संतुलित"\n                          : isIndonesian\n                          ? "Seimbang"\n                          : "Balanced"`
);
content = content.replace(
  `: isFrench\n                          ? "Équilibre recommandé entre clarté et taille"\n                          : "Recommended balance of clarity & size"`,
  `: isFrench\n                          ? "Équilibre recommandé entre clarté et taille"\n                          : isHindi\n                          ? "स्पष्टता और आकार का अनुशंसित संतुलन"\n                          : isIndonesian\n                          ? "Keseimbangan yang disarankan antara kejelasan & ukuran"\n                          : "Recommended balance of clarity & size"`
);

// 14. Smaller file label & desc
content = content.replace(
  `: isFrench\n                          ? "Fichier plus petit"\n                          : "Smaller file"`,
  `: isFrench\n                          ? "Fichier plus petit"\n                          : isHindi\n                          ? "छोटी फ़ाइल"\n                          : isIndonesian\n                          ? "File lebih kecil"\n                          : "Smaller file"`
);
content = content.replace(
  `: isFrench\n                          ? "Privilégie une réduction maximale"\n                          : "Prioritizes maximum reduction"`,
  `: isFrench\n                          ? "Privilégie une réduction maximale"\n                          : isHindi\n                          ? "अधिकतम आकार में कमी को प्राथमिकता देता है"\n                          : isIndonesian\n                          ? "Memprioritaskan pengurangan ukuran maksimal"\n                          : "Prioritizes maximum reduction"`
);

// 15. Target File Size
content = content.replace(
  `: isFrench\n                      ? "Taille de fichier cible"\n                      : "Target File Size"`,
  `: isFrench\n                      ? "Taille de fichier cible"\n                      : isHindi\n                      ? "लक्षित फ़ाइल आकार"\n                      : isIndonesian\n                      ? "Ukuran File Target"\n                      : "Target File Size"`
);

// 16. Quick Targets:
content = content.replace(
  `: isFrench\n                      ? "Cibles rapides :"\n                      : "Quick Targets:"`,
  `: isFrench\n                      ? "Cibles rapides :"\n                      : isHindi\n                      ? "त्वरित लक्ष्य:"\n                      : isIndonesian\n                      ? "Target Cepat:"\n                      : "Quick Targets:"`
);

// 17. Quality
content = content.replace(
  `: isFrench\n                          ? "Qualité"\n                          : "Quality"`,
  `: isFrench\n                          ? "Qualité"\n                          : isHindi\n                          ? "गुणवत्ता"\n                          : isIndonesian\n                          ? "Kualitas"\n                          : "Quality"`
);

// 18. Low, Balanced, High
content = content.replace(
  `: isFrench ? "Basse" : "Low"`,
  `: isFrench ? "Basse" : isHindi ? "कम" : isIndonesian ? "Rendah" : "Low"`
);
content = content.replace(
  `: isFrench ? "Équilibrée" : "Balanced"`,
  `: isFrench ? "Équilibrée" : isHindi ? "संतुलित" : isIndonesian ? "Seimbang" : "Balanced"`
);
content = content.replace(
  `: isFrench ? "Haute" : "High"`,
  `: isFrench ? "Haute" : isHindi ? "उच्च" : isIndonesian ? "Tinggi" : "High"`
);

// 19. Dimensions
content = content.replace(
  `: isFrench\n                          ? "Dimensions"\n                          : "Dimensions"`,
  `: isFrench\n                          ? "Dimensions"\n                          : isHindi\n                          ? "आयाम"\n                          : isIndonesian\n                          ? "Dimensi"\n                          : "Dimensions"`
);

// 20. Keep original
content = content.replace(
  `: isFrench\n                            ? "Garder l'original"\n                            : "Keep original"`,
  `: isFrench\n                            ? "Garder l'original"\n                            : isHindi\n                            ? "मूल बनाए रखें"\n                            : isIndonesian\n                            ? "Pertahankan Asli"\n                            : "Keep original"`
);

// 21. Custom width
content = content.replace(
  `: isFrench\n                            ? "Largeur personnalisée"\n                            : "Custom width"`,
  `: isFrench\n                            ? "Largeur personnalisée"\n                            : isHindi\n                            ? "कस्टम चौड़ाई"\n                            : isIndonesian\n                            ? "Lebar Kustom"\n                            : "Custom width"`
);

// 22. Width (px):
content = content.replace(
  `: isFrench\n                            ? "Largeur (px) :"\n                            : "Width (px):"`,
  `: isFrench\n                            ? "Largeur (px) :"\n                            : isHindi\n                            ? "चौड़ाई (px):"\n                            : isIndonesian\n                            ? "Lebar (px):"\n                            : "Width (px):"`
);

// 23. Updating Preview... / Update Preview
content = content.replace(
  `: isFrench\n                    ? "Mise à jour de l'aperçu..."\n                    : "Updating Preview..."`,
  `: isFrench\n                    ? "Mise à jour de l'aperçu..."\n                    : isHindi\n                    ? "पूर्वावलोकन अपडेट किया जा रहा है..."\n                    : isIndonesian\n                    ? "Memperbarui Pratinjau..."\n                    : "Updating Preview..."`
);
content = content.replace(
  `: isFrench\n                    ? "Mettre à jour l'aperçu"\n                    : "Update Preview"`,
  `: isFrench\n                    ? "Mettre à jour l'aperçu"\n                    : isHindi\n                    ? "पूर्वावलोकन अपडेट करें"\n                    : isIndonesian\n                    ? "Perbarui Pratinjau"\n                    : "Update Preview"`
);

fs.writeFileSync('src/components/image-tools/ImageCompressionWorkspace.tsx', content, 'utf8');
console.log('Successfully updated ImageCompressionWorkspace.tsx');
