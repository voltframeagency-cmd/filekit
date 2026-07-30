import React from 'react';
import Link from 'next/link';
import { toolContentRegistry } from '@/lib/seo/contentRegistry';
import { ToolAnswerBlock } from './ToolAnswerBlock';
import { ToolHowToSection } from './ToolHowToSection';
import { ToolBenefitsGrid } from './ToolBenefitsGrid';
import { ToolFaqSection } from './ToolFaqSection';
import { ToolSeoSchema } from './ToolSeoSchema';

interface ToolContentRendererProps {
  operationId: string;
}

export const ToolContentRenderer: React.FC<ToolContentRendererProps> = ({
  operationId,
}) => {
  const record = toolContentRegistry[operationId];

  if (!record || !record.indexable) {
    return null;
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 mt-12 space-y-16">
      {/* 1. Schema Graph */}
      <ToolSeoSchema record={record} />

      {/* 2. Direct Answer Block */}
      <ToolAnswerBlock
        directAnswer={record.directAnswer}
        processingDisclosure={record.processingDisclosure}
      />

      {/* 3. 3-Step How-To Section */}
      {record.howToSteps && record.howToSteps.length > 0 && (
        <ToolHowToSection h1Title={record.h1} steps={record.howToSteps} />
      )}

      {/* 4. Proof-Based Benefits Grid */}
      {record.benefits && record.benefits.length > 0 && (
        <ToolBenefitsGrid
          heading={record.benefitsHeading || `Why Use FileKit for ${record.h1}?`}
          benefits={record.benefits}
        />
      )}

      {/* 5. Engine Verification & Technical Limitations Card */}
      <section className="relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 text-left space-y-4 shadow-2xl overflow-hidden group">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Engine Verification &amp; Technical Limitations</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400 tracking-widest uppercase font-semibold">
            Property Verified
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-sans font-medium pt-1">
          {record.verificationMethod}
        </p>

        {record.limitations && record.limitations.length > 0 && (
          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Document Scope &amp; Edge Cases:
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-sans">
              {record.limitations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-mono text-xs select-none">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 6. FAQ Section */}
      {record.faqs && record.faqs.length > 0 && (
        <ToolFaqSection faqs={record.faqs} toolName={record.h1} />
      )}

      {/* 7. Related Tools Navigation */}
      {record.relatedTools && record.relatedTools.length > 0 && (
        <section className="my-16 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 text-left space-y-5 shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-1">
              Workflow Next Steps
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans">
              Explore Related File Utilities
            </h3>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {record.relatedTools.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="group text-xs font-mono bg-[#f8faf9] border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all duration-300 flex items-center gap-2 shadow-sm font-semibold"
              >
                <span>{link.name}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-blue-600">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
