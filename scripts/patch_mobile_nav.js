const fs = require("fs");
const file = "src/components/navigation/MobileNavigation.tsx";
let content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

// 1. In getCategoryHeader, add isChinese & isTaiwan
const catHeaderTarget = `          const getCategoryHeader = (label: string): string => {
            const isMalay = activeLocale === "ms";`;

const catHeaderRepl = `          const getCategoryHeader = (label: string): string => {
            const isChinese = activeLocale === "zh" || activeLocale === "zh-TW" || activeLocale === "zh-CN";
            const isTaiwan = activeLocale === "zh-TW";
            const isMalay = activeLocale === "ms";`;

// Add Chinese returns to categories:
const imageCatTarget = `            if (label.includes("IMAGE")) {
              if (isKorean) return "이미지";`;

const imageCatRepl = `            if (label.includes("IMAGE")) {
              if (isChinese) return isTaiwan ? "圖片" : "图片";
              if (isKorean) return "이미지";`;

const pdfCatTarget = `            if (label.includes("PDF")) {
              if (isKorean) return "PDF";`;

const pdfCatRepl = `            if (label.includes("PDF")) {
              if (isChinese) return "PDF";
              if (isKorean) return "PDF";`;

const videoCatTarget = `            if (label.includes("VIDEO")) {
              if (isKorean) return "비디오";`;

const videoCatRepl = `            if (label.includes("VIDEO")) {
              if (isChinese) return isTaiwan ? "影片" : "视频";
              if (isKorean) return "비디오";`;

const subCatTarget = `            if (label.includes("SUBTITLE")) {
              if (isKorean) return "자막";`;

const subCatRepl = `            if (label.includes("SUBTITLE")) {
              if (isChinese) return "字幕";
              if (isKorean) return "자막";`;

const docCatTarget = `            if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {
              if (isKorean) return "문서 및 오피스";`;

const docCatRepl = `            if (label.includes("DOCUMENTS") || label.includes("DOCUMENT")) {
              if (isChinese) return isTaiwan ? "檔案與辦公" : "文档与办公";
              if (isKorean) return "문서 및 오피스";`;

const cadCatTarget = `            if (label.includes("CAD")) {
              if (isKorean) return "CAD 및 벡터";`;

const cadCatRepl = `            if (label.includes("CAD")) {
              if (isChinese) return isTaiwan ? "CAD 與向量" : "CAD 与矢量";
              if (isKorean) return "CAD 및 벡터";`;

const audioCatTarget = `            if (label.includes("AUDIO")) {
              if (isKorean) return "오디오";`;

const audioCatRepl = `            if (label.includes("AUDIO")) {
              if (isChinese) return isTaiwan ? "音訊" : "音频";
              if (isKorean) return "오디오";`;

const archCatTarget = `            if (label.includes("ARCHIVE")) {
              if (isKorean) return "압축 파일 및 아카이브";`;

const archCatRepl = `            if (label.includes("ARCHIVE")) {
              if (isChinese) return isTaiwan ? "壓縮檔與封存" : "压缩文件与归档";
              if (isKorean) return "압축 파일 및 아카이브";`;

// 2. In getLocalizedLinkLabel:
const linkLabelTarget = `          const getLocalizedLinkLabel = (label: string): string => {
            if (activeLocale === "en") return label;
            const isMalay = activeLocale === "ms";`;

const linkLabelRepl = `          const getLocalizedLinkLabel = (label: string): string => {
            if (activeLocale === "en") return label;
            const isChinese = activeLocale === "zh" || activeLocale === "zh-TW" || activeLocale === "zh-CN";
            const isTaiwan = activeLocale === "zh-TW";
            const isMalay = activeLocale === "ms";`;

const toTarget = `            if (label.includes(" to ")) {
              const [source, target] = label.split(" to ");
              if (source && target) {
                if (isKorean) return \`\${source}에서 \${target}(으)로 변환\`;
                if (isJapanese) return \`\${source} を \${target} に変換\`;
                return \`\${source} \${toPrep} \${target}\`;
              }
            }`;

