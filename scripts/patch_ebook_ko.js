const fs = require('fs');

const file = 'src/utils/ebook/EbookWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean
content = content.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

// 2. Select eBook File
content = content.replace(
  '{isJapanese\n              ? `eBookファイルを選択 (${getAcceptExtensions().toUpperCase()})`',
  '{isKorean\n              ? `eBook 파일 선택 (${getAcceptExtensions().toUpperCase()})`\n              : isJapanese\n              ? `eBookファイルを選択 (${getAcceptExtensions().toUpperCase()})`'
);

// 3. Zero server uploads
content = content.replace(
  '{isJapanese\n              ? "サーバー送信なし · 100% ブラウザ内で安全に変換"',
  '{isKorean\n              ? "서버 업로드 없음 · 브라우저 내 100% 비공개 변환"\n              : isJapanese\n              ? "サーバー送信なし · 100% ブラウザ内で安全に変換"'
);

// 4. Change File
content = content.replace(
  '{isJapanese ? "ファイルを変更" :',
  '{isKorean ? "파일 변경" : isJapanese ? "ファイルを変更" :'
);

// 5. Rendering pages
content = content.replace(
  'isJapanese\n                  ? "eBookページをPDFにレンダリング中..."',
  'isKorean\n                  ? "eBook 페이지를 PDF로 렌더링하는 중..."\n                  : isJapanese\n                  ? "eBookページをPDFにレンダリング中..."'
);

// 6. Converted:
content = content.replace(
  'isJapanese\n                    ? `✓ 変換完了: ${outputFileName}`',
  'isKorean\n                    ? `✓ 변환 완료: ${outputFileName}`\n                    : isJapanese\n                    ? `✓ 変換完了: ${outputFileName}`'
);

// 7. Download PDF
content = content.replace(
  '{isJapanese ? "PDFをダウンロード" :',
  '{isKorean ? "PDF 다운로드" : isJapanese ? "PDFをダウンロード" :'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched EbookWorkspace.tsx for Korean');
