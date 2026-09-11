const fs = require('fs');

// 1. Patch ImageCompressionWorkspace.tsx
let icw = fs.readFileSync('src/components/image-tools/ImageCompressionWorkspace.tsx', 'utf8');

icw = icw.replace(
  `const map: Record<string, string> = { en: 'Drop your image here or browse'`,
  `const map: Record<string, string> = { en: 'Drop your image here or browse', ms: 'Lepaskan imej anda di sini atau semak imbas'`
);
icw = icw.replace(
  `const map: Record<string, string> = { en: 'Supports JPG, PNG, and static WebP up to 50 MB'`,
  `const map: Record<string, string> = { en: 'Supports JPG, PNG, and static WebP up to 50 MB', ms: 'Menyokong JPG, PNG, dan WebP statik sehingga 50 MB'`
);
icw = icw.replace(
  `const map: Record<string, string> = { en: '🔒 Your image is processed locally in your browser and is not uploaded.'`,
  `const map: Record<string, string> = { en: '🔒 Your image is processed locally in your browser and is not uploaded.', ms: '🔒 Imej anda diproses secara tempatan dalam pelayar anda dan tidak dimuat naik.'`
);
fs.writeFileSync('src/components/image-tools/ImageCompressionWorkspace.tsx', icw, 'utf8');
console.log('ImageCompressionWorkspace patched!');

// 2. Patch ExactImageTargetPage.tsx
let eitp = fs.readFileSync('src/components/image-tools/ExactImageTargetPage.tsx', 'utf8');

eitp = eitp.replace(
  `en: 'Drop your image here or browse',`,
  `en: 'Drop your image here or browse',\n                  ms: 'Lepaskan imej anda di sini atau semak imbas',`
);
eitp = eitp.replace(
  `en: '🔒 Your image is processed locally in your browser and is not uploaded.',`,
  `en: '🔒 Your image is processed locally in your browser and is not uploaded.',\n                    ms: '🔒 Imej anda diproses secara tempatan dalam pelayar anda dan tidak dimuat naik.',`
);
eitp = eitp.replace(
  `Change File\n                </button>`,
  `{language === "ms" ? "Tukar Fail" : "Change File"}\n                </button>`
);
fs.writeFileSync('src/components/image-tools/ExactImageTargetPage.tsx', eitp, 'utf8');
console.log('ExactImageTargetPage patched!');

// 3. Patch ArchiveWorkspace.tsx
let aw = fs.readFileSync('src/utils/archive/ArchiveWorkspace.tsx', 'utf8');

aw = aw.replace(
  `: isIndonesian\n                  ? "Tarik file ke sini untuk dijadikan ZIP"\n                  : "Drop files to zip together")`,
  `: isIndonesian\n                  ? "Tarik file ke sini untuk dijadikan ZIP"\n                  : isMalay\n                  ? "Lepaskan fail ke sini untuk dijadikan ZIP"\n                  : "Drop files to zip together")`
);
aw = aw.replace(
  `: isIndonesian\n                  ? "Pilih file arsip untuk diekstrak atau dikonversi"\n                  : "Select archive file to extract")`,
  `: isIndonesian\n                  ? "Pilih file arsip untuk diekstrak atau dikonversi"\n                  : isMalay\n                  ? "Pilih fail arkib untuk diekstrak atau ditukar"\n                  : "Select archive file to extract")`
);
aw = aw.replace(
  `: isIndonesian\n                  ? "Mendukung semua format file (Multi-file diaktifkan)"\n                  : "Supports all file formats (Multi-file enabled)")`,
  `: isIndonesian\n                  ? "Mendukung semua format file (Multi-file diaktifkan)"\n                  : isMalay\n                  ? "Menyokong semua format fail (Pilihan berbilang fail diaktifkan)"\n                  : "Supports all file formats (Multi-file enabled)")`
);
aw = aw.replace(
  `: isItalian\n                  ? "Elaborazione 100% locale nel tuo browser"`,
  `: isMalay\n                  ? "100% pemprosesan tempatan dalam pelayar anda"\n                  : isItalian\n                  ? "Elaborazione 100% locale nel tuo browser"`
);
fs.writeFileSync('src/utils/archive/ArchiveWorkspace.tsx', aw, 'utf8');
console.log('ArchiveWorkspace patched!');
