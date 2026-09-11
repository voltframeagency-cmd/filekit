const fs = require('fs');

const file = 'src/components/image-transform/ImageTransformWorkspace.tsx';
let c = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

// 1. Dropzone heading
c = c.replace(
  '{isJapanese\n                ? `${mode.startsWith("svg") ? "SVGファイル" : mode === "ico-to-png" ? "ICOアイコン" : "画像"}を選択`',
  '{isKorean\n                ? `${mode.startsWith("svg") ? "SVG 파일" : mode === "ico-to-png" ? "ICO 아이콘" : "이미지"} 선택`\n                : isJapanese\n                ? `${mode.startsWith("svg") ? "SVGファイル" : mode === "ico-to-png" ? "ICOアイコン" : "画像"}を選択`'
);

// 2. Dropzone privacy paragraph
c = c.replace(
  '{isJapanese\n                ? "ブラウザのメモリ内で100%安全にプライベート処理。"',
  '{isKorean\n                ? "브라우저 메모리 내에서 100% 안전하게 비공개 처리됩니다."\n                : isJapanese\n                ? "ブラウザのメモリ内で100%安全にプライベート処理。"'
);

// 3. Aspect ratio preset & lock labels
c = c.replace(
  '<label className="text-xs font-semibold text-slate-300">Target Width (px)</label>',
  '<label className="text-xs font-semibold text-slate-300">{isKorean ? "가로 너비 (px)" : "Target Width (px)"}</label>'
);
c = c.replace(
  '<label className="text-xs font-semibold text-slate-300">Target Height (px)</label>',
  '<label className="text-xs font-semibold text-slate-300">{isKorean ? "세로 높이 (px)" : "Target Height (px)"}</label>'
);
c = c.replace(
  'lockAspectRatio ? "🔒 Aspect Ratio Locked" : "🔓 Independent Dimensions"',
  'isKorean ? (lockAspectRatio ? "🔒 가로세로 비율 고정" : "🔓 비율 자유 조정") : (lockAspectRatio ? "🔒 Aspect Ratio Locked" : "🔓 Independent Dimensions")'
);
c = c.replace(
  '<span className="text-xs font-semibold text-slate-300">Aspect Ratio Preset:</span>',
  '<span className="text-xs font-semibold text-slate-300">{isKorean ? "가로세로 비율 프리셋:" : "Aspect Ratio Preset:"}</span>'
);
c = c.replace(
  '<span className="text-xs font-semibold text-slate-300">Rotation Angle:</span>',
  '<span className="text-xs font-semibold text-slate-300">{isKorean ? "회전 각도:" : "Rotation Angle:"}</span>'
);
c = c.replace(
  '<span className="text-xs font-semibold text-slate-300">Flip Direction:</span>',
  '<span className="text-xs font-semibold text-slate-300">{isKorean ? "반전 방향:" : "Flip Direction:"}</span>'
);
c = c.replace(
  '↔ Horizontal Flip',
  '{isKorean ? "↔ 좌우 반전" : "↔ Horizontal Flip"}'
);
c = c.replace(
  '↕ Vertical Flip',
  '{isKorean ? "↕ 상하 반전" : "↕ Vertical Flip"}'
);
c = c.replace(
  '<span>Crop Selection: {cropBox.width} × {cropBox.height} px</span>',
  '<span>{isKorean ? `선택 영역: ${cropBox.width} × ${cropBox.height} px` : `Crop Selection: ${cropBox.width} × ${cropBox.height} px`}</span>'
);
c = c.replace(
  '<span>Origin: ({cropBox.x}, {cropBox.y})</span>',
  '<span>{isKorean ? `시작 좌표: (${cropBox.x}, ${cropBox.y})` : `Origin: (${cropBox.x}, ${cropBox.y})`}</span>'
);

fs.writeFileSync(file, c, 'utf8');
console.log('Successfully patched ImageTransformWorkspace.tsx');
