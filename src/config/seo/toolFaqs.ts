/**
 * toolFaqs.ts
 * 
 * High-intent Q&A knowledge base tailored for AEO (Answer Engine Optimization),
 * AIO (Google AI Overviews), and GEO (Generative Engine Optimization).
 */

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
    const category = isAr ? "CAD والهندسة" : isTr ? "CAD ve Mühendislik" : isEs ? "CAD e Ingeniería" : isDe ? "CAD & Ingenieurwesen" : isFr ? "CAD & Ingénierie" : isIt ? "CAD e Ingegneria" : isPt ? "CAD e Engenharia" : "CAD & Engineering";
    const entityDefinition = isAr
      ? `أداة ${toolTitle} من FileKit هي محرك تحويل متجهي فوري يعرض مخططات AutoCAD بتنسيقات عالمية مباشرة في متصفحك دون الحاجة إلى برنامج Autodesk.`
      : isTr
      ? `FileKit ${toolTitle}, Autodesk yazılımı gerektirmeden AutoCAD planlarını doğrudan tarayıcınızda evrensel formatlara dönüştüren anında vektör motorudur.`
      : isEs
      ? `FileKit ${toolTitle} es un motor de conversión vectorial que procesa planos de AutoCAD a formatos universales directamente en tu navegador sin requerir software de Autodesk.`
      : `FileKit ${toolTitle} is an instant vector conversion engine that renders AutoCAD blueprints into universal formats directly in your browser without requiring Autodesk software.`;

    const howToSteps: HowToStep[] = isAr
      ? [
          { title: "اختر ملف CAD", description: "قم برفع رسم AutoCAD DWG أو DXF مباشرة إلى مساحة العمل الآمنة." },
          { title: "التحقق من المقياس والدقة", description: "يقوم محرك المتجهات عالي الدقة بتحليل هندسة CAD والطبقات وسمك الخطوط بأقصى دقة." },
          { title: "تحميل الملف المتجهي", description: "احفظ ملف PDF المتجهي القابل للطباعة أو ملف DXF القياسي فوراً." }
        ]
      : isTr
      ? [
          { title: "CAD dosyanızı seçin", description: "AutoCAD DWG veya DXF çiziminizi doğrudan güvenli çalışma alanına yükleyin." },
          { title: "Ölçek ve hassasiyeti doğrulayın", description: "Yüksek hassasiyetli vektör motorumuz CAD geometrisini, katmanları ve çizgi kalınlıklarını tam doğrulukla işler." },
          { title: "Evrensel vektör dosyasını indirin", description: "Yazdırılabilir vektör PDF veya açık standart DXF dosyanızı anında kaydedin." }
        ]
      : isEs
      ? [
          { title: "Selecciona tu archivo CAD", description: "Sube tu plano AutoCAD DWG o DXF directamente al espacio de trabajo seguro." },
          { title: "Verifica escala y precisión", description: "Nuestro motor vectorial analiza geometría CAD, capas y grosores de línea con máxima fidelidad." },
          { title: "Descarga el archivo vectorial", description: "Guarda tu PDF vectorial imprimible o archivo DXF estándar al instante." }
        ]
      : [
          { title: "Select your CAD file", description: "Upload your AutoCAD DWG or DXF drawing directly into the secure workspace." },
          { title: "Verify scale and precision", description: "Our high-precision vector engine parses CAD geometry, layers, and line-weights with sub-pixel fidelity." },
          { title: "Download universal vector file", description: "Save your printable vector PDF or open-standard DXF file instantly." }
        ];

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
    const category = isAr ? "المتجهات والرسومات" : isTr ? "Vektör ve Grafikler" : isEs ? "Vector y Gráficos" : "Vector & Graphics";
    const entityDefinition = isAr
      ? `تقوم أداة ${toolTitle} بتحويل ملفات Photoshop (PSD) وIllustrator (AI) وPostScript (EPS) إلى صور جاهزة للويب ومستندات PDF متجهة.`
      : isTr
      ? `FileKit ${toolTitle}, profesyonel Adobe Photoshop (PSD), Illustrator (AI) ve PostScript (EPS) grafiklerini web için hazır görsellere ve vektör PDF'lere dönüştürür.`
      : `FileKit ${toolTitle} converts professional Adobe Photoshop (PSD), Illustrator (AI), and PostScript (EPS) graphics into web-ready images and vector PDFs.`;

    const howToSteps: HowToStep[] = isAr
      ? [
          { title: "ارفع العمل الفني أو المتجه", description: "اسحب ملف AI أو PSD أو EPS وأفلته في لوحة التحويل." },
          { title: "معالجة الطبقات والشفافية", description: "يقوم المحرك بتسطيح مسارات المتجهات والحفاظ على شفافية قناة ألفا بدقة عالية." },
          { title: "تصدير PNG أو PDF شفاف", description: "قم بتحميل ملفك النظيف الجاهز فوراً بدون أي علامات مائية." }
        ]
      : isTr
      ? [
          { title: "Vektör veya görseli yükleyin", description: "AI, PSD veya EPS dosyanızı dönüştürme alanına sürükleyip bırakın." },
          { title: "Katmanları ve şeffaflığı işleyin", description: "Motor, vektör yollarını işler ve alfa kanalı şeffaflığını yüksek doğrulukla korur." },
          { title: "Şeffaf PNG veya PDF indirin", description: "Temiz ve optimize edilmiş dosyanızı filigransız anında indirin." }
        ]
      : isEs
      ? [
          { title: "Sube tu archivo vectorial", description: "Arrastra y suelta tu archivo AI, PSD o EPS en el lienzo de conversión." },
          { title: "Procesa capas y transparencia", description: "El motor acopla las rutas vectoriales preservando la transparencia alfa con gran fidelidad." },
          { title: "Exporta PNG o PDF transparente", description: "Descarga tu archivo optimizado de inmediato sin marcas de agua." }
        ]
      : [
          { title: "Upload vector or artwork", description: "Drag and drop your AI, PSD, or EPS file into the conversion canvas." },
          { title: "Process layers and transparency", description: "The engine flattens vector paths and preserves alpha channel transparency with high fidelity." },
          { title: "Export transparent PNG or PDF", description: "Download your clean, web-ready asset immediately with zero watermarks." }
        ];

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
    const category = isAr ? "الترجمة والفيديو" : isTr ? "Altyazılar ve Video" : isEs ? "Subtítulos y Video" : "Subtitles & Video";
    const entityDefinition = isAr
      ? `توفر أداة ${toolTitle} تحويل ترجمات 100% داخل المتصفح بين SubRip (.srt) وWebVTT (.vtt) مع مزامنة زمنية دقيقة بالملي ثانية.`
      : isTr
      ? `FileKit ${toolTitle}, milisaniye hassasiyetinde zaman damgası senkronizasyonu ile SubRip (.srt) ve WebVTT (.vtt) arasında %100 tarayıcı içi altyazı dönüştürme sağlar.`
      : `FileKit ${toolTitle} provides 100% in-browser subtitle conversion between SubRip (.srt) and WebVTT (.vtt) with millisecond-accurate timestamp synchronization.`;

    const howToSteps: HowToStep[] = isAr
      ? [
          { title: "اختر ملف الترجمة", description: "اختر ملف .srt أو .vtt من جهازك." },
          { title: "تنسيق الطوابع الزمنية تلقائياً", description: "يقوم FileKit بتوحيد الفواصل الزمنية بالملي ثانية وإزالة رموز BOM غير المتوافقة." },
          { title: "تحميل الترجمة المحولة", description: "احصل على ملف الترجمة المتزامن الجاهز لـ YouTube أو VLC أو مشغلات HTML5." }
        ]
      : isTr
      ? [
          { title: "Altyazı dosyasını seçin", description: "Cihazınızdan .srt veya .vtt altyazı dosyanızı seçin." },
          { title: "Zaman damgalarını otomatik biçimlendirin", description: "FileKit milisaniye ayırıcılarını otomatik olarak normalize eder ve biçimlendirme bloklarını temizler." },
          { title: "Dönüştürülen altyazıyı indirin", description: "YouTube, VLC veya HTML5 video oynatıcılar için hazır senkronize altyazı dosyanızı alın." }
        ]
      : [
          { title: "Select subtitle file", description: "Choose your .srt or .vtt subtitle file from your device." },
          { title: "Auto-format timestamps", description: "FileKit automatically normalizes millisecond delimiters, strips Windows BOMs, and cleans styling blocks." },
          { title: "Download converted subtitles", description: "Get your synchronized caption file ready for YouTube, VLC, or HTML5 video players." }
        ];

    const faqs: FaqItem[] = isAr
      ? [
          { question: "ما الفرق بين تنسيقي SRT وWebVTT؟", answer: "يستخدم SRT الفواصل العشرية بالأجزاء من الألف (00:00:01,000)، بينما يستخدم WebVTT النقطة (00:00:01.000) مع ترويسة مخصصة لمشغلات الويب الحديثة." },
          { question: "هل يمكنني استخدام ترجمات WebVTT على مشغلات الفيديو HTML5؟", answer: "نعم. WebVTT هو التنسيق القياسي المعتمد من W3C المدعوم أصلاً في جميع المتصفحات الحديثة." }
        ]
      : isTr
      ? [
          { question: "SRT ve WebVTT formatları arasındaki fark nedir?", answer: "SRT (SubRip) virgülle ayrılmış milisaniyeleri (00:00:01,000) ve sıralı numaralandırmayı kullanırken, WebVTT (Web Video Text Tracks) nokta ayırıcıları (00:00:01.000) kullanır ve HTML5 oynatıcılar için bir 'WEBVTT' başlığı ile başlar." },
          { question: "HTML5 web video oynatıcılarında WebVTT altyazılarını kullanabilir miyim?", answer: "Evet. WebVTT, tüm modern web tarayıcıları ve video etiketleri tarafından yerel olarak desteklenen resmi W3C standart formatıdır." }
        ]
      : [
          { question: "What is the difference between SRT and WebVTT format?", answer: "SRT (SubRip) uses comma-separated milliseconds (00:00:01,000) and sequential numbering, whereas WebVTT uses dot delimiters (00:00:01.000) and begins with a 'WEBVTT' header for HTML5 web players." },
          { question: "Can I use WebVTT subtitles on modern HTML5 web video players?", answer: "Yes. WebVTT is the official W3C standard format supported natively by all modern web browsers and video elements." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 4. Apple iWork Suite (Pages, Numbers, Keynote)
  if (normSlug.includes("pages") || normSlug.includes("numbers") || normSlug.includes("keynote")) {
    const category = isAr ? "مستندات Apple iWork" : isTr ? "Apple iWork Belgeleri" : isEs ? "Documentos Apple iWork" : "Apple iWork Documents";
    const entityDefinition = isAr
      ? `تتيح أداة ${toolTitle} لمستخدمي Windows وAndroid فتح وتحويل ملفات Apple Pages وNumbers وKeynote بدون أجهزة Mac أو حسابات iCloud.`
      : isTr
      ? `FileKit ${toolTitle}, Windows, Android ve Linux kullanıcılarının Mac donanımı veya iCloud hesabı olmadan Apple Pages, Numbers ve Keynote dosyalarını açmasını ve dönüştürmesini sağlar.`
      : `FileKit ${toolTitle} enables Windows, Android, and Linux users to open and convert Apple Pages, Numbers, and Keynote files without Mac hardware or iCloud accounts.`;

    const howToSteps: HowToStep[] = isAr
      ? [
          { title: "ارفع مستند Apple", description: "اختر ملف .pages أو .numbers أو .key من جهازك." },
          { title: "تحليل محتوى المستند", description: "يقوم المحرك باستخراج النصوص والجداول والشرائح بدقة عالية." },
          { title: "تحميل PDF أو Word أو Excel", description: "احفظ مستندك بتنسيقات متوافقة مع Microsoft Office وGoogle Workspace." }
        ]
      : isTr
      ? [
          { title: "Apple belgesini yükleyin", description: ".pages, .numbers veya .key dosyanızı seçin." },
          { title: "Belge içeriğini ayrıştırın", description: "Motor, vektör tipografisini, tabloları ve sunum slaytlarını evrensel standartlara aktarır." },
          { title: "PDF, Word veya Excel olarak indirin", description: "Belgenizi Microsoft Office ve Google Workspace ile uyumlu evrensel formatlarda kaydedin." }
        ]
      : [
          { title: "Upload Apple document", description: "Select your .pages, .numbers, or .key file." },
          { title: "Parse document contents", description: "The engine extracts vector typography, tables, and presentation slides into universal standards." },
          { title: "Download PDF, Word, or Excel", description: "Save your document in universal formats compatible with Microsoft Office and Google Workspace." }
        ];

    const faqs: FaqItem[] = isAr
      ? [
          { question: "كيف أفتح ملف .pages على نظام Windows؟", answer: "يمكنك تحويل مستندات Apple .pages إلى PDF أو Word (.docx) باستخدام FileKit مباشرة في متصفحك دون حساب Apple." },
          { question: "هل يمكن تحويل جداول Numbers إلى Excel مباشرة؟", answer: "نعم. يقوم FileKit بتحويل ملفات Numbers إلى صيغة .xlsx مع الحفاظ على البيانات والجداول." }
        ]
      : isTr
      ? [
          { question: "Windows PC'de bir Apple .pages dosyasını nasıl açabilirim?", answer: "Apple .pages belgelerini, bir Apple Kimliği veya iCloud girişi olmadan doğrudan web tarayıcınızda FileKit kullanarak PDF veya Microsoft Word (.docx) formatına dönüştürebilirsiniz." },
          { question: "Apple Numbers dosyaları doğrudan Microsoft Excel'e dönüştürülebilir mi?", answer: "Evet. FileKit, Apple Numbers elektronik tablolarını hücreleri, formülleri ve tablo verilerini koruyarak standart .xlsx elektronik tablolarına dönüştürür." }
        ]
      : [
          { question: "How do I open an Apple .pages file on a Windows PC?", answer: "You can convert Apple .pages documents into PDF or Microsoft Word (.docx) using FileKit directly in your web browser without an Apple ID or iCloud login." },
          { question: "Can Apple Numbers files be converted directly to Microsoft Excel?", answer: "Yes. FileKit converts Apple Numbers spreadsheets into standard .xlsx spreadsheets, preserving cells, formulas, and tabular data." }
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
    const category = isSv
      ? "Bildkonverterare"
      : isDa
      ? "Billedkonvertering"
      : isNl
      ? "Beeldconverters"
      : isPl
      ? "Konwertery obrazów"
      : isRu
      ? "Конвертеры изображений"
      : isAr
      ? "محولات الصور"
      : isTr
      ? "Görsel Dönüştürücüler"
      : isEs
      ? "Convertidores de Imágenes"
      : isDe
      ? "Bild-Konverter"
      : isFr
      ? "Convertisseurs d'Images"
      : isIt
      ? "Convertitori di Immagini"
      : isPt
      ? "Conversores de Imagem"
      : "Image Converters";

    const entityDefinition = isSv
      ? `FileKit ${toolTitle} konverterar bilder (WebP, AVIF, HEIC, PNG, JPG) 100% lokalt i din webbläsare utan att ladda upp filer till externa servrar.`
      : isAr
      ? `تقوم أداة ${toolTitle} بتحويل الصور عالية الكفاءة (WebP, AVIF, HEIC, PNG, JPG) محلياً 100% داخل متصفحك دون رفع الملفات إلى أي خادم.`
      : isTr
      ? `FileKit ${toolTitle}, yüksek verimli fotoğrafları, WebP, AVIF, HEIC, PNG ve JPG görsellerini üçüncü taraf sunuculara yüklemeden %100 yerel olarak tarayıcınızda dönüştürür.`
      : isEs
      ? `FileKit ${toolTitle} convierte imágenes WebP, AVIF, HEIC, PNG y JPG de forma 100% local en tu navegador sin subir archivos a servidores externos.`
      : `FileKit ${toolTitle} converts high-efficiency photos, WebP, AVIF, HEIC, PNG, and JPG images 100% locally in your browser memory without uploading to third-party servers.`;

    const howToSteps: HowToStep[] = isSv
      ? [
          { title: "Välj ditt foto eller bild", description: "Dra och släpp din bildfil i webbläsarens säkra arbetsyta." },
          { title: "Bearbeta och konvertera i webbläsaren", description: "Vår lokala grafikmotor justerar färgprofiler, komprimeringsnivåer och bevarar genomskinlighet." },
          { title: "Spara bild i hög kvalitet", description: "Ladda ner din rena, optimerade bild direkt utan någon kvalitetsförlust." }
        ]
      : isAr
      ? [
          { title: "اختر الصورة أو الملف", description: "اسحب ملف الصورة وأفلته في مساحة العمل داخل المتصفح." },
          { title: "المعالجة والتحويل في المتصفح", description: "يقوم محرك Canvas داخل المتصفح بضبط ملفات الألوان ومستويات الضغط مع الحفاظ على قنوات الشفافية." },
          { title: "حفظ الصورة بجودة عالية", description: "قم بتحميل صورتك المحولة والنظيفة فوراً دون أي فقدان في الجودة." }
        ]
      : isTr
      ? [
          { title: "Fotoğrafınızı veya görselinizi seçin", description: "Görsel dosyanızı tarayıcı çalışma alanına sürükleyip bırakın." },
          { title: "Tarayıcıda işleyin ve dönüştürün", description: "Tarayıcı içi canvas motorumuz renk profillerini dönüştürür, sıkıştırma seviyelerini ayarlar ve alfa kanallarını korur." },
          { title: "Yüksek kaliteli görseli kaydedin", description: "Temiz ve optimize edilmiş görselinizi sıfır kalite kaybıyla anında indirin." }
        ]
      : isEs
      ? [
          { title: "Elige tu foto o imagen", description: "Arrastra y suelta tu archivo de imagen en el espacio de trabajo del navegador." },
          { title: "Procesa y convierte en el navegador", description: "Nuestro motor en el navegador convierte perfiles de color, ajusta compresión y conserva transparencias." },
          { title: "Guarda la imagen en alta calidad", description: "Descarga tu imagen limpia y optimizada al instante sin pérdida de calidad." }
        ]
      : [
          { title: "Choose your photo or image", description: "Drag and drop your image file into the browser workspace." },
          { title: "Render and transcode in browser", description: "Our in-browser canvas engine converts color profiles, adjusts compression levels, and preserves alpha channels." },
          { title: "Save high-quality image", description: "Download your clean, optimized image instantly with zero quality loss." }
        ];

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
    const category = isSv ? "Ljud och video"
      : isAr ? "الصوت والفيديو"
      : isTr ? "Ses ve Video"
      : isEs ? "Audio y Video"
      : isDe ? "Audio und Video"
      : isFr ? "Audio et Vidéo"
      : isIt ? "Audio e Video"
      : isPt ? "Áudio e Vídeo"
      : isPl ? "Audio i Wideo"
      : isRu ? "Аудио и Видео"
      : isJa ? "音声・動画"
      : isKo ? "오디오 및 비디오"
      : isZh ? "音频与视频"
      : "Audio & Video";

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
      : isPl
      ? `FileKit ${toolTitle} to bezpieczny silnik multimedialny chroniący prywatność, umożliwiający łączenie, konwersję i kompresję plików bezpośrednio w przeglądarce.`
      : isRu
      ? `FileKit ${toolTitle} — это конфиденциальный инструмент для мгновенного объединения, конвертации и сжатия медиафайлов прямо в браузере.`
      : isJa
      ? `FileKit ${toolTitle} は、ブラウザ上でメディアファイルを安全に結合・変換・圧縮するプライバシー重視のツールです。`
      : isKo
      ? `FileKit ${toolTitle}은 브라우저에서 안전하게 미디어 파일을 병합, 변환, 압축하는 비공개 처리 도구입니다.`
      : isZh
      ? `FileKit ${toolTitle} 是一款注重隐私的媒体处理工具，可在浏览器中安全快速地合并、转换和压缩多媒体文件。`
      : `FileKit ${toolTitle} is a privacy-first media processing engine utilizing zero-CPU stream copy and hardware acceleration to convert and compress media files.`;

    const howToSteps: HowToStep[] = isSv
      ? (isAudioMerge ? [
          { title: "Välj dina ljudfiler", description: "Välj flera ljudklipp från datorn eller telefonen som du vill slå samman." },
          { title: "Ordna och justera ordningsföljd", description: "Ordna dina spår i önskad uppspelningssekvens direkt i webbläsaren." },
          { title: "Spara sammanslagen ljudfil", description: "Ladda ner din sammanfogade ljudfil i hög kvalitet direkt." }
        ] : [
          { title: "Ladda upp ljud eller video", description: "Välj ditt medieklipp från datorn eller telefonen." },
          { title: "Optimera kodekar och bithastigheter", description: "Vår motor utför snabb ström-kopiering eller högeffektiv kodning." },
          { title: "Spara optimerad media", description: "Ladda ner din komprimerade, trimmade eller konverterade media direkt." }
        ])
      : isDe
      ? (isAudioMerge ? [
          { title: "Audiodateien auswählen", description: "Wählen Sie mehrere Audioclips von Ihrem Computer oder Telefon aus." },
          { title: "Reihenfolge anordnen", description: "Ordnen Sie Ihre Spuren direkt im Browser in der gewünschten Reihenfolge an." },
          { title: "Zusammengefügte Audiodatei speichern", description: "Laden Sie Ihre fertige Audiodatei sofort in bester Qualität herunter." }
        ] : [
          { title: "Audio oder Video hochladen", description: "Wählen Sie Ihren Medienclip von Ihrem Computer oder Telefon." },
          { title: "Codecs und Bitraten optimieren", description: "Unsere Engine führt schnelles Stream-Copying oder effiziente Kodierung aus." },
          { title: "Optimierte Medien speichern", description: "Laden Sie Ihre komprimierte oder konvertierte Mediendatei sofort herunter." }
        ])
      : isFr
      ? (isAudioMerge ? [
          { title: "Sélectionnez vos fichiers audio", description: "Choisissez plusieurs pistes audio depuis votre ordinateur ou téléphone." },
          { title: "Organisez l'ordre de lecture", description: "Réorganisez vos pistes dans l'ordre souhaité directement dans votre navigateur." },
          { title: "Enregistrez le fichier fusionné", description: "Téléchargez immédiatement votre fichier audio fusionné en haute qualité." }
        ] : [
          { title: "Sélectionnez votre média", description: "Choisissez votre clip audio ou vidéo depuis votre appareil." },
          { title: "Optimisez codecs et débits", description: "Notre moteur applique un traitement ultra-rapide sans perte de qualité." },
          { title: "Enregistrez le média optimisé", description: "Téléchargez immédiatement votre média compressé ou converti." }
        ])
      : isEs
      ? (isAudioMerge ? [
          { title: "Selecciona tus archivos de audio", description: "Elige múltiples pistas de audio desde tu dispositivo para unirlas." },
          { title: "Organiza el orden de reproducción", description: "Ordena tus pistas en la secuencia deseada directamente en tu navegador." },
          { title: "Guarda el audio combinado", description: "Descarga tu archivo de audio fusionado en alta calidad al instante." }
        ] : [
          { title: "Sube audio o video", description: "Selecciona tu clip multimedia desde tu ordenador o teléfono." },
          { title: "Optimiza códecs y velocidad", description: "Nuestro motor procesa el archivo con máxima velocidad y fidelidad." },
          { title: "Guarda el medio optimizado", description: "Descarga tu archivo comprimido o convertido de inmediato." }
        ])
      : isPt
      ? (isAudioMerge ? [
          { title: "Selecione seus arquivos de áudio", description: "Escolha múltiplos clipes de áudio do seu dispositivo que deseja juntar." },
          { title: "Organize a ordem de reprodução", description: "Ordene as faixas na sequência desejada diretamente no seu navegador." },
          { title: "Salve o áudio combinado", description: "Baixe seu arquivo de áudio combinado com alta qualidade instantaneamente." }
        ] : [
          { title: "Envie áudio ou vídeo", description: "Selecione seu clipe de mídia do computador ou celular." },
          { title: "Otimize codecs e taxas de bits", description: "Nosso motor executa cópia direta ou codificação de alta eficiência." },
          { title: "Salve a mídia otimizada", description: "Baixe sua mídia compactada ou convertida instantaneamente." }
        ])
      : isIt
      ? (isAudioMerge ? [
          { title: "Seleziona i tuoi file audio", description: "Scegli più clip audio dal computer o dal telefono che desideri unire." },
          { title: "Disponi l'ordine di riproduzione", description: "Organizza le tracce nella sequenza desiderata direttamente nel browser." },
          { title: "Salva il file audio unito", description: "Scarica subito il tuo file audio unito in alta qualità." }
        ] : [
          { title: "Carica audio o video", description: "Seleziona il tuo clip multimediale dal computer o telefono." },
          { title: "Ottimizza codec e bitrate", description: "Il nostro motore esegue copie di flusso istantanee o codifiche efficienti." },
          { title: "Salva i file multimediali", description: "Scarica subito il tuo file multimediale compresso o convertito." }
        ])
      : isPl
      ? (isAudioMerge ? [
          { title: "Wybierz pliki audio", description: "Wybierz kilka klipów audio z komputera lub telefonu, które chcesz połączyć." },
          { title: "Ustaw kolejność odtwarzania", description: "Ułóż ścieżki w żądanej kolejności bezpośrednio w przeglądarce." },
          { title: "Zapisz połączony plik audio", description: "Pobierz połączony plik audio w najwyższej jakości natychmiast." }
        ] : [
          { title: "Prześlij audio lub wideo", description: "Wybierz klip multimedialny ze swojego urządzenia." },
          { title: "Zoptymalizuj kodeki i bitrate", description: "Nasz silnik wykonuje szybkie kopiowanie strumienia lub wydajne kodowanie." },
          { title: "Zapisz zoptymalizowane media", description: "Pobierz skompresowany lub przekonwertowany plik natychmiast." }
        ])
      : isRu
      ? (isAudioMerge ? [
          { title: "Выберите аудиофайлы", description: "Выберите несколько аудиозаписей на компьютере или телефоне для объединения." },
          { title: "Настройте порядок воспроизведения", description: "Расставьте дорожки в нужной последовательности прямо в браузере." },
          { title: "Сохраните объединенный файл", description: "Скачайте готовый аудиофайл без потери качества мгновенно." }
        ] : [
          { title: "Загрузите аудио или видео", description: "Выберите медиаклип на вашем компьютере или телефоне." },
          { title: "Оптимизируйте кодеки и битрейт", description: "Наш движок выполняет прямое копирование потоков или быстрое сжатие." },
          { title: "Сохраните оптимизированный файл", description: "Скачайте готовый медиафайл мгновенно." }
        ])
      : isJa
      ? (isAudioMerge ? [
          { title: "音声ファイルを選択", description: "結合したい複数の音声クリップをデバイスから選択します。" },
          { title: "再生順序を調整", description: "ブラウザ上でトラックを好みの順序に並べ替えます。" },
          { title: "結合した音声ファイルを保存", description: "高音質のまま結合された音声ファイルを即座にダウンロードします。" }
        ] : [
          { title: "音声または動画をアップロード", description: "デバイスからメディアクリップを選択します。" },
          { title: "コーデックとビットレートの最適化", description: "劣化のないストリームコピーまたは高効率エンコードを実行します。" },
          { title: "最適化されたメディアを保存", description: "変換・圧縮されたメディアを即座にダウンロードします。" }
        ])
      : isKo
      ? (isAudioMerge ? [
          { title: "오디오 파일 선택", description: "병합할 여러 오디오 클립을 기기에서 선택합니다." },
          { title: "재생 순서 정렬", description: "브라우저에서 원하는 재생 순서대로 트랙을 배치합니다." },
          { title: "병합된 오디오 파일 저장", description: "고품질로 병합된 오디오 파일을 즉시 다운로드합니다." }
        ] : [
          { title: "오디오 또는 비디오 선택", description: "컴퓨터 또는 스마트폰에서 미디어 클립을 선택합니다." },
          { title: "코덱 및 비트레이트 최적화", description: "품질 손실 없는 빠른 스트림 복사 또는 고효율 인코딩을 수행합니다." },
          { title: "최적화된 미디어 저장", description: "압축 또는 변환된 미디어 파일을 즉시 다운로드합니다." }
        ])
      : isZh
      ? (isAudioMerge ? [
          { title: "选择您的音频文件", description: "从电脑或手机中选择要合并的多个音频剪辑。" },
          { title: "排列播放顺序", description: "直接在浏览器中按所需顺序排列音频轨道。" },
          { title: "保存合并后的音频", description: "立即以高音质下载合并后的音频文件。" }
        ] : [
          { title: "选择音频或视频", description: "从您的设备中选择要处理的多媒体文件。" },
          { title: "优化编解码器与比特率", description: "执行极速无损流复制或高效率视频编码。" },
          { title: "保存优化后的媒体文件", description: "立即下载压缩或转换后的媒体文件。" }
        ])
      : isAr
      ? [
          { title: "ارفع ملف الصوت أو الفيديو", description: "اختر مقطع الوسائط من جهاز الكمبيوتر أو الهاتف الخاص بك." },
          { title: "تحسين برامج الترميز ومعدل البت", description: "يقوم محركنا بتبديل الحاويات بسرعة فائقة أو الترميز عالي الكفاءة." },
          { title: "حفظ الوسائط المحسنة", description: "قم بتحميل ملف الوسائط المضغوط أو المقصوص أو المحول على الفور." }
        ]
      : isTr
      ? [
          { title: "Ses veya videoyu yükleyin", description: "Masaüstünüzden veya telefonunuzdan medya klibinizi seçin." },
          { title: "Kodekleri ve bit hızlarını optimize edin", description: "Motorumuz hızlı akış kopyalama veya yüksek verimli kodlama yürütür." },
          { title: "Optimize edilmiş medyayı kaydedin", description: "Sıkıştırılmış, kırpılmış veya dönüştürülmüş medyanızı anında indirin." }
        ]
      : [
          { title: "Upload audio or video", description: "Select your media clip from your desktop or phone." },
          { title: "Optimize codecs and bitrates", description: "Our engine executes fast stream-copy container swapping or high-efficiency encoding." },
          { title: "Save optimized media", description: "Download your compressed, trimmed, or converted media instantly." }
        ];

    const faqs: FaqItem[] = isSv
      ? (isAudioMerge ? [
          { question: "Kan jag slå samman ljudfiler i olika format (t.ex. MP3 och WAV)?", answer: "Ja. FileKit avkodar olika ljudformat direkt i webbläsaren och slår samman dem till ett enhetligt spår i hög kvalitet." },
          { question: "Laddas mina privata ljudinspelningar upp till en server?", answer: "Nej. Ljudbehandling och sammanslagning sker 100% lokalt i din webbläsares minne utan att filer skickas till externa servrar." }
        ] : [
          { question: "Minskar mediekonvertering den visuella kvaliteten?", answer: "För kompatibla behållare använder FileKit direkt strömkopiering (-c copy) på under 1 sekund med 100% noll kvalitetsförlust." },
          { question: "Kan jag komprimera videor för Discord, Gmail eller WhatsApp?", answer: "Ja. FileKit beräknar exakt bithastighet för att säkerställa att din video inte överskrider filgränserna." }
        ])
      : isDe
      ? (isAudioMerge ? [
          { question: "Kann ich Audiodateien unterschiedlicher Formate (z. B. MP3 und WAV) zusammenfügen?", answer: "Ja. FileKit decodiert verschiedene Audioformate direkt im Browser und fügt sie zu einer einheitlichen, hochwertigen Spur zusammen." },
          { question: "Werden meine privaten Audioaufnahmen auf einen Server hochgeladen?", answer: "Nein. Die Verarbeitung erfolgt zu 100% lokal im Speicher Ihres Browsers ohne externe Übertragung." }
        ] : [
          { question: "Verringert die Medienkonvertierung die Qualität?", answer: "Bei kompatiblen Formaten nutzt FileKit Stream-Copying in unter 1 Sekunde bei 100% verlustfreier Qualität." },
          { question: "Kann ich Videos für Discord, Gmail oder WhatsApp komprimieren?", answer: "Ja. FileKit passt die Bitrate exakt an, damit Grenzwerte wie 8MB, 10MB oder 25MB eingehalten werden." }
        ])
      : isFr
      ? (isAudioMerge ? [
          { question: "Puis-je fusionner des fichiers audio de formats différents (ex. MP3 et WAV) ?", answer: "Oui. FileKit décode différents formats audio directement dans le navigateur et les fusionne en une piste unique de haute qualité." },
          { question: "Mes enregistrements audio privés sont-ils envoyés sur un serveur ?", answer: "Non. Le traitement audio s'effectue à 100% localement dans votre navigateur sans aucun téléversement." }
        ] : [
          { question: "La conversion réduit-elle la qualité visuelle ?", answer: "Pour les formats compatibles, FileKit utilise le mode de copie directe en moins d'une seconde sans perte de qualité." },
          { question: "Puis-je compresser des vidéos pour Discord, Gmail ou WhatsApp ?", answer: "Oui. FileKit calcule le débit binaire exact pour respecter les limites de 8 Mo, 10 Mo ou 25 Mo." }
        ])
      : isEs
      ? (isAudioMerge ? [
          { question: "¿Puedo unir archivos de audio de diferentes formatos (ej. MP3 y WAV)?", answer: "Sí. FileKit decodifica diferentes formatos directamente en el navegador y los combina en una pista uniforme de alta calidad." },
          { question: "¿Mis grabaciones de audio privadas se suben a un servidor?", answer: "No. El procesamiento se realiza 100% de forma local en tu navegador sin enviar archivos a servidores externos." }
        ] : [
          { question: "¿La conversión de video reduce la calidad visual?", answer: "Para formatos compatibles, FileKit realiza copias directas de flujo en menos de 1 segundo sin pérdida de calidad." },
          { question: "¿Puedo comprimir videos para cumplir con los límites de Discord, Gmail o WhatsApp?", answer: "Sí. FileKit ajusta la tasa de bits matemáticamente para no exceder límites de 8MB, 10MB o 25MB." }
        ])
      : isPt
      ? (isAudioMerge ? [
          { question: "Posso juntar arquivos de áudio de formatos diferentes (ex.: MP3 e WAV)?", answer: "Sim. O FileKit decodifica múltiplos formatos diretamente no navegador e os une em uma única faixa com alta qualidade." },
          { question: "Minhas gravações de áudio privadas são enviadas para um servidor?", answer: "Não. O processamento de áudio ocorre 100% localmente na memória do seu navegador sem envio de arquivos." }
        ] : [
          { question: "A conversão de vídeo reduz a qualidade visual?", answer: "Para formatos compatíveis, o FileKit usa cópia direta de fluxo em menos de 1 segundo sem qualquer perda de qualidade." },
          { question: "Posso comprimir vídeos para o limite do Discord, Gmail ou WhatsApp?", answer: "Sim. O FileKit calcula a taxa de bits exata para garantir que seu vídeo não ultrapasse os limites de tamanho." }
        ])
      : isIt
      ? (isAudioMerge ? [
          { question: "Posso unire file audio di formati diversi (es. MP3 e WAV)?", answer: "Sì. FileKit decodifica diversi formati direttamente nel browser e li unisce in un'unica traccia di alta qualità." },
          { question: "Le mie registrazioni audio private vengono caricate su un server?", answer: "No. L'elaborazione avviene al 100% localmente nella memoria del browser senza caricamenti esterni." }
        ] : [
          { question: "La conversione video riduce la qualità visiva?", answer: "Per i formati compatibili, FileKit utilizza la copia di flusso istantanea in meno di 1 secondo con zero perdite di qualità." },
          { question: "Posso comprimere video per i limiti di Discord, Gmail o WhatsApp?", answer: "Sì. FileKit calcola il bitrate esatto per garantire che il video non superi i limiti di dimensione." }
        ])
      : isPl
      ? (isAudioMerge ? [
          { question: "Czy mogę łączyć pliki audio w różnych formatach (np. MP3 i WAV)?", answer: "Tak. FileKit dekoduje różne formaty bezpośrednio w przeglądarce i łączy je w jedną ścieżkę o wysokiej jakości." },
          { question: "Czy moje prywatne nagrania audio są przesyłane na serwer?", answer: "Nie. Przetwarzanie audio odbywa się w 100% lokalnie w pamięci przeglądarki bez wysyłania plików na serwer." }
        ] : [
          { question: "Czy konwersja wideo obniża jakość obrazu?", answer: "W przypadku zgodnych formatów FileKit używa natychmiastowego kopiowania strumienia bez żadnej utraty jakości." },
          { question: "Czy mogę skompresować wideo dla Discorda, Gmaila lub WhatsAppa?", answer: "Tak. FileKit precyzyjnie dopasowuje bitrate, aby plik nie przekroczył limitów 8MB, 10MB lub 25MB." }
        ])
      : isRu
      ? (isAudioMerge ? [
          { question: "Можно ли объединять аудиофайлы разных форматов (например, MP3 и WAV)?", answer: "Да. FileKit декодирует различные аудиоформаты прямо в браузере и объединяет их в единую высококачественную дорожку." },
          { question: "Загружаются ли мои личные аудиозаписи на сервер?", answer: "Нет. Вся обработка происходит на 100% локально в памяти вашего браузера без передачи на внешние серверы." }
        ] : [
          { question: "Снижает ли конвертация качество видео?", answer: "Для совместимых форматов FileKit использует прямое копирование потока менее чем за 1 секунду без потери качества." },
          { question: "Можно ли сжать видео под лимиты Discord, Gmail или WhatsApp?", answer: "Да. FileKit рассчитывает точный битрейт, чтобы видео не превышало лимиты 8MB, 10MB или 25MB." }
        ])
      : isJa
      ? (isAudioMerge ? [
          { question: "異なる形式の音声ファイル（MP3とWAVなど）を結合できますか？", answer: "はい。FileKitはブラウザ内で直接様々な音声形式をデコードし、劣化のない単一のトラックに結合します。" },
          { question: "個人の音声データがサーバーにアップロードされることはありますか？", answer: "いいえ。音声の処理と結合はブラウザのメモリ内で100%ローカルに実行され、外部サーバーに送信されることはありません。" }
        ] : [
          { question: "動画変換によって画質が低下しますか？", answer: "互換性のあるコンテナの場合、FileKitは1秒未満の高速ストリームコピーにより画質の劣化ゼロで処理します。" },
          { question: "Discord、Gmail、WhatsAppの制限に合わせて動画を圧縮できますか？", answer: "はい。FileKitはビットレートを自動計算し、8MB、10MB、25MBの制限を超えないよう圧縮します。" }
        ])
      : isKo
      ? (isAudioMerge ? [
          { question: "서로 다른 형식의 오디오 파일(예: MP3 및 WAV)을 병합할 수 있나요?", answer: "네. FileKit은 브라우저에서 직접 다양한 오디오 형식을 디코딩하여 고품질의 단일 트랙으로 병합합니다." },
          { question: "개인 오디오 녹음 파일이 서버에 업로드되나요?", answer: "아니요. 오디오 처리 및 병합은 브라우저 메모리 내에서 100% 로컬로 실행되며 서버로 전송되지 않습니다." }
        ] : [
          { question: "비디오 변환 시 화질이 저하되나요?", answer: "호환되는 포맷의 경우, FileKit은 1초 이내의 빠른 스트림 복사를 통해 화질 손실 없이 포맷을 변환합니다." },
          { question: "Discord, Gmail, WhatsApp 크기 제한에 맞게 비디오를 압축할 수 있나요?", answer: "네. FileKit은 정확한 비트레이트를 계산하여 8MB, 10MB, 25MB 용량 제한을 초과하지 않도록 압축합니다." }
        ])
      : isZh
      ? (isAudioMerge ? [
          { question: "我可以合并不同格式的音频文件（如 MP3 和 WAV）吗？", answer: "可以。FileKit 直接在浏览器中解码不同的音频格式，并将其无缝合并为一条高音质轨道。" },
          { question: "我的私人录音文件会被上传到服务器吗？", answer: "不会。音频处理与合并完全在您的浏览器内存中本地完成，绝不会上传到任何外部服务器。" }
        ] : [
          { question: "视频转换会降低画质吗？", answer: "对于兼容的格式，FileKit 采用极速流复制模式，在不到 1 秒内完成容器转换且画质 100% 零损失。" },
          { question: "我可以将视频压缩到 Discord、Gmail 或微信的文件大小限制内吗？", answer: "可以。FileKit 采用精准的比特率计算，确保压缩后的视频绝不超过指定的容量上限。" }
        ])
      : isAr
      ? [
          { question: "هل يقلل تحويل الفيديو من جودة الصورة؟", answer: "بالنسبة للحاويات المتوافقة، يستخدم FileKit وضع النسخ المباشر (-c copy) لتبديل التنسيق في أقل من ثانية واحدة مع الحفاظ على 100% من الجودة الأصلية بدون أي فقدان." },
          { question: "هل يمكنني ضغط مقاطع الفيديو لتناسب حدود Discord أو Gmail أو WhatsApp؟", answer: "نعم. يتيح FileKit استهداف حجم محدد بالبت لضمان عدم تجاوز الملف لحدود 8MB أو 10MB أو 25MB." }
        ]
      : isTr
      ? [
          { question: "Video dönüştürme görsel kaliteyi düşürür mü?", answer: "Uyumlu kapsayıcılar için FileKit, görsel veya ses kalitesinde %100 sıfır kayıpla 1 saniyenin altında kapsayıcı değiştirmek için anında akış kopyalama (-c copy) modunu kullanır." },
          { question: "Videoları Discord, Gmail veya WhatsApp sınırlarına uyacak şekilde sıkıştırabilir miyim?", answer: "Evet. FileKit, sıkıştırılmış videonuzun 8MB, 10MB veya 25MB dosya sınırlarını asla aşmamasını sağlamak için hedefli bit hızı hesaplaması içerir." }
        ]
      : [
          { question: "Does video conversion reduce visual quality?", answer: "For compatible containers, FileKit uses instant stream-copy (-c copy) mode to swap containers in under 1 second with 100% zero loss in visual or audio quality." },
          { question: "Can I compress videos to meet exact Discord, Gmail, or WhatsApp limits?", answer: "Yes. FileKit features mathematical bitrate targeting to ensure your compressed video never exceeds 8MB, 10MB, or 25MB file limits." }
        ];

    return { category, entityDefinition, howToSteps, faqs };
  }

  // 7. Generic PDF & Document Suite Default
  const category = isSv ? "PDF & Dokumentverktyg"
    : isAr ? "أدوات PDF والمستندات"
    : isTr ? "PDF ve Belge Yardımcı Programları"
    : isEs ? "Utilidades de PDF y Documentos"
    : isDe ? "PDF & Dokumenten-Werkzeuge"
    : isFr ? "Utilitaires PDF et Documents"
    : isIt ? "Utilità PDF e Documenti"
    : isPt ? "Utilitários de PDF e Documentos"
    : isPl ? "Narzędzia do PDF i Dokumentów"
    : isRu ? "Инструменты для PDF и документов"
    : isJa ? "PDF・ドキュメントツール"
    : isKo ? "PDF 및 문서 유틸리티"
    : isZh ? "PDF 与文档工具"
    : "PDF & Document Utilities";

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

  const howToSteps: HowToStep[] = isSv
    ? [
        { title: "Välj din fil", description: "Välj dokumentet eller bilden från din lokala enhet." },
        { title: "Bearbeta säkert i webbläsaren", description: "FileKit använder WebAssembly för att utföra åtgärden lokalt i din webbläsare." },
        { title: "Ladda ner ditt resultat", description: "Din färdiga, verifierade fil är redo att laddas ner omedelbart med fullständig integritet." }
      ]
    : isAr
    ? [
        { title: "اختر ملفك", description: "اختر المستند أو الصورة من جهازك المحلي." },
        { title: "معالجة آمنة في المتصفح", description: "يستخدم FileKit تقنية WebAssembly لتنفيذ العملية محلياً على جهازك مباشرة." },
        { title: "تحميل النتيجة", description: "ملفك النهائي الموثوق جاهز للتحميل فوراً دون أي تسريب لبياناتك." }
      ]
    : isTr
    ? [
        { title: "Dosyanızı seçin", description: "Belgenizi veya görselinizi yerel cihazınızdan seçin." },
        { title: "Tarayıcıda güvenle işleyin", description: "FileKit işlemi doğrudan cihazınızın CPU'sunda yerel olarak yürütmek için WebAssembly kullanır." },
        { title: "Sonucunuzu indirin", description: "Doğrulanmış dosyanız sıfır veri sızıntısıyla anında indirilmeye hazırdır." }
      ]
    : isEs
    ? [
        { title: "Selecciona tu archivo", description: "Elige tu documento o imagen desde tu dispositivo." },
        { title: "Procesa de forma segura en el navegador", description: "FileKit utiliza WebAssembly para ejecutar la operación localmente en tu navegador." },
        { title: "Descarga tu resultado", description: "Tu archivo procesado está listo para descargarse de inmediato con total privacidad." }
      ]
    : isDe
    ? [
        { title: "Wählen Sie Ihre Datei", description: "Wählen Sie das Dokument oder Bild von Ihrem lokalen Gerät." },
        { title: "Sicher im Browser verarbeiten", description: "FileKit nutzt WebAssembly, um die Operation lokal direkt auf Ihrem Gerät auszuführen." },
        { title: "Ergebnis herunterladen", description: "Ihre fertige Datei steht sofort zum Download bereit – ohne Datenweitergabe." }
      ]
    : isFr
    ? [
        { title: "Sélectionnez votre fichier", description: "Choisissez votre document ou image depuis votre appareil." },
        { title: "Traitez en toute sécurité dans le navigateur", description: "FileKit utilise WebAssembly pour exécuter l'opération localement dans votre navigateur." },
        { title: "Téléchargez votre résultat", description: "Votre fichier finalisé est prêt à être téléchargé immédiatement en toute confidentialité." }
      ]
    : isPt
    ? [
        { title: "Selecione o seu arquivo", description: "Escolha o documento ou imagem a partir do seu dispositivo." },
        { title: "Processe com segurança no navegador", description: "O FileKit utiliza WebAssembly para executar a operação localmente no seu computador." },
        { title: "Baixe o seu resultado", description: "O seu arquivo verificado está pronto para download imediato com 100% de privacidade." }
      ]
    : isIt
    ? [
        { title: "Seleziona il tuo file", description: "Scegli il documento o l'immagine dal tuo dispositivo locale." },
        { title: "Elabora in modo sicuro nel browser", description: "FileKit utilizza WebAssembly per eseguire l'operazione localmente nel tuo browser." },
        { title: "Scarica il tuo risultato", description: "Il tuo file completato è pronto per il download immediato con la massima riservatezza." }
      ]
    : isPl
    ? [
        { title: "Wybierz plik", description: "Wybierz dokument lub obraz z urządzenia lokalnego." },
        { title: "Bezpieczne przetwarzanie w przeglądarce", description: "FileKit używa WebAssembly do lokalnego wykonania operacji bez wysyłania danych." },
        { title: "Pobierz wynik", description: "Twój gotowy plik jest natychmiast dostępny do pobrania z zachowaniem pełnej prywatności." }
      ]
    : isRu
    ? [
        { title: "Выберите файл", description: "Выберите документ или изображение на вашем устройстве." },
        { title: "Безопасная обработка в браузере", description: "FileKit использует WebAssembly для локальной обработки файла прямо на вашем устройстве." },
        { title: "Скачайте результат", description: "Готовый файл сразу доступен для скачивания без утечки данных." }
      ]
    : isJa
    ? [
        { title: "ファイルを選択", description: "デバイスからドキュメントまたは画像を選択します。" },
        { title: "ブラウザ内で安全に処理", description: "FileKitはWebAssemblyを使用して、ブラウザ内でローカルに処理を実行します。" },
        { title: "結果をダウンロード", description: "処理されたファイルは、完全なプライバシーを保ったまま即座にダウンロードできます。" }
      ]
    : isKo
    ? [
        { title: "파일 선택", description: "로컬 장치에서 문서 또는 이미지를 선택합니다." },
        { title: "브라우저에서 안전하게 처리", description: "FileKit은 WebAssembly를 사용하여 브라우저에서 로컬로 직접 작업을 실행합니다." },
        { title: "결과 다운로드", description: "완료된 파일은 데이터 유출 없이 즉시 다운로드할 수 있습니다." }
      ]
    : isZh
    ? [
        { title: "选择您的文件", description: "从本地设备中选择您的文档或图像。" },
        { title: "在浏览器中安全处理", description: "FileKit 使用 WebAssembly 在本地直接执行操作，无需上传。" },
        { title: "下载处理结果", description: "已验证的完成文件可立即下载，全面保障数据隐私。" }
      ]
    : [
        { title: "Select your file", description: "Choose your document or image from your local device." },
        { title: "Process securely in browser", description: "FileKit uses client-side WebAssembly to execute the operation locally on your CPU." },
        { title: "Download your result", description: "Your finished, verified file is ready for download immediately with zero data leaks." }
      ];

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
        { title: "Select your file", description: "Choose your document or image from your local device." },
        { question: "Is FileKit really 100% free and private?", answer: "Yes. FileKit operates primarily in your web browser using WebAssembly. Your confidential documents never leave your computer for local operations." },
        { question: "Do I need to create an account or provide an email?", answer: "No account, email, or credit card is required. You get immediate access to the tool with zero friction." },
        { question: "Does FileKit support bulk batch conversions?", answer: "Yes. You can process multiple files simultaneously directly within your browser workspace." }
      ] as any;

  return { category, entityDefinition, howToSteps, faqs };
}
