const fs = require('fs');
let code = fs.readFileSync('src/components/layout/LanguageContext.tsx', 'utf8');

const targetStr = '    // 4. Match common tool keys across languages\n    if (key.startsWith("tool.") || key.startsWith("breadcrumb.")) {';

const zhCheck = `      const isChinese = effectiveLang.startsWith("zh");
      if (isChinese) {
        const isTaiwan = effectiveLang === "zh-TW";
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return isTaiwan ? "合併 PDF" : "合并 PDF";
        if (key === "tool.merge.desc") return isTaiwan ? "合併多個 PDF 檔案" : "合并多个 PDF 文件";
        if (key === "tool.compress.desc") return isTaiwan ? "減少 PDF 檔案大小" : "缩减 PDF 文件体积";
        if (key === "breadcrumb.compress") return isTaiwan ? "壓縮 PDF" : "压缩 PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return isTaiwan ? "分割 PDF" : "分割 PDF";
        if (key === "tool.split.desc") return isTaiwan ? "分離 PDF 頁面" : "拆分 PDF 页面";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return isTaiwan ? "旋轉 PDF" : "旋转 PDF";
        if (key === "tool.rotate.desc") return isTaiwan ? "旋轉 PDF 頁面方向" : "旋转 PDF 页面方向";
        if (key === "tool.watermark.title") return isTaiwan ? "PDF 浮水印" : "PDF 水印";
        if (key === "tool.watermark.desc") return isTaiwan ? "新增文字或圖片浮水印" : "添加文字或图片水印";
        if (key === "tool.resize.title") return isTaiwan ? "調整圖片尺寸" : "调整图片尺寸";
        if (key === "tool.resize.desc") return isTaiwan ? "精確像素或檔案大小" : "精准像素或文件大小";
        if (key === "tool.convert.title") return isTaiwan ? "圖片轉檔" : "图片转换";
        if (key === "tool.convert.desc") return isTaiwan ? "JPG, PNG, WebP 格式" : "JPG, PNG, WebP 格式";
        if (key === "tool.pdfToWord.title") return isTaiwan ? "PDF 轉 Word" : "PDF 转 Word";
        if (key === "tool.pdfToWord.desc") return isTaiwan ? "轉換為可編輯 DOCX" : "转换为可编辑 DOCX";
        if (key === "tool.allTools.title") return isTaiwan ? "所有工具" : "所有工具";
        if (key === "tool.allTools.desc") return isTaiwan ? "探索完整工具套件" : "探索完整工具套件";
      }
`;

if (!code.includes('if (key === "tool.compress.desc") return isTaiwan')) {
  code = code.replace(targetStr, targetStr + '\n' + zhCheck);
  fs.writeFileSync('src/components/layout/LanguageContext.tsx', code, 'utf8');
  console.log('Successfully inserted Chinese tool check at start of step 4');
} else {
  console.log('Already inserted');
}
