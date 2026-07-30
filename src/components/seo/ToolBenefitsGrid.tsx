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
  return (
    <section className="my-16 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
      <div className="space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-1">
          Proof-Based Performance
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          {heading}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          Built with next-generation in-browser engines for privacy, speed, and precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {benefits.map((card, idx) => (
          <div
            key={idx}
            className="group relative bg-[#f8faf9] border border-slate-200/90 rounded-2xl p-6 flex flex-col space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#eaf5ef] border border-emerald-100/80 flex items-center justify-center p-3.5 group-hover:bg-[#dcf0e5] transition-colors duration-300">
              <FileKitAsset
                name={card.iconAsset as any}
                className="w-full h-full object-contain filter drop-shadow-sm"
                alt={card.title}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {card.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
