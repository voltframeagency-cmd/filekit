const fs = require('fs');

const file = 'src/components/image-transform/ImageTransformWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean flag
content = content.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

// 2. Select file
content = content.replace(
  '{isJapanese\n                ? `${mode.startsWith("svg") ? "SVGファイル" : mode === "ico-to-png" ? "ICOアイコン" : "画像"}を選択`',
  '{isKorean\n                ? `${mode.startsWith("svg") ? "SVG 파일" : mode === "ico-to-png" ? "ICO 아이콘" : "이미지"} 선택`\n                : isJapanese\n                ? `${mode.startsWith("svg") ? "SVGファイル" : mode === "ico-to-png" ? "ICOアイコン" : "画像"}を選択`'
);

// 3. Privacy text
content = content.replace(
  '{isJapanese\n                ? "ブラウザのメモリ内で100%安全にプライベート処理。"',
  '{isKorean\n                ? "브라우저 메모리 내에서 100% 안전하게 로컬 처리됩니다."\n                : isJapanese\n                ? "ブラウザのメモリ内で100%安全にプライベート処理。"'
);

// 4. File input label
content = content.replace(
  '{isJapanese ? "ファイルを選択" :',
  '{isKorean ? "파일 선택" : isJapanese ? "ファイルを選択" :'
);

// 5. Change file
content = content.replace(
  '{isJapanese ? "ファイルを変更" :',
  '{isKorean ? "파일 변경" : isJapanese ? "ファイルを変更" :'
);

// 6. Preserve transparent background
content = content.replace(
  '{isJapanese\n                        ? "透明な背景を維持"',
  '{isKorean\n                        ? "투명 배경 유지"\n                        : isJapanese\n                        ? "透明な背景を維持"'
);

// 7. Background color label
content = content.replace(
  '{isJapanese ? "背景色:" :',
  '{isKorean ? "배경색:" : isJapanese ? "背景色:" :'
);

// 8. Background fill color label
content = content.replace(
  '{isJapanese\n                      ? "背景の塗りつぶし色:"',
  '{isKorean\n                      ? "배경 채우기 색상:"\n                      : isJapanese\n                      ? "背景の塗りつぶし色:"'
);

// 9. Select embedded sub-image
content = content.replace(
  '{isJapanese\n                  ? "抽出する埋め込みサブ画像を選択:"',
  '{isKorean\n                  ? "추출할 내장 서브 이미지 선택:"\n                  : isJapanese\n                  ? "抽出する埋め込みサブ画像を選択:"'
);

// 10. Processing label
content = content.replace(
  '<span>{isJapanese ? "このデバイス上で処理中..." :',
  '<span>{isKorean ? "기기 내에서 로컬 처리 중..." : isJapanese ? "このデバイス上で処理中..." :'
);

// 11. Mode actions
content = content.replace(
  'isJapanese ? "PNGとしてエクスポート" :',
  'isKorean ? "PNG로 내보내기" : isJapanese ? "PNGとしてエクスポート" :'
);

content = content.replace(
  'isJapanese ? "JPGとしてエクスポート" :',
  'isKorean ? "JPG로 내보내기" : isJapanese ? "JPGとしてエクスポート" :'
);

content = content.replace(
  'isJapanese ? "画像をトリミング" :',
  'isKorean ? "이미지 자르기" : isJapanese ? "画像をトリミング" :'
);

content = content.replace(
  'isJapanese ? `画像を回転 (${rotationAngle}°)` :',
  'isKorean ? `이미지 회전 (${rotationAngle}°)` : isJapanese ? `画像を回転 (${rotationAngle}°)` :'
);

content = content.replace(
  'isJapanese ? `画像を反転 (${flipDirection === "horizontal" ? "水平" : "垂直"})` :',
  'isKorean ? `이미지 반전 (${flipDirection === "horizontal" ? "수평" : "수직"})` : isJapanese ? `画像を反転 (${flipDirection === "horizontal" ? "水平" : "垂直"})` :'
);

content = content.replace(
  'isJapanese ? "PNGアイコンを抽出" :',
  'isKorean ? "PNG 아이콘 추출" : isJapanese ? "PNGアイコンを抽出" :'
);

content = content.replace(
  'isJapanese ? "画像サイズを変更" :',
  'isKorean ? "이미지 크기 변경" : isJapanese ? "画像サイズを変更" :'
);

// 12. Export ready
content = content.replace(
  '{isJapanese ? "画像のエクスポート準備が完了しました" :',
  '{isKorean ? "이미지 내보내기 준비 완료" : isJapanese ? "画像のエクスポート準備が完了しました" :'
);

// 13. Processed in ms
content = content.replace(
  'isJapanese ? `ローカルで ${result.durationMs}ms で処理完了` :',
  'isKorean ? `기기 내에서 ${result.durationMs}ms 만에 처리 완료` : isJapanese ? `ローカルで ${result.durationMs}ms で処理完了` :'
);

// 14. Download image
content = content.replace(
  '{isJapanese ? "画像をダウンロード" :',
  '{isKorean ? "이미지 다운로드" : isJapanese ? "画像をダウンロード" :'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ImageTransformWorkspace.tsx for Korean');
