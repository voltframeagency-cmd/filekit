import { SupportedLocale } from "./locales";

export interface ToolTranslation {
  title: string;
  description: string;
  heroSubtitle?: string;
}

export interface UiTranslations {
  nav: {
    allTools: string;
    compress: string;
    convert: string;
    merge: string;
    image: string;
    organize: string;
    searchPlaceholder: string;
  };
  trust: {
    badge1: string;
    badge2: string;
    badge3: string;
    badge4: string;
  };
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    dropzoneTitle: string;
    dropzoneSubtitle: string;
    popularTools: string;
    viewAll: string;
  };
  workspace: {
    selectFile: string;
    processing: string;
    download: string;
    changeFile: string;
    error: string;
    freeNotice: string;
  };
}

export const UI_TRANSLATIONS: Record<SupportedLocale, UiTranslations> = {
  // 1. English
  en: {
    nav: { allTools: "All Tools", compress: "Compress", convert: "Convert", merge: "Merge", image: "Image", organize: "Organize", searchPlaceholder: "Search 100+ tools..." },
    trust: { badge1: "Browser-first processing", badge2: "Automatic deletion after server jobs", badge3: "No account required", badge4: "100% Private & Secure" },
    homepage: { heroTitle: "Files on your terms. Private, instant, free.", heroSubtitle: "Convert, compress, edit, and organize PDFs, images, Office documents, audio, and video directly in your browser.", dropzoneTitle: "Drop a file anywhere to get started", dropzoneSubtitle: "or click to browse files from your device", popularTools: "Popular Tools", viewAll: "Explore all 100+ tools →" },
    workspace: { selectFile: "Select File", processing: "Processing locally...", download: "Download File", changeFile: "Change File", error: "An error occurred while processing your file.", freeNotice: "100% Free · Zero File Uploads · No Account Needed" }
  },

  // 2. Spanish
  es: {
    nav: { allTools: "Todas las herramientas", compress: "Comprimir", convert: "Convertir", merge: "Unir", image: "Imagen", organize: "Organizar", searchPlaceholder: "Buscar más de 100 herramientas..." },
    trust: { badge1: "Procesamiento en el navegador", badge2: "Eliminación automática en el servidor", badge3: "Sin necesidad de registro", badge4: "100% Privado y Seguro" },
    homepage: { heroTitle: "Archivos a tu manera. Privado, instantáneo, gratis.", heroSubtitle: "Convierte, comprime, edita y organiza PDFs, imágenes, Office, audio y video directamente en tu navegador.", dropzoneTitle: "Arrastra un archivo aquí para comenzar", dropzoneSubtitle: "o haz clic para explorar tus archivos", popularTools: "Herramientas Populares", viewAll: "Explorar más de 100 herramientas →" },
    workspace: { selectFile: "Seleccionar Archivo", processing: "Procesando localmente...", download: "Descargar Archivo", changeFile: "Cambiar Archivo", error: "Ocurrió un error al procesar el archivo.", freeNotice: "100% Gratis · Sin subir archivos · Sin cuenta" }
  },

  // 3. Spanish (Latin America)
  "es-419": {
    nav: { allTools: "Todas las herramientas", compress: "Comprimir", convert: "Convertir", merge: "Unir", image: "Imagen", organize: "Organizar", searchPlaceholder: "Buscar más de 100 herramientas..." },
    trust: { badge1: "Procesamiento en navegador", badge2: "Eliminación automática de archivos", badge3: "Sin crear cuenta", badge4: "100% Privado y Seguro" },
    homepage: { heroTitle: "Tus archivos, a tu manera. Privado, rápido y gratis.", heroSubtitle: "Convierte, comprime y edita PDFs, fotos, documentos de Office, audio y video en tu navegador.", dropzoneTitle: "Suelta tu archivo aquí", dropzoneSubtitle: "o toca para buscar en tu dispositivo", popularTools: "Herramientas Destacadas", viewAll: "Ver las 100+ herramientas →" },
    workspace: { selectFile: "Elegir Archivo", processing: "Procesando en tu dispositivo...", download: "Descargar Resultado", changeFile: "Cambiar Archivo", error: "Hubo un error al procesar tu archivo.", freeNotice: "100% Gratis · Cero subidas · Sin registro" }
  },

  // 4. German
  de: {
    nav: { allTools: "Alle Werkzeuge", compress: "Komprimieren", convert: "Konvertieren", merge: "Zusammenfügen", image: "Bild", organize: "Organisieren", searchPlaceholder: "Über 100 Werkzeuge durchsuchen..." },
    trust: { badge1: "Lokale Browser-Verarbeitung", badge2: "Automatische Server-Löschung", badge3: "Keine Registrierung erforderlich", badge4: "100% Privat & Sicher" },
    homepage: { heroTitle: "Dateien nach Ihren Regeln. Privat, sofort, kostenlos.", heroSubtitle: "Konvertieren, komprimieren, bearbeiten und organisieren Sie PDFs, Bilder, Office-Dateien, Audio und Video im Browser.", dropzoneTitle: "Datei hier ablegen, um zu starten", dropzoneSubtitle: "oder klicken, um Dateien auszuwählen", popularTools: "Beliebte Werkzeuge", viewAll: "Alle 100+ Werkzeuge entdecken →" },
    workspace: { selectFile: "Datei auswählen", processing: "Wird lokal verarbeitet...", download: "Datei herunterladen", changeFile: "Datei ändern", error: "Bei der Verarbeitung ist ein Fehler aufgetreten.", freeNotice: "100% Kostenlos · Kein Datei-Upload · Ohne Registrierung" }
  },

  // 5. French
  fr: {
    nav: { allTools: "Tous les outils", compress: "Compresser", convert: "Convertir", merge: "Fusionner", image: "Image", organize: "Organiser", searchPlaceholder: "Rechercher parmi plus de 100 outils..." },
    trust: { badge1: "Traitement direct dans le navigateur", badge2: "Suppression automatique des serveurs", badge3: "Aucun compte requis", badge4: "100% Privé et Sécurisé" },
    homepage: { heroTitle: "Vos fichiers, selon vos règles. Privé, instantané, gratuit.", heroSubtitle: "Convertissez, compressez, modifiez et organisez vos PDF, images, fichiers Office, audio et vidéo dans votre navigateur.", dropzoneTitle: "Déposez un fichier ici pour commencer", dropzoneSubtitle: "ou cliquez pour parcourir vos fichiers", popularTools: "Outils populaires", viewAll: "Explorer les 100+ outils →" },
    workspace: { selectFile: "Sélectionner un fichier", processing: "Traitement local en cours...", download: "Télécharger le fichier", changeFile: "Changer de fichier", error: "Une erreur est survenue lors du traitement.", freeNotice: "100% Gratuit · Zéro transfert de fichier · Sans inscription" }
  },

  // 6. Portuguese (Portugal)
  pt: {
    nav: { allTools: "Todas as ferramentas", compress: "Comprimir", convert: "Converter", merge: "Juntar", image: "Imagem", organize: "Organizar", searchPlaceholder: "Pesquisar mais de 100 ferramentas..." },
    trust: { badge1: "Processamento no navegador", badge2: "Eliminação automática no servidor", badge3: "Sem registo necessário", badge4: "100% Privado e Seguro" },
    homepage: { heroTitle: "Ficheiros à sua medida. Privado, instantâneo e gratuito.", heroSubtitle: "Converta, comprima, edite e organize PDFs, imagens, documentos do Office, áudio e vídeo no seu navegador.", dropzoneTitle: "Arraste um ficheiro para aqui", dropzoneSubtitle: "ou clique para escolher do dispositivo", popularTools: "Ferramentas Populares", viewAll: "Ver todas as 100+ ferramentas →" },
    workspace: { selectFile: "Selecionar Ficheiro", processing: "A processar localmente...", download: "Descarregar Ficheiro", changeFile: "Alterar Ficheiro", error: "Ocorreu um erro ao processar o ficheiro.", freeNotice: "100% Gratuito · Sem uploads · Sem registo" }
  },

  // 7. Portuguese (Brazil)
  "pt-BR": {
    nav: { allTools: "Todas as ferramentas", compress: "Comprimir", convert: "Converter", merge: "Juntar", image: "Imagem", organize: "Organizar", searchPlaceholder: "Buscar mais de 100 ferramentas..." },
    trust: { badge1: "Processamento no navegador", badge2: "Exclusão automática no servidor", badge3: "Sem necessidade de cadastro", badge4: "100% Privado e Seguro" },
    homepage: { heroTitle: "Seus arquivos do seu jeito. Privado, instantâneo e grátis.", heroSubtitle: "Converta, comprima, edite e organize PDFs, imagens, arquivos do Office, áudio e vídeo no navegador.", dropzoneTitle: "Arraste um arquivo aqui para começar", dropzoneSubtitle: "ou clique para escolher do seu dispositivo", popularTools: "Ferramentas Populares", viewAll: "Explorar mais de 100 ferramentas →" },
    workspace: { selectFile: "Selecionar Arquivo", processing: "Processando localmente...", download: "Baixar Arquivo", changeFile: "Trocar Arquivo", error: "Ocorreu um erro ao processar o arquivo.", freeNotice: "100% Grátis · Sem envio para servidor · Sem cadastro" }
  },

  // 8. Italian
  it: {
    nav: { allTools: "Tutti gli strumenti", compress: "Comprimi", convert: "Converti", merge: "Unisci", image: "Immagine", organize: "Organizza", searchPlaceholder: "Cerca tra oltre 100 strumenti..." },
    trust: { badge1: "Elaborazione nel browser", badge2: "Cancellazione automatica dal server", badge3: "Nessuna registrazione richiesta", badge4: "100% Privato e Sicuro" },
    homepage: { heroTitle: "I tuoi file, alle tue condizioni. Privato, istantaneo, gratis.", heroSubtitle: "Converti, comprimi, modifica e organizza PDF, immagini, file Office, audio e video direttamente nel tuo browser.", dropzoneTitle: "Trascina un file qui per iniziare", dropzoneSubtitle: "oppure fai clic per selezionare un file", popularTools: "Strumenti popolari", viewAll: "Scopri tutti gli oltre 100 strumenti →" },
    workspace: { selectFile: "Seleziona File", processing: "Elaborazione locale in corso...", download: "Scarica File", changeFile: "Cambia File", error: "Si è verificato un errore durante l'elaborazione del file.", freeNotice: "100% Gratis · Zero caricamenti sul server · Senza account" }
  },

  // 9. Dutch
  nl: {
    nav: { allTools: "Alle tools", compress: "Comprimeren", convert: "Converteren", merge: "Samenvoegen", image: "Afbeelding", organize: "Organiseren", searchPlaceholder: "Zoek 100+ tools..." },
    trust: { badge1: "Lokale browserverwerking", badge2: "Automatische serververwijdering", badge3: "Geen account nodig", badge4: "100% Privé & Veilig" },
    homepage: { heroTitle: "Bestanden op jouw manier. Privé, direct en gratis.", heroSubtitle: "Converteer, comprimeer, bewerk en organiseer PDF's, afbeeldingen, Office-bestanden, audio en video in je browser.", dropzoneTitle: "Sleep hier een bestand naartoe", dropzoneSubtitle: "of klik om een bestand te kiezen", popularTools: "Populaire tools", viewAll: "Bekijk alle 100+ tools →" },
    workspace: { selectFile: "Selecteer Bestand", processing: "Lokaal verwerken...", download: "Download Bestand", changeFile: "Ander Bestand", error: "Er is een fout opgetreden bij het verwerken.", freeNotice: "100% Gratis · Geen uploads · Geen account nodig" }
  },

  // 10. Catalan
  ca: {
    nav: { allTools: "Totes les eines", compress: "Comprimir", convert: "Convertir", merge: "Fusionar", image: "Imatge", organize: "Organitzar", searchPlaceholder: "Cerca entre més de 100 eines..." },
    trust: { badge1: "Processament al navegador", badge2: "Eliminació automàtica del servidor", badge3: "Sense necessitat de registre", badge4: "100% Privat i Segur" },
    homepage: { heroTitle: "Fitxers a la teva manera. Privat, instantani i gratuït.", heroSubtitle: "Converteix, comprimeix, edita i organitza PDFs, imatges, documents d'Office, àudio i vídeo al teu navegador.", dropzoneTitle: "Arrossega un fitxer aquí per començar", dropzoneSubtitle: "o fes clic per triar-ne un", popularTools: "Eines Populars", viewAll: "Explora les 100+ eines →" },
    workspace: { selectFile: "Selecciona Fitxer", processing: "Processant localment...", download: "Descarrega Fitxer", changeFile: "Canvia Fitxer", error: "S'ha produït un error en processar el fitxer.", freeNotice: "100% Gratuït · Sense càrregues · Sense compte" }
  },

  // 11. Swedish
  sv: {
    nav: { allTools: "Alla verktyg", compress: "Komprimera", convert: "Konvertera", merge: "Slå samman", image: "Bild", organize: "Organisera", searchPlaceholder: "Sök bland 100+ verktyg..." },
    trust: { badge1: "Körs direkt i webbläsaren", badge2: "Automatisk radering från server", badge3: "Inget konto krävs", badge4: "100% Privat och säkert" },
    homepage: { heroTitle: "Filer på dina villkor. Privat, blixtsnabbt och gratis.", heroSubtitle: "Konvertera, komprimera, redigera och organisera PDF-filer, bilder, Office-dokument, ljud och video direkt i webbläsaren.", dropzoneTitle: "Släpp en fil här för att börja", dropzoneSubtitle: "eller klicka för att välja från enheten", popularTools: "Populära verktyg", viewAll: "Utforska alla 100+ verktyg →" },
    workspace: { selectFile: "Välj fil", processing: "Bearbetar lokalt...", download: "Ladda ner fil", changeFile: "Byt fil", error: "Ett fel uppstod vid bearbetning av filen.", freeNotice: "100% Gratis · Inga filer laddas upp · Inget konto krävs" }
  },

  // 12. Danish
  da: {
    nav: { allTools: "Alle værktøjer", compress: "Komprimer", convert: "Konverter", merge: "Sammenføj", image: "Billede", organize: "Organiser", searchPlaceholder: "Søg i 100+ værktøjer..." },
    trust: { badge1: "Behandling i browseren", badge2: "Automatisk sletning fra server", badge3: "Ingen konto påkrævet", badge4: "100% Privat & Sikker" },
    homepage: { heroTitle: "Filer på dine præmisser. Privat, hurtigt og gratis.", heroSubtitle: "Konverter, komprimer, rediger og organiser PDF'er, billeder, Office-dokumenter, lyd og video i din browser.", dropzoneTitle: "Slip en fil her for at starte", dropzoneSubtitle: "eller klik for at vælge fra din enhed", popularTools: "Populære værktøjer", viewAll: "Udforsk alle 100+ værktøjer →" },
    workspace: { selectFile: "Vælg fil", processing: "Behandler lokalt...", download: "Download fil", changeFile: "Skift fil", error: "Der opstod en fejl under behandlingen.", freeNotice: "100% Gratis · Ingen uploads · Ingen konto påkrævet" }
  },

  // 13. Finnish
  fi: {
    nav: { allTools: "Kaikki työkalut", compress: "Pakkaa", convert: "Muunna", merge: "Yhdistä", image: "Kuva", organize: "Järjestä", searchPlaceholder: "Hae yli 100 työkalusta..." },
    trust: { badge1: "Käsittely suoraan selaimessa", badge2: "Automaattinen poisto palvelimelta", badge3: "Ei tilin luontia", badge4: "100% Yksityinen & Turvallinen" },
    homepage: { heroTitle: "Tiedostot omilla ehdoillasi. Yksityinen, nopea ja ilmainen.", heroSubtitle: "Muunna, pakkaa, muokkaa ja järjestä PDF-tiedostoja, kuvia, Office-asiakirjoja, ääntä ja videota selaimessasi.", dropzoneTitle: "Pudota tiedosto tähän aloittaaksesi", dropzoneSubtitle: "tai selaa laitteesi tiedostoja", popularTools: "Suositut työkalut", viewAll: "Tutustu kaikkiin 100+ työkaluun →" },
    workspace: { selectFile: "Valitse tiedosto", processing: "Käsitellään paikallisesti...", download: "Lataa tiedosto", changeFile: "Vaihda tiedosto", error: "Tiedoston käsittelyssä tapahtui virhe.", freeNotice: "100% Ilmainen · Ei tiedostojen latausta palvelimelle · Ei tiliä" }
  },

  // 14. Norwegian
  no: {
    nav: { allTools: "Alle verktøy", compress: "Komprimer", convert: "Konverter", merge: "Slå sammen", image: "Bilde", organize: "Organiser", searchPlaceholder: "Søk i 100+ verktøy..." },
    trust: { badge1: "Behandles i nettleseren", badge2: "Automatisk sletting fra server", badge3: "Ingen konto nødvendig", badge4: "100% Privat og sikkert" },
    homepage: { heroTitle: "Filer på dine vilkår. Privat, lynraskt og gratis.", heroSubtitle: "Konverter, komprimer, rediger og organiser PDF-er, bilder, Office-filer, lyd og video i nettleseren.", dropzoneTitle: "Slipp en fil her for å starte", dropzoneSubtitle: "eller klikk for å velge fra enheten", popularTools: "Populære verktøy", viewAll: "Utforsk alle 100+ verktøy →" },
    workspace: { selectFile: "Velg fil", processing: "Behandler lokalt...", download: "Last ned fil", changeFile: "Bytt fil", error: "Det oppsto en feil under behandlingen.", freeNotice: "100% Gratis · Ingen opplasting · Ingen konto kreves" }
  },

  // 15. Polish
  pl: {
    nav: { allTools: "Wszystkie narzędzia", compress: "Kompresuj", convert: "Konwertuj", merge: "Połącz", image: "Obraz", organize: "Organizuj", searchPlaceholder: "Szukaj ponad 100 narzędzi..." },
    trust: { badge1: "Przetwarzanie w przeglądarce", badge2: "Automatyczne usuwanie z serwera", badge3: "Bez rejestracji", badge4: "100% Prywatne i Bezpieczne" },
    homepage: { heroTitle: "Pliki na Twoich zasadach. Prywatnie, natychmiast, za darmo.", heroSubtitle: "Konwertuj, kompresuj, edytuj i organizuj pliki PDF, obrazy, dokumenty Office, audio i wideo w przeglądarce.", dropzoneTitle: "Przeciągnij plik tutaj, aby rozpocząć", dropzoneSubtitle: "lub kliknij, aby wybrać z urządzenia", popularTools: "Popularne narzędzia", viewAll: "Przeglądaj ponad 100 narzędzi →" },
    workspace: { selectFile: "Wybierz plik", processing: "Przetwarzanie lokalne...", download: "Pobierz plik", changeFile: "Zmień plik", error: "Wystąpił błąd podczas przetwarzania pliku.", freeNotice: "100% Za darmo · Bez wysyłania plików · Bez konta" }
  },

  // 16. Czech
  cs: {
    nav: { allTools: "Všechny nástroje", compress: "Komprimovat", convert: "Převést", merge: "Sloučit", image: "Obrázek", organize: "Uspořádat", searchPlaceholder: "Hledat více než 100 nástrojů..." },
    trust: { badge1: "Zpracování v prohlížeči", badge2: "Automatické mazání ze serveru", badge3: "Bez registrace", badge4: "100% Soukromé a bezpečné" },
    homepage: { heroTitle: "Soubory podle vašich představ. Soukromě, ihned a zdarma.", heroSubtitle: "Převádějte, komprimujte, upravujte a organizujte PDF, obrázky, Office soubory, audio a video v prohlížeči.", dropzoneTitle: "Přetáhněte soubor sem", dropzoneSubtitle: "nebo klikněte pro výběr ze zařízení", popularTools: "Oblíbené nástroje", viewAll: "Prozkoumat všech 100+ nástrojů →" },
    workspace: { selectFile: "Vybrat soubor", processing: "Zpracovává se lokálně...", download: "Stáhnout soubor", changeFile: "Změnit soubor", error: "Při zpracování souboru došlo k chybě.", freeNotice: "100% Zdarma · Žádné nahrávání na server · Bez účtu" }
  },

  // 17. Hungarian
  hu: {
    nav: { allTools: "Minden eszköz", compress: "Tömörítés", convert: "Konvertálás", merge: "Egyesítés", image: "Kép", organize: "Rendezés", searchPlaceholder: "Keresés 100+ eszköz között..." },
    trust: { badge1: "Böngészőben történő feldolgozás", badge2: "Automatikus törlés a szerverről", badge3: "Fiók nem szükséges", badge4: "100% Privát és biztonságos" },
    homepage: { heroTitle: "Fájlok a te feltételeid szerint. Privát, azonnali, ingyenes.", heroSubtitle: "Konvertálj, tömöríts, szerkessz és rendezz PDF-eket, képeket, Office dokumentumokat, audiót és videót a böngésződben.", dropzoneTitle: "Húzz ide egy fájlt a kezdéshez", dropzoneSubtitle: "vagy kattints a kiválasztáshoz", popularTools: "Népszerű eszközök", viewAll: "Fedezd fel mind a 100+ eszközt →" },
    workspace: { selectFile: "Fájl kiválasztása", processing: "Helyi feldolgozás...", download: "Fájl letöltése", changeFile: "Fájl módosítása", error: "Hiba történt a fájl feldolgozása során.", freeNotice: "100% Ingyenes · Nincs fájlfeltöltés · Nincs regisztráció" }
  },

  // 18. Romanian
  ro: {
    nav: { allTools: "Toate instrumentele", compress: "Comprimare", convert: "Convertire", merge: "Îmbinare", image: "Imagine", organize: "Organizare", searchPlaceholder: "Caută peste 100 de instrumente..." },
    trust: { badge1: "Procesare în browser", badge2: "Ștergere automată de pe server", badge3: "Fără cont necesar", badge4: "100% Privat și Securizat" },
    homepage: { heroTitle: "Fișiere în condițiile tale. Privat, instant și gratuit.", heroSubtitle: "Convertește, comprimă, editează și organizează PDF-uri, imagini, fișiere Office, audio și video direct în browser.", dropzoneTitle: "Trage un fișier aici pentru a începe", dropzoneSubtitle: "sau fă clic pentru a selecta de pe dispozitiv", popularTools: "Instrumente populare", viewAll: "Explorează toate cele 100+ instrumente →" },
    workspace: { selectFile: "Selectează fișierul", processing: "Se procesează local...", download: "Descarcă fișierul", changeFile: "Schimbă fișierul", error: "A apărut o eroare la procesarea fișierului.", freeNotice: "100% Gratuit · Fără încărcare pe server · Fără cont" }
  },

  // 19. Bulgarian
  bg: {
    nav: { allTools: "Всички инструменти", compress: "Компресиране", convert: "Конвертиране", merge: "Обединяване", image: "Изображение", organize: "Организиране", searchPlaceholder: "Търсене в 100+ инструмента..." },
    trust: { badge1: "Обработка в браузъра", badge2: "Автоматично изтриване от сървъра", badge3: "Без регистрация", badge4: "100% Поверително и сигурно" },
    homepage: { heroTitle: "Вашите файлове, по ваши правила. Бързо, сигурно, безплатно.", heroSubtitle: "Конвертирайте, компресирайте, редактирайте и организирайте PDF, изображения, Office документи, аудио и видео в браузъра.", dropzoneTitle: "Пуснете файл тук, за да започнете", dropzoneSubtitle: "или изберете от вашето устройство", popularTools: "Популярни инструменти", viewAll: "Разгледайте всички 100+ инструмента →" },
    workspace: { selectFile: "Избор на файл", processing: "Локална обработка...", download: "Изтегляне на файл", changeFile: "Смяна на файл", error: "Възникна грешка при обработката на файла.", freeNotice: "100% Безплатно · Без качване на файлове · Без акаунт" }
  },

  // 20. Greek
  el: {
    nav: { allTools: "Όλα τα εργαλεία", compress: "Συμπίεση", convert: "Μετατροπή", merge: "Συγχώνευση", image: "Εικόνα", organize: "Οργάνωση", searchPlaceholder: "Αναζήτηση σε 100+ εργαλεία..." },
    trust: { badge1: "Επεξεργασία στο πρόγραμμα περιήγησης", badge2: "Αυτόματη διαγραφή από τον διακομιστή", badge3: "Δεν απαιτείται λογαριασμός", badge4: "100% Ιδιωτικό & Ασφαλές" },
    homepage: { heroTitle: "Αρχεία με τους δικούς σας όρους. Ιδιωτικά, άμεσα, δωρεάν.", heroSubtitle: "Μετατρέψτε, συμπιέστε, επεξεργαστείτε και οργανώστε PDF, εικόνες, αρχεία Office, ήχο και βίντεο στο πρόγραμμα περιήγησής σας.", dropzoneTitle: "Σύρετε ένα αρχείο εδώ για να ξεκινήσετε", dropzoneSubtitle: "ή κάντε κλικ για επιλογή από τη συσκευή σας", popularTools: "Δημοφιλή εργαλεία", viewAll: "Εξερευνήστε όλα τα 100+ εργαλεία →" },
    workspace: { selectFile: "Επιλογή αρχείου", processing: "Τοπική επεξεργασία...", download: "Λήψη αρχείου", changeFile: "Αλλαγή αρχείου", error: "Παρουσιάστηκε σφάλμα κατά την επεξεργασία.", freeNotice: "100% Δωρεάν · Χωρίς ανέβασμα αρχείων · Χωρίς λογαριασμό" }
  },

  // 21. Slovak
  sk: {
    nav: { allTools: "Všetky nástroje", compress: "Komprimovať", convert: "Konvertovať", merge: "Zlúčiť", image: "Obrázok", organize: "Usporiadať", searchPlaceholder: "Hľadať medzi 100+ nástrojmi..." },
    trust: { badge1: "Spracovanie v prehliadači", badge2: "Automatické mazanie zo servera", badge3: "Bez registrácie", badge4: "100% Súkromné a bezpečné" },
    homepage: { heroTitle: "Súbory podľa vašich pravidiel. Súkromne, ihneď a zadarmo.", heroSubtitle: "Konvertujte, komprimujte, upravujte a usporadúvajte PDF, obrázky, Office dokumenty, audio a video priamo v prehliadači.", dropzoneTitle: "Presuňte súbor sem", dropzoneSubtitle: "alebo kliknite a vyberte zo zariadenia", popularTools: "Populárne nástroje", viewAll: "Pozrieť všetkých 100+ nástrojov →" },
    workspace: { selectFile: "Vybrať súbor", processing: "Spracováva sa lokálne...", download: "Stiahnuť súbor", changeFile: "Zmeniť súbor", error: "Pri spracovaní súboru nastala chyba.", freeNotice: "100% Zadarmo · Žiadne nahrávanie na server · Bez účtu" }
  },

  // 22. Slovenian
  sl: {
    nav: { allTools: "Vsa orodja", compress: "Stisni", convert: "Pretvori", merge: "Združi", image: "Slika", organize: "Organiziraj", searchPlaceholder: "Išči med 100+ orodji..." },
    trust: { badge1: "Obdelava v brskalniku", badge2: "Samodejni izbris s strežnika", badge3: "Brez prijave", badge4: "100% Zasebno in varno" },
    homepage: { heroTitle: "Datoteke po vaših pravilih. Zasebno, takoj, brezplačno.", heroSubtitle: "Pretvarjajte, stiskajte, urejajte in organizirajte PDF-je, slike, Office dokumente, zvok in video v svojem brskalniku.", dropzoneTitle: "Spustite datoteko tukaj za začetek", dropzoneSubtitle: "ali kliknite za izbiro iz naprave", popularTools: "Priljubljena orodja", viewAll: "Raziščite vseh 100+ orodij →" },
    workspace: { selectFile: "Izberi datoteko", processing: "Lokalna obdelava...", download: "Prenesi datoteko", changeFile: "Spremeni datoteko", error: "Pri obdelavi datoteke je prišlo do napake.", freeNotice: "100% Brezplačno · Brez nalaganja datotek · Brez računa" }
  },

  // 23. Russian
  ru: {
    nav: { allTools: "Все инструменты", compress: "Сжать", convert: "Конвертировать", merge: "Объединить", image: "Изображение", organize: "Упорядочить", searchPlaceholder: "Поиск среди 100+ инструментов..." },
    trust: { badge1: "Обработка прямо в браузере", badge2: "Автоматическое удаление с серверов", badge3: "Без регистрации", badge4: "100% Конфиденциально и безопасно" },
    homepage: { heroTitle: "Ваши файлы — ваши правила. Быстро, безопасно, бесплатно.", heroSubtitle: "Конвертируйте, сжимайте, редактируйте и упорядочивайте PDF, изображения, документы Office, аудио и видео в браузере.", dropzoneTitle: "Перетащите файл сюда для начала", dropzoneSubtitle: "или выберите файл на устройстве", popularTools: "Популярные инструменты", viewAll: "Смотреть все 100+ инструментов →" },
    workspace: { selectFile: "Выбрать файл", processing: "Локальная обработка...", download: "Скачать файл", changeFile: "Выбрать другой файл", error: "Произошла ошибка при обработке файла.", freeNotice: "100% Бесплатно · Без загрузки на сервер · Без регистрации" }
  },

  // 24. Ukrainian
  uk: {
    nav: { allTools: "Усі інструменти", compress: "Стиснути", convert: "Конвертувати", merge: "Об'єднати", image: "Зображення", organize: "Упорядкувати", searchPlaceholder: "Пошук серед 100+ інструментів..." },
    trust: { badge1: "Обробка в браузері", badge2: "Автоматичне видалення з сервера", badge3: "Без реєстрації", badge4: "100% Конфіденційно та безпечно" },
    homepage: { heroTitle: "Файли за вашими правилами. Приватно, миттєво, безкоштовно.", heroSubtitle: "Конвертуйте, стискайте, редагуйте та впорядковуйте PDF, зображення, документи Office, аудіо та відео прямо в браузері.", dropzoneTitle: "Перетягніть файл сюди, щоб почати", dropzoneSubtitle: "або виберіть файл на пристрої", popularTools: "Популярні інструменти", viewAll: "Переглянути всі 100+ інструментів →" },
    workspace: { selectFile: "Вибрати файл", processing: "Локальна обробка...", download: "Завантажити файл", changeFile: "Змінити файл", error: "Сталася помилка під час обробки файлу.", freeNotice: "100% Безкоштовно · Без завантаження на сервер · Без акаунта" }
  },

  // 25. Latvian
  lv: {
    nav: { allTools: "Visi rīki", compress: "Saspiest", convert: "Konvertēt", merge: "Apvienot", image: "Attēls", organize: "Kārtot", searchPlaceholder: "Meklēt 100+ rīkos..." },
    trust: { badge1: "Apstrāde pārlūkprogrammā", badge2: "Automātiska dzēšana no servera", badge3: "Konts nav nepieciešams", badge4: "100% Privāti un droši" },
    homepage: { heroTitle: "Faili pēc jūsu noteikumiem. Privāti, tūlītēji un bez maksas.", heroSubtitle: "Konvertējiet, saspiediet, rediģējiet un organizējiet PDF, attēlus, Office failus, audio un video savā pārlūkā.", dropzoneTitle: "Ievelciet failu šeit", dropzoneSubtitle: "vai izvēlieties no savas ierīces", popularTools: "Populārākie rīki", viewAll: "Skatīt visus 100+ rīkus →" },
    workspace: { selectFile: "Izvēlēties failu", processing: "Notiek lokāla apstrāde...", download: "Lejupielādēt failu", changeFile: "Mainīt failu", error: "Apstrādājot failu, radās kļūda.", freeNotice: "100% Bez maksas · Bez augšupielādes · Bez reģistrācijas" }
  },

  // 26. Lithuanian
  lt: {
    nav: { allTools: "Visi įrankiai", compress: "Glaudinti", convert: "Konvertuoti", merge: "Sujungti", image: "Nuotrauka", organize: "Tvarkyti", searchPlaceholder: "Ieškoti tarp 100+ įrankių..." },
    trust: { badge1: "Apdorojimas naršyklėje", badge2: "Automatinis ištrynimas iš serverio", badge3: "Paskyra nereikalinga", badge4: "100% Privatu ir saugu" },
    homepage: { heroTitle: "Failai pagal jūsų taisykles. Privatu, greita ir nemokama.", heroSubtitle: "Konvertuokite, glaudinkite, redaguokite ir tvarkykite PDF, vaizdus, Office dokumentus, garsą ir vaizdą naršyklėje.", dropzoneTitle: "Nutempkite failą čia", dropzoneSubtitle: "arba pasirinkite iš įrenginio", popularTools: "Populiarūs įrankiai", viewAll: "Naršyti visus 100+ įrankių →" },
    workspace: { selectFile: "Pasirinkti failą", processing: "Apdorojama lokaliai...", download: "Atsisiųsti failą", changeFile: "Keisti failą", error: "Apdorojant failą įvyko klaida.", freeNotice: "100% Nemokama · Jokių įkėlimų į serverį · Be paskyros" }
  },

  // 27. Turkish
  tr: {
    nav: { allTools: "Tüm Araçlar", compress: "Sıkıştır", convert: "Dönüştür", merge: "Birleştir", image: "Görsel", organize: "Düzenle", searchPlaceholder: "100+ araç içinde ara..." },
    trust: { badge1: "Tarayıcı tabanlı güvenli işlem", badge2: "Sunucudan otomatik silme", badge3: "Hesap oluşturma gerekmez", badge4: "%100 Gizli ve Güvenli" },
    homepage: { heroTitle: "Dosyalarınız sizin kontrolünüzde. Hızlı, gizli, ücretsiz.", heroSubtitle: "PDF'leri, resimleri, Office belgelerini, ses ve videoları doğrudan tarayıcınızda dönüştürün, sıkıştırın ve düzenleyin.", dropzoneTitle: "Başlamak için bir dosyayı buraya bırakın", dropzoneSubtitle: "veya cihazınızdan dosya seçin", popularTools: "Popüler Araçlar", viewAll: "Tüm 100+ aracı keşfedin →" },
    workspace: { selectFile: "Dosya Seç", processing: "Cihazınızda işleniyor...", download: "Dosyayı İndir", changeFile: "Dosyayı Değiştir", error: "Dosya işlenirken bir hata oluştu.", freeNotice: "%100 Ücretsiz · Dosya yükleme yok · Hesap gerekmez" }
  },

  // 28. Arabic (RTL)
  ar: {
    nav: { allTools: "جميع الأدوات", compress: "ضغط", convert: "تحويل", merge: "دمج", image: "صور", organize: "تنظيم", searchPlaceholder: "ابحث في أكثر من 100 أداة..." },
    trust: { badge1: "معالجة آمنة داخل المتصفح", badge2: "حذف تلقائي من الخوادم", badge3: "لا يتطلب إنشاء حساب", badge4: "100% خصوصية وأمان" },
    homepage: { heroTitle: "ملفاتك بشروطك. خصوصية، فوري، مجاني.", heroSubtitle: "تحويل وضغط وتعديل وتنظيم ملفات PDF والصور ومستندات Office والصوت والفيديو داخل متصفحك مباشرة.", dropzoneTitle: "اسحب الملف هنا للبدء", dropzoneSubtitle: "أو انقر لاختيار ملف من جهازك", popularTools: "الأدوات الشائعة", viewAll: "استكشف جميع الأدوات (100+) ←" },
    workspace: { selectFile: "اختر الملف", processing: "جاري المعالجة محلياً...", download: "تحميل الملف", changeFile: "تغيير الملف", error: "حدث خطأ أثناء معالجة الملف.", freeNotice: "مجاني 100% · لا يتم رفع الملفات · بدون تسجيل" }
  },

  // 29. Hebrew (RTL)
  he: {
    nav: { allTools: "כל הכלים", compress: "דחיסה", convert: "המרת קבצים", merge: "מיזוג", image: "תמונות", organize: "ארגון", searchPlaceholder: "חיפוש בין יותר מ-100 כלים..." },
    trust: { badge1: "עיבוד ישיר בדפדפן", badge2: "מחיקה אוטומטית מהשרת", badge3: "ללא צורך בהרשמה", badge4: "100% פרטי ומאובטח" },
    homepage: { heroTitle: "הקבצים שלך בתנאים שלך. פרטי, מיידי ובחינם.", heroSubtitle: "המר, דחוס, ערוך וארגן קובצי PDF, תמונות, מסמכי Office, אודיו ווידאו ישירות בדפדפן שלך.", dropzoneTitle: "גרור קובץ לכאן כדי להתחיל", dropzoneSubtitle: "או לחץ לבחירת קובץ מהמכשיר", popularTools: "כלים פופולריים", viewAll: "גלה את כל 100+ הכלים ←" },
    workspace: { selectFile: "בחר קובץ", processing: "מעבד מקומית בדפדפן...", download: "הורד קובץ", changeFile: "החלף קובץ", error: "אירעה שגיאה בעת עיבוד הקובץ.", freeNotice: "100% חינם · ללא העלאת קבצים · ללא חשבון" }
  },

  // 30. Hindi
  hi: {
    nav: { allTools: "सभी टूल्स", compress: "कंप्रेस", convert: "कन्वर्ट", merge: "मर्ज", image: "इमेज", organize: "व्यवस्थित करें", searchPlaceholder: "100+ टूल्स में खोजें..." },
    trust: { badge1: "ब्राउज़र में सुरक्षित प्रोसेसिंग", badge2: "सर्वर से ऑटो-डिलीट", badge3: "बिना अकाउंट के उपयोग करें", badge4: "100% निजी और सुरक्षित" },
    homepage: { heroTitle: "आपकी फाइलें, आपकी शर्तों पर। निजी, तेज़ और मुफ़्त।", heroSubtitle: "अपने ब्राउज़र में सीधे PDF, इमेज, Office डॉक्यूमेंट, ऑडियो और वीडियो कन्वर्ट, कंप्रेस और एडिट करें।", dropzoneTitle: "शुरू करने के लिए फाइल यहाँ खींचें", dropzoneSubtitle: "या अपने डिवाइस से फाइल चुनें", popularTools: "लोकप्रिय टूल्स", viewAll: "सभी 100+ टूल्स देखें →" },
    workspace: { selectFile: "फाइल चुनें", processing: "डिवाइस पर प्रोसेस हो रहा है...", download: "फाइल डाउनलोड करें", changeFile: "फाइल बदलें", error: "फाइल प्रोसेस करते समय त्रुटि हुई।", freeNotice: "100% मुफ़्त · शून्य अपलोड · कोई अकाउंट नहीं" }
  },

  // 31. Indonesian
  id: {
    nav: { allTools: "Semua Alat", compress: "Kompres", convert: "Konversi", merge: "Gabung", image: "Gambar", organize: "Atur", searchPlaceholder: "Cari 100+ alat..." },
    trust: { badge1: "Pemrosesan di peramban", badge2: "Penghapusan otomatis dari server", badge3: "Tanpa perlu akun", badge4: "100% Pribadi & Aman" },
    homepage: { heroTitle: "File sesuai keinginan Anda. Pribadi, instan, gratis.", heroSubtitle: "Konversi, kompres, edit, dan atur PDF, gambar, dokumen Office, audio, dan video langsung di browser Anda.", dropzoneTitle: "Tarik file ke sini untuk mulai", dropzoneSubtitle: "atau klik untuk memilih file dari perangkat", popularTools: "Alat Populer", viewAll: "Jelajahi semua 100+ alat →" },
    workspace: { selectFile: "Pilih File", processing: "Memproses secara lokal...", download: "Unduh File", changeFile: "Ganti File", error: "Terjadi kesalahan saat memproses file.", freeNotice: "100% Gratis · Tanpa Unggah File · Tanpa Akun" }
  },

  // 32. Malay
  ms: {
    nav: { allTools: "Semua Alat", compress: "Mampatkan", convert: "Tukar", merge: "Gabungkan", image: "Imej", organize: "Susun", searchPlaceholder: "Cari 100+ alat..." },
    trust: { badge1: "Pemprosesan dalam pelayar", badge2: "Pemadaman automatik dari pelayan", badge3: "Tiada akaun diperlukan", badge4: "100% Peribadi & Selamat" },
    homepage: { heroTitle: "Fail mengikut kehendak anda. Peribadi, pantas, percuma.", heroSubtitle: "Tukar, mampatkan, sunting dan susun PDF, imej, dokumen Office, audio dan video terus dalam pelayar anda.", dropzoneTitle: "Lepaskan fail di sini untuk mula", dropzoneSubtitle: "atau klik untuk memilih fail", popularTools: "Alat Popular", viewAll: "Terokai semua 100+ alat →" },
    workspace: { selectFile: "Pilih Fail", processing: "Memproses secara setempat...", download: "Muat Turun Fail", changeFile: "Tukar Fail", error: "Ralat berlaku semasa memproses fail.", freeNotice: "100% Percuma · Tiada muat naik fail · Tanpa akaun" }
  },

  // 33. Thai
  th: {
    nav: { allTools: "เครื่องมือทั้งหมด", compress: "บีบอัด", convert: "แปลงไฟล์", merge: "รวมไฟล์", image: "รูปภาพ", organize: "จัดระเบียบ", searchPlaceholder: "ค้นหาเครื่องมือกว่า 100 รายการ..." },
    trust: { badge1: "ประมวลผลบนเบราว์เซอร์", badge2: "ลบไฟล์ออกจากเซิร์ฟเวอร์อัตโนมัติ", badge3: "ไม่ต้องสมัครสมาชิก", badge4: "ส่วนตัวและปลอดภัย 100%" },
    homepage: { heroTitle: "จัดการไฟล์ตามต้องการ เป็นส่วนตัว รวดเร็ว ฟรี", heroSubtitle: "แปลงไฟล์ บีบอัด แก้ไข และจัดระเบียบ PDF รูปภาพ ไฟล์ Office เสียง และวิดีโอบนเบราว์เซอร์ของคุณโดยตรง", dropzoneTitle: "ลากไฟล์มาวางที่นี่เพื่อเริ่มต้น", dropzoneSubtitle: "หรือคลิกเพื่อเลือกไฟล์จากอุปกรณ์", popularTools: "เครื่องมือยอดนิยม", viewAll: "ดูเครื่องมือทั้งหมด 100+ รายการ →" },
    workspace: { selectFile: "เลือกไฟล์", processing: "กำลังประมวลผลบนเครื่องของคุณ...", download: "ดาวน์โหลดไฟล์", changeFile: "เปลี่ยนไฟล์", error: "เกิดข้อผิดพลาดในการประมวลผลไฟล์", freeNotice: "ฟรี 100% · ไม่มีการอัปโหลดไฟล์ · ไม่ต้องมีบัญชี" }
  },

  // 34. Vietnamese
  vi: {
    nav: { allTools: "Tất cả công cụ", compress: "Nén", convert: "Chuyển đổi", merge: "Ghép nối", image: "Hình ảnh", organize: "Sắp xếp", searchPlaceholder: "Tìm kiếm hơn 100 công cụ..." },
    trust: { badge1: "Xử lý trực tiếp trên trình duyệt", badge2: "Tự động xóa khỏi máy chủ", badge3: "Không cần tài khoản", badge4: "100% Riêng tư & An toàn" },
    homepage: { heroTitle: "Tệp tin theo cách của bạn. Riêng tư, tức thì, miễn phí.", heroSubtitle: "Chuyển đổi, nén, chỉnh sửa và sắp xếp PDF, hình ảnh, tài liệu Office, âm thanh và video ngay trong trình duyệt.", dropzoneTitle: "Kéo thả tệp vào đây để bắt đầu", dropzoneSubtitle: "hoặc nhấp để chọn tệp từ thiết bị", popularTools: "Công cụ phổ biến", viewAll: "Khám phá tất cả 100+ công cụ →" },
    workspace: { selectFile: "Chọn tệp", processing: "Đang xử lý cục bộ...", download: "Tải xuống tệp", changeFile: "Đổi tệp khác", error: "Đã xảy ra lỗi khi xử lý tệp.", freeNotice: "100% Miễn phí · Không tải tệp lên máy chủ · Không cần tài khoản" }
  },

  // 35. Filipino
  fil: {
    nav: { allTools: "Lahat ng Tools", compress: "I-compress", convert: "I-convert", merge: "Pagsamahin", image: "Larawan", organize: "Ayusin", searchPlaceholder: "Maghanap sa 100+ tools..." },
    trust: { badge1: "Pinoproseso sa browser", badge2: "Awtomatikong binubura sa server", badge3: "Walang account na kailangan", badge4: "100% Pribado at Ligtas" },
    homepage: { heroTitle: "Mga file sa sarili mong paraan. Pribado, mabilis, libre.", heroSubtitle: "Mag-convert, mag-compress, mag-edit, at mag-ayos ng mga PDF, larawan, Office docs, audio, at video direkta sa iyong browser.", dropzoneTitle: "I-drop ang file dito para magsimula", dropzoneSubtitle: "o mag-click para pumili mula sa device", popularTools: "Mga Patok na Tools", viewAll: "Tingnan ang lahat ng 100+ tools →" },
    workspace: { selectFile: "Pumili ng File", processing: "Pinoproseso sa device mo...", download: "I-download ang File", changeFile: "Palitan ang File", error: "May naganap na error habang pinoproseso ang file.", freeNotice: "100% Libre · Walang upload ng file · Walang account" }
  },

  // 36. Japanese
  ja: {
    nav: { allTools: "すべてのツール", compress: "圧縮", convert: "変換", merge: "結合", image: "画像", organize: "ページ整理", searchPlaceholder: "100以上のツールを検索..." },
    trust: { badge1: "ブラウザ完結のローカル処理", badge2: "サーバー処理後すぐに完全自動削除", badge3: "会員登録・ログイン不要", badge4: "100% 安全＆完全プライベート" },
    homepage: { heroTitle: "ファイル操作を、もっと自由に。高速・安全・完全無料。", heroSubtitle: "PDF、画像、Office文書、音声、動画の変換・圧縮・編集・整理をブラウザ上で安全に実行。", dropzoneTitle: "ファイルをドロップして開始", dropzoneSubtitle: "またはクリックして端末から選択", popularTools: "人気のツール", viewAll: "100種類以上のツールを見る →" },
    workspace: { selectFile: "ファイルを選択", processing: "端末内で処理中...", download: "ファイルをダウンロード", changeFile: "ファイルを変更", error: "処理中にエラーが発生しました。", freeNotice: "完全無料 · サーバー送信なし · アカウント登録不要" }
  },

  // 37. Korean
  ko: {
    nav: { allTools: "모든 도구", compress: "압축", convert: "변환", merge: "병합", image: "이미지", organize: "정리", searchPlaceholder: "100개 이상의 도구 검색..." },
    trust: { badge1: "브라우저 기반 로컬 처리", badge2: "서버 처리 후 자동 완전 삭제", badge3: "회원가입 필요 없음", badge4: "100% 안전 및 개인정보 보호" },
    homepage: { heroTitle: "원하는 방식으로 파일 처리. 빠르고, 안전하며, 무료입니다.", heroSubtitle: "PDF, 이미지, Office 문서, 오디오, 비디오를 브라우저에서 직접 변환, 압축, 편집, 정리하세요.", dropzoneTitle: "파일을 여기에 끌어다 놓으세요", dropzoneSubtitle: "또는 클릭하여 기기에서 파일 선택", popularTools: "인기 도구", viewAll: "100개 이상의 모든 도구 보기 →" },
    workspace: { selectFile: "파일 선택", processing: "기기 내에서 로컬 처리 중...", download: "파일 다운로드", changeFile: "파일 변경", error: "파일 처리 중 오류가 발생했습니다.", freeNotice: "100% 무료 · 파일 서버 업로드 없음 · 계정 필요 없음" }
  },

  // 38. Chinese (Simplified)
  "zh-CN": {
    nav: { allTools: "所有工具", compress: "压缩", convert: "转换", merge: "合并", image: "图片", organize: "页面管理", searchPlaceholder: "搜索 100+ 实用工具..." },
    trust: { badge1: "浏览器本地极速处理", badge2: "服务器临时文件自动销毁", badge3: "完全无需注册登录", badge4: "100% 隐私与数据安全" },
    homepage: { heroTitle: "文件处理，随心所欲。极速、私密、完全免费。", heroSubtitle: "直接在浏览器中转换、压缩、编辑和整理 PDF、图片、Office 文档、音频与视频文件。", dropzoneTitle: "将文件拖放到此处即可开始", dropzoneSubtitle: "或点击选择本地设备文件", popularTools: "常用热门工具", viewAll: "探索全部 100+ 工具 →" },
    workspace: { selectFile: "选择文件", processing: "正在本地处理...", download: "下载处理完成的文件", changeFile: "更换文件", error: "处理文件时出现错误。", freeNotice: "100% 免费 · 无需上传云端 · 无需注册账号" }
  },

  // 39. Chinese (Traditional)
  "zh-TW": {
    nav: { allTools: "所有工具", compress: "壓縮", convert: "轉換", merge: "合併", image: "圖片", organize: "頁面管理", searchPlaceholder: "搜尋 100+ 款線上工具..." },
    trust: { badge1: "瀏覽器本機極速處理", badge2: "伺服器處理後自動立即銷毀", badge3: "完全無需註冊或登入", badge4: "100% 隱私與安全保障" },
    homepage: { heroTitle: "檔案處理，隨心所欲。快速、私密、完全免費。", heroSubtitle: "直接在瀏覽器中轉換、壓縮、編輯與整理 PDF、圖片、Office 文件、音訊與影片檔案。", dropzoneTitle: "將檔案拖曳至此處開始", dropzoneSubtitle: "或點擊選擇本機裝置檔案", popularTools: "熱門推薦工具", viewAll: "探索全部 100+ 工具 →" },
    workspace: { selectFile: "選取檔案", processing: "正在本機快速處理...", download: "下載處理後的檔案", changeFile: "更換檔案", error: "處理檔案時發生錯誤。", freeNotice: "100% 免費 · 零檔案上傳 · 無需註冊帳號" }
  }
};
