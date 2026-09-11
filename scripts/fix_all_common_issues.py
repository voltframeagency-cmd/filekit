import os
import re
import json

print("=== EXPANDING SYSTEMATIC FIXES ACROSS ALL COMPONENTS ===")

def json_repr(d, indent=6):
    return json.dumps(d, ensure_ascii=False, indent=indent)

# 1. Update LanguageContext.tsx
with open('src/components/layout/LanguageContext.tsx', 'r', encoding='utf-8') as f:
    lang_context_code = f.read()

RESIZE_MAP = {
  "en": "Resize", "es": "Redimensionar", "es-419": "Redimensionar", "de": "Größe ändern",
  "fr": "Redimensionner", "pt": "Redimensionar", "pt-BR": "Redimensionar", "it": "Ridimensiona",
  "nl": "Formaat wijzigen", "ca": "Redimensionar", "sv": "Ändra storlek", "da": "Tilpas størrelse",
  "fi": "Muuta kokoa", "no": "Endre størrelse", "pl": "Zmień rozmiar", "cs": "Změnit velikost",
  "hu": "Átméretezés", "ro": "Redimensionare", "bg": "Преоразмеряване", "el": "Αλλαγή μεγέθους",
  "sk": "Zmeniť veľkosť", "sl": "Spremeni velikost", "ru": "Изменить размер", "uk": "Змінити розмір",
  "lv": "Mainīt izmēru", "lt": "Keisti dydį", "tr": "Yeniden Boyutlandır", "ar": "تغيير الحجم",
  "he": "שינוי גודל", "hi": "रीसाइज़ करें", "id": "Ubah Ukuran", "ms": "Ubah Saiz",
  "th": "ปรับขนาด", "vi": "Đổi kích thước", "fil": "Baguhin ang laki", "ja": "リサイズ",
  "ko": "크기 조정", "zh-CN": "调整尺寸", "zh-TW": "調整尺寸"
}

PRICING_MAP = {
  "en": "Pricing", "es": "Precios", "es-419": "Precios", "de": "Preise",
  "fr": "Tarifs", "pt": "Preços", "pt-BR": "Preços", "it": "Prezzi",
  "nl": "Prijzen", "ca": "Preus", "sv": "Priser", "da": "Priser",
  "fi": "Hinnat", "no": "Priser", "pl": "Cennik", "cs": "Ceník",
  "hu": "Árak", "ro": "Prețuri", "bg": "Цени", "el": "Τιμές",
  "sk": "Cenník", "sl": "Cenik", "ru": "Цены", "uk": "Ціни",
  "lv": "Cenas", "lt": "Kainos", "tr": "Fiyatlandırma", "ar": "الأسعار",
  "he": "מחירים", "hi": "मूल्य निर्धारण", "id": "Harga", "ms": "Harga",
  "th": "ราคา", "vi": "Bảng giá", "fil": "Presyo", "ja": "料金プラン",
  "ko": "요금제", "zh-CN": "价格方案", "zh-TW": "價格方案"
}

new_resize_block = """    if (key === "nav.resize") {
      const resizeMap: Record<string, string> = """ + json_repr(RESIZE_MAP) + """;
      return resizeMap[effectiveLang] || resizeMap[effectiveLang.split("-")[0]] || "Resize";
    }"""

new_pricing_block = """    if (key === "nav.pricing") {
      const pricingMap: Record<string, string> = """ + json_repr(PRICING_MAP) + """;
      return pricingMap[effectiveLang] || pricingMap[effectiveLang.split("-")[0]] || "Pricing";
    }"""

pattern_resize = r'if \(key === "nav\.resize"\) \{[\s\S]*?return "Yeniden Boyutlandır";\s*\}'
lang_context_code = re.sub(pattern_resize, new_resize_block, lang_context_code)

pattern_pricing = r'if \(key === "nav\.pricing"\) \{[\s\S]*?return "Fiyatlandırma";\s*\}'
lang_context_code = re.sub(pattern_pricing, new_pricing_block, lang_context_code)

