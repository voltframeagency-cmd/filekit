import fs from 'fs';

let content = fs.readFileSync('src/components/layout/LanguageContext.tsx', 'utf8');

// 1. Add hi and id to tool resolution
const toolTarget = `      } else if (effectiveLang === "lt") {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Sujungti PDF";
        if (key === "tool.merge.desc") return "Sujungti kelis PDF failus";
        if (key === "tool.compress.desc") return "Sumažinti PDF failo dydį";
        if (key === "breadcrumb.compress") return "Glaudinti PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Padalinti PDF";
        if (key === "tool.split.desc") return "Atskirti PDF puslapius";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Pasukti PDF";
        if (key === "tool.rotate.desc") return "Pasukti PDF puslapius";
        if (key === "tool.watermark.title") return "PDF vandenženklis";
        if (key === "tool.watermark.desc") return "Pridėti tekstą ar logotipą";
        if (key === "tool.resize.title") return "Keisti vaizdo dydį";
        if (key === "tool.resize.desc") return "Tikslūs pikseliai arba KB";
        if (key === "tool.pdfToWord.title") return "PDF į Word";
        if (key === "tool.pdfToWord.desc") return "Redaguojamas DOCX dokumentas";
      }`;

const toolReplacement = `      } else if (effectiveLang === "lt") {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Sujungti PDF";
        if (key === "tool.merge.desc") return "Sujungti kelis PDF failus";
        if (key === "tool.compress.desc") return "Sumažinti PDF failo dydį";
        if (key === "breadcrumb.compress") return "Glaudinti PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Padalinti PDF";
        if (key === "tool.split.desc") return "Atskirti PDF puslapius";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Pasukti PDF";
        if (key === "tool.rotate.desc") return "Pasukti PDF puslapius";
        if (key === "tool.watermark.title") return "PDF vandenženklis";
        if (key === "tool.watermark.desc") return "Pridėti tekstą ar logotipą";
        if (key === "tool.resize.title") return "Keisti vaizdo dydį";
        if (key === "tool.resize.desc") return "Tikslūs pikseliai arba KB";
        if (key === "tool.pdfToWord.title") return "PDF į Word";
        if (key === "tool.pdfToWord.desc") return "Redaguojamas DOCX dokumentas";
      } else if (effectiveLang === "hi") {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "PDF मर्ज करें";
        if (key === "tool.merge.desc") return "PDF फ़ाइलें संयोजित करें";
        if (key === "tool.compress.desc") return "PDF का आकार कम करें";
        if (key === "breadcrumb.compress") return "PDF कंप्रेस करें";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "PDF विभाजित करें";
        if (key === "tool.split.desc") return "PDF पृष्ठ अलग करें";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "PDF घुमाएँ";
        if (key === "tool.rotate.desc") return "PDF पृष्ठ घुमाएँ";
        if (key === "tool.watermark.title") return "PDF वॉटरमार्क";
        if (key === "tool.watermark.desc") return "टेक्स्ट या लोगो जोड़ें";
        if (key === "tool.resize.title") return "इमेज का आकार बदलें";
        if (key === "tool.resize.desc") return "सटीक पिक्सेल या KB";
        if (key === "tool.pdfToWord.title") return "PDF से Word";
        if (key === "tool.pdfToWord.desc") return "संपादन योग्य DOCX दस्तावेज़";
      } else if (effectiveLang === "id") {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Gabungkan PDF";
        if (key === "tool.merge.desc") return "Gabungkan beberapa file PDF";
        if (key === "tool.compress.desc") return "Perkecil ukuran file PDF";
        if (key === "breadcrumb.compress") return "Kompres PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Pisahkan PDF";
        if (key === "tool.split.desc") return "Pisahkan halaman PDF";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Putar PDF";
        if (key === "tool.rotate.desc") return "Putar halaman PDF";
        if (key === "tool.watermark.title") return "Watermark PDF";
        if (key === "tool.watermark.desc") return "Tambahkan teks atau logo";
        if (key === "tool.resize.title") return "Ubah Ukuran Gambar";
        if (key === "tool.resize.desc") return "Piksel atau KB yang tepat";
        if (key === "tool.pdfToWord.title") return "PDF ke Word";
        if (key === "tool.pdfToWord.desc") return "Dokumen DOCX yang dapat diedit";
      }`;

if (!content.includes(toolTarget)) {
  console.error('Could not find toolTarget in LanguageContext.tsx');
  process.exit(1);
}
content = content.replace(toolTarget, toolReplacement);

// 2. Add hi and id homepage strings
const homeTarget = `    if (key === "homepage.footerNote" && effectiveLang === "no") {
      return "Gratis grunnleggende verktøy. Ingen skjulte abonnementer.";
    }`;

const homeReplacement = `    if (key === "homepage.footerNote" && effectiveLang === "no") {
      return "Gratis grunnleggende verktøy. Ingen skjulte abonnementer.";
    }
    if (key === "homepage.footerNote" && effectiveLang === "hi") {
      return "मुफ़्त बुनियादी उपकरण। कोई छिपा हुआ शुल्क या सदस्यता नहीं।";
    }
    if (key === "homepage.footerNote" && effectiveLang === "id") {
      return "Alat dasar gratis. Tanpa langganan tersembunyi.";
    }`;

content = content.replace(homeTarget, homeReplacement);

// 3. Search placeholder
const searchTarget = `    if (key === "homepage.searchPlaceholder" && effectiveLang === "no") {
      return "Finn det rette verktøyet for oppgaven din...";
    }`;

const searchReplacement = `    if (key === "homepage.searchPlaceholder" && effectiveLang === "no") {
      return "Finn det rette verktøyet for oppgaven din...";
    }
    if (key === "homepage.searchPlaceholder" && effectiveLang === "hi") {
      return "अपने कार्य के लिए सही उपकरण खोजें...";
    }
    if (key === "homepage.searchPlaceholder" && effectiveLang === "id") {
      return "Temukan alat yang tepat untuk tugas Anda...";
    }`;

content = content.replace(searchTarget, searchReplacement);

// 4. Browse all
const browseTarget = `    if (key === "homepage.browseAll" && effectiveLang === "no") {
      return "Utforsk alle 100+ verktøy →";
    }`;

const browseReplacement = `    if (key === "homepage.browseAll" && effectiveLang === "no") {
      return "Utforsk alle 100+ verktøy →";
    }
    if (key === "homepage.browseAll" && effectiveLang === "hi") {
      return "सभी 100+ उपकरण देखें →";
    }
    if (key === "homepage.browseAll" && effectiveLang === "id") {
      return "Jelajahi semua 100+ alat →";
    }
    if (key === "homepage.popularTools" && effectiveLang === "hi") {
      return "लोकप्रिय उपकरण";
    }
    if (key === "homepage.popularTools" && effectiveLang === "id") {
      return "Alat Populer";
    }`;

content = content.replace(browseTarget, browseReplacement);

fs.writeFileSync('src/components/layout/LanguageContext.tsx', content, 'utf8');
console.log('Successfully updated LanguageContext.tsx with hi and id!');
