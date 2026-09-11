import os

content = """import { SupportedLocale, SUPPORTED_LOCALES, NON_DEFAULT_LOCALES } from "@/config/i18n/locales";
import { CONVERSION_CATALOG } from "@/config/conversionCatalog";
import { buildCanonicalUrl } from "@/utils/siteUrl";
import { PDF_COMPRESSION_ROUTES } from "@/config/pdfCompressionRoutes";
import { IMAGE_CONVERSION_ROUTES } from "@/config/imageConversionRoutes";

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
export const VERB_DICTIONARY: Record<SupportedLocale, VerbDictionaryEntry> = {
  en: { convert: "Convert", compress: "Compress", merge: "Merge", split: "Split", rotate: "Rotate", crop: "Crop", resize: "Resize", extract: "Extract", to: "to", from: "from", onlineFree: "Online Free", privacyNotice: "100% private in-browser processing with zero server uploads." },
  es: { convert: "Convertir", compress: "Comprimir", merge: "Unir", split: "Dividir", rotate: "Rotar", crop: "Recortar", resize: "Redimensionar", extract: "Extraer", to: "a", from: "desde", onlineFree: "Online Gratis", privacyNotice: "Procesamiento 100% privado en tu navegador sin subir archivos." },
  "es-419": { convert: "Convertir", compress: "Comprimir", merge: "Unir", split: "Dividir", rotate: "Rotar", crop: "Recortar", resize: "Redimensionar", extract: "Extraer", to: "a", from: "desde", onlineFree: "Gratis en Línea", privacyNotice: "Procesamiento 100% privado en tu navegador sin subir archivos a la nube." },
  de: { convert: "Konvertieren", compress: "Komprimieren", merge: "Zusammenfügen", split: "Trennen", rotate: "Drehen", crop: "Zuschneiden", resize: "Größe ändern", extract: "Extrahieren", to: "in", from: "von", onlineFree: "Kostenlos Online", privacyNotice: "100% private Verarbeitung direkt im Browser ohne Server-Upload." },
  fr: { convert: "Convertir", compress: "Compresser", merge: "Fusionner", split: "Diviser", rotate: "Faire pivoter", crop: "Rogner", resize: "Redimensionner", extract: "Extraire", to: "en", from: "de", onlineFree: "Gratuit en Ligne", privacyNotice: "Traitement 100% privé dans votre navigateur sans téléversement." },
  pt: { convert: "Converter", compress: "Comprimir", merge: "Juntar", split: "Dividir", rotate: "Girar", crop: "Cortar", resize: "Redimensionar", extract: "Extrair", to: "para", from: "de", onlineFree: "Grátis Online", privacyNotice: "Processamento 100% privado no navegador sem envio de ficheiros." },
  "pt-BR": { convert: "Converter", compress: "Comprimir", merge: "Juntar", split: "Dividir", rotate: "Girar", crop: "Cortar", resize: "Redimensionar", extract: "Extrair", to: "para", from: "de", onlineFree: "Grátis Online", privacyNotice: "Processamento 100% privado no navegador sem envio de arquivos para servidor." },
  it: { convert: "Converti", compress: "Comprimi", merge: "Unisci", split: "Dividi", rotate: "Ruota", crop: "Ritaglia", resize: "Ridimensiona", extract: "Estrai", to: "in", from: "da", onlineFree: "Gratis Online", privacyNotice: "Elaborazione 100% privata nel browser senza caricamento sul server." },
  nl: { convert: "Converteren", compress: "Comprimeren", merge: "Samenvoegen", split: "Splitsen", rotate: "Draaien", crop: "Bijsnijden", resize: "Formaat wijzigen", extract: "Uittrekken", to: "naar", from: "van", onlineFree: "Gratis Online", privacyNotice: "100% privé verwerking direct in de browser zonder uploads." },
  ca: { convert: "Convertir", compress: "Comprimir", merge: "Unir", split: "Dividir", rotate: "Girar", crop: "Retallar", resize: "Redimensionar", extract: "Extreure", to: "a", from: "de", onlineFree: "Online Gratuït", privacyNotice: "Processament 100% privat al navegador sense pujar fitxers." },
  sv: { convert: "Konvertera", compress: "Komprimera", merge: "Slå samman", split: "Dela upp", rotate: "Rotera", crop: "Beskär", resize: "Ändra storlek", extract: "Extrahera", to: "till", from: "från", onlineFree: "Gratis Online", privacyNotice: "100% privat bearbetning i webbläsaren utan uppladdning." },
  da: { convert: "Konverter", compress: "Komprimer", merge: "Sammenføj", split: "Opdel", rotate: "Roter", crop: "Beskær", resize: "Tilpas størrelse", extract: "Udpak", to: "til", from: "fra", onlineFree: "Gratis Online", privacyNotice: "100% privat behandling direkte i browseren uden uploads." },
  fi: { convert: "Muunna", compress: "Pakkaa", merge: "Yhdistä", split: "Jaa", rotate: "Käännä", crop: "Rajaa", resize: "Muuta kokoa", extract: "Pura", to: "muotoon", from: "muodosta", onlineFree: "Ilmaiseksi Verkossa", privacyNotice: "100% yksityinen käsittely suoraan selaimessa ilman tiedostojen lataamista." },
  no: { convert: "Konverter", compress: "Komprimer", merge: "Slå sammen", split: "Del opp", rotate: "Roter", crop: "Beskjær", resize: "Endre størrelse", extract: "Pakk ut", to: "til", from: "fra", onlineFree: "Gratis på Nett", privacyNotice: "100% privat behandling i nettleseren uten opplasting til server." },
  pl: { convert: "Konwertuj", compress: "Kompresuj", merge: "Połącz", split: "Podziel", rotate: "Obróć", crop: "Przytnij", resize: "Zmień rozmiar", extract: "Wyodrębnij", to: "na", from: "z", onlineFree: "Za Darmo Online", privacyNotice: "100% prywatne przetwarzanie w przeglądarce bez przesyłania plików na serwer." },
  cs: { convert: "Převést", compress: "Komprimovat", merge: "Sloučit", split: "Rozdělit", rotate: "Otočit", crop: "Oříznout", resize: "Změnit velikost", extract: "Extrahovat", to: "do", from: "z", onlineFree: "Zdarma Online", privacyNotice: "100% soukromé zpracování v prohlížeči bez nahrávání souborů na server." },
  hu: { convert: "Konvertálás", compress: "Tömörítés", merge: "Egyesítés", split: "Szétválasztás", rotate: "Forgatás", crop: "Körülvágás", resize: "Átméretezés", extract: "Kibontás", to: "formátumba", from: "formátumból", onlineFree: "Ingyen Online", privacyNotice: "100% privát feldolgozás közvetlenül a böngészőben fájlfeltöltés nélkül." },
  ro: { convert: "Convertește", compress: "Comprimă", merge: "Îmbină", split: "Împarte", rotate: "Rotește", crop: "Decupează", resize: "Redimensionează", extract: "Extrage", to: "în", from: "din", onlineFree: "Gratuit Online", privacyNotice: "Procesare 100% privată direct în browser fără încărcare pe server." },
  bg: { convert: "Конвертиране", compress: "Компресиране", merge: "Обединяване", split: "Разделяне", rotate: "Завъртане", crop: "Изрязване", resize: "Преоразмеряване", extract: "Извличане", to: "в", from: "от", onlineFree: "Безплатно Онлайн", privacyNotice: "100% сигурна обработка в браузъра без качване на файлове." },
  el: { convert: "Μετατροπή", compress: "Συμπίεση", merge: "Συγχώνευση", split: "Διαχωρισμός", rotate: "Περιστροφή", crop: "Περικοπή", resize: "Αλλαγή μεγέθους", extract: "Εξαγωγή", to: "σε", from: "από", onlineFree: "Δωρεάν Online", privacyNotice: "100% ιδιωτική επεξεργασία στο πρόγραμμα περιήγησης χωρίς ανέβασμα." },
  sk: { convert: "Konvertovať", compress: "Komprimovať", merge: "Zlúčiť", split: "Rozdeliť", rotate: "Otočiť", crop: "Orezať", resize: "Zmeniť veľkosť", extract: "Extrahovať", to: "do", from: "z", onlineFree: "Zadarmo Online", privacyNotice: "100% súkromné spracovanie priamo v prehliadači bez nahrávania na server." },
  sl: { convert: "Pretvori", compress: "Stisni", merge: "Združi", split: "Razdeli", rotate: "Zavrti", crop: "Obreži", resize: "Spremeni velikost", extract: "Izvozi", to: "v", from: "iz", onlineFree: "Brezplačno na Spletu", privacyNotice: "100% zasebna obdelava v brskalniku brez nalaganja na strežnik." },
  ru: { convert: "Конвертировать", compress: "Сжать", merge: "Объединить", split: "Разделить", rotate: "Повернуть", crop: "Обрезать", resize: "Изменить размер", extract: "Извлечь", to: "в", from: "из", onlineFree: "Бесплатно Онлайн", privacyNotice: "100% конфиденциальная обработка в браузере без загрузки на сервер." },
  uk: { convert: "Конвертувати", compress: "Стиснути", merge: "Об'єднати", split: "Розділити", rotate: "Повернути", crop: "Обрізати", resize: "Змінити розмір", extract: "Витягти", to: "в", from: "з", onlineFree: "Безкоштовно Онлайн", privacyNotice: "100% конфіденційна обробка в браузері без завантаження на сервер." },
  lv: { convert: "Konvertēt", compress: "Saspiest", merge: "Apvienot", split: "Sadalīt", rotate: "Pagriezt", crop: "Apgriezt", resize: "Mainīt izmēru", extract: "Izvilkt", to: "uz", from: "no", onlineFree: "Bezmaksas Tiešsaistē", privacyNotice: "100% privāta apstrāde pārlūkprogrammā bez failu augšupielādes." },
  lt: { convert: "Konvertuoti", compress: "Glaudinti", merge: "Sujungti", split: "Padalinti", rotate: "Pasukti", crop: "Apkarpyti", resize: "Keisti dydį", extract: "Išskleisti", to: "į", from: "iš", onlineFree: "Nemokamai Internete", privacyNotice: "100% privatus apdorojimas naršyklėje be failų įkėlimo į serverį." },
  tr: { convert: "Dönüştür", compress: "Sıkıştır", merge: "Birleştir", split: "Böl", rotate: "Döndür", crop: "Kırp", resize: "Yeniden Boyutlandır", extract: "Ayıkla", to: "→", from: "-", onlineFree: "Ücretsiz Çevrimiçi", privacyNotice: "%100 gizli tarayıcı içi işlem, sunucuya dosya yüklenmez." },
  ar: { convert: "تحويل", compress: "ضغط", merge: "دمج", split: "تقسيم", rotate: "تدوير", crop: "قص", resize: "تغيير الحجم", extract: "استخراج", to: "إلى", from: "من", onlineFree: "مجاناً أونلاين", privacyNotice: "معالجة خاصة 100% داخل المتصفح بدون رفع الملفات إلى أي خادم." },
  he: { convert: "המרת", compress: "דחיסת", merge: "מיזוג", split: "פיצול", rotate: "סיבוב", crop: "חיתוך", resize: "שינוי גודל", extract: "חילוץ", to: "ל-", from: "מ-", onlineFree: "בחינם אונליין", privacyNotice: "עיבוד פרטי ומאובטח 100% ישירות בדפדפן ללא העלאת קבצים לשרת." },
  hi: { convert: "कन्वर्ट करें", compress: "कंप्रेस करें", merge: "मर्ज करें", split: "विभाजित करें", rotate: "रोटेट करें", crop: "क्रॉप करें", resize: "रीसाइज़ करें", extract: "निकालें", to: "से", from: "को", onlineFree: "मुफ़्त ऑनलाइन", privacyNotice: "बिना किसी सर्वर अपलोड के सीधे ब्राउज़र में 100% निजी प्रोसेसिंग।" },
  id: { convert: "Konversi", compress: "Kompres", merge: "Gabungkan", split: "Pisahkan", rotate: "Putar", crop: "Pangkas", resize: "Ubah Ukuran", extract: "Ekstrak", to: "ke", from: "dari", onlineFree: "Gratis Online", privacyNotice: "Pemrosesan 100% pribadi di browser tanpa unggah file ke server." },
  ms: { convert: "Tukar", compress: "Mampatkan", merge: "Gabungkan", split: "Pisahkan", rotate: "Putar", crop: "Pangkas", resize: "Ubah Saiz", extract: "Ekstrak", to: "ke", from: "daripada", onlineFree: "Percuma Dalam Talian", privacyNotice: "Pemprosesan 100% peribadi dalam pelayar tanpa memuat naik ke pelayan." },
  th: { convert: "แปลงไฟล์", compress: "บีบอัด", merge: "รวมไฟล์", split: "แยกไฟล์", rotate: "หมุน", crop: "ครอบตัด", resize: "ปรับขนาด", extract: "แยกข้อมูล", to: "เป็น", from: "จาก", onlineFree: "ฟรีออนไลน์", privacyNotice: "ประมวลผลบนเบราว์เซอร์อย่างปลอดภัย 100% โดยไม่ต้องอัปโหลดไฟล์" },
  vi: { convert: "Chuyển đổi", compress: "Nén", merge: "Ghép", split: "Tách", rotate: "Xoay", crop: "Cắt", resize: "Đổi kích thước", extract: "Trích xuất", to: "sang", from: "từ", onlineFree: "Miễn phí Trực tuyến", privacyNotice: "Xử lý 100% riêng tư ngay trên trình duyệt mà không tải tệp lên máy chủ." },
  fil: { convert: "I-convert ang", compress: "I-compress ang", merge: "Pagsamahin ang", split: "Hatiin ang", rotate: "Iikot ang", crop: "I-crop ang", resize: "Baguhin ang laki ng", extract: "I-extract ang", to: "sa", from: "mula sa", onlineFree: "Libre Online", privacyNotice: "100% pribadong pagpoproseso sa browser nang walang pag-upload ng file." },
  ja: { convert: "変換", compress: "圧縮", merge: "結合", split: "分割", rotate: "回転", crop: "切り抜き", resize: "リサイズ", extract: "抽出", to: "から", from: "へ", onlineFree: "無料オンライン", privacyNotice: "ファイルをサーバーに送信せず、ブラウザ上で100%安全にローカル処理します。" },
  ko: { convert: "변환", compress: "압축", merge: "병합", split: "분할", rotate: "회전", crop: "자르기", resize: "크기 조정", extract: "추출", to: "에서", from: "으로", onlineFree: "무료 온라인", privacyNotice: "서버에 파일을 업로드하지 않고 브라우저 내에서 100% 안전하게 로컬 처리합니다。" },
  "zh-CN": { convert: "转换", compress: "压缩", merge: "合并", split: "拆分", rotate: "旋转", crop: "裁剪", resize: "调整大小", extract: "提取", to: "转", from: "从", onlineFree: "在线免费", privacyNotice: "100% 浏览器本地安全处理，零云端上传，全面保障隐私。" },
  "zh-TW": { convert: "轉換", compress: "壓縮", merge: "合併", split: "分割", rotate: "旋轉", crop: "裁切", resize: "調整大小", extract: "擷取", to: "轉", from: "從", onlineFree: "線上免費", privacyNotice: "100% 瀏覽器本機安全處理，無須上傳伺服器，嚴格保護個人隱私。" }
};

export const SPECIAL_PAGE_TITLES: Record<string, Record<SupportedLocale, string>> = {
  "/strip-exif": {
    en: "Strip Image EXIF Metadata Online Free",
    sv: "Ta bort EXIF- och GPS-metadata från bilder gratis online",
    da: "Fjern EXIF- og GPS-metadata fra billeder gratis online",
    fi: "Poista EXIF- ja GPS-metatiedot kuvista ilmaiseksi verkossa",
    no: "Fjern EXIF- og GPS-metadata fra bilder gratis på nett",
    de: "EXIF- und GPS-Metadaten aus Bildern entfernen Kostenlos Online",
    es: "Eliminar metadatos EXIF de imágenes Gratis en Línea",
    "es-419": "Eliminar metadatos EXIF de imágenes Gratis en Línea",
    fr: "Supprimer les métadonnées EXIF des images Gratuit en Ligne",
    it: "Rimuovere metadati EXIF dalle immagini Online Gratis",
    pt: "Remover metadados EXIF de imagens Grátis Online",
    "pt-BR": "Remover metadados EXIF de imagens Grátis Online",
    nl: "EXIF- en GPS-metadata uit afbeeldingen verwijderen Gratis online",
    ca: "Eliminar metadades EXIF d'imatges Gratis en Línia",
    pl: "Usuń metadane EXIF i GPS ze zdjęć Za darmo online",
    cs: "Odstranit metadata EXIF a GPS z obrázků Zdarma online",
    hu: "EXIF és GPS metaadatok eltávolítása képekből Ingyen online",
    ro: "Eliminați metadatele EXIF și GPS din imagini Gratuit online",
    bg: "Премахване на EXIF и GPS метаданни от изображения Безплатно онлайн",
    el: "Αφαίρεση μεταδεδομένων EXIF και GPS από εικόνες Δωρεάν online",
    sk: "Odstrániť metadáta EXIF a GPS z obrázkov Zadarmo online",
    sl: "Odstrani metapodatke EXIF in GPS iz slik Brezplačno na spletu",
    ru: "Удалить метаданные EXIF и GPS из фото Бесплатно онлайн",
    uk: "Видалити метадані EXIF та GPS із зображень Безкоштовно онлайн",
    lv: "Noņemt EXIF un GPS metadatus no attēliem Bezmaksas tiešsaistē",
    lt: "Pašalinti EXIF ir GPS metaduomenis iš nuotraukų Nemokamai internete",
    tr: "Fotoğraflardan EXIF ve GPS Meta Verilerini Kaldır Ücretsiz Çevrimiçi",
    ar: "إزالة بيانات EXIF و GPS من الصور مجاناً أونلاين",
    he: "הסרת מטא-דאטה EXIF ו-GPS מתמונות בחינם אונליין",
    hi: "तस्वीरों से EXIF और GPS मेटाडेटा हटाएं मुफ़्त ऑनलाइन",
    id: "Hapus Metadata EXIF dan GPS dari Gambar Gratis Online",
    ms: "Padam Metadata EXIF dan GPS dari Gambar Percuma Dalam Talian",
    th: "ลบข้อมูล EXIF และ GPS จากรูปภาพ ฟรีออนไลน์",
    vi: "Xóa siêu dữ liệu EXIF và GPS khỏi ảnh Miễn phí trực tuyến",
    fil: "Alisin ang EXIF at GPS metadata mula sa mga imahe Libre Online",
    ja: "写真からEXIFおよびGPS位置情報を削除 無料オンライン",
    ko: "이미지에서 EXIF 및 GPS 메타데이터 제거 무료 온라인",
    "zh-CN": "清除图片 EXIF 与 GPS 隐私元数据 在线免费",
    "zh-TW": "清除圖片 EXIF 與 GPS 隱私元資料 線上免費"
  },
  "/make-pdf-searchable": {
    en: "Make PDF Searchable (OCR) Online Free",
    sv: "Gör PDF sökbar (OCR) gratis online",
    da: "Gør PDF søgbar (OCR) gratis online",
    fi: "Tee PDF:stä haettava (OCR) ilmaiseksi verkossa",
    no: "Gjør PDF søkbar (OCR) gratis på nett",
    de: "PDF durchsuchbar machen (OCR) Kostenlos Online",
    es: "Hacer PDF buscable (OCR) Gratis en Línea",
    "es-419": "Hacer PDF con texto reconocible (OCR) Gratis en Línea",
    fr: "Rendre le PDF indexable (OCR) Gratuit en Ligne",
    it: "Rendi PDF ricercabile (OCR) Online Gratis",
    pt: "Tornar PDF pesquisável (OCR) Grátis Online",
    "pt-BR": "Tornar PDF pesquisável (OCR) Grátis Online",
    nl: "PDF doorzoekbaar maken (OCR) Gratis online",
    ca: "Fer PDF cercable (OCR) Gratis en Línia",
    pl: "Przekształć PDF na przeszukiwalny (OCR) Za darmo online",
    cs: "Převést PDF na prohledávatelné (OCR) Zdarma online",
    hu: "Kereshető PDF készítése (OCR) Ingyen online",
    ro: "Fă PDF-ul căutabil (OCR) Gratuit online",
    bg: "Направете PDF с възможност за търсене (OCR) Безплатно онлайн",
    el: "Κάντε το PDF με δυνατότητα αναζήτησης (OCR) Δωρεάν online",
    sk: "Urobte PDF prehľadávateľným (OCR) Zadarmo online",
    sl: "Naredite PDF iskalen (OCR) Brezplačno na spletu",
    ru: "Сделать PDF доступным для поиска (OCR) Бесплатно онлайн",
    uk: "Зробити PDF придатним для пошуку (OCR) Безкоштовно онлайн",
    lv: "Padarīt PDF meklējamu (OCR) Bezmaksas tiešsaistē",
    lt: "Padaryti PDF ieškomą (OCR) Nemokamai internete",
    tr: "PDF'i Aranabilir Yap (OCR) Ücretsiz Çevrimiçi",
    ar: "جعل ملف PDF قابلاً للبحث (OCR) مجاناً أونلاين",
    he: "הפיכת PDF לבר-חיפוש (OCR) בחינם אונליין",
    hi: "PDF को खोजने योग्य बनाएं (OCR) मुफ़्त ऑनलाइन",
    id: "Jadikan PDF Dapat Dicari (OCR) Gratis Online",
    ms: "Jadikan PDF Boleh Dicari (OCR) Percuma Dalam Talian",
    th: "ทำให้ PDF ค้นหาข้อความได้ (OCR) ฟรีออนไลน์",
    vi: "Tạo PDF có thể tìm kiếm (OCR) Miễn phí trực tuyến",
    fil: "Gawing mahahanap ang PDF (OCR) Libre Online",
    ja: "PDFを検索可能にする（OCRテキスト認識） 無料オンライン",
    ko: "PDF 검색 가능하게 만들기 (OCR 텍스트 인식) 무료 온라인",
    "zh-CN": "使 PDF 可搜索（OCR 文字识别） 在线免费",
    "zh-TW": "使 PDF 可搜尋（OCR 文字識別） 線上免費"
  },
  "/ocr-pdf": {
    en: "OCR PDF & Extract Text Online Free",
    sv: "OCR PDF och extrahera text gratis online",
    da: "OCR PDF og udtræk tekst gratis online",
    fi: "OCR PDF ja tekstintunnistus ilmaiseksi verkossa",
    no: "OCR PDF og pakk ut tekst gratis på nett",
    de: "OCR PDF & Texterkennung Kostenlos Online",
    es: "OCR PDF y Reconocimiento de Texto Gratis en Línea",
    "es-419": "OCR PDF y Reconocimiento de Texto Gratis en Línea",
    fr: "OCR PDF et Reconnaissance de texte Gratuit en Ligne",
    it: "OCR PDF e Riconoscimento testo Online Gratis",
    pt: "OCR PDF e Reconhecimento de texto Grátis Online",
    "pt-BR": "OCR PDF e Reconhecimento de texto Grátis Online",
    nl: "OCR PDF & Tekstherkenning Gratis online",
    ca: "OCR PDF i Reconeixement de text Gratis en Línia",
    pl: "OCR PDF i rozpoznawanie tekstu Za darmo online",
    cs: "OCR PDF a rozpoznávání textu Zdarma online",
    hu: "OCR PDF és szövegfelismerés Ingyen online",
    ro: "OCR PDF și recunoaștere text Gratuit online",
    bg: "OCR PDF и разпознаване на текст Безплатно онлайн",
    el: "OCR PDF και αναγνώριση κειμένου Δωρεάν online",
    sk: "OCR PDF a rozpoznávanie textu Zadarmo online",
    sl: "OCR PDF in prepoznavanje besedila Brezplačno na spletu",
    ru: "OCR PDF и распознавание текста Бесплатно онлайн",
    uk: "OCR PDF і розпізнавання тексту Безкоштовно онлайн",
    lv: "OCR PDF un teksta atpazīšana Bezmaksas tiešsaistē",
    lt: "OCR PDF ir teksto atpažinimas Nemokamai internete",
    tr: "OCR PDF ve Metin Tanıma Ücretsiz Çevrimiçi",
    ar: "التعرف الضوئي على الحروف PDF (OCR) مجاناً أونلاين",
    he: "זיהוי תווים אופטי PDF (OCR) בחינם אונליין",
    hi: "PDF OCR और टेक्स्ट पहचान मुफ़्त ऑनलाइन",
    id: "OCR PDF & Pengenalan Teks Gratis Online",
    ms: "OCR PDF & Pengecaman Teks Percuma Dalam Talian",
    th: "OCR PDF และแปลงภาพเป็นข้อความ ฟรีออนไลน์",
    vi: "OCR PDF & Nhận diện văn bản Miễn phí trực tuyến",
    fil: "OCR PDF at Pagkuha ng Teksto Libre Online",
    ja: "PDFのOCR処理（文字認識） 無料オンライン",
    ko: "PDF OCR 텍스트 인식 변환 무료 온라인",
    "zh-CN": "PDF OCR 文字识别 在线免费",
    "zh-TW": "PDF OCR 文字識別 線上免費"
  },
  "/reverse-pdf": {
    en: "Reverse PDF Page Order Online Free",
    sv: "Vänd sidordning i PDF gratis online",
    da: "Omvend PDF-siderækkefølge gratis online",
    fi: "Käännä PDF:n sivujärjestys ilmaiseksi verkossa",
    no: "Omvend PDF-siderekkefølge gratis på nett",
    de: "PDF-Seitenreihenfolge umkehren Kostenlos Online",
    es: "Invertir el orden de las páginas PDF Gratis en Línea",
    "es-419": "Invertir orden de páginas del PDF Gratis en Línea",
    fr: "Inverser l'ordre des pages PDF Gratuit en Ligne",
    it: "Inverti l'ordine delle pagine PDF Online Gratis",
    pt: "Inverter a ordem das páginas do PDF Grátis Online",
    "pt-BR": "Inverter a ordem das páginas do PDF Grátis Online",
    nl: "PDF-paginavolgorde omkeren Gratis online",
    ca: "Invertir l'ordre de les pàgines del PDF Gratis en Línia",
    pl: "Odwróć kolejność stron PDF Za darmo online",
    cs: "Obrátit pořadí stránek PDF Zdarma online",
    hu: "PDF oldalsorrend megfordítása Ingyen online",
    ro: "Inversează ordinea paginilor PDF Gratuit online",
    bg: "Обръщане на реда на страниците в PDF Безплатно онлайн",
    el: "Αντιστροφή σειράς σελίδων PDF Δωρεάν online",
    sk: "Obrátiť poradie strán PDF Zadarmo online",
    sl: "Obrni vrstni red strani v PDF Brezplačno na spletu",
    ru: "Обратный порядок страниц PDF Бесплатно онлайн",
    uk: "Зворотний порядок сторінок PDF Безкоштовно онлайн",
    lv: "Apgriezt PDF lapu secību Bezmaksas tiešsaistē",
    lt: "Apversti PDF puslapių tvarką Nemokamai internete",
    tr: "PDF Sayfa Sırasını Tersine Çevir Ücretsiz Çevrimiçi",
    ar: "عكس ترتيب صفحات PDF مجاناً أونلاين",
    he: "הפיכת סדר עמודי PDF בחינם אונליין",
    hi: "PDF पेज का क्रम उलटें मुफ़्त ऑनलाइन",
    id: "Balikkan Urutan Halaman PDF Gratis Online",
    ms: "Terbalikkan Susunan Halaman PDF Percuma Dalam Talian",
    th: "กลับลำดับหน้า PDF ฟรีออนไลน์",
    vi: "Đảo ngược thứ tự trang PDF Miễn phí trực tuyến",
    fil: "Baligtarin ang Pagkakasunod-sunod ng Pahina ng PDF Libre Online",
    ja: "PDFのページ順序を逆にする 無料オンライン",
    ko: "PDF 페이지 순서 뒤집기 무료 온라인",
    "zh-CN": "倒序排列 PDF 页面 在线免费",
    "zh-TW": "反轉 PDF 頁面順序 線上免費"
  },
  "/create-zip": {
    en: "Create ZIP Archive Online Free",
    sv: "Skapa ZIP-arkiv gratis online",
    da: "Opret ZIP-arkiv gratis online",
    fi: "Luo ZIP-arkisto ilmaiseksi verkossa",
    no: "Opprett ZIP-arkiv gratis på nett",
    de: "ZIP-Archiv erstellen Kostenlos Online",
    es: "Crear archivo ZIP Gratis en Línea",
    "es-419": "Crear archivo ZIP Gratis en Línea",
    fr: "Créer une archive ZIP Gratuit en Ligne",
    it: "Crea archivio ZIP Online Gratis",
    pt: "Criar arquivo ZIP Grátis Online",
    "pt-BR": "Criar arquivo ZIP Grátis Online",
    nl: "ZIP-archief maken Gratis online",
    ca: "Crear arxiu ZIP Gratis en Línia",
    pl: "Utwórz archiwum ZIP Za darmo online",
    cs: "Vytvořit archiv ZIP Zdarma online",
    hu: "ZIP archívum létrehozása Ingyen online",
    ro: "Creează arhivă ZIP Gratuit online",
    bg: "Създаване на ZIP архив Безплатно онлайн",
    el: "Δημιουργία αρχείου ZIP Δωρεάν online",
    sk: "Vytvoriť archív ZIP Zadarmo online",
    sl: "Ustvari arhiv ZIP Brezplačno na spletu",
    ru: "Создать ZIP-архив Бесплатно онлайн",
    uk: "Створити ZIP-архів Безкоштовно онлайн",
    lv: "Izveidot ZIP arhīvu Bezmaksas tiešsaistē",
    lt: "Sukurti ZIP archyvą Nemokamai internete",
    tr: "ZIP Arşivi Oluştur Ücretsiz Çevrimiçi",
    ar: "إنشاء أرشيف ZIP مجاناً أونلاين",
    he: "יצירת ארכיון ZIP בחינם אונליין",
    hi: "ZIP आर्काइव बनाएं मुफ़्त ऑनलाइन",
    id: "Buat Arsip ZIP Gratis Online",
    ms: "Cipta Arkib ZIP Percuma Dalam Talian",
    th: "สร้างไฟล์ ZIP บีบอัด ฟรีออนไลน์",
    vi: "Tạo tệp nén ZIP Miễn phí trực tuyến",
    fil: "Gumawa ng ZIP Archive Libre Online",
    ja: "ZIP圧縮アーカイブを作成 無料オンライン",
    ko: "ZIP 압축 파일 생성 무료 온라인",
    "zh-CN": "创建 ZIP 压缩包 在线免费",
    "zh-TW": "建立 ZIP 壓縮檔案 線上免費"
  },
  "/extract-zip": {
    en: "Extract ZIP Archive Online Free",
    sv: "Packa upp ZIP-arkiv gratis online",
    da: "Udpak ZIP-arkiv gratis online",
    fi: "Pura ZIP-arkisto ilmaiseksi verkossa",
    no: "Pakk ut ZIP-arkiv gratis på nett",
    de: "ZIP-Archiv entpacken Kostenlos Online",
    es: "Descomprimir archivo ZIP Gratis en Línea",
    "es-419": "Descomprimir archivo ZIP Gratis en Línea",
    fr: "Extraire une archive ZIP Gratuit en Ligne",
    it: "Estrai archivio ZIP Online Gratis",
    pt: "Descompactar arquivo ZIP Grátis Online",
    "pt-BR": "Descompactar arquivo ZIP Grátis Online",
    nl: "ZIP-archief uitpakken Gratis online",
    ca: "Descomprimir arxiu ZIP Gratis en Línia",
    pl: "Wypakuj archiwum ZIP Za darmo online",
    cs: "Rozbalit archiv ZIP Zdarma online",
    hu: "ZIP archívum kicsomagolása Ingyen online",
    ro: "Dezarhivează fișier ZIP Gratuit online",
    bg: "Разархивиране на ZIP архив Безплатно онлайн",
    el: "Αποσυμπίεση αρχείου ZIP Δωρεάν online",
    sk: "Rozbaliť archív ZIP Zadarmo online",
    sl: "Odpakiraj arhiv ZIP Brezplačno na spletu",
    ru: "Распаковать ZIP-архив Бесплатно онлайн",
    uk: "Розархівувати ZIP-архів Безкоштовно онлайн",
    lv: "Atspiest ZIP arhīvu Bezmaksas tiešsaistē",
    lt: "Išskleisti ZIP archyvą Nemokamai internete",
    tr: "ZIP Dosyasını Aç ve Çıkart Ücretsiz Çevrimiçi",
    ar: "فك ضغط ملفات ZIP مجاناً أونلاين",
    he: "חילוץ קבצי ZIP בחינם אונליין",
    hi: "ZIP फ़ाइल निकालें मुफ़्त ऑनलाइन",
    id: "Ekstrak File ZIP Gratis Online",
    ms: "Ekstrak Fail ZIP Percuma Dalam Talian",
    th: "แตกไฟล์ ZIP ออนไลน์ ฟรี",
    vi: "Giải nén tệp ZIP Miễn phí trực tuyến",
    fil: "I-extract ang ZIP Archive Libre Online",
    ja: "ZIPファイルを解凍・展開 無料オンライン",
    ko: "ZIP 압축 풀기 무료 온라인",
    "zh-CN": "解压 ZIP 压缩包 在线免费",
    "zh-TW": "解壓縮 ZIP 檔案 線上免費"
  },
  "/merge-pdf": {
    en: "Merge PDF Files Online Free",
    sv: "Slå samman PDF-filer gratis online",
    da: "Sammenføj PDF-filer gratis online",
    fi: "Yhdistä PDF-tiedostoja ilmaiseksi verkossa",
    no: "Slå sammen PDF-filer gratis på nett",
    de: "PDF-Dateien zusammenfügen Kostenlos Online",
    es: "Unir archivos PDF Gratis en Línea",
    "es-419": "Unir archivos PDF Gratis en Línea",
    fr: "Fusionner des fichiers PDF Gratuit en Ligne",
    it: "Unisci file PDF Online Gratis",
    pt: "Juntar ficheiros PDF Grátis Online",
    "pt-BR": "Juntar arquivos PDF Grátis Online",
    nl: "PDF-bestanden samenvoegen Gratis online",
    ca: "Unir fitxers PDF Gratis en Línia",
    pl: "Połącz pliki PDF Za darmo online",
    cs: "Sloučit soubory PDF Zdarma online",
    hu: "PDF fájlok egyesítése Ingyen online",
    ro: "Îmbină fișiere PDF Gratuit online",
    bg: "Обединяване на PDF файлове Безплатно онлайн",
    el: "Συγχώνευση αρχείων PDF Δωρεάν online",
    sk: "Zlúčiť súbory PDF Zadarmo online",
    sl: "Združi datoteke PDF Brezplačno na spletu",
    ru: "Объединить файлы PDF Бесплатно онлайн",
    uk: "Об'єднати файли PDF Безкоштовно онлайн",
    lv: "Apvienot PDF failus Bezmaksas tiešsaistē",
    lt: "Sujungti PDF failus Nemokamai internete",
    tr: "PDF Dosyalarını Birleştir Ücretsiz Çevrimiçi",
    ar: "دمج ملفات PDF مجاناً أونلاين",
    he: "מיזוג קבצי PDF בחינם אונליין",
    hi: "PDF फाइलें मर्ज करें मुफ़्त ऑनलाइन",
    id: "Gabungkan File PDF Gratis Online",
    ms: "Gabungkan Fail PDF Percuma Dalam Talian",
    th: "รวมไฟล์ PDF ฟรีออนไลน์",
    vi: "Ghép tệp PDF Miễn phí trực tuyến",
    fil: "Pagsamahin ang mga PDF File Libre Online",
    ja: "PDFファイルを結合 無料オンライン",
    ko: "PDF 파일 병합 무료 온라인",
    "zh-CN": "合并 PDF 文件 在线免费",
    "zh-TW": "合併 PDF 檔案 線上免費"
  },
  "/split-pdf": {
    en: "Split PDF Pages Online Free",
    sv: "Dela upp PDF-filer gratis online",
    da: "Opdel PDF-filer gratis online",
    fi: "Jaa PDF-tiedostoja ilmaiseksi verkossa",
    no: "Del opp PDF-filer gratis på nett",
    de: "PDF-Dateien trennen Kostenlos Online",
    es: "Dividir páginas PDF Gratis en Línea",
    "es-419": "Dividir páginas PDF Gratis en Línea",
    fr: "Diviser des pages PDF Gratuit en Ligne",
    it: "Dividi pagine PDF Online Gratis",
    pt: "Dividir páginas de PDF Grátis Online",
    "pt-BR": "Dividir páginas de PDF Grátis Online",
    nl: "PDF-pagina's splitsen Gratis online",
    ca: "Dividir pàgines PDF Gratis en Línia",
    pl: "Podziel strony PDF Za darmo online",
    cs: "Rozdělit stránky PDF Zdarma online",
    hu: "PDF oldalak szétválasztása Ingyen online",
    ro: "Împarte pagini PDF Gratuit online",
    bg: "Разделяне на страници в PDF Безплатно онлайн",
    el: "Διαχωρισμός σελίδων PDF Δωρεάν online",
    sk: "Rozdeliť stránky PDF Zadarmo online",
    sl: "Razdeli strani PDF Brezplačno na spletu",
    ru: "Разделить страницы PDF Бесплатно онлайн",
    uk: "Розділити сторінки PDF Безкоштовно онлайн",
    lv: "Sadalīt PDF lapas Bezmaksas tiešsaistē",
    lt: "Padalinti PDF puslapius Nemokamai internete",
    tr: "PDF Sayfalarını Böl Ücretsiz Çevrimiçi",
    ar: "تقسيم صفحات PDF مجاناً أونلاين",
    he: "פיצול עמודי PDF בחינם אונליין",
    hi: "PDF पेज विभाजित करें मुफ़्त ऑनलाइन",
    id: "Pisahkan Halaman PDF Gratis Online",
    ms: "Pisahkan Halaman PDF Percuma Dalam Talian",
    th: "แยกหน้าไฟล์ PDF ฟรีออนไลน์",
    vi: "Tách trang PDF Miễn phí trực tuyến",
    fil: "Hatiin ang mga Pahina ng PDF Libre Online",
    ja: "PDFページを分割 無料オンライン",
    ko: "PDF 페이지 분할 무료 온라인",
    "zh-CN": "拆分 PDF 页面 在线免费",
    "zh-TW": "分割 PDF 頁面 線上免費"
  },
  "/compress-pdf": {
    en: "Compress PDF Online Free",
    sv: "Komprimera PDF-filer gratis online",
    da: "Komprimer PDF-filer gratis online",
    fi: "Pakkaa PDF-tiedostoja ilmaiseksi verkossa",
    no: "Komprimer PDF-filer gratis på nett",
    de: "PDF-Dateien verkleinern Kostenlos Online",
    es: "Comprimir archivos PDF Gratis en Línea",
    "es-419": "Comprimir archivos PDF Gratis en Línea",
    fr: "Compresser des fichiers PDF Gratuit en Ligne",
    it: "Comprimi file PDF Online Gratis",
    pt: "Comprimir ficheiros PDF Grátis Online",
    "pt-BR": "Comprimir arquivos PDF Grátis Online",
    nl: "PDF-bestanden verkleinen Gratis online",
    ca: "Comprimir fitxers PDF Gratis en Línia",
    pl: "Kompresuj pliki PDF Za darmo online",
    cs: "Komprimovat soubory PDF Zdarma online",
    hu: "PDF fájlok tömörítése Ingyen online",
    ro: "Comprimă fișiere PDF Gratuit online",
    bg: "Компресиране на PDF файлове Безплатно онлайн",
    el: "Συμπίεση αρχείων PDF Δωρεάν online",
    sk: "Komprimovať súbory PDF Zadarmo online",
    sl: "Stisni datoteke PDF Brezplačno na spletu",
    ru: "Сжать файлы PDF Бесплатно онлайн",
    uk: "Стиснути файли PDF Безкоштовно онлайн",
    lv: "Saspiest PDF failus Bezmaksas tiešsaistē",
    lt: "Glaudinti PDF failus Nemokamai internete",
    tr: "PDF Dosyalarını Sıkıştır Ücretsiz Çevrimiçi",
    ar: "ضغط ملفات PDF مجاناً أونلاين",
    he: "דחיסת קבצי PDF בחינם אונליין",
    hi: "PDF फाइल कंप्रेस करें मुफ़्त ऑनलाइन",
    id: "Kompres File PDF Gratis Online",
    ms: "Mampatkan Fail PDF Percuma Dalam Talian",
    th: "บีบอัดไฟล์ PDF ฟรีออนไลน์",
    vi: "Nén tệp PDF Miễn phí trực tuyến",
    fil: "I-compress ang mga PDF File Libre Online",
    ja: "PDFファイルを圧縮 無料オンライン",
    ko: "PDF 파일 압축 무료 온라인",
    "zh-CN": "压缩 PDF 文件 在线免费",
    "zh-TW": "壓縮 PDF 檔案 線上免費"
  },
  "/resize-image": {
    en: "Resize Image Online Free",
    sv: "Ändra bildstorlek gratis online",
    da: "Tilpas billedstørrelse gratis online",
    fi: "Muuta kuvan kokoa ilmaiseksi verkossa",
    no: "Endre bildestørrelse gratis på nett",
    de: "Bildgröße ändern Kostenlos Online",
    es: "Cambiar tamaño de imagen Gratis en Línea",
    "es-419": "Cambiar tamaño de imagen Gratis en Línea",
    fr: "Redimensionner une image Gratuit en Ligne",
    it: "Ridimensiona immagine Online Gratis",
    pt: "Redimensionar imagem Grátis Online",
    "pt-BR": "Redimensionar imagem Grátis Online",
    nl: "Afbeelding verkleinen of vergroten Gratis online",
    ca: "Redimensionar imatge Gratis en Línia",
    pl: "Zmień rozmiar obrazu Za darmo online",
    cs: "Změnit velikost obrázku Zdarma online",
    hu: "Képméret módosítása Ingyen online",
    ro: "Redimensionează imaginea Gratuit online",
    bg: "Преоразмеряване на изображение Безплатно онлайн",
    el: "Αλλαγή μεγέθους εικόνας Δωρεάν online",
    sk: "Zmeniť veľkosť obrázka Zadarmo online",
    sl: "Spremeni velikost slike Brezplačno na spletu",
    ru: "Изменить размер фото Бесплатно онлайн",
    uk: "Змінити розмір зображення Безкоштовно онлайн",
    lv: "Mainīt attēla izmēru Bezmaksas tiešsaistē",
    lt: "Keisti nuotraukos dydį Nemokamai internete",
    tr: "Görsel Boyutunu Değiştir Ücretsiz Çevrimiçi",
    ar: "تغيير حجم الصور مجاناً أونلاين",
    he: "שינוי גודל תמונה בחינם אונליין",
    hi: "इमेज का आकार बदलें मुफ़्त ऑनलाइन",
    id: "Ubah Ukuran Gambar Gratis Online",
    ms: "Ubah Saiz Imej Percuma Dalam Talian",
    th: "ปรับขนาดรูปภาพ ฟรีออนไลน์",
    vi: "Thay đổi kích thước ảnh Miễn phí trực tuyến",
    fil: "Baguhin ang Laki ng Imahe Libre Online",
    ja: "画像サイズを変更・リサイズ 無料オンライン",
    ko: "이미지 크기 조절 리사이즈 무료 온라인",
    "zh-CN": "修改图片尺寸大小 在线免费",
    "zh-TW": "調整圖片尺寸大小 線上免費"
  }
};

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
  const dict = VERB_DICTIONARY[locale] || VERB_DICTIONARY.en;

  // 1. Direct hit on special page titles dictionary
  if (SPECIAL_PAGE_TITLES[normSlug]) {
    const titleText = SPECIAL_PAGE_TITLES[normSlug][locale] || SPECIAL_PAGE_TITLES[normSlug].en;
    const localizedTitle = `${titleText} | FileKit`;
    const localizedDescription = `${titleText}. ${dict.privacyNotice}`;
    return {
      title: localizedTitle,
      description: localizedDescription,
      h1: titleText,
      canonicalUrl: buildCanonicalUrl(normSlug),
      locale
    };
  }

  const tool = CONVERSION_CATALOG[normSlug];

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

  let englishTitle = "";
  if (tool.inputFormat && tool.outputFormat && tool.inputFormat !== tool.outputFormat) {
    englishTitle = `Convert ${tool.inputFormat} to ${tool.outputFormat} Online Free`;
  } else {
    // Single operation or same-format transformation
    let action = "Convert";
    let noun = tool.inputFormat || "PDF";
    if (normSlug.startsWith("/compress-")) action = "Compress";
    else if (normSlug.startsWith("/merge-")) action = "Merge";
    else if (normSlug.startsWith("/split-")) action = "Split";
    else if (normSlug.startsWith("/rotate-")) action = "Rotate";
    else if (normSlug.startsWith("/watermark-")) action = "Watermark";
    else if (normSlug.startsWith("/crop-")) action = "Crop";
    else if (normSlug.startsWith("/resize-")) action = "Resize";
    else if (normSlug.startsWith("/extract-")) action = "Extract";
    else if (normSlug.startsWith("/delete-")) action = "Delete";
    else if (normSlug.startsWith("/reorder-")) action = "Reorder";
    else if (normSlug.startsWith("/flatten-")) action = "Flatten";
    else if (normSlug.startsWith("/ocr-")) action = "OCR";
    else if (normSlug.startsWith("/sign-")) action = "Sign";

    if (normSlug === "/rotate-pdf-pages") englishTitle = "Rotate PDF Pages Online Free";
    else if (normSlug === "/delete-pdf-pages") englishTitle = "Delete PDF Pages Online Free";
    else if (normSlug === "/extract-pdf-pages") englishTitle = "Extract PDF Pages Online Free";
    else if (normSlug === "/reorder-pdf-pages") englishTitle = "Reorder PDF Pages Online Free";
    else if (normSlug === "/add-blank-page-to-pdf") englishTitle = "Add Blank Page to PDF Online Free";
    else if (normSlug === "/duplicate-pdf-pages") englishTitle = "Duplicate PDF Pages Online Free";
    else if (normSlug === "/make-pdf-searchable") englishTitle = "Make PDF Searchable Online Free";
    else if (normSlug === "/reverse-pdf") englishTitle = "Reverse PDF Online Free";
    else if (normSlug === "/boost-audio-volume") englishTitle = "Boost Audio Volume Online Free";
    else if (normSlug === "/change-video-speed") englishTitle = "Change Video Speed Online Free";
    else if (normSlug === "/mute-video") englishTitle = "Mute Video Online Free";
    else if (normSlug === "/trim-video") englishTitle = "Trim Video Online Free";
    else if (normSlug === "/trim-audio") englishTitle = "Trim Audio Online Free";
    else if (normSlug === "/merge-audio") englishTitle = "Merge Audio Online Free";
    else if (normSlug === "/compress-video") englishTitle = "Compress Video Online Free";
    else if (normSlug === "/compress-audio") englishTitle = "Compress Audio Online Free";
    else if (normSlug === "/compress-image") englishTitle = "Compress Image Online Free";
    else if (normSlug === "/blur-image") englishTitle = "Blur Image Online Free";
    else if (normSlug === "/grayscale-image") englishTitle = "Grayscale Image Online Free";
    else if (normSlug === "/invert-image") englishTitle = "Invert Image Online Free";
    else if (normSlug === "/flip-image") englishTitle = "Flip Image Online Free";
    else if (normSlug === "/create-zip") englishTitle = "Create ZIP Archive Online Free";
    else if (normSlug === "/extract-zip") englishTitle = "Extract ZIP Archive Online Free";
    else if (normSlug === "/extract-rar") englishTitle = "Extract RAR Archive Online Free";
    else if (normSlug === "/strip-exif") englishTitle = "Strip Image EXIF Metadata Online Free";
    else {
      englishTitle = `${action} ${noun} Online Free`;
    }
  }

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
  if (normSlug.includes("-to-")) {
    const parts = normSlug.replace(/^\//, "").split("-to-");
    if (parts.length === 2) {
      localizedSource = parts[0].toUpperCase();
      localizedTarget = parts[1].toUpperCase();
    }
  }

  let localizedTitle = "";
  if (localizedSource && localizedTarget && localizedSource !== localizedTarget) {
    if (locale === "zh-CN" || locale === "zh-TW") {
      localizedTitle = `${localizedSource} ${dict.to} ${localizedTarget} ${localizedAction} (${dict.onlineFree}) | FileKit`;
    } else if (locale === "ja" || locale === "ko") {
      localizedTitle = `${localizedSource} ${localizedTarget} ${localizedAction} (${dict.onlineFree}) | FileKit`;
    } else if (locale === "de") {
      const verb = localizedAction.charAt(0).toLowerCase() + localizedAction.slice(1);
      localizedTitle = `${localizedSource} in ${localizedTarget} ${verb} ${dict.onlineFree} | FileKit`;
    } else {
      localizedTitle = `${localizedAction} ${localizedSource} ${dict.to} ${localizedTarget} ${dict.onlineFree} | FileKit`;
    }
  } else {
    // Single format operation (e.g. /merge-pdf, /compress-pdf, /split-pdf, /rotate-pdf-pages)
    const NOUN_TRANSLATIONS: Record<string, Record<SupportedLocale, string>> = {
      image: {
        en: "Image", da: "Billede", sv: "Bild", fi: "Kuva", no: "Bilde", de: "Bild", es: "Imagen", "es-419": "Imagen", fr: "Image", it: "Immagine", pt: "Imagem", "pt-BR": "Imagem", nl: "Afbeelding", ca: "Imatge", pl: "Obraz", cs: "Obrázek", hu: "Kép", ro: "Imagine", bg: "Изображение", el: "Εικόνα", sk: "Obrázok", sl: "Slika", ru: "Изображение", uk: "Зображення", lv: "Attēls", lt: "Paveikslėlis", tr: "Görsel", ar: "الصورة", he: "תמונה", hi: "छवि", id: "Gambar", ms: "Imej", th: "รูปภาพ", vi: "Hình ảnh", fil: "Imahe", ja: "画像", ko: "이미지", "zh-CN": "图片", "zh-TW": "圖片"
      },
      pdf: {
        en: "PDF", da: "PDF", sv: "PDF", fi: "PDF", no: "PDF", de: "PDF", es: "PDF", "es-419": "PDF", fr: "PDF", it: "PDF", pt: "PDF", "pt-BR": "PDF", nl: "PDF", ca: "PDF", pl: "PDF", cs: "PDF", hu: "PDF", ro: "PDF", bg: "PDF", el: "PDF", sk: "PDF", sl: "PDF", ru: "PDF", uk: "PDF", lv: "PDF", lt: "PDF", tr: "PDF", ar: "PDF", he: "PDF", hi: "PDF", id: "PDF", ms: "PDF", th: "PDF", vi: "PDF", fil: "PDF", ja: "PDF", ko: "PDF", "zh-CN": "PDF", "zh-TW": "PDF"
      },
      video: {
        en: "Video", da: "Video", sv: "Video", fi: "Video", no: "Video", de: "Video", es: "Video", "es-419": "Video", fr: "Vidéo", it: "Video", pt: "Vídeo", "pt-BR": "Vídeo", nl: "Video", ca: "Vídeo", pl: "Wideo", cs: "Video", hu: "Videó", ro: "Video", bg: "Видео", el: "Βίντεο", sk: "Video", sl: "Video", ru: "Видео", uk: "Відео", lv: "Video", lt: "Vaizdo įrašas", tr: "Video", ar: "الفيديو", he: "וידאו", hi: "वीडियो", id: "Video", ms: "Video", th: "วิดีโอ", vi: "Video", fil: "Video", ja: "動画", ko: "동영상", "zh-CN": "视频", "zh-TW": "影片"
      },
      audio: {
        en: "Audio", da: "Lyd", sv: "Ljud", fi: "Ääni", no: "Lyd", de: "Audio", es: "Audio", "es-419": "Audio", fr: "Audio", it: "Audio", pt: "Áudio", "pt-BR": "Áudio", nl: "Audio", ca: "Àudio", pl: "Audio", cs: "Audio", hu: "Hang", ro: "Audio", bg: "Аудио", el: "Ήχος", sk: "Audio", sl: "Zvok", ru: "Аудио", uk: "Аудіо", lv: "Audio", lt: "Garsas", tr: "Ses", ar: "الصوت", he: "אודיו", hi: "ऑडियो", id: "Audio", ms: "Audio", th: "เสียง", vi: "Âm thanh", fil: "Audio", ja: "音声", ko: "오디오", "zh-CN": "音频", "zh-TW": "音訊"
      },
      archive: {
        en: "Archive", da: "Arkiv", sv: "Arkiv", fi: "Arkisto", no: "Arkiv", de: "Archiv", es: "Archivo", "es-419": "Archivo", fr: "Archive", it: "Archivio", pt: "Arquivo", "pt-BR": "Arquivo", nl: "Archief", ca: "Arxiu", pl: "Archiwum", cs: "Archiv", hu: "Archívum", ro: "Arhivă", bg: "Архив", el: "Αρχείο", sk: "Archív", sl: "Arhiv", ru: "Архив", uk: "Архів", lv: "Arhīvs", lt: "Archyvas", tr: "Arşiv", ar: "الأرشيف", he: "ארכיון", hi: "आर्काइव", id: "Arsip", ms: "Arkib", th: "ไฟล์บีบอัด", vi: "Tệp nén", fil: "Archive", ja: "アーカイブ", ko: "압축 파일", "zh-CN": "压缩包", "zh-TW": "壓縮檔案"
      }
    };

    let nounKey = "pdf";
    if (normSlug.includes("image")) nounKey = "image";
    else if (normSlug.includes("video")) nounKey = "video";
    else if (normSlug.includes("audio")) nounKey = "audio";
    else if (normSlug.includes("zip") || normSlug.includes("rar") || normSlug.includes("7z") || normSlug.includes("tar")) nounKey = "archive";

    const noun = NOUN_TRANSLATIONS[nounKey]?.[locale] || NOUN_TRANSLATIONS[nounKey]?.en || "PDF";

    if (locale === "zh-CN" || locale === "zh-TW" || locale === "ja" || locale === "ko") {
      localizedTitle = `${noun} ${localizedAction} (${dict.onlineFree}) | FileKit`;
    } else if (locale === "de") {
      const verb = localizedAction.charAt(0).toLowerCase() + localizedAction.slice(1);
      localizedTitle = `${noun} ${verb} ${dict.onlineFree} | FileKit`;
    } else if (locale === "nl" || locale === "tr") {
      localizedTitle = `${noun} ${localizedAction} ${dict.onlineFree} | FileKit`;
    } else {
      localizedTitle = `${localizedAction} ${noun} ${dict.onlineFree} | FileKit`;
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

export function getLocalizedHref(href: string, language?: string): string {
  if (!href || href.startsWith("http") || !language || language === "en") {
    return href;
  }

  // Handle in-page anchors like "/#pricing" or "#pricing"
  if (href.startsWith("/#")) {
    return `/${language}${href.substring(1)}`;
  }
  if (href.startsWith("#")) {
    return `/${language}${href}`;
  }

  // Avoid double prefixing
  const normalized = href.startsWith("/") ? href : `/${href}`;
  if (normalized.startsWith(`/${language}/`) || normalized === `/${language}`) {
    return normalized;
  }

  return `/${language}${normalized}`;
}
"""

with open("src/utils/i18nHelper.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated i18nHelper.ts cleanly!")