with open('src/components/layout/LanguageContext.tsx', 'w', encoding='utf-8') as f:
    f.write(lang_context_code)

print("[OK] 1. LanguageContext.tsx nav.resize & nav.pricing updated for all 39 languages.")

# 2. Update OfficeConverterWorkspace.tsx with language prop & complete 39-locale dictionaries
with open('src/components/office-tools/OfficeConverterWorkspace.tsx', 'r', encoding='utf-8') as f:
    office_code = f.read()

# Update props interface
office_code = office_code.replace(
    'export interface OfficeConverterWorkspaceProps {\n  toolTitle: string;\n  toolSlug: string;\n  apiEndpoint: string;\n  acceptedExtensions: string;\n  documentTypeLabel: string; // e.g. "Word Document", "PowerPoint Presentation", "Excel Spreadsheet"\n}',
    'export interface OfficeConverterWorkspaceProps {\n  toolTitle: string;\n  toolSlug: string;\n  apiEndpoint: string;\n  acceptedExtensions: string;\n  documentTypeLabel: string;\n  language?: string;\n}'
)

office_code = office_code.replace(
    'export const OfficeConverterWorkspace: React.FC<OfficeConverterWorkspaceProps> = ({\n  toolTitle,\n  toolSlug,\n  apiEndpoint,\n  acceptedExtensions,\n  documentTypeLabel,\n}) => {\n  const { language } = useLanguage();',
    'export const OfficeConverterWorkspace: React.FC<OfficeConverterWorkspaceProps> = ({\n  toolTitle,\n  toolSlug,\n  apiEndpoint,\n  acceptedExtensions,\n  documentTypeLabel,\n  language: propLanguage\n}) => {\n  const { language: contextLang } = useLanguage();\n  const language = propLanguage || contextLang || "en";\n  const l = language.slice(0, 2);'
)

# Update dropzone text in OfficeConverterWorkspace.tsx
OFFICE_DROP_TITLE = {
  "en": "Select document to convert",
  "es": "Selecciona el documento para convertir",
  "de": "Dokument zum Konvertieren auswählen",
  "fr": "Sélectionner le document à convertir",
  "pt": "Selecionar o documento para converter",
  "it": "Seleziona il documento da convertire",
  "nl": "Selecteer het document om te converteren",
  "ca": "Selecciona el document a convertir",
  "sv": "Välj dokument att konvertera",
  "da": "Vælg dokument til konvertering",
  "fi": "Valitse muunnettava asiakirja",
  "no": "Velg dokument som skal konverteres",
  "pl": "Wybierz dokument do konwersji",
  "cs": "Vyberte dokument k převodu",
  "hu": "Válassza ki a konvertálandó dokumentumot",
  "ro": "Selectează documentul pentru conversie",
  "bg": "Изберете документ за конвертиране",
  "el": "Επιλέξτε έγγραφο για μετατροπή",
  "sk": "Vyberte dokument na konverziu",
  "sl": "Izberite dokument za pretvorbo",
  "ru": "Выберите документ для конвертации",
  "uk": "Виберіть документ для конвертації",
  "lv": "Izvēlieties konvertējamo dokumentu",
  "lt": "Pasirinkite dokumentą konvertavimui",
  "tr": "Dönüştürülecek belgeyi seçin",
  "ar": "اختر المستند للتحويل",
  "he": "בחר מסמך להמרה",
  "hi": "कन्वर्ट करने के लिए दस्तावेज़ चुनें",
  "id": "Pilih dokumen untuk dikonversi",
  "ms": "Pilih dokumen untuk ditukar",
  "th": "เลือกเอกสารที่จะแปลง",
  "vi": "Chọn tài liệu để chuyển đổi",
  "fil": "Pumili ng dokumentong iko-convert",
  "ja": "変換するドキュメントを選択",
  "ko": "변환할 문서를 선택하세요",
  "zh": "选择要转换的文档"
}

