"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNavItem, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";

export interface DesktopMegaMenuProps {
  navItem: TopNavItem;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  initialFocus?: "FIRST" | "LAST";
}

// Clean vector SVG icon renderer for mega-menu links (No raw emojis!)
const NavItemIcon: React.FC<{ href: string; className?: string }> = ({ href, className = "w-5 h-5" }) => {
  if (href.includes("pdf-to-image") || href.includes("pdf-to-jpg") || href.includes("pdf-to-png")) {
    return (
      <svg className={`${className} text-emerald-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (href.includes("image-to-pdf") || href.includes("jpg-to-pdf") || href.includes("png-to-pdf")) {
    return (
      <svg className={`${className} text-red-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  if (href.includes("compress")) {
    return (
      <svg className={`${className} text-blue-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  }
  if (href.includes("merge")) {
    return (
      <svg className={`${className} text-indigo-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    );
  }
  if (href.includes("split")) {
    return (
      <svg className={`${className} text-purple-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
      </svg>
    );
  }
  if (href.includes("rotate")) {
    return (
      <svg className={`${className} text-amber-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  }
  if (href.includes("delete")) {
    return (
      <svg className={`${className} text-rose-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    );
  }
  if (href.includes("watermark")) {
    return (
      <svg className={`${className} text-teal-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zm0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
      </svg>
    );
  }
  // Default convert refresh icon
  return (
    <svg className={`${className} text-blue-600 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
};

export default function DesktopMegaMenu({
  navItem,
  isOpen,
  onClose,
  triggerRef,
  initialFocus
}: DesktopMegaMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const megaMenu = navItem.megaMenu;

  useEffect(() => {
    if (!isOpen || (!megaMenu && navItem.id !== "convert")) return;

    if (initialFocus) {
      setTimeout(() => {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
        if (links && links.length > 0) {
          if (initialFocus === "FIRST") {
            links[0].focus();
          } else if (initialFocus === "LAST") {
            links[links.length - 1].focus();
          }
        }
      }, 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (!menuRef.current) return;
      const links = Array.from(menuRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"));
      if (links.length === 0) return;

      const activeIndex = links.findIndex((link) => link === document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (activeIndex === -1 || activeIndex === links.length - 1) {
          links[0].focus();
        } else {
          links[activeIndex + 1].focus();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (activeIndex === -1 || activeIndex === 0) {
          links[links.length - 1].focus();
        } else {
          links[activeIndex - 1].focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }

      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef, megaMenu, navItem.id, initialFocus]);

  if (!isOpen) return null;

  // Render ZenDocs / Smallpdf style mega-menu for Convert
  if (navItem.id === "convert") {
    return (
      <div
        id="convert-menu"
        ref={menuRef}
        role="region"
        aria-label="Convert Tools"
        className="absolute top-full ltr:left-0 rtl:right-0 mt-3 w-[660px] bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="grid grid-cols-3 gap-6">
          {CONVERTER_NAVIGATION_GROUPS.map((group) => (
            <div key={group.id} className="flex flex-col gap-2.5">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {group.label}
              </span>
              <div className="flex flex-col gap-1">
                {group.links.map((link, lIdx) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={lIdx}
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`px-3 py-2 text-[13px] font-bold rounded-xl transition-all flex items-center gap-2.5 ${
                        isActive
                          ? "text-blue-600 bg-blue-50 font-bold border border-blue-100"
                          : "text-slate-800 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <NavItemIcon href={link.href} className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id={megaMenu?.id || "mega-menu"}
      ref={menuRef}
      role="region"
      aria-label={megaMenu?.label || "Mega Menu"}
      className="absolute top-full ltr:left-0 rtl:right-0 mt-3 w-[580px] bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="grid grid-cols-2 gap-7">
        {megaMenu?.groups?.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {group.title}
            </span>

            {/* Primary Tool Link */}
            {group.primaryLink && (
              <Link
                href={group.primaryLink.href}
                onClick={onClose}
                aria-current={pathname === group.primaryLink.href ? "page" : undefined}
                className={`flex flex-col p-3 rounded-xl border transition-all ${
                  pathname === group.primaryLink.href
                    ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                    : "bg-slate-50/60 border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <NavItemIcon href={group.primaryLink.href} className="w-5 h-5" />
                  <span className="text-[14px] font-extrabold text-slate-900">{group.primaryLink.label}</span>
                </div>
                <span className="text-[12px] text-slate-500 font-normal mt-1 leading-snug">
                  {group.title === "IMAGE"
                    ? "Optimize JPEGs, PNGs, and WebPs locally"
                    : "Shrink PDFs below 2 MB in browser"}
                </span>
              </Link>
            )}

            {/* Secondary Tool Link */}
            {group.secondaryLink && (
              <Link
                href={group.secondaryLink.href}
                onClick={onClose}
                aria-current={pathname === group.secondaryLink.href ? "page" : undefined}
                className={`px-3 py-2 text-[13px] font-bold rounded-xl transition-all flex items-center gap-2.5 ${
                  pathname === group.secondaryLink.href
                    ? "text-blue-600 bg-blue-50 border border-blue-100"
                    : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                <NavItemIcon href={group.secondaryLink.href} className="w-4 h-4" />
                <span>{group.secondaryLink.label}</span>
              </Link>
            )}

            {/* Subgroups (Popular Target Sizes / Page Editing) */}
            {group.subgroups?.map((sg, sIdx) => (
              <div key={sIdx} className="flex flex-col gap-2 mt-1 pt-3 border-t border-slate-100">
                {sg.label && (
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {sg.label}
                  </span>
                )}
                <div className="grid grid-cols-2 gap-1.5">
                  {sg.items.map((item, iIdx) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={iIdx}
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-2 ${
                          isActive
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50"
                        }`}
                      >
                        <NavItemIcon href={item.href} className={`w-3.5 h-3.5 ${isActive ? "text-white" : ""}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
