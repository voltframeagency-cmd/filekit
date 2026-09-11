import fs from 'fs';

let text = fs.readFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', 'utf8');

// Add isChinese
text = text.replace(
  '  const isFinnish = language === "fi";',
  '  const isFinnish = language === "fi";\n  const isChinese = language === "zh-CN" || language === "zh-TW" || language.startsWith("zh");'
);

// 1. Connecting to isolated microVM
text = text.replace(
  ': isSpanish\n        ? "Conectando a microVM aislada..."\n        : "Connecting to isolated microVM..."',
  ': isSpanish\n        ? "Conectando a microVM aislada..."\n        : isChinese\n        ? "正在连接隔离的微虚拟机..."\n        : "Connecting to isolated microVM..."'
);

// 2. Rendering Office document pages
text = text.replace(
  ': isSpanish\n          ? "Renderizando páginas del documento..."\n          : "Rendering Office document pages..."',
  ': isSpanish\n          ? "Renderizando páginas del documento..."\n          : isChinese\n          ? "正在渲染文档页面..."\n          : "Rendering Office document pages..."'
);

// 3. Server conversion failed
text = text.replace(
  ': isSpanish\n              ? `Error en la conversión del servidor (${response.status})`\n              : `Server conversion failed (${response.status})`)',
  ': isSpanish\n              ? `Error en la conversión del servidor (${response.status})`\n              : isChinese\n              ? `服务器转换失败 (${response.status})`\n              : `Server conversion failed (${response.status})`)'
);

// 4. Verifying PDF output stream
text = text.replace(
  ': isSpanish\n          ? "Verificando archivo PDF resultante..."\n          : "Verifying PDF output stream..."',
  ': isSpanish\n          ? "Verificando archivo PDF resultante..."\n          : isChinese\n          ? "正在校验生成的 PDF 文件..."\n          : "Verifying PDF output stream..."'
);

// 5. Failed to convert document
text = text.replace(
  ': isSpanish\n              ? "Error al convertir el documento."\n              : "Failed to convert document.")',
  ': isSpanish\n              ? "Error al convertir el documento."\n              : isChinese\n              ? "文档转换失败。"\n              : "Failed to convert document.")'
);

// 6. Unexpected error
text = text.replace(
  ': isSpanish\n            ? "Ocurrió un error inesperado durante la conversión."\n            : "An unexpected error occurred during conversion.")',
  ': isSpanish\n            ? "Ocurrió un error inesperado durante la conversión."\n            : isChinese\n            ? "转换过程中发生意外错误。"\n            : "An unexpected error occurred during conversion.")'
);

// 7. Select document to convert heading
text = text.replace(
  ': isSpanish\n                ? "Selecciona el documento para convertir"\n                : `Select ${documentTypeLabel}`}',
  ': isSpanish\n                ? "Selecciona el documento para convertir"\n                : isChinese\n                ? `选择要转换的${documentTypeLabel}`\n                : `Select ${documentTypeLabel}`}'
);

// 8. High-fidelity LibreOffice paragraph
text = text.replace(
  ': isSpanish\n                ? "Conversión segura de alta fidelidad con microVM aislada y 0% de retención de datos."\n                : "High-fidelity LibreOffice microVM conversion with 0% data retention."}',
  ': isSpanish\n                ? "Conversión segura de alta fidelidad con microVM aislada y 0% de retención de datos."\n                : isChinese\n                ? "基于隔离微虚拟机的高保真度转换，0% 数据留存。"\n                : "High-fidelity LibreOffice microVM conversion with 0% data retention."}'
);

// 9. Choose file button
text = text.replace(
  ': isSpanish ? "Elegir archivo" : `Choose ${documentTypeLabel} File`}',
  ': isSpanish ? "Elegir archivo" : isChinese ? `选择 ${documentTypeLabel} 文件` : `Choose ${documentTypeLabel} File`}'
);

// 10. Change file button
text = text.replace(
  ': isSpanish ? "Cambiar archivo" : "Change File"}',
  ': isSpanish ? "Cambiar archivo" : isChinese ? "更换文件" : "Change File"}'
);

