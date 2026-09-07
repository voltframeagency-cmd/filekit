"use client";

import React, { useState, useEffect } from "react";
import { EbookEngine } from "./EbookEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface EbookWorkspaceProps {
  mode: "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";
  title?: string;
  description?: string;
  embedded?: boolean;
  language?: string;
}

export function EbookWorkspace({ mode, title, description, embedded = true, language: propLang }: EbookWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const isChinese = language.startsWith("zh");
  const isTaiwan = language === "zh-TW";
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";
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
  const isGreek = language === "el";
  const isTurkish = language === "tr";
  const isHindi = language === "hi";
  const isIndonesian = language === "id";
  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";
  const isJapanese = language === "ja";
  const isKorean = language === "ko";

  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const getAcceptExtensions = () => {
    if (mode === "epub-to-pdf") return ".epub";
    if (mode === "mobi-to-pdf") return ".mobi";
    if (mode === "azw3-to-pdf") return ".azw3,.azw";
    return ".epub,.mobi,.azw3,.azw";
  };

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      let pdfBytes: Uint8Array;

      if (mode === "mobi-to-pdf") {
        pdfBytes = await EbookEngine.mobiToPdf(buf);
      } else if (mode === "azw3-to-pdf") {
        pdfBytes = await EbookEngine.azw3ToPdf(buf);
      } else {
        pdfBytes = await EbookEngine.epubToPdf(buf);
      }

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf");
    } catch (err) {
      console.error(err);
      setError(
        isChinese
          ? (isTaiwan ? "無法將電子書轉換為 PDF。請確認該檔案沒有 DRM 數位版權保護。" : "无法将电子书转换为 PDF。请确认该文件没有 DRM 数字版权保护。")
          : isNorwegian
          ? "Kunne ikke konvertere e-boken til PDF. Sørg for at filen er fri for DRM-beskyttelse."
          : isRussian
          ? "Не удалось конвертировать электронную книгу в PDF. Убедитесь, что файл не защищен DRM."
          : isUkrainian
          ? "Не вдалося конвертувати електронну книгу в PDF. Переконайтеся, що файл не захищений DRM."
          : isSlovak
          ? "Nepodarilo sa skonvertovať e-knihu na PDF. Uistite sa, že súbor nie je chránený DRM."
          : isSlovenian
          ? "E-knjige ni bilo mogoče pretvoriti v PDF. Prepričajte se, da datoteka nima zaščite DRM."
          : isBulgarian
          ? "Неуспешно конвертиране на електронната книга в PDF. Уверете се, че файлът няма DRM защита."
          : isPolish
          ? "Nie udało się przekonwertować e-booka na PDF. Upewnij się, że plik nie posiada zabezpieczenia DRM."
          : isCzech
          ? "Nepodařilo se převést e-knihu do PDF. Ujistěte se, že soubor nemá ochranu DRM."
          : isHungarian
          ? "Nem sikerült konvertálni az e-könyvet PDF-be. Győződjön meg arról, hogy a fájl DRM-mentes."
          : isRomanian
          ? "Nu s-a putut converti cartea electronică în PDF. Asigurați-vă că fișierul nu are protecție DRM."
          : isGreek
          ? "Αποτυχία μετατροπής ηλεκτρονικού βιβλίου σε PDF. Βεβαιωθείτε ότι το αρχείο δεν έχει προστασία DRM."
          : isTurkish
          ? "E-kitap PDF'e dönüştürülemedi. Lütfen dosyanın DRM korumasız olduğundan emin olun."
          : isSwedish
          ? "Kunde inte konvertera e-boken till PDF. Kontrollera att filen inte har DRM-skydd."
          : isDanish
          ? "Kunne ikke konvertere e-bogen til PDF. Sørg for, at filen er DRM-fri."
          : isFinnish
          ? "E-kirjan muuntaminen PDF-muotoon epäonnistui. Varmista, että tiedosto on DRM-vapaa."
          : isCatalan
          ? "Error en convertir l'eBook a PDF. Assegura't que el fitxer no tingui protecció DRM."
          : isDutch
          ? "Kan eBook niet naar PDF converteren. Zorg ervoor dat het bestand DRM-vrij is."
          : isItalian
          ? "Impossibile convertire l'eBook in PDF. Assicurati che il file non sia protetto da DRM."
          : isPortuguese
          ? "Falha ao converter o eBook em PDF. Certifique-se de que o ficheiro não tem proteção DRM."
          : isFrench
          ? "Échec de la conversion de l'eBook en PDF. Veuillez vérifier que le fichier est sans DRM."
          : isGerman
          ? "Fehler beim Konvertieren des E-Books in PDF. Bitte stellen Sie sicher, dass die Datei nicht DRM-geschützt ist."
          : isSpanish
          ? "Error al convertir el libro electrónico a PDF. Asegúrate de que el archivo no tenga DRM."
          : isHindi
          ? "ई-बुक को PDF में कनवर्ट करने में विफल। कृपया सुनिश्चित करें कि फ़ाइल DRM-मुक्त है।"
          : isIndonesian
          ? "Gagal mengonversi eBook ke PDF. Harap pastikan file bebas DRM."
          : isFilipino
          ? "Nabigong i-convert ang eBook sa PDF. Pakitiyak na walang DRM ang file."
          : "Failed to convert eBook to PDF. Please ensure the file is DRM-free."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      {!embedded && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            {title || "eBook Converter"}
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            {description || "High-Fidelity Document Rendering · 100% In-Browser & Private"}
          </p>
        </div>
      )}

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = getAcceptExtensions();
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {isChinese
              ? (isTaiwan ? `選取電子書檔案 (${getAcceptExtensions().toUpperCase()})` : `选择电子书文件 (${getAcceptExtensions().toUpperCase()})`)
              : isJapanese
              ? `eBookファイルを選択 (${getAcceptExtensions().toUpperCase()})`
              : isNorwegian
              ? `Velg e-bokfil (${getAcceptExtensions().toUpperCase()})`
              : isRussian
              ? `Выберите файл электронной книги (${getAcceptExtensions().toUpperCase()})`
              : isUkrainian
              ? `Виберіть файл електронної книги (${getAcceptExtensions().toUpperCase()})`
              : isSlovak
              ? `Vyberte súbor e-knihy (${getAcceptExtensions().toUpperCase()})`
              : isSlovenian
              ? `Izberite datoteko e-knjige (${getAcceptExtensions().toUpperCase()})`
              : isBulgarian
              ? `Изберете файл с електронна книга (${getAcceptExtensions().toUpperCase()})`
              : isPolish
              ? `Wybierz plik e-booka (${getAcceptExtensions().toUpperCase()})`
              : isCzech
              ? `Vyberte soubor e-knihy (${getAcceptExtensions().toUpperCase()})`
              : isHungarian
              ? `E-könyv fájl kiválasztása (${getAcceptExtensions().toUpperCase()})`
              : isRomanian
              ? `Selectează fișierul eBook (${getAcceptExtensions().toUpperCase()})`
              : isGreek
              ? `Επιλέξτε αρχείο eBook (${getAcceptExtensions().toUpperCase()})`
              : isTurkish
              ? `E-Kitap Dosyası Seçin (${getAcceptExtensions().toUpperCase()})`
              : isSwedish
              ? `Välj e-boksfil (${getAcceptExtensions().toUpperCase()})`
              : isDanish
              ? `Vælg e-bogsfil (${getAcceptExtensions().toUpperCase()})`
              : isFinnish
              ? `Valitse e-kirjatiedosto (${getAcceptExtensions().toUpperCase()})`
              : isCatalan
              ? `Selecciona el fitxer d'eBook (${getAcceptExtensions().toUpperCase()})`
              : isDutch
              ? `Selecteer e-bookbestand (${getAcceptExtensions().toUpperCase()})`
              : isItalian
              ? `Seleziona file eBook (${getAcceptExtensions().toUpperCase()})`
              : isPortuguese
              ? `Selecionar ficheiro de eBook (${getAcceptExtensions().toUpperCase()})`
              : isFrench
              ? `Sélectionner un fichier eBook (${getAcceptExtensions().toUpperCase()})`
              : isGerman
              ? `E-Book-Datei auswählen (${getAcceptExtensions().toUpperCase()})`
              : isSpanish
              ? `Selecciona archivo de eBook (${getAcceptExtensions().toUpperCase()})`
              : isHindi
              ? `ई-बुक फ़ाइल चुनें (${getAcceptExtensions().toUpperCase()})`
              : isVietnamese
              ? `Chọn tệp eBook (${getAcceptExtensions().toUpperCase()})`
              : isThai
              ? `เลือกไฟล์ eBook (${getAcceptExtensions().toUpperCase()})`
              : isIndonesian
              ? `Pilih File eBook (${getAcceptExtensions().toUpperCase()})`
              : isFilipino
              ? `Pumili ng eBook File (${getAcceptExtensions().toUpperCase()})`
              : `Select eBook File (${getAcceptExtensions().toUpperCase()})`}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {isChinese
              ? (isTaiwan ? "零伺服器上傳 · 100% 瀏覽器本機隱私轉換" : "零服务器上传 · 100% 浏览器本地隐私转换")
              : isJapanese
              ? "サーバー送信なし · 100% ブラウザ内で安全に変換"
              : isNorwegian
              ? "Ingen serveropplastinger · 100% privat konvertering i nettleseren"
              : isRussian
              ? "Без отправки на сервер · 100% приватная конвертация в браузере"
              : isUkrainian
              ? "Без завантаження на сервер · 100% приватна конвертація у браузері"
              : isSlovak
              ? "Žiadne nahrávanie na server · 100% súkromná konverzia v prehliadači"
              : isSlovenian
              ? "Brez nalaganja na strežnik · 100 % zasebna pretvorba v brskalniku"
              : isBulgarian
              ? "Без качване на сървър · 100% частно конвертиране в браузъра"
              : isPolish
              ? "Bez przesyłania na serwer · W 100% prywatna konwersja w przeglądarce"
              : isCzech
              ? "Žádné nahrávání na server · 100% soukromý převod v prohlížeči"
              : isHungarian
              ? "Nincs szerverre feltöltés · 100%-ban privát konverzió a böngészőben"
              : isRomanian
              ? "Fără încărcare pe server · Conversie 100% privată în browser"
              : isGreek
              ? "Χωρίς μεταφόρτωση σε διακομιστή · 100% ιδιωτική μετατροπή στο πρόγραμμα περιήγησης"
              : isTurkish
              ? "Sunucuya yükleme yok · Tarayıcıda %100 gizli dönüştürme"
              : isSwedish
              ? "Inga serveruppladdningar · 100% privat konvertering i webbläsaren"
              : isDanish
              ? "Ingen serveruploads · 100% privat konvertering i browseren"
              : isFinnish
              ? "Ei palvelinlatauksia · 100% yksityinen muunnos selaimessa"
              : isCatalan
              ? "Sense càrregues a servidors · Conversió privada al 100% al navegador"
              : isDutch
              ? "Geen uploads naar servers · 100% privé conversie in browser"
              : isItalian
              ? "Nessun caricamento su server · Conversione privata al 100% nel browser"
              : isPortuguese
              ? "Sem envios para servidores · Conversão 100% privada no navegador"
              : isFrench
              ? "Aucun transfert vers un serveur · Conversion 100% privée dans le navigateur"
              : isGerman
              ? "Kein Server-Upload · Private Konvertierung im Browser"
              : isSpanish
              ? "Sin subida a servidores · Conversión privada en el navegador"
              : isHindi
              ? "शून्य सर्वर अपलोड · ब्राउज़र में 100% सुरक्षित निजी रूपांतरण"
              : isIndonesian
              ? "Nol Unggahan Server · 100% Konversi Privat di Browser"
              : isFilipino
              ? "Walang Pag-upload sa Server · 100% Pribadong Pag-convert sa Browser"
              : "Zero Server Uploads · 100% In-Browser Private Conversion"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isChinese ? (isTaiwan ? "變更檔案" : "更改文件") : isKorean ? "파일 변경" : isJapanese ? "ファイルを変更" : isRussian ? "Изменить файл" : isUkrainian ? "Змінити файл" : isSlovak ? "Zmeniť súbor" : isSlovenian ? "Spremeni datoteko" : isBulgarian ? "Промяна на файла" : isNorwegian ? "Endre fil" : isPolish ? "Zmień plik" : isCzech ? "Změnit soubor" : isHungarian ? "Fájl módosítása" : isRomanian ? "Schimbă fișierul" : isGreek ? "Αλλαγή αρχείου" : isTurkish ? "Dosyayı Değiştir" : isSwedish ? "Byt fil" : isDanish ? "Skift fil" : isFinnish ? "Vaihda tiedosto" : isCatalan ? "Canviar fitxer" : isDutch ? "Bestand wijzigen" : isItalian ? "Cambia file" : isPortuguese ? "Alterar ficheiro" : isFrench ? "Changer de fichier" : isGerman ? "Datei ändern" : isSpanish ? "Cambiar archivo" : isHindi ? "फ़ाइल बदलें" : isIndonesian ? "Ganti File" : isMalay ? "Tukar Fail" : isVietnamese ? "Đổi tệp" : isThai ? "เปลี่ยนไฟล์" : isFilipino ? "Palitan ang File" : "Change File"}
            </button>
          </div>

          {loading && (
            <div className="p-6 bg-slate-50 rounded-fk-lg border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-slate-700">
                {isChinese
                  ? (isTaiwan ? "正在將電子書頁面轉換並渲染為 PDF..." : "正在将电子书页面转换并渲染为 PDF...")
                  : isNorwegian
                  ? "Gjengir e-boksider til PDF..."
                  : isRussian
                  ? "Рендеринг страниц электронной книги в PDF..."
                  : isUkrainian
                  ? "Рендеринг сторінок електронної книги в PDF..."
                  : isSlovak
                  ? "Vykresľovanie stránok e-knihy do PDF..."
                  : isSlovenian
                  ? "Izrisovanje strani e-knjige v PDF..."
                  : isBulgarian
                  ? "Рендиране на страници от електронна книга в PDF..."
                  : isPolish
                  ? "Renderowanie stron e-booka do formatu PDF..."
                  : isCzech
                  ? "Vykreslování stránek e-knihy do PDF..."
                  : isHungarian
                  ? "E-könyv oldalainak renderelése PDF-be..."
                  : isRomanian
                  ? "Se randează paginile cărții electronice în PDF..."
                  : isGreek
                  ? "Απόδοση σελίδων eBook σε PDF..."
                  : isTurkish
                  ? "e-Kitap sayfaları PDF'ye dönüştürülüyor..."
                  : isSwedish
                  ? "Renderar e-boksidor till PDF..."
                  : isDanish
                  ? "Gengiver e-bogssider til PDF..."
                  : isFinnish
                  ? "Muunnetaan e-kirjan sivuja PDF-muotoon..."
                  : isCatalan
                  ? "Renderitzant pàgines del llibre electrònic a PDF..."
                  : isDutch
                  ? "eBook-pagina's renderen naar PDF..."
                  : isItalian
                  ? "Rendering delle pagine dell'eBook in PDF..."
                  : isPortuguese
                  ? "A renderizar páginas do eBook em PDF..."
                  : isFrench
                  ? "Conversion des pages de l'eBook en PDF..."
                  : isGerman
                  ? "E-Book wird in PDF gerendert..."
                  : isSpanish
                  ? "Renderizando libro a PDF..."
                  : isHindi
                  ? "ई-बुक पृष्ठों को PDF में रेंडर किया जा रहा है..."
                  : isIndonesian
                  ? "Merender halaman eBook ke PDF..."
                  : isMalay
                  ? "Merender halaman eBook ke PDF..."
                  : isThai
                  ? "กำลังเรนเดอร์หน้า eBook เป็น PDF..."
                  : isFilipino
                  ? "Nire-render ang mga pahina ng eBook sa PDF..."
                  : "Rendering eBook pages to PDF..."}
              </span>
            </div>
          )}

          {outputUrl && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-amber-900 block">
                  {isChinese
                    ? (isTaiwan ? `✓ 已完成轉換: ${outputFileName}` : `✓ 已完成转换: ${outputFileName}`)
                    : isNorwegian
                    ? `✓ Konvertert: ${outputFileName}`
                    : isRussian
                    ? `✓ Сконвертировано: ${outputFileName}`
                    : isUkrainian
                    ? `✓ Сконвертовано: ${outputFileName}`
                    : isSlovak
                    ? `✓ Skonvertované: ${outputFileName}`
                    : isSlovenian
                    ? `✓ Pretvorjeno: ${outputFileName}`
                    : isBulgarian
                    ? `✓ Конвертирано: ${outputFileName}`
                    : isPolish
                    ? `✓ Skonwertowano: ${outputFileName}`
                    : isCzech
                    ? `✓ Převedeno: ${outputFileName}`
                    : isHungarian
                    ? `✓ Konvertálva: ${outputFileName}`
                    : isRomanian
                    ? `✓ Convertit: ${outputFileName}`
                    : isGreek
                    ? `✓ Μετατράπηκε: ${outputFileName}`
                    : isTurkish
                    ? `✓ Dönüştürüldü: ${outputFileName}`
                    : isSwedish
                    ? `✓ Konverterad: ${outputFileName}`
                    : isDanish
                    ? `✓ Konverteret: ${outputFileName}`
                    : isFinnish
                    ? `✓ Muunnettu: ${outputFileName}`
                    : isCatalan
                    ? `✓ Convertit: ${outputFileName}`
                    : isDutch
                    ? `✓ Geconverteerd: ${outputFileName}`
                    : isItalian
                    ? `✓ Convertito: ${outputFileName}`
                    : isPortuguese
                    ? `✓ Convertido: ${outputFileName}`
                    : isFrench
                    ? `✓ Converti : ${outputFileName}`
                    : isGerman
                    ? `✓ Konvertiert: ${outputFileName}`
                    : isSpanish
                    ? `✓ Convertido: ${outputFileName}`
                    : isHindi
                    ? `✓ कनवर्ट किया गया: ${outputFileName}`
                    : isIndonesian
                    ? `✓ Dikonversi: ${outputFileName}`
                    : isMalay
                    ? `✓ Ditukar: ${outputFileName}`
                    : isThai
                    ? `✓ แปลงสำเร็จ: ${outputFileName}`
                    : isFilipino
                    ? `✓ Na-convert: ${outputFileName}`
                    : `✓ Converted: ${outputFileName}`}
                </span>
                <span className="text-xs text-amber-700">
                  {isChinese
                    ? (isTaiwan ? `檔案大小: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF 文件` : `文件大小: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF 文档`)
                    : isNorwegian
                    ? `Størrelse: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument`
                    : isRussian
                    ? `Размер: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} МБ · Документ PDF`
                    : isUkrainian
                    ? `Розмір: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} МБ · Документ PDF`
                    : isSlovak
                    ? `Veľkosť: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`
                    : isSlovenian
                    ? `Velikost: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`
                    : isBulgarian
                    ? `Размер: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF документ`
                    : isPolish
                    ? `Rozmiar: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`
                    : isCzech
                    ? `Velikost: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`
                    : isHungarian
                    ? `Méret: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF dokumentum`
                    : isRomanian
                    ? `Dimensiune: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Document PDF`
                    : isGreek
                    ? `Μέγεθος: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Έγγραφο PDF`
                    : isTurkish
                    ? `Boyut: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF Belgesi`
                    : isSwedish
                    ? `Storlek: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument`
                    : isDanish
                    ? `Størrelse: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument`
                    : isFinnish
                    ? `Koko: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-asiakirja`
                    : isCatalan
                    ? `Mida: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Document PDF`
                    : isDutch
                    ? `Grootte: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-document`
                    : isItalian
                    ? `Dimensione: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Documento PDF`
                    : isPortuguese
                    ? `Tamanho: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Documento PDF`
                    : isFrench
                    ? `Taille : ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} Mo · Document PDF`
                    : isGerman
                    ? `Größe: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF`
                    : isSpanish
                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF`
                    : isHindi
                    ? `आकार: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF दस्तावेज़`
                    : isIndonesian
                    ? `Ukuran: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF`
                    : isMalay
                    ? `Saiz: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumen PDF`
                    : isThai
                    ? `ขนาด: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · เอกสาร PDF`
                    : isFilipino
                    ? `Laki: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokumentong PDF`
                    : `Size: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF Document`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isChinese ? (isTaiwan ? "下載 PDF" : "下载 PDF") : isKorean ? "PDF 다운로드" : isJapanese ? "PDFをダウンロード" : isRussian ? "Скачать PDF" : isUkrainian ? "Завантажити PDF" : isSlovak ? "Stiahnuť PDF" : isSlovenian ? "Prenesi PDF" : isBulgarian ? "Изтеглете PDF" : isNorwegian ? "Last ned PDF" : isPolish ? "Pobierz PDF" : isCzech ? "Stáhnout PDF" : isHungarian ? "PDF letöltése" : isRomanian ? "Descarcă PDF" : isGreek ? "Λήψη PDF" : isTurkish ? "PDF İndir" : isSwedish ? "Ladda ner PDF" : isDanish ? "Download PDF" : isFinnish ? "Lataa PDF" : isCatalan ? "Descarregar PDF" : isDutch ? "PDF downloaden" : isItalian ? "Scarica PDF" : isPortuguese ? "Descarregar PDF" : isFrench ? "Télécharger le PDF" : isGerman ? "PDF herunterladen" : isSpanish ? "Descargar PDF" : isHindi ? "PDF डाउनलोड करें" : isIndonesian ? "Unduh PDF" : isMalay ? "Muat Turun PDF" : isVietnamese ? "Tải xuống PDF" : isThai ? "ดาวน์โหลด PDF" : isFilipino ? "I-download ang PDF" : "Download PDF"}
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
