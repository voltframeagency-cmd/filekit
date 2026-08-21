import { SupportedLocale } from "../i18n/locales";
import { ToolFamilyKey } from "./categories";
import { FaqItem } from "./toolFaqs";

// High-intent FAQ knowledge base for all 7 families across all 39 supported locales
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
    ar: [
      { question: "هل أحتاج إلى تثبيت AutoCAD لتحويل ملفات DWG أو DXF؟", answer: "لا. يقوم FileKit بمعالجة مخططات AutoCAD DWG وDXF مباشرة في متصفحك دون الحاجة إلى تراخيص برامج باهظة الثمن." },
      { question: "هل يتم الحفاظ على الطبقات المتجهية وسمك الخطوط والأبعاد المعمارية؟", answer: "نعم. يتم عرض جميع الأشكال الهندسية والتعليقات التوضيحية والأبعاد بدقة متجهة متناهية." },
      { question: "هل يتم رفع مخططاتي الهندسية إلى خادم خارجي؟", answer: "مطلقاً. تتم معالجة ملفاتك محلياً داخل متصفحك ولا تغادر جهازك أبداً." }
    ],
    tr: [
      { question: "DWG veya DXF dosyalarını dönüştürmek için AutoCAD kurulu olmalı mı?", answer: "Hayır. FileKit, AutoCAD DWG ve DXF çizimlerini pahalı yazılımlara gerek kalmadan doğrudan tarayıcınızda işler." },
      { question: "Vektör katmanları, çizgi kalınlıkları ve mimari ölçüler korunur mu?", answer: "Evet. Tüm çizgi geometrileri, metin notları ve mimari boyutlar tam vektör doğruluğu ile işlenir." },
      { question: "Mühendislik çizimlerim üçüncü taraf bir sunucuya yükleniyor mu?", answer: "Asla. Dosyalarınız tarayıcınızda yerel olarak işlenir ve cihazınızdan asla ayrılmaz." }
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
};
