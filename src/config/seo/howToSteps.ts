import { SupportedLocale } from "../i18n/locales";

export interface HowToStepItem {
  title: string;
  description: string;
}

export const HOW_TO_STEPS: Record<SupportedLocale, HowToStepItem[]> = {
  en: [
    { title: "1. Select or Drop File", description: "Choose your file from your computer or mobile device, or drag and drop it into the secure processing box above." },
    { title: "2. Instant In-Browser Processing", description: "FileKit automatically processes your file using high-performance local browser WebAssembly with zero data retention." },
    { title: "3. Download Your Result", description: "Click download to save your converted, compressed, or edited file immediately to your device." }
  ],
  es: [
    { title: "1. Selecciona o Arrastra el Archivo", description: "Elige tu archivo desde tu dispositivo o arrástralo directamente a la zona de carga segura." },
    { title: "2. Procesamiento Instantáneo Local", description: "FileKit procesa tu archivo en tu navegador mediante WebAssembly seguro sin almacenar datos." },
    { title: "3. Descarga el Resultado", description: "Haz clic en descargar para guardar el archivo optimizado directamente en tu dispositivo." }
  ],
  "es-419": [
    { title: "1. Selecciona o Arrastra tu Archivo", description: "Elige tu archivo desde tu computadora o celular, o arrástralo al área de carga segura." },
    { title: "2. Procesamiento en el Navegador", description: "FileKit procesa tu archivo de forma local y segura mediante WebAssembly sin subirlo a servidores." },
    { title: "3. Descarga Inmediata", description: "Haz clic en descargar para guardar tu archivo convertido o comprimido de inmediato." }
  ],
  de: [
    { title: "1. Datei auswählen oder ablegen", description: "Wähle deine Datei vom Computer oder Smartphone aus oder ziehe sie in den sicheren Upload-Bereich." },
    { title: "2. Lokale Verarbeitung im Browser", description: "FileKit verarbeitet deine Datei direkt im Browser mittels WebAssembly – absolut datenschutzkonform." },
    { title: "3. Ergebnis herunterladen", description: "Klicke auf Herunterladen, um deine fertige Datei sofort auf deinem Gerät zu speichern." }
  ],
  fr: [
    { title: "1. Sélectionner ou Déposer le Fichier", description: "Choisissez votre fichier depuis votre appareil ou glissez-déposez-le dans la zone sécurisée." },
    { title: "2. Traitement Instantané dans le Navigateur", description: "FileKit traite votre fichier localement via WebAssembly avec une confidentialité totale." },
    { title: "3. Télécharger le Résultat", description: "Cliquez sur télécharger pour enregistrer immédiatement votre fichier optimisé." }
  ],
  pt: [
    { title: "1. Selecione ou Arraste o Ficheiro", description: "Escolha o ficheiro no seu computador ou dispositivo móvel e arraste-o para a caixa de processamento." },
    { title: "2. Processamento Seguro no Navegador", description: "O FileKit processa o ficheiro localmente com WebAssembly sem guardar quaisquer dados." },
    { title: "3. Descarregue o Resultado", description: "Clique em descarregar para guardar o ficheiro convertido de imediato." }
  ],
  "pt-BR": [
    { title: "1. Selecione ou Arraste o Arquivo", description: "Escolha o arquivo no seu computador ou celular e arraste-o para a área segura de processamento." },
    { title: "2. Processamento Local no Navegador", description: "O FileKit processa o arquivo diretamente no navegador via WebAssembly com total privacidade." },
    { title: "3. Baixe o Resultado", description: "Clique em baixar para salvar o arquivo convertido ou otimizado imediatamente." }
  ],
  it: [
    { title: "1. Seleziona o Trascina il File", description: "Scegli il file dal tuo computer o smartphone oppure trascinalo nell'area sicura." },
    { title: "2. Elaborazione Immediata nel Browser", description: "FileKit elabora il file in locale tramite WebAssembly senza memorizzare alcun dato." },
    { title: "3. Scarica il Risultato", description: "Clicca su scarica per salvare subito il file convertito sul tuo dispositivo." }
  ],
  nl: [
    { title: "1. Bestand selecteren of slepen", description: "Kies je bestand vanaf je computer of mobiel, of sleep het naar het beveiligde uploadvak." },
    { title: "2. Directe verwerking in de browser", description: "FileKit verwerkt je bestand lokaal via WebAssembly met gegarandeerde privacy." },
    { title: "3. Resultaat downloaden", description: "Klik op downloaden om je geconverteerde bestand meteen op te slaan." }
  ],
  ca: [
    { title: "1. Selecciona o Arrossega el Fitxer", description: "Tria el fitxer del teu dispositiu o arrossega'l a la zona de càrrega segura." },
    { title: "2. Processament Local al Navegador", description: "FileKit processa el fitxer directament al navegador amb WebAssembly i màxima privadesa." },
    { title: "3. Descarrega el Resultat", description: "Fes clic a descarregar per desar el fitxer convertit immediatament." }
  ],
  sv: [
    { title: "1. Välj eller släpp fil", description: "Välj fil från din dator eller mobil, eller dra och släpp den i det säkra uppladdningsfältet." },
    { title: "2. Lokal bearbetning i webbläsaren", description: "FileKit bearbetar filen direkt i webbläsaren via WebAssembly utan att spara data." },
    { title: "3. Ladda ner resultatet", description: "Klicka på ladda ner för att spara din konverterade fil direkt på enheten." }
  ],
  da: [
    { title: "1. Vælg eller træk fil", description: "Vælg din fil fra computeren eller mobilen, eller træk den til det sikre upload-område." },
    { title: "2. Hurtig behandling i browseren", description: "FileKit behandler filen lokalt med WebAssembly uden at gemme personfølsomme data." },
    { title: "3. Download resultatet", description: "Klik på download for straks at gemme den konverterede fil på din enhed." }
  ],
  fi: [
    { title: "1. Valitse tai pudota tiedosto", description: "Valitse tiedosto laitteeltasi tai vedä ja pudota se suojatulle latausalueelle." },
    { title: "2. Välitön käsittely selaimessa", description: "FileKit käsittelee tiedoston paikallisesti WebAssemblyllä ilman tietojen tallennusta." },
    { title: "3. Lataa lopputulos", description: "Napsauta latauspainiketta tallentaaksesi muunnetun tiedoston välittömästi laitteellesi." }
  ],
  no: [
    { title: "1. Velg eller dra fil", description: "Velg filen din fra datamaskin eller mobil, eller dra og slipp den i det sikre feltet." },
    { title: "2. Lokal behandling i nettleseren", description: "FileKit behandler filen direkte i nettleseren via WebAssembly med fullt personvern." },
    { title: "3. Last ned resultatet", description: "Klikk på last ned for å lagre den ferdige filen på enheten din med en gang." }
  ],
  pl: [
    { title: "1. Wybierz lub przeciągnij plik", description: "Wybierz plik z komputera lub telefonu albo przeciągnij go do bezpiecznego pola." },
    { title: "2. Bezpieczne przetwarzanie w przeglądarce", description: "FileKit przetwarza plik lokalnie za pomocą WebAssembly z pełną ochroną prywatności." },
    { title: "3. Pobierz gotowy plik", description: "Kliknij pobierz, aby natychmiast zapisać przekonwertowany plik na urządzeniu." }
  ],
  cs: [
    { title: "1. Vyberte nebo přetáhněte soubor", description: "Zvolte soubor ze svého počítače nebo telefonu, případně jej přetáhněte do pole." },
    { title: "2. Okamžité zpracování v prohlížeči", description: "FileKit zpracuje soubor lokálně pomocí WebAssembly s plnou ochranou soukromí." },
    { title: "3. Stáhněte výsledek", description: "Kliknutím na tlačítko stáhnout uložte zkonvertovaný soubor do svého zařízení." }
  ],
  hu: [
    { title: "1. Fájl kiválasztása vagy behúzása", description: "Válassza ki a fájlt az eszközéről, vagy húzza a biztonságos feltöltési területre." },
    { title: "2. Azonnali helyi feldolgozás", "description": "A FileKit helyileg dolgozza fel a fájlt a böngészőben WebAssembly segítségével." },
    { title: "3. Eredmény letöltése", description: "Kattintson a letöltésre az optimalizált fájl azonnali mentéséhez az eszközére." }
  ],
  ro: [
    { title: "1. Selectați sau trageți fișierul", description: "Alegeți fișierul de pe dispozitiv sau trageți-l în zona securizată de încărcare." },
    { title: "2. Procesare locală în browser", description: "FileKit procesează fișierul direct în browser prin WebAssembly, protejând datele." },
    { title: "3. Descărcați rezultatul", description: "Faceți clic pe descărcare pentru a salva imediat fișierul convertit." }
  ],
  bg: [
    { title: "1. Изберете или пуснете файл", description: "Изберете файла от вашето устройство или го плъзнете в защитеното поле." },
    { title: "2. Мигновена обработка в браузъра", description: "FileKit обработва файла локално чрез WebAssembly при пълна поверителност." },
    { title: "3. Изтеглете резултата", description: "Кликнете върху изтегляне, за да запазите готовия файл веднага." }
  ],
  el: [
    { title: "1. Επιλέξτε ή σύρετε το αρχείο", description: "Επιλέξτε το αρχείο από τη συσκευή σας ή σύρετέ το στην ασφαλή περιοχή." },
    { title: "2. Τοπική επεξεργασία στο πρόγραμμα περιήγησης", description: "Το FileKit επεξεργάζεται το αρχείο τοπικά μέσω WebAssembly με απόλυτο απόρρητο." },
    { title: "3. Λήψη αποτελέσματος", description: "Κάντε κλικ στη λήψη για να αποθηκεύσετε αμέσως το μετατραπέν αρχείο." }
  ],
  sk: [
    { title: "1. Vyberte alebo presuňte súbor", description: "Vyberte súbor zo zariadenia alebo ho presuňte do bezpečnej oblasti nahrávania." },
    { title: "2. Okamžité lokálne spracovanie", description: "FileKit spracuje súbor priamo v prehliadači cez WebAssembly bez ukladania dát." },
    { title: "3. Stiahnite výsledok", description: "Kliknite na stiahnuť a uložte optimalizovaný súbor do svojho zariadenia." }
  ],
  sl: [
    { title: "1. Izberite ali povlecite datoteko", description: "Izberite datoteko iz naprave ali jo povlecite v varno območje za nalaganje." },
    { title: "2. Hitra lokalna obdelava v brskalniku", description: "FileKit obdela datoteko neposredno v brskalniku prek WebAssembly z visoko varnostjo." },
    { title: "3. Prenesite rezultat", description: "Kliknite prenesi, da shranite pretvorjeno datoteko v svojo napravo." }
  ],
  ru: [
    { title: "1. Выберите или перетащите файл", description: "Выберите файл на компьютере или телефоне либо перетащите его в поле загрузки." },
    { title: "2. Локальная обработка в браузере", description: "FileKit обрабатывает файл локально через WebAssembly с полной конфиденциальностью данных." },
    { title: "3. Скачайте результат", description: "Нажмите скачать, чтобы моментально сохранить готовый файл на устройство." }
  ],
  uk: [
    { title: "1. Виберіть або перетягніть файл", description: "Виберіть файл на своєму пристрої або перетягніть його в захищену зону завантаження." },
    { title: "2. Локальна обробка у браузері", description: "FileKit обробляє файл локально за допомогою WebAssembly без збереження даних." },
    { title: "3. Завантажте результат", description: "Натисніть завантажити, щоб миттєво зберегти готовий файл на свій пристрій." }
  ],
  lv: [
    { title: "1. Izvēlieties vai velciet failu", description: "Izvēlieties failu no savas ierīces vai velciet to drošajā augšupielādes laukā." },
    { title: "2. Tūlītēja apstrāde pārlūkprogrammā", description: "FileKit apstrādā failu lokāli, izmantojot WebAssembly, saglabājot privātumu." },
    { title: "3. Lejupielādējiet rezultātu", description: "Noklikšķiniet uz lejupielādēt, lai uzreiz saglabātu gatavo failu ierīcē." }
  ],
  lt: [
    { title: "1. Pasirinkite arba vilkite failą", description: "Pasirinkite failą iš įrenginio arba nuvilkite jį į saugią įkėlimo sritį." },
    { title: "2. Momentinis apdorojimas naršyklėje", description: "FileKit apdoroja failą vietoje per WebAssembly be duomenų kaupimo." },
    { title: "3. Atsisiųskite rezultatą", description: "Spustelėkite atsisiųsti, kad iškart išsaugotumėte konvertuotą failą." }
  ],
  tr: [
    { title: "1. Dosyayı Seçin veya Sürükleyin", description: "Dosyanızı cihazınızdan seçin veya güvenli yükleme alanına sürükleyip bırakın." },
    { title: "2. Tarayıcıda Anında Yerel İşleme", description: "FileKit, dosyanızı WebAssembly ile doğrudan tarayıcınızda gizlilikle işler." },
    { title: "3. Sonucu İndirin", description: "Dönüştürülen veya sıkıştırılan dosyanızı cihazınıza kaydetmek için indire tıklayın." }
  ],
  ar: [
    { title: "1. حدد الملف أو اسحبه هنا", description: "اختر الملف من جهاز الكمبيوتر أو الهاتف، أو اسحبه وأفلته في منطقة المعالجة الآمنة." },
    { title: "2. معالجة فورية داخل المتصفح", description: "يقوم FileKit بمعالجة ملفك محلياً باستخدام تقنية WebAssembly فائقة الأمان والسرعة." },
    { title: "3. تنزيل الملف النهائي", description: "انقر على زر التنزيل لحفظ الملف المحول أو المضغوط على جهازك على الفور." }
  ],
  he: [
    { title: "1. בחר או גרור קובץ", description: "בחר את הקובץ מהמכשיר שלך או גרור אותו לאזור ההעלאה המאובטח." },
    { title: "2. עיבוד מקומי בדפדפן", description: "FileKit מעבד את הקובץ ישירות בדפדפן באמצעות WebAssembly ללא שמירת מידע." },
    { title: "3. הורד את התוצאה", description: "לחץ על הורדה כדי לשמור את הקובץ המעובד במכשירך באופן מיידי." }
  ],
  hi: [
    { title: "1. फ़ाइल चुनें या ड्रैग करें", description: "अपने डिवाइस से फ़ाइल चुनें या उसे सुरक्षित अपलोड क्षेत्र में ड्रैग और ड्रॉप करें।" },
    { title: "2. ब्राउज़र में त्वरित स्थानीय प्रोसेसिंग", description: "FileKit आपकी फ़ाइल को वेबअसेंबली के माध्यम से सुरक्षित रूप से प्रोसेस करता है।" },
    { title: "3. परिणाम डाउनलोड करें", description: "परिवर्तित फ़ाइल को तुरंत अपने डिवाइस पर सहेजने के लिए डाउनलोड पर क्लिक करें।" }
  ],
  id: [
    { title: "1. Pilih atau Seret File", description: "Pilih file dari perangkat Anda atau seret dan lepas ke area pemrosesan yang aman." },
    { title: "2. Pemrosesan Cepat di Browser", description: "FileKit memproses file secara lokal menggunakan WebAssembly dengan privasi terjamin." },
    { title: "3. Unduh Hasilnya", description: "Klik unduh untuk langsung menyimpan file hasil konversi ke perangkat Anda." }
  ],
  ms: [
    { title: "1. Pilih atau Seret Fail", description: "Pilih fail dari peranti anda atau seret dan lepas ke zon pemprosesan yang selamat." },
    { title: "2. Pemprosesan Pantas dalam Penyemak Imbas", description: "FileKit memproses fail secara setempat menggunakan WebAssembly dengan privasi penuh." },
    { title: "3. Muat Turun Hasil", description: "Klik muat turun untuk menyimpan fail yang telah diproses ke peranti anda serta-merta." }
  ],
  th: [
    { title: "1. เลือกหรือลากไฟล์ของคุณ", description: "เลือกไฟล์จากอุปกรณ์ของคุณหรือลากและวางลงในพื้นที่อัปโหลดที่ปลอดภัย" },
    { title: "2. ประมวลผลในเบราว์เซอร์ทันที", description: "FileKit ประมวลผลไฟล์ของคุณในเครื่องผ่าน WebAssembly โดยไม่เก็บข้อมูลส่วนตัว" },
    { title: "3. ดาวน์โหลดผลลัพธ์", description: "คลิกดาวน์โหลดเพื่อบันทึกไฟล์ที่แปลงแล้วลงในอุปกรณ์ของคุณทันที" }
  ],
  vi: [
    { title: "1. Chọn hoặc Kéo tệp tin", description: "Chọn tệp từ thiết bị của bạn hoặc kéo thả vào vùng xử lý an toàn bên trên." },
    { title: "2. Xử lý trực tiếp trên trình duyệt", description: "FileKit xử lý tệp tin cục bộ bằng WebAssembly với tính bảo mật tuyệt đối." },
    { title: "3. Tải xuống kết quả", description: "Nhấp vào tải xuống để lưu tệp tin đã chuyển đổi về thiết bị của bạn ngay lập tức." }
  ],
  fil: [
    { title: "1. Pumili o I-drag ang File", description: "Piliin ang iyong file mula sa device o i-drag at i-drop ito sa ligtas na dropzone." },
    { title: "2. Mabilis na Pagpoproseso sa Browser", description: "Pinoproseso ng FileKit ang iyong file nang lokal gamit ang WebAssembly na may ganap na privacy." },
    { title: "3. I-download ang Resulta", description: "I-click ang i-download upang agad na mai-save ang na-convert na file sa iyong device." }
  ],
  ja: [
    { title: "1. ファイルを選択またはドロップ", description: "パソコンやスマートフォンからファイルを選択するか、安全なドロップゾーンにドラッグ＆ドロップします。" },
    { title: "2. ブラウザ内での高速ローカル処理", description: "FileKitはWebAssemblyを活用し、サーバーにデータを送信することなくブラウザ内で安全に変換・圧縮します。" },
    { title: "3. 結果をダウンロード", description: "ダウンロードボタンをクリックして、変換された高品質なファイルを即座に端末に保存します。" }
  ],
  ko: [
    { title: "1. 파일 선택 또는 드래그 앤 드롭", description: "기기에서 파일을 선택하거나 안전한 업로드 영역에 드래그 앤 드롭하세요." },
    { title: "2. 브라우저 내 즉각적인 로컬 처리", description: "FileKit은 WebAssembly 기술을 사용하여 서버 업로드 없이 브라우저 내에서 안전하게 처리합니다." },
    { title: "3. 결과 파일 다운로드", description: "다운로드 버튼을 클릭하여 변환되거나 최적화된 파일을 기기에 바로 저장하세요." }
  ],
  "zh-CN": [
    { title: "1. 选择或拖拽上传文件", description: "从您的电脑或手机选择文件，或直接将其拖入上方的安全上传区域。" },
    { title: "2. 浏览器本地极速处理", description: "FileKit 基于高性能 WebAssembly 运行，数据完全在本地处理，无需上传云端。" },
    { title: "3. 立即下载转换结果", description: "点击下载按钮，即可将转换、压缩或编辑完成的文件立即保存至您的设备。" }
  ],
  "zh-TW": [
    { title: "1. 選擇或拖曳上傳檔案", description: "從您的電腦或行動裝置選取檔案，或直接拖放至上方的安全處理區域。" },
    { title: "2. 瀏覽器本機極速處理", description: "FileKit 採用高效能 WebAssembly 技術，檔案完全於本機端處理，隱私安全無虞。" },
    { title: "3. 立即下載處理結果", description: "按一下下載按鈕，即可將轉換、壓縮或編輯完成的檔案儲存至您的裝置。" }
  ]
};
