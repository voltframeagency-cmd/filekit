const fs = require('fs');

const file = 'src/components/ocr-tools/OcrPdfWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Performing OCR recognition
content = content.replace(
  '{isProcessing\n                  ? isSwedish',
  '{isProcessing\n                  ? isKorean\n                    ? "OCR 텍스트 인식 수행 중..."\n                    : isSwedish'
);

// 2. Recognize & Extract text button
content = content.replace(
  ': isJapanese\n                    ? "テキストを認識して抽出"',
  ': isKorean\n                    ? "텍스트 인식 및 추출"\n                    : isJapanese\n                    ? "テキストを認識して抽出"'
);

// 3. OCR Completed badge
content = content.replace(
  ': isJapanese\n                       ? `OCR完了（${result.totalPages} ページ、${result.durationMs}ms）`',
  ': isKorean\n                       ? `OCR 완료 (${result.totalPages}페이지, ${result.durationMs}ms)`\n                       : isJapanese\n                       ? `OCR完了（${result.totalPages} ページ、${result.durationMs}ms）`'
);

// 4. Copied
content = content.replace(
  ': isJapanese\n                        ? "✓ コピーしました！"',
  ': isKorean\n                        ? "✓ 복사되었습니다!"\n                        : isJapanese\n                        ? "✓ コピーしました！"'
);

// 5. Copy text
content = content.replace(
  ': isJapanese\n                      ? "テキストをコピー"',
  ': isKorean\n                      ? "텍스트 복사"\n                      : isJapanese\n                      ? "テキストをコピー"'
);

// 6. Download .TXT
content = content.replace(
  'isJapanese ? ".TXT をダウンロード" :',
  'isKorean ? ".TXT 다운로드" : isJapanese ? ".TXT をダウンロード" :'
);

// 7. Download Searchable PDF
content = content.replace(
  ': isJapanese\n                        ? "検索可能なPDFをダウンロード"',
  ': isKorean\n                        ? "검색 가능한 PDF 다운로드"\n                        : isJapanese\n                        ? "検索可能なPDFをダウンロード"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched OcrPdfWorkspace.tsx for Korean');
