const fs = require('fs');

const file = 'src/components/navigation/MobileNavigation.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean
content = content.replace(
  '            const isJapanese = activeLocale === "ja";',
  '            const isJapanese = activeLocale === "ja";\n            const isKorean = activeLocale === "ko";'
);

// 2. Categories
content = content.replace(
  'if (isJapanese) return "画像";',
  'if (isKorean) return "이미지";\n              if (isJapanese) return "画像";'
);
content = content.replace(
  'if (isJapanese) return "PDF";',
  'if (isKorean) return "PDF";\n              if (isJapanese) return "PDF";'
);
content = content.replace(
  'if (isJapanese) return "動画";',
  'if (isKorean) return "비디오";\n              if (isJapanese) return "動画";'
);
content = content.replace(
  'if (isJapanese) return "字幕";',
  'if (isKorean) return "자막";\n              if (isJapanese) return "字幕";'
);
content = content.replace(
  'if (isJapanese) return "文書・オフィス";',
  'if (isKorean) return "문서 및 오피스";\n              if (isJapanese) return "文書・オフィス";'
);
content = content.replace(
  'if (isJapanese) return "CAD & ベクター";',
  'if (isKorean) return "CAD 및 벡터";\n              if (isJapanese) return "CAD & ベクター";'
);
content = content.replace(
  'if (isJapanese) return "音声";',
  'if (isKorean) return "오디오";\n              if (isJapanese) return "音声";'
);
content = content.replace(
  'if (isJapanese) return "圧縮ファイル・アーカイブ";',
  'if (isKorean) return "압축 파일 및 아카이브";\n              if (isJapanese) return "圧縮ファイル・アーカイブ";'
);

// 3. Link label transformations
content = content.replace(
  '            const isJapanese = activeLocale === "ja";\n\n            const toPrep',
  '            const isJapanese = activeLocale === "ja";\n            const isKorean = activeLocale === "ko";\n\n            const toPrep'
);

content = content.replace(
  'if (isJapanese) return `${source} を ${target} に変換`;',
  'if (isKorean) return `${source}에서 ${target}(으)로 변환`;\n                if (isJapanese) return `${source} を ${target} に変換`;'
);

content = content.replace(
  'if (isJapanese) return `${item} を圧縮`;',
  'if (isKorean) return `${item} 압축`;\n              if (isJapanese) return `${item} を圧縮`;'
);

content = content.replace(
  'if (isJapanese) return `${item} を変換`;',
  'if (isKorean) return `${item} 변환`;\n              if (isJapanese) return `${item} を変換`;'
);

content = content.replace(
  'if (isJapanese) return `${item} を抽出`;',
  'if (isKorean) return `${item} 추출`;\n              if (isJapanese) return `${item} を抽出`;'
);

content = content.replace(
  'if (isJapanese) return `${item} を回転`;',
  'if (isKorean) return `${item} 회전`;\n              if (isJapanese) return `${item} を回転`;'
);

content = content.replace(
  'if (isJapanese) return `${item} をカット・トリミング`;',
  'if (isKorean) return `${item} 자르기 및 트리밍`;\n              if (isJapanese) return `${item} をカット・トリミング`;'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched MobileNavigation.tsx for Korean');
