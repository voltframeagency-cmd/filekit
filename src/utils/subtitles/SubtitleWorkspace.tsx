"use client";

import React, { useState, useEffect } from "react";
import { SubtitleEngine } from "./SubtitleEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface SubtitleWorkspaceProps {
  mode: "srt-to-vtt" | "vtt-to-srt";
  title: string;
  subtitle: string;
  embedded?: boolean;
  language?: string;
}

interface SubtitleTranslations {
  selectFile: (ext: string) => string;
  privacySub: string;
  error: string;
  preview: string;
  download: (name: string) => string;
}

const SUBTITLE_I18N: Record<string, SubtitleTranslations> = {
  en: {
    selectFile: (ext) => `Select ${ext} subtitle file`,
    privacySub: "100% In-Browser · Private & Instant Conversion",
    error: "Failed to parse and convert subtitle file.",
    preview: "Conversion Preview:",
    download: (name) => `Download ${name}`
  },
  es: {
    selectFile: (ext) => `Seleccionar archivo de subtítulos (${ext})`,
    privacySub: "100% en el navegador · Conversión instantánea y privada",
    error: "Error al procesar y convertir el archivo de subtítulos.",
    preview: "Vista previa de la conversión:",
    download: (name) => `Descargar ${name}`
  },
  "es-419": {
    selectFile: (ext) => `Seleccionar archivo de subtítulos (${ext})`,
    privacySub: "100% en el navegador · Conversión instantánea y privada",
    error: "Error al procesar y convertir el archivo de subtítulos.",
    preview: "Vista previa de la conversión:",
    download: (name) => `Descargar ${name}`
  },
  de: {
    selectFile: (ext) => `Untertiteldatei auswählen (${ext})`,
    privacySub: "100% im Browser · Private & sofortige Konvertierung",
    error: "Fehler beim Verarbeiten und Konvertieren der Untertiteldatei.",
    preview: "Vorschau der Konvertierung:",
    download: (name) => `${name} herunterladen`
  },
  fr: {
    selectFile: (ext) => `Sélectionner un fichier de sous-titres (${ext})`,
    privacySub: "100% dans le navigateur · Conversion privée et instantanée",
    error: "Échec de l'analyse et de la conversion du fichier de sous-titres.",
    preview: "Aperçu de la conversion :",
    download: (name) => `Télécharger ${name}`
  },
  pt: {
    selectFile: (ext) => `Selecionar ficheiro de legendas (${ext})`,
    privacySub: "100% no navegador · Conversão privada e instantânea",
    error: "Falha ao processar e converter o ficheiro de legendas.",
    preview: "Pré-visualização da conversão:",
    download: (name) => `Descarregar ${name}`
  },
  "pt-BR": {
    selectFile: (ext) => `Selecionar arquivo de legendas (${ext})`,
    privacySub: "100% no navegador · Conversão privada e instantânea",
    error: "Falha ao processar e converter o arquivo de legendas.",
    preview: "Pré-visualização da conversão:",
    download: (name) => `Baixar ${name}`
  },
  it: {
    selectFile: (ext) => `Seleziona file di sottotitoli (${ext})`,
    privacySub: "100% nel browser · Conversione privata e istantanea",
    error: "Impossibile analizzare e convertire il file dei sottotitoli.",
    preview: "Anteprima della conversione:",
    download: (name) => `Scarica ${name}`
  },
  nl: {
    selectFile: (ext) => `Selecteer ondertitelbestand (${ext})`,
    privacySub: "100% in browser · Snelle & privé conversie",
    error: "Kan het ondertitelbestand niet verwerken en converteren.",
    preview: "Conversievoorbeeld:",
    download: (name) => `${name} downloaden`
  },
  ca: {
    selectFile: (ext) => `Selecciona el fitxer de subtítols (${ext})`,
    privacySub: "100% al navegador · Conversió instantània i privada",
    error: "Error en analitzar i convertir el fitxer de subtítols.",
    preview: "Vista prèvia de la conversió:",
    download: (name) => `Descarregar ${name}`
  },
  sv: {
    selectFile: (ext) => `Välj undertextfil (${ext})`,
    privacySub: "100% i webbläsaren · Snabb och privat konvertering",
    error: "Kunde inte analysera och konvertera undertextfilen.",
    preview: "Förhandsgranskning av konvertering:",
    download: (name) => `Ladda ner ${name}`
  },
  da: {
    selectFile: (ext) => `Vælg undertekstfil (${ext})`,
    privacySub: "100% i browseren · Privat og øjeblikkelig konvertering",
    error: "Kunne ikke analysere og konvertere undertekstfilen.",
    preview: "Forhåndsvisning af konvertering:",
    download: (name) => `Download ${name}`
  },
  fi: {
    selectFile: (ext) => `Valitse tekstitystiedosto (${ext})`,
    privacySub: "100% selaimessa · Yksityinen ja välitön muunnos",
    error: "Tekstitystiedoston jäsentäminen ja muuntaminen epäonnistui.",
    preview: "Muunnoksen esikatselu:",
    download: (name) => `Lataa ${name}`
  },
  no: {
    selectFile: (ext) => `Velg undertekstfil (${ext})`,
    privacySub: "100% i nettleseren · Privat og øyeblikkelig konvertering",
    error: "Kunne ikke analysere og konvertere undertekstfilen.",
    preview: "Forhåndsvisning av konvertering:",
    download: (name) => `Last ned ${name}`
  },
  pl: {
    selectFile: (ext) => `Wybierz plik napisów (${ext})`,
    privacySub: "100% w przeglądarce · Prywatna i natychmiastowa konwersja",
    error: "Nie udało się przetworzyć i przekonwertować pliku napisów.",
    preview: "Podgląd konwersji:",
    download: (name) => `Pobierz ${name}`
  },
  cs: {
    selectFile: (ext) => `Vyberte soubor titulků (${ext})`,
    privacySub: "100% v prohlížeči · Soukromý a okamžitý převod",
    error: "Nepodařilo se zpracovat a převést soubor titulků.",
    preview: "Náhled převodu:",
    download: (name) => `Stáhnout ${name}`
  },
  hu: {
    selectFile: (ext) => `Válasszon feliratfájlt (${ext})`,
    privacySub: "100%-ban a böngészőben · Privát és azonnali konverzió",
    error: "Nem sikerült feldolgozni és konvertálni a feliratfájlt.",
    preview: "Konverzió előnézete:",
    download: (name) => `${name} letöltése`
  },
  ro: {
    selectFile: (ext) => `Selectează fișierul de subtitrări (${ext})`,
    privacySub: "100% în browser · Conversie privată și instantanee",
    error: "Nu s-a putut analiza și converti fișierul de subtitrări.",
    preview: "Previzualizarea conversiei:",
    download: (name) => `Descarcă ${name}`
  },
  bg: {
    selectFile: (ext) => `Изберете файл със субтитри (${ext})`,
    privacySub: "100% в браузъра · Поверително и мигновено конвертиране",
    error: "Неуспешен анализ и конвертиране на файла със субтитри.",
    preview: "Преглед на конвертирането:",
    download: (name) => `Изтегляне на ${name}`
  },
  el: {
    selectFile: (ext) => `Επιλέξτε αρχείο υποτίτλων (${ext})`,
    privacySub: "100% στο πρόγραμμα περιήγησης · Ιδιωτική & άμεση μετατροπή",
    error: "Αποτυχία ανάλυσης και μετατροπής αρχείου υποτίτλων.",
    preview: "Προεπισκόπηση μετατροπής:",
    download: (name) => `Λήψη ${name}`
  },
  sk: {
    selectFile: (ext) => `Vyberte súbor titulkov (${ext})`,
    privacySub: "100% v prehliadači · Súkromná a okamžitá konverzia",
    error: "Nepodarilo sa spracovať a previesť súbor titulkov.",
    preview: "Náhľad konverzie:",
    download: (name) => `Stiahnuť ${name}`
  },
  sl: {
    selectFile: (ext) => `Izberite datoteko podnapisov (${ext})`,
    privacySub: "100 % v brskalniku · Zasebna in takojšnja pretvorba",
    error: "Datoteke s podnapisi ni bilo mogoče razčleniti in pretvoriti.",
    preview: "Predogled pretvorbe:",
    download: (name) => `Prenesi ${name}`
  },
  ru: {
    selectFile: (ext) => `Выберите файл субтитров (${ext})`,
    privacySub: "100% в браузере · Конфиденциальная и мгновенная конвертация",
    error: "Не удалось обработать и конвертировать файл субтитров.",
    preview: "Предварительный просмотр:",
    download: (name) => `Скачать ${name}`
  },
  uk: {
    selectFile: (ext) => `Виберіть файл субтитрів (${ext})`,
    privacySub: "100% у браузері · Конфіденційна та миттєва конвертація",
    error: "Не вдалося обробити та конвертувати файл субтитрів.",
    preview: "Попередній перегляд:",
    download: (name) => `Завантажити ${name}`
  },
  lv: {
    selectFile: (ext) => `Izvēlieties subtitru failu (${ext})`,
    privacySub: "100% pārlūkā · Privāta un tūlītēja konvertēšana",
    error: "Neizdevās apstrādāt un konvertēt subtitru failu.",
    preview: "Konvertēšanas priekšskatījums:",
    download: (name) => `Lejupielādēt ${name}`
  },
  lt: {
    selectFile: (ext) => `Pasirinkite subtitrų failą (${ext})`,
    privacySub: "100% naršyklėje · Privatus ir momentinis konvertavimas",
    error: "Nepavyko apdoroti ir konvertuoti subtitrų failo.",
    preview: "Konvertavimo peržiūra:",
    download: (name) => `Atsisiųsti ${name}`
  },
  tr: {
    selectFile: (ext) => `Altyazı Dosyası Seçin (${ext})`,
    privacySub: "Tarayıcıda %100 · Gizli ve Anında Dönüştürme",
    error: "Altyazı dosyası ayrıştırılamadı ve dönüştürülemedi.",
    preview: "Dönüştürme Önizlemesi:",
    download: (name) => `${name} İndir`
  },
  ar: {
    selectFile: (ext) => `اختر ملف الترجمة (${ext})`,
    privacySub: "100% في المتصفح · تحويل فوري وخاص",
    error: "فشل تحليل وتحويل ملف الترجمة.",
    preview: "معاينة التحويل:",
    download: (name) => `تنزيل ${name}`
  },
  he: {
    selectFile: (ext) => `בחר קובץ כתוביות (${ext})`,
    privacySub: "100% בדפדפן · המרה פרטית ומיידית",
    error: "נכשל בניתוח והמרת קובץ הכתוביות.",
    preview: "תצוגה מקדימה של ההמרה:",
    download: (name) => `הורד ${name}`
  },
  hi: {
    selectFile: (ext) => `सबटाइटल फ़ाइल चुनें (${ext})`,
    privacySub: "100% ब्राउज़र में · निजी और तत्काल कन्वर्जन",
    error: "सबटाइटल फ़ाइल को पार्स और कन्वर्ट करने में विफल।",
    preview: "कन्वर्जन पूर्वावलोकन:",
    download: (name) => `${name} डाउनलोड करें`
  },
  id: {
    selectFile: (ext) => `Pilih file subtitle (${ext})`,
    privacySub: "100% di browser · Konversi privat & instan",
    error: "Gagal mengurai dan mengonversi file subtitle.",
    preview: "Pratinjau Konversi:",
    download: (name) => `Unduh ${name}`
  },
  ms: {
    selectFile: (ext) => `Pilih fail sari kata (${ext})`,
    privacySub: "100% dalam penyemak imbas · Penukaran peribadi & pantas",
    error: "Gagal menghuraikan dan menukar fail sari kata.",
    preview: "Pratonton Penukaran:",
    download: (name) => `Muat turun ${name}`
  },
  th: {
    selectFile: (ext) => `เลือกไฟล์คำบรรยาย (${ext})`,
    privacySub: "100% ในเบราว์เซอร์ · การแปลงแบบส่วนตัวและทันที",
    error: "ไม่สามารถแยกวิเคราะห์และแปลงไฟล์คำบรรยายได้",
    preview: "ตัวอย่างการแปลง:",
    download: (name) => `ดาวน์โหลด ${name}`
  },
  vi: {
    selectFile: (ext) => `Chọn tệp phụ đề (${ext})`,
    privacySub: "100% trong trình duyệt · Chuyển đổi riêng tư & tức thì",
    error: "Không thể phân tích cú pháp và chuyển đổi tệp phụ đề.",
    preview: "Xem trước bản chuyển đổi:",
    download: (name) => `Tải xuống ${name}`
  },
  fil: {
    selectFile: (ext) => `Pumili ng subtitle file (${ext})`,
    privacySub: "100% sa Browser · Pribado at Mabilisang Pag-convert",
    error: "Nabigong i-parse at i-convert ang subtitle file.",
    preview: "Preview ng Pag-convert:",
    download: (name) => `I-download ang ${name}`
  },
  ja: {
    selectFile: (ext) => `字幕ファイルを選択 (${ext})`,
    privacySub: "100%ブラウザ内で完結 · 高速＆安全な変換",
    error: "字幕ファイルの解析および変換に失敗しました。",
    preview: "変換プレビュー:",
    download: (name) => `${name} をダウンロード`
  },
  ko: {
    selectFile: (ext) => `자막 파일 선택 (${ext})`,
    privacySub: "100% 브라우저 내 처리 · 즉시 안전한 개인정보 보호 변환",
    error: "자막 파일을 분석하고 변환하지 못했습니다.",
    preview: "변환 미리보기:",
    download: (name) => `${name} 다운로드`
  },
  "zh-CN": {
    selectFile: (ext) => `选择字幕文件 (${ext})`,
    privacySub: "100% 浏览器本地处理 · 隐私保护即时转换",
    error: "字幕文件解析与转换失败。",
    preview: "转换预览：",
    download: (name) => `下载 ${name}`
  },
  "zh-TW": {
    selectFile: (ext) => `選擇字幕檔案 (${ext})`,
    privacySub: "100% 瀏覽器本地處理 · 隱私保護即時轉換",
    error: "字幕檔案解析與轉換失敗。",
    preview: "轉換預覽：",
    download: (name) => `下載 ${name}`
  }
};

