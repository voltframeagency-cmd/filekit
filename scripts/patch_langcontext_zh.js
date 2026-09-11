const fs = require('fs');

let code = fs.readFileSync('src/components/layout/LanguageContext.tsx', 'utf8');

// 1. In t(), add handling for homepage.searchPlaceholder, homepage.footerNote, homepage.viewAll, homepage.popularTools
const beforeEnFallback = `    // 3. Fallback to English UI_TRANSLATIONS`;

const newKeyHandlers = `    if (key === "homepage.searchPlaceholder") {
      if (isChinese) return effectiveLang === "zh-TW" ? "搜尋 100+ 款線上工具..." : "搜索 100+ 款实用工具...";
    }
    if (key === "homepage.footerNote") {
      if (isChinese) return effectiveLang === "zh-TW" ? "免費基礎工具。進階匯出 €4.99 起。無任何隱藏訂閱。" : "免费基础工具。高级导出 €4.99 起。无任何隐藏订阅。";
    }
    if (key === "homepage.popularTools") {
      if (isChinese) return effectiveLang === "zh-TW" ? "熱門推薦工具" : "常用热门工具";
    }
    if (key === "homepage.viewAll" || key === "homepage.browseAll") {
      if (isChinese) return effectiveLang === "zh-TW" ? "探索全部 100+ 工具 →" : "探索全部 100+ 工具 →";
    }
`;

if (!code.includes('if (key === "homepage.searchPlaceholder")')) {
  code = code.replace(beforeEnFallback, newKeyHandlers + '\n' + beforeEnFallback);
}

// 2. Add isChinese to tool and breadcrumb key matches
const targetItalianBlock = `        if (key === "tool.pdfToWord.title") return "PDF in Word";
        if (key === "tool.pdfToWord.desc") return "File DOCX modificabile";
      }`;

const chineseBlock = `        if (key === "tool.pdfToWord.title") return "PDF in Word";
        if (key === "tool.pdfToWord.desc") return "File DOCX modificabile";
      } else if (isChinese) {
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
      }`;

if (!code.includes('if (key === "tool.compress.desc") return isTaiwan')) {
  code = code.replace(targetItalianBlock, chineseBlock);
}

fs.writeFileSync('src/components/layout/LanguageContext.tsx', code, 'utf8');
console.log('Successfully updated LanguageContext.tsx');
