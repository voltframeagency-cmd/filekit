const fs = require('fs');

// 1. PdfOverlayWorkspace.tsx
const overlayFile = 'src/components/pdf-overlay/PdfOverlayWorkspace.tsx';
let overlayContent = fs.readFileSync(overlayFile, 'utf8');

overlayContent = overlayContent.replace(
  'language === "ja"\n              ? "ここにPDFファイルをドロップ"',
  'language === "ko"\n              ? "여기에 PDF 파일을 드롭하세요"\n              : language === "ja"\n              ? "ここにPDFファイルをドロップ"'
);

overlayContent = overlayContent.replace(
  'language === "ja"\n              ? "またはクリックしてお使いの端末から選択（最大 100 MB）"',
  'language === "ko"\n              ? "또는 클릭하여 기기에서 파일 선택 (최대 100MB)"\n              : language === "ja"\n              ? "またはクリックしてお使いの端末から選択（最大 100 MB）"'
);

overlayContent = overlayContent.replace(
  'language === "ja"\n              ? "PDFファイルを選択"',
  'language === "ko"\n              ? "PDF 파일 선택"\n              : language === "ja"\n              ? "PDFファイルを選択"'
);

fs.writeFileSync(overlayFile, overlayContent, 'utf8');
console.log('Successfully patched PdfOverlayWorkspace.tsx for Korean');

// 2. PdfWatermarkControls.tsx
const controlsFile = 'src/components/pdf-overlay/PdfWatermarkControls.tsx';
let controlsContent = fs.readFileSync(controlsFile, 'utf8');

controlsContent = controlsContent.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "透かしの種類" :',
  'isKorean ? "워터마크 유형" : isJapanese ? "透かしの種類" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "テキスト透かし" :',
  'isKorean ? "텍스트 워터마크" : isJapanese ? "テキスト透かし" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "ロゴ / 画像" :',
  'isKorean ? "로고 / 이미지" : isJapanese ? "ロゴ / 画像" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "透かしテキスト" :',
  'isKorean ? "워터마크 텍스트" : isJapanese ? "透かしテキスト" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "フォントの色" :',
  'isKorean ? "글꼴 색상" : isJapanese ? "フォントの色" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "すべてのページ" :',
  'isKorean ? "모든 페이지" : isJapanese ? "すべてのページ" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "奇数ページのみ" :',
  'isKorean ? "홀수 페이지만" : isJapanese ? "奇数ページのみ" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "偶数ページのみ" :',
  'isKorean ? "짝수 페이지만" : isJapanese ? "偶数ページのみ" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "カスタム範囲" :',
  'isKorean ? "사용자 지정 범위" : isJapanese ? "カスタム範囲" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "透かしを適用中..." :',
  'isKorean ? "워터마크 적용 중..." : isJapanese ? "透かしを適用中..." :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "透かしを適用" :',
  'isKorean ? "워터마크 적용" : isJapanese ? "透かしを適用" :'
);

controlsContent = controlsContent.replace(
  'isJapanese ? "リセット" :',
  'isKorean ? "초기화" : isJapanese ? "リセット" :'
);

fs.writeFileSync(controlsFile, controlsContent, 'utf8');
console.log('Successfully patched PdfWatermarkControls.tsx for Korean');
