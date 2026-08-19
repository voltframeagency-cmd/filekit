"use client";

import React, { useState } from "react";
import { FaqItem } from "@/config/seo/toolFaqs";

interface AeoFaqSectionProps {
  toolTitle: string;
  faqs: FaqItem[];
}

export function AeoFaqSection({ toolTitle, faqs }: AeoFaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="faq-heading"
      className="w-full max-w-4xl mx-auto my-8 p-6 bg-white border border-fk-border rounded-fk-xl shadow-xs space-y-6"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Frequently Asked Questions
        </span>
        <h2 id="faq-heading" className="text-xl font-bold text-slate-800">
          Got Questions About {toolTitle}?
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-bold text-slate-800" itemProp="name">
                  {faq.question}
                </span>
                <span className="text-xs text-slate-400 font-bold transform transition-transform duration-200">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-5 py-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p itemProp="text">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
