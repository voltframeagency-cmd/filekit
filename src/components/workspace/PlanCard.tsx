"use client";

import React from "react";
import { PurchasePlan } from "@/utils/engine/types";

interface PlanCardProps {
  plan: PurchasePlan;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-4 border rounded-fk-xl transition-all duration-150 text-left ltr:text-left rtl:text-right cursor-pointer min-h-[72px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:ring-offset-2 ${
        isSelected
          ? "border-fk-primary bg-fk-primary/[0.02] shadow-sm"
          : "border-fk-border hover:border-fk-border-strong bg-white hover:bg-fk-surface-muted/50"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-4 rtl:pr-0 rtl:pl-4">
        {/* Visible Radio Circle */}
        <div className={`relative flex items-center justify-center shrink-0 w-[18px] h-[18px] rounded-full border transition-all bg-white ${
          isSelected ? "border-fk-primary" : "border-fk-border"
        }`}>
          {isSelected && (
            <div className="w-[10px] h-[10px] rounded-full bg-fk-primary animate-in zoom-in-50 duration-100" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-black text-fk-text leading-tight">
              {plan.name}
            </span>
            {plan.badge && (
              <span className="px-2 py-0.5 rounded-full bg-fk-server-bg border border-[#BFDBFE] text-fk-server text-[9px] font-bold uppercase tracking-wider select-none">
                {plan.badge}
              </span>
            )}
          </div>
          <span className="text-[11px] text-fk-text-subtle mt-0.5">
            {plan.tagline}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 text-right rtl:text-left pl-2 rtl:pl-0 rtl:pr-2">
        <span className="text-[15px] font-black text-fk-text leading-none font-mono">
          <bdi>{plan.price}</bdi>
        </span>
        <span className="text-[9px] text-fk-text-subtle mt-1 font-semibold uppercase tracking-wide">
          {plan.renewalLanguage}
        </span>
      </div>
    </button>
  );
}
