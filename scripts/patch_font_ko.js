const fs = require('fs');

const file = 'src/utils/font/FontWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean
content = content.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

// 2. Korean Pangram for previewText
content = content.replace(
  '    isJapanese\n      ? "いろはにほへと ちりぬるを わかよたれそ つねならむ 1234567890"',
  '    isKorean\n      ? "다람쥐 헌 쳇바퀴에 타고파 키스의 고유조건 1234567890"\n      : isJapanese\n      ? "いろはにほへと ちりぬるを わかよたれそ つねならむ 1234567890"'
);

// 3. Dropzone text
content = content.replace(
  '{isJapanese\n              ? `フォントファイルを選択 (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`',
  '{isKorean\n              ? `폰트 파일 선택 (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`\n              : isJapanese\n              ? `フォントファイルを選択 (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`'
);

// 4. Change Font
content = content.replace(
  '{isJapanese ? "フォントを変更" :',
  '{isKorean ? "폰트 변경" : isJapanese ? "フォントを変更" :'
);

// 5. Converted font text
content = content.replace(
  'isJapanese\n                    ? `✓ 変換完了: ${outputFileName}`',
  'isKorean\n                    ? `✓ 폰트 변환 완료: ${outputFileName}`\n                    : isJapanese\n                    ? `✓ 変換完了: ${outputFileName}`'
);

// 6. Download Font button
content = content.replace(
  '{isJapanese ? "フォントをダウンロード" :',
  '{isKorean ? "폰트 다운로드" : isJapanese ? "フォントを変更" :'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched FontWorkspace.tsx for Korean');
