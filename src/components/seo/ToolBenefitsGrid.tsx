import React from 'react';
import { FileKitAsset } from '@/components/visuals/FileKitAsset';
import { BenefitCard } from '@/lib/seo/contentRegistry';

interface ToolBenefitsGridProps {
  heading: string;
  benefits: BenefitCard[];
}

export const ToolBenefitsGrid: React.FC<ToolBenefitsGridProps> = ({
  heading,
  benefits,
}) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentLang = pathname.split('/')[1]?.slice(0, 2).toLowerCase() || 'en';

  const getTag = () => {
    switch (currentLang) {
      case 'pt': return 'DESEMPENHO COMPROVADO';
      case 'es': return 'RENDIMIENTO PROBADO';
      case 'fr': return 'PERFORMANCE PROUVÉE';
      case 'de': return 'NACHGEWIESENE LEISTUNG';
      case 'it': return 'PRESTAZIONI COMPROVATE';
      case 'tr': return 'KANITLANMIŞ PERFORMANS';
      case 'ar': return 'أداء موثوق ومثبت';
      default: return 'Proof-Based Performance';
    }
  };

  const getHeading = () => {
    switch (currentLang) {
      case 'pt': return 'Por que converter JPG para PNG com o FileKit?';
      case 'es': return '¿Por qué convertir JPG a PNG con FileKit?';
      case 'fr': return 'Pourquoi convertir JPG en PNG avec FileKit ?';
      case 'de': return 'Warum JPG in PNG mit FileKit konvertieren?';
      case 'it': return 'Perché convertire JPG in PNG con FileKit?';
      case 'tr': return 'Neden FileKit ile JPG dosyasını PNG\'ye dönüştürmelisiniz?';
      case 'ar': return 'لماذا تحول JPG إلى PNG باستخدام FileKit؟';
      default: return heading;
    }
  };

  const getSubtitle = () => {
    switch (currentLang) {
      case 'pt': return 'Construído com motores locais de última geração para máxima privacidade, velocidade e precisão.';
      case 'es': return 'Diseñado con motores locales de última generación para máxima privacidad, velocidad y precisión.';
      case 'fr': return 'Conçu avec des moteurs locaux de nouvelle génération pour la confidentialité, la vitesse et la précision.';
      case 'de': return 'Entwickelt mit lokalen Browser-Engines der nächsten Generation für Datenschutz, Geschwindigkeit und Präzision.';
      case 'it': return 'Costruito con motori locali di nuova generazione per privacy, velocità e precisione.';
      case 'tr': return 'Gizlilik, hız ve hassasiyet için yeni nesil tarayıcı içi motorlarla tasarlandı.';
      case 'ar': return 'تم تصميمه بمحركات متصفح محلية متقدمة لتوفير أقصى درجات الخصوصية والسرعة والدقة.';
      default: return 'Built with next-generation in-browser engines for privacy, speed, and precision.';
    }
  };

  const benefitTranslations: Record<string, Record<string, { title: string; text: string }>> = {
    pt: {
      'Zero Cloud Transmission': {
        title: 'Zero Transmissão em Nuvem',
        text: 'A conversão de imagem ocorre 100% no seu dispositivo. Suas fotos particulares nunca saem do seu navegador.'
      },
      'Lossless Formatting': {
        title: 'Formatação Sem Perdas',
        text: 'O formato PNG evita a perda cumulativa de qualidade em edições e exportações futuras.'
      },
      'No Software Required': {
        title: 'Nenhum Programa Necessário',
        text: 'Funciona em qualquer navegador no Windows, macOS, Linux, iOS e Android sem downloads de aplicativos.'
      }
    },
    es: {
      'Zero Cloud Transmission': {
        title: 'Cero Transmisión a la Nube',
        text: 'La conversión de imágenes se completa localmente en tu dispositivo. Tus fotos privadas nunca salen del navegador.'
      },
      'Lossless Formatting': {
        title: 'Formato Sin Pérdidas',
        text: 'El formato PNG evita la pérdida acumulativa de calidad durante futuras ediciones y exportaciones.'
      },
      'No Software Required': {
        title: 'Sin Programas Requeridos',
        text: 'Funciona en cualquier navegador en Windows, macOS, Linux, iOS y Android sin descargas.'
      }
    },
    tr: {
      'Zero Cloud Transmission': {
        title: 'Sıfır Bulut İletimi',
        text: 'Görsel dönüştürme tamamen cihazınızda yerel olarak tamamlanır. Özel fotoğraflarınız asla tarayıcınızdan çıkmaz.'
      },
      'Lossless Formatting': {
        title: 'Kayıpsız Biçimlendirme',
        text: 'PNG formatı, sonraki düzenlemeler sırasında kalite kaybını önler ve pikselleri net tutar.'
      },
      'No Software Required': {
        title: 'Yazılım Gerektirmez',
        text: 'Windows, macOS, Linux, iOS ve Android üzerinde herhangi bir tarayıcıda uygulama indirmeden çalışır.'
      }
    },
    ar: {
      'Zero Cloud Transmission': {
        title: 'معالجة محلية 100%',
        text: 'تتم معالجة تحويل الصور بالكامل على جهازك دون رفع صورك الشخصية إلى أي خوادم سحابية.'
      },
      'Lossless Formatting': {
        title: 'جودة بدون فقدان',
        text: 'تنسيق PNG يحافظ على دقة الألوان ويمنع تدهور الجودة عند التعديل وإعادة الحفظ.'
      },
      'No Software Required': {
        title: 'بدون برامج أو تطبيقات',
        text: 'يعمل بسلاسة على أي متصفح في Windows وmacOS وLinux وiOS وAndroid مباشرة.'
      }
    }
  };

  return (
    <section className="my-16 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
      <div className="space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-1">
          {getTag()}
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          {getHeading()}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          {getSubtitle()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {benefits.map((card, idx) => {
          const trans = benefitTranslations[currentLang]?.[card.title];
          const cardTitle = trans ? trans.title : card.title;
          const cardText = trans ? trans.text : card.text;

          return (
            <div
              key={idx}
              className="group relative bg-[#f8faf9] border border-slate-200/90 rounded-2xl p-6 flex flex-col space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#eaf5ef] border border-emerald-100/80 flex items-center justify-center p-3.5 group-hover:bg-[#dcf0e5] transition-colors duration-300">
                <FileKitAsset
                  name={card.iconAsset as any}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                  alt={cardTitle}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                  {cardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {cardText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