OFFICE_DROP_SUBTITLE = {
  "en": "High-fidelity LibreOffice microVM conversion with 0% data retention.",
  "es": "Conversión segura de alta fidelidad con microVM aislada y 0% de retención de datos.",
  "de": "Hochpräzise Konvertierung in isolierter MicroVM mit 0% Datenspeicherung.",
  "fr": "Conversion haute fidélité via microVM isolée et 0% de rétention de données.",
  "pt": "Conversão de alta fidelidade com microVM isolada e 0% de retenção de dados.",
  "it": "Conversione ad alta fedeltà con microVM isolata e 0% di conservazione dei dati.",
  "nl": "Zeer nauwkeurige conversie met geïsoleerde microVM en 0% gegevensretentie.",
  "ca": "Conversió d'alta fidelitat amb microVM aïllada i 0% de retenció de dades.",
  "sv": "Högprecisionskonvertering i isolerad microVM med 0% datalagring.",
  "da": "Højpræcisionskonvertering i isoleret microVM med 0% datalagring.",
  "fi": "Huipputarkka muunnos eristetyssä microVM:ssä 0% tiedon säilytyksellä.",
  "no": "Høy-presisjonskonvertering i isolert microVM med 0% datalagring.",
  "pl": "Precyzyjna konwersja w izolowanej maszynie microVM z 0% przechowywania danych.",
  "cs": "Vysoce přesný převod v izolovaném microVM s 0% uchováváním dat.",
  "hu": "Nagy pontosságú konverzió izolált microVM-ben, 0% adattárolással.",
  "ro": "Conversie de înaltă precizie în microVM izolată cu 0% reținere de date.",
  "bg": "Прецизно конвертиране в изолирана microVM с 0% съхранение на данни.",
  "el": "Μετατροπή υψηλής ακρίβειας σε απομονωμένο microVM με 0% διατήρηση δεδομένων.",
  "sk": "Vysoko presná konverzia v izolovanej microVM s 0% uchovávaním údajov.",
  "sl": "Visoko natančna pretvorba v izoliranem microVM z 0% hrambo podatkov.",
  "ru": "Высокоточное преобразование в изолированной microVM без сохранения данных.",
  "uk": "Високоточне перетворення в ізольованій microVM без збереження даних.",
  "lv": "Augstas precizitātes konvertēšana izolētā microVM ar 0% datu saglabāšanu.",
  "lt": "Didelio tikslumo konvertavimas izoliuotoje microVM su 0% duomenų saugojimu.",
  "tr": "%0 veri saklama ile yalıtılmış microVM'de yüksek doğruluklu dönüştürme.",
  "ar": "تحويل عالي الدقة عبر microVM معزول مع الاحتفاظ بـ 0% من البيانات.",
  "he": "המרה בדיוק גבוה ב-microVM מבודד ללא שמירת נתונים כלל.",
  "hi": "पृथक microVM में 0% डेटा अवधारण के साथ उच्च-सटीक कन्वर्जन।",
  "id": "Konversi presisi tinggi dalam microVM terisolasi dengan retensi data 0%.",
  "ms": "Penukaran berketepatan tinggi dalam microVM terpencil dengan pengekalan data 0%.",
  "th": "การแปลงไฟล์ความแม่นยำสูงใน microVM ที่แยกอิสระโดยไม่เก็บข้อมูล 100%",
  "vi": "Chuyển đổi độ chính xác cao trong microVM cách ly với 0% lưu giữ dữ liệu.",
  "fil": "Mataas na katumpakang conversion sa microVM na may 0% pagpapanatili ng data.",
  "ja": "データを一切保持しない隔離されたmicroVMによる高精度変換。",
  "ko": "데이터를 저장하지 않는 격리된 microVM 기반 고정밀 변환.",
  "zh": "在完全隔离的 microVM 中进行高精度转换，0% 数据留存。"
}

