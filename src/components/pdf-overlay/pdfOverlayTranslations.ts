// Complete 39-locale dictionary for PDF Overlay & Watermark Workspace (PdfWatermarkControls, PdfOverlayWorkspace, PdfOverlayResultCard)
import { SupportedLocale } from "@/config/i18n/locales";

export interface PdfOverlayI18nEntry {
  // Dropzone & Workspace
  dropHere: string;
  pdfOnlyNotice: string;
  selectPdfFile: string;
  readingPdf: string;
  cancelProcessing: string;
  livePlacementPreview: string;

  // Watermark Type
  watermarkType: string;
  textWatermark: string;
  imageLogo: string;

  // Validation
  uploadLogoPrompt: string;
  invalidImageFormat: string;
  enterWatermarkText: string;
  unsupportedWinAnsi: string;

  // Text Controls
  watermarkText: string;
  textPlaceholder: string;
  fontColor: string;
  fontSize: (pt: number) => string;

  // Image Controls
  selectLogoFile: string;

  // Sliders
  opacity: (pct: number) => string;
  rotation: (deg: number) => string;

  // Position Presets
  positionPreset: string;
  posTopLeft: string;
  posCenter: string;
  posTopRight: string;
  posBottomLeft: string;
  posTileGrid: string;
  posBottomRight: string;
  posCustom: string;
  customX: string;
  customY: string;

  // Target Pages
  applyToPages: string;
  allPages: string;
  oddPagesOnly: string;
  evenPagesOnly: string;
  customRange: string;
  customRangePlaceholder: string;

  // CTA Buttons
  applyWatermark: string;
  applyingWatermark: string;
  reset: string;

  // Result Card
  digitalSignatureNotice: string;
  signatureWarning: string;
  verifiedBadge: string;
  watermarkSuccessSummary: (pages: number) => string;
  downloadWatermarkedPdf: string;
  adjustWatermark: string;
  startOver: string;
}

