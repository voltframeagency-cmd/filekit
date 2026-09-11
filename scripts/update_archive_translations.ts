import fs from 'fs';
import { ARCHIVE_TRANSLATIONS } from '../src/config/i18n/archiveTranslations';

export const extraFields = {
  en: {
    extractedFiles: '(n) => `Extracted Files (${n}):`',
    download: '"Download"',
    downloadZip: '"Download ZIP"',
    readyZip: '(name) => `✓ Ready ZIP: ${name}`',
    sizeLabel: '(mb) => `Size: ${mb} MB · 100% In-Browser`',
    cannotConvert: '"Failed to convert archive to ZIP."',
    cannotCreate: '"Failed to create ZIP archive."'
  },
  es: {
    extractedFiles: '(n) => `Archivos extraídos (${n}):`',
    download: '"Descargar"',
    downloadZip: '"Descargar ZIP"',
    readyZip: '(name) => `✓ ZIP listo: ${name}`',
    sizeLabel: '(mb) => `Tamaño: ${mb} MB · 100% En el navegador`',
    cannotConvert: '"Error al convertir a ZIP."',
    cannotCreate: '"Error al crear archivo ZIP."'
  },
  'es-419': {
    extractedFiles: '(n) => `Archivos extraídos (${n}):`',
    download: '"Descargar"',
    downloadZip: '"Descargar ZIP"',
    readyZip: '(name) => `✓ ZIP listo: ${name}`',
    sizeLabel: '(mb) => `Tamaño: ${mb} MB · 100% En el navegador`',
    cannotConvert: '"Error al convertir a ZIP."',
    cannotCreate: '"Error al crear archivo ZIP."'
  },
  de: {
    extractedFiles: '(n) => `Entpackte Dateien (${n}):`',
    download: '"Herunterladen"',
    downloadZip: '"ZIP herunterladen"',
    readyZip: '(name) => `✓ ZIP bereit: ${name}`',
    sizeLabel: '(mb) => `Größe: ${mb} MB · 100% Im Browser`',
    cannotConvert: '"Fehler beim Konvertieren in ZIP."',
    cannotCreate: '"Fehler beim Erstellen des ZIP-Archivs."'
  },
  fr: {
    extractedFiles: '(n) => `Fichiers extraits (${n}) :`',
    download: '"Télécharger"',
    downloadZip: '"Télécharger le ZIP"',
    readyZip: '(name) => `✓ ZIP prêt : ${name}`',
    sizeLabel: '(mb) => `Taille : ${mb} Mo · 100% Dans le navigateur`',
    cannotConvert: '"Échec de la conversion en ZIP."',
    cannotCreate: '"Échec de la création de l\'archive ZIP."'
  },
  pt: {
    extractedFiles: '(n) => `Ficheiros extraídos (${n}):`',
    download: '"Descarregar"',
    downloadZip: '"Descarregar ZIP"',
    readyZip: '(name) => `✓ ZIP pronto: ${name}`',
    sizeLabel: '(mb) => `Tamanho: ${mb} MB · 100% No navegador`',
    cannotConvert: '"Falha ao converter para ZIP."',
    cannotCreate: '"Falha ao criar o arquivo ZIP."'
  },
  'pt-BR': {
    extractedFiles: '(n) => `Arquivos extraídos (${n}):`',
    download: '"Baixar"',
    downloadZip: '"Baixar ZIP"',
    readyZip: '(name) => `✓ ZIP pronto: ${name}`',
    sizeLabel: '(mb) => `Tamanho: ${mb} MB · 100% No navegador`',
    cannotConvert: '"Falha ao converter para ZIP."',
    cannotCreate: '"Falha ao criar o arquivo ZIP."'
  },
  it: {
    extractedFiles: '(n) => `File estratti (${n}):`',
    download: '"Scarica"',
    downloadZip: '"Scarica ZIP"',
    readyZip: '(name) => `✓ ZIP pronto: ${name}`',
    sizeLabel: '(mb) => `Dimensione: ${mb} MB · 100% Nel browser`',
    cannotConvert: '"Impossibile convertire in ZIP."',
    cannotCreate: '"Impossibile creare l\'archivio ZIP."'
  },
  nl: {
    extractedFiles: '(n) => `Uitgepakte bestanden (${n}):`',
    download: '"Downloaden"',
    downloadZip: '"ZIP downloaden"',
    readyZip: '(name) => `✓ ZIP gereed: ${name}`',
    sizeLabel: '(mb) => `Grootte: ${mb} MB · 100% In browser`',
    cannotConvert: '"Kan archief niet naar ZIP converteren."',
    cannotCreate: '"Kan ZIP-archief niet maken."'
  },
  ca: {
    extractedFiles: '(n) => `Fitxers extrets (${n}):`',
    download: '"Descarregar"',
    downloadZip: '"Descarregar ZIP"',
    readyZip: '(name) => `✓ ZIP a punt: ${name}`',
    sizeLabel: '(mb) => `Mida: ${mb} MB · 100% Al navegador`',
    cannotConvert: '"Error en convertir l\'arxiu a ZIP."',
    cannotCreate: '"Error en crear el fitxer ZIP."'
  },
  sv: {
    extractedFiles: '(n) => `Extraherade filer (${n}):`',
    download: '"Ladda ner"',
    downloadZip: '"Ladda ner ZIP"',
    readyZip: '(name) => `✓ ZIP klar: ${name}`',
    sizeLabel: '(mb) => `Storlek: ${mb} MB · 100% I webbläsaren`',
    cannotConvert: '"Kunde inte konvertera arkivet till ZIP."',
    cannotCreate: '"Kunde inte skapa ZIP-arkivet."'
  },
  da: {
    extractedFiles: '(n) => `Udtrukne filer (${n}):`',
    download: '"Download"',
    downloadZip: '"Download ZIP"',
    readyZip: '(name) => `✓ ZIP klar: ${name}`',
    sizeLabel: '(mb) => `Størrelse: ${mb} MB · 100% I browseren`',
    cannotConvert: '"Kunne ikke konvertere arkivet til ZIP."',
    cannotCreate: '"Kunne ikke oprette ZIP-arkivet."'
  },
  fi: {
    extractedFiles: '(n) => `Puretut tiedostot (${n}):`',
    download: '"Lataa"',
    downloadZip: '"Lataa ZIP"',
    readyZip: '(name) => `✓ ZIP valmis: ${name}`',
    sizeLabel: '(mb) => `Koko: ${mb} MB · 100% Selaimessa`',
    cannotConvert: '"Arkiston muuntaminen ZIP-muotoon epäonnistui."',
    cannotCreate: '"ZIP-arkiston luominen epäonnistui."'
  },
  no: {
    extractedFiles: '(n) => `Uttrukne filer (${n}):`',
    download: '"Last ned"',
    downloadZip: '"Last ned ZIP"',
    readyZip: '(name) => `✓ ZIP klar: ${name}`',
    sizeLabel: '(mb) => `Størrelse: ${mb} MB · 100% I nettleseren`',
    cannotConvert: '"Kunne ikke konvertere arkivet till ZIP."',
    cannotCreate: '"Kunne ikke opprette ZIP-arkivet."'
  },
  pl: {
    extractedFiles: '(n) => `Wyodrębnione pliki (${n}):`',
    download: '"Pobierz"',
    downloadZip: '"Pobierz ZIP"',
    readyZip: '(name) => `✓ Gotowy ZIP: ${name}`',
    sizeLabel: '(mb) => `Rozmiar: ${mb} MB · 100% W przeglądarce`',
    cannotConvert: '"Nie udało się przekonwertować archiwum na ZIP."',
    cannotCreate: '"Nie udało się utworzyć archiwum ZIP."'
  },
  cs: {
    extractedFiles: '(n) => `Extrahované soubory (${n}):`',
    download: '"Stáhnout"',
    downloadZip: '"Stáhnout ZIP"',
    readyZip: '(name) => `✓ ZIP připraven: ${name}`',
    sizeLabel: '(mb) => `Velikost: ${mb} MB · 100% V prohlížeči`',
    cannotConvert: '"Archiv se nepodařilo převést na ZIP."',
    cannotCreate: '"Nepodařilo se vytvořit archiv ZIP."'
  },
  hu: {
    extractedFiles: '(n) => `Kicsomagolt fájlok (${n}):`',
    download: '"Letöltés"',
    downloadZip: '"ZIP letöltése"',
    readyZip: '(name) => `✓ ZIP kész: ${name}`',
    sizeLabel: '(mb) => `Méret: ${mb} MB · 100% Böngészőben`',
    cannotConvert: '"Nem sikerült az archívumot ZIP-be konvertálni."',
    cannotCreate: '"Nem sikerült létrehozni a ZIP archívumot."'
  },
  ro: {
    extractedFiles: '(n) => `Fișiere extrase (${n}):`',
    download: '"Descărcare"',
    downloadZip: '"Descărcare ZIP"',
    readyZip: '(name) => `✓ ZIP gata: ${name}`',
    sizeLabel: '(mb) => `Dimensiune: ${mb} MB · 100% În browser`',
    cannotConvert: '"Nu s-a putut converti arhiva în ZIP."',
    cannotCreate: '"Nu s-a putut crea arhiva ZIP."'
  },
  bg: {
    extractedFiles: '(n) => `Извлечени файлове (${n}):`',
    download: '"Изтегляне"',
    downloadZip: '"Изтегляне на ZIP"',
    readyZip: '(name) => `✓ Готов ZIP: ${name}`',
    sizeLabel: '(mb) => `Размер: ${mb} MB · 100% В браузъра`',
    cannotConvert: '"Архивът не можа да бъде конвертиран в ZIP."',
    cannotCreate: '"Не можа да се създаде ZIP архив."'
  },
  el: {
    extractedFiles: '(n) => `Εξαχθέντα αρχεία (${n}):`',
    download: '"Λήψη"',
    downloadZip: '"Λήψη ZIP"',
    readyZip: '(name) => `✓ Έτοιμο ZIP: ${name}`',
    sizeLabel: '(mb) => `Μέγεθος: ${mb} MB · 100% Στον περιηγητή`',
    cannotConvert: '"Αποτυχία μετατροπής αρχείου σε ZIP."',
    cannotCreate: '"Αποτυχία δημιουργίας αρχείου ZIP."'
  },
  sk: {
    extractedFiles: '(n) => `Extrahované súbory (${n}):`',
    download: '"Stiahnuť"',
    downloadZip: '"Stiahnuť ZIP"',
    readyZip: '(name) => `✓ ZIP pripravený: ${name}`',
    sizeLabel: '(mb) => `Veľkosť: ${mb} MB · 100% V prehliadači`',
    cannotConvert: '"Archív sa nepodarilo konvertovať na ZIP."',
    cannotCreate: '"Nepodarilo sa vytvoriť archív ZIP."'
  },
  sl: {
    extractedFiles: '(n) => `Ekstrahirane datoteke (${n}):`',
    download: '"Prenos"',
    downloadZip: '"Prenesi ZIP"',
    readyZip: '(name) => `✓ ZIP pripravljen: ${name}`',
    sizeLabel: '(mb) => `Velikost: ${mb} MB · 100% V brskalniku`',
    cannotConvert: '"Arhiva ni bilo mogoče pretvoriti v ZIP."',
    cannotCreate: '"ZIP arhiva ni bilo mogoče ustvariti."'
  },
  ru: {
    extractedFiles: '(n) => `Извлеченные файлы (${n}):`',
    download: '"Скачать"',
    downloadZip: '"Скачать ZIP"',
    readyZip: '(name) => `✓ ZIP готов: ${name}`',
    sizeLabel: '(mb) => `Размер: ${mb} MB · 100% В браузере`',
    cannotConvert: '"Не удалось преобразовать архив в ZIP."',
    cannotCreate: '"Не удалось создать ZIP-архив."'
  },
  uk: {
    extractedFiles: '(n) => `Видобуті файли (${n}):`',
    download: '"Завантажити"',
    downloadZip: '"Завантажити ZIP"',
    readyZip: '(name) => `✓ ZIP готовий: ${name}`',
    sizeLabel: '(mb) => `Розмір: ${mb} MB · 100% У браузері`',
    cannotConvert: '"Не вдалося перетворити архів у ZIP."',
    cannotCreate: '"Не вдалося створити ZIP-архів."'
  },
  lv: {
    extractedFiles: '(n) => `Izvilktie faili (${n}):`',
    download: '"Lejupielādēt"',
    downloadZip: '"Lejupielādēt ZIP"',
    readyZip: '(name) => `✓ ZIP gatavs: ${name}`',
    sizeLabel: '(mb) => `Izmērs: ${mb} MB · 100% Pārlūkā`',
    cannotConvert: '"Neizdevās konvertēt arhīvu uz ZIP."',
    cannotCreate: '"Neizdevās izveidot ZIP arhīvu."'
  },
  lt: {
    extractedFiles: '(n) => `Išskleisti failai (${n}):`',
    download: '"Atsisiųsti"',
    downloadZip: '"Atsisiųsti ZIP"',
    readyZip: '(name) => `✓ ZIP paruoštas: ${name}`',
    sizeLabel: '(mb) => `Dydis: ${mb} MB · 100% Naršyklėje`',
    cannotConvert: '"Nepavyko konvertuoti archyvo į ZIP."',
    cannotCreate: '"Nepavyko sukurti ZIP archyvo."'
  },
  tr: {
    extractedFiles: '(n) => `Çıkarılan dosyalar (${n}):`',
    download: '"İndir"',
    downloadZip: '"ZIP İndir"',
    readyZip: '(name) => `✓ ZIP hazır: ${name}`',
    sizeLabel: '(mb) => `Boyut: ${mb} MB · 100% Tarayıcıda`',
    cannotConvert: '"Arşiv ZIP formatına dönüştürülemedi."',
    cannotCreate: '"ZIP arşivi oluşturulamadı."'
  },
  ar: {
    extractedFiles: '(n) => `الملفات المستخرجة (${n}):`',
    download: '"تنزيل"',
    downloadZip: '"تنزيل ZIP"',
    readyZip: '(name) => `✓ ملف ZIP جاهز: ${name}`',
    sizeLabel: '(mb) => `الحجم: ${mb} ميغابايت · 100% في المتصفح`',
    cannotConvert: '"فشل تحويل الأرشيف إلى ZIP."',
    cannotCreate: '"فشل إنشاء أرشيف ZIP."'
  },
  he: {
    extractedFiles: '(n) => `קבצים שחולצו (${n}):`',
    download: '"הורדה"',
    downloadZip: '"הורד ZIP"',
    readyZip: '(name) => `✓ קובץ ZIP מוכן: ${name}`',
    sizeLabel: '(mb) => `גודל: ${mb} MB · 100% בדפדפן`',
    cannotConvert: '"המרת הארכיון ל-ZIP נכשלה."',
    cannotCreate: '"יצירת ארכיון ZIP נכשלה."'
  },
  hi: {
    extractedFiles: '(n) => `निकाली गई फ़ाइलें (${n}):`',
    download: '"डाउनलोड करें"',
    downloadZip: '"ZIP डाउनलोड करें"',
    readyZip: '(name) => `✓ ZIP तैयार है: ${name}`',
    sizeLabel: '(mb) => `आकार: ${mb} MB · 100% ब्राउज़र में`',
    cannotConvert: '"अभिलेखागार को ZIP में बदलने में विफल।"',
    cannotCreate: '"ZIP संग्रह बनाने में विफल।"'
  },
  id: {
    extractedFiles: '(n) => `File yang diekstrak (${n}):`',
    download: '"Unduh"',
    downloadZip: '"Unduh ZIP"',
    readyZip: '(name) => `✓ ZIP siap: ${name}`',
    sizeLabel: '(mb) => `Ukuran: ${mb} MB · 100% Di peramban`',
    cannotConvert: '"Gagal mengonversi arsip ke ZIP."',
    cannotCreate: '"Gagal membuat arsip ZIP."'
  },
  ms: {
    extractedFiles: '(n) => `Fail diekstrak (${n}):`',
    download: '"Muat turun"',
    downloadZip: '"Muat turun ZIP"',
    readyZip: '(name) => `✓ ZIP sedia: ${name}`',
    sizeLabel: '(mb) => `Saiz: ${mb} MB · 100% Dalam pelayar`',
    cannotConvert: '"Gagal menukar arkib ke ZIP."',
    cannotCreate: '"Gagal mencipta arkib ZIP."'
  },
  th: {
    extractedFiles: '(n) => `ไฟล์ที่แตกออกมา (${n}):`',
    download: '"ดาวน์โหลด"',
    downloadZip: '"ดาวน์โหลด ZIP"',
    readyZip: '(name) => `✓ ไฟล์ ZIP พร้อมแล้ว: ${name}`',
    sizeLabel: '(mb) => `ขนาด: ${mb} MB · 100% ในเบราว์เซอร์`',
    cannotConvert: '"การแปลงไฟล์คลังข้อมูลเป็น ZIP ล้มเหลว"',
    cannotCreate: '"การสร้างไฟล์ ZIP ล้มเหลว"'
  },
  vi: {
    extractedFiles: '(n) => `Tệp đã giải nén (${n}):`',
    download: '"Tải xuống"',
    downloadZip: '"Tải ZIP"',
    readyZip: '(name) => `✓ ZIP đã sẵn sàng: ${name}`',
    sizeLabel: '(mb) => `Kích thước: ${mb} MB · 100% Trong trình duyệt`',
    cannotConvert: '"Không thể chuyển đổi lưu trữ sang ZIP."',
    cannotCreate: '"Không thể tạo lưu trữ ZIP."'
  },
  fil: {
    extractedFiles: '(n) => `Na-extract na mga file (${n}):`',
    download: '"I-download"',
    downloadZip: '"I-download ang ZIP"',
    readyZip: '(name) => `✓ Handa na ang ZIP: ${name}`',
    sizeLabel: '(mb) => `Laki: ${mb} MB · 100% Sa Browser`',
    cannotConvert: '"Hindi ma-convert ang archive sa ZIP."',
    cannotCreate: '"Hindi magawa ang ZIP archive."'
  },
  ja: {
    extractedFiles: '(n) => `展開されたファイル (${n}):`',
    download: '"ダウンロード"',
    downloadZip: '"ZIP をダウンロード"',
    readyZip: '(name) => `✓ ZIP の準備完了: ${name}`',
    sizeLabel: '(mb) => `サイズ: ${mb} MB · 100% ブラウザ内で処理`',
    cannotConvert: '"アーカイブを ZIP に変換できませんでした。"',
    cannotCreate: '"ZIP アーカイブの作成に失敗しました。"'
  },
  ko: {
    extractedFiles: '(n) => `압축 해제된 파일 (${n}):`',
    download: '"다운로드"',
    downloadZip: '"ZIP 다운로드"',
    readyZip: '(name) => `✓ ZIP 준비 완료: ${name}`',
    sizeLabel: '(mb) => `크기: ${mb} MB · 100% 브라우저 처리`',
    cannotConvert: '"아카이브를 ZIP으로 변환하지 못했습니다."',
    cannotCreate: '"ZIP 아카이브 생성에 실패했습니다."'
  },
  'zh-CN': {
    extractedFiles: '(n) => `已解压文件 (${n}):`',
    download: '"下载"',
    downloadZip: '"下载 ZIP"',
    readyZip: '(name) => `✓ ZIP 压缩包已就绪：${name}`',
    sizeLabel: '(mb) => `大小：${mb} MB · 100% 浏览器本地运算`',
    cannotConvert: '"未能将归档转换为 ZIP。"',
    cannotCreate: '"未能创建 ZIP 压缩包。"'
  },
  'zh-TW': {
    extractedFiles: '(n) => `已解壓縮檔案 (${n})：`',
    download: '"下載"',
    downloadZip: '"下載 ZIP"',
    readyZip: '(name) => `✓ ZIP 壓縮檔已就緒：${name}`',
    sizeLabel: '(mb) => `大小：${mb} MB · 100% 瀏覽器本機運算`',
    cannotConvert: '"未能將壓縮檔轉換為 ZIP。"',
    cannotCreate: '"未能建立 ZIP 壓縮檔。"'
  }
};

