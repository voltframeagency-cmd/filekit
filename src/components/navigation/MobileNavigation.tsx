"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";
import FileKitLogo from "../common/FileKitLogo";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileNavigation({ isOpen, onClose, triggerRef }: MobileNavigationProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>("compress");
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto-focus close button inside drawer
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  const handleLinkClick = () => {
    onClose();
    triggerRef?.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-200 overflow-y-auto"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-fk-border">
        <Link href="/" onClick={handleLinkClick} className="flex items-center">
          <FileKitLogo variant="horizontal" />
        </Link>

        <button
          type="button"
          ref={closeBtnRef}
          onClick={() => {
            onClose();
            triggerRef?.current?.focus();
          }}
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
                onClick={handleLinkClick}
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
                  {item.id === "convert" ? (
                    CONVERTER_NAVIGATION_GROUPS.map((group) => (
                      <div key={group.id} className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                          {group.compactLabel || group.label}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {group.links.map((subLink, sIdx) => {
                            const isActive = pathname === subLink.href;
                            return (
                              <Link
                                key={sIdx}
                                href={subLink.href}
                                onClick={handleLinkClick}
                                aria-current={isActive ? "page" : undefined}
                                className={`text-[13px] font-bold py-1 ${
                                  isActive ? "text-fk-primary" : "text-fk-text"
                                }`}
                              >
                                {"\u2066"}{subLink.label}{"\u2069"}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    item.megaMenu.groups.map((group, gIdx) => (
                      <div key={gIdx} className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                          {group.title}
                        </span>

                        {group.primaryLink && (
                          <Link
                            href={group.primaryLink.href}
                            onClick={handleLinkClick}
                            aria-current={pathname === group.primaryLink.href ? "page" : undefined}
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
                            onClick={handleLinkClick}
                            aria-current={pathname === group.secondaryLink.href ? "page" : undefined}
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
                              {sg.items.map((subItem, iIdx) => {
                                const isActive = pathname === subItem.href;
                                return (
                                  <Link
                                    key={iIdx}
                                    href={subItem.href}
                                    onClick={handleLinkClick}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`px-3 py-2 rounded-fk-md text-[12px] font-bold text-center border ${
                                      isActive
                                        ? "bg-fk-primary text-white border-fk-primary"
                                        : "bg-fk-surface-muted text-fk-text border-fk-border"
                                    }`}
                                  >
                                    {"\u2066"}{subItem.label}{"\u2069"}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
