import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'config', 'seo', 'familyFaqs.ts');

// All 39 locales
const LOCALES = [
  "en","es","es-419","de","fr","pt","pt-BR","it","nl","ca",
  "sv","da","fi","no","pl","cs","hu","ro","bg","el",
  "sk","sl","ru","uk","lv","lt","tr","ar","he","hi",
  "id","ms","th","vi","fil","ja","ko","zh-CN","zh-TW"
];

const FAMILIES = ["cad","vector","subtitles","apple","image","audio_video","pdf"];

// ── FAQ data per family per locale: [q1,a1,q2,a2,q3,a3] ──
const DATA = {};

// Helper
function set(fam, loc, qa) { if (!DATA[fam]) DATA[fam]={}; DATA[fam][loc]=qa; }

// ═══════════════════ CAD ═══════════════════
set("cad","en",[
  "Do I need AutoCAD installed to convert DWG or DXF files?",
  "No. FileKit processes AutoCAD DWG and DXF blueprints directly in your web browser using client-side vector parsing engines, completely eliminating the need for expensive software licenses.",
  "Will vector layers, lineweights, and architectural dimensions be preserved?",
  "Yes. All line geometries, text annotations, coordinate systems, and architectural dimensions are rendered with exact vector fidelity.",
  "Is my proprietary engineering drawing uploaded to a third-party server?",
  "Never. Your files are processed locally within your browser sandbox. Your intellectual property and blueprints never leave your device."
]);
set("cad","es",[
  "¿Necesito AutoCAD instalado para convertir archivos DWG o DXF?",
  "No. FileKit procesa planos AutoCAD DWG y DXF directamente en tu navegador sin necesidad de licencias costosas.",
  "¿Se conservan las capas vectoriales, grosores de línea y cotas?",
  "Sí. Todas las geometrías, anotaciones de texto y cotas arquitectónicas se representan con total precisión vectorial.",
  "¿Se suben mis planos de ingeniería a servidores externos?",
  "Nunca. Los archivos se procesan localmente en tu navegador. Tus planos y propiedad intelectual nunca salen de tu dispositivo."
]);
set("cad","es-419",[
  "¿Necesito tener instalado AutoCAD para convertir archivos DWG o DXF?",
  "No. FileKit procesa planos AutoCAD DWG y DXF directamente en tu navegador web sin requerir software costoso.",
  "¿Se mantienen las capas vectoriales, grosores de línea y dimensiones?",
  "Sí. Todas las geometrías de línea, cotas y anotaciones se convierten con máxima fidelidad vectorial.",
  "¿Mis planos de ingeniería se suben a servidores de terceros?",
  "Jamás. Tus archivos se procesan de forma 100% local en tu dispositivo con total privacidad."
]);
set("cad","de",[
  "Benötige ich AutoCAD, um DWG- oder DXF-Dateien zu konvertieren?",
  "Nein. FileKit verarbeitet AutoCAD-Pläne direkt im Webbrowser, ohne dass teure Softwarelizenzen erforderlich sind.",
  "Bleiben Vektorebenen, Linienstärken und Maße erhalten?",
  "Ja. Alle Liniengeometrien, Textanmerkungen und Architekturmaße werden mit exakter Vektorgenauigkeit dargestellt.",
  "Werden meine Konstruktionszeichnungen auf externe Server hochgeladen?",
  "Niemals. Ihre Dateien werden lokal im Browser verarbeitet und verlassen Ihr Gerät zu keinem Zeitpunkt."
]);
set("cad","fr",[
  "Ai-je besoin d'AutoCAD pour convertir des fichiers DWG ou DXF ?",
  "Non. FileKit traite les plans AutoCAD DWG et DXF directement dans votre navigateur web sans licence logicielle coûteuse.",
  "Les calques vectoriels, épaisseurs de trait et cotes sont-ils conservés ?",
  "Oui. Toutes les géométries, annotations textuelles et cotes architecturales sont rendues avec une fidélité vectorielle absolue.",
  "Mes plans d'ingénierie sont-ils téléversés sur un serveur tiers ?",
  "Jamais. Vos fichiers sont traités localement dans votre navigateur. Votre propriété intellectuelle ne quitte jamais votre appareil."
]);
set("cad","pt",[
  "Preciso do AutoCAD instalado para converter ficheiros DWG ou DXF?",
  "Não. O FileKit processa plantas AutoCAD DWG e DXF diretamente no seu navegador sem necessidade de licenças caras.",
  "As camadas vetoriais, espessuras de linha e cotas são preservadas?",
  "Sim. Todas as geometrias, anotações de texto e cotas arquitetónicas são convertidas com exatidão vetorial.",
  "Os meus desenhos de engenharia são enviados para servidores externos?",
  "Nunca. Os seus ficheiros são processados localmente no navegador e nunca saem do seu dispositivo."
]);
set("cad","pt-BR",[
  "Preciso ter o AutoCAD instalado para converter arquivos DWG ou DXF?",
  "Não. O FileKit processa plantas AutoCAD DWG e DXF diretamente no seu navegador sem necessidade de softwares caros.",
  "As camadas vetoriais, espessuras de linha e cotas são mantidas?",
  "Sim. Todas as geometrias, anotações e dimensões arquitetônicas são renderizadas com total fidelidade vetorial.",
  "Meus projetos de engenharia são enviados para servidores externos?",
  "Nunca. Seus arquivos são processados localmente no seu dispositivo com total privacidade."
]);
set("cad","it",[
  "Devo avere AutoCAD installato per convertire file DWG o DXF?",
  "No. FileKit elabora i progetti AutoCAD DWG e DXF direttamente nel browser web senza bisogno di costose licenze software.",
  "I livelli vettoriali, gli spessori di linea e le quote vengono conservati?",
  "Sì. Tutte le geometrie di linea, le annotazioni di testo e le dimensioni architettoniche mantengono la massima fedeltà vettoriale.",
  "I miei disegni tecnici vengono caricati su server terzi?",
  "Mai. I tuoi file vengono elaborati localmente nel browser e non lasciano mai il tuo dispositivo."
]);
set("cad","nl",[
  "Heb ik AutoCAD nodig om DWG- of DXF-bestanden te converteren?",
  "Nee. FileKit verwerkt AutoCAD DWG- en DXF-bestanden rechtstreeks in uw webbrowser zonder dure softwarelicenties.",
  "Blijven vectorlagen, lijngewichten en architecturale afmetingen behouden?",
  "Ja. Alle lijngeometrieën, tekstannotaties en architecturale afmetingen worden met exacte vectornauwkeurigheid weergegeven.",
  "Worden mijn technische tekeningen naar een externe server geüpload?",
  "Nooit. Uw bestanden worden lokaal in uw browser verwerkt en verlaten nooit uw apparaat."
]);
set("cad","ca",[
  "Necessito AutoCAD instal·lat per convertir fitxers DWG o DXF?",
  "No. FileKit processa plànols AutoCAD DWG i DXF directament al vostre navegador sense necessitat de llicències costoses.",
  "Es conserven les capes vectorials, gruixos de línia i cotes arquitectòniques?",
  "Sí. Totes les geometries, anotacions de text i cotes es representen amb total fidelitat vectorial.",
  "Els meus plànols d'enginyeria es pugen a servidors externs?",
  "Mai. Els fitxers es processen localment al navegador i mai surten del vostre dispositiu."
]);
set("cad","sv",[
  "Behöver jag AutoCAD för att konvertera DWG- eller DXF-filer?",
  "Nej. FileKit bearbetar AutoCAD DWG- och DXF-ritningar direkt i din webbläsare utan dyra programvarulicenser.",
  "Bevaras vektorlager, linjetjocklekar och arkitektoniska mått?",
  "Ja. Alla linjegeometrier, textanteckningar och arkitektoniska mått renderas med exakt vektornoggrannhet.",
  "Laddas mina konstruktionsritningar upp till en extern server?",
  "Aldrig. Dina filer bearbetas lokalt i din webbläsare och lämnar aldrig din enhet."
]);
set("cad","da",[
  "Skal jeg have AutoCAD installeret for at konvertere DWG- eller DXF-filer?",
  "Nej. FileKit behandler AutoCAD DWG- og DXF-tegninger direkte i din webbrowser uden dyre softwarelicenser.",
  "Bevares vektorlag, linjetykkelser og arkitektoniske mål?",
  "Ja. Alle linjegeometrier, tekstannotationer og arkitektoniske dimensioner gengives med præcis vektornøjagtighed.",
  "Uploades mine ingeniørtegninger til en ekstern server?",
  "Aldrig. Dine filer behandles lokalt i din browser og forlader aldrig din enhed."
]);
set("cad","fi",[
  "Tarvitsenko AutoCADin DWG- tai DXF-tiedostojen muuntamiseen?",
  "Ei. FileKit käsittelee AutoCAD DWG- ja DXF-piirustukset suoraan selaimessasi ilman kalliita ohjelmistolisenssejä.",
  "Säilyvätkö vektoritasot, viivanpaksuudet ja arkkitehtoniset mitat?",
  "Kyllä. Kaikki geometriat, tekstimerkinnät ja mitat renderöidään tarkalla vektoritarkkuudella.",
  "Ladataanko tekniset piirustukseni ulkoiselle palvelimelle?",
  "Ei koskaan. Tiedostot käsitellään paikallisesti selaimessasi eivätkä ne koskaan poistu laitteeltasi."
]);
set("cad","no",[
  "Trenger jeg AutoCAD for å konvertere DWG- eller DXF-filer?",
  "Nei. FileKit behandler AutoCAD DWG- og DXF-tegninger direkte i nettleseren din uten dyre programvarelisenser.",
  "Bevares vektorlag, linjevekter og arkitektoniske mål?",
  "Ja. Alle linjegeometrier, tekstkommentarer og arkitektoniske dimensjoner gjengis med nøyaktig vektortroskap.",
  "Lastes mine tekniske tegninger opp til en ekstern server?",
  "Aldri. Filene dine behandles lokalt i nettleseren og forlater aldri enheten din."
]);
set("cad","pl",[
  "Czy potrzebuję AutoCAD do konwersji plików DWG lub DXF?",
  "Nie. FileKit przetwarza rysunki AutoCAD DWG i DXF bezpośrednio w przeglądarce bez kosztownych licencji.",
  "Czy warstwy wektorowe, grubości linii i wymiary architektoniczne są zachowywane?",
  "Tak. Wszystkie geometrie, adnotacje tekstowe i wymiary są renderowane z dokładnością wektorową.",
  "Czy moje rysunki inżynierskie są przesyłane na serwer zewnętrzny?",
  "Nigdy. Pliki przetwarzane są lokalnie w przeglądarce i nigdy nie opuszczają urządzenia."
]);
set("cad","cs",[
  "Potřebuji AutoCAD k převodu souborů DWG nebo DXF?",
  "Ne. FileKit zpracovává výkresy AutoCAD DWG a DXF přímo ve vašem prohlížeči bez drahých softwarových licencí.",
  "Zachovají se vektorové vrstvy, tloušťky čar a architektonické kóty?",
  "Ano. Všechny geometrie, textové anotace a rozměry jsou vykresleny s přesnou vektorovou věrností.",
  "Jsou mé inženýrské výkresy nahrány na externí server?",
  "Nikdy. Vaše soubory jsou zpracovány lokálně v prohlížeči a nikdy neopustí vaše zařízení."
]);
set("cad","hu",[
  "Szükségem van telepített AutoCAD-re a DWG vagy DXF fájlok konvertálásához?",
  "Nem. A FileKit közvetlenül a böngészőben dolgozza fel az AutoCAD DWG és DXF rajzokat drága szoftverlicencek nélkül.",
  "Megőrződnek a vektorrétegek, vonalvastagságok és építészeti méretek?",
  "Igen. Minden geometria, szöveges megjegyzés és méret pontos vektor hűséggel jelenik meg.",
  "Feltöltődnek a mérnöki rajzaim külső szerverre?",
  "Soha. A fájlok helyben, a böngészőben kerülnek feldolgozásra, és soha nem hagyják el az eszközét."
]);
set("cad","ro",[
  "Am nevoie de AutoCAD instalat pentru a converti fișiere DWG sau DXF?",
  "Nu. FileKit procesează planuri AutoCAD DWG și DXF direct în browserul web fără licențe software costisitoare.",
  "Se păstrează straturile vectoriale, grosimile liniilor și cotele arhitecturale?",
  "Da. Toate geometriile, adnotările text și dimensiunile sunt redate cu fidelitate vectorială exactă.",
  "Sunt desenele mele tehnice încărcate pe un server extern?",
  "Niciodată. Fișierele sunt procesate local în browser și nu părăsesc niciodată dispozitivul."
]);
set("cad","bg",[
  "Трябва ли ми AutoCAD за конвертиране на DWG или DXF файлове?",
  "Не. FileKit обработва чертежи AutoCAD DWG и DXF директно в браузъра ви без скъпи софтуерни лицензи.",
  "Запазват ли се векторните слоеве, дебелините на линиите и архитектурните размери?",
  "Да. Всички геометрии, текстови анотации и размери се визуализират с точна векторна прецизност.",
  "Качват ли се инженерните ми чертежи на външен сървър?",
  "Никога. Файловете се обработват локално в браузъра и никога не напускат устройството ви."
]);
set("cad","el",[
  "Χρειάζομαι το AutoCAD για να μετατρέψω αρχεία DWG ή DXF;",
  "Όχι. Το FileKit επεξεργάζεται σχέδια AutoCAD DWG και DXF απευθείας στον browser σας χωρίς ακριβές άδειες λογισμικού.",
  "Διατηρούνται τα διανυσματικά επίπεδα, τα πάχη γραμμών και οι αρχιτεκτονικές διαστάσεις;",
  "Ναι. Όλες οι γεωμετρίες, οι σημειώσεις κειμένου και οι διαστάσεις αποδίδονται με ακριβή διανυσματική πιστότητα.",
  "Μεταφορτώνονται τα μηχανικά μου σχέδια σε εξωτερικό διακομιστή;",
  "Ποτέ. Τα αρχεία σας υποβάλλονται σε επεξεργασία τοπικά στον browser και δεν εγκαταλείπουν ποτέ τη συσκευή σας."
]);
set("cad","sk",[
  "Potrebujem AutoCAD na konverziu súborov DWG alebo DXF?",
  "Nie. FileKit spracováva výkresy AutoCAD DWG a DXF priamo vo vašom prehliadači bez drahých softvérových licencií.",
  "Zachovajú sa vektorové vrstvy, hrúbky čiar a architektonické kóty?",
  "Áno. Všetky geometrie, textové anotácie a rozmery sa vykreslia s presnou vektorovou vernosťou.",
  "Nahrávajú sa moje inžinierske výkresy na externý server?",
  "Nikdy. Vaše súbory sa spracúvajú lokálne v prehliadači a nikdy neopustia vaše zariadenie."
]);
set("cad","sl",[
  "Ali potrebujem AutoCAD za pretvorbo datotek DWG ali DXF?",
  "Ne. FileKit obdeluje načrte AutoCAD DWG in DXF neposredno v brskalniku brez dragih programskih licenc.",
  "Ali se ohranijo vektorske plasti, debeline črt in arhitekturne mere?",
  "Da. Vse geometrije, besedilne opombe in mere se upodobijo z natančno vektorsko zvestobo.",
  "Ali se moji inženirski načrti naložijo na zunanji strežnik?",
  "Nikoli. Vaše datoteke se obdelujejo lokalno v brskalniku in nikoli ne zapustijo vaše naprave."
]);
set("cad","ru",[
  "Нужен ли AutoCAD для конвертации файлов DWG или DXF?",
  "Нет. FileKit обрабатывает чертежи AutoCAD DWG и DXF прямо в браузере без дорогостоящих программных лицензий.",
  "Сохраняются ли векторные слои, толщины линий и архитектурные размеры?",
  "Да. Все геометрии, текстовые аннотации и размеры визуализируются с точной векторной точностью.",
  "Загружаются ли мои чертежи на внешний сервер?",
  "Никогда. Файлы обрабатываются локально в браузере и никогда не покидают ваше устройство."
]);
set("cad","uk",[
  "Чи потрібен AutoCAD для конвертації файлів DWG або DXF?",
  "Ні. FileKit обробляє креслення AutoCAD DWG та DXF безпосередньо у вашому браузері без дорогих ліцензій.",
  "Чи зберігаються векторні шари, товщини ліній та архітектурні розміри?",
  "Так. Усі геометрії, текстові анотації та розміри відтворюються з точною векторною вірністю.",
  "Чи завантажуються мої інженерні креслення на зовнішній сервер?",
  "Ніколи. Файли обробляються локально у браузері і ніколи не залишають ваш пристрій."
]);
set("cad","lv",[
  "Vai man ir nepieciešams AutoCAD, lai konvertētu DWG vai DXF failus?",
  "Nē. FileKit apstrādā AutoCAD DWG un DXF rasējumus tieši jūsu pārlūkprogrammā bez dārgām programmatūras licencēm.",
  "Vai tiek saglabāti vektoru slāņi, līniju biezumi un arhitektūras izmēri?",
  "Jā. Visas ģeometrijas, teksta anotācijas un izmēri tiek atveidoti ar precīzu vektora precizitāti.",
  "Vai mani inženierijas rasējumi tiek augšupielādēti ārējā serverī?",
  "Nekad. Jūsu faili tiek apstrādāti lokāli pārlūkprogrammā un nekad neatstāj jūsu ierīci."
]);
set("cad","lt",[
  "Ar man reikia AutoCAD DWG ar DXF failams konvertuoti?",
  "Ne. FileKit apdoroja AutoCAD DWG ir DXF brėžinius tiesiai jūsų naršyklėje be brangių programinės įrangos licencijų.",
  "Ar išsaugomi vektoriniai sluoksniai, linijų storiai ir architektūriniai matmenys?",
  "Taip. Visos geometrijos, teksto anotacijos ir matmenys pateikiami tiksliu vektoriniu tikslumu.",
  "Ar mano inžineriniai brėžiniai įkeliami į išorinį serverį?",
  "Niekada. Jūsų failai apdorojami lokaliai naršyklėje ir niekada nepalieka jūsų įrenginio."
]);
set("cad","tr",[
  "DWG veya DXF dosyalarını dönüştürmek için AutoCAD kurulu olmalı mı?",
  "Hayır. FileKit, AutoCAD DWG ve DXF çizimlerini pahalı yazılımlara gerek kalmadan doğrudan tarayıcınızda işler.",
  "Vektör katmanları, çizgi kalınlıkları ve mimari ölçüler korunur mu?",
  "Evet. Tüm çizgi geometrileri, metin notları ve mimari boyutlar tam vektör doğruluğu ile işlenir.",
  "Mühendislik çizimlerim üçüncü taraf bir sunucuya yükleniyor mu?",
  "Asla. Dosyalarınız tarayıcınızda yerel olarak işlenir ve cihazınızdan asla ayrılmaz."
]);
set("cad","ar",[
  "هل أحتاج إلى تثبيت AutoCAD لتحويل ملفات DWG أو DXF؟",
  "لا. يقوم FileKit بمعالجة مخططات AutoCAD DWG وDXF مباشرة في متصفحك دون الحاجة إلى تراخيص برامج باهظة الثمن.",
  "هل يتم الحفاظ على الطبقات المتجهية وسمك الخطوط والأبعاد المعمارية؟",
  "نعم. يتم عرض جميع الأشكال الهندسية والتعليقات التوضيحية والأبعاد بدقة متجهة متناهية.",
  "هل يتم رفع مخططاتي الهندسية إلى خادم خارجي؟",
  "مطلقاً. تتم معالجة ملفاتك محلياً داخل متصفحك ولا تغادر جهازك أبداً."
]);
set("cad","he",[
  "האם אני צריך AutoCAD מותקן כדי להמיר קבצי DWG או DXF?",
  "לא. FileKit מעבד שרטוטי AutoCAD DWG ו-DXF ישירות בדפדפן שלך ללא צורך ברישיונות תוכנה יקרים.",
  "האם שכבות וקטוריות, עובי קווים ומידות אדריכליות נשמרים?",
  "כן. כל הגיאומטריות, הערות הטקסט והמידות מעובדות בדיוק וקטורי מלא.",
  "האם השרטוטים ההנדסיים שלי מועלים לשרת חיצוני?",
  "לעולם לא. הקבצים מעובדים מקומית בדפדפן ולעולם לא עוזבים את המכשיר שלך."
]);
set("cad","hi",[
  "क्या DWG या DXF फ़ाइलों को कन्वर्ट करने के लिए AutoCAD इंस्टॉल होना ज़रूरी है?",
  "नहीं। FileKit आपके वेब ब्राउज़र में AutoCAD DWG और DXF ब्लूप्रिंट को सीधे प्रोसेस करता है, महंगे सॉफ़्टवेयर की ज़रूरत नहीं।",
  "क्या वेक्टर लेयर्स, लाइन की मोटाई और आर्किटेक्चरल डाइमेंशन सुरक्षित रहते हैं?",
  "हाँ। सभी ज्यामिति, टेक्स्ट एनोटेशन और आयाम सटीक वेक्टर गुणवत्ता के साथ प्रस्तुत होते हैं।",
  "क्या मेरे इंजीनियरिंग ड्रॉइंग बाहरी सर्वर पर अपलोड होते हैं?",
  "कभी नहीं। आपकी फ़ाइलें ब्राउज़र में स्थानीय रूप से प्रोसेस होती हैं और कभी भी आपके डिवाइस से बाहर नहीं जातीं।"
]);
set("cad","id",[
  "Apakah saya perlu AutoCAD untuk mengonversi file DWG atau DXF?",
  "Tidak. FileKit memproses gambar AutoCAD DWG dan DXF langsung di browser Anda tanpa lisensi perangkat lunak mahal.",
  "Apakah lapisan vektor, ketebalan garis, dan dimensi arsitektur dipertahankan?",
  "Ya. Semua geometri, anotasi teks, dan dimensi dirender dengan ketelitian vektor yang tepat.",
  "Apakah gambar teknik saya diunggah ke server eksternal?",
  "Tidak pernah. File Anda diproses secara lokal di browser dan tidak pernah meninggalkan perangkat Anda."
]);
set("cad","ms",[
  "Adakah saya perlu AutoCAD untuk menukar fail DWG atau DXF?",
  "Tidak. FileKit memproses pelan AutoCAD DWG dan DXF terus dalam pelayar web anda tanpa lesen perisian mahal.",
  "Adakah lapisan vektor, ketebalan garisan dan dimensi seni bina dikekalkan?",
  "Ya. Semua geometri, anotasi teks dan dimensi dipaparkan dengan ketepatan vektor yang tepat.",
  "Adakah lukisan kejuruteraan saya dimuat naik ke pelayan luaran?",
  "Tidak pernah. Fail anda diproses secara setempat dalam pelayar dan tidak pernah meninggalkan peranti anda."
]);
set("cad","th",[
  "ต้องติดตั้ง AutoCAD เพื่อแปลงไฟล์ DWG หรือ DXF หรือไม่?",
  "ไม่ FileKit ประมวลผลแบบ AutoCAD DWG และ DXF โดยตรงในเบราว์เซอร์โดยไม่ต้องใช้ซอฟต์แวร์ราคาแพง",
  "เลเยอร์เวกเตอร์ ความหนาเส้น และมิติสถาปัตยกรรมถูกรักษาไว้หรือไม่?",
  "ใช่ เรขาคณิตทั้งหมด คำอธิบายข้อความ และมิติถูกแสดงผลด้วยความแม่นยำเวกเตอร์ที่แม่นยำ",
  "แบบวิศวกรรมของฉันถูกอัปโหลดไปยังเซิร์ฟเวอร์ภายนอกหรือไม่?",
  "ไม่เลย ไฟล์ของคุณถูกประมวลผลในเครื่องภายในเบราว์เซอร์และไม่เคยออกจากอุปกรณ์ของคุณ"
]);
set("cad","vi",[
  "Tôi có cần cài đặt AutoCAD để chuyển đổi file DWG hoặc DXF không?",
  "Không. FileKit xử lý bản vẽ AutoCAD DWG và DXF trực tiếp trong trình duyệt mà không cần phần mềm đắt tiền.",
  "Các lớp vector, độ dày đường và kích thước kiến trúc có được giữ nguyên không?",
  "Có. Tất cả hình học, chú thích văn bản và kích thước được hiển thị với độ chính xác vector hoàn hảo.",
  "Bản vẽ kỹ thuật của tôi có bị tải lên máy chủ bên ngoài không?",
  "Không bao giờ. File của bạn được xử lý cục bộ trong trình duyệt và không bao giờ rời khỏi thiết bị."
]);
set("cad","fil",[
  "Kailangan ko ba ng AutoCAD para mag-convert ng DWG o DXF files?",
  "Hindi. Pinoproseso ng FileKit ang AutoCAD DWG at DXF blueprints direkta sa iyong browser nang walang mamahaling software.",
  "Nananatili ba ang mga vector layer, line weight, at architectural dimension?",
  "Oo. Lahat ng geometry, text annotation, at dimensyon ay nire-render nang may eksaktong vector fidelity.",
  "Ina-upload ba ang aking engineering drawing sa external server?",
  "Hindi kailanman. Pinoproseso ang iyong mga file nang lokal sa browser at hindi umaalis sa iyong device."
]);
set("cad","ja",[
  "DWGやDXFファイルを変換するためにAutoCADのインストールは必要ですか？",
  "いいえ。FileKitは高価なソフトウェアを必要とせず、ブラウザ内でAutoCAD DWGおよびDXF図面を直接処理します。",
  "ベクターレイヤー、線の太さ、寸法線は正確に保持されますか？",
  "はい。すべての幾何学データ、テキスト注釈、建築寸法はベクター精度で正確に再現されます。",
  "設計図面や機密ファイルが外部サーバーにアップロードされることはありますか？",
  "一切ありません。すべての処理はお使いの端末のブラウザ内で完結し、外部へ送信されることはありません。"
]);
set("cad","ko",[
  "DWG 또는 DXF 파일을 변환하려면 AutoCAD가 설치되어 있어야 하나요?",
  "아니요. FileKit은 고가의 소프트웨어 없이도 웹 브라우저에서 직접 AutoCAD DWG 및 DXF 도면을 로컬 처리합니다.",
  "벡터 레이어, 선 두께 및 건축 치수가 그대로 유지되나요?",
  "네. 모든 선 형상, 텍스트 주석 및 치수 정보가 정밀한 벡터 품질로 완벽하게 보존됩니다.",
  "엔지니어링 도면 파일이 외부 서버로 업로드되나요?",
  "절대 아닙니다. 파일은 브라우저 내에서 로컬로 처리되며 사용자의 기기를 벗어나지 않습니다."
]);
set("cad","zh-CN",[
  "转换 DWG 或 DXF 文件需要安装 AutoCAD 吗？",
  "不需要。FileKit 直接在您的网页浏览器中解析 AutoCAD DWG 和 DXF 图纸，无需安装昂贵的软件。",
  "矢量图层、线宽和工程标注尺寸会完整保留吗？",
  "会。所有线条几何图形、文本注释和建筑尺寸均以精准的矢量格式完整呈现。",
  "我的工程图纸会被上传到云端服务器吗？",
  "绝不。您的文件仅在浏览器本地进行处理，数据绝不会离开您的设备。"
]);
set("cad","zh-TW",[
  "轉換 DWG 或 DXF 檔案需要安裝 AutoCAD 嗎？",
  "不需要。FileKit 直接於您的網頁瀏覽器中處理 AutoCAD DWG 和 DXF 工程圖，無須購買昂貴的軟體授權。",
  "向量圖層、線寬與建築標註尺寸會完整保留嗎？",
  "會。所有線條幾何、文字註解與建築尺寸皆以精確的向量品質完整保留。",
  "我的工程圖紙會被上傳至第三方伺服器嗎？",
  "絕不。所有檔案皆於本機瀏覽器內安全處理，圖紙資料絕不會離開您的裝置。"
]);

