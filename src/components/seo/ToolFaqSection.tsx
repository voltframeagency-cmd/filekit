'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/lib/seo/contentRegistry';

interface ToolFaqSectionProps {
  faqs: FaqItem[];
  toolName: string;
}

export const ToolFaqSection: React.FC<ToolFaqSectionProps> = ({
  faqs,
  toolName,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="my-16 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
      <div className="space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full inline-block mb-1">
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Questions About {toolName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          Everything you need to know about processing files safely with FileKit.
        </p>
      </div>

      <div className="space-y-4 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-[#f8faf9] ${
                isOpen
                  ? 'border-blue-300 shadow-md ring-2 ring-blue-50/80 bg-white'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base font-sans hover:text-blue-700 focus:outline-none transition-colors"
              >
                <span className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100/80 border border-blue-200/80 text-blue-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    Q
                  </span>
                  <span className="font-sans font-bold">{faq.question}</span>
                </span>

                <span
                  className={`w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-blue-700 border-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-slate-600 border-t border-slate-100 pt-4 leading-relaxed font-sans bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
