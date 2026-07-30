import React from 'react';
import { FileKitAsset } from '@/components/visuals/FileKitAsset';
import { HowToStep } from '@/lib/seo/contentRegistry';

interface ToolHowToSectionProps {
  h1Title: string;
  steps: HowToStep[];
}

const pngMockupMap: Record<string, string> = {
  'step-upload': '/brand-assets/how-it-works/step-1-upload.png',
  'step-1-upload': '/brand-assets/how-it-works/step-1-upload.png',
  'step-process': '/brand-assets/how-it-works/step-2-changes.png',
  'step-2-changes': '/brand-assets/how-it-works/step-2-changes.png',
  'step-2-convert': '/brand-assets/how-it-works/step-2-convert.png',
  'step-2-compress': '/brand-assets/how-it-works/step-2-compress.png',
  'step-download': '/brand-assets/how-it-works/step-3-download.png',
  'step-3-download': '/brand-assets/how-it-works/step-3-download.png',
};

export const ToolHowToSection: React.FC<ToolHowToSectionProps> = ({
  h1Title,
  steps,
}) => {
  const lowerH1 = h1Title.toLowerCase();
  const isConvertRoute = lowerH1.includes('convert') || lowerH1.includes(' to ');
  const isCompressRoute = lowerH1.includes('compress');

  return (
    <section className="my-16 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
      <div className="space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Start In 3 Easy Steps
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          Follow these quick steps to process your files securely with FileKit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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
              <div className="w-full h-52 sm:h-56 bg-[#eaf5ef] border-b border-emerald-100/60 p-4 sm:p-5 flex items-center justify-center relative overflow-hidden">
                {pngPath ? (
                  <img
                    src={pngPath}
                    alt={step.title}
                    className="w-full h-full object-contain filter drop-shadow-sm rounded-lg group-hover:scale-102 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
                    <FileKitAsset
                      name={step.iconAsset as any}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      alt={step.title}
                    />
                  </div>
                )}
              </div>

              <div className="p-6 space-y-2 bg-white flex-1 flex flex-col justify-start">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                  {stepTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {step.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