export default function SubtitleWorkspace({ mode, title, subtitle, embedded = true, language: propLang }: SubtitleWorkspaceProps) {
  const { language: contextLang } = useLanguage();
  const language = propLang || contextLang || "en";
  const dict = SUBTITLE_I18N[language] || SUBTITLE_I18N[language.split("-")[0]] || SUBTITLE_I18N.en;
  const extLabel = mode === "srt-to-vtt" ? ".SRT" : ".VTT";

  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError(null);
    setLoading(true);

    try {
      const text = await selected.text();
      setInputText(text);

      let converted = "";
      let outName = "";
      if (mode === "srt-to-vtt") {
        converted = SubtitleEngine.srtToVtt(text);
        outName = selected.name.replace(/\.srt$/i, "") + ".vtt";
      } else {
        converted = SubtitleEngine.vttToSrt(text);
        outName = selected.name.replace(/\.vtt$/i, "") + ".srt";
      }

      setOutputText(converted);
      setDownloadName(outName);

      const mime = mode === "srt-to-vtt" ? "text/vtt" : "text/plain";
      const blob = new Blob([converted], { type: mime });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(dict.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!embedded && (
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-fk-text">{title}</h2>
          <p className="text-sm text-fk-text-muted">{subtitle}</p>
        </div>
      )}

      <div className="bg-white border border-fk-border rounded-fk-xl shadow-sm p-6 space-y-6">
        <div className="border-2 border-dashed border-fk-border hover:border-blue-500 rounded-xl p-8 text-center transition-all bg-slate-50/50">
          <input
            type="file"
            id="subtitle-upload"
            accept={mode === "srt-to-vtt" ? ".srt,text/plain" : ".vtt,text/vtt,text/plain"}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="subtitle-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
              📄
            </div>
            <span className="text-base font-bold text-slate-800">
              {file ? file.name : dict.selectFile(extLabel)}
            </span>
            <span className="text-xs text-slate-400">
              {dict.privacySub}
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        {outputText && downloadUrl && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                {dict.preview}
              </span>
              <a
                href={downloadUrl}
                download={downloadName}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
              >
                <span>
                  {dict.download(downloadName)}
                </span>
                <span className="text-xs">↓</span>
              </a>
            </div>

            <textarea
              readOnly
              value={outputText}
              className="w-full h-48 p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-800 overflow-y-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