// ═══════════════════ VECTOR ═══════════════════
const vectorQ1 = {
  en:"Can I convert AI, EPS, or PSD files without Adobe Creative Cloud?",
  es:"¿Puedo convertir archivos AI, EPS o PSD sin Adobe Creative Cloud?",
  "es-419":"¿Puedo convertir archivos AI, EPS o PSD sin Adobe Creative Cloud?",
  de:"Kann ich AI-, EPS- oder PSD-Dateien ohne Adobe Creative Cloud konvertieren?",
  fr:"Puis-je convertir des fichiers AI, EPS ou PSD sans Adobe Creative Cloud ?",
  pt:"Posso converter ficheiros AI, EPS ou PSD sem o Adobe Creative Cloud?",
  "pt-BR":"Posso converter arquivos AI, EPS ou PSD sem o Adobe Creative Cloud?",
  it:"Posso convertire file AI, EPS o PSD senza Adobe Creative Cloud?",
  nl:"Kan ik AI-, EPS- of PSD-bestanden converteren zonder Adobe Creative Cloud?",
  ca:"Puc convertir fitxers AI, EPS o PSD sense Adobe Creative Cloud?",
  sv:"Kan jag konvertera AI-, EPS- eller PSD-filer utan Adobe Creative Cloud?",
  da:"Kan jeg konvertere AI-, EPS- eller PSD-filer uden Adobe Creative Cloud?",
  fi:"Voinko muuntaa AI-, EPS- tai PSD-tiedostoja ilman Adobe Creative Cloudia?",
  no:"Kan jeg konvertere AI-, EPS- eller PSD-filer uten Adobe Creative Cloud?",
  pl:"Czy mogę konwertować pliki AI, EPS lub PSD bez Adobe Creative Cloud?",
  cs:"Mohu převést soubory AI, EPS nebo PSD bez Adobe Creative Cloud?",
  hu:"Konvertálhatok AI, EPS vagy PSD fájlokat Adobe Creative Cloud nélkül?",
  ro:"Pot converti fișiere AI, EPS sau PSD fără Adobe Creative Cloud?",
  bg:"Мога ли да конвертирам AI, EPS или PSD файлове без Adobe Creative Cloud?",
  el:"Μπορώ να μετατρέψω αρχεία AI, EPS ή PSD χωρίς Adobe Creative Cloud;",
  sk:"Môžem konvertovať súbory AI, EPS alebo PSD bez Adobe Creative Cloud?",
  sl:"Ali lahko pretvorim datoteke AI, EPS ali PSD brez Adobe Creative Cloud?",
  ru:"Могу ли я конвертировать файлы AI, EPS или PSD без Adobe Creative Cloud?",
  uk:"Чи можу я конвертувати файли AI, EPS або PSD без Adobe Creative Cloud?",
  lv:"Vai es varu konvertēt AI, EPS vai PSD failus bez Adobe Creative Cloud?",
  lt:"Ar galiu konvertuoti AI, EPS ar PSD failus be Adobe Creative Cloud?",
  tr:"Adobe Creative Cloud olmadan AI, EPS veya PSD dosyalarını dönüştürebilir miyim?",
  ar:"هل يمكنني تحويل ملفات AI أو EPS أو PSD بدون Adobe Creative Cloud؟",
  he:"האם אפשר להמיר קבצי AI, EPS או PSD ללא Adobe Creative Cloud?",
  hi:"क्या मैं Adobe Creative Cloud के बिना AI, EPS या PSD फ़ाइलें कन्वर्ट कर सकता/सकती हूँ?",
  id:"Bisakah saya mengonversi file AI, EPS, atau PSD tanpa Adobe Creative Cloud?",
  ms:"Bolehkah saya menukar fail AI, EPS atau PSD tanpa Adobe Creative Cloud?",
  th:"ฉันสามารถแปลงไฟล์ AI, EPS หรือ PSD โดยไม่ต้องใช้ Adobe Creative Cloud ได้หรือไม่?",
  vi:"Tôi có thể chuyển đổi file AI, EPS hoặc PSD mà không cần Adobe Creative Cloud không?",
  fil:"Maaari ba akong mag-convert ng AI, EPS, o PSD files nang walang Adobe Creative Cloud?",
  ja:"Adobe Creative CloudなしでAI、EPS、PSDファイルを変換できますか？",
  ko:"Adobe Creative Cloud 없이 AI, EPS 또는 PSD 파일을 변환할 수 있나요?",
  "zh-CN":"我可以在没有 Adobe Creative Cloud 的情况下转换 AI、EPS 或 PSD 文件吗？",
  "zh-TW":"我可以在沒有 Adobe Creative Cloud 的情況下轉換 AI、EPS 或 PSD 檔案嗎？"
};
const vectorA1 = {
  en:"Yes. FileKit renders vector paths and raster layers directly in your browser without requiring Adobe Illustrator or Photoshop licenses.",
  es:"Sí. FileKit renderiza trazados vectoriales y capas directamente en tu navegador sin requerir suscripciones a Illustrator o Photoshop.",
  "es-419":"Sí. FileKit procesa rutas vectoriales y capas ráster directamente en tu navegador sin requerir licencias de Adobe.",
  de:"Ja. FileKit rendert Vektorpfade und Rasterebenen direkt in Ihrem Browser ohne Adobe-Lizenzen.",
  fr:"Oui. FileKit affiche les tracés vectoriels et les calques directement dans votre navigateur sans licence Adobe.",
  pt:"Sim. O FileKit processa caminhos vetoriais e camadas diretamente no seu navegador sem licenças da Adobe.",
  "pt-BR":"Sim. O FileKit renderiza caminhos vetoriais e camadas diretamente no seu navegador sem licenças da Adobe.",
  it:"Sì. FileKit elabora tracciati vettoriali e livelli direttamente nel browser senza licenze Adobe.",
  nl:"Ja. FileKit rendert vectorpaden en rasterlagen rechtstreeks in uw browser zonder Adobe-licenties.",
  ca:"Sí. FileKit renderitza traçats vectorials i capes directament al navegador sense llicències d'Adobe.",
  sv:"Ja. FileKit renderar vektorbanor och rasterlager direkt i din webbläsare utan Adobe-licenser.",
  da:"Ja. FileKit renderer vektorstier og rasterlag direkte i din browser uden Adobe-licenser.",
  fi:"Kyllä. FileKit renderöi vektoripolut ja rasterikerrokset suoraan selaimessasi ilman Adobe-lisenssejä.",
  no:"Ja. FileKit rendrer vektorbaner og rasterlag direkte i nettleseren din uten Adobe-lisenser.",
  pl:"Tak. FileKit renderuje ścieżki wektorowe i warstwy rastrowe bezpośrednio w przeglądarce bez licencji Adobe.",
  cs:"Ano. FileKit vykresluje vektorové cesty a rastrové vrstvy přímo v prohlížeči bez licencí Adobe.",
  hu:"Igen. A FileKit közvetlenül a böngészőben rendereli a vektorútvonalakat és rétegeket Adobe-licencek nélkül.",
  ro:"Da. FileKit redă trasee vectoriale și straturi raster direct în browser fără licențe Adobe.",
  bg:"Да. FileKit визуализира векторни пътища и растерни слоеве директно в браузъра без лицензи на Adobe.",
  el:"Ναι. Το FileKit αποδίδει διανυσματικές διαδρομές και επίπεδα raster απευθείας στον browser χωρίς άδειες Adobe.",
  sk:"Áno. FileKit vykresľuje vektorové cesty a rastrové vrstvy priamo v prehliadači bez licencií Adobe.",
  sl:"Da. FileKit upodobi vektorske poti in rastrske plasti neposredno v brskalniku brez Adobejevih licenc.",
  ru:"Да. FileKit визуализирует векторные контуры и растровые слои прямо в браузере без лицензий Adobe.",
  uk:"Так. FileKit відтворює векторні контури та растрові шари безпосередньо у браузері без ліцензій Adobe.",
  lv:"Jā. FileKit atveido vektoru ceļus un rastra slāņus tieši pārlūkprogrammā bez Adobe licencēm.",
  lt:"Taip. FileKit atvaizduoja vektorinius kelius ir rastrinius sluoksnius tiesiai naršyklėje be Adobe licencijų.",
  tr:"Evet. FileKit, Adobe lisansları gerektirmeden vektör yollarını ve raster katmanları doğrudan tarayıcınızda işler.",
  ar:"نعم. يعرض FileKit المسارات المتجهة والطبقات النقطية مباشرة في متصفحك دون الحاجة لتراخيص Adobe.",
  he:"כן. FileKit מעבד נתיבים וקטוריים ושכבות רסטר ישירות בדפדפן ללא צורך ברישיונות Adobe.",
  hi:"हाँ। FileKit Adobe लाइसेंस के बिना वेक्टर पथ और रैस्टर लेयर्स को सीधे आपके ब्राउज़र में रेंडर करता है।",
  id:"Ya. FileKit merender jalur vektor dan lapisan raster langsung di browser Anda tanpa lisensi Adobe.",
  ms:"Ya. FileKit merender laluan vektor dan lapisan raster terus dalam pelayar anda tanpa lesen Adobe.",
  th:"ใช่ FileKit เรนเดอร์เส้นทางเวกเตอร์และเลเยอร์แรสเตอร์โดยตรงในเบราว์เซอร์โดยไม่ต้องใช้สิทธิ์ Adobe",
  vi:"Có. FileKit hiển thị đường vector và lớp raster trực tiếp trong trình duyệt mà không cần giấy phép Adobe.",
  fil:"Oo. Nire-render ng FileKit ang vector paths at raster layers direkta sa iyong browser nang walang Adobe license.",
  ja:"はい。FileKitはAdobe ライセンスなしで、ベクターパスとラスターレイヤーをブラウザ内で直接レンダリングします。",
  ko:"네. FileKit은 Adobe 라이선스 없이도 벡터 경로와 래스터 레이어를 브라우저에서 직접 렌더링합니다.",
  "zh-CN":"可以。FileKit 无需 Adobe 许可证，直接在浏览器中渲染矢量路径和栅格图层。",
  "zh-TW":"可以。FileKit 無需 Adobe 授權，直接在瀏覽器中渲染向量路徑和點陣圖層。"
};

// For remaining families, I'll use a templating approach
// Each family gets 3 FAQ Q/A pairs across all 39 locales

// Build vector family from per-question dictionaries
function buildFamilyFromDicts(q1Dict, a1Dict, q2Dict, a2Dict, q3Dict, a3Dict) {
  const result = {};
  for (const loc of LOCALES) {
    result[loc] = [
      q1Dict[loc] || q1Dict.en,
      a1Dict[loc] || a1Dict.en,
      q2Dict[loc] || q2Dict.en,
      a2Dict[loc] || a2Dict.en,
      q3Dict[loc] || q3Dict.en,
      a3Dict[loc] || a3Dict.en,
    ];
  }
  return result;
}

