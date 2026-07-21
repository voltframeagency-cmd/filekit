"use client";

import React, { useState } from "react";

export type QualityPriority = "SHARPER" | "BALANCED" | "SMALLER_FILE";

interface QualityPriorityControlProps {
  value?: QualityPriority;
  onChange?: (value: QualityPriority) => void;
}

export default function QualityPriorityControl({
  value = "BALANCED",
  onChange
}: QualityPriorityControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState<QualityPriority>(value);

  const options: Array<{ id: QualityPriority; label: string; description: string }> = [
    {
      id: "SHARPER",
      label: "Sharper",
      description: "Preserves higher visual fidelity and fine text detail"
    },
    {
      id: "BALANCED",
      label: "Balanced",
      description: "Recommended balance of file reduction and visual clarity"
    },
    {
      id: "SMALLER_FILE",
      label: "Smaller File",
      description: "Applies stronger compression for maximum byte reduction"
    }
  ];

  const handleSelect = (priority: QualityPriority) => {
    setSelected(priority);
    if (onChange) {
      onChange(priority);
    }
  };

  const currentOpt = options.find((o) => o.id === selected) || options[1];

  return (
    <div className="w-full text-left ltr:text-left rtl:text-right border border-fk-border rounded-fk-md bg-white overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-fk-surface-muted transition-colors focus-visible:outline-none"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-fk-text-muted">Quality Priority:</span>
          <span className="text-[14px] font-bold text-fk-primary">{currentOpt.label}</span>
        </div>
        <div className="flex items-center gap-1 text-[12px] font-medium text-fk-text-muted">
          <span>{isExpanded ? "Hide" : "Adjust"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-fk-border bg-fk-surface-muted/50 flex flex-col gap-2 animate-in fade-in duration-100">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left ltr:text-left rtl:text-right p-3 rounded-fk-md border transition-all ${
                selected === opt.id
                  ? "border-fk-primary bg-white shadow-sm"
                  : "border-transparent hover:bg-white/80"
              }`}
            >
              <div className="text-[13px] font-bold text-fk-text">{opt.label}</div>
              <div className="text-[12px] text-fk-text-muted mt-0.5">{opt.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