export const PDF_OVERLAY_I18N: Record<string, PdfOverlayI18nEntry> = {
  en: {
    dropHere: "Drop your PDF here",
    pdfOnlyNotice: "or click to browse from your computer (Up to 100 MB)",
    selectPdfFile: "Select PDF File",
    readingPdf: "Reading PDF document...",
    cancelProcessing: "Cancel Processing",
    livePlacementPreview: "Live Placement Preview",

    watermarkType: "Watermark Type",
    textWatermark: "Text Watermark",
    imageLogo: "Image Logo",

    uploadLogoPrompt: "Please upload a PNG or JPG logo image.",
    invalidImageFormat: "Watermark file must be a valid PNG or JPEG image.",
    enterWatermarkText: "Please enter watermark text.",
    unsupportedWinAnsi: "Text contains characters not supported by standard PDF fonts.",

    watermarkText: "Watermark Text",
    textPlaceholder: "e.g. DRAFT / CONFIDENTIAL",
    fontColor: "Font Color",
    fontSize: (pt) => `Font Size (${pt} pt)`,

    selectLogoFile: "Select Logo Image (PNG / JPEG)",

    opacity: (pct) => `Opacity (${pct}%)`,
    rotation: (deg) => `Rotation (${deg}°)`,

    positionPreset: "Position Preset",
    posTopLeft: "Top Left",
    posCenter: "Center",
    posTopRight: "Top Right",
    posBottomLeft: "Bottom Left",
    posTileGrid: "Tile Grid",
    posBottomRight: "Bottom Right",
    posCustom: "Custom X/Y",
    customX: "Custom X (pt)",
    customY: "Custom Y (pt)",

    applyToPages: "Apply To Pages",
    allPages: "All Pages",
    oddPagesOnly: "Odd Pages Only",
    evenPagesOnly: "Even Pages Only",
    customRange: "Custom Range",
    customRangePlaceholder: "e.g. 1-3, 5",

    applyWatermark: "Apply Watermark",
    applyingWatermark: "Applying Watermark...",
    reset: "Reset",

    digitalSignatureNotice: "Digital Signature Notice",
    signatureWarning: "Potential digital signature detected which will be invalidated by page modifications.",
    verifiedBadge: "Dual-Reload Verified",
    watermarkSuccessSummary: (pages) => `Watermarked ${pages} page${pages !== 1 ? "s" : ""} • Processed 100% off-thread via Web Worker`,
    downloadWatermarkedPdf: "Download Watermarked PDF",
    adjustWatermark: "Adjust Watermark",
    startOver: "Start Over"
  },
  es: {
    dropHere: "Suelta tu PDF aquí",
    pdfOnlyNotice: "o haz clic para buscar en tu dispositivo (Hasta 100 MB)",
    selectPdfFile: "Seleccionar archivo PDF",
    readingPdf: "Leyendo documento PDF...",
    cancelProcessing: "Cancelar procesamiento",
    livePlacementPreview: "Vista previa de posición",

    watermarkType: "Tipo de marca de agua",
    textWatermark: "Marca de agua de texto",
    imageLogo: "Logotipo o imagen",

    uploadLogoPrompt: "Sube una imagen de logotipo PNG o JPG.",
    invalidImageFormat: "El archivo debe ser una imagen PNG o JPEG válida.",
    enterWatermarkText: "Introduce el texto de la marca de agua.",
    unsupportedWinAnsi: "El texto contiene caracteres no compatibles con fuentes PDF estándar.",

    watermarkText: "Texto de la marca de agua",
    textPlaceholder: "ej. BORRADOR / CONFIDENCIAL",
    fontColor: "Color de fuente",
    fontSize: (pt) => `Tamaño de fuente (${pt} pt)`,

    selectLogoFile: "Seleccionar imagen de logotipo (PNG / JPEG)",

    opacity: (pct) => `Opacidad (${pct}%)`,
    rotation: (deg) => `Rotación (${deg}°)`,

    positionPreset: "Preajuste de posición",
    posTopLeft: "Arriba izquierda",
    posCenter: "Centro",
    posTopRight: "Arriba derecha",
    posBottomLeft: "Abajo izquierda",
    posTileGrid: "Cuadrícula mosaico",
    posBottomRight: "Abajo derecha",
    posCustom: "Coordenadas personalizadas",
    customX: "X personalizado (pt)",
    customY: "Y personalizado (pt)",

    applyToPages: "Aplicar a páginas",
    allPages: "Todas las páginas",
    oddPagesOnly: "Solo páginas impares",
    evenPagesOnly: "Solo páginas pares",
    customRange: "Rango personalizado",
    customRangePlaceholder: "ej. 1-3, 5",

    applyWatermark: "Aplicar marca de agua",
    applyingWatermark: "Aplicando marca de agua...",
    reset: "Reiniciar",

    digitalSignatureNotice: "Aviso de firma digital",
    signatureWarning: "Se detectó una firma digital que se invalidará al modificar páginas.",
    verifiedBadge: "Verificación doble completada",
    watermarkSuccessSummary: (pages) => `Marca de agua aplicada en ${pages} página${pages !== 1 ? "s" : ""} • Procesado 100% en Web Worker`,
    downloadWatermarkedPdf: "Descargar PDF con marca de agua",
    adjustWatermark: "Ajustar marca de agua",
    startOver: "Reiniciar"
  },
  "es-419": {
    dropHere: "Suelta tu archivo PDF aquí",
    pdfOnlyNotice: "o haz clic para buscar en tu dispositivo (Hasta 100 MB)",
    selectPdfFile: "Elegir archivo PDF",
    readingPdf: "Leyendo documento PDF...",
    cancelProcessing: "Cancelar proceso",
    livePlacementPreview: "Vista previa en vivo",

    watermarkType: "Tipo de marca de agua",
    textWatermark: "Marca de agua de texto",
    imageLogo: "Logo o imagen",

    uploadLogoPrompt: "Sube un archivo PNG o JPG para el logo.",
    invalidImageFormat: "El archivo debe ser una imagen PNG o JPEG válida.",
    enterWatermarkText: "Ingresa el texto de la marca de agua.",
    unsupportedWinAnsi: "El texto contiene caracteres no compatibles.",

    watermarkText: "Texto de la marca de agua",
    textPlaceholder: "ej. BORRADOR / CONFIDENCIAL",
    fontColor: "Color de fuente",
    fontSize: (pt) => `Tamaño de letra (${pt} pt)`,

    selectLogoFile: "Seleccionar logo (PNG / JPEG)",

    opacity: (pct) => `Opacidad (${pct}%)`,
    rotation: (deg) => `Rotación (${deg}°)`,

    positionPreset: "Posición",
    posTopLeft: "Superior izquierda",
    posCenter: "Centro",
    posTopRight: "Superior derecha",
    posBottomLeft: "Inferior izquierda",
    posTileGrid: "Mosaico repetido",
    posBottomRight: "Inferior derecha",
    posCustom: "Coordenadas X/Y",
    customX: "X personalizado (pt)",
    customY: "Y personalizado (pt)",

    applyToPages: "Aplicar en páginas",
    allPages: "Todas las páginas",
    oddPagesOnly: "Solo impares",
    evenPagesOnly: "Solo pares",
    customRange: "Rango personalizado",
    customRangePlaceholder: "ej. 1-3, 5",

    applyWatermark: "Aplicar marca de agua",
    applyingWatermark: "Aplicando marca de agua...",
    reset: "Reiniciar",

    digitalSignatureNotice: "Aviso de firma digital",
    signatureWarning: "Se detectó una firma digital que se invalidará al modificar páginas.",
    verifiedBadge: "Verificación doble completada",
    watermarkSuccessSummary: (pages) => `Marca de agua aplicada en ${pages} página${pages !== 1 ? "s" : ""} • 100% en Web Worker`,
    downloadWatermarkedPdf: "Descargar PDF con marca",
    adjustWatermark: "Ajustar marca",
    startOver: "Comenzar de nuevo"
  },
  de: {
    dropHere: "PDF-Datei hier ablegen",
    pdfOnlyNotice: "oder klicken, um vom Computer auszuwählen (bis zu 100 MB)",
    selectPdfFile: "PDF-Datei auswählen",
    readingPdf: "PDF-Dokument wird gelesen...",
    cancelProcessing: "Verarbeitung abbrechen",
    livePlacementPreview: "Live-Positionsvorschau",

    watermarkType: "Wasserzeichen-Typ",
    textWatermark: "Text-Wasserzeichen",
    imageLogo: "Bild-Logo",

    uploadLogoPrompt: "Bitte laden Sie ein PNG- oder JPG-Logo hoch.",
    invalidImageFormat: "Die Datei muss ein gültiges PNG- oder JPEG-Bild sein.",
    enterWatermarkText: "Bitte geben Sie den Wasserzeichentext ein.",
    unsupportedWinAnsi: "Der Text enthält Zeichen, die von Standard-PDF-Schriftarten nicht unterstützt werden.",

    watermarkText: "Wasserzeichen-Text",
    textPlaceholder: "z.B. ENTWURF / VERTRAULICH",
    fontColor: "Schriftfarbe",
    fontSize: (pt) => `Schriftgröße (${pt} pt)`,

    selectLogoFile: "Logo-Bild auswählen (PNG / JPEG)",

    opacity: (pct) => `Deckkraft (${pct}%)`,
    rotation: (deg) => `Drehung (${deg}°)`,

    positionPreset: "Position",
    posTopLeft: "Oben links",
    posCenter: "Zentriert",
    posTopRight: "Oben rechts",
    posBottomLeft: "Unten links",
    posTileGrid: "Kachelgitter",
    posBottomRight: "Unten rechts",
    posCustom: "Benutzerdefinierte Koordinaten",
    customX: "Benutzerdefiniert X (pt)",
    customY: "Benutzerdefiniert Y (pt)",

    applyToPages: "Auf Seiten anwenden",
    allPages: "Alle Seiten",
    oddPagesOnly: "Nur ungerade Seiten",
    evenPagesOnly: "Nur gerade Seiten",
    customRange: "Eigener Bereich",
    customRangePlaceholder: "z.B. 1-3, 5",

    applyWatermark: "Wasserzeichen anwenden",
    applyingWatermark: "Wasserzeichen wird angewendet...",
    reset: "Zurücksetzen",

    digitalSignatureNotice: "Hinweis zu digitalen Signaturen",
    signatureWarning: "Mögliche digitale Signatur erkannt, die durch Seitenänderungen ungültig wird.",
    verifiedBadge: "Zweifach verifiziert",
    watermarkSuccessSummary: (pages) => `Wasserzeichen auf ${pages} Seite${pages !== 1 ? "n" : ""} angewendet • 100% im Web Worker verarbeitet`,
    downloadWatermarkedPdf: "PDF mit Wasserzeichen herunterladen",
    adjustWatermark: "Wasserzeichen anpassen",
    startOver: "Neu starten"
  },
  fr: {
    dropHere: "Déposez votre fichier PDF ici",
    pdfOnlyNotice: "ou cliquez pour parcourir vos fichiers (Jusqu'à 100 Mo)",
    selectPdfFile: "Sélectionner un fichier PDF",
    readingPdf: "Lecture du document PDF en cours...",
    cancelProcessing: "Annuler le traitement",
    livePlacementPreview: "Aperçu en direct",

    watermarkType: "Type de filigrane",
    textWatermark: "Filigrane textuel",
    imageLogo: "Logo ou image",

    uploadLogoPrompt: "Veuillez téléverser un logo PNG ou JPG.",
    invalidImageFormat: "Le fichier doit être une image PNG ou JPEG valide.",
    enterWatermarkText: "Veuillez saisir le texte du filigrane.",
    unsupportedWinAnsi: "Le texte contient des caractères non pris en charge par les polices PDF standard.",

    watermarkText: "Texte du filigrane",
    textPlaceholder: "ex. BROUILLON / CONFIDENTIEL",
    fontColor: "Couleur du texte",
    fontSize: (pt) => `Taille de police (${pt} pt)`,

    selectLogoFile: "Choisir l'image du logo (PNG / JPEG)",

    opacity: (pct) => `Opacité (${pct}%)`,
    rotation: (deg) => `Rotation (${deg}°)`,

    positionPreset: "Position",
    posTopLeft: "Haut gauche",
    posCenter: "Centre",
    posTopRight: "Haut droite",
    posBottomLeft: "Bas gauche",
    posTileGrid: "Mosaïque répétée",
    posBottomRight: "Bas droite",
    posCustom: "Coordonnées personnalisées",
    customX: "X personnalisé (pt)",
    customY: "Y personnalisé (pt)",

    applyToPages: "Appliquer aux pages",
    allPages: "Toutes les pages",
    oddPagesOnly: "Pages impaires uniquement",
    evenPagesOnly: "Pages paires uniquement",
    customRange: "Plage personnalisée",
    customRangePlaceholder: "ex. 1-3, 5",

    applyWatermark: "Appliquer le filigrane",
    applyingWatermark: "Application du filigrane...",
    reset: "Réinitialiser",

    digitalSignatureNotice: "Avis relatif à la signature numérique",
    signatureWarning: "Signature numérique détectée qui sera invalidée par les modifications.",
    verifiedBadge: "Vérification double réussie",
    watermarkSuccessSummary: (pages) => `Filigrane appliqué sur ${pages} page${pages !== 1 ? "s" : ""} • Traitement 100% via Web Worker`,
    downloadWatermarkedPdf: "Télécharger le PDF avec filigrane",
    adjustWatermark: "Ajuster le filigrane",
    startOver: "Recommencer"
  },
  pt: {
    dropHere: "Arraste o seu PDF para aqui",
    pdfOnlyNotice: "ou clique para escolher do dispositivo (Até 100 MB)",
    selectPdfFile: "Selecionar ficheiro PDF",
    readingPdf: "A ler o documento PDF...",
    cancelProcessing: "Cancelar processamento",
    livePlacementPreview: "Pré-visualização da posição",

    watermarkType: "Tipo de marca de água",
    textWatermark: "Marca de água de texto",
    imageLogo: "Logótipo ou imagem",

    uploadLogoPrompt: "Carregue uma imagem de logótipo PNG ou JPG.",
    invalidImageFormat: "O ficheiro deve ser uma imagem PNG ou JPEG válida.",
    enterWatermarkText: "Introduza o texto da marca de água.",
    unsupportedWinAnsi: "O texto contém carateres não suportados pelas fontes PDF padrão.",

    watermarkText: "Texto da marca de água",
    textPlaceholder: "ex. RASCUNHO / CONFIDENCIAL",
    fontColor: "Cor do tipo de letra",
    fontSize: (pt) => `Tamanho do tipo de letra (${pt} pt)`,

    selectLogoFile: "Selecionar logótipo (PNG / JPEG)",

    opacity: (pct) => `Opacidade (${pct}%)`,
    rotation: (deg) => `Rotação (${deg}°)`,

    positionPreset: "Predefinição de posição",
    posTopLeft: "Superior esquerdo",
    posCenter: "Centro",
    posTopRight: "Superior direito",
    posBottomLeft: "Inferior esquerdo",
    posTileGrid: "Grelha em mosaico",
    posBottomRight: "Inferior direito",
    posCustom: "Coordenadas personalizadas",
    customX: "X personalizado (pt)",
    customY: "Y personalizado (pt)",

    applyToPages: "Aplicar às páginas",
    allPages: "Todas as páginas",
    oddPagesOnly: "Apenas páginas ímpares",
    evenPagesOnly: "Apenas páginas pares",
    customRange: "Intervalo personalizado",
    customRangePlaceholder: "ex. 1-3, 5",

    applyWatermark: "Aplicar marca de água",
    applyingWatermark: "A aplicar marca de água...",
    reset: "Repor",

    digitalSignatureNotice: "Aviso de assinatura digital",
    signatureWarning: "Foi detetada uma assinatura digital que será invalidada com as alterações.",
    verifiedBadge: "Verificação dupla concluída",
    watermarkSuccessSummary: (pages) => `Marca de água aplicada em ${pages} página${pages !== 1 ? "s" : ""} • Processado 100% no Web Worker`,
    downloadWatermarkedPdf: "Descarregar PDF com marca de água",
    adjustWatermark: "Ajustar marca de água",
    startOver: "Começar de novo"
  },
  "pt-BR": {
    dropHere: "Arraste seu PDF para cá",
    pdfOnlyNotice: "ou clique para escolher do seu dispositivo (Até 100 MB)",
    selectPdfFile: "Selecionar arquivo PDF",
    readingPdf: "Lendo documento PDF...",
    cancelProcessing: "Cancelar processamento",
    livePlacementPreview: "Prévia de posicionamento",

    watermarkType: "Tipo de marca d'água",
    textWatermark: "Marca d'água em texto",
    imageLogo: "Logo ou imagem",

    uploadLogoPrompt: "Envie uma imagem de logo PNG ou JPG.",
    invalidImageFormat: "O arquivo deve ser uma imagem PNG ou JPEG válida.",
    enterWatermarkText: "Digite o texto da marca d'água.",
    unsupportedWinAnsi: "O texto contém caracteres não suportados por fontes PDF padrão.",

    watermarkText: "Texto da marca d'água",
    textPlaceholder: "ex: RASCUNHO / CONFIDENCIAL",
    fontColor: "Cor da fonte",
    fontSize: (pt) => `Tamanho da fonte (${pt} pt)`,

    selectLogoFile: "Selecionar imagem de logo (PNG / JPEG)",

    opacity: (pct) => `Opacidade (${pct}%)`,
    rotation: (deg) => `Rotação (${deg}°)`,

    positionPreset: "Posição",
    posTopLeft: "Superior esquerdo",
    posCenter: "Centro",
    posTopRight: "Superior direito",
    posBottomLeft: "Inferior esquerdo",
    posTileGrid: "Grade lado a lado",
    posBottomRight: "Inferior direito",
    posCustom: "Coordenadas X/Y",
    customX: "X personalizado (pt)",
    customY: "Y personalizado (pt)",

    applyToPages: "Aplicar nas páginas",
    allPages: "Todas as páginas",
    oddPagesOnly: "Apenas páginas ímpares",
    evenPagesOnly: "Apenas páginas pares",
    customRange: "Intervalo personalizado",
    customRangePlaceholder: "ex: 1-3, 5",

    applyWatermark: "Aplicar marca d'água",
    applyingWatermark: "Aplicando marca d'água...",
    reset: "Redefinir",

    digitalSignatureNotice: "Aviso de assinatura digital",
    signatureWarning: "Assinatura digital detectada que será invalidada por alterações nas páginas.",
    verifiedBadge: "Verificação dupla concluída",
    watermarkSuccessSummary: (pages) => `Marca d'água aplicada em ${pages} página${pages !== 1 ? "s" : ""} • 100% via Web Worker`,
    downloadWatermarkedPdf: "Baixar PDF com marca d'água",
    adjustWatermark: "Ajustar marca d'água",
    startOver: "Começar de novo"
  },
  it: {
    dropHere: "Trascina qui il tuo PDF",
    pdfOnlyNotice: "oppure fai clic per sfogliare dal computer (Fino a 100 MB)",
    selectPdfFile: "Seleziona file PDF",
    readingPdf: "Lettura del documento PDF...",
    cancelProcessing: "Annulla elaborazione",
    livePlacementPreview: "Anteprima posizionamento",

    watermarkType: "Tipo di filigrana",
    textWatermark: "Filigrana di testo",
    imageLogo: "Logo o immagine",

    uploadLogoPrompt: "Carica un logo in formato PNG o JPG.",
    invalidImageFormat: "Il file deve essere un'immagine PNG o JPEG valida.",
    enterWatermarkText: "Inserisci il testo della filigrana.",
    unsupportedWinAnsi: "Il testo contiene caratteri non supportati dai font PDF standard.",

    watermarkText: "Testo della filigrana",
    textPlaceholder: "es. BOZZA / RISERVATO",
    fontColor: "Colore del testo",
    fontSize: (pt) => `Dimensione del carattere (${pt} pt)`,

    selectLogoFile: "Seleziona immagine logo (PNG / JPEG)",

    opacity: (pct) => `Opacità (${pct}%)`,
    rotation: (deg) => `Rotazione (${deg}°)`,

    positionPreset: "Posizione predefinita",
    posTopLeft: "In alto a sinistra",
    posCenter: "Al centro",
    posTopRight: "In alto a destra",
    posBottomLeft: "In basso a sinistra",
    posTileGrid: "Griglia affiancata",
    posBottomRight: "In basso a destra",
    posCustom: "Coordinate personalizzate",
    customX: "X personalizzata (pt)",
    customY: "Y personalizzata (pt)",

    applyToPages: "Applica alle pagine",
    allPages: "Tutte le pagine",
    oddPagesOnly: "Solo pagine dispari",
    evenPagesOnly: "Solo pagine pari",
    customRange: "Intervallo personalizzato",
    customRangePlaceholder: "es. 1-3, 5",

    applyWatermark: "Applica filigrana",
    applyingWatermark: "Applicazione filigrana...",
    reset: "Ripristina",

    digitalSignatureNotice: "Avviso firma digitale",
    signatureWarning: "Rilevata firma digitale che verrà invalidata dalla modifica delle pagine.",
    verifiedBadge: "Doppia verifica completata",
    watermarkSuccessSummary: (pages) => `Filigrana applicata su ${pages} pagin${pages !== 1 ? "e" : "a"} • 100% elaborato via Web Worker`,
    downloadWatermarkedPdf: "Scarica PDF con filigrana",
    adjustWatermark: "Regola filigrana",
    startOver: "Ricomincia"
  },
  nl: {
    dropHere: "Sleep je PDF hierheen",
    pdfOnlyNotice: "of klik om vanaf je apparaat te bladeren (Tot 100 MB)",
    selectPdfFile: "Selecteer PDF-bestand",
    readingPdf: "PDF-document lezen...",
    cancelProcessing: "Verwerking annuleren",
    livePlacementPreview: "Live plaatsingsvoorbeeld",

    watermarkType: "Type watermerk",
    textWatermark: "Tekstwatermerk",
    imageLogo: "Afbeeldingslogo",

    uploadLogoPrompt: "Upload een PNG- of JPG-logo.",
    invalidImageFormat: "Bestand moet een geldige PNG- of JPEG-afbeelding zijn.",
    enterWatermarkText: "Voer watermerktekst in.",
    unsupportedWinAnsi: "Tekst bevat tekens die niet worden ondersteund door standaard PDF-lettertypen.",

    watermarkText: "Watermerktekst",
    textPlaceholder: "bijv. CONCEPT / VERTROUWELIJK",
    fontColor: "Tekstkleur",
    fontSize: (pt) => `Lettergrootte (${pt} pt)`,

    selectLogoFile: "Selecteer logo (PNG / JPEG)",

    opacity: (pct) => `Dekking (${pct}%)`,
    rotation: (deg) => `Rotatie (${deg}°)`,

    positionPreset: "Positie",
    posTopLeft: "Linksboven",
    posCenter: "Midden",
    posTopRight: "Rechtsboven",
    posBottomLeft: "Linksonder",
    posTileGrid: "Tegelraster",
    posBottomRight: "Rechtsonder",
    posCustom: "Aangepaste coördinaten",
    customX: "Aangepast X (pt)",
    customY: "Aangepast Y (pt)",

    applyToPages: "Toepassen op pagina's",
    allPages: "Alle pagina's",
    oddPagesOnly: "Alleen oneven pagina's",
    evenPagesOnly: "Alleen even pagina's",
    customRange: "Aangepast bereik",
    customRangePlaceholder: "bijv. 1-3, 5",

    applyWatermark: "Watermerk toepassen",
    applyingWatermark: "Watermerk toepassen...",
    reset: "Herstellen",

    digitalSignatureNotice: "Digitale handtekening melding",
    signatureWarning: "Mogelijke digitale handtekening gedetecteerd die ongeldig wordt bij paginawijziging.",
    verifiedBadge: "Dubbele verificatie voltooid",
    watermarkSuccessSummary: (pages) => `Watermerk toegepast op ${pages} pagina('s) • 100% via Web Worker`,
    downloadWatermarkedPdf: "Download PDF met watermerk",
    adjustWatermark: "Watermerk aanpassen",
    startOver: "Opnieuw beginnen"
  },
  ca: {
    dropHere: "Arrossega el teu PDF aquí",
    pdfOnlyNotice: "o fes clic per triar-lo del dispositiu (Fins a 100 MB)",
    selectPdfFile: "Selecciona el fitxer PDF",
    readingPdf: "Llegint el document PDF...",
    cancelProcessing: "Cancel·la el processament",
    livePlacementPreview: "Vista prèvia de posició",

    watermarkType: "Tipus de marca d'aigua",
    textWatermark: "Marca d'aigua de text",
    imageLogo: "Logotip o imatge",

    uploadLogoPrompt: "Puja un logotip en PNG o JPG.",
    invalidImageFormat: "El fitxer ha de ser una imatge PNG o JPEG vàlida.",
    enterWatermarkText: "Introdueix el text de la marca d'aigua.",
    unsupportedWinAnsi: "El text conté caràcters no admesos pels tipus de lletra PDF estàndard.",

    watermarkText: "Text de la marca d'aigua",
    textPlaceholder: "ex. ESBORRANY / CONFIDENCIAL",
    fontColor: "Color de la lletra",
    fontSize: (pt) => `Mida de lletra (${pt} pt)`,

    selectLogoFile: "Selecciona imatge de logo (PNG / JPEG)",

    opacity: (pct) => `Opacitat (${pct}%)`,
    rotation: (deg) => `Rotació (${deg}°)`,

    positionPreset: "Posició",
    posTopLeft: "A dalt a l'esquerra",
    posCenter: "Al centre",
    posTopRight: "A dalt a la dreta",
    posBottomLeft: "A baix a l'esquerra",
    posTileGrid: "Quadrícula en mosaic",
    posBottomRight: "A baix a la dreta",
    posCustom: "Coordenades personalitzades",
    customX: "X personalitzat (pt)",
    customY: "Y personalitzat (pt)",

    applyToPages: "Aplica a pàgines",
    allPages: "Totes les pàgines",
    oddPagesOnly: "Només pàgines senars",
    evenPagesOnly: "Només pàgines parells",
    customRange: "Interval personalitzat",
    customRangePlaceholder: "ex. 1-3, 5",

    applyWatermark: "Aplica la marca d'aigua",
    applyingWatermark: "Aplicant la marca d'aigua...",
    reset: "Reinicia",

    digitalSignatureNotice: "Avís de signatura digital",
    signatureWarning: "S'ha detectat una signatura digital que s'invalidarà en modificar les pàgines.",
    verifiedBadge: "Doble verificació completada",
    watermarkSuccessSummary: (pages) => `Marca d'aigua aplicada a ${pages} pàgina${pages !== 1 ? "s" : ""} • 100% amb Web Worker`,
    downloadWatermarkedPdf: "Descarrega el PDF amb marca d'aigua",
    adjustWatermark: "Ajusta la marca d'aigua",
    startOver: "Torna a començar"
  },
  sv: {
    dropHere: "Släpp din PDF här",
    pdfOnlyNotice: "eller klicka för att välja från datorn (Upp till 100 MB)",
    selectPdfFile: "Välj PDF-fil",
    readingPdf: "Läser PDF-dokument...",
    cancelProcessing: "Avbryt bearbetning",
    livePlacementPreview: "Förhandsgranskning av placering",

    watermarkType: "Vattenmärkestyp",
    textWatermark: "Textvattenmärke",
    imageLogo: "Bildlogotyp",

    uploadLogoPrompt: "Ladda upp en PNG- eller JPG-logotyp.",
    invalidImageFormat: "Filen måste vara en giltig PNG- eller JPEG-bild.",
    enterWatermarkText: "Ange vattenmärkestext.",
    unsupportedWinAnsi: "Texten innehåller tecken som inte stöds av vanliga PDF-teckensnitt.",

    watermarkText: "Vattenmärkestext",
    textPlaceholder: "t.ex. UTKAST / KONFIDENTIELLT",
    fontColor: "Teckenfärg",
    fontSize: (pt) => `Teckenstorlek (${pt} pt)`,

    selectLogoFile: "Välj logotypbild (PNG / JPEG)",

    opacity: (pct) => `Opacitet (${pct}%)`,
    rotation: (deg) => `Rotation (${deg}°)`,

    positionPreset: "Placering",
    posTopLeft: "Överst till vänster",
    posCenter: "Centrerat",
    posTopRight: "Överst till höger",
    posBottomLeft: "Nederst till vänster",
    posTileGrid: "Rutnätsmönster",
    posBottomRight: "Nederst till höger",
    posCustom: "Anpassade koordinater",
    customX: "Anpassad X (pt)",
    customY: "Anpassad Y (pt)",

    applyToPages: "Tillämpa på sidor",
    allPages: "Alla sidor",
    oddPagesOnly: "Endast udda sidor",
    evenPagesOnly: "Endast jämna sidor",
    customRange: "Anpassat intervall",
    customRangePlaceholder: "t.ex. 1-3, 5",

    applyWatermark: "Lägg till vattenmärke",
    applyingWatermark: "Applicerar vattenmärke...",
    reset: "Återställ",

    digitalSignatureNotice: "Meddelande om digital signatur",
    signatureWarning: "Digital signatur identifierades som blir ogiltig vid sidändringar.",
    verifiedBadge: "Dubbelverifierad",
    watermarkSuccessSummary: (pages) => `Vattenmärke tillagt på ${pages} sid${pages !== 1 ? "or" : "a"} • Bearbetat 100% via Web Worker`,
    downloadWatermarkedPdf: "Ladda ner vattenmärkt PDF",
    adjustWatermark: "Justera vattenmärke",
    startOver: "Börja om"
  },
  da: {
    dropHere: "Slip din PDF her",
    pdfOnlyNotice: "eller klik for at vælge fra computeren (Op til 100 MB)",
    selectPdfFile: "Vælg PDF-fil",
    readingPdf: "Læser PDF-dokument...",
    cancelProcessing: "Annuller behandling",
    livePlacementPreview: "Live forhåndsvisning",

    watermarkType: "Vandmærketype",
    textWatermark: "Tekstvandmærke",
    imageLogo: "Billedlogo",

    uploadLogoPrompt: "Upload venligst et PNG- eller JPG-logo.",
    invalidImageFormat: "Filen skal være et gyldigt PNG- eller JPEG-billede.",
    enterWatermarkText: "Indtast venligst vandmærketekst.",
    unsupportedWinAnsi: "Teksten indeholder tegn, der ikke understøttes af standard PDF-skrifttyper.",

    watermarkText: "Vandmærketekst",
    textPlaceholder: "f.eks. UDKAST / FORTROLIGT",
    fontColor: "Skriftfarve",
    fontSize: (pt) => `Skriftstørrelse (${pt} pt)`,

    selectLogoFile: "Vælg logobillede (PNG / JPEG)",

    opacity: (pct) => `Uigennemsigtighed (${pct}%)`,
    rotation: (deg) => `Rotation (${deg}°)`,

    positionPreset: "Position",
    posTopLeft: "Øverst til venstre",
    posCenter: "Centreret",
    posTopRight: "Øverst til højre",
    posBottomLeft: "Nederst til venstre",
    posTileGrid: "Gitterfliser",
    posBottomRight: "Nederst til højre",
    posCustom: "Tilpassede koordinater",
    customX: "Tilpasset X (pt)",
    customY: "Tilpasset Y (pt)",

    applyToPages: "Anvend på sider",
    allPages: "Alle sider",
    oddPagesOnly: "Kun ulige sider",
    evenPagesOnly: "Kun lige sider",
    customRange: "Tilpasset område",
    customRangePlaceholder: "f.eks. 1-3, 5",

    applyWatermark: "Anvend vandmærke",
    applyingWatermark: "Anvender vandmærke...",
    reset: "Nulstil",

    digitalSignatureNotice: "Meddelelse om digital signatur",
    signatureWarning: "Digital signatur fundet, som vil blive ugyldiggjort af ændringer.",
    verifiedBadge: "Dobbeltverificeret",
    watermarkSuccessSummary: (pages) => `Vandmærke tilføjet til ${pages} side${pages !== 1 ? "r" : ""} • 100% via Web Worker`,
    downloadWatermarkedPdf: "Download PDF med vandmærke",
    adjustWatermark: "Juster vandmærke",
    startOver: "Start forfra"
  },
  fi: {
    dropHere: "Pudota PDF-tiedostosi tähän",
    pdfOnlyNotice: "tai selaa laitteestasi klikkaamalla (Enintään 100 Mt)",
    selectPdfFile: "Valitse PDF-tiedosto",
    readingPdf: "Luetaan PDF-asiakirjaa...",
    cancelProcessing: "Peruuta käsittely",
    livePlacementPreview: "Sijoittelun esikatselu",

    watermarkType: "Vesileiman tyyppi",
    textWatermark: "Tekstivesileima",
    imageLogo: "Kuvalogo",

    uploadLogoPrompt: "Lataa PNG- tai JPG-kuvalogo.",
    invalidImageFormat: "Tiedoston on oltava kelvollinen PNG- tai JPEG-kuva.",
    enterWatermarkText: "Kirjoita vesileiman teksti.",
    unsupportedWinAnsi: "Teksti sisältää merkkejä, joita standardit PDF-fontit eivät tue.",

    watermarkText: "Vesileiman teksti",
    textPlaceholder: "esim. LUONNOS / LUOTTAMUKSELLINEN",
    fontColor: "Fontin väri",
    fontSize: (pt) => `Fonttikoko (${pt} pt)`,

    selectLogoFile: "Valitse logokuva (PNG / JPEG)",

    opacity: (pct) => `Peittävyys (${pct}%)`,
    rotation: (deg) => `Kierto (${deg}°)`,

    positionPreset: "Sijaintiasetus",
    posTopLeft: "Ylävasen",
    posCenter: "Keskellä",
    posTopRight: "Yläoikea",
    posBottomLeft: "Alavasen",
    posTileGrid: "Ruudukko",
    posBottomRight: "Alaoikea",
    posCustom: "Mukautetut koordinaatit",
    customX: "Mukautettu X (pt)",
    customY: "Mukautettu Y (pt)",

    applyToPages: "Käytä sivuille",
    allPages: "Kaikki sivut",
    oddPagesOnly: "Vain parittomat sivut",
    evenPagesOnly: "Vain parilliset sivut",
    customRange: "Mukautettu sivuväli",
    customRangePlaceholder: "esim. 1-3, 5",

    applyWatermark: "Käytä vesileimaa",
    applyingWatermark: "Käytetään vesileimaa...",
    reset: "Palauta",

    digitalSignatureNotice: "Digitaalisen allekirjoituksen huomautus",
    signatureWarning: "Havaittu digitaalinen allekirjoitus, joka mitätöityy sivujen muokkaamisen myötä.",
    verifiedBadge: "Kaksoistarkistettu",
    watermarkSuccessSummary: (pages) => `Vesileima lisätty ${pages} sivulle • Käsitelty 100% Web Workerissa`,
    downloadWatermarkedPdf: "Lataa vesileimattu PDF",
    adjustWatermark: "Säädä vesileimaa",
    startOver: "Aloita alusta"
  },
  no: {
    dropHere: "Slipp PDF-filen her",
    pdfOnlyNotice: "eller klikk for å velge fra maskinen din (Opptil 100 MB)",
    selectPdfFile: "Velg PDF-fil",
    readingPdf: "Leser PDF-dokument...",
    cancelProcessing: "Avbryt behandling",
    livePlacementPreview: "Forhåndsvisning av plassering",

    watermarkType: "Vannmerketype",
    textWatermark: "Tekstvannmerke",
    imageLogo: "Bildelogo",

    uploadLogoPrompt: "Last opp en PNG- eller JPG-logo.",
    invalidImageFormat: "Filen må være et gyldig PNG- eller JPEG-bilde.",
    enterWatermarkText: "Vennligst skriv inn vannmerketekst.",
    unsupportedWinAnsi: "Teksten inneholder tegn som ikke støttes av standard PDF-fonter.",

    watermarkText: "Vannmerketekst",
    textPlaceholder: "f.eks. UTKAST / FORTROLIG",
    fontColor: "Skriftfarge",
    fontSize: (pt) => `Skriftstørrelse (${pt} pt)`,

    selectLogoFile: "Velg logobilde (PNG / JPEG)",

    opacity: (pct) => `Ugjennomsiktighet (${pct}%)`,
    rotation: (deg) => `Rotasjon (${deg}°)`,

    positionPreset: "Posisjon",
    posTopLeft: "Øverst til venstre",
    posCenter: "Senter",
    posTopRight: "Øverst til høyre",
    posBottomLeft: "Nederst til venstre",
    posTileGrid: "Rutenettmønster",
    posBottomRight: "Nederst til høyre",
    posCustom: "Egendefinerte koordinater",
    customX: "Egendefinert X (pt)",
    customY: "Egendefinert Y (pt)",

    applyToPages: "Bruk på sider",
    allPages: "Alle sider",
    oddPagesOnly: "Kun oddetallssider",
    evenPagesOnly: "Kun partallssider",
    customRange: "Egendefinert intervall",
    customRangePlaceholder: "f.eks. 1-3, 5",

    applyWatermark: "Bruk vannmerke",
    applyingWatermark: "Legger til vannmerke...",
    reset: "Tilbakestill",

    digitalSignatureNotice: "Varsel om digital signatur",
    signatureWarning: "Digital signatur oppdaget som vil bli ugyldiggjort ved endringer.",
    verifiedBadge: "Dobbeltverifisert",
    watermarkSuccessSummary: (pages) => `Vannmerke lagt til på ${pages} sid${pages !== 1 ? "er" : "e"} • Behandlet 100% via Web Worker`,
    downloadWatermarkedPdf: "Last ned vannmerket PDF",
    adjustWatermark: "Juster vannmerke",
    startOver: "Start på nytt"
  },
  pl: {
    dropHere: "Upuść plik PDF tutaj",
    pdfOnlyNotice: "lub kliknij, aby wybrać z komputera (do 100 MB)",
    selectPdfFile: "Wybierz plik PDF",
    readingPdf: "Odczytywanie dokumentu PDF...",
    cancelProcessing: "Anuluj przetwarzanie",
    livePlacementPreview: "Podgląd rozmieszczenia na żywo",

    watermarkType: "Typ znaku wodnego",
    textWatermark: "Tekstowy znak wodny",
    imageLogo: "Logo / Obraz",

    uploadLogoPrompt: "Prześlij plik logo w formacie PNG lub JPG.",
    invalidImageFormat: "Plik musi być prawidłowym obrazem PNG lub JPEG.",
    enterWatermarkText: "Wprowadź tekst znaku wodnego.",
    unsupportedWinAnsi: "Tekst zawiera znaki nieobsługiwane przez standardowe czcionki PDF.",

    watermarkText: "Tekst znaku wodnego",
    textPlaceholder: "np. PROJEKT / POUFNE",
    fontColor: "Kolor czcionki",
    fontSize: (pt) => `Rozmiar czcionki (${pt} pt)`,

    selectLogoFile: "Wybierz obraz logo (PNG / JPEG)",

    opacity: (pct) => `Krycie (${pct}%)`,
    rotation: (deg) => `Obrót (${deg}°)`,

    positionPreset: "Położenie",
    posTopLeft: "Góra lewo",
    posCenter: "Środek",
    posTopRight: "Góra prawo",
    posBottomLeft: "Dół lewo",
    posTileGrid: "Siatka kafelkowa",
    posBottomRight: "Dół prawo",
    posCustom: "Własne współrzędne",
    customX: "Własne X (pt)",
    customY: "Własne Y (pt)",

    applyToPages: "Zastosuj do stron",
    allPages: "Wszystkie strony",
    oddPagesOnly: "Tylko strony nieparzyste",
    evenPagesOnly: "Tylko strony parzyste",
    customRange: "Własny zakres",
    customRangePlaceholder: "np. 1-3, 5",

    applyWatermark: "Dodaj znak wodny",
    applyingWatermark: "Dodawanie znaku wodnego...",
    reset: "Resetuj",

    digitalSignatureNotice: "Uwaga o podpisie cyfrowym",
    signatureWarning: "Wykryto podpis cyfrowy, który zostanie unieważniony po modyfikacji stron.",
    verifiedBadge: "Podwójnie zweryfikowano",
    watermarkSuccessSummary: (pages) => `Znak wodny dodany do ${pages} stron • 100% lokalnie w Web Worker`,
    downloadWatermarkedPdf: "Pobierz PDF ze znakiem wodnym",
    adjustWatermark: "Dostosuj znak wodny",
    startOver: "Zacznij od nowa"
  },
  cs: {
    dropHere: "Sem přetáhněte svůj PDF soubor",
    pdfOnlyNotice: "nebo klikněte pro výběr z počítače (až 100 MB)",
    selectPdfFile: "Vybrat PDF soubor",
    readingPdf: "Načítání PDF dokumentu...",
    cancelProcessing: "Zrušit zpracování",
    livePlacementPreview: "Živý náhled umístění",

    watermarkType: "Typ vodoznaku",
    textWatermark: "Textový vodoznak",
    imageLogo: "Obrázek / Logo",

    uploadLogoPrompt: "Nahrajte logo ve formátu PNG nebo JPG.",
    invalidImageFormat: "Soubor musí být platný obrázek PNG nebo JPEG.",
    enterWatermarkText: "Zadejte text vodoznaku.",
    unsupportedWinAnsi: "Text obsahuje znaky nepodporované standardními fonty PDF.",

    watermarkText: "Text vodoznaku",
    textPlaceholder: "např. KONCEPT / DŮVĚRNÉ",
    fontColor: "Barva písma",
    fontSize: (pt) => `Velikost písma (${pt} pt)`,

    selectLogoFile: "Vybrat soubor loga (PNG / JPEG)",

    opacity: (pct) => `Průhlednost (${pct}%)`,
    rotation: (deg) => `Otočení (${deg}°)`,

    positionPreset: "Umístění",
    posTopLeft: "Nahoře vlevo",
    posCenter: "Uprostřed",
    posTopRight: "Nahoře vpravo",
    posBottomLeft: "Dole vlevo",
    posTileGrid: "Mřížka",
    posBottomRight: "Dole vpravo",
    posCustom: "Vlastní souřadnice",
    customX: "Vlastní X (pt)",
    customY: "Vlastní Y (pt)",

    applyToPages: "Použít na stránky",
    allPages: "Všechny stránky",
    oddPagesOnly: "Pouze liché stránky",
    evenPagesOnly: "Pouze sudé stránky",
    customRange: "Vlastní rozsah",
    customRangePlaceholder: "např. 1-3, 5",

    applyWatermark: "Použít vodoznak",
    applyingWatermark: "Aplikování vodoznaku...",
    reset: "Obnovit",

    digitalSignatureNotice: "Upozornění na digitální podpis",
    signatureWarning: "Byl zjištěn digitální podpis, který bude úpravou stránek zneplatněn.",
    verifiedBadge: "Dvojitě ověřeno",
    watermarkSuccessSummary: (pages) => `Vodoznak přidán na ${pages} stránek • Zpracováno 100% přes Web Worker`,
    downloadWatermarkedPdf: "Stáhnout PDF s vodoznakem",
    adjustWatermark: "Upravit vodoznak",
    startOver: "Začít znovu"
  },
  hu: {
    dropHere: "Húzza ide a PDF fájlt",
    pdfOnlyNotice: "vagy kattintson a kiválasztáshoz a számítógépről (Legfeljebb 100 MB)",
    selectPdfFile: "PDF fájl kiválasztása",
    readingPdf: "PDF dokumentum beolvasása...",
    cancelProcessing: "Feldolgozás megszakítása",
    livePlacementPreview: "Elhelyezési előnézet",

    watermarkType: "Vízjel típusa",
    textWatermark: "Szöveges vízjel",
    imageLogo: "Kép / Logó",

    uploadLogoPrompt: "Töltsön fel egy PNG vagy JPG formátumú logót.",
    invalidImageFormat: "A fájlnak érvényes PNG vagy JPEG képnek kell lennie.",
    enterWatermarkText: "Adja meg a vízjel szövegét.",
    unsupportedWinAnsi: "A szöveg olyan karaktereket tartalmaz, amelyeket a szabványos PDF betűtípusok nem támogatnak.",

    watermarkText: "Vízjel szövege",
    textPlaceholder: "pl. PISZKOZAT / BIZALMAS",
    fontColor: "Betűszín",
    fontSize: (pt) => `Betűméret (${pt} pt)`,

    selectLogoFile: "Logókép kiválasztása (PNG / JPEG)",

    opacity: (pct) => `Átlátszatlanság (${pct}%)`,
    rotation: (deg) => `Elforgatás (${deg}°)`,

    positionPreset: "Elhelyezés",
    posTopLeft: "Bal fent",
    posCenter: "Középen",
    posTopRight: "Jobb fent",
    posBottomLeft: "Bal lent",
    posTileGrid: "Mozaikrács",
    posBottomRight: "Jobb lent",
    posCustom: "Egyéni koordináták",
    customX: "Egyéni X (pt)",
    customY: "Egyéni Y (pt)",

    applyToPages: "Alkalmazás az oldalakon",
    allPages: "Minden oldal",
    oddPagesOnly: "Csak páratlan oldalak",
    evenPagesOnly: "Csak páros oldalak",
    customRange: "Egyéni tartomány",
    customRangePlaceholder: "pl. 1-3, 5",

    applyWatermark: "Vízjel alkalmazása",
    applyingWatermark: "Vízjel alkalmazása folyamatban...",
    reset: "Visszaállítás",

    digitalSignatureNotice: "Digitális aláírás figyelmeztetés",
    signatureWarning: "A dokumentum digitális aláírást tartalmaz, amely az oldalak módosításakor érvénytelenné válik.",
    verifiedBadge: "Kettős ellenőrzés kész",
    watermarkSuccessSummary: (pages) => `Vízjel alkalmazva ${pages} oldalon • 100% Web Worker háttérfolyamatban`,
    downloadWatermarkedPdf: "Vízjeles PDF letöltése",
    adjustWatermark: "Vízjel módosítása",
    startOver: "Újrakezdés"
  },
  ro: {
    dropHere: "Trage fișierul PDF aici",
    pdfOnlyNotice: "sau fă clic pentru a selecta din computer (Până la 100 MB)",
    selectPdfFile: "Selectează fișier PDF",
    readingPdf: "Se citește documentul PDF...",
    cancelProcessing: "Anulează procesarea",
    livePlacementPreview: "Previzualizare poziționare",

    watermarkType: "Tip filigran",
    textWatermark: "Filigran text",
    imageLogo: "Siglă / Imagine",

    uploadLogoPrompt: "Încarcă o imagine PNG sau JPG pentru siglă.",
    invalidImageFormat: "Fișierul trebuie să fie o imagine PNG sau JPEG validă.",
    enterWatermarkText: "Introdu textul pentru filigran.",
    unsupportedWinAnsi: "Textul conține caractere neacceptate de fonturile standard PDF.",

    watermarkText: "Text filigran",
    textPlaceholder: "de ex. PROIECT / CONFIDENȚIAL",
    fontColor: "Culoare font",
    fontSize: (pt) => `Dimensiune font (${pt} pt)`,

    selectLogoFile: "Selectează imagine siglă (PNG / JPEG)",

    opacity: (pct) => `Opacitate (${pct}%)`,
    rotation: (deg) => `Rotire (${deg}°)`,

    positionPreset: "Poziționare",
    posTopLeft: "Stânga sus",
    posCenter: "Centru",
    posTopRight: "Dreapta sus",
    posBottomLeft: "Stânga jos",
    posTileGrid: "Grilă mozaic",
    posBottomRight: "Dreapta jos",
    posCustom: "Coordonate personalizate",
    customX: "X personalizat (pt)",
    customY: "Y personalizat (pt)",

    applyToPages: "Aplică pe pagini",
    allPages: "Toate paginile",
    oddPagesOnly: "Doar paginile impare",
    evenPagesOnly: "Doar paginile pare",
    customRange: "Interval personalizat",
    customRangePlaceholder: "de ex. 1-3, 5",

    applyWatermark: "Aplică filigranul",
    applyingWatermark: "Se aplică filigranul...",
    reset: "Resetează",

    digitalSignatureNotice: "Notificare semnătură digitală",
    signatureWarning: "A fost detectată o semnătură digitală care va fi invalidată la modificarea paginilor.",
    verifiedBadge: "Verificare dublă completă",
    watermarkSuccessSummary: (pages) => `Filigran aplicat pe ${pages} pagin${pages !== 1 ? "i" : "ă"} • Procesat 100% în Web Worker`,
    downloadWatermarkedPdf: "Descarcă PDF cu filigran",
    adjustWatermark: "Ajustează filigranul",
    startOver: "Începe din nou"
  },
  bg: {
    dropHere: "Пуснете вашия PDF тук",
    pdfOnlyNotice: "или кликнете за преглед от компютъра (до 100 MB)",
    selectPdfFile: "Изберете PDF файл",
    readingPdf: "Четене на PDF документа...",
    cancelProcessing: "Отказ на обработката",
    livePlacementPreview: "Предварителен преглед на позицията",

    watermarkType: "Тип воден знак",
    textWatermark: "Текстов воден знак",
    imageLogo: "Лого / Изображение",

    uploadLogoPrompt: "Моля, качете лого изображение в PNG или JPG формат.",
    invalidImageFormat: "Файлът трябва да бъде валидно PNG или JPEG изображение.",
    enterWatermarkText: "Моля, въведете текст за воден знак.",
    unsupportedWinAnsi: "Текстът съдържа символи, неподдържани от стандартните PDF шрифтове.",

    watermarkText: "Текст на водния знак",
    textPlaceholder: "напр. ПРОЕКТ / ПОВЕРИТЕЛНО",
    fontColor: "Цвят на шрифта",
    fontSize: (pt) => `Размер на шрифта (${pt} pt)`,

    selectLogoFile: "Изберете лого изображение (PNG / JPEG)",

    opacity: (pct) => `Непрозрачност (${pct}%)`,
    rotation: (deg) => `Завъртане (${deg}°)`,

    positionPreset: "Позиция",
    posTopLeft: "Горе вляво",
    posCenter: "Център",
    posTopRight: "Горе вдясно",
    posBottomLeft: "Долу вляво",
    posTileGrid: "Мозаечна мрежа",
    posBottomRight: "Долу вдясно",
    posCustom: "Персонализирани координати",
    customX: "Персонализиран X (pt)",
    customY: "Персонализиран Y (pt)",

    applyToPages: "Прилагане към страници",
    allPages: "Всички страници",
    oddPagesOnly: "Само нечетни",
    evenPagesOnly: "Само четни",
    customRange: "Персонализиран обхват",
    customRangePlaceholder: "напр. 1-3, 5",

    applyWatermark: "Добавяне на воден знак",
    applyingWatermark: "Прилагане на воден знак...",
    reset: "Нулиране",

    digitalSignatureNotice: "Бележка за цифров подпис",
    signatureWarning: "Открит е цифров подпис, който ще стане невалиден при модификация на страниците.",
    verifiedBadge: "Двойна проверка завършена",
    watermarkSuccessSummary: (pages) => `Водният знак е добавен на ${pages} страниц${pages !== 1 ? "и" : "а"} • 100% във Web Worker`,
    downloadWatermarkedPdf: "Изтегляне на PDF с воден знак",
    adjustWatermark: "Коригиране на воден знак",
    startOver: "Започнете отначало"
  },
  el: {
    dropHere: "Σύρετε το PDF σας εδώ",
    pdfOnlyNotice: "ή κάντε κλικ για περιήγηση (έως 100 MB)",
    selectPdfFile: "Επιλέξτε αρχείο PDF",
    readingPdf: "Ανάγνωση εγγράφου PDF...",
    cancelProcessing: "Ακύρωση επεξεργασίας",
    livePlacementPreview: "Ζωντανή προεπισκόπηση",

    watermarkType: "Τύπος υδατογραφήματος",
    textWatermark: "Υδατογράφημα κειμένου",
    imageLogo: "Λογότυπο / Εικόνα",

    uploadLogoPrompt: "Μεταφορτώστε μια εικόνα λογοτύπου PNG ή JPG.",
    invalidImageFormat: "Το αρχείο πρέπει να είναι έγκυρη εικόνα PNG ή JPEG.",
    enterWatermarkText: "Εισαγάγετε κείμενο υδατογραφήματος.",
    unsupportedWinAnsi: "Το κείμενο περιέχει χαρακτήρες που δεν υποστηρίζονται από τις τυπικές γραμματοσειρές PDF.",

    watermarkText: "Κείμενο υδατογραφήματος",
    textPlaceholder: "π.χ. ΠΡΟΣΧΕΔΙΟ / ΕΜΠΙΣΤΕΥΤΙΚΟ",
    fontColor: "Χρώμα γραμματοσειράς",
    fontSize: (pt) => `Μέγεθος (${pt} pt)`,

    selectLogoFile: "Επιλέξτε λογότυπο (PNG / JPEG)",

    opacity: (pct) => `Αδιαφάνεια (${pct}%)`,
    rotation: (deg) => `Περιστροφή (${deg}°)`,

    positionPreset: "Θέση",
    posTopLeft: "Πάνω αριστερά",
    posCenter: "Κέντρο",
    posTopRight: "Πάνω δεξιά",
    posBottomLeft: "Κάτω αριστερά",
    posTileGrid: "Πλέγμα πλακιδίων",
    posBottomRight: "Κάτω δεξιά",
    posCustom: "Προσαρμοσμένες συντεταγμένες",
    customX: "Προσαρμοσμένο X (pt)",
    customY: "Προσαρμοσμένο Y (pt)",

    applyToPages: "Εφαρμογή σε σελίδες",
    allPages: "Όλες οι σελίδες",
    oddPagesOnly: "Μόνο μονές",
    evenPagesOnly: "Μόνο ζυγές",
    customRange: "Προσαρμοσμένο εύρος",
    customRangePlaceholder: "π.χ. 1-3, 5",

    applyWatermark: "Εφαρμογή υδατογραφήματος",
    applyingWatermark: "Εφαρμογή υδατογραφήματος...",
    reset: "Επαναφορά",

    digitalSignatureNotice: "Σημείωση ψηφιακής υπογραφής",
    signatureWarning: "Εντοπίστηκε ψηφιακή υπογραφή που θα ακυρωθεί από τις αλλαγές.",
    verifiedBadge: "Διπλός έλεγχος επιτυχής",
    watermarkSuccessSummary: (pages) => `Υδατογράφημα σε ${pages} σελίδ${pages !== 1 ? "ες" : "α"} • 100% μέσω Web Worker`,
    downloadWatermarkedPdf: "Λήψη υδατογραφημένου PDF",
    adjustWatermark: "Προσαρμογή υδατογραφήματος",
    startOver: "Έναρξη από την αρχή"
  },
  sk: {
    dropHere: "Presuňte PDF sem",
    pdfOnlyNotice: "alebo kliknite a vyberte z počítača (až 100 MB)",
    selectPdfFile: "Vybrať PDF súbor",
    readingPdf: "Načítavanie PDF dokumentu...",
    cancelProcessing: "Zrušiť spracovanie",
    livePlacementPreview: "Živý náhľad umiestnenia",

    watermarkType: "Typ vodoznaku",
    textWatermark: "Textový vodoznak",
    imageLogo: "Logo / Obrázok",

    uploadLogoPrompt: "Nahrajte logo vo formáte PNG alebo JPG.",
    invalidImageFormat: "Súbor musí byť platný obrázok PNG alebo JPEG.",
    enterWatermarkText: "Zadajte text vodoznaku.",
    unsupportedWinAnsi: "Text obsahuje znaky nepodporované štandardnými písmami PDF.",

    watermarkText: "Text vodoznaku",
    textPlaceholder: "napr. NÁVRH / DÔVERNÉ",
    fontColor: "Farba písma",
    fontSize: (pt) => `Veľkosť písma (${pt} pt)`,

    selectLogoFile: "Vyberte obrázok loga (PNG / JPEG)",

    opacity: (pct) => `Priehľadnosť (${pct}%)`,
    rotation: (deg) => `Otočenie (${deg}°)`,

    positionPreset: "Umiestnenie",
    posTopLeft: "Hore vľavo",
    posCenter: "Na stred",
    posTopRight: "Hore vpravo",
    posBottomLeft: "Dole vľavo",
    posTileGrid: "Dlaždicová mriežka",
    posBottomRight: "Dole vpravo",
    posCustom: "Vlastné súradnice",
    customX: "Vlastné X (pt)",
    customY: "Vlastné Y (pt)",

    applyToPages: "Použiť na strany",
    allPages: "Všetky strany",
    oddPagesOnly: "Len nepárne",
    evenPagesOnly: "Len párne",
    customRange: "Vlastný rozsah",
    customRangePlaceholder: "napr. 1-3, 5",

    applyWatermark: "Pridať vodoznak",
    applyingWatermark: "Aplikovanie vodoznaku...",
    reset: "Resetovať",

    digitalSignatureNotice: "Upozornenie na digitálny podpis",
    signatureWarning: "Bol zistený digitálny podpis, ktorý sa úpravou stránok zneplatní.",
    verifiedBadge: "Dvojito overené",
    watermarkSuccessSummary: (pages) => `Vodoznak aplikovaný na ${pages} stránk${pages !== 1 ? "ach" : "e"} • 100% cez Web Worker`,
    downloadWatermarkedPdf: "Stiahnuť PDF s vodoznakom",
    adjustWatermark: "Upraviť vodoznak",
    startOver: "Začať odznova"
  },
  sl: {
    dropHere: "Povlecite PDF sem",
    pdfOnlyNotice: "ali kliknite za brskanje po računalniku (do 100 MB)",
    selectPdfFile: "Izberite datoteko PDF",
    readingPdf: "Branje dokumenta PDF...",
    cancelProcessing: "Prekliči obdelavo",
    livePlacementPreview: "Predogled postavitve v živo",

    watermarkType: "Vrsta vodnega žiga",
    textWatermark: "Besedilni vodni žig",
    imageLogo: "Logotip / Slika",

    uploadLogoPrompt: "Naložite logotip v obliki PNG ali JPG.",
    invalidImageFormat: "Datoteka mora biti veljavna slika PNG ali JPEG.",
    enterWatermarkText: "Vnesite besedilo vodnega žiga.",
    unsupportedWinAnsi: "Besedilo vsebuje znake, ki jih standardne pisave PDF ne podpirajo.",

    watermarkText: "Besedilo vodnega žiga",
    textPlaceholder: "npr. OSNUTEK / ZAUPNO",
    fontColor: "Barva pisave",
    fontSize: (pt) => `Velikost pisave (${pt} pt)`,

    selectLogoFile: "Izberite sliko logotipa (PNG / JPEG)",

    opacity: (pct) => `Neprosojnost (${pct}%)`,
    rotation: (deg) => `Zasuk (${deg}°)`,

    positionPreset: "Postavitev",
    posTopLeft: "Zgoraj levo",
    posCenter: "Sredina",
    posTopRight: "Zgoraj desno",
    posBottomLeft: "Spodaj levo",
    posTileGrid: "Ploščična mreža",
    posBottomRight: "Spodaj desno",
    posCustom: "Koordinate po meri",
    customX: "Po meri X (pt)",
    customY: "Po meri Y (pt)",

    applyToPages: "Uporabi za strani",
    allPages: "Vse strani",
    oddPagesOnly: "Samo lihe",
    evenPagesOnly: "Samo sode",
    customRange: "Obseg po meri",
    customRangePlaceholder: "npr. 1-3, 5",

    applyWatermark: "Dodaj vodni žig",
    applyingWatermark: "Uporaba vodnega žiga...",
    reset: "Ponastavi",

    digitalSignatureNotice: "Obvestilo o digitalnem podpisu",
    signatureWarning: "Zaznan digitalni podpis, ki bo z urejanjem strani razveljavljen.",
    verifiedBadge: "Dvojno preverjeno",
    watermarkSuccessSummary: (pages) => `Vodni žig dodan na ${pages} stran${pages !== 1 ? "i" : ""} • 100% v Web Workerju`,
    downloadWatermarkedPdf: "Prenesi PDF z vodnim žigom",
    adjustWatermark: "Prilagodi vodni žig",
    startOver: "Začni znova"
  },
  ru: {
    dropHere: "Перетащите PDF сюда",
    pdfOnlyNotice: "или нажмите для выбора с компьютера (до 100 МБ)",
    selectPdfFile: "Выбрать PDF-файл",
    readingPdf: "Чтение PDF-документа...",
    cancelProcessing: "Отменить обработку",
    livePlacementPreview: "Предпросмотр размещения",

    watermarkType: "Тип водяного знака",
    textWatermark: "Текстовый водяной знак",
    imageLogo: "Логотип / Изображение",

    uploadLogoPrompt: "Загрузите изображение логотипа PNG или JPG.",
    invalidImageFormat: "Файл должен быть изображением PNG или JPEG.",
    enterWatermarkText: "Введите текст водяного знака.",
    unsupportedWinAnsi: "Текст содержит символы, не поддерживаемые стандартными шрифтами PDF.",

    watermarkText: "Текст водяного знака",
    textPlaceholder: "например: ЧЕРНОВИК / КОНФИДЕНЦИАЛЬНО",
    fontColor: "Цвет шрифта",
    fontSize: (pt) => `Размер шрифта (${pt} пт)`,

    selectLogoFile: "Выберите изображение логотипа (PNG / JPEG)",

    opacity: (pct) => `Непрозрачность (${pct}%)`,
    rotation: (deg) => `Поворот (${deg}°)`,

    positionPreset: "Позиция",
    posTopLeft: "Вверху слева",
    posCenter: "По центру",
    posTopRight: "Вверху справа",
    posBottomLeft: "Внизу слева",
    posTileGrid: "Сетка / Замостить",
    posBottomRight: "Внизу справа",
    posCustom: "Свои координаты",
    customX: "Свой X (pt)",
    customY: "Свой Y (pt)",

    applyToPages: "Применить к страницам",
    allPages: "Все страницы",
    oddPagesOnly: "Только нечетные",
    evenPagesOnly: "Только четные",
    customRange: "Свой диапазон",
    customRangePlaceholder: "например: 1-3, 5",

    applyWatermark: "Добавить водяной знак",
    applyingWatermark: "Применение водяного знака...",
    reset: "Сбросить",

    digitalSignatureNotice: "Уведомление о цифровой подписи",
    signatureWarning: "Обнаружена цифровая подпись, которая станет недействительной при изменении страниц.",
    verifiedBadge: "Двойная проверка пройдена",
    watermarkSuccessSummary: (pages) => `Водяной знак добавлен на ${pages} стр. • 100% локально в Web Worker`,
    downloadWatermarkedPdf: "Скачать PDF с водяным знаком",
    adjustWatermark: "Настроить водяной знак",
    startOver: "Начать сначала"
  },
  uk: {
    dropHere: "Перетягніть PDF сюди",
    pdfOnlyNotice: "або натисніть для вибору з комп’ютера (до 100 МБ)",
    selectPdfFile: "Вибрати PDF-файл",
    readingPdf: "Зчитування PDF-документа...",
    cancelProcessing: "Скасувати обробку",
    livePlacementPreview: "Попередній перегляд розташування",

    watermarkType: "Тип водяного знака",
    textWatermark: "Текстовий водяний знак",
    imageLogo: "Логотип / Зображення",

    uploadLogoPrompt: "Будь ласка, завантажте логотип у форматі PNG або JPG.",
    invalidImageFormat: "Файл має бути дійсним зображенням PNG або JPEG.",
    enterWatermarkText: "Введіть текст водяного знака.",
    unsupportedWinAnsi: "Текст містить символи, що не підтримуються стандартними шрифтами PDF.",

    watermarkText: "Текст водяного знака",
    textPlaceholder: "наприклад: ЧЕРНЕТКА / КОНФІДЕНЦІЙНО",
    fontColor: "Колір шрифту",
    fontSize: (pt) => `Розмір шрифту (${pt} пт)`,

    selectLogoFile: "Виберіть логотип (PNG / JPEG)",

    opacity: (pct) => `Непрозорість (${pct}%)`,
    rotation: (deg) => `Обертання (${deg}°)`,

    positionPreset: "Позиція",
    posTopLeft: "Зверху ліворуч",
    posCenter: "По центру",
    posTopRight: "Зверху праворуч",
    posBottomLeft: "Знизу ліворуч",
    posTileGrid: "Мозаїчна сітка",
    posBottomRight: "Знизу праворуч",
    posCustom: "Власні координати",
    customX: "Власний X (pt)",
    customY: "Власний Y (pt)",

    applyToPages: "Застосувати до сторінок",
    allPages: "Усі сторінки",
    oddPagesOnly: "Лише непарні",
    evenPagesOnly: "Лише парні",
    customRange: "Власний діапазон",
    customRangePlaceholder: "наприклад: 1-3, 5",

    applyWatermark: "Додати водяний знак",
    applyingWatermark: "Застосування водяного знака...",
    reset: "Скинути",

    digitalSignatureNotice: "Повідомлення про цифровий підпис",
    signatureWarning: "Виявлено цифровий підпис, який стане недійсним після зміни сторінок.",
    verifiedBadge: "Подвійна перевірка успішна",
    watermarkSuccessSummary: (pages) => `Водяний знак застосовано на ${pages} стор. • 100% локально у Web Worker`,
    downloadWatermarkedPdf: "Завантажити PDF з водяним знаком",
    adjustWatermark: "Налаштувати водяний знак",
    startOver: "Почати спочатку"
  },
  tr: {
    dropHere: "PDF dosyanızı buraya bırakın",
    pdfOnlyNotice: "veya bilgisayarınızdan seçmek için tıklayın (100 MB'a kadar)",
    selectPdfFile: "PDF Dosyası Seç",
    readingPdf: "PDF belgesi okunuyor...",
    cancelProcessing: "İşlemi İptal Et",
    livePlacementPreview: "Canlı Konum Önizlemesi",

    watermarkType: "Filigran Türü",
    textWatermark: "Metin Filigranı",
    imageLogo: "Görsel / Logo",

    uploadLogoPrompt: "Lütfen bir PNG veya JPG logo görseli yükleyin.",
    invalidImageFormat: "Dosya geçerli bir PNG veya JPEG görseli olmalıdır.",
    enterWatermarkText: "Lütfen filigran metnini girin.",
    unsupportedWinAnsi: "Metin, standart PDF yazı tipleri tarafından desteklenmeyen karakterler içeriyor.",

    watermarkText: "Filigran Metni",
    textPlaceholder: "örn. TASLAK / GİZLİ",
    fontColor: "Yazı Tipi Rengi",
    fontSize: (pt) => `Yazı Boyutu (${pt} pt)`,

    selectLogoFile: "Logo Görseli Seç (PNG / JPEG)",

    opacity: (pct) => `Opaklık (%${pct})`,
    rotation: (deg) => `Döndürme (${deg}°)`,

    positionPreset: "Konum",
    posTopLeft: "Sol Üst",
    posCenter: "Orta",
    posTopRight: "Sağ Üst",
    posBottomLeft: "Sol Alt",
    posTileGrid: "Döşeme Izgarası",
    posBottomRight: "Sağ Alt",
    posCustom: "Özel Koordinatlar",
    customX: "Özel X (pt)",
    customY: "Özel Y (pt)",

    applyToPages: "Sayfalara Uygula",
    allPages: "Tüm Sayfalar",
    oddPagesOnly: "Yalnızca Tek Sayfalar",
    evenPagesOnly: "Yalnızca Çift Sayfalar",
    customRange: "Özel Aralık",
    customRangePlaceholder: "örn. 1-3, 5",

    applyWatermark: "Filigran Ekle",
    applyingWatermark: "Filigran uygulanıyor...",
    reset: "Sıfırla",

    digitalSignatureNotice: "Dijital İmza Bildirimi",
    signatureWarning: "Sayfa değişiklikleriyle geçersiz kılınacak dijital imza algılandı.",
    verifiedBadge: "Çift Doğrulama Tamamlandı",
    watermarkSuccessSummary: (pages) => `${pages} sayfaya filigran eklendi • %100 Web Worker üzerinde işlendi`,
    downloadWatermarkedPdf: "Filigranlı PDF'yi İndir",
    adjustWatermark: "Filigranı Ayarla",
    startOver: "Yeniden Başla"
  },
  ar: {
    dropHere: "أسقط ملف PDF هنا",
    pdfOnlyNotice: "أو انقر للتصفح من جهازك (حتى 100 ميغابايت)",
    selectPdfFile: "اختر ملف PDF",
    readingPdf: "جارٍ قراءة مستند PDF...",
    cancelProcessing: "إلغاء المعالجة",
    livePlacementPreview: "معاينة الموضع المباشرة",

    watermarkType: "نوع العلامة المائية",
    textWatermark: "علامة مائية نصية",
    imageLogo: "شعار / صورة",

    uploadLogoPrompt: "يرجى تحميل صورة شعار بصيغة PNG أو JPG.",
    invalidImageFormat: "يجب أن يكون الملف صورة PNG أو JPEG صالحة.",
    enterWatermarkText: "يرجى إدخال نص العلامة المائية.",
    unsupportedWinAnsi: "يحتوي النص على أحرف غير مدعومة بخطوط PDF القياسية.",

    watermarkText: "نص العلامة المائية",
    textPlaceholder: "مثال: مسودة / سري للغاية",
    fontColor: "لون الخط",
    fontSize: (pt) => `حجم الخط (${pt} نقطة)`,

    selectLogoFile: "اختر صورة الشعار (PNG / JPEG)",

    opacity: (pct) => `الشفافية (${pct}%)`,
    rotation: (deg) => `التدوير (${deg} درجة)`,

    positionPreset: "الموضع",
    posTopLeft: "أعلى اليسار",
    posCenter: "في الوسط",
    posTopRight: "أعلى اليمين",
    posBottomLeft: "أسفل اليسار",
    posTileGrid: "شبكة مكررة",
    posBottomRight: "أسفل اليمين",
    posCustom: "إحداثيات مخصصة",
    customX: "X مخصص (نقطة)",
    customY: "Y مخصص (نقطة)",

    applyToPages: "تطبيق على الصفحات",
    allPages: "جميع الصفحات",
    oddPagesOnly: "الصفحات الفردية فقط",
    evenPagesOnly: "الصفحات الزوجية فقط",
    customRange: "نطاق مخصص",
    customRangePlaceholder: "مثال: 1-3, 5",

    applyWatermark: "تطبيق العلامة المائية",
    applyingWatermark: "جارٍ تطبيق العلامة المائية...",
    reset: "إعادة ضبط",

    digitalSignatureNotice: "إشعار التوقيع الرقمي",
    signatureWarning: "تم اكتشاف توقيع رقمي قد يصبح باطلاً بعد تعديل الصفحات.",
    verifiedBadge: "تم التحقق المزدوج",
    watermarkSuccessSummary: (pages) => `تمت إضافة العلامة المائية إلى ${pages} صفحة • معالجة 100% عبر Web Worker`,
    downloadWatermarkedPdf: "تحميل PDF بعلامة مائية",
    adjustWatermark: "تعديل العلامة المائية",
    startOver: "البدء من جديد"
  },
  he: {
    dropHere: "גרור את קובץ ה-PDF לכאן",
    pdfOnlyNotice: "או לחץ כדי לבחור מהמחשב (עד 100 MB)",
    selectPdfFile: "בחר קובץ PDF",
    readingPdf: "קורא מסמך PDF...",
    cancelProcessing: "בטל עיבוד",
    livePlacementPreview: "תצוגה מקדימה של מיקום",

    watermarkType: "סוג סימן מים",
    textWatermark: "סימן מים טקסטואלי",
    imageLogo: "לוגו או תמונה",

    uploadLogoPrompt: "נא להעלות תמונת לוגו בפורמט PNG או JPG.",
    invalidImageFormat: "הקובץ חייב להיות תמונת PNG או JPEG תקינה.",
    enterWatermarkText: "נא להזין טקסט עבור סימן המים.",
    unsupportedWinAnsi: "הטקסט מכיל תווים שאינם נתמכים על ידי גופני PDF רגילים.",

    watermarkText: "טקסט סימן מים",
    textPlaceholder: "לדוגמה: טיוטה / סודי",
    fontColor: "צבע גופן",
    fontSize: (pt) => `גודל גופן (${pt} pt)`,

    selectLogoFile: "בחר תמונת לוגו (PNG / JPEG)",

    opacity: (pct) => `שקיפות (${pct}%)`,
    rotation: (deg) => `סיבוב (${deg}°)`,

    positionPreset: "מיקום",
    posTopLeft: "למעלה משמאל",
    posCenter: "מרכז",
    posTopRight: "למעלה מימין",
    posBottomLeft: "למטה משמאל",
    posTileGrid: "רשת משובצת",
    posBottomRight: "למטה מימין",
    posCustom: "קואורדינטות מותאמות אישית",
    customX: "X מותאם אישית (pt)",
    customY: "Y מותאם אישית (pt)",

    applyToPages: "החל על עמודים",
    allPages: "כל העמודים",
    oddPagesOnly: "עמודים אי-זוגיים בלבד",
    evenPagesOnly: "עמודים זוגיים בלבד",
    customRange: "טווח מותאם אישית",
    customRangePlaceholder: "לדוגמה: 1-3, 5",

    applyWatermark: "החל סימן מים",
    applyingWatermark: "מחיל סימן מים...",
    reset: "איפוס",

    digitalSignatureNotice: "הודעת חתימה דיגיטלית",
    signatureWarning: "זוהתה חתימה דיגיטלית שתבוטל בעקבות שינוי העמודים.",
    verifiedBadge: "אימות כפול הושלם",
    watermarkSuccessSummary: (pages) => `סימן מים הוחל על ${pages} עמודים • 100% עיבוד ב-Web Worker`,
    downloadWatermarkedPdf: "הורד PDF עם סימן מים",
    adjustWatermark: "התאם סימן מים",
    startOver: "התחל מחדש"
  },
  hi: {
    dropHere: "अपनी PDF फ़ाइल यहाँ छोड़ें",
    pdfOnlyNotice: "या कंप्यूटर से ब्राउज़ करने के लिए क्लिक करें (100 MB तक)",
    selectPdfFile: "PDF फ़ाइल चुनें",
    readingPdf: "PDF दस्तावेज़ पढ़ा जा रहा है...",
    cancelProcessing: "प्रसंस्करण रद्द करें",
    livePlacementPreview: "लाइव प्लेसमेंट पूर्वावलोकन",

    watermarkType: "वॉटरमार्क प्रकार",
    textWatermark: "टेक्स्ट वॉटरमार्क",
    imageLogo: "छवि / लोगो",

    uploadLogoPrompt: "कृपया एक PNG या JPG लोगो छवि अपलोड करें।",
    invalidImageFormat: "फ़ाइल एक मान्य PNG या JPEG छवि होनी चाहिए।",
    enterWatermarkText: "कृपया वॉटरमार्क टेक्स्ट दर्ज करें।",
    unsupportedWinAnsi: "टेक्स्ट में ऐसे वर्ण हैं जो मानक PDF फ़ॉन्ट द्वारा समर्थित नहीं हैं।",

    watermarkText: "वॉटरमार्क टेक्स्ट",
    textPlaceholder: "उदा. DRAFT / CONFIDENTIAL",
    fontColor: "फ़ॉन्ट का रंग",
    fontSize: (pt) => `फ़ॉन्ट का आकार (${pt} pt)`,

    selectLogoFile: "लोगो छवि चुनें (PNG / JPEG)",

    opacity: (pct) => `अपारदर्शिता (${pct}%)`,
    rotation: (deg) => `घुमाव (${deg}°)`,

    positionPreset: "स्थिति प्रीसेट",
    posTopLeft: "ऊपर बाएँ",
    posCenter: "केंद्र",
    posTopRight: "ऊपर दाएँ",
    posBottomLeft: "नीचे बाएँ",
    posTileGrid: "टाइल ग्रिड",
    posBottomRight: "नीचे दाएँ",
    posCustom: "कस्टम निर्देशांक",
    customX: "कस्टम X (pt)",
    customY: "कस्टम Y (pt)",

    applyToPages: "पृष्ठों पर लागू करें",
    allPages: "सभी पृष्ठ",
    oddPagesOnly: "केवल विषम पृष्ठ",
    evenPagesOnly: "केवल सम पृष्ठ",
    customRange: "कस्टम सीमा",
    customRangePlaceholder: "उदा. 1-3, 5",

    applyWatermark: "वॉटरमार्क जोड़ें",
    applyingWatermark: "वॉटरमार्क लागू किया जा रहा है...",
    reset: "रीसेट करें",

    digitalSignatureNotice: "डिजिटल हस्ताक्षर सूचना",
    signatureWarning: "डिजिटल हस्ताक्षर का पता चला जो पृष्ठ संशोधन के कारण अमान्य हो जाएगा।",
    verifiedBadge: "दोहरा सत्यापन पूर्ण",
    watermarkSuccessSummary: (pages) => `${pages} पृष्ठों पर वॉटरमार्क लागू किया गया • Web Worker द्वारा 100% स्थानीय प्रोसेस`,
    downloadWatermarkedPdf: "वॉटरमार्क युक्त PDF डाउनलोड करें",
    adjustWatermark: "वॉटरमार्क समायोजित करें",
    startOver: "पुनः प्रारंभ करें"
  },
  id: {
    dropHere: "Tarik file PDF Anda ke sini",
    pdfOnlyNotice: "atau klik untuk memilih dari komputer Anda (Hingga 100 MB)",
    selectPdfFile: "Pilih File PDF",
    readingPdf: "Membaca dokumen PDF...",
    cancelProcessing: "Batalkan Proses",
    livePlacementPreview: "Pratinjau Posisi Langsung",

    watermarkType: "Jenis Tanda Air",
    textWatermark: "Tanda Air Teks",
    imageLogo: "Logo / Gambar",

    uploadLogoPrompt: "Silakan unggah gambar logo PNG atau JPG.",
    invalidImageFormat: "File harus berupa gambar PNG atau JPEG yang valid.",
    enterWatermarkText: "Silakan masukkan teks tanda air.",
    unsupportedWinAnsi: "Teks berisi karakter yang tidak didukung oleh font standar PDF.",

    watermarkText: "Teks Tanda Air",
    textPlaceholder: "contoh: DRAFT / RAHASIA",
    fontColor: "Warna Font",
    fontSize: (pt) => `Ukuran Font (${pt} pt)`,

    selectLogoFile: "Pilih Gambar Logo (PNG / JPEG)",

    opacity: (pct) => `Opasitas (${pct}%)`,
    rotation: (deg) => `Rotasi (${deg}°)`,

    positionPreset: "Posisi",
    posTopLeft: "Kiri Atas",
    posCenter: "Tengah",
    posTopRight: "Kanan Atas",
    posBottomLeft: "Kiri Bawah",
    posTileGrid: "Pola Ubin / Mosaik",
    posBottomRight: "Kanan Bawah",
    posCustom: "Koordinat Kustom",
    customX: "Kustom X (pt)",
    customY: "Kustom Y (pt)",

    applyToPages: "Terapkan ke Halaman",
    allPages: "Semua Halaman",
    oddPagesOnly: "Hanya Halaman Ganjil",
    evenPagesOnly: "Hanya Halaman Genap",
    customRange: "Rentang Kustom",
    customRangePlaceholder: "contoh: 1-3, 5",

    applyWatermark: "Terapkan Tanda Air",
    applyingWatermark: "Menerapkan tanda air...",
    reset: "Reset",

    digitalSignatureNotice: "Pemberitahuan Tanda Tangan Digital",
    signatureWarning: "Tanda tangan digital terdeteksi yang akan menjadi tidak valid setelah pengeditan.",
    verifiedBadge: "Verifikasi Ganda Selesai",
    watermarkSuccessSummary: (pages) => `Tanda air diterapkan pada ${pages} halaman • 100% diproses via Web Worker`,
    downloadWatermarkedPdf: "Unduh PDF dengan Tanda Air",
    adjustWatermark: "Sesuaikan Tanda Air",
    startOver: "Mulai Ulang"
  },
  ms: {
    dropHere: "Lepaskan dokumen PDF di sini",
    pdfOnlyNotice: "atau klik untuk memilih dari komputer anda (Sehingga 100 MB)",
    selectPdfFile: "Pilih Fail PDF",
    readingPdf: "Membaca dokumen PDF...",
    cancelProcessing: "Batal Pemprosesan",
    livePlacementPreview: "Pratonton Kedudukan Langsung",

    watermarkType: "Jenis Tera Air",
    textWatermark: "Tera Air Teks",
    imageLogo: "Logo / Imej",

    uploadLogoPrompt: "Sila muat naik imej logo PNG atau JPG.",
    invalidImageFormat: "Fail mestilah imej PNG atau JPEG yang sah.",
    enterWatermarkText: "Sila masukkan teks tera air.",
    unsupportedWinAnsi: "Teks mengandungi aksara yang tidak disokong oleh fon standard PDF.",

    watermarkText: "Teks Tera Air",
    textPlaceholder: "cth. DRAF / SULIT",
    fontColor: "Warna Fon",
    fontSize: (pt) => `Saiz Fon (${pt} pt)`,

    selectLogoFile: "Pilih Imej Logo (PNG / JPEG)",

    opacity: (pct) => `Kelegapan (${pct}%)`,
    rotation: (deg) => `Putaran (${deg}°)`,

    positionPreset: "Kedudukan",
    posTopLeft: "Kiri Atas",
    posCenter: "Tengah",
    posTopRight: "Kanan Atas",
    posBottomLeft: "Kiri Bawah",
    posTileGrid: "Grid Jubin",
    posBottomRight: "Kanan Bawah",
    posCustom: "Koordinat Tersuai",
    customX: "Tersuai X (pt)",
    customY: "Tersuai Y (pt)",

    applyToPages: "Gunakan pada Halaman",
    allPages: "Semua Halaman",
    oddPagesOnly: "Halaman Ganjil Sahaja",
    evenPagesOnly: "Halaman Genap Sahaja",
    customRange: "Julat Tersuai",
    customRangePlaceholder: "cth. 1-3, 5",

    applyWatermark: "Gunakan Tera Air",
    applyingWatermark: "Menggunakan tera air...",
    reset: "Set Semula",

    digitalSignatureNotice: "Notis Tandatangan Digital",
    signatureWarning: "Tandatangan digital dikesan yang akan terbatal akibat pengubahsuaian halaman.",
    verifiedBadge: "Pengesahan Berganda Selesai",
    watermarkSuccessSummary: (pages) => `Tera air ditambah pada ${pages} halaman • 100% diproses melalui Web Worker`,
    downloadWatermarkedPdf: "Muat Turun PDF Bertera Air",
    adjustWatermark: "Laraskan Tera Air",
    startOver: "Mula Semula"
  },
  th: {
    dropHere: "ลากไฟล์ PDF มาวางที่นี่",
    pdfOnlyNotice: "หรือคลิกเพื่อเลือกจากคอมพิวเตอร์ของคุณ (สูงสุด 100 MB)",
    selectPdfFile: "เลือกไฟล์ PDF",
    readingPdf: "กำลังอ่านเอกสาร PDF...",
    cancelProcessing: "ยกเลิกการประมวลผล",
    livePlacementPreview: "ดูตัวอย่างตำแหน่งแบบสด",

    watermarkType: "ประเภทลายน้ำ",
    textWatermark: "ลายน้ำข้อความ",
    imageLogo: "รูปภาพ / โลโก้",

    uploadLogoPrompt: "โปรดอัปโหลดไฟล์โลโก้ PNG หรือ JPG",
    invalidImageFormat: "ไฟล์ต้องเป็นรูปภาพ PNG หรือ JPEG ที่ถูกต้อง",
    enterWatermarkText: "โปรดป้อนข้อความลายน้ำ",
    unsupportedWinAnsi: "ข้อความมีอักขระที่ไม่รองรับโดยฟอนต์มาตรฐานของ PDF",

    watermarkText: "ข้อความลายน้ำ",
    textPlaceholder: "เช่น ร่าง / เอกสารลับ",
    fontColor: "สีตัวอักษร",
    fontSize: (pt) => `ขนาดตัวอักษร (${pt} pt)`,

    selectLogoFile: "เลือกรูปภาพโลโก้ (PNG / JPEG)",

    opacity: (pct) => `ความทึบแสง (${pct}%)`,
    rotation: (deg) => `การหมุน (${deg}°)`,

    positionPreset: "ตำแหน่ง",
    posTopLeft: "บนซ้าย",
    posCenter: "กึ่งกลาง",
    posTopRight: "บนขวา",
    posBottomLeft: "ล่างซ้าย",
    posTileGrid: "ตารางเรียงต่อกัน",
    posBottomRight: "ล่างขวา",
    posCustom: "กำหนดพิกัดเอง",
    customX: "พิกัด X (pt)",
    customY: "พิกัด Y (pt)",

    applyToPages: "นำไปใช้กับหน้า",
    allPages: "ทุกหน้า",
    oddPagesOnly: "เฉพาะหน้าคี่",
    evenPagesOnly: "เฉพาะหน้าคู่",
    customRange: "กำหนดช่วงเอง",
    customRangePlaceholder: "เช่น 1-3, 5",

    applyWatermark: "ใส่ลายน้ำ",
    applyingWatermark: "กำลังใส่ลายน้ำ...",
    reset: "รีเซ็ต",

    digitalSignatureNotice: "ข้อสังเกตเกี่ยวกับลายเซ็นดิจิทัล",
    signatureWarning: "ตรวจพบลายเซ็นดิจิทัลซึ่งจะใช้การไม่ได้หากมีการปรับเปลี่ยนหน้าเอกสาร",
    verifiedBadge: "ตรวจสอบความสมบูรณ์สองชั้นแล้ว",
    watermarkSuccessSummary: (pages) => `ใส่ลายน้ำลงใน ${pages} หน้า • ประมวลผลผ่าน Web Worker 100% ในเครื่อง`,
    downloadWatermarkedPdf: "ดาวน์โหลด PDF พร้อมลายน้ำ",
    adjustWatermark: "ปรับแต่งลายน้ำ",
    startOver: "เริ่มต้นใหม่"
  },
  vi: {
    dropHere: "Kéo thả tệp PDF vào đây",
    pdfOnlyNotice: "hoặc nhấp để chọn từ máy tính của bạn (Tối đa 100 MB)",
    selectPdfFile: "Chọn tệp PDF",
    readingPdf: "Đang đọc tài liệu PDF...",
    cancelProcessing: "Hủy xử lý",
    livePlacementPreview: "Xem trước vị trí trực tiếp",

    watermarkType: "Loại hình mờ",
    textWatermark: "Hình mờ văn bản",
    imageLogo: "Logo / Hình ảnh",

    uploadLogoPrompt: "Vui lòng tải lên hình ảnh logo PNG hoặc JPG.",
    invalidImageFormat: "Tệp phải là hình ảnh PNG hoặc JPEG hợp lệ.",
    enterWatermarkText: "Vui lòng nhập văn bản hình mờ.",
    unsupportedWinAnsi: "Văn bản chứa các ký tự không được phông chữ PDF tiêu chuẩn hỗ trợ.",

    watermarkText: "Văn bản hình mờ",
    textPlaceholder: "vd: BẢN THẢO / MẬT",
    fontColor: "Màu chữ",
    fontSize: (pt) => `Cỡ chữ (${pt} pt)`,

    selectLogoFile: "Chọn hình ảnh logo (PNG / JPEG)",

    opacity: (pct) => `Độ mờ (${pct}%)`,
    rotation: (deg) => `Góc xoay (${deg}°)`,

    positionPreset: "Vị trí đặt",
    posTopLeft: "Trên cùng bên trái",
    posCenter: "Chính giữa",
    posTopRight: "Trên cùng bên phải",
    posBottomLeft: "Dưới cùng bên trái",
    posTileGrid: "Lưới xếp lát",
    posBottomRight: "Dưới cùng bên phải",
    posCustom: "Tọa độ tùy chỉnh",
    customX: "X tùy chỉnh (pt)",
    customY: "Y tùy chỉnh (pt)",

    applyToPages: "Áp dụng cho các trang",
    allPages: "Tất cả các trang",
    oddPagesOnly: "Chỉ các trang lẻ",
    evenPagesOnly: "Chỉ các trang chẵn",
    customRange: "Phạm vi tùy chỉnh",
    customRangePlaceholder: "vd: 1-3, 5",

    applyWatermark: "Áp dụng hình mờ",
    applyingWatermark: "Đang áp dụng hình mờ...",
    reset: "Đặt lại",

    digitalSignatureNotice: "Lưu ý về chữ ký số",
    signatureWarning: "Phát hiện chữ ký số có thể bị mất hiệu lực khi sửa đổi trang.",
    verifiedBadge: "Đã xác minh kép",
    watermarkSuccessSummary: (pages) => `Đã đóng dấu hình mờ trên ${pages} trang • 100% qua Web Worker`,
    downloadWatermarkedPdf: "Tải xuống PDF có hình mờ",
    adjustWatermark: "Điều chỉnh hình mờ",
    startOver: "Bắt đầu lại"
  },
  fil: {
    dropHere: "I-drop ang dokumentong PDF dito",
    pdfOnlyNotice: "o mag-click upang mag-browse mula sa iyong computer (Hanggang 100 MB)",
    selectPdfFile: "Pumili ng PDF File",
    readingPdf: "Binabasa ang dokumentong PDF...",
    cancelProcessing: "Kanselahin ang Pagproseso",
    livePlacementPreview: "Live na Preview ng Posisyon",

    watermarkType: "Uri ng Watermark",
    textWatermark: "Text na Watermark",
    imageLogo: "Larawan / Logo",

    uploadLogoPrompt: "Mangyaring mag-upload ng PNG o JPG logo na larawan.",
    invalidImageFormat: "Dapat ay wastong PNG o JPEG na larawan ang file.",
    enterWatermarkText: "Mangyaring ilagay ang teksto ng watermark.",
    unsupportedWinAnsi: "Naglalaman ang teksto ng mga character na hindi suportado ng standard na PDF font.",

    watermarkText: "Teksto ng Watermark",
    textPlaceholder: "hal. DRAFT / KUMPIDENSYAL",
    fontColor: "Kulay ng Font",
    fontSize: (pt) => `Laki ng Font (${pt} pt)`,

    selectLogoFile: "Pumili ng Larawan ng Logo (PNG / JPEG)",

    opacity: (pct) => `Opacity (${pct}%)`,
    rotation: (deg) => `Pag-ikot (${deg}°)`,

    positionPreset: "Posisyon",
    posTopLeft: "Itaas Kaliwa",
    posCenter: "Gitna",
    posTopRight: "Itaas Kanan",
    posBottomLeft: "Ibaba Kaliwa",
    posTileGrid: "Naka-tile na Grid",
    posBottomRight: "Ibaba Kanan",
    posCustom: "Custom na Coordinates",
    customX: "Custom X (pt)",
    customY: "Custom Y (pt)",

    applyToPages: "Ilapat sa mga Pahina",
    allPages: "Lahat ng Pahina",
    oddPagesOnly: "Mga Kakaibang Pahina Lamang",
    evenPagesOnly: "Mga Parehong Pahina Lamang",
    customRange: "Custom na Saklaw",
    customRangePlaceholder: "hal. 1-3, 5",

    applyWatermark: "Ilapat ang Watermark",
    applyingWatermark: "Inilalapat ang watermark...",
    reset: "I-reset",

    digitalSignatureNotice: "Abiso sa Digital na Lagda",
    signatureWarning: "May nakitang digital signature na mawawalan ng bisa sa pagbabago ng pahina.",
    verifiedBadge: "Dobleng Na-verify",
    watermarkSuccessSummary: (pages) => `Nalagyan ng watermark ang ${pages} pahina • 100% naproseso sa Web Worker`,
    downloadWatermarkedPdf: "I-download ang Watermarked PDF",
    adjustWatermark: "Ayusin ang Watermark",
    startOver: "Magsimula Muli"
  },
  ja: {
    dropHere: "ここにPDFファイルをドロップ",
    pdfOnlyNotice: "またはクリックしてお使いの端末から選択（最大 100 MB）",
    selectPdfFile: "PDFファイルを選択",
    readingPdf: "PDFドキュメントを読み込み中...",
    cancelProcessing: "処理を中止",
    livePlacementPreview: "配置プレビュー",

    watermarkType: "透かしの種類",
    textWatermark: "テキスト透かし",
    imageLogo: "画像 / ロゴ",

    uploadLogoPrompt: "PNGまたはJPG形式のロゴ画像をアップロードしてください。",
    invalidImageFormat: "有効なPNGまたはJPEG画像を選択してください。",
    enterWatermarkText: "透かしのテキストを入力してください。",
    unsupportedWinAnsi: "標準PDFフォントでサポートされていない文字が含まれています。",

    watermarkText: "透かしテキスト",
    textPlaceholder: "例：社外秘 / DRAFT",
    fontColor: "フォントカラー",
    fontSize: (pt) => `フォントサイズ (${pt} pt)`,

    selectLogoFile: "ロゴ画像を選択 (PNG / JPEG)",

    opacity: (pct) => `不透明度 (${pct}%)`,
    rotation: (deg) => `回転角度 (${deg}°)`,

    positionPreset: "配置プリセット",
    posTopLeft: "左上",
    posCenter: "中央",
    posTopRight: "右上",
    posBottomLeft: "左下",
    posTileGrid: "タイル状グリッド",
    posBottomRight: "右下",
    posCustom: "座標を指定",
    customX: "カスタム X (pt)",
    customY: "カスタム Y (pt)",

    applyToPages: "適用ページ",
    allPages: "すべてのページ",
    oddPagesOnly: "奇数ページのみ",
    evenPagesOnly: "偶数ページのみ",
    customRange: "範囲指定",
    customRangePlaceholder: "例：1-3, 5",

    applyWatermark: "透かしを適用",
    applyingWatermark: "透かしを適用中...",
    reset: "リセット",

    digitalSignatureNotice: "電子署名に関する注意",
    signatureWarning: "電子署名が含まれているため、ページを変更すると署名が無効になります。",
    verifiedBadge: "整合性検証済み",
    watermarkSuccessSummary: (pages) => `${pages} ページに透かしを適用 • Web Workerによる100%ローカル処理`,
    downloadWatermarkedPdf: "透かし入りPDFをダウンロード",
    adjustWatermark: "透かしを調整",
    startOver: "最初からやり直す"
  },
  ko: {
    dropHere: "여기에 PDF 파일을 드롭하세요",
    pdfOnlyNotice: "또는 클릭하여 컴퓨터에서 선택 (최대 100 MB)",
    selectPdfFile: "PDF 파일 선택",
    readingPdf: "PDF 문서 읽는 중...",
    cancelProcessing: "처리 취소",
    livePlacementPreview: "실시간 배치 미리보기",

    watermarkType: "워터마크 유형",
    textWatermark: "텍스트 워터마크",
    imageLogo: "이미지 / 로고",

    uploadLogoPrompt: "PNG 또는 JPG 로고 이미지를 업로드하세요.",
    invalidImageFormat: "올바른 PNG 또는 JPEG 이미지여야 합니다.",
    enterWatermarkText: "워터마크 텍스트를 입력하세요.",
    unsupportedWinAnsi: "표준 PDF 글꼴에서 지원하지 않는 문자가 포함되어 있습니다.",

    watermarkText: "워터마크 텍스트",
    textPlaceholder: "예: 대외비 / 기밀문서",
    fontColor: "글꼴 색상",
    fontSize: (pt) => `글꼴 크기 (${pt} pt)`,

    selectLogoFile: "로고 이미지 선택 (PNG / JPEG)",

    opacity: (pct) => `불투명도 (${pct}%)`,
    rotation: (deg) => `회전 각도 (${deg}°)`,

    positionPreset: "위치 설정",
    posTopLeft: "왼쪽 상단",
    posCenter: "가운데",
    posTopRight: "오른쪽 상단",
    posBottomLeft: "왼쪽 하단",
    posTileGrid: "바둑판식 배열",
    posBottomRight: "오른쪽 하단",
    posCustom: "사용자 지정 좌표",
    customX: "사용자 지정 X (pt)",
    customY: "사용자 지정 Y (pt)",

    applyToPages: "적용할 페이지",
    allPages: "모든 페이지",
    oddPagesOnly: "홀수 페이지만",
    evenPagesOnly: "짝수 페이지만",
    customRange: "사용자 지정 범위",
    customRangePlaceholder: "예: 1-3, 5",

    applyWatermark: "워터마크 적용",
    applyingWatermark: "워터마크 적용 중...",
    reset: "초기화",

    digitalSignatureNotice: "전자 서명 안내",
    signatureWarning: "페이지 수정 시 무효화되는 전자 서명이 감지되었습니다.",
    verifiedBadge: "이중 검증 완료",
    watermarkSuccessSummary: (pages) => `${pages}개 페이지에 워터마크 적용 • Web Worker로 100% 로컬 처리`,
    downloadWatermarkedPdf: "워터마크 PDF 다운로드",
    adjustWatermark: "워터마크 조정",
    startOver: "다시 시작"
  },
  "zh-CN": {
    dropHere: "将 PDF 文件拖放到此处",
    pdfOnlyNotice: "或点击从您的电脑中选择（最大 100 MB）",
    selectPdfFile: "选择 PDF 文件",
    readingPdf: "正在读取 PDF 文档...",
    cancelProcessing: "取消处理",
    livePlacementPreview: "实时位置预览",

    watermarkType: "水印类型",
    textWatermark: "文本水印",
    imageLogo: "图片 / 标志",

    uploadLogoPrompt: "请上传 PNG 或 JPG 标志图片。",
    invalidImageFormat: "文件必须是有效的 PNG 或 JPEG 图片。",
    enterWatermarkText: "请输入水印文本。",
    unsupportedWinAnsi: "文本包含标准 PDF 字体不支持的字符。",

    watermarkText: "水印文本",
    textPlaceholder: "例如：草稿 / 机密文件",
    fontColor: "文字颜色",
    fontSize: (pt) => `字体大小 (${pt} pt)`,

    selectLogoFile: "选择图片 / 标志文件 (PNG / JPEG)",

    opacity: (pct) => `不透明度 (${pct}%)`,
    rotation: (deg) => `旋转角度 (${deg}°)`,

    positionPreset: "位置预设",
    posTopLeft: "左上",
    posCenter: "居中",
    posTopRight: "右上",
    posBottomLeft: "左下",
    posTileGrid: "平铺网格",
    posBottomRight: "右下",
    posCustom: "自定义坐标",
    customX: "自定义 X (pt)",
    customY: "自定义 Y (pt)",

    applyToPages: "应用至页面",
    allPages: "所有页面",
    oddPagesOnly: "仅奇数页",
    evenPagesOnly: "仅偶数页",
    customRange: "自定义范围",
    customRangePlaceholder: "例如：1-3, 5",

    applyWatermark: "应用水印",
    applyingWatermark: "正在应用水印...",
    reset: "重置",

    digitalSignatureNotice: "数字签名提示",
    signatureWarning: "文档包含数字签名，修改页面将导致签名失效。",
    verifiedBadge: "完整性已验证",
    watermarkSuccessSummary: (pages) => `已在 ${pages} 个页面应用水印 • 100% 通过 Web Worker 在后台线程安全处理`,
    downloadWatermarkedPdf: "下载水印 PDF",
    adjustWatermark: "调整水印",
    startOver: "重新开始"
  },
  "zh-TW": {
    dropHere: "將 PDF 檔案拖放到此處",
    pdfOnlyNotice: "或點擊從您的電腦中選取（最大 100 MB）",
    selectPdfFile: "選取 PDF 檔案",
    readingPdf: "正在讀取 PDF 文件...",
    cancelProcessing: "取消處理",
    livePlacementPreview: "即時位置預覽",

    watermarkType: "浮水印類型",
    textWatermark: "文字浮水印",
    imageLogo: "圖片 / 標誌",

    uploadLogoPrompt: "請上傳 PNG 或 JPG 標誌圖片。",
    invalidImageFormat: "檔案必須是有效的 PNG 或 JPEG 圖片。",
    enterWatermarkText: "請輸入浮水印文字。",
    unsupportedWinAnsi: "文字包含標準 PDF 字型不支援的字元。",

    watermarkText: "浮水印文字",
    textPlaceholder: "例如：草稿 / 機密檔案",
    fontColor: "文字顏色",
    fontSize: (pt) => `字型大小 (${pt} pt)`,

    selectLogoFile: "選取圖片 / 標誌檔案 (PNG / JPEG)",

    opacity: (pct) => `不透明度 (${pct}%)`,
    rotation: (deg) => `旋轉角度 (${deg}°)`,

    positionPreset: "位置設定",
    posTopLeft: "左上",
    posCenter: "置中",
    posTopRight: "右上",
    posBottomLeft: "左下",
    posTileGrid: "平鋪網格",
    posBottomRight: "右下",
    posCustom: "自訂座標",
    customX: "自訂 X (pt)",
    customY: "自訂 Y (pt)",

    applyToPages: "套用至頁面",
    allPages: "全部頁面",
    oddPagesOnly: "僅奇數頁",
    evenPagesOnly: "僅偶數頁",
    customRange: "自訂範圍",
    customRangePlaceholder: "例如：1-3, 5",

    applyWatermark: "套用浮水印",
    applyingWatermark: "正在套用浮水印...",
    reset: "重設",

    digitalSignatureNotice: "數位簽章注意",
    signatureWarning: "文件包含數位簽章，修改頁面將導致簽章失效。",
    verifiedBadge: "完整性已驗證",
    watermarkSuccessSummary: (pages) => `已在 ${pages} 個頁面套用浮水印 • 100% 透過 Web Worker 於背景執行緒安全運算`,
    downloadWatermarkedPdf: "下載浮水印 PDF",
    adjustWatermark: "調整浮水印",
    startOver: "重新開始"
  },
  lv: {
    dropHere: "Nometiet savu PDF failu šeit",
    pdfOnlyNotice: "vai noklikšķiniet, lai pārlūkotu no datora (līdz 100 MB)",
    selectPdfFile: "Izvēlēties PDF failu",
    readingPdf: "Notiek PDF dokumenta lasīšana...",
    cancelProcessing: "Atcelt apstrādi",
    livePlacementPreview: "Tiešais novietojuma priekšskatījums",

    watermarkType: "Ūdenszīmes veids",
    textWatermark: "Teksta ūdenszīme",
    imageLogo: "Attēls / Logotips",

    uploadLogoPrompt: "Lūdzu, augšupielādējiet PNG vai JPG logotipa attēlu.",
    invalidImageFormat: "Failam jābūt derīgam PNG vai JPEG attēlam.",
    enterWatermarkText: "Lūdzu, ievadiet ūdenszīmes tekstu.",
    unsupportedWinAnsi: "Teksts satur rakstzīmes, ko neatbalsta standarta PDF fonti.",

    watermarkText: "Ūdenszīmes teksts",
    textPlaceholder: "piem., METS / KONFIDENCIĀLI",
    fontColor: "Fonta krāsa",
    fontSize: (pt) => `Fonta izmērs (${pt} pt)`,

    selectLogoFile: "Izvēlēties logotipa attēlu (PNG / JPEG)",

    opacity: (pct) => `Necaurspīdīgums (${pct}%)`,
    rotation: (deg) => `Pagriešana (${deg}°)`,

    positionPreset: "Novietojums",
    posTopLeft: "Augšā pa kreisi",
    posCenter: "Centrā",
    posTopRight: "Augšā pa labi",
    posBottomLeft: "Apakšā pa kreisi",
    posTileGrid: "Mozaīkas režģis",
    posBottomRight: "Apakšā pa labi",
    posCustom: "Pielāgotas koordinātas",
    customX: "Pielāgots X (pt)",
    customY: "Pielāgots Y (pt)",

    applyToPages: "Lietot lapām",
    allPages: "Visām lapām",
    oddPagesOnly: "Tikai nepāra lapām",
    evenPagesOnly: "Tikai pāra lapām",
    customRange: "Pielāgots diapazons",
    customRangePlaceholder: "piem., 1-3, 5",

    applyWatermark: "Pievienot ūdenszīmi",
    applyingWatermark: "Pievieno ūdenszīmi...",
    reset: "Atiestatīt",

    digitalSignatureNotice: "Digitālā paraksta paziņojums",
    signatureWarning: "Konstatēts digitālais paraksts, kas tiks anulēts pēc lapu modificēšanas.",
    verifiedBadge: "Integritāte pārbaudīta",
    watermarkSuccessSummary: (pages) => `Ūdenszīme pievienota ${pages} lapā${pages !== 1 ? "s" : ""} • 100% apstrādāts Web Workerī`,
    downloadWatermarkedPdf: "Lejupielādēt PDF ar ūdenszīmi",
    adjustWatermark: "Pielāgot ūdenszīmi",
    startOver: "Sākt no jauna"
  },
  lt: {
    dropHere: "Nutempkite savo PDF failą čia",
    pdfOnlyNotice: "arba spustelėkite, kad pasirinktumėte iš kompiuterio (iki 100 MB)",
    selectPdfFile: "Pasirinkti PDF failą",
    readingPdf: "Skaitomas PDF dokumentas...",
    cancelProcessing: "Atšaukti apdorojimą",
    livePlacementPreview: "Tiesioginė vietos peržiūra",

    watermarkType: "Vandens ženklo tipas",
    textWatermark: "Tekstinis vandens ženklas",
    imageLogo: "Logotipas / Paveikslėlis",

    uploadLogoPrompt: "Įkelkite PNG arba JPG logotipo paveikslėlį.",
    invalidImageFormat: "Failas turi būti galiojantis PNG arba JPEG vaizdas.",
    enterWatermarkText: "Įveskite vandens ženklo tekstą.",
    unsupportedWinAnsi: "Tekste yra simbolių, kurių nepalaiko standartiniai PDF šriftai.",

    watermarkText: "Vandens ženklo tekstas",
    textPlaceholder: "pvz., JUODRAŠTIS / KONFIDENCIALU",
    fontColor: "Šrifto spalva",
    fontSize: (pt) => `Šrifto dydis (${pt} pt)`,

    selectLogoFile: "Pasirinkti logotipo paveikslėlį (PNG / JPEG)",

    opacity: (pct) => `Nepermatomumas (${pct}%)`,
    rotation: (deg) => `Pasukimas (${deg}°)`,

    positionPreset: "Pozicija",
    posTopLeft: "Viršuje kairėje",
    posCenter: "Centre",
    posTopRight: "Viršuje dešinėje",
    posBottomLeft: "Apačioje kairėje",
    posTileGrid: "Plytelių tinklelis",
    posBottomRight: "Apačioje dešinėje",
    posCustom: "Tinkintos koordinatės",
    customX: "Tinkintas X (pt)",
    customY: "Tinkintas Y (pt)",

    applyToPages: "Taikyti puslapiams",
    allPages: "Visiems puslapiams",
    oddPagesOnly: "Tik nelyginiams puslapiams",
    evenPagesOnly: "Tik lyginiams puslapiams",
    customRange: "Tinkintas diapazonas",
    customRangePlaceholder: "pvz., 1-3, 5",

    applyWatermark: "Taikyti vandens ženklą",
    applyingWatermark: "Taikomas vandens ženklas...",
    reset: "Atstatyti",

    digitalSignatureNotice: "Skaitmeninio parašo pranešimas",
    signatureWarning: "Aptiktas skaitmeninis parašas, kuris bus anuliuotas pakeitus puslapius.",
    verifiedBadge: "Vientisumas patvirtintas",
    watermarkSuccessSummary: (pages) => `Vandens ženklas pritaikytas ${pages} puslapi${pages !== 1 ? "uose" : "je"} • 100% per Web Worker`,
    downloadWatermarkedPdf: "Atsisiųsti PDF su vandens ženklu",
    adjustWatermark: "Koreguoti vandens ženklą",
    startOver: "Pradėti iš naujo"
  }
};