const keys = Object.keys(extraFields);
console.log('Total keys in extraFields:', keys.length);

const rawArchive = fs.readFileSync('src/config/i18n/archiveTranslations.ts', 'utf8');

// Update ArchiveTranslationItem interface
const updatedInterface = `export interface ArchiveTranslationItem {
  selectArchiveToExtract: string;
  dropFilesToZip: string;
  supportsAllFormats: string;
  localProcessing: string;
  noFilesFound: string;
  cannotReadFile: string;
  filesSelected: (count: number) => string;
  reset: string;
  archiveNameLabel: string;
  compressingToZip: string;
  createZipButton: string;
  extractedFiles: (count: number) => string;
  download: string;
  downloadZip: string;
  readyZip: (name: string) => string;
  sizeLabel: (mb: string) => string;
  cannotConvert: string;
  cannotCreate: string;
}`;

let newArchive = rawArchive.replace(/export interface ArchiveTranslationItem \{[\s\S]*?\}/, updatedInterface);

for (const loc of keys) {
  const ex = extraFields[loc as keyof typeof extraFields];
  const regex = new RegExp(`([ \\t]*createZipButton:[^\\n]+)(\\n[ \\t]*\\},?[ \\t]*\\n)`);
  // Better: find \n  loc: {\n ... \n  },
  const locRegex = new RegExp(`(['"]?${loc}['"]?:\\s*\\{[\\s\\S]*?createZipButton:[^\\n]+)`, 'g');
  newArchive = newArchive.replace(locRegex, (match) => {
    return `${match},
    extractedFiles: ${ex.extractedFiles},
    download: ${ex.download},
    downloadZip: ${ex.downloadZip},
    readyZip: ${ex.readyZip},
    sizeLabel: ${ex.sizeLabel},
    cannotConvert: ${ex.cannotConvert},
    cannotCreate: ${ex.cannotCreate}`;
  });
}

fs.writeFileSync('src/config/i18n/archiveTranslations.ts', newArchive, 'utf8');
console.log('Successfully updated archiveTranslations.ts');
