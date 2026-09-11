const fs = require('fs');

const file = 'src/components/image-tools/ImageCompressionWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

// 1. Add language prop support to props interface
content = content.replace(
  'export interface ImageCompressionWorkspaceProps {\n  initialMode?: CompressionGoalMode;\n  initialTargetValue?: string;\n  initialTargetUnit?: "kb" | "mb";\n}',
  'export interface ImageCompressionWorkspaceProps {\n  initialMode?: CompressionGoalMode;\n  initialTargetValue?: string;\n  initialTargetUnit?: "kb" | "mb";\n  language?: string;\n}'
);

// 2. Destructure language prop
content = content.replace(
  '  initialMode = "BALANCED",\n  initialTargetValue = "200",\n  initialTargetUnit = "kb"\n}: ImageCompressionWorkspaceProps) {\n  const { language } = useLanguage();',
  '  initialMode = "BALANCED",\n  initialTargetValue = "200",\n  initialTargetUnit = "kb",\n  language: propLanguage\n}: ImageCompressionWorkspaceProps) {\n  const { language: contextLang } = useLanguage();\n  const language = propLanguage || contextLang || "en";'
);

// 3. Dropzone drop text map
content = content.replace(
  "ms: 'Lepaskan imej anda di sini atau semak imbas',",
  "th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู', ms: 'Lepaskan imej anda di sini atau semak imbas',"
);

// 4. Dropzone support text map
content = content.replace(
  "ms: 'Menyokong JPG, PNG, dan WebP statik sehingga 50 MB',",
  "th: 'รองรับ JPG, PNG และ WebP แบบคงที่ สูงสุด 50 MB', ms: 'Menyokong JPG, PNG, dan WebP statik sehingga 50 MB',"
);

// 5. Dropzone notice map
content = content.replace(
  "ms: '🔒 Imej anda diproses secara tempatan dalam pelayar anda dan tidak dimuat naik.',",
  "th: '🔒 รูปภาพของคุณได้รับการประมวลผลในเบราว์เซอร์และไม่มีการอัปโหลด', ms: '🔒 Imej anda diproses secara tempatan dalam pelayar anda dan tidak dimuat naik.',"
);

if (isCrlf) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ImageCompressionWorkspace.tsx');
