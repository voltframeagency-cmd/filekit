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
  en: {
    nav: {
      allTools: "All Tools",
      compress: "Compress",
      convert: "Convert",
      merge: "Merge",
      image: "Image",
      organize: "Organize",
      searchPlaceholder: "Search 100+ tools..."
    },
    trust: {
      badge1: "Browser-first processing",
      badge2: "Automatic deletion after server jobs",
      badge3: "No account required",
      badge4: "100% Private & Secure"
    },
    homepage: {
      heroTitle: "Files on your terms. Private, instant, free.",
      heroSubtitle: "Convert, compress, edit, and organize PDFs, images, Office documents, audio, and video directly in your browser.",
      dropzoneTitle: "Drop a file anywhere to get started",
      dropzoneSubtitle: "or click to browse files from your device",
      popularTools: "Popular Tools",
      viewAll: "Explore all 100+ tools →"
    },
    workspace: {
      selectFile: "Select File",
      processing: "Processing locally...",
      download: "Download File",
      changeFile: "Change File",
      error: "An error occurred while processing your file.",
      freeNotice: "100% Free · Zero File Uploads · No Account Needed"
    }
  },
  es: {
    nav: {
      allTools: "Todas las herramientas",
      compress: "Comprimir",
      convert: "Convertir",
      merge: "Unir",
      image: "Imagen",
      organize: "Organizar",
      searchPlaceholder: "Buscar más de 100 herramientas..."
    },
    trust: {
      badge1: "Procesamiento en el navegador",
      badge2: "Eliminación automática en el servidor",
      badge3: "Sin necesidad de registro",
      badge4: "100% Privado y Seguro"
    },
    homepage: {
      heroTitle: "Archivos a tu manera. Privado, instantáneo, gratis.",
      heroSubtitle: "Convierte, comprime, edita y organiza PDFs, imágenes, Office, audio y video directamente en tu navegador.",
      dropzoneTitle: "Arrastra un archivo aquí para comenzar",
      dropzoneSubtitle: "o haz clic para explorar tus archivos",
      popularTools: "Herramientas Populares",
      viewAll: "Explorar más de 100 herramientas →"
    },
    workspace: {
      selectFile: "Seleccionar Archivo",
      processing: "Procesando localmente...",
      download: "Descargar Archivo",
      changeFile: "Cambiar Archivo",
      error: "Ocurrió un error al procesar el archivo.",
      freeNotice: "100% Gratis · Sin subir archivos al servidor · Sin registro"
    }
  },
  de: {
    nav: {
      allTools: "Alle Werkzeuge",
      compress: "Komprimieren",
      convert: "Konvertieren",
      merge: "Zusammenfügen",
      image: "Bild",
      organize: "Organisieren",
      searchPlaceholder: "Über 100 Werkzeuge durchsuchen..."
    },
    trust: {
      badge1: "Direkt im Browser verarbeitet",
      badge2: "Automatische Serverlöschung",
      badge3: "Kein Konto erforderlich",
      badge4: "100% Privat & DSGVO-konform"
    },
    homepage: {
      heroTitle: "Dateien nach Ihren Regeln. Privat, sofort, kostenlos.",
      heroSubtitle: "PDFs, Bilder, Office-Dokumente, Audio und Video direkt im Browser konvertieren, komprimieren und bearbeiten.",
      dropzoneTitle: "Datei hier ablegen, um zu beginnen",
      dropzoneSubtitle: "oder klicken, um Datei auszuwählen",
      popularTools: "Beliebte Werkzeuge",
      viewAll: "Alle 100+ Werkzeuge ansehen →"
    },
    workspace: {
      selectFile: "Datei auswählen",
      processing: "Lokal verarbeiten...",
      download: "Datei herunterladen",
      changeFile: "Datei ändern",
      error: "Beim Verarbeiten der Datei ist ein Fehler aufgetreten.",
      freeNotice: "100% Kostenlos · Kein Datei-Upload · Ohne Registrierung"
    }
  },
  fr: {
    nav: {
      allTools: "Tous les outils",
      compress: "Compresser",
      convert: "Convertir",
      merge: "Fusionner",
      image: "Image",
      organize: "Organiser",
      searchPlaceholder: "Rechercher parmi 100+ outils..."
    },
    trust: {
      badge1: "Traitement local dans le navigateur",
      badge2: "Suppression automatique sur serveur",
      badge3: "Sans création de compte",
      badge4: "100% Privé et Sécurisé"
    },
    homepage: {
      heroTitle: "Vos fichiers en toute liberté. Privé, instantané, gratuit.",
      heroSubtitle: "Convertissez, compressez, éditez et organisez vos PDF, images, documents Office, audio et vidéo dans votre navigateur.",
      dropzoneTitle: "Déposez un fichier ici pour commencer",
      dropzoneSubtitle: "ou cliquez pour choisir un fichier",
      popularTools: "Outils populaires",
      viewAll: "Voir les 100+ outils →"
    },
    workspace: {
      selectFile: "Choisir un fichier",
      processing: "Traitement local en cours...",
      download: "Télécharger le fichier",
      changeFile: "Changer de fichier",
      error: "Une erreur est survenue lors du traitement du fichier.",
      freeNotice: "100% Gratuit · Zéro transfert serveur · Sans inscription"
    }
  },
  pt: {
    nav: {
      allTools: "Todas as ferramentas",
      compress: "Comprimir",
      convert: "Converter",
      merge: "Juntar",
      image: "Imagem",
      organize: "Organizar",
      searchPlaceholder: "Buscar mais de 100 ferramentas..."
    },
    trust: {
      badge1: "Processamento direto no navegador",
      badge2: "Exclusão automática do servidor",
      badge3: "Sem necessidade de cadastro",
      badge4: "100% Privado e Seguro"
    },
    homepage: {
      heroTitle: "Seus arquivos do seu jeito. Privado, rápido e grátis.",
      heroSubtitle: "Converta, comprima, edite e organize PDFs, imagens, Office, áudio e vídeo direto no seu navegador.",
      dropzoneTitle: "Arraste um arquivo aqui para começar",
      dropzoneSubtitle: "ou clique para selecionar do dispositivo",
      popularTools: "Ferramentas Populares",
      viewAll: "Explorar mais de 100 ferramentas →"
    },
    workspace: {
      selectFile: "Selecionar Arquivo",
      processing: "Processando localmente...",
      download: "Baixar Arquivo",
      changeFile: "Trocar Arquivo",
      error: "Ocorreu um erro ao processar o arquivo.",
      freeNotice: "100% Grátis · Sem envio para servidor · Sem cadastro"
    }
  },
  it: {
    nav: {
      allTools: "Tutti gli strumenti",
      compress: "Comprimi",
      convert: "Converti",
      merge: "Unisci",
      image: "Immagine",
      organize: "Organizza",
      searchPlaceholder: "Cerca tra oltre 100 strumenti..."
    },
    trust: {
      badge1: "Elaborazione nel browser",
      badge2: "Cancellazione automatica dal server",
      badge3: "Nessuna registrazione richiesta",
      badge4: "100% Privato e Sicuro"
    },
    homepage: {
      heroTitle: "I tuoi file, alle tue condizioni. Privato, istantaneo, gratis.",
      heroSubtitle: "Converti, comprimi, modifica e organizza PDF, immagini, file Office, audio e video direttamente nel tuo browser.",
      dropzoneTitle: "Trascina un file qui per iniziare",
      dropzoneSubtitle: "oppure fai clic per selezionare un file",
      popularTools: "Strumenti popolari",
      viewAll: "Scopri tutti gli oltre 100 strumenti →"
    },
    workspace: {
      selectFile: "Seleziona File",
      processing: "Elaborazione locale in corso...",
      download: "Scarica File",
      changeFile: "Cambia File",
      error: "Si è verificato un errore durante l'elaborazione del file.",
      freeNotice: "100% Gratis · Zero caricamenti sul server · Senza account"
    }
  },
  sv: {
    nav: {
      allTools: "Alla verktyg",
      compress: "Komprimera",
      convert: "Konvertera",
      merge: "Slå samman",
      image: "Bild",
      organize: "Organisera",
      searchPlaceholder: "Sök bland 100+ verktyg..."
    },
    trust: {
      badge1: "Körs direkt i webbläsaren",
      badge2: "Automatisk radering från server",
      badge3: "Inget konto krävs",
      badge4: "100% Privat och säkert"
    },
    homepage: {
      heroTitle: "Filer på dina villkor. Privat, blixtsnabbt och gratis.",
      heroSubtitle: "Konvertera, komprimera, redigera och organisera PDF-filer, bilder, Office-dokument, ljud och video direkt i webbläsaren.",
      dropzoneTitle: "Släpp en fil här för att börja",
      dropzoneSubtitle: "eller klicka för att välja från enheten",
      popularTools: "Populära verktyg",
      viewAll: "Utforska alla 100+ verktyg →"
    },
    workspace: {
      selectFile: "Välj fil",
      processing: "Bearbetar lokalt...",
      download: "Ladda ner fil",
      changeFile: "Byt fil",
      error: "Ett fel uppstod vid bearbetning av filen.",
      freeNotice: "100% Gratis · Inga filer laddas upp · Inget konto krävs"
    }
  }
};
