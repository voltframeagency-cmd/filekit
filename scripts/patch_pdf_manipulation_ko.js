const fs = require('fs');

const file = 'src/components/pdf-manipulation/PdfManipulationWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean
content = content.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

// 2. Upload Box title
content = content.replace(
  '{isJapanese ? `${toolTitle} を開始するにはPDFファイルを選択` :',
  '{isKorean ? `${toolTitle}을(를) 시작할 PDF 파일 선택` : isJapanese ? `${toolTitle} を開始するにはPDFファイルを選択` :'
);

// 3. Upload Box subtitle (privacy)
content = content.replace(
  '{isJapanese ? "お使いのデバイス上のブラウザ内で100%安全に処理されます。ファイルが外部に送信されることはありません。" :',
  '{isKorean ? "기기의 브라우저 내에서 100% 안전하게 처리됩니다. 파일이 외부 서버로 전송되지 않습니다." : isJapanese ? "お使いのデバイス上のブラウザ内で100%安全に処理されます。ファイルが外部に送信されることはありません。" :'
);

// 4. Choose PDF Document button
content = content.replace(
  '{isJapanese ? "PDFファイルを選択" :',
  '{isKorean ? "PDF 파일 선택" : isJapanese ? "PDFファイルを選択" :'
);

// 5. Local safe tag
content = content.replace(
  '{isJapanese ? "ローカル保護" :',
  '{isKorean ? "안전한 로컬 처리" : isJapanese ? "ローカル保護" :'
);

// 6. Change PDF button
content = content.replace(
  '{isJapanese ? "PDFを変更" :',
  '{isKorean ? "PDF 변경" : isJapanese ? "PDFを変更" :'
);

// 7. Blank page options:
// "空白ページの挿入位置:"
content = content.replace(
  '{isJapanese ? "空白ページの挿入位置:" :',
  '{isKorean ? "빈 페이지 삽입 위치:" : isJapanese ? "空白ページの挿入位置:" :'
);

// Blank positions: end, start, after-each, custom
content = content.replace(
  '{ id: "end", label: isJapanese ? "末尾" :',
  '{ id: "end", label: isKorean ? "끝" : isJapanese ? "末尾" :'
);
content = content.replace(
  '{ id: "start", label: isJapanese ? "先頭" :',
  '{ id: "start", label: isKorean ? "시작" : isJapanese ? "先頭" :'
);
content = content.replace(
  '{ id: "after-each", label: isJapanese ? "各ページの直後" :',
  '{ id: "after-each", label: isKorean ? "모든 페이지 뒤" : isJapanese ? "各ページの直後" :'
);
content = content.replace(
  '{ id: "custom", label: isJapanese ? "指定ページ" :',
  '{ id: "custom", label: isKorean ? "지정 페이지 뒤" : isJapanese ? "指定ページ" :'
);

// Custom page offset text
content = content.replace(
  '{isJapanese ? "指定ページ番号の後に空白ページを挿入:" :',
  '{isKorean ? "지정된 페이지 번호 뒤에 빈 페이지 삽입:" : isJapanese ? "指定ページ番号の後に空白ページを挿入:" :'
);

// 8. Duplicate options:
// "複製モード:"
content = content.replace(
  '{isJapanese ? "複製モード:" :',
  '{isKorean ? "페이지 복제 모드:" : isJapanese ? "複製モード:" :'
);
content = content.replace(
  '{ id: "all-consecutive", label: isJapanese ? "各ページを連続して複製 (1, 1, 2, 2...)" :',
  '{ id: "all-consecutive", label: isKorean ? "각 페이지 연속 복제 (1, 1, 2, 2...)" : isJapanese ? "各ページを連続して複製 (1, 1, 2, 2...)" :'
);
content = content.replace(
  '{ id: "all-appended", label: isJapanese ? "全体のコピーを末尾に追加" :',
  '{ id: "all-appended", label: isKorean ? "전체 사본을 끝에 추가" : isJapanese ? "全体のコピーを末尾に追加" :'
);
content = content.replace(
  '{ id: "selected", label: isJapanese ? "選択したページのみ複製" :',
  '{ id: "selected", label: isKorean ? "선택한 페이지만 복제" : isJapanese ? "選択したページのみ複製" :'
);

