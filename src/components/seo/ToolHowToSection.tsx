import React from 'react';
import { FileKitAsset } from '@/components/visuals/FileKitAsset';
import { HowToStep } from '@/lib/seo/contentRegistry';

interface ToolHowToSectionProps {
  h1Title: string;
  steps: HowToStep[];
}

const pngMockupMap: Record<string, string> = {
  'step-upload': '/brand-assets/how-it-works/zendocs-step-6.svg',
  'step-1-upload': '/brand-assets/how-it-works/zendocs-step-6.svg',
  'step-process': '/brand-assets/how-it-works/zendocs-step-2.svg',
  'step-2-changes': '/brand-assets/how-it-works/zendocs-step-2.svg',
  'step-2-convert': '/brand-assets/how-it-works/zendocs-step-2.svg',
  'step-2-compress': '/brand-assets/how-it-works/zendocs-step-2.svg',
  'step-download': '/brand-assets/how-it-works/zendocs-step-5.svg',
  'step-3-download': '/brand-assets/how-it-works/zendocs-step-5.svg',
};

const labelTranslations: Record<string, {
  dragDrop: string;
  addText: string;
  editText: string;
  sign: string;
  compress: string;
  resize: string;
  convert: string;
  chooseFormat: string;
  targetFormat: string;
  email: string;
  share: string;
  download: string;
  yourFilePdf: string;
  yourImageFile: string;
}> = {
  en: {
    dragDrop: 'Drag & drop or browse',
    addText: 'Add text',
    editText: 'Edit text',
    sign: 'Sign',
    compress: 'Compress',
    resize: 'Resize',
    convert: 'Convert',
    chooseFormat: 'Format',
    targetFormat: 'JPG / PNG',
    email: 'Email',
    share: 'Share',
    download: 'Download',
    yourFilePdf: 'your file.pdf',
    yourImageFile: 'your image.png',
  },
  pt: {
    dragDrop: 'Arraste e solte ou procure',
    addText: 'Adicionar texto',
    editText: 'Editar texto',
    sign: 'Assinar',
    compress: 'Comprimir',
    resize: 'Redimensionar',
    convert: 'Converter',
    chooseFormat: 'Formato',
    targetFormat: 'JPG / PNG',
    email: 'E-mail',
    share: 'Compartilhar',
    download: 'Baixar',
    yourFilePdf: 'seu arquivo.pdf',
    yourImageFile: 'sua imagem.png',
  },
  es: {
    dragDrop: 'Arrastra y suelta o busca',
    addText: 'Añadir texto',
    editText: 'Editar texto',
    sign: 'Firmar',
    compress: 'Comprimir',
    resize: 'Redimensionar',
    convert: 'Convertir',
    chooseFormat: 'Formato',
    targetFormat: 'JPG / PNG',
    email: 'Correo',
    share: 'Compartir',
    download: 'Descargar',
    yourFilePdf: 'tu archivo.pdf',
    yourImageFile: 'tu imagen.png',
  },
  fr: {
    dragDrop: 'Glisser-déposer ou parcourir',
    addText: 'Ajouter du texte',
    editText: 'Modifier le texte',
    sign: 'Signer',
    compress: 'Compresser',
    resize: 'Redimensionner',
    convert: 'Convertir',
    chooseFormat: 'Format',
    targetFormat: 'JPG / PNG',
    email: 'E-mail',
    share: 'Partager',
    download: 'Télécharger',
    yourFilePdf: 'votre fichier.pdf',
    yourImageFile: 'votre image.png',
  },
  de: {
    dragDrop: 'Ziehen & Ablegen oder Suchen',
    addText: 'Text hinzufügen',
    editText: 'Text bearbeiten',
    sign: 'Signieren',
    compress: 'Komprimieren',
    resize: 'Größe ändern',
    convert: 'Konvertieren',
    chooseFormat: 'Format',
    targetFormat: 'JPG / PNG',
    email: 'E-Mail',
    share: 'Teilen',
    download: 'Herunterladen',
    yourFilePdf: 'ihre datei.pdf',
    yourImageFile: 'ihre bild.png',
  },
  it: {
    dragDrop: 'Trascina e rilascia o sfoglia',
    addText: 'Aggiungi testo',
    editText: 'Modifica testo',
    sign: 'Firma',
    compress: 'Comprimi',
    resize: 'Ridimensiona',
    convert: 'Converti',
    chooseFormat: 'Formato',
    targetFormat: 'JPG / PNG',
    email: 'E-mail',
    share: 'Condividi',
    download: 'Scarica',
    yourFilePdf: 'tuo file.pdf',
    yourImageFile: 'tua immagine.png',
  },
  tr: {
    dragDrop: 'Sürükleyip bırakın veya seçin',
    addText: 'Metin ekle',
    editText: 'Metni düzenle',
    sign: 'İmzala',
    compress: 'Sıkıştır',
    resize: 'Yeniden Boyutlandır',
    convert: 'Dönüştür',
    chooseFormat: 'Format',
    targetFormat: 'JPG / PNG',
    email: 'E-posta',
    share: 'Paylaş',
    download: 'İndir',
    yourFilePdf: 'dosyanız.pdf',
    yourImageFile: 'görseliniz.png',
  },
  ar: {
    dragDrop: 'اسحب وأفلت أو تصفح',
    addText: 'إضافة نص',
    editText: 'تعديل النص',
    sign: 'توقيع',
    compress: 'ضغط',
    resize: 'تغيير الحجم',
    convert: 'تحويل',
    chooseFormat: 'الصيغة',
    targetFormat: 'JPG / PNG',
    email: 'البريد',
    share: 'مشاركة',
    download: 'تحميل',
    yourFilePdf: 'ملفك.pdf',
    yourImageFile: 'صورتك.png',
  },
};

