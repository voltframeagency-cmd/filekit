"use client";

import React from "react";
import { HowToStep } from "@/config/seo/toolFaqs";

interface HowToStepSectionProps {
  toolTitle: string;
  steps: HowToStep[];
}

export function HowToStepSection({ toolTitle, steps }: HowToStepSectionProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section
      aria-labelledby="howto-heading"
      className="w-full max-w-4xl mx-auto my-8 p-6 bg-white border border-fk-border rounded-fk-xl shadow-xs space-y-6"
      itemScope
      itemType="https://schema.org/HowTo"
    >
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Quick Guide
        </span>
        <h2 id="howto-heading" className="text-xl font-bold text-slate-800" itemProp="name">
          How to Use {toolTitle} in 3 Simple Steps
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            id={`step-${idx + 1}`}
            className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col space-y-2 relative"
            itemScope
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs">
                {idx + 1}
              </span>
              <h3 className="text-sm font-bold text-slate-800" itemProp="name">
                {step.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed" itemProp="text">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
