const fs = require('fs');

let content = fs.readFileSync('src/components/ocr-tools/OcrPdfWorkspace.tsx', 'utf8');
const isCrlf = content.includes('\r\n');
const lines = content.split(/\r?\n/);

const newLines = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes(': "Select Scanned Document or Image"}')) {
    newLines.push('                : isMalay');
    newLines.push('                ? "Pilih Dokumen atau Imej Diimbas"');
    newLines.push(line);
  } else if (line.includes(': "100% private in-browser OCR. Files never leave your browser."}')) {
    newLines.push('                : isMalay');
    newLines.push('                ? "100% OCR peribadi dalam pelayar. Fail tidak pernah meninggalkan peranti anda."');
    newLines.push(line);
  } else if (line.includes(': "Choose PDF or Image"}')) {
    newLines.push('              : isMalay');
    newLines.push('              ? "Pilih PDF atau Imej"');
    newLines.push(line);
  } else if (line.includes(': "Performing OCR Recognition..."')) {
    newLines.push('                    : isMalay');
    newLines.push('                    ? "Melaksanakan Pengecaman OCR..."');
    newLines.push(line);
  } else if (line.includes(': "Recognize & Extract Text"}')) {
    newLines.push('                  : isMalay');
    newLines.push('                  ? "Camat & Ekstrak Teks"');
    newLines.push(line);
  } else if (line.includes(': "Reading file data into memory..."')) {
    newLines.push('        : isMalay');
    newLines.push('        ? "Membaca data fail ke dalam memori..."');
    newLines.push(line);
  } else if (line.includes(': "Failed to recognize text in document.")')) {
    newLines.push('            : isMalay');
    newLines.push('            ? "Gagal mengecam teks dalam dokumen."');
    newLines.push(line);
  } else if (line.includes(': "Copy Text"}')) {
    newLines.push('                      : isMalay');
    newLines.push('                      ? "Salin Teks"');
    newLines.push(line);
  } else if (line.includes(': "✓ Copied!"')) {
    newLines.push('                        : isMalay');
    newLines.push('                        ? "✓ Disalin!"');
    newLines.push(line);
  } else if (line.includes(': "Download Searchable PDF"}')) {
    newLines.push('                        : isMalay');
    newLines.push('                        ? "Muat Turun PDF Boleh Dicari"');
    newLines.push(line);
  } else if (line.includes('OCR Completed') && line.includes('{result.totalPages}')) {
    newLines.push('                      : isMalay');
    newLines.push('                      ? `OCR Selesai (${result.totalPages} halaman dalam ${result.durationMs}ms)`');
    newLines.push(line);
  } else {
    newLines.push(line);
  }
}

const delim = isCrlf ? '\r\n' : '\n';
fs.writeFileSync('src/components/ocr-tools/OcrPdfWorkspace.tsx', newLines.join(delim), 'utf8');
console.log('Successfully updated OcrPdfWorkspace.tsx with clean line preservation!');