// Localized dynamic step translations
const stepTranslations: Record<string, {
  chooseFile: (fmt: string) => { title: string; text: string };
  processFile: (fromFmt: string, toFmt: string) => { title: string; text: string };
  downloadFile: (fmt: string) => { title: string; text: string };
}> = {
  pt: {
    chooseFile: (fmt) => ({
      title: `Escolha o arquivo ${fmt}`,
      text: `Selecione ou arraste sua imagem ${fmt} para a caixa de conversão acima.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'Converta instantaneamente',
      text: `Nosso motor local no navegador converte seu arquivo para ${toFmt} em milissegundos.`
    }),
    downloadFile: (fmt) => ({
      title: `Baixar ${fmt}`,
      text: `Salve seu novo arquivo ${fmt} diretamente no seu computador ou dispositivo móvel.`
    })
  },
  es: {
    chooseFile: (fmt) => ({
      title: `Elige el archivo ${fmt}`,
      text: `Selecciona o arrastra tu imagen ${fmt} al cuadro de conversión de arriba.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'Convierte al instante',
      text: `Nuestro motor local en el navegador convierte tu archivo a ${toFmt} en milisegundos.`
    }),
    downloadFile: (fmt) => ({
      title: `Descargar ${fmt}`,
      text: `Guarda tu nuevo archivo ${fmt} directamente en tu ordenador o móvil.`
    })
  },
  fr: {
    chooseFile: (fmt) => ({
      title: `Choisir le fichier ${fmt}`,
      text: `Sélectionnez ou glissez votre image ${fmt} dans la boîte de conversion ci-dessus.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'Convertir instantanément',
      text: `Notre moteur local dans le navigateur convertit votre fichier en ${toFmt} en quelques millisecondes.`
    }),
    downloadFile: (fmt) => ({
      title: `Télécharger ${fmt}`,
      text: `Enregistrez votre nouveau fichier ${fmt} directement sur votre ordinateur ou mobile.`
    })
  },
  de: {
    chooseFile: (fmt) => ({
      title: `${fmt}-Datei auswählen`,
      text: `Wählen Sie Ihr ${fmt}-Bild aus oder ziehen Sie es in das Konvertierungsfeld oben.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'Sofort konvertieren',
      text: `Unsere lokale Browser-Engine konvertiert Ihre Datei in Millisekunden in ${toFmt}.`
    }),
    downloadFile: (fmt) => ({
      title: `${fmt} herunterladen`,
      text: `Speichern Sie Ihre neue ${fmt}-Datei direkt auf Ihrem Computer oder Smartphone.`
    })
  },
  it: {
    chooseFile: (fmt) => ({
      title: `Scegli il file ${fmt}`,
      text: `Seleziona o trascina la tua immagine ${fmt} nel riquadro di conversione in alto.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'Converti all\'istante',
      text: `Il nostro motore locale nel browser converte il tuo file in ${toFmt} in pochi millisecondi.`
    }),
    downloadFile: (fmt) => ({
      title: `Scarica ${fmt}`,
      text: `Salva il tuo nuovo file ${fmt} direttamente sul tuo computer o smartphone.`
    })
  },
  tr: {
    chooseFile: (fmt) => ({
      title: `${fmt} Dosyasını Seçin`,
      text: `${fmt} görselinizi seçin veya yukarıdaki dönüştürücü kutusuna sürükleyip bırakın.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'Anında Dönüştürün',
      text: `Yerel tarayıcı motorumuz görselinizi milisaniyeler içinde ${toFmt} formatına dönüştürür.`
    }),
    downloadFile: (fmt) => ({
      title: `${fmt} İndir`,
      text: `Yeni ${fmt} dosyanızı doğrudan bilgisayarınıza veya mobil cihazınıza kaydedin.`
    })
  },
  ar: {
    chooseFile: (fmt) => ({
      title: `اختر ملف ${fmt}`,
      text: `حدد أو اسحب صورة ${fmt} وأفلتها في مربع التحويل أعلاه.`
    }),
    processFile: (fromFmt, toFmt) => ({
      title: 'التحويل الفوري',
      text: `يقوم محرك المتصفح المحلي بتحويل صورتك إلى صيغة ${toFmt} في أجزاء من الثانية.`
    }),
    downloadFile: (fmt) => ({
      title: `تحميل ${fmt}`,
      text: `احفظ ملف ${fmt} الجديد مباشرة على جهاز الكمبيوتر أو الهاتف الخاص بك.`
    })
  }
};