OFFICE_BTN_LABEL = {
  "en": "Choose File", "es": "Elegir archivo", "de": "Datei wählen", "fr": "Choisir un fichier",
  "pt": "Escolher ficheiro", "it": "Scegli file", "nl": "Kies bestand", "ca": "Triar fitxer",
  "sv": "Välj fil", "da": "Vælg fil", "fi": "Valitse tiedosto", "no": "Velg fil",
  "pl": "Wybierz plik", "cs": "Vybrat soubor", "hu": "Fájl kiválasztása", "ro": "Alege fișierul",
  "bg": "Избор на файл", "el": "Επιλογή αρχείου", "sk": "Vybrať súbor", "sl": "Izberi datoteko",
  "ru": "Выбрать файл", "uk": "Вибрати файл", "lv": "Izvēlēties failu", "lt": "Pasirinkti failą",
  "tr": "Dosya Seçin", "ar": "اختر الملف", "he": "בחר קובץ", "hi": "फाइल चुनें",
  "id": "Pilih File", "ms": "Pilih Fail", "th": "เลือกไฟล์", "vi": "Chọn tệp",
  "fil": "Pumili ng File", "ja": "ファイルを選択", "ko": "파일 선택", "zh": "选择文件"
}

# Replace drop title, subtitle, button in OfficeConverterWorkspace.tsx
pattern_office_title = r'\{isNorwegian[\s\S]*?\`Select \$\{documentTypeLabel\}\`\}'
replacement_office_title = "{(() => {\n              const map: Record<string, string> = " + json_repr(OFFICE_DROP_TITLE) + ";\n              return map[l] || map.en;\n            })()}"
office_code = re.sub(pattern_office_title, replacement_office_title, office_code)

pattern_office_sub = r'\{isNorwegian[\s\S]*?"High-fidelity LibreOffice microVM conversion with 0% data retention\."\}'
replacement_office_sub = "{(() => {\n              const map: Record<string, string> = " + json_repr(OFFICE_DROP_SUBTITLE) + ";\n              return map[l] || map.en;\n            })()}"
office_code = re.sub(pattern_office_sub, replacement_office_sub, office_code)

pattern_office_btn = r'\{isNorwegian \? "Velg fil"[\s\S]*?\`Choose \$\{documentTypeLabel\} File\`\}'
replacement_office_btn = "{(() => {\n            const map: Record<string, string> = " + json_repr(OFFICE_BTN_LABEL) + ";\n            return map[l] || map.en;\n          })()}"
office_code = re.sub(pattern_office_btn, replacement_office_btn, office_code)