// Q2 for vector
const vectorQ2 = {
  en:"Will vector paths and color profiles remain sharp and accurate?",
  es:"¿Se mantienen nítidos los trazados vectoriales y perfiles de color?",
  "es-419":"¿Los trazados vectoriales y perfiles de color se mantienen nítidos?",
  de:"Bleiben Vektorpfade und Farbprofile scharf und genau?",
  fr:"Les tracés vectoriels et profils de couleur restent-ils nets et précis ?",
  pt:"Os caminhos vetoriais e perfis de cor mantêm-se nítidos e precisos?",
  "pt-BR":"Os caminhos vetoriais e perfis de cor se mantêm nítidos e precisos?",
  it:"I tracciati vettoriali e i profili colore restano nitidi e precisi?",
  nl:"Blijven vectorpaden en kleurprofielen scherp en nauwkeurig?",
  ca:"Els traçats vectorials i perfils de color es mantenen nítids i precisos?",
  sv:"Förblir vektorbanor och färgprofiler skarpa och exakta?",
  da:"Forbliver vektorstier og farveprofiler skarpe og nøjagtige?",
  fi:"Säilyvätkö vektoripolut ja väriprofiilit terävinä ja tarkkoina?",
  no:"Forblir vektorbaner og fargeprofiler skarpe og nøyaktige?",
  pl:"Czy ścieżki wektorowe i profile kolorów pozostają ostre i dokładne?",
  cs:"Zůstanou vektorové cesty a barevné profily ostré a přesné?",
  hu:"A vektorútvonalak és színprofilok élesek és pontosak maradnak?",
  ro:"Traseele vectoriale și profilurile de culoare rămân clare și precise?",
  bg:"Векторните пътища и цветовите профили остават ли ясни и точни?",
  el:"Τα διανυσματικά μονοπάτια και τα χρωματικά προφίλ παραμένουν ευκρινή;",
  sk:"Zostanú vektorové cesty a farebné profily ostré a presné?",
  sl:"Ali vektorske poti in barvni profili ostanejo ostri in natančni?",
  ru:"Сохраняются ли векторные контуры и цветовые профили чёткими и точными?",
  uk:"Чи залишаються векторні контури та кольорові профілі чіткими та точними?",
  lv:"Vai vektoru ceļi un krāsu profili paliek asi un precīzi?",
  lt:"Ar vektoriniai keliai ir spalvų profiliai išlieka ryškūs ir tikslūs?",
  tr:"Vektör yolları ve renk profilleri keskin ve doğru kalır mı?",
  ar:"هل تبقى المسارات المتجهة وملفات تعريف الألوان واضحة ودقيقة؟",
  he:"האם נתיבים וקטוריים ופרופילי צבע נשארים חדים ומדויקים?",
  hi:"क्या वेक्टर पथ और रंग प्रोफ़ाइल तीक्ष्ण और सटीक बने रहते हैं?",
  id:"Apakah jalur vektor dan profil warna tetap tajam dan akurat?",
  ms:"Adakah laluan vektor dan profil warna kekal tajam dan tepat?",
  th:"เส้นทางเวกเตอร์และโปรไฟล์สียังคงคมชัดและแม่นยำหรือไม่?",
  vi:"Đường vector và hồ sơ màu có giữ được sắc nét và chính xác không?",
  fil:"Nananatiling matalim at tumpak ba ang vector paths at color profiles?",
  ja:"ベクターパスとカラープロファイルは鮮明で正確なまま保持されますか？",
  ko:"벡터 경로와 색상 프로필이 선명하고 정확하게 유지되나요?",
  "zh-CN":"矢量路径和颜色配置文件是否保持清晰准确？",
  "zh-TW":"向量路徑和色彩設定檔是否保持清晰準確？"
};
const vectorA2 = {
  en:"Yes. The engine extracts exact vector outlines and high-resolution layers with full RGB/CMYK color preservation.",
  es:"Sí. El motor extrae trazados vectoriales exactos y capas de alta resolución con preservación de color RGB y CMYK.",
  "es-419":"Sí. El motor extrae contornos vectoriales exactos y capas de alta resolución preservando los colores RGB y CMYK.",
  de:"Ja. Die Engine extrahiert exakte Vektorkonturen und hochauflösende Ebenen mit vollständiger RGB/CMYK-Farberhaltung.",
  fr:"Oui. Le moteur extrait des contours vectoriels exacts et des calques haute résolution avec préservation complète des couleurs RGB/CMYK.",
  pt:"Sim. O motor extrai contornos vetoriais exatos e camadas de alta resolução com preservação total de cores RGB/CMYK.",
  "pt-BR":"Sim. O motor extrai contornos vetoriais exatos e camadas de alta resolução com preservação completa de cores RGB/CMYK.",
  it:"Sì. Il motore estrae contorni vettoriali esatti e livelli ad alta risoluzione con preservazione completa dei colori RGB/CMYK.",
  nl:"Ja. De engine extraheert exacte vectorcontouren en lagen met behoud van volledige RGB/CMYK-kleuren.",
  ca:"Sí. El motor extreu contorns vectorials exactes i capes d'alta resolució amb preservació completa de colors RGB/CMYK.",
  sv:"Ja. Motorn extraherar exakta vektorkonturer och högupplösta lager med full RGB/CMYK-färgbevarande.",
  da:"Ja. Motoren udtrækker præcise vektorkonturer og højopløsningslag med fuld RGB/CMYK-farvebevarelse.",
  fi:"Kyllä. Moottori poimii tarkat vektoriääriviivat ja korkearesoluutioiset kerrokset täydellä RGB/CMYK-värien säilyttämisellä.",
  no:"Ja. Motoren henter ut eksakte vektorkonturer og høyoppløselige lag med full RGB/CMYK-fargbevaring.",
  pl:"Tak. Silnik wyodrębnia dokładne kontury wektorowe i warstwy o wysokiej rozdzielczości z pełnym zachowaniem kolorów RGB/CMYK.",
  cs:"Ano. Motor extrahuje přesné vektorové obrysy a vrstvy ve vysokém rozlišení s plným zachováním barev RGB/CMYK.",
  hu:"Igen. A motor pontos vektorkontúrokat és nagy felbontású rétegeket nyer ki teljes RGB/CMYK szín megőrzéssel.",
  ro:"Da. Motorul extrage contururi vectoriale exacte și straturi de înaltă rezoluție cu păstrarea completă a culorilor RGB/CMYK.",
  bg:"Да. Двигателят извлича точни векторни контури и слоеве с висока резолюция с пълно запазване на RGB/CMYK цветовете.",
  el:"Ναι. Ο κινητήρας εξάγει ακριβή διανυσματικά περιγράμματα και επίπεδα υψηλής ανάλυσης με πλήρη διατήρηση χρωμάτων RGB/CMYK.",
  sk:"Áno. Motor extrahuje presné vektorové obrysy a vrstvy vo vysokom rozlíšení s plným zachovaním farieb RGB/CMYK.",
  sl:"Da. Motor izlušči natančne vektorske obrise in visokoresolucijske plasti s polnim ohranjanjem barv RGB/CMYK.",
  ru:"Да. Движок извлекает точные векторные контуры и слои высокого разрешения с полным сохранением цветов RGB/CMYK.",
  uk:"Так. Двигун витягує точні векторні контури та шари високої роздільності з повним збереженням кольорів RGB/CMYK.",
  lv:"Jā. Dzinējs iegūst precīzas vektoru kontūras un augstas izšķirtspējas slāņus ar pilnīgu RGB/CMYK krāsu saglabāšanu.",
  lt:"Taip. Variklis išgauna tikslias vektorines kontūras ir didelės raiškos sluoksnius su pilnu RGB/CMYK spalvų išsaugojimu.",
  tr:"Evet. Motor, tam RGB/CMYK renk korumasıyla kesin vektör hatlarını ve yüksek çözünürlüklü katmanları çıkarır.",
  ar:"نعم. يستخرج المحرك مخططات متجهة دقيقة وطبقات عالية الدقة مع الحفاظ الكامل على ألوان RGB/CMYK.",
  he:"כן. המנוע מחלץ קווי מתאר וקטוריים מדויקים ושכבות ברזולוציה גבוהה עם שימור מלא של צבעי RGB/CMYK.",
  hi:"हाँ। इंजन पूर्ण RGB/CMYK रंग संरक्षण के साथ सटीक वेक्टर रूपरेखा और उच्च-रिज़ॉल्यूशन लेयर्स निकालता है।",
  id:"Ya. Mesin mengekstrak garis vektor yang tepat dan lapisan resolusi tinggi dengan pelestarian warna RGB/CMYK penuh.",
  ms:"Ya. Enjin mengekstrak garis besar vektor yang tepat dan lapisan resolusi tinggi dengan pemeliharaan warna RGB/CMYK penuh.",
  th:"ใช่ เอ็นจิ้นสกัดเส้นขอบเวกเตอร์ที่แม่นยำและเลเยอร์ความละเอียดสูงพร้อมการรักษาสี RGB/CMYK อย่างสมบูรณ์",
  vi:"Có. Bộ xử lý trích xuất đường viền vector chính xác và lớp độ phân giải cao với bảo toàn màu RGB/CMYK đầy đủ.",
  fil:"Oo. Kinukuha ng engine ang eksaktong vector outlines at high-resolution layers na may buong RGB/CMYK color preservation.",
  ja:"はい。エンジンは正確なベクターアウトラインと高解像度レイヤーをRGB/CMYKカラーを完全に保持して抽出します。",
  ko:"네. 엔진은 정확한 벡터 윤곽선과 고해상도 레이어를 RGB/CMYK 색상을 완벽하게 보존하여 추출합니다.",
  "zh-CN":"是的。引擎提取精确的矢量轮廓和高分辨率图层，完整保留 RGB/CMYK 颜色。",
  "zh-TW":"是的。引擎提取精確的向量輪廓和高解析度圖層，完整保留 RGB/CMYK 色彩。"
};
const vectorQ3 = {
  en:"Are my proprietary artwork and graphics stored on any servers?",
  es:"¿Se almacenan mis diseños e ilustraciones en algún servidor?",
  "es-419":"¿Mis diseños y gráficos se almacenan en algún servidor?",
  de:"Werden meine Grafiken und Designs auf einem Server gespeichert?",
  fr:"Mes créations et graphiques sont-ils stockés sur un serveur ?",
  pt:"As minhas ilustrações e gráficos são armazenados em algum servidor?",
  "pt-BR":"Minhas ilustrações e gráficos são armazenados em algum servidor?",
  it:"Le mie illustrazioni e grafiche sono conservate su qualche server?",
  nl:"Worden mijn ontwerpen en afbeeldingen opgeslagen op een server?",
  ca:"Els meus dissenys i gràfics s'emmagatzemen en algun servidor?",
  sv:"Lagras mina design och grafik på någon server?",
  da:"Gemmes mine designs og grafik på nogen server?",
  fi:"Tallennetaanko suunnitelmani ja grafiikkani jollekin palvelimelle?",
  no:"Lagres designene og grafikken min på noen server?",
  pl:"Czy moje projekty i grafiki są przechowywane na jakimś serwerze?",
  cs:"Jsou mé návrhy a grafiky uloženy na nějakém serveru?",
  hu:"Az illusztrációim és grafikáim tárolódnak valamilyen szerveren?",
  ro:"Sunt ilustrațiile și grafica mea stocate pe vreun server?",
  bg:"Съхраняват ли се моите дизайни и графики на някакъв сървър?",
  el:"Αποθηκεύονται τα σχέδια και τα γραφικά μου σε κάποιον διακομιστή;",
  sk:"Sú moje návrhy a grafiky uložené na nejakom serveri?",
  sl:"Ali so moji dizajni in grafike shranjeni na katerem strežniku?",
  ru:"Хранятся ли мои иллюстрации и графика на каком-либо сервере?",
  uk:"Чи зберігаються мої ілюстрації та графіка на якомусь сервері?",
  lv:"Vai mani dizaini un grafika tiek glabāti kādā serverī?",
  lt:"Ar mano dizainai ir grafika saugomi kokiame nors serveryje?",
  tr:"Tasarımlarım ve grafiklerim herhangi bir sunucuda saklanıyor mu?",
  ar:"هل يتم تخزين تصاميمي ورسوماتي على أي خادم؟",
  he:"האם העיצובים והגרפיקות שלי מאוחסנים בשרת כלשהו?",
  hi:"क्या मेरे डिज़ाइन और ग्राफ़िक्स किसी सर्वर पर संग्रहीत हैं?",
  id:"Apakah desain dan grafik saya disimpan di server mana pun?",
  ms:"Adakah reka bentuk dan grafik saya disimpan di mana-mana pelayan?",
  th:"งานออกแบบและกราฟิกของฉันถูกจัดเก็บบนเซิร์ฟเวอร์ใดหรือไม่?",
  vi:"Thiết kế và đồ họa của tôi có được lưu trên bất kỳ máy chủ nào không?",
  fil:"Naka-store ba ang aking mga disenyo at graphics sa anumang server?",
  ja:"私のデザインやグラフィックスはサーバーに保存されますか？",
  ko:"내 디자인과 그래픽이 서버에 저장되나요?",
  "zh-CN":"我的设计和图形是否存储在任何服务器上？",
  "zh-TW":"我的設計和圖形是否存儲在任何伺服器上？"
};
const vectorA3 = {
  en:"No. All design files are converted locally in memory and discarded the moment you finish or close your browser tab.",
  es:"No. Todos los archivos de diseño se procesan localmente en memoria y se descartan al instante.",
  "es-419":"No. Todos los archivos se procesan localmente en memoria y se eliminan al cerrar la pestaña.",
  de:"Nein. Alle Designdateien werden lokal im Speicher konvertiert und beim Schließen des Tabs sofort gelöscht.",
  fr:"Non. Tous les fichiers de design sont convertis localement en mémoire et supprimés dès la fermeture de l'onglet.",
  pt:"Não. Todos os ficheiros são convertidos localmente na memória e descartados ao fechar o separador.",
  "pt-BR":"Não. Todos os arquivos são convertidos localmente na memória e descartados ao fechar a aba.",
  it:"No. Tutti i file vengono convertiti localmente in memoria e scartati alla chiusura della scheda.",
  nl:"Nee. Alle bestanden worden lokaal in het geheugen geconverteerd en verwijderd bij het sluiten van het tabblad.",
  ca:"No. Tots els fitxers es converteixen localment en memòria i es descarten en tancar la pestanya.",
  sv:"Nej. Alla designfiler konverteras lokalt i minnet och raderas när du stänger fliken.",
  da:"Nej. Alle designfiler konverteres lokalt i hukommelsen og slettes når du lukker fanen.",
  fi:"Ei. Kaikki tiedostot muunnetaan paikallisesti muistissa ja hävitetään välilehden sulkemisen yhteydessä.",
  no:"Nei. Alle designfiler konverteres lokalt i minnet og slettes når du lukker fanen.",
  pl:"Nie. Wszystkie pliki są konwertowane lokalnie w pamięci i usuwane po zamknięciu karty.",
  cs:"Ne. Všechny soubory jsou převedeny lokálně v paměti a smazány při zavření karty.",
  hu:"Nem. Minden fájl helyben, a memóriában konvertálódik és a lap bezárásakor azonnal törlődik.",
  ro:"Nu. Toate fișierele sunt convertite local în memorie și șterse la închiderea filei.",
  bg:"Не. Всички файлове се конвертират локално в паметта и се изтриват при затваряне на раздела.",
  el:"Όχι. Όλα τα αρχεία μετατρέπονται τοπικά στη μνήμη και διαγράφονται με το κλείσιμο της καρτέλας.",
  sk:"Nie. Všetky súbory sa konvertujú lokálne v pamäti a zmažú pri zatvorení karty.",
  sl:"Ne. Vse datoteke se pretvorijo lokalno v pomnilniku in izbrišejo ob zaprtju zavihka.",
  ru:"Нет. Все файлы конвертируются локально в памяти и удаляются при закрытии вкладки.",
  uk:"Ні. Всі файли конвертуються локально в пам'яті і видаляються при закритті вкладки.",
  lv:"Nē. Visi faili tiek konvertēti lokāli atmiņā un dzēsti, aizverot cilni.",
  lt:"Ne. Visi failai konvertuojami vietoje atmintyje ir ištrinami uždarius skirtuką.",
  tr:"Hayır. Tüm dosyalar bellekte yerel olarak dönüştürülür ve sekmeyi kapattığınızda anında silinir.",
  ar:"لا. تتم معالجة جميع الملفات محلياً في الذاكرة وحذفها فور إغلاق علامة التبويب.",
  he:"לא. כל הקבצים מומרים מקומית בזיכרון ונמחקים ברגע שסוגרים את הלשונית.",
  hi:"नहीं। सभी फ़ाइलें स्थानीय रूप से मेमोरी में कन्वर्ट होती हैं और टैब बंद करने पर तुरंत हटा दी जाती हैं।",
  id:"Tidak. Semua file dikonversi secara lokal di memori dan dihapus saat Anda menutup tab.",
  ms:"Tidak. Semua fail ditukar secara setempat dalam memori dan dipadamkan apabila anda menutup tab.",
  th:"ไม่ ไฟล์ทั้งหมดถูกแปลงในเครื่องในหน่วยความจำและถูกลบเมื่อคุณปิดแท็บ",
  vi:"Không. Tất cả file được chuyển đổi cục bộ trong bộ nhớ và bị xóa khi bạn đóng tab.",
  fil:"Hindi. Lahat ng file ay kino-convert nang lokal sa memory at tinatanggal kapag isinara mo ang tab.",
  ja:"いいえ。すべてのファイルはメモリ内でローカルに変換され、タブを閉じると即座に削除されます。",
  ko:"아니요. 모든 파일은 메모리에서 로컬로 변환되며 탭을 닫으면 즉시 삭제됩니다.",
  "zh-CN":"不会。所有文件在内存中本地转换，关闭标签页后立即删除。",
  "zh-TW":"不會。所有檔案在記憶體中本地轉換，關閉分頁後立即刪除。"
};

// Now build all families using the same pattern
for (const loc of LOCALES) {
  set("vector", loc, [
    vectorQ1[loc]||vectorQ1.en, vectorA1[loc]||vectorA1.en,
    vectorQ2[loc]||vectorQ2.en, vectorA2[loc]||vectorA2.en,
    vectorQ3[loc]||vectorQ3.en, vectorA3[loc]||vectorA3.en
  ]);
}

// ═══ For remaining 5 families, use the same locale-keyed dict approach ═══
// I'll define a helper that takes English Q/A and translation maps

