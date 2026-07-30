import React from 'react';

interface ToolAnswerBlockProps {
  directAnswer: string;
  processingDisclosure: string;
}

export const ToolAnswerBlock: React.FC<ToolAnswerBlockProps> = ({
  directAnswer,
  processingDisclosure,
}) => {
  return (
    <div className="relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-2xl group text-left my-8 space-y-4 overflow-hidden">
      {/* Header Pill Badge */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Direct Answer &amp; Overview</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400 tracking-widest uppercase font-semibold">
          AEO Verified
        </span>
      </div>

      {/* Direct Answer Copy */}
      <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-sans font-medium">
        {directAnswer}
      </p>

      {/* Local Processing Disclosure Seal */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs sm:text-sm font-mono text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 px-4.5 py-3 rounded-2xl font-semibold">
        <svg className="w-4 h-4 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="line-clamp-1">{processingDisclosure}</span>
      </div>
    </div>
  );
};
