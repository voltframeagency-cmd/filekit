import { SupportedLocale, SUPPORTED_LOCALES, NON_DEFAULT_LOCALES } from "@/config/i18n/locales";
import { CONVERSION_CATALOG } from "@/config/conversionCatalog";
import { buildCanonicalUrl } from "@/utils/siteUrl";

export interface VerbDictionaryEntry {
  convert: string;
  compress: string;
  merge: string;
  split: string;
  rotate: string;
  crop: string;
  resize: string;
  extract: string;
  to: string;
  from: string;
  onlineFree: string;
  privacyNotice: string;
}

// Action verbs and terms dictionary across all 39 world languages
const VERB_DICTIONARY: Record<SupportedLocale, VerbDictionaryEntry> = {
  en: {
    convert: "Convert", compress: "Compress", merge: "Merge", split: "Split", rotate: "Rotate", crop: "Crop", resize: "Resize", extract: "Extract", to: "to", from: "from", onlineFree: "Online Free", privacyNotice: "100% private in-browser processing with zero server uploads."
  },
  es: {
    convert: "Convertir", compress: "Comprimir", merge: "Unir", split: "Dividir", rotate: "Rotar", crop: "Recortar", resize: "Redimensionar", extract: "Extraer", to: "a", from: "desde", onlineFree: "Online Gratis", privacyNotice: "Procesamiento 100% privado en tu navegador sin subir archivos."
  },
  "es-419": {
    convert: "Convertir", compress: "Comprimir", merge: "Unir", split: "Dividir", rotate: "Rotar", crop: "Recortar", resize: "Redimensionar", extract: "Extraer", to: "a", from: "desde", onlineFree: "Gratis en Línea", privacyNotice: "Procesamiento 100% privado en tu navegador sin subir archivos a la nube."
  },
  de: {
    convert: "Konvertieren", compress: "Komprimieren", merge: "Zusammenfügen", split: "Trennen", rotate: "Drehen", crop: "Zuschneiden", resize: "Größe ändern", extract: "Extrahieren", to: "in", from: "von", onlineFree: "Kostenlos Online", privacyNotice: "100% private Verarbeitung direkt im Browser ohne Server-Upload."
  },
  fr: {
    convert: "Convertir", compress: "Compresser", merge: "Fusionner", split: "Diviser", rotate: "Faire pivoter", crop: "Rogner", resize: "Redimensionner", extract: "Extraire", to: "en", from: "de", onlineFree: "Gratuit en Ligne", privacyNotice: "Traitement 100% privé dans votre navigateur sans téléversement."
  },
  pt: {
    convert: "Converter", compress: "Comprimir", merge: "Juntar", split: "Dividir", rotate: "Girar", crop: "Cortar", resize: "Redimensionar", extract: "Extrair", to: "para", from: "de", onlineFree: "Grátis Online", privacyNotice: "Processamento 100% privado no navegador sem envio de ficheiros."
  },
  "pt-BR": {
    convert: "Converter", compress: "Comprimir", merge: "Juntar", split: "Dividir", rotate: "Girar", crop: "Cortar", resize: "Redimensionar", extract: "Extrair", to: "para", from: "de", onlineFree: "Grátis Online", privacyNotice: "Processamento 100% privado no navegador sem envio de arquivos para servidor."
  },
  it: {
    convert: "Converti", compress: "Comprimi", merge: "Unisci", split: "Dividi", rotate: "Ruota", crop: "Ritaglia", resize: "Ridimensiona", extract: "Estrai", to: "in", from: "da", onlineFree: "Gratis Online", privacyNotice: "Elaborazione 100% privata nel browser senza caricamento sul server."
  },
  nl: {
    convert: "Converteren", compress: "Comprimeren", merge: "Samenvoegen", split: "Splitsen", rotate: "Draaien", crop: "Bijsnijden", resize: "Formaat wijzigen", extract: "Uittrekken", to: "naar", from: "van", onlineFree: "Gratis Online", privacyNotice: "100% privé verwerking direct in de browser zonder uploads."
  },
  ca: {
    convert: "Convertir", compress: "Comprimir", merge: "Fusionar", split: "Dividir", rotate: "Girar", crop: "Retallar", resize: "Redimensionar", extract: "Extreure", to: "a", from: "de", onlineFree: "Online Gratuït", privacyNotice: "Processament 100% privat al navegador sense pujar fitxers."
  },
  sv: {
    convert: "Konvertera", compress: "Komprimera", merge: "Slå samman", split: "Dela upp", rotate: "Rotera", crop: "Beskär", resize: "Ändra storlek", extract: "Extrahera", to: "till", from: "från", onlineFree: "Gratis Online", privacyNotice: "100% privat bearbetning i webbläsaren utan uppladdning."
  },
  da: {
    convert: "Konverter", compress: "Komprimer", merge: "Sammenføj", split: "Opdel", rotate: "Roter", crop: "Beskær", resize: "Tilpas størrelse", extract: "Udpak", to: "til", from: "fra", onlineFree: "Gratis Online", privacyNotice: "100% privat behandling direkte i browseren uden uploads."
  },
  fi: {
    convert: "Muunna", compress: "Pakkaa", merge: "Yhdistä", split: "Jaa", rotate: "Käännä", crop: "Rajaa", resize: "Muuta kokoa", extract: "Pura", to: "muotoon", from: "muodosta", onlineFree: "Ilmaiseksi Verkossa", privacyNotice: "100% yksityinen käsittely suoraan selaimessa ilman tiedostojen lataamista."
  },
  no: {
    convert: "Konverter", compress: "Komprimer", merge: "Slå sammen", split: "Del opp", rotate: "Roter", crop: "Beskjær", resize: "Endre størrelse", extract: "Pakk ut", to: "til", from: "fra", onlineFree: "Gratis på Nett", privacyNotice: "100% privat behandling i nettleseren uten opplasting til server."
  },
  pl: {
    convert: "Konwertuj", compress: "Kompresuj", merge: "Połącz", split: "Podziel", rotate: "Obróć", crop: "Przytnij", resize: "Zmień rozmiar", extract: "Wyodrębnij", to: "na", from: "z", onlineFree: "Za Darmo Online", privacyNotice: "100% prywatne przetwarzanie w przeglądarce bez przesyłania plików na serwer."
  },
  cs: {
    convert: "Převést", compress: "Komprimovat", merge: "Sloučit", split: "Rozdělit", rotate: "Otočit", crop: "Oříznout", resize: "Změnit velikost", extract: "Extrahovat", to: "do", from: "z", onlineFree: "Zdarma Online", privacyNotice: "100% soukromé zpracování v prohlížeči bez nahrávání souborů na server."
  },
  hu: {
    convert: "Konvertálás", compress: "Tömörítés", merge: "Egyesítés", split: "Szétválasztás", rotate: "Forgatás", crop: "Körülvágás", resize: "Átméretezés", extract: "Kibontás", to: "formátumba", from: "formátumból", onlineFree: "Ingyen Online", privacyNotice: "100% privát feldolgozás közvetlenül a böngészőben fájlfeltöltés nélkül."
  },
  ro: {
    convert: "Convertește", compress: "Comprimă", merge: "Îmbină", split: "Împarte", rotate: "Rotește", crop: "Decupează", resize: "Redimensionează", extract: "Extrage", to: "în", from: "din", onlineFree: "Gratuit Online", privacyNotice: "Procesare 100% privată direct în browser fără încărcare pe server."
  },
  bg: {
    convert: "Конвертиране", compress: "Компресиране", merge: "Обединяване", split: "Разделяне", rotate: "Завъртане", crop: "Изрязване", resize: "Преоразмеряване", extract: "Извличане", to: "в", from: "от", onlineFree: "Безплатно Онлайн", privacyNotice: "100% сигурна обработка в браузъра без качване на файлове."
  },
  el: {
    convert: "Μετατροπή", compress: "Συμπίεση", merge: "Συγχώνευση", split: "Διαχωρισμός", rotate: "Περιστροφή", crop: "Περικοπή", resize: "Αλλαγή μεγέθους", extract: "Εξαγωγή", to: "σε", from: "από", onlineFree: "Δωρεάν Online", privacyNotice: "100% ιδιωτική επεξεργασία στο πρόγραμμα περιήγησης χωρίς ανέβασμα."
  },
  sk: {
    convert: "Konvertovať", compress: "Komprimovať", merge: "Zlúčiť", split: "Rozdeliť", rotate: "Otočiť", crop: "Orezať", resize: "Zmeniť veľkosť", extract: "Extrahovať", to: "do", from: "z", onlineFree: "Zadarmo Online", privacyNotice: "100% súkromné spracovanie priamo v prehliadači bez nahrávania na server."
  },
  sl: {
    convert: "Pretvori", compress: "Stisni", merge: "Združi", split: "Razdeli", rotate: "Zavrti", crop: "Obreži", resize: "Spremeni velikost", extract: "Izvozi", to: "v", from: "iz", onlineFree: "Brezplačno na Spletu", privacyNotice: "100% zasebna obdelava v brskalniku brez nalaganja na strežnik."
  },
  ru: {
    convert: "Конвертировать", compress: "Сжать", merge: "Объединить", split: "Разделить", rotate: "Повернуть", crop: "Обрезать", resize: "Изменить размер", extract: "Извлечь", to: "в", from: "из", onlineFree: "Бесплатно Онлайн", privacyNotice: "100% конфиденциальная обработка в браузере без загрузки на сервер."
  },
  uk: {
    convert: "Конвертувати", compress: "Стиснути", merge: "Об'єднати", split: "Розділити", rotate: "Повернути", crop: "Обрізати", resize: "Змінити розмір", extract: "Витягти", to: "в", from: "з", onlineFree: "Безкоштовно Онлайн", privacyNotice: "100% конфіденційна обробка в браузері без завантаження на сервер."
  },
  lv: {
    convert: "Konvertēt", compress: "Saspiest", merge: "Apvienot", split: "Sadalīt", rotate: "Pagriezt", crop: "Apgriezt", resize: "Mainīt izmēru", extract: "Izvilkt", to: "uz", from: "no", onlineFree: "Bezmaksas Tiešsaistē", privacyNotice: "100% privāta apstrāde pārlūkprogrammā bez failu augšupielādes."
  },
  lt: {
    convert: "Konvertuoti", compress: "Glaudinti", merge: "Sujungti", split: "Padalinti", rotate: "Pasukti", crop: "Apkarpyti", resize: "Keisti dydį", extract: "Išskleisti", to: "į", from: "iš", onlineFree: "Nemokamai Internete", privacyNotice: "100% privatus apdorojimas naršyklėje be failų įkėlimo į serverį."
  },
  tr: {
    convert: "Dönüştür", compress: "Sıkıştır", merge: "Birleştir", split: "Böl", rotate: "Döndür", crop: "Kırp", resize: "Yeniden Boyutlandır", extract: "Ayıkla", to: ">", from: "-", onlineFree: "Ücretsiz Çevrimiçi", privacyNotice: "%100 gizli tarayıcı içi işlem, sunucuya dosya yüklenmez."
  },
  ar: {
    convert: "تحويل", compress: "ضغط", merge: "دمج", split: "تقسيم", rotate: "تدوير", crop: "قص", resize: "تغيير الحجم", extract: "استخراج", to: "إلى", from: "من", onlineFree: "مجاناً أونلاين", privacyNotice: "معالجة خاصة 100% داخل المتصفح بدون رفع الملفات إلى أي خادم."
  },
  he: {
    convert: "המרת", compress: "דחיסת", merge: "מיזוג", split: "פיצול", rotate: "סיבוב", crop: "חיתוך", resize: "שינוי גודל", extract: "חילוץ", to: "ל-", from: "מ-", onlineFree: "בחינם אונליין", privacyNotice: "עיבוד פרטי ומאובטח 100% ישירות בדפדפן ללא העלאת קבצים לשרת."
  },
  hi: {
    convert: "कन्वर्ट करें", compress: "कंप्रेस करें", merge: "मर्ज करें", split: "विभाजित करें", rotate: "रोटेट करें", crop: "क्रॉप करें", resize: "रीसाइज़ करें", extract: "निकालें", to: "से", from: "को", onlineFree: "मुफ़्त ऑनलाइन", privacyNotice: "बिना किसी सर्वर अपलोड के सीधे ब्राउज़र में 100% निजी प्रोसेसिंग।"
  },
  id: {
    convert: "Konversi", compress: "Kompres", merge: "Gabungkan", split: "Pisahkan", rotate: "Putar", crop: "Pangkas", resize: "Ubah Ukuran", extract: "Ekstrak", to: "ke", from: "dari", onlineFree: "Gratis Online", privacyNotice: "Pemrosesan 100% pribadi di browser tanpa unggah file ke server."
  },
  ms: {
    convert: "Tukar", compress: "Mampatkan", merge: "Gabungkan", split: "Pisahkan", rotate: "Putar", crop: "Pangkas", resize: "Ubah Saiz", extract: "Ekstrak", to: "ke", from: "daripada", onlineFree: "Percuma Dalam Talian", privacyNotice: "Pemprosesan 100% peribadi dalam pelayar tanpa memuat naik ke pelayan."
  },
  th: {
    convert: "แปลงไฟล์", compress: "บีบอัด", merge: "รวมไฟล์", split: "แยกไฟล์", rotate: "หมุน", crop: "ครอบตัด", resize: "ปรับขนาด", extract: "แยกข้อมูล", to: "เป็น", from: "จาก", onlineFree: "ฟรีออนไลน์", privacyNotice: "ประมวลผลบนเบราว์เซอร์อย่างปลอดภัย 100% โดยไม่ต้องอัปโหลดไฟล์"
  },
  vi: {
    convert: "Chuyển đổi", compress: "Nén", merge: "Ghép", split: "Tách", rotate: "Xoay", crop: "Cắt", resize: "Đổi kích thước", extract: "Trích xuất", to: "sang", from: "từ", onlineFree: "Miễn phí Trực tuyến", privacyNotice: "Xử lý 100% riêng tư ngay trên trình duyệt mà không tải tệp lên máy chủ."
  },
  fil: {
    convert: "I-convert ang", compress: "I-compress ang", merge: "Pagsamahin ang", split: "Hatiin ang", rotate: "Iikot ang", crop: "I-crop ang", resize: "Baguhin ang laki ng", extract: "I-extract ang", to: "sa", from: "mula sa", onlineFree: "Libre Online", privacyNotice: "100% pribadong pagpoproseso sa browser nang walang pag-upload ng file."
  },
  ja: {
    convert: "変換", compress: "圧縮", merge: "結合", split: "分割", rotate: "回転", crop: "切り抜き", resize: "リサイズ", extract: "抽出", to: "から", from: "へ", onlineFree: "無料オンライン", privacyNotice: "ファイルをサーバーに送信せず、ブラウザ上で100%安全にローカル処理します。"
  },
  ko: {
    convert: "변환", compress: "압축", merge: "병합", split: "분할", rotate: "회전", crop: "자르기", resize: "크기 조정", extract: "추출", to: "에서", from: "으로", onlineFree: "무료 온라인", privacyNotice: "서버에 파일을 업로드하지 않고 브라우저 내에서 100% 안전하게 로컬 처리합니다."
  },
  "zh-CN": {
    convert: "转换", compress: "压缩", merge: "合并", split: "拆分", rotate: "旋转", crop: "裁剪", resize: "调整大小", extract: "提取", to: "转", from: "从", onlineFree: "在线免费", privacyNotice: "100% 浏览器本地安全处理，零云端上传，全面保障隐私。"
  },
  "zh-TW": {
    convert: "轉換", compress: "壓縮", merge: "合併", split: "分割", rotate: "旋轉", crop: "裁切", resize: "調整大小", extract: "擷取", to: "轉", from: "從", onlineFree: "線上免費", privacyNotice: "100% 瀏覽器本機安全處理，無須上傳伺服器，嚴格保護個人隱私。"
  }
};