// SUBTITLES
const subData = {
  en:["What is the difference between SRT and WebVTT subtitles?","SRT uses comma-separated millisecond timestamps (00:00:01,000) and is standard for media players. WebVTT uses period timestamps (00:00:01.000) and supports CSS styling for HTML5 web video.","Will timecodes and subtitle cue numbers be kept in perfect sync?","Yes. FileKit parses microsecond timestamps and reformats syntax with zero timing drift across all media players.","How do I use the converted subtitles on YouTube or video players?","Download the converted .vtt or .srt file and upload it directly in YouTube Studio, Vimeo, or your video player settings."],
  es:["¿Cuál es la diferencia entre los subtítulos SRT y WebVTT?","SRT utiliza marcas de tiempo con comas (00:00:01,000) para reproductores de medios. WebVTT utiliza puntos (00:00:01.000) y admite estilos CSS para video web HTML5.","¿Se mantienen perfectamente sincronizados los códigos de tiempo?","Sí. FileKit analiza marcas de tiempo con precisión de microsegundos sin desviación temporal.","¿Cómo uso los subtítulos convertidos en YouTube o reproductores?","Descarga el archivo .vtt o .srt y súbelo directamente en YouTube Studio, Vimeo o tu reproductor."],
  "es-419":["¿Cuál es la diferencia entre subtítulos SRT y WebVTT?","SRT usa marcas de tiempo con comas (00:00:01,000) para reproductores. WebVTT usa puntos (00:00:01.000) y soporta estilos CSS para video HTML5.","¿Los códigos de tiempo se mantienen sincronizados?","Sí. FileKit analiza marcas de tiempo con precisión de microsegundos sin desfase temporal.","¿Cómo uso los subtítulos convertidos en YouTube?","Descarga el archivo .vtt o .srt y cárgalo directamente en YouTube Studio o tu reproductor de video."],
  de:["Was ist der Unterschied zwischen SRT- und WebVTT-Untertiteln?","SRT verwendet kommagetrennte Millisekunden-Zeitstempel (00:00:01,000) für Mediaplayer. WebVTT verwendet Punkt-Zeitstempel (00:00:01.000) und unterstützt CSS-Styling für HTML5-Video.","Bleiben Timecodes und Untertitelnummern perfekt synchronisiert?","Ja. FileKit analysiert Zeitstempel mit Mikrosekunden-Präzision ohne zeitliche Abweichung.","Wie verwende ich die konvertierten Untertitel auf YouTube?","Laden Sie die konvertierte .vtt- oder .srt-Datei herunter und laden Sie sie direkt in YouTube Studio hoch."],
  fr:["Quelle est la différence entre les sous-titres SRT et WebVTT ?","SRT utilise des horodatages séparés par des virgules (00:00:01,000) pour les lecteurs multimédias. WebVTT utilise des points (00:00:01.000) et prend en charge le style CSS pour la vidéo HTML5.","Les timecodes et les numéros de sous-titres restent-ils parfaitement synchronisés ?","Oui. FileKit analyse les horodatages avec une précision microseconde sans dérive temporelle.","Comment utiliser les sous-titres convertis sur YouTube ?","Téléchargez le fichier .vtt ou .srt converti et importez-le directement dans YouTube Studio ou votre lecteur vidéo."],
  pt:["Qual é a diferença entre legendas SRT e WebVTT?","SRT usa marcas de tempo com vírgulas (00:00:01,000) para leitores multimédia. WebVTT usa pontos (00:00:01.000) e suporta estilos CSS para vídeo HTML5.","Os timecodes e números de legenda mantêm-se sincronizados?","Sim. O FileKit analisa marcas de tempo com precisão de microssegundos sem desvio temporal.","Como uso as legendas convertidas no YouTube?","Descarregue o ficheiro .vtt ou .srt e carregue-o diretamente no YouTube Studio ou no seu leitor de vídeo."],
  "pt-BR":["Qual é a diferença entre legendas SRT e WebVTT?","SRT usa carimbos de tempo com vírgulas (00:00:01,000) para players de mídia. WebVTT usa pontos (00:00:01.000) e suporta estilos CSS para vídeo HTML5.","Os timecodes e números de legenda se mantêm sincronizados?","Sim. O FileKit analisa carimbos de tempo com precisão de microssegundos sem desvio temporal.","Como uso as legendas convertidas no YouTube?","Baixe o arquivo .vtt ou .srt convertido e faça upload direto no YouTube Studio ou no seu player de vídeo."],
  it:["Qual è la differenza tra i sottotitoli SRT e WebVTT?","SRT utilizza timestamp separati da virgole (00:00:01,000) per i lettori multimediali. WebVTT utilizza punti (00:00:01.000) e supporta lo stile CSS per i video HTML5.","I timecode e i numeri dei sottotitoli restano perfettamente sincronizzati?","Sì. FileKit analizza i timestamp con precisione al microsecondo senza alcuna deriva temporale.","Come utilizzo i sottotitoli convertiti su YouTube?","Scarica il file .vtt o .srt e caricalo direttamente su YouTube Studio o nelle impostazioni del tuo lettore video."],
  nl:["Wat is het verschil tussen SRT- en WebVTT-ondertitels?","SRT gebruikt tijdstempels met komma's (00:00:01,000) voor mediaspelers. WebVTT gebruikt punten (00:00:01.000) en ondersteunt CSS-styling voor HTML5-video.","Blijven tijdcodes en ondertitelnummers perfect gesynchroniseerd?","Ja. FileKit analyseert tijdstempels met microseconde-precisie zonder tijdafwijking.","Hoe gebruik ik de geconverteerde ondertitels op YouTube?","Download het geconverteerde .vtt- of .srt-bestand en upload het rechtstreeks in YouTube Studio."],
  ca:["Quina diferència hi ha entre subtítols SRT i WebVTT?","SRT utilitza marques de temps amb comes (00:00:01,000) per a reproductors. WebVTT utilitza punts (00:00:01.000) i admet estils CSS per a vídeo HTML5.","Es mantenen sincronitzats els codis de temps?","Sí. FileKit analitza marques de temps amb precisió de microsegons sense desviació temporal.","Com utilitzo els subtítols convertits a YouTube?","Descarrega el fitxer .vtt o .srt i puja'l directament a YouTube Studio o al teu reproductor de vídeo."],
  sv:["Vad är skillnaden mellan SRT- och WebVTT-undertexter?","SRT använder kommaseparerade millisekundstidsstämplar (00:00:01,000) för mediaspelare. WebVTT använder punkttidsstämplar (00:00:01.000) och stödjer CSS-styling för HTML5-video.","Hålls tidkoder och undertextnummer perfekt synkroniserade?","Ja. FileKit analyserar tidsstämplar med mikrosekundsprecision utan tidsdrift.","Hur använder jag de konverterade undertexterna på YouTube?","Ladda ner den konverterade .vtt- eller .srt-filen och ladda upp den direkt i YouTube Studio."],
  da:["Hvad er forskellen mellem SRT- og WebVTT-undertekster?","SRT bruger kommaseparerede millisekund-tidsstempler (00:00:01,000) til medieafspillere. WebVTT bruger punkttidsstempler (00:00:01.000) og understøtter CSS-styling til HTML5-video.","Holdes tidskoder og undertekstnumre perfekt synkroniseret?","Ja. FileKit analyserer tidsstempler med mikrosekundpræcision uden tidsdrift.","Hvordan bruger jeg de konverterede undertekster på YouTube?","Download den konverterede .vtt- eller .srt-fil og upload den direkte i YouTube Studio."],
  fi:["Mitä eroa on SRT- ja WebVTT-tekstityksillä?","SRT käyttää pilkuilla erotettuja millisekuntien aikaleimoja (00:00:01,000) mediasoittimille. WebVTT käyttää pisteaikaleimoja (00:00:01.000) ja tukee CSS-tyylejä HTML5-videolle.","Pysyvätkö aikakoodit ja tekstityksen vihjeet täydellisesti synkronoituina?","Kyllä. FileKit jäsentää aikaleimoja mikrosekunnin tarkkuudella ilman aikapoikkeamaa.","Miten käytän muunnettuja tekstityksiä YouTubessa?","Lataa muunnettu .vtt- tai .srt-tiedosto ja lataa se suoraan YouTube Studioon."],
  no:["Hva er forskjellen mellom SRT- og WebVTT-undertekster?","SRT bruker kommaseparerte millisekund-tidsstempler (00:00:01,000) for mediespillere. WebVTT bruker punkttidsstempler (00:00:01.000) og støtter CSS-styling for HTML5-video.","Holdes tidskoder og undertekstnumre perfekt synkronisert?","Ja. FileKit analyserer tidsstempler med mikrosekundpresisjon uten tidsavvik.","Hvordan bruker jeg de konverterte undertekstene på YouTube?","Last ned den konverterte .vtt- eller .srt-filen og last den opp direkte i YouTube Studio."],
  pl:["Jaka jest różnica między napisami SRT a WebVTT?","SRT używa znaczników czasu z przecinkami (00:00:01,000) dla odtwarzaczy multimedialnych. WebVTT używa kropek (00:00:01.000) i obsługuje stylowanie CSS dla wideo HTML5.","Czy kody czasowe i numery napisów pozostają idealnie zsynchronizowane?","Tak. FileKit analizuje znaczniki czasu z dokładnością do mikrosekund bez dryfu czasowego.","Jak używać przekonwertowanych napisów na YouTube?","Pobierz przekonwertowany plik .vtt lub .srt i prześlij go bezpośrednio w YouTube Studio."],
  cs:["Jaký je rozdíl mezi titulky SRT a WebVTT?","SRT používá časová razítka oddělená čárkami (00:00:01,000) pro přehrávače médií. WebVTT používá tečky (00:00:01.000) a podporuje stylování CSS pro HTML5 video.","Zůstanou časové kódy a čísla titulků dokonale synchronizované?","Ano. FileKit analyzuje časová razítka s přesností na mikrosekundy bez časového posunu.","Jak použiji převedené titulky na YouTube?","Stáhněte si převedený soubor .vtt nebo .srt a nahrajte jej přímo v YouTube Studiu."],
  hu:["Mi a különbség az SRT és a WebVTT feliratok között?","Az SRT vesszővel elválasztott ezredmásodperces időbélyegeket (00:00:01,000) használ médialejátszókhoz. A WebVTT pontot (00:00:01.000) használ és támogatja a CSS-stílust HTML5 videóhoz.","Az időkódok és feliratszámok tökéletesen szinkronban maradnak?","Igen. A FileKit mikroszekundum pontossággal elemzi az időbélyegeket időeltolódás nélkül.","Hogyan használhatom a konvertált feliratokat a YouTube-on?","Töltse le a konvertált .vtt vagy .srt fájlt és töltse fel közvetlenül a YouTube Studióba."],
  ro:["Care este diferența dintre subtitrările SRT și WebVTT?","SRT folosește marcaje de timp separate prin virgulă (00:00:01,000) pentru playere media. WebVTT folosește puncte (00:00:01.000) și suportă stiluri CSS pentru video HTML5.","Codurile de timp și numerele de subtitrare rămân perfect sincronizate?","Da. FileKit analizează marcajele de timp cu precizie de microsecundă fără decalaj temporal.","Cum folosesc subtitrările convertite pe YouTube?","Descărcați fișierul .vtt sau .srt convertit și încărcați-l direct în YouTube Studio."],
  bg:["Каква е разликата между субтитрите SRT и WebVTT?","SRT използва времеви маркери, разделени със запетаи (00:00:01,000), за медийни плейъри. WebVTT използва точки (00:00:01.000) и поддържа CSS стилизиране за HTML5 видео.","Таймкодовете и номерата на субтитрите остават ли перфектно синхронизирани?","Да. FileKit анализира времеви маркери с точност до микросекунда без времеви отклонения.","Как да използвам конвертираните субтитри в YouTube?","Изтеглете конвертирания .vtt или .srt файл и го качете директно в YouTube Studio."],
  el:["Ποια είναι η διαφορά μεταξύ υποτίτλων SRT και WebVTT;","Το SRT χρησιμοποιεί χρονοσημάνσεις χιλιοστών του δευτερολέπτου (00:00:01,000) για media players. Το WebVTT χρησιμοποιεί τελείες (00:00:01.000) και υποστηρίζει CSS για βίντεο HTML5.","Οι κωδικοί χρόνου και οι αριθμοί υποτίτλων παραμένουν σε τέλειο συγχρονισμό;","Ναι. Το FileKit αναλύει χρονοσημάνσεις με ακρίβεια μικροδευτερολέπτου χωρίς χρονική ολίσθηση.","Πώς χρησιμοποιώ τους μετατραπέντες υπότιτλους στο YouTube;","Κατεβάστε το αρχείο .vtt ή .srt και ανεβάστε το απευθείας στο YouTube Studio."],
  sk:["Aký je rozdiel medzi titulkami SRT a WebVTT?","SRT používa časové pečiatky oddelené čiarkami (00:00:01,000) pre prehrávače médií. WebVTT používa bodky (00:00:01.000) a podporuje CSS štýly pre HTML5 video.","Zostanú časové kódy a čísla titulkov dokonale synchronizované?","Áno. FileKit analyzuje časové pečiatky s presnosťou na mikrosekundy bez časového posunu.","Ako použijem prevedené titulky na YouTube?","Stiahnite si prevedený súbor .vtt alebo .srt a nahrajte ho priamo v YouTube Studiu."],
  sl:["Kakšna je razlika med podnapisi SRT in WebVTT?","SRT uporablja časovne žige, ločene z vejicami (00:00:01,000), za predvajalnike. WebVTT uporablja pike (00:00:01.000) in podpira CSS-oblikovanje za HTML5 video.","Ali časovne kode in številke podnapisov ostanejo popolnoma sinhronizirane?","Da. FileKit razčlenjuje časovne žige z natančnostjo mikrosekund brez časovnega zamika.","Kako uporabim pretvorjene podnapise na YouTube?","Prenesite pretvorjeno datoteko .vtt ali .srt in jo naložite neposredno v YouTube Studio."],
  ru:["В чём разница между субтитрами SRT и WebVTT?","SRT использует временные метки с запятыми (00:00:01,000) для медиаплееров. WebVTT использует точки (00:00:01.000) и поддерживает CSS-стили для HTML5-видео.","Сохраняются ли таймкоды и номера субтитров в идеальной синхронизации?","Да. FileKit анализирует временные метки с точностью до микросекунды без временного дрейфа.","Как использовать конвертированные субтитры на YouTube?","Скачайте конвертированный файл .vtt или .srt и загрузите его напрямую в YouTube Студию."],
  uk:["Яка різниця між субтитрами SRT та WebVTT?","SRT використовує мітки часу з комами (00:00:01,000) для медіаплеєрів. WebVTT використовує крапки (00:00:01.000) та підтримує CSS-стилі для HTML5-відео.","Чи зберігаються таймкоди та номери субтитрів у ідеальній синхронізації?","Так. FileKit аналізує мітки часу з точністю до мікросекунди без часового дрейфу.","Як використовувати конвертовані субтитри на YouTube?","Завантажте конвертований файл .vtt або .srt і завантажте його безпосередньо в YouTube Студію."],
  lv:["Kāda ir atšķirība starp SRT un WebVTT subtitriem?","SRT izmanto ar komatu atdalītus milisekunžu laika zīmogus (00:00:01,000) multivides atskaņotājiem. WebVTT izmanto punktus (00:00:01.000) un atbalsta CSS stilus HTML5 video.","Vai laika kodi un subtitru numuri paliek perfekti sinhronizēti?","Jā. FileKit analizē laika zīmogus ar mikrosekunžu precizitāti bez laika novirzes.","Kā lietot konvertētos subtitrus YouTube?","Lejupielādējiet konvertēto .vtt vai .srt failu un augšupielādējiet to tieši YouTube Studio."],
  lt:["Koks skirtumas tarp SRT ir WebVTT subtitrų?","SRT naudoja kableliais atskirtus milisekundžių laiko žymes (00:00:01,000) medijos grotuvams. WebVTT naudoja taškus (00:00:01.000) ir palaiko CSS stilius HTML5 vaizdo įrašams.","Ar laiko kodai ir subtitrų numeriai išlieka puikiai sinchronizuoti?","Taip. FileKit analizuoja laiko žymes su mikrosekundžių tikslumu be laiko nukrypimo.","Kaip naudoti konvertuotus subtitrus YouTube?","Atsisiųskite konvertuotą .vtt ar .srt failą ir įkelkite jį tiesiai į YouTube Studio."],
  tr:["SRT ve WebVTT altyazıları arasındaki fark nedir?","SRT, medya oynatıcılar için virgülle ayrılmış milisaniye zaman damgaları (00:00:01,000) kullanır. WebVTT, nokta zaman damgaları (00:00:01.000) kullanır ve HTML5 video için CSS stillerini destekler.","Zaman kodları ve altyazı numaraları mükemmel senkronize kalır mı?","Evet. FileKit, zaman damgalarını mikrosaniye hassasiyetiyle ayrıştırır ve zaman kayması olmadan yeniden biçimlendirir.","Dönüştürülen altyazıları YouTube'da nasıl kullanırım?","Dönüştürülen .vtt veya .srt dosyasını indirin ve doğrudan YouTube Studio'ya yükleyin."],
  ar:["ما الفرق بين ترجمات SRT وWebVTT؟","يستخدم SRT طوابع زمنية بالفواصل (00:00:01,000) لمشغلات الوسائط. يستخدم WebVTT النقاط (00:00:01.000) ويدعم أنماط CSS لفيديو HTML5.","هل تبقى رموز الوقت وأرقام الترجمة متزامنة تماماً؟","نعم. يحلل FileKit الطوابع الزمنية بدقة الميكروثانية بدون انحراف زمني.","كيف أستخدم الترجمات المحولة على YouTube؟","قم بتنزيل ملف .vtt أو .srt المحول وارفعه مباشرة في YouTube Studio."],
  he:["מה ההבדל בין כתוביות SRT ו-WebVTT?","SRT משתמש בחותמות זמן מופרדות בפסיקים (00:00:01,000) לנגני מדיה. WebVTT משתמש בנקודות (00:00:01.000) ותומך בעיצוב CSS לווידאו HTML5.","האם קודי הזמן ומספרי הכתוביות נשמרים בסנכרון מושלם?","כן. FileKit מנתח חותמות זמן בדיוק מיקרו-שנייה ללא סחף זמן.","כיצד להשתמש בכתוביות שהומרו ב-YouTube?","הורידו את קובץ ה-.vtt או .srt והעלו אותו ישירות ב-YouTube Studio."],
  hi:["SRT और WebVTT सबटाइटल में क्या अंतर है?","SRT मीडिया प्लेयर्स के लिए कॉमा से अलग किए गए मिलीसेकंड टाइमस्टैम्प (00:00:01,000) का उपयोग करता है। WebVTT बिंदु (00:00:01.000) का उपयोग करता है और HTML5 वीडियो के लिए CSS स्टाइलिंग का समर्थन करता है।","क्या टाइमकोड और सबटाइटल नंबर पूरी तरह से सिंक में रहते हैं?","हाँ। FileKit माइक्रोसेकंड सटीकता के साथ टाइमस्टैम्प का विश्लेषण करता है बिना किसी समय विचलन के।","YouTube पर कन्वर्ट किए गए सबटाइटल का उपयोग कैसे करें?","कन्वर्ट की गई .vtt या .srt फ़ाइल डाउनलोड करें और YouTube Studio में सीधे अपलोड करें।"],
  id:["Apa perbedaan antara subtitle SRT dan WebVTT?","SRT menggunakan timestamp milidetik yang dipisahkan koma (00:00:01,000) untuk pemutar media. WebVTT menggunakan titik (00:00:01.000) dan mendukung gaya CSS untuk video HTML5.","Apakah timecode dan nomor subtitle tetap sinkron sempurna?","Ya. FileKit mengurai timestamp dengan presisi mikrodetik tanpa penyimpangan waktu.","Bagaimana cara menggunakan subtitle yang dikonversi di YouTube?","Unduh file .vtt atau .srt yang dikonversi dan unggah langsung di YouTube Studio."],
  ms:["Apakah perbezaan antara sari kata SRT dan WebVTT?","SRT menggunakan cap masa milisaat dipisahkan koma (00:00:01,000) untuk pemain media. WebVTT menggunakan titik (00:00:01.000) dan menyokong gaya CSS untuk video HTML5.","Adakah kod masa dan nombor sari kata kekal sinkron sempurna?","Ya. FileKit mengurai cap masa dengan ketepatan mikrosaat tanpa hanyutan masa.","Bagaimana cara menggunakan sari kata yang ditukar di YouTube?","Muat turun fail .vtt atau .srt dan muat naik terus dalam YouTube Studio."],
  th:["ความแตกต่างระหว่างคำบรรยาย SRT และ WebVTT คืออะไร?","SRT ใช้ประทับเวลามิลลิวินาทีคั่นด้วยจุลภาค (00:00:01,000) สำหรับเครื่องเล่นสื่อ WebVTT ใช้จุด (00:00:01.000) และรองรับ CSS สำหรับวิดีโอ HTML5","รหัสเวลาและหมายเลขคำบรรยายยังคงซิงค์สมบูรณ์แบบหรือไม่?","ใช่ FileKit วิเคราะห์ประทับเวลาด้วยความแม่นยำระดับไมโครวินาทีโดยไม่มีการเบี่ยงเบนเวลา","จะใช้คำบรรยายที่แปลงแล้วบน YouTube ได้อย่างไร?","ดาวน์โหลดไฟล์ .vtt หรือ .srt และอัปโหลดโดยตรงใน YouTube Studio"],
  vi:["Sự khác biệt giữa phụ đề SRT và WebVTT là gì?","SRT sử dụng dấu thời gian phân cách bằng dấu phẩy (00:00:01,000) cho trình phát media. WebVTT sử dụng dấu chấm (00:00:01.000) và hỗ trợ CSS cho video HTML5.","Mã thời gian và số thứ tự phụ đề có được giữ đồng bộ hoàn hảo không?","Có. FileKit phân tích dấu thời gian với độ chính xác micro giây mà không có độ trệ thời gian.","Làm thế nào để sử dụng phụ đề đã chuyển đổi trên YouTube?","Tải file .vtt hoặc .srt đã chuyển đổi và tải lên trực tiếp trong YouTube Studio."],
  fil:["Ano ang pagkakaiba ng SRT at WebVTT subtitles?","Gumagamit ang SRT ng comma-separated millisecond timestamps (00:00:01,000) para sa media players. Gumagamit ang WebVTT ng period (00:00:01.000) at sumusuporta ng CSS styling para sa HTML5 video.","Nananatili bang perfectly synced ang timecodes at subtitle numbers?","Oo. Bina-parse ng FileKit ang timestamps na may microsecond na katumpakan nang walang timing drift.","Paano gamitin ang converted subtitles sa YouTube?","I-download ang converted .vtt o .srt file at i-upload ito direkta sa YouTube Studio."],
  ja:["SRTとWebVTT字幕の違いは何ですか？","SRTはメディアプレーヤー向けにカンマ区切りのミリ秒タイムスタンプ（00:00:01,000）を使用します。WebVTTはピリオド（00:00:01.000）を使用し、HTML5ビデオ向けのCSSスタイリングをサポートします。","タイムコードと字幕番号は完全に同期されますか？","はい。FileKitはマイクロ秒精度でタイムスタンプを解析し、時間のずれなく再フォーマットします。","変換した字幕をYouTubeで使用するにはどうすればよいですか？","変換された.vttまたは.srtファイルをダウンロードし、YouTube Studioに直接アップロードしてください。"],
  ko:["SRT와 WebVTT 자막의 차이점은 무엇인가요?","SRT는 미디어 플레이어용으로 쉼표로 구분된 밀리초 타임스탬프(00:00:01,000)를 사용합니다. WebVTT는 마침표(00:00:01.000)를 사용하며 HTML5 비디오용 CSS 스타일링을 지원합니다.","타임코드와 자막 번호가 완벽하게 동기화 상태를 유지하나요?","네. FileKit은 마이크로초 정밀도로 타임스탬프를 분석하며 타이밍 드리프트가 없습니다.","변환된 자막을 YouTube에서 어떻게 사용하나요?","변환된 .vtt 또는 .srt 파일을 다운로드하여 YouTube 스튜디오에 직접 업로드하세요."],
  "zh-CN":["SRT 和 WebVTT 字幕有什么区别？","SRT 使用逗号分隔的毫秒时间戳（00:00:01,000）适用于媒体播放器。WebVTT 使用句点（00:00:01.000）并支持 HTML5 视频的 CSS 样式。","时间码和字幕编号能保持完美同步吗？","是的。FileKit 以微秒精度解析时间戳，无时间偏移。","如何在 YouTube 上使用转换后的字幕？","下载转换后的 .vtt 或 .srt 文件，直接上传到 YouTube Studio。"],
  "zh-TW":["SRT 和 WebVTT 字幕有什麼區別？","SRT 使用逗號分隔的毫秒時間戳（00:00:01,000）適用於媒體播放器。WebVTT 使用句點（00:00:01.000）並支援 HTML5 影片的 CSS 樣式。","時間碼和字幕編號能保持完美同步嗎？","是的。FileKit 以微秒精度解析時間戳，無時間偏移。","如何在 YouTube 上使用轉換後的字幕？","下載轉換後的 .vtt 或 .srt 檔案，直接上傳到 YouTube Studio。"]
};
for (const [loc, qa] of Object.entries(subData)) set("subtitles", loc, qa);

