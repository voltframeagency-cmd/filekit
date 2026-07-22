"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION } from "@/config/navigation";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>("compress");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-200 overflow-y-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-fk-border">
        <Link href="/" onClick={onClose} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-fk-md bg-fk-primary flex items-center justify-center text-white font-black text-sm">
            FK
          </div>
          <span className="font-black text-lg text-fk-text tracking-tight">FileKit</span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2 text-fk-text-muted hover:text-fk-text rounded-fk-md focus:outline-none focus:ring-2 focus:ring-fk-primary"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Accordion Content */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {MAIN_NAVIGATION.map((item) => {
          if (!item.megaMenu) {
            return (
              <Link
                key={item.id}
                href={item.href || "/"}
                onClick={onClose}
                className="text-[16px] font-bold text-fk-text py-2 border-b border-fk-border"
              >
                {item.label}
              </Link>
            );
          }

          const isExpanded = openAccordion === item.id;

          return (
            <div key={item.id} className="flex flex-col border-b border-fk-border pb-4">
              <button
                type="button"
                onClick={() => setOpenAccordion(isExpanded ? null : item.id)}
                aria-expanded={isExpanded}
                className="flex items-center justify-between text-[16px] font-bold text-fk-text py-2 text-left ltr:text-left rtl:text-right"
              >
                <span>{item.label}</span>
                <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="flex flex-col gap-6 mt-3 ltr:pl-4 rtl:pr-4 border-l-2 ltr:border-l-fk-primary rtl:border-r-2 rtl:border-r-fk-primary rtl:border-l-0">
                  {item.megaMenu.groups.map((group, gIdx) => (
                    <div key={gIdx} className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                        {group.title}
                      </span>

                      {group.primaryLink && (
                        <Link
                          href={group.primaryLink.href}
                          onClick={onClose}
                          className={`text-[14px] font-bold py-1 ${
                            pathname === group.primaryLink.href ? "text-fk-primary" : "text-fk-text"
                          }`}
                        >
                          {group.primaryLink.label}
                        </Link>
                      )}

                      {group.secondaryLink && (
                        <Link
                          href={group.secondaryLink.href}
                          onClick={onClose}
                          className={`text-[13px] font-medium py-1 ${
                            pathname === group.secondaryLink.href ? "text-fk-primary" : "text-fk-text-muted"
                          }`}
                        >
                          {group.secondaryLink.label}
                        </Link>
                      )}

                      {group.subgroups?.map((sg, sIdx) => (
                        <div key={sIdx} className="flex flex-col gap-2 mt-2">
                          <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                            {sg.label}
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {sg.items.map((subItem, iIdx) => (
                              <Link
                                key={iIdx}
                                href={subItem.href}
                                onClick={onClose}
                                className={`px-3 py-2 rounded-fk-md text-[12px] font-bold text-center border ${
                                  pathname === subItem.href
                                    ? "bg-fk-primary text-white border-fk-primary"
                                    : "bg-fk-surface-muted text-fk-text border-fk-border"
                                }`}
                              >
                                {"\u2066"}{subItem.label}{"\u2069"}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