import { PDF_COMPRESSION_ROUTES } from "@/config/pdfCompressionRoutes";
import { IMAGE_CONVERSION_ROUTES } from "@/config/imageConversionRoutes";

export interface LocalizedToolMeta {
  title: string;
  description: string;
  h1: string;
  canonicalUrl: string;
  locale: SupportedLocale;
}

export function getLocalizedToolMeta(
  slug: string,
  locale: SupportedLocale = "en"
): LocalizedToolMeta {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const tool = CONVERSION_CATALOG[normSlug];
  const dict = VERB_DICTIONARY[locale] || VERB_DICTIONARY.en;

  if (!tool) {
    const pdfCfg = PDF_COMPRESSION_ROUTES[normSlug];
    const imgCfg = IMAGE_CONVERSION_ROUTES[normSlug];
    const baseName = pdfCfg?.navigationLabel || imgCfg?.navigationLabel || "File Utility";
    const defaultTitle = pdfCfg?.jsonLdTitle || imgCfg?.jsonLdTitle || `${baseName} | FileKit`;
    const defaultDesc = pdfCfg?.supportingCopy || imgCfg?.supportingCopy || dict.privacyNotice;

    if (locale === "en") {
      return {
        title: defaultTitle,
        description: defaultDesc,
        h1: pdfCfg?.h1 || imgCfg?.h1 || baseName,
        canonicalUrl: buildCanonicalUrl(normSlug),
        locale
      };
    }

    const localizedTitle = `${dict.compress} ${baseName} ${dict.onlineFree} | FileKit`;
    const localizedDesc = `${localizedTitle}. ${dict.privacyNotice}`;
    return {
      title: localizedTitle,
      description: localizedDesc,
      h1: localizedTitle.replace(/ \| FileKit$/, ""),
      canonicalUrl: buildCanonicalUrl(normSlug),
      locale
    };
  }

  const englishTitle = tool.inputFormat && tool.outputFormat
    ? `Convert ${tool.inputFormat} to ${tool.outputFormat} Online Free`
    : normSlug.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const englishDesc = tool.uniqueOutcomeDefinition || `${englishTitle}. ${dict.privacyNotice}`;

  if (locale === "en") {
    return {
      title: `${englishTitle} | FileKit`,
      description: englishDesc,
      h1: englishTitle,
      canonicalUrl: buildCanonicalUrl(normSlug),
      locale
    };
  }

  // Generate localized metadata dynamically
  let localizedAction = dict.convert;
  let localizedTarget = tool.outputFormat || "";
  let localizedSource = tool.inputFormat || "";

  if (normSlug.startsWith("/compress-")) {
    localizedAction = dict.compress;
  } else if (normSlug.startsWith("/merge-")) {
    localizedAction = dict.merge;
  } else if (normSlug.startsWith("/split-")) {
    localizedAction = dict.split;
  } else if (normSlug.startsWith("/rotate-")) {
    localizedAction = dict.rotate;
  } else if (normSlug.startsWith("/crop-")) {
    localizedAction = dict.crop;
  } else if (normSlug.startsWith("/resize-")) {
    localizedAction = dict.resize;
  } else if (normSlug.startsWith("/extract-")) {
    localizedAction = dict.extract;
  }

  // Pair extraction fallback (e.g. /dwg-to-pdf, /jpg-to-png)
  if (!localizedSource && normSlug.includes("-to-")) {
    const parts = normSlug.replace(/^\//, "").split("-to-");
    if (parts.length === 2) {
      localizedSource = parts[0].toUpperCase();
      localizedTarget = parts[1].toUpperCase();
    }
  }

  let localizedTitle = `${localizedAction} ${localizedSource || "File"} ${dict.to} ${localizedTarget || "PDF"} ${dict.onlineFree} | FileKit`;
  if (localizedSource && localizedTarget) {
    if (locale === "zh-CN" || locale === "zh-TW") {
      localizedTitle = `${localizedSource} ${dict.to} ${localizedTarget} ${localizedAction} (${dict.onlineFree}) | FileKit`;
    } else if (locale === "ja" || locale === "ko") {
      localizedTitle = `${localizedSource} ${localizedTarget} ${localizedAction} (${dict.onlineFree}) | FileKit`;
    } else {
      localizedTitle = `${localizedAction} ${localizedSource} ${dict.to} ${localizedTarget} ${dict.onlineFree} | FileKit`;
    }
  }

  const localizedDescription = `${localizedTitle.replace(/ \| FileKit$/, "")}. ${dict.privacyNotice}`;
  const canonicalUrl = buildCanonicalUrl(normSlug);

  return {
    title: localizedTitle,
    description: localizedDescription,
    h1: localizedTitle.replace(/ \| FileKit$/, ""),
    canonicalUrl,
    locale
  };
}

export function getHreflangLinks(slug: string): Array<{ hrefLang: string; href: string }> {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const links: Array<{ hrefLang: string; href: string }> = [];

  // Default x-default
  links.push({
    hrefLang: "x-default",
    href: buildCanonicalUrl(normSlug)
  });

  // All 39 supported locales
  for (const locale of Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]) {
    const localeConfig = SUPPORTED_LOCALES[locale];
    if (locale === "en") {
      links.push({
        hrefLang: localeConfig.hreflang,
        href: buildCanonicalUrl(normSlug)
      });
    } else {
      links.push({
        hrefLang: localeConfig.hreflang,
        href: buildCanonicalUrl(`/${locale}${normSlug}`)
      });
    }
  }

  return links;
}