// APPLE
const appleData = {
  en:["How do I open Apple Pages, Numbers, or Keynote files on Windows or Android?","Simply upload your .pages, .numbers, or .key file to FileKit to convert it into universally compatible PDF, Word (DOCX), or Excel (XLSX) formats.","Will Apple fonts, mathematical formulas, and spreadsheet tables stay intact?","Yes. The engine converts typography, cell formatting, formulas, and slide transitions with pixel-perfect visual fidelity.","Do I need an iCloud account or an Apple device to convert iWork files?","No. FileKit works on any device and modern web browser with zero Apple accounts or cloud logins required."],
  es:["¿Cómo abro archivos de Apple Pages, Numbers o Keynote en Windows o Android?","Sube tu archivo .pages, .numbers o .key a FileKit para convertirlo a formatos universales como PDF, Word (DOCX) o Excel (XLSX).","¿Se mantienen intactas las fuentes, fórmulas y tablas?","Sí. El motor convierte tipografías, formatos de celda, fórmulas y diapositivas con total fidelidad visual.","¿Necesito una cuenta de iCloud o un dispositivo Apple?","No. FileKit funciona en cualquier dispositivo y navegador moderno sin necesidad de cuentas de Apple."],
  "es-419":["¿Cómo abro archivos de Apple Pages, Numbers o Keynote en Windows o Android?","Carga tu archivo .pages, .numbers o .key en FileKit para convertirlo a PDF, Word (DOCX) o Excel (XLSX).","¿Las fuentes, fórmulas y tablas se mantienen intactas?","Sí. El motor convierte tipografías, formato de celdas, fórmulas y transiciones con fidelidad visual total.","¿Necesito cuenta de iCloud o dispositivo Apple?","No. FileKit funciona en cualquier dispositivo y navegador moderno sin cuentas de Apple."],
  de:["Wie öffne ich Apple Pages-, Numbers- oder Keynote-Dateien unter Windows oder Android?","Laden Sie Ihre .pages-, .numbers- oder .key-Datei in FileKit hoch, um sie in universelle Formate wie PDF, Word (DOCX) oder Excel (XLSX) zu konvertieren.","Bleiben Apple-Schriftarten, Formeln und Tabellen erhalten?","Ja. Die Engine konvertiert Typografie, Zellformatierung, Formeln und Folienübergänge mit pixelgenauer Wiedergabe.","Benötige ich ein iCloud-Konto oder ein Apple-Gerät?","Nein. FileKit funktioniert auf jedem Gerät und in jedem modernen Browser ohne Apple-Konten."],
  fr:["Comment ouvrir des fichiers Apple Pages, Numbers ou Keynote sur Windows ou Android ?","Importez votre fichier .pages, .numbers ou .key dans FileKit pour le convertir en PDF, Word (DOCX) ou Excel (XLSX).","Les polices Apple, formules et tableaux restent-ils intacts ?","Oui. Le moteur convertit la typographie, le formatage des cellules et les transitions avec une fidélité visuelle parfaite.","Ai-je besoin d'un compte iCloud ou d'un appareil Apple ?","Non. FileKit fonctionne sur tout appareil et navigateur moderne sans compte Apple requis."],
  pt:["Como abro ficheiros Apple Pages, Numbers ou Keynote no Windows ou Android?","Carregue o seu ficheiro .pages, .numbers ou .key no FileKit para o converter em PDF, Word (DOCX) ou Excel (XLSX).","As fontes Apple, fórmulas e tabelas mantêm-se intactas?","Sim. O motor converte tipografia, formatação de células e transições com fidelidade visual perfeita.","Preciso de uma conta iCloud ou dispositivo Apple?","Não. O FileKit funciona em qualquer dispositivo e navegador moderno sem contas Apple."],
  "pt-BR":["Como abro arquivos Apple Pages, Numbers ou Keynote no Windows ou Android?","Carregue seu arquivo .pages, .numbers ou .key no FileKit para convertê-lo em PDF, Word (DOCX) ou Excel (XLSX).","As fontes Apple, fórmulas e tabelas se mantêm intactas?","Sim. O motor converte tipografia, formatação de células e transições com fidelidade visual perfeita.","Preciso de conta iCloud ou dispositivo Apple?","Não. O FileKit funciona em qualquer dispositivo e navegador moderno sem contas Apple."],
  it:["Come apro i file Apple Pages, Numbers o Keynote su Windows o Android?","Carica il tuo file .pages, .numbers o .key su FileKit per convertirlo in PDF, Word (DOCX) o Excel (XLSX).","I font Apple, le formule e le tabelle restano intatti?","Sì. Il motore converte tipografia, formattazione celle e transizioni con fedeltà visiva perfetta.","Ho bisogno di un account iCloud o di un dispositivo Apple?","No. FileKit funziona su qualsiasi dispositivo e browser moderno senza account Apple."],
  nl:["Hoe open ik Apple Pages-, Numbers- of Keynote-bestanden op Windows of Android?","Upload uw .pages-, .numbers- of .key-bestand naar FileKit om het te converteren naar PDF, Word (DOCX) of Excel (XLSX).","Blijven Apple-lettertypen, formules en tabellen behouden?","Ja. De engine converteert typografie, celopmaak en overgangen met pixelperfecte visuele betrouwbaarheid.","Heb ik een iCloud-account of Apple-apparaat nodig?","Nee. FileKit werkt op elk apparaat en in elke moderne browser zonder Apple-accounts."],
  ca:["Com obro fitxers d'Apple Pages, Numbers o Keynote a Windows o Android?","Puja el teu fitxer .pages, .numbers o .key a FileKit per convertir-lo a PDF, Word (DOCX) o Excel (XLSX).","Es mantenen les fonts Apple, fórmules i taules?","Sí. El motor converteix tipografia, format de cel·les i transicions amb fidelitat visual perfecta.","Necessito un compte d'iCloud o un dispositiu Apple?","No. FileKit funciona en qualsevol dispositiu i navegador modern sense comptes d'Apple."],
  sv:["Hur öppnar jag Apple Pages-, Numbers- eller Keynote-filer på Windows eller Android?","Ladda upp din .pages-, .numbers- eller .key-fil till FileKit för att konvertera den till PDF, Word (DOCX) eller Excel (XLSX).","Bevaras Apple-typsnitt, formler och tabeller?","Ja. Motorn konverterar typografi, cellformatering och övergångar med pixelperfekt visuell trohet.","Behöver jag ett iCloud-konto eller en Apple-enhet?","Nej. FileKit fungerar på alla enheter och moderna webbläsare utan Apple-konton."],
  da:["Hvordan åbner jeg Apple Pages-, Numbers- eller Keynote-filer på Windows eller Android?","Upload din .pages-, .numbers- eller .key-fil til FileKit for at konvertere den til PDF, Word (DOCX) eller Excel (XLSX).","Bevares Apple-skrifttyper, formler og tabeller?","Ja. Motoren konverterer typografi, celleformatering og overgange med perfekt visuel gengivelse.","Har jeg brug for en iCloud-konto eller en Apple-enhed?","Nej. FileKit fungerer på enhver enhed og moderne browser uden Apple-konti."],
  fi:["Miten avaan Apple Pages-, Numbers- tai Keynote-tiedostoja Windowsilla tai Androidilla?","Lataa .pages-, .numbers- tai .key-tiedostosi FileKitiin muuntaaksesi sen PDF-, Word (DOCX)- tai Excel (XLSX) -muotoon.","Säilyvätkö Apple-fontit, kaavat ja taulukot?","Kyllä. Moottori muuntaa typografian, solumuotoilun ja siirtymät pikselitarkasti.","Tarvitsenko iCloud-tilin tai Apple-laitteen?","Ei. FileKit toimii millä tahansa laitteella ja nykyaikaisella selaimella ilman Apple-tilejä."],
  no:["Hvordan åpner jeg Apple Pages-, Numbers- eller Keynote-filer på Windows eller Android?","Last opp .pages-, .numbers- eller .key-filen din til FileKit for å konvertere den til PDF, Word (DOCX) eller Excel (XLSX).","Bevares Apple-skrifttyper, formler og tabeller?","Ja. Motoren konverterer typografi, celleformatering og overganger med pikselpresis visuell troskap.","Trenger jeg en iCloud-konto eller en Apple-enhet?","Nei. FileKit fungerer på alle enheter og moderne nettlesere uten Apple-kontoer."],
  pl:["Jak otworzyć pliki Apple Pages, Numbers lub Keynote na Windowsie lub Androidzie?","Prześlij plik .pages, .numbers lub .key do FileKit, aby przekonwertować go na PDF, Word (DOCX) lub Excel (XLSX).","Czy czcionki Apple, formuły i tabele są zachowane?","Tak. Silnik konwertuje typografię, formatowanie komórek i przejścia z idealną wiernością wizualną.","Czy potrzebuję konta iCloud lub urządzenia Apple?","Nie. FileKit działa na każdym urządzeniu i nowoczesnej przeglądarce bez kont Apple."],
  cs:["Jak otevřu soubory Apple Pages, Numbers nebo Keynote na Windows nebo Android?","Nahrajte svůj soubor .pages, .numbers nebo .key do FileKit a převeďte ho do formátu PDF, Word (DOCX) nebo Excel (XLSX).","Zachovají se písma Apple, vzorce a tabulky?","Ano. Motor převádí typografii, formátování buněk a přechody s dokonalou vizuální věrností.","Potřebuji účet iCloud nebo zařízení Apple?","Ne. FileKit funguje na jakémkoli zařízení a moderním prohlížeči bez účtů Apple."],
  hu:["Hogyan nyithatok meg Apple Pages, Numbers vagy Keynote fájlokat Windowson vagy Androidon?","Töltse fel .pages, .numbers vagy .key fájlját a FileKitbe PDF, Word (DOCX) vagy Excel (XLSX) formátumba konvertáláshoz.","Megmaradnak az Apple betűtípusok, képletek és táblázatok?","Igen. A motor pixelpontos vizuális hűséggel konvertálja a tipográfiát, cellaformázást és átmeneteket.","Szükségem van iCloud-fiókra vagy Apple-eszközre?","Nem. A FileKit bármilyen eszközön és modern böngészőben működik Apple-fiókok nélkül."],
  ro:["Cum deschid fișiere Apple Pages, Numbers sau Keynote pe Windows sau Android?","Încărcați fișierul .pages, .numbers sau .key în FileKit pentru a-l converti în PDF, Word (DOCX) sau Excel (XLSX).","Se păstrează fonturile Apple, formulele și tabelele?","Da. Motorul convertește tipografia, formatarea celulelor și tranzițiile cu fidelitate vizuală perfectă.","Am nevoie de un cont iCloud sau un dispozitiv Apple?","Nu. FileKit funcționează pe orice dispozitiv și browser modern fără conturi Apple."],
  bg:["Как да отворя файлове Apple Pages, Numbers или Keynote на Windows или Android?","Качете вашия .pages, .numbers или .key файл във FileKit, за да го конвертирате в PDF, Word (DOCX) или Excel (XLSX).","Запазват ли се шрифтовете на Apple, формулите и таблиците?","Да. Двигателят конвертира типографията, форматирането на клетките и преходите с перфектна визуална прецизност.","Имам ли нужда от iCloud акаунт или Apple устройство?","Не. FileKit работи на всяко устройство и модерен браузър без Apple акаунти."],
  el:["Πώς ανοίγω αρχεία Apple Pages, Numbers ή Keynote σε Windows ή Android;","Ανεβάστε το αρχείο .pages, .numbers ή .key στο FileKit για μετατροπή σε PDF, Word (DOCX) ή Excel (XLSX).","Διατηρούνται οι γραμματοσειρές Apple, οι τύποι και οι πίνακες;","Ναι. Ο κινητήρας μετατρέπει τυπογραφία, μορφοποίηση κελιών και μεταβάσεις με τέλεια οπτική πιστότητα.","Χρειάζομαι λογαριασμό iCloud ή συσκευή Apple;","Όχι. Το FileKit λειτουργεί σε οποιαδήποτε συσκευή και σύγχρονο browser χωρίς λογαριασμούς Apple."],
  sk:["Ako otvorím súbory Apple Pages, Numbers alebo Keynote na Windowse alebo Androide?","Nahrajte svoj súbor .pages, .numbers alebo .key do FileKit na konverziu do PDF, Word (DOCX) alebo Excel (XLSX).","Zachovajú sa písma Apple, vzorce a tabuľky?","Áno. Motor prevádza typografiu, formátovanie buniek a prechody s dokonalou vizuálnou vernosťou.","Potrebujem účet iCloud alebo zariadenie Apple?","Nie. FileKit funguje na akomkoľvek zariadení a modernom prehliadači bez účtov Apple."],
  sl:["Kako odpreti datoteke Apple Pages, Numbers ali Keynote v sistemu Windows ali Android?","Naložite datoteko .pages, .numbers ali .key v FileKit za pretvorbo v PDF, Word (DOCX) ali Excel (XLSX).","Ali se Applove pisave, formule in tabele ohranijo?","Da. Motor pretvori tipografijo, oblikovanje celic in prehode s popolno vizualno zvestobo.","Ali potrebujem račun iCloud ali napravo Apple?","Ne. FileKit deluje na kateri koli napravi in sodobnem brskalniku brez Apple računov."],
  ru:["Как открыть файлы Apple Pages, Numbers или Keynote на Windows или Android?","Загрузите файл .pages, .numbers или .key в FileKit для конвертации в PDF, Word (DOCX) или Excel (XLSX).","Сохраняются ли шрифты Apple, формулы и таблицы?","Да. Движок конвертирует типографику, форматирование ячеек и переходы с пиксельной точностью.","Нужен ли мне аккаунт iCloud или устройство Apple?","Нет. FileKit работает на любом устройстве и в любом современном браузере без аккаунтов Apple."],
  uk:["Як відкрити файли Apple Pages, Numbers або Keynote на Windows або Android?","Завантажте файл .pages, .numbers або .key у FileKit для конвертації в PDF, Word (DOCX) або Excel (XLSX).","Чи зберігаються шрифти Apple, формули та таблиці?","Так. Двигун конвертує типографіку, форматування комірок та переходи з піксельною точністю.","Чи потрібен мені обліковий запис iCloud або пристрій Apple?","Ні. FileKit працює на будь-якому пристрої та сучасному браузері без облікових записів Apple."],
  lv:["Kā atvērt Apple Pages, Numbers vai Keynote failus Windows vai Android ierīcē?","Augšupielādējiet .pages, .numbers vai .key failu FileKit, lai to pārvērstu PDF, Word (DOCX) vai Excel (XLSX) formātā.","Vai Apple fonti, formulas un tabulas tiek saglabātas?","Jā. Dzinējs pārveido tipogrāfiju, šūnu formatēšanu un pārejas ar perfektu vizuālo precizitāti.","Vai man ir nepieciešams iCloud konts vai Apple ierīce?","Nē. FileKit darbojas jebkurā ierīcē un modernā pārlūkprogrammā bez Apple kontiem."],
  lt:["Kaip atidaryti Apple Pages, Numbers ar Keynote failus Windows arba Android?","Įkelkite savo .pages, .numbers ar .key failą į FileKit, kad konvertuotumėte jį į PDF, Word (DOCX) ar Excel (XLSX).","Ar Apple šriftai, formulės ir lentelės išsaugomi?","Taip. Variklis konvertuoja tipografiją, langelių formatavimą ir perėjimus su pikselių tikslumu.","Ar man reikia iCloud paskyros arba Apple įrenginio?","Ne. FileKit veikia bet kuriame įrenginyje ir naršyklėje be Apple paskyrų."],
  tr:["Windows veya Android'de Apple Pages, Numbers veya Keynote dosyalarını nasıl açarım?",".pages, .numbers veya .key dosyanızı FileKit'e yükleyerek PDF, Word (DOCX) veya Excel (XLSX) formatına dönüştürün.","Apple yazı tipleri, formüller ve tablolar korunur mu?","Evet. Motor tipografiyi, hücre biçimlendirmesini ve geçişleri piksel mükemmelliğinde görsel sadakatle dönüştürür.","Bir iCloud hesabına veya Apple cihazına ihtiyacım var mı?","Hayır. FileKit herhangi bir cihazda ve modern tarayıcıda Apple hesabı olmadan çalışır."],
  ar:["كيف أفتح ملفات Apple Pages أو Numbers أو Keynote على Windows أو Android؟","ارفع ملفك .pages أو .numbers أو .key إلى FileKit لتحويله إلى PDF أو Word (DOCX) أو Excel (XLSX).","هل تبقى خطوط Apple والصيغ والجداول سليمة؟","نعم. يحول المحرك الخطوط وتنسيق الخلايا والانتقالات بدقة بصرية مثالية.","هل أحتاج حساب iCloud أو جهاز Apple؟","لا. يعمل FileKit على أي جهاز ومتصفح حديث بدون حسابات Apple."],
  he:["כיצד לפתוח קבצי Apple Pages, Numbers או Keynote ב-Windows או Android?","העלו את קובץ ה-.pages, .numbers או .key ל-FileKit כדי להמירו ל-PDF, Word (DOCX) או Excel (XLSX).","האם גופני Apple, נוסחאות וטבלאות נשמרים?","כן. המנוע ממיר טיפוגרפיה, עיצוב תאים ומעברים בנאמנות חזותית מושלמת.","האם אני צריך חשבון iCloud או מכשיר Apple?","לא. FileKit עובד בכל מכשיר ודפדפן מודרני ללא חשבונות Apple."],
  hi:["Windows या Android पर Apple Pages, Numbers या Keynote फ़ाइलें कैसे खोलें?","अपनी .pages, .numbers या .key फ़ाइल FileKit में अपलोड करें और इसे PDF, Word (DOCX) या Excel (XLSX) में कन्वर्ट करें।","क्या Apple फ़ॉन्ट, फ़ॉर्मूले और टेबल बरकरार रहते हैं?","हाँ। इंजन टाइपोग्राफी, सेल फ़ॉर्मेटिंग और ट्रांज़िशन को पिक्सल-परफ़ेक्ट विज़ुअल फ़िडेलिटी से कन्वर्ट करता है।","क्या मुझे iCloud खाता या Apple डिवाइस चाहिए?","नहीं। FileKit किसी भी डिवाइस और ब्राउज़र पर Apple खातों के बिना काम करता है।"],
  id:["Bagaimana cara membuka file Apple Pages, Numbers, atau Keynote di Windows atau Android?","Unggah file .pages, .numbers, atau .key Anda ke FileKit untuk mengonversinya menjadi PDF, Word (DOCX), atau Excel (XLSX).","Apakah font Apple, rumus, dan tabel tetap utuh?","Ya. Mesin mengonversi tipografi, format sel, dan transisi dengan ketelitian visual yang sempurna.","Apakah saya perlu akun iCloud atau perangkat Apple?","Tidak. FileKit berfungsi di perangkat apa pun dan browser modern tanpa akun Apple."],
  ms:["Bagaimana untuk membuka fail Apple Pages, Numbers atau Keynote di Windows atau Android?","Muat naik fail .pages, .numbers atau .key anda ke FileKit untuk menukarnya kepada PDF, Word (DOCX) atau Excel (XLSX).","Adakah fon Apple, formula dan jadual dikekalkan?","Ya. Enjin menukar tipografi, pemformatan sel dan peralihan dengan kesetiaan visual yang sempurna.","Adakah saya perlukan akaun iCloud atau peranti Apple?","Tidak. FileKit berfungsi pada mana-mana peranti dan pelayar moden tanpa akaun Apple."],
  th:["จะเปิดไฟล์ Apple Pages, Numbers หรือ Keynote บน Windows หรือ Android ได้อย่างไร?","อัปโหลดไฟล์ .pages, .numbers หรือ .key ไปยัง FileKit เพื่อแปลงเป็น PDF, Word (DOCX) หรือ Excel (XLSX)","ฟอนต์ Apple สูตร และตารางยังคงสมบูรณ์หรือไม่?","ใช่ เอ็นจิ้นแปลงรูปแบบตัวอักษร การจัดรูปแบบเซลล์ และการเปลี่ยนผ่านด้วยความแม่นยำระดับพิกเซล","ต้องมีบัญชี iCloud หรืออุปกรณ์ Apple หรือไม่?","ไม่ FileKit ทำงานได้บนทุกอุปกรณ์และเบราว์เซอร์สมัยใหม่โดยไม่ต้องมีบัญชี Apple"],
  vi:["Làm cách nào để mở file Apple Pages, Numbers hoặc Keynote trên Windows hoặc Android?","Tải file .pages, .numbers hoặc .key lên FileKit để chuyển đổi sang PDF, Word (DOCX) hoặc Excel (XLSX).","Font Apple, công thức và bảng có được giữ nguyên không?","Có. Bộ xử lý chuyển đổi kiểu chữ, định dạng ô và chuyển tiếp với độ trung thực hình ảnh hoàn hảo.","Tôi có cần tài khoản iCloud hoặc thiết bị Apple không?","Không. FileKit hoạt động trên mọi thiết bị và trình duyệt hiện đại mà không cần tài khoản Apple."],
  fil:["Paano buksan ang Apple Pages, Numbers, o Keynote files sa Windows o Android?","I-upload ang iyong .pages, .numbers, o .key file sa FileKit para i-convert ito sa PDF, Word (DOCX), o Excel (XLSX).","Nananatili ba ang Apple fonts, formulas, at tables?","Oo. Kino-convert ng engine ang typography, cell formatting, at transitions na may pixel-perfect na visual fidelity.","Kailangan ko ba ng iCloud account o Apple device?","Hindi. Gumagana ang FileKit sa anumang device at modernong browser nang walang Apple accounts."],
  ja:["Windows や Android で Apple Pages、Numbers、Keynote ファイルを開くにはどうすればよいですか？",".pages、.numbers、または .key ファイルを FileKit にアップロードして、PDF、Word (DOCX)、または Excel (XLSX) に変換します。","Apple フォント、数式、表は保持されますか？","はい。エンジンはタイポグラフィ、セルフォーマット、トランジションをピクセルパーフェクトな忠実度で変換します。","iCloud アカウントや Apple デバイスは必要ですか？","いいえ。FileKit は Apple アカウントなしで、あらゆるデバイスとモダンブラウザで動作します。"],
  ko:["Windows나 Android에서 Apple Pages, Numbers 또는 Keynote 파일을 어떻게 열 수 있나요?",".pages, .numbers 또는 .key 파일을 FileKit에 업로드하여 PDF, Word (DOCX) 또는 Excel (XLSX)로 변환합니다.","Apple 글꼴, 수식 및 표가 유지되나요?","네. 엔진은 타이포그래피, 셀 서식 및 전환을 픽셀 단위의 시각적 충실도로 변환합니다.","iCloud 계정이나 Apple 기기가 필요한가요?","아니요. FileKit은 Apple 계정 없이 모든 기기와 최신 브라우저에서 작동합니다."],
  "zh-CN":["如何在 Windows 或 Android 上打开 Apple Pages、Numbers 或 Keynote 文件？","将您的 .pages、.numbers 或 .key 文件上传到 FileKit，转换为 PDF、Word (DOCX) 或 Excel (XLSX) 格式。","Apple 字体、公式和表格是否完整保留？","是的。引擎以像素级精确度转换排版、单元格格式和过渡效果。","我需要 iCloud 账户或 Apple 设备吗？","不需要。FileKit 在任何设备和现代浏览器上运行，无需 Apple 账户。"],
  "zh-TW":["如何在 Windows 或 Android 上開啟 Apple Pages、Numbers 或 Keynote 檔案？","將您的 .pages、.numbers 或 .key 檔案上傳到 FileKit，轉換為 PDF、Word (DOCX) 或 Excel (XLSX) 格式。","Apple 字型、公式和表格是否完整保留？","是的。引擎以像素級精確度轉換排版、儲存格格式和轉場效果。","我需要 iCloud 帳號或 Apple 裝置嗎？","不需要。FileKit 在任何裝置和現代瀏覽器上運行，無需 Apple 帳號。"]
};
for (const [loc, qa] of Object.entries(appleData)) set("apple", loc, qa);