const toRepl = `            if (label.includes(" to ")) {
              const [source, target] = label.split(" to ");
              if (source && target) {
                if (isChinese) return \`\${source} 轉 \${target}\`;
                if (isKorean) return \`\${source}에서 \${target}(으)로 변환\`;
                if (isJapanese) return \`\${source} を \${target} に変換\`;
                return \`\${source} \${toPrep} \${target}\`;
              }
            }`;

const compressTarget = `            if (label.startsWith("Compress ")) {
              const item = label.replace("Compress ", "");
              if (isKorean) return \`\${item} 압축\`;`;

const compressRepl = `            if (label.startsWith("Compress ")) {
              const item = label.replace("Compress ", "");
              if (isChinese) return \`\${item} 壓縮\`;
              if (isKorean) return \`\${item} 압축\`;`;

const convertTarget = `            if (label.startsWith("Convert ")) {
              const item = label.replace("Convert ", "");
              if (isKorean) return \`\${item} 변환\`;`;

const convertRepl = `            if (label.startsWith("Convert ")) {
              const item = label.replace("Convert ", "");
              if (isChinese) return \`\${item} 轉換\`;
              if (isKorean) return \`\${item} 변환\`;`;

const extractTarget = `            if (label.startsWith("Extract ")) {
              const item = label.replace("Extract ", "");
              if (isKorean) return \`\${item} 추출\`;`;

const extractRepl = `            if (label.startsWith("Extract ")) {
              const item = label.replace("Extract ", "");
              if (isChinese) return isTaiwan ? \`\${item} 擷取\` : \`\${item} 提取\`;
              if (isKorean) return \`\${item} 추출\`;`;

const rotateTarget = `            if (label.startsWith("Rotate ")) {
              const item = label.replace("Rotate ", "");
              if (isKorean) return \`\${item} 회전\`;`;

const rotateRepl = `            if (label.startsWith("Rotate ")) {
              const item = label.replace("Rotate ", "");
              if (isChinese) return \`\${item} 旋轉\`;
              if (isKorean) return \`\${item} 회전\`;`;

const trimTarget = `            if (label.startsWith("Trim ")) {
              const item = label.replace("Trim ", "");
              if (isKorean) return \`\${item} 자르기 및 트리밍\`;`;

const trimRepl = `            if (label.startsWith("Trim ")) {
              const item = label.replace("Trim ", "");
              if (isChinese) return isTaiwan ? \`\${item} 剪裁與修剪\` : \`\${item} 裁剪与修剪\`;
              if (isKorean) return \`\${item} 자르기 및 트리밍\`;`;

const patches = [
  [catHeaderTarget, catHeaderRepl, "catHeader"],
  [imageCatTarget, imageCatRepl, "imageCat"],
  [pdfCatTarget, pdfCatRepl, "pdfCat"],
  [videoCatTarget, videoCatRepl, "videoCat"],
  [subCatTarget, subCatRepl, "subCat"],
  [docCatTarget, docCatRepl, "docCat"],
  [cadCatTarget, cadCatRepl, "cadCat"],
  [audioCatTarget, audioCatRepl, "audioCat"],
  [archCatTarget, archCatRepl, "archCat"],
  [linkLabelTarget, linkLabelRepl, "linkLabel"],
  [toTarget, toRepl, "toTarget"],
  [compressTarget, compressRepl, "compressTarget"],
  [convertTarget, convertRepl, "convertTarget"],
  [extractTarget, extractRepl, "extractTarget"],
  [rotateTarget, rotateRepl, "rotateTarget"],
  [trimTarget, trimRepl, "trimTarget"]
];

for (const [target, repl, name] of patches) {
  if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log(`✓ Patched ${name}`);
  } else {
    console.error(`✗ Target not found: ${name}`);
  }
}

fs.writeFileSync(file, content, "utf8");
console.log("Done patching MobileNavigation.tsx!");
