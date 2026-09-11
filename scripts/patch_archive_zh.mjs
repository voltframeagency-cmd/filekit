import fs from 'fs';

let text = fs.readFileSync('src/utils/archive/ArchiveWorkspace.tsx', 'utf8');

// 1. Add isChinese
text = text.replace(
  '  const isFinnish = language === "fi";',
  '  const isFinnish = language === "fi";\n  const isChinese = language === "zh-CN" || language === "zh-TW" || language.startsWith("zh");'
);

// 2. Dropzone create label
text = text.replace(
  ': isSpanish\n                  ? "Suelta archivos para comprimirlos en ZIP"\n                  : "Drop files to zip together")',
  ': isSpanish\n                  ? "Suelta archivos para comprimirlos en ZIP"\n                  : isChinese\n                  ? "拖放文件以压缩为 ZIP"\n                  : "Drop files to zip together")'
);

// 3. Dropzone extract label
text = text.replace(
  ': isSpanish\n                  ? "Selecciona el archivo para extraer o convertir"\n                  : "Select archive file to extract")}',
  ': isSpanish\n                  ? "Selecciona el archivo para extraer o convertir"\n                  : isChinese\n                  ? "选择要解压或转换的压缩文件"\n                  : "Select archive file to extract")}'
);

// 4. Dropzone create subtext
text = text.replace(
  ': isSpanish\n                  ? "Admite todos los formatos de archivo (Selección múltiple)"\n                  : "Supports all file formats (Multi-file enabled)")',
  ': isSpanish\n                  ? "Admite todos los formatos de archivo (Selección múltiple)"\n                  : isChinese\n                  ? "支持所有文件格式（支持多选）"\n                  : "Supports all file formats (Multi-file enabled)")'
);

// 5. Dropzone extract subtext
text = text.replace(
  ': isSpanish\n                  ? "Procesamiento 100% privado en tu navegador"\n                  : "Processed locally inside your browser")}',
  ': isSpanish\n                  ? "Procesamiento 100% privado en tu navegador"\n                  : isChinese\n                  ? "在浏览器中 100% 本地私密处理"\n                  : "Processed locally inside your browser")}'
);

// 6. Selected files count
text = text.replace(
  ': isSpanish\n                  ? `${files.length} archivo${files.length > 1 ? "s" : ""} seleccionado${files.length > 1 ? "s" : ""}`\n                  : `${files.length} file${files.length > 1 ? "s" : ""} selected`}',
  ': isSpanish\n                  ? `${files.length} archivo${files.length > 1 ? "s" : ""} seleccionado${files.length > 1 ? "s" : ""}`\n                  : isChinese\n                  ? `已选择 ${files.length} 个文件`\n                  : `${files.length} file${files.length > 1 ? "s" : ""} selected`}'
);

// 7. Reset button
text = text.replace(
  ': isSpanish ? "Reiniciar" : "Reset"}',
  ': isSpanish ? "Reiniciar" : isChinese ? "重置" : "Reset"}'
);

// 8. Archive Name label
text = text.replace(
  ': isSpanish ? "Nombre del archivo:" : "Archive Name:"}',
  ': isSpanish ? "Nombre del archivo:" : isChinese ? "压缩包名称:" : "Archive Name:"}'
);

// 9. Compressing files into ZIP
text = text.replace(
  ': isSpanish\n                      ? "Comprimiendo archivos en ZIP..."\n                      : "Compressing files into ZIP...")',
  ': isSpanish\n                      ? "Comprimiendo archivos en ZIP..."\n                      : isChinese\n                      ? "正在压缩文件为 ZIP..."\n                      : "Compressing files into ZIP...")'
);

// 10. Create ZIP Archive button
text = text.replace(
  ': isSpanish\n                      ? "Crear archivo ZIP"\n                      : "Create ZIP Archive")}',
  ': isSpanish\n                      ? "Crear archivo ZIP"\n                      : isChinese\n                      ? "创建 ZIP 压缩包"\n                      : "Create ZIP Archive")}'
);

// 11. Extracted files list heading
text = text.replace(
  ': isSpanish\n                  ? `Archivos extraídos (${extractedEntries.length}):`\n                  : `Extracted Files (${extractedEntries.length}):`}',
  ': isSpanish\n                  ? `Archivos extraídos (${extractedEntries.length}):`\n                  : isChinese\n                  ? `已解压文件 (${extractedEntries.length}):`\n                  : `Extracted Files (${extractedEntries.length}):`}'
);

// 12. Download entry button
text = text.replace(
  ': isSpanish ? "Descargar" : "Download"}',
  ': isSpanish ? "Descargar" : isChinese ? "下载" : "Download"}'
);

// 13. Ready ZIP label
text = text.replace(
  ': isSpanish\n                    ? `✓ ZIP listo: ${outputFileName}`\n                    : `✓ Ready ZIP: ${outputFileName}`}',
  ': isSpanish\n                    ? `✓ ZIP listo: ${outputFileName}`\n                    : isChinese\n                    ? `✓ ZIP 已准备就绪: ${outputFileName}`\n                    : `✓ Ready ZIP: ${outputFileName}`}'
);

// 14. Size In-Browser
text = text.replace(
  ': isSpanish\n                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% En el navegador`\n                    : `Size: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser`}',
  ': isSpanish\n                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% En el navegador`\n                    : isChinese\n                    ? `大小: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% 浏览器本地处理`\n                    : `Size: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser`}'
);

// 15. Download ZIP button
text = text.replace(
  ': isSpanish ? "Descargar ZIP" : "Download ZIP"}',
  ': isSpanish ? "Descargar ZIP" : isChinese ? "下载 ZIP" : "Download ZIP"}'
);

// 16. Errors: No uncompressed files found
text = text.replace(
  ': isSpanish\n              ? "No se encontraron archivos en el archivo o está vacío."\n              : "No uncompressed files found in archive or archive is empty.")',
  ': isSpanish\n              ? "No se encontraron archivos en el archivo o está vacío."\n              : isChinese\n              ? "压缩包内未找到文件或压缩包为空。"\n              : "No uncompressed files found in archive or archive is empty.")'
);

// 17. Failed to read archive file
text = text.replace(
  ': isSpanish\n            ? "Error al leer el archivo."\n            : "Failed to read archive file.")',
  ': isSpanish\n            ? "Error al leer el archivo."\n            : isChinese\n            ? "读取压缩文件失败。"\n            : "Failed to read archive file.")'
);

// 18. Failed to convert archive to ZIP
text = text.replace(
  ': isSpanish\n            ? "Error al convertir a ZIP."\n            : "Failed to convert archive to ZIP.")',
  ': isSpanish\n            ? "Error al convertir a ZIP."\n            : isChinese\n            ? "将压缩包转换为 ZIP 失败。"\n            : "Failed to convert archive to ZIP.")'
);

// 19. Failed to create ZIP archive
text = text.replace(
  ': isSpanish\n          ? "Error al crear archivo ZIP."\n          : "Failed to create ZIP archive.")',
  ': isSpanish\n          ? "Error al crear archivo ZIP."\n          : isChinese\n          ? "创建 ZIP 压缩包失败。"\n          : "Failed to create ZIP archive.")'
);

fs.writeFileSync('src/utils/archive/ArchiveWorkspace.tsx', text, 'utf8');
console.log('ArchiveWorkspace Chinese localization completed successfully!');