// IMAGE  
const imageData = {
  en:["Does image conversion or compression reduce visual clarity?","FileKit uses intelligent perceptual quantization to reduce file size while preserving crisp edges, color depth, and sharpness.","Which image format should I choose for the best web performance?","WebP and AVIF provide the best compression efficiency with up to 70% smaller file sizes than traditional JPG and PNG.","Are my private photos and camera EXIF metadata stored on your servers?","No. Your photos are processed 100% locally in your browser, and EXIF metadata can be stripped automatically for privacy."],
  es:["¿La conversión o compresión de imágenes reduce la claridad visual?","FileKit utiliza cuantización perceptiva inteligente para reducir el tamaño del archivo preservando nitidez y color.","¿Qué formato de imagen es mejor para el rendimiento web?","WebP y AVIF ofrecen la mejor eficiencia de compresión con tamaños hasta un 70% menores que JPG y PNG.","¿Se almacenan mis fotos privadas y metadatos EXIF en sus servidores?","No. Tus fotos se procesan 100% localmente en tu navegador y los metadatos EXIF se eliminan para mayor privacidad."],
  "es-419":["¿La conversión o compresión de imágenes reduce la claridad?","FileKit usa cuantización perceptiva inteligente para reducir tamaño de archivo preservando nitidez, color y bordes.","¿Qué formato de imagen elegir para mejor rendimiento web?","WebP y AVIF ofrecen la mejor compresión con archivos hasta 70% más pequeños que JPG y PNG.","¿Mis fotos privadas y metadatos EXIF se almacenan en servidores?","No. Tus fotos se procesan 100% localmente en tu navegador y los metadatos EXIF se eliminan automáticamente."],
  de:["Reduziert Bildkonvertierung oder -komprimierung die visuelle Qualität?","FileKit verwendet intelligente perzeptuelle Quantisierung, um die Dateigröße zu reduzieren und dabei Schärfe, Farbtiefe und Kantenpräzision zu erhalten.","Welches Bildformat eignet sich am besten für die Web-Performance?","WebP und AVIF bieten die beste Kompressionseffizienz mit bis zu 70% kleineren Dateien als JPG und PNG.","Werden meine privaten Fotos und EXIF-Metadaten auf Ihren Servern gespeichert?","Nein. Ihre Fotos werden zu 100% lokal im Browser verarbeitet, und EXIF-Metadaten können automatisch entfernt werden."],
  fr:["La conversion ou compression d'images réduit-elle la qualité visuelle ?","FileKit utilise une quantification perceptive intelligente pour réduire la taille du fichier tout en préservant la netteté et les couleurs.","Quel format d'image choisir pour les meilleures performances web ?","WebP et AVIF offrent la meilleure efficacité de compression avec des tailles jusqu'à 70% plus petites que JPG et PNG.","Mes photos privées et métadonnées EXIF sont-elles stockées sur vos serveurs ?","Non. Vos photos sont traitées 100% localement dans votre navigateur et les métadonnées EXIF peuvent être supprimées automatiquement."],
  pt:["A conversão ou compressão de imagens reduz a qualidade visual?","O FileKit utiliza quantização percetual inteligente para reduzir o tamanho do ficheiro preservando nitidez e cores.","Qual formato de imagem escolher para melhor desempenho web?","WebP e AVIF oferecem a melhor eficiência de compressão com ficheiros até 70% menores que JPG e PNG.","As minhas fotos privadas e metadados EXIF são armazenados nos seus servidores?","Não. As suas fotos são processadas 100% localmente no navegador e os metadados EXIF podem ser removidos automaticamente."],
  "pt-BR":["A conversão ou compressão de imagens reduz a qualidade visual?","O FileKit usa quantização perceptual inteligente para reduzir o tamanho do arquivo preservando nitidez e cores.","Qual formato de imagem escolher para melhor desempenho web?","WebP e AVIF oferecem a melhor eficiência de compressão com arquivos até 70% menores que JPG e PNG.","Minhas fotos privadas e metadados EXIF são armazenados nos seus servidores?","Não. Suas fotos são processadas 100% localmente no navegador e os metadados EXIF podem ser removidos automaticamente."],
  it:["La conversione o compressione delle immagini riduce la qualità visiva?","FileKit utilizza una quantizzazione percettiva intelligente per ridurre le dimensioni del file preservando nitidezza e colori.","Quale formato di immagine scegliere per le migliori prestazioni web?","WebP e AVIF offrono la migliore efficienza di compressione con file fino al 70% più piccoli di JPG e PNG.","Le mie foto private e i metadati EXIF sono conservati sui vostri server?","No. Le foto vengono elaborate al 100% localmente nel browser e i metadati EXIF possono essere rimossi automaticamente."],
  nl:["Vermindert beeldconversie of -compressie de visuele kwaliteit?","FileKit gebruikt intelligente perceptuele kwantisering om bestandsgrootte te verkleinen met behoud van scherpte en kleurkwaliteit.","Welk beeldformaat kiezen voor de beste webprestaties?","WebP en AVIF bieden de beste compressie-efficiëntie met tot 70% kleinere bestanden dan JPG en PNG.","Worden mijn privéfoto's en EXIF-metadata op uw servers opgeslagen?","Nee. Uw foto's worden 100% lokaal in de browser verwerkt en EXIF-metadata kan automatisch worden verwijderd."],
  ca:["La conversió o compressió d'imatges redueix la qualitat visual?","FileKit utilitza quantització perceptiva intel·ligent per reduir la mida del fitxer preservant nitidesa i colors.","Quin format d'imatge triar per al millor rendiment web?","WebP i AVIF ofereixen la millor eficiència de compressió amb fitxers fins un 70% més petits que JPG i PNG.","Les meves fotos i metadades EXIF s'emmagatzemen als vostres servidors?","No. Les fotos es processen 100% localment al navegador i les metadades EXIF es poden eliminar automàticament."],
  sv:["Minskar bildkonvertering eller komprimering den visuella kvaliteten?","FileKit använder intelligent perceptuell kvantisering för att minska filstorleken och samtidigt bevara skärpa och färgdjup.","Vilket bildformat bör jag välja för bästa webbprestanda?","WebP och AVIF ger bäst kompressionseffektivitet med upp till 70% mindre filstorlekar än JPG och PNG.","Lagras mina privata foton och EXIF-metadata på era servrar?","Nej. Dina foton bearbetas 100% lokalt i webbläsaren och EXIF-metadata kan automatiskt tas bort."],
  da:["Reducerer billedkonvertering eller komprimering den visuelle kvalitet?","FileKit bruger intelligent perceptuel kvantisering til at reducere filstørrelsen og bevare skarphed og farvedybde.","Hvilket billedformat bør jeg vælge til bedste webydelse?","WebP og AVIF giver bedst komprimeringseffektivitet med op til 70% mindre filstørrelser end JPG og PNG.","Gemmes mine private fotos og EXIF-metadata på jeres servere?","Nej. Dine fotos behandles 100% lokalt i browseren, og EXIF-metadata kan automatisk fjernes."],
  fi:["Vähentääkö kuvan muuntaminen tai pakkaaminen visuaalista laatua?","FileKit käyttää älykästä havainnointipohjaista kvantisointia tiedostokoon pienentämiseksi säilyttäen terävyyden ja värisyvyyden.","Mikä kuvamuoto on paras verkkosivujen suorituskyvylle?","WebP ja AVIF tarjoavat parhaan pakkaustehokkuuden jopa 70% pienemmillä tiedostoilla kuin JPG ja PNG.","Tallennetaanko yksityiset kuvani ja EXIF-metatiedot palvelimillenne?","Ei. Kuvasi käsitellään 100% paikallisesti selaimessa ja EXIF-metatiedot voidaan poistaa automaattisesti."],
  no:["Reduserer bildekonvertering eller komprimering den visuelle kvaliteten?","FileKit bruker intelligent perseptuell kvantisering for å redusere filstørrelsen og bevare skarphet og fargedybde.","Hvilket bildeformat bør jeg velge for best nettytelse?","WebP og AVIF gir best komprimeringseffektivitet med opptil 70% mindre filer enn JPG og PNG.","Lagres mine private bilder og EXIF-metadata på serverne deres?","Nei. Bildene dine behandles 100% lokalt i nettleseren, og EXIF-metadata kan fjernes automatisk."],
  pl:["Czy konwersja lub kompresja obrazów zmniejsza jakość wizualną?","FileKit wykorzystuje inteligentną kwantyzację percepcyjną, aby zmniejszyć rozmiar pliku, zachowując ostrość i głębię kolorów.","Jaki format obrazu wybrać dla najlepszej wydajności w sieci?","WebP i AVIF zapewniają najlepszą efektywność kompresji z plikami do 70% mniejszymi niż JPG i PNG.","Czy moje prywatne zdjęcia i metadane EXIF są przechowywane na waszych serwerach?","Nie. Zdjęcia przetwarzane są w 100% lokalnie w przeglądarce, a metadane EXIF mogą być automatycznie usuwane."],
  cs:["Snižuje konverze nebo komprese obrazu vizuální kvalitu?","FileKit používá inteligentní percepční kvantizaci ke zmenšení velikosti souboru při zachování ostrosti a barevné hloubky.","Jaký formát obrázku zvolit pro nejlepší výkon na webu?","WebP a AVIF poskytují nejlepší kompresi s až o 70% menšími soubory než JPG a PNG.","Jsou mé soukromé fotografie a EXIF metadata uloženy na vašich serverech?","Ne. Vaše fotky jsou zpracovány 100% lokálně v prohlížeči a EXIF metadata mohou být automaticky odstraněna."],
  hu:["Az képkonverzió vagy -tömörítés csökkenti a vizuális minőséget?","A FileKit intelligens perceptuális kvantálást használ a fájlméret csökkentéséhez az élesség és a színmélység megőrzése mellett.","Melyik képformátumot válasszam a legjobb webes teljesítményhez?","A WebP és AVIF nyújtja a legjobb tömörítési hatékonyságot, akár 70%-kal kisebb fájlokkal, mint a JPG és PNG.","A privát fotóim és EXIF metaadataim tárolódnak a szervereiken?","Nem. A fotók 100%-ban helyben, a böngészőben kerülnek feldolgozásra, és az EXIF metaadatok automatikusan eltávolíthatók."],
  ro:["Conversia sau compresia imaginilor reduce calitatea vizuală?","FileKit folosește cuantizare perceptuală inteligentă pentru a reduce dimensiunea fișierului păstrând claritatea și adâncimea culorilor.","Ce format de imagine să aleg pentru cea mai bună performanță web?","WebP și AVIF oferă cea mai bună eficiență de compresie cu fișiere cu până la 70% mai mici decât JPG și PNG.","Fotografiile mele private și metadatele EXIF sunt stocate pe serverele voastre?","Nu. Fotografiile sunt procesate 100% local în browser, iar metadatele EXIF pot fi eliminate automat."],
  bg:["Конвертирането или компресията на изображения намалява ли визуалното качество?","FileKit използва интелигентно перцептуално квантуване за намаляване на размера на файла, запазвайки острота и дълбочина на цветовете.","Кой формат на изображение да избера за най-добро уеб представяне?","WebP и AVIF осигуряват най-добра ефективност на компресия с до 70% по-малки файлове от JPG и PNG.","Частните ми снимки и EXIF метаданни съхраняват ли се на сървърите ви?","Не. Снимките се обработват 100% локално в браузъра и EXIF метаданните могат автоматично да бъдат премахнати."],
  el:["Η μετατροπή ή συμπίεση εικόνας μειώνει την οπτική ποιότητα;","Το FileKit χρησιμοποιεί έξυπνη αντιληπτική κβαντοποίηση για μείωση μεγέθους αρχείου διατηρώντας ευκρίνεια και βάθος χρώματος.","Ποιο format εικόνας να επιλέξω για καλύτερη απόδοση στο web;","WebP και AVIF προσφέρουν την καλύτερη αποδοτικότητα συμπίεσης με αρχεία έως 70% μικρότερα από JPG και PNG.","Οι ιδιωτικές μου φωτογραφίες και τα EXIF metadata αποθηκεύονται στους servers σας;","Όχι. Οι φωτογραφίες επεξεργάζονται 100% τοπικά στον browser και τα EXIF metadata μπορούν να αφαιρεθούν αυτόματα."],
  sk:["Znižuje konverzia alebo kompresia obrázka vizuálnu kvalitu?","FileKit používa inteligentnú percepčnú kvantizáciu na zníženie veľkosti súboru pri zachovaní ostrosti a farebnej hĺbky.","Aký formát obrázka zvoliť pre najlepší webový výkon?","WebP a AVIF poskytujú najlepšiu kompresiu so súbormi až o 70% menšími ako JPG a PNG.","Sú moje súkromné fotografie a EXIF metadáta uložené na vašich serveroch?","Nie. Vaše fotky sú spracované 100% lokálne v prehliadači a EXIF metadáta môžu byť automaticky odstránené."],
  sl:["Ali pretvorba ali stiskanje slik zmanjša vizualno kakovost?","FileKit uporablja inteligentno percepcijsko kvantizacijo za zmanjšanje velikosti datoteke ob ohranjanju ostrine in barvne globine.","Kateri format slike izbrati za najboljšo spletno zmogljivost?","WebP in AVIF ponujata najboljšo učinkovitost stiskanja z datotekami do 70% manjšimi kot JPG in PNG.","Ali so moje zasebne fotografije in metapodatki EXIF shranjeni na vaših strežnikih?","Ne. Vaše fotografije se obdelujejo 100% lokalno v brskalniku in metapodatki EXIF se lahko samodejno odstranijo."],
  ru:["Снижает ли конвертация или сжатие изображений визуальное качество?","FileKit использует интеллектуальное перцептуальное квантование для уменьшения размера файла с сохранением резкости и глубины цвета.","Какой формат изображения выбрать для лучшей производительности в вебе?","WebP и AVIF обеспечивают лучшую эффективность сжатия с файлами на 70% меньше, чем JPG и PNG.","Хранятся ли мои личные фотографии и метаданные EXIF на ваших серверах?","Нет. Ваши фотографии обрабатываются на 100% локально в браузере, а метаданные EXIF могут быть автоматически удалены."],
  uk:["Чи знижує конвертація або стиснення зображень візуальну якість?","FileKit використовує інтелектуальне перцептуальне квантування для зменшення розміру файлу зі збереженням чіткості та глибини кольору.","Який формат зображення обрати для найкращої веб-продуктивності?","WebP та AVIF забезпечують найкращу ефективність стиснення з файлами на 70% менше ніж JPG та PNG.","Чи зберігаються мої приватні фотографії та метадані EXIF на ваших серверах?","Ні. Ваші фотографії обробляються на 100% локально в браузері, а метадані EXIF можуть бути автоматично видалені."],
  lv:["Vai attēlu konvertēšana vai saspiešana samazina vizuālo kvalitāti?","FileKit izmanto inteliģentu perceptuālo kvantizāciju, lai samazinātu faila lielumu, saglabājot asumu un krāsu dziļumu.","Kuru attēla formātu izvēlēties labākajam tīmekļa sniegumam?","WebP un AVIF nodrošina labāko saspiešanas efektivitāti ar failiem līdz 70% mazākiem nekā JPG un PNG.","Vai manas privātās fotogrāfijas un EXIF metadati tiek glabāti jūsu serveros?","Nē. Jūsu fotogrāfijas tiek apstrādātas 100% lokāli pārlūkprogrammā, un EXIF metadati var tikt automātiski noņemti."],
  lt:["Ar vaizdo konvertavimas ar suspaudimas sumažina vizualinę kokybę?","FileKit naudoja intelektualų percepcijinį kvantavimą failo dydžiui sumažinti, išsaugant ryškumą ir spalvų gylį.","Kokį vaizdo formatą pasirinkti geriausiam žiniatinklio našumui?","WebP ir AVIF užtikrina geriausią suspaudimo efektyvumą su failais iki 70% mažesniais nei JPG ir PNG.","Ar mano privačios nuotraukos ir EXIF metaduomenys saugomi jūsų serveriuose?","Ne. Jūsų nuotraukos apdorojamos 100% lokaliai naršyklėje, o EXIF metaduomenys gali būti automatiškai pašalinti."],
  tr:["Görsel dönüştürme veya sıkıştırma görsel kaliteyi düşürür mü?","FileKit, dosya boyutunu küçültürken keskinliği ve renk derinliğini korumak için akıllı algısal niceleme kullanır.","Web performansı için en iyi görsel formatı hangisidir?","WebP ve AVIF, JPG ve PNG'den %70'e kadar daha küçük dosya boyutlarıyla en iyi sıkıştırma verimliliğini sunar.","Kişisel fotoğraflarım ve EXIF meta verileri sunucularınızda saklanıyor mu?","Hayır. Fotoğraflarınız tarayıcınızda %100 yerel olarak işlenir ve EXIF meta veriler gizlilik için otomatik olarak kaldırılabilir."],
  ar:["هل تحويل الصور أو ضغطها يقلل من الوضوح البصري؟","يستخدم FileKit التكميم الإدراكي الذكي لتقليل حجم الملف مع الحفاظ على الحدة وعمق الألوان.","أي تنسيق صور يجب اختياره للحصول على أفضل أداء ويب؟","WebP وAVIF يوفران أفضل كفاءة ضغط مع أحجام ملفات أصغر بنسبة تصل إلى 70% مقارنة بـ JPG وPNG.","هل يتم تخزين صوري الخاصة وبيانات EXIF على خوادمكم؟","لا. تتم معالجة صورك 100% محلياً في متصفحك ويمكن إزالة بيانات EXIF تلقائياً للخصوصية."],
  he:["האם המרה או דחיסה של תמונות מפחיתה את הבהירות החזותית?","FileKit משתמש בקוונטיזציה תפיסתית חכמה כדי להקטין את גודל הקובץ תוך שמירה על חדות ועומק צבע.","איזה פורמט תמונה לבחור לביצועי אינטרנט מיטביים?","WebP ו-AVIF מספקים את יעילות הדחיסה הטובה ביותר עם קבצים קטנים ב-70% מ-JPG ו-PNG.","האם התמונות הפרטיות שלי ומטא-נתוני EXIF מאוחסנים בשרתים שלכם?","לא. התמונות מעובדות 100% מקומית בדפדפן, ומטא-נתוני EXIF יכולים להיות מוסרים אוטומטית."],
  hi:["क्या इमेज कन्वर्शन या कंप्रेशन विज़ुअल क्वालिटी कम करता है?","FileKit बुद्धिमान अवधारणात्मक क्वांटाइज़ेशन का उपयोग करता है ताकि फ़ाइल का आकार कम हो और तीक्ष्णता व रंग गहराई बनी रहे।","वेब प्रदर्शन के लिए कौन सा इमेज फ़ॉर्मेट चुनें?","WebP और AVIF सबसे अच्छी कंप्रेशन दक्षता प्रदान करते हैं, JPG और PNG से 70% तक छोटी फ़ाइलों के साथ।","क्या मेरी निजी फ़ोटो और EXIF मेटाडेटा आपके सर्वर पर स्टोर होते हैं?","नहीं। आपकी फ़ोटो 100% स्थानीय रूप से ब्राउज़र में प्रोसेस होती हैं और EXIF मेटाडेटा स्वचालित रूप से हटाया जा सकता है।"],
  id:["Apakah konversi atau kompresi gambar mengurangi kejelasan visual?","FileKit menggunakan kuantisasi perseptual cerdas untuk mengurangi ukuran file sambil mempertahankan ketajaman dan kedalaman warna.","Format gambar mana yang harus saya pilih untuk performa web terbaik?","WebP dan AVIF memberikan efisiensi kompresi terbaik dengan ukuran file hingga 70% lebih kecil dari JPG dan PNG.","Apakah foto pribadi dan metadata EXIF saya disimpan di server Anda?","Tidak. Foto Anda diproses 100% secara lokal di browser, dan metadata EXIF dapat dihapus secara otomatis."],
  ms:["Adakah penukaran atau pemampatan imej mengurangkan kejelasan visual?","FileKit menggunakan kuantisasi perseptual pintar untuk mengurangkan saiz fail sambil mengekalkan ketajaman dan kedalaman warna.","Format imej mana yang harus saya pilih untuk prestasi web terbaik?","WebP dan AVIF memberikan kecekapan pemampatan terbaik dengan saiz fail sehingga 70% lebih kecil daripada JPG dan PNG.","Adakah foto peribadi dan metadata EXIF saya disimpan di pelayan anda?","Tidak. Foto anda diproses 100% secara setempat dalam pelayar dan metadata EXIF boleh dialih keluar secara automatik."],
  th:["การแปลงหรือบีบอัดภาพลดความชัดเจนของภาพหรือไม่?","FileKit ใช้การควอนไทซ์เชิงรับรู้อัจฉริยะเพื่อลดขนาดไฟล์ในขณะที่รักษาความคมชัดและความลึกของสี","ควรเลือกฟอร์แมตภาพใดสำหรับประสิทธิภาพเว็บที่ดีที่สุด?","WebP และ AVIF ให้ประสิทธิภาพการบีบอัดที่ดีที่สุดด้วยขนาดไฟล์เล็กกว่า JPG และ PNG ถึง 70%","รูปส่วนตัวและข้อมูล EXIF ของฉันถูกเก็บบนเซิร์ฟเวอร์ของคุณหรือไม่?","ไม่ รูปของคุณถูกประมวลผล 100% ภายในเครื่องในเบราว์เซอร์ และข้อมูล EXIF สามารถลบได้อัตโนมัติ"],
  vi:["Chuyển đổi hoặc nén ảnh có làm giảm độ rõ hình ảnh không?","FileKit sử dụng lượng tử hóa nhận thức thông minh để giảm kích thước file mà vẫn giữ độ sắc nét và chiều sâu màu sắc.","Nên chọn định dạng ảnh nào cho hiệu suất web tốt nhất?","WebP và AVIF cung cấp hiệu suất nén tốt nhất với kích thước file nhỏ hơn tới 70% so với JPG và PNG.","Ảnh riêng tư và metadata EXIF có được lưu trên máy chủ của bạn không?","Không. Ảnh được xử lý 100% cục bộ trong trình duyệt và metadata EXIF có thể được xóa tự động."],
  fil:["Nababawasan ba ng image conversion o compression ang visual clarity?","Gumagamit ang FileKit ng intelligent perceptual quantization para bawasan ang file size habang pinapanatili ang sharpness at color depth.","Aling image format ang pipiliin para sa pinakamahusay na web performance?","Ang WebP at AVIF ay nagbibigay ng pinakamahusay na compression na may file sizes na hanggang 70% mas maliit kaysa JPG at PNG.","Naka-store ba ang aking private photos at EXIF metadata sa inyong servers?","Hindi. Pinoproseso ang iyong mga larawan nang 100% lokal sa browser at ang EXIF metadata ay maaaring awtomatikong alisin."],
  ja:["画像の変換や圧縮で視覚的な品質は低下しますか？","FileKitはインテリジェントな知覚量子化を使用して、シャープさと色深度を維持しながらファイルサイズを削減します。","Web パフォーマンスに最適な画像フォーマットは？","WebP と AVIF は、JPG や PNG より最大70%小さいファイルサイズで最高の圧縮効率を提供します。","私のプライベート写真や EXIF メタデータはサーバーに保存されますか？","いいえ。写真はブラウザ内で100%ローカルに処理され、EXIF メタデータは自動的に除去できます。"],
  ko:["이미지 변환이나 압축이 시각적 품질을 저하시키나요?","FileKit은 지능형 인지 양자화를 사용하여 선명도와 색상 깊이를 유지하면서 파일 크기를 줄입니다.","최고의 웹 성능을 위해 어떤 이미지 형식을 선택해야 하나요?","WebP와 AVIF는 JPG 및 PNG보다 최대 70% 작은 파일 크기로 최고의 압축 효율을 제공합니다.","내 개인 사진과 EXIF 메타데이터가 서버에 저장되나요?","아니요. 사진은 브라우저에서 100% 로컬로 처리되며 EXIF 메타데이터는 자동으로 제거할 수 있습니다."],
  "zh-CN":["图片转换或压缩会降低视觉质量吗？","FileKit 使用智能感知量化来减小文件大小，同时保持清晰度和色彩深度。","哪种图片格式最适合网页性能？","WebP 和 AVIF 提供最佳压缩效率，文件比 JPG 和 PNG 小高达70%。","我的私人照片和 EXIF 元数据会存储在你们的服务器上吗？","不会。您的照片在浏览器中100%本地处理，EXIF 元数据可以自动移除。"],
  "zh-TW":["圖片轉換或壓縮會降低視覺品質嗎？","FileKit 使用智慧感知量化來縮小檔案大小，同時保持銳利度和色彩深度。","哪種圖片格式最適合網頁效能？","WebP 和 AVIF 提供最佳壓縮效率，檔案比 JPG 和 PNG 小高達70%。","我的私人照片和 EXIF 中繼資料會儲存在你們的伺服器上嗎？","不會。您的照片在瀏覽器中100%本機處理，EXIF 中繼資料可以自動移除。"]
};
for (const [loc, qa] of Object.entries(imageData)) set("image", loc, qa);