export const ToolHowToSection: React.FC<ToolHowToSectionProps> = ({
  h1Title,
  steps,
}) => {
  const lowerH1 = h1Title.toLowerCase();
  const isConvertRoute = lowerH1.includes('convert') || lowerH1.includes(' to ');
  const isCompressRoute = lowerH1.includes('compress');
  const isImageRoute = lowerH1.includes('image') || lowerH1.includes('jpg') || lowerH1.includes('png') || lowerH1.includes('webp') || lowerH1.includes('photo');

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentLang = pathname.split('/')[1]?.slice(0, 2).toLowerCase() || 'en';
  const labels = labelTranslations[currentLang] || labelTranslations.en;

  const fileNameLabel = isImageRoute || isCompressRoute ? labels.yourImageFile : labels.yourFilePdf;

  // Heading translations
  const getSectionTitle = () => {
    switch (currentLang) {
      case 'pt':
        return 'Comece em 3 passos simples';
      case 'es':
        return 'Comienza en 3 sencillos pasos';
      case 'fr':
        return 'Commencez en 3 étapes simples';
      case 'de':
        return 'In 3 einfachen Schritten starten';
      case 'it':
        return 'Inizia in 3 semplici passaggi';
      case 'tr':
        return '3 Basit Adımda Başlayın';
      case 'ar':
        return 'ابدأ في 3 خطوات بسيطة';
      default:
        return 'Start In 3 Easy Steps';
    }
  };

  const getSectionSubtitle = () => {
    switch (currentLang) {
      case 'pt':
        return 'Siga estas etapas rápidas para processar seus arquivos com segurança no FileKit.';
      case 'es':
        return 'Sigue estos sencillos pasos para procesar tus archivos de forma segura con FileKit.';
      case 'fr':
        return 'Suivez ces étapes rapides pour traiter vos fichiers en toute sécurité avec FileKit.';
      case 'de':
        return 'Befolgen Sie diese schnellen Schritte, um Ihre Dateien sicher mit FileKit zu verarbeiten.';
      case 'it':
        return 'Segui questi semplici passaggi per elaborare i tuoi file in sicurezza con FileKit.';
      case 'tr':
        return 'Dosyalarınızı FileKit ile güvenli bir şekilde işlemek için bu hızlı adımları izleyin.';
      case 'ar':
        return 'اتبع هذه الخطوات البسيطة لتحويل ومعالجة ملفاتك بأمان تام عبر متصفحك.';
      default:
        return 'Follow these quick steps to process your files securely with FileKit.';
    }
  };

  return (
    <section className="my-16 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
      <div className="space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          {getSectionTitle()}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          {getSectionSubtitle()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left ltr:text-left rtl:text-right">
        {steps.map((step, idx) => {
          let pngPath = pngMockupMap[step.iconAsset];

          if (idx === 1 || step.iconAsset.includes('process') || step.iconAsset.includes('changes')) {
            if (isCompressRoute) {
              pngPath = pngMockupMap['step-2-compress'];
            } else if (isConvertRoute) {
              pngPath = pngMockupMap['step-2-convert'];
            }
          }

          const cleanTitle = step.title.replace(/^[0-9]+\.\s*/, '');
          const stepTitle = `${idx + 1}. ${cleanTitle}`;

          return (
            <div
              key={idx}
              className="group relative bg-[#f8faf9] border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[451/330] w-full overflow-hidden border-b border-blue-100/60 bg-[#eff6ff]">
                <div className="absolute inset-0 h-full w-full [&>svg]:h-full [&>svg]:w-full">
                  {idx === 0 && (
                    <svg viewBox="0 0 451.97 330.33" className="block h-full w-full" aria-hidden="true">
                      <image href="/brand-assets/how-it-works/zendocs-step-6.svg" width="100%" height="100%" />
                      {/* Pill backing to cleanly cover underlying artwork without overlap */}
                      <rect
                        x="110"
                        y="207"
                        width="232"
                        height="26"
                        rx="13"
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                      <text
                        x="226"
                        y="220"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fill: 'rgba(30, 41, 59, 0.75)',
                          fontSize: '11.5px',
                          fontWeight: 600,
                        }}
                      >
                        {labels.dragDrop}
                      </text>
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg viewBox="0 0 451.97 330.33" className="block h-full w-full" aria-hidden="true">
                      {isCompressRoute ? (
                        <g id="compress-pixel-perfect-step2">
                          <rect fill="#f5f7fc" x="0" y="0" width="451.97" height="330.33" rx="18" ry="18" />
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="12" y="12" width="427.97" height="306.33" rx="16" ry="16" />

                          {/* Top Left Header */}
                          <circle fill="#dbe6f8" cx="36" cy="36" r="10" />
                          <rect fill="#e4ecfa" x="54" y="31" width="100" height="10" rx="5" />

                          {/* Floating Tooltip Box with Beak */}
                          <path fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" d="M 60 48 H 392 A 14 14 0 0 1 406 62 V 98 A 14 14 0 0 1 392 112 H 234 L 226 122 L 218 112 H 60 A 14 14 0 0 1 46 98 V 62 A 14 14 0 0 1 60 48 Z" />
                          <line stroke="#000000" strokeWidth="4.5" strokeLinecap="round" x1="78" y1="80" x2="226" y2="80" />
                          <line stroke="#d1d5db" strokeWidth="4.5" strokeLinecap="round" x1="226" y1="80" x2="374" y2="80" />
                          <line stroke="#000000" strokeWidth="1.5" strokeLinecap="round" x1="86" y1="93" x2="86" y2="99" />
                          <line stroke="#000000" strokeWidth="1.5" strokeLinecap="round" x1="366" y1="93" x2="366" y2="99" />
                          <circle fill="#ffffff" stroke="#000000" strokeWidth="2" cx="226" cy="80" r="13" />
                          <g id="zendocs-cursor" transform="translate(227, 81)">
                            <path d="M0,0 L0,18 L4.5,13.5 L9,21 L12,19.5 L7.5,12 L13.5,12 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M0,0 L0,18 L4.5,13.5 L9,21 L12,19.5 L7.5,12 L13.5,12 Z" fill="#000000" />
                          </g>

                          {/* Previews Left & Right */}
                          <g id="left-preview">
                            <rect fill="#d8e6fe" x="30" y="138" width="174" height="150" rx="16" />
                            <g clipPath="url(#left-clip-inline)">
                              <clipPath id="left-clip-inline"><rect x="30" y="138" width="174" height="150" rx="16" /></clipPath>
                              <circle fill="#bfdbfe" cx="80" cy="162" r="15" />
                              <path fill="#d0e1fe" d="M 166 166 a 6 6 0 0 0 -6 -5 a 9 9 0 0 0 -13 2 a 6 6 0 0 0 -5 7 h 24 z" />
                              <polygon fill="#a5c7fe" points="100,242 148,174 204,242" />
                              <polygon fill="#80b3ff" points="30,242 86,182 156,242" />
                              <polygon fill="#3b82f6" points="56,214 47,242 65,242" />
                              <polygon fill="#3b82f6" points="56,198 49,218 63,218" />
                              <polygon fill="#3b82f6" points="74,222 67,242 81,242" />
                              <polygon fill="#3b82f6" points="74,210 69,226 79,226" />
                              <path fill="#91c4fd" d="M 30 238 Q 80 244 114 254 T 204 256 L 204 274 A 16 16 0 0 1 188 288 L 46 288 A 16 16 0 0 1 30 274 Z" />
                              <path fill="#e2eeff" d="M 204 262 Q 136 266 94 276 T 30 286 L 30 288 L 188 288 A 16 16 0 0 0 204 272 Z" />
                            </g>
                          </g>

                          {/* Connector Arrow */}
                          <circle fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" cx="226" cy="213" r="13" />
                          <path stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M 221 213 H 229 M 226 209 L 230 213 L 226 217" />

                          {/* Right Preview */}
                          <g id="right-preview">
                            <rect fill="#d8e6fe" x="248" y="138" width="174" height="150" rx="16" />
                            <g clipPath="url(#right-clip-inline)">
                              <clipPath id="right-clip-inline"><rect x="248" y="138" width="174" height="150" rx="16" /></clipPath>
                              <circle fill="#bfdbfe" cx="298" cy="162" r="15" />
                              <path fill="#d0e1fe" d="M 384 166 a 6 6 0 0 0 -6 -5 a 9 9 0 0 0 -13 2 a 6 6 0 0 0 -5 7 h 24 z" />
                              <polygon fill="#a5c7fe" points="318,242 366,174 422,242" />
                              <polygon fill="#80b3ff" points="248,242 304,182 374,242" />
                              <polygon fill="#3b82f6" points="274,214 265,242 283,242" />
                              <polygon fill="#3b82f6" points="274,198 267,218 281,218" />
                              <polygon fill="#3b82f6" points="292,222 285,242 299,242" />
                              <polygon fill="#3b82f6" points="292,210 287,226 297,226" />
                              <path fill="#91c4fd" d="M 248 238 Q 298 244 332 254 T 422 256 L 422 274 A 16 16 0 0 1 406 288 L 264 288 A 16 16 0 0 1 248 274 Z" />
                              <path fill="#e2eeff" d="M 422 262 Q 354 266 312 276 T 248 286 L 248 288 L 406 288 A 16 16 0 0 0 422 272 Z" />
                            </g>
                          </g>

                          {/* Bottom Pills */}
                          <rect fill="#e2ecfe" x="90" y="296" width="54" height="15" rx="6" />
                          <rect fill="#e2ecfe" x="308" y="296" width="54" height="15" rx="6" />
                          <circle fill="#2563eb" cx="117" cy="303" r="3.5" />
                          <circle fill="#16a34a" cx="335" cy="303" r="3.5" />
                        </g>
                      ) : isConvertRoute ? (
                        <g id="convert-pixel-perfect-step2">
                          <rect fill="#f5f7fc" x="0" y="0" width="451.97" height="330.33" rx="18" ry="18" />
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="12" y="12" width="427.97" height="306.33" rx="16" ry="16" />

                          {/* Top Left Header */}
                          <circle fill="#dbe6f8" cx="36" cy="36" r="10" />
                          <rect fill="#e4ecfa" x="54" y="31" width="100" height="10" rx="5" />

                          {/* Inner Main Card Container */}
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="42" y="54" width="368" height="238" rx="14" />

                          {/* Option 1: Selected JPG Photo Format */}
                          <g id="option-jpg-inline">
                            <rect fill="#f4f8ff" stroke="#3b82f6" strokeWidth="1.5" x="60" y="80" width="100" height="142" rx="12" />
                            <g clipPath="url(#jpg-clip-inline)">
                              <clipPath id="jpg-clip-inline"><rect x="76" y="100" width="68" height="60" rx="10" /></clipPath>
                              <rect fill="#3b82f6" x="76" y="100" width="68" height="60" rx="10" />
                              <circle fill="#ffffff" cx="91" cy="115" r="6" />
                              <polygon fill="#2563eb" points="106,160 124,130 144,160" />
                              <polygon fill="#1d4ed8" points="76,160 98,136 124,160" />
                            </g>
                            <circle fill="#ffffff" stroke="#3b82f6" strokeWidth="2" cx="110" cy="190" r="9" />
                            <circle fill="#3b82f6" cx="110" cy="190" r="4.5" />
                          </g>

                          {/* Option 2: Unselected PNG Checkerboard Format */}
                          <g id="option-png-inline">
                            <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="176" y="80" width="100" height="142" rx="12" />
                            <g clipPath="url(#png-clip-inline)">
                              <clipPath id="png-clip-inline"><rect x="192" y="100" width="68" height="60" rx="10" /></clipPath>
                              <rect fill="#dbeafe" x="192" y="100" width="68" height="60" rx="10" />
                              <rect fill="#bfdbfe" x="192" y="100" width="17" height="15" />
                              <rect fill="#bfdbfe" x="226" y="100" width="17" height="15" />
                              <rect fill="#bfdbfe" x="209" y="115" width="17" height="15" />
                              <rect fill="#bfdbfe" x="243" y="115" width="17" height="15" />
                              <rect fill="#bfdbfe" x="192" y="130" width="17" height="15" />
                              <rect fill="#bfdbfe" x="226" y="130" width="17" height="15" />
                              <rect fill="#bfdbfe" x="209" y="145" width="17" height="15" />
                              <rect fill="#bfdbfe" x="243" y="145" width="17" height="15" />
                            </g>
                            <circle fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" cx="226" cy="190" r="8" />
                          </g>

                          {/* Option 3: Unselected PDF Document Format */}
                          <g id="option-pdf-inline">
                            <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="292" y="80" width="100" height="142" rx="12" />
                            <g id="pdf-icon-inline">
                              <path fill="#dbeafe" d="M 320 100 H 348 L 360 112 V 152 A 8 8 0 0 1 352 160 H 320 A 8 8 0 0 1 312 152 V 108 A 8 8 0 0 1 320 100 Z" />
                              <polygon fill="#a5c7fe" points="348,100 360,112 348,112" />
                              <polygon fill="#60a5fa" points="320,150 330,138 340,150" />
                              <polygon fill="#3b82f6" points="334,150 344,142 352,150" />
                            </g>
                            <circle fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" cx="342" cy="190" r="8" />
                          </g>

                          {/* Bottom Action Button */}
                          <rect fill="#2563eb" x="146" y="244" width="160" height="30" rx="8" />
                        </g>
                      ) : (
                        <>
                          <image
                            href={
                              isImageRoute
                                ? '/brand-assets/how-it-works/image-step-2.svg'
                                : '/brand-assets/how-it-works/zendocs-step-2.svg'
                            }
                            width="100%"
                            height="100%"
                          />
                          <text
                            x="90"
                            y="140"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fill: 'rgba(30, 41, 59, 0.65)',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                            }}
                          >
                            {isConvertRoute ? labels.chooseFormat : labels.addText}
                          </text>
                          <text
                            x="208.7"
                            y="140"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fill: 'rgba(30, 41, 59, 0.65)',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                            }}
                          >
                            {isConvertRoute ? labels.targetFormat : labels.editText}
                          </text>
                          <text
                            x="325"
                            y="140"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fill: 'rgba(30, 41, 59, 0.65)',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                            }}
                          >
                            {isConvertRoute ? labels.convert : labels.sign}
                          </text>
                        </>
                      )}
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg viewBox="0 0 451.97 330.33" className="block h-full w-full" aria-hidden="true">
                      {isConvertRoute || isImageRoute ? (
                        <g id="convert-pixel-perfect-step3">
                          <rect fill="#f5f7fc" x="0" y="0" width="451.97" height="330.33" rx="18" ry="18" />
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="12" y="12" width="427.97" height="306.33" rx="16" ry="16" />

                          {/* Top Left Header */}
                          <circle fill="#dbe6f8" cx="36" cy="36" r="10" />
                          <rect fill="#e4ecfa" x="54" y="31" width="100" height="10" rx="5" />

                          {/* Inner Main Card Container */}
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="42" y="54" width="368" height="238" rx="14" />

                          {/* Centered Hero Preview Card */}
                          <g id="hero-image-group-inline">
                            <rect fill="#eff6ff" x="166" y="74" width="120" height="116" rx="16" />
                            <g clipPath="url(#hero-clip-step3)">
                              <clipPath id="hero-clip-step3"><rect x="166" y="74" width="120" height="116" rx="16" /></clipPath>
                              <circle fill="#60a5fa" cx="196" cy="102" r="10" />
                              <polygon fill="#3b82f6" points="212,176 250,118 286,176" />
                              <polygon fill="#2563eb" points="166,176 198,134 236,176" />
                              <path fill="#dbeafe" d="M 166 168 Q 206 172 236 178 T 286 180 V 190 L 166 190 Z" />
                            </g>
                          </g>

                          {/* Overlaid Download Badge Circle */}
                          <g id="download-badge-inline">
                            <circle fill="#3b82f6" stroke="#ffffff" strokeWidth="3.5" cx="260" cy="162" r="23" />
                            <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="260" y1="151" x2="260" y2="165" />
                            <path stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M 254 160 L 260 166 L 266 160" />
                            <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="252" y1="171" x2="268" y2="171" />
                          </g>

                          {/* Bottom Action Button */}
                          <g id="action-button-group-inline">
                            <rect fill="#2563eb" x="76" y="226" width="300" height="42" rx="10" />
                            <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="226" y1="236" x2="226" y2="248" />
                            <path stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M 220 243 L 226 249 L 232 243" />
                            <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="216" y1="254" x2="236" y2="254" />
                          </g>
                        </g>
                      ) : (
                        <>
                          <image
                            href={
                              isCompressRoute
                                ? '/brand-assets/how-it-works/compress-step-3.svg'
                                : '/brand-assets/how-it-works/zendocs-step-5.svg'
                            }
                            width="100%"
                            height="100%"
                          />
                          {!isCompressRoute && (
                            <>
                              <text
                                x="160"
                                y="71"
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fill: 'rgba(30, 41, 59, 0.65)',
                                  fontSize: '0.8rem',
                                  fontWeight: 500,
                                }}
                              >
                                {fileNameLabel}
                              </text>
                              <text
                                x="88"
                                y="240"
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fill: 'rgba(30, 41, 59, 0.65)',
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                }}
                              >
                                {labels.email}
                              </text>
                              <text
                                x="211"
                                y="240"
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fill: 'rgba(30, 41, 59, 0.65)',
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                }}
                              >
                                {labels.share}
                              </text>
                              <text
                                x="334"
                                y="240"
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fill: 'rgba(30, 41, 59, 0.65)',
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                }}
                              >
                                {labels.download}
                              </text>
                            </>
                          )}
                        </>
                      )}
                    </svg>
                  )}
                </div>
              </div>

              {/* Step Title and Body Description */}
              <div className="p-6 space-y-2 bg-white flex-1 flex flex-col justify-start ltr:text-left rtl:text-right" dir="auto">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                  {(() => {
                    const trans = stepTranslations[currentLang];
                    if (trans) {
                      if (idx === 0) return `${idx + 1}. ${trans.chooseFile('JPG').title}`;
                      if (idx === 1) return `${idx + 1}. ${trans.processFile('JPG', 'PNG').title}`;
                      if (idx === 2) return `${idx + 1}. ${trans.downloadFile('PNG').title}`;
                    }
                    return stepTitle;
                  })()}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {(() => {
                    const trans = stepTranslations[currentLang];
                    if (trans) {
                      if (idx === 0) return trans.chooseFile('JPG').text;
                      if (idx === 1) return trans.processFile('JPG', 'PNG').text;
                      if (idx === 2) return trans.downloadFile('PNG').text;
                    }
                    return step.text;
                  })()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
