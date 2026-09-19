import { SupportedLocale } from "@/config/i18n/locales";

export interface GatedNoticeI18n {
  title: string;
  badge: string;
  reasonHeading: string;
  reasons: {
    woff2: string;
    mobi: string;
    azw3: string;
  };
  standardsHeading: string;
  standardsBody: string;
  alternativeHeading: string;
  alternatives: {
    woff2: string;
    mobi: string;
    azw3: string;
  };
  backToTools: string;
}

export const GATED_NOTICE_I18N: Record<SupportedLocale, GatedNoticeI18n> = {
  en: {
    title: "Format Conversion Temporarily Gated",
    badge: "Standards & Compatibility Gate",
    reasonHeading: "Why is this conversion unavailable?",
    reasons: {
      woff2: "True WOFF2 generation requires compliant table directory transforms and standard Brotli stream compression. To prevent producing files that fail browser decoders, WOFF2 export is withheld until a compliant W3C WOFF2 codec is integrated.",
      mobi: "Standard Kindle MOBI files rely on PalmDOC LZ77 compression and Palm database structures. Full compatibility with genuine Kindle devices and e-readers requires verified decompression before this route is made public.",
      azw3: "Amazon KF8 / AZW3 containers use proprietary multi-part boundary tables and compressed text records. To avoid incomplete conversions, AZW3 processing is gated pending verified native parser integration."
    },
    standardsHeading: "FileKit Engineering Standard",
    standardsBody: "We do not claim file conversions that fail external rendering engines. Tools are made available only when output files strictly pass independent compatibility verification.",
    alternativeHeading: "Recommended Available Alternative",
    alternatives: {
      woff2: "You can convert standard TTF to WOFF 1.0 or inspect font metadata directly in your browser.",
      mobi: "Convert standard EPUB to PDF directly in your browser with zero server uploads.",
      azw3: "Convert standard EPUB to PDF directly in your browser with zero server uploads."
    },
    backToTools: "Explore Verified Tools"
  },
  es: {
    title: "Conversión de formato suspendida temporalmente",
    badge: "Control de estándares y compatibilidad",
    reasonHeading: "¿Por qué no está disponible esta conversión?",
    reasons: {
      woff2: "La generación auténtica de WOFF2 requiere compresión Brotli según el estándar del W3C. Para evitar generar archivos incompatibles con navegadores, esta conversión está pausada hasta integrar el códec certificado.",
      mobi: "Los libros Kindle MOBI emplean compresión PalmDOC LZ77. Para garantizar compatibilidad total con lectores Kindle reales, esta opción permanece deshabilitada hasta validar el motor completo.",
      azw3: "Los contenedores Amazon KF8 / AZW3 requieren análisis específico de estructuras propietarias. El procesamiento se encuentra restringido hasta completar su validación independiente."
    },
    standardsHeading: "Compromiso de calidad FileKit",
    standardsBody: "No ofrecemos conversiones que fallen en lectores externos. Las herramientas solo se habilitan cuando los archivos superan pruebas de compatibilidad independientes.",
    alternativeHeading: "Alternativa disponible recomendada",
    alternatives: {
      woff2: "Puedes convertir fuentes TTF a WOFF 1.0 o inspeccionar metadatos directamente en el navegador.",
      mobi: "Convierte libros EPUB a PDF directamente en tu navegador con total privacidad.",
      azw3: "Convierte libros EPUB a PDF directamente en tu navegador con total privacidad."
    },
    backToTools: "Ver herramientas disponibles"
  },
  de: {
    title: "Formatkonvertierung vorübergehend gesperrt",
    badge: "Qualitäts- & Kompatibilitätssperre",
    reasonHeading: "Warum ist diese Konvertierung nicht verfügbar?",
    reasons: {
      woff2: "Eine standardkonforme WOFF2-Erzeugung erfordert W3C-spezifische Tabellentransformationen und Brotli-Kompression. Um inkompatible Schriftdateien zu vermeiden, bleibt dieser Export bis zur vollständigen Codec-Integration pausiert.",
      mobi: "Kindle MOBI-Dateien erfordern echte PalmDOC LZ77-Dekomprimierung. Um vollständige Kompatibilität mit Lesegeräten zu sichern, ist diese Route bis zur unabhängigen Validierung deaktiviert.",
      azw3: "Amazon KF8 / AZW3-Dateien nutzen proprietäre Tabellenstrukturen. Die Verarbeitung bleibt gesperrt, bis der native Parser vollständig verifiziert ist."
    },
    standardsHeading: "FileKit Qualitätsstandard",
    standardsBody: "Wir veröffentlichen keine Werkzeuge, deren Dateien externe Reader nicht öffnen können. Funktionen werden erst nach unabhängigen Konformitätstests freigeschaltet.",
    alternativeHeading: "Empfohlene Alternative",
    alternatives: {
      woff2: "Nutzen Sie die TTF-zu-WOFF 1.0 Konvertierung oder prüfen Sie Schrift-Metadaten direkt im Browser.",
      mobi: "Konvertieren Sie Standard-EPUB-Dateien direkt im Browser sicher in PDF.",
      azw3: "Konvertieren Sie Standard-EPUB-Dateien direkt im Browser sicher in PDF."
    },
    backToTools: "Verfügbare Werkzeuge entdecken"
  },
  fr: {
    title: "Conversion de format temporairement désactivée",
    badge: "Contrôle de compatibilité et standards",
    reasonHeading: "Pourquoi cette conversion n'est-elle pas disponible ?",
    reasons: {
      woff2: "La génération WOFF2 conforme requiert des transformations de tables W3C et une compression Brotli. Pour éviter des fichiers illisibles par les navigateurs, cet export est suspendu jusqu'à l'intégration du codec approprié.",
      mobi: "Les fichiers Kindle MOBI nécessitent une décompression PalmDOC LZ77 vérifiée. Cette fonction est désactivée jusqu'à validation avec des liseuses réelles.",
      azw3: "Les conteneurs Amazon KF8 / AZW3 utilisent des structures propriétaires. Le traitement est suspendu en attendant un parseur vérifié."
    },
    standardsHeading: "Standard d'ingénierie FileKit",
    standardsBody: "Nous ne proposons pas de conversions produisant des fichiers défectueux. Les outils ne sont activés qu'après validation indépendante rigoureuse.",
    alternativeHeading: "Alternative recommandée",
    alternatives: {
      woff2: "Convertissez vos polices en WOFF 1.0 ou inspectez les métadonnées dans votre navigateur.",
      mobi: "Convertissez vos fichiers EPUB en PDF directement dans votre navigateur.",
      azw3: "Convertissez vos fichiers EPUB en PDF directement dans votre navigateur."
    },
    backToTools: "Découvrir les outils disponibles"
  },
  it: {
    title: "Conversione di formato temporaneamente disattivata",
    badge: "Controllo di conformità e compatibilità",
    reasonHeading: "Perché questa conversione non è disponibile?",
    reasons: {
      woff2: "La creazione di file WOFF2 validi richiede la compressione Brotli secondo le specifiche W3C. La funzione è temporaneamente sospesa per garantire la conformità.",
      mobi: "I documenti Kindle MOBI richiedono la decompressione PalmDOC LZ77. La conversione è sospesa fino a test indipendenti completi.",
      azw3: "I formati Amazon KF8 / AZW3 utilizzano strutture proprietarie che richiedono convalida prima del rilascio."
    },
    standardsHeading: "Standard di qualità FileKit",
    standardsBody: "Non offriamo conversioni che non superano i test dei lettori standard. Gli strumenti vengono attivati solo dopo verifiche indipendenti.",
    alternativeHeading: "Alternativa consigliata",
    alternatives: {
      woff2: "Converti file TTF in WOFF 1.0 direttamente nel browser.",
      mobi: "Converti file EPUB in PDF nel tuo browser con la massima privacy.",
      azw3: "Converti file EPUB in PDF nel tuo browser con la massima privacy."
    },
    backToTools: "Esplora gli strumenti disponibili"
  },
  pt: {
    title: "Conversão de formato temporariamente desativada",
    badge: "Controlo de qualidade e normas",
    reasonHeading: "Por que esta conversão não está disponível?",
    reasons: {
      woff2: "A geração de fontes WOFF2 em conformidade requer compressão Brotli do W3C. A exportação está pausada até a integração do codec oficial.",
      mobi: "Os ficheiros Kindle MOBI exigem descompressão PalmDOC LZ77. A rota está desativada até validação independente com dispositivos reais.",
      azw3: "Ficheiros Amazon KF8 / AZW3 dependem de tabelas proprietárias. O processamento aguarda validação independente."
    },
    standardsHeading: "Padrão de engenharia FileKit",
    standardsBody: "Não disponibilizamos ferramentas que falhem em softwares de leitura de mercado.",
    alternativeHeading: "Alternativa recomendada",
    alternatives: {
      woff2: "Converta ficheiros TTF para WOFF 1.0 diretamente no navegador.",
      mobi: "Converta livros EPUB para PDF no navegador de forma privada.",
      azw3: "Converta livros EPUB para PDF no navegador de forma privada."
    },
    backToTools: "Ver ferramentas disponíveis"
  },
  "pt-BR": {
    title: "Conversão de formato temporariamente desativada",
    badge: "Controle de qualidade e normas",
    reasonHeading: "Por que esta conversão não está disponível?",
    reasons: {
      woff2: "A geração de fontes WOFF2 em conformidade requer compressão Brotli do W3C. A exportação está pausada até a integração do codec oficial.",
      mobi: "Os arquivos Kindle MOBI exigem descompressão PalmDOC LZ77. O recurso está desativado até validação independente com dispositivos reais.",
      azw3: "Arquivos Amazon KF8 / AZW3 dependem de tabelas proprietárias. O processamento aguarda validação independente."
    },
    standardsHeading: "Padrão de engenharia FileKit",
    standardsBody: "Não disponibilizamos ferramentas que falhem em leitores do mercado.",
    alternativeHeading: "Alternativa recomendada",
    alternatives: {
      woff2: "Converta arquivos TTF para WOFF 1.0 diretamente no navegador.",
      mobi: "Converta livros EPUB para PDF no navegador com total privacidade.",
      azw3: "Converta livros EPUB para PDF no navegador com total privacidade."
    },
    backToTools: "Ver ferramentas disponíveis"
  },
  nl: {
    title: "Formaatconversie tijdelijk niet beschikbaar",
    badge: "Kwaliteits- en compatibiliteitscontrole",
    reasonHeading: "Waarom is deze conversie niet beschikbaar?",
    reasons: {
      woff2: "Conforme WOFF2-generatie vereist W3C Brotli-compressie. Deze export is tijdelijk gepauzeerd tot integratie van de gecertificeerde codec.",
      mobi: "Kindle MOBI-bestanden vereisen PalmDOC LZ77 decompressie. Deze route is tijdelijk vergrendeld tot onafhankelijke verificatie.",
      azw3: "Amazon KF8 / AZW3-containers vereisen gespecialiseerde verwerking die momenteel wordt gevalideerd."
    },
    standardsHeading: "FileKit kwaliteitsnorm",
    standardsBody: "Wij leveren uitsluitend bestanden die probleemloos openen in externe software.",
    alternativeHeading: "Aanbevolen alternatief",
    alternatives: {
      woff2: "Converteer TTF naar WOFF 1.0 rechtstreeks in uw browser.",
      mobi: "Converteer EPUB naar PDF direct in uw browser.",
      azw3: "Converteer EPUB naar PDF direct in uw browser."
    },
    backToTools: "Bekijk beschikbare tools"
  },
  ja: {
    title: "フォーマット変換は一時的に制限されています",
    badge: "規格・互換性ゲート",
    reasonHeading: "この変換が利用できない理由",
    reasons: {
      woff2: "W3C標準に準拠したWOFF2生成にはBrotli圧縮コーデックの統合が必要です。ブラウザで正しく読み込めないフォントの出力を防ぐため、標準コーデック検証まで提供を制限しています。",
      mobi: "Kindle MOBIファイルはPalmDOC LZ77圧縮を使用します。本物のKindle端末との確実な互換性を確保するため、独立検証完了まで停止しています。",
      azw3: "Amazon KF8 / AZW3コンテナは独自のテーブル構造を持ちます。正確な変換を保証するため、検証中として制限しています。"
    },
    standardsHeading: "FileKit の技術基準",
    standardsBody: "外部リーダーで開けない不完全なファイルを生成することはありません。完全に検証されたツールのみを提供します。",
    alternativeHeading: "利用可能な代替ツール",
    alternatives: {
      woff2: "ブラウザ上でTTFからWOFF 1.0への変換またはフォント情報確認をご利用いただけます。",
      mobi: "ブラウザ内で安全にEPUBからPDFへの変換をご利用いただけます。",
      azw3: "ブラウザ内で安全にEPUBからPDFへの変換をご利用いただけます。"
    },
    backToTools: "利用可能なツールを見る"
  },
  ar: {
    title: "تحويل التنسيق محجوب مؤقتاً",
    badge: "معايير التوافق والجودة",
    reasonHeading: "لماذا هذا التحويل غير متاح حالياً؟",
    reasons: {
      woff2: "توليد ملفات WOFF2 القياسية يتطلب ضغط Brotli المعتمد من W3C. لمنع تصدير ملفات غير متوافقة مع المتصفحات، تم حجب هذه الميزة حتى دمج برنامج الترميز القياسي.",
      mobi: "تتطلب ملفات Kindle MOBI فك ضغط PalmDOC LZ77 المعتمد. تم إيقاف هذا المسار لضمان التوافق التام مع أجهزة القراءة الحقيقية.",
      azw3: "تستخدم حزم Amazon KF8 / AZW3 تنسيقات خاصة قيد التحقق المستقل لمنع أي تلف في المستندات الناتجة."
    },
    standardsHeading: "معايير الجودة الهندسية في FileKit",
    standardsBody: "نحن نلتزم بعدم تقديم مخرجات تفشل عند فتحها في البرامج المعتمدة. لن تُتاح الأدوات إلا بعد اجتياز اختبارات التوافق التامة.",
    alternativeHeading: "البديل المتاح الموصى به",
    alternatives: {
      woff2: "يمكنك تحويل خطوط TTF إلى WOFF 1.0 أو فحص بيانات الخط مباشرة في المتصفح.",
      mobi: "يمكنك تحويل كتب EPUB إلى مستندات PDF في المتصفح بخصوصية تامة.",
      azw3: "يمكنك تحويل كتب EPUB إلى مستندات PDF في المتصفح بخصوصية تامة."
    },
    backToTools: "استكشف الأدوات المتاحة"
  },
  "zh-CN": {
    title: "该格式转换暂时受限",
    badge: "标准与兼容性保障",
    reasonHeading: "为什么当前无法使用该转换？",
    reasons: {
      woff2: "标准的 WOFF2 生成必须包含 W3C 规范的表目录变换与 Brotli 流压缩。为防止生成无法在浏览器中正常加载的字体文件，在完成官方标准编解码器集成与验证前，暂停该格式输出。",
      mobi: "Kindle MOBI 依赖 PalmDOC LZ77 压缩与 Palm 数据库记录解析。为保证真实 Kindle 设备和阅读器的完全兼容，在完成独立真机兼容验证前限制此转换路径。",
      azw3: "Amazon KF8 / AZW3 格式包含多层专有结构，正在进行独立兼容性检验。"
    },
    standardsHeading: "FileKit 质量承诺",
    standardsBody: "我们绝不输出在外部软件中无法正常打开的文件。所有上线工具均需通过严格的独立兼容性测试。",
    alternativeHeading: "推荐可用的替代方案",
    alternatives: {
      woff2: "您可以直接在浏览器中将 TTF 转换为 WOFF 1.0，或直接检查字体结构元数据。",
      mobi: "可在浏览器中直接将 EPUB 电子书无损转换为高清晰度 PDF 文档，完全无需上传至服务器。",
      azw3: "可在浏览器中直接将 EPUB 电子书无损转换为高清晰度 PDF 文档，完全无需上传至服务器。"
    },
    backToTools: "查看已验证可用工具"
  },
  "zh-TW": {
    title: "該格式轉換暫時受限",
    badge: "標準與相容性保障",
    reasonHeading: "為什麼目前無法使用該轉換？",
    reasons: {
      woff2: "標準的 WOFF2 必須包含 W3C 規範的表目錄變換與 Brotli 壓縮。為防止輸出無法被標準解碼器載入的字型，在完成官方標準編解碼器整合前暫停提供輸出。",
      mobi: "Kindle MOBI 採用 PalmDOC LZ77 壓縮架構。為保證真實 Kindle 閱讀裝置完全相容，在完成獨立真機相容驗證前限制此轉換路徑。",
      azw3: "Amazon KF8 / AZW3 格式包含多層專有結構，正進行獨立相容性檢驗中。"
    },
    standardsHeading: "FileKit 品質標準",
    standardsBody: "我們絕不提供在第三方閱讀器中開啟失敗的檔案轉換。所有工具均需嚴格通過獨立相容性測試。",
    alternativeHeading: "推薦可用的替代方案",
    alternatives: {
      woff2: "您可以在瀏覽器中直接將 TTF 轉換為 WOFF 1.0，或檢視字型詳細結構資訊。",
      mobi: "可在瀏覽器中直接將 EPUB 電子書無損轉換為高清晰度 PDF 文件，完全無需上傳至伺服器。",
      azw3: "可在瀏覽器中直接將 EPUB 電子書無損轉換為高清晰度 PDF 文件，完全無需上傳至伺服器。"
    },
    backToTools: "瀏覽已驗證可用工具"
  }
} as any;