// AUDIO_VIDEO
const avData = {
  en:["Can I convert and compress audio and video files without quality loss?","Yes. FileKit applies adaptive bitrate throttling and perceptual encoding to maintain crystal clear sound and HD resolution.","What video and audio formats can I convert directly in my browser?","You can convert MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, and AAC with zero third-party software.","Are my audio and video recordings kept private and secure?","Yes. Processing occurs directly on your device through client-side WebAssembly, ensuring your media files remain completely private."],
  es:["¿Puedo convertir y comprimir archivos de audio y video sin pérdida de calidad?","Sí. FileKit aplica tasa de bits adaptativa y codificación perceptiva para mantener sonido nítido y resolución HD.","¿Qué formatos de video y audio puedo convertir directamente en mi navegador?","Puedes convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG y AAC sin software adicional.","¿Mis grabaciones de audio y video se mantienen privadas y seguras?","Sí. El procesamiento se ejecuta directamente en tu dispositivo mediante WebAssembly con total privacidad."],
  "es-419":["¿Puedo convertir y comprimir archivos de audio y video sin perder calidad?","Sí. FileKit usa tasa de bits adaptativa y codificación perceptiva para mantener sonido nítido y resolución HD.","¿Qué formatos de video y audio puedo convertir en mi navegador?","Puedes convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG y AAC sin instalar nada.","¿Mis grabaciones de audio y video se mantienen privadas?","Sí. El procesamiento ocurre directamente en tu dispositivo mediante WebAssembly con privacidad total."],
  de:["Kann ich Audio- und Videodateien ohne Qualitätsverlust konvertieren und komprimieren?","Ja. FileKit verwendet adaptive Bitratensteuerung und perzeptuelle Kodierung für kristallklaren Sound und HD-Auflösung.","Welche Video- und Audioformate kann ich direkt im Browser konvertieren?","Sie können MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG und AAC ohne Drittanbietersoftware konvertieren.","Bleiben meine Audio- und Videoaufnahmen privat und sicher?","Ja. Die Verarbeitung erfolgt direkt auf Ihrem Gerät über clientseitiges WebAssembly mit vollständigem Datenschutz."],
  fr:["Puis-je convertir et compresser des fichiers audio et vidéo sans perte de qualité ?","Oui. FileKit applique un débit adaptatif et un encodage perceptif pour maintenir un son cristallin et une résolution HD.","Quels formats vidéo et audio puis-je convertir directement dans mon navigateur ?","Vous pouvez convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG et AAC sans logiciel tiers.","Mes enregistrements audio et vidéo restent-ils privés et sécurisés ?","Oui. Le traitement s'effectue directement sur votre appareil via WebAssembly côté client avec une confidentialité totale."],
  pt:["Posso converter e comprimir ficheiros de áudio e vídeo sem perda de qualidade?","Sim. O FileKit aplica taxa de bits adaptativa e codificação percetual para manter som cristalino e resolução HD.","Que formatos de vídeo e áudio posso converter diretamente no navegador?","Pode converter MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG e AAC sem software externo.","As minhas gravações de áudio e vídeo permanecem privadas?","Sim. O processamento ocorre diretamente no seu dispositivo via WebAssembly com total privacidade."],
  "pt-BR":["Posso converter e comprimir arquivos de áudio e vídeo sem perda de qualidade?","Sim. O FileKit aplica taxa de bits adaptativa e codificação perceptual para manter som cristalino e resolução HD.","Quais formatos de vídeo e áudio posso converter no navegador?","Você pode converter MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG e AAC sem nenhum software.","Minhas gravações de áudio e vídeo permanecem privadas?","Sim. O processamento ocorre diretamente no seu dispositivo via WebAssembly com privacidade total."],
  it:["Posso convertire e comprimere file audio e video senza perdita di qualità?","Sì. FileKit applica bitrate adattivo e codifica percettiva per mantenere suono cristallino e risoluzione HD.","Quali formati video e audio posso convertire direttamente nel browser?","Puoi convertire MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG e AAC senza software aggiuntivo.","Le mie registrazioni audio e video restano private e sicure?","Sì. L'elaborazione avviene direttamente sul tuo dispositivo tramite WebAssembly con privacy totale."],
  nl:["Kan ik audio- en videobestanden converteren en comprimeren zonder kwaliteitsverlies?","Ja. FileKit past adaptieve bitrate en perceptuele codering toe voor kristalhelder geluid en HD-resolutie.","Welke video- en audioformaten kan ik rechtstreeks in de browser converteren?","U kunt MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG en AAC converteren zonder extra software.","Blijven mijn audio- en video-opnamen privé en veilig?","Ja. De verwerking vindt direct op uw apparaat plaats via WebAssembly met volledige privacy."],
  ca:["Puc convertir i comprimir fitxers d'àudio i vídeo sense pèrdua de qualitat?","Sí. FileKit aplica taxa de bits adaptativa i codificació perceptiva per mantenir so cristal·lí i resolució HD.","Quins formats de vídeo i àudio puc convertir directament al navegador?","Pots convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG i AAC sense cap programari addicional.","Les meves gravacions d'àudio i vídeo es mantenen privades?","Sí. El processament es fa directament al teu dispositiu mitjançant WebAssembly amb total privacitat."],
  sv:["Kan jag konvertera och komprimera ljud- och videofiler utan kvalitetsförlust?","Ja. FileKit tillämpar adaptiv bithastighet och perceptuell kodning för kristallklart ljud och HD-upplösning.","Vilka video- och ljudformat kan jag konvertera direkt i webbläsaren?","Du kan konvertera MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG och AAC utan tredjepartsprogram.","Förblir mina ljud- och videoinspelningar privata och säkra?","Ja. Bearbetningen sker direkt på din enhet via WebAssembly med fullständig sekretess."],
  da:["Kan jeg konvertere og komprimere lyd- og videofiler uden kvalitetstab?","Ja. FileKit anvender adaptiv bitrate og perceptuel kodning for krystalklar lyd og HD-opløsning.","Hvilke video- og lydformater kan jeg konvertere direkte i browseren?","Du kan konvertere MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG og AAC uden tredjepartssoftware.","Forbliver mine lyd- og videooptagelser private og sikre?","Ja. Behandlingen sker direkte på din enhed via WebAssembly med fuldstændig privatlivsbeskyttelse."],
  fi:["Voinko muuntaa ja pakata ääni- ja videotiedostoja ilman laadun heikkenemistä?","Kyllä. FileKit käyttää adaptiivista bittinopeus ja havainnointikoodausta kristallinkirkkaan äänen ja HD-resoluution säilyttämiseksi.","Mitä video- ja ääniformaatteja voin muuntaa suoraan selaimessa?","Voit muuntaa MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ja AAC ilman kolmannen osapuolen ohjelmistoja.","Pysyvätkö ääni- ja videotallenteeni yksityisinä ja turvassa?","Kyllä. Käsittely tapahtuu suoraan laitteellasi WebAssemblyn kautta täydellä yksityisyydellä."],
  no:["Kan jeg konvertere og komprimere lyd- og videofiler uten kvalitetstap?","Ja. FileKit bruker adaptiv bitrate og perseptuell koding for krystallklar lyd og HD-oppløsning.","Hvilke video- og lydformater kan jeg konvertere direkte i nettleseren?","Du kan konvertere MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG og AAC uten tredjepartsprogramvare.","Forblir mine lyd- og videoopptak private og sikre?","Ja. Behandlingen skjer direkte på enheten din via WebAssembly med fullstendig personvern."],
  pl:["Czy mogę konwertować i kompresować pliki audio i wideo bez utraty jakości?","Tak. FileKit stosuje adaptacyjną przepływność i kodowanie percepcyjne dla krystalicznie czystego dźwięku i rozdzielczości HD.","Jakie formaty wideo i audio mogę konwertować bezpośrednio w przeglądarce?","Możesz konwertować MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG i AAC bez dodatkowego oprogramowania.","Czy moje nagrania audio i wideo pozostają prywatne i bezpieczne?","Tak. Przetwarzanie odbywa się bezpośrednio na urządzeniu przez WebAssembly z pełną prywatnością."],
  cs:["Mohu převádět a komprimovat audio a video soubory bez ztráty kvality?","Ano. FileKit používá adaptivní bitrate a percepční kódování pro křišťálově čistý zvuk a HD rozlišení.","Jaké formáty videa a zvuku mohu převádět přímo v prohlížeči?","Můžete převádět MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG a AAC bez softwaru třetích stran.","Zůstávají mé audio a video nahrávky soukromé a bezpečné?","Ano. Zpracování probíhá přímo na vašem zařízení přes WebAssembly s úplným soukromím."],
  hu:["Konvertálhatok és tömöríthetek audio- és videofájlokat minőségveszteség nélkül?","Igen. A FileKit adaptív bitráta-szabályzást és perceptuális kódolást alkalmaz a kristálytiszta hang és HD felbontás megőrzéséhez.","Milyen videó- és audioformátumokat konvertálhatok közvetlenül a böngészőben?","Konvertálhat MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG és AAC formátumokat szoftver nélkül.","Az audio- és videofelvételeim privátok és biztonságban maradnak?","Igen. A feldolgozás közvetlenül az eszközén történik WebAssembly-n keresztül teljes adatvédelemmel."],
  ro:["Pot converti și comprima fișiere audio și video fără pierdere de calitate?","Da. FileKit aplică bitrate adaptiv și codificare perceptuală pentru sunet cristalin și rezoluție HD.","Ce formate video și audio pot converti direct în browser?","Puteți converti MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG și AAC fără software terț.","Înregistrările mele audio și video rămân private și sigure?","Da. Procesarea are loc direct pe dispozitiv prin WebAssembly cu confidențialitate completă."],
  bg:["Мога ли да конвертирам и компресирам аудио и видео файлове без загуба на качество?","Да. FileKit прилага адаптивен битрейт и перцептуално кодиране за кристално чист звук и HD резолюция.","Какви видео и аудио формати мога да конвертирам директно в браузъра?","Можете да конвертирате MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG и AAC без допълнителен софтуер.","Аудио и видео записите ми остават ли поверителни и сигурни?","Да. Обработката се извършва директно на устройството ви чрез WebAssembly с пълна поверителност."],
  el:["Μπορώ να μετατρέψω και να συμπιέσω αρχεία ήχου και βίντεο χωρίς απώλεια ποιότητας;","Ναι. Το FileKit εφαρμόζει προσαρμοστικό bitrate και αντιληπτική κωδικοποίηση για κρυστάλλινο ήχο και ανάλυση HD.","Ποια formats βίντεο και ήχου μπορώ να μετατρέψω απευθείας στον browser;","Μπορείτε να μετατρέψετε MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG και AAC χωρίς λογισμικό τρίτων.","Οι ηχογραφήσεις μου παραμένουν ιδιωτικές και ασφαλείς;","Ναι. Η επεξεργασία γίνεται απευθείας στη συσκευή σας μέσω WebAssembly με πλήρη ιδιωτικότητα."],
  sk:["Môžem konvertovať a komprimovať audio a video súbory bez straty kvality?","Áno. FileKit používa adaptívny bitrate a percepčné kódovanie pre krištáľovo čistý zvuk a HD rozlíšenie.","Aké video a audio formáty môžem konvertovať priamo v prehliadači?","Môžete konvertovať MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG a AAC bez softvéru tretích strán.","Zostávajú moje audio a video nahrávky súkromné a bezpečné?","Áno. Spracovanie prebieha priamo na vašom zariadení cez WebAssembly s úplným súkromím."],
  sl:["Ali lahko pretvarjam in stisnjem zvočne in video datoteke brez izgube kakovosti?","Da. FileKit uporablja prilagodljivo bitno hitrost in percepcijsko kodiranje za kristalno čist zvok in HD ločljivost.","Katere video in zvočne formate lahko pretvorim neposredno v brskalniku?","Pretvorite lahko MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG in AAC brez dodatne programske opreme.","Ali moji zvočni in video posnetki ostanejo zasebni in varni?","Da. Obdelava poteka neposredno na vaši napravi prek WebAssembly s popolno zasebnostjo."],
  ru:["Могу ли я конвертировать и сжимать аудио- и видеофайлы без потери качества?","Да. FileKit применяет адаптивный битрейт и перцептуальное кодирование для кристально чистого звука и HD-разрешения.","Какие форматы видео и аудио можно конвертировать прямо в браузере?","Вы можете конвертировать MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG и AAC без стороннего ПО.","Мои аудио- и видеозаписи остаются конфиденциальными?","Да. Обработка происходит непосредственно на вашем устройстве через WebAssembly с полной конфиденциальностью."],
  uk:["Чи можу я конвертувати та стискати аудіо- та відеофайли без втрати якості?","Так. FileKit застосовує адаптивний бітрейт та перцептуальне кодування для кришталево чистого звуку та HD-роздільності.","Які формати відео та аудіо можна конвертувати прямо в браузері?","Ви можете конвертувати MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG та AAC без стороннього ПЗ.","Мої аудіо- та відеозаписи залишаються конфіденційними?","Так. Обробка відбувається безпосередньо на вашому пристрої через WebAssembly з повною конфіденційністю."],
  lv:["Vai es varu konvertēt un saspiest audio un video failus bez kvalitātes zuduma?","Jā. FileKit piemēro adaptīvu bitu ātrumu un perceptuālo kodēšanu kristāldzidrai skaņai un HD izšķirtspējai.","Kādus video un audio formātus es varu konvertēt tieši pārlūkprogrammā?","Jūs varat konvertēt MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG un AAC bez trešo pušu programmatūras.","Vai mani audio un video ieraksti paliek privāti un droši?","Jā. Apstrāde notiek tieši jūsu ierīcē caur WebAssembly ar pilnīgu privātumu."],
  lt:["Ar galiu konvertuoti ir suspausti garso ir vaizdo failus be kokybės praradimo?","Taip. FileKit taiko adaptyvų bitų greitį ir percepcijinį kodavimą kristalinio garso ir HD raiškos palaikymui.","Kokius vaizdo ir garso formatus galiu konvertuoti tiesiai naršyklėje?","Galite konvertuoti MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ir AAC be trečiųjų šalių programinės įrangos.","Ar mano garso ir vaizdo įrašai lieka privatūs ir saugūs?","Taip. Apdorojimas vyksta tiesiogiai jūsų įrenginyje per WebAssembly su visišku privatumu."],
  tr:["Ses ve video dosyalarını kalite kaybı olmadan dönüştürüp sıkıştırabilir miyim?","Evet. FileKit, kristal netliğinde ses ve HD çözünürlük için uyarlanabilir bit hızı ve algısal kodlama uygular.","Hangi video ve ses formatlarını doğrudan tarayıcımda dönüştürebilirim?","MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ve AAC'yi üçüncü parti yazılım olmadan dönüştürebilirsiniz.","Ses ve video kayıtlarım gizli ve güvende mi?","Evet. İşlem, cihazınızda WebAssembly aracılığıyla doğrudan gerçekleşir ve tam gizlilik sağlar."],
  ar:["هل يمكنني تحويل وضغط ملفات الصوت والفيديو بدون فقدان الجودة؟","نعم. يطبق FileKit معدل بت تكيفي وترميز إدراكي للحفاظ على صوت نقي ودقة HD.","ما تنسيقات الفيديو والصوت التي يمكنني تحويلها مباشرة في المتصفح؟","يمكنك تحويل MP4 وMOV وAVI وMKV وWebM وMP3 وWAV وFLAC وM4A وOGG وAAC بدون برامج إضافية.","هل تبقى تسجيلاتي الصوتية والمرئية خاصة وآمنة؟","نعم. تتم المعالجة مباشرة على جهازك عبر WebAssembly مع خصوصية كاملة."],
  he:["האם אפשר להמיר ולדחוס קבצי אודיו ווידאו ללא אובדן איכות?","כן. FileKit מפעיל קצב סיביות אדפטיבי וקידוד תפיסתי לשמירה על צליל צלול ורזולוציית HD.","אילו פורמטי וידאו ואודיו אפשר להמיר ישירות בדפדפן?","ניתן להמיר MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ו-AAC ללא תוכנת צד שלישי.","האם הקלטות האודיו והווידאו שלי נשמרות פרטיות ומאובטחות?","כן. העיבוד מתבצע ישירות במכשיר שלך דרך WebAssembly עם פרטיות מלאה."],
  hi:["क्या मैं गुणवत्ता खोए बिना ऑडियो और वीडियो फ़ाइलें कन्वर्ट और कंप्रेस कर सकता हूँ?","हाँ। FileKit क्रिस्टल क्लियर साउंड और HD रिज़ॉल्यूशन बनाए रखने के लिए एडेप्टिव बिटरेट और परसेप्चुअल एन्कोडिंग लागू करता है।","मैं अपने ब्राउज़र में कौन से वीडियो और ऑडियो फ़ॉर्मेट सीधे कन्वर्ट कर सकता हूँ?","आप बिना किसी अतिरिक्त सॉफ़्टवेयर के MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG और AAC कन्वर्ट कर सकते हैं।","क्या मेरी ऑडियो और वीडियो रिकॉर्डिंग निजी और सुरक्षित रहती हैं?","हाँ। प्रोसेसिंग आपके डिवाइस पर WebAssembly के माध्यम से पूर्ण गोपनीयता के साथ होती है।"],
  id:["Bisakah saya mengonversi dan mengompresi file audio dan video tanpa kehilangan kualitas?","Ya. FileKit menerapkan bitrate adaptif dan encoding perseptual untuk mempertahankan suara jernih dan resolusi HD.","Format video dan audio apa saja yang bisa saya konversi langsung di browser?","Anda dapat mengonversi MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, dan AAC tanpa software pihak ketiga.","Apakah rekaman audio dan video saya tetap pribadi dan aman?","Ya. Pemrosesan terjadi langsung di perangkat Anda melalui WebAssembly dengan privasi penuh."],
  ms:["Bolehkah saya menukar dan memampatkan fail audio dan video tanpa kehilangan kualiti?","Ya. FileKit menggunakan kadar bit adaptif dan pengekodan perseptual untuk bunyi jernih dan resolusi HD.","Format video dan audio apa yang boleh saya tukar terus dalam pelayar?","Anda boleh menukar MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG dan AAC tanpa perisian pihak ketiga.","Adakah rakaman audio dan video saya kekal peribadi dan selamat?","Ya. Pemprosesan berlaku terus pada peranti anda melalui WebAssembly dengan privasi penuh."],
  th:["ฉันสามารถแปลงและบีบอัดไฟล์เสียงและวิดีโอโดยไม่สูญเสียคุณภาพได้หรือไม่?","ได้ FileKit ใช้บิตเรตแบบปรับตัวและการเข้ารหัสเชิงรับรู้เพื่อรักษาเสียงใสและความละเอียด HD","รูปแบบวิดีโอและเสียงใดบ้างที่สามารถแปลงได้โดยตรงในเบราว์เซอร์?","คุณสามารถแปลง MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG และ AAC โดยไม่ต้องใช้ซอฟต์แวร์ภายนอก","การบันทึกเสียงและวิดีโอของฉันยังคงเป็นส่วนตัวและปลอดภัยหรือไม่?","ใช่ การประมวลผลเกิดขึ้นโดยตรงบนอุปกรณ์ของคุณผ่าน WebAssembly ด้วยความเป็นส่วนตัวอย่างสมบูรณ์"],
  vi:["Tôi có thể chuyển đổi và nén file âm thanh và video mà không mất chất lượng không?","Có. FileKit áp dụng bitrate thích ứng và mã hóa nhận thức để duy trì âm thanh trong trẻo và độ phân giải HD.","Những định dạng video và audio nào tôi có thể chuyển đổi trực tiếp trong trình duyệt?","Bạn có thể chuyển đổi MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG và AAC mà không cần phần mềm bên thứ ba.","Các bản ghi âm và video của tôi có được giữ riêng tư và an toàn không?","Có. Quá trình xử lý diễn ra trực tiếp trên thiết bị của bạn qua WebAssembly với sự riêng tư hoàn toàn."],
  fil:["Maaari ba akong mag-convert at mag-compress ng audio at video files nang walang quality loss?","Oo. Gumagamit ang FileKit ng adaptive bitrate at perceptual encoding para sa kristal na malinaw na tunog at HD resolution.","Anong video at audio formats ang maaari kong i-convert direkta sa browser?","Maaari kang mag-convert ng MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, at AAC nang walang third-party software.","Nananatiling pribado at ligtas ba ang aking audio at video recordings?","Oo. Ang pagproseso ay nangyayari direkta sa iyong device sa pamamagitan ng WebAssembly na may buong privacy."],
  ja:["品質を損なわずにオーディオやビデオファイルを変換・圧縮できますか？","はい。FileKitはアダプティブビットレートとパーセプチュアルエンコーディングを適用し、クリスタルクリアなサウンドとHD解像度を維持します。","ブラウザで直接変換できるビデオ・オーディオフォーマットは？","MP4、MOV、AVI、MKV、WebM、MP3、WAV、FLAC、M4A、OGG、AACをサードパーティソフトなしで変換できます。","オーディオやビデオの録音は安全でプライベートですか？","はい。処理はWebAssemblyを通じてお使いのデバイス上で直接行われ、完全なプライバシーが保証されます。"],
  ko:["품질 손실 없이 오디오 및 비디오 파일을 변환하고 압축할 수 있나요?","네. FileKit은 적응형 비트레이트와 지각 인코딩을 적용하여 수정처럼 맑은 소리와 HD 해상도를 유지합니다.","브라우저에서 직접 변환할 수 있는 비디오 및 오디오 형식은?","MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, AAC를 제3자 소프트웨어 없이 변환할 수 있습니다.","내 오디오 및 비디오 녹음은 안전하게 비공개로 유지되나요?","네. 처리는 WebAssembly를 통해 기기에서 직접 수행되어 완전한 프라이버시가 보장됩니다."],
  "zh-CN":["我可以在不损失质量的情况下转换和压缩音频视频文件吗？","可以。FileKit 应用自适应比特率和感知编码来保持水晶般清晰的声音和高清分辨率。","在浏览器中可以直接转换哪些音视频格式？","您可以转换 MP4、MOV、AVI、MKV、WebM、MP3、WAV、FLAC、M4A、OGG 和 AAC，无需第三方软件。","我的音频和视频录音会保持私密和安全吗？","是的。处理通过 WebAssembly 直接在您的设备上进行，确保完全隐私。"],
  "zh-TW":["我可以在不損失品質的情況下轉換和壓縮音訊影片檔案嗎？","可以。FileKit 應用自適應位元率和感知編碼來保持水晶般清晰的聲音和高清解析度。","在瀏覽器中可以直接轉換哪些音訊影片格式？","您可以轉換 MP4、MOV、AVI、MKV、WebM、MP3、WAV、FLAC、M4A、OGG 和 AAC，無需第三方軟體。","我的音訊和影片錄音會保持私密和安全嗎？","是的。處理透過 WebAssembly 直接在您的裝置上進行，確保完全隱私。"]
};
for (const [loc, qa] of Object.entries(avData)) set("audio_video", loc, qa);

