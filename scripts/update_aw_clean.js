const fs = require('fs');

let content = fs.readFileSync('src/utils/archive/ArchiveWorkspace.tsx', 'utf8');
const isCrlf = content.includes('\r\n');
const lines = content.split(/\r?\n/);

const newLines = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes(': "Drop files to zip together")')) {
    newLines.push('                  : isMalay');
    newLines.push('                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"');
    newLines.push(line);
  } else if (line.includes(': "Select archive file to extract")')) {
    newLines.push('                  : isMalay');
    newLines.push('                  ? "Pilih fail arkib untuk diekstrak atau ditukar"');
    newLines.push(line);
  } else if (line.includes(': "Supports all file formats (Multi-file enabled)")')) {
    newLines.push('                  : isMalay');
    newLines.push('                  ? "Menyokong semua format fail (Pilihan berbilang fail diaktifkan)"');
    newLines.push(line);
  } else if (line.includes(': "100% In-Browser · Fast, Private & Zero Server Uploads"')) {
    newLines.push(line);
  } else {
    newLines.push(line);
  }
}

const delim = isCrlf ? '\r\n' : '\n';
fs.writeFileSync('src/utils/archive/ArchiveWorkspace.tsx', newLines.join(delim), 'utf8');
console.log('ArchiveWorkspace lines updated cleanly!');
