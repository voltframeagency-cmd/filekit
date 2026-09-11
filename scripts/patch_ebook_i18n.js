const fs = require("fs");
const file = "src/utils/ebook/EbookWorkspace.tsx";
let content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

// 1. Localize the error message
const errTarget = `      setError(
        isNorwegian
          ? "Kunne ikke konvertere e-boken til PDF. Sørg for at filen er fri for DRM-beskyttelse."`;

const errReplacement = `      setError(
        isChinese
          ? (isTaiwan ? "無法將電子書轉換為 PDF。請確認該檔案沒有 DRM 數位版權保護。" : "无法将电子书转换为 PDF。请确认该文件没有 DRM 数字版权保护。")
          : isNorwegian
          ? "Kunne ikke konvertere e-boken til PDF. Sørg for at filen er fri for DRM-beskyttelse."`;

// 2. Localize "Select eBook File" dropzone title
const selTarget = `          <span className="font-bold text-slate-800 text-base block">
            {isJapanese
              ? \`eBookファイルを選択 (\${getAcceptExtensions().toUpperCase()})\``;

const selReplacement = `          <span className="font-bold text-slate-800 text-base block">
            {isChinese
              ? (isTaiwan ? \`選取電子書檔案 (\${getAcceptExtensions().toUpperCase()})\` : \`选择电子书文件 (\${getAcceptExtensions().toUpperCase()})\`)
              : isJapanese
              ? \`eBookファイルを選択 (\${getAcceptExtensions().toUpperCase()})\``;

// 3. Localize privacy notice in dropzone
const privTarget = `          <span className="text-xs text-slate-400 mt-1 block">
            {isJapanese
              ? "サーバー送信なし · 100% ブラウザ内で安全に変換"`;

const privReplacement = `          <span className="text-xs text-slate-400 mt-1 block">
            {isChinese
              ? (isTaiwan ? "零伺服器上傳 · 100% 瀏覽器本機隱私轉換" : "零服务器上传 · 100% 浏览器本地隐私转换")
              : isJapanese
              ? "サーバー送信なし · 100% ブラウザ内で安全に変換"`;

// 4. Localize "Change File" button
const chgTarget = `            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isKorean ? "파일 변경" : isJapanese ? "ファイルを変更"`;

const chgReplacement = `            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isChinese ? (isTaiwan ? "變更檔案" : "更改文件") : isKorean ? "파일 변경" : isJapanese ? "ファイルを変更"`;

// 5. Localize loading message
const loadTarget = `              <span className="text-sm font-bold text-slate-700">
                {isNorwegian
                  ? "Gjengir e-boksider til PDF..."`;

const loadReplacement = `              <span className="text-sm font-bold text-slate-700">
                {isChinese
                  ? (isTaiwan ? "正在將電子書頁面轉換並渲染為 PDF..." : "正在将电子书页面转换并渲染为 PDF...")
                  : isNorwegian
                  ? "Gjengir e-boksider til PDF..."`;

// 6. Localize output banner
const outTarget = `                <span className="text-sm font-bold text-amber-900 block">
                  {isNorwegian
                    ? \`✓ Konvertert: \${outputFileName}\``;

const outReplacement = `                <span className="text-sm font-bold text-amber-900 block">
                  {isChinese
                    ? (isTaiwan ? \`✓ 已完成轉換: \${outputFileName}\` : \`✓ 已完成转换: \${outputFileName}\`)
                    : isNorwegian
                    ? \`✓ Konvertert: \${outputFileName}\``;

// 7. Localize size badge
const sizeTarget = `                <span className="text-xs text-amber-700">
                  {isNorwegian
                    ? \`Størrelse: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument\``;

const sizeReplacement = `                <span className="text-xs text-amber-700">
                  {isChinese
                    ? (isTaiwan ? \`檔案大小: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF 文件\` : \`文件大小: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF 文档\`)
                    : isNorwegian
                    ? \`Størrelse: \${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument\``;

// 8. Localize download button
const dlTarget = `              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isKorean ? "PDF 다운로드" : isJapanese ? "PDFをダウンロード"`;

const dlReplacement = `              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isChinese ? (isTaiwan ? "下載 PDF" : "下载 PDF") : isKorean ? "PDF 다운로드" : isJapanese ? "PDFをダウンロード"`;

const patches = [
  [errTarget, errReplacement, "error message"],
  [selTarget, selReplacement, "dropzone title"],
  [privTarget, privReplacement, "privacy notice"],
  [chgTarget, chgReplacement, "change file button"],
  [loadTarget, loadReplacement, "loading message"],
  [outTarget, outReplacement, "output banner"],
  [sizeTarget, sizeReplacement, "size badge"],
  [dlTarget, dlReplacement, "download button"]
];

for (const [target, repl, name] of patches) {
  if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log(`✓ Patched ${name}`);
  } else {
    console.error(`✗ Failed to find target for ${name}`);
  }
}

fs.writeFileSync(file, content, "utf8");
console.log("Done patching EbookWorkspace.tsx!");
