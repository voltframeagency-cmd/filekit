import { SupportedLocale } from "../i18n/locales";
import { ToolFamilyKey } from "./categories";
import { FaqItem } from "./toolFaqs";

// Complete 39-locale × 7 family FAQ matrix — zero English fallback for non-English routes
export const FAMILY_FAQS: Record<ToolFamilyKey, Partial<Record<SupportedLocale, FaqItem[]>>> = {
  cad: {
    en: [
      { question: "Do I need AutoCAD installed to convert DWG or DXF files?", answer: "No. FileKit processes AutoCAD DWG and DXF blueprints directly in your web browser using client-side vector parsing engines, completely eliminating the need for expensive software licenses." },
      { question: "Will vector layers, lineweights, and architectural dimensions be preserved?", answer: "Yes. All line geometries, text annotations, coordinate systems, and architectural dimensions are rendered with exact vector fidelity." },
      { question: "Is my proprietary engineering drawing uploaded to a third-party server?", answer: "Never. Your files are processed locally within your browser sandbox. Your intellectual property and blueprints never leave your device." }
    ],
    es: [
      { question: "¿Necesito AutoCAD instalado para convertir archivos DWG o DXF?", answer: "No. FileKit procesa planos AutoCAD DWG y DXF directamente en tu navegador sin necesidad de licencias costosas." },
      { question: "¿Se conservan las capas vectoriales, grosores de línea y cotas?", answer: "Sí. Todas las geometrías, anotaciones de texto y cotas arquitectónicas se representan con total precisión vectorial." },
      { question: "¿Se suben mis planos de ingeniería a servidores externos?", answer: "Nunca. Los archivos se procesan localmente en tu navegador. Tus planos y propiedad intelectual nunca salen de tu dispositivo." }
    ],
    "es-419": [
      { question: "¿Necesito tener instalado AutoCAD para convertir archivos DWG o DXF?", answer: "No. FileKit procesa planos AutoCAD DWG y DXF directamente en tu navegador web sin requerir software costoso." },
      { question: "¿Se mantienen las capas vectoriales, grosores de línea y dimensiones?", answer: "Sí. Todas las geometrías de línea, cotas y anotaciones se convierten con máxima fidelidad vectorial." },
      { question: "¿Mis planos de ingeniería se suben a servidores de terceros?", answer: "Jamás. Tus archivos se procesan de forma 100% local en tu dispositivo con total privacidad." }
    ],
    de: [
      { question: "Benötige ich AutoCAD, um DWG- oder DXF-Dateien zu konvertieren?", answer: "Nein. FileKit verarbeitet AutoCAD-Pläne direkt im Webbrowser, ohne dass teure Softwarelizenzen erforderlich sind." },
      { question: "Bleiben Vektorebenen, Linienstärken und Maße erhalten?", answer: "Ja. Alle Liniengeometrien, Textanmerkungen und Architekturmaße werden mit exakter Vektorgenauigkeit dargestellt." },
      { question: "Werden meine Konstruktionszeichnungen auf externe Server hochgeladen?", answer: "Niemals. Ihre Dateien werden lokal im Browser verarbeitet und verlassen Ihr Gerät zu keinem Zeitpunkt." }
    ],
    fr: [
      { question: "Ai-je besoin d'AutoCAD pour convertir des fichiers DWG ou DXF ?", answer: "Non. FileKit traite les plans AutoCAD DWG et DXF directement dans votre navigateur web sans licence logicielle coûteuse." },
      { question: "Les calques vectoriels, épaisseurs de trait et cotes sont-ils conservés ?", answer: "Oui. Toutes les géométries, annotations textuelles et cotes architecturales sont rendues avec une fidélité vectorielle absolue." },
      { question: "Mes plans d'ingénierie sont-ils téléversés sur un serveur tiers ?", answer: "Jamais. Vos fichiers sont traités localement dans votre navigateur. Votre propriété intellectuelle ne quitte jamais votre appareil." }
    ],
    pt: [
      { question: "Preciso do AutoCAD instalado para converter ficheiros DWG ou DXF?", answer: "Não. O FileKit processa plantas AutoCAD DWG e DXF diretamente no seu navegador sem necessidade de licenças caras." },
      { question: "As camadas vetoriais, espessuras de linha e cotas são preservadas?", answer: "Sim. Todas as geometrias, anotações de texto e cotas arquitetónicas são convertidas com exatidão vetorial." },
      { question: "Os meus desenhos de engenharia são enviados para servidores externos?", answer: "Nunca. Os seus ficheiros são processados localmente no navegador e nunca saem do seu dispositivo." }
    ],
    "pt-BR": [
      { question: "Preciso ter o AutoCAD instalado para converter arquivos DWG ou DXF?", answer: "Não. O FileKit processa plantas AutoCAD DWG e DXF diretamente no seu navegador sem necessidade de softwares caros." },
      { question: "As camadas vetoriais, espessuras de linha e cotas são mantidas?", answer: "Sim. Todas as geometrias, anotações e dimensões arquitetônicas são renderizadas com total fidelidade vetorial." },
      { question: "Meus projetos de engenharia são enviados para servidores externos?", answer: "Nunca. Seus arquivos são processados localmente no seu dispositivo com total privacidade." }
    ],
    it: [
      { question: "Devo avere AutoCAD installato per convertire file DWG o DXF?", answer: "No. FileKit elabora i progetti AutoCAD DWG e DXF direttamente nel browser web senza bisogno di costose licenze software." },
      { question: "I livelli vettoriali, gli spessori di linea e le quote vengono conservati?", answer: "Sì. Tutte le geometrie di linea, le annotazioni di testo e le dimensioni architettoniche mantengono la massima fedeltà vettoriale." },
      { question: "I miei disegni tecnici vengono caricati su server terzi?", answer: "Mai. I tuoi file vengono elaborati localmente nel browser e non lasciano mai il tuo dispositivo." }
    ],
    nl: [
      { question: "Heb ik AutoCAD nodig om DWG- of DXF-bestanden te converteren?", answer: "Nee. FileKit verwerkt AutoCAD DWG- en DXF-bestanden rechtstreeks in uw webbrowser zonder dure softwarelicenties." },
      { question: "Blijven vectorlagen, lijngewichten en architecturale afmetingen behouden?", answer: "Ja. Alle lijngeometrieën, tekstannotaties en architecturale afmetingen worden met exacte vectornauwkeurigheid weergegeven." },
      { question: "Worden mijn technische tekeningen naar een externe server geüpload?", answer: "Nooit. Uw bestanden worden lokaal in uw browser verwerkt en verlaten nooit uw apparaat." }
    ],
    ca: [
      { question: "Necessito AutoCAD instal·lat per convertir fitxers DWG o DXF?", answer: "No. FileKit processa plànols AutoCAD DWG i DXF directament al vostre navegador sense necessitat de llicències costoses." },
      { question: "Es conserven les capes vectorials, gruixos de línia i cotes arquitectòniques?", answer: "Sí. Totes les geometries, anotacions de text i cotes es representen amb total fidelitat vectorial." },
      { question: "Els meus plànols d'enginyeria es pugen a servidors externs?", answer: "Mai. Els fitxers es processen localment al navegador i mai surten del vostre dispositiu." }
    ],
    sv: [
      { question: "Behöver jag AutoCAD för att konvertera DWG- eller DXF-filer?", answer: "Nej. FileKit bearbetar AutoCAD DWG- och DXF-ritningar direkt i din webbläsare utan dyra programvarulicenser." },
      { question: "Bevaras vektorlager, linjetjocklekar och arkitektoniska mått?", answer: "Ja. Alla linjegeometrier, textanteckningar och arkitektoniska mått renderas med exakt vektornoggrannhet." },
      { question: "Laddas mina konstruktionsritningar upp till en extern server?", answer: "Aldrig. Dina filer bearbetas lokalt i din webbläsare och lämnar aldrig din enhet." }
    ],
    da: [
      { question: "Skal jeg have AutoCAD installeret for at konvertere DWG- eller DXF-filer?", answer: "Nej. FileKit behandler AutoCAD DWG- og DXF-tegninger direkte i din webbrowser uden dyre softwarelicenser." },
      { question: "Bevares vektorlag, linjetykkelser og arkitektoniske mål?", answer: "Ja. Alle linjegeometrier, tekstannotationer og arkitektoniske dimensioner gengives med præcis vektornøjagtighed." },
      { question: "Uploades mine ingeniørtegninger til en ekstern server?", answer: "Aldrig. Dine filer behandles lokalt i din browser og forlader aldrig din enhed." }
    ],
    fi: [
      { question: "Tarvitsenko AutoCADin DWG- tai DXF-tiedostojen muuntamiseen?", answer: "Ei. FileKit käsittelee AutoCAD DWG- ja DXF-piirustukset suoraan selaimessasi ilman kalliita ohjelmistolisenssejä." },
      { question: "Säilyvätkö vektoritasot, viivanpaksuudet ja arkkitehtoniset mitat?", answer: "Kyllä. Kaikki geometriat, tekstimerkinnät ja mitat renderöidään tarkalla vektoritarkkuudella." },
      { question: "Ladataanko tekniset piirustukseni ulkoiselle palvelimelle?", answer: "Ei koskaan. Tiedostot käsitellään paikallisesti selaimessasi eivätkä ne koskaan poistu laitteeltasi." }
    ],
    no: [
      { question: "Trenger jeg AutoCAD for å konvertere DWG- eller DXF-filer?", answer: "Nei. FileKit behandler AutoCAD DWG- og DXF-tegninger direkte i nettleseren din uten dyre programvarelisenser." },
      { question: "Bevares vektorlag, linjevekter og arkitektoniske mål?", answer: "Ja. Alle linjegeometrier, tekstkommentarer og arkitektoniske dimensjoner gjengis med nøyaktig vektortroskap." },
      { question: "Lastes mine tekniske tegninger opp til en ekstern server?", answer: "Aldri. Filene dine behandles lokalt i nettleseren og forlater aldri enheten din." }
    ],
    pl: [
      { question: "Czy potrzebuję AutoCAD do konwersji plików DWG lub DXF?", answer: "Nie. FileKit przetwarza rysunki AutoCAD DWG i DXF bezpośrednio w przeglądarce bez kosztownych licencji." },
      { question: "Czy warstwy wektorowe, grubości linii i wymiary architektoniczne są zachowywane?", answer: "Tak. Wszystkie geometrie, adnotacje tekstowe i wymiary są renderowane z dokładnością wektorową." },
      { question: "Czy moje rysunki inżynierskie są przesyłane na serwer zewnętrzny?", answer: "Nigdy. Pliki przetwarzane są lokalnie w przeglądarce i nigdy nie opuszczają urządzenia." }
    ],
    cs: [
      { question: "Potřebuji AutoCAD k převodu souborů DWG nebo DXF?", answer: "Ne. FileKit zpracovává výkresy AutoCAD DWG a DXF přímo ve vašem prohlížeči bez drahých softwarových licencí." },
      { question: "Zachovají se vektorové vrstvy, tloušťky čar a architektonické kóty?", answer: "Ano. Všechny geometrie, textové anotace a rozměry jsou vykresleny s přesnou vektorovou věrností." },
      { question: "Jsou mé inženýrské výkresy nahrány na externí server?", answer: "Nikdy. Vaše soubory jsou zpracovány lokálně v prohlížeči a nikdy neopustí vaše zařízení." }
    ],
    hu: [
      { question: "Szükségem van telepített AutoCAD-re a DWG vagy DXF fájlok konvertálásához?", answer: "Nem. A FileKit közvetlenül a böngészőben dolgozza fel az AutoCAD DWG és DXF rajzokat drága szoftverlicencek nélkül." },
      { question: "Megőrződnek a vektorrétegek, vonalvastagságok és építészeti méretek?", answer: "Igen. Minden geometria, szöveges megjegyzés és méret pontos vektor hűséggel jelenik meg." },
      { question: "Feltöltődnek a mérnöki rajzaim külső szerverre?", answer: "Soha. A fájlok helyben, a böngészőben kerülnek feldolgozásra, és soha nem hagyják el az eszközét." }
    ],
    ro: [
      { question: "Am nevoie de AutoCAD instalat pentru a converti fișiere DWG sau DXF?", answer: "Nu. FileKit procesează planuri AutoCAD DWG și DXF direct în browserul web fără licențe software costisitoare." },
      { question: "Se păstrează straturile vectoriale, grosimile liniilor și cotele arhitecturale?", answer: "Da. Toate geometriile, adnotările text și dimensiunile sunt redate cu fidelitate vectorială exactă." },
      { question: "Sunt desenele mele tehnice încărcate pe un server extern?", answer: "Niciodată. Fișierele sunt procesate local în browser și nu părăsesc niciodată dispozitivul." }
    ],
    bg: [
      { question: "Трябва ли ми AutoCAD за конвертиране на DWG или DXF файлове?", answer: "Не. FileKit обработва чертежи AutoCAD DWG и DXF директно в браузъра ви без скъпи софтуерни лицензи." },
      { question: "Запазват ли се векторните слоеве, дебелините на линиите и архитектурните размери?", answer: "Да. Всички геометрии, текстови анотации и размери се визуализират с точна векторна прецизност." },
      { question: "Качват ли се инженерните ми чертежи на външен сървър?", answer: "Никога. Файловете се обработват локално в браузъра и никога не напускат устройството ви." }
    ],
    el: [
      { question: "Χρειάζομαι το AutoCAD για να μετατρέψω αρχεία DWG ή DXF;", answer: "Όχι. Το FileKit επεξεργάζεται σχέδια AutoCAD DWG και DXF απευθείας στον browser σας χωρίς ακριβές άδειες λογισμικού." },
      { question: "Διατηρούνται τα διανυσματικά επίπεδα, τα πάχη γραμμών και οι αρχιτεκτονικές διαστάσεις;", answer: "Ναι. Όλες οι γεωμετρίες, οι σημειώσεις κειμένου και οι διαστάσεις αποδίδονται με ακριβή διανυσματική πιστότητα." },
      { question: "Μεταφορτώνονται τα μηχανικά μου σχέδια σε εξωτερικό διακομιστή;", answer: "Ποτέ. Τα αρχεία σας υποβάλλονται σε επεξεργασία τοπικά στον browser και δεν εγκαταλείπουν ποτέ τη συσκευή σας." }
    ],
    sk: [
      { question: "Potrebujem AutoCAD na konverziu súborov DWG alebo DXF?", answer: "Nie. FileKit spracováva výkresy AutoCAD DWG a DXF priamo vo vašom prehliadači bez drahých softvérových licencií." },
      { question: "Zachovajú sa vektorové vrstvy, hrúbky čiar a architektonické kóty?", answer: "Áno. Všetky geometrie, textové anotácie a rozmery sa vykreslia s presnou vektorovou vernosťou." },
      { question: "Nahrávajú sa moje inžinierske výkresy na externý server?", answer: "Nikdy. Vaše súbory sa spracúvajú lokálne v prehliadači a nikdy neopustia vaše zariadenie." }
    ],
    sl: [
      { question: "Ali potrebujem AutoCAD za pretvorbo datotek DWG ali DXF?", answer: "Ne. FileKit obdeluje načrte AutoCAD DWG in DXF neposredno v brskalniku brez dragih programskih licenc." },
      { question: "Ali se ohranijo vektorske plasti, debeline črt in arhitekturne mere?", answer: "Da. Vse geometrije, besedilne opombe in mere se upodobijo z natančno vektorsko zvestobo." },
      { question: "Ali se moji inženirski načrti naložijo na zunanji strežnik?", answer: "Nikoli. Vaše datoteke se obdelujejo lokalno v brskalniku in nikoli ne zapustijo vaše naprave." }
    ],
    ru: [
      { question: "Нужен ли AutoCAD для конвертации файлов DWG или DXF?", answer: "Нет. FileKit обрабатывает чертежи AutoCAD DWG и DXF прямо в браузере без дорогостоящих программных лицензий." },
      { question: "Сохраняются ли векторные слои, толщины линий и архитектурные размеры?", answer: "Да. Все геометрии, текстовые аннотации и размеры визуализируются с точной векторной точностью." },
      { question: "Загружаются ли мои чертежи на внешний сервер?", answer: "Никогда. Файлы обрабатываются локально в браузере и никогда не покидают ваше устройство." }
    ],
    uk: [
      { question: "Чи потрібен AutoCAD для конвертації файлів DWG або DXF?", answer: "Ні. FileKit обробляє креслення AutoCAD DWG та DXF безпосередньо у вашому браузері без дорогих ліцензій." },
      { question: "Чи зберігаються векторні шари, товщини ліній та архітектурні розміри?", answer: "Так. Усі геометрії, текстові анотації та розміри відтворюються з точною векторною вірністю." },
      { question: "Чи завантажуються мої інженерні креслення на зовнішній сервер?", answer: "Ніколи. Файли обробляються локально у браузері і ніколи не залишають ваш пристрій." }
    ],
    lv: [
      { question: "Vai man ir nepieciešams AutoCAD, lai konvertētu DWG vai DXF failus?", answer: "Nē. FileKit apstrādā AutoCAD DWG un DXF rasējumus tieši jūsu pārlūkprogrammā bez dārgām programmatūras licencēm." },
      { question: "Vai tiek saglabāti vektoru slāņi, līniju biezumi un arhitektūras izmēri?", answer: "Jā. Visas ģeometrijas, teksta anotācijas un izmēri tiek atveidoti ar precīzu vektora precizitāti." },
      { question: "Vai mani inženierijas rasējumi tiek augšupielādēti ārējā serverī?", answer: "Nekad. Jūsu faili tiek apstrādāti lokāli pārlūkprogrammā un nekad neatstāj jūsu ierīci." }
    ],
    lt: [
      { question: "Ar man reikia AutoCAD DWG ar DXF failams konvertuoti?", answer: "Ne. FileKit apdoroja AutoCAD DWG ir DXF brėžinius tiesiai jūsų naršyklėje be brangių programinės įrangos licencijų." },
      { question: "Ar išsaugomi vektoriniai sluoksniai, linijų storiai ir architektūriniai matmenys?", answer: "Taip. Visos geometrijos, teksto anotacijos ir matmenys pateikiami tiksliu vektoriniu tikslumu." },
      { question: "Ar mano inžineriniai brėžiniai įkeliami į išorinį serverį?", answer: "Niekada. Jūsų failai apdorojami lokaliai naršyklėje ir niekada nepalieka jūsų įrenginio." }
    ],
    tr: [
      { question: "DWG veya DXF dosyalarını dönüştürmek için AutoCAD kurulu olmalı mı?", answer: "Hayır. FileKit, AutoCAD DWG ve DXF çizimlerini pahalı yazılımlara gerek kalmadan doğrudan tarayıcınızda işler." },
      { question: "Vektör katmanları, çizgi kalınlıkları ve mimari ölçüler korunur mu?", answer: "Evet. Tüm çizgi geometrileri, metin notları ve mimari boyutlar tam vektör doğruluğu ile işlenir." },
      { question: "Mühendislik çizimlerim üçüncü taraf bir sunucuya yükleniyor mu?", answer: "Asla. Dosyalarınız tarayıcınızda yerel olarak işlenir ve cihazınızdan asla ayrılmaz." }
    ],
    ar: [
      { question: "هل أحتاج إلى تثبيت AutoCAD لتحويل ملفات DWG أو DXF؟", answer: "لا. يقوم FileKit بمعالجة مخططات AutoCAD DWG وDXF مباشرة في متصفحك دون الحاجة إلى تراخيص برامج باهظة الثمن." },
      { question: "هل يتم الحفاظ على الطبقات المتجهية وسمك الخطوط والأبعاد المعمارية؟", answer: "نعم. يتم عرض جميع الأشكال الهندسية والتعليقات التوضيحية والأبعاد بدقة متجهة متناهية." },
      { question: "هل يتم رفع مخططاتي الهندسية إلى خادم خارجي؟", answer: "مطلقاً. تتم معالجة ملفاتك محلياً داخل متصفحك ولا تغادر جهازك أبداً." }
    ],
    he: [
      { question: "האם אני צריך AutoCAD מותקן כדי להמיר קבצי DWG או DXF?", answer: "לא. FileKit מעבד שרטוטי AutoCAD DWG ו-DXF ישירות בדפדפן שלך ללא צורך ברישיונות תוכנה יקרים." },
      { question: "האם שכבות וקטוריות, עובי קווים ומידות אדריכליות נשמרים?", answer: "כן. כל הגיאומטריות, הערות הטקסט והמידות מעובדות בדיוק וקטורי מלא." },
      { question: "האם השרטוטים ההנדסיים שלי מועלים לשרת חיצוני?", answer: "לעולם לא. הקבצים מעובדים מקומית בדפדפן ולעולם לא עוזבים את המכשיר שלך." }
    ],
    hi: [
      { question: "क्या DWG या DXF फ़ाइलों को कन्वर्ट करने के लिए AutoCAD इंस्टॉल होना ज़रूरी है?", answer: "नहीं। FileKit आपके वेब ब्राउज़र में AutoCAD DWG और DXF ब्लूप्रिंट को सीधे प्रोसेस करता है, महंगे सॉफ़्टवेयर की ज़रूरत नहीं।" },
      { question: "क्या वेक्टर लेयर्स, लाइन की मोटाई और आर्किटेक्चरल डाइमेंशन सुरक्षित रहते हैं?", answer: "हाँ। सभी ज्यामिति, टेक्स्ट एनोटेशन और आयाम सटीक वेक्टर गुणवत्ता के साथ प्रस्तुत होते हैं।" },
      { question: "क्या मेरे इंजीनियरिंग ड्रॉइंग बाहरी सर्वर पर अपलोड होते हैं?", answer: "कभी नहीं। आपकी फ़ाइलें ब्राउज़र में स्थानीय रूप से प्रोसेस होती हैं और कभी भी आपके डिवाइस से बाहर नहीं जातीं।" }
    ],
    id: [
      { question: "Apakah saya perlu AutoCAD untuk mengonversi file DWG atau DXF?", answer: "Tidak. FileKit memproses gambar AutoCAD DWG dan DXF langsung di browser Anda tanpa lisensi perangkat lunak mahal." },
      { question: "Apakah lapisan vektor, ketebalan garis, dan dimensi arsitektur dipertahankan?", answer: "Ya. Semua geometri, anotasi teks, dan dimensi dirender dengan ketelitian vektor yang tepat." },
      { question: "Apakah gambar teknik saya diunggah ke server eksternal?", answer: "Tidak pernah. File Anda diproses secara lokal di browser dan tidak pernah meninggalkan perangkat Anda." }
    ],
    ms: [
      { question: "Adakah saya perlu AutoCAD untuk menukar fail DWG atau DXF?", answer: "Tidak. FileKit memproses pelan AutoCAD DWG dan DXF terus dalam pelayar web anda tanpa lesen perisian mahal." },
      { question: "Adakah lapisan vektor, ketebalan garisan dan dimensi seni bina dikekalkan?", answer: "Ya. Semua geometri, anotasi teks dan dimensi dipaparkan dengan ketepatan vektor yang tepat." },
      { question: "Adakah lukisan kejuruteraan saya dimuat naik ke pelayan luaran?", answer: "Tidak pernah. Fail anda diproses secara setempat dalam pelayar dan tidak pernah meninggalkan peranti anda." }
    ],
    th: [
      { question: "ต้องติดตั้ง AutoCAD เพื่อแปลงไฟล์ DWG หรือ DXF หรือไม่?", answer: "ไม่ FileKit ประมวลผลแบบ AutoCAD DWG และ DXF โดยตรงในเบราว์เซอร์โดยไม่ต้องใช้ซอฟต์แวร์ราคาแพง" },
      { question: "เลเยอร์เวกเตอร์ ความหนาเส้น และมิติสถาปัตยกรรมถูกรักษาไว้หรือไม่?", answer: "ใช่ เรขาคณิตทั้งหมด คำอธิบายข้อความ และมิติถูกแสดงผลด้วยความแม่นยำเวกเตอร์ที่แม่นยำ" },
      { question: "แบบวิศวกรรมของฉันถูกอัปโหลดไปยังเซิร์ฟเวอร์ภายนอกหรือไม่?", answer: "ไม่เลย ไฟล์ของคุณถูกประมวลผลในเครื่องภายในเบราว์เซอร์และไม่เคยออกจากอุปกรณ์ของคุณ" }
    ],
    vi: [
      { question: "Tôi có cần cài đặt AutoCAD để chuyển đổi file DWG hoặc DXF không?", answer: "Không. FileKit xử lý bản vẽ AutoCAD DWG và DXF trực tiếp trong trình duyệt mà không cần phần mềm đắt tiền." },
      { question: "Các lớp vector, độ dày đường và kích thước kiến trúc có được giữ nguyên không?", answer: "Có. Tất cả hình học, chú thích văn bản và kích thước được hiển thị với độ chính xác vector hoàn hảo." },
      { question: "Bản vẽ kỹ thuật của tôi có bị tải lên máy chủ bên ngoài không?", answer: "Không bao giờ. File của bạn được xử lý cục bộ trong trình duyệt và không bao giờ rời khỏi thiết bị." }
    ],
    fil: [
      { question: "Kailangan ko ba ng AutoCAD para mag-convert ng DWG o DXF files?", answer: "Hindi. Pinoproseso ng FileKit ang AutoCAD DWG at DXF blueprints direkta sa iyong browser nang walang mamahaling software." },
      { question: "Nananatili ba ang mga vector layer, line weight, at architectural dimension?", answer: "Oo. Lahat ng geometry, text annotation, at dimensyon ay nire-render nang may eksaktong vector fidelity." },
      { question: "Ina-upload ba ang aking engineering drawing sa external server?", answer: "Hindi kailanman. Pinoproseso ang iyong mga file nang lokal sa browser at hindi umaalis sa iyong device." }
    ],
    ja: [
      { question: "DWGやDXFファイルを変換するためにAutoCADのインストールは必要ですか？", answer: "いいえ。FileKitは高価なソフトウェアを必要とせず、ブラウザ内でAutoCAD DWGおよびDXF図面を直接処理します。" },
      { question: "ベクターレイヤー、線の太さ、寸法線は正確に保持されますか？", answer: "はい。すべての幾何学データ、テキスト注釈、建築寸法はベクター精度で正確に再現されます。" },
      { question: "設計図面や機密ファイルが外部サーバーにアップロードされることはありますか？", answer: "一切ありません。すべての処理はお使いの端末のブラウザ内で完結し、外部へ送信されることはありません。" }
    ],
    ko: [
      { question: "DWG 또는 DXF 파일을 변환하려면 AutoCAD가 설치되어 있어야 하나요?", answer: "아니요. FileKit은 고가의 소프트웨어 없이도 웹 브라우저에서 직접 AutoCAD DWG 및 DXF 도면을 로컬 처리합니다." },
      { question: "벡터 레이어, 선 두께 및 건축 치수가 그대로 유지되나요?", answer: "네. 모든 선 형상, 텍스트 주석 및 치수 정보가 정밀한 벡터 품질로 완벽하게 보존됩니다." },
      { question: "엔지니어링 도면 파일이 외부 서버로 업로드되나요?", answer: "절대 아닙니다. 파일은 브라우저 내에서 로컬로 처리되며 사용자의 기기를 벗어나지 않습니다." }
    ],
    "zh-CN": [
      { question: "转换 DWG 或 DXF 文件需要安装 AutoCAD 吗？", answer: "不需要。FileKit 直接在您的网页浏览器中解析 AutoCAD DWG 和 DXF 图纸，无需安装昂贵的软件。" },
      { question: "矢量图层、线宽和工程标注尺寸会完整保留吗？", answer: "会。所有线条几何图形、文本注释和建筑尺寸均以精准的矢量格式完整呈现。" },
      { question: "我的工程图纸会被上传到云端服务器吗？", answer: "绝不。您的文件仅在浏览器本地进行处理，数据绝不会离开您的设备。" }
    ],
    "zh-TW": [
      { question: "轉換 DWG 或 DXF 檔案需要安裝 AutoCAD 嗎？", answer: "不需要。FileKit 直接於您的網頁瀏覽器中處理 AutoCAD DWG 和 DXF 工程圖，無須購買昂貴的軟體授權。" },
      { question: "向量圖層、線寬與建築標註尺寸會完整保留嗎？", answer: "會。所有線條幾何、文字註解與建築尺寸皆以精確的向量品質完整保留。" },
      { question: "我的工程圖紙會被上傳至第三方伺服器嗎？", answer: "絕不。所有檔案皆於本機瀏覽器內安全處理，圖紙資料絕不會離開您的裝置。" }
    ],
  },
  vector: {
    en: [
      { question: "Can I convert AI, EPS, or PSD files without Adobe Creative Cloud?", answer: "Yes. FileKit renders vector paths and raster layers directly in your browser without requiring Adobe Illustrator or Photoshop licenses." },
      { question: "Will vector paths and color profiles remain sharp and accurate?", answer: "Yes. The engine extracts exact vector outlines and high-resolution layers with full RGB/CMYK color preservation." },
      { question: "Are my proprietary artwork and graphics stored on any servers?", answer: "No. All design files are converted locally in memory and discarded the moment you finish or close your browser tab." }
    ],
    es: [
      { question: "¿Puedo convertir archivos AI, EPS o PSD sin Adobe Creative Cloud?", answer: "Sí. FileKit renderiza trazados vectoriales y capas directamente en tu navegador sin requerir suscripciones a Illustrator o Photoshop." },
      { question: "¿Se mantienen nítidos los trazados vectoriales y perfiles de color?", answer: "Sí. El motor extrae trazados vectoriales exactos y capas de alta resolución con preservación de color RGB y CMYK." },
      { question: "¿Se almacenan mis diseños e ilustraciones en algún servidor?", answer: "No. Todos los archivos de diseño se procesan localmente en memoria y se descartan al instante." }
    ],
    "es-419": [
      { question: "¿Puedo convertir archivos AI, EPS o PSD sin Adobe Creative Cloud?", answer: "Sí. FileKit procesa rutas vectoriales y capas ráster directamente en tu navegador sin requerir licencias de Adobe." },
      { question: "¿Los trazados vectoriales y perfiles de color se mantienen nítidos?", answer: "Sí. El motor extrae contornos vectoriales exactos y capas de alta resolución preservando los colores RGB y CMYK." },
      { question: "¿Mis diseños y gráficos se almacenan en algún servidor?", answer: "No. Todos los archivos se procesan localmente en memoria y se eliminan al cerrar la pestaña." }
    ],
    de: [
      { question: "Kann ich AI-, EPS- oder PSD-Dateien ohne Adobe Creative Cloud konvertieren?", answer: "Ja. FileKit rendert Vektorpfade und Rasterebenen direkt in Ihrem Browser ohne Adobe-Lizenzen." },
      { question: "Bleiben Vektorpfade und Farbprofile scharf und genau?", answer: "Ja. Die Engine extrahiert exakte Vektorkonturen und hochauflösende Ebenen mit vollständiger RGB/CMYK-Farberhaltung." },
      { question: "Werden meine Grafiken und Designs auf einem Server gespeichert?", answer: "Nein. Alle Designdateien werden lokal im Speicher konvertiert und beim Schließen des Tabs sofort gelöscht." }
    ],
    fr: [
      { question: "Puis-je convertir des fichiers AI, EPS ou PSD sans Adobe Creative Cloud ?", answer: "Oui. FileKit affiche les tracés vectoriels et les calques directement dans votre navigateur sans licence Adobe." },
      { question: "Les tracés vectoriels et profils de couleur restent-ils nets et précis ?", answer: "Oui. Le moteur extrait des contours vectoriels exacts et des calques haute résolution avec préservation complète des couleurs RGB/CMYK." },
      { question: "Mes créations et graphiques sont-ils stockés sur un serveur ?", answer: "Non. Tous les fichiers de design sont convertis localement en mémoire et supprimés dès la fermeture de l'onglet." }
    ],
    pt: [
      { question: "Posso converter ficheiros AI, EPS ou PSD sem o Adobe Creative Cloud?", answer: "Sim. O FileKit processa caminhos vetoriais e camadas diretamente no seu navegador sem licenças da Adobe." },
      { question: "Os caminhos vetoriais e perfis de cor mantêm-se nítidos e precisos?", answer: "Sim. O motor extrai contornos vetoriais exatos e camadas de alta resolução com preservação total de cores RGB/CMYK." },
      { question: "As minhas ilustrações e gráficos são armazenados em algum servidor?", answer: "Não. Todos os ficheiros são convertidos localmente na memória e descartados ao fechar o separador." }
    ],
    "pt-BR": [
      { question: "Posso converter arquivos AI, EPS ou PSD sem o Adobe Creative Cloud?", answer: "Sim. O FileKit renderiza caminhos vetoriais e camadas diretamente no seu navegador sem licenças da Adobe." },
      { question: "Os caminhos vetoriais e perfis de cor se mantêm nítidos e precisos?", answer: "Sim. O motor extrai contornos vetoriais exatos e camadas de alta resolução com preservação completa de cores RGB/CMYK." },
      { question: "Minhas ilustrações e gráficos são armazenados em algum servidor?", answer: "Não. Todos os arquivos são convertidos localmente na memória e descartados ao fechar a aba." }
    ],
    it: [
      { question: "Posso convertire file AI, EPS o PSD senza Adobe Creative Cloud?", answer: "Sì. FileKit elabora tracciati vettoriali e livelli direttamente nel browser senza licenze Adobe." },
      { question: "I tracciati vettoriali e i profili colore restano nitidi e precisi?", answer: "Sì. Il motore estrae contorni vettoriali esatti e livelli ad alta risoluzione con preservazione completa dei colori RGB/CMYK." },
      { question: "Le mie illustrazioni e grafiche sono conservate su qualche server?", answer: "No. Tutti i file vengono convertiti localmente in memoria e scartati alla chiusura della scheda." }
    ],
    nl: [
      { question: "Kan ik AI-, EPS- of PSD-bestanden converteren zonder Adobe Creative Cloud?", answer: "Ja. FileKit rendert vectorpaden en rasterlagen rechtstreeks in uw browser zonder Adobe-licenties." },
      { question: "Blijven vectorpaden en kleurprofielen scherp en nauwkeurig?", answer: "Ja. De engine extraheert exacte vectorcontouren en lagen met behoud van volledige RGB/CMYK-kleuren." },
      { question: "Worden mijn ontwerpen en afbeeldingen opgeslagen op een server?", answer: "Nee. Alle bestanden worden lokaal in het geheugen geconverteerd en verwijderd bij het sluiten van het tabblad." }
    ],
    ca: [
      { question: "Puc convertir fitxers AI, EPS o PSD sense Adobe Creative Cloud?", answer: "Sí. FileKit renderitza traçats vectorials i capes directament al navegador sense llicències d'Adobe." },
      { question: "Els traçats vectorials i perfils de color es mantenen nítids i precisos?", answer: "Sí. El motor extreu contorns vectorials exactes i capes d'alta resolució amb preservació completa de colors RGB/CMYK." },
      { question: "Els meus dissenys i gràfics s'emmagatzemen en algun servidor?", answer: "No. Tots els fitxers es converteixen localment en memòria i es descarten en tancar la pestanya." }
    ],
    sv: [
      { question: "Kan jag konvertera AI-, EPS- eller PSD-filer utan Adobe Creative Cloud?", answer: "Ja. FileKit renderar vektorbanor och rasterlager direkt i din webbläsare utan Adobe-licenser." },
      { question: "Förblir vektorbanor och färgprofiler skarpa och exakta?", answer: "Ja. Motorn extraherar exakta vektorkonturer och högupplösta lager med full RGB/CMYK-färgbevarande." },
      { question: "Lagras mina design och grafik på någon server?", answer: "Nej. Alla designfiler konverteras lokalt i minnet och raderas när du stänger fliken." }
    ],
    da: [
      { question: "Kan jeg konvertere AI-, EPS- eller PSD-filer uden Adobe Creative Cloud?", answer: "Ja. FileKit renderer vektorstier og rasterlag direkte i din browser uden Adobe-licenser." },
      { question: "Forbliver vektorstier og farveprofiler skarpe og nøjagtige?", answer: "Ja. Motoren udtrækker præcise vektorkonturer og højopløsningslag med fuld RGB/CMYK-farvebevarelse." },
      { question: "Gemmes mine designs og grafik på nogen server?", answer: "Nej. Alle designfiler konverteres lokalt i hukommelsen og slettes når du lukker fanen." }
    ],
    fi: [
      { question: "Voinko muuntaa AI-, EPS- tai PSD-tiedostoja ilman Adobe Creative Cloudia?", answer: "Kyllä. FileKit renderöi vektoripolut ja rasterikerrokset suoraan selaimessasi ilman Adobe-lisenssejä." },
      { question: "Säilyvätkö vektoripolut ja väriprofiilit terävinä ja tarkkoina?", answer: "Kyllä. Moottori poimii tarkat vektoriääriviivat ja korkearesoluutioiset kerrokset täydellä RGB/CMYK-värien säilyttämisellä." },
      { question: "Tallennetaanko suunnitelmani ja grafiikkani jollekin palvelimelle?", answer: "Ei. Kaikki tiedostot muunnetaan paikallisesti muistissa ja hävitetään välilehden sulkemisen yhteydessä." }
    ],
    no: [
      { question: "Kan jeg konvertere AI-, EPS- eller PSD-filer uten Adobe Creative Cloud?", answer: "Ja. FileKit rendrer vektorbaner og rasterlag direkte i nettleseren din uten Adobe-lisenser." },
      { question: "Forblir vektorbaner og fargeprofiler skarpe og nøyaktige?", answer: "Ja. Motoren henter ut eksakte vektorkonturer og høyoppløselige lag med full RGB/CMYK-fargbevaring." },
      { question: "Lagres designene og grafikken min på noen server?", answer: "Nei. Alle designfiler konverteres lokalt i minnet og slettes når du lukker fanen." }
    ],
    pl: [
      { question: "Czy mogę konwertować pliki AI, EPS lub PSD bez Adobe Creative Cloud?", answer: "Tak. FileKit renderuje ścieżki wektorowe i warstwy rastrowe bezpośrednio w przeglądarce bez licencji Adobe." },
      { question: "Czy ścieżki wektorowe i profile kolorów pozostają ostre i dokładne?", answer: "Tak. Silnik wyodrębnia dokładne kontury wektorowe i warstwy o wysokiej rozdzielczości z pełnym zachowaniem kolorów RGB/CMYK." },
      { question: "Czy moje projekty i grafiki są przechowywane na jakimś serwerze?", answer: "Nie. Wszystkie pliki są konwertowane lokalnie w pamięci i usuwane po zamknięciu karty." }
    ],
    cs: [
      { question: "Mohu převést soubory AI, EPS nebo PSD bez Adobe Creative Cloud?", answer: "Ano. FileKit vykresluje vektorové cesty a rastrové vrstvy přímo v prohlížeči bez licencí Adobe." },
      { question: "Zůstanou vektorové cesty a barevné profily ostré a přesné?", answer: "Ano. Motor extrahuje přesné vektorové obrysy a vrstvy ve vysokém rozlišení s plným zachováním barev RGB/CMYK." },
      { question: "Jsou mé návrhy a grafiky uloženy na nějakém serveru?", answer: "Ne. Všechny soubory jsou převedeny lokálně v paměti a smazány při zavření karty." }
    ],
    hu: [
      { question: "Konvertálhatok AI, EPS vagy PSD fájlokat Adobe Creative Cloud nélkül?", answer: "Igen. A FileKit közvetlenül a böngészőben rendereli a vektorútvonalakat és rétegeket Adobe-licencek nélkül." },
      { question: "A vektorútvonalak és színprofilok élesek és pontosak maradnak?", answer: "Igen. A motor pontos vektorkontúrokat és nagy felbontású rétegeket nyer ki teljes RGB/CMYK szín megőrzéssel." },
      { question: "Az illusztrációim és grafikáim tárolódnak valamilyen szerveren?", answer: "Nem. Minden fájl helyben, a memóriában konvertálódik és a lap bezárásakor azonnal törlődik." }
    ],
    ro: [
      { question: "Pot converti fișiere AI, EPS sau PSD fără Adobe Creative Cloud?", answer: "Da. FileKit redă trasee vectoriale și straturi raster direct în browser fără licențe Adobe." },
      { question: "Traseele vectoriale și profilurile de culoare rămân clare și precise?", answer: "Da. Motorul extrage contururi vectoriale exacte și straturi de înaltă rezoluție cu păstrarea completă a culorilor RGB/CMYK." },
      { question: "Sunt ilustrațiile și grafica mea stocate pe vreun server?", answer: "Nu. Toate fișierele sunt convertite local în memorie și șterse la închiderea filei." }
    ],
    bg: [
      { question: "Мога ли да конвертирам AI, EPS или PSD файлове без Adobe Creative Cloud?", answer: "Да. FileKit визуализира векторни пътища и растерни слоеве директно в браузъра без лицензи на Adobe." },
      { question: "Векторните пътища и цветовите профили остават ли ясни и точни?", answer: "Да. Двигателят извлича точни векторни контури и слоеве с висока резолюция с пълно запазване на RGB/CMYK цветовете." },
      { question: "Съхраняват ли се моите дизайни и графики на някакъв сървър?", answer: "Не. Всички файлове се конвертират локално в паметта и се изтриват при затваряне на раздела." }
    ],
    el: [
      { question: "Μπορώ να μετατρέψω αρχεία AI, EPS ή PSD χωρίς Adobe Creative Cloud;", answer: "Ναι. Το FileKit αποδίδει διανυσματικές διαδρομές και επίπεδα raster απευθείας στον browser χωρίς άδειες Adobe." },
      { question: "Τα διανυσματικά μονοπάτια και τα χρωματικά προφίλ παραμένουν ευκρινή;", answer: "Ναι. Ο κινητήρας εξάγει ακριβή διανυσματικά περιγράμματα και επίπεδα υψηλής ανάλυσης με πλήρη διατήρηση χρωμάτων RGB/CMYK." },
      { question: "Αποθηκεύονται τα σχέδια και τα γραφικά μου σε κάποιον διακομιστή;", answer: "Όχι. Όλα τα αρχεία μετατρέπονται τοπικά στη μνήμη και διαγράφονται με το κλείσιμο της καρτέλας." }
    ],
    sk: [
      { question: "Môžem konvertovať súbory AI, EPS alebo PSD bez Adobe Creative Cloud?", answer: "Áno. FileKit vykresľuje vektorové cesty a rastrové vrstvy priamo v prehliadači bez licencií Adobe." },
      { question: "Zostanú vektorové cesty a farebné profily ostré a presné?", answer: "Áno. Motor extrahuje presné vektorové obrysy a vrstvy vo vysokom rozlíšení s plným zachovaním farieb RGB/CMYK." },
      { question: "Sú moje návrhy a grafiky uložené na nejakom serveri?", answer: "Nie. Všetky súbory sa konvertujú lokálne v pamäti a zmažú pri zatvorení karty." }
    ],
    sl: [
      { question: "Ali lahko pretvorim datoteke AI, EPS ali PSD brez Adobe Creative Cloud?", answer: "Da. FileKit upodobi vektorske poti in rastrske plasti neposredno v brskalniku brez Adobejevih licenc." },
      { question: "Ali vektorske poti in barvni profili ostanejo ostri in natančni?", answer: "Da. Motor izlušči natančne vektorske obrise in visokoresolucijske plasti s polnim ohranjanjem barv RGB/CMYK." },
      { question: "Ali so moji dizajni in grafike shranjeni na katerem strežniku?", answer: "Ne. Vse datoteke se pretvorijo lokalno v pomnilniku in izbrišejo ob zaprtju zavihka." }
    ],
    ru: [
      { question: "Могу ли я конвертировать файлы AI, EPS или PSD без Adobe Creative Cloud?", answer: "Да. FileKit визуализирует векторные контуры и растровые слои прямо в браузере без лицензий Adobe." },
      { question: "Сохраняются ли векторные контуры и цветовые профили чёткими и точными?", answer: "Да. Движок извлекает точные векторные контуры и слои высокого разрешения с полным сохранением цветов RGB/CMYK." },
      { question: "Хранятся ли мои иллюстрации и графика на каком-либо сервере?", answer: "Нет. Все файлы конвертируются локально в памяти и удаляются при закрытии вкладки." }
    ],
    uk: [
      { question: "Чи можу я конвертувати файли AI, EPS або PSD без Adobe Creative Cloud?", answer: "Так. FileKit відтворює векторні контури та растрові шари безпосередньо у браузері без ліцензій Adobe." },
      { question: "Чи залишаються векторні контури та кольорові профілі чіткими та точними?", answer: "Так. Двигун витягує точні векторні контури та шари високої роздільності з повним збереженням кольорів RGB/CMYK." },
      { question: "Чи зберігаються мої ілюстрації та графіка на якомусь сервері?", answer: "Ні. Всі файли конвертуються локально в пам'яті і видаляються при закритті вкладки." }
    ],
    lv: [
      { question: "Vai es varu konvertēt AI, EPS vai PSD failus bez Adobe Creative Cloud?", answer: "Jā. FileKit atveido vektoru ceļus un rastra slāņus tieši pārlūkprogrammā bez Adobe licencēm." },
      { question: "Vai vektoru ceļi un krāsu profili paliek asi un precīzi?", answer: "Jā. Dzinējs iegūst precīzas vektoru kontūras un augstas izšķirtspējas slāņus ar pilnīgu RGB/CMYK krāsu saglabāšanu." },
      { question: "Vai mani dizaini un grafika tiek glabāti kādā serverī?", answer: "Nē. Visi faili tiek konvertēti lokāli atmiņā un dzēsti, aizverot cilni." }
    ],
    lt: [
      { question: "Ar galiu konvertuoti AI, EPS ar PSD failus be Adobe Creative Cloud?", answer: "Taip. FileKit atvaizduoja vektorinius kelius ir rastrinius sluoksnius tiesiai naršyklėje be Adobe licencijų." },
      { question: "Ar vektoriniai keliai ir spalvų profiliai išlieka ryškūs ir tikslūs?", answer: "Taip. Variklis išgauna tikslias vektorines kontūras ir didelės raiškos sluoksnius su pilnu RGB/CMYK spalvų išsaugojimu." },
      { question: "Ar mano dizainai ir grafika saugomi kokiame nors serveryje?", answer: "Ne. Visi failai konvertuojami vietoje atmintyje ir ištrinami uždarius skirtuką." }
    ],
    tr: [
      { question: "Adobe Creative Cloud olmadan AI, EPS veya PSD dosyalarını dönüştürebilir miyim?", answer: "Evet. FileKit, Adobe lisansları gerektirmeden vektör yollarını ve raster katmanları doğrudan tarayıcınızda işler." },
      { question: "Vektör yolları ve renk profilleri keskin ve doğru kalır mı?", answer: "Evet. Motor, tam RGB/CMYK renk korumasıyla kesin vektör hatlarını ve yüksek çözünürlüklü katmanları çıkarır." },
      { question: "Tasarımlarım ve grafiklerim herhangi bir sunucuda saklanıyor mu?", answer: "Hayır. Tüm dosyalar bellekte yerel olarak dönüştürülür ve sekmeyi kapattığınızda anında silinir." }
    ],
    ar: [
      { question: "هل يمكنني تحويل ملفات AI أو EPS أو PSD بدون Adobe Creative Cloud؟", answer: "نعم. يعرض FileKit المسارات المتجهة والطبقات النقطية مباشرة في متصفحك دون الحاجة لتراخيص Adobe." },
      { question: "هل تبقى المسارات المتجهة وملفات تعريف الألوان واضحة ودقيقة؟", answer: "نعم. يستخرج المحرك مخططات متجهة دقيقة وطبقات عالية الدقة مع الحفاظ الكامل على ألوان RGB/CMYK." },
      { question: "هل يتم تخزين تصاميمي ورسوماتي على أي خادم؟", answer: "لا. تتم معالجة جميع الملفات محلياً في الذاكرة وحذفها فور إغلاق علامة التبويب." }
    ],
    he: [
      { question: "האם אפשר להמיר קבצי AI, EPS או PSD ללא Adobe Creative Cloud?", answer: "כן. FileKit מעבד נתיבים וקטוריים ושכבות רסטר ישירות בדפדפן ללא צורך ברישיונות Adobe." },
      { question: "האם נתיבים וקטוריים ופרופילי צבע נשארים חדים ומדויקים?", answer: "כן. המנוע מחלץ קווי מתאר וקטוריים מדויקים ושכבות ברזולוציה גבוהה עם שימור מלא של צבעי RGB/CMYK." },
      { question: "האם העיצובים והגרפיקות שלי מאוחסנים בשרת כלשהו?", answer: "לא. כל הקבצים מומרים מקומית בזיכרון ונמחקים ברגע שסוגרים את הלשונית." }
    ],
    hi: [
      { question: "क्या मैं Adobe Creative Cloud के बिना AI, EPS या PSD फ़ाइलें कन्वर्ट कर सकता/सकती हूँ?", answer: "हाँ। FileKit Adobe लाइसेंस के बिना वेक्टर पथ और रैस्टर लेयर्स को सीधे आपके ब्राउज़र में रेंडर करता है।" },
      { question: "क्या वेक्टर पथ और रंग प्रोफ़ाइल तीक्ष्ण और सटीक बने रहते हैं?", answer: "हाँ। इंजन पूर्ण RGB/CMYK रंग संरक्षण के साथ सटीक वेक्टर रूपरेखा और उच्च-रिज़ॉल्यूशन लेयर्स निकालता है।" },
      { question: "क्या मेरे डिज़ाइन और ग्राफ़िक्स किसी सर्वर पर संग्रहीत हैं?", answer: "नहीं। सभी फ़ाइलें स्थानीय रूप से मेमोरी में कन्वर्ट होती हैं और टैब बंद करने पर तुरंत हटा दी जाती हैं।" }
    ],
    id: [
      { question: "Bisakah saya mengonversi file AI, EPS, atau PSD tanpa Adobe Creative Cloud?", answer: "Ya. FileKit merender jalur vektor dan lapisan raster langsung di browser Anda tanpa lisensi Adobe." },
      { question: "Apakah jalur vektor dan profil warna tetap tajam dan akurat?", answer: "Ya. Mesin mengekstrak garis vektor yang tepat dan lapisan resolusi tinggi dengan pelestarian warna RGB/CMYK penuh." },
      { question: "Apakah desain dan grafik saya disimpan di server mana pun?", answer: "Tidak. Semua file dikonversi secara lokal di memori dan dihapus saat Anda menutup tab." }
    ],
    ms: [
      { question: "Bolehkah saya menukar fail AI, EPS atau PSD tanpa Adobe Creative Cloud?", answer: "Ya. FileKit merender laluan vektor dan lapisan raster terus dalam pelayar anda tanpa lesen Adobe." },
      { question: "Adakah laluan vektor dan profil warna kekal tajam dan tepat?", answer: "Ya. Enjin mengekstrak garis besar vektor yang tepat dan lapisan resolusi tinggi dengan pemeliharaan warna RGB/CMYK penuh." },
      { question: "Adakah reka bentuk dan grafik saya disimpan di mana-mana pelayan?", answer: "Tidak. Semua fail ditukar secara setempat dalam memori dan dipadamkan apabila anda menutup tab." }
    ],
    th: [
      { question: "ฉันสามารถแปลงไฟล์ AI, EPS หรือ PSD โดยไม่ต้องใช้ Adobe Creative Cloud ได้หรือไม่?", answer: "ใช่ FileKit เรนเดอร์เส้นทางเวกเตอร์และเลเยอร์แรสเตอร์โดยตรงในเบราว์เซอร์โดยไม่ต้องใช้สิทธิ์ Adobe" },
      { question: "เส้นทางเวกเตอร์และโปรไฟล์สียังคงคมชัดและแม่นยำหรือไม่?", answer: "ใช่ เอ็นจิ้นสกัดเส้นขอบเวกเตอร์ที่แม่นยำและเลเยอร์ความละเอียดสูงพร้อมการรักษาสี RGB/CMYK อย่างสมบูรณ์" },
      { question: "งานออกแบบและกราฟิกของฉันถูกจัดเก็บบนเซิร์ฟเวอร์ใดหรือไม่?", answer: "ไม่ ไฟล์ทั้งหมดถูกแปลงในเครื่องในหน่วยความจำและถูกลบเมื่อคุณปิดแท็บ" }
    ],
    vi: [
      { question: "Tôi có thể chuyển đổi file AI, EPS hoặc PSD mà không cần Adobe Creative Cloud không?", answer: "Có. FileKit hiển thị đường vector và lớp raster trực tiếp trong trình duyệt mà không cần giấy phép Adobe." },
      { question: "Đường vector và hồ sơ màu có giữ được sắc nét và chính xác không?", answer: "Có. Bộ xử lý trích xuất đường viền vector chính xác và lớp độ phân giải cao với bảo toàn màu RGB/CMYK đầy đủ." },
      { question: "Thiết kế và đồ họa của tôi có được lưu trên bất kỳ máy chủ nào không?", answer: "Không. Tất cả file được chuyển đổi cục bộ trong bộ nhớ và bị xóa khi bạn đóng tab." }
    ],
    fil: [
      { question: "Maaari ba akong mag-convert ng AI, EPS, o PSD files nang walang Adobe Creative Cloud?", answer: "Oo. Nire-render ng FileKit ang vector paths at raster layers direkta sa iyong browser nang walang Adobe license." },
      { question: "Nananatiling matalim at tumpak ba ang vector paths at color profiles?", answer: "Oo. Kinukuha ng engine ang eksaktong vector outlines at high-resolution layers na may buong RGB/CMYK color preservation." },
      { question: "Naka-store ba ang aking mga disenyo at graphics sa anumang server?", answer: "Hindi. Lahat ng file ay kino-convert nang lokal sa memory at tinatanggal kapag isinara mo ang tab." }
    ],
    ja: [
      { question: "Adobe Creative CloudなしでAI、EPS、PSDファイルを変換できますか？", answer: "はい。FileKitはAdobe ライセンスなしで、ベクターパスとラスターレイヤーをブラウザ内で直接レンダリングします。" },
      { question: "ベクターパスとカラープロファイルは鮮明で正確なまま保持されますか？", answer: "はい。エンジンは正確なベクターアウトラインと高解像度レイヤーをRGB/CMYKカラーを完全に保持して抽出します。" },
      { question: "私のデザインやグラフィックスはサーバーに保存されますか？", answer: "いいえ。すべてのファイルはメモリ内でローカルに変換され、タブを閉じると即座に削除されます。" }
    ],
    ko: [
      { question: "Adobe Creative Cloud 없이 AI, EPS 또는 PSD 파일을 변환할 수 있나요?", answer: "네. FileKit은 Adobe 라이선스 없이도 벡터 경로와 래스터 레이어를 브라우저에서 직접 렌더링합니다." },
      { question: "벡터 경로와 색상 프로필이 선명하고 정확하게 유지되나요?", answer: "네. 엔진은 정확한 벡터 윤곽선과 고해상도 레이어를 RGB/CMYK 색상을 완벽하게 보존하여 추출합니다." },
      { question: "내 디자인과 그래픽이 서버에 저장되나요?", answer: "아니요. 모든 파일은 메모리에서 로컬로 변환되며 탭을 닫으면 즉시 삭제됩니다." }
    ],
    "zh-CN": [
      { question: "我可以在没有 Adobe Creative Cloud 的情况下转换 AI、EPS 或 PSD 文件吗？", answer: "可以。FileKit 无需 Adobe 许可证，直接在浏览器中渲染矢量路径和栅格图层。" },
      { question: "矢量路径和颜色配置文件是否保持清晰准确？", answer: "是的。引擎提取精确的矢量轮廓和高分辨率图层，完整保留 RGB/CMYK 颜色。" },
      { question: "我的设计和图形是否存储在任何服务器上？", answer: "不会。所有文件在内存中本地转换，关闭标签页后立即删除。" }
    ],
    "zh-TW": [
      { question: "我可以在沒有 Adobe Creative Cloud 的情況下轉換 AI、EPS 或 PSD 檔案嗎？", answer: "可以。FileKit 無需 Adobe 授權，直接在瀏覽器中渲染向量路徑和點陣圖層。" },
      { question: "向量路徑和色彩設定檔是否保持清晰準確？", answer: "是的。引擎提取精確的向量輪廓和高解析度圖層，完整保留 RGB/CMYK 色彩。" },
      { question: "我的設計和圖形是否存儲在任何伺服器上？", answer: "不會。所有檔案在記憶體中本地轉換，關閉分頁後立即刪除。" }
    ],
  },
  subtitles: {
    en: [
      { question: "What is the difference between SRT and WebVTT subtitles?", answer: "SRT uses comma-separated millisecond timestamps (00:00:01,000) and is standard for media players. WebVTT uses period timestamps (00:00:01.000) and supports CSS styling for HTML5 web video." },
      { question: "Will timecodes and subtitle cue numbers be kept in perfect sync?", answer: "Yes. FileKit parses microsecond timestamps and reformats syntax with zero timing drift across all media players." },
      { question: "How do I use the converted subtitles on YouTube or video players?", answer: "Download the converted .vtt or .srt file and upload it directly in YouTube Studio, Vimeo, or your video player settings." }
    ],
    es: [
      { question: "¿Cuál es la diferencia entre los subtítulos SRT y WebVTT?", answer: "SRT utiliza marcas de tiempo con comas (00:00:01,000) para reproductores de medios. WebVTT utiliza puntos (00:00:01.000) y admite estilos CSS para video web HTML5." },
      { question: "¿Se mantienen perfectamente sincronizados los códigos de tiempo?", answer: "Sí. FileKit analiza marcas de tiempo con precisión de microsegundos sin desviación temporal." },
      { question: "¿Cómo uso los subtítulos convertidos en YouTube o reproductores?", answer: "Descarga el archivo .vtt o .srt y súbelo directamente en YouTube Studio, Vimeo o tu reproductor." }
    ],
    "es-419": [
      { question: "¿Cuál es la diferencia entre subtítulos SRT y WebVTT?", answer: "SRT usa marcas de tiempo con comas (00:00:01,000) para reproductores. WebVTT usa puntos (00:00:01.000) y soporta estilos CSS para video HTML5." },
      { question: "¿Los códigos de tiempo se mantienen sincronizados?", answer: "Sí. FileKit analiza marcas de tiempo con precisión de microsegundos sin desfase temporal." },
      { question: "¿Cómo uso los subtítulos convertidos en YouTube?", answer: "Descarga el archivo .vtt o .srt y cárgalo directamente en YouTube Studio o tu reproductor de video." }
    ],
    de: [
      { question: "Was ist der Unterschied zwischen SRT- und WebVTT-Untertiteln?", answer: "SRT verwendet kommagetrennte Millisekunden-Zeitstempel (00:00:01,000) für Mediaplayer. WebVTT verwendet Punkt-Zeitstempel (00:00:01.000) und unterstützt CSS-Styling für HTML5-Video." },
      { question: "Bleiben Timecodes und Untertitelnummern perfekt synchronisiert?", answer: "Ja. FileKit analysiert Zeitstempel mit Mikrosekunden-Präzision ohne zeitliche Abweichung." },
      { question: "Wie verwende ich die konvertierten Untertitel auf YouTube?", answer: "Laden Sie die konvertierte .vtt- oder .srt-Datei herunter und laden Sie sie direkt in YouTube Studio hoch." }
    ],
    fr: [
      { question: "Quelle est la différence entre les sous-titres SRT et WebVTT ?", answer: "SRT utilise des horodatages séparés par des virgules (00:00:01,000) pour les lecteurs multimédias. WebVTT utilise des points (00:00:01.000) et prend en charge le style CSS pour la vidéo HTML5." },
      { question: "Les timecodes et les numéros de sous-titres restent-ils parfaitement synchronisés ?", answer: "Oui. FileKit analyse les horodatages avec une précision microseconde sans dérive temporelle." },
      { question: "Comment utiliser les sous-titres convertis sur YouTube ?", answer: "Téléchargez le fichier .vtt ou .srt converti et importez-le directement dans YouTube Studio ou votre lecteur vidéo." }
    ],
    pt: [
      { question: "Qual é a diferença entre legendas SRT e WebVTT?", answer: "SRT usa marcas de tempo com vírgulas (00:00:01,000) para leitores multimédia. WebVTT usa pontos (00:00:01.000) e suporta estilos CSS para vídeo HTML5." },
      { question: "Os timecodes e números de legenda mantêm-se sincronizados?", answer: "Sim. O FileKit analisa marcas de tempo com precisão de microssegundos sem desvio temporal." },
      { question: "Como uso as legendas convertidas no YouTube?", answer: "Descarregue o ficheiro .vtt ou .srt e carregue-o diretamente no YouTube Studio ou no seu leitor de vídeo." }
    ],
    "pt-BR": [
      { question: "Qual é a diferença entre legendas SRT e WebVTT?", answer: "SRT usa carimbos de tempo com vírgulas (00:00:01,000) para players de mídia. WebVTT usa pontos (00:00:01.000) e suporta estilos CSS para vídeo HTML5." },
      { question: "Os timecodes e números de legenda se mantêm sincronizados?", answer: "Sim. O FileKit analisa carimbos de tempo com precisão de microssegundos sem desvio temporal." },
      { question: "Como uso as legendas convertidas no YouTube?", answer: "Baixe o arquivo .vtt ou .srt convertido e faça upload direto no YouTube Studio ou no seu player de vídeo." }
    ],
    it: [
      { question: "Qual è la differenza tra i sottotitoli SRT e WebVTT?", answer: "SRT utilizza timestamp separati da virgole (00:00:01,000) per i lettori multimediali. WebVTT utilizza punti (00:00:01.000) e supporta lo stile CSS per i video HTML5." },
      { question: "I timecode e i numeri dei sottotitoli restano perfettamente sincronizzati?", answer: "Sì. FileKit analizza i timestamp con precisione al microsecondo senza alcuna deriva temporale." },
      { question: "Come utilizzo i sottotitoli convertiti su YouTube?", answer: "Scarica il file .vtt o .srt e caricalo direttamente su YouTube Studio o nelle impostazioni del tuo lettore video." }
    ],
    nl: [
      { question: "Wat is het verschil tussen SRT- en WebVTT-ondertitels?", answer: "SRT gebruikt tijdstempels met komma's (00:00:01,000) voor mediaspelers. WebVTT gebruikt punten (00:00:01.000) en ondersteunt CSS-styling voor HTML5-video." },
      { question: "Blijven tijdcodes en ondertitelnummers perfect gesynchroniseerd?", answer: "Ja. FileKit analyseert tijdstempels met microseconde-precisie zonder tijdafwijking." },
      { question: "Hoe gebruik ik de geconverteerde ondertitels op YouTube?", answer: "Download het geconverteerde .vtt- of .srt-bestand en upload het rechtstreeks in YouTube Studio." }
    ],
    ca: [
      { question: "Quina diferència hi ha entre subtítols SRT i WebVTT?", answer: "SRT utilitza marques de temps amb comes (00:00:01,000) per a reproductors. WebVTT utilitza punts (00:00:01.000) i admet estils CSS per a vídeo HTML5." },
      { question: "Es mantenen sincronitzats els codis de temps?", answer: "Sí. FileKit analitza marques de temps amb precisió de microsegons sense desviació temporal." },
      { question: "Com utilitzo els subtítols convertits a YouTube?", answer: "Descarrega el fitxer .vtt o .srt i puja'l directament a YouTube Studio o al teu reproductor de vídeo." }
    ],
    sv: [
      { question: "Vad är skillnaden mellan SRT- och WebVTT-undertexter?", answer: "SRT använder kommaseparerade millisekundstidsstämplar (00:00:01,000) för mediaspelare. WebVTT använder punkttidsstämplar (00:00:01.000) och stödjer CSS-styling för HTML5-video." },
      { question: "Hålls tidkoder och undertextnummer perfekt synkroniserade?", answer: "Ja. FileKit analyserar tidsstämplar med mikrosekundsprecision utan tidsdrift." },
      { question: "Hur använder jag de konverterade undertexterna på YouTube?", answer: "Ladda ner den konverterade .vtt- eller .srt-filen och ladda upp den direkt i YouTube Studio." }
    ],
    da: [
      { question: "Hvad er forskellen mellem SRT- og WebVTT-undertekster?", answer: "SRT bruger kommaseparerede millisekund-tidsstempler (00:00:01,000) til medieafspillere. WebVTT bruger punkttidsstempler (00:00:01.000) og understøtter CSS-styling til HTML5-video." },
      { question: "Holdes tidskoder og undertekstnumre perfekt synkroniseret?", answer: "Ja. FileKit analyserer tidsstempler med mikrosekundpræcision uden tidsdrift." },
      { question: "Hvordan bruger jeg de konverterede undertekster på YouTube?", answer: "Download den konverterede .vtt- eller .srt-fil og upload den direkte i YouTube Studio." }
    ],
    fi: [
      { question: "Mitä eroa on SRT- ja WebVTT-tekstityksillä?", answer: "SRT käyttää pilkuilla erotettuja millisekuntien aikaleimoja (00:00:01,000) mediasoittimille. WebVTT käyttää pisteaikaleimoja (00:00:01.000) ja tukee CSS-tyylejä HTML5-videolle." },
      { question: "Pysyvätkö aikakoodit ja tekstityksen vihjeet täydellisesti synkronoituina?", answer: "Kyllä. FileKit jäsentää aikaleimoja mikrosekunnin tarkkuudella ilman aikapoikkeamaa." },
      { question: "Miten käytän muunnettuja tekstityksiä YouTubessa?", answer: "Lataa muunnettu .vtt- tai .srt-tiedosto ja lataa se suoraan YouTube Studioon." }
    ],
    no: [
      { question: "Hva er forskjellen mellom SRT- og WebVTT-undertekster?", answer: "SRT bruker kommaseparerte millisekund-tidsstempler (00:00:01,000) for mediespillere. WebVTT bruker punkttidsstempler (00:00:01.000) og støtter CSS-styling for HTML5-video." },
      { question: "Holdes tidskoder og undertekstnumre perfekt synkronisert?", answer: "Ja. FileKit analyserer tidsstempler med mikrosekundpresisjon uten tidsavvik." },
      { question: "Hvordan bruker jeg de konverterte undertekstene på YouTube?", answer: "Last ned den konverterte .vtt- eller .srt-filen og last den opp direkte i YouTube Studio." }
    ],
    pl: [
      { question: "Jaka jest różnica między napisami SRT a WebVTT?", answer: "SRT używa znaczników czasu z przecinkami (00:00:01,000) dla odtwarzaczy multimedialnych. WebVTT używa kropek (00:00:01.000) i obsługuje stylowanie CSS dla wideo HTML5." },
      { question: "Czy kody czasowe i numery napisów pozostają idealnie zsynchronizowane?", answer: "Tak. FileKit analizuje znaczniki czasu z dokładnością do mikrosekund bez dryfu czasowego." },
      { question: "Jak używać przekonwertowanych napisów na YouTube?", answer: "Pobierz przekonwertowany plik .vtt lub .srt i prześlij go bezpośrednio w YouTube Studio." }
    ],
    cs: [
      { question: "Jaký je rozdíl mezi titulky SRT a WebVTT?", answer: "SRT používá časová razítka oddělená čárkami (00:00:01,000) pro přehrávače médií. WebVTT používá tečky (00:00:01.000) a podporuje stylování CSS pro HTML5 video." },
      { question: "Zůstanou časové kódy a čísla titulků dokonale synchronizované?", answer: "Ano. FileKit analyzuje časová razítka s přesností na mikrosekundy bez časového posunu." },
      { question: "Jak použiji převedené titulky na YouTube?", answer: "Stáhněte si převedený soubor .vtt nebo .srt a nahrajte jej přímo v YouTube Studiu." }
    ],
    hu: [
      { question: "Mi a különbség az SRT és a WebVTT feliratok között?", answer: "Az SRT vesszővel elválasztott ezredmásodperces időbélyegeket (00:00:01,000) használ médialejátszókhoz. A WebVTT pontot (00:00:01.000) használ és támogatja a CSS-stílust HTML5 videóhoz." },
      { question: "Az időkódok és feliratszámok tökéletesen szinkronban maradnak?", answer: "Igen. A FileKit mikroszekundum pontossággal elemzi az időbélyegeket időeltolódás nélkül." },
      { question: "Hogyan használhatom a konvertált feliratokat a YouTube-on?", answer: "Töltse le a konvertált .vtt vagy .srt fájlt és töltse fel közvetlenül a YouTube Studióba." }
    ],
    ro: [
      { question: "Care este diferența dintre subtitrările SRT și WebVTT?", answer: "SRT folosește marcaje de timp separate prin virgulă (00:00:01,000) pentru playere media. WebVTT folosește puncte (00:00:01.000) și suportă stiluri CSS pentru video HTML5." },
      { question: "Codurile de timp și numerele de subtitrare rămân perfect sincronizate?", answer: "Da. FileKit analizează marcajele de timp cu precizie de microsecundă fără decalaj temporal." },
      { question: "Cum folosesc subtitrările convertite pe YouTube?", answer: "Descărcați fișierul .vtt sau .srt convertit și încărcați-l direct în YouTube Studio." }
    ],
    bg: [
      { question: "Каква е разликата между субтитрите SRT и WebVTT?", answer: "SRT използва времеви маркери, разделени със запетаи (00:00:01,000), за медийни плейъри. WebVTT използва точки (00:00:01.000) и поддържа CSS стилизиране за HTML5 видео." },
      { question: "Таймкодовете и номерата на субтитрите остават ли перфектно синхронизирани?", answer: "Да. FileKit анализира времеви маркери с точност до микросекунда без времеви отклонения." },
      { question: "Как да използвам конвертираните субтитри в YouTube?", answer: "Изтеглете конвертирания .vtt или .srt файл и го качете директно в YouTube Studio." }
    ],
    el: [
      { question: "Ποια είναι η διαφορά μεταξύ υποτίτλων SRT και WebVTT;", answer: "Το SRT χρησιμοποιεί χρονοσημάνσεις χιλιοστών του δευτερολέπτου (00:00:01,000) για media players. Το WebVTT χρησιμοποιεί τελείες (00:00:01.000) και υποστηρίζει CSS για βίντεο HTML5." },
      { question: "Οι κωδικοί χρόνου και οι αριθμοί υποτίτλων παραμένουν σε τέλειο συγχρονισμό;", answer: "Ναι. Το FileKit αναλύει χρονοσημάνσεις με ακρίβεια μικροδευτερολέπτου χωρίς χρονική ολίσθηση." },
      { question: "Πώς χρησιμοποιώ τους μετατραπέντες υπότιτλους στο YouTube;", answer: "Κατεβάστε το αρχείο .vtt ή .srt και ανεβάστε το απευθείας στο YouTube Studio." }
    ],
    sk: [
      { question: "Aký je rozdiel medzi titulkami SRT a WebVTT?", answer: "SRT používa časové pečiatky oddelené čiarkami (00:00:01,000) pre prehrávače médií. WebVTT používa bodky (00:00:01.000) a podporuje CSS štýly pre HTML5 video." },
      { question: "Zostanú časové kódy a čísla titulkov dokonale synchronizované?", answer: "Áno. FileKit analyzuje časové pečiatky s presnosťou na mikrosekundy bez časového posunu." },
      { question: "Ako použijem prevedené titulky na YouTube?", answer: "Stiahnite si prevedený súbor .vtt alebo .srt a nahrajte ho priamo v YouTube Studiu." }
    ],
    sl: [
      { question: "Kakšna je razlika med podnapisi SRT in WebVTT?", answer: "SRT uporablja časovne žige, ločene z vejicami (00:00:01,000), za predvajalnike. WebVTT uporablja pike (00:00:01.000) in podpira CSS-oblikovanje za HTML5 video." },
      { question: "Ali časovne kode in številke podnapisov ostanejo popolnoma sinhronizirane?", answer: "Da. FileKit razčlenjuje časovne žige z natančnostjo mikrosekund brez časovnega zamika." },
      { question: "Kako uporabim pretvorjene podnapise na YouTube?", answer: "Prenesite pretvorjeno datoteko .vtt ali .srt in jo naložite neposredno v YouTube Studio." }
    ],
    ru: [
      { question: "В чём разница между субтитрами SRT и WebVTT?", answer: "SRT использует временные метки с запятыми (00:00:01,000) для медиаплееров. WebVTT использует точки (00:00:01.000) и поддерживает CSS-стили для HTML5-видео." },
      { question: "Сохраняются ли таймкоды и номера субтитров в идеальной синхронизации?", answer: "Да. FileKit анализирует временные метки с точностью до микросекунды без временного дрейфа." },
      { question: "Как использовать конвертированные субтитры на YouTube?", answer: "Скачайте конвертированный файл .vtt или .srt и загрузите его напрямую в YouTube Студию." }
    ],
    uk: [
      { question: "Яка різниця між субтитрами SRT та WebVTT?", answer: "SRT використовує мітки часу з комами (00:00:01,000) для медіаплеєрів. WebVTT використовує крапки (00:00:01.000) та підтримує CSS-стилі для HTML5-відео." },
      { question: "Чи зберігаються таймкоди та номери субтитрів у ідеальній синхронізації?", answer: "Так. FileKit аналізує мітки часу з точністю до мікросекунди без часового дрейфу." },
      { question: "Як використовувати конвертовані субтитри на YouTube?", answer: "Завантажте конвертований файл .vtt або .srt і завантажте його безпосередньо в YouTube Студію." }
    ],
    lv: [
      { question: "Kāda ir atšķirība starp SRT un WebVTT subtitriem?", answer: "SRT izmanto ar komatu atdalītus milisekunžu laika zīmogus (00:00:01,000) multivides atskaņotājiem. WebVTT izmanto punktus (00:00:01.000) un atbalsta CSS stilus HTML5 video." },
      { question: "Vai laika kodi un subtitru numuri paliek perfekti sinhronizēti?", answer: "Jā. FileKit analizē laika zīmogus ar mikrosekunžu precizitāti bez laika novirzes." },
      { question: "Kā lietot konvertētos subtitrus YouTube?", answer: "Lejupielādējiet konvertēto .vtt vai .srt failu un augšupielādējiet to tieši YouTube Studio." }
    ],
    lt: [
      { question: "Koks skirtumas tarp SRT ir WebVTT subtitrų?", answer: "SRT naudoja kableliais atskirtus milisekundžių laiko žymes (00:00:01,000) medijos grotuvams. WebVTT naudoja taškus (00:00:01.000) ir palaiko CSS stilius HTML5 vaizdo įrašams." },
      { question: "Ar laiko kodai ir subtitrų numeriai išlieka puikiai sinchronizuoti?", answer: "Taip. FileKit analizuoja laiko žymes su mikrosekundžių tikslumu be laiko nukrypimo." },
      { question: "Kaip naudoti konvertuotus subtitrus YouTube?", answer: "Atsisiųskite konvertuotą .vtt ar .srt failą ir įkelkite jį tiesiai į YouTube Studio." }
    ],
    tr: [
      { question: "SRT ve WebVTT altyazıları arasındaki fark nedir?", answer: "SRT, medya oynatıcılar için virgülle ayrılmış milisaniye zaman damgaları (00:00:01,000) kullanır. WebVTT, nokta zaman damgaları (00:00:01.000) kullanır ve HTML5 video için CSS stillerini destekler." },
      { question: "Zaman kodları ve altyazı numaraları mükemmel senkronize kalır mı?", answer: "Evet. FileKit, zaman damgalarını mikrosaniye hassasiyetiyle ayrıştırır ve zaman kayması olmadan yeniden biçimlendirir." },
      { question: "Dönüştürülen altyazıları YouTube'da nasıl kullanırım?", answer: "Dönüştürülen .vtt veya .srt dosyasını indirin ve doğrudan YouTube Studio'ya yükleyin." }
    ],
    ar: [
      { question: "ما الفرق بين ترجمات SRT وWebVTT؟", answer: "يستخدم SRT طوابع زمنية بالفواصل (00:00:01,000) لمشغلات الوسائط. يستخدم WebVTT النقاط (00:00:01.000) ويدعم أنماط CSS لفيديو HTML5." },
      { question: "هل تبقى رموز الوقت وأرقام الترجمة متزامنة تماماً؟", answer: "نعم. يحلل FileKit الطوابع الزمنية بدقة الميكروثانية بدون انحراف زمني." },
      { question: "كيف أستخدم الترجمات المحولة على YouTube؟", answer: "قم بتنزيل ملف .vtt أو .srt المحول وارفعه مباشرة في YouTube Studio." }
    ],
    he: [
      { question: "מה ההבדל בין כתוביות SRT ו-WebVTT?", answer: "SRT משתמש בחותמות זמן מופרדות בפסיקים (00:00:01,000) לנגני מדיה. WebVTT משתמש בנקודות (00:00:01.000) ותומך בעיצוב CSS לווידאו HTML5." },
      { question: "האם קודי הזמן ומספרי הכתוביות נשמרים בסנכרון מושלם?", answer: "כן. FileKit מנתח חותמות זמן בדיוק מיקרו-שנייה ללא סחף זמן." },
      { question: "כיצד להשתמש בכתוביות שהומרו ב-YouTube?", answer: "הורידו את קובץ ה-.vtt או .srt והעלו אותו ישירות ב-YouTube Studio." }
    ],
    hi: [
      { question: "SRT और WebVTT सबटाइटल में क्या अंतर है?", answer: "SRT मीडिया प्लेयर्स के लिए कॉमा से अलग किए गए मिलीसेकंड टाइमस्टैम्प (00:00:01,000) का उपयोग करता है। WebVTT बिंदु (00:00:01.000) का उपयोग करता है और HTML5 वीडियो के लिए CSS स्टाइलिंग का समर्थन करता है।" },
      { question: "क्या टाइमकोड और सबटाइटल नंबर पूरी तरह से सिंक में रहते हैं?", answer: "हाँ। FileKit माइक्रोसेकंड सटीकता के साथ टाइमस्टैम्प का विश्लेषण करता है बिना किसी समय विचलन के।" },
      { question: "YouTube पर कन्वर्ट किए गए सबटाइटल का उपयोग कैसे करें?", answer: "कन्वर्ट की गई .vtt या .srt फ़ाइल डाउनलोड करें और YouTube Studio में सीधे अपलोड करें।" }
    ],
    id: [
      { question: "Apa perbedaan antara subtitle SRT dan WebVTT?", answer: "SRT menggunakan timestamp milidetik yang dipisahkan koma (00:00:01,000) untuk pemutar media. WebVTT menggunakan titik (00:00:01.000) dan mendukung gaya CSS untuk video HTML5." },
      { question: "Apakah timecode dan nomor subtitle tetap sinkron sempurna?", answer: "Ya. FileKit mengurai timestamp dengan presisi mikrodetik tanpa penyimpangan waktu." },
      { question: "Bagaimana cara menggunakan subtitle yang dikonversi di YouTube?", answer: "Unduh file .vtt atau .srt yang dikonversi dan unggah langsung di YouTube Studio." }
    ],
    ms: [
      { question: "Apakah perbezaan antara sari kata SRT dan WebVTT?", answer: "SRT menggunakan cap masa milisaat dipisahkan koma (00:00:01,000) untuk pemain media. WebVTT menggunakan titik (00:00:01.000) dan menyokong gaya CSS untuk video HTML5." },
      { question: "Adakah kod masa dan nombor sari kata kekal sinkron sempurna?", answer: "Ya. FileKit mengurai cap masa dengan ketepatan mikrosaat tanpa hanyutan masa." },
      { question: "Bagaimana cara menggunakan sari kata yang ditukar di YouTube?", answer: "Muat turun fail .vtt atau .srt dan muat naik terus dalam YouTube Studio." }
    ],
    th: [
      { question: "ความแตกต่างระหว่างคำบรรยาย SRT และ WebVTT คืออะไร?", answer: "SRT ใช้ประทับเวลามิลลิวินาทีคั่นด้วยจุลภาค (00:00:01,000) สำหรับเครื่องเล่นสื่อ WebVTT ใช้จุด (00:00:01.000) และรองรับ CSS สำหรับวิดีโอ HTML5" },
      { question: "รหัสเวลาและหมายเลขคำบรรยายยังคงซิงค์สมบูรณ์แบบหรือไม่?", answer: "ใช่ FileKit วิเคราะห์ประทับเวลาด้วยความแม่นยำระดับไมโครวินาทีโดยไม่มีการเบี่ยงเบนเวลา" },
      { question: "จะใช้คำบรรยายที่แปลงแล้วบน YouTube ได้อย่างไร?", answer: "ดาวน์โหลดไฟล์ .vtt หรือ .srt และอัปโหลดโดยตรงใน YouTube Studio" }
    ],
    vi: [
      { question: "Sự khác biệt giữa phụ đề SRT và WebVTT là gì?", answer: "SRT sử dụng dấu thời gian phân cách bằng dấu phẩy (00:00:01,000) cho trình phát media. WebVTT sử dụng dấu chấm (00:00:01.000) và hỗ trợ CSS cho video HTML5." },
      { question: "Mã thời gian và số thứ tự phụ đề có được giữ đồng bộ hoàn hảo không?", answer: "Có. FileKit phân tích dấu thời gian với độ chính xác micro giây mà không có độ trệ thời gian." },
      { question: "Làm thế nào để sử dụng phụ đề đã chuyển đổi trên YouTube?", answer: "Tải file .vtt hoặc .srt đã chuyển đổi và tải lên trực tiếp trong YouTube Studio." }
    ],
    fil: [
      { question: "Ano ang pagkakaiba ng SRT at WebVTT subtitles?", answer: "Gumagamit ang SRT ng comma-separated millisecond timestamps (00:00:01,000) para sa media players. Gumagamit ang WebVTT ng period (00:00:01.000) at sumusuporta ng CSS styling para sa HTML5 video." },
      { question: "Nananatili bang perfectly synced ang timecodes at subtitle numbers?", answer: "Oo. Bina-parse ng FileKit ang timestamps na may microsecond na katumpakan nang walang timing drift." },
      { question: "Paano gamitin ang converted subtitles sa YouTube?", answer: "I-download ang converted .vtt o .srt file at i-upload ito direkta sa YouTube Studio." }
    ],
    ja: [
      { question: "SRTとWebVTT字幕の違いは何ですか？", answer: "SRTはメディアプレーヤー向けにカンマ区切りのミリ秒タイムスタンプ（00:00:01,000）を使用します。WebVTTはピリオド（00:00:01.000）を使用し、HTML5ビデオ向けのCSSスタイリングをサポートします。" },
      { question: "タイムコードと字幕番号は完全に同期されますか？", answer: "はい。FileKitはマイクロ秒精度でタイムスタンプを解析し、時間のずれなく再フォーマットします。" },
      { question: "変換した字幕をYouTubeで使用するにはどうすればよいですか？", answer: "変換された.vttまたは.srtファイルをダウンロードし、YouTube Studioに直接アップロードしてください。" }
    ],
    ko: [
      { question: "SRT와 WebVTT 자막의 차이점은 무엇인가요?", answer: "SRT는 미디어 플레이어용으로 쉼표로 구분된 밀리초 타임스탬프(00:00:01,000)를 사용합니다. WebVTT는 마침표(00:00:01.000)를 사용하며 HTML5 비디오용 CSS 스타일링을 지원합니다." },
      { question: "타임코드와 자막 번호가 완벽하게 동기화 상태를 유지하나요?", answer: "네. FileKit은 마이크로초 정밀도로 타임스탬프를 분석하며 타이밍 드리프트가 없습니다." },
      { question: "변환된 자막을 YouTube에서 어떻게 사용하나요?", answer: "변환된 .vtt 또는 .srt 파일을 다운로드하여 YouTube 스튜디오에 직접 업로드하세요." }
    ],
    "zh-CN": [
      { question: "SRT 和 WebVTT 字幕有什么区别？", answer: "SRT 使用逗号分隔的毫秒时间戳（00:00:01,000）适用于媒体播放器。WebVTT 使用句点（00:00:01.000）并支持 HTML5 视频的 CSS 样式。" },
      { question: "时间码和字幕编号能保持完美同步吗？", answer: "是的。FileKit 以微秒精度解析时间戳，无时间偏移。" },
      { question: "如何在 YouTube 上使用转换后的字幕？", answer: "下载转换后的 .vtt 或 .srt 文件，直接上传到 YouTube Studio。" }
    ],
    "zh-TW": [
      { question: "SRT 和 WebVTT 字幕有什麼區別？", answer: "SRT 使用逗號分隔的毫秒時間戳（00:00:01,000）適用於媒體播放器。WebVTT 使用句點（00:00:01.000）並支援 HTML5 影片的 CSS 樣式。" },
      { question: "時間碼和字幕編號能保持完美同步嗎？", answer: "是的。FileKit 以微秒精度解析時間戳，無時間偏移。" },
      { question: "如何在 YouTube 上使用轉換後的字幕？", answer: "下載轉換後的 .vtt 或 .srt 檔案，直接上傳到 YouTube Studio。" }
    ],
  },
  apple: {
    en: [
      { question: "How do I open Apple Pages, Numbers, or Keynote files on Windows or Android?", answer: "Simply upload your .pages, .numbers, or .key file to FileKit to convert it into universally compatible PDF, Word (DOCX), or Excel (XLSX) formats." },
      { question: "Will Apple fonts, mathematical formulas, and spreadsheet tables stay intact?", answer: "Yes. The engine converts typography, cell formatting, formulas, and slide transitions with pixel-perfect visual fidelity." },
      { question: "Do I need an iCloud account or an Apple device to convert iWork files?", answer: "No. FileKit works on any device and modern web browser with zero Apple accounts or cloud logins required." }
    ],
    es: [
      { question: "¿Cómo abro archivos de Apple Pages, Numbers o Keynote en Windows o Android?", answer: "Sube tu archivo .pages, .numbers o .key a FileKit para convertirlo a formatos universales como PDF, Word (DOCX) o Excel (XLSX)." },
      { question: "¿Se mantienen intactas las fuentes, fórmulas y tablas?", answer: "Sí. El motor convierte tipografías, formatos de celda, fórmulas y diapositivas con total fidelidad visual." },
      { question: "¿Necesito una cuenta de iCloud o un dispositivo Apple?", answer: "No. FileKit funciona en cualquier dispositivo y navegador moderno sin necesidad de cuentas de Apple." }
    ],
    "es-419": [
      { question: "¿Cómo abro archivos de Apple Pages, Numbers o Keynote en Windows o Android?", answer: "Carga tu archivo .pages, .numbers o .key en FileKit para convertirlo a PDF, Word (DOCX) o Excel (XLSX)." },
      { question: "¿Las fuentes, fórmulas y tablas se mantienen intactas?", answer: "Sí. El motor convierte tipografías, formato de celdas, fórmulas y transiciones con fidelidad visual total." },
      { question: "¿Necesito cuenta de iCloud o dispositivo Apple?", answer: "No. FileKit funciona en cualquier dispositivo y navegador moderno sin cuentas de Apple." }
    ],
    de: [
      { question: "Wie öffne ich Apple Pages-, Numbers- oder Keynote-Dateien unter Windows oder Android?", answer: "Laden Sie Ihre .pages-, .numbers- oder .key-Datei in FileKit hoch, um sie in universelle Formate wie PDF, Word (DOCX) oder Excel (XLSX) zu konvertieren." },
      { question: "Bleiben Apple-Schriftarten, Formeln und Tabellen erhalten?", answer: "Ja. Die Engine konvertiert Typografie, Zellformatierung, Formeln und Folienübergänge mit pixelgenauer Wiedergabe." },
      { question: "Benötige ich ein iCloud-Konto oder ein Apple-Gerät?", answer: "Nein. FileKit funktioniert auf jedem Gerät und in jedem modernen Browser ohne Apple-Konten." }
    ],
    fr: [
      { question: "Comment ouvrir des fichiers Apple Pages, Numbers ou Keynote sur Windows ou Android ?", answer: "Importez votre fichier .pages, .numbers ou .key dans FileKit pour le convertir en PDF, Word (DOCX) ou Excel (XLSX)." },
      { question: "Les polices Apple, formules et tableaux restent-ils intacts ?", answer: "Oui. Le moteur convertit la typographie, le formatage des cellules et les transitions avec une fidélité visuelle parfaite." },
      { question: "Ai-je besoin d'un compte iCloud ou d'un appareil Apple ?", answer: "Non. FileKit fonctionne sur tout appareil et navigateur moderne sans compte Apple requis." }
    ],
    pt: [
      { question: "Como abro ficheiros Apple Pages, Numbers ou Keynote no Windows ou Android?", answer: "Carregue o seu ficheiro .pages, .numbers ou .key no FileKit para o converter em PDF, Word (DOCX) ou Excel (XLSX)." },
      { question: "As fontes Apple, fórmulas e tabelas mantêm-se intactas?", answer: "Sim. O motor converte tipografia, formatação de células e transições com fidelidade visual perfeita." },
      { question: "Preciso de uma conta iCloud ou dispositivo Apple?", answer: "Não. O FileKit funciona em qualquer dispositivo e navegador moderno sem contas Apple." }
    ],
    "pt-BR": [
      { question: "Como abro arquivos Apple Pages, Numbers ou Keynote no Windows ou Android?", answer: "Carregue seu arquivo .pages, .numbers ou .key no FileKit para convertê-lo em PDF, Word (DOCX) ou Excel (XLSX)." },
      { question: "As fontes Apple, fórmulas e tabelas se mantêm intactas?", answer: "Sim. O motor converte tipografia, formatação de células e transições com fidelidade visual perfeita." },
      { question: "Preciso de conta iCloud ou dispositivo Apple?", answer: "Não. O FileKit funciona em qualquer dispositivo e navegador moderno sem contas Apple." }
    ],
    it: [
      { question: "Come apro i file Apple Pages, Numbers o Keynote su Windows o Android?", answer: "Carica il tuo file .pages, .numbers o .key su FileKit per convertirlo in PDF, Word (DOCX) o Excel (XLSX)." },
      { question: "I font Apple, le formule e le tabelle restano intatti?", answer: "Sì. Il motore converte tipografia, formattazione celle e transizioni con fedeltà visiva perfetta." },
      { question: "Ho bisogno di un account iCloud o di un dispositivo Apple?", answer: "No. FileKit funziona su qualsiasi dispositivo e browser moderno senza account Apple." }
    ],
    nl: [
      { question: "Hoe open ik Apple Pages-, Numbers- of Keynote-bestanden op Windows of Android?", answer: "Upload uw .pages-, .numbers- of .key-bestand naar FileKit om het te converteren naar PDF, Word (DOCX) of Excel (XLSX)." },
      { question: "Blijven Apple-lettertypen, formules en tabellen behouden?", answer: "Ja. De engine converteert typografie, celopmaak en overgangen met pixelperfecte visuele betrouwbaarheid." },
      { question: "Heb ik een iCloud-account of Apple-apparaat nodig?", answer: "Nee. FileKit werkt op elk apparaat en in elke moderne browser zonder Apple-accounts." }
    ],
    ca: [
      { question: "Com obro fitxers d'Apple Pages, Numbers o Keynote a Windows o Android?", answer: "Puja el teu fitxer .pages, .numbers o .key a FileKit per convertir-lo a PDF, Word (DOCX) o Excel (XLSX)." },
      { question: "Es mantenen les fonts Apple, fórmules i taules?", answer: "Sí. El motor converteix tipografia, format de cel·les i transicions amb fidelitat visual perfecta." },
      { question: "Necessito un compte d'iCloud o un dispositiu Apple?", answer: "No. FileKit funciona en qualsevol dispositiu i navegador modern sense comptes d'Apple." }
    ],
    sv: [
      { question: "Hur öppnar jag Apple Pages-, Numbers- eller Keynote-filer på Windows eller Android?", answer: "Ladda upp din .pages-, .numbers- eller .key-fil till FileKit för att konvertera den till PDF, Word (DOCX) eller Excel (XLSX)." },
      { question: "Bevaras Apple-typsnitt, formler och tabeller?", answer: "Ja. Motorn konverterar typografi, cellformatering och övergångar med pixelperfekt visuell trohet." },
      { question: "Behöver jag ett iCloud-konto eller en Apple-enhet?", answer: "Nej. FileKit fungerar på alla enheter och moderna webbläsare utan Apple-konton." }
    ],
    da: [
      { question: "Hvordan åbner jeg Apple Pages-, Numbers- eller Keynote-filer på Windows eller Android?", answer: "Upload din .pages-, .numbers- eller .key-fil til FileKit for at konvertere den til PDF, Word (DOCX) eller Excel (XLSX)." },
      { question: "Bevares Apple-skrifttyper, formler og tabeller?", answer: "Ja. Motoren konverterer typografi, celleformatering og overgange med perfekt visuel gengivelse." },
      { question: "Har jeg brug for en iCloud-konto eller en Apple-enhed?", answer: "Nej. FileKit fungerer på enhver enhed og moderne browser uden Apple-konti." }
    ],
    fi: [
      { question: "Miten avaan Apple Pages-, Numbers- tai Keynote-tiedostoja Windowsilla tai Androidilla?", answer: "Lataa .pages-, .numbers- tai .key-tiedostosi FileKitiin muuntaaksesi sen PDF-, Word (DOCX)- tai Excel (XLSX) -muotoon." },
      { question: "Säilyvätkö Apple-fontit, kaavat ja taulukot?", answer: "Kyllä. Moottori muuntaa typografian, solumuotoilun ja siirtymät pikselitarkasti." },
      { question: "Tarvitsenko iCloud-tilin tai Apple-laitteen?", answer: "Ei. FileKit toimii millä tahansa laitteella ja nykyaikaisella selaimella ilman Apple-tilejä." }
    ],
    no: [
      { question: "Hvordan åpner jeg Apple Pages-, Numbers- eller Keynote-filer på Windows eller Android?", answer: "Last opp .pages-, .numbers- eller .key-filen din til FileKit for å konvertere den til PDF, Word (DOCX) eller Excel (XLSX)." },
      { question: "Bevares Apple-skrifttyper, formler og tabeller?", answer: "Ja. Motoren konverterer typografi, celleformatering og overganger med pikselpresis visuell troskap." },
      { question: "Trenger jeg en iCloud-konto eller en Apple-enhet?", answer: "Nei. FileKit fungerer på alle enheter og moderne nettlesere uten Apple-kontoer." }
    ],
    pl: [
      { question: "Jak otworzyć pliki Apple Pages, Numbers lub Keynote na Windowsie lub Androidzie?", answer: "Prześlij plik .pages, .numbers lub .key do FileKit, aby przekonwertować go na PDF, Word (DOCX) lub Excel (XLSX)." },
      { question: "Czy czcionki Apple, formuły i tabele są zachowane?", answer: "Tak. Silnik konwertuje typografię, formatowanie komórek i przejścia z idealną wiernością wizualną." },
      { question: "Czy potrzebuję konta iCloud lub urządzenia Apple?", answer: "Nie. FileKit działa na każdym urządzeniu i nowoczesnej przeglądarce bez kont Apple." }
    ],
    cs: [
      { question: "Jak otevřu soubory Apple Pages, Numbers nebo Keynote na Windows nebo Android?", answer: "Nahrajte svůj soubor .pages, .numbers nebo .key do FileKit a převeďte ho do formátu PDF, Word (DOCX) nebo Excel (XLSX)." },
      { question: "Zachovají se písma Apple, vzorce a tabulky?", answer: "Ano. Motor převádí typografii, formátování buněk a přechody s dokonalou vizuální věrností." },
      { question: "Potřebuji účet iCloud nebo zařízení Apple?", answer: "Ne. FileKit funguje na jakémkoli zařízení a moderním prohlížeči bez účtů Apple." }
    ],
    hu: [
      { question: "Hogyan nyithatok meg Apple Pages, Numbers vagy Keynote fájlokat Windowson vagy Androidon?", answer: "Töltse fel .pages, .numbers vagy .key fájlját a FileKitbe PDF, Word (DOCX) vagy Excel (XLSX) formátumba konvertáláshoz." },
      { question: "Megmaradnak az Apple betűtípusok, képletek és táblázatok?", answer: "Igen. A motor pixelpontos vizuális hűséggel konvertálja a tipográfiát, cellaformázást és átmeneteket." },
      { question: "Szükségem van iCloud-fiókra vagy Apple-eszközre?", answer: "Nem. A FileKit bármilyen eszközön és modern böngészőben működik Apple-fiókok nélkül." }
    ],
    ro: [
      { question: "Cum deschid fișiere Apple Pages, Numbers sau Keynote pe Windows sau Android?", answer: "Încărcați fișierul .pages, .numbers sau .key în FileKit pentru a-l converti în PDF, Word (DOCX) sau Excel (XLSX)." },
      { question: "Se păstrează fonturile Apple, formulele și tabelele?", answer: "Da. Motorul convertește tipografia, formatarea celulelor și tranzițiile cu fidelitate vizuală perfectă." },
      { question: "Am nevoie de un cont iCloud sau un dispozitiv Apple?", answer: "Nu. FileKit funcționează pe orice dispozitiv și browser modern fără conturi Apple." }
    ],
    bg: [
      { question: "Как да отворя файлове Apple Pages, Numbers или Keynote на Windows или Android?", answer: "Качете вашия .pages, .numbers или .key файл във FileKit, за да го конвертирате в PDF, Word (DOCX) или Excel (XLSX)." },
      { question: "Запазват ли се шрифтовете на Apple, формулите и таблиците?", answer: "Да. Двигателят конвертира типографията, форматирането на клетките и преходите с перфектна визуална прецизност." },
      { question: "Имам ли нужда от iCloud акаунт или Apple устройство?", answer: "Не. FileKit работи на всяко устройство и модерен браузър без Apple акаунти." }
    ],
    el: [
      { question: "Πώς ανοίγω αρχεία Apple Pages, Numbers ή Keynote σε Windows ή Android;", answer: "Ανεβάστε το αρχείο .pages, .numbers ή .key στο FileKit για μετατροπή σε PDF, Word (DOCX) ή Excel (XLSX)." },
      { question: "Διατηρούνται οι γραμματοσειρές Apple, οι τύποι και οι πίνακες;", answer: "Ναι. Ο κινητήρας μετατρέπει τυπογραφία, μορφοποίηση κελιών και μεταβάσεις με τέλεια οπτική πιστότητα." },
      { question: "Χρειάζομαι λογαριασμό iCloud ή συσκευή Apple;", answer: "Όχι. Το FileKit λειτουργεί σε οποιαδήποτε συσκευή και σύγχρονο browser χωρίς λογαριασμούς Apple." }
    ],
    sk: [
      { question: "Ako otvorím súbory Apple Pages, Numbers alebo Keynote na Windowse alebo Androide?", answer: "Nahrajte svoj súbor .pages, .numbers alebo .key do FileKit na konverziu do PDF, Word (DOCX) alebo Excel (XLSX)." },
      { question: "Zachovajú sa písma Apple, vzorce a tabuľky?", answer: "Áno. Motor prevádza typografiu, formátovanie buniek a prechody s dokonalou vizuálnou vernosťou." },
      { question: "Potrebujem účet iCloud alebo zariadenie Apple?", answer: "Nie. FileKit funguje na akomkoľvek zariadení a modernom prehliadači bez účtov Apple." }
    ],
    sl: [
      { question: "Kako odpreti datoteke Apple Pages, Numbers ali Keynote v sistemu Windows ali Android?", answer: "Naložite datoteko .pages, .numbers ali .key v FileKit za pretvorbo v PDF, Word (DOCX) ali Excel (XLSX)." },
      { question: "Ali se Applove pisave, formule in tabele ohranijo?", answer: "Da. Motor pretvori tipografijo, oblikovanje celic in prehode s popolno vizualno zvestobo." },
      { question: "Ali potrebujem račun iCloud ali napravo Apple?", answer: "Ne. FileKit deluje na kateri koli napravi in sodobnem brskalniku brez Apple računov." }
    ],
    ru: [
      { question: "Как открыть файлы Apple Pages, Numbers или Keynote на Windows или Android?", answer: "Загрузите файл .pages, .numbers или .key в FileKit для конвертации в PDF, Word (DOCX) или Excel (XLSX)." },
      { question: "Сохраняются ли шрифты Apple, формулы и таблицы?", answer: "Да. Движок конвертирует типографику, форматирование ячеек и переходы с пиксельной точностью." },
      { question: "Нужен ли мне аккаунт iCloud или устройство Apple?", answer: "Нет. FileKit работает на любом устройстве и в любом современном браузере без аккаунтов Apple." }
    ],
    uk: [
      { question: "Як відкрити файли Apple Pages, Numbers або Keynote на Windows або Android?", answer: "Завантажте файл .pages, .numbers або .key у FileKit для конвертації в PDF, Word (DOCX) або Excel (XLSX)." },
      { question: "Чи зберігаються шрифти Apple, формули та таблиці?", answer: "Так. Двигун конвертує типографіку, форматування комірок та переходи з піксельною точністю." },
      { question: "Чи потрібен мені обліковий запис iCloud або пристрій Apple?", answer: "Ні. FileKit працює на будь-якому пристрої та сучасному браузері без облікових записів Apple." }
    ],
    lv: [
      { question: "Kā atvērt Apple Pages, Numbers vai Keynote failus Windows vai Android ierīcē?", answer: "Augšupielādējiet .pages, .numbers vai .key failu FileKit, lai to pārvērstu PDF, Word (DOCX) vai Excel (XLSX) formātā." },
      { question: "Vai Apple fonti, formulas un tabulas tiek saglabātas?", answer: "Jā. Dzinējs pārveido tipogrāfiju, šūnu formatēšanu un pārejas ar perfektu vizuālo precizitāti." },
      { question: "Vai man ir nepieciešams iCloud konts vai Apple ierīce?", answer: "Nē. FileKit darbojas jebkurā ierīcē un modernā pārlūkprogrammā bez Apple kontiem." }
    ],
    lt: [
      { question: "Kaip atidaryti Apple Pages, Numbers ar Keynote failus Windows arba Android?", answer: "Įkelkite savo .pages, .numbers ar .key failą į FileKit, kad konvertuotumėte jį į PDF, Word (DOCX) ar Excel (XLSX)." },
      { question: "Ar Apple šriftai, formulės ir lentelės išsaugomi?", answer: "Taip. Variklis konvertuoja tipografiją, langelių formatavimą ir perėjimus su pikselių tikslumu." },
      { question: "Ar man reikia iCloud paskyros arba Apple įrenginio?", answer: "Ne. FileKit veikia bet kuriame įrenginyje ir naršyklėje be Apple paskyrų." }
    ],
    tr: [
      { question: "Windows veya Android'de Apple Pages, Numbers veya Keynote dosyalarını nasıl açarım?", answer: ".pages, .numbers veya .key dosyanızı FileKit'e yükleyerek PDF, Word (DOCX) veya Excel (XLSX) formatına dönüştürün." },
      { question: "Apple yazı tipleri, formüller ve tablolar korunur mu?", answer: "Evet. Motor tipografiyi, hücre biçimlendirmesini ve geçişleri piksel mükemmelliğinde görsel sadakatle dönüştürür." },
      { question: "Bir iCloud hesabına veya Apple cihazına ihtiyacım var mı?", answer: "Hayır. FileKit herhangi bir cihazda ve modern tarayıcıda Apple hesabı olmadan çalışır." }
    ],
    ar: [
      { question: "كيف أفتح ملفات Apple Pages أو Numbers أو Keynote على Windows أو Android؟", answer: "ارفع ملفك .pages أو .numbers أو .key إلى FileKit لتحويله إلى PDF أو Word (DOCX) أو Excel (XLSX)." },
      { question: "هل تبقى خطوط Apple والصيغ والجداول سليمة؟", answer: "نعم. يحول المحرك الخطوط وتنسيق الخلايا والانتقالات بدقة بصرية مثالية." },
      { question: "هل أحتاج حساب iCloud أو جهاز Apple؟", answer: "لا. يعمل FileKit على أي جهاز ومتصفح حديث بدون حسابات Apple." }
    ],
    he: [
      { question: "כיצד לפתוח קבצי Apple Pages, Numbers או Keynote ב-Windows או Android?", answer: "העלו את קובץ ה-.pages, .numbers או .key ל-FileKit כדי להמירו ל-PDF, Word (DOCX) או Excel (XLSX)." },
      { question: "האם גופני Apple, נוסחאות וטבלאות נשמרים?", answer: "כן. המנוע ממיר טיפוגרפיה, עיצוב תאים ומעברים בנאמנות חזותית מושלמת." },
      { question: "האם אני צריך חשבון iCloud או מכשיר Apple?", answer: "לא. FileKit עובד בכל מכשיר ודפדפן מודרני ללא חשבונות Apple." }
    ],
    hi: [
      { question: "Windows या Android पर Apple Pages, Numbers या Keynote फ़ाइलें कैसे खोलें?", answer: "अपनी .pages, .numbers या .key फ़ाइल FileKit में अपलोड करें और इसे PDF, Word (DOCX) या Excel (XLSX) में कन्वर्ट करें।" },
      { question: "क्या Apple फ़ॉन्ट, फ़ॉर्मूले और टेबल बरकरार रहते हैं?", answer: "हाँ। इंजन टाइपोग्राफी, सेल फ़ॉर्मेटिंग और ट्रांज़िशन को पिक्सल-परफ़ेक्ट विज़ुअल फ़िडेलिटी से कन्वर्ट करता है।" },
      { question: "क्या मुझे iCloud खाता या Apple डिवाइस चाहिए?", answer: "नहीं। FileKit किसी भी डिवाइस और ब्राउज़र पर Apple खातों के बिना काम करता है।" }
    ],
    id: [
      { question: "Bagaimana cara membuka file Apple Pages, Numbers, atau Keynote di Windows atau Android?", answer: "Unggah file .pages, .numbers, atau .key Anda ke FileKit untuk mengonversinya menjadi PDF, Word (DOCX), atau Excel (XLSX)." },
      { question: "Apakah font Apple, rumus, dan tabel tetap utuh?", answer: "Ya. Mesin mengonversi tipografi, format sel, dan transisi dengan ketelitian visual yang sempurna." },
      { question: "Apakah saya perlu akun iCloud atau perangkat Apple?", answer: "Tidak. FileKit berfungsi di perangkat apa pun dan browser modern tanpa akun Apple." }
    ],
    ms: [
      { question: "Bagaimana untuk membuka fail Apple Pages, Numbers atau Keynote di Windows atau Android?", answer: "Muat naik fail .pages, .numbers atau .key anda ke FileKit untuk menukarnya kepada PDF, Word (DOCX) atau Excel (XLSX)." },
      { question: "Adakah fon Apple, formula dan jadual dikekalkan?", answer: "Ya. Enjin menukar tipografi, pemformatan sel dan peralihan dengan kesetiaan visual yang sempurna." },
      { question: "Adakah saya perlukan akaun iCloud atau peranti Apple?", answer: "Tidak. FileKit berfungsi pada mana-mana peranti dan pelayar moden tanpa akaun Apple." }
    ],
    th: [
      { question: "จะเปิดไฟล์ Apple Pages, Numbers หรือ Keynote บน Windows หรือ Android ได้อย่างไร?", answer: "อัปโหลดไฟล์ .pages, .numbers หรือ .key ไปยัง FileKit เพื่อแปลงเป็น PDF, Word (DOCX) หรือ Excel (XLSX)" },
      { question: "ฟอนต์ Apple สูตร และตารางยังคงสมบูรณ์หรือไม่?", answer: "ใช่ เอ็นจิ้นแปลงรูปแบบตัวอักษร การจัดรูปแบบเซลล์ และการเปลี่ยนผ่านด้วยความแม่นยำระดับพิกเซล" },
      { question: "ต้องมีบัญชี iCloud หรืออุปกรณ์ Apple หรือไม่?", answer: "ไม่ FileKit ทำงานได้บนทุกอุปกรณ์และเบราว์เซอร์สมัยใหม่โดยไม่ต้องมีบัญชี Apple" }
    ],
    vi: [
      { question: "Làm cách nào để mở file Apple Pages, Numbers hoặc Keynote trên Windows hoặc Android?", answer: "Tải file .pages, .numbers hoặc .key lên FileKit để chuyển đổi sang PDF, Word (DOCX) hoặc Excel (XLSX)." },
      { question: "Font Apple, công thức và bảng có được giữ nguyên không?", answer: "Có. Bộ xử lý chuyển đổi kiểu chữ, định dạng ô và chuyển tiếp với độ trung thực hình ảnh hoàn hảo." },
      { question: "Tôi có cần tài khoản iCloud hoặc thiết bị Apple không?", answer: "Không. FileKit hoạt động trên mọi thiết bị và trình duyệt hiện đại mà không cần tài khoản Apple." }
    ],
    fil: [
      { question: "Paano buksan ang Apple Pages, Numbers, o Keynote files sa Windows o Android?", answer: "I-upload ang iyong .pages, .numbers, o .key file sa FileKit para i-convert ito sa PDF, Word (DOCX), o Excel (XLSX)." },
      { question: "Nananatili ba ang Apple fonts, formulas, at tables?", answer: "Oo. Kino-convert ng engine ang typography, cell formatting, at transitions na may pixel-perfect na visual fidelity." },
      { question: "Kailangan ko ba ng iCloud account o Apple device?", answer: "Hindi. Gumagana ang FileKit sa anumang device at modernong browser nang walang Apple accounts." }
    ],
    ja: [
      { question: "Windows や Android で Apple Pages、Numbers、Keynote ファイルを開くにはどうすればよいですか？", answer: ".pages、.numbers、または .key ファイルを FileKit にアップロードして、PDF、Word (DOCX)、または Excel (XLSX) に変換します。" },
      { question: "Apple フォント、数式、表は保持されますか？", answer: "はい。エンジンはタイポグラフィ、セルフォーマット、トランジションをピクセルパーフェクトな忠実度で変換します。" },
      { question: "iCloud アカウントや Apple デバイスは必要ですか？", answer: "いいえ。FileKit は Apple アカウントなしで、あらゆるデバイスとモダンブラウザで動作します。" }
    ],
    ko: [
      { question: "Windows나 Android에서 Apple Pages, Numbers 또는 Keynote 파일을 어떻게 열 수 있나요?", answer: ".pages, .numbers 또는 .key 파일을 FileKit에 업로드하여 PDF, Word (DOCX) 또는 Excel (XLSX)로 변환합니다." },
      { question: "Apple 글꼴, 수식 및 표가 유지되나요?", answer: "네. 엔진은 타이포그래피, 셀 서식 및 전환을 픽셀 단위의 시각적 충실도로 변환합니다." },
      { question: "iCloud 계정이나 Apple 기기가 필요한가요?", answer: "아니요. FileKit은 Apple 계정 없이 모든 기기와 최신 브라우저에서 작동합니다." }
    ],
    "zh-CN": [
      { question: "如何在 Windows 或 Android 上打开 Apple Pages、Numbers 或 Keynote 文件？", answer: "将您的 .pages、.numbers 或 .key 文件上传到 FileKit，转换为 PDF、Word (DOCX) 或 Excel (XLSX) 格式。" },
      { question: "Apple 字体、公式和表格是否完整保留？", answer: "是的。引擎以像素级精确度转换排版、单元格格式和过渡效果。" },
      { question: "我需要 iCloud 账户或 Apple 设备吗？", answer: "不需要。FileKit 在任何设备和现代浏览器上运行，无需 Apple 账户。" }
    ],
    "zh-TW": [
      { question: "如何在 Windows 或 Android 上開啟 Apple Pages、Numbers 或 Keynote 檔案？", answer: "將您的 .pages、.numbers 或 .key 檔案上傳到 FileKit，轉換為 PDF、Word (DOCX) 或 Excel (XLSX) 格式。" },
      { question: "Apple 字型、公式和表格是否完整保留？", answer: "是的。引擎以像素級精確度轉換排版、儲存格格式和轉場效果。" },
      { question: "我需要 iCloud 帳號或 Apple 裝置嗎？", answer: "不需要。FileKit 在任何裝置和現代瀏覽器上運行，無需 Apple 帳號。" }
    ],
  },
  image: {
    en: [
      { question: "Does image conversion or compression reduce visual clarity?", answer: "FileKit uses intelligent perceptual quantization to reduce file size while preserving crisp edges, color depth, and sharpness." },
      { question: "Which image format should I choose for the best web performance?", answer: "WebP and AVIF provide the best compression efficiency with up to 70% smaller file sizes than traditional JPG and PNG." },
      { question: "Are my private photos and camera EXIF metadata stored on your servers?", answer: "No. Your photos are processed 100% locally in your browser, and EXIF metadata can be stripped automatically for privacy." }
    ],
    es: [
      { question: "¿La conversión o compresión de imágenes reduce la claridad visual?", answer: "FileKit utiliza cuantización perceptiva inteligente para reducir el tamaño del archivo preservando nitidez y color." },
      { question: "¿Qué formato de imagen es mejor para el rendimiento web?", answer: "WebP y AVIF ofrecen la mejor eficiencia de compresión con tamaños hasta un 70% menores que JPG y PNG." },
      { question: "¿Se almacenan mis fotos privadas y metadatos EXIF en sus servidores?", answer: "No. Tus fotos se procesan 100% localmente en tu navegador y los metadatos EXIF se eliminan para mayor privacidad." }
    ],
    "es-419": [
      { question: "¿La conversión o compresión de imágenes reduce la claridad?", answer: "FileKit usa cuantización perceptiva inteligente para reducir tamaño de archivo preservando nitidez, color y bordes." },
      { question: "¿Qué formato de imagen elegir para mejor rendimiento web?", answer: "WebP y AVIF ofrecen la mejor compresión con archivos hasta 70% más pequeños que JPG y PNG." },
      { question: "¿Mis fotos privadas y metadatos EXIF se almacenan en servidores?", answer: "No. Tus fotos se procesan 100% localmente en tu navegador y los metadatos EXIF se eliminan automáticamente." }
    ],
    de: [
      { question: "Reduziert Bildkonvertierung oder -komprimierung die visuelle Qualität?", answer: "FileKit verwendet intelligente perzeptuelle Quantisierung, um die Dateigröße zu reduzieren und dabei Schärfe, Farbtiefe und Kantenpräzision zu erhalten." },
      { question: "Welches Bildformat eignet sich am besten für die Web-Performance?", answer: "WebP und AVIF bieten die beste Kompressionseffizienz mit bis zu 70% kleineren Dateien als JPG und PNG." },
      { question: "Werden meine privaten Fotos und EXIF-Metadaten auf Ihren Servern gespeichert?", answer: "Nein. Ihre Fotos werden zu 100% lokal im Browser verarbeitet, und EXIF-Metadaten können automatisch entfernt werden." }
    ],
    fr: [
      { question: "La conversion ou compression d'images réduit-elle la qualité visuelle ?", answer: "FileKit utilise une quantification perceptive intelligente pour réduire la taille du fichier tout en préservant la netteté et les couleurs." },
      { question: "Quel format d'image choisir pour les meilleures performances web ?", answer: "WebP et AVIF offrent la meilleure efficacité de compression avec des tailles jusqu'à 70% plus petites que JPG et PNG." },
      { question: "Mes photos privées et métadonnées EXIF sont-elles stockées sur vos serveurs ?", answer: "Non. Vos photos sont traitées 100% localement dans votre navigateur et les métadonnées EXIF peuvent être supprimées automatiquement." }
    ],
    pt: [
      { question: "A conversão ou compressão de imagens reduz a qualidade visual?", answer: "O FileKit utiliza quantização percetual inteligente para reduzir o tamanho do ficheiro preservando nitidez e cores." },
      { question: "Qual formato de imagem escolher para melhor desempenho web?", answer: "WebP e AVIF oferecem a melhor eficiência de compressão com ficheiros até 70% menores que JPG e PNG." },
      { question: "As minhas fotos privadas e metadados EXIF são armazenados nos seus servidores?", answer: "Não. As suas fotos são processadas 100% localmente no navegador e os metadados EXIF podem ser removidos automaticamente." }
    ],
    "pt-BR": [
      { question: "A conversão ou compressão de imagens reduz a qualidade visual?", answer: "O FileKit usa quantização perceptual inteligente para reduzir o tamanho do arquivo preservando nitidez e cores." },
      { question: "Qual formato de imagem escolher para melhor desempenho web?", answer: "WebP e AVIF oferecem a melhor eficiência de compressão com arquivos até 70% menores que JPG e PNG." },
      { question: "Minhas fotos privadas e metadados EXIF são armazenados nos seus servidores?", answer: "Não. Suas fotos são processadas 100% localmente no navegador e os metadados EXIF podem ser removidos automaticamente." }
    ],
    it: [
      { question: "La conversione o compressione delle immagini riduce la qualità visiva?", answer: "FileKit utilizza una quantizzazione percettiva intelligente per ridurre le dimensioni del file preservando nitidezza e colori." },
      { question: "Quale formato di immagine scegliere per le migliori prestazioni web?", answer: "WebP e AVIF offrono la migliore efficienza di compressione con file fino al 70% più piccoli di JPG e PNG." },
      { question: "Le mie foto private e i metadati EXIF sono conservati sui vostri server?", answer: "No. Le foto vengono elaborate al 100% localmente nel browser e i metadati EXIF possono essere rimossi automaticamente." }
    ],
    nl: [
      { question: "Vermindert beeldconversie of -compressie de visuele kwaliteit?", answer: "FileKit gebruikt intelligente perceptuele kwantisering om bestandsgrootte te verkleinen met behoud van scherpte en kleurkwaliteit." },
      { question: "Welk beeldformaat kiezen voor de beste webprestaties?", answer: "WebP en AVIF bieden de beste compressie-efficiëntie met tot 70% kleinere bestanden dan JPG en PNG." },
      { question: "Worden mijn privéfoto's en EXIF-metadata op uw servers opgeslagen?", answer: "Nee. Uw foto's worden 100% lokaal in de browser verwerkt en EXIF-metadata kan automatisch worden verwijderd." }
    ],
    ca: [
      { question: "La conversió o compressió d'imatges redueix la qualitat visual?", answer: "FileKit utilitza quantització perceptiva intel·ligent per reduir la mida del fitxer preservant nitidesa i colors." },
      { question: "Quin format d'imatge triar per al millor rendiment web?", answer: "WebP i AVIF ofereixen la millor eficiència de compressió amb fitxers fins un 70% més petits que JPG i PNG." },
      { question: "Les meves fotos i metadades EXIF s'emmagatzemen als vostres servidors?", answer: "No. Les fotos es processen 100% localment al navegador i les metadades EXIF es poden eliminar automàticament." }
    ],
    sv: [
      { question: "Minskar bildkonvertering eller komprimering den visuella kvaliteten?", answer: "FileKit använder intelligent perceptuell kvantisering för att minska filstorleken och samtidigt bevara skärpa och färgdjup." },
      { question: "Vilket bildformat bör jag välja för bästa webbprestanda?", answer: "WebP och AVIF ger bäst kompressionseffektivitet med upp till 70% mindre filstorlekar än JPG och PNG." },
      { question: "Lagras mina privata foton och EXIF-metadata på era servrar?", answer: "Nej. Dina foton bearbetas 100% lokalt i webbläsaren och EXIF-metadata kan automatiskt tas bort." }
    ],
    da: [
      { question: "Reducerer billedkonvertering eller komprimering den visuelle kvalitet?", answer: "FileKit bruger intelligent perceptuel kvantisering til at reducere filstørrelsen og bevare skarphed og farvedybde." },
      { question: "Hvilket billedformat bør jeg vælge til bedste webydelse?", answer: "WebP og AVIF giver bedst komprimeringseffektivitet med op til 70% mindre filstørrelser end JPG og PNG." },
      { question: "Gemmes mine private fotos og EXIF-metadata på jeres servere?", answer: "Nej. Dine fotos behandles 100% lokalt i browseren, og EXIF-metadata kan automatisk fjernes." }
    ],
    fi: [
      { question: "Vähentääkö kuvan muuntaminen tai pakkaaminen visuaalista laatua?", answer: "FileKit käyttää älykästä havainnointipohjaista kvantisointia tiedostokoon pienentämiseksi säilyttäen terävyyden ja värisyvyyden." },
      { question: "Mikä kuvamuoto on paras verkkosivujen suorituskyvylle?", answer: "WebP ja AVIF tarjoavat parhaan pakkaustehokkuuden jopa 70% pienemmillä tiedostoilla kuin JPG ja PNG." },
      { question: "Tallennetaanko yksityiset kuvani ja EXIF-metatiedot palvelimillenne?", answer: "Ei. Kuvasi käsitellään 100% paikallisesti selaimessa ja EXIF-metatiedot voidaan poistaa automaattisesti." }
    ],
    no: [
      { question: "Reduserer bildekonvertering eller komprimering den visuelle kvaliteten?", answer: "FileKit bruker intelligent perseptuell kvantisering for å redusere filstørrelsen og bevare skarphet og fargedybde." },
      { question: "Hvilket bildeformat bør jeg velge for best nettytelse?", answer: "WebP og AVIF gir best komprimeringseffektivitet med opptil 70% mindre filer enn JPG og PNG." },
      { question: "Lagres mine private bilder og EXIF-metadata på serverne deres?", answer: "Nei. Bildene dine behandles 100% lokalt i nettleseren, og EXIF-metadata kan fjernes automatisk." }
    ],
    pl: [
      { question: "Czy konwersja lub kompresja obrazów zmniejsza jakość wizualną?", answer: "FileKit wykorzystuje inteligentną kwantyzację percepcyjną, aby zmniejszyć rozmiar pliku, zachowując ostrość i głębię kolorów." },
      { question: "Jaki format obrazu wybrać dla najlepszej wydajności w sieci?", answer: "WebP i AVIF zapewniają najlepszą efektywność kompresji z plikami do 70% mniejszymi niż JPG i PNG." },
      { question: "Czy moje prywatne zdjęcia i metadane EXIF są przechowywane na waszych serwerach?", answer: "Nie. Zdjęcia przetwarzane są w 100% lokalnie w przeglądarce, a metadane EXIF mogą być automatycznie usuwane." }
    ],
    cs: [
      { question: "Snižuje konverze nebo komprese obrazu vizuální kvalitu?", answer: "FileKit používá inteligentní percepční kvantizaci ke zmenšení velikosti souboru při zachování ostrosti a barevné hloubky." },
      { question: "Jaký formát obrázku zvolit pro nejlepší výkon na webu?", answer: "WebP a AVIF poskytují nejlepší kompresi s až o 70% menšími soubory než JPG a PNG." },
      { question: "Jsou mé soukromé fotografie a EXIF metadata uloženy na vašich serverech?", answer: "Ne. Vaše fotky jsou zpracovány 100% lokálně v prohlížeči a EXIF metadata mohou být automaticky odstraněna." }
    ],
    hu: [
      { question: "Az képkonverzió vagy -tömörítés csökkenti a vizuális minőséget?", answer: "A FileKit intelligens perceptuális kvantálást használ a fájlméret csökkentéséhez az élesség és a színmélység megőrzése mellett." },
      { question: "Melyik képformátumot válasszam a legjobb webes teljesítményhez?", answer: "A WebP és AVIF nyújtja a legjobb tömörítési hatékonyságot, akár 70%-kal kisebb fájlokkal, mint a JPG és PNG." },
      { question: "A privát fotóim és EXIF metaadataim tárolódnak a szervereiken?", answer: "Nem. A fotók 100%-ban helyben, a böngészőben kerülnek feldolgozásra, és az EXIF metaadatok automatikusan eltávolíthatók." }
    ],
    ro: [
      { question: "Conversia sau compresia imaginilor reduce calitatea vizuală?", answer: "FileKit folosește cuantizare perceptuală inteligentă pentru a reduce dimensiunea fișierului păstrând claritatea și adâncimea culorilor." },
      { question: "Ce format de imagine să aleg pentru cea mai bună performanță web?", answer: "WebP și AVIF oferă cea mai bună eficiență de compresie cu fișiere cu până la 70% mai mici decât JPG și PNG." },
      { question: "Fotografiile mele private și metadatele EXIF sunt stocate pe serverele voastre?", answer: "Nu. Fotografiile sunt procesate 100% local în browser, iar metadatele EXIF pot fi eliminate automat." }
    ],
    bg: [
      { question: "Конвертирането или компресията на изображения намалява ли визуалното качество?", answer: "FileKit използва интелигентно перцептуално квантуване за намаляване на размера на файла, запазвайки острота и дълбочина на цветовете." },
      { question: "Кой формат на изображение да избера за най-добро уеб представяне?", answer: "WebP и AVIF осигуряват най-добра ефективност на компресия с до 70% по-малки файлове от JPG и PNG." },
      { question: "Частните ми снимки и EXIF метаданни съхраняват ли се на сървърите ви?", answer: "Не. Снимките се обработват 100% локално в браузъра и EXIF метаданните могат автоматично да бъдат премахнати." }
    ],
    el: [
      { question: "Η μετατροπή ή συμπίεση εικόνας μειώνει την οπτική ποιότητα;", answer: "Το FileKit χρησιμοποιεί έξυπνη αντιληπτική κβαντοποίηση για μείωση μεγέθους αρχείου διατηρώντας ευκρίνεια και βάθος χρώματος." },
      { question: "Ποιο format εικόνας να επιλέξω για καλύτερη απόδοση στο web;", answer: "WebP και AVIF προσφέρουν την καλύτερη αποδοτικότητα συμπίεσης με αρχεία έως 70% μικρότερα από JPG και PNG." },
      { question: "Οι ιδιωτικές μου φωτογραφίες και τα EXIF metadata αποθηκεύονται στους servers σας;", answer: "Όχι. Οι φωτογραφίες επεξεργάζονται 100% τοπικά στον browser και τα EXIF metadata μπορούν να αφαιρεθούν αυτόματα." }
    ],
    sk: [
      { question: "Znižuje konverzia alebo kompresia obrázka vizuálnu kvalitu?", answer: "FileKit používa inteligentnú percepčnú kvantizáciu na zníženie veľkosti súboru pri zachovaní ostrosti a farebnej hĺbky." },
      { question: "Aký formát obrázka zvoliť pre najlepší webový výkon?", answer: "WebP a AVIF poskytujú najlepšiu kompresiu so súbormi až o 70% menšími ako JPG a PNG." },
      { question: "Sú moje súkromné fotografie a EXIF metadáta uložené na vašich serveroch?", answer: "Nie. Vaše fotky sú spracované 100% lokálne v prehliadači a EXIF metadáta môžu byť automaticky odstránené." }
    ],
    sl: [
      { question: "Ali pretvorba ali stiskanje slik zmanjša vizualno kakovost?", answer: "FileKit uporablja inteligentno percepcijsko kvantizacijo za zmanjšanje velikosti datoteke ob ohranjanju ostrine in barvne globine." },
      { question: "Kateri format slike izbrati za najboljšo spletno zmogljivost?", answer: "WebP in AVIF ponujata najboljšo učinkovitost stiskanja z datotekami do 70% manjšimi kot JPG in PNG." },
      { question: "Ali so moje zasebne fotografije in metapodatki EXIF shranjeni na vaših strežnikih?", answer: "Ne. Vaše fotografije se obdelujejo 100% lokalno v brskalniku in metapodatki EXIF se lahko samodejno odstranijo." }
    ],
    ru: [
      { question: "Снижает ли конвертация или сжатие изображений визуальное качество?", answer: "FileKit использует интеллектуальное перцептуальное квантование для уменьшения размера файла с сохранением резкости и глубины цвета." },
      { question: "Какой формат изображения выбрать для лучшей производительности в вебе?", answer: "WebP и AVIF обеспечивают лучшую эффективность сжатия с файлами на 70% меньше, чем JPG и PNG." },
      { question: "Хранятся ли мои личные фотографии и метаданные EXIF на ваших серверах?", answer: "Нет. Ваши фотографии обрабатываются на 100% локально в браузере, а метаданные EXIF могут быть автоматически удалены." }
    ],
    uk: [
      { question: "Чи знижує конвертація або стиснення зображень візуальну якість?", answer: "FileKit використовує інтелектуальне перцептуальне квантування для зменшення розміру файлу зі збереженням чіткості та глибини кольору." },
      { question: "Який формат зображення обрати для найкращої веб-продуктивності?", answer: "WebP та AVIF забезпечують найкращу ефективність стиснення з файлами на 70% менше ніж JPG та PNG." },
      { question: "Чи зберігаються мої приватні фотографії та метадані EXIF на ваших серверах?", answer: "Ні. Ваші фотографії обробляються на 100% локально в браузері, а метадані EXIF можуть бути автоматично видалені." }
    ],
    lv: [
      { question: "Vai attēlu konvertēšana vai saspiešana samazina vizuālo kvalitāti?", answer: "FileKit izmanto inteliģentu perceptuālo kvantizāciju, lai samazinātu faila lielumu, saglabājot asumu un krāsu dziļumu." },
      { question: "Kuru attēla formātu izvēlēties labākajam tīmekļa sniegumam?", answer: "WebP un AVIF nodrošina labāko saspiešanas efektivitāti ar failiem līdz 70% mazākiem nekā JPG un PNG." },
      { question: "Vai manas privātās fotogrāfijas un EXIF metadati tiek glabāti jūsu serveros?", answer: "Nē. Jūsu fotogrāfijas tiek apstrādātas 100% lokāli pārlūkprogrammā, un EXIF metadati var tikt automātiski noņemti." }
    ],
    lt: [
      { question: "Ar vaizdo konvertavimas ar suspaudimas sumažina vizualinę kokybę?", answer: "FileKit naudoja intelektualų percepcijinį kvantavimą failo dydžiui sumažinti, išsaugant ryškumą ir spalvų gylį." },
      { question: "Kokį vaizdo formatą pasirinkti geriausiam žiniatinklio našumui?", answer: "WebP ir AVIF užtikrina geriausią suspaudimo efektyvumą su failais iki 70% mažesniais nei JPG ir PNG." },
      { question: "Ar mano privačios nuotraukos ir EXIF metaduomenys saugomi jūsų serveriuose?", answer: "Ne. Jūsų nuotraukos apdorojamos 100% lokaliai naršyklėje, o EXIF metaduomenys gali būti automatiškai pašalinti." }
    ],
    tr: [
      { question: "Görsel dönüştürme veya sıkıştırma görsel kaliteyi düşürür mü?", answer: "FileKit, dosya boyutunu küçültürken keskinliği ve renk derinliğini korumak için akıllı algısal niceleme kullanır." },
      { question: "Web performansı için en iyi görsel formatı hangisidir?", answer: "WebP ve AVIF, JPG ve PNG'den %70'e kadar daha küçük dosya boyutlarıyla en iyi sıkıştırma verimliliğini sunar." },
      { question: "Kişisel fotoğraflarım ve EXIF meta verileri sunucularınızda saklanıyor mu?", answer: "Hayır. Fotoğraflarınız tarayıcınızda %100 yerel olarak işlenir ve EXIF meta veriler gizlilik için otomatik olarak kaldırılabilir." }
    ],
    ar: [
      { question: "هل تحويل الصور أو ضغطها يقلل من الوضوح البصري؟", answer: "يستخدم FileKit التكميم الإدراكي الذكي لتقليل حجم الملف مع الحفاظ على الحدة وعمق الألوان." },
      { question: "أي تنسيق صور يجب اختياره للحصول على أفضل أداء ويب؟", answer: "WebP وAVIF يوفران أفضل كفاءة ضغط مع أحجام ملفات أصغر بنسبة تصل إلى 70% مقارنة بـ JPG وPNG." },
      { question: "هل يتم تخزين صوري الخاصة وبيانات EXIF على خوادمكم؟", answer: "لا. تتم معالجة صورك 100% محلياً في متصفحك ويمكن إزالة بيانات EXIF تلقائياً للخصوصية." }
    ],
    he: [
      { question: "האם המרה או דחיסה של תמונות מפחיתה את הבהירות החזותית?", answer: "FileKit משתמש בקוונטיזציה תפיסתית חכמה כדי להקטין את גודל הקובץ תוך שמירה על חדות ועומק צבע." },
      { question: "איזה פורמט תמונה לבחור לביצועי אינטרנט מיטביים?", answer: "WebP ו-AVIF מספקים את יעילות הדחיסה הטובה ביותר עם קבצים קטנים ב-70% מ-JPG ו-PNG." },
      { question: "האם התמונות הפרטיות שלי ומטא-נתוני EXIF מאוחסנים בשרתים שלכם?", answer: "לא. התמונות מעובדות 100% מקומית בדפדפן, ומטא-נתוני EXIF יכולים להיות מוסרים אוטומטית." }
    ],
    hi: [
      { question: "क्या इमेज कन्वर्शन या कंप्रेशन विज़ुअल क्वालिटी कम करता है?", answer: "FileKit बुद्धिमान अवधारणात्मक क्वांटाइज़ेशन का उपयोग करता है ताकि फ़ाइल का आकार कम हो और तीक्ष्णता व रंग गहराई बनी रहे।" },
      { question: "वेब प्रदर्शन के लिए कौन सा इमेज फ़ॉर्मेट चुनें?", answer: "WebP और AVIF सबसे अच्छी कंप्रेशन दक्षता प्रदान करते हैं, JPG और PNG से 70% तक छोटी फ़ाइलों के साथ।" },
      { question: "क्या मेरी निजी फ़ोटो और EXIF मेटाडेटा आपके सर्वर पर स्टोर होते हैं?", answer: "नहीं। आपकी फ़ोटो 100% स्थानीय रूप से ब्राउज़र में प्रोसेस होती हैं और EXIF मेटाडेटा स्वचालित रूप से हटाया जा सकता है।" }
    ],
    id: [
      { question: "Apakah konversi atau kompresi gambar mengurangi kejelasan visual?", answer: "FileKit menggunakan kuantisasi perseptual cerdas untuk mengurangi ukuran file sambil mempertahankan ketajaman dan kedalaman warna." },
      { question: "Format gambar mana yang harus saya pilih untuk performa web terbaik?", answer: "WebP dan AVIF memberikan efisiensi kompresi terbaik dengan ukuran file hingga 70% lebih kecil dari JPG dan PNG." },
      { question: "Apakah foto pribadi dan metadata EXIF saya disimpan di server Anda?", answer: "Tidak. Foto Anda diproses 100% secara lokal di browser, dan metadata EXIF dapat dihapus secara otomatis." }
    ],
    ms: [
      { question: "Adakah penukaran atau pemampatan imej mengurangkan kejelasan visual?", answer: "FileKit menggunakan kuantisasi perseptual pintar untuk mengurangkan saiz fail sambil mengekalkan ketajaman dan kedalaman warna." },
      { question: "Format imej mana yang harus saya pilih untuk prestasi web terbaik?", answer: "WebP dan AVIF memberikan kecekapan pemampatan terbaik dengan saiz fail sehingga 70% lebih kecil daripada JPG dan PNG." },
      { question: "Adakah foto peribadi dan metadata EXIF saya disimpan di pelayan anda?", answer: "Tidak. Foto anda diproses 100% secara setempat dalam pelayar dan metadata EXIF boleh dialih keluar secara automatik." }
    ],
    th: [
      { question: "การแปลงหรือบีบอัดภาพลดความชัดเจนของภาพหรือไม่?", answer: "FileKit ใช้การควอนไทซ์เชิงรับรู้อัจฉริยะเพื่อลดขนาดไฟล์ในขณะที่รักษาความคมชัดและความลึกของสี" },
      { question: "ควรเลือกฟอร์แมตภาพใดสำหรับประสิทธิภาพเว็บที่ดีที่สุด?", answer: "WebP และ AVIF ให้ประสิทธิภาพการบีบอัดที่ดีที่สุดด้วยขนาดไฟล์เล็กกว่า JPG และ PNG ถึง 70%" },
      { question: "รูปส่วนตัวและข้อมูล EXIF ของฉันถูกเก็บบนเซิร์ฟเวอร์ของคุณหรือไม่?", answer: "ไม่ รูปของคุณถูกประมวลผล 100% ภายในเครื่องในเบราว์เซอร์ และข้อมูล EXIF สามารถลบได้อัตโนมัติ" }
    ],
    vi: [
      { question: "Chuyển đổi hoặc nén ảnh có làm giảm độ rõ hình ảnh không?", answer: "FileKit sử dụng lượng tử hóa nhận thức thông minh để giảm kích thước file mà vẫn giữ độ sắc nét và chiều sâu màu sắc." },
      { question: "Nên chọn định dạng ảnh nào cho hiệu suất web tốt nhất?", answer: "WebP và AVIF cung cấp hiệu suất nén tốt nhất với kích thước file nhỏ hơn tới 70% so với JPG và PNG." },
      { question: "Ảnh riêng tư và metadata EXIF có được lưu trên máy chủ của bạn không?", answer: "Không. Ảnh được xử lý 100% cục bộ trong trình duyệt và metadata EXIF có thể được xóa tự động." }
    ],
    fil: [
      { question: "Nababawasan ba ng image conversion o compression ang visual clarity?", answer: "Gumagamit ang FileKit ng intelligent perceptual quantization para bawasan ang file size habang pinapanatili ang sharpness at color depth." },
      { question: "Aling image format ang pipiliin para sa pinakamahusay na web performance?", answer: "Ang WebP at AVIF ay nagbibigay ng pinakamahusay na compression na may file sizes na hanggang 70% mas maliit kaysa JPG at PNG." },
      { question: "Naka-store ba ang aking private photos at EXIF metadata sa inyong servers?", answer: "Hindi. Pinoproseso ang iyong mga larawan nang 100% lokal sa browser at ang EXIF metadata ay maaaring awtomatikong alisin." }
    ],
    ja: [
      { question: "画像の変換や圧縮で視覚的な品質は低下しますか？", answer: "FileKitはインテリジェントな知覚量子化を使用して、シャープさと色深度を維持しながらファイルサイズを削減します。" },
      { question: "Web パフォーマンスに最適な画像フォーマットは？", answer: "WebP と AVIF は、JPG や PNG より最大70%小さいファイルサイズで最高の圧縮効率を提供します。" },
      { question: "私のプライベート写真や EXIF メタデータはサーバーに保存されますか？", answer: "いいえ。写真はブラウザ内で100%ローカルに処理され、EXIF メタデータは自動的に除去できます。" }
    ],
    ko: [
      { question: "이미지 변환이나 압축이 시각적 품질을 저하시키나요?", answer: "FileKit은 지능형 인지 양자화를 사용하여 선명도와 색상 깊이를 유지하면서 파일 크기를 줄입니다." },
      { question: "최고의 웹 성능을 위해 어떤 이미지 형식을 선택해야 하나요?", answer: "WebP와 AVIF는 JPG 및 PNG보다 최대 70% 작은 파일 크기로 최고의 압축 효율을 제공합니다." },
      { question: "내 개인 사진과 EXIF 메타데이터가 서버에 저장되나요?", answer: "아니요. 사진은 브라우저에서 100% 로컬로 처리되며 EXIF 메타데이터는 자동으로 제거할 수 있습니다." }
    ],
    "zh-CN": [
      { question: "图片转换或压缩会降低视觉质量吗？", answer: "FileKit 使用智能感知量化来减小文件大小，同时保持清晰度和色彩深度。" },
      { question: "哪种图片格式最适合网页性能？", answer: "WebP 和 AVIF 提供最佳压缩效率，文件比 JPG 和 PNG 小高达70%。" },
      { question: "我的私人照片和 EXIF 元数据会存储在你们的服务器上吗？", answer: "不会。您的照片在浏览器中100%本地处理，EXIF 元数据可以自动移除。" }
    ],
    "zh-TW": [
      { question: "圖片轉換或壓縮會降低視覺品質嗎？", answer: "FileKit 使用智慧感知量化來縮小檔案大小，同時保持銳利度和色彩深度。" },
      { question: "哪種圖片格式最適合網頁效能？", answer: "WebP 和 AVIF 提供最佳壓縮效率，檔案比 JPG 和 PNG 小高達70%。" },
      { question: "我的私人照片和 EXIF 中繼資料會儲存在你們的伺服器上嗎？", answer: "不會。您的照片在瀏覽器中100%本機處理，EXIF 中繼資料可以自動移除。" }
    ],
  },
  audio_video: {
    en: [
      { question: "Can I convert and compress audio and video files without quality loss?", answer: "Yes. FileKit applies adaptive bitrate throttling and perceptual encoding to maintain crystal clear sound and HD resolution." },
      { question: "What video and audio formats can I convert directly in my browser?", answer: "You can convert MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, and AAC with zero third-party software." },
      { question: "Are my audio and video recordings kept private and secure?", answer: "Yes. Processing occurs directly on your device through client-side WebAssembly, ensuring your media files remain completely private." }
    ],
    es: [
      { question: "¿Puedo convertir y comprimir archivos de audio y video sin pérdida de calidad?", answer: "Sí. FileKit aplica tasa de bits adaptativa y codificación perceptiva para mantener sonido nítido y resolución HD." },
      { question: "¿Qué formatos de video y audio puedo convertir directamente en mi navegador?", answer: "Puedes convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG y AAC sin software adicional." },
      { question: "¿Mis grabaciones de audio y video se mantienen privadas y seguras?", answer: "Sí. El procesamiento se ejecuta directamente en tu dispositivo mediante WebAssembly con total privacidad." }
    ],
    "es-419": [
      { question: "¿Puedo convertir y comprimir archivos de audio y video sin perder calidad?", answer: "Sí. FileKit usa tasa de bits adaptativa y codificación perceptiva para mantener sonido nítido y resolución HD." },
      { question: "¿Qué formatos de video y audio puedo convertir en mi navegador?", answer: "Puedes convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG y AAC sin instalar nada." },
      { question: "¿Mis grabaciones de audio y video se mantienen privadas?", answer: "Sí. El procesamiento ocurre directamente en tu dispositivo mediante WebAssembly con privacidad total." }
    ],
    de: [
      { question: "Kann ich Audio- und Videodateien ohne Qualitätsverlust konvertieren und komprimieren?", answer: "Ja. FileKit verwendet adaptive Bitratensteuerung und perzeptuelle Kodierung für kristallklaren Sound und HD-Auflösung." },
      { question: "Welche Video- und Audioformate kann ich direkt im Browser konvertieren?", answer: "Sie können MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG und AAC ohne Drittanbietersoftware konvertieren." },
      { question: "Bleiben meine Audio- und Videoaufnahmen privat und sicher?", answer: "Ja. Die Verarbeitung erfolgt direkt auf Ihrem Gerät über clientseitiges WebAssembly mit vollständigem Datenschutz." }
    ],
    fr: [
      { question: "Puis-je convertir et compresser des fichiers audio et vidéo sans perte de qualité ?", answer: "Oui. FileKit applique un débit adaptatif et un encodage perceptif pour maintenir un son cristallin et une résolution HD." },
      { question: "Quels formats vidéo et audio puis-je convertir directement dans mon navigateur ?", answer: "Vous pouvez convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG et AAC sans logiciel tiers." },
      { question: "Mes enregistrements audio et vidéo restent-ils privés et sécurisés ?", answer: "Oui. Le traitement s'effectue directement sur votre appareil via WebAssembly côté client avec une confidentialité totale." }
    ],
    pt: [
      { question: "Posso converter e comprimir ficheiros de áudio e vídeo sem perda de qualidade?", answer: "Sim. O FileKit aplica taxa de bits adaptativa e codificação percetual para manter som cristalino e resolução HD." },
      { question: "Que formatos de vídeo e áudio posso converter diretamente no navegador?", answer: "Pode converter MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG e AAC sem software externo." },
      { question: "As minhas gravações de áudio e vídeo permanecem privadas?", answer: "Sim. O processamento ocorre diretamente no seu dispositivo via WebAssembly com total privacidade." }
    ],
    "pt-BR": [
      { question: "Posso converter e comprimir arquivos de áudio e vídeo sem perda de qualidade?", answer: "Sim. O FileKit aplica taxa de bits adaptativa e codificação perceptual para manter som cristalino e resolução HD." },
      { question: "Quais formatos de vídeo e áudio posso converter no navegador?", answer: "Você pode converter MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG e AAC sem nenhum software." },
      { question: "Minhas gravações de áudio e vídeo permanecem privadas?", answer: "Sim. O processamento ocorre diretamente no seu dispositivo via WebAssembly com privacidade total." }
    ],
    it: [
      { question: "Posso convertire e comprimere file audio e video senza perdita di qualità?", answer: "Sì. FileKit applica bitrate adattivo e codifica percettiva per mantenere suono cristallino e risoluzione HD." },
      { question: "Quali formati video e audio posso convertire direttamente nel browser?", answer: "Puoi convertire MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG e AAC senza software aggiuntivo." },
      { question: "Le mie registrazioni audio e video restano private e sicure?", answer: "Sì. L'elaborazione avviene direttamente sul tuo dispositivo tramite WebAssembly con privacy totale." }
    ],
    nl: [
      { question: "Kan ik audio- en videobestanden converteren en comprimeren zonder kwaliteitsverlies?", answer: "Ja. FileKit past adaptieve bitrate en perceptuele codering toe voor kristalhelder geluid en HD-resolutie." },
      { question: "Welke video- en audioformaten kan ik rechtstreeks in de browser converteren?", answer: "U kunt MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG en AAC converteren zonder extra software." },
      { question: "Blijven mijn audio- en video-opnamen privé en veilig?", answer: "Ja. De verwerking vindt direct op uw apparaat plaats via WebAssembly met volledige privacy." }
    ],
    ca: [
      { question: "Puc convertir i comprimir fitxers d'àudio i vídeo sense pèrdua de qualitat?", answer: "Sí. FileKit aplica taxa de bits adaptativa i codificació perceptiva per mantenir so cristal·lí i resolució HD." },
      { question: "Quins formats de vídeo i àudio puc convertir directament al navegador?", answer: "Pots convertir MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG i AAC sense cap programari addicional." },
      { question: "Les meves gravacions d'àudio i vídeo es mantenen privades?", answer: "Sí. El processament es fa directament al teu dispositiu mitjançant WebAssembly amb total privacitat." }
    ],
    sv: [
      { question: "Kan jag konvertera och komprimera ljud- och videofiler utan kvalitetsförlust?", answer: "Ja. FileKit tillämpar adaptiv bithastighet och perceptuell kodning för kristallklart ljud och HD-upplösning." },
      { question: "Vilka video- och ljudformat kan jag konvertera direkt i webbläsaren?", answer: "Du kan konvertera MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG och AAC utan tredjepartsprogram." },
      { question: "Förblir mina ljud- och videoinspelningar privata och säkra?", answer: "Ja. Bearbetningen sker direkt på din enhet via WebAssembly med fullständig sekretess." }
    ],
    da: [
      { question: "Kan jeg konvertere og komprimere lyd- og videofiler uden kvalitetstab?", answer: "Ja. FileKit anvender adaptiv bitrate og perceptuel kodning for krystalklar lyd og HD-opløsning." },
      { question: "Hvilke video- og lydformater kan jeg konvertere direkte i browseren?", answer: "Du kan konvertere MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG og AAC uden tredjepartssoftware." },
      { question: "Forbliver mine lyd- og videooptagelser private og sikre?", answer: "Ja. Behandlingen sker direkte på din enhed via WebAssembly med fuldstændig privatlivsbeskyttelse." }
    ],
    fi: [
      { question: "Voinko muuntaa ja pakata ääni- ja videotiedostoja ilman laadun heikkenemistä?", answer: "Kyllä. FileKit käyttää adaptiivista bittinopeus ja havainnointikoodausta kristallinkirkkaan äänen ja HD-resoluution säilyttämiseksi." },
      { question: "Mitä video- ja ääniformaatteja voin muuntaa suoraan selaimessa?", answer: "Voit muuntaa MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ja AAC ilman kolmannen osapuolen ohjelmistoja." },
      { question: "Pysyvätkö ääni- ja videotallenteeni yksityisinä ja turvassa?", answer: "Kyllä. Käsittely tapahtuu suoraan laitteellasi WebAssemblyn kautta täydellä yksityisyydellä." }
    ],
    no: [
      { question: "Kan jeg konvertere og komprimere lyd- og videofiler uten kvalitetstap?", answer: "Ja. FileKit bruker adaptiv bitrate og perseptuell koding for krystallklar lyd og HD-oppløsning." },
      { question: "Hvilke video- og lydformater kan jeg konvertere direkte i nettleseren?", answer: "Du kan konvertere MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG og AAC uten tredjepartsprogramvare." },
      { question: "Forblir mine lyd- og videoopptak private og sikre?", answer: "Ja. Behandlingen skjer direkte på enheten din via WebAssembly med fullstendig personvern." }
    ],
    pl: [
      { question: "Czy mogę konwertować i kompresować pliki audio i wideo bez utraty jakości?", answer: "Tak. FileKit stosuje adaptacyjną przepływność i kodowanie percepcyjne dla krystalicznie czystego dźwięku i rozdzielczości HD." },
      { question: "Jakie formaty wideo i audio mogę konwertować bezpośrednio w przeglądarce?", answer: "Możesz konwertować MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG i AAC bez dodatkowego oprogramowania." },
      { question: "Czy moje nagrania audio i wideo pozostają prywatne i bezpieczne?", answer: "Tak. Przetwarzanie odbywa się bezpośrednio na urządzeniu przez WebAssembly z pełną prywatnością." }
    ],
    cs: [
      { question: "Mohu převádět a komprimovat audio a video soubory bez ztráty kvality?", answer: "Ano. FileKit používá adaptivní bitrate a percepční kódování pro křišťálově čistý zvuk a HD rozlišení." },
      { question: "Jaké formáty videa a zvuku mohu převádět přímo v prohlížeči?", answer: "Můžete převádět MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG a AAC bez softwaru třetích stran." },
      { question: "Zůstávají mé audio a video nahrávky soukromé a bezpečné?", answer: "Ano. Zpracování probíhá přímo na vašem zařízení přes WebAssembly s úplným soukromím." }
    ],
    hu: [
      { question: "Konvertálhatok és tömöríthetek audio- és videofájlokat minőségveszteség nélkül?", answer: "Igen. A FileKit adaptív bitráta-szabályzást és perceptuális kódolást alkalmaz a kristálytiszta hang és HD felbontás megőrzéséhez." },
      { question: "Milyen videó- és audioformátumokat konvertálhatok közvetlenül a böngészőben?", answer: "Konvertálhat MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG és AAC formátumokat szoftver nélkül." },
      { question: "Az audio- és videofelvételeim privátok és biztonságban maradnak?", answer: "Igen. A feldolgozás közvetlenül az eszközén történik WebAssembly-n keresztül teljes adatvédelemmel." }
    ],
    ro: [
      { question: "Pot converti și comprima fișiere audio și video fără pierdere de calitate?", answer: "Da. FileKit aplică bitrate adaptiv și codificare perceptuală pentru sunet cristalin și rezoluție HD." },
      { question: "Ce formate video și audio pot converti direct în browser?", answer: "Puteți converti MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG și AAC fără software terț." },
      { question: "Înregistrările mele audio și video rămân private și sigure?", answer: "Da. Procesarea are loc direct pe dispozitiv prin WebAssembly cu confidențialitate completă." }
    ],
    bg: [
      { question: "Мога ли да конвертирам и компресирам аудио и видео файлове без загуба на качество?", answer: "Да. FileKit прилага адаптивен битрейт и перцептуално кодиране за кристално чист звук и HD резолюция." },
      { question: "Какви видео и аудио формати мога да конвертирам директно в браузъра?", answer: "Можете да конвертирате MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG и AAC без допълнителен софтуер." },
      { question: "Аудио и видео записите ми остават ли поверителни и сигурни?", answer: "Да. Обработката се извършва директно на устройството ви чрез WebAssembly с пълна поверителност." }
    ],
    el: [
      { question: "Μπορώ να μετατρέψω και να συμπιέσω αρχεία ήχου και βίντεο χωρίς απώλεια ποιότητας;", answer: "Ναι. Το FileKit εφαρμόζει προσαρμοστικό bitrate και αντιληπτική κωδικοποίηση για κρυστάλλινο ήχο και ανάλυση HD." },
      { question: "Ποια formats βίντεο και ήχου μπορώ να μετατρέψω απευθείας στον browser;", answer: "Μπορείτε να μετατρέψετε MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG και AAC χωρίς λογισμικό τρίτων." },
      { question: "Οι ηχογραφήσεις μου παραμένουν ιδιωτικές και ασφαλείς;", answer: "Ναι. Η επεξεργασία γίνεται απευθείας στη συσκευή σας μέσω WebAssembly με πλήρη ιδιωτικότητα." }
    ],
    sk: [
      { question: "Môžem konvertovať a komprimovať audio a video súbory bez straty kvality?", answer: "Áno. FileKit používa adaptívny bitrate a percepčné kódovanie pre krištáľovo čistý zvuk a HD rozlíšenie." },
      { question: "Aké video a audio formáty môžem konvertovať priamo v prehliadači?", answer: "Môžete konvertovať MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG a AAC bez softvéru tretích strán." },
      { question: "Zostávajú moje audio a video nahrávky súkromné a bezpečné?", answer: "Áno. Spracovanie prebieha priamo na vašom zariadení cez WebAssembly s úplným súkromím." }
    ],
    sl: [
      { question: "Ali lahko pretvarjam in stisnjem zvočne in video datoteke brez izgube kakovosti?", answer: "Da. FileKit uporablja prilagodljivo bitno hitrost in percepcijsko kodiranje za kristalno čist zvok in HD ločljivost." },
      { question: "Katere video in zvočne formate lahko pretvorim neposredno v brskalniku?", answer: "Pretvorite lahko MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG in AAC brez dodatne programske opreme." },
      { question: "Ali moji zvočni in video posnetki ostanejo zasebni in varni?", answer: "Da. Obdelava poteka neposredno na vaši napravi prek WebAssembly s popolno zasebnostjo." }
    ],
    ru: [
      { question: "Могу ли я конвертировать и сжимать аудио- и видеофайлы без потери качества?", answer: "Да. FileKit применяет адаптивный битрейт и перцептуальное кодирование для кристально чистого звука и HD-разрешения." },
      { question: "Какие форматы видео и аудио можно конвертировать прямо в браузере?", answer: "Вы можете конвертировать MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG и AAC без стороннего ПО." },
      { question: "Мои аудио- и видеозаписи остаются конфиденциальными?", answer: "Да. Обработка происходит непосредственно на вашем устройстве через WebAssembly с полной конфиденциальностью." }
    ],
    uk: [
      { question: "Чи можу я конвертувати та стискати аудіо- та відеофайли без втрати якості?", answer: "Так. FileKit застосовує адаптивний бітрейт та перцептуальне кодування для кришталево чистого звуку та HD-роздільності." },
      { question: "Які формати відео та аудіо можна конвертувати прямо в браузері?", answer: "Ви можете конвертувати MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG та AAC без стороннього ПЗ." },
      { question: "Мої аудіо- та відеозаписи залишаються конфіденційними?", answer: "Так. Обробка відбувається безпосередньо на вашому пристрої через WebAssembly з повною конфіденційністю." }
    ],
    lv: [
      { question: "Vai es varu konvertēt un saspiest audio un video failus bez kvalitātes zuduma?", answer: "Jā. FileKit piemēro adaptīvu bitu ātrumu un perceptuālo kodēšanu kristāldzidrai skaņai un HD izšķirtspējai." },
      { question: "Kādus video un audio formātus es varu konvertēt tieši pārlūkprogrammā?", answer: "Jūs varat konvertēt MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG un AAC bez trešo pušu programmatūras." },
      { question: "Vai mani audio un video ieraksti paliek privāti un droši?", answer: "Jā. Apstrāde notiek tieši jūsu ierīcē caur WebAssembly ar pilnīgu privātumu." }
    ],
    lt: [
      { question: "Ar galiu konvertuoti ir suspausti garso ir vaizdo failus be kokybės praradimo?", answer: "Taip. FileKit taiko adaptyvų bitų greitį ir percepcijinį kodavimą kristalinio garso ir HD raiškos palaikymui." },
      { question: "Kokius vaizdo ir garso formatus galiu konvertuoti tiesiai naršyklėje?", answer: "Galite konvertuoti MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ir AAC be trečiųjų šalių programinės įrangos." },
      { question: "Ar mano garso ir vaizdo įrašai lieka privatūs ir saugūs?", answer: "Taip. Apdorojimas vyksta tiesiogiai jūsų įrenginyje per WebAssembly su visišku privatumu." }
    ],
    tr: [
      { question: "Ses ve video dosyalarını kalite kaybı olmadan dönüştürüp sıkıştırabilir miyim?", answer: "Evet. FileKit, kristal netliğinde ses ve HD çözünürlük için uyarlanabilir bit hızı ve algısal kodlama uygular." },
      { question: "Hangi video ve ses formatlarını doğrudan tarayıcımda dönüştürebilirim?", answer: "MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ve AAC'yi üçüncü parti yazılım olmadan dönüştürebilirsiniz." },
      { question: "Ses ve video kayıtlarım gizli ve güvende mi?", answer: "Evet. İşlem, cihazınızda WebAssembly aracılığıyla doğrudan gerçekleşir ve tam gizlilik sağlar." }
    ],
    ar: [
      { question: "هل يمكنني تحويل وضغط ملفات الصوت والفيديو بدون فقدان الجودة؟", answer: "نعم. يطبق FileKit معدل بت تكيفي وترميز إدراكي للحفاظ على صوت نقي ودقة HD." },
      { question: "ما تنسيقات الفيديو والصوت التي يمكنني تحويلها مباشرة في المتصفح؟", answer: "يمكنك تحويل MP4 وMOV وAVI وMKV وWebM وMP3 وWAV وFLAC وM4A وOGG وAAC بدون برامج إضافية." },
      { question: "هل تبقى تسجيلاتي الصوتية والمرئية خاصة وآمنة؟", answer: "نعم. تتم المعالجة مباشرة على جهازك عبر WebAssembly مع خصوصية كاملة." }
    ],
    he: [
      { question: "האם אפשר להמיר ולדחוס קבצי אודיו ווידאו ללא אובדן איכות?", answer: "כן. FileKit מפעיל קצב סיביות אדפטיבי וקידוד תפיסתי לשמירה על צליל צלול ורזולוציית HD." },
      { question: "אילו פורמטי וידאו ואודיו אפשר להמיר ישירות בדפדפן?", answer: "ניתן להמיר MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG ו-AAC ללא תוכנת צד שלישי." },
      { question: "האם הקלטות האודיו והווידאו שלי נשמרות פרטיות ומאובטחות?", answer: "כן. העיבוד מתבצע ישירות במכשיר שלך דרך WebAssembly עם פרטיות מלאה." }
    ],
    hi: [
      { question: "क्या मैं गुणवत्ता खोए बिना ऑडियो और वीडियो फ़ाइलें कन्वर्ट और कंप्रेस कर सकता हूँ?", answer: "हाँ। FileKit क्रिस्टल क्लियर साउंड और HD रिज़ॉल्यूशन बनाए रखने के लिए एडेप्टिव बिटरेट और परसेप्चुअल एन्कोडिंग लागू करता है।" },
      { question: "मैं अपने ब्राउज़र में कौन से वीडियो और ऑडियो फ़ॉर्मेट सीधे कन्वर्ट कर सकता हूँ?", answer: "आप बिना किसी अतिरिक्त सॉफ़्टवेयर के MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG और AAC कन्वर्ट कर सकते हैं।" },
      { question: "क्या मेरी ऑडियो और वीडियो रिकॉर्डिंग निजी और सुरक्षित रहती हैं?", answer: "हाँ। प्रोसेसिंग आपके डिवाइस पर WebAssembly के माध्यम से पूर्ण गोपनीयता के साथ होती है।" }
    ],
    id: [
      { question: "Bisakah saya mengonversi dan mengompresi file audio dan video tanpa kehilangan kualitas?", answer: "Ya. FileKit menerapkan bitrate adaptif dan encoding perseptual untuk mempertahankan suara jernih dan resolusi HD." },
      { question: "Format video dan audio apa saja yang bisa saya konversi langsung di browser?", answer: "Anda dapat mengonversi MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, dan AAC tanpa software pihak ketiga." },
      { question: "Apakah rekaman audio dan video saya tetap pribadi dan aman?", answer: "Ya. Pemrosesan terjadi langsung di perangkat Anda melalui WebAssembly dengan privasi penuh." }
    ],
    ms: [
      { question: "Bolehkah saya menukar dan memampatkan fail audio dan video tanpa kehilangan kualiti?", answer: "Ya. FileKit menggunakan kadar bit adaptif dan pengekodan perseptual untuk bunyi jernih dan resolusi HD." },
      { question: "Format video dan audio apa yang boleh saya tukar terus dalam pelayar?", answer: "Anda boleh menukar MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG dan AAC tanpa perisian pihak ketiga." },
      { question: "Adakah rakaman audio dan video saya kekal peribadi dan selamat?", answer: "Ya. Pemprosesan berlaku terus pada peranti anda melalui WebAssembly dengan privasi penuh." }
    ],
    th: [
      { question: "ฉันสามารถแปลงและบีบอัดไฟล์เสียงและวิดีโอโดยไม่สูญเสียคุณภาพได้หรือไม่?", answer: "ได้ FileKit ใช้บิตเรตแบบปรับตัวและการเข้ารหัสเชิงรับรู้เพื่อรักษาเสียงใสและความละเอียด HD" },
      { question: "รูปแบบวิดีโอและเสียงใดบ้างที่สามารถแปลงได้โดยตรงในเบราว์เซอร์?", answer: "คุณสามารถแปลง MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG และ AAC โดยไม่ต้องใช้ซอฟต์แวร์ภายนอก" },
      { question: "การบันทึกเสียงและวิดีโอของฉันยังคงเป็นส่วนตัวและปลอดภัยหรือไม่?", answer: "ใช่ การประมวลผลเกิดขึ้นโดยตรงบนอุปกรณ์ของคุณผ่าน WebAssembly ด้วยความเป็นส่วนตัวอย่างสมบูรณ์" }
    ],
    vi: [
      { question: "Tôi có thể chuyển đổi và nén file âm thanh và video mà không mất chất lượng không?", answer: "Có. FileKit áp dụng bitrate thích ứng và mã hóa nhận thức để duy trì âm thanh trong trẻo và độ phân giải HD." },
      { question: "Những định dạng video và audio nào tôi có thể chuyển đổi trực tiếp trong trình duyệt?", answer: "Bạn có thể chuyển đổi MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG và AAC mà không cần phần mềm bên thứ ba." },
      { question: "Các bản ghi âm và video của tôi có được giữ riêng tư và an toàn không?", answer: "Có. Quá trình xử lý diễn ra trực tiếp trên thiết bị của bạn qua WebAssembly với sự riêng tư hoàn toàn." }
    ],
    fil: [
      { question: "Maaari ba akong mag-convert at mag-compress ng audio at video files nang walang quality loss?", answer: "Oo. Gumagamit ang FileKit ng adaptive bitrate at perceptual encoding para sa kristal na malinaw na tunog at HD resolution." },
      { question: "Anong video at audio formats ang maaari kong i-convert direkta sa browser?", answer: "Maaari kang mag-convert ng MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, at AAC nang walang third-party software." },
      { question: "Nananatiling pribado at ligtas ba ang aking audio at video recordings?", answer: "Oo. Ang pagproseso ay nangyayari direkta sa iyong device sa pamamagitan ng WebAssembly na may buong privacy." }
    ],
    ja: [
      { question: "品質を損なわずにオーディオやビデオファイルを変換・圧縮できますか？", answer: "はい。FileKitはアダプティブビットレートとパーセプチュアルエンコーディングを適用し、クリスタルクリアなサウンドとHD解像度を維持します。" },
      { question: "ブラウザで直接変換できるビデオ・オーディオフォーマットは？", answer: "MP4、MOV、AVI、MKV、WebM、MP3、WAV、FLAC、M4A、OGG、AACをサードパーティソフトなしで変換できます。" },
      { question: "オーディオやビデオの録音は安全でプライベートですか？", answer: "はい。処理はWebAssemblyを通じてお使いのデバイス上で直接行われ、完全なプライバシーが保証されます。" }
    ],
    ko: [
      { question: "품질 손실 없이 오디오 및 비디오 파일을 변환하고 압축할 수 있나요?", answer: "네. FileKit은 적응형 비트레이트와 지각 인코딩을 적용하여 수정처럼 맑은 소리와 HD 해상도를 유지합니다." },
      { question: "브라우저에서 직접 변환할 수 있는 비디오 및 오디오 형식은?", answer: "MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, AAC를 제3자 소프트웨어 없이 변환할 수 있습니다." },
      { question: "내 오디오 및 비디오 녹음은 안전하게 비공개로 유지되나요?", answer: "네. 처리는 WebAssembly를 통해 기기에서 직접 수행되어 완전한 프라이버시가 보장됩니다." }
    ],
    "zh-CN": [
      { question: "我可以在不损失质量的情况下转换和压缩音频视频文件吗？", answer: "可以。FileKit 应用自适应比特率和感知编码来保持水晶般清晰的声音和高清分辨率。" },
      { question: "在浏览器中可以直接转换哪些音视频格式？", answer: "您可以转换 MP4、MOV、AVI、MKV、WebM、MP3、WAV、FLAC、M4A、OGG 和 AAC，无需第三方软件。" },
      { question: "我的音频和视频录音会保持私密和安全吗？", answer: "是的。处理通过 WebAssembly 直接在您的设备上进行，确保完全隐私。" }
    ],
    "zh-TW": [
      { question: "我可以在不損失品質的情況下轉換和壓縮音訊影片檔案嗎？", answer: "可以。FileKit 應用自適應位元率和感知編碼來保持水晶般清晰的聲音和高清解析度。" },
      { question: "在瀏覽器中可以直接轉換哪些音訊影片格式？", answer: "您可以轉換 MP4、MOV、AVI、MKV、WebM、MP3、WAV、FLAC、M4A、OGG 和 AAC，無需第三方軟體。" },
      { question: "我的音訊和影片錄音會保持私密和安全嗎？", answer: "是的。處理透過 WebAssembly 直接在您的裝置上進行，確保完全隱私。" }
    ],
  },
  pdf: {
    en: [
      { question: "Is FileKit completely free with no hidden subscriptions or limits?", answer: "Yes. All essential PDF conversion, compression, editing, OCR, and merging tools are 100% free with no account creation required." },
      { question: "Are my sensitive PDF documents and signatures kept private?", answer: "Absolutely. FileKit processes documents locally inside your browser sandbox. Your confidential files never touch our servers." },
      { question: "Does FileKit preserve text formatting, embedded fonts, and page layouts?", answer: "Yes. The engine strictly adheres to ISO PDF standards, preserving vector graphics, form fields, and crisp typography." }
    ],
    es: [
      { question: "¿Es FileKit completamente gratuito sin suscripciones ni límites ocultos?", answer: "Sí. Todas las herramientas de conversión, compresión, edición, OCR y unión de PDF son 100% gratuitas sin necesidad de crear cuenta." },
      { question: "¿Mis documentos PDF confidenciales y firmas se mantienen privados?", answer: "Totalmente. FileKit procesa los documentos localmente en tu navegador. Tus archivos nunca tocan nuestros servidores." },
      { question: "¿FileKit conserva el formato del texto, fuentes incrustadas y diseños de página?", answer: "Sí. El motor cumple rigurosamente con los estándares ISO de PDF, preservando gráficos vectoriales y tipografía." }
    ],
    "es-419": [
      { question: "¿FileKit es completamente gratuito sin suscripciones ocultas?", answer: "Sí. Todas las herramientas de conversión, compresión, edición, OCR y unión de PDF son 100% gratuitas sin crear cuenta." },
      { question: "¿Mis documentos PDF confidenciales se mantienen privados?", answer: "Totalmente. FileKit procesa documentos localmente en tu navegador. Tus archivos nunca salen de tu dispositivo." },
      { question: "¿FileKit conserva formato de texto, fuentes y diseño de página?", answer: "Sí. El motor cumple con estándares ISO PDF, preservando gráficos vectoriales, campos de formulario y tipografía." }
    ],
    de: [
      { question: "Ist FileKit wirklich kostenlos ohne versteckte Abonnements?", answer: "Ja. Alle PDF-Werkzeuge für Konvertierung, Komprimierung, Bearbeitung, OCR und Zusammenführen sind 100% kostenlos ohne Kontopflicht." },
      { question: "Bleiben meine sensiblen PDF-Dokumente und Unterschriften privat?", answer: "Absolut. FileKit verarbeitet Dokumente lokal in Ihrem Browser. Vertrauliche Dateien berühren niemals unsere Server." },
      { question: "Behält FileKit Textformatierung, eingebettete Schriften und Seitenlayouts bei?", answer: "Ja. Die Engine hält sich streng an ISO-PDF-Standards und bewahrt Vektorgrafiken, Formularfelder und Typografie." }
    ],
    fr: [
      { question: "FileKit est-il entièrement gratuit sans abonnement caché ?", answer: "Oui. Tous les outils de conversion, compression, édition, OCR et fusion PDF sont 100% gratuits sans création de compte." },
      { question: "Mes documents PDF sensibles et signatures restent-ils confidentiels ?", answer: "Absolument. FileKit traite les documents localement dans votre navigateur. Vos fichiers ne touchent jamais nos serveurs." },
      { question: "FileKit préserve-t-il le formatage du texte, les polices et les mises en page ?", answer: "Oui. Le moteur respecte strictement les normes ISO PDF, préservant graphiques vectoriels, champs de formulaire et typographie." }
    ],
    pt: [
      { question: "O FileKit é completamente gratuito sem subscrições ocultas?", answer: "Sim. Todas as ferramentas de conversão, compressão, edição, OCR e união de PDF são 100% gratuitas sem criar conta." },
      { question: "Os meus documentos PDF sensíveis e assinaturas permanecem privados?", answer: "Absolutamente. O FileKit processa documentos localmente no seu navegador. Os seus ficheiros nunca tocam nos nossos servidores." },
      { question: "O FileKit preserva formatação de texto, fontes e layouts de página?", answer: "Sim. O motor cumpre rigorosamente as normas ISO PDF, preservando gráficos vetoriais, campos de formulário e tipografia." }
    ],
    "pt-BR": [
      { question: "O FileKit é completamente gratuito sem assinaturas ocultas?", answer: "Sim. Todas as ferramentas de conversão, compressão, edição, OCR e união de PDF são 100% gratuitas sem criar conta." },
      { question: "Meus documentos PDF confidenciais e assinaturas permanecem privados?", answer: "Absolutamente. O FileKit processa documentos localmente no seu navegador. Seus arquivos nunca tocam nossos servidores." },
      { question: "O FileKit preserva formatação de texto, fontes e layouts de página?", answer: "Sim. O motor segue rigorosamente as normas ISO PDF, preservando gráficos vetoriais, campos de formulário e tipografia." }
    ],
    it: [
      { question: "FileKit è completamente gratuito senza abbonamenti nascosti?", answer: "Sì. Tutti gli strumenti di conversione, compressione, modifica, OCR e unione PDF sono 100% gratuiti senza creare un account." },
      { question: "I miei documenti PDF sensibili e le firme restano privati?", answer: "Assolutamente. FileKit elabora i documenti localmente nel browser. I tuoi file non toccano mai i nostri server." },
      { question: "FileKit preserva formattazione del testo, font incorporati e layout di pagina?", answer: "Sì. Il motore rispetta rigorosamente gli standard ISO PDF, preservando grafica vettoriale, campi modulo e tipografia." }
    ],
    nl: [
      { question: "Is FileKit volledig gratis zonder verborgen abonnementen?", answer: "Ja. Alle PDF-conversie, compressie, bewerking, OCR en samenvoegtools zijn 100% gratis zonder accountaanmaak." },
      { question: "Blijven mijn gevoelige PDF-documenten en handtekeningen privé?", answer: "Absoluut. FileKit verwerkt documenten lokaal in uw browser. Uw bestanden raken nooit onze servers." },
      { question: "Behoudt FileKit tekstopmaak, ingesloten lettertypen en paginalay-outs?", answer: "Ja. De engine houdt zich strikt aan ISO PDF-standaarden en bewaart vectorafbeeldingen, formuliervelden en typografie." }
    ],
    ca: [
      { question: "FileKit és completament gratuït sense subscripcions ocultes?", answer: "Sí. Totes les eines de conversió, compressió, edició, OCR i fusió de PDF són 100% gratuïtes sense crear compte." },
      { question: "Els meus documents PDF sensibles i signatures es mantenen privats?", answer: "Absolutament. FileKit processa documents localment al navegador. Els fitxers mai toquen els nostres servidors." },
      { question: "FileKit conserva el format del text, les fonts i els dissenys de pàgina?", answer: "Sí. El motor compleix rigorosament els estàndards ISO PDF, preservant gràfics vectorials i tipografia." }
    ],
    sv: [
      { question: "Är FileKit helt gratis utan dolda prenumerationer?", answer: "Ja. Alla PDF-verktyg för konvertering, komprimering, redigering, OCR och sammanslagning är 100% gratis utan kontoregistrering." },
      { question: "Förblir mina känsliga PDF-dokument och signaturer privata?", answer: "Absolut. FileKit bearbetar dokument lokalt i din webbläsare. Dina filer berör aldrig våra servrar." },
      { question: "Bevarar FileKit textformatering, inbäddade typsnitt och sidlayouter?", answer: "Ja. Motorn följer strikt ISO PDF-standarder och bevarar vektorgrafik, formulärfält och typografi." }
    ],
    da: [
      { question: "Er FileKit helt gratis uden skjulte abonnementer?", answer: "Ja. Alle PDF-konverterings-, komprimerings-, redigerings-, OCR- og sammenlægningsværktøjer er 100% gratis uden kontooprettelse." },
      { question: "Forbliver mine følsomme PDF-dokumenter og underskrifter private?", answer: "Absolut. FileKit behandler dokumenter lokalt i din browser. Dine filer berører aldrig vores servere." },
      { question: "Bevarer FileKit tekstformatering, indlejrede skrifttyper og sidelayouts?", answer: "Ja. Motoren overholder strengt ISO PDF-standarder og bevarer vektorgrafik, formularfelter og typografi." }
    ],
    fi: [
      { question: "Onko FileKit täysin ilmainen ilman piilotettuja tilauksia?", answer: "Kyllä. Kaikki PDF-muunnos-, pakkaus-, muokkaus-, OCR- ja yhdistämistyökalut ovat 100% ilmaisia ilman tilin luomista." },
      { question: "Pysyvätkö arkaluonteiset PDF-asiakirjani ja allekirjoitukseni yksityisinä?", answer: "Ehdottomasti. FileKit käsittelee asiakirjat paikallisesti selaimessasi. Tiedostosi eivät koskaan kosketa palvelimiamme." },
      { question: "Säilyttääkö FileKit tekstin muotoilun, upotetut fontit ja sivuasettelut?", answer: "Kyllä. Moottori noudattaa tiukasti ISO PDF -standardeja ja säilyttää vektorigrafiikan, lomakekentät ja typografian." }
    ],
    no: [
      { question: "Er FileKit helt gratis uten skjulte abonnementer?", answer: "Ja. Alle PDF-konverterings-, komprimerings-, redigerings-, OCR- og sammenslåingsverktøy er 100% gratis uten kontoregistrering." },
      { question: "Forblir mine sensitive PDF-dokumenter og signaturer private?", answer: "Absolutt. FileKit behandler dokumenter lokalt i nettleseren. Filene dine berører aldri våre servere." },
      { question: "Bevarer FileKit tekstformatering, innebygde skrifttyper og sidelayout?", answer: "Ja. Motoren overholder strengt ISO PDF-standarder og bevarer vektorgrafikk, skjemafelt og typografi." }
    ],
    pl: [
      { question: "Czy FileKit jest całkowicie darmowy bez ukrytych subskrypcji?", answer: "Tak. Wszystkie narzędzia do konwersji, kompresji, edycji, OCR i łączenia PDF są w 100% darmowe bez tworzenia konta." },
      { question: "Czy moje wrażliwe dokumenty PDF i podpisy pozostają prywatne?", answer: "Absolutnie. FileKit przetwarza dokumenty lokalnie w przeglądarce. Twoje pliki nigdy nie trafiają na nasze serwery." },
      { question: "Czy FileKit zachowuje formatowanie tekstu, osadzone czcionki i układy stron?", answer: "Tak. Silnik ściśle przestrzega standardów ISO PDF, zachowując grafikę wektorową, pola formularzy i typografię." }
    ],
    cs: [
      { question: "Je FileKit zcela zdarma bez skrytých předplatných?", answer: "Ano. Všechny nástroje pro konverzi, kompresi, úpravu, OCR a slučování PDF jsou 100% zdarma bez vytváření účtu." },
      { question: "Zůstávají mé citlivé PDF dokumenty a podpisy soukromé?", answer: "Rozhodně. FileKit zpracovává dokumenty lokálně v prohlížeči. Vaše soubory se nikdy nedotknou našich serverů." },
      { question: "Zachovává FileKit formátování textu, vložená písma a rozvržení stránek?", answer: "Ano. Motor striktně dodržuje standardy ISO PDF a zachovává vektorovou grafiku, pole formulářů a typografii." }
    ],
    hu: [
      { question: "A FileKit teljesen ingyenes rejtett előfizetések nélkül?", answer: "Igen. Minden PDF-konvertáló, tömörítő, szerkesztő, OCR és egyesítő eszköz 100%-ban ingyenes fiókregisztráció nélkül." },
      { question: "A bizalmas PDF-dokumentumaim és aláírásaim privátok maradnak?", answer: "Feltétlenül. A FileKit helyben dolgozza fel a dokumentumokat a böngészőben. Fájljai soha nem érintik szervereinket." },
      { question: "A FileKit megőrzi a szövegformázást, beágyazott betűtípusokat és oldalelrendezést?", answer: "Igen. A motor szigorúan betartja az ISO PDF-szabványokat, megőrizve a vektorgrafikát, űrlapmezőket és tipográfiát." }
    ],
    ro: [
      { question: "Este FileKit complet gratuit fără abonamente ascunse?", answer: "Da. Toate instrumentele de conversie, compresie, editare, OCR și fuzionare PDF sunt 100% gratuite fără creare de cont." },
      { question: "Documentele PDF sensibile și semnăturile mele rămân private?", answer: "Absolut. FileKit procesează documentele local în browserul dvs. Fișierele nu ating niciodată serverele noastre." },
      { question: "FileKit păstrează formatarea textului, fonturile încorporate și aspectul paginilor?", answer: "Da. Motorul respectă strict standardele ISO PDF, păstrând graficele vectoriale, câmpurile de formular și tipografia." }
    ],
    bg: [
      { question: "FileKit е напълно безплатен без скрити абонаменти?", answer: "Да. Всички инструменти за конвертиране, компресия, редактиране, OCR и сливане на PDF са 100% безплатни без създаване на акаунт." },
      { question: "Чувствителните ми PDF документи и подписи остават ли поверителни?", answer: "Абсолютно. FileKit обработва документите локално в браузъра ви. Файловете никога не достигат нашите сървъри." },
      { question: "FileKit запазва ли форматирането на текст, вградените шрифтове и оформлението на страниците?", answer: "Да. Двигателят стриктно спазва стандартите ISO PDF, запазвайки векторна графика, полета за формуляри и типография." }
    ],
    el: [
      { question: "Είναι το FileKit εντελώς δωρεάν χωρίς κρυφές συνδρομές;", answer: "Ναι. Όλα τα εργαλεία μετατροπής, συμπίεσης, επεξεργασίας, OCR και συγχώνευσης PDF είναι 100% δωρεάν χωρίς δημιουργία λογαριασμού." },
      { question: "Τα ευαίσθητα PDF έγγραφά μου και οι υπογραφές παραμένουν ιδιωτικά;", answer: "Απολύτως. Το FileKit επεξεργάζεται τα έγγραφα τοπικά στον browser σας. Τα αρχεία δεν αγγίζουν ποτέ τους servers μας." },
      { question: "Διατηρεί το FileKit τη μορφοποίηση κειμένου, τις ενσωματωμένες γραμματοσειρές και τη διάταξη;", answer: "Ναι. Ο κινητήρας τηρεί αυστηρά τα πρότυπα ISO PDF, διατηρώντας διανυσματικά γραφικά και τυπογραφία." }
    ],
    sk: [
      { question: "Je FileKit úplne zadarmo bez skrytých predplatných?", answer: "Áno. Všetky nástroje na konverziu, kompresiu, úpravu, OCR a zlučovanie PDF sú 100% zadarmo bez vytvárania účtu." },
      { question: "Zostávajú moje citlivé PDF dokumenty a podpisy súkromné?", answer: "Rozhodne. FileKit spracováva dokumenty lokálne v prehliadači. Vaše súbory sa nikdy nedotknú našich serverov." },
      { question: "Zachováva FileKit formátovanie textu, vložené písma a rozloženie stránok?", answer: "Áno. Motor striktne dodržiava štandardy ISO PDF a zachováva vektorovú grafiku, polia formulárov a typografiu." }
    ],
    sl: [
      { question: "Je FileKit popolnoma brezplačen brez skritih naročnin?", answer: "Da. Vsa orodja za pretvorbo, stiskanje, urejanje, OCR in združevanje PDF so 100% brezplačna brez ustvarjanja računa." },
      { question: "Ali moji občutljivi PDF dokumenti in podpisi ostanejo zasebni?", answer: "Absolutno. FileKit obdeluje dokumente lokalno v brskalniku. Vaše datoteke nikoli ne pridejo do naših strežnikov." },
      { question: "Ali FileKit ohranja oblikovanje besedila, vdelane pisave in postavitve strani?", answer: "Da. Motor se strogo drži standardov ISO PDF in ohranja vektorsko grafiko, polja obrazcev in tipografijo." }
    ],
    ru: [
      { question: "FileKit полностью бесплатный без скрытых подписок?", answer: "Да. Все инструменты конвертации, сжатия, редактирования, OCR и объединения PDF на 100% бесплатны без регистрации." },
      { question: "Мои конфиденциальные PDF-документы и подписи остаются приватными?", answer: "Безусловно. FileKit обрабатывает документы локально в вашем браузере. Ваши файлы никогда не попадают на наши серверы." },
      { question: "Сохраняет ли FileKit форматирование текста, встроенные шрифты и макеты страниц?", answer: "Да. Движок строго соблюдает стандарты ISO PDF, сохраняя векторную графику, поля форм и типографику." }
    ],
    uk: [
      { question: "FileKit повністю безкоштовний без прихованих підписок?", answer: "Так. Усі інструменти конвертації, стиснення, редагування, OCR та об'єднання PDF на 100% безкоштовні без реєстрації." },
      { question: "Мої конфіденційні PDF-документи та підписи залишаються приватними?", answer: "Безумовно. FileKit обробляє документи локально у вашому браузері. Ваші файли ніколи не потрапляють на наші сервери." },
      { question: "Чи зберігає FileKit форматування тексту, вбудовані шрифти та макети сторінок?", answer: "Так. Двигун суворо дотримується стандартів ISO PDF, зберігаючи векторну графіку, поля форм та типографіку." }
    ],
    lv: [
      { question: "Vai FileKit ir pilnībā bezmaksas bez slēptām abonementiem?", answer: "Jā. Visi PDF konvertēšanas, saspiešanas, rediģēšanas, OCR un apvienošanas rīki ir 100% bezmaksas bez konta izveides." },
      { question: "Vai mani sensitīvie PDF dokumenti un paraksti paliek privāti?", answer: "Pilnīgi. FileKit apstrādā dokumentus lokāli jūsu pārlūkprogrammā. Jūsu faili nekad nesasniedz mūsu serverus." },
      { question: "Vai FileKit saglabā teksta formatēšanu, iegultos fontus un lapu izkārtojumu?", answer: "Jā. Dzinējs stingri ievēro ISO PDF standartus, saglabājot vektorgrafiku, veidlapu laukus un tipogrāfiju." }
    ],
    lt: [
      { question: "Ar FileKit yra visiškai nemokamas be paslėptų prenumeratų?", answer: "Taip. Visi PDF konvertavimo, suspaudimo, redagavimo, OCR ir sujungimo įrankiai yra 100% nemokami be paskyros kūrimo." },
      { question: "Ar mano jautrūs PDF dokumentai ir parašai lieka privatūs?", answer: "Visiškai. FileKit apdoroja dokumentus lokaliai jūsų naršyklėje. Jūsų failai niekada nepasiekia mūsų serverių." },
      { question: "Ar FileKit išsaugo teksto formatavimą, įterptus šriftus ir puslapių maketus?", answer: "Taip. Variklis griežtai laikosi ISO PDF standartų, išsaugodamas vektorinę grafiką, formos laukus ir tipografiją." }
    ],
    tr: [
      { question: "FileKit gizli abonelikler olmadan tamamen ücretsiz mi?", answer: "Evet. Tüm PDF dönüştürme, sıkıştırma, düzenleme, OCR ve birleştirme araçları hesap oluşturmadan %100 ücretsizdir." },
      { question: "Hassas PDF belgelerim ve imzalarım gizli kalıyor mu?", answer: "Kesinlikle. FileKit belgeleri tarayıcınızda yerel olarak işler. Dosyalarınız asla sunucularımıza ulaşmaz." },
      { question: "FileKit metin biçimlendirmesini, gömülü fontları ve sayfa düzenlerini korur mu?", answer: "Evet. Motor ISO PDF standartlarına sıkı sıkıya bağlıdır; vektör grafikleri, form alanlarını ve tipografiyi korur." }
    ],
    ar: [
      { question: "هل FileKit مجاني تماماً بدون اشتراكات مخفية؟", answer: "نعم. جميع أدوات تحويل وضغط وتحرير ودمج PDF مجانية 100% بدون إنشاء حساب." },
      { question: "هل تبقى مستنداتي PDF الحساسة وتوقيعاتي خاصة؟", answer: "بالتأكيد. يعالج FileKit المستندات محلياً في متصفحك. ملفاتك لا تصل أبداً إلى خوادمنا." },
      { question: "هل يحافظ FileKit على تنسيق النص والخطوط المضمنة وتخطيطات الصفحات؟", answer: "نعم. يلتزم المحرك بمعايير ISO PDF بصرامة مع الحفاظ على الرسومات المتجهة وحقول النماذج والطباعة." }
    ],
    he: [
      { question: "האם FileKit חינמי לחלוטין ללא מנויים נסתרים?", answer: "כן. כל כלי ההמרה, הדחיסה, העריכה, ה-OCR ומיזוג PDF הם חינמיים ב-100% ללא צורך ביצירת חשבון." },
      { question: "האם מסמכי ה-PDF הרגישים והחתימות שלי נשמרים פרטיים?", answer: "בהחלט. FileKit מעבד מסמכים מקומית בדפדפן שלך. הקבצים לעולם לא מגיעים לשרתים שלנו." },
      { question: "האם FileKit שומר על עיצוב טקסט, גופנים מוטמעים ופריסות עמודים?", answer: "כן. המנוע מקפיד על תקני ISO PDF ושומר על גרפיקה וקטורית, שדות טפסים וטיפוגרפיה." }
    ],
    hi: [
      { question: "क्या FileKit वाकई पूरी तरह से मुफ्त है बिना छिपी सदस्यता के?", answer: "हाँ। सभी PDF कन्वर्शन, कंप्रेशन, एडिटिंग, OCR और मर्जिंग टूल 100% मुफ्त हैं बिना खाता बनाए।" },
      { question: "क्या मेरे संवेदनशील PDF दस्तावेज़ और हस्ताक्षर निजी रहते हैं?", answer: "बिल्कुल। FileKit दस्तावेज़ों को स्थानीय रूप से ब्राउज़र में प्रोसेस करता है। आपकी फ़ाइलें हमारे सर्वर को कभी नहीं छूतीं।" },
      { question: "क्या FileKit टेक्स्ट फ़ॉर्मेटिंग, एम्बेडेड फ़ॉन्ट और पेज लेआउट सुरक्षित रखता है?", answer: "हाँ। इंजन ISO PDF मानकों का कड़ाई से पालन करता है, वेक्टर ग्राफ़िक्स, फ़ॉर्म फ़ील्ड और टाइपोग्राफ़ी को संरक्षित करता है।" }
    ],
    id: [
      { question: "Apakah FileKit benar-benar gratis tanpa langganan tersembunyi?", answer: "Ya. Semua alat konversi, kompresi, pengeditan, OCR, dan penggabungan PDF 100% gratis tanpa pembuatan akun." },
      { question: "Apakah dokumen PDF sensitif dan tanda tangan saya tetap pribadi?", answer: "Tentu saja. FileKit memproses dokumen secara lokal di browser Anda. File Anda tidak pernah menyentuh server kami." },
      { question: "Apakah FileKit mempertahankan pemformatan teks, font tertanam, dan tata letak halaman?", answer: "Ya. Mesin secara ketat mengikuti standar ISO PDF, mempertahankan grafik vektor, bidang formulir, dan tipografi." }
    ],
    ms: [
      { question: "Adakah FileKit percuma sepenuhnya tanpa langganan tersembunyi?", answer: "Ya. Semua alat penukaran, pemampatan, penyuntingan, OCR dan penggabungan PDF adalah 100% percuma tanpa membuat akaun." },
      { question: "Adakah dokumen PDF sensitif dan tandatangan saya kekal peribadi?", answer: "Sudah tentu. FileKit memproses dokumen secara setempat dalam pelayar anda. Fail anda tidak pernah menyentuh pelayan kami." },
      { question: "Adakah FileKit mengekalkan pemformatan teks, fon terbenam dan susun atur halaman?", answer: "Ya. Enjin mematuhi standard ISO PDF dengan ketat, mengekalkan grafik vektor, medan borang dan tipografi." }
    ],
    th: [
      { question: "FileKit ฟรีทั้งหมดจริงๆ โดยไม่มีการสมัครสมาชิกที่ซ่อนอยู่หรือไม่?", answer: "ใช่ เครื่องมือแปลง บีบอัด แก้ไข OCR และรวม PDF ทั้งหมดฟรี 100% โดยไม่ต้องสร้างบัญชี" },
      { question: "เอกสาร PDF ที่ละเอียดอ่อนและลายเซ็นของฉันยังคงเป็นส่วนตัวหรือไม่?", answer: "แน่นอน FileKit ประมวลผลเอกสารในเครื่องภายในเบราว์เซอร์ ไฟล์ของคุณไม่เคยถูกส่งไปยังเซิร์ฟเวอร์ของเรา" },
      { question: "FileKit รักษาการจัดรูปแบบข้อความ ฟอนต์ที่ฝัง และเค้าโครงหน้าหรือไม่?", answer: "ใช่ เอ็นจิ้นปฏิบัติตามมาตรฐาน ISO PDF อย่างเคร่งครัด รักษากราฟิกเวกเตอร์ ฟิลด์ฟอร์ม และรูปแบบตัวอักษร" }
    ],
    vi: [
      { question: "FileKit có hoàn toàn miễn phí không có đăng ký ẩn không?", answer: "Có. Tất cả công cụ chuyển đổi, nén, chỉnh sửa, OCR và hợp nhất PDF đều miễn phí 100% mà không cần tạo tài khoản." },
      { question: "Tài liệu PDF nhạy cảm và chữ ký của tôi có được giữ riêng tư không?", answer: "Hoàn toàn. FileKit xử lý tài liệu cục bộ trong trình duyệt. File của bạn không bao giờ chạm đến máy chủ của chúng tôi." },
      { question: "FileKit có giữ nguyên định dạng văn bản, font nhúng và bố cục trang không?", answer: "Có. Bộ xử lý tuân thủ nghiêm ngặt tiêu chuẩn ISO PDF, bảo toàn đồ họa vector, trường biểu mẫu và kiểu chữ." }
    ],
    fil: [
      { question: "Libre ba talaga ang FileKit nang walang hidden subscriptions?", answer: "Oo. Lahat ng PDF conversion, compression, editing, OCR, at merging tools ay 100% libre nang walang account creation." },
      { question: "Nananatiling private ba ang aking sensitibong PDF documents at signatures?", answer: "Oo naman. Pinoproseso ng FileKit ang mga dokumento nang lokal sa iyong browser. Ang iyong mga file ay hindi kailanman umaabot sa aming servers." },
      { question: "Pinapanatili ba ng FileKit ang text formatting, embedded fonts, at page layouts?", answer: "Oo. Mahigpit na sinusunod ng engine ang ISO PDF standards, pinapanatili ang vector graphics, form fields, at typography." }
    ],
    ja: [
      { question: "FileKitは隠れたサブスクリプションなしで完全に無料ですか？", answer: "はい。すべてのPDF変換、圧縮、編集、OCR、結合ツールはアカウント作成不要で100%無料です。" },
      { question: "機密PDFドキュメントと署名はプライベートに保たれますか？", answer: "もちろんです。FileKitはドキュメントをブラウザ内でローカル処理します。ファイルが当社のサーバーに触れることはありません。" },
      { question: "FileKitはテキストの書式設定、埋め込みフォント、ページレイアウトを保持しますか？", answer: "はい。エンジンはISO PDF標準に厳密に準拠し、ベクターグラフィックス、フォームフィールド、タイポグラフィを保持します。" }
    ],
    ko: [
      { question: "FileKit은 숨겨진 구독 없이 완전히 무료인가요?", answer: "네. 모든 PDF 변환, 압축, 편집, OCR 및 병합 도구는 계정 생성 없이 100% 무료입니다." },
      { question: "민감한 PDF 문서와 서명은 비공개로 유지되나요?", answer: "물론입니다. FileKit은 브라우저에서 로컬로 문서를 처리합니다. 파일이 서버에 전달되지 않습니다." },
      { question: "FileKit은 텍스트 서식, 임베디드 폰트 및 페이지 레이아웃을 유지하나요?", answer: "네. 엔진은 ISO PDF 표준을 엄격히 준수하여 벡터 그래픽, 양식 필드 및 타이포그래피를 보존합니다." }
    ],
    "zh-CN": [
      { question: "FileKit 真的完全免费没有隐藏订阅吗？", answer: "是的。所有 PDF 转换、压缩、编辑、OCR 和合并工具均 100% 免费，无需创建账户。" },
      { question: "我的敏感 PDF 文档和签名是否保持私密？", answer: "当然。FileKit 在浏览器中本地处理文档。您的文件永远不会触及我们的服务器。" },
      { question: "FileKit 是否保留文本格式、嵌入字体和页面布局？", answer: "是的。引擎严格遵循 ISO PDF 标准，保留矢量图形、表单字段和排版。" }
    ],
    "zh-TW": [
      { question: "FileKit 真的完全免費沒有隱藏訂閱嗎？", answer: "是的。所有 PDF 轉換、壓縮、編輯、OCR 和合併工具均 100% 免費，無需建立帳號。" },
      { question: "我的敏感 PDF 文件和簽名是否保持私密？", answer: "當然。FileKit 在瀏覽器中本機處理文件。您的檔案永遠不會觸及我們的伺服器。" },
      { question: "FileKit 是否保留文字格式、嵌入字型和頁面佈局？", answer: "是的。引擎嚴格遵循 ISO PDF 標準，保留向量圖形、表單欄位和排版。" }
    ],
  },
};