// Page numbers to duplicate input label
content = content.replace(
  '{isJapanese ? "複製するページ番号（カンマ区切り、例: 1, 3, 5）:" :',
  '{isKorean ? "복제할 페이지 번호 (쉼표로 구분, 예: 1, 3, 5):" : isJapanese ? "複製するページ番号（カンマ区切り、例: 1, 3, 5）:" :'
);

// 9. Processing on this device...
content = content.replace(
  '<span>{isJapanese ? "このデバイス上で処理中..." :',
  '<span>{isKorean ? "기기에서 처리 중..." : isJapanese ? "このデバイス上で処理中..." :'
);

// 10. Action buttons:
// reverse:
content = content.replace(
  ': mode === "reverse" ? (\n                isJapanese ? "PDFのページ順を反転" :',
  ': mode === "reverse" ? (\n                isKorean ? "PDF 페이지 순서 반전" : isJapanese ? "PDFのページ順を反転" :'
);
// add-blank:
content = content.replace(
  ': mode === "add-blank" ? (\n                isJapanese ? "空白ページを挿入" :',
  ': mode === "add-blank" ? (\n                isKorean ? "빈 페이지 삽입" : isJapanese ? "空白ページを挿入" :'
);
// duplicate:
content = content.replace(
  ': mode === "duplicate" ? (\n                isJapanese ? "PDFページを複製" :',
  ': mode === "duplicate" ? (\n                isKorean ? "PDF 페이지 복제" : isJapanese ? "PDFページを複製" :'
);
// pdf-to-text:
content = content.replace(
  ': mode === "pdf-to-text" ? (\n                isJapanese ? "テキストを抽出" :',
  ': mode === "pdf-to-text" ? (\n                isKorean ? "텍스트 추출" : isJapanese ? "テキストを抽出" :'
);
// extract-images:
content = content.replace(
  ': mode === "extract-images" ? (\n                isJapanese ? "画像を抽出" :',
  ': mode === "extract-images" ? (\n                isKorean ? "이미지 추출" : isJapanese ? "画像を抽出" :'
);
// flatten:
content = content.replace(
  ': (\n                isJapanese ? "PDFフォームをフラット化" :',
  ': (\n                isKorean ? "PDF 양식 병합 (플래트닝)" : isJapanese ? "PDFフォームをフラット化" :'
);

// 11. PDF to Text viewer:
content = content.replace(
  '{isJapanese ? "抽出されたテキスト:" :',
  '{isKorean ? "추출된 텍스트:" : isJapanese ? "抽出されたテキスト:" :'
);
content = content.replace(
  '{isCopied ? (isJapanese ? "✓ コピーしました！" :',
  '{isCopied ? (isKorean ? "✓ 복사되었습니다!" : isJapanese ? "✓ コピーしました！" :'
);
content = content.replace(
  ': isJapanese ? "📋 すべてのテキストをコピー" :',
  ': isKorean ? "📋 전체 텍스트 복사" : isJapanese ? "📋 すべてのテキストをコピー" :'
);

// 12. Extracted Images viewer:
content = content.replace(
  '{isJapanese ? `${extractedImages.length} 枚の画像を正常に抽出しました` :',
  '{isKorean ? `${extractedImages.length}개의 이미지가 성공적으로 추출되었습니다` : isJapanese ? `${extractedImages.length} 枚の画像を正常に抽出しました` :'
);
content = content.replace(
  '<span>{isJapanese ? `ページ ${img.pageIndex}` :',
  '<span>{isKorean ? `페이지 ${img.pageIndex}` : isJapanese ? `ページ ${img.pageIndex}` :'
);
content = content.replace(
  '{isJapanese ? "PNGをダウンロード" :',
  '{isKorean ? "PNG 다운로드" : isJapanese ? "PNGをダウンロード" :'
);

// 13. Download Result Card:
content = content.replace(
  '{isJapanese ? "処理が完了しました" :',
  '{isKorean ? "처리가 완료되었습니다" : isJapanese ? "処理が完了しました" :'
);
content = content.replace(
  '{isJapanese ? "100% ローカルで処理済み" :',
  '{isKorean ? "100% 로컬 처리 완료" : isJapanese ? "100% ローカルで処理済み" :'
);
content = content.replace(
  '{isJapanese ? "ファイルをダウンロード" :',
  '{isKorean ? "파일 다운로드" : isJapanese ? "ファイルをダウンロード" :'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched PdfManipulationWorkspace.tsx for Korean');
