const fs = require('fs');

const file = 'src/components/image-tools/ImageConverterWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Conversion Options
content = content.replace(
  '{isJapanese\n                    ? "変換オプション"',
  '{isKorean\n                    ? "변환 옵션"\n                    : isJapanese\n                    ? "変換オプション"'
);

// 2. Target Format
content = content.replace(
  '{isJapanese\n                      ? "変換先フォーマット"',
  '{isKorean\n                      ? "변환 대상 포맷"\n                      : isJapanese\n                      ? "変換先フォーマット"'
);

// 3. Output Format
content = content.replace(
  '{isJapanese\n                      ? "出力フォーマット"',
  '{isKorean\n                      ? "출력 포맷"\n                      : isJapanese\n                      ? "出力フォーマット"'
);

// 4. Background Color (for alpha)
content = content.replace(
  '{isJapanese\n                      ? "背景色（透明部分の補完）"',
  '{isKorean\n                      ? "배경색 (투명 영역 대체)"\n                      : isJapanese\n                      ? "背景色（透明部分の補完）"'
);

// 5. White, Black, Custom
content = content.replace(
  'isJapanese ? "白" :',
  'isKorean ? "흰색" : isJapanese ? "白" :'
);
content = content.replace(
  'isJapanese ? "黒" :',
  'isKorean ? "검은색" : isJapanese ? "黒" :'
);
content = content.replace(
  'isJapanese ? "カスタム" :',
  'isKorean ? "사용자 정의" : isJapanese ? "カスタム" :'
);

// 6. Quality slider
content = content.replace(
  '{isJapanese ? "品質" :',
  '{isKorean ? "품질" : isJapanese ? "品質" :'
);
content = content.replace(
  '<span>{isJapanese ? "低" :',
  '<span>{isKorean ? "낮음" : isJapanese ? "低" :'
);
content = content.replace(
  '<span>{isJapanese ? "標準" :',
  '<span>{isKorean ? "표준" : isJapanese ? "標準" :'
);
content = content.replace(
  '<span>{isJapanese ? "高" :',
  '<span>{isKorean ? "높음" : isJapanese ? "高" :'
);

// 7. Converting..., Reconvert, Convert Image
content = content.replace(
  'isJapanese\n                    ? "画像を変換中..."',
  'isKorean\n                    ? "이미지 변환 중..."\n                    : isJapanese\n                    ? "画像を変換中..."'
);
content = content.replace(
  'isJapanese\n                    ? "画像を再変換"',
  'isKorean\n                    ? "이미지 다시 변환"\n                    : isJapanese\n                    ? "画像を再変換"'
);
content = content.replace(
  'isJapanese\n                  ? "画像を変換"',
  'isKorean\n                  ? "이미지 변환"\n                  : isJapanese\n                  ? "画像を変換"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ImageConverterWorkspace.tsx for Korean');
