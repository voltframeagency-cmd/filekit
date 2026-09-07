import { SupportedLocale, SUPPORTED_LOCALES, NON_DEFAULT_LOCALES } from "@/config/i18n/locales";
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
    const baseName = pdfCfg?.navigationLabel || imgCfg?.navigationLabel || (locale === "bg" ? "Инструмент за файлове" : "File Tool");
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

    const localizedTitle = `${baseName} ${dict.onlineFree} | FileKit`;
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

  // Check exact specialized slug mappings across languages
  const EXACT_SLUG_TITLES: Record<string, Record<string, string>> = {
  "/compress-pdf-to-2mb": {
    "en": "Compress PDF to 2MB Online Free",
    "es": "Comprimir PDF a 2 MB Online Gratis",
    "es-419": "Comprimir PDF a 2 MB Online Gratis",
    "de": "PDF auf 2 MB komprimieren Kostenlos Online",
    "fr": "Compresser PDF à 2 Mo Gratuit en Ligne",
    "pt": "Comprimir PDF para 2 MB Grátis Online",
    "pt-BR": "Comprimir PDF para 2 MB Grátis Online",
    "it": "Comprimi PDF a 2 MB Gratis Online",
    "nl": "PDF naar 2 MB comprimeren Gratis Online",
    "ca": "Comprimir PDF a 2 MB Online Gratuït",
    "sv": "Komprimera PDF till 2 MB Gratis Online",
    "da": "Komprimer PDF til 2 MB Gratis Online",
    "fi": "Pakkaa PDF 2 megatavuun Ilmaiseksi Verkossa",
    "no": "Komprimer PDF til 2 MB Gratis på Nett",
    "pl": "Kompresuj PDF do 2 MB Za Darmo Online",
    "cs": "Komprimovat PDF na 2 MB Zdarma Online",
    "hu": "PDF tömörítése 2 MB-ra Ingyen Online",
    "ro": "Comprimă PDF la 2 MB Gratuit Online",
    "bg": "Компресиране на PDF до 2 MB Безплатно Онлайн",
    "el": "Συμπίεση PDF σε 2 MB Δωρεάν Online",
    "sk": "Komprimovať PDF na 2 MB Zadarmo Online",
    "sl": "Stisni PDF na 2 MB Brezplačno na Spletu",
    "ru": "Сжать PDF до 2 МБ Бесплатно Онлайн",
    "uk": "Стиснути PDF до 2 МБ Безкоштовно Онлайн",
    "lv": "Saspiest PDF līdz 2 MB Bezmaksas Tiešsaistē",
    "lt": "Glaudinti PDF iki 2 MB Nemokamai Internete",
    "tr": "PDF'i 2 MB Boyutuna Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط PDF إلى 2 ميغابايت مجاناً أونلاين",
    "he": "דחיסת PDF ל-2 MB בחינם אונליין",
    "hi": "PDF को 2 MB तक कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres PDF ke 2 MB Gratis Online",
    "ms": "Mampatkan PDF ke 2 MB Percuma Dalam Talian",
    "th": "บีบอัด PDF ให้เหลือ 2 MB ฟรีออนไลน์",
    "vi": "Nén PDF xuống 2 MB Miễn phí Trực tuyến",
    "fil": "I-compress ang PDF sa 2 MB Libre Online",
    "ja": "PDFを2MB以下に圧縮 無料オンライン",
    "ko": "PDF를 2MB로 압축 무료 온라인",
    "zh-CN": "将 PDF 压缩至 2MB 以内 在线免费",
    "zh-TW": "將 PDF 壓縮至 2MB 以內 免費線上"
  },
  "/compress-image-to-100kb": {
    "en": "Compress Image to 100KB Online Free",
    "es": "Comprimir imagen a 100 KB Online Gratis",
    "es-419": "Comprimir imagen a 100 KB Online Gratis",
    "de": "Bild auf 100 KB komprimieren Kostenlos Online",
    "fr": "Compresser l'image à 100 Ko Gratuit en Ligne",
    "pt": "Comprimir imagem para 100 KB Grátis Online",
    "pt-BR": "Comprimir imagem para 100 KB Grátis Online",
    "it": "Comprimi immagine a 100 KB Gratis Online",
    "nl": "Afbeelding naar 100 KB comprimeren Gratis Online",
    "ca": "Comprimir imatge a 100 KB Online Gratuït",
    "sv": "Komprimera bild till 100 KB Gratis Online",
    "da": "Komprimer billede til 100 KB Gratis Online",
    "fi": "Pakkaa kuva 100 kilotavuun Ilmaiseksi Verkossa",
    "no": "Komprimer bilde til 100 KB Gratis på Nett",
    "pl": "Kompresuj obraz do 100 KB Za Darmo Online",
    "cs": "Komprimovat obrázek na 100 KB Zdarma Online",
    "hu": "Kép tömörítése 100 KB-ra Ingyen Online",
    "ro": "Comprimă Imaginea la 100 KB Gratuit Online",
    "bg": "Компресиране на изображение до 100 KB Безплатно Онлайн",
    "el": "Συμπίεση εικόνας σε 100 KB Δωρεάν Online",
    "sk": "Komprimovať obrázok na 100 KB Zadarmo Online",
    "sl": "Stisni sliko na 100 KB Brezplačno na Spletu",
    "ru": "Сжать изображение до 100 КБ Бесплатно Онлайн",
    "uk": "Стиснути зображення до 100 КБ Безкоштовно Онлайн",
    "lv": "Saspiest attēlu līdz 100 KB Bezmaksas Tiešsaistē",
    "lt": "Glaudinti vaizdą iki 100 KB Nemokamai Internete",
    "tr": "Görseli 100 KB Boyutuna Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط الصورة إلى 100 كيلوبايت مجاناً أونلاين",
    "he": "דחיסת תמונה ל-100 KB בחינם אונליין",
    "hi": "इमेज को 100 KB तक कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres Gambar ke 100 KB Gratis Online",
    "ms": "Mampatkan Imej ke 100 KB Percuma Dalam Talian",
    "th": "บีบอัดรูปภาพให้เหลือ 100 KB ฟรีออนไลน์",
    "vi": "Nén ảnh xuống 100 KB Miễn phí Trực tuyến",
    "fil": "I-compress ang Larawan sa 100 KB Libre Online",
    "ja": "画像を100KB以下に圧縮 無料オンライン",
    "ko": "이미지를 100KB로 압축 무료 온라인",
    "zh-CN": "将图片压缩至 100KB 以内 在线免费",
    "zh-TW": "將圖片壓縮至 100KB 以內 免費線上"
  },
  "/compress-image-to-200kb": {
    "en": "Compress Image to 200KB Online Free",
    "es": "Comprimir imagen a 200 KB Online Gratis",
    "es-419": "Comprimir imagen a 200 KB Online Gratis",
    "de": "Bild auf 200 KB komprimieren Kostenlos Online",
    "fr": "Compresser l'image à 200 Ko Gratuit en Ligne",
    "pt": "Comprimir imagem para 200 KB Grátis Online",
    "pt-BR": "Comprimir imagem para 200 KB Grátis Online",
    "it": "Comprimi immagine a 200 KB Gratis Online",
    "nl": "Afbeelding naar 200 KB comprimeren Gratis Online",
    "ca": "Comprimir imatge a 200 KB Online Gratuït",
    "sv": "Komprimera bild till 200 KB Gratis Online",
    "da": "Komprimer billede til 200 KB Gratis Online",
    "fi": "Pakkaa kuva 200 kilotavuun Ilmaiseksi Verkossa",
    "no": "Komprimer bilde til 200 KB Gratis på Nett",
    "pl": "Kompresuj obraz do 200 KB Za Darmo Online",
    "cs": "Komprimovat obrázek na 200 KB Zdarma Online",
    "hu": "Kép tömörítése 200 KB-ra Ingyen Online",
    "ro": "Comprimă Imaginea la 200 KB Gratuit Online",
    "bg": "Компресиране на изображение до 200 KB Безплатно Онлайн",
    "el": "Συμπίεση εικόνας σε 200 KB Δωρεάν Online",
    "sk": "Komprimovať obrázok na 200 KB Zadarmo Online",
    "sl": "Stisni sliko na 200 KB Brezplačno na Spletu",
    "ru": "Сжать изображение до 200 КБ Бесплатно Онлайн",
    "uk": "Стиснути зображення до 200 КБ Безкоштовно Онлайн",
    "lv": "Saspiest attēlu līdz 200 KB Bezmaksas Tiešsaistē",
    "lt": "Glaudinti vaizdą iki 200 KB Nemokamai Internete",
    "tr": "Görseli 200 KB Boyutuna Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط الصورة إلى 200 كيلوبايت مجاناً أونلاين",
    "he": "דחיסת תמונה ל-200 KB בחינם אונליין",
    "hi": "इमेज को 200 KB तक कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres Gambar ke 200 KB Gratis Online",
    "ms": "Mampatkan Imej ke 200 KB Percuma Dalam Talian",
    "th": "บีบอัดรูปภาพให้เหลือ 200 KB ฟรีออนไลน์",
    "vi": "Nén ảnh xuống 200 KB Miễn phí Trực tuyến",
    "fil": "I-compress ang Larawan sa 200 KB Libre Online",
    "ja": "画像を200KB以下に圧縮 無料オンライン",
    "ko": "이미지를 200KB로 압축 무료 온라인",
    "zh-CN": "将图片压缩至 200KB 以内 在线免费",
    "zh-TW": "將圖片壓縮至 200KB 以內 免費線上"
  },
  "/compress-image-to-500kb": {
    "en": "Compress Image to 500KB Online Free",
    "es": "Comprimir imagen a 500 KB Online Gratis",
    "es-419": "Comprimir imagen a 500 KB Online Gratis",
    "de": "Bild auf 500 KB komprimieren Kostenlos Online",
    "fr": "Compresser l'image à 500 Ko Gratuit en Ligne",
    "pt": "Comprimir imagem para 500 KB Grátis Online",
    "pt-BR": "Comprimir imagem para 500 KB Grátis Online",
    "it": "Comprimi immagine a 500 KB Gratis Online",
    "nl": "Afbeelding naar 500 KB comprimeren Gratis Online",
    "ca": "Comprimir imatge a 500 KB Online Gratuït",
    "sv": "Komprimera bild till 500 KB Gratis Online",
    "da": "Komprimer billede til 500 KB Gratis Online",
    "fi": "Pakkaa kuva 500 kilotavuun Ilmaiseksi Verkossa",
    "no": "Komprimer bilde til 500 KB Gratis på Nett",
    "pl": "Kompresuj obraz do 500 KB Za Darmo Online",
    "cs": "Komprimovat obrázek na 500 KB Zdarma Online",
    "hu": "Kép tömörítése 500 KB-ra Ingyen Online",
    "ro": "Comprimă Imaginea la 500 KB Gratuit Online",
    "bg": "Компресиране на изображение до 500 KB Безплатно Онлайн",
    "el": "Συμπίεση εικόνας σε 500 KB Δωρεάν Online",
    "sk": "Komprimovať obrázok na 500 KB Zadarmo Online",
    "sl": "Stisni sliko na 500 KB Brezplačno na Spletu",
    "ru": "Сжать изображение до 500 КБ Бесплатно Онлайн",
    "uk": "Стиснути зображення до 500 КБ Безкоштовно Онлайн",
    "lv": "Saspiest attēlu līdz 500 KB Bezmaksas Tiešsaistē",
    "lt": "Glaudinti vaizdą iki 500 KB Nemokamai Internete",
    "tr": "Görseli 500 KB Boyutuna Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط الصورة إلى 500 كيلوبايت مجاناً أونلاين",
    "he": "דחיסת תמונה ל-500 KB בחינם אונליין",
    "hi": "इमेज को 500 KB तक कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres Gambar ke 500 KB Gratis Online",
    "ms": "Mampatkan Imej ke 500 KB Percuma Dalam Talian",
    "th": "บีบอัดรูปภาพให้เหลือ 500 KB ฟรีออนไลน์",
    "vi": "Nén ảnh xuống 500 KB Miễn phí Trực tuyến",
    "fil": "I-compress ang Larawan sa 500 KB Libre Online",
    "ja": "画像を500KB以下に圧縮 無料オンライン",
    "ko": "이미지를 500KB로 압축 무료 온라인",
    "zh-CN": "将图片压缩至 500KB 以内 在线免费",
    "zh-TW": "將圖片壓縮至 500KB 以內 免費線上"
  },
  "/compress-image-to-1mb": {
    "en": "Compress Image to 1MB Online Free",
    "es": "Comprimir imagen a 1 MB Online Gratis",
    "es-419": "Comprimir imagen a 1 MB Online Gratis",
    "de": "Bild auf 1 MB komprimieren Kostenlos Online",
    "fr": "Compresser l'image à 1 Mo Gratuit en Ligne",
    "pt": "Comprimir imagem para 1 MB Grátis Online",
    "pt-BR": "Comprimir imagem para 1 MB Grátis Online",
    "it": "Comprimi immagine a 1 MB Gratis Online",
    "nl": "Afbeelding naar 1 MB comprimeren Gratis Online",
    "ca": "Comprimir imatge a 1 MB Online Gratuït",
    "sv": "Komprimera bild till 1 MB Gratis Online",
    "da": "Komprimer billede til 1 MB Gratis Online",
    "fi": "Pakkaa kuva 1 megatavuun Ilmaiseksi Verkossa",
    "no": "Komprimer bilde til 1 MB Gratis på Nett",
    "pl": "Kompresuj obraz do 1 MB Za Darmo Online",
    "cs": "Komprimovat obrázek na 1 MB Zdarma Online",
    "hu": "Kép tömörítése 1 MB-ra Ingyen Online",
    "ro": "Comprimă Imaginea la 1 MB Gratuit Online",
    "bg": "Компресиране на изображение до 1 MB Безплатно Онлайн",
    "el": "Συμπίεση εικόνας σε 1 MB Δωρεάν Online",
    "sk": "Komprimovať obrázok na 1 MB Zadarmo Online",
    "sl": "Stisni sliko na 1 MB Brezplačno na Spletu",
    "ru": "Сжать изображение до 1 МБ Бесплатно Онлайн",
    "uk": "Стиснути зображення до 1 МБ Безкоштовно Онлайн",
    "lv": "Saspiest attēlu līdz 1 MB Bezmaksas Tiešsaistē",
    "lt": "Glaudinti vaizdą iki 1 MB Nemokamai Internete",
    "tr": "Görseli 1 MB Boyutuna Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط الصورة إلى 1 ميغابايت مجاناً أونلاين",
    "he": "דחיסת תמונה ל-1 MB בחינם אונליין",
    "hi": "इमेज को 1 MB तक कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres Gambar ke 1 MB Gratis Online",
    "ms": "Mampatkan Imej ke 1 MB Percuma Dalam Talian",
    "th": "บีบอัดรูปภาพให้เหลือ 1 MB ฟรีออนไลน์",
    "vi": "Nén ảnh xuống 1 MB Miễn phí Trực tuyến",
    "fil": "I-compress ang Larawan sa 1 MB Libre Online",
    "ja": "画像を1MB以下に圧縮 無料オンライン",
    "ko": "이미지를 1MB로 압축 무료 온라인",
    "zh-CN": "将图片压缩至 1MB 以内 在线免费",
    "zh-TW": "將圖片壓縮至 1MB 以內 免費線上"
  },
  "/blur-image": {
    "en": "Blur Image Online Free",
    "es": "Desenfocar imagen Online Gratis",
    "es-419": "Desenfocar imagen Online Gratis",
    "de": "Bild weichzeichnen Kostenlos Online",
    "fr": "Flouter l'image Gratuit en Ligne",
    "pt": "Desfocar imagem Grátis Online",
    "pt-BR": "Desfocar imagem Grátis Online",
    "it": "Sfoca immagine Gratis Online",
    "nl": "Afbeelding vervagen Gratis Online",
    "ca": "Desenfocar imatge Online Gratuït",
    "sv": "Gör bilden oskarp Gratis Online",
    "da": "Slør billede Gratis Online",
    "fi": "Sumenna kuva Ilmaiseksi Verkossa",
    "no": "Gjør bildet uskarpt Gratis på Nett",
    "pl": "Rozmyj obraz Za Darmo Online",
    "cs": "Rozostřit obrázek Zdarma Online",
    "hu": "Kép elmosása Ingyen Online",
    "ro": "Estompează Imaginea Gratuit Online",
    "bg": "Замъгляване на изображение Безплатно Онлайн",
    "el": "Θόλωμα εικόνας Δωρεάν Online",
    "sk": "Rozostriť obrázok Zadarmo Online",
    "sl": "Zamegli sliko Brezplačno na Spletu",
    "ru": "Размыть изображение Бесплатно Онлайн",
    "uk": "Розмити зображення Безкоштовно Онлайн",
    "lv": "Aizmiglot attēlu Bezmaksas Tiešsaistē",
    "lt": "Sulieti vaizdą Nemokamai Internete",
    "tr": "Görseli Bulanıklaştır Ücretsiz Çevrimiçi",
    "ar": "تعتيم الصورة مجاناً أونلاين",
    "he": "טשטוש תמונה בחינם אונליין",
    "hi": "इमेज ब्लर करें मुफ़्त ऑनलाइन",
    "id": "Kaburkan Gambar Gratis Online",
    "ms": "Kaburkan Imej Percuma Dalam Talian",
    "th": "เบลอรูปภาพ ฟรีออนไลน์",
    "vi": "Làm mờ ảnh Miễn phí Trực tuyến",
    "fil": "I-blur ang Larawan Libre Online",
    "ja": "画像をぼかす 無料オンライン",
    "ko": "이미지 블러 처리 무료 온라인",
    "zh-CN": "图片模糊处理 在线免费",
    "zh-TW": "圖片模糊處理 免費線上"
  },
  "/grayscale-image": {
    "en": "Grayscale Image Online Free",
    "es": "Convertir imagen a escala de grises Online Gratis",
    "es-419": "Convertir imagen a escala de grises Online Gratis",
    "de": "Bild in Graustufen umwandeln Kostenlos Online",
    "fr": "Convertir l'image en noir et blanc Gratuit en Ligne",
    "pt": "Converter imagem para escala de cinzentos Grátis Online",
    "pt-BR": "Converter imagem para escala de cinza Grátis Online",
    "it": "Converti immagine in scala di grigi Gratis Online",
    "nl": "Afbeelding naar grijswaarden Gratis Online",
    "ca": "Convertir imatge a escala de grisos Online Gratuït",
    "sv": "Gör bilden gråskalig Gratis Online",
    "da": "Lav gråtonebillede Gratis Online",
    "fi": "Muunna kuva harmaasävyiseksi Ilmaiseksi Verkossa",
    "no": "Gjør bilde om til gråtoner Gratis på Nett",
    "pl": "Zmień obraz na czarno-biały Za Darmo Online",
    "cs": "Převést obrázek do stupňů šedi Zdarma Online",
    "hu": "Fekete-fehér kép készítése Ingyen Online",
    "ro": "Transformă Imaginea în Tonuri de Gri Gratuit Online",
    "bg": "Черно-бяло изображение Безплатно Онлайн",
    "el": "Μετατροπή εικόνας σε κλίμακα του γκρι Δωρεάν Online",
    "sk": "Previesť obrázok na čiernobiely Zadarmo Online",
    "sl": "Spremeni sliko v sivine Brezplačno na Spletu",
    "ru": "Черно-белое изображение Бесплатно Онлайн",
    "uk": "Чорно-біле зображення Безкоштовно Онлайн",
    "lv": "Pārvērst attēlu pelēktoņos Bezmaksas Tiešsaistē",
    "lt": "Paversti vaizdą nespalvotu Nemokamai Internete",
    "tr": "Görseli Gri Tona Dönüştür Ücretsiz Çevrimiçi",
    "ar": "تحويل الصورة لتدرج رمادي مجاناً أونلاين",
    "he": "המרת תמונה לגווני אפור בחינם אונליין",
    "hi": "इमेज को ब्लैक एंड व्हाइट बनाएं मुफ़्त ऑनलाइन",
    "id": "Ubah Gambar ke Hitam Putih Gratis Online",
    "ms": "Tukar Imej ke Skala Kelabu Percuma Dalam Talian",
    "th": "แปลงภาพเป็นโทนขาวดำ ฟรีออนไลน์",
    "vi": "Chuyển ảnh sang đen trắng Miễn phí Trực tuyến",
    "fil": "Gawing Grayscale ang Larawan Libre Online",
    "ja": "画像を白黒・グレースケールに変換 無料オンライン",
    "ko": "이미지 흑백 그레이스케일 변환 무료 온라인",
    "zh-CN": "图片转黑白灰度 在线免费",
    "zh-TW": "圖片轉黑白灰階 免費線上"
  },
  "/invert-image": {
    "en": "Invert Image Online Free",
    "es": "Invertir colores de imagen Online Gratis",
    "es-419": "Invertir colores de imagen Online Gratis",
    "de": "Bildfarben invertieren Kostenlos Online",
    "fr": "Inverser les couleurs de l'image Gratuit en Ligne",
    "pt": "Inverter cores da imagem Grátis Online",
    "pt-BR": "Inverter cores da imagem Grátis Online",
    "it": "Inverti colori immagine Gratis Online",
    "nl": "Afbeelding kleuren omkeren Gratis Online",
    "ca": "Invertir colors de la imatge Online Gratuït",
    "sv": "Invertera bildfärger Gratis Online",
    "da": "Inverter billedfarver Gratis Online",
    "fi": "Käännä kuvan värit Ilmaiseksi Verkossa",
    "no": "Inverter bildefarger Gratis på Nett",
    "pl": "Odwróć kolory obrazu Za Darmo Online",
    "cs": "Invertovat barvy obrázku Zdarma Online",
    "hu": "Kép színeinek megfordítása Ingyen Online",
    "ro": "Inversează Culorile Imaginii Gratuit Online",
    "bg": "Инвертиране на цветовете на изображение Безплатно Онлайн",
    "el": "Αντιστροφή χρωμάτων εικόνας Δωρεάν Online",
    "sk": "Invertovať farby obrázka Zadarmo Online",
    "sl": "Invertiraj barve slike Brezplačno na Spletu",
    "ru": "Инвертировать цвета изображения Бесплатно Онлайн",
    "uk": "Інвертувати кольори зображення Безкоштовно Онлайн",
    "lv": "Invertēt attēla krāsas Bezmaksas Tiešsaistē",
    "lt": "Invertuoti vaizdo spalvas Nemokamai Internete",
    "tr": "Görsel Renklerini Tersine Çevir Ücretsiz Çevrimiçi",
    "ar": "عكس ألوان الصورة مجاناً أونلاين",
    "he": "היפוך צבעי תמונה בחינם אונליין",
    "hi": "इमेज के रंग उलटें मुफ़्त ऑनलाइन",
    "id": "Balikkan Warna Gambar Gratis Online",
    "ms": "Songsangkan Warna Imej Percuma Dalam Talian",
    "th": "กลับสีรูปภาพ ฟรีออนไลน์",
    "vi": "Đảo ngược màu ảnh Miễn phí Trực tuyến",
    "fil": "Baligtarin ang Kulay ng Larawan Libre Online",
    "ja": "画像のネガ反転・色反転 無料オンライン",
    "ko": "이미지 색상 반전 무료 온라인",
    "zh-CN": "图片颜色反转 在线免费",
    "zh-TW": "圖片色彩反轉 免費線上"
  },
  "/flip-image": {
    "en": "Flip Image Online Free",
    "es": "Voltear imagen Online Gratis",
    "es-419": "Voltear imagen Online Gratis",
    "de": "Bild spiegeln Kostenlos Online",
    "fr": "Retourner l'image Gratuit en Ligne",
    "pt": "Inverter imagem horizontalmente Grátis Online",
    "pt-BR": "Virar imagem horizontalmente Grátis Online",
    "it": "Capovolgi immagine Gratis Online",
    "nl": "Afbeelding spiegelen Gratis Online",
    "ca": "Voltejar imatge Online Gratuït",
    "sv": "Vänd bild Gratis Online",
    "da": "Spejlvend billede Gratis Online",
    "fi": "Käännä kuva Ilmaiseksi Verkossa",
    "no": "Speilvend bilde Gratis på Nett",
    "pl": "Przerzuć obraz Za Darmo Online",
    "cs": "Překlopit obrázek Zdarma Online",
    "hu": "Kép tükrözése Ingyen Online",
    "ro": "Întoarce Imaginea Gratuit Online",
    "bg": "Обръщане на изображение Безплатно Онлайн",
    "el": "Αναστροφή εικόνας Δωρεάν Online",
    "sk": "Preklopiť obrázok Zadarmo Online",
    "sl": "Zrcali sliko Brezplačno na Spletu",
    "ru": "Отразить изображение Бесплатно Онлайн",
    "uk": "Віддзеркалити зображення Безкоштовно Онлайн",
    "lv": "Apmest attēlu spoguļskatā Bezmaksas Tiešsaistē",
    "lt": "Apversti vaizdą veidrodiškai Nemokamai Internete",
    "tr": "Görseli Çevir Ücretsiz Çevrimiçi",
    "ar": "قلب الصورة مجاناً أونلاين",
    "he": "שיקוף תמונה בחינם אונליין",
    "hi": "इमेज फ्लिप करें मुफ़्त ऑनलाइन",
    "id": "Balik Gambar Secara Horizontal Gratis Online",
    "ms": "Balikkan Imej Secara Mendatar Percuma Dalam Talian",
    "th": "พลิกรูปภาพแนวนอน ฟรีออนไลน์",
    "vi": "Lật hình ảnh ngang Miễn phí Trực tuyến",
    "fil": "I-flip ang Larawan Libre Online",
    "ja": "画像を左右・上下反転 無料オンライン",
    "ko": "이미지 좌우/상하 반전 무료 온라인",
    "zh-CN": "图片水平/垂直翻转 在线免费",
    "zh-TW": "圖片水平/垂直翻轉 免費線上"
  },
  "/convert-audio": {
    "en": "Convert Audio Files Online Free",
    "es": "Convertir archivos de audio Online Gratis",
    "es-419": "Convertir archivos de audio Online Gratis",
    "de": "Audiodateien konvertieren Kostenlos Online",
    "fr": "Convertir des fichiers audio Gratuit en Ligne",
    "pt": "Converter ficheiros de áudio Grátis Online",
    "pt-BR": "Converter arquivos de áudio Grátis Online",
    "it": "Converti file audio Gratis Online",
    "nl": "Audiobestanden converteren Gratis Online",
    "ca": "Convertir fitxers d'àudio Online Gratuït",
    "sv": "Konvertera ljudfiler Gratis Online",
    "da": "Konverter lydfiler Gratis Online",
    "fi": "Muunna äänitiedostoja Ilmaiseksi Verkossa",
    "no": "Konverter lydfiler Gratis på Nett",
    "pl": "Konwertuj pliki audio Za Darmo Online",
    "cs": "Převést audio soubory Zdarma Online",
    "hu": "Hangfájlok konvertálása Ingyen Online",
    "ro": "Convertește Fișiere Audio Gratuit Online",
    "bg": "Конвертиране на аудио файлове Безплатно Онлайн",
    "el": "Μετατροπή αρχείων ήχου Δωρεάν Online",
    "sk": "Konvertovať audio súbory Zadarmo Online",
    "sl": "Pretvori zvočne datoteke Brezplačno na Spletu",
    "ru": "Конвертировать аудиофайлы Бесплатно Онлайн",
    "uk": "Конвертувати аудіофайли Безкоштовно Онлайн",
    "lv": "Konvertēt audio failus Bezmaksas Tiešsaistē",
    "lt": "Konvertuoti garso failus Nemokamai Internete",
    "tr": "Ses Dosyalarını Dönüştür Ücretsiz Çevrimiçi",
    "ar": "تحويل الملفات الصوتية مجاناً أونلاين",
    "he": "המרת קובצי אודיו בחינם אונליין",
    "hi": "ऑडियो फाइलें कन्वर्ट करें मुफ़्त ऑनलाइन",
    "id": "Konversi File Audio Gratis Online",
    "ms": "Tukar Fail Audio Percuma Dalam Talian",
    "th": "แปลงไฟล์เสียง ฟรีออนไลน์",
    "vi": "Chuyển đổi tệp âm thanh Miễn phí Trực tuyến",
    "fil": "I-convert ang mga Audio File Libre Online",
    "ja": "音声ファイルを変換 無料オンライン",
    "ko": "오디오 파일 변환 무료 온라인",
    "zh-CN": "音频格式转换 在线免费",
    "zh-TW": "音訊格式轉換 免費線上"
  },
  "/compress-video": {
    "en": "Compress Video Files Online Free",
    "es": "Comprimir archivos de video Online Gratis",
    "es-419": "Comprimir archivos de video Online Gratis",
    "de": "Videodateien komprimieren Kostenlos Online",
    "fr": "Compresser des fichiers vidéo Gratuit en Ligne",
    "pt": "Comprimir ficheiros de vídeo Grátis Online",
    "pt-BR": "Comprimir arquivos de vídeo Grátis Online",
    "it": "Comprimi file video Gratis Online",
    "nl": "Videobestanden comprimeren Gratis Online",
    "ca": "Comprimir fitxers de vídeo Online Gratuït",
    "sv": "Komprimera videofiler Gratis Online",
    "da": "Komprimer videofiler Gratis Online",
    "fi": "Pakkaa videotiedostoja Ilmaiseksi Verkossa",
    "no": "Komprimer videofiler Gratis på Nett",
    "pl": "Kompresuj pliki wideo Za Darmo Online",
    "cs": "Komprimovat video soubory Zdarma Online",
    "hu": "Videófájlok tömörítése Ingyen Online",
    "ro": "Comprimă Fișiere Video Gratuit Online",
    "bg": "Компресиране на видео файлове Безплатно Онлайн",
    "el": "Συμπίεση αρχείων βίντεο Δωρεάν Online",
    "sk": "Komprimovať video súbory Zadarmo Online",
    "sl": "Stisni video datoteke Brezplačno na Spletu",
    "ru": "Сжать видеофайлы Бесплатно Онлайн",
    "uk": "Стиснути відеофайли Безкоштовно Онлайн",
    "lv": "Saspiest video failus Bezmaksas Tiešsaistē",
    "lt": "Glaudinti vaizdo failus Nemokamai Internete",
    "tr": "Video Dosyalarını Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط ملفات الفيديو مجاناً أونلاين",
    "he": "דחיסת קובצי וידאו בחינם אונליין",
    "hi": "वीडियो फाइलें कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres File Video Gratis Online",
    "ms": "Mampatkan Fail Video Percuma Dalam Talian",
    "th": "บีบอัดไฟล์วิดีโอ ฟรีออนไลน์",
    "vi": "Nén tệp video Miễn phí Trực tuyến",
    "fil": "I-compress ang mga Video File Libre Online",
    "ja": "動画ファイルを圧縮 無料オンライン",
    "ko": "동영상 파일 압축 무료 온라인",
    "zh-CN": "视频文件压缩 在线免费",
    "zh-TW": "影片檔案壓縮 免費線上"
  },
  "/compress-audio": {
    "en": "Compress Audio Files Online Free",
    "es": "Comprimir archivos de audio Online Gratis",
    "es-419": "Comprimir archivos de audio Online Gratis",
    "de": "Audiodateien komprimieren Kostenlos Online",
    "fr": "Compresser des fichiers audio Gratuit en Ligne",
    "pt": "Comprimir ficheiros de áudio Grátis Online",
    "pt-BR": "Comprimir arquivos de áudio Grátis Online",
    "it": "Comprimi file audio Gratis Online",
    "nl": "Audiobestanden comprimeren Gratis Online",
    "ca": "Comprimir fitxers d'àudio Online Gratuït",
    "sv": "Komprimera ljudfiler Gratis Online",
    "da": "Komprimer lydfiler Gratis Online",
    "fi": "Pakkaa äänitiedostoja Ilmaiseksi Verkossa",
    "no": "Komprimer lydfiler Gratis på Nett",
    "pl": "Kompresuj pliki audio Za Darmo Online",
    "cs": "Komprimovat audio soubory Zdarma Online",
    "hu": "Hangfájlok tömörítése Ingyen Online",
    "ro": "Comprimă Fișiere Audio Gratuit Online",
    "bg": "Компресиране на аудио файлове Безплатно Онлайн",
    "el": "Συμπίεση αρχείων ήχου Δωρεάν Online",
    "sk": "Komprimovať audio súbory Zadarmo Online",
    "sl": "Stisni zvočne datoteke Brezplačno na Spletu",
    "ru": "Сжать аудиофайлы Бесплатно Онлайн",
    "uk": "Стиснути аудіофайли Безкоштовно Онлайн",
    "lv": "Saspiest audio failus Bezmaksas Tiešsaistē",
    "lt": "Glaudinti garso failus Nemokamai Internete",
    "tr": "Ses Dosyalarını Sıkıştır Ücretsiz Çevrimiçi",
    "ar": "ضغط ملفات الصوت مجاناً أونلاين",
    "he": "דחיסת קובצי אודיו בחינם אונליין",
    "hi": "ऑडियो फाइलें कंप्रेस करें मुफ़्त ऑनलाइन",
    "id": "Kompres File Audio Gratis Online",
    "ms": "Mampatkan Fail Audio Percuma Dalam Talian",
    "th": "บีบอัดไฟล์เสียง ฟรีออนไลน์",
    "vi": "Nén tệp âm thanh Miễn phí Trực tuyến",
    "fil": "I-compress ang mga Audio File Libre Online",
    "ja": "音声ファイルを圧縮 無料オンライン",
    "ko": "오디오 파일 압축 무료 온라인",
    "zh-CN": "音频文件压缩 在线免费",
    "zh-TW": "音訊檔案壓縮 免費線上"
  },
  "/merge-audio": {
    "en": "Merge Audio Files Online Free",
    "es": "Unir archivos de audio Online Gratis",
    "es-419": "Unir archivos de audio Online Gratis",
    "de": "Audiodateien zusammenfügen Kostenlos Online",
    "fr": "Fusionner des fichiers audio Gratuit en Ligne",
    "pt": "Juntar ficheiros de áudio Grátis Online",
    "pt-BR": "Juntar arquivos de áudio Grátis Online",
    "it": "Unisci file audio Gratis Online",
    "nl": "Audiobestanden samenvoegen Gratis Online",
    "ca": "Unir fitxers d'àudio Online Gratuït",
    "sv": "Slå samman ljudfiler Gratis Online",
    "da": "Sammenføj lydfiler Gratis Online",
    "fi": "Yhdistä äänitiedostot Ilmaiseksi Verkossa",
    "no": "Slå sammen lydfiler Gratis på Nett",
    "pl": "Połącz pliki audio Za Darmo Online",
    "cs": "Sloučit audio soubory Zdarma Online",
    "hu": "Hangfájlok egyesítése Ingyen Online",
    "ro": "Unește Fișiere Audio Gratuit Online",
    "bg": "Обединяване на аудио файлове Безплатно Онлайн",
    "el": "Συγχώνευση αρχείων ήχου Δωρεάν Online",
    "sk": "Zlúčiť audio súbory Zadarmo Online",
    "sl": "Združi zvočne datoteke Brezplačno na Spletu",
    "ru": "Объединить аудиофайлы Бесплатно Онлайн",
    "uk": "Об'єднати аудіофайли Безкоштовно Онлайн",
    "lv": "Apvienot audio failus Bezmaksas Tiešsaistē",
    "lt": "Sujungti garso failus Nemokamai Internete",
    "tr": "Ses Dosyalarını Birleştir Ücretsiz Çevrimiçi",
    "ar": "دمج ملفات الصوت مجاناً أونلاين",
    "he": "מיזוג קובצי אודיו בחינם אונליין",
    "hi": "ऑडियो फाइलें मर्ज करें मुफ़्त ऑनलाइन",
    "id": "Gabungkan File Audio Gratis Online",
    "ms": "Gabungkan Fail Audio Percuma Dalam Talian",
    "th": "รวมไฟล์เสียง ฟรีออนไลน์",
    "vi": "Ghép tệp âm thanh Miễn phí Trực tuyến",
    "fil": "Pagsamahin ang mga Audio File Libre Online",
    "ja": "音声ファイルを結合 無料オンライン",
    "ko": "오디오 파일 병합 무료 온라인",
    "zh-CN": "音频文件合并 在线免费",
    "zh-TW": "音訊檔案合併 免費線上"
  },
  "/extract-rar": {
    "en": "Extract RAR Online Free",
    "es": "Extraer RAR Online Gratis",
    "es-419": "Extraer RAR Online Gratis",
    "de": "RAR-Dateien kostenlos online entpacken",
    "fr": "Extraire RAR Gratuit en Ligne",
    "pt": "Extrair RAR Grátis Online",
    "pt-BR": "Extrair RAR Grátis Online",
    "it": "Estrai RAR Gratis Online",
    "nl": "RAR online gratis uitpakken",
    "ca": "Extreure RAR Online Gratuït",
    "sv": "Extrahera RAR Gratis Online",
    "da": "Udpak RAR Gratis Online",
    "fi": "Pura RAR Ilmaiseksi Verkossa",
    "no": "Pakk ut RAR Gratis på Nett",
    "pl": "Wypakuj RAR Za Darmo Online",
    "cs": "Rozbalit RAR Zdarma Online",
    "hu": "RAR kibontása Ingyen Online",
    "ro": "Extrage RAR Gratuit Online",
    "bg": "Разархивиране на RAR Безплатно Онлайн",
    "el": "Εξαγωγή αρχείων RAR Δωρεάν Online",
    "sk": "Rozbaliť RAR Zadarmo Online",
    "sl": "Razpakiraj RAR Brezplačno na Spletu",
    "ru": "Распаковать RAR Бесплатно Онлайн",
    "uk": "Розархівувати RAR Безкоштовно Онлайн",
    "lv": "Atspiest RAR arhīvu Bezmaksas Tiešsaistē",
    "lt": "Išskleisti RAR Nemokamai Internete",
    "tr": "RAR Dosyasını Aç Ücretsiz Çevrimiçi",
    "ar": "فك ضغط RAR مجاناً أونلاين",
    "he": "חילוץ קובצי RAR בחינם אונליין",
    "hi": "RAR फ़ाइलें निकालें मुफ़्त ऑनलाइन",
    "id": "Ekstrak RAR Gratis Online",
    "ms": "Nyahmampat RAR Percuma Dalam Talian",
    "th": "แตกไฟล์ RAR ฟรีออนไลน์",
    "vi": "Giải nén RAR Miễn phí Trực tuyến",
    "fil": "I-extract ang RAR Libre Online",
    "ja": "RAR解凍 無料オンライン",
    "ko": "RAR 압축 풀기 무료 온라인",
    "zh-CN": "在线解压 RAR 免费",
    "zh-TW": "線上解壓縮 RAR 免費"
  }
};

  if (EXACT_SLUG_TITLES[normSlug]) {
    const matched = EXACT_SLUG_TITLES[normSlug][locale] || EXACT_SLUG_TITLES[normSlug][locale.split("-")[0]] || EXACT_SLUG_TITLES[normSlug].en;
    const localizedTitle = `${matched} | FileKit`;
    const localizedDescription = `${matched}. ${dict.privacyNotice}`;
    return {
      title: localizedTitle,
      description: localizedDescription,
      h1: matched,
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
  if (normSlug.includes("-to-") && !normSlug.startsWith("/compress-")) {
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
      "image": {
            "en": "Image",
            "da": "Billede",
            "sv": "Bild",
            "fi": "Kuva",
            "no": "Bilde",
            "de": "Bild",
            "es": "Imagen",
            "es-419": "Imagen",
            "fr": "Image",
            "it": "Immagine",
            "pt": "Imagem",
            "pt-BR": "Imagem",
            "nl": "Afbeelding",
            "ca": "Imatge",
            "pl": "Obraz",
            "cs": "Obrázek",
            "hu": "Kép",
            "ro": "Imagine",
            "bg": "Изображение",
            "el": "Εικόνα",
            "sk": "Obrázok",
            "sl": "Slika",
            "ru": "Изображение",
            "uk": "Зображення",
            "lv": "Attēls",
            "lt": "Vaizdas",
            "tr": "Görsel",
            "ar": "الصورة",
            "he": "תמונה",
            "hi": "इमेज",
            "id": "Gambar",
            "ms": "Imej",
            "th": "รูปภาพ",
            "vi": "Hình ảnh",
            "fil": "Larawan",
            "ja": "画像",
            "ko": "이미지",
            "zh-CN": "图片",
            "zh-TW": "圖片"
      },
      "pdf": {
            "en": "PDF",
            "da": "PDF",
            "sv": "PDF",
            "fi": "PDF",
            "no": "PDF",
            "de": "PDF",
            "es": "PDF",
            "es-419": "PDF",
            "fr": "PDF",
            "it": "PDF",
            "pt": "PDF",
            "pt-BR": "PDF",
            "nl": "PDF",
            "ca": "PDF",
            "pl": "PDF",
            "cs": "PDF",
            "hu": "PDF",
            "ro": "PDF",
            "bg": "PDF",
            "el": "PDF",
            "sk": "PDF",
            "sl": "PDF",
            "ru": "PDF",
            "uk": "PDF",
            "lv": "PDF",
            "lt": "PDF",
            "tr": "PDF",
            "ar": "PDF",
            "he": "PDF",
            "hi": "PDF",
            "id": "PDF",
            "ms": "PDF",
            "th": "PDF",
            "vi": "PDF",
            "fil": "PDF",
            "ja": "PDF",
            "ko": "PDF",
            "zh-CN": "PDF",
            "zh-TW": "PDF"
      },
      "video": {
            "en": "Video",
            "da": "Video",
            "sv": "Video",
            "fi": "Video",
            "no": "Video",
            "de": "Video",
            "es": "Video",
            "es-419": "Video",
            "fr": "Vidéo",
            "it": "Video",
            "pt": "Vídeo",
            "pt-BR": "Vídeo",
            "nl": "Video",
            "ca": "Vídeo",
            "pl": "Wideo",
            "cs": "Video",
            "hu": "Videó",
            "ro": "Video",
            "bg": "Видео",
            "el": "Βίντεο",
            "sk": "Video",
            "sl": "Video",
            "ru": "Видео",
            "uk": "Відео",
            "lv": "Video",
            "lt": "Vaizdo įrašas",
            "tr": "Video",
            "ar": "الفيديو",
            "he": "וידאו",
            "hi": "वीडियो",
            "id": "Video",
            "ms": "Video",
            "th": "วิดีโอ",
            "vi": "Video",
            "fil": "Video",
            "ja": "動画",
            "ko": "동영상",
            "zh-CN": "视频",
            "zh-TW": "影片"
      },
      "audio": {
            "en": "Audio",
            "da": "Lyd",
            "sv": "Ljud",
            "fi": "Ääni",
            "no": "Lyd",
            "de": "Audio",
            "es": "Audio",
            "es-419": "Audio",
            "fr": "Audio",
            "it": "Audio",
            "pt": "Áudio",
            "pt-BR": "Áudio",
            "nl": "Audio",
            "ca": "Àudio",
            "pl": "Audio",
            "cs": "Audio",
            "hu": "Hang",
            "ro": "Audio",
            "bg": "Аудио",
            "el": "Ήχος",
            "sk": "Audio",
            "sl": "Zvok",
            "ru": "Аудио",
            "uk": "Аудіо",
            "lv": "Audio",
            "lt": "Garsas",
            "tr": "Ses",
            "ar": "الصوت",
            "he": "אודיו",
            "hi": "ऑडियो",
            "id": "Audio",
            "ms": "Audio",
            "th": "เสียง",
            "vi": "Âm thanh",
            "fil": "Audio",
            "ja": "音声",
            "ko": "오디오",
            "zh-CN": "音频",
            "zh-TW": "音訊"
      },
      "archive": {
            "en": "Archive",
            "da": "Arkiv",
            "sv": "Arkiv",
            "fi": "Arkisto",
            "no": "Arkiv",
            "de": "Archiv",
            "es": "Archivo",
            "es-419": "Archivo",
            "fr": "Archive",
            "it": "Archivio",
            "pt": "Arquivo",
            "pt-BR": "Arquivo",
            "nl": "Archief",
            "ca": "Arxiu",
            "pl": "Archiwum",
            "cs": "Archiv",
            "hu": "Archívum",
            "ro": "Arhivă",
            "bg": "Архив",
            "el": "Αρχείο",
            "sk": "Archív",
            "sl": "Arhiv",
            "ru": "Архив",
            "uk": "Архів",
            "lv": "Arhīvs",
            "lt": "Archyvas",
            "tr": "Arşiv",
            "ar": "الأرشيف",
            "he": "ארכיון",
            "hi": "आर्काइव",
            "id": "Arsip",
            "ms": "Arkib",
            "th": "ไฟล์บีบอัด",
            "vi": "Tệp nén",
            "fil": "Archive",
            "ja": "アーカイブ",
            "ko": "압축 파일",
            "zh-CN": "压缩包",
            "zh-TW": "壓縮檔案"
      },
      "word": {
            "en": "Word",
            "da": "Word",
            "sv": "Word",
            "fi": "Word",
            "no": "Word",
            "de": "Word",
            "es": "Word",
            "es-419": "Word",
            "fr": "Word",
            "it": "Word",
            "pt": "Word",
            "pt-BR": "Word",
            "nl": "Word",
            "ca": "Word",
            "pl": "Word",
            "cs": "Word",
            "hu": "Word",
            "ro": "Word",
            "bg": "Word",
            "el": "Word",
            "sk": "Word",
            "sl": "Word",
            "ru": "Word",
            "uk": "Word",
            "lv": "Word",
            "lt": "Word",
            "tr": "Word",
            "ar": "Word",
            "he": "Word",
            "hi": "Word",
            "id": "Word",
            "ms": "Word",
            "th": "Word",
            "vi": "Word",
            "fil": "Word",
            "ja": "Word",
            "ko": "Word",
            "zh-CN": "Word",
            "zh-TW": "Word"
      },
      "excel": {
            "en": "Excel",
            "da": "Excel",
            "sv": "Excel",
            "fi": "Excel",
            "no": "Excel",
            "de": "Excel",
            "es": "Excel",
            "es-419": "Excel",
            "fr": "Excel",
            "it": "Excel",
            "pt": "Excel",
            "pt-BR": "Excel",
            "nl": "Excel",
            "ca": "Excel",
            "pl": "Excel",
            "cs": "Excel",
            "hu": "Excel",
            "ro": "Excel",
            "bg": "Excel",
            "el": "Excel",
            "sk": "Excel",
            "sl": "Excel",
            "ru": "Excel",
            "uk": "Excel",
            "lv": "Excel",
            "lt": "Excel",
            "tr": "Excel",
            "ar": "Excel",
            "he": "Excel",
            "hi": "Excel",
            "id": "Excel",
            "ms": "Excel",
            "th": "Excel",
            "vi": "Excel",
            "fil": "Excel",
            "ja": "Excel",
            "ko": "Excel",
            "zh-CN": "Excel",
            "zh-TW": "Excel"
      },
      "powerpoint": {
            "en": "PowerPoint",
            "da": "PowerPoint",
            "sv": "PowerPoint",
            "fi": "PowerPoint",
            "no": "PowerPoint",
            "de": "PowerPoint",
            "es": "PowerPoint",
            "es-419": "PowerPoint",
            "fr": "PowerPoint",
            "it": "PowerPoint",
            "pt": "PowerPoint",
            "pt-BR": "PowerPoint",
            "nl": "PowerPoint",
            "ca": "PowerPoint",
            "pl": "PowerPoint",
            "cs": "PowerPoint",
            "hu": "PowerPoint",
            "ro": "PowerPoint",
            "bg": "PowerPoint",
            "el": "PowerPoint",
            "sk": "PowerPoint",
            "sl": "PowerPoint",
            "ru": "PowerPoint",
            "uk": "PowerPoint",
            "lv": "PowerPoint",
            "lt": "PowerPoint",
            "tr": "PowerPoint",
            "ar": "PowerPoint",
            "he": "PowerPoint",
            "hi": "PowerPoint",
            "id": "PowerPoint",
            "ms": "PowerPoint",
            "th": "PowerPoint",
            "vi": "PowerPoint",
            "fil": "PowerPoint",
            "ja": "PowerPoint",
            "ko": "PowerPoint",
            "zh-CN": "PowerPoint",
            "zh-TW": "PowerPoint"
      }
};

        let nounKey = "pdf";
    if (normSlug.includes("word") || normSlug.includes("docx") || normSlug.includes("doc")) nounKey = "word";
    else if (normSlug.includes("excel") || normSlug.includes("xlsx") || normSlug.includes("xls")) nounKey = "excel";
    else if (normSlug.includes("powerpoint") || normSlug.includes("pptx") || normSlug.includes("ppt")) nounKey = "powerpoint";
    else if (normSlug.includes("image") || normSlug.includes("png") || normSlug.includes("jpg") || normSlug.includes("jpeg") || normSlug.includes("webp") || normSlug.includes("avif") || normSlug.includes("heic") || normSlug.includes("bmp") || normSlug.includes("ico") || normSlug.includes("svg")) nounKey = "image";
    else if (normSlug.includes("video") || normSlug.includes("mp4") || normSlug.includes("mov") || normSlug.includes("webm") || normSlug.includes("avi") || normSlug.includes("mkv") || normSlug.includes("wmv")) nounKey = "video";
    else if (normSlug.includes("audio") || normSlug.includes("mp3") || normSlug.includes("wav") || normSlug.includes("m4a") || normSlug.includes("flac") || normSlug.includes("ogg")) nounKey = "audio";
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

const sortedLocales = [...NON_DEFAULT_LOCALES].sort((a, b) => b.length - a.length);
const localePattern = sortedLocales.map((l) => l.replace("-", "\\-")).join("|");
const LOCALE_PREFIX_REGEX = new RegExp(`^/(${localePattern})(/|$)`);

export function getLocalizedHref(href: string, language?: string): string {
  if (!href || href.startsWith("http")) {
    return href;
  }

  // Strip existing locale prefix if present
  const withoutLocale = href.replace(LOCALE_PREFIX_REGEX, "$2");
  const cleanHref = withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`;

  if (!language || language === "en") {
    return cleanHref === "" ? "/" : cleanHref;
  }

  // Handle in-page anchors like "/#pricing" or "#pricing"
  if (cleanHref.startsWith("/#")) {
    return `/${language}${cleanHref.substring(1)}`;
  }
  if (cleanHref.startsWith("#")) {
    return `/${language}${cleanHref}`;
  }

  return cleanHref === "/" ? `/${language}` : `/${language}${cleanHref}`;
}