// 11. Ephemeral sandbox title
text = text.replace(
  ': isSpanish\n                  ? "Entorno aislado en microVM efímera"\n                  : "Ephemeral MicroVM Sandbox"}',
  ': isSpanish\n                  ? "Entorno aislado en microVM efímera"\n                  : isChinese\n                  ? "临时隔离微虚拟机沙盒"\n                  : "Ephemeral MicroVM Sandbox"}'
);

// 12. Sandbox description
text = text.replace(
  ': isSpanish\n                  ? "El renderizado del documento se ejecuta en un contenedor aislado. Los archivos están cifrados en tránsito y se eliminan automáticamente de la memoria inmediatamente tras la conversión."\n                  : "Office document rendering runs in an isolated container microVM. Files are encrypted in transit and purged automatically from cloud memory immediately after conversion."}',
  ': isSpanish\n                  ? "El renderizado del documento se ejecuta en un contenedor aislado. Los archivos están cifrados en tránsito y se eliminan automáticamente de la memoria inmediatamente tras la conversión."\n                  : isChinese\n                  ? "文档渲染与转换在独立的微虚拟机容器中执行。文件传输全流程加密，并在转换完成后立即从内存中彻底清除。"\n                  : "Office document rendering runs in an isolated container microVM. Files are encrypted in transit and purged automatically from cloud memory immediately after conversion."}'
);

// 13. Convert to PDF button
text = text.replace(
  ': isSpanish ? (\n                "Convertir a PDF"\n              ) : (\n                "Convert to PDF"\n              )}',
  ': isSpanish ? (\n                "Convertir a PDF"\n              ) : isChinese ? (\n                "转换为 PDF"\n              ) : (\n                "Convert to PDF"\n              )}'
);

// 14. Converted successfully
text = text.replace(
  ': isSpanish\n                      ? "Convertido a PDF exitosamente"\n                      : "Converted to PDF Successfully"}',
  ': isSpanish\n                      ? "Convertido a PDF exitosamente"\n                      : isChinese\n                      ? "已成功转换为 PDF"\n                      : "Converted to PDF Successfully"}'
);

// 15. Rendered stats
text = text.replace(
  ': isSpanish\n                      ? `Procesado en ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contenedor purgado`\n                      : `Rendered in ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Ephemeral container purged`}',
  ': isSpanish\n                      ? `Procesado en ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contenedor purgado`\n                      : isChinese\n                      ? `耗时 ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • 临时容器已清除`\n                      : `Rendered in ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Ephemeral container purged`}'
);

// 16. Download PDF
text = text.replace(
  ': isSpanish ? "Descargar PDF" : "Download PDF"}',
  ': isSpanish ? "Descargar PDF" : isChinese ? "下载 PDF" : "Download PDF"}'
);

// 17. Modal title
text = text.replace(
  ': isSpanish\n                  ? "Aviso de conversión segura en servidor"\n                  : "Secure Server Conversion Notice"}',
  ': isSpanish\n                  ? "Aviso de conversión segura en servidor"\n                  : isChinese\n                  ? "安全服务器转换说明"\n                  : "Secure Server Conversion Notice"}'
);

// 18. Modal body
text = text.replace(
  ': isSpanish\n                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."\n                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."}',
  ': isSpanish\n                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."\n                : isChinese\n                ? "此文档转换需要使用隔离的云端微虚拟机以确保字体排版和版面完全保真。您的文件将在内存中即时处理，完成后立即清除。"\n                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."}'
);

// 19. Cancel & Authorize buttons
text = text.replace(
  ': isSpanish ? "Cancelar" : "Cancel"}',
  ': isSpanish ? "Cancelar" : isChinese ? "取消" : "Cancel"}'
);
text = text.replace(
  ': isSpanish ? "Autorizar y convertir" : "Authorize & Convert"}',
  ': isSpanish ? "Autorizar y convertir" : isChinese ? "授权并转换" : "Authorize & Convert"}'
);

fs.writeFileSync('src/components/office-tools/OfficeConverterWorkspace.tsx', text, 'utf8');
console.log('Updated OfficeConverterWorkspace with Chinese successfully!');
