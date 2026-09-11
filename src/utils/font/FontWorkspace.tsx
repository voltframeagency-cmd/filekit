"use client";

import React, { useState, useEffect } from "react";
import { FontEngine, FontMetadata } from "./FontEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface FontWorkspaceProps {
  mode: "ttf-to-woff2" | "woff2-to-ttf";
  title?: string;
  description?: string;
  embedded?: boolean;
  language?: string;
}

export function FontWorkspace({ mode, title, description, embedded = true, language: propLang }: FontWorkspaceProps) {
  const { language: contextLang } = useLanguage();
  const language = propLang || contextLang || "en";
  const isSpanish = language === "es" || language === "es-419";
  const isGerman = language === "de";
  const isFrench = language === "fr";
  const isPortuguese = language === "pt" || language === "pt-BR";
  const isItalian = language === "it";
  const isDutch = language === "nl";
  const isCatalan = language === "ca";
  const isSwedish = language === "sv";
  const isDanish = language === "da";
  const isFinnish = language === "fi";
  const isNorwegian = language === "no";
  const isPolish = language === "pl";
  const isCzech = language === "cs";
  const isHungarian = language === "hu";
  const isRomanian = language === "ro";
  const isBulgarian = language === "bg";
  const isGreek = language === "el";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isTurkish = language === "tr";
  const isLatvian = language === "lv";
  const isLithuanian = language === "lt";
  const isHindi = language === "hi";
  const isIndonesian = language === "id";
  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";
  const isJapanese = language === "ja";
  const isKorean = language === "ko";
  const isArabic = language === "ar";
  const isHebrew = language === "he";
  const isTaiwan = language === "zh-TW" || (language as string).toLowerCase() === "zh-tw";
  const isSimplifiedChinese = !isTaiwan && (language === "zh-CN" || (language as string).toLowerCase() === "zh-cn" || language.startsWith("zh"));
  const isChinese = isTaiwan || isSimplifiedChinese;

  const [file, setFile] = useState<File | null>(null);
  const [fontMeta, setFontMeta] = useState<FontMetadata | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [previewText, setPreviewText] = useState<string>(
    isKorean
      ? "다람쥐 헌 쳇바퀴에 타고파 키스의 고유조건 1234567890"
      : isJapanese
      ? "いろはにほへと ちりぬるを わかよたれそ つねならむ 1234567890"
      : isNorwegian
      ? "Vår sære Guri skyndte seg med å få fylt ølkruset på whiskybaren 1234567890"
      : isPolish
      ? "Mężny bądź, chroń pułk twój i sześć flag 1234567890"
      : isCzech
      ? "Příliš žluťoučký kůň úpěl ďábelské ódy 1234567890"
      : isHungarian
      ? "Egy hűtlen belga lány fura trükköt űzve pompás whiskyvel kínálja a jódsókedvelő mókust 1234567890"
      : isRomanian
      ? "Gheorghe a vândut pește proaspăt într-un taxi luxos 1234567890"
      : isBulgarian
      ? "Във вихрени танци се сляха жадни за слава мъже и жени 1234567890"
      : isGreek
      ? "Ξεσκεπάζω την ψυχοφθόρα βδελυγμία 1234567890"
      : isSlovak
      ? "Kŕdeľ šťastných ďatľov učí pri ústí Váhu mĺkveho koňa obhrýzať kôru a žrať čerstvé mäso 1234567890"
      : isSlovenian
      ? "Šerif bo za domačo mizo včeraj spil požirek tujo kave z mlekom 1234567890"
      : isRussian
      ? "Съешь же ещё этих мягких французских булок, да выпей чаю 1234567890"
      : isUkrainian
      ? "Жебракують філософи при ґанку церкви в Галичі, а шахраї п'ють винo 1234567890"
      : isTurkish
      ? "Pijamalı hasta yağız şoföre çabucak güvendi 1234567890"
      : isSwedish
      ? "Flygande bäckasiner söka hwila på mjukna tuvor 1234567890"
      : isDanish
      ? "Quizdeltagerne spiste jordbær med fløde på en hyggelig café 1234567890"
      : isFinnish
      ? "Viekas kettu laiskalla koiralla hyppää viiden tähden yli 1234567890"
      : isCatalan
      ? "Jove xef, porti whisky amb quinze carquinyolis 1234567890"
      : isDutch
      ? "Pa's wijze lynx bezag vroom het foeragerende wild 1234567890"
      : isItalian
      ? "Ma la volpe col suo balzo ha raggiunto il quieto fido 1234567890"
      : isPortuguese
      ? "Vejam a bruxa da noite a regar o cacto com água 1234567890"
      : isFrench
      ? "Portez ce vieux whisky au juge blond qui fume 1234567890"
      : isGerman
      ? "Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich 1234567890"
      : isSpanish
      ? "El veloz murciélago hindú comía feliz cardillo y kiwi 1234567890"
      : isHindi
      ? "ऋषियों को सुनते ही ज्ञान की प्राप्ति होती है १२३४५६७८९०"
      : isMalay
      ? "Bawa dokumen penting yang berisi data rahasia ke kantor 1234567890"
      : isVietnamese
      ? "Cơm, phở, bánh mì, bún chả là những món ăn ngon của Việt Nam 1234567890"
      : isThai
      ? "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน ๑๒๓๔๕๖๗๘๙๐"
      : isFilipino
      ? "Ang mabilis na kayumangging usa ay tumatalon sa ibabaw ng tamad na aso 1234567890"
      : isArabic
      ? "نص حكيم له سر قاطع وذو شأن عظيم مكتوب على ثوب أخضر ومطرز بالحروف 1234567890"
      : isHebrew
      ? "דג סקרן שט לו בים זך אך לפתע פגש חבורה נחמדה 1234567890"
      : "The quick brown fox jumps over the lazy dog 1234567890"
  );
  const [fontSize, setFontSize] = useState<number>(28);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      const meta = FontEngine.inspectFont(buf);
      setFontMeta(meta);

      // Convert
      let outBytes: Uint8Array;
      let outExt = "woff";
      if (mode === "ttf-to-woff2") {
        outBytes = FontEngine.ttfToWoff(buf);
        outExt = "woff";
      } else {
        outBytes = FontEngine.woffToTtf(buf);
        outExt = "ttf";
      }

      const blob = new Blob([outBytes as unknown as BlobPart], { type: "font/woff" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + `.${outExt}`);
    } catch (err) {
      console.error(err);
      setError(
        isKorean
          ? "폰트를 변환하지 못했습니다. 유효한 TTF, OTF 또는 WOFF 파일인지 확인하세요."
          : isNorwegian
          ? "Kunne ikke konvertere skrifttypen. Sørg for at det er en gyldig TTF-, OTF- eller WOFF-fil."
          : isPolish
          ? "Nie udało się przekonwertować czcionki. Upewnij się, że to prawidłowy plik TTF, OTF lub WOFF."
          : isCzech
          ? "Nepodařilo se převést písmo. Ujistěte se, že jde o platný soubor TTF, OTF nebo WOFF."
          : isHungarian
          ? "Nem sikerült konvertálni a betűtípust. Győződjön meg arról, hogy érvényes TTF, OTF vagy WOFF fájl."
          : isRomanian
          ? "Nu s-a putut converti fontul. Asigurați-vă că este un fișier TTF, OTF sau WOFF valid."
          : isGreek
          ? "Αποτυχία μετατροπής γραμματοσειράς. Βεβαιωθείτε ότι είναι έγκυρο αρχείο TTF, OTF ή WOFF."
          : isTurkish
          ? "Yazı tipi dönüştürülemedi. Lütfen geçerli bir TTF, OTF veya WOFF dosyası olduğundan emin olun."
          : isSwedish
          ? "Kunde inte konvertera typsnittet. Kontrollera att det är en giltig TTF-, OTF- eller WOFF-fil."
          : isDanish
          ? "Kunne ikke konvertere skrifttypen. Sørg for, at det er en gyldig TTF-, OTF- eller WOFF-fil."
          : isFinnish
          ? "Fontin muuntaminen epäonnistui. Varmista, että tiedosto on kelvollinen TTF-, OTF- tai WOFF-tiedosto."
          : isCatalan
          ? "Error en convertir el tipus de lletra. Assegura't que sigui un fitxer TTF, OTF o WOFF vàlid."
          : isDutch
          ? "Kan lettertype niet converteren. Zorg ervoor dat het een geldig TTF-, OTF- of WOFF-bestand is."
          : isItalian
          ? "Impossibile convertire il font. Assicurati che sia un file TTF, OTF o WOFF valido."
          : isPortuguese
          ? "Falha ao converter a fonte. Certifique-se de que é um ficheiro TTF, OTF ou WOFF válido."
          : isFrench
          ? "Échec de la conversion de la police. Veuillez vérifier qu'il s'agit d'un fichier TTF, OTF ou WOFF valide."
          : isGerman
          ? "Fehler beim Konvertieren der Schriftart. Bitte stellen Sie sicher, dass es sich um eine gültige TTF-, OTF- oder WOFF-Datei handelt."
          : isSpanish
          ? "Error al convertir la fuente. Asegúrate de que sea un archivo TTF, OTF o WOFF válido."
          : isHindi
          ? "फ़ॉन्ट कनवर्ट करने में विफल। कृपया सुनिश्चित करें कि यह एक मान्य TTF, OTF, या WOFF फ़ाइल है।"
          : isIndonesian
          ? "Gagal mengonversi font. Harap pastikan ini adalah file TTF, OTF, atau WOFF yang valid."
          : isMalay
          ? "Gagal menukar fon. Sila pastikan ini fail TTF, OTF, atau WOFF yang sah."
          : isVietnamese
          ? "Không thể chuyển đổi phông chữ. Vui lòng đảm bảo tệp hợp lệ (TTF, OTF hoặc WOFF)."
          : isThai
          ? "ไม่สามารถแปลงฟอนต์ได้ โปรดตรวจสอบว่าเป็นไฟล์ TTF, OTF หรือ WOFF ที่ถูกต้อง"
          : isFilipino
          ? "Nabigong i-convert ang font. Pakitiyak na ito ay wastong TTF, OTF, o WOFF file."
          : isArabic
          ? "فشل في تحويل الخط. يُرجى التأكد من أنه ملف TTF أو OTF أو WOFF صالح."
          : isHebrew
          ? "המרת הגופן נכשלה. נא לוודא שמדובר בקובץ TTF, OTF או WOFF תקין."
          : "Failed to convert font. Please ensure it is a valid TTF, OTF, or WOFF file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      {!embedded && (
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || (mode === "ttf-to-woff2" ? (isArabic ? "تحويل TTF إلى WOFF2 / WOFF" : isHebrew ? "המרת TTF ל-WOFF2 / WOFF" : isJapanese ? "TTF を WOFF2 / WOFF に変換" : isLatvian ? "Konvertēt TTF uz WOFF2 / WOFF" : isLithuanian ? "Konvertuoti TTF į WOFF2 / WOFF" : isHindi ? "TTF को WOFF2 / WOFF में कनवर्ट करें" : isIndonesian ? "Konversi TTF ke WOFF2 / WOFF" : isMalay ? "Tukar TTF ke WOFF2 / WOFF" : isVietnamese ? "Chuyển đổi TTF sang WOFF2 / WOFF" : isThai ? "แปลง TTF เป็น WOFF2 / WOFF" : isFilipino ? "I-convert ang TTF sa WOFF2 / WOFF" : "Convert TTF to WOFF2 / WOFF") : (isArabic ? "تحويل WOFF2 إلى TTF" : isHebrew ? "המרת WOFF2 ל-TTF" : isJapanese ? "WOFF2 を TTF に変換" : isLatvian ? "Konvertēt WOFF2 uz TTF" : isLithuanian ? "Konvertuoti WOFF2 į TTF" : isHindi ? "WOFF2 को TTF में कनवर्ट करें" : isIndonesian ? "Konversi WOFF2 ke TTF" : isMalay ? "Tukar WOFF2 ke TTF" : isVietnamese ? "Chuyển đổi WOFF2 sang TTF" : isThai ? "แปลง WOFF2 เป็น TTF" : isFilipino ? "I-convert ang WOFF2 sa TTF" : "Convert WOFF2 to TTF"))}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || (isArabic ? "أداة ضغط خطوط الويب عالية الأداء · معالجة 100% في المتصفح" : isHebrew ? "דוחס גופני רשת בעל ביצועים גבוהים · 100% בדפדפן" : isJapanese ? "高性能 Web フォント圧縮ツール · 100% ブラウザ内処理" : isVietnamese ? "Công cụ nén phông chữ web hiệu năng cao · 100% trong trình duyệt" : isThai ? "เครื่องมือบีบอัดฟอนต์เว็บประสิทธิภาพสูง · ทำงานในเบราว์เซอร์ 100%" : isFilipino ? "Mataas na Pagganap na Web Font Compressor · 100% Sa Loob ng Browser" : "High-Performance Web Font Compressor · 100% In-Browser")}
          </p>
        </div>
      )}

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".ttf,.otf,.woff,.woff2";
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {isKorean
              ? `폰트 파일 선택 (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`
              : isJapanese
              ? `フォントファイルを選択 (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`
              : isNorwegian
              ? "Velg skrifttypefil (TTF, OTF, WOFF)"
              : isPolish
              ? "Wybierz plik czcionki (TTF, OTF, WOFF)"
              : isCzech
              ? "Vyberte soubor písma (TTF, OTF, WOFF)"
              : isHungarian
              ? "Betűtípusfájl kiválasztása (TTF, OTF, WOFF)"
              : isRomanian
              ? "Selectează fișierul de font (TTF, OTF, WOFF)"
              : isBulgarian
              ? "Изберете файл с шрифт (TTF, OTF, WOFF)"
              : isGreek
              ? "Επιλογή αρχείου γραμματοσειράς (TTF, OTF, WOFF)"
              : isSlovak
              ? "Vyberte súbor písma (TTF, OTF, WOFF)"
              : isSlovenian
              ? "Izberite datoteko pisave (TTF, OTF, WOFF)"
              : isRussian
              ? "Выберите файл шрифта (TTF, OTF, WOFF)"
              : isUkrainian
              ? "Виберіть файл шрифту (TTF, OTF, WOFF)"
              : isTurkish
              ? "Yazı Tipi Dosyası Seçin (TTF, OTF, WOFF)"
              : isSwedish
              ? "Välj typsnittsfil (TTF, OTF, WOFF)"
              : isDanish
              ? "Vælg skrifttypefil (TTF, OTF, WOFF)"
              : isFinnish
              ? "Valitse fonttitiedosto (TTF, OTF, WOFF)"
              : isCatalan
              ? "Selecciona el fitxer de tipus de lletra (TTF, OTF, WOFF)"
              : isDutch
              ? "Selecteer lettertypebestand (TTF, OTF, WOFF)"
              : isItalian
              ? "Seleziona file di font (TTF, OTF, WOFF)"
              : isPortuguese
              ? "Selecionar ficheiro de fonte (TTF, OTF, WOFF)"
              : isFrench
              ? "Sélectionner un fichier de police (TTF, OTF, WOFF)"
              : isGerman
              ? "Schriftartdatei auswählen (TTF, OTF, WOFF)"
              : isSpanish
              ? "Selecciona archivo de fuente (TTF, OTF, WOFF)"
              : isLatvian
              ? "Izvēlieties fontu failu (TTF, OTF, WOFF)"
              : isLithuanian
              ? "Pasirinkite šrifto failą (TTF, OTF, WOFF)"
              : isHindi
              ? "फ़ॉन्ट फ़ाइल चुनें (TTF, OTF, WOFF)"
              : isIndonesian
              ? "Pilih File Font (TTF, OTF, WOFF)"
              : isMalay
              ? "Pilih Fail Fon (TTF, OTF, WOFF)"
              : isVietnamese
              ? "Chọn tệp phông chữ (TTF, OTF, WOFF)"
              : isThai
              ? "เลือกไฟล์ฟอนต์ (TTF, OTF, WOFF)"
              : isFilipino
              ? "Pumili ng Font File (TTF, OTF, WOFF)"
              : isChinese
              ? "选择字体文件 (TTF, OTF, WOFF)"
              : isArabic
              ? `اختر ملف الخط (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`
              : isHebrew
              ? `בחר קובץ גופן (${mode === "woff2-to-ttf" ? "WOFF2, WOFF" : "TTF, OTF, WOFF"})`
              : "Select Font File (TTF, OTF, WOFF)"}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {isKorean
              ? "빠른 웹 전송 최적화 (서버 추적 없음 · 100% 브라우저 내 로컬 처리)"
              : isJapanese
              ? "Web向けに最適化（サーバー送信なし・100%ブラウザ内処理）"
              : isNorwegian
              ? "Optimalisert for web (100% lokal behandling i nettleseren)"
              : isPolish
              ? "Zoptymalizowany dla sieci (100% lokalnego przetwarzania w przeglądarce)"
              : isCzech
              ? "Optimalizováno pro web (100% lokální zpracování v prohlížeči)"
              : isHungarian
              ? "Webre optimalizálva (100%-ban helyi feldolgozás a böngészőben)"
              : isRomanian
              ? "Optimizat pentru web (100% procesare locală în browser)"
              : isBulgarian
              ? "Оптимизиран за уеб (100% локална обработка в браузъра)"
              : isGreek
              ? "Βελτιστοποιημένο για τον ιστό (100% τοπική επεξεργασία στο πρόγραμμα περιήγησης)"
              : isSlovak
              ? "Optimalizované pre web (100% lokálne spracovanie v prehliadači)"
              : isSlovenian
              ? "Optimizirano za splet (100% lokalna obdelava v brskalniku)"
              : isRussian
              ? "Оптимизировано для веба (100% локальная обработка в браузере)"
              : isUkrainian
              ? "Оптимізовано для вебу (100% локальна обробка в браузері)"
              : isTurkish
              ? "Web için optimize edildi (Tarayıcıda %100 yerel işleme)"
              : isSwedish
              ? "Optimerad för snabb webbpublicering (100% lokal bearbetning)"
              : isDanish
              ? "Optimeret til web (100% lokal behandling i browseren)"
              : isFinnish
              ? "Optimoitu verkkoon (100% paikallinen käsittely selaimessa)"
              : isCatalan
              ? "Optimitzat per a la web (0% d'emmagatzematge al servidor)"
              : isDutch
              ? "Geoptimaliseerd voor het web (100% lokaal in de browser)"
              : isItalian
              ? "Ottimizzato per il Web (0% di archiviazione sui server)"
              : isPortuguese
              ? "Otimizado para a Web (0% de armazenamento no servidor)"
              : isFrench
              ? "Optimisé pour le Web (0% de stockage sur serveur)"
              : isGerman
              ? "Für das Web optimiert (Kein Server-Tracking)"
              : isSpanish
              ? "Optimizado para la web (0% almacenamiento en servidor)"
              : isLatvian
              ? "Optimizēts ātrais tīmekļa piegādei (bez servera izsekošanas)"
              : isLithuanian
              ? "Optimizuota greitas žiniatinklio pristatymui (jokio serverio sekimo)"
              : isHindi
              ? "वेब के लिए अनुकूलित (ब्राउज़र में 100% स्थानीय प्रसंस्करण)"
              : isIndonesian
              ? "Dioptimalkan untuk web (100% pemrosesan lokal di browser)"
              : isMalay
              ? "Dioptimumkan untuk web (100% pemprosesan setempat dalam pelayar)"
              : isVietnamese
              ? "Tối ưu hóa tải web nhanh (100% xử lý cục bộ, không gửi dữ liệu ra ngoài)"
              : isThai
              ? "เพิ่มประสิทธิภาพสำหรับเว็บ (ประมวลผลในเครื่อง 100% โดยไม่มีการส่งข้อมูล)"
              : isFilipino
              ? "Na-optimize para sa mabilis na paghahatid sa web (Walang server tracking)"
              : isChinese
              ? "为快速网络加载优化（100%本地处理，零服务器追踪）"
              : isArabic
              ? "محسّن لتسليم الويب السريع (معالجة محلية 100% بدون تتبع)"
              : isHebrew
              ? "מותאם לטעינה מהירה ברשת (100% עיבוד מקומי בדפדפן)"
              : "Optimized for fast web delivery (Zero server tracking)"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Font Metadata Badge */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">
                {isKorean
                  ? `포맷: ${fontMeta?.format.toUpperCase()} · 테이블 수: ${fontMeta?.numTables} · 파일 크기: ${(file.size / 1024).toFixed(1)} KB`
                  : isNorwegian
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabeller: ${fontMeta?.numTables} · Størrelse: ${(file.size / 1024).toFixed(1)} KB`
                  : isPolish
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabele: ${fontMeta?.numTables} · Rozmiar: ${(file.size / 1024).toFixed(1)} KB`
                  : isCzech
                  ? `Formát: ${fontMeta?.format.toUpperCase()} · Tabulky: ${fontMeta?.numTables} · Velikost: ${(file.size / 1024).toFixed(1)} KB`
                  : isHungarian
                  ? `Formátum: ${fontMeta?.format.toUpperCase()} · Táblák: ${fontMeta?.numTables} · Méret: ${(file.size / 1024).toFixed(1)} KB`
                  : isRomanian
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabele: ${fontMeta?.numTables} · Dimensiune: ${(file.size / 1024).toFixed(1)} KB`
                  : isGreek
                  ? `Μορφή: ${fontMeta?.format.toUpperCase()} · Πίνακες: ${fontMeta?.numTables} · Μέγεθος: ${(file.size / 1024).toFixed(1)} KB`
                  : isTurkish
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tablolar: ${fontMeta?.numTables} · Boyut: ${(file.size / 1024).toFixed(1)} KB`
                  : isSwedish
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabeller: ${fontMeta?.numTables} · Storlek: ${(file.size / 1024).toFixed(1)} KB`
                  : isDanish
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabeller: ${fontMeta?.numTables} · Størrelse: ${(file.size / 1024).toFixed(1)} KB`
                  : isFinnish
                  ? `Muoto: ${fontMeta?.format.toUpperCase()} · Taulukot: ${fontMeta?.numTables} · Koko: ${(file.size / 1024).toFixed(1)} KB`
                  : isCatalan
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Taules: ${fontMeta?.numTables} · Mida: ${(file.size / 1024).toFixed(1)} KB`
                  : isDutch
                  ? `Formaat: ${fontMeta?.format.toUpperCase()} · Tabellen: ${fontMeta?.numTables} · Grootte: ${(file.size / 1024).toFixed(1)} KB`
                  : isItalian
                  ? `Formato: ${fontMeta?.format.toUpperCase()} · Tabelle: ${fontMeta?.numTables} · Dimensione: ${(file.size / 1024).toFixed(1)} KB`
                  : isPortuguese
                  ? `Formato: ${fontMeta?.format.toUpperCase()} · Tabelas: ${fontMeta?.numTables} · Tamanho: ${(file.size / 1024).toFixed(1)} KB`
                  : isFrench
                  ? `Format : ${fontMeta?.format.toUpperCase()} · Tables : ${fontMeta?.numTables} · Taille : ${(file.size / 1024).toFixed(1)} Ko`
                  : isGerman
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabellen: ${fontMeta?.numTables} · Größe: ${(file.size / 1024).toFixed(1)} KB`
                  : isSpanish
                  ? `Formato: ${fontMeta?.format.toUpperCase()} · Tablas: ${fontMeta?.numTables} · Tamaño: ${(file.size / 1024).toFixed(1)} KB`
                  : isLatvian
                  ? `Formāts: ${fontMeta?.format.toUpperCase()} · Tabulas: ${fontMeta?.numTables} · Izmērs: ${(file.size / 1024).toFixed(1)} KB`
                  : isLithuanian
                  ? `Formatas: ${fontMeta?.format.toUpperCase()} · Lentelės: ${fontMeta?.numTables} · Dydis: ${(file.size / 1024).toFixed(1)} KB`
                  : isHindi
                  ? `प्रारूप: ${fontMeta?.format.toUpperCase()} · तालिकाएँ: ${fontMeta?.numTables} · आकार: ${(file.size / 1024).toFixed(1)} KB`
                  : isIndonesian
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabel: ${fontMeta?.numTables} · Ukuran: ${(file.size / 1024).toFixed(1)} KB`
                  : isMalay
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Jadual: ${fontMeta?.numTables} · Saiz: ${(file.size / 1024).toFixed(1)} KB`
                  : isVietnamese
                  ? `Định dạng: ${fontMeta?.format.toUpperCase()} · Bảng: ${fontMeta?.numTables} · Kích thước: ${(file.size / 1024).toFixed(1)} KB`
                  : isThai
                  ? `รูปแบบ: ${fontMeta?.format.toUpperCase()} · ตาราง: ${fontMeta?.numTables} · ขนาด: ${(file.size / 1024).toFixed(1)} KB`
                  : isFilipino
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Mga Talahanayan: ${fontMeta?.numTables} · Laki: ${(file.size / 1024).toFixed(1)} KB`
                  : isArabic
                  ? `الصيغة: ${fontMeta?.format.toUpperCase()} · الجداول: ${fontMeta?.numTables} · الحجم: ${(file.size / 1024).toFixed(1)} ك.ب`
                  : isHebrew
                  ? `פורמט: ${fontMeta?.format.toUpperCase()} · טבלאות: ${fontMeta?.numTables} · גודל: ${(file.size / 1024).toFixed(1)} KB`
                  : `Format: ${fontMeta?.format.toUpperCase()} · Tables: ${fontMeta?.numTables} · Size: ${(file.size / 1024).toFixed(1)} KB`}
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isArabic ? "تغيير الخط" : isHebrew ? "החלף גופן" : isKorean ? "폰트 변경" : isJapanese ? "フォントを変更" : isNorwegian ? "Endre skrifttype" : isPolish ? "Zmień czcionkę" : isCzech ? "Změnit písmo" : isHungarian ? "Betűtípus módosítása" : isRomanian ? "Schimbă fontul" : isGreek ? "Αλλαγή γραμματοσειράς" : isTurkish ? "Yazı Tipini Değiştir" : isSwedish ? "Byt typsnitt" : isDanish ? "Skift skrifttype" : isFinnish ? "Vaihda fontti" : isCatalan ? "Canviar tipus de lletra" : isDutch ? "Lettertype wijzigen" : isItalian ? "Cambia font" : isPortuguese ? "Alterar fonte" : isFrench ? "Changer de police" : isGerman ? "Schriftart ändern" : isSpanish ? "Cambiar fuente" : isLatvian ? "Mainīt fontu" : isLithuanian ? "Pakeisti šriftą" : isHindi ? "फ़ॉन्ट बदलें" : isIndonesian ? "Ganti Font" : isMalay ? "Tukar Fon" : isVietnamese ? "Đổi phông chữ" : isThai ? "เปลี่ยนฟอนต์" : isFilipino ? "Palitan ang Font" : isTaiwan ? "更換字型" : isSimplifiedChinese ? "更换字体" : "Change Font"}
            </button>
          </div>

          {/* Interactive Font Preview Box */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isArabic ? "معاينة الخط المباشرة" : isHebrew ? "תצוגה מקדימה חיה של הגופן" : isKorean ? "실시간 폰트 미리보기" : isJapanese ? "ライブプレビュー" : isNorwegian ? "Interaktiv forhåndsvisning" : isPolish ? "Interaktywny podgląd" : isCzech ? "Interaktivní náhled" : isHungarian ? "Interaktív előnézet" : isRomanian ? "Previzualizare interactivă" : isGreek ? "Διαδραστική προεπισκόπηση" : isTurkish ? "Canlı Yazı Tipi Önizlemesi" : isSwedish ? "Interaktiv förhandsvisning" : isDanish ? "Interaktiv forhåndsvisning" : isFinnish ? "Interaktiivinen esikatselu" : isCatalan ? "Vista prèvia interactiva" : isDutch ? "Live lettertypevoorbeeld" : isItalian ? "Anteprima del font" : isPortuguese ? "Pré-visualização da fonte" : isFrench ? "Aperçu de la police" : isGerman ? "Interaktive Vorschau" : isSpanish ? "Vista previa interactiva" : isLatvian ? "Fontu priekšskatījums" : isLithuanian ? "Šrifto peržiūra" : isHindi ? "लाइव फ़ॉन्ट पूर्वावलोकन" : isIndonesian ? "Pratinjau Font Langsung" : isMalay ? "Pratonton Fon Langsung" : isVietnamese ? "Xem trước phông chữ trực tiếp" : isThai ? "ตัวอย่างฟอนต์สด" : isFilipino ? "Live na Preview ng Font" : isTaiwan ? "即時字型預覽" : isSimplifiedChinese ? "实时字体预览" : "Live Font Preview"}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {isArabic ? "حجم الخط:" : isHebrew ? "גודל גופן:" : isKorean ? "글자 크기:" : isJapanese ? "サイズ:" : isNorwegian ? "Størrelse:" : isPolish ? "Rozmiar:" : isCzech ? "Velikost:" : isHungarian ? "Méret:" : isRomanian ? "Dimensiune:" : isGreek ? "Μέγεθος:" : isTurkish ? "Boyut:" : isSwedish ? "Storlek:" : isDanish ? "Størrelse:" : isFinnish ? "Koko:" : isCatalan ? "Mida:" : isDutch ? "Grootte:" : isItalian ? "Dimensione:" : isPortuguese ? "Tamanho:" : isFrench ? "Taille :" : isGerman ? "Größe:" : isSpanish ? "Tamaño:" : isLatvian ? "Izmērs:" : isLithuanian ? "Dydis:" : isHindi ? "आकार:" : isIndonesian ? "Ukuran:" : isMalay ? "Saiz:" : isVietnamese ? "Cỡ chữ:" : isThai ? "ขนาด:" : isFilipino ? "Laki:" : "Size:"} {fontSize}px
                </span>
                <input
                  type="range"
                  min="16"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              rows={3}
              className="w-full p-4 border border-slate-200 rounded-fk-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 resize-none transition-colors"
            />
          </div>

          {/* Ready Download Card */}
          {outputUrl && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-purple-900 block">
                  {isKorean
                    ? `✓ 폰트 변환 완료: ${outputFileName}`
                    : isNorwegian
                    ? `✓ Skrifttype konvertert: ${outputFileName}`
                    : isPolish
                    ? `✓ Czcionka przekonwertowana: ${outputFileName}`
                    : isCzech
                    ? `✓ Písmo převedeno: ${outputFileName}`
                    : isHungarian
                    ? `✓ Betűtípus konvertálva: ${outputFileName}`
                    : isBulgarian
                    ? `✓ Шрифтът е конвертиран: ${outputFileName}`
                    : isGreek
                    ? `✓ Η γραμματοσειρά μετατράπηκε: ${outputFileName}`
                    : isSlovak
                    ? `✓ Písmo bolo skonvertované: ${outputFileName}`
                    : isSlovenian
                    ? `✓ Pisava je pretvorjena: ${outputFileName}`
                    : isRussian
                    ? `✓ Шрифт сконвертирован: ${outputFileName}`
                    : isUkrainian
                    ? `✓ Шрифт сконвертовано: ${outputFileName}`
                    : isTurkish
                    ? `✓ Yazı Tipi Dönüştürüldü: ${outputFileName}`
                    : isSwedish
                    ? `✓ Typsnitt konverterat: ${outputFileName}`
                    : isDanish
                    ? `✓ Skrifttype konverteret: ${outputFileName}`
                    : isFinnish
                    ? `✓ Fontti muunnettu: ${outputFileName}`
                    : isCatalan
                    ? `✓ Tipus de lletra convertit: ${outputFileName}`
                    : isDutch
                    ? `✓ Lettertype geconverteerd: ${outputFileName}`
                    : isItalian
                    ? `✓ Font convertito: ${outputFileName}`
                    : isPortuguese
                    ? `✓ Fonte convertida: ${outputFileName}`
                    : isFrench
                    ? `✓ Police convertie : ${outputFileName}`
                    : isGerman
                    ? `✓ Schriftart konvertiert: ${outputFileName}`
                    : isSpanish
                    ? `✓ Fuente convertida: ${outputFileName}`
                    : isHindi
                    ? `✓ फ़ॉन्ट कनवर्ट किया गया: ${outputFileName}`
                    : isIndonesian
                    ? `✓ Font Dikonversi: ${outputFileName}`
                    : isMalay
                    ? `✓ Fon Ditukar: ${outputFileName}`
                    : isVietnamese
                    ? `✓ Đã chuyển đổi phông chữ: ${outputFileName}`
                    : isThai
                    ? `✓ แปลงฟอนต์สำเร็จ: ${outputFileName}`
                    : isFilipino
                    ? `✓ Na-convert ang Font: ${outputFileName}`
                    : isArabic
                    ? `✓ تم تحويل الخط: ${outputFileName}`
                    : isHebrew
                    ? `✓ הגופן הומר בהצלחה: ${outputFileName}`
                    : `✓ Font Converted: ${outputFileName}`}
                </span>
                <span className="text-xs text-purple-700">
                  {isKorean
                    ? `파일 크기: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% 브라우저 내 처리`
                    : isNorwegian
                    ? `Størrelse: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% I nettleseren`
                    : isPolish
                    ? `Rozmiar: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% W przeglądarce`
                    : isCzech
                    ? `Velikost: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% V prohlížeči`
                    : isHungarian
                    ? `Méret: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Böngészőben`
                    : isRomanian
                    ? `Dimensiune: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% În browser`
                    : isBulgarian
                    ? `Размер: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% В браузъра`
                    : isGreek
                    ? `Μέγεθος: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Στο πρόγραμμα περιήγησης`
                    : isSlovak
                    ? `Veľkosť: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% V prehliadači`
                    : isSlovenian
                    ? `Velikost: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% V brskalniku`
                    : isRussian
                    ? `Размер: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% В браузере`
                    : isUkrainian
                    ? `Розмір: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% У браузері`
                    : isTurkish
                    ? `Boyut: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · %100 Tarayıcıda`
                    : isSwedish
                    ? `Storlek: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% I webbläsaren`
                    : isDanish
                    ? `Størrelse: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% I browseren`
                    : isFinnish
                    ? `Koko: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Selaimessa`
                    : isCatalan
                    ? `Mida: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Al navegador`
                    : isDutch
                    ? `Grootte: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% In browser`
                    : isItalian
                    ? `Dimensione: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Nel browser`
                    : isPortuguese
                    ? `Tamanho: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% No navegador`
                    : isFrench
                    ? `Taille : ${((outputBlob?.size || 0) / 1024).toFixed(1)} Ko · 100% Dans le navigateur`
                    : isGerman
                    ? `Größe: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Im Browser`
                    : isSpanish
                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% En el navegador`
                    : isHindi
                    ? `आकार: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% ब्राउज़र में`
                    : isIndonesian
                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Di Browser`
                    : isMalay
                    ? `Saiz: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Dalam Pelayar`
                    : isVietnamese
                    ? `Dung lượng: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% trong trình duyệt`
                    : isThai
                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · ในเบราว์เซอร์ 100%`
                    : isFilipino
                    ? `Laki: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Sa Loob ng Browser`
                    : isArabic
                    ? `الحجم: ${((outputBlob?.size || 0) / 1024).toFixed(1)} ك.ب · معالجة 100% في المتصفح`
                    : isHebrew
                    ? `גודל: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% בדפדפן`
                    : `Size: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% In-Browser`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isArabic ? "تحميل الخط" : isHebrew ? "הורד גופן" : isKorean ? "폰트 다운로드" : isJapanese ? "フォントを変更" : isNorwegian ? "Last ned skrifttype" : isPolish ? "Pobierz czcionkę" : isCzech ? "Stáhnout písmo" : isHungarian ? "Betűtípus letöltése" : isRomanian ? "Descarcă fontul" : isBulgarian ? "Изтегляне на шрифт" : isGreek ? "Λήψη γραμματοσειράς" : isSlovak ? "Stiahnuť písmo" : isSlovenian ? "Prenesi pisavo" : isRussian ? "Скачать шрифт" : isUkrainian ? "Завантажити шрифт" : isTurkish ? "Yazı Tipini İndir" : isSwedish ? "Ladda ner typsnitt" : isDanish ? "Download skrifttype" : isFinnish ? "Lataa fontti" : isCatalan ? "Descarregar tipus de lletra" : isDutch ? "Lettertype downloaden" : isItalian ? "Scarica font" : isPortuguese ? "Descarregar fonte" : isFrench ? "Télécharger la police" : isGerman ? "Schriftart herunterladen" : isSpanish ? "Descargar fuente" : isLatvian ? "Lejupielādēt fontu" : isLithuanian ? "Atsisiųsti šriftą" : isHindi ? "फ़ॉन्ट डाउनलोड करें" : isIndonesian ? "Unduh Font" : isMalay ? "Muat Turun Fon" : isVietnamese ? "Tải xuống phông chữ" : isThai ? "ดาวน์โหลดฟอนต์" : isFilipino ? "I-download ang Font" : isTaiwan ? "下載字型" : isSimplifiedChinese ? "下载字体" : "Download Font"}
              </a>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-fk-md">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