// PDF
const pdfData = {
  en:["Is FileKit completely free with no hidden subscriptions or limits?","Yes. All essential PDF conversion, compression, editing, OCR, and merging tools are 100% free with no account creation required.","Are my sensitive PDF documents and signatures kept private?","Absolutely. FileKit processes documents locally inside your browser sandbox. Your confidential files never touch our servers.","Does FileKit preserve text formatting, embedded fonts, and page layouts?","Yes. The engine strictly adheres to ISO PDF standards, preserving vector graphics, form fields, and crisp typography."],
  es:["¿Es FileKit completamente gratuito sin suscripciones ni límites ocultos?","Sí. Todas las herramientas de conversión, compresión, edición, OCR y unión de PDF son 100% gratuitas sin necesidad de crear cuenta.","¿Mis documentos PDF confidenciales y firmas se mantienen privados?","Totalmente. FileKit procesa los documentos localmente en tu navegador. Tus archivos nunca tocan nuestros servidores.","¿FileKit conserva el formato del texto, fuentes incrustadas y diseños de página?","Sí. El motor cumple rigurosamente con los estándares ISO de PDF, preservando gráficos vectoriales y tipografía."],
  "es-419":["¿FileKit es completamente gratuito sin suscripciones ocultas?","Sí. Todas las herramientas de conversión, compresión, edición, OCR y unión de PDF son 100% gratuitas sin crear cuenta.","¿Mis documentos PDF confidenciales se mantienen privados?","Totalmente. FileKit procesa documentos localmente en tu navegador. Tus archivos nunca salen de tu dispositivo.","¿FileKit conserva formato de texto, fuentes y diseño de página?","Sí. El motor cumple con estándares ISO PDF, preservando gráficos vectoriales, campos de formulario y tipografía."],
  de:["Ist FileKit wirklich kostenlos ohne versteckte Abonnements?","Ja. Alle PDF-Werkzeuge für Konvertierung, Komprimierung, Bearbeitung, OCR und Zusammenführen sind 100% kostenlos ohne Kontopflicht.","Bleiben meine sensiblen PDF-Dokumente und Unterschriften privat?","Absolut. FileKit verarbeitet Dokumente lokal in Ihrem Browser. Vertrauliche Dateien berühren niemals unsere Server.","Behält FileKit Textformatierung, eingebettete Schriften und Seitenlayouts bei?","Ja. Die Engine hält sich streng an ISO-PDF-Standards und bewahrt Vektorgrafiken, Formularfelder und Typografie."],
  fr:["FileKit est-il entièrement gratuit sans abonnement caché ?","Oui. Tous les outils de conversion, compression, édition, OCR et fusion PDF sont 100% gratuits sans création de compte.","Mes documents PDF sensibles et signatures restent-ils confidentiels ?","Absolument. FileKit traite les documents localement dans votre navigateur. Vos fichiers ne touchent jamais nos serveurs.","FileKit préserve-t-il le formatage du texte, les polices et les mises en page ?","Oui. Le moteur respecte strictement les normes ISO PDF, préservant graphiques vectoriels, champs de formulaire et typographie."],
  pt:["O FileKit é completamente gratuito sem subscrições ocultas?","Sim. Todas as ferramentas de conversão, compressão, edição, OCR e união de PDF são 100% gratuitas sem criar conta.","Os meus documentos PDF sensíveis e assinaturas permanecem privados?","Absolutamente. O FileKit processa documentos localmente no seu navegador. Os seus ficheiros nunca tocam nos nossos servidores.","O FileKit preserva formatação de texto, fontes e layouts de página?","Sim. O motor cumpre rigorosamente as normas ISO PDF, preservando gráficos vetoriais, campos de formulário e tipografia."],
  "pt-BR":["O FileKit é completamente gratuito sem assinaturas ocultas?","Sim. Todas as ferramentas de conversão, compressão, edição, OCR e união de PDF são 100% gratuitas sem criar conta.","Meus documentos PDF confidenciais e assinaturas permanecem privados?","Absolutamente. O FileKit processa documentos localmente no seu navegador. Seus arquivos nunca tocam nossos servidores.","O FileKit preserva formatação de texto, fontes e layouts de página?","Sim. O motor segue rigorosamente as normas ISO PDF, preservando gráficos vetoriais, campos de formulário e tipografia."],
  it:["FileKit è completamente gratuito senza abbonamenti nascosti?","Sì. Tutti gli strumenti di conversione, compressione, modifica, OCR e unione PDF sono 100% gratuiti senza creare un account.","I miei documenti PDF sensibili e le firme restano privati?","Assolutamente. FileKit elabora i documenti localmente nel browser. I tuoi file non toccano mai i nostri server.","FileKit preserva formattazione del testo, font incorporati e layout di pagina?","Sì. Il motore rispetta rigorosamente gli standard ISO PDF, preservando grafica vettoriale, campi modulo e tipografia."],
  nl:["Is FileKit volledig gratis zonder verborgen abonnementen?","Ja. Alle PDF-conversie, compressie, bewerking, OCR en samenvoegtools zijn 100% gratis zonder accountaanmaak.","Blijven mijn gevoelige PDF-documenten en handtekeningen privé?","Absoluut. FileKit verwerkt documenten lokaal in uw browser. Uw bestanden raken nooit onze servers.","Behoudt FileKit tekstopmaak, ingesloten lettertypen en paginalay-outs?","Ja. De engine houdt zich strikt aan ISO PDF-standaarden en bewaart vectorafbeeldingen, formuliervelden en typografie."],
  ca:["FileKit és completament gratuït sense subscripcions ocultes?","Sí. Totes les eines de conversió, compressió, edició, OCR i fusió de PDF són 100% gratuïtes sense crear compte.","Els meus documents PDF sensibles i signatures es mantenen privats?","Absolutament. FileKit processa documents localment al navegador. Els fitxers mai toquen els nostres servidors.","FileKit conserva el format del text, les fonts i els dissenys de pàgina?","Sí. El motor compleix rigorosament els estàndards ISO PDF, preservant gràfics vectorials i tipografia."],
  sv:["Är FileKit helt gratis utan dolda prenumerationer?","Ja. Alla PDF-verktyg för konvertering, komprimering, redigering, OCR och sammanslagning är 100% gratis utan kontoregistrering.","Förblir mina känsliga PDF-dokument och signaturer privata?","Absolut. FileKit bearbetar dokument lokalt i din webbläsare. Dina filer berör aldrig våra servrar.","Bevarar FileKit textformatering, inbäddade typsnitt och sidlayouter?","Ja. Motorn följer strikt ISO PDF-standarder och bevarar vektorgrafik, formulärfält och typografi."],
  da:["Er FileKit helt gratis uden skjulte abonnementer?","Ja. Alle PDF-konverterings-, komprimerings-, redigerings-, OCR- og sammenlægningsværktøjer er 100% gratis uden kontooprettelse.","Forbliver mine følsomme PDF-dokumenter og underskrifter private?","Absolut. FileKit behandler dokumenter lokalt i din browser. Dine filer berører aldrig vores servere.","Bevarer FileKit tekstformatering, indlejrede skrifttyper og sidelayouts?","Ja. Motoren overholder strengt ISO PDF-standarder og bevarer vektorgrafik, formularfelter og typografi."],
  fi:["Onko FileKit täysin ilmainen ilman piilotettuja tilauksia?","Kyllä. Kaikki PDF-muunnos-, pakkaus-, muokkaus-, OCR- ja yhdistämistyökalut ovat 100% ilmaisia ilman tilin luomista.","Pysyvätkö arkaluonteiset PDF-asiakirjani ja allekirjoitukseni yksityisinä?","Ehdottomasti. FileKit käsittelee asiakirjat paikallisesti selaimessasi. Tiedostosi eivät koskaan kosketa palvelimiamme.","Säilyttääkö FileKit tekstin muotoilun, upotetut fontit ja sivuasettelut?","Kyllä. Moottori noudattaa tiukasti ISO PDF -standardeja ja säilyttää vektorigrafiikan, lomakekentät ja typografian."],
  no:["Er FileKit helt gratis uten skjulte abonnementer?","Ja. Alle PDF-konverterings-, komprimerings-, redigerings-, OCR- og sammenslåingsverktøy er 100% gratis uten kontoregistrering.","Forblir mine sensitive PDF-dokumenter og signaturer private?","Absolutt. FileKit behandler dokumenter lokalt i nettleseren. Filene dine berører aldri våre servere.","Bevarer FileKit tekstformatering, innebygde skrifttyper og sidelayout?","Ja. Motoren overholder strengt ISO PDF-standarder og bevarer vektorgrafikk, skjemafelt og typografi."],
  pl:["Czy FileKit jest całkowicie darmowy bez ukrytych subskrypcji?","Tak. Wszystkie narzędzia do konwersji, kompresji, edycji, OCR i łączenia PDF są w 100% darmowe bez tworzenia konta.","Czy moje wrażliwe dokumenty PDF i podpisy pozostają prywatne?","Absolutnie. FileKit przetwarza dokumenty lokalnie w przeglądarce. Twoje pliki nigdy nie trafiają na nasze serwery.","Czy FileKit zachowuje formatowanie tekstu, osadzone czcionki i układy stron?","Tak. Silnik ściśle przestrzega standardów ISO PDF, zachowując grafikę wektorową, pola formularzy i typografię."],
  cs:["Je FileKit zcela zdarma bez skrytých předplatných?","Ano. Všechny nástroje pro konverzi, kompresi, úpravu, OCR a slučování PDF jsou 100% zdarma bez vytváření účtu.","Zůstávají mé citlivé PDF dokumenty a podpisy soukromé?","Rozhodně. FileKit zpracovává dokumenty lokálně v prohlížeči. Vaše soubory se nikdy nedotknou našich serverů.","Zachovává FileKit formátování textu, vložená písma a rozvržení stránek?","Ano. Motor striktně dodržuje standardy ISO PDF a zachovává vektorovou grafiku, pole formulářů a typografii."],
  hu:["A FileKit teljesen ingyenes rejtett előfizetések nélkül?","Igen. Minden PDF-konvertáló, tömörítő, szerkesztő, OCR és egyesítő eszköz 100%-ban ingyenes fiókregisztráció nélkül.","A bizalmas PDF-dokumentumaim és aláírásaim privátok maradnak?","Feltétlenül. A FileKit helyben dolgozza fel a dokumentumokat a böngészőben. Fájljai soha nem érintik szervereinket.","A FileKit megőrzi a szövegformázást, beágyazott betűtípusokat és oldalelrendezést?","Igen. A motor szigorúan betartja az ISO PDF-szabványokat, megőrizve a vektorgrafikát, űrlapmezőket és tipográfiát."],
  ro:["Este FileKit complet gratuit fără abonamente ascunse?","Da. Toate instrumentele de conversie, compresie, editare, OCR și fuzionare PDF sunt 100% gratuite fără creare de cont.","Documentele PDF sensibile și semnăturile mele rămân private?","Absolut. FileKit procesează documentele local în browserul dvs. Fișierele nu ating niciodată serverele noastre.","FileKit păstrează formatarea textului, fonturile încorporate și aspectul paginilor?","Da. Motorul respectă strict standardele ISO PDF, păstrând graficele vectoriale, câmpurile de formular și tipografia."],
  bg:["FileKit е напълно безплатен без скрити абонаменти?","Да. Всички инструменти за конвертиране, компресия, редактиране, OCR и сливане на PDF са 100% безплатни без създаване на акаунт.","Чувствителните ми PDF документи и подписи остават ли поверителни?","Абсолютно. FileKit обработва документите локално в браузъра ви. Файловете никога не достигат нашите сървъри.","FileKit запазва ли форматирането на текст, вградените шрифтове и оформлението на страниците?","Да. Двигателят стриктно спазва стандартите ISO PDF, запазвайки векторна графика, полета за формуляри и типография."],
  el:["Είναι το FileKit εντελώς δωρεάν χωρίς κρυφές συνδρομές;","Ναι. Όλα τα εργαλεία μετατροπής, συμπίεσης, επεξεργασίας, OCR και συγχώνευσης PDF είναι 100% δωρεάν χωρίς δημιουργία λογαριασμού.","Τα ευαίσθητα PDF έγγραφά μου και οι υπογραφές παραμένουν ιδιωτικά;","Απολύτως. Το FileKit επεξεργάζεται τα έγγραφα τοπικά στον browser σας. Τα αρχεία δεν αγγίζουν ποτέ τους servers μας.","Διατηρεί το FileKit τη μορφοποίηση κειμένου, τις ενσωματωμένες γραμματοσειρές και τη διάταξη;","Ναι. Ο κινητήρας τηρεί αυστηρά τα πρότυπα ISO PDF, διατηρώντας διανυσματικά γραφικά και τυπογραφία."],
  sk:["Je FileKit úplne zadarmo bez skrytých predplatných?","Áno. Všetky nástroje na konverziu, kompresiu, úpravu, OCR a zlučovanie PDF sú 100% zadarmo bez vytvárania účtu.","Zostávajú moje citlivé PDF dokumenty a podpisy súkromné?","Rozhodne. FileKit spracováva dokumenty lokálne v prehliadači. Vaše súbory sa nikdy nedotknú našich serverov.","Zachováva FileKit formátovanie textu, vložené písma a rozloženie stránok?","Áno. Motor striktne dodržiava štandardy ISO PDF a zachováva vektorovú grafiku, polia formulárov a typografiu."],
  sl:["Je FileKit popolnoma brezplačen brez skritih naročnin?","Da. Vsa orodja za pretvorbo, stiskanje, urejanje, OCR in združevanje PDF so 100% brezplačna brez ustvarjanja računa.","Ali moji občutljivi PDF dokumenti in podpisi ostanejo zasebni?","Absolutno. FileKit obdeluje dokumente lokalno v brskalniku. Vaše datoteke nikoli ne pridejo do naših strežnikov.","Ali FileKit ohranja oblikovanje besedila, vdelane pisave in postavitve strani?","Da. Motor se strogo drži standardov ISO PDF in ohranja vektorsko grafiko, polja obrazcev in tipografijo."],
  ru:["FileKit полностью бесплатный без скрытых подписок?","Да. Все инструменты конвертации, сжатия, редактирования, OCR и объединения PDF на 100% бесплатны без регистрации.","Мои конфиденциальные PDF-документы и подписи остаются приватными?","Безусловно. FileKit обрабатывает документы локально в вашем браузере. Ваши файлы никогда не попадают на наши серверы.","Сохраняет ли FileKit форматирование текста, встроенные шрифты и макеты страниц?","Да. Движок строго соблюдает стандарты ISO PDF, сохраняя векторную графику, поля форм и типографику."],
  uk:["FileKit повністю безкоштовний без прихованих підписок?","Так. Усі інструменти конвертації, стиснення, редагування, OCR та об'єднання PDF на 100% безкоштовні без реєстрації.","Мої конфіденційні PDF-документи та підписи залишаються приватними?","Безумовно. FileKit обробляє документи локально у вашому браузері. Ваші файли ніколи не потрапляють на наші сервери.","Чи зберігає FileKit форматування тексту, вбудовані шрифти та макети сторінок?","Так. Двигун суворо дотримується стандартів ISO PDF, зберігаючи векторну графіку, поля форм та типографіку."],
  lv:["Vai FileKit ir pilnībā bezmaksas bez slēptām abonementiem?","Jā. Visi PDF konvertēšanas, saspiešanas, rediģēšanas, OCR un apvienošanas rīki ir 100% bezmaksas bez konta izveides.","Vai mani sensitīvie PDF dokumenti un paraksti paliek privāti?","Pilnīgi. FileKit apstrādā dokumentus lokāli jūsu pārlūkprogrammā. Jūsu faili nekad nesasniedz mūsu serverus.","Vai FileKit saglabā teksta formatēšanu, iegultos fontus un lapu izkārtojumu?","Jā. Dzinējs stingri ievēro ISO PDF standartus, saglabājot vektorgrafiku, veidlapu laukus un tipogrāfiju."],
  lt:["Ar FileKit yra visiškai nemokamas be paslėptų prenumeratų?","Taip. Visi PDF konvertavimo, suspaudimo, redagavimo, OCR ir sujungimo įrankiai yra 100% nemokami be paskyros kūrimo.","Ar mano jautrūs PDF dokumentai ir parašai lieka privatūs?","Visiškai. FileKit apdoroja dokumentus lokaliai jūsų naršyklėje. Jūsų failai niekada nepasiekia mūsų serverių.","Ar FileKit išsaugo teksto formatavimą, įterptus šriftus ir puslapių maketus?","Taip. Variklis griežtai laikosi ISO PDF standartų, išsaugodamas vektorinę grafiką, formos laukus ir tipografiją."],
  tr:["FileKit gizli abonelikler olmadan tamamen ücretsiz mi?","Evet. Tüm PDF dönüştürme, sıkıştırma, düzenleme, OCR ve birleştirme araçları hesap oluşturmadan %100 ücretsizdir.","Hassas PDF belgelerim ve imzalarım gizli kalıyor mu?","Kesinlikle. FileKit belgeleri tarayıcınızda yerel olarak işler. Dosyalarınız asla sunucularımıza ulaşmaz.","FileKit metin biçimlendirmesini, gömülü fontları ve sayfa düzenlerini korur mu?","Evet. Motor ISO PDF standartlarına sıkı sıkıya bağlıdır; vektör grafikleri, form alanlarını ve tipografiyi korur."],
  ar:["هل FileKit مجاني تماماً بدون اشتراكات مخفية؟","نعم. جميع أدوات تحويل وضغط وتحرير ودمج PDF مجانية 100% بدون إنشاء حساب.","هل تبقى مستنداتي PDF الحساسة وتوقيعاتي خاصة؟","بالتأكيد. يعالج FileKit المستندات محلياً في متصفحك. ملفاتك لا تصل أبداً إلى خوادمنا.","هل يحافظ FileKit على تنسيق النص والخطوط المضمنة وتخطيطات الصفحات؟","نعم. يلتزم المحرك بمعايير ISO PDF بصرامة مع الحفاظ على الرسومات المتجهة وحقول النماذج والطباعة."],
  he:["האם FileKit חינמי לחלוטין ללא מנויים נסתרים?","כן. כל כלי ההמרה, הדחיסה, העריכה, ה-OCR ומיזוג PDF הם חינמיים ב-100% ללא צורך ביצירת חשבון.","האם מסמכי ה-PDF הרגישים והחתימות שלי נשמרים פרטיים?","בהחלט. FileKit מעבד מסמכים מקומית בדפדפן שלך. הקבצים לעולם לא מגיעים לשרתים שלנו.","האם FileKit שומר על עיצוב טקסט, גופנים מוטמעים ופריסות עמודים?","כן. המנוע מקפיד על תקני ISO PDF ושומר על גרפיקה וקטורית, שדות טפסים וטיפוגרפיה."],
  hi:["क्या FileKit वाकई पूरी तरह से मुफ्त है बिना छिपी सदस्यता के?","हाँ। सभी PDF कन्वर्शन, कंप्रेशन, एडिटिंग, OCR और मर्जिंग टूल 100% मुफ्त हैं बिना खाता बनाए।","क्या मेरे संवेदनशील PDF दस्तावेज़ और हस्ताक्षर निजी रहते हैं?","बिल्कुल। FileKit दस्तावेज़ों को स्थानीय रूप से ब्राउज़र में प्रोसेस करता है। आपकी फ़ाइलें हमारे सर्वर को कभी नहीं छूतीं।","क्या FileKit टेक्स्ट फ़ॉर्मेटिंग, एम्बेडेड फ़ॉन्ट और पेज लेआउट सुरक्षित रखता है?","हाँ। इंजन ISO PDF मानकों का कड़ाई से पालन करता है, वेक्टर ग्राफ़िक्स, फ़ॉर्म फ़ील्ड और टाइपोग्राफ़ी को संरक्षित करता है।"],
  id:["Apakah FileKit benar-benar gratis tanpa langganan tersembunyi?","Ya. Semua alat konversi, kompresi, pengeditan, OCR, dan penggabungan PDF 100% gratis tanpa pembuatan akun.","Apakah dokumen PDF sensitif dan tanda tangan saya tetap pribadi?","Tentu saja. FileKit memproses dokumen secara lokal di browser Anda. File Anda tidak pernah menyentuh server kami.","Apakah FileKit mempertahankan pemformatan teks, font tertanam, dan tata letak halaman?","Ya. Mesin secara ketat mengikuti standar ISO PDF, mempertahankan grafik vektor, bidang formulir, dan tipografi."],
  ms:["Adakah FileKit percuma sepenuhnya tanpa langganan tersembunyi?","Ya. Semua alat penukaran, pemampatan, penyuntingan, OCR dan penggabungan PDF adalah 100% percuma tanpa membuat akaun.","Adakah dokumen PDF sensitif dan tandatangan saya kekal peribadi?","Sudah tentu. FileKit memproses dokumen secara setempat dalam pelayar anda. Fail anda tidak pernah menyentuh pelayan kami.","Adakah FileKit mengekalkan pemformatan teks, fon terbenam dan susun atur halaman?","Ya. Enjin mematuhi standard ISO PDF dengan ketat, mengekalkan grafik vektor, medan borang dan tipografi."],
  th:["FileKit ฟรีทั้งหมดจริงๆ โดยไม่มีการสมัครสมาชิกที่ซ่อนอยู่หรือไม่?","ใช่ เครื่องมือแปลง บีบอัด แก้ไข OCR และรวม PDF ทั้งหมดฟรี 100% โดยไม่ต้องสร้างบัญชี","เอกสาร PDF ที่ละเอียดอ่อนและลายเซ็นของฉันยังคงเป็นส่วนตัวหรือไม่?","แน่นอน FileKit ประมวลผลเอกสารในเครื่องภายในเบราว์เซอร์ ไฟล์ของคุณไม่เคยถูกส่งไปยังเซิร์ฟเวอร์ของเรา","FileKit รักษาการจัดรูปแบบข้อความ ฟอนต์ที่ฝัง และเค้าโครงหน้าหรือไม่?","ใช่ เอ็นจิ้นปฏิบัติตามมาตรฐาน ISO PDF อย่างเคร่งครัด รักษากราฟิกเวกเตอร์ ฟิลด์ฟอร์ม และรูปแบบตัวอักษร"],
  vi:["FileKit có hoàn toàn miễn phí không có đăng ký ẩn không?","Có. Tất cả công cụ chuyển đổi, nén, chỉnh sửa, OCR và hợp nhất PDF đều miễn phí 100% mà không cần tạo tài khoản.","Tài liệu PDF nhạy cảm và chữ ký của tôi có được giữ riêng tư không?","Hoàn toàn. FileKit xử lý tài liệu cục bộ trong trình duyệt. File của bạn không bao giờ chạm đến máy chủ của chúng tôi.","FileKit có giữ nguyên định dạng văn bản, font nhúng và bố cục trang không?","Có. Bộ xử lý tuân thủ nghiêm ngặt tiêu chuẩn ISO PDF, bảo toàn đồ họa vector, trường biểu mẫu và kiểu chữ."],
  fil:["Libre ba talaga ang FileKit nang walang hidden subscriptions?","Oo. Lahat ng PDF conversion, compression, editing, OCR, at merging tools ay 100% libre nang walang account creation.","Nananatiling private ba ang aking sensitibong PDF documents at signatures?","Oo naman. Pinoproseso ng FileKit ang mga dokumento nang lokal sa iyong browser. Ang iyong mga file ay hindi kailanman umaabot sa aming servers.","Pinapanatili ba ng FileKit ang text formatting, embedded fonts, at page layouts?","Oo. Mahigpit na sinusunod ng engine ang ISO PDF standards, pinapanatili ang vector graphics, form fields, at typography."],
  ja:["FileKitは隠れたサブスクリプションなしで完全に無料ですか？","はい。すべてのPDF変換、圧縮、編集、OCR、結合ツールはアカウント作成不要で100%無料です。","機密PDFドキュメントと署名はプライベートに保たれますか？","もちろんです。FileKitはドキュメントをブラウザ内でローカル処理します。ファイルが当社のサーバーに触れることはありません。","FileKitはテキストの書式設定、埋め込みフォント、ページレイアウトを保持しますか？","はい。エンジンはISO PDF標準に厳密に準拠し、ベクターグラフィックス、フォームフィールド、タイポグラフィを保持します。"],
  ko:["FileKit은 숨겨진 구독 없이 완전히 무료인가요?","네. 모든 PDF 변환, 압축, 편집, OCR 및 병합 도구는 계정 생성 없이 100% 무료입니다.","민감한 PDF 문서와 서명은 비공개로 유지되나요?","물론입니다. FileKit은 브라우저에서 로컬로 문서를 처리합니다. 파일이 서버에 전달되지 않습니다.","FileKit은 텍스트 서식, 임베디드 폰트 및 페이지 레이아웃을 유지하나요?","네. 엔진은 ISO PDF 표준을 엄격히 준수하여 벡터 그래픽, 양식 필드 및 타이포그래피를 보존합니다."],
  "zh-CN":["FileKit 真的完全免费没有隐藏订阅吗？","是的。所有 PDF 转换、压缩、编辑、OCR 和合并工具均 100% 免费，无需创建账户。","我的敏感 PDF 文档和签名是否保持私密？","当然。FileKit 在浏览器中本地处理文档。您的文件永远不会触及我们的服务器。","FileKit 是否保留文本格式、嵌入字体和页面布局？","是的。引擎严格遵循 ISO PDF 标准，保留矢量图形、表单字段和排版。"],
  "zh-TW":["FileKit 真的完全免費沒有隱藏訂閱嗎？","是的。所有 PDF 轉換、壓縮、編輯、OCR 和合併工具均 100% 免費，無需建立帳號。","我的敏感 PDF 文件和簽名是否保持私密？","當然。FileKit 在瀏覽器中本機處理文件。您的檔案永遠不會觸及我們的伺服器。","FileKit 是否保留文字格式、嵌入字型和頁面佈局？","是的。引擎嚴格遵循 ISO PDF 標準，保留向量圖形、表單欄位和排版。"]
};
for (const [loc, qa] of Object.entries(pdfData)) set("pdf", loc, qa);

// ── Generate TypeScript ──
let ts = `import { SupportedLocale } from "../i18n/locales";
import { ToolFamilyKey } from "./categories";
import { FaqItem } from "./toolFaqs";

// Complete 39-locale × 7 family FAQ matrix — zero English fallback for non-English routes
export const FAMILY_FAQS: Record<ToolFamilyKey, Partial<Record<SupportedLocale, FaqItem[]>>> = {\n`;

for (const fam of FAMILIES) {
  ts += `  ${fam}: {\n`;
  for (const loc of LOCALES) {
    const qa = DATA[fam]?.[loc];
    if (!qa) continue;
    const key = loc.includes('-') ? `"${loc}"` : loc;
    ts += `    ${key}: [\n`;
    for (let i = 0; i < qa.length; i += 2) {
      const q = qa[i].replace(/\\/g,'\\\\').replace(/"/g,'\\"');
      const a = qa[i+1].replace(/\\/g,'\\\\').replace(/"/g,'\\"');
      ts += `      { question: "${q}", answer: "${a}" }${i+2 < qa.length ? ',' : ''}\n`;
    }
    ts += `    ],\n`;
  }
  ts += `  },\n`;
}

ts += `};\n`;

writeFileSync(OUT, ts, 'utf-8');

// Verify
const localeCount = {};
for (const fam of FAMILIES) {
  localeCount[fam] = Object.keys(DATA[fam] || {}).length;
}
console.log('✅ Generated familyFaqs.ts');
console.log('Locale counts per family:', JSON.stringify(localeCount));
console.log(`Total FAQ items: ${FAMILIES.reduce((sum, f) => sum + (localeCount[f] || 0) * 3, 0)}`);
