import { SupportedLocale } from "../i18n/locales";
import { CATEGORY_TRANSLATIONS, ToolFamilyKey } from "./categories";
import { HOW_TO_STEPS } from "./howToSteps";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface ToolSeoContent {
  howToSteps: HowToStep[];
  faqs: FaqItem[];
  entityDefinition: string;
  category: string;
}

export function getToolSeoContent(slug: string, toolTitle: string, locale: string = "en"): ToolSeoContent {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const loc = locale.toLowerCase();

  let family: ToolFamilyKey = "pdf";
  if (normSlug.includes("dwg") || normSlug.includes("dxf")) {
    family = "cad";
  } else if (normSlug.includes("ai-to") || normSlug.includes("eps-to") || normSlug.includes("psd-to")) {
    family = "vector";
  } else if (normSlug.includes("srt") || normSlug.includes("vtt")) {
    family = "subtitles";
  } else if (normSlug.includes("pages-to") || normSlug.includes("numbers-to") || normSlug.includes("keynote-to")) {
    family = "apple";
  } else if (
    normSlug.includes("image") ||
    normSlug.includes("jpg") ||
    normSlug.includes("png") ||
    normSlug.includes("webp") ||
    normSlug.includes("heic") ||
    normSlug.includes("avif") ||
    normSlug.includes("ico") ||
    normSlug.includes("bmp") ||
    normSlug.includes("svg") ||
    normSlug.includes("crop") ||
    normSlug.includes("resize") ||
    normSlug.includes("rotate-image") ||
    normSlug.includes("flip") ||
    normSlug.includes("grayscale") ||
    normSlug.includes("invert") ||
    normSlug.includes("blur") ||
    normSlug.includes("strip-exif")
  ) {
    family = "image";
  } else if (
    normSlug.includes("audio") ||
    normSlug.includes("video") ||
    normSlug.includes("mp3") ||
    normSlug.includes("wav") ||
    normSlug.includes("flac") ||
    normSlug.includes("m4a") ||
    normSlug.includes("ogg") ||
    normSlug.includes("mp4") ||
    normSlug.includes("mov") ||
    normSlug.includes("avi") ||
    normSlug.includes("mkv") ||
    normSlug.includes("webm") ||
    normSlug.includes("wmv") ||
    normSlug.includes("mute") ||
    normSlug.includes("speed") ||
    normSlug.includes("volume")
  ) {
    family = "audio_video";
  }

  const validLocale = (loc in CATEGORY_TRANSLATIONS.pdf ? loc : "en") as SupportedLocale;
  const category = CATEGORY_TRANSLATIONS[family][validLocale] || CATEGORY_TRANSLATIONS[family]["en"];
  const howToSteps = HOW_TO_STEPS[validLocale] || HOW_TO_STEPS["en"];

  const isAr = loc === "ar";
  const isTr = loc === "tr";
  const isEs = loc.startsWith("es");
  const isPt = loc.startsWith("pt");
  const isDe = loc === "de";
  const isFr = loc === "fr";
  const isIt = loc === "it";
  const isSv = loc === "sv";
  const isDa = loc === "da";
  const isFi = loc === "fi";
  const isNo = loc === "no";
  const isNl = loc === "nl";
  const isPl = loc === "pl";
  const isCs = loc === "cs";
  const isHu = loc === "hu";
  const isRo = loc === "ro";
  const isBg = loc === "bg";
  const isEl = loc === "el";
  const isSk = loc === "sk";
  const isSl = loc === "sl";
  const isRu = loc === "ru";
  const isUk = loc === "uk";
  const isLv = loc === "lv";
  const isLt = loc === "lt";
  const isHe = loc === "he";
  const isHi = loc === "hi";
  const isId = loc === "id";
  const isMs = loc === "ms";
  const isTh = loc === "th";
  const isVi = loc === "vi";
  const isFil = loc === "fil";
  const isJa = loc === "ja";
  const isKo = loc === "ko";
  const isZh = loc.startsWith("zh");
  const isCa = loc === "ca";

  // 1. CAD & Engineering Tools
  if (normSlug.includes("dwg") || normSlug.includes("dxf")) {
    const entityDefinition = isAr
      ? `أداة ${toolTitle} من FileKit هي محرك تحويل متجهي فوري يعرض مخططات AutoCAD بتنسيقات عالمية مباشرة في متصفحك دون الحاجة إلى برنامج Autodesk.`
      : isTr
      ? `FileKit ${toolTitle}, Autodesk yazılımı gerektirmeden AutoCAD planlarını doğrudan tarayıcınızda evrensel formatlara dönüştüren anında vektör motorudur.`
      : isEs
      ? `FileKit ${toolTitle} es un motor de conversión vectorial que procesa planos de AutoCAD a formatos universales directamente en tu navegador sin requerir software de Autodesk.`
      : `FileKit ${toolTitle} is an instant vector conversion engine that renders AutoCAD blueprints into universal formats directly in your browser without requiring Autodesk software.`;


    const faqs: FaqItem[] = isAr
      ? [
          { question: "هل يمكنني تحويل ملفات AutoCAD DWG بدون تثبيت AutoCAD؟", answer: "نعم. يوفر FileKit معالجة متجهة أصلية داخل المتصفح، مما يتيح لك تحويل مخططات AutoCAD DWG وDXF إلى مستندات PDF متجهة عالية الدقة دون الحاجة لتراخيص Autodesk." },
          { question: "هل يتم الحفاظ على الطبقات وأوزان الخطوط بدقة؟", answer: "نعم. يحافظ FileKit على الإحداثيات الدقيقة وترتيب الطبقات والتعليقات التوضيحية أثناء التحويل." },
          { question: "هل مخططاتي الهندسية آمنة وخاصة؟", answer: "بالتأكيد. تتم معالجة جميع الملفات محلياً في متصفحك دون تخزين أو رفع إلى خوادم خارجية." }
        ]
      : isTr
      ? [
          { question: "AutoCAD yüklemeden AutoCAD DWG dosyalarını dönüştürebilir miyim?", answer: "Evet. FileKit, AutoCAD veya Autodesk lisansına ihtiyaç duymadan AutoCAD DWG ve DXF planlarını doğrudan tarayıcınızda yüksek çözünürlüklü vektör PDF belgelerine dönüştürür." },
          { question: "Hassas katmanlar ve çizgi kalınlıkları korunuyor mu?", answer: "Evet. FileKit, dönüştürme sırasında tam koordinatları, katman hiyerarşisini, metin notlarını ve çizim boyutlarını korur." },
          { question: "Mühendislik planlarım gizli tutuluyor mu?", answer: "Kesinlikle. FileKit dosyaları sıfır veri kaydı ile doğrudan tarayıcınızda işler. Çizimleriniz asla kaydedilmez." }
        ]
      : isEs
      ? [
          { question: "¿Puedo convertir archivos AutoCAD DWG sin tener instalado AutoCAD?", answer: "Sí. FileKit permite convertir planos DWG y DXF a documentos PDF vectoriales de alta resolución en el navegador sin licencias de Autodesk." },
          { question: "¿Se conservan las capas y grosores de línea con precisión?", answer: "Sí. FileKit conserva las coordenadas exactas, jerarquías de capas, textos y dimensiones de dibujo." },
          { question: "¿Mis planos de ingeniería se mantienen privados?", answer: "Totalmente. El procesamiento se realiza localmente en tu navegador sin almacenar tus archivos en servidores." }
        ]
      : [
          { question: "Can I convert AutoCAD DWG files without installing AutoCAD?", answer: "Yes. FileKit provides native in-browser vector rendering, allowing you to convert AutoCAD DWG and DXF blueprints into high-resolution vector PDF documents without AutoCAD or Autodesk licenses." },
          { question: "Are precision layers and line-weights preserved?", answer: "Yes. FileKit preserves exact coordinate spaces, line-weight hierarchies, text annotations, and drawing dimensions during vector compilation." },
          { question: "Are my engineering blueprints kept private?", answer: "Absolutely. FileKit processes files with zero data retention. Your proprietary engineering designs and blueprints are never stored or analyzed." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 2. Professional Vector & Adobe Formats (EPS, PSD, AI)
  if (normSlug.includes("eps") || normSlug.includes("psd") || normSlug.includes("/ai-")) {
    const entityDefinition = isAr
      ? `تقوم أداة ${toolTitle} بتحويل ملفات Photoshop (PSD) وIllustrator (AI) وPostScript (EPS) إلى صور جاهزة للويب ومستندات PDF متجهة.`
      : isTr
      ? `FileKit ${toolTitle}, profesyonel Adobe Photoshop (PSD), Illustrator (AI) ve PostScript (EPS) grafiklerini web için hazır görsellere ve vektör PDF'lere dönüştürür.`
      : `FileKit ${toolTitle} converts professional Adobe Photoshop (PSD), Illustrator (AI), and PostScript (EPS) graphics into web-ready images and vector PDFs.`;


    const faqs: FaqItem[] = isAr
      ? [
          { question: "كيف أفتح ملفات Adobe Illustrator (.ai) بدون اشتراك Creative Cloud؟", answer: "يمكنك استخدام FileKit لتحويل رسومات AI فوراً إلى مستندات PDF عالمية أو صور PNG شفافة دون الحاجة لاشتراك Adobe." },
          { question: "هل يحافظ تحويل PSD على طبقات الشفافية؟", answer: "نعم. يحافظ تحويل PSD إلى PNG على شفافية ألفا 32 بت دون إضافة خلفيات بيضاء أو سوداء غير مرغوبة." },
          { question: "هل هناك حد لحجم الملف لتحويلات المتجهات؟", answer: "يدعم FileKit ملفات تصل إلى 100 ميغابايت مع معالجة فورية داخل المتصفح." }
        ]
      : isTr
      ? [
          { question: "Creative Cloud olmadan Adobe Illustrator (.ai) dosyalarını nasıl açabilirim?", answer: "Adobe Creative Cloud aboneliğine ihtiyaç duymadan Adobe Illustrator (.ai) vektör grafiklerini anında PDF belgelerine veya şeffaf PNG görsellerine dönüştürmek için FileKit'i kullanabilirsiniz." },
          { question: "PSD dönüştürme şeffaf katmanları korur mu?", answer: "Evet. PSD'yi PNG'ye dönüştürmek, istenmeyen siyah veya beyaz arka planlar eklemeden net 32-bit RGBA alfa şeffaflığını korur." },
          { question: "Vektör dönüştürmeleri için dosya boyutu sınırı var mı?", answer: "FileKit, anında tarayıcı içi işleme ile 100 MB'a kadar vektör dosyalarını destekler." }
        ]
      : [
          { question: "How do I open Adobe Illustrator (.ai) files without Creative Cloud?", answer: "You can use FileKit to instantly convert Adobe Illustrator (.ai) vector graphics into universal PDF documents or transparent PNG images without an Adobe Creative Cloud subscription." },
          { question: "Does PSD conversion preserve transparent layers?", answer: "Yes. Converting PSD to PNG maintains crisp 32-bit RGBA alpha transparency without adding unwanted black or white backgrounds." },
          { question: "Is there any file size limit for vector conversions?", answer: "FileKit supports vector files up to 100MB with instantaneous in-browser and micro-daemon processing." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 3. Subtitles & Closed Captions (SRT, VTT)
  if (normSlug.includes("srt") || normSlug.includes("vtt")) {
    const entityDefinition = isAr
      ? `توفر أداة ${toolTitle} تحويل ترجمات 100% داخل المتصفح بين SubRip (.srt) وWebVTT (.vtt) مع مزامنة زمنية دقيقة بالملي ثانية.`
      : isTr
      ? `FileKit ${toolTitle}, milisaniye hassasiyetinde zaman damgası senkronizasyonu ile SubRip (.srt) ve WebVTT (.vtt) arasında %100 tarayıcı içi altyazı dönüştürme sağlar.`
      : `FileKit ${toolTitle} provides 100% in-browser subtitle conversion between SubRip (.srt) and WebVTT (.vtt) with millisecond-accurate timestamp synchronization.`;


    const faqs: FaqItem[] = isAr
      ? [
          { question: "ما الفرق بين تنسيقي SRT وWebVTT؟", answer: "يستخدم SRT الفواصل العشرية بالأجزاء من الألف (00:00:01,000)، بينما يستخدم WebVTT النقطة (00:00:01.000) مع ترويسة مخصصة لمشغلات الويب الحديثة." },
          { question: "هل يمكنني استخدام ترجمات WebVTT على مشغلات الفيديو HTML5؟", answer: "نعم. WebVTT هو التنسيق القياسي المعتمد من W3C المدعوم أصلاً في جميع المتصفحات الحديثة." },
          { question: "هل يتم رفع ملفات الترجمة إلى خوادم خارجية؟", answer: "كلا. تتم معالجة وتنسيق الترجمات محلياً 100% داخل متصفحك دون رفع أي بيانات." }
        ]
      : isTr
      ? [
          { question: "SRT ve WebVTT formatları arasındaki fark nedir?", answer: "SRT (SubRip) virgülle ayrılmış milisaniyeleri (00:00:01,000) ve sıralı numaralandırmayı kullanırken, WebVTT (Web Video Text Tracks) nokta ayırıcıları (00:00:01.000) kullanır ve HTML5 oynatıcılar için bir 'WEBVTT' başlığı ile başlar." },
          { question: "HTML5 web video oynatıcılarında WebVTT altyazılarını kullanabilir miyim?", answer: "Evet. WebVTT, tüm modern web tarayıcıları ve video etiketleri tarafından yerel olarak desteklenen resmi W3C standart formatıdır." },
          { question: "Altyazı dosyaları bir sunucuya yükleniyor mu?", answer: "Hayır. Tüm altyazı dönüştürmeleri ve zaman damgası biçimlendirmesi %100 yerel olarak tarayıcınızda gerçekleşir." }
        ]
      : [
          { question: "What is the difference between SRT and WebVTT format?", answer: "SRT (SubRip) uses comma-separated milliseconds (00:00:01,000) and sequential numbering, whereas WebVTT uses dot delimiters (00:00:01.000) and begins with a 'WEBVTT' header for HTML5 web players." },
          { question: "Can I use WebVTT subtitles on modern HTML5 web video players?", answer: "Yes. WebVTT is the official W3C standard format supported natively by all modern web browsers and video elements." },
          { question: "Are subtitle files uploaded to any server?", answer: "No. All subtitle conversions and timestamp formatting take place 100% locally in your browser memory." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 4. Apple iWork Suite (Pages, Numbers, Keynote)
  if (normSlug.includes("pages") || normSlug.includes("numbers") || normSlug.includes("keynote")) {
    const entityDefinition = isAr
      ? `تتيح أداة ${toolTitle} لمستخدمي Windows وAndroid فتح وتحويل ملفات Apple Pages وNumbers وKeynote بدون أجهزة Mac أو حسابات iCloud.`
      : isTr
      ? `FileKit ${toolTitle}, Windows, Android ve Linux kullanıcılarının Mac donanımı veya iCloud hesabı olmadan Apple Pages, Numbers ve Keynote dosyalarını açmasını ve dönüştürmesini sağlar.`
      : `FileKit ${toolTitle} enables Windows, Android, and Linux users to open and convert Apple Pages, Numbers, and Keynote files without Mac hardware or iCloud accounts.`;


    const faqs: FaqItem[] = isAr
      ? [
          { question: "كيف أفتح ملف .pages على نظام Windows؟", answer: "يمكنك تحويل مستندات Apple .pages إلى PDF أو Word (.docx) باستخدام FileKit مباشرة في متصفحك دون حساب Apple." },
          { question: "هل يمكن تحويل جداول Numbers إلى Excel مباشرة؟", answer: "نعم. يقوم FileKit بتحويل ملفات Numbers إلى صيغة .xlsx مع الحفاظ على البيانات والجداول." },
          { question: "هل تحويل المستندات آمن وخاص؟", answer: "نعم. تتم معالجة المستندات بأمان تام مع عدم الاحتفاظ بأي بيانات للحفاظ على سرية ملفاتك." }
        ]
      : isTr
      ? [
          { question: "Windows PC'de bir Apple .pages dosyasını nasıl açabilirim?", answer: "Apple .pages belgelerini, bir Apple Kimliği veya iCloud girişi olmadan doğrudan web tarayıcınızda FileKit kullanarak PDF veya Microsoft Word (.docx) formatına dönüştürebilirsiniz." },
          { question: "Apple Numbers dosyaları doğrudan Microsoft Excel'e dönüştürülebilir mi?", answer: "Evet. FileKit, Apple Numbers elektronik tablolarını hücreleri, formülleri ve tablo verilerini koruyarak standart .xlsx elektronik tablolarına dönüştürür." },
          { question: "Belge dönüştürme güvenli ve gizli mi?", answer: "Evet. Belgeler, verileriniz kaydedilmeden güvenli bir şekilde işlenir." }
        ]
      : [
          { question: "How do I open an Apple .pages file on a Windows PC?", answer: "You can convert Apple .pages documents into PDF or Microsoft Word (.docx) using FileKit directly in your web browser without an Apple ID or iCloud login." },
          { question: "Can Apple Numbers files be converted directly to Microsoft Excel?", answer: "Yes. FileKit converts Apple Numbers spreadsheets into standard .xlsx spreadsheets, preserving cells, formulas, and tabular data." },
          { question: "Is document conversion secure and private?", answer: "Yes. Documents are parsed securely with zero data retention, keeping your spreadsheets and presentations confidential." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 5. Image Tools & Converters (AVIF, HEIC, WEBP, PNG, JPG, BMP, ICO, TIFF)
  if (
    normSlug.includes("avif") ||
    normSlug.includes("heic") ||
    normSlug.includes("webp") ||
    normSlug.includes("image") ||
    normSlug.includes("png-to-") ||
    normSlug.includes("jpg-to-") ||
    normSlug.includes("jpeg-to-") ||
    normSlug.includes("bmp") ||
    normSlug.includes("ico") ||
    normSlug.includes("tiff")
  ) {

    const entityDefinition = isSv
      ? `FileKit ${toolTitle} konverterar bilder (WebP, AVIF, HEIC, PNG, JPG) 100% lokalt i din webbläsare utan att ladda upp filer till externa servrar.`
      : isAr
      ? `تقوم أداة ${toolTitle} بتحويل الصور عالية الكفاءة (WebP, AVIF, HEIC, PNG, JPG) محلياً 100% داخل متصفحك دون رفع الملفات إلى أي خادم.`
      : isTr
      ? `FileKit ${toolTitle}, yüksek verimli fotoğrafları, WebP, AVIF, HEIC, PNG ve JPG görsellerini üçüncü taraf sunuculara yüklemeden %100 yerel olarak tarayıcınızda dönüştürür.`
      : isEs
      ? `FileKit ${toolTitle} convierte imágenes WebP, AVIF, HEIC, PNG y JPG de forma 100% local en tu navegador sin subir archivos a servidores externos.`
      : `FileKit ${toolTitle} converts high-efficiency photos, WebP, AVIF, HEIC, PNG, and JPG images 100% locally in your browser memory without uploading to third-party servers.`;


    const faqs: FaqItem[] = isSv
      ? [
          { question: "Kan jag konvertera iPhone HEIC- och nya AVIF-bilder till standard JPG?", answer: "Ja. FileKit avkodar moderna AVIF- och Apple HEIC-bilder direkt i din webbläsare och sparar dem som universella högkvalitativa JPG- eller PNG-filer." },
          { question: "Laddas mina personliga bilder upp till en server?", answer: "Nej. FileKit bearbetar bildkonverteringar lokalt på din dator med hjälp av klientbaserad JavaScript och WebAssembly, vilket garanterar 100% sekretess." },
          { question: "Stöder bildkonverteraren batch-konvertering (flera filer samtidigt)?", answer: "Ja. Du kan ladda upp flera bildfiler samtidigt och konvertera dem parallellt direkt i webbläsaren." }
        ]
      : isAr
      ? [
          { question: "هل يمكنني تحويل صور iPhone HEIC وصيغ AVIF الحديثة إلى JPG قياسي؟", answer: "نعم. يقوم FileKit بفك ترميز صور AVIF وApple HEIC مباشرة داخل متصفحك وإنتاج ملفات JPG أو PNG قياسية عالية الجودة." },
          { question: "هل يتم رفع صوري الشخصية إلى خادم خارجي؟", answer: "كلا. تتم معالجة جميع الصور محلياً على جهازك باستخدام JavaScript وWebAssembly مما يضمن الخصوصية التامة 100%." },
          { question: "هل يدعم محول الصور التحويل المتعدد (دفعة واحدة)؟", answer: "نعم. يمكنك رفع عدة صور في نفس الوقت وتحويلها بالتوازي مباشرة في متصفحك." }
        ]
      : isTr
      ? [
          { question: "iPhone HEIC ve yeni nesil AVIF fotoğraflarını standart JPG'ye dönüştürebilir miyim?", answer: "Evet. FileKit, modern AVIF ve Apple HEIC görsel kapsayıcılarını doğrudan tarayıcınızın içinde çözer ve evrensel yüksek kaliteli JPG veya PNG dosyaları olarak çıktısını verir." },
          { question: "Kişisel fotoğraflarım bir sunucuya yükleniyor mu?", answer: "Hayır. FileKit, istemci tarafı JavaScript ve WebAssembly kullanarak görsel dönüştürmelerini bilgisayarınızda yerel olarak işler ve tam gizlilik sağlar." },
          { question: "Görsel dönüştürme toplu dönüştürmeyi destekliyor mu?", answer: "Evet. Aynı anda birden fazla görsel dosyası yükleyebilir ve bunları tarayıcınızda paralel olarak dönüştürebilirsiniz." }
        ]
      : isEs
      ? [
          { question: "¿Puedo convertir fotos HEIC de iPhone y AVIF a JPG estándar?", answer: "Sí. FileKit decodifica contenedores AVIF y HEIC directamente en tu navegador y genera archivos JPG o PNG de alta calidad." },
          { question: "¿Mis fotos personales se suben a algún servidor?", answer: "No. FileKit procesa las imágenes localmente en tu dispositivo mediante WebAssembly y JavaScript, garantizando privacidad absoluta." },
          { question: "¿La herramienta admite conversión por lotes?", answer: "Sí. Puedes subir múltiples imágenes simultáneamente y convertirlas en paralelo en tu navegador." }
        ]
      : [
          { question: "Can I convert iPhone HEIC and next-gen AVIF photos to standard JPG?", answer: "Yes. FileKit decodes modern AVIF and Apple HEIC image containers directly inside your browser and outputs universal high-quality JPG or PNG files." },
          { question: "Are my private personal photos uploaded to a server?", answer: "No. FileKit processes image conversions locally on your computer using client-side JavaScript and WebAssembly, ensuring complete privacy." },
          { question: "Does image conversion support batch conversion?", answer: "Yes. You can upload multiple image files simultaneously and convert them in parallel in your browser." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 6. Video & Audio Tools (MP4, MOV, MKV, WebM, AVI, GIF, Trim, MP3, WAV, FLAC)
  if (
    normSlug.includes("video") ||
    normSlug.includes("mp4") ||
    normSlug.includes("mov") ||
    normSlug.includes("mkv") ||
    normSlug.includes("webm") ||
    normSlug.includes("/avi-") ||
    normSlug.endsWith("-avi") ||
    normSlug.includes("audio") ||
    normSlug.includes("mp3") ||
    normSlug.includes("wav") ||
    normSlug.includes("flac") ||
    normSlug.includes("m4a") ||
    normSlug.includes("ogg")
  ) {
    const isAudioMerge = normSlug === "/merge-audio";

    const entityDefinition = isSv
      ? `FileKit ${toolTitle} är en säker, integritetsfokuserad motor som slår samman och konverterar ljud- och videofiler blixtsnabbt direkt i din webbläsare.`
      : isAr
      ? `تعد ${toolTitle} محركاً آمناً لمعالجة الوسائط يركز على الخصوصية مع الاستفادة من تسريع العتاد لتحويل وضغط ملفات الوسائط بسرعة فائقة.`
      : isTr
      ? `FileKit ${toolTitle}, medya dosyalarını dönüştürmek ve sıkıştırmak için donanım ivmesini kullanan gizlilik odaklı bir medya işleme motorudur.`
      : isEs
      ? `FileKit ${toolTitle} es un motor de procesamiento multimedia centrado en la privacidad para convertir, unir y comprimir archivos multimedia en tu navegador.`
      : isDe
      ? `FileKit ${toolTitle} ist eine datenschutzorientierte Medien-Engine zur schnellen Konvertierung, Zusammenführung und Komprimierung von Mediendateien direkt im Browser.`
      : isFr
      ? `FileKit ${toolTitle} est un moteur de traitement multimédia axé sur la confidentialité pour convertir, fusionner et compresser vos fichiers directement dans votre navigateur.`
      : isIt
      ? `FileKit ${toolTitle} è un motore multimediale incentrato sulla privacy per convertire, unire e comprimere file direttamente nel tuo browser.`
      : isPt
      ? `FileKit ${toolTitle} é um motor multimídia focado em privacidade para converter, juntar e comprimir arquivos diretamente no seu navegador.`
      : `FileKit ${toolTitle} is a privacy-first, in-browser media processing engine that converts, edits, and processes audio and video files locally with high performance.`;

    const faqs: FaqItem[] = isAudioMerge
      ? [
          { question: "How do I merge multiple audio tracks together?", answer: "Upload your MP3, WAV, or audio files into the workspace, arrange their sequence, and download the combined high-quality audio file." },
          { question: "Are audio tracks re-encoded with quality loss?", answer: "No. FileKit matches bitrates and sample rates to ensure lossless audio concatenation." },
          { question: "Is there a limit on audio file length?", answer: "You can combine standard podcast episodes, songs, and voice notes with zero restrictions." }
        ]
      : [
          { question: "Can I convert and compress video files directly in my browser?", answer: "Yes. FileKit uses WebAssembly to transcode and compress videos locally without requiring external software." },
          { question: "Will video compression degrade visual quality?", answer: "FileKit applies adaptive bitrate calculation and CRF rate control to minimize file size while maintaining sharp resolution." },
          { question: "Are my personal videos uploaded to a cloud server?", answer: "No. All media operations are executed 100% locally in your web browser sandbox for complete privacy." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  const entityDefinition = isSv
    ? `FileKit ${toolTitle} är ett snabbt och 100% privat webbläsarverktyg utformat för säker behandling direkt på din enhet utan filuppladdningar.`
    : isAr
    ? `أداة ${toolTitle} هي أداة سريعة وخاصة 100% داخل المتصفح مصممة لمعالجة المستندات بأمان على جهازك دون رفع أي ملفات.`
    : isTr
    ? `FileKit ${toolTitle}, dosya yüklemesi olmadan güvenli istemci tarafı işleme için tasarlanmış hızlı, %100 özel bir tarayıcı içi belge yardımcı programıdır.`
    : isEs
    ? `FileKit ${toolTitle} es una herramienta rápida y 100% privada en el navegador diseñada para un procesamiento seguro en tu dispositivo sin subir archivos.`
    : isDe
    ? `FileKit ${toolTitle} ist ein schnelles und 100% privates Browser-Tool für die sichere Verarbeitung direkt auf Ihrem Gerät ohne Datei-Uploads.`
    : isFr
    ? `FileKit ${toolTitle} est un utilitaire rapide et 100% privé s'exécutant dans votre navigateur pour un traitement sécurisé sur votre appareil sans téléversement.`
    : isIt
    ? `FileKit ${toolTitle} è un'utilità veloce e privata al 100% nel browser progettata per l'elaborazione sicura sul tuo dispositivo senza caricare file.`
    : isPt
    ? `FileKit ${toolTitle} é uma ferramenta rápida e 100% privada no navegador projetada para processamento seguro no seu dispositivo sem envio de arquivos.`
    : isPl
    ? `FileKit ${toolTitle} to szybkie i w 100% prywatne narzędzie działające w przeglądarce, zaprojektowane do bezpiecznego przetwarzania plików bez ich przesyłania.`
    : isRu
    ? `FileKit ${toolTitle} — это быстрый и на 100% конфиденциальный инструмент для безопасной обработки файлов прямо в браузере без загрузки на сервер.`
    : isJa
    ? `FileKit ${toolTitle} は、ファイルをサーバーに送信せず、ブラウザ上で100%安全に処理するために設計された高速ツールです。`
    : isKo
    ? `FileKit ${toolTitle}은 파일 업로드 없이 브라우저 내에서 안전하게 로컬 처리하는 빠르고 100% 비공개 도구입니다.`
    : isZh
    ? `FileKit ${toolTitle} 是一款快速、100% 私密的浏览器端工具，专为在设备上安全处理文件而设计，无需上传至服务器。`
    : `FileKit ${toolTitle} is a fast, 100% private in-browser document utility engineered for secure client-side processing without file uploads.`;


  const faqs: FaqItem[] = isSv
    ? [
        { question: "Är FileKit verkligen 100% gratis och privat?", answer: "Ja. FileKit körs lokalt i din webbläsare med hjälp av WebAssembly. Dina konfidentiella dokument lämnar aldrig din enhet." },
        { question: "Måste jag skapa ett konto eller ange en e-postadress?", answer: "Inget konto, ingen e-post och inget betalkort krävs. Du får direkt tillgång till verktyget utan hinder." },
        { question: "Stöder FileKit batch-bearbetning av flera filer samtidigt?", answer: "Ja. Du kan bearbeta flera filer samtidigt direkt i webbläsaren." }
      ]
    : isAr
    ? [
        { question: "هل FileKit مجاني وخاص 100% حقاً؟", answer: "نعم. يعمل FileKit مباشرة في متصفح الويب الخاص بك باستخدام WebAssembly. لا تغادر مستنداتك السرية جهاز الكمبيوتر الخاص بك مطلقاً." },
        { question: "هل أحتاج إلى إنشاء حساب أو تقديم بريد إلكتروني؟", answer: "لا يلزم إنشاء حساب أو إدخال بريد إلكتروني أو بطاقة ائتمان. يمكنك الوصول الفوري إلى الأداة دون أي عوائق." },
        { question: "هل يدعم FileKit المعالجة الجماعية للملفات؟", answer: "نعم. يمكنك معالجة ملفات متعددة في وقت واحد مباشرة داخل مساحة عمل متصفحك." }
      ]
    : isTr
    ? [
        { question: "FileKit gerçekten %100 ücretsiz ve gizli mi?", answer: "Evet. FileKit, WebAssembly kullanarak öncelikli olarak web tarayıcınızda çalışır. Gizli belgeleriniz yerel işlemler için asla bilgisayarınızdan ayrılmaz." },
        { question: "Bir hesap oluşturmam veya e-posta vermem gerekiyor mu?", answer: "Hesap, e-posta veya kredi kartı gerekmez. Araca sıfır engelle anında erişebilirsiniz." },
        { question: "FileKit toplu dosya işlemeyi destekliyor mu?", answer: "Evet. Tarayıcı çalışma alanınız içinde aynı anda birden çok dosyayı doğrudan işleyebilirsiniz." }
      ]
    : isEs
    ? [
        { question: "¿FileKit es realmente 100% gratuito y privado?", answer: "Sí. FileKit opera en tu navegador mediante WebAssembly. Tus documentos confidenciales nunca salen de tu ordenador." },
        { question: "¿Necesito crear una cuenta o ingresar un correo electrónico?", answer: "No se requiere cuenta, correo ni tarjeta de crédito. Obtienes acceso inmediato sin fricción." },
        { question: "¿FileKit admite procesamiento por lotes?", answer: "Sí. Puedes procesar múltiples archivos simultáneamente directamente en tu navegador." }
      ]
    : isDe
    ? [
        { question: "Ist FileKit wirklich 100% kostenlos und privat?", answer: "Ja. FileKit läuft direkt in Ihrem Webbrowser mittels WebAssembly. Ihre vertraulichen Dokumente verlassen niemals Ihr Gerät." },
        { question: "Muss ich ein Konto erstellen oder eine E-Mail angeben?", answer: "Kein Konto, keine E-Mail-Adresse und keine Kreditkarte erforderlich. Sie erhalten sofortigen, barrierefreien Zugriff." },
        { question: "Unterstützt FileKit die Stapelverarbeitung mehrerer Dateien?", answer: "Ja. Sie können mehrere Dateien gleichzeitig direkt in Ihrem Browser verarbeiten." }
      ]
    : isFr
    ? [
        { question: "FileKit est-il réellement 100% gratuit et confidentiel ?", answer: "Oui. FileKit s'exécute directement dans votre navigateur grâce à WebAssembly. Vos documents confidentiels ne quittent jamais votre ordinateur." },
        { question: "Dois-je créer un compte ou renseigner un e-mail ?", answer: "Aucun compte, aucun e-mail et aucune carte bancaire ne sont requis. L'accès aux outils est immédiat et sans friction." },
        { question: "FileKit prend-il en charge le traitement par lots de plusieurs fichiers ?", answer: "Oui. Vous pouvez traiter plusieurs fichiers simultanément directement dans votre navigateur." }
      ]
    : isPt
    ? [
        { question: "O FileKit é realmente 100% gratuito e privado?", answer: "Sim. O FileKit funciona diretamente no seu navegador usando WebAssembly. Os seus documentos confidenciais nunca saem do seu dispositivo." },
        { question: "Preciso criar uma conta ou fornecer um e-mail?", answer: "Nenhuma conta, e-mail ou cartão de crédito é necessário. Você tem acesso imediato à ferramenta." },
        { question: "O FileKit suporta processamento em lote de múltiplos arquivos?", answer: "Sim. Você pode processar vários arquivos simultaneamente direto no seu navegador." }
      ]
    : isIt
    ? [
        { question: "FileKit è davvero gratuito e privato al 100%?", answer: "Sì. FileKit funziona direttamente nel tuo browser tramite WebAssembly. I tuoi file riservati non lasciano mai il tuo dispositivo." },
        { question: "Devo creare un account o inserire un'e-mail?", answer: "Nessun account, indirizzo e-mail o carta di credito richiesti. Accesso immediato senza attriti." },
        { question: "FileKit supporta l'elaborazione in batch di più file?", answer: "Sì. Puoi elaborare più file contemporaneamente direttamente nel tuo browser." }
      ]
    : isPl
    ? [
        { question: "Czy FileKit jest naprawdę w 100% darmowy i prywatny?", answer: "Tak. FileKit działa bezpośrednio w Twojej przeglądarce przy użyciu technologii WebAssembly. Twoje poufne pliki nigdy nie opuszczają Twojego urządzenia." },
        { question: "Czy muszę zakładać konto lub podawać adres e-mail?", answer: "Nie jest wymagane konto, e-mail ani karta kredytowa. Masz natychmiastowy dostęp do narzędzia." },
        { question: "Czy FileKit obsługuje wsadowe przetwarzanie wielu plików jednocześnie?", answer: "Tak. Możesz przetwarzać wiele plików naraz bezpośrednio w oknie przeglądarki." }
      ]
    : isRu
    ? [
        { question: "FileKit действительно на 100% бесплатный и конфиденциальный?", answer: "Да. FileKit работает прямо в вашем веб-браузере с помощью WebAssembly. Ваши конфиденциальные файлы никогда не покидают ваше устройство." },
        { question: "Нужно ли создавать учетную запись или указывать email?", answer: "Ни учетная запись, ни email, ни банковская карта не требуются. Вы получаете мгновенный доступ к инструментам." },
        { question: "Поддерживает ли FileKit пакетную обработку файлов?", answer: "Да. Вы можете обрабатывать несколько файлов одновременно прямо в окне браузера." }
      ]
    : isJa
    ? [
        { question: "FileKitは本当に完全無料でプライバシーが保護されますか？", answer: "はい。FileKitはWebAssemblyを使用してブラウザ内で直接動作します。お客様の機密ファイルが外部サーバーに送信されることはありません。" },
        { question: "アカウント作成やメールアドレスの登録は必要ですか？", answer: "アカウント登録、メールアドレス、クレジットカード情報は一切不要です。どなたでもすぐにツールをご利用いただけます。" },
        { question: "複数のファイルを一度に一括処理できますか？", answer: "はい。複数のファイルをブラウザ上で同時に並行処理することが可能です。" }
      ]
    : isKo
    ? [
        { question: "FileKit은 정말로 100% 무료이며 안전한가요?", answer: "네. FileKit은 WebAssembly를 사용하여 웹 브라우저에서 직접 실행됩니다. 사용자의 기밀 문서는 결코 기기를 떠나지 않습니다." },
        { question: "계정을 생성하거나 이메일을 입력해야 하나요?", answer: "계정 생성, 이메일 주소, 신용카드 등록이 전혀 필요 없습니다. 즉시 도구를 사용할 수 있습니다." },
        { question: "여러 파일을 동시에 일괄 처리할 수 있나요?", answer: "네. 브라우저 작업 공간 내에서 여러 파일을 동시에 일괄 처리할 수 있습니다." }
      ]
    : isZh
    ? [
        { question: "FileKit 真的完全免费且保障隐私吗？", answer: "是的。FileKit 使用 WebAssembly 在您的浏览器中直接运行。您的机密文件绝不会离开您的设备或上传到云端。" },
        { question: "我需要创建帐户或提供电子邮件吗？", answer: "无需注册帐户、无需提供邮箱或信用卡信息。您可以无障碍即刻使用所有工具。" },
        { question: "FileKit 是否支持批量处理多个文件？", answer: "是的。您可以直接在浏览器工作区中同时上传并批量处理多个文件。" }
      ]
    : [
        { question: "Is FileKit really 100% free and private?", answer: "Yes. FileKit operates primarily in your web browser using WebAssembly. Your confidential documents never leave your computer for local operations." },
        { question: "Do I need to create an account or provide an email?", answer: "No account, email, or credit card is required. You get immediate access to the tool with zero friction." },
        { question: "Does FileKit support bulk batch conversions?", answer: "Yes. You can process multiple files simultaneously directly within your browser workspace." }
      ];

  return { category, entityDefinition, howToSteps, faqs };
}