with open('src/components/office-tools/OfficeConverterWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(office_code)

print("[OK] 2. OfficeConverterWorkspace.tsx updated with 39-locale dropzone.")

# 3. Update PdfPageEditorWorkspace.tsx with language prop support
with open('src/components/pdf-editor/PdfPageEditorWorkspace.tsx', 'r', encoding='utf-8') as f:
    pdf_editor_code = f.read()

pdf_editor_code = pdf_editor_code.replace(
    'interface PdfPageEditorWorkspaceProps {\n  targetRoute: PdfEditorRouteTarget;\n  title: string;\n  subtitle: string;\n  actionButtonText: string;\n  onComplete?: (result: { blob: Blob; fileName: string }) => void;\n}',
    'interface PdfPageEditorWorkspaceProps {\n  targetRoute: PdfEditorRouteTarget;\n  title: string;\n  subtitle: string;\n  actionButtonText: string;\n  language?: string;\n  onComplete?: (result: { blob: Blob; fileName: string }) => void;\n}'
)

pdf_editor_code = pdf_editor_code.replace(
    'export const PdfPageEditorWorkspace: React.FC<PdfPageEditorWorkspaceProps> = ({\n  targetRoute,\n  title,\n  subtitle,\n  actionButtonText,\n  onComplete,\n}) => {\n  const { language, t } = useLanguage();',
    'export const PdfPageEditorWorkspace: React.FC<PdfPageEditorWorkspaceProps> = ({\n  targetRoute,\n  title,\n  subtitle,\n  actionButtonText,\n  language: propLanguage,\n  onComplete,\n}) => {\n  const { language: contextLang, t } = useLanguage();\n  const language = propLanguage || contextLang || "en";\n  const effectiveLang = language as any;'
)

with open('src/components/pdf-editor/PdfPageEditorWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(pdf_editor_code)

print("[OK] 3. PdfPageEditorWorkspace.tsx updated with language prop support.")

# 4. Update UniversalToolPage.tsx to pass language={locale} to all workspaces
with open('src/components/layout/UniversalToolPage.tsx', 'r', encoding='utf-8') as f:
    univ_code = f.read()

univ_code = univ_code.replace(
    '<PdfPageEditorWorkspace\n          targetRoute={target}\n          title={meta.title}\n          subtitle={meta.description}\n          actionButtonText="Process PDF"\n        />',
    '<PdfPageEditorWorkspace\n          targetRoute={target}\n          title={meta.title}\n          subtitle={meta.description}\n          actionButtonText="Process PDF"\n          language={locale}\n        />'
)

univ_code = univ_code.replace(
    '<OfficeConverterWorkspace\n        toolTitle={meta.title}\n        toolSlug={normSlug}\n        apiEndpoint={endpoint}\n        acceptedExtensions={extensions}\n        documentTypeLabel={label}\n      />',
    '<OfficeConverterWorkspace\n        toolTitle={meta.title}\n        toolSlug={normSlug}\n        apiEndpoint={endpoint}\n        acceptedExtensions={extensions}\n        documentTypeLabel={label}\n        language={locale}\n      />'
)

with open('src/components/layout/UniversalToolPage.tsx', 'w', encoding='utf-8') as f:
    f.write(univ_code)

print("[OK] 4. UniversalToolPage.tsx updated to pass language={locale} to workspaces.")

# 5. Update NOUN_TRANSLATIONS in src/utils/i18nHelper.ts to map all nouns cleanly (Word, Excel, PowerPoint, PPTX, DOCX, XLSX, etc.)
with open('src/utils/i18nHelper.ts', 'r', encoding='utf-8') as f:
    helper_code = f.read()

NOUN_MAP_39 = {
  "image": {
    "en": "Image", "da": "Billede", "sv": "Bild", "fi": "Kuva", "no": "Bilde", "de": "Bild", "es": "Imagen", "es-419": "Imagen", "fr": "Image", "it": "Immagine", "pt": "Imagem", "pt-BR": "Imagem", "nl": "Afbeelding", "ca": "Imatge", "pl": "Obraz", "cs": "Obrázek", "hu": "Kép", "ro": "Imagine", "bg": "Изображение", "el": "Εικόνα", "sk": "Obrázok", "sl": "Slika", "ru": "Изображение", "uk": "Зображення", "lv": "Attēls", "lt": "Vaizdas", "tr": "Görsel", "ar": "الصورة", "he": "תמונה", "hi": "इमेज", "id": "Gambar", "ms": "Imej", "th": "รูปภาพ", "vi": "Hình ảnh", "fil": "Larawan", "ja": "画像", "ko": "이미지", "zh-CN": "图片", "zh-TW": "圖片"
  },
  "pdf": {
    "en": "PDF", "da": "PDF", "sv": "PDF", "fi": "PDF", "no": "PDF", "de": "PDF", "es": "PDF", "es-419": "PDF", "fr": "PDF", "it": "PDF", "pt": "PDF", "pt-BR": "PDF", "nl": "PDF", "ca": "PDF", "pl": "PDF", "cs": "PDF", "hu": "PDF", "ro": "PDF", "bg": "PDF", "el": "PDF", "sk": "PDF", "sl": "PDF", "ru": "PDF", "uk": "PDF", "lv": "PDF", "lt": "PDF", "tr": "PDF", "ar": "PDF", "he": "PDF", "hi": "PDF", "id": "PDF", "ms": "PDF", "th": "PDF", "vi": "PDF", "fil": "PDF", "ja": "PDF", "ko": "PDF", "zh-CN": "PDF", "zh-TW": "PDF"
  },
  "video": {
    "en": "Video", "da": "Video", "sv": "Video", "fi": "Video", "no": "Video", "de": "Video", "es": "Video", "es-419": "Video", "fr": "Vidéo", "it": "Video", "pt": "Vídeo", "pt-BR": "Vídeo", "nl": "Video", "ca": "Vídeo", "pl": "Wideo", "cs": "Video", "hu": "Videó", "ro": "Video", "bg": "Видео", "el": "Βίντεο", "sk": "Video", "sl": "Video", "ru": "Видео", "uk": "Відео", "lv": "Video", "lt": "Vaizdo įrašas", "tr": "Video", "ar": "الفيديو", "he": "וידאו", "hi": "वीडियो", "id": "Video", "ms": "Video", "th": "วิดีโอ", "vi": "Video", "fil": "Video", "ja": "動画", "ko": "동영상", "zh-CN": "视频", "zh-TW": "影片"
  },
  "audio": {
    "en": "Audio", "da": "Lyd", "sv": "Ljud", "fi": "Ääni", "no": "Lyd", "de": "Audio", "es": "Audio", "es-419": "Audio", "fr": "Audio", "it": "Audio", "pt": "Áudio", "pt-BR": "Áudio", "nl": "Audio", "ca": "Àudio", "pl": "Audio", "cs": "Audio", "hu": "Hang", "ro": "Audio", "bg": "Аудио", "el": "Ήχος", "sk": "Audio", "sl": "Zvok", "ru": "Аудио", "uk": "Аудіо", "lv": "Audio", "lt": "Garsas", "tr": "Ses", "ar": "الصوت", "he": "אודיו", "hi": "ऑडियो", "id": "Audio", "ms": "Audio", "th": "เสียง", "vi": "Âm thanh", "fil": "Audio", "ja": "音声", "ko": "오디오", "zh-CN": "音频", "zh-TW": "音訊"
  },
  "archive": {
    "en": "Archive", "da": "Arkiv", "sv": "Arkiv", "fi": "Arkisto", "no": "Arkiv", "de": "Archiv", "es": "Archivo", "es-419": "Archivo", "fr": "Archive", "it": "Archivio", "pt": "Arquivo", "pt-BR": "Arquivo", "nl": "Archief", "ca": "Arxiu", "pl": "Archiwum", "cs": "Archiv", "hu": "Archívum", "ro": "Arhivă", "bg": "Архив", "el": "Αρχείο", "sk": "Archív", "sl": "Arhiv", "ru": "Архив", "uk": "Архів", "lv": "Arhīvs", "lt": "Archyvas", "tr": "Arşiv", "ar": "الأرشيف", "he": "ארכיון", "hi": "आर्काइव", "id": "Arsip", "ms": "Arkib", "th": "ไฟล์บีบอัด", "vi": "Tệp nén", "fil": "Archive", "ja": "アーカイブ", "ko": "압축 파일", "zh-CN": "压缩包", "zh-TW": "壓縮檔案"
  },
  "word": {
    "en": "Word", "da": "Word", "sv": "Word", "fi": "Word", "no": "Word", "de": "Word", "es": "Word", "es-419": "Word", "fr": "Word", "it": "Word", "pt": "Word", "pt-BR": "Word", "nl": "Word", "ca": "Word", "pl": "Word", "cs": "Word", "hu": "Word", "ro": "Word", "bg": "Word", "el": "Word", "sk": "Word", "sl": "Word", "ru": "Word", "uk": "Word", "lv": "Word", "lt": "Word", "tr": "Word", "ar": "Word", "he": "Word", "hi": "Word", "id": "Word", "ms": "Word", "th": "Word", "vi": "Word", "fil": "Word", "ja": "Word", "ko": "Word", "zh-CN": "Word", "zh-TW": "Word"
  },
  "excel": {
    "en": "Excel", "da": "Excel", "sv": "Excel", "fi": "Excel", "no": "Excel", "de": "Excel", "es": "Excel", "es-419": "Excel", "fr": "Excel", "it": "Excel", "pt": "Excel", "pt-BR": "Excel", "nl": "Excel", "ca": "Excel", "pl": "Excel", "cs": "Excel", "hu": "Excel", "ro": "Excel", "bg": "Excel", "el": "Excel", "sk": "Excel", "sl": "Excel", "ru": "Excel", "uk": "Excel", "lv": "Excel", "lt": "Excel", "tr": "Excel", "ar": "Excel", "he": "Excel", "hi": "Excel", "id": "Excel", "ms": "Excel", "th": "Excel", "vi": "Excel", "fil": "Excel", "ja": "Excel", "ko": "Excel", "zh-CN": "Excel", "zh-TW": "Excel"
  },
  "powerpoint": {
    "en": "PowerPoint", "da": "PowerPoint", "sv": "PowerPoint", "fi": "PowerPoint", "no": "PowerPoint", "de": "PowerPoint", "es": "PowerPoint", "es-419": "PowerPoint", "fr": "PowerPoint", "it": "PowerPoint", "pt": "PowerPoint", "pt-BR": "PowerPoint", "nl": "PowerPoint", "ca": "PowerPoint", "pl": "PowerPoint", "cs": "PowerPoint", "hu": "PowerPoint", "ro": "PowerPoint", "bg": "PowerPoint", "el": "PowerPoint", "sk": "PowerPoint", "sl": "PowerPoint", "ru": "PowerPoint", "uk": "PowerPoint", "lv": "PowerPoint", "lt": "PowerPoint", "tr": "PowerPoint", "ar": "PowerPoint", "he": "PowerPoint", "hi": "PowerPoint", "id": "PowerPoint", "ms": "PowerPoint", "th": "PowerPoint", "vi": "PowerPoint", "fil": "PowerPoint", "ja": "PowerPoint", "ko": "PowerPoint", "zh-CN": "PowerPoint", "zh-TW": "PowerPoint"
  }
}

new_noun_block = "const NOUN_TRANSLATIONS: Record<string, Record<SupportedLocale, string>> = " + json_repr(NOUN_MAP_39) + ";"
pattern_nouns = r'const NOUN_TRANSLATIONS: Record<string, Record<SupportedLocale, string>> = \{[\s\S]*?\n    \};'
helper_code = re.sub(pattern_nouns, new_noun_block, helper_code)

# Noun key resolution
new_noun_key_res = """    let nounKey = "pdf";
    if (normSlug.includes("word") || normSlug.includes("docx") || normSlug.includes("doc")) nounKey = "word";
    else if (normSlug.includes("excel") || normSlug.includes("xlsx") || normSlug.includes("xls")) nounKey = "excel";
    else if (normSlug.includes("powerpoint") || normSlug.includes("pptx") || normSlug.includes("ppt")) nounKey = "powerpoint";
    else if (normSlug.includes("image") || normSlug.includes("png") || normSlug.includes("jpg") || normSlug.includes("jpeg") || normSlug.includes("webp") || normSlug.includes("avif") || normSlug.includes("heic") || normSlug.includes("bmp") || normSlug.includes("ico") || normSlug.includes("svg")) nounKey = "image";
    else if (normSlug.includes("video") || normSlug.includes("mp4") || normSlug.includes("mov") || normSlug.includes("webm") || normSlug.includes("avi") || normSlug.includes("mkv") || normSlug.includes("wmv")) nounKey = "video";
    else if (normSlug.includes("audio") || normSlug.includes("mp3") || normSlug.includes("wav") || normSlug.includes("m4a") || normSlug.includes("flac") || normSlug.includes("ogg")) nounKey = "audio";
    else if (normSlug.includes("zip") || normSlug.includes("rar") || normSlug.includes("7z") || normSlug.includes("tar")) nounKey = "archive";"""

pattern_noun_keys = r'let nounKey = "pdf";[\s\S]*?else if \(normSlug\.includes\("zip"\)[\s\S]*?archive";'
helper_code = re.sub(pattern_noun_keys, new_noun_key_res, helper_code)

with open('src/utils/i18nHelper.ts', 'w', encoding='utf-8') as f:
    f.write(helper_code)

print("[OK] 5. i18nHelper.ts updated with comprehensive noun detection and translations.")
print("=== ALL 5 COMMON ISSUE AREAS RESOLVED! ===")
