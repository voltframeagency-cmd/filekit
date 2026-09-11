const fs = require('fs');

const file = 'src/components/layout/ActionChooser.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean flag
content = content.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

// 2. OCR PDF
content = content.replace(
  '{ id: "ocr-pdf", label: isJapanese ? "OCR PDF（テキスト検索可能化）" :',
  '{ id: "ocr-pdf", label: isKorean ? "OCR PDF (검색 가능한 텍스트)" : isJapanese ? "OCR PDF（テキスト検索可能化）" :'
);
content = content.replace(
  'desc: isJapanese ? "スキャンしたPDFから文字を認識・抽出" :',
  'desc: isKorean ? "스캔한 PDF에서 텍스트 인식 및 추출" : isJapanese ? "スキャンしたPDFから文字を認識・抽出" :'
);

// 3. Strip EXIF
content = content.replace(
  '{ id: "strip-exif", label: isJapanese ? "メタデータ削除（EXIF/GPS）" :',
  '{ id: "strip-exif", label: isKorean ? "메타데이터 삭제 (EXIF/GPS)" : isJapanese ? "メタデータ削除（EXIF/GPS）" :'
);
content = content.replace(
  'desc: isJapanese ? "位置情報・撮影機器情報を完全消去" :',
  'desc: isKorean ? "GPS 위치 정보 및 카메라 기기 정보 완전 삭제" : isJapanese ? "位置情報・撮影機器情報を完全消去" :'
);

// 4. Word to PDF
content = content.replace(
  '{ id: "word-to-pdf", label: isJapanese ? "Word を PDF に変換" :',
  '{ id: "word-to-pdf", label: isKorean ? "Word를 PDF로 변환" : isJapanese ? "Word を PDF に変換" :'
);
content = content.replace(
  'desc: isJapanese ? "DOCX ファイルを高精度で PDF に変換" :',
  'desc: isKorean ? "DOCX 문서를 고정밀 PDF로 변환" : isJapanese ? "DOCX ファイルを高精度で PDF に変換" :'
);

// 5. Excel to PDF
content = content.replace(
  '{ id: "excel-to-pdf", label: isJapanese ? "Excel を PDF に変換" :',
  '{ id: "excel-to-pdf", label: isKorean ? "Excel을 PDF로 변환" : isJapanese ? "Excel を PDF に変換" :'
);
content = content.replace(
  'desc: isJapanese ? "XLSX スプレッドシートを PDF に変換" :',
  'desc: isKorean ? "XLSX 스프레드시트를 PDF로 변환" : isJapanese ? "XLSX スプレッドシートを PDF に変換" :'
);

// 6. PowerPoint to PDF
content = content.replace(
  '{ id: "powerpoint-to-pdf", label: isJapanese ? "PowerPoint を PDF に変換" :',
  '{ id: "powerpoint-to-pdf", label: isKorean ? "PowerPoint를 PDF로 변환" : isJapanese ? "PowerPoint を PDF に変換" :'
);
content = content.replace(
  'desc: isJapanese ? "PPTX プレゼンテーションを PDF に変換" :',
  'desc: isKorean ? "PPTX 프레젠테이션을 PDF로 변환" : isJapanese ? "PPTX プレゼンテーションを PDF に変換" :'
);

// 7. Extract ZIP
content = content.replace(
  '{ id: "extract-zip", label: isJapanese ? "アーカイブ解凍・展開" :',
  '{ id: "extract-zip", label: isKorean ? "압축 풀기 (ZIP/RAR/7Z)" : isJapanese ? "アーカイブ解凍・展開" :'
);
content = content.replace(
  'desc: isJapanese ? "ZIP、RAR、7Z ファイルを展開" :',
  'desc: isKorean ? "ZIP, RAR, 7Z 압축 파일 해제" : isJapanese ? "ZIP、RAR、7Z ファイルを展開" :'
);

// 8. Create ZIP
content = content.replace(
  '{ id: "create-zip", label: isJapanese ? "ZIP アーカイブ作成" :',
  '{ id: "create-zip", label: isKorean ? "ZIP 압축 파일 생성" : isJapanese ? "ZIP アーカイブ作成" :'
);
content = content.replace(
  'desc: isJapanese ? "ファイルを ZIP 形式に圧縮" :',
  'desc: isKorean ? "파일들을 ZIP 형식으로 압축" : isJapanese ? "ファイルを ZIP 形式に圧縮" :'
);

// 9. File selected header
content = content.replace(
  '{isJapanese ? "ファイルが選択されました" :',
  '{isKorean ? "파일이 선택되었습니다" : isJapanese ? "ファイルが選択されました" :'
);

// 10. Action question
content = content.replace(
  '{isJapanese ? "このファイルに対してどのような操作を行いますか？" :',
  '{isKorean ? "이 파일에 대해 어떤 작업을 수행하시겠습니까?" : isJapanese ? "このファイルに対してどのような操作を行いますか？" :'
);

// 11. Recommended categories
content = content.replace(
  '{isJapanese ? "おすすめの PDF 操作" :',
  '{isKorean ? "추천 PDF 작업" : isJapanese ? "おすすめの PDF 操作" :'
);
content = content.replace(
  '{isJapanese ? "おすすめの画像操作" :',
  '{isKorean ? "추천 이미지 작업" : isJapanese ? "おすすめの画像操作" :'
);
content = content.replace(
  '{isJapanese ? "Office 操作" :',
  '{isKorean ? "추천 Office 작업" : isJapanese ? "Office 操作" :'
);
content = content.replace(
  '{isJapanese ? "アーカイブ操作" :',
  '{isKorean ? "추천 압축 작업" : isJapanese ? "アーカイブ操作" :'
);

// 12. Start ->
content = content.replace(
  /\{isJapanese \? "開始 →" :/g,
  '{isKorean ? "시작 →" : isJapanese ? "開始 →" :'
);

// 13. Fallback catalog selector
content = content.replace(
  '{isJapanese ? "カタログからツールを選択" :',
  '{isKorean ? "카탈로그에서 도구 선택" : isJapanese ? "カタログからツールを選択" :'
);
content = content.replace(
  '{isJapanese\n                  ? "ドキュメントを処理するには、カタログ内の100種類以上のツールから最適なものを選択してください。"',
  '{isKorean\n                  ? "문서를 처리하려면 카탈로그의 100개 이상의 도구 중에서 적합한 도구를 선택하세요."\n                  : isJapanese\n                  ? "ドキュメントを処理するには、カタログ内の100種類以上のツールから最適なものを選択してください。"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched ActionChooser.tsx for Korean');
